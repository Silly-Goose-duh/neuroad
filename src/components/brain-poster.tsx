export function BrainPoster() {
  return (
    <svg
      viewBox="0 0 320 320"
      className="mx-auto h-[280px] w-[280px]"
      role="img"
      aria-label="Greyscale brain with heat regions. Sample report, illustrative data."
    >
      <ellipse cx="160" cy="160" rx="110" ry="130" fill="#2a2e38" />
      <ellipse cx="118" cy="150" rx="48" ry="70" fill="#3a3f4b" />
      <ellipse cx="204" cy="150" rx="48" ry="70" fill="#3a3f4b" />
      <ellipse cx="160" cy="210" rx="40" ry="36" fill="#323640" />
      <ellipse
        cx="132"
        cy="120"
        rx="28"
        ry="22"
        fill="var(--signal-high)"
        opacity="0.85"
      />
      <ellipse
        cx="198"
        cy="168"
        rx="22"
        ry="18"
        fill="var(--signal-mid)"
        opacity="0.75"
      />
      <ellipse
        cx="160"
        cy="88"
        rx="16"
        ry="12"
        fill="var(--signal-peak)"
        opacity="0.9"
      />
    </svg>
  );
}
