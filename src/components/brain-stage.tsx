"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { DRACOLoader, GLTFLoader } from "three-stdlib";

const RAMP = ["#3B1F8E", "#C0267E", "#F26A1B", "#FFC23D"];

function subscribeReduced(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function BrainStage() {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    const el = host.current;
    if (!el || reduced || failed) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 80);
    camera.position.set(0, 0.15, 6.4);

    scene.add(new AmbientLight(0xf7f8fa, 0.55));
    const key = new DirectionalLight(0xffc23d, 1.4);
    key.position.set(2.4, 3.2, 4);
    scene.add(key);
    const fill = new DirectionalLight(0x3b1f8e, 0.45);
    fill.position.set(-3, 1, 2);
    scene.add(fill);
    const warm = new PointLight(0xf26a1b, 6, 12);
    warm.position.set(1.2, 0.4, 2.2);
    scene.add(warm);

    const pivot = new Group();
    scene.add(pivot);

    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    let alive = true;
    loader.load(
      "/brain.glb",
      (gltf) => {
        if (!alive) return;
        const model = gltf.scene;
        const box = new Box3().setFromObject(model);
        const size = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        const scale = 3.1 / Math.max(size.x, size.y, size.z);
        model.position.sub(center);
        model.scale.setScalar(scale);

        const meshes: Mesh[] = [];
        model.traverse((obj) => {
          if (!(obj instanceof Mesh)) return;
          meshes.push(obj);
        });
        const n = Math.max(1, meshes.length - 1);
        meshes.forEach((mesh, i) => {
          const t = i / n;
          const color = new Color(RAMP[Math.min(3, Math.floor(t * 4))]);
          mesh.material = new MeshPhysicalMaterial({
            color: new Color("#d8dbe2").lerp(color, 0.22 + (t % 0.35)),
            roughness: 0.42,
            metalness: 0.04,
            clearcoat: 0.35,
            emissive: color,
            emissiveIntensity: 0.08 + (i % 5) * 0.03,
          });
        });
        pivot.add(model);
      },
      undefined,
      () => {
        if (alive) setFailed(true);
      },
    );

    let frame = 0;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    fit();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!reduced) pivot.rotation.y += 0.0024;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      draco.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reduced, failed]);

  if (reduced || failed) {
    return (
      <img
        src="/brain-still.svg"
        alt="Anatomical brain, still"
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <div
      ref={host}
      className="brain-stage h-full w-full"
      role="img"
      aria-label="Anatomical brain model, slowly turning"
    />
  );
}
