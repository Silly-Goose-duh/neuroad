export type LaunchState = "coming_soon" | "live";

function envLaunchState(): LaunchState {
  return process.env.NEXT_PUBLIC_LAUNCH_STATE === "live"
    ? "live"
    : "coming_soon";
}

export const site = {
  name: "NeuroAd",
  fullName: "Agentic Neuromarketing Intelligence Platform",
  launchState: envLaunchState() as LaunchState,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.neuroad.local/login",
  downloadUrl: (process.env.NEXT_PUBLIC_DOWNLOAD_URL || null) as string | null,
  waitlistEndpoint: "/api/waitlist",
  researchUrl: "https://arxiv.org/abs/2605.04326",
  contactEmail: "hello@neuroad.example",
};

export const isComingSoon = site.launchState === "coming_soon";
