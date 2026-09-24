"use client";

import { ATTENTION_CURVE, MARKERS, activationColor, timeAtIndex } from "@/lib/activation";
import { cn } from "@/lib/utils";

type Props = {
  index: number;
  onIndex: (i: number) => void;
  id?: string;
};

export function AttentionTimeline({ index, onIndex, id = "attention-timeline" }: Props) {
  function setFromClientX(clientX: number, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onIndex(Math.round(t * (ATTENTION_CURVE.length - 1)));
  }

  return (
    <div className="w-full">
      <div
        id={id}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={ATTENTION_CURVE.length - 1}
        aria-valuenow={index}
        aria-valuetext={`${MARKERS.find((m) => m.index === index)?.label ?? "Attention"} at ${timeAtIndex(index)}`}
        aria-label="Attention timeline. Use arrow keys to scrub."
        className="flex h-14 cursor-pointer items-end justify-between gap-px"
        onPointerDown={(e) => {
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX, el);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            setFromClientX(e.clientX, e.currentTarget);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onIndex(Math.min(ATTENTION_CURVE.length - 1, index + 1));
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onIndex(Math.max(0, index - 1));
          }
          if (e.key === "Home") {
            e.preventDefault();
            onIndex(0);
          }
          if (e.key === "End") {
            e.preventDefault();
            onIndex(ATTENTION_CURVE.length - 1);
          }
        }}
      >
        {ATTENTION_CURVE.map((v, i) => (
          <span
            key={i}
            className={cn(
              "w-full rounded-[1px] origin-bottom",
              i === index ? "opacity-100" : "opacity-80",
            )}
            style={{
              height: `${18 + v * 82}%`,
              backgroundColor: activationColor(v),
            }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--graphite)]">
        {MARKERS.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              className={cn(
                "underline-offset-4 hover:underline",
                index === m.index && "text-foreground",
              )}
              onClick={() => onIndex(m.index)}
            >
              {m.label} · {m.time}
            </button>
          </li>
        ))}
      </ul>
      <p className="sr-only">
        Sample attention moments: Attention peaks at 0:07, Attention drops at 0:13,
        Re-engagement at 0:18. Sample report, illustrative data.
      </p>
    </div>
  );
}
