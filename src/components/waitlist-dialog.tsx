"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWaitlist } from "@/components/waitlist-provider";
import { site } from "@/lib/site";
import { track } from "@/lib/analytics";

const ROLES = ["Marketer", "Creator", "Agency", "Other"] as const;

export function WaitlistDialog() {
  const { open, setOpen } = useWaitlist();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [emailError, setEmailError] = useState("");

  function validate(value: string) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!ok) {
      setEmailError("Enter a valid email address, like name@company.com.");
      return false;
    }
    setEmailError("");
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(email)) return;
    setStatus("submitting");
    track("waitlist_submit");
    try {
      const res = await fetch(site.waitlistEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, website: hp }),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setStatus("idle");
          setEmailError("");
        }
      }}
    >
      <DialogContent className="max-w-md rounded-[16px] p-6">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-display)] text-2xl">
            Join the waitlist
          </DialogTitle>
          <DialogDescription>
            Free to join. We will email you once when NeuroAd opens.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-4" noValidate>
          <div className="honeypot" aria-hidden="true">
            <label>
              Company website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="waitlist-email">Email</Label>
            <Input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "waitlist-email-error" : undefined}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-[6px]"
              placeholder="name@company.com"
            />
            {emailError ? (
              <p id="waitlist-email-error" className="text-sm text-destructive">
                {emailError}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="waitlist-role">I am a (optional)</Label>
            <select
              id="waitlist-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 w-full rounded-[6px] border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--signal-low)]"
            >
              <option value="">Select one</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-[var(--graphite)]">
            By joining you agree we may email you about NeuroAd. Read the{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
          <Button
            type="submit"
            disabled={status === "submitting" || status === "success"}
          >
            {status === "submitting"
              ? "Joining…"
              : status === "success"
                ? "You're on the waitlist"
                : "Join the waitlist"}
          </Button>
          <div aria-live="polite" className="min-h-[1.5rem] text-sm">
            {status === "success" ? (
              <p>You&apos;re on the waitlist. We&apos;ll email you when NeuroAd opens.</p>
            ) : null}
            {status === "error" ? (
              <p className="text-destructive">
                Something went wrong on our side. Try again in a minute.
              </p>
            ) : null}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
