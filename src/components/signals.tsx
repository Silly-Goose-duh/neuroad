const SIGNALS = [
  {
    term: "Attention",
    meaning: "Where viewers look and when they drift.",
  },
  {
    term: "Emotion",
    meaning: "How the ad feels, and where the feeling changes.",
  },
  {
    term: "Memory",
    meaning: "How likely people are to remember it.",
  },
  {
    term: "Purchase intent",
    meaning: "How likely the ad is to move someone to act.",
  },
  {
    term: "Audience fit",
    meaning: "How well it resonates with your target age group and location.",
  },
] as const;

export function Signals() {
  return (
    <section className="section-pad" aria-labelledby="signals-heading">
      <div className="page-wrap">
        <h2 id="signals-heading">See the response before your audience does.</h2>
        <p className="mt-6 text-[var(--graphite)]">
          Upload an ad and NeuroAd predicts five things, second by second.
        </p>
        <dl className="mt-12 max-w-3xl">
          {SIGNALS.map((s) => (
            <div
              key={s.term}
              className="grid gap-2 border-t border-[var(--hairline)] py-6 md:grid-cols-[200px_1fr] md:gap-8"
            >
              <dt className="font-medium">{s.term}</dt>
              <dd className="text-[var(--graphite)]">{s.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
