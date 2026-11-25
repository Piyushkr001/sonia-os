import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  eq,
  lt,
  sql,
} from "drizzle-orm";

import { getDb } from "@/db";

import {
  connectionRequests,
  contactDailyUsage,
} from "@/db/schema";

import {
  contactRequestSchema,
  type ContactRequest,
} from "@/lib/contact-schema";

import {
  isContactEmailEnabled,
  sendConnectionNotification,
} from "@/lib/mail";

export const maxDuration = 60;

/* ------------------------------------------ */
/*              Success Response              */
/* ------------------------------------------ */

function successResponse(
  requestId: string,
  status = 201
) {
  return NextResponse.json(
    {
      success: true,
      requestId,

      message:
        "Your connection request has been recorded successfully.",
    },
    {
      status,

      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

/* ------------------------------------------ */
/*              Daily Usage Limit             */
/* ------------------------------------------ */

async function reserveDailySubmission() {
  const db = getDb();

  const day = new Date()
    .toISOString()
    .slice(0, 10);

  const limit = Number(
    process.env.CONTACT_DAILY_LIMIT || 100
  );

  if (
    !Number.isSafeInteger(limit) ||
    limit < 1
  ) {
    throw new Error(
      "Invalid CONTACT_DAILY_LIMIT."
    );
  }

  const result = await db
    .insert(contactDailyUsage)
    .values({
      day,
      requests: 1,
    })
    .onConflictDoUpdate({
      target: contactDailyUsage.day,

      set: {
        requests:
          sql`${contactDailyUsage.requests} + 1`,
      },

      setWhere: lt(
        contactDailyUsage.requests,
        limit
      ),
    })
    .returning({
      day: contactDailyUsage.day,
    });

  return result.length > 0;
}

/* ------------------------------------------ */
/*               Duplicate Check              */
/* ------------------------------------------ */

async function findExistingRequest(
  requestId: string
) {
  const [existing] = await getDb()
    .select()
    .from(connectionRequests)
    .where(
      eq(
        connectionRequests.id,
        requestId
      )
    )
    .limit(1);

  return existing;
}

function isSameSubmission(
  existing: typeof connectionRequests.$inferSelect,
  request: ContactRequest
) {
  return (
    existing.name === request.name &&
    existing.email === request.email &&
    existing.intent === request.intent &&
    (existing.organization || "") ===
      request.organization &&
    existing.message === request.message
  );
}

function conflictResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This request identifier is already in use. Please start a new request.",
    },
    { status: 409 }
  );
}

/* ------------------------------------------ */
/*               POST /api/contact            */
/* ------------------------------------------ */

export async function POST(
  request: NextRequest
) {
  let body: unknown;

  try {
    const contentType =
      request.headers.get("content-type") || "";

    if (
      !contentType.includes("application/json")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Content-Type must be application/json.",
        },
        { status: 415 }
      );
    }

    const rawBody = await request.text();

    if (
      new TextEncoder().encode(rawBody).length >
      16384
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Request is too large.",
        },
        { status: 413 }
      );
    }

    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON request.",
      },
      { status: 400 }
    );
  }

  /* Validate request */

  const validation =
    contactRequestSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,

        error:
          validation.error.issues[0]?.message ||
          "Invalid connection request.",
      },
      { status: 400 }
    );
  }

  const data = validation.data;

  /* Basic honeypot spam protection */

  if (data.website.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process this request.",
      },
      { status: 400 }
    );
  }

  try {
    const db = getDb();

    /* Check for a previously saved request */

    const existing =
      await findExistingRequest(
        data.requestId
      );

    if (existing) {
      return isSameSubmission(existing, data)
        ? successResponse(existing.id, 200)
        : conflictResponse();
    }

    /* Reserve daily submission quota */

    const allowed =
      await reserveDailySubmission();

    if (!allowed) {
      const tomorrow = new Date();

      tomorrow.setUTCHours(24, 0, 0, 0);

      const retryAfter = Math.max(
        1,
        Math.ceil(
          (tomorrow.getTime() - Date.now()) /
            1000
        )
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "The daily connection request limit has been reached. Please try again later.",
        },
        {
          status: 429,

          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    /* Store the request before sending email */

    const emailEnabled =
      isContactEmailEnabled();

    const [saved] = await db
      .insert(connectionRequests)
      .values({
        id: data.requestId,

        intent: data.intent,

        name: data.name,

        email: data.email,

        organization:
          data.organization || null,

        message: data.message,

        status: "new",

        notificationStatus: emailEnabled
          ? "pending"
          : "disabled",

        consentedAt: new Date(),
      })
      .onConflictDoNothing({
        target: connectionRequests.id,
      })
      .returning({
        id: connectionRequests.id,
      });

    /* Handle concurrent duplicate submissions */

    if (!saved) {
      const duplicate =
        await findExistingRequest(
          data.requestId
        );

      if (
        duplicate &&
        isSameSubmission(duplicate, data)
      ) {
        return successResponse(
          duplicate.id,
          200
        );
      }

      return conflictResponse();
    }

    /* Optional email notification */

    if (emailEnabled) {
      let notificationStatus:
        | "sent"
        | "failed" = "failed";

      try {
        await sendConnectionNotification(data);

        notificationStatus = "sent";
      } catch {
        console.error(
          "Connection notification failed."
        );
      }

      try {
        await db
          .update(connectionRequests)
          .set({
            notificationStatus,

            updatedAt: new Date(),
          })
          .where(
            eq(
              connectionRequests.id,
              saved.id
            )
          );
      } catch {
        console.error(
          "Unable to update notification status."
        );
      }
    }

    /* Return success */

    return successResponse(saved.id);
  } catch (error) {
    console.error(
      "Connection request processing failed:",
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Unable to submit your connection request. Please try again.",
      },
      { status: 503 }
    );
  }
}