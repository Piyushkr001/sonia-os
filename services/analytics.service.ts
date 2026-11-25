import api from "@/lib/axios";

import {
  analyticsSummarySchema,
  type AnalyticsEventInput,
  type AnalyticsSummary,
} from "@/lib/analytics-schema";

/* Record single visitor interaction */

export async function recordAnalyticsEvent(
  payload: AnalyticsEventInput,
  signal?: AbortSignal
) {
  await api.post(
    "/analytics/events",
    payload,
    {
      timeout: 5000,
      signal,
    }
  );
}

/* Record batched visitor interactions */

export async function recordAnalyticsEvents(
  events: AnalyticsEventInput[],
  signal?: AbortSignal
) {
  await api.post(
    "/analytics/events",
    { events },
    {
      timeout: 5000,
      signal,
    }
  );
}

/* Retrieve private statistics */

export async function getAnalyticsSummary(
  token: string,
  days: 7 | 30 = 7,
  signal?: AbortSignal
): Promise<AnalyticsSummary> {
  const response = await api.get(
    "/analytics/summary",
    {
      params: {
        days,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },

      signal,
    }
  );

  return analyticsSummarySchema.parse(
    response.data
  );
}