"use client";

import { useEffect } from "react";
import { SiteLoader } from "@/components/site-loader";
import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { Signals } from "@/components/signals";
import { HowItWorks } from "@/components/how-it-works";
import { SampleReport } from "@/components/sample-report";
import { UnderTheHood } from "@/components/under-the-hood";
import { Closing, SiteFooter } from "@/components/closing";
import { SmoothScroll } from "@/components/smooth-scroll";
import { track } from "@/lib/analytics";

export default function HomePage() {
  useEffect(() => {
    const marks = [25, 50, 75, 100];
    const seen = new Set<number>();
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return;
      const pct = (el.scrollTop / max) * 100;
      for (const m of marks) {
        if (pct >= m && !seen.has(m)) {
          seen.add(m);
          track("scroll_depth", { pct: m });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <SmoothScroll>
      <SiteLoader />
      <SiteNav />
      <main id="main">
        <Hero />
        <Problem />
        <Signals />
        <HowItWorks />
        <SampleReport />
        <UnderTheHood />
        <Closing />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
