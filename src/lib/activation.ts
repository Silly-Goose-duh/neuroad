/** Fixed sample attention curve. 32 bars, ~24s of illustrative data. */
export const ATTENTION_CURVE = [
  0.22, 0.28, 0.31, 0.27, 0.24, 0.38, 0.52, 0.71, 0.86, 0.92, 0.78, 0.61, 0.44,
  0.33, 0.26, 0.21, 0.18, 0.16, 0.19, 0.28, 0.41, 0.58, 0.72, 0.81, 0.76, 0.68,
  0.55, 0.48, 0.42, 0.37, 0.33, 0.3,
] as const;

export const SAMPLE_DURATION = 24;

export const MARKERS = [
  { id: "peak", label: "Attention peaks", index: 9, time: "0:07" },
  { id: "drop", label: "Attention drops", index: 17, time: "0:13" },
  { id: "reengage", label: "Re-engagement", index: 23, time: "0:18" },
] as const;

export function timeAtIndex(index: number) {
  const t = (index / (ATTENTION_CURVE.length - 1)) * SAMPLE_DURATION;
  const m = Math.floor(t / 60);
  const s = Math.round(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/** Interpolate the activation ramp in OKLCH via CSS color-mix. */
export function activationColor(value: number) {
  const v = Math.min(1, Math.max(0, value));
  if (v < 1 / 3) {
    const p = v / (1 / 3);
    return `color-mix(in oklch, var(--signal-low) ${(1 - p) * 100}%, var(--signal-mid) ${p * 100}%)`;
  }
  if (v < 2 / 3) {
    const p = (v - 1 / 3) / (1 / 3);
    return `color-mix(in oklch, var(--signal-mid) ${(1 - p) * 100}%, var(--signal-high) ${p * 100}%)`;
  }
  const p = (v - 2 / 3) / (1 / 3);
  return `color-mix(in oklch, var(--signal-high) ${(1 - p) * 100}%, var(--signal-peak) ${p * 100}%)`;
}

export const SAMPLE_SIGNALS = [
  { name: "Audience match", value: 78 },
  { name: "Emotional impact", value: 84 },
  { name: "Attention", value: 82 },
  { name: "Memory retention", value: 71 },
  { name: "Purchase intent", value: 69 },
  { name: "Trend alignment", value: 74 },
] as const;
