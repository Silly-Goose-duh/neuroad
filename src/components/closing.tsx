"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FinalHelper, LaunchCta } from "@/components/launch-cta";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

const FAQS = [
  {
    q: "Is this an EEG or eye-tracking tool?",
    a: "No. NeuroAd is software: you upload your ad and it predicts the response.",
  },
  {
    q: "What can I upload?",
    a: "MP4, MOV, PNG, JPG and JPEG.",
  },
  {
    q: "How accurate is it?",
    a: "Predictions are calibrated against real campaign data and benchmarked against baselines. We'll publish validation results here once they're finalized.",
  },
  {
    q: "Does it replace testing with real people?",
    a: "No. It helps you fix the obvious problems before you spend on a launch or a study.",
  },
  {
    q: "What happens to my uploads?",
    a: "This marketing site does not accept ad uploads. When the product opens, a privacy policy will describe how campaign files are stored and processed. Waitlist emails are kept only to notify you at launch.",
  },
] as const;

export function Closing() {
  return (
    <section id="team" className="section-pad" aria-labelledby="cta-heading">
      <div className="page-wrap">
        <div className="mx-auto max-w-xl text-center">
          <h2 id="cta-heading" className="mx-auto">
            Publish with evidence.
          </h2>
          <div className="mt-8 flex justify-center">
            <LaunchCta location="final" />
          </div>
          <p className="mx-auto mt-4 text-sm text-[var(--graphite)]">
            <FinalHelper />
          </p>
        </div>

        <div className="mx-auto mt-24 max-w-2xl">
          <Accordion>
            {FAQS.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger
                  className="py-4 text-left text-base hover:no-underline"
                  onClick={() => track("faq_open", { q: item.q })}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[var(--graphite)]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <p className="mt-20 max-w-[62ch] text-sm text-[var(--graphite)]">
          Built by Abhijit S. R., Afthah Ali S., Sneha Mariam Mani and Tomson J.
          Finosh at the Department of Computer Science and Engineering, Marian
          Engineering College. Guide: Mrs. Dhanya L., Assistant Professor.
        </p>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--hairline)] py-12">
      <div className="page-wrap flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <p className="font-medium">
          Neuro<span className="text-[var(--signal-peak)]">AD</span>
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--graphite)]" aria-label="Footer">
          <a href="#how-it-works">How it works</a>
          <a href="#report">The report</a>
          <a href="#research">Research</a>
          <a href="#team">Team</a>
          <a href="/privacy">Privacy</a>
          <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        </nav>
      </div>
      <div className="page-wrap mt-8 text-sm text-[var(--graphite)]">
        <p>Supports SDG 8 and SDG 9</p>
        <p className="mt-1">© 2026 NeuroAd</p>
      </div>
    </footer>
  );
}
