import { NextRequest, NextResponse } from "next/server";

import { lt, sql } from "drizzle-orm";

import { getDb } from "@/db";

import {
  aiDailyUsage,
  aiInteractions,
} from "@/db/schema";

import {
  chatRequestSchema,
  type ChatTopic,
} from "@/lib/chat-schema";

import {
  describeGeminiError,
  generateAIResponse,
} from "@/lib/gemini";

export const maxDuration = 60;

async function reserveDailyRequest() {
  const day = new Date()
    .toISOString()
    .slice(0, 10);

  const limit = Number(
    process.env.AI_DAILY_LIMIT || 100
  );

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error("Invalid AI_DAILY_LIMIT.");
  }

  const db = getDb();

  const result = await db
    .insert(aiDailyUsage)
    .values({
      day,
      requests: 1,
    })
    .onConflictDoUpdate({
      target: aiDailyUsage.day,

      set: {
        requests: sql`${aiDailyUsage.requests} + 1`,
        updatedAt: new Date(),
      },

      setWhere: lt(
        aiDailyUsage.requests,
        limit
      ),
    })
    .returning({
      day: aiDailyUsage.day,
    });

  return result.length > 0;
}

async function logInteraction(
  topic: ChatTopic,

  status:
    | "success"
    | "insufficient_context"
    | "failed",

  responseTimeMs: number
) {
  try {
    await getDb()
      .insert(aiInteractions)
      .values({
        topic,
        status,
        responseTimeMs,
      });
  } catch {
    // Analytics errors should not break the AI response.
    console.error("AI interaction logging failed.");
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  let body: unknown;

  try {
    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          error: "Content-Type must be application/json.",
        },
        { status: 415 }
      );
    }

    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).length > 32768) {
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

  const validation = chatRequestSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,

        error:
          validation.error.issues[0]?.message ||
          "Invalid request.",
      },
      { status: 400 }
    );
  }

  try {
    // Reserve one request before calling Gemini.
    const allowed = await reserveDailyRequest();

    if (!allowed) {
      const tomorrow = new Date();

      tomorrow.setUTCHours(24, 0, 0, 0);

      const retryAfter = Math.max(
        1,
        Math.ceil(
          (tomorrow.getTime() - Date.now()) / 1000
        )
      );

      return NextResponse.json(
        {
          success: false,

          error:
            "The daily AI discovery limit has been reached. Please explore the other sections or return later.",
        },
        {
          status: 429,

          headers: {
            "Retry-After": String(retryAfter),
          },
        }
      );
    }

    const result = await generateAIResponse(
      validation.data
    );

    const responseTimeMs = Date.now() - startedAt;

    await logInteraction(
      result.topic,

      result.sufficientContext
        ? "success"
        : "insufficient_context",

      responseTimeMs
    );

    return NextResponse.json(
      {
        success: true,

        answer: result.answer,

        topic: result.topic,

        sources: result.sources,

        responseTimeMs,
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
      `AI discovery request failed: ${describeGeminiError(error)}`
    );

    await logInteraction(
      "other",
      "failed",
      Date.now() - startedAt
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Ask Intelligence is temporarily unavailable. Please try again.",
      },
      { status: 503 }
    );
  }
}