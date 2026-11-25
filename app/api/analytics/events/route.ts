import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getDb } from "@/db";

import {
  visitorSessions,
  engagementEvents,
} from "@/db/schema";

import {
  analyticsEventSchema,
} from "@/lib/analytics-schema";

export async function POST(
  request: NextRequest
) {
  try {
    const contentType =
      request.headers.get("content-type") ?? "";

    if (
      !contentType.includes("application/json")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported content type.",
        },
        { status: 415 }
      );
    }

    const declaredLength = Number(
      request.headers.get("content-length") ?? 0
    );

    if (declaredLength > 4096) {
      return NextResponse.json(
        {
          success: false,
          error: "Request too large.",
        },
        { status: 413 }
      );
    }

    const rawBody = await request.text();

    if (
      new TextEncoder().encode(rawBody).length >
      4096
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Request too large.",
        },
        { status: 413 }
      );
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON.",
        },
        { status: 400 }
      );
    }

    const validation =
      analyticsEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid analytics event.",
        },
        { status: 400 }
      );
    }

    const {
      eventId,
      sessionId,
      eventName,
      target,
      device,
    } = validation.data;

    const db = getDb();

    // Create or update the visitor session.

    await db
      .insert(visitorSessions)
      .values({
        id: sessionId,
        device,
      })
      .onConflictDoUpdate({
        target: visitorSessions.id,

        set: {
          lastSeenAt: new Date(),
        },
      });

    // Store the interaction.
    // Duplicate event UUIDs are ignored.

    await db
      .insert(engagementEvents)
      .values({
        id: eventId,
        sessionId,
        eventName,
        target,
      })
      .onConflictDoNothing({
        target: engagementEvents.id,
      });

    return NextResponse.json(
      {
        success: true,
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

    return NextResponse.json(
      {
        success: false,
        error: "Analytics unavailable.",
      },
      { status: 503 }
    );
  }
}