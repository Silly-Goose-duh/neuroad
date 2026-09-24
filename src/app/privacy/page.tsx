import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = {
  title: "Privacy, NeuroAd",
  description: "How NeuroAd handles waitlist emails and future ad uploads.",
};

export default function PrivacyPage() {
  return (
    <main id="main" className="section-pad">
      <div className="page-wrap">
        <p className="mb-10">
          <Link href="/" className="text-sm text-[var(--graphite)]">
            Back to NeuroAd
          </Link>
        </p>
        <h1>
          <Wordmark /> privacy
        </h1>
        <div className="mt-8 max-w-[62ch] space-y-4 text-[var(--graphite)]">
          <p>
            This page will be replaced with a full privacy policy before launch.
            Until then:
          </p>
          <p>
            Waitlist emails are stored so we can tell you when NeuroAd opens. We
            do not sell them. This marketing site does not collect ad files.
          </p>
          <p>
            When the product accepts uploads, this policy will describe
            retention, processing, and deletion for campaign media.
          </p>
        </div>
      </div>
    </main>
  );
}
