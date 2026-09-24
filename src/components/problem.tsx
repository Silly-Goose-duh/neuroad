const STEPS = [
  "Create",
  "Publish",
  "Wait",
  "Read analytics",
  "Guess again",
] as const;

export function Problem() {
  return (
    <section className="section-pad" aria-labelledby="problem-heading">
      <div className="page-wrap">
        <h2 id="problem-heading">
          You find out how an ad performed after the budget is spent.
        </h2>
        <div className="mt-8 max-w-[62ch] space-y-4 text-[var(--graphite)]">
          <p>
            Analytics dashboards only report once an ad is live. Testing with EEG
            or eye-tracking is accurate, but it costs too much and takes too long
            for everyday campaigns. So most teams publish, wait, and guess.
          </p>
        </div>
        <ol className="mt-12 flex flex-col gap-0 md:flex-row md:items-stretch">
          {STEPS.map((step, i) => {
            const beforePublish = i === 0;
            return (
              <li
                key={step}
                className="relative flex flex-1 flex-col border-t border-[var(--hairline)] py-4 md:border-t-0 md:border-l md:px-5 md:py-0 first:border-l-0"
              >
                <span className="text-[var(--graphite)]">{step}</span>
                {beforePublish ? (
                  <span className="mt-3 inline-block border-b-2 border-[var(--signal-high)] pb-1 text-sm">
                    Where NeuroAd works
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-10 text-sm text-[var(--graphite)]">
          Digital is the largest advertising medium in India, about 44% of spend
          in FY25. Source: Ipsos estimates.
        </p>
      </div>
    </section>
  );
}
