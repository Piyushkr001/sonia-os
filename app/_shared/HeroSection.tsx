"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import {
  ArrowDown,
  ArrowUpRight,
  GitBranch,
  Network,
  Lightbulb,
  Compass,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Spotlight } from "@/components/ui/spotlight-new";

import { cn } from "@/lib/utils";

const explorationNodes = [
  {
    id: "01",
    title: "Journey",
    description: "Explore the professional path.",
    href: "#journey",
    icon: GitBranch,
  },
  {
    id: "02",
    title: "Expertise",
    description: "Discover professional capabilities.",
    href: "#expertise",
    icon: Network,
  },
  {
    id: "03",
    title: "Leadership",
    description: "Understand the approach.",
    href: "#leadership",
    icon: Compass,
  },
  {
    id: "04",
    title: "Ideas",
    description: "Discover new perspectives.",
    href: "#ideas",
    icon: Lightbulb,
  },
];

type ExplorationNode = (typeof explorationNodes)[number];

/* Exploration Node */

function IdentityNode({
  node,
}: {
  node: ExplorationNode;
}) {
  const Icon = node.icon;

  return (
    <Link
      href={node.href}
      data-track="hero_action"
      data-target={node.href.slice(1)}
      data-section={node.title.toLowerCase()}
      className={cn(
        "group relative flex min-w-0 flex-1 flex-col gap-3",
        "overflow-hidden rounded-2xl border",
        "border-emerald-400/15 bg-[#121A20]/80",
        "p-4 text-left backdrop-blur-xl sm:p-5",
        "transition-all duration-300",
        "hover:border-emerald-400/50",
        "hover:bg-emerald-400/5",
        "hover:shadow-[0_0_30px_rgba(52,211,153,0.08)]",
        "motion-safe:hover:-translate-y-1",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-4",
        "focus-visible:outline-emerald-400"
      )}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
          <Icon className="size-5 text-emerald-400" />
        </div>

        <span className="font-mono text-xs text-slate-500">
          /{node.id}
        </span>
      </div>

      {/* Node Content */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base font-semibold text-slate-100 transition-colors group-hover:text-emerald-400 sm:text-lg">
            {node.title}
          </h2>

          <ArrowUpRight className="size-4 shrink-0 text-slate-500 transition-colors group-hover:text-emerald-400" />
        </div>

        <p className="font-sans text-xs leading-relaxed text-slate-400 sm:text-sm">
          {node.description}
        </p>
      </div>
    </Link>
  );
}

/* Central Identity Core */

function IdentityCore() {
  return (
    <div
      aria-hidden="true"
      className="relative flex size-56 shrink-0 items-center justify-center sm:size-72"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-8 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Outer Orbital Ring */}
      <div className="absolute inset-0 rounded-full border border-emerald-400/10" />

      {/* Animated Orbital Ring */}
      <div className="absolute inset-3 rounded-full border border-dashed border-emerald-400/25 motion-safe:animate-[spin_35s_linear_infinite]">
        <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_#34D399]" />
      </div>

      {/* Reverse Orbital Ring */}
      <div className="absolute inset-8 rounded-full border border-emerald-400/20 motion-safe:animate-[spin_25s_linear_infinite_reverse]">
        <span className="absolute -bottom-1 left-1/2 size-2 rounded-full bg-emerald-400 shadow-[0_0_14px_#34D399]" />
      </div>

      {/* Inner Ring */}
      <div className="absolute inset-14 rounded-full border border-dashed border-emerald-400/20" />

      {/* Elliptical Orbits */}
      <div className="absolute h-[40%] w-full rotate-[-35deg] rounded-[50%] border border-emerald-400/20" />

      <div className="absolute h-[40%] w-full rotate-35 rounded-[50%] border border-emerald-400/20" />

      {/* Central Brand Icon */}
      <motion.div
        className={cn(
          "relative z-10 flex size-24 items-center",
          "justify-center rounded-full sm:size-32",
          "border border-emerald-400/40",
          "bg-[#0D231D]",
          "shadow-[0_0_50px_rgba(52,211,153,0.15)]"
        )}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="size-16 sm:size-20"
        >
          <path
            d="M50 8 L87 29 V71 L50 92 L13 71 V29 Z"
            stroke="#34D399"
            strokeWidth="2.5"
          />

          <path
            d="M65 28 H43 L30 41 L43 50 H57 L70 59 L57 72 H35"
            stroke="#A7F3D0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle cx="65" cy="28" r="3" fill="#A7F3D0" />
          <circle cx="35" cy="72" r="3" fill="#34D399" />
          <circle cx="50" cy="8" r="3" fill="#34D399" />
          <circle cx="87" cy="71" r="3" fill="#34D399" />
          <circle cx="13" cy="71" r="3" fill="#34D399" />
        </svg>
      </motion.div>

      {/* Core Label */}
      <div className="absolute bottom-0 rounded-full border border-emerald-400/10 bg-[#080C10] px-3 py-1">
        <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-400 sm:text-[10px]">
          IDENTITY CORE
        </span>
      </div>
    </div>
  );
}

/* Main Hero Section */

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="explore"
      aria-labelledby="hero-heading"
      className={cn(
        "relative isolate flex min-h-svh",
        "w-full flex-col items-center justify-center",
        "overflow-hidden bg-[#080C10]",
        "px-4 pt-32 pb-16 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40 lg:pb-20",
        "text-slate-100"
      )}
    >
      {/* Grid Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      {/* Aceternity Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden"
      >
        <Spotlight
          gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(52,211,153,0.12) 0, rgba(52,211,153,0.04) 50%, transparent 80%)"
          gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(52,211,153,0.08) 0, transparent 80%)"
          gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(167,243,208,0.06) 0, transparent 80%)"
          duration={9}
          xOffset={80}
        />
      </div>

      {/* Aceternity Background Beams */}
      <BackgroundBeams className="pointer-events-none absolute inset-0 -z-10 opacity-30 motion-reduce:hidden" />

      {/* Central Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[120px]"
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-10 sm:gap-12">
        {/* Introduction */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
          className="flex w-full max-w-4xl flex-col items-center gap-5 text-center"
        >
          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-2 rounded-full",
              "border-emerald-400/25",
              "bg-emerald-400/5 px-4 py-2",
              "font-mono text-[9px] tracking-widest",
              "text-emerald-300 sm:text-[11px]"
            )}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />

              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>

            A DIGITAL IDENTITY EXPERIENCE
          </Badge>

          {/* Headline */}
          <h1
            id="hero-heading"
            className={cn(
              "font-heading font-bold leading-[1.05]",
              "tracking-tighter",
              "text-[clamp(2.75rem,7vw,6rem)]"
            )}
          >
            Beyond the{" "}
            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Profile.
            </span>
          </h1>

          {/* Founder Introduction */}
          <p className="font-heading text-lg font-medium text-slate-200 sm:text-xl md:text-2xl">
            Sonia{" "}
            <span className="text-slate-500">—</span>{" "}
            Founder of{" "}
            <span className="text-emerald-400">
              i-SmokeStack
            </span>
          </p>

          {/* Description */}
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
            Every journey has a story. Every idea opens a
            possibility. Explore the connections between
            experience, leadership and professional identity.
          </p>
        </motion.div>

        {/* Identity Constellation */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            delay: reduceMotion ? 0 : 0.2,
          }}
          className={cn(
            "relative flex w-full max-w-5xl",
            "flex-col items-center justify-center",
            "gap-4 md:flex-row md:gap-8 lg:gap-12"
          )}
        >
          {/* Desktop Connection Lines */}
          <svg
            aria-hidden="true"
            viewBox="0 0 800 300"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden size-full md:block"
          >
            <path
              d="M180 65 C260 65 320 150 400 150"
              stroke="#34D399"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeDasharray="5 6"
              fill="none"
            />

            <path
              d="M180 235 C260 235 320 150 400 150"
              stroke="#34D399"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeDasharray="5 6"
              fill="none"
            />

            <path
              d="M620 65 C540 65 480 150 400 150"
              stroke="#34D399"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeDasharray="5 6"
              fill="none"
            />

            <path
              d="M620 235 C540 235 480 150 400 150"
              stroke="#34D399"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              strokeDasharray="5 6"
              fill="none"
            />
          </svg>

          {/* Left Nodes */}
          <div className="relative z-10 order-2 flex w-full flex-row gap-3 md:order-1 md:w-52 md:shrink-0 md:flex-col md:gap-8 lg:w-60">
            <IdentityNode node={explorationNodes[0]} />
            <IdentityNode node={explorationNodes[2]} />
          </div>

          {/* Digital Identity Core */}
          <div className="relative z-10 order-1 flex flex-1 items-center justify-center md:order-2">
            <IdentityCore />
          </div>

          {/* Right Nodes */}
          <div className="relative z-10 order-3 flex w-full flex-row gap-3 md:w-52 md:shrink-0 md:flex-col md:gap-8 lg:w-60">
            <IdentityNode node={explorationNodes[1]} />
            <IdentityNode node={explorationNodes[3]} />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            delay: reduceMotion ? 0 : 0.4,
          }}
          className="flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center"
        >
          {/* Primary CTA */}
          <Link
            href="#journey"
            data-track="hero_action"
            data-target="journey"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-12 rounded-xl px-6",
              "bg-emerald-400 font-semibold",
              "text-slate-950 hover:bg-emerald-300",
              "shadow-[0_0_25px_rgba(52,211,153,0.15)]",
              "transition-all duration-300",
              "hover:shadow-[0_0_35px_rgba(52,211,153,0.25)]"
            )}
          >
            Initialize Exploration

            <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="#ai"
            data-track="hero_action"
            data-target="ai"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "group h-12 rounded-xl px-6",
              "border-white/10 bg-white/5",
              "font-medium text-slate-100",
              "backdrop-blur-xl",
              "hover:border-emerald-400/30",
              "hover:bg-emerald-400/10",
              "hover:text-emerald-300"
            )}
          >
            <Sparkles className="size-4 text-emerald-400" />

            Ask Intelligence
          </Link>
        </motion.div>

        {/* Philosophy */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Inspired by
          </span>

          <span className="font-heading text-sm font-medium text-slate-300">
            Do More by Doing Less™
          </span>
        </div>

        {/* Hero Footer */}
        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 md:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // EXPERIENCE V.01
          </span>

          <Link
            href="#journey"
            data-track="hero_action"
            data-target="journey"
            className="group flex items-center gap-2 text-emerald-400"
          >
            <ArrowDown className="size-4 motion-safe:animate-bounce" />

            <span className="font-mono text-[10px] tracking-widest">
              SCROLL TO DISCOVER
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />

            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              EXPLORATION READY
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}