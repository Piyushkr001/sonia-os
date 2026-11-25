import "server-only";

import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { getDb } from "@/db";
import { apiRateLimits } from "@/db/schema";

export interface RateLimitOptions {
  scope: string;
  identifier: string;
  maxRequests: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Enforces a distributed fixed-window rate limit backed by Neon PostgreSQL
 * so limits remain consistent across serverless Vercel invocations.
 */
export async function checkRateLimit({
  scope,
  identifier,
  maxRequests,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const db = getDb();
  const key = `${scope}:${identifier}`.slice(0, 160);
  const now = new Date();
  const nextWindowEnd = new Date(
    now.getTime() + windowSeconds * 1000
  );

  const [row] = await db
    .insert(apiRateLimits)
    .values({
      key,
      hits: 1,
      windowEndsAt: nextWindowEnd,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: apiRateLimits.key,
      set: {
        hits: sql`CASE WHEN ${apiRateLimits.windowEndsAt} <= ${now} THEN 1 ELSE ${apiRateLimits.hits} + 1 END`,
        windowEndsAt: sql`CASE WHEN ${apiRateLimits.windowEndsAt} <= ${now} THEN ${nextWindowEnd} ELSE ${apiRateLimits.windowEndsAt} END`,
        updatedAt: now,
      },
    })
    .returning({
      hits: apiRateLimits.hits,
      windowEndsAt: apiRateLimits.windowEndsAt,
    });

  const hits = row?.hits ?? 1;
  const windowEndsAt =
    row?.windowEndsAt ?? nextWindowEnd;

  const allowed = hits <= maxRequests;
  const remaining = Math.max(0, maxRequests - hits);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil(
      (windowEndsAt.getTime() - Date.now()) / 1000
    )
  );

  return {
    allowed,
    remaining,
    retryAfterSeconds,
  };
}

/**
 * Returns a standard HTTP 429 JSON response with Retry-After and no-store headers.
 */
export function rateLimitExceededResponse(
  retryAfterSeconds: number,
  message: string
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    }
  );
}
