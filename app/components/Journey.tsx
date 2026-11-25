"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GitBranch,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { TracingBeam } from "@/components/ui/tracing-beam";
import { GlowingEffect } from "@/components/ui/glowing-effect";

import {
  journeyChapters,
  type JourneyChapter,
} from "@/data/journey";

import { cn } from "@/lib/utils";
import { trackEngagement } from "@/lib/analytics";

/* ----------------------------------------- */
/*             Chapter Details               */
/* ----------------------------------------- */

function ChapterDetails({
  chapter,
}: {
  chapter: JourneyChapter;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      {/* Chapter Label */}
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
        Chapter {chapter.id} {"//"} {chapter.title}
      </span>

      {/* Chapter Heading */}
      <h3 className="font-heading text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
        {chapter.heading}
      </h3>

      {/* Chapter Description */}
      <p className="font-sans text-sm leading-relaxed text-slate-300 sm:text-base">
        {chapter.description}
      </p>

      {/* Additional Details */}
      <p className="font-sans text-sm leading-relaxed text-slate-400">
        {chapter.details}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2">
        {chapter.tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={cn(
              "rounded-md border-emerald-400/15",
              "bg-emerald-400/5 px-3 py-1.5",
              "font-mono text-[10px]",
              "text-emerald-300"
            )}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Verified Source */}
      {chapter.sourceUrl && (
        <a
          href={chapter.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
        >
          View professional source
          <ArrowUpRight className="size-4" />
        </a>
      )}
    </div>
  );
}

/* ----------------------------------------- */
/*             Chapter Visual                */
/* ----------------------------------------- */

function ChapterVisual({
  chapter,
}: {
  chapter: JourneyChapter;
}) {
  const Icon = chapter.icon;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex min-h-60 w-full shrink-0",
        "flex-col items-center justify-center gap-5",
        "overflow-hidden rounded-2xl",
        "border border-emerald-400/10",
        "bg-[#0D1716] p-6",
        "lg:w-64"
      )}
    >
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#34d39908_1px,transparent_1px),linear-gradient(to_bottom,#34d39908_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Glow */}
      <div className="absolute size-32 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Chapter Orb */}
      <div className="relative flex size-36 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-400/15" />

        <div className="absolute inset-3 rounded-full border border-dashed border-emerald-400/25 motion-safe:animate-[spin_30s_linear_infinite]">
          <span className="absolute -top-1 left-1/2 size-2 rounded-full bg-emerald-400" />
        </div>

        <div className="absolute inset-6 rounded-full border border-emerald-400/20" />

        <div className="relative flex size-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_35px_rgba(52,211,153,0.1)]">
          <Icon
            className="size-9 text-emerald-300"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Chapter Number */}
      <div className="relative flex flex-col items-center gap-1">
        <span className="font-mono text-4xl font-semibold text-emerald-400">
          {chapter.id}
        </span>

        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
          Chapter Index
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------- */
/*             Main Journey Section          */
/* ----------------------------------------- */

export default function Journey() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [mobileCollapsed, setMobileCollapsed] =
    useState(false);

  const reduceMotion = useReducedMotion();

  const currentChapter = journeyChapters[activeChapter];

  const totalChapters = journeyChapters.length;

  const progress =
    totalChapters > 1
      ? (activeChapter / (totalChapters - 1)) * 100
      : 0;

  // Track deliberate chapter exploration, not initial renders or collapses.
  const selectChapter = (index: number) => {
    const chapter = journeyChapters[index];

    if (!chapter) return;

    const isNewExploration =
      index !== activeChapter || mobileCollapsed;

    setActiveChapter(index);
    setMobileCollapsed(false);

    if (isNewExploration) {
      trackEngagement("journey_chapter", chapter.id);
    }
  };

  const previousChapter = () => {
    if (activeChapter > 0) {
      selectChapter(activeChapter - 1);
    }
  };

  const nextChapter = () => {
    if (activeChapter < totalChapters - 1) {
      selectChapter(activeChapter + 1);
    }
  };

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
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

      {/* Ambient Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[140px]"
      />

      {/* Main Container */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:gap-16">
        {/* --------------------------------- */}
        {/*          Section Heading          */}
        {/* --------------------------------- */}

        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 20 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
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
              "font-mono text-[10px]",
              "tracking-widest text-emerald-300"
            )}
          >
            <GitBranch className="size-3.5" />

            01 // THE EVOLUTION
          </Badge>

          <h2
            id="journey-heading"
            className={cn(
              "font-heading font-bold leading-tight",
              "tracking-[-0.04em]",
              "text-[clamp(2.25rem,5vw,4.5rem)]"
            )}
          >
            Every Journey{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Evolves.
            </span>
          </h2>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
            A journey shaped by experiences, ideas and
            decisions. Explore the chapters behind the
            professional identity.
          </p>
        </motion.div>

        {/* --------------------------------- */}
        {/*          Desktop Timeline         */}
        {/* --------------------------------- */}

        <div className="hidden w-full flex-col gap-10 lg:flex">
          {/* Timeline Navigation */}
          <div
            role="group"
            aria-label="Select journey chapter"
            className="relative flex w-full items-start"
          >
            {/* Base Timeline Line */}
            <div
              aria-hidden="true"
              className="absolute left-[12.5%] right-[12.5%] top-8 h-0.5 bg-slate-800"
            >
              {/* Animated Progress Line */}
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-300"
                initial={false}
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.5,
                }}
              />
            </div>

            {/* Timeline Nodes */}
            {journeyChapters.map((chapter, index) => {
              const Icon = chapter.icon;

              const isActive = activeChapter === index;

              const isReached = index <= activeChapter;

              return (
                <button
                  key={chapter.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="journey-desktop-panel"
                  onClick={() => selectChapter(index)}
                  className={cn(
                    "group relative z-10 flex min-w-0",
                    "flex-1 flex-col items-center gap-4",
                    "rounded-xl px-2 text-center",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-4",
                    "focus-visible:outline-emerald-400"
                  )}
                >
                  {/* Milestone Icon */}
                  <div
                    className={cn(
                      "relative flex size-16 items-center",
                      "justify-center rounded-full border",
                      "transition-all duration-300",
                      isActive
                        ? "border-emerald-400 bg-[#123328] text-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.18)]"
                        : isReached
                          ? "border-emerald-400/40 bg-[#10241D] text-emerald-400"
                          : "border-slate-700 bg-[#121A20] text-slate-500 group-hover:border-emerald-400/40 group-hover:text-emerald-400"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border border-emerald-400/40 motion-safe:animate-ping" />
                    )}

                    <Icon
                      className="size-6"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Chapter Number */}
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-widest",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-500"
                    )}
                  >
                    CHAPTER {chapter.id}
                  </span>

                  {/* Chapter Title */}
                  <span
                    className={cn(
                      "font-heading text-base font-semibold",
                      "transition-colors xl:text-lg",
                      isActive
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-slate-100"
                    )}
                  >
                    {chapter.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* --------------------------------- */}
          {/*       Desktop Chapter Panel       */}
          {/* --------------------------------- */}

          <div
            id="journey-desktop-panel"
            aria-live="polite"
            className="relative rounded-3xl border border-emerald-400/10 p-1"
          >
            {/* Aceternity Glowing Effect */}
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={!!reduceMotion}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={1}
              movementDuration={0.5}
            />

            <Card
              className={cn(
                "relative flex w-full flex-col",
                "gap-8 rounded-[20px]",
                "border-white/5 bg-[#121A20]/95",
                "p-6 text-slate-100",
                "backdrop-blur-xl xl:p-8"
              )}
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={currentChapter.id}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, x: 12 }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={
                    reduceMotion
                      ? { opacity: 1 }
                      : { opacity: 0, x: -12 }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.25,
                  }}
                  className="flex w-full flex-col items-stretch gap-8 lg:flex-row lg:items-center"
                >
                  {/* Chapter Visual */}
                  <ChapterVisual
                    chapter={currentChapter}
                  />

                  {/* Chapter Content */}
                  <ChapterDetails
                    chapter={currentChapter}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Chapter Navigation Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-5">
                <span className="font-mono text-xs tracking-wider text-slate-500">
                  CHAPTER{" "}

                  <span className="text-emerald-400">
                    {currentChapter.id}
                  </span>

                  {" / "}

                  {String(totalChapters).padStart(2, "0")}
                </span>

                <div className="flex items-center gap-3">
                  {/* Previous */}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={activeChapter === 0}
                    onClick={previousChapter}
                    className={cn(
                      "h-10 rounded-xl",
                      "border-white/10 bg-white/5",
                      "text-slate-300",
                      "hover:border-emerald-400/30",
                      "hover:bg-emerald-400/10",
                      "hover:text-emerald-300"
                    )}
                  >
                    <ArrowLeft className="size-4" />

                    Previous
                  </Button>

                  {/* Next */}
                  <Button
                    type="button"
                    disabled={
                      activeChapter === totalChapters - 1
                    }
                    onClick={nextChapter}
                    className={cn(
                      "h-10 rounded-xl",
                      "bg-emerald-400 font-semibold",
                      "text-slate-950",
                      "hover:bg-emerald-300"
                    )}
                  >
                    Next Chapter

                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* --------------------------------- */}
        {/*     Mobile and Tablet Timeline    */}
        {/* --------------------------------- */}

        <div className="flex w-full flex-col pl-5 lg:hidden">
          <TracingBeam className="w-full max-w-none">
            <Accordion
              value={
                mobileCollapsed ? [] : [currentChapter.id]
              }
              onValueChange={(value) => {
                if (value.length === 0) {
                  setMobileCollapsed(true);
                  return;
                }

                const nextIndex = journeyChapters.findIndex(
                  (chapter) => chapter.id === value[0]
                );

                if (nextIndex !== -1) {
                  selectChapter(nextIndex);
                }
              }}
              className="flex w-full flex-col gap-5"
            >
              {journeyChapters.map((chapter, index) => {
                const Icon = chapter.icon;

                const isActive =
                  !mobileCollapsed &&
                  activeChapter === index;

                return (
                  <div
                    key={chapter.id}
                    className={cn(
                      "relative rounded-2xl border p-1",
                      "transition-colors duration-300",
                      isActive
                        ? "border-emerald-400/30"
                        : "border-white/5"
                    )}
                  >
                    {isActive && (
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={!!reduceMotion}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={1}
                      />
                    )}

                    <AccordionItem
                      value={chapter.id}
                      className="border-none"
                    >
                      <Card className="relative flex flex-col gap-0 overflow-hidden rounded-xl border-white/5 bg-[#121A20] p-0 text-slate-100">
                        {/* Mobile Chapter Trigger */}
                        <AccordionTrigger
                          className={cn(
                            "flex w-full items-center gap-3",
                            "rounded-xl p-4 text-left hover:no-underline sm:p-5",
                            "focus-visible:ring-0 focus-visible:outline-2",
                            "focus-visible:outline-emerald-400",
                            "**:data-[slot=accordion-trigger-icon]:size-5",
                            isActive
                              ? "**:data-[slot=accordion-trigger-icon]:text-emerald-400"
                              : "**:data-[slot=accordion-trigger-icon]:text-slate-500"
                          )}
                        >
                          {/* Chapter Icon */}
                          <div
                            className={cn(
                              "flex size-12 shrink-0",
                              "items-center justify-center",
                              "rounded-xl border",
                              isActive
                                ? "border-emerald-400/30 bg-emerald-400/10"
                                : "border-white/10 bg-white/5"
                            )}
                          >
                            <Icon
                              className={cn(
                                "size-5",
                                isActive
                                  ? "text-emerald-400"
                                  : "text-slate-400"
                              )}
                            />
                          </div>

                          {/* Chapter Information */}
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="font-mono text-[10px] tracking-wider text-emerald-400">
                              CHAPTER {chapter.id}
                            </span>

                            <span className="wrap-break-word font-heading text-base font-semibold text-slate-100 sm:text-lg">
                              {chapter.title}
                            </span>

                            <span className="text-xs font-normal text-slate-400 sm:text-sm">
                              {chapter.subtitle}
                            </span>
                          </div>
                        </AccordionTrigger>

                        {/* Expanded Chapter Content */}
                        <AccordionContent className="border-t border-white/5 p-4 sm:p-6">
                          <ChapterDetails
                            chapter={chapter}
                          />
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  </div>
                );
              })}
            </Accordion>
          </TracingBeam>
        </div>

        {/* --------------------------------- */}
        {/*          Section Footer           */}
        {/* --------------------------------- */}

        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 sm:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // JOURNEY MODULE
          </span>

          <a
            href="#expertise"
            data-track="navigation_click"
            data-target="expertise"
            className="group flex items-center gap-2 font-mono text-xs tracking-wide text-emerald-400 transition-colors hover:text-emerald-300"
          >
            CONTINUE EXPLORING

            <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </a>

          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />

            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              JOURNEY MODULE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}