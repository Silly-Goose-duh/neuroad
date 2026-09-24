export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-medium tracking-tight ${className}`}>
      Neuro<span className="text-[var(--signal-peak)]">AD</span>
    </span>
  );
}
