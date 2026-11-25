# SONIA.OS — Beyond the Profile

An interactive, single-page digital identity experience representing **Sonia**, founder of **i-SmokeStack**, built for the **i-SmokeStack Developer Hiring Challenge** and guided by the philosophy:

> **Do More by Doing Less™**

Instead of a conventional résumé or static portfolio template, SONIA.OS presents professional identity as an explorable system: an identity nexus, interactive timeline, connected capability map, problem-simplification engine, source-grounded AI discovery console, idempotent connection portal, and a private consent-aware analytics dashboard.

---

## Creative Concept & Design Philosophy

- **System-first identity**: Visitors explore modules rather than scrolling past static bullet lists.
- **Clarity over clutter**: Focused dark palette (`#080C10` canvas, `#121A20` surface, `#34D399` emerald accent, `#A7F3D0` highlight, `#F8FAFC` text) paired with Space Grotesk headings, Geist body copy, and JetBrains Mono system metadata.
- **Verified facts vs. illustrative concepts**: Documented facts about Sonia and i-SmokeStack are explicitly separated from illustrative SONIA.OS concepts (such as the Possibility Engine) across both the UI and the AI knowledge base.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Cache Components, Partial Prefetching)
- **Language & Runtime**: TypeScript (strict), React 19, Bun (`1.3.10`)
- **Styling & UI**: Tailwind CSS v4, Shadcn UI (`base-nova` / Base UI), Aceternity UI, Magic UI, Motion, Lucide React
- **HTTP & Validation**: Axios, Zod
- **Database & ORM**: Neon Serverless PostgreSQL, Drizzle ORM, Drizzle Kit
- **AI & Email**: Google Gemini REST API, Nodemailer (SMTP)
- **Deployment Target**: Vercel (Node.js serverless functions)

---

## Architecture Overview

```text
RootLayout (app/layout.tsx — fonts, global CSS, viewport, metadata)
├── Public Homepage (app/page.tsx)
│   └── AnalyticsProvider (opt-in consent banner + footer control + batched ingestion)
│       ├── Navbar (fixed glass pill, Command Palette Cmd/Ctrl+K, mobile Sheet)
│       ├── <main id="main-content">
│       │   ├── HeroSection (#explore)
│       │   ├── Journey (#journey — desktop timeline + mobile Shadcn Accordion)
│       │   ├── Expertise (#expertise — Knowledge Map + Leadership Lens dialogs)
│       │   ├── Ideas (#ideas — Possibility Engine: Simplify → Focus → Amplify)
│       │   ├── AskIntelligence (#ai — Gemini-powered source-grounded chat)
│       │   └── ConnectionPortal (#connect — idempotent form + SMTP notification)
│       └── Footer (#footer — Privacy & AI Notice dialog)
│
└── Private Analytics Route (app/analytics/page.tsx — noindex, no public Navbar)
    └── AnalyticsDashboard (Bearer-token unlocked Intelligence Insights Engine)
```

Detailed architecture notes live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Folder Structure

```text
sonia-os/
├── app/
│   ├── _shared/
│   │   ├── HeroSection.tsx
│   │   └── Navbar.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── api/
│   │   ├── analytics/
│   │   │   ├── events/route.ts
│   │   │   └── summary/route.ts
│   │   ├── chat/route.ts
│   │   └── contact/route.ts
│   ├── components/
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── AnalyticsProvider.tsx
│   │   ├── AskIntelligence.tsx
│   │   ├── ConnectionPortal.tsx
│   │   ├── Expertise.tsx
│   │   ├── Footer.tsx
│   │   ├── Ideas.tsx
│   │   └── Journey.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── robots.ts
├── components/ui/        # Shadcn, Aceternity & Magic UI primitives
├── data/                 # Static content modules & AI knowledge base
├── db/                   # Neon Drizzle client & PostgreSQL schema
├── docs/                 # Architecture, API, DB, Testing, Deployment & Thought Process
├── lib/                  # Schemas, Gemini client, mail, security, rate-limit, utils
├── public/Images/        # SONIA.OS SVG brand mark
├── services/             # Axios API client functions
├── drizzle.config.ts
├── next.config.ts
└── package.json
```

---

## Local Installation & Setup

1. **Install dependencies with Bun**:

   ```bash
   bun install
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env.local
   ```

   Populate `DATABASE_URL`, `GEMINI_API_KEY`, `ANALYTICS_ADMIN_TOKEN` (32+ characters), and optional SMTP / rate-limit settings. See [`.env.example`](.env.example).

3. **Push schema to Neon PostgreSQL**:

   ```bash
   bun run db:push
   ```

4. **Run development server**:

   ```bash
   bun dev
   ```

   Open `http://localhost:3000`.

5. **Verification commands**:

   ```bash
   bun run typecheck
   bun run lint
   bun run build
   ```

---

## Database & API Reference

- **Database schema & migration strategy**: [`docs/DATABASE.md`](docs/DATABASE.md)
  - Tables: `ai_daily_usage`, `ai_interactions`, `contact_daily_usage`, `connection_requests`, `visitor_sessions`, `engagement_events`, `api_rate_limits`, `analytics_daily_usage`.
- **API endpoints & security**: [`docs/API.md`](docs/API.md)
  - `POST /api/chat`
  - `POST /api/contact`
  - `POST /api/analytics/events`
  - `GET /api/analytics/summary`

---

## Analytics Dashboard Access

Navigate to `/analytics` (`noindex, nofollow`). Enter the value of `ANALYTICS_ADMIN_TOKEN` from your server environment to unlock the **Intelligence Insights Engine** (`Last 7 Days` / `Last 30 Days`).

---

## Privacy & Security Implementation

- **Opt-in engagement analytics**: Disabled until a visitor clicks **Enable Analytics** in the consent banner or footer control. Tracks random `sessionStorage` session UUIDs, device category, deduplicated section views, selected interactions, and 15-second visible-tab heartbeats. Never stores chat transcripts, contact details, full URLs, or raw IP addresses.
- **Distributed rate limiting & quotas**: All API routes enforce Neon-backed fixed-window rate limits using one-way SHA-256 hashed client identifiers (`RATE_LIMIT_SALT`), plus daily global quotas (`ai_daily_usage`, `contact_daily_usage`, `analytics_daily_usage`).
- **CSRF & payload hardening**: State-changing routes verify `Origin` / `Sec-Fetch-Site`, enforce `application/json`, validate body sizes before JSON parsing, validate payloads with Zod, and return `Cache-Control: no-store`.
- **HTTP security headers**: Configured in [`next.config.ts`](next.config.ts) (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `X-Robots-Tag: noindex, nofollow` on `/analytics`).

---

## Known Limitations & Content Blockers

- **Sonia's detailed biography**: Verified LinkedIn / external biographical records for Sonia (education, prior roles, dates, achievements) were not available during development; `data/journey.ts`, `data/expertise.ts`, and `data/knowledge-base.ts` intentionally avoid fabricating details and mark those slots as awaiting verified input.
- **Data retention**: Analytics and contact records are retained in Neon without an automated purge cron job; [`docs/DATABASE.md`](docs/DATABASE.md) documents a recommended 90-day retention policy for production operation.

---

## Further Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/API.md`](docs/API.md)
- [`docs/DATABASE.md`](docs/DATABASE.md)
- [`docs/THOUGHT_PROCESS.md`](docs/THOUGHT_PROCESS.md)
- [`docs/TESTING.md`](docs/TESTING.md)
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
