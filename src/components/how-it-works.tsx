"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    title: "Upload your ad",
    body: "MP4, MOV, PNG or JPG.",
  },
  {
    title: "Describe the campaign",
    body: "Pick your objective, platform, age group and location, and choose which signals matter most.",
  },
  {
    title: "Get the prediction",
    body: "See an overall score out of 100, an attention map, and a breakdown of each signal.",
  },
  {
    title: "Fix what's weak",
    body: "A team of specialist agents explains what works, what doesn't, and suggests specific edits. Download the full report.",
  },
] as const;

function StepFrame({ step }: { step: number }) {
  return (
    <div className="rounded-[16px] border border-[var(--hairline)] bg-white p-6 frame-shadow">
      <p className="text-sm text-[var(--graphite)]">Sample report · illustrative data</p>
      {step === 0 ? (
        <div className="mt-6 flex min-h-[280px] flex-col items-start justify-center rounded-[6px] border border-dashed border-[var(--hairline)] p-8">
          <p className="font-medium">Drop an ad here</p>
          <p className="mt-2 text-sm text-[var(--graphite)]">
            MP4, MOV, PNG, JPG, JPEG
          </p>
        </div>
      ) : null}
      {step === 1 ? (
        <dl className="mt-6 grid gap-4 text-sm">
          <div className="flex justify-between border-b border-[var(--hairline)] pb-3">
            <dt className="text-[var(--graphite)]">Objective</dt>
            <dd>Brand awareness</dd>
          </div>
          <div className="flex justify-between border-b border-[var(--hairline)] pb-3">
            <dt className="text-[var(--graphite)]">Platform</dt>
            <dd>Instagram</dd>
          </div>
          <div className="flex justify-between border-b border-[var(--hairline)] pb-3">
            <dt className="text-[var(--graphite)]">Age group</dt>
            <dd>18–34</dd>
          </div>
          <div className="flex justify-between pb-1">
            <dt className="text-[var(--graphite)]">Location</dt>
            <dd>India</dd>
          </div>
        </dl>
      ) : null}
      {step === 2 ? (
        <div className="mt-6">
          <p className="font-[family-name:var(--font-display)] text-5xl tabular">
            82
            <span className="text-xl text-[var(--graphite)]">/100</span>
          </p>
          <p className="mt-2 text-sm text-[var(--graphite)]">Overall score</p>
          <div className="mt-6 h-2 overflow-hidden rounded-[6px] bg-[#d5d8df]">
            <div
              className="h-full w-[82%]"
              style={{
                background:
                  "linear-gradient(90deg, var(--signal-low), var(--signal-mid), var(--signal-high), var(--signal-peak))",
              }}
            />
          </div>
        </div>
      ) : null}
      {step === 3 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="font-medium">What works</p>
            <p className="mt-2 text-sm text-[var(--graphite)]">
              Opening product close-up holds attention through 0:07.
            </p>
          </div>
          <div>
            <p className="font-medium">To improve</p>
            <p className="mt-2 text-sm text-[var(--graphite)]">
              Cut the mid-spot drop at 0:13, or move the offer earlier.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="how-it-works"
      className="section-pad"
      aria-labelledby="how-heading"
    >
      <div className="page-wrap">
        <h2 id="how-heading">From upload to a plan in four steps.</h2>
        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <ol className="relative lg:col-span-5">
            <span
              className="absolute top-2 bottom-2 left-[7px] w-px bg-[var(--hairline)]"
              aria-hidden
            />
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative mb-12 pl-8 last:mb-0"
              >
                <span
                  className="absolute top-1.5 left-0 size-4 rounded-[2px] border border-[var(--ink)]"
                  style={{
                    background:
                      active === i
                        ? "var(--signal-high)"
                        : "var(--paper)",
                  }}
                  aria-hidden
                />
                <p className="text-sm text-[var(--graphite)]">{i + 1}</p>
                <h3 className="mt-1">{step.title}</h3>
                <p className="mt-2 text-[var(--graphite)]">{step.body}</p>
                <div className="mt-6 lg:hidden">
                  <StepFrame step={i} />
                </div>
              </li>
            ))}
          </ol>
          <div className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-24">
              <StepFrame step={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
