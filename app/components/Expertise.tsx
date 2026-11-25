"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowDown,
  ArrowUpRight,
  Network,
  Sparkles,
  Quote,
  Compass,
  Hexagon,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import {
  Button,
  buttonVariants,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import { GlowingEffect } from "@/components/ui/glowing-effect";

import {
  knowledgeModules,
  leadershipModules,
  type KnowledgeModule,
  type LeadershipModule,
} from "@/data/expertise";

import { cn } from "@/lib/utils";

/* ------------------------------------------ */
/*              Bento Card Wrapper            */
/* ------------------------------------------ */

interface NexusCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

function NexusCard({
  children,
  className,
  id,
}: NexusCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      id={id}
      className={cn(
        "relative flex min-w-0 flex-col",
        "rounded-3xl border border-emerald-400/10",
        "p-1",
        className
      )}
    >
      {!reduceMotion && (
        <GlowingEffect
          spread={40}
          glow={true}
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
          "p-5 text-slate-100 backdrop-blur-xl",
          "sm:p-6 lg:p-8"
        )}
      >
        {children}
      </Card>
    </div>
  );
}

/* ------------------------------------------ */
/*                 Card Header                */
/* ------------------------------------------ */

function ModuleHeader({
  index,
  label,
  title,
  icon: Icon,
}: {
  index: string;
  label: string;
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-emerald-400">
          {index} / {label}
        </span>

        <h3 className="font-heading text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          {title}
        </h3>
      </div>

      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
        <Icon
          className="size-5 text-emerald-400"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------ */
/*              Knowledge Map Node            */
/* ------------------------------------------ */

function KnowledgeNode({
  module,
  active,
  onSelect,
}: {
  module: KnowledgeModule;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = module.icon;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-controls="knowledge-details"
      data-track="knowledge_node"
      data-target={module.id}
      onClick={onSelect}
      className={cn(
        "group relative z-10 flex w-full min-w-0",
        "items-center gap-2 rounded-xl border",
        "px-3 py-3 text-left",
        "transition-all duration-300",
        "focus-visible:outline-2",
        "focus-visible:outline-offset-2",
        "focus-visible:outline-emerald-400",
        active
          ? "border-emerald-400/60 bg-[#123328] text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.1)]"
          : "border-white/10 bg-[#0E171B] text-slate-400 hover:border-emerald-400/30 hover:text-slate-100"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active
            ? "text-emerald-300"
            : "text-slate-500 group-hover:text-emerald-400"
        )}
        aria-hidden="true"
      />

      <span className="min-w-0 flex-1 wrap-break-word font-sans text-xs font-medium sm:text-sm">
        {module.title}
      </span>

      {active && (
        <span className="size-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
      )}
    </button>
  );
}

/* ------------------------------------------ */
/*               Knowledge Core               */
/* ------------------------------------------ */

function KnowledgeCore() {
  return (
    <div
      aria-hidden="true"
      className="relative flex size-32 shrink-0 items-center justify-center sm:size-40"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-4 rounded-full bg-emerald-400/15 blur-3xl" />

      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-full border border-emerald-400/10" />

      {/* Animated Ring */}
      <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/25 motion-safe:animate-[spin_35s_linear_infinite]">
        <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34D399]" />
      </div>

      {/* Inner Ring */}
      <div className="absolute inset-5 rounded-full border border-emerald-400/15" />

      {/* Central Hexagon */}
      <svg
        viewBox="0 0 120 120"
        className="relative size-28 sm:size-32"
        fill="none"
      >
        <path
          d="M60 6 L107 33 V87 L60 114 L13 87 V33 Z"
          fill="#0D231D"
          stroke="#34D399"
          strokeOpacity="0.8"
          strokeWidth="1.5"
        />

        <path
          d="M60 17 L97 39 V81 L60 103 L23 81 V39 Z"
          stroke="#34D399"
          strokeOpacity="0.2"
        />
      </svg>

      {/* Core Text */}
      <div className="absolute flex flex-col items-center gap-1">
        <Hexagon className="size-6 text-emerald-400" />

        <span className="font-heading text-xl font-bold tracking-tight text-slate-100">
          SONIA
        </span>

        <span className="font-mono text-[7px] tracking-widest text-emerald-400">
          KNOWLEDGE CORE
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------ */
/*               Knowledge Map                */
/* ------------------------------------------ */

function KnowledgeMap() {
  const [activeModule, setActiveModule] = useState(0);

  const reduceMotion = useReducedMotion();

  const selectedModule = knowledgeModules[activeModule];

  return (
    <NexusCard className="w-full lg:flex-3">
      <ModuleHeader
        index="01"
        label="Knowledge Map"
        title="Connected capabilities"
        icon={Network}
      />

      <p className="font-sans text-sm leading-relaxed text-slate-400">
        Explore the connections between professional knowledge,
        experience and leadership.
      </p>

      {/* Interactive Map */}
      <div
        role="group"
        aria-label="Explore knowledge modules"
        className="relative flex w-full flex-col items-center justify-center gap-4 py-5 md:flex-row md:gap-5"
      >
        {/* Desktop Connecting Lines */}
        <svg
          aria-hidden="true"
          viewBox="0 0 600 220"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden size-full md:block"
        >
          <path
            d="M95 50 C180 50 230 110 300 110"
            stroke="#34D399"
            strokeWidth="1"
            strokeOpacity={activeModule === 0 ? 0.9 : 0.2}
            strokeDasharray="4 5"
            fill="none"
          />

          <path
            d="M95 170 C180 170 230 110 300 110"
            stroke="#34D399"
            strokeWidth="1"
            strokeOpacity={activeModule === 3 ? 0.9 : 0.2}
            strokeDasharray="4 5"
            fill="none"
          />

          <path
            d="M505 50 C420 50 370 110 300 110"
            stroke="#34D399"
            strokeWidth="1"
            strokeOpacity={activeModule === 1 ? 0.9 : 0.2}
            strokeDasharray="4 5"
            fill="none"
          />

          <path
            d="M505 170 C420 170 370 110 300 110"
            stroke="#34D399"
            strokeWidth="1"
            strokeOpacity={activeModule === 2 ? 0.9 : 0.2}
            strokeDasharray="4 5"
            fill="none"
          />
        </svg>

        {/* Left Nodes */}
        <div className="order-2 flex w-full min-w-0 flex-col gap-3 min-[400px]:flex-row md:order-1 md:flex-1 md:flex-col md:gap-10">
          <KnowledgeNode
            module={knowledgeModules[0]}
            active={activeModule === 0}
            onSelect={() => setActiveModule(0)}
          />

          <KnowledgeNode
            module={knowledgeModules[3]}
            active={activeModule === 3}
            onSelect={() => setActiveModule(3)}
          />
        </div>

        {/* Central Core */}
        <div className="order-1 flex shrink-0 items-center justify-center md:order-2">
          <KnowledgeCore />
        </div>

        {/* Right Nodes */}
        <div className="order-3 flex w-full min-w-0 flex-col gap-3 min-[400px]:flex-row md:flex-1 md:flex-col md:gap-10">
          <KnowledgeNode
            module={knowledgeModules[1]}
            active={activeModule === 1}
            onSelect={() => setActiveModule(1)}
          />

          <KnowledgeNode
            module={knowledgeModules[2]}
            active={activeModule === 2}
            onSelect={() => setActiveModule(2)}
          />
        </div>
      </div>

      {/* Entrepreneurship Node */}
      <div className="flex w-full justify-center">
        <div className="w-full sm:max-w-60">
          <KnowledgeNode
            module={knowledgeModules[4]}
            active={activeModule === 4}
            onSelect={() => setActiveModule(4)}
          />
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Dynamic Knowledge Details */}
      <div
        id="knowledge-details"
        aria-live="polite"
        className="relative flex min-h-48 flex-1 flex-col rounded-2xl border border-emerald-400/10 bg-[#0D1716] p-5"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedModule.id}
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 0, y: -8 }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.2,
            }}
            className="flex flex-col gap-4"
          >
            <span className="font-mono text-[10px] tracking-widest text-emerald-400">
              KNOWLEDGE MODULE // {selectedModule.id}
            </span>

            <h4 className="font-heading text-xl font-semibold text-slate-100 sm:text-2xl">
              {selectedModule.heading}
            </h4>

            <p className="font-sans text-sm leading-relaxed text-slate-400">
              {selectedModule.description}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {selectedModule.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-md border-emerald-400/15 bg-emerald-400/5 px-3 py-1 font-mono text-[10px] text-emerald-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {selectedModule.sourceUrl && (
              <a
                href={selectedModule.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
              >
                View source
                <ArrowUpRight className="size-4" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </NexusCard>
  );
}

/* ------------------------------------------ */
/*               Leadership Lens              */
/* ------------------------------------------ */

function LeadershipLens() {
  const [selectedLeadership, setSelectedLeadership] =
    useState<LeadershipModule | null>(null);

  return (
    <>
      <NexusCard
        id="leadership"
        className="w-full lg:flex-2"
      >
        <ModuleHeader
          index="02"
          label="Leadership Lens"
          title="Leadership in Action."
          icon={Compass}
        />

        <p className="font-sans text-sm leading-relaxed text-slate-400">
          Discover the professional responsibilities, experiences
          and perspectives behind leadership.
        </p>

        {/* Leadership Modules */}
        <div className="flex flex-1 flex-col gap-3">
          {leadershipModules.map((module) => {
            const Icon = module.icon;

            return (
              <button
                key={module.id}
                type="button"
                aria-haspopup="dialog"
                data-track="leadership_open"
                data-target={module.id}
                onClick={() =>
                  setSelectedLeadership(module)
                }
                className={cn(
                  "group relative flex w-full",
                  "items-center gap-3 rounded-2xl border",
                  "border-white/5 bg-[#0D1716]",
                  "p-4 text-left",
                  "transition-all duration-300",
                  "hover:border-emerald-400/30",
                  "hover:bg-emerald-400/5",
                  "focus-visible:outline-2",
                  "focus-visible:outline-emerald-400"
                )}
              >
                {/* Module Icon */}
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/5 transition-colors group-hover:bg-emerald-400/10">
                  <Icon
                    className="size-5 text-emerald-400"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>

                {/* Module Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-heading text-sm font-semibold text-slate-100 transition-colors group-hover:text-emerald-300 sm:text-base">
                    {module.title}
                  </span>

                  <span className="font-sans text-xs leading-relaxed text-slate-400">
                    {module.description}
                  </span>
                </div>

                <ArrowUpRight className="size-4 shrink-0 text-slate-500 transition-all group-hover:text-emerald-400 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-4">
          <span className="font-mono text-[10px] tracking-wider text-slate-500">
            LEADERSHIP MODULE
          </span>

          <span className="flex items-center gap-2 font-mono text-[10px] text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            EXPLORE
          </span>
        </div>
      </NexusCard>

      {/* Leadership Details Dialog */}
      <Dialog
        open={selectedLeadership !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLeadership(null);
          }
        }}
      >
        <DialogContent
          className={cn(
            "max-h-[85dvh] overflow-y-auto",
            "border-emerald-400/20 bg-[#121A20]",
            "p-6 text-slate-100",
            "sm:max-w-lg sm:p-8"
          )}
        >
          {selectedLeadership && (
            <div className="flex flex-col gap-6">
              <DialogHeader className="flex flex-col gap-4 text-left">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                  <selectedLeadership.icon
                    className="size-7 text-emerald-400"
                    strokeWidth={1.5}
                  />
                </div>

                <span className="font-mono text-[10px] tracking-widest text-emerald-400">
                  LEADERSHIP LENS // {selectedLeadership.id}
                </span>

                <DialogTitle className="font-heading text-2xl text-slate-100 sm:text-3xl">
                  {selectedLeadership.title}
                </DialogTitle>

                <DialogDescription className="font-sans leading-relaxed text-slate-400">
                  {selectedLeadership.description}
                </DialogDescription>
              </DialogHeader>

              <Separator className="bg-white/10" />

              <p className="font-sans text-sm leading-relaxed text-slate-300">
                {selectedLeadership.details}
              </p>

              {selectedLeadership.sourceUrl && (
                <a
                  href={selectedLeadership.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-400"
                >
                  View professional source
                  <ArrowUpRight className="size-4" />
                </a>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedLeadership(null)}
                className="w-full border-white/10 bg-white/5 text-slate-200 hover:bg-emerald-400/10 hover:text-emerald-300 sm:w-fit"
              >
                Continue Exploring
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------------------ */
/*              Philosophy Card               */
/* ------------------------------------------ */

function PhilosophyCard() {
  return (
    <NexusCard className="w-full md:flex-1">
      <ModuleHeader
        index="03"
        label="The Philosophy"
        title="Think differently."
        icon={Quote}
      />

      <div className="relative flex flex-1 flex-col justify-center gap-4">
        <Quote
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 size-24 text-emerald-400/5"
        />

        <blockquote className="max-w-lg font-heading text-2xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
          Do More by{" "}
          <span className="text-emerald-400">
            Doing Less™
          </span>
        </blockquote>

        <p className="max-w-md font-sans text-sm leading-relaxed text-slate-400">
          An approach that emphasizes thoughtful problem-solving,
          intelligent use of technology and making the most of
          available resources.
        </p>

        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          The i-SmokeStack Philosophy
        </span>
      </div>

      <Link
        href="#ideas"
        data-track="navigation_click"
        data-target="ideas"
        className="group flex w-fit items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
      >
        Explore the Philosophy
        <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </Link>
    </NexusCard>
  );
}

/* ------------------------------------------ */
/*               AI Discovery Card            */
/* ------------------------------------------ */

function DiscoveryCard() {
  return (
    <NexusCard className="w-full md:flex-1">
      {/* Decorative Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-emerald-400/10 blur-[80px]"
      />

      <ModuleHeader
        index="04"
        label="Intelligent Discovery"
        title="Ask Intelligence."
        icon={Sparkles}
      />

      <div className="relative flex flex-1 flex-col justify-center gap-4">
        <h4 className="max-w-lg font-heading text-2xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
          Curiosity starts with{" "}
          <span className="text-emerald-400">
            a question.
          </span>
        </h4>

        <p className="max-w-md font-sans text-sm leading-relaxed text-slate-400">
          Discover professional experiences, leadership and
          expertise through an intelligent conversational
          experience.
        </p>

        {/* Suggested Question */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-[#0D1716] p-3">
          <Sparkles className="size-4 shrink-0 text-emerald-400" />

          <span className="font-sans text-xs text-slate-400 sm:text-sm">
            What is Sonia&apos;s professional background?
          </span>
        </div>
      </div>

      <Link
        href="#ai"
        data-track="navigation_click"
        data-target="ai"
        className={cn(
          buttonVariants({ size: "lg" }),
          "group w-full rounded-xl sm:w-fit",
          "bg-emerald-400 font-semibold text-slate-950",
          "hover:bg-emerald-300"
        )}
      >
        Explore with AI

        <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
      </Link>
    </NexusCard>
  );
}

/* ------------------------------------------ */
/*           Main Expertise Section           */
/* ------------------------------------------ */

export default function Expertise() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      className={cn(
        "relative isolate flex w-full flex-col",
        "items-center justify-center overflow-hidden",
        "bg-[#080C10] px-4 py-20",
        "text-slate-100 sm:px-6",
        "lg:px-8 lg:py-28"
      )}
    >
      {/* Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[140px]"
      />

      {/* Main Container */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:gap-16">
        {/* Section Introduction */}
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
          className="flex w-full max-w-3xl flex-col items-center gap-5 text-center"
        >
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-2 rounded-full",
              "border-emerald-400/20",
              "bg-emerald-400/5 px-4 py-2",
              "font-mono text-[10px] tracking-widest",
              "text-emerald-300"
            )}
          >
            <Network className="size-3.5" />

            02 // THE INTELLIGENCE NEXUS
          </Badge>

          <h2
            id="expertise-heading"
            className={cn(
              "font-heading font-bold leading-tight",
              "tracking-[-0.04em]",
              "text-[clamp(2.25rem,5vw,4.5rem)]"
            )}
          >
            Beyond{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Expertise.
            </span>
          </h2>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
            Knowledge creates possibilities. Leadership gives
            them direction. Explore the intersection of experience,
            expertise and professional perspective.
          </p>
        </motion.div>

        {/* Bento Layout - Flexbox Only */}
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 25 }
          }
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.7,
          }}
          className="flex w-full flex-col gap-5 sm:gap-6"
        >
          {/* First Row - 60:40 Layout */}
          <div className="flex w-full flex-col items-stretch gap-5 sm:gap-6 lg:flex-row">
            <KnowledgeMap />

            <LeadershipLens />
          </div>

          {/* Second Row - 50:50 Layout */}
          <div className="flex w-full flex-col items-stretch gap-5 sm:gap-6 md:flex-row">
            <PhilosophyCard />

            <DiscoveryCard />
          </div>
        </motion.div>

        {/* Section Footer */}
        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 sm:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // INTELLIGENCE MODULE
          </span>

          <Link
            href="#ideas"
            data-track="navigation_click"
            data-target="ideas"
            className="group flex items-center gap-2 font-mono text-xs tracking-wider text-emerald-400 hover:text-emerald-300"
          >
            CONTINUE EXPLORING

            <ArrowDown className="size-4 transition-transform motion-safe:group-hover:translate-y-1" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />

            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              KNOWLEDGE MODULE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}