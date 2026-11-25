"use client";

import Link from "next/link";
import {
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowRight,
  ArrowUpRight,
  Lightbulb,
  Sparkles,
  Zap,
  Target,
  Filter,
  Quote,
  CheckCircle2,
  RotateCcw,
  Cpu,
  type LucideIcon,
} from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Aceternity UI
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Magic UI
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedBeam } from "@/components/ui/animated-beam";

// Data
import {
  possibilityChallenges,
  type PossibilityChallenge,
} from "@/data/ideas";

import { cn } from "@/lib/utils";

/* ------------------------------------------ */
/*              Reusable Engine Card          */
/* ------------------------------------------ */

function EngineCard({
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
          movementDuration={0.5}
        />
      )}

      <Card
        className={cn(
          "relative flex h-full flex-1 flex-col",
          "gap-6 overflow-hidden rounded-[20px]",
          "border-white/5 bg-[#121A20]/95",
          "p-5 text-slate-100 sm:p-6 lg:p-8"
        )}
      >
        {children}
      </Card>
    </div>
  );
}

/* ------------------------------------------ */
/*               Philosophy Banner            */
/* ------------------------------------------ */

function PhilosophyBanner() {
  return (
    <EngineCard className="w-full">
      {/* Decorative Quote */}
      <Quote
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 size-40 text-emerald-400/5 sm:size-56"
      />

      <div className="relative flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        {/* Philosophy Content */}
        <div className="flex max-w-3xl flex-1 flex-col gap-5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />

            <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-400">
              THE PHILOSOPHY
            </span>
          </div>

          <blockquote className="font-heading text-3xl font-bold leading-tight tracking-tight text-slate-100 sm:text-4xl lg:text-5xl">
            Do More by{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Doing Less™
            </span>
          </blockquote>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base">
            Progress does not always require more complexity.
            Sometimes, the most powerful approach is to
            remove unnecessary effort, focus on what matters
            and create meaningful outcomes.
          </p>

          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Inspired by the i-SmokeStack philosophy
          </span>
        </div>

        {/* Philosophy Visual */}
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-60">
          {[
            {
              title: "Simplify",
              icon: Filter,
            },
            {
              title: "Focus",
              icon: Target,
            },
            {
              title: "Amplify",
              icon: Zap,
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-[#0D1716] p-3"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10">
                  <Icon className="size-4 text-emerald-400" />
                </div>

                <span className="flex-1 font-heading text-sm font-medium text-slate-200">
                  {item.title}
                </span>

                <span className="font-mono text-xs text-slate-500">
                  0{index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </EngineCard>
  );
}

/* ------------------------------------------ */
/*              Challenge Selector            */
/* ------------------------------------------ */

function ChallengeSelector({
  selected,
  onSelect,
  onRun,
  onReset,
  hasResult,
}: {
  selected: PossibilityChallenge;
  onSelect: (challenge: PossibilityChallenge) => void;
  onRun: () => void;
  onReset: () => void;
  hasResult: boolean;
}) {
  return (
    <EngineCard className="w-full lg:flex-2">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-widest text-emerald-400">
            01 / SELECT A CHALLENGE
          </span>

          <h3 className="font-heading text-2xl font-semibold">
            What needs simplifying?
          </h3>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
          <Lightbulb className="size-5 text-emerald-400" />
        </div>
      </div>

      <p className="font-sans text-sm leading-relaxed text-slate-400">
        Choose a common professional challenge and explore
        a simpler approach.
      </p>

      {/* Challenge Options */}
      <div
        role="group"
        aria-label="Select a challenge"
        className="flex flex-1 flex-col gap-3"
      >
        {possibilityChallenges.map((challenge) => {
          const Icon = challenge.icon;

          const isActive =
            selected.id === challenge.id;

          return (
            <button
              key={challenge.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(challenge)}
              className={cn(
                "group flex w-full items-center gap-3",
                "rounded-xl border p-4 text-left",
                "transition-all duration-300",
                "focus-visible:outline-2",
                "focus-visible:outline-emerald-400",
                isActive
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : "border-white/5 bg-[#0D1716] hover:border-emerald-400/20"
              )}
            >
              {/* Challenge Icon */}
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center",
                  "justify-center rounded-lg border",
                  isActive
                    ? "border-emerald-400/20 bg-emerald-400/10"
                    : "border-white/5 bg-white/5"
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-5",
                    isActive
                      ? "text-emerald-400"
                      : "text-slate-400"
                  )}
                />
              </div>

              {/* Challenge Information */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  className={cn(
                    "font-heading text-sm font-semibold",
                    isActive
                      ? "text-emerald-300"
                      : "text-slate-200"
                  )}
                >
                  {challenge.title}
                </span>

                <span className="font-sans text-xs leading-relaxed text-slate-400">
                  {challenge.description}
                </span>
              </div>

              {isActive ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              ) : (
                <ArrowUpRight className="size-4 shrink-0 text-slate-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          onClick={onRun}
          className={cn(
            "group h-12 w-full rounded-xl",
            "bg-emerald-400 font-semibold text-slate-950",
            "hover:bg-emerald-300",
            "shadow-[0_0_25px_rgba(52,211,153,0.1)]"
          )}
        >
          <Cpu className="size-4" />

          Run Possibility Engine

          <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
        </Button>

        {hasResult && (
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="w-full text-slate-400 hover:bg-white/5 hover:text-slate-100"
          >
            <RotateCcw className="size-4" />

            Reset Engine
          </Button>
        )}
      </div>
    </EngineCard>
  );
}

/* ------------------------------------------ */
/*              Transformation Pipeline       */
/* ------------------------------------------ */

function TransformationPipeline({
  result,
}: {
  result: PossibilityChallenge | null;
}) {
  const reduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const simplifyRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const amplifyRef = useRef<HTMLDivElement>(null);

  const stages = [
    {
      title: "Simplify",
      icon: Filter,
      description: result?.simplify ?? "Remove friction.",
      ref: simplifyRef,
    },
    {
      title: "Focus",
      icon: Target,
      description: result?.focus ?? "Prioritize value.",
      ref: focusRef,
    },
    {
      title: "Amplify",
      icon: Zap,
      description: result?.amplify ?? "Improve outcomes.",
      ref: amplifyRef,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col items-stretch gap-8 py-4 sm:flex-row sm:gap-6"
    >
      {stages.map((stage, index) => {
        const Icon: LucideIcon = stage.icon;

        return (
          <div
            key={stage.title}
            ref={stage.ref}
            className={cn(
              "relative z-10 flex min-w-0 flex-1",
              "flex-col items-center justify-center gap-3",
              "rounded-2xl border bg-[#0D1716]",
              "p-4 text-center",
              "transition-colors duration-300",
              result
                ? "border-emerald-400/35"
                : "border-white/10"
            )}
          >
            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              STAGE 0{index + 1}
            </span>

            <div
              className={cn(
                "flex size-12 items-center justify-center",
                "rounded-xl border",
                result
                  ? "border-emerald-400/20 bg-emerald-400/10"
                  : "border-white/5 bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "size-6",
                  result
                    ? "text-emerald-400"
                    : "text-slate-500"
                )}
                strokeWidth={1.5}
              />
            </div>

            <h4 className="font-heading text-sm font-semibold text-slate-100 sm:text-base">
              {stage.title}
            </h4>

            <p className="font-sans text-xs leading-relaxed text-slate-400">
              {stage.description}
            </p>
          </div>
        );
      })}

      {/* Magic UI Animated Beams */}
      {result && !reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={simplifyRef}
            toRef={focusRef}
            duration={3}
            pathColor="#334155"
            pathWidth={2}
            gradientStartColor="#34D399"
            gradientStopColor="#A7F3D0"
          />

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={focusRef}
            toRef={amplifyRef}
            duration={3}
            delay={0.5}
            pathColor="#334155"
            pathWidth={2}
            gradientStartColor="#34D399"
            gradientStopColor="#A7F3D0"
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------ */
/*              Transformation Output         */
/* ------------------------------------------ */

function TransformationOutput({
  result,
}: {
  result: PossibilityChallenge | null;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <EngineCard className="w-full lg:flex-3">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-widest text-emerald-400">
            02 / TRANSFORMATION OUTPUT
          </span>

          <h3 className="font-heading text-2xl font-semibold">
            From complexity to clarity.
          </h3>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-2 font-mono text-[10px]",
            result
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
              : "border-white/10 text-slate-400"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              result
                ? "bg-emerald-400"
                : "bg-slate-500"
            )}
          />

          {result ? "OUTPUT READY" : "STANDBY"}
        </Badge>
      </div>

      <p className="font-sans text-sm leading-relaxed text-slate-400">
        Explore a three-stage approach to simplifying
        problems and creating meaningful outcomes.
      </p>

      {/* Transformation Pipeline */}
      <TransformationPipeline result={result} />

      <Separator className="bg-white/5" />

      {/* Output Panel */}
      <div
        aria-live="polite"
        className="flex min-h-56 flex-1 flex-col"
      >
        <AnimatePresence mode="wait" initial={false}>
          {result ? (
            <motion.div
              key={result.id}
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.3,
              }}
              className={cn(
                "relative flex flex-1 flex-col gap-5",
                "overflow-hidden rounded-2xl",
                "border border-emerald-400/20",
                "bg-emerald-400/5 p-5 sm:p-6"
              )}
            >
              {/* Decorative Glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-400" />

                <span className="font-mono text-[10px] tracking-widest text-emerald-400">
                  THE POSSIBILITY
                </span>
              </div>

              <h4 className="relative font-heading text-xl font-semibold leading-tight text-slate-100 sm:text-2xl">
                {result.outcome.title}
              </h4>

              <p className="relative font-sans text-sm leading-relaxed text-slate-400">
                {result.outcome.description}
              </p>

              {/* Potential Benefits */}
              <div className="relative flex flex-wrap items-center gap-2">
                {result.outcome.benefits.map((benefit) => (
                  <Badge
                    key={benefit}
                    variant="outline"
                    className="border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-[10px] text-emerald-300"
                  >
                    <CheckCircle2 className="size-3" />

                    {benefit}
                  </Badge>
                ))}
              </div>

              <span className="font-mono text-[10px] text-slate-500">
                Illustrative approach · Potential outcomes
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "flex min-h-56 flex-1 flex-col",
                "items-center justify-center gap-4",
                "rounded-2xl border border-dashed",
                "border-emerald-400/15 bg-[#0D1716]",
                "p-6 text-center"
              )}
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/5">
                <Cpu className="size-7 text-emerald-400/60" />
              </div>

              <h4 className="font-heading text-lg font-semibold text-slate-200">
                Awaiting your challenge.
              </h4>

              <p className="max-w-xs font-sans text-sm leading-relaxed text-slate-500">
                Select a challenge and initialize the engine
                to explore a possible solution.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </EngineCard>
  );
}

/* ------------------------------------------ */
/*                AI Transition               */
/* ------------------------------------------ */

function IntelligenceCTA() {
  return (
    <EngineCard className="w-full">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 sm:size-16">
            <Sparkles className="size-6 text-emerald-400 sm:size-7" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-widest text-emerald-400">
              THE NEXT POSSIBILITY
            </span>

            <h3 className="font-heading text-xl font-semibold text-slate-100 sm:text-2xl">
              Curiosity doesn't end here.
            </h3>

            <p className="font-sans text-sm leading-relaxed text-slate-400">
              Continue your exploration through an intelligent
              discovery experience.
            </p>
          </div>
        </div>

        <Link
          href="#ai"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-12 w-full shrink-0 rounded-xl",
            "bg-emerald-400 font-semibold text-slate-950",
            "hover:bg-emerald-300 md:w-fit"
          )}
        >
          <Sparkles className="size-4" />

          Ask Intelligence

          <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
        </Link>
      </div>
    </EngineCard>
  );
}

/* ------------------------------------------ */
/*                Main Ideas Section          */
/* ------------------------------------------ */

export default function Ideas() {
  const reduceMotion = useReducedMotion();

  const [selectedChallenge, setSelectedChallenge] =
    useState<PossibilityChallenge>(
      possibilityChallenges[0]
    );

  const [result, setResult] =
    useState<PossibilityChallenge | null>(null);

  const handleSelect = (
    challenge: PossibilityChallenge
  ) => {
    if (challenge.id !== selectedChallenge.id) {
      setSelectedChallenge(challenge);
      setResult(null);
    }
  };

  const handleRun = () => {
    setResult(selectedChallenge);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedChallenge(possibilityChallenges[0]);
  };

  return (
    <section
      id="ideas"
      aria-labelledby="ideas-heading"
      className={cn(
        "relative isolate flex w-full flex-col",
        "items-center justify-center overflow-hidden",
        "bg-[#080C10] px-4 py-20",
        "text-slate-100 sm:px-6",
        "lg:px-8 lg:py-28"
      )}
    >
      {/* Magic UI Animated Background */}
      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <AnimatedGridPattern
            numSquares={25}
            maxOpacity={0.12}
            duration={4}
            repeatDelay={1}
            className={cn(
              "inset-0 size-full",
              "fill-emerald-400/20 stroke-emerald-400/10",
              "mask-[radial-gradient(ellipse_at_center,white,transparent_75%)]"
            )}
          />
        </div>
      )}

      {/* Static Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[140px]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:gap-16">
        {/* Section Heading */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 20 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
          }}
          className="flex w-full max-w-4xl flex-col items-center gap-5 text-center"
        >
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-2 rounded-full",
              "border-emerald-400/20",
              "bg-emerald-400/5 px-4 py-2",
              "font-mono text-[10px]",
              "tracking-widest text-emerald-300"
            )}
          >
            <Lightbulb className="size-3.5" />

            03 // THE POSSIBILITY ENGINE
          </Badge>

          <h2
            id="ideas-heading"
            className={cn(
              "font-heading font-bold leading-tight",
              "tracking-[-0.04em]",
              "text-[clamp(2.25rem,5vw,4.5rem)]"
            )}
          >
            Less Noise.{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              More Impact.
            </span>
          </h2>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
            Ideas create possibilities. Simplicity gives them
            direction. Explore how thoughtful approaches
            can transform everyday challenges into meaningful
            opportunities.
          </p>
        </motion.div>

        {/* Philosophy Banner */}
        <PhilosophyBanner />

        {/* Interactive Possibility Engine */}
        <div className="flex w-full flex-col items-stretch gap-5 sm:gap-6 lg:flex-row">
          <ChallengeSelector
            selected={selectedChallenge}
            onSelect={handleSelect}
            onRun={handleRun}
            onReset={handleReset}
            hasResult={result !== null}
          />

          <TransformationOutput result={result} />
        </div>

        {/* Navigation to AI Section */}
        <IntelligenceCTA />

        {/* Section Footer */}
        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 sm:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // POSSIBILITY MODULE
          </span>

          <Link
            href="#ai"
            className="group flex items-center gap-2 font-mono text-xs tracking-wider text-emerald-400 hover:text-emerald-300"
          >
            CONTINUE EXPLORING

            <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />

            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              POSSIBILITY ENGINE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}