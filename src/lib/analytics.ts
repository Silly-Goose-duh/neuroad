export type AnalyticsEvent =
  | "cta_click"
  | "waitlist_open"
  | "waitlist_submit"
  | "faq_open"
  | "scroll_depth";

export function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("neuroad:analytics", { detail: { event, props } }),
  );
}
