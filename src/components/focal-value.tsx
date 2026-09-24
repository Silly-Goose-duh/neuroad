"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const DURATION_MS = 900;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function fractionDigits(target: number): number {
  if (!Number.isFinite(target) || Number.isInteger(target)) return 0;
  const fraction = target.toString().split(".")[1];
  return fraction?.length ?? 0;
}

function formatCount(current: number, target: number): string {
  const digits = fractionDigits(target);
  if (digits === 0) return String(Math.round(current));
  return current.toFixed(digits);
}

export function FocalValue({
  value,
  label,
  suffix,
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false,
  );
  const [tracked, setTracked] = useState(value);
  const [current, setCurrent] = useState(0);

  if (tracked !== value) {
    setTracked(value);
    setCurrent(0);
  }

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver((entries) => {
      if (started || !entries.some((entry) => entry.isIntersecting)) return;
      started = true;
      observer.disconnect();

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / DURATION_MS);
        setCurrent(progress >= 1 ? value : value * progress);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced, value]);

  const shown = reduced ? value : current;

  return (
    <span ref={rootRef} className="focal-value">
      <span className="tabular">
        {formatCount(shown, value)}
        {suffix}
      </span>
      <small>{label}</small>
    </span>
  );
}
