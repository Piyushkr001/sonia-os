# SONIA.OS Deployment Guide (Vercel + Neon)

## Pre-Deployment Checklist

- [ ] Neon database has all 8 tables pushed (`bun run db:push` or verified schema).
- [ ] `ANALYTICS_ADMIN_TOKEN` is a strong random secret (32+ characters).
- [ ] `RATE_LIMIT_SALT` is set to a unique random secret.
- [ ] `GEMINI_API_KEY` is active and `GEMINI_MODEL` / `GEMINI_FALLBACK_MODELS` match available models.
- [ ] If email notifications are desired, set `CONTACT_EMAIL_ENABLED=true` and configure `SMTP_*` and `CONTACT_RECEIVER_EMAIL`.
- [ ] `NEXT_PUBLIC_SITE_URL` is set to your final production domain (e.g., `https://sonia-os.vercel.app`) for canonical/Open Graph URL resolution.
- [ ] `bun install --frozen-lockfile`, `bun run typecheck`, `bun run lint`, and `bun run build` all pass cleanly.

---

## Required Environment Variables on Vercel

Set these in **Vercel Project Settings → Environment Variables** (Production & Preview as needed):

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string (`sslmode=require`) |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key (server-side only) |
| `GEMINI_MODEL` | Recommended | Default `gemini-3.5-flash` (or `gemini-4-hydrogen` with fallbacks) |
| `GEMINI_FALLBACK_MODELS` | Recommended | `gemini-3.5-flash-lite,gemini-flash-latest,gemini-3.8-flash,gemini-3.5-flash,gemini-3.6-flash` |
| `AI_DAILY_LIMIT` | Optional | Default `100` |
| `ANALYTICS_ADMIN_TOKEN` | Yes | 32+ char secret for `GET /api/analytics/summary` & `/analytics` |
| `CONTACT_DAILY_LIMIT` | Optional | Default `100` |
| `CONTACT_EMAIL_ENABLED` | Optional | `"true"` or `"false"` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_RECEIVER_EMAIL` | If email enabled | Server-side Nodemailer SMTP settings |
| `RATE_LIMIT_SALT` | Recommended | Random secret for hashing client IPs in rate limiting |
| `RATE_LIMIT_*` | Optional | Override per-endpoint rate-limit windows/maximums (see `.env.example`) |
| `ANALYTICS_DAILY_EVENT_LIMIT`, `ANALYTICS_DAILY_SESSION_LIMIT` | Optional | Defaults `10000` and `1000` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production HTTPS URL for `metadataBase` |

---

## Deploying to Vercel

1. Connect the repository to Vercel (Framework Preset: **Next.js**).
2. Vercel auto-detects `bun.lock` (`packageManager: "bun@1.3.10"`). Build command: `bun run build`. Install command: `bun install --frozen-lockfile`.
3. Add the environment variables above in the Vercel dashboard (never commit `.env` or `.env.local`).
4. Trigger deployment. All API routes execute on Vercel's Node.js runtime (`maxDuration = 60` on `/api/chat` and `/api/contact`).
5. After deployment, verify:
   - `https://<domain>/` renders with HTTPS and security headers (`CSP`, `HSTS`, `X-Frame-Options: DENY`).
   - `https://<domain>/analytics` returns `X-Robots-Tag: noindex, nofollow` and unlocks with `ANALYTICS_ADMIN_TOKEN`.
   - `https://<domain>/robots.txt` disallows `/analytics` and `/api/`.
