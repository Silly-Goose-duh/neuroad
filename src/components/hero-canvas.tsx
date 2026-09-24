"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  type Material,
} from "three";

const RAMP = ["#3B1F8E", "#C0267E", "#F26A1B", "#FFC23D"] as const;
const PARTICLE_COUNT = 1200;

function subscribeReducedMotion(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
  };
}

function reducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function reducedMotionServerSnapshot(): boolean {
  return false;
}

const contextListeners = new Set<() => void>();
let contextFailed = false;

function subscribeContextFailed(onChange: () => void): () => void {
  contextListeners.add(onChange);
  return () => {
    contextListeners.delete(onChange);
  };
}

function contextFailedSnapshot(): boolean {
  return contextFailed;
}

function contextFailedServerSnapshot(): boolean {
  return false;
}

function markContextFailed(): void {
  if (contextFailed) return;
  contextFailed = true;
  for (const listener of contextListeners) listener();
}

function scrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function writeRamp(
  stops: readonly Color[],
  t: number,
  out: Float32Array,
  offset: number,
  scratch: Color,
): void {
  const scaled = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(scaled));
  scratch.copy(stops[index]).lerp(stops[index + 1], scaled - index);
  out[offset] = scratch.r;
  out[offset + 1] = scratch.g;
  out[offset + 2] = scratch.b;
}

type Lobe = {
  hex: (typeof RAMP)[number];
  radius: number;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  intensity: number;
};

const LOBES: readonly Lobe[] = [
  {
    hex: "#3B1F8E",
    radius: 1,
    position: [-0.48, 0.16, 0],
    scale: [0.76, 1.05, 0.84],
    rotation: [0.04, 0.18, 0.1],
    intensity: 1.65,
  },
  {
    hex: "#C0267E",
    radius: 1,
    position: [0.48, 0.16, 0],
    scale: [0.76, 1.05, 0.84],
    rotation: [0.04, -0.18, -0.1],
    intensity: 1.25,
  },
  {
    hex: "#F26A1B",
    radius: 0.56,
    position: [0, -0.8, 0.06],
    scale: [1.12, 0.68, 0.9],
    rotation: [0.12, 0, 0],
    intensity: 1.05,
  },
  {
    hex: "#FFC23D",
    radius: 0.22,
    position: [0.08, 0.62, 0.52],
    scale: [1.05, 0.72, 0.68],
    rotation: [0.2, 0.1, 0],
    intensity: 0.95,
  },
];

export function HeroCanvas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    reducedMotionServerSnapshot,
  );
  const contextFailed = useSyncExternalStore(
    subscribeContextFailed,
    contextFailedSnapshot,
    contextFailedServerSnapshot,
  );

  useEffect(() => {
    if (reduced || contextFailed) return;
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch {
      markContextFailed();
      return;
    }

    const canvas = renderer.domElement;
    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];
    let frame = 0;
    let observer: ResizeObserver | undefined;

    let progress = scrollProgress();
    const onScroll = () => {
      progress = scrollProgress();
    };

    const cleanup = () => {
      cancelAnimationFrame(frame);
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      renderer.dispose();
      canvas.remove();
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };

    try {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      host.appendChild(canvas);

      const scene = new Scene();
      scene.background = null;
      const camera = new PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(0, 0.06, 4.15);
      camera.lookAt(0, 0, 0);

      const ambient = new AmbientLight("#f4f1ff", 0.62);
      const warm = new PointLight("#FFC23D", 16, 0, 2);
      warm.position.set(1.5, 1.15, 2.5);
      scene.add(ambient, warm);

      const root = new Group();
      scene.add(root);
      const brain = new Group();
      root.add(brain);

      for (const lobe of LOBES) {
        const geometry = new SphereGeometry(lobe.radius, 48, 32);
        const material = new MeshStandardMaterial({
          color: lobe.hex,
          emissive: lobe.hex,
          emissiveIntensity: lobe.intensity,
          roughness: 0.34,
          metalness: 0.05,
        });
        geometries.push(geometry);
        materials.push(material);
        const mesh = new Mesh(geometry, material);
        mesh.position.set(lobe.position[0], lobe.position[1], lobe.position[2]);
        mesh.scale.set(lobe.scale[0], lobe.scale[1], lobe.scale[2]);
        mesh.rotation.set(lobe.rotation[0], lobe.rotation[1], lobe.rotation[2]);
        brain.add(mesh);
      }

      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const stops = RAMP.map((hex) => new Color(hex));
      const scratch = new Color();

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 1.15 + Math.random() ** 0.55 * 1.35;
        const x = Math.sin(phi) * Math.cos(theta) * radius * 1.08;
        const y = Math.cos(phi) * radius * 0.92;
        const z = Math.sin(phi) * Math.sin(theta) * radius * 0.78;
        const offset = i * 3;
        positions[offset] = x;
        positions[offset + 1] = y;
        positions[offset + 2] = z;
        const t = Math.min(
          1,
          Math.max(0, ((y + 2.2) / 4.4) * 0.72 + Math.random() * 0.28),
        );
        writeRamp(stops, t, colors, offset, scratch);
      }

      const fieldGeometry = new BufferGeometry();
      fieldGeometry.setAttribute("position", new BufferAttribute(positions, 3));
      fieldGeometry.setAttribute("color", new BufferAttribute(colors, 3));
      geometries.push(fieldGeometry);

      const pointsMaterial = new PointsMaterial({
        size: 0.085,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        vertexColors: true,
        opacity: 0.82,
      });
      pointsMaterial.premultipliedAlpha = true;
      materials.push(pointsMaterial);

      const field = new Points(fieldGeometry, pointsMaterial);
      root.add(field);

      const resize = () => {
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (width === 0 || height === 0) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(width, height, false);
      };

      observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();

      window.addEventListener("scroll", onScroll, { passive: true });

      const started = performance.now();
      const tick = (now: number) => {
        const elapsed = (now - started) * 0.001;
        progress = scrollProgress();
        root.rotation.y = 0.42 + elapsed * 0.12 + progress * Math.PI * 0.9;
        root.rotation.x = 0.06 + progress * 0.38;
        brain.rotation.y = elapsed * 0.05;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    } catch {
      cleanup();
      markContextFailed();
      return;
    }

    return cleanup;
  }, [reduced, contextFailed]);

  if (reduced || contextFailed) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
    />
  );
}
