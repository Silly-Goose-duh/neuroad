"use client";

import { useState } from "react";
import { AttentionTimeline } from "@/components/attention-timeline";
import { BrainStage } from "@/components/brain-stage";
import { FocalValue } from "@/components/focal-value";
import { HeroSecondaryCta, LaunchCta } from "@/components/launch-cta";
import { ATTENTION_CURVE, MARKERS } from "@/lib/activation";

function HeatAd({ index }: { index: number }) {
  const v = ATTENTION_CURVE[index];
  const blobA = 0.18 + v * 0.55;
  const blobB = 0.12 + (1 - v) * 0.4;
  const marker = MARKERS.find((m) => Math.abs(m.index - index) <= 1);

  return (
    <figure className="w-[148px] shrink-0">
      <div className="relative aspect-[9/16] overflow-hidden rounded-[16px] bg-[#c8cbd2] shadow-[0_24px_48px_-24px_rgba(24,27,36,.35)]">
        <svg viewBox="0 0 180 320" className="h-full w-full grayscale" aria-hidden="true">
          <rect width="180" height="320" fill="#c5c8d0" />
          <rect x="16" y="28" width="148" height="18" rx="2" fill="#9aa0ab" />
          <rect x="16" y="54" width="92" height="8" rx="2" fill="#b0b4bc" />
          <rect x="24" y="90" width="132" height="150" rx="8" fill="#8e939e" />
          <circle cx="90" cy="150" r="38" fill="#a8adb6" />
          <rect x="40" y="260" width="100" height="12" rx="2" fill="#9aa0ab" />
          <rect x="52" y="280" width="76" height="8" rx="2" fill="#b7bbc3" />
        </svg>
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: `
              radial-gradient(ellipse at 42% 38%, color-mix(in oklch, var(--signal-high) ${blobA * 100}%, transparent) 0%, transparent 42%),
              radial-gradient(ellipse at 62% 58%, color-mix(in oklch, var(--signal-mid) ${blobB * 100}%, transparent) 0%, transparent 38%),
              radial-gradient(ellipse at 50% 22%, color-mix(in oklch, var(--signal-peak) ${v * 70}%, transparent) 0%, transparent 28%)
            `,
          }}
        />
      </div>
      <figcaption className="mt-2 text-xs text-[var(--graphite)]">
        {marker ? `${marker.label} · ${marker.time}` : "Sample ad"}
      </figcaption>
    </figure>
  );
}

export function Hero() {
  const [index, setIndex] = useState<number>(MARKERS[0].index);
  const attention = Math.round(ATTENTION_CURVE[index] * 100);

  return (
    <section
      id="top"
      className="hero-wash relative min-h-[100svh] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="page-wrap grid min-h-[100svh] items-center gap-6 py-10 lg:grid-cols-12 lg:py-0">
        <div className="relative z-10 lg:col-span-6">
          <p className="text-sm text-[var(--graphite)]">NeuroAd</p>
          <h1 id="hero-heading" className="mt-4 max-w-[12ch]">
            Know how your ad lands before you publish it.
          </h1>
          <p className="mt-6 max-w-[42ch] text-[1.0625rem] text-[var(--graphite)]">
            Predicts attention, emotion, memory and purchase intent, then tells
            you exactly what to change.
          </p>
          <div className="focal-row mt-8 flex flex-wrap items-end gap-8">
            <FocalValue value={attention} label="Attention now" />
            <FocalValue value={82} label="Overall read" />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <LaunchCta location="hero" />
            <HeroSecondaryCta />
          </div>
          <div className="mt-10 flex items-end gap-6">
            <HeatAd index={index} />
            <div className="min-w-0 flex-1 pb-1">
              <AttentionTimeline index={index} onIndex={setIndex} />
            </div>
          </div>
        </div>

        <div className="relative h-[52vh] min-h-[340px] lg:col-span-6 lg:h-[88vh]">
          <BrainStage />
          <p className="pointer-events-none absolute bottom-2 right-1 text-[11px] text-[var(--graphite)]">
            Anatomical model · Z-Anatomy / BodyParts3D
          </p>
        </div>
      </div>
    </section>
  );
}
