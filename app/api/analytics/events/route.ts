import {
  NextRequest,
  NextResponse,
} from "next/server";

import { and, inArray, lte, sql } from "drizzle-orm";

import { getDb } from "@/db";

import {
  analyticsDailyUsage,
  visitorSessions,
  engagementEvents,
} from "@/db/schema";

import {
  analyticsIngestSchema,
  type AnalyticsEventInput,
} from "@/lib/analytics-schema";

import {
  checkRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";

import {
  getClientFingerprint,
  isSameOriginRequest,
  readPositiveIntEnv,
} from "@/lib/security";

function jsonError(
  error: string,
  status: number,
  headers?: Record<string, string>
) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        ...headers,
      },
    }
  );
}

async function reserveAnalyticsQuota(
  eventCount: number,
  newSessionCount: number
) {
  const day = new Date().toISOString().slice(0, 10);
  const eventLimit = readPositiveIntEnv(
    "ANALYTICS_DAILY_EVENT_LIMIT",
    10000
  );
  const sessionLimit = readPositiveIntEnv(
    "ANALYTICS_DAILY_SESSION_LIMIT",
    1000
  );

  if (
    eventCount > eventLimit ||
    newSessionCount > sessionLimit
  ) {
    return false;
  }

  const now = new Date();
  const db = getDb();

  const result = await db
    .insert(analyticsDailyUsage)
    .values({
      day,
      events: eventCount,
      sessions: newSessionCount,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: analyticsDailyUsage.day,
      set: {
        events: sql`${analyticsDailyUsage.events} + ${eventCount}`,
        sessions: sql`${analyticsDailyUsage.sessions} + ${newSessionCount}`,
        updatedAt: now,
      },
      setWhere: and(
        lte(
          sql`${analyticsDailyUsage.events} + ${eventCount}`,
          eventLimit
        ),
        lte(
          sql`${analyticsDailyUsage.sessions} + ${newSessionCount}`,
          sessionLimit
        )
      ),
    })
    .returning({
      day: analyticsDailyUsage.day,
    });

  return result.length > 0;
}

export async function POST(
  request: NextRequest
) {
  if (!isSameOriginRequest(request)) {
    return jsonError(
      "Cross-origin requests are not allowed.",
      403
    );
  }

  try {
    const contentType =
      request.headers.get("content-type") ?? "";

    if (
      !contentType.includes("application/json")
    ) {
      return jsonError(
        "Unsupported content type.",
        415
      );
    }

    const declaredLength = Number(
      request.headers.get("content-length") ?? 0
    );

    if (declaredLength > 16384) {
      return jsonError(
        "Request too large.",
        413
      );
    }

    const rawBody = await request.text();

    if (
      new TextEncoder().encode(rawBody).length >
      16384
    ) {
      return jsonError(
        "Request too large.",
        413
      );
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonError("Invalid JSON.", 400);
    }

    const validation =
      analyticsIngestSchema.safeParse(body);

    if (!validation.success) {
      return jsonError(
        "Invalid analytics event.",
        400
      );
    }

    const events: AnalyticsEventInput[] =
      "events" in validation.data
        ? validation.data.events
        : [validation.data];

    const rateLimit = await checkRateLimit({
      scope: "analytics_events",
      identifier: getClientFingerprint(request),
      maxRequests: readPositiveIntEnv(
        "RATE_LIMIT_ANALYTICS_EVENTS_MAX",
        60
      ),
      windowSeconds: readPositiveIntEnv(
        "RATE_LIMIT_ANALYTICS_EVENTS_WINDOW_SEC",
        60
      ),
    });

    if (!rateLimit.allowed) {
      return rateLimitExceededResponse(
        rateLimit.retryAfterSeconds,
        "Analytics rate limit exceeded."
      );
    }

    const db = getDb();

    const sessionDeviceMap = new Map<
      string,
      AnalyticsEventInput["device"]
    >();

    for (const item of events) {
      sessionDeviceMap.set(
        item.sessionId,
        item.device
      );
    }

    const uniqueSessionIds = Array.from(
      sessionDeviceMap.keys()
    );

    const existingSessions =
      uniqueSessionIds.length > 0
        ? await db
            .select({ id: visitorSessions.id })
            .from(visitorSessions)
            .where(
              inArray(
                visitorSessions.id,
                uniqueSessionIds
              )
            )
        : [];

    const existingSessionSet = new Set(
      existingSessions.map((row) => row.id)
    );

    const newSessionCount = uniqueSessionIds.filter(
      (id) => !existingSessionSet.has(id)
    ).length;

    const quotaAllowed = await reserveAnalyticsQuota(
      events.length,
      newSessionCount
    );

    if (!quotaAllowed) {
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);

      const retryAfter = Math.max(
        1,
        Math.ceil(
          (tomorrow.getTime() - Date.now()) / 1000
        )
      );

      return jsonError(
        "Daily analytics ingestion quota reached.",
        429,
        {
          "Retry-After": String(retryAfter),
        }
      );
    }

    const now = new Date();

    // Create or update visitor sessions in one statement.
    await db
      .insert(visitorSessions)
      .values(
        Array.from(sessionDeviceMap.entries()).map(
          ([id, device]) => ({
            id,
            device,
            lastSeenAt: now,
          })
        )
      )
      .onConflictDoUpdate({
        target: visitorSessions.id,
        set: {
          lastSeenAt: now,
        },
      });

    // Store interactions; duplicate event UUIDs are ignored.
    await db
      .insert(engagementEvents)
      .values(
        events.map((item) => ({
          id: item.eventId,
          sessionId: item.sessionId,
          eventName: item.eventName,
          target: item.target,
        }))
      )
      .onConflictDoNothing({
        target: engagementEvents.id,
      });

    return NextResponse.json(
      {
        success: true,
        accepted: events.length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unable to record analytics event:",
      error instanceof Error ? error.message : String(error)
    );

    return jsonError(
      "Analytics unavailable.",
      503
    );
  }
}
