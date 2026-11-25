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
  isGeminiRateLimited,
  isGeminiTimeout,
  isRequestAborted,
} from "@/lib/gemini";

import {
  checkRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rate-limit";

import {
  getClientFingerprint,
  isSameOriginRequest,
  readPositiveIntEnv,
} from "@/lib/security";

export const maxDuration = 60;

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

async function reserveDailyRequest() {
  const day = new Date()
    .toISOString()
    .slice(0, 10);

  const limit = readPositiveIntEnv(
    "AI_DAILY_LIMIT",
    100
  );

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

  if (!isSameOriginRequest(request)) {
    return jsonError(
      "Cross-origin requests are not allowed.",
      403
    );
  }

  let body: unknown;

  try {
    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return jsonError(
        "Content-Type must be application/json.",
        415
      );
    }

    const declaredLength = Number(
      request.headers.get("content-length") ?? 0
    );

    if (declaredLength > 32768) {
      return jsonError(
        "Request is too large.",
        413
      );
    }

    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).length > 32768) {
      return jsonError(
        "Request is too large.",
        413
      );
    }

    body = JSON.parse(rawBody);
  } catch {
    return jsonError(
      "Invalid JSON request.",
      400
    );
  }

  const validation = chatRequestSchema.safeParse(body);

  if (!validation.success) {
    return jsonError(
      validation.error.issues[0]?.message ||
        "Invalid request.",
      400
    );
  }

  try {
    const rateLimit = await checkRateLimit({
      scope: "chat",
      identifier: getClientFingerprint(request),
      maxRequests: readPositiveIntEnv(
        "RATE_LIMIT_CHAT_MAX",
        15
      ),
      windowSeconds: readPositiveIntEnv(
        "RATE_LIMIT_CHAT_WINDOW_SEC",
        300
      ),
    });

    if (!rateLimit.allowed) {
      return rateLimitExceededResponse(
        rateLimit.retryAfterSeconds,
        "Too many questions sent in a short time. Please wait a moment and try again."
      );
    }

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

      return jsonError(
        "The daily AI discovery limit has been reached. Please explore the other sections or return later.",
        429,
        {
          "Retry-After": String(retryAfter),
        }
      );
    }

    const result = await generateAIResponse(
      validation.data,
      { signal: request.signal }
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
    if (
      request.signal.aborted ||
      isRequestAborted(error)
    ) {
      return jsonError(
        "Request was cancelled.",
        499
      );
    }

    console.error(
      `AI discovery request failed: ${describeGeminiError(error)}`
    );

    await logInteraction(
      "other",
      "failed",
      Date.now() - startedAt
    );

    if (isGeminiRateLimited(error)) {
      return jsonError(
        "Ask Intelligence is experiencing high demand. Please try again shortly.",
        429,
        { "Retry-After": "30" }
      );
    }

    if (isGeminiTimeout(error)) {
      return jsonError(
        "Ask Intelligence timed out while generating a response. Please try again.",
        504
      );
    }

    return jsonError(
      "Ask Intelligence is temporarily unavailable. Please try again.",
      503
    );
  }
}