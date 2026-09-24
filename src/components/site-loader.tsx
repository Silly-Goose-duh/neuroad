"use client";

import { useEffect } from "react";
import { Wordmark } from "@/components/wordmark";
import { ATTENTION_CURVE, activationColor } from "@/lib/activation";

export function SiteLoader() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("neuroad-loader") === "1") {
        document.documentElement.classList.add("loader-skip");
        return;
      }
    } catch {
      /* ignore */
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("loader-skip");
      return;
    }

    const min = 900;
    const max = 2500;
    const started = performance.now();
    let finished = false;

    function end() {
      if (finished) return;
      finished = true;
      document.documentElement.classList.add("loader-done");
      try {
        sessionStorage.setItem("neuroad-loader", "1");
      } catch {
        /* ignore */
      }
    }

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const wait = fontsReady.then(() => {
      const elapsed = performance.now() - started;
      const remain = Math.max(0, min - elapsed);
      return new Promise<void>((resolve) => setTimeout(resolve, remain));
    });

    const cap = window.setTimeout(end, max);
    wait.then(end);

    return () => window.clearTimeout(cap);
  }, []);

  return (
    <div
      id="site-loader"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--paper)]"
      style={{ animationFillMode: "forwards" }}
    >
      <p className="text-2xl">
        <Wordmark />
      </p>
      <div
        className="mt-8 flex h-12 w-[240px] items-end justify-between gap-px md:w-[320px]"
        id="loader-bars"
      >
        {ATTENTION_CURVE.map((v, i) => (
          <span
            key={i}
            className="w-full origin-bottom rounded-[1px]"
            style={{
              height: `${12 + v * 88}%`,
              backgroundColor: activationColor(v),
              animation: `bar-grow 80ms linear both`,
              animationDelay: `${250 + i * 28}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
