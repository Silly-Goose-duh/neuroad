"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { LaunchCta } from "@/components/launch-cta";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#report", label: "The report" },
  { href: "#research", label: "Research" },
  { href: "#team", label: "Team" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const comingSoon = site.launchState === "coming_soon";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="nav-glass sticky top-0 z-40 h-16 border-b border-transparent"
    >
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="text-[1.05rem]">
          <Wordmark />
        </a>
        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[var(--graphite)] hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {comingSoon ? (
            <span className="rounded-full border border-[var(--hairline)] px-3 py-1 text-xs text-[var(--graphite)]">
              Coming soon
            </span>
          ) : null}
          <LaunchCta location="nav" />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LaunchCta location="nav" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 px-3",
              )}
            >
              Menu
            </SheetTrigger>
            <SheetContent side="right" className="bg-[var(--paper)]">
              <SheetHeader>
                <SheetTitle>
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 px-4" aria-label="Mobile">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="py-2 text-base"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
                <Link href="/privacy" className="py-2 text-base" onClick={() => setOpen(false)}>
                  Privacy
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
