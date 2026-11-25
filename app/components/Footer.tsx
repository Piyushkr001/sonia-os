"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUp,
  ArrowUpRight,
  Fingerprint,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Network,
  Lightbulb,
  Compass,
  MessageCircle,
  Code2,
} from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import {
  Button,
  buttonVariants,
} from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Aceternity UI
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Magic UI
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

import { cn } from "@/lib/utils";

/* ------------------------------------------ */
/*              Footer Navigation             */
/* ------------------------------------------ */

const exploreLinks = [
  {
    title: "Identity Nexus",
    href: "#explore",
    icon: Compass,
  },
  {
    title: "Professional Journey",
    href: "#journey",
    icon: GitBranch,
  },
  {
    title: "Expertise & Leadership",
    href: "#expertise",
    icon: Network,
  },
  {
    title: "Ideas & Philosophy",
    href: "#ideas",
    icon: Lightbulb,
  },
];

const interactionLinks = [
  {
    title: "Ask Intelligence",
    href: "#ai",
    icon: Sparkles,
  },
  {
    title: "Connection Portal",
    href: "#connect",
    icon: MessageCircle,
  },
];

/* ------------------------------------------ */
/*                 Closing CTA                */
/* ------------------------------------------ */

function ClosingCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex w-full flex-col rounded-3xl border border-emerald-400/15 p-1">
      {/* Aceternity Glowing Effect */}

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

      <div
        className={cn(
          "relative flex w-full flex-col",
          "items-start justify-between gap-6",
          "overflow-hidden rounded-[20px]",
          "border border-white/5 bg-[#121A20]",
          "p-6 sm:p-8 lg:p-10",
          "md:flex-row md:items-center"
        )}
      >
        {/* Decorative Background */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-emerald-400/10 blur-[100px]"
        />

        {/* Magic UI Border Beam */}

        {!reduceMotion && (
          <BorderBeam
            size={180}
            duration={12}
            colorFrom="#34D399"
            colorTo="#A7F3D0"
            className="pointer-events-none"
          />
        )}

        {/* CTA Content */}

        <div className="relative flex min-w-0 flex-1 flex-col gap-4">
          <Badge
            variant="outline"
            className={cn(
              "w-fit gap-2 rounded-full",
              "border-emerald-400/20",
              "bg-emerald-400/5 px-3 py-1.5",
              "font-mono text-[10px]",
              "tracking-wider text-emerald-300"
            )}
          >
            <Fingerprint className="size-3.5" />

            06 // THE DIGITAL SIGNATURE
          </Badge>

          <h2 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-3xl lg:text-4xl">
            The exploration{" "}

            <span className="text-emerald-400">
              doesn&apos;t end here.
            </span>
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Every question opens a possibility.
            Every connection creates an opportunity.
            Continue exploring what comes next.
          </p>
        </div>

        {/* CTA Button */}

        <Link
          href="#connect"
          data-track="footer_action"
          data-target="connect"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group relative h-12 w-full shrink-0",
            "rounded-xl bg-emerald-400 px-6",
            "font-semibold text-slate-950",
            "hover:bg-emerald-300 md:w-fit",
            "shadow-[0_0_25px_rgba(52,211,153,0.12)]"
          )}
        >
          Let&apos;s Connect

          <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------ */
/*              Footer Navigation             */
/* ------------------------------------------ */

function FooterNavigation({
  title,
  links,
}: {
  title: string;
  links: typeof exploreLinks;
}) {
  return (
    <nav
      aria-label={`Footer ${title}`}
      className="flex min-w-0 flex-1 flex-col gap-5"
    >
      <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
        {title}
      </h3>

      <ul className="flex flex-col gap-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                data-track="footer_action"
                data-target={link.href.slice(1)}
                className={cn(
                  "group flex w-fit items-center gap-3",
                  "text-sm leading-relaxed text-slate-400",
                  "transition-colors duration-200",
                  "hover:text-emerald-300"
                )}
              >
                <Icon className="size-4 shrink-0 text-slate-500 transition-colors group-hover:text-emerald-400" />

                <span className="motion-safe:transition-transform motion-safe:group-hover:translate-x-1">
                  {link.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ------------------------------------------ */
/*                Brand Identity              */
/* ------------------------------------------ */

function BrandIdentity() {
  return (
    <div className="flex w-full flex-col items-start gap-6 lg:max-w-sm lg:flex-1">
      {/* Existing SONIA.OS Logo */}

      <Link
        href="#explore"
        data-track="footer_action"
        data-target="explore"
        aria-label="SONIA.OS — Return to explore"
        className="w-fit"
      >
        <Image
          src="/Images/logo.svg"
          alt="SONIA.OS"
          width={210}
          height={62}
          className="h-14 w-auto object-contain object-left"
        />
      </Link>

      <p className="max-w-sm font-sans text-sm leading-relaxed text-slate-400">
        An independent digital experience exploring
        professional identity, leadership, ideas and
        possibilities beyond the conventional profile.
      </p>

      {/* Brand Philosophy */}

      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Inspired by
        </span>

        <p className="font-heading text-lg font-semibold text-slate-200">
          Do More by{" "}

          <span className="text-emerald-400">
            Doing Less™
          </span>
        </p>
      </div>

      {/* Exploration Indicator */}

      <Badge
        variant="outline"
        className={cn(
          "w-fit gap-2 rounded-full",
          "border-emerald-400/15",
          "bg-emerald-400/5 px-3 py-1.5",
          "font-mono text-[10px]",
          "tracking-wider text-emerald-300"
        )}
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />

          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>

        EXPLORATION READY
      </Badge>
    </div>
  );
}

/* ------------------------------------------ */
/*               Privacy & AI Notice          */
/* ------------------------------------------ */

function PrivacyNotice() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-track="footer_action"
        data-target="privacy"
        className="group flex w-fit items-center gap-3 text-left text-sm text-slate-400 transition-colors hover:text-emerald-300"
      >
        <ShieldCheck className="size-4 shrink-0 text-slate-500 group-hover:text-emerald-400" />

        Privacy &amp; AI Notice
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "max-h-[85dvh] overflow-y-auto",
            "border-emerald-400/20",
            "bg-[#121A20] p-6 text-slate-100",
            "sm:max-w-lg sm:p-8"
          )}
        >
          <DialogHeader className="flex flex-col gap-4 text-left">
            <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <ShieldCheck className="size-6 text-emerald-400" />
            </div>

            <DialogTitle className="font-heading text-2xl">
              Privacy &amp; AI Notice
            </DialogTitle>

            <DialogDescription className="leading-relaxed text-slate-400">
              Understanding how information is used
              within the SONIA.OS experience.
            </DialogDescription>
          </DialogHeader>

          <Separator className="bg-white/10" />

          <div className="flex flex-col gap-5">
            {/* Independent Experience */}

            <div className="flex flex-col gap-2">
              <h4 className="font-heading font-semibold text-emerald-300">
                Independent Experience
              </h4>

              <p className="text-sm leading-relaxed text-slate-400">
                SONIA.OS is an independently developed
                digital experience created for the
                i-SmokeStack developer hiring challenge.
                It is not an official i-SmokeStack website.
              </p>
            </div>

            {/* AI Transparency */}

            <div className="flex flex-col gap-2">
              <h4 className="font-heading font-semibold text-emerald-300">
                Artificial Intelligence
              </h4>

              <p className="text-sm leading-relaxed text-slate-400">
                Ask Intelligence uses Google Gemini
                and a curated application knowledge base.
                It acts as a guide and does not impersonate
                Sonia. AI-generated responses may contain
                inaccuracies; always check listed sources.
                Your question and up to 8 recent turns
                of the current chat are transmitted to
                Google Gemini to generate an answer.
              </p>
            </div>

            {/* Engagement Analytics */}

            <div className="flex flex-col gap-2">
              <h4 className="font-heading font-semibold text-emerald-300">
                Engagement Analytics
              </h4>

              <p className="text-sm leading-relaxed text-slate-400">
                Optional engagement tracking starts only
                after you explicitly enable it via the
                consent prompt or the analytics control
                below the footer. When enabled, a random
                browser-session identifier, viewport
                category (mobile, tablet or desktop),
                deduplicated section views, selected
                feature interactions and estimated
                visible-page duration (15-second
                heartbeats paused when the tab is hidden)
                are batched and stored in Neon PostgreSQL.
              </p>

              <p className="text-sm leading-relaxed text-slate-400">
                Engagement events do not include your
                chat text, contact form details, full
                URLs or raw IP addresses. Disabling
                tracking clears your active browser
                session identifier and stops future
                collection, without deleting previously
                recorded aggregate events.
              </p>
            </div>

            {/* Operational Metadata & Security */}

            <div className="flex flex-col gap-2">
              <h4 className="font-heading font-semibold text-emerald-300">
                Operational Metadata &amp; Rate Limiting
              </h4>

              <p className="text-sm leading-relaxed text-slate-400">
                To enforce quotas and protect API routes
                from abuse, operational AI metadata
                (topic classification, outcome status,
                response duration and daily counts) and
                temporary rate-limit buckets using
                one-way hashed client identifiers (never
                raw IP addresses) are stored regardless of
                optional analytics preferences. Chat
                transcripts are not saved in the
                application database.
              </p>
            </div>

            {/* Connection Requests & Retention */}

            <div className="flex flex-col gap-2">
              <h4 className="font-heading font-semibold text-emerald-300">
                Connection Requests &amp; Retention
              </h4>

              <p className="text-sm leading-relaxed text-slate-400">
                Details submitted through the Connection
                Portal are stored in Neon PostgreSQL and,
                when email notifications are enabled,
                forwarded to the configured authorized
                recipient via SMTP. Records are retained
                for challenge review and operational
                monitoring; automated purging is not
                currently enabled. Avoid submitting
                confidential or sensitive personal
                information.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full rounded-xl bg-emerald-400 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Close Notice
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------------------------ */
/*              Digital Signature             */
/* ------------------------------------------ */

function DigitalSignature() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Magic UI Animated Grid */}

      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <AnimatedGridPattern
            numSquares={20}
            maxOpacity={0.1}
            duration={5}
            repeatDelay={1}
            className={cn(
              "inset-0 size-full",
              "fill-emerald-400/15",
              "stroke-emerald-400/10",
              "mask-[radial-gradient(ellipse_at_center,white,transparent_75%)]"
            )}
          />
        </div>
      )}

      {/* Ambient Glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-[120px]"
      />

      {/* Oversized Brand Typography */}

      <motion.div
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 25 }
        }
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.8,
        }}
        className="flex w-full flex-col items-center gap-4"
      >
        <span
          aria-hidden="true"
          className={cn(
            "select-none whitespace-nowrap",
            "font-heading font-bold leading-none",
            "tracking-[-0.06em]",
            "text-[clamp(2.8rem,15vw,12rem)]",
            "bg-linear-to-b",
            "from-emerald-300/35",
            "via-emerald-400/15",
            "to-emerald-400/5",
            "bg-clip-text text-transparent"
          )}
        >
          SONIA.OS
        </span>

        {/* Signature Tagline */}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="h-px w-8 bg-emerald-400/30 sm:w-16" />

          <span className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-emerald-400 sm:text-xs sm:tracking-[0.35em]">
            Beyond the Profile
          </span>

          <span className="h-px w-8 bg-emerald-400/30 sm:w-16" />
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------ */
/*                  Main Footer               */
/* ------------------------------------------ */

const emptySubscribe = () => () => {};
const getClientYear = () => new Date().getFullYear();
const getServerYear = () => 2026;

export default function Footer() {
  const reduceMotion = useReducedMotion();

  const currentYear = useSyncExternalStore(
    emptySubscribe,
    getClientYear,
    getServerYear
  );

  return (
    <footer
      id="footer"
      className={cn(
        "relative isolate flex w-full flex-col",
        "items-center overflow-hidden",
        "border-t border-emerald-400/10",
        "bg-[#080C10] px-4 pb-6 pt-12",
        "text-slate-100 sm:px-6",
        "lg:px-8 lg:pt-16"
      )}
    >
      {/* Ambient Background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      {/* Main Footer Container */}

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 lg:gap-14">
        {/* Closing CTA */}

        <ClosingCTA />

        {/* Main Footer Content */}

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
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
          }}
          className="flex w-full flex-col items-start gap-10 lg:flex-row lg:justify-between lg:gap-12"
        >
          {/* Brand Information */}

          <BrandIdentity />

          {/* Footer Navigation */}

          <div className="flex w-full flex-col items-start gap-8 sm:flex-row lg:w-auto lg:flex-1 lg:gap-12">
            {/* Explore Links */}

            <FooterNavigation
              title="Explore"
              links={exploreLinks}
            />

            {/* Interaction Links */}

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <FooterNavigation
                title="Interact"
                links={interactionLinks}
              />

              <PrivacyNotice />
            </div>
          </div>

          {/* Return to Top */}

          <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:flex-col lg:items-center">
            <Link
              href="#explore"
              data-track="footer_action"
              data-target="back_to_top"
              aria-label="Return to the top"
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "icon",
                }),
                "group size-12 shrink-0",
                "rounded-xl border-emerald-400/20",
                "bg-emerald-400/5 text-emerald-400",
                "hover:border-emerald-400/50",
                "hover:bg-emerald-400/10",
                "hover:text-emerald-300"
              )}
            >
              <ArrowUp className="size-5 transition-transform motion-safe:group-hover:-translate-y-1" />
            </Link>

            <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
              Back to Explore
            </span>
          </div>
        </motion.div>

        {/* Section Separator */}

        <Separator className="bg-white/5" />

        {/* Digital Signature Typography */}

        <DigitalSignature />

        {/* Copyright and Attribution */}

        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <p className="text-xs leading-relaxed text-slate-400">
              © {currentYear} SONIA.OS. Independent
              digital experience.
            </p>

            <p className="text-[11px] text-slate-500">
              Created for the i-SmokeStack Developer Challenge.
            </p>
          </div>

          {/* Development Signature */}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-emerald-400" />

              <span className="font-mono text-[10px] tracking-wider text-slate-500">
                DESIGNED WITH PURPOSE
              </span>
            </div>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <Badge
              variant="outline"
              className="border-emerald-400/15 bg-emerald-400/5 font-mono text-[9px] tracking-wider text-emerald-400"
            >
              V.01
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}