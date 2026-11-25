"use client";

import Link from "next/link";
import axios from "axios";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  Activity,
  Users,
  MousePointerClick,
  Clock,
  BrainCircuit,
  MessageCircle,
  ChartNoAxesCombined,
  RefreshCw,
  LockKeyhole,
  ArrowLeft,
  LogOut,
  LoaderCircle,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

// Shadcn UI

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Aceternity UI

import { GlowingEffect } from "@/components/ui/glowing-effect";

// Magic UI

import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";

// Services

import {
  getAnalyticsSummary,
} from "@/services/analytics.service";

import type {
  AnalyticsSummary,
} from "@/lib/analytics-schema";

import { cn } from "@/lib/utils";

/* ------------------------------------------ */
/*                Display Labels              */
/* ------------------------------------------ */

const sectionLabels: Record<string, string> = {
  explore: "Identity Nexus",
  journey: "Professional Journey",
  expertise: "Expertise & Leadership",
  ideas: "Possibility Engine",
  ai: "Ask Intelligence",
  connect: "Connection Portal",
  footer: "Digital Signature",
};

const eventLabels: Record<string, string> = {
  navigation_click: "Navigation",
  hero_action: "Hero exploration",
  journey_chapter: "Journey chapter",
  knowledge_node: "Knowledge module",
  leadership_open: "Leadership insight",
  challenge_selected: "Challenge selection",
  engine_run: "Possibility Engine",
  engine_reset: "Engine reset",
  ai_question: "AI response",
  connection_intent: "Connection intent",
  connection_submit: "Connection recorded",
  footer_action: "Footer interaction",
};

/* ------------------------------------------ */
/*                 Analytics Card             */
/* ------------------------------------------ */

function InsightsCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col",
        "rounded-3xl border border-emerald-400/10 p-1",
        className
      )}
    >
      {!reduceMotion && (
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={1}
        />
      )}

      <Card className="relative flex h-full flex-1 flex-col gap-5 rounded-[20px] border-white/5 bg-[#121A20] p-5 text-slate-100 sm:p-6">
        {children}
      </Card>
    </div>
  );
}

/* ------------------------------------------ */
/*                  Metric Card               */
/* ------------------------------------------ */

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  suffix = "",
  decimals = 0,
}: {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  suffix?: string;
  decimals?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <InsightsCard className="w-full flex-1 basis-full sm:basis-[calc(50%-12px)] xl:basis-[calc(33.333%-16px)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-400">
          {title}
        </span>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
          <Icon className="size-5 text-emerald-400" />
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-1">
        <div className="font-heading text-4xl font-bold tracking-tight text-slate-100 sm:text-5xl">
          {reduceMotion || value === 0 ? (
            value.toFixed(decimals)
          ) : (
            <NumberTicker
              key={value}
              value={value}
              decimalPlaces={decimals}
              className="text-slate-100"
            />
          )}
        </div>

        {suffix && (
          <span className="font-heading text-xl text-emerald-400">
            {suffix}
          </span>
        )}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </InsightsCard>
  );
}

/* ------------------------------------------ */
/*              Section Engagement            */
/* ------------------------------------------ */

function SectionEngagement({
  data,
}: {
  data: AnalyticsSummary;
}) {
  return (
    <InsightsCard className="w-full lg:flex-1">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[10px] tracking-widest text-emerald-400">
          01 / EXPLORATION DISTRIBUTION
        </span>

        <h3 className="font-heading text-2xl font-semibold">
          Section engagement
        </h3>

        <p className="text-sm leading-relaxed text-slate-400">
          Unique tracked sessions that explored
          each application section.
        </p>
      </div>

      <Separator className="bg-white/5" />

      <div className="flex flex-col gap-6">
        {data.sections.map((section) => {
          const percentage =
            data.sessions > 0
              ? Math.min(
                  100,
                  (section.views / data.sessions) *
                    100
                )
              : 0;

          return (
            <div
              key={section.section}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-300">
                  {sectionLabels[
                    section.section
                  ] ?? section.section}
                </span>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-xs text-slate-500">
                    {percentage.toFixed(0)}%
                  </span>

                  <span className="font-mono text-sm text-emerald-400">
                    {section.views}
                  </span>
                </div>
              </div>

              <Progress
                value={percentage}
                aria-label={`Engagement for ${
                  sectionLabels[section.section] ??
                  section.section
                }`}
                className="h-2.5 bg-[#080C10] **:data-[slot=progress-indicator]:bg-emerald-400"
              />
            </div>
          );
        })}
      </div>
    </InsightsCard>
  );
}

/* ------------------------------------------ */
/*              Popular Interactions          */
/* ------------------------------------------ */

function PopularInteractions({
  data,
}: {
  data: AnalyticsSummary;
}) {
  return (
    <InsightsCard className="w-full lg:flex-1">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[10px] tracking-widest text-emerald-400">
          02 / INTERACTION INTELLIGENCE
        </span>

        <h3 className="font-heading text-2xl font-semibold">
          Most explored features
        </h3>

        <p className="text-sm leading-relaxed text-slate-400">
          Discover the interactions that generated
          the most visitor interest.
        </p>
      </div>

      <Separator className="bg-white/5" />

      {data.topActions.length === 0 ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-4 text-center">
          <Activity className="size-10 text-emerald-400/50" />

          <p className="text-sm text-slate-400">
            No engagement events recorded yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.topActions.map(
            (item, index) => (
              <div
                key={`${item.eventName}-${item.target}`}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0D1716] p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/5">
                  <span className="font-mono text-xs text-emerald-400">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-medium text-slate-200">
                    {eventLabels[
                      item.eventName
                    ] ?? item.eventName}
                  </span>

                  <span className="wrap-break-word text-xs text-slate-500">
                    {
                      sectionLabels[item.target] ??
                        item.target.replaceAll(
                          "_",
                          " "
                        )
                    }
                  </span>
                </div>

                <span className="shrink-0 font-mono text-sm font-semibold text-emerald-400">
                  {item.total}
                </span>
              </div>
            )
          )}
        </div>
      )}
    </InsightsCard>
  );
}

/* ------------------------------------------ */
/*                Main Dashboard              */
/* ------------------------------------------ */

export default function AnalyticsDashboard() {
  const reduceMotion = useReducedMotion();

  const [token, setToken] =
    useState("");

  const [days, setDays] =
    useState<7 | 30>(7);

  const [data, setData] =
    useState<AnalyticsSummary | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* Retrieve data through Axios */

  async function loadAnalytics(
    range: 7 | 30 = days
  ) {
    if (!token.trim() || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response =
        await getAnalyticsSummary(
          token.trim(),
          range
        );

      setData(response);
      setDays(range);
    } catch (requestError) {
      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 401
      ) {
        setData(null);

        setError(
          "Invalid analytics access token."
        );
      } else {
        setError(
          "Unable to retrieve analytics. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleUnlock(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    void loadAnalytics();
  }

  function lockDashboard() {
    setToken("");
    setData(null);
    setError(null);
  }

  return (
    <main className="relative isolate flex min-h-dvh w-full flex-col items-center overflow-hidden bg-[#080C10] px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-12">
      {/* Background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-10 size-96 -translate-x-1/2 rounded-full bg-emerald-400/5 blur-[120px]"
      />

      {/* Main Container */}

      <div className="flex w-full max-w-7xl flex-col gap-10">
        {/* Dashboard Header */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-emerald-400"
          >
            <ArrowLeft className="size-4" />

            Return to SONIA.OS
          </Link>

          <Badge
            variant="outline"
            className="gap-2 rounded-full border-emerald-400/20 bg-emerald-400/5 px-4 py-2 font-mono text-[10px] text-emerald-300"
          >
            <LockKeyhole className="size-3.5" />

            PRIVATE ANALYTICS
          </Badge>
        </div>

        {/* Section Heading */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 15 }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
          }}
          className="flex flex-col gap-5"
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-400">
            07 // THE INTELLIGENCE INSIGHTS ENGINE
          </span>

          <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-tight tracking-[-0.04em]">
            Intelligence{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Insights.
            </span>
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Understand how visitors interact with
            SONIA.OS through meaningful,
            privacy-conscious engagement analytics.
          </p>
        </motion.div>

        {/* Error State */}

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300"
          >
            <AlertCircle className="size-5 shrink-0" />

            {error}
          </div>
        )}

        {!data ? (
          /* Private Dashboard Access */

          <div className="flex w-full justify-center py-8">
            <Card className="relative flex w-full max-w-md flex-col gap-6 overflow-hidden rounded-3xl border-emerald-400/20 bg-[#121A20] p-6 text-slate-100 sm:p-8">
              {!reduceMotion && (
                <BorderBeam
                  size={150}
                  duration={10}
                  colorFrom="#34D399"
                  colorTo="#A7F3D0"
                  className="pointer-events-none"
                />
              )}

              <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                <LockKeyhole className="size-7 text-emerald-400" />
              </div>

              <h2 className="font-heading text-2xl font-semibold">
                Unlock Intelligence
              </h2>

              <p className="text-sm leading-relaxed text-slate-400">
                Enter your authorized analytics access
                token to view the dashboard.
              </p>

              <form
                onSubmit={handleUnlock}
                className="flex flex-col gap-4"
              >
                <Label htmlFor="analytics-token">
                  Access token
                </Label>

                <Input
                  id="analytics-token"
                  type="password"
                  autoComplete="off"
                  value={token}
                  onChange={(event) =>
                    setToken(event.target.value)
                  }
                  placeholder="Enter your access token"
                  className="h-12 rounded-xl border-white/10 bg-[#080C10] text-slate-100"
                />

                <Button
                  type="submit"
                  disabled={
                    loading || !token.trim()
                  }
                  className="h-12 rounded-xl bg-emerald-400 font-semibold text-slate-950 hover:bg-emerald-300"
                >
                  {loading ? (
                    <LoaderCircle className="size-4 motion-safe:animate-spin" />
                  ) : (
                    <LockKeyhole className="size-4" />
                  )}

                  Unlock Dashboard
                </Button>
              </form>
            </Card>
          </div>
        ) : (
          <>
            {/* Dashboard Controls */}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {([7, 30] as const).map(
                  (range) => (
                    <Button
                      key={range}
                      type="button"
                      variant="outline"
                      disabled={loading}
                      aria-pressed={days === range}
                      onClick={() =>
                        void loadAnalytics(range)
                      }
                      className={cn(
                        "rounded-xl",

                        days === range
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-white/10 bg-[#121A20] text-slate-400",

                        "hover:bg-emerald-400/10",
                        "hover:text-emerald-300"
                      )}
                    >
                      Last {range} Days
                    </Button>
                  )
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() =>
                    void loadAnalytics()
                  }
                  className="rounded-xl border-white/10 bg-[#121A20] text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  <RefreshCw
                    className={cn(
                      "size-4",

                      loading &&
                        "motion-safe:animate-spin"
                    )}
                  />

                  Refresh
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  disabled={loading}
                  onClick={lockDashboard}
                  className="text-slate-400 hover:bg-white/5 hover:text-slate-100"
                >
                  <LogOut className="size-4" />

                  Lock
                </Button>
              </div>
            </div>

            {/* Metrics - Responsive Flexbox */}

            <div className="flex w-full flex-wrap items-stretch gap-6">
              <MetricCard
                title="Visitor sessions"
                value={data.sessions}
                icon={Users}
                description="Unique tracked browser sessions."
              />

              <MetricCard
                title="Meaningful interactions"
                value={data.interactions}
                icon={MousePointerClick}
                description="Recorded actions, excluding views and heartbeats."
              />

              <MetricCard
                title="Average visible time"
                value={data.averageVisibleSeconds}
                suffix="s"
                icon={Clock}
                description="Estimated visible-page duration per tracked session."
              />

              <MetricCard
                title="AI interactions"
                value={data.aiInteractions}
                icon={BrainCircuit}
                description="AI requests recorded by the backend."
              />

              <MetricCard
                title="Connection requests"
                value={data.connections}
                icon={MessageCircle}
                description="Connection submissions saved in Neon."
              />

              <MetricCard
                title="Engagement rate"
                value={data.engagementRate}
                decimals={1}
                suffix="%"
                icon={Activity}
                description="Tracked sessions with at least one meaningful action."
              />
            </div>

            {/* Main Analytics Panels */}

            <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row">
              <SectionEngagement data={data} />

              <PopularInteractions data={data} />
            </div>

            {/* Data Explanation */}

            <div className="flex items-start gap-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-5">
              <ChartNoAxesCombined className="size-5 shrink-0 text-emerald-400" />

              <div className="flex flex-col gap-2">
                <h3 className="font-heading font-medium text-emerald-300">
                  Understanding the data
                </h3>

                <p className="text-xs leading-relaxed text-slate-400">
                  Visitor engagement metrics reflect
                  sessions that enabled analytics.
                  AI interactions and connection requests
                  are separate operational totals and
                  may include visitors who did not
                  enable engagement tracking.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Dashboard Footer */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // INTELLIGENCE INSIGHTS
          </span>

          <span className="font-mono text-[10px] tracking-widest text-emerald-400">
            PRIVACY-CONSCIOUS ANALYTICS
          </span>
        </div>
      </div>
    </main>
  );
}