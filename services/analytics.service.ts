import api from "@/lib/axios";

import {
  analyticsSummarySchema,
  type AnalyticsEventInput,
  type AnalyticsSummary,
} from "@/lib/analytics-schema";

/* Record visitor interaction */

export async function recordAnalyticsEvent(
  payload: AnalyticsEventInput
) {
  await api.post(
    "/analytics/events",
    payload,
    {
      timeout: 5000,
    }
  );
}

/* Retrieve private statistics */

export async function getAnalyticsSummary(
  token: string,
  days: 7 | 30 = 7
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
    }
  );

  return analyticsSummarySchema.parse(
    response.data
  );
}