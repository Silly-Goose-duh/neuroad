"use client";

import { useState } from "react";
import { ATTENTION_CURVE, SAMPLE_SIGNALS, activationColor } from "@/lib/activation";

export function SampleReport() {
  const [tab, setTab] = useState<"works" | "improve">("works");

  return (
    <section id="report" className="section-pad" aria-labelledby="report-heading">
      <div className="page-wrap">
        <h2 id="report-heading">A report you can act on the same day.</h2>
        <p className="mt-6 text-[var(--graphite)]">
          Every analysis ends in plain-language insights, not just numbers.
        </p>
        <figure className="mt-12 overflow-hidden rounded-[16px] border border-[var(--hairline)] bg-white p-6 md:p-10 frame-shadow">
          <figcaption className="text-sm text-[var(--graphite)]">
            Sample report · illustrative data
          </figcaption>
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm text-[var(--graphite)]">Overall score</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-6xl tabular leading-none">
                82
                <span className="text-2xl text-[var(--graphite)]">/100</span>
              </p>
            </div>
            <div className="lg:col-span-8">
              <p className="text-sm text-[var(--graphite)]">Attention map</p>
              <div className="mt-3 flex h-16 items-end gap-px">
                {ATTENTION_CURVE.map((v, i) => (
                  <span
                    key={i}
                    className="w-full rounded-[1px]"
                    style={{
                      height: `${20 + v * 80}%`,
                      backgroundColor: activationColor(v),
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-[var(--graphite)]">
                Peaks 0:07 · Drops 0:13 · Re-engagement 0:18
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-sm text-[var(--graphite)]">Signal breakdown</p>
            <ul className="mt-4 space-y-3">
              {SAMPLE_SIGNALS.map((s) => (
                <li key={s.name} className="grid grid-cols-[1fr_auto] items-center gap-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="tabular text-[var(--graphite)]">{s.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-[#d5d8df]">
                      <div
                        className="h-full"
                        style={{
                          width: `${s.value}%`,
                          backgroundColor: activationColor(s.value / 100),
                        }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <div className="flex gap-6 border-b border-[var(--hairline)]">
              <button
                type="button"
                className={`pb-2 text-sm ${tab === "works" ? "border-b-2 border-[var(--ink)]" : "text-[var(--graphite)]"}`}
                onClick={() => setTab("works")}
              >
                What works
              </button>
              <button
                type="button"
                className={`pb-2 text-sm ${tab === "improve" ? "border-b-2 border-[var(--ink)]" : "text-[var(--graphite)]"}`}
                onClick={() => setTab("improve")}
              >
                To improve
              </button>
            </div>
            <p className="mt-4 max-w-[62ch] text-[var(--graphite)]">
              {tab === "works"
                ? "The opening product close-up holds attention through 0:07, and the return of the logo at 0:18 brings viewers back."
                : "The mid-spot drop at 0:13 is the weakest moment. Shorten it, or move the offer before attention falls."}
            </p>
          </div>
        </figure>
        <ul className="mt-10 max-w-[62ch] space-y-2 text-[var(--graphite)]">
          <li>Peak moments show what to keep.</li>
          <li>Drops show what to cut or move.</li>
          <li>Insights say what to change and why.</li>
        </ul>
      </div>
    </section>
  );
}
