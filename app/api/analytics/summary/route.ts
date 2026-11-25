import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createHash,
  timingSafeEqual,
} from "node:crypto";

import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gte,
  notInArray,
} from "drizzle-orm";

import { getDb } from "@/db";

import {
  engagementEvents,
  aiInteractions,
  connectionRequests,
} from "@/db/schema";

import {
  sectionIds,
} from "@/lib/analytics-schema";

/* Verify the private analytics token */

function isAuthorized(
  request: NextRequest
) {
  const expected =
    process.env.ANALYTICS_ADMIN_TOKEN;

  const authorization =
    request.headers.get("authorization") ?? "";

  if (
    !expected ||
    expected.length < 32 ||
    !authorization.startsWith("Bearer ")
  ) {
    return false;
  }

  const provided =
    authorization.slice(7);

  const hash = (value: string) =>
    createHash("sha256")
      .update(value)
      .digest();

  return timingSafeEqual(
    hash(provided),
    hash(expected)
  );
}

function json(
  data: unknown,
  status = 200
) {
  return NextResponse.json(data, {
    status,

    headers: {
      "Cache-Control": "no-store",
    },
  });
}

/* GET analytics summary */

export async function GET(
  request: NextRequest
) {
  if (!isAuthorized(request)) {
    return json(
      {
        error: "Unauthorized access.",
      },
      401
    );
  }

  const requestedDays =
    request.nextUrl.searchParams.get("days") ?? "7";

  if (!["7", "30"].includes(requestedDays)) {
    return json(
      {
        error: "Invalid date range.",
      },
      400
    );
  }

  const days = Number(requestedDays);

  const since = new Date(
    Date.now() -
      days * 24 * 60 * 60 * 1000
  );

  try {
    const db = getDb();

    const inRange = gte(
      engagementEvents.createdAt,
      since
    );

    const meaningfulInteraction =
      notInArray(
        engagementEvents.eventName,
        [
          "heartbeat",
          "session_start",
          "section_view",
        ]
      );

    const [
      sessionRows,
      interactionRows,
      heartbeatRows,
      sectionRows,
      actionRows,
      aiRows,
      contactRows,
    ] = await Promise.all([
      /* Unique sessions in the selected period */

      db
        .select({
          total: countDistinct(
            engagementEvents.sessionId
          ),
        })
        .from(engagementEvents)
        .where(inRange),

      /* Meaningful interactions */

      db
        .select({
          total: count(),

          engagedSessions: countDistinct(
            engagementEvents.sessionId
          ),
        })
        .from(engagementEvents)
        .where(
          and(
            inRange,
            meaningfulInteraction
          )
        ),

      /* Visible-page heartbeat count */

      db
        .select({
          total: count(),
        })
        .from(engagementEvents)
        .where(
          and(
            inRange,

            eq(
              engagementEvents.eventName,
              "heartbeat"
            )
          )
        ),

      /* Unique sessions viewing each section */

      db
        .select({
          section: engagementEvents.target,

          views: countDistinct(
            engagementEvents.sessionId
          ),
        })
        .from(engagementEvents)
        .where(
          and(
            inRange,

            eq(
              engagementEvents.eventName,
              "section_view"
            )
          )
        )
        .groupBy(
          engagementEvents.target
        ),

      /* Most popular interactions */

      db
        .select({
          eventName:
            engagementEvents.eventName,

          target:
            engagementEvents.target,

          total: count(),
        })
        .from(engagementEvents)
        .where(
          and(
            inRange,
            meaningfulInteraction
          )
        )
        .groupBy(
          engagementEvents.eventName,
          engagementEvents.target
        )
        .orderBy(desc(count()))
        .limit(10),

      /* Existing AI interaction records */

      db
        .select({
          total: count(),
        })
        .from(aiInteractions)
        .where(
          gte(
            aiInteractions.createdAt,
            since
          )
        ),

      /* Existing contact request records */

      db
        .select({
          total: count(),
        })
        .from(connectionRequests)
        .where(
          gte(
            connectionRequests.createdAt,
            since
          )
        ),
    ]);

    const sessions =
      sessionRows[0]?.total ?? 0;

    const interactions =
      interactionRows[0]?.total ?? 0;

    const engagedSessions =
      interactionRows[0]?.engagedSessions ?? 0;

    const heartbeats =
      heartbeatRows[0]?.total ?? 0;

    return json({
      days,

      sessions,

      interactions,

      averageVisibleSeconds:
        sessions > 0
          ? Math.round(
              (heartbeats * 15) / sessions
            )
          : 0,

      engagementRate:
        sessions > 0
          ? Number(
              (
                (engagedSessions / sessions) *
                100
              ).toFixed(1)
            )
          : 0,

      aiInteractions:
        aiRows[0]?.total ?? 0,

      connections:
        contactRows[0]?.total ?? 0,

      sections: sectionIds.map(
        (section) => ({
          section,

          views:
            sectionRows.find(
              (row) =>
                row.section === section
            )?.views ?? 0,
        })
      ),

      topActions: actionRows,
    });
  } catch {
    console.error(
      "Unable to retrieve analytics summary."
    );

    return json(
      {
        error: "Analytics temporarily unavailable.",
      },
      503
    );
  }
}