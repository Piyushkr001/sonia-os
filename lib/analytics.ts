import type {
  AnalyticsEventName,
} from "@/lib/analytics-schema";

export const ANALYTICS_EVENT =
  "sonia:engagement";

export interface EngagementPayload {
  eventName: AnalyticsEventName;
  target: string;
}

export function trackEngagement(
  eventName: AnalyticsEventName,
  target: string
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<EngagementPayload>(
      ANALYTICS_EVENT,
      {
        detail: {
          eventName,
          target,
        },
      }
    )
  );
}