# SONIA.OS Database Architecture & Migration Strategy

Database: **Neon Serverless PostgreSQL** accessed via `@neondatabase/serverless` (HTTP driver) and **Drizzle ORM** (`db/index.ts`, `db/schema.ts`).

---

## Tables & Indexes

| Table | Purpose | Key Columns & Constraints |
| --- | --- | --- |
| `ai_daily_usage` | Daily global cap for Gemini requests | `day` (PK, text `YYYY-MM-DD`), `requests` (int), `updated_at` (timestamptz) |
| `ai_interactions` | Operational AI outcome & latency metrics | `id` (uuid PK), `topic` (`ai_topic` enum), `status` (`ai_status` enum), `response_time_ms` (int), `created_at` (timestamptz); indexes on `created_at`, `topic` |
| `contact_daily_usage` | Daily global cap for Connection Portal submissions | `day` (PK, text `YYYY-MM-DD`), `requests` (int) |
| `connection_requests` | Visitor connection submissions & email status | `id` (uuid PK, client idempotency key), `intent` (`connection_intent`), `name`, `email`, `organization` (nullable), `message`, `status` (`connection_status`), `notification_status` (`connection_notification_status`), `consented_at`, `created_at`, `updated_at`; indexes on `created_at`, `intent`, `status` |
| `visitor_sessions` | Consent-based browser sessions (random UUID) | `id` (uuid PK), `device` (varchar 20), `created_at`, `last_seen_at`; index on `created_at` |
| `engagement_events` | Consent-based interaction & heartbeat events | `id` (uuid PK), `session_id` (uuid FK -> `visitor_sessions.id` `ON DELETE CASCADE`), `event_name` (varchar 50), `target` (varchar 80), `created_at`; indexes on `session_id`, `event_name`, `created_at`, `(created_at, event_name)` |
| `api_rate_limits` | Distributed serverless fixed-window rate limits | `key` (varchar 160 PK), `hits` (int), `window_ends_at` (timestamptz), `updated_at`; index on `window_ends_at` |
| `analytics_daily_usage` | Daily global cap for analytics events & new sessions | `day` (PK, text `YYYY-MM-DD`), `events` (int), `sessions` (int), `updated_at` (timestamptz) |

---

## Safe Migration Strategy (Push-Initialized Neon Database)

This database was initialized using `drizzle-kit push`, so there is currently no `drizzle/` migration history table (`drizzle.__drizzle_migrations`) in Neon.

1. **Do NOT blindly run `drizzle-kit generate` + `drizzle-kit migrate`** against the existing Neon database: the initial generated SQL would attempt `CREATE TYPE` / `CREATE TABLE` on tables that already exist and fail or risk conflicts.
2. **Current safe workflow (during challenge/solo development)**:
   - Make **strictly additive** changes in `db/schema.ts` and apply with `bun run db:push`, inspecting the SQL preview carefully to confirm no `DROP` or destructive `ALTER` statements appear.
3. **Transitioning to tracked SQL migrations for production**:
   - Generate a baseline snapshot on a **fresh staging database** or generate `drizzle/` migrations (`bun run db:generate`), then mark the baseline migration as applied in Neon's `drizzle.__drizzle_migrations` table without re-executing `CREATE TABLE` statements, or recreate cleanly on a staging branch first and promote.
   - Always test migrations against a Neon branch (`neonctl branches create`) before touching production.

---

## Recommended Data Retention Policy

Automated deletion is **not** active by default so existing records are preserved for hiring-challenge review. For long-term production operation, schedule a weekly SQL cleanup job (e.g., via Vercel Cron or pg_cron):

- **`api_rate_limits`**: Delete expired buckets older than 24 hours (`WHERE window_ends_at < NOW() - INTERVAL '1 day'`).
- **`visitor_sessions` / `engagement_events`**: Retain for 90 days (`DELETE FROM visitor_sessions WHERE last_seen_at < NOW() - INTERVAL '90 days'` — cascades automatically to `engagement_events`).
- **`ai_daily_usage` / `contact_daily_usage` / `analytics_daily_usage`**: Retain 90 days of daily counters.
- **`connection_requests`**: Retain according to business/hiring follow-up policy and manually archive or purge once resolved.
