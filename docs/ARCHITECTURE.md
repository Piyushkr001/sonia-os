# SONIA.OS Architecture

## High-Level Component Tree

```text
app/layout.tsx (Server Component)
│  Loads Geist, Space Grotesk, JetBrains Mono fonts, globals.css,
│  Viewport (#080C10, dark), and global SEO Metadata.
│
├── app/page.tsx (Server Component — Public Experience)
│   └── AnalyticsProvider (Client Component — consent & batched events)
│       ├── Skip-to-content link (#main-content)
│       ├── Navbar (Client Component — fixed top bar, Cmd/Ctrl+K CommandDialog, mobile Sheet)
│       ├── <main id="main-content">
│       │   ├── HeroSection (#explore — Identity Core & constellation links)
│       │   ├── Journey (#journey — Desktop timeline & mobile Shadcn Accordion)
│       │   ├── Expertise (#expertise — Knowledge Map & Leadership Lens dialogs)
│       │   ├── Ideas (#ideas — Possibility Engine: Simplify → Focus → Amplify)
│       │   ├── AskIntelligence (#ai — Gemini chat console & suggested prompts)
│       │   └── ConnectionPortal (#connect — Intent selector & idempotent form)
│       └── Footer (#footer — Brand signature & Privacy & AI Notice dialog)
│
└── app/analytics/page.tsx (Server Component — Private Dashboard, noindex/nofollow)
    └── AnalyticsDashboard (Client Component — token-gated insights view)
```

## Server vs. Client Boundaries

- **Server-only modules** (`import "server-only"`):
  - `db/index.ts` — Lazy singleton `neon()` + Drizzle instance.
  - `lib/gemini.ts` — Google Gemini REST client with shared timeout budget and multi-model fallback.
  - `lib/mail.ts` — Nodemailer SMTP transport.
  - `lib/security.ts` — Same-origin verification and salted SHA-256 client fingerprinting.
  - `lib/rate-limit.ts` — Neon-backed atomic fixed-window rate limiter.
  - `data/knowledge-base.ts` — Curated grounding facts for Ask Intelligence.
- **Server Components**: `app/layout.tsx`, `app/page.tsx`, `app/analytics/page.tsx`, `app/robots.ts`.
- **Client Components**: Interactive sections under `app/_shared/`, `app/components/`, and `components/ui/`. Public `Navbar` is mounted only inside `app/page.tsx` so `/analytics` remains isolated from both public navigation and public engagement tracking.

## Data Flow: Request Lifecycle

1. **Ask Intelligence**:
   `AskIntelligence.tsx` -> `services/chat.service.ts` (`POST /api/chat` via Axios with `AbortSignal`) -> `app/api/chat/route.ts` (same-origin, size/JSON/Zod check, Neon rate limit, `ai_daily_usage` reservation) -> `lib/gemini.ts` (35s shared budget across fallback models, strict JSON schema validation, source allowlist filtering) -> `ai_interactions` logging.
2. **Connection Portal**:
   `ConnectionPortal.tsx` -> `services/contact.service.ts` (`POST /api/contact` with client-generated UUID `requestId`) -> `app/api/contact/route.ts` (same-origin, Zod, honeypot check, idempotency lookup, Neon rate limit, `contact_daily_usage` reservation, persist `connection_requests` before optional SMTP notification).
3. **Engagement Analytics**:
   UI interactions (`data-track`/`data-target` clicks, `trackEngagement` custom events, `IntersectionObserver` section views, 15s visible-tab heartbeats) -> `AnalyticsProvider.tsx` (only when `sonia_analytics_consent === "enabled"`, batched up to 8 events / 3s with bounded retry) -> `services/analytics.service.ts` (`POST /api/analytics/events`) -> `app/api/analytics/events/route.ts` (same-origin, Zod batch validation, Neon rate limit, `analytics_daily_usage` quota, bulk upsert `visitor_sessions` + `engagement_events`).
4. **Private Dashboard**:
   `AnalyticsDashboard.tsx` -> `services/analytics.service.ts` (`GET /api/analytics/summary?days=7|30` with `Authorization: Bearer <token>` and `AbortSignal`) -> `app/api/analytics/summary/route.ts` (Neon rate limit, constant-time SHA-256 `timingSafeEqual` check, parallel Drizzle aggregate queries).
