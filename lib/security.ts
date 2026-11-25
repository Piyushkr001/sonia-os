import "server-only";

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Validates that browser-originated state-changing requests match an allowed host.
 * Requests without an Origin header are permitted unless Sec-Fetch-Site is "cross-site".
 */
export function isSameOriginRequest(
  request: NextRequest
): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    const fetchSite =
      request.headers.get("sec-fetch-site");

    return fetchSite !== "cross-site";
  }

  let originHost: string;

  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }

  const allowedHosts = new Set<string>();

  const forwardedHost = request.headers.get(
    "x-forwarded-host"
  );
  const hostHeader = request.headers.get("host");
  const nextUrlHost = request.nextUrl.host;

  if (forwardedHost) {
    allowedHosts.add(forwardedHost.toLowerCase());
  }

  if (hostHeader) {
    allowedHosts.add(hostHeader.toLowerCase());
  }

  if (nextUrlHost) {
    allowedHosts.add(nextUrlHost.toLowerCase());
  }

  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    try {
      allowedHosts.add(
        new URL(configuredSiteUrl).host.toLowerCase()
      );
    } catch {
      // Ignore malformed optional configuration.
    }
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    allowedHosts.add(
      process.env.VERCEL_PROJECT_PRODUCTION_URL.toLowerCase()
    );
  }

  if (process.env.VERCEL_URL) {
    allowedHosts.add(
      process.env.VERCEL_URL.toLowerCase()
    );
  }

  return allowedHosts.has(originHost);
}

function firstIpFromHeader(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  const first = value
    .split(",")[0]
    ?.trim();

  return first || null;
}

/**
 * Computes a non-reversible hashed client identifier from deployment-provided headers.
 * Raw IP addresses are never persisted or logged.
 */
export function getClientFingerprint(
  request: NextRequest
): string {
  const ip =
    firstIpFromHeader(
      request.headers.get("x-vercel-forwarded-for")
    ) ??
    firstIpFromHeader(
      request.headers.get("x-real-ip")
    ) ??
    firstIpFromHeader(
      request.headers.get("cf-connecting-ip")
    ) ??
    firstIpFromHeader(
      request.headers.get("x-forwarded-for")
    ) ??
    "local";

  const salt =
    process.env.RATE_LIMIT_SALT ||
    process.env.ANALYTICS_ADMIN_TOKEN ||
    "sonia-os-rate-limit";

  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 24);
}

/**
 * Reads a positive integer environment variable with a safe fallback.
 */
export function readPositiveIntEnv(
  name: string,
  fallback: number
): number {
  const raw = process.env[name];

  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);

  if (
    !Number.isSafeInteger(parsed) ||
    parsed < 1
  ) {
    return fallback;
  }

  return parsed;
}
