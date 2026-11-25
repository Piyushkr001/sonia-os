# SONIA.OS API Reference

All endpoints run in the Next.js Node.js runtime and return `Cache-Control: no-store`. State-changing `POST` endpoints enforce same-origin checks (`Origin` / `Sec-Fetch-Site`), `Content-Type: application/json`, payload size limits, Zod schema validation, and Neon-backed distributed rate limiting (`429` with `Retry-After`).

---

## `POST /api/chat`

Answers visitor questions using Google Gemini grounded strictly in `data/knowledge-base.ts`.

- **Rate Limit**: `RATE_LIMIT_CHAT_MAX` requests (default `15`) per `RATE_LIMIT_CHAT_WINDOW_SEC` seconds (default `300`) per hashed client identifier.
- **Daily Quota**: `AI_DAILY_LIMIT` requests per UTC day (default `100`).
- **Max Body Size**: `32,768` bytes.
- **Request Body**:
  ```json
  {
    "question": "What is the philosophy of i-SmokeStack?",
    "history": [
      { "role": "user", "content": "Who is Sonia?" },
      { "role": "assistant", "content": "..." }
    ]
  }
  ```
  - `question`: trimmed string, `2..1000` chars.
  - `history`: optional array of up to `8` `{ role: "user" | "assistant", content: string (1..3000) }`.
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "answer": "...",
      "topic": "philosophy",
      "sources": [
        { "id": "company-philosophy", "title": "i-SmokeStack Philosophy", "source": "..." }
      ],
      "responseTimeMs": 1820
    }
    ```
  - `400 Bad Request` — Invalid JSON or Zod validation failure.
  - `403 Forbidden` — Cross-origin request rejected.
  - `413 Payload Too Large` — Body exceeds 32 KB.
  - `415 Unsupported Media Type` — Non-JSON `Content-Type`.
  - `429 Too Many Requests` — Rate limit, daily quota, or upstream Gemini rate limit (`Retry-After` set).
  - `504 Gateway Timeout` — Gemini request budget exceeded.
  - `503 Service Unavailable` — Upstream AI failure or missing configuration.

---

## `POST /api/contact`

Validates and stores Connection Portal submissions idempotently before attempting optional SMTP email delivery.

- **Rate Limit**: `RATE_LIMIT_CONTACT_MAX` requests (default `5`) per `RATE_LIMIT_CONTACT_WINDOW_SEC` seconds (default `900`).
- **Daily Quota**: `CONTACT_DAILY_LIMIT` requests per UTC day (default `100`).
- **Max Body Size**: `16,384` bytes.
- **Request Body**:
  ```json
  {
    "requestId": "uuid-v4",
    "intent": "collaboration | networking | innovation | opportunity | general",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "organization": "Optional Org",
    "message": "At least 20 characters...",
    "consent": true,
    "website": ""
  }
  ```
- **Responses**:
  - `201 Created`: Request persisted (`{"success": true, "requestId": "...", "message": "Your connection request has been recorded successfully."}`).
  - `200 OK`: Idempotent replay matching an existing `requestId` with identical payload.
  - `400 Bad Request`: Invalid JSON, schema error, missing consent, or triggered honeypot (`website` non-empty).
  - `403 Forbidden`: Cross-origin request rejected.
  - `409 Conflict`: `requestId` reused with a different payload.
  - `413` / `415` / `429` / `503`: Size, content-type, rate/quota limit, or database failure.
  - Note: SMTP notification failures update `notification_status = "failed"` in PostgreSQL without failing an already-recorded submission.

---

## `POST /api/analytics/events`

Ingests single or batched consent-based engagement events.

- **Rate Limit**: `RATE_LIMIT_ANALYTICS_EVENTS_MAX` requests (default `60`) per `RATE_LIMIT_ANALYTICS_EVENTS_WINDOW_SEC` seconds (default `60`).
- **Daily Quotas**: `ANALYTICS_DAILY_EVENT_LIMIT` (default `10,000` events/day) and `ANALYTICS_DAILY_SESSION_LIMIT` (default `1,000` new sessions/day).
- **Max Body Size**: `16,384` bytes.
- **Request Body**: Either a single event object or `{ "events": [ ... ] }` (`1..20` events):
  ```json
  {
    "events": [
      {
        "eventId": "uuid-v4",
        "sessionId": "uuid-v4",
        "eventName": "section_view",
        "target": "journey",
        "device": "desktop"
      }
    ]
  }
  ```
- **Responses**:
  - `200 OK`: `{ "success": true, "accepted": 1 }`. Duplicate `eventId` rows are safely ignored.
  - `400` / `403` / `413` / `415` / `429` / `503`.

---

## `GET /api/analytics/summary?days=7|30`

Returns aggregated engagement and operational totals for the private `/analytics` dashboard.

- **Authentication**: `Authorization: Bearer <ANALYTICS_ADMIN_TOKEN>` (validated with SHA-256 + `crypto.timingSafeEqual`).
- **Rate Limit**: `RATE_LIMIT_ANALYTICS_SUMMARY_MAX` requests (default `20`) per `RATE_LIMIT_ANALYTICS_SUMMARY_WINDOW_SEC` seconds (default `60`), evaluated before token comparison to throttle brute-force attempts.
- **Query Params**: `days` (`"7"` or `"30"`, default `"7"`).
- **Responses**:
  - `200 OK`: Aggregated counts (`sessions`, `interactions`, `averageVisibleSeconds`, `engagementRate`, `aiInteractions`, `connections`, `days`, `sections[]`, `topActions[]`). Never returns raw contact submissions, visitor UUIDs, or chat text.
  - `400 Bad Request`: Invalid `days` query parameter.
  - `401 Unauthorized`: Missing or invalid token.
  - `429 Too Many Requests`: Rate limit exceeded.
  - `503 Service Unavailable`: Database error.
