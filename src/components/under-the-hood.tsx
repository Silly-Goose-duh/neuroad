import { site } from "@/lib/site";

const PIPELINE = ["Upload", "Analyze", "Predict", "Calibrate", "Recommend"] as const;

export function UnderTheHood() {
  return (
    <section
      id="research"
      className="section-pad bg-[var(--ink)] text-[#f2f3f6]"
      aria-labelledby="hood-heading"
    >
      <div className="page-wrap">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="hood-heading" className="text-[#f2f3f6]">
              Built on brain-response research.
            </h2>
            <p className="mt-6 text-[#a3a9b8]">
              Recent brain foundation models learn how people&apos;s brains respond
              to video, sound and language. NeuroAd draws on that research. It
              fuses visual, audio and text features along your ad&apos;s timeline,
              calibrates predictions against real campaign results, and hands the
              output to agents that write the recommendations.
            </p>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#a3a9b8]">
              The model on the opening screen is a real anatomical brain. Colour
              on it marks where a prediction says the audience is responding,
              not a scan of anyone.
            </p>
          </div>
        </div>
        <ol className="mt-12 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#a3a9b8]">
          {PIPELINE.map((p, i) => (
            <li key={p} className="flex items-center gap-4">
              <span className="text-[#f2f3f6]">{p}</span>
              {i < PIPELINE.length - 1 ? (
                <span aria-hidden className="text-[#5b6170]">
                  /
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-[#f2f3f6]">How we check ourselves</h3>
            <p className="mt-3 text-[#a3a9b8]">
              We compare attention and engagement curves using correlation and
              RMSE, score purchase-intent predictions with F1, and benchmark
              against simple saliency baselines.
            </p>
          </div>
          <div>
            <h3 className="text-[#f2f3f6]">What it is not</h3>
            <p className="mt-3 text-[#a3a9b8]">
              NeuroAd estimates how people are likely to respond. It does not
              scan anyone&apos;s brain, and it doesn&apos;t replace final human
              judgment or real-world testing.
            </p>
          </div>
        </div>
        <p className="mt-10">
          <a
            className="text-sm text-[#f2f3f6] underline underline-offset-4"
            href={site.researchUrl}
          >
            Read the research behind it
          </a>
        </p>
      </div>
    </section>
  );
}
