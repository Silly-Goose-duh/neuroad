"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useWaitlist } from "@/components/waitlist-provider";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Props = {
  location: "nav" | "hero" | "final";
  className?: string;
};

export function LaunchCta({ location, className }: Props) {
  const { openWaitlist } = useWaitlist();
  const comingSoon = site.launchState === "coming_soon";

  if (comingSoon) {
    return (
      <Button
        className={cn(className)}
        onClick={() => {
          track("cta_click", { location, action: "waitlist" });
          openWaitlist();
        }}
      >
        Join the waitlist
      </Button>
    );
  }

  return (
    <Link
      href={site.appUrl}
      className={cn(buttonVariants(), className)}
      onClick={() => track("cta_click", { location, action: "login" })}
    >
      Log in
    </Link>
  );
}

export function HeroSecondaryCta() {
  const comingSoon = site.launchState === "coming_soon";
  if (!comingSoon && site.downloadUrl) {
    return (
      <a
        className="text-sm font-medium underline-offset-4 hover:underline"
        href={site.downloadUrl}
        onClick={() =>
          track("cta_click", { location: "hero", action: "download" })
        }
      >
        Download now
      </a>
    );
  }
  return (
    <a
      href="#how-it-works"
      className="text-sm font-medium underline-offset-4 hover:underline"
      onClick={() => track("cta_click", { location: "hero", action: "how" })}
    >
      See how it works
    </a>
  );
}

export function FinalHelper() {
  if (site.launchState === "coming_soon") {
    return <>Free to join. We&apos;ll email you once when NeuroAd opens.</>;
  }
  return <>Sign in to analyze your first ad.</>;
}
