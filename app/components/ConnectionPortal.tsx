"use client";

import Link from "next/link";
import axios from "axios";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  Handshake,
  LoaderCircle,
  Mail,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Send,
  Copy,
  Check,
} from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Aceternity UI
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Magic UI
import { BorderBeam } from "@/components/ui/border-beam";

// Data
import {
  connectionOptions,
  type ConnectionIntent,
} from "@/data/connection";

// Validation
import {
  contactFormSchema,
  type ContactFormData,
  type ContactResponse,
} from "@/lib/contact-schema";

// API Service
import {
  submitConnectionRequest,
} from "@/services/contact.service";

import { cn } from "@/lib/utils";
import { trackEngagement } from "@/lib/analytics";

/* ------------------------------------------ */
/*               Initial Form State           */
/* ------------------------------------------ */

const initialForm: ContactFormData = {
  intent: "collaboration",

  name: "",
  email: "",
  organization: "",
  message: "",

  consent: false,
  website: "",
};

type FormErrors = Partial<
  Record<keyof ContactFormData, string>
>;

/* ------------------------------------------ */
/*               Portal Card Wrapper          */
/* ------------------------------------------ */

function PortalCard({
  children,
  className,
  animatedBorder = false,
}: {
  children: ReactNode;
  className?: string;
  animatedBorder?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col",
        "rounded-3xl border",
        "border-emerald-400/10 p-1",
        className
      )}
    >
      {/* Aceternity Interactive Glow */}

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

      <Card
        className={cn(
          "relative flex h-full flex-1 flex-col",
          "gap-6 overflow-hidden",
          "rounded-[20px]",
          "border-white/5 bg-[#121A20]/95",
          "p-5 text-slate-100",
          "sm:p-6 lg:p-8"
        )}
      >
        {children}

        {/* Magic UI Animated Border */}

        {animatedBorder && !reduceMotion && (
          <BorderBeam
            size={160}
            duration={10}
            colorFrom="#34D399"
            colorTo="#A7F3D0"
            className="pointer-events-none"
          />
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------ */
/*               Connection Intent            */
/* ------------------------------------------ */

function ConnectionIntentSelector({
  selected,
  onSelect,
  disabled,
}: {
  selected: ConnectionIntent;
  onSelect: (intent: ConnectionIntent) => void;
  disabled: boolean;
}) {
  return (
    <PortalCard className="w-full lg:flex-2">
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] tracking-widest text-emerald-400">
            01 / CONNECTION INTENT
          </span>

          <h3 className="font-heading text-2xl font-semibold leading-tight sm:text-3xl">
            Let&apos;s create possibilities.
          </h3>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
          <Handshake className="size-5 text-emerald-400" />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-400">
        Meaningful conversations begin with a purpose.
        Choose what brings you here today.
      </p>

      {/* Connection Categories */}

      <div
        role="group"
        aria-label="Select connection intent"
        className="flex flex-1 flex-col gap-3"
      >
        {connectionOptions.map((option) => {
          const Icon = option.icon;

          const active =
            selected === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              data-track="connection_intent"
              data-target={option.id}
              onClick={() => onSelect(option.id)}
              className={cn(
                "group flex w-full items-center gap-3",
                "rounded-2xl border p-4 text-left",
                "transition-all duration-300",
                "focus-visible:outline-2",
                "focus-visible:outline-emerald-400",
                "disabled:cursor-not-allowed",
                "disabled:opacity-60",

                active
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : "border-white/5 bg-[#0D1716] hover:border-emerald-400/25 hover:bg-emerald-400/5"
              )}
            >
              {/* Category Icon */}

              <div
                className={cn(
                  "flex size-11 shrink-0",
                  "items-center justify-center",
                  "rounded-xl border",

                  active
                    ? "border-emerald-400/25 bg-emerald-400/10"
                    : "border-white/5 bg-white/5"
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-5",

                    active
                      ? "text-emerald-400"
                      : "text-slate-400 group-hover:text-emerald-400"
                  )}
                />
              </div>

              {/* Category Details */}

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  className={cn(
                    "font-heading text-sm font-semibold sm:text-base",

                    active
                      ? "text-emerald-300"
                      : "text-slate-100"
                  )}
                >
                  {option.title}
                </span>

                <span className="text-xs leading-relaxed text-slate-400">
                  {option.description}
                </span>
              </div>

              {active ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
              ) : (
                <ArrowUpRight className="size-4 shrink-0 text-slate-500 transition-colors group-hover:text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      <Separator className="bg-white/5" />

      {/* Privacy Information */}

      <div className="flex flex-col gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-400" />

          <span className="font-heading text-sm font-medium text-emerald-300">
            Purpose-driven connection
          </span>
        </div>

        <p className="text-xs leading-relaxed text-slate-400">
          Your details are collected to process your
          connection request. Please avoid including
          confidential or sensitive personal information.
        </p>
      </div>
    </PortalCard>
  );
}

/* ------------------------------------------ */
/*               Shared Form Field            */
/* ------------------------------------------ */

const inputStyles = cn(
  "h-12 w-full rounded-xl",
  "border-white/10 bg-[#080C10]",
  "px-4 text-sm text-slate-100",
  "placeholder:text-slate-500",
  "focus-visible:border-emerald-400/50",
  "focus-visible:ring-emerald-400/15"
);

function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-slate-300"
      >
        {label}
      </Label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          className="text-xs leading-relaxed text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------ */
/*              Submission Confirmation       */
/* ------------------------------------------ */

function ConnectionSuccess({
  result,
  onReset,
}: {
  result: ContactResponse;
  onReset: () => void;
}) {
  const reduceMotion = useReducedMotion();

  const [copied, setCopied] =
    useState(false);

  const [copyError, setCopyError] =
    useState(false);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(
        result.requestId
      );

      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, scale: 0.97 }
      }
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.4,
      }}
      role="status"
      className="flex min-h-115 flex-1 flex-col items-center justify-center gap-6 text-center"
    >
      {/* Success Icon */}

      <div className="relative flex size-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-400/20" />

        <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/30 motion-safe:animate-[spin_25s_linear_infinite]" />

        <div className="relative flex size-20 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_40px_rgba(52,211,153,0.15)]">
          <CheckCircle2
            className="size-10 text-emerald-400"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <Badge
        variant="outline"
        className="border-emerald-400/20 bg-emerald-400/10 font-mono text-[10px] tracking-widest text-emerald-400"
      >
        REQUEST RECORDED
      </Badge>

      <h3 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Connection{" "}

        <span className="text-emerald-400">
          Initialized.
        </span>
      </h3>

      <p className="max-w-md text-sm leading-relaxed text-slate-400">
        Your connection request has been recorded.
        Thank you for taking the first step towards
        a meaningful conversation.
      </p>

      {/* Request Reference */}

      <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-emerald-400/15 bg-[#0D1716] p-4">
        <span className="font-mono text-[10px] tracking-widest text-slate-500">
          CONNECTION REFERENCE
        </span>

        <div className="flex min-w-0 items-center gap-3">
          <span className="min-w-0 flex-1 break-all font-mono text-xs text-emerald-300">
            {result.requestId}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Copy connection reference"
            onClick={copyReference}
            className="shrink-0 text-emerald-400 hover:bg-emerald-400/10"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>

        {copied && (
          <p className="text-xs text-emerald-400">
            Reference copied.
          </p>
        )}

        {copyError && (
          <p className="text-xs text-slate-400">
            Please copy the reference manually.
          </p>
        )}
      </div>

      {/* Next Actions */}

      <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Button
          type="button"
          onClick={onReset}
          className="h-11 rounded-xl bg-emerald-400 font-semibold text-slate-950 hover:bg-emerald-300"
        >
          <RotateCcw className="size-4" />

          New Connection
        </Button>

        <Link
          href="#explore"
          data-track="navigation_click"
          data-target="explore"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-slate-300 transition-colors hover:border-emerald-400/30 hover:text-emerald-400"
        >
          Return to Explore

          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------ */
/*                 Connection Form            */
/* ------------------------------------------ */

interface ConnectionFormProps {
  form: ContactFormData;
  errors: FormErrors;
  apiError: string | null;
  isSubmitting: boolean;
  result: ContactResponse | null;

  onChange: <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K]
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;

  onReset: () => void;
}

function ConnectionForm({
  form,
  errors,
  apiError,
  isSubmitting,
  result,
  onChange,
  onSubmit,
  onReset,
}: ConnectionFormProps) {
  const reduceMotion = useReducedMotion();

  const selectedOption =
    connectionOptions.find(
      (option) => option.id === form.intent
    ) ?? connectionOptions[0];

  const SelectedIcon =
    selectedOption.icon;

  return (
    <PortalCard
      animatedBorder={!result}
      className="w-full lg:flex-3"
    >
      <AnimatePresence mode="wait" initial={false}>
        {result ? (
          <ConnectionSuccess
            key="success"
            result={result}
            onReset={onReset}
          />
        ) : (
          <motion.div
            key="connection-form"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 8 }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.25,
            }}
            className="flex flex-1 flex-col gap-6"
          >
            {/* Form Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10px] tracking-widest text-emerald-400">
                  02 / INITIALIZE CONNECTION
                </span>

                <h3 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                  Start a conversation.
                </h3>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
                <Mail className="size-5 text-emerald-400" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">
              Introduce yourself and share what you
              have in mind.
            </p>

            {/* Selected Intent */}

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-slate-500">
                SELECTED INTENT
              </span>

              <Badge
                variant="outline"
                className="gap-2 border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-300"
              >
                <SelectedIcon className="size-3.5" />

                {selectedOption.title}
              </Badge>
            </div>

            <Separator className="bg-white/5" />

            {/* Main Form */}

            <form
              onSubmit={onSubmit}
              noValidate
              className="flex w-full flex-col gap-5"
            >
              <fieldset
                disabled={isSubmitting}
                className="flex min-w-0 flex-col gap-5"
              >
                {/* Name and Email */}

                <div className="flex w-full flex-col gap-5 sm:flex-row">
                  <FormField
                    id="connection-name"
                    label="Full name *"
                    error={errors.name}
                  >
                    <Input
                      id="connection-name"
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      maxLength={100}
                      required
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name
                          ? "connection-name-error"
                          : undefined
                      }
                      onChange={(event) =>
                        onChange(
                          "name",
                          event.target.value
                        )
                      }
                      className={inputStyles}
                    />
                  </FormField>

                  <FormField
                    id="connection-email"
                    label="Email address *"
                    error={errors.email}
                  >
                    <Input
                      id="connection-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      maxLength={254}
                      required
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email
                          ? "connection-email-error"
                          : undefined
                      }
                      onChange={(event) =>
                        onChange(
                          "email",
                          event.target.value
                        )
                      }
                      className={inputStyles}
                    />
                  </FormField>
                </div>

                {/* Organization */}

                <FormField
                  id="connection-organization"
                  label="Organization (optional)"
                  error={errors.organization}
                >
                  <Input
                    id="connection-organization"
                    name="organization"
                    autoComplete="organization"
                    placeholder="Your organization"
                    value={form.organization}
                    maxLength={150}
                    aria-invalid={
                      !!errors.organization
                    }
                    aria-describedby={
                      errors.organization
                        ? "connection-organization-error"
                        : undefined
                    }
                    onChange={(event) =>
                      onChange(
                        "organization",
                        event.target.value
                      )
                    }
                    className={inputStyles}
                  />
                </FormField>

                {/* Message */}

                <FormField
                  id="connection-message"
                  label="Your message *"
                  error={errors.message}
                >
                  <Textarea
                    id="connection-message"
                    name="message"
                    placeholder={
                      selectedOption.placeholder
                    }
                    value={form.message}
                    maxLength={2000}
                    required
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message
                        ? "connection-message-error connection-message-count"
                        : "connection-message-count"
                    }
                    onChange={(event) =>
                      onChange(
                        "message",
                        event.target.value
                      )
                    }
                    className={cn(
                      "min-h-36 resize-y",
                      "rounded-xl border-white/10",
                      "bg-[#080C10] p-4",
                      "text-sm leading-relaxed",
                      "text-slate-100",
                      "placeholder:text-slate-500",
                      "focus-visible:border-emerald-400/50",
                      "focus-visible:ring-emerald-400/15"
                    )}
                  />

                  <div
                    id="connection-message-count"
                    className="flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="text-[10px] text-slate-500">
                      Minimum 20 characters
                    </span>

                    <span
                      className={cn(
                        "font-mono text-[10px]",

                        form.message.length >= 1900
                          ? "text-amber-400"
                          : "text-slate-500"
                      )}
                    >
                      {form.message.length}/2000
                    </span>
                  </div>
                </FormField>

                {/* Honeypot Field */}

                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
                >
                  <label htmlFor="connection-website">
                    Leave this field empty
                  </label>

                  <input
                    id="connection-website"
                    name="website"
                    value={form.website}
                    autoComplete="off"
                    tabIndex={-1}
                    onChange={(event) =>
                      onChange(
                        "website",
                        event.target.value
                      )
                    }
                  />
                </div>

                {/* Consent */}

                <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#0D1716] p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="connection-consent"
                      checked={form.consent}
                      aria-invalid={!!errors.consent}
                      aria-describedby="connection-privacy"
                      onCheckedChange={(checked) =>
                        onChange(
                          "consent",
                          checked === true
                        )
                      }
                      className="mt-0.5 border-emerald-400/40 data-checked:border-emerald-400 data-checked:bg-emerald-400 data-checked:text-slate-950"
                    />

                    <Label
                      htmlFor="connection-consent"
                      className="cursor-pointer text-xs leading-relaxed text-slate-300"
                    >
                      I agree to be contacted regarding
                      this connection request.
                    </Label>
                  </div>

                  <p
                    id="connection-privacy"
                    className="text-[11px] leading-relaxed text-slate-500"
                  >
                    Your details and message are stored
                    to process this request and may be
                    forwarded to the authorized
                    recipient by email.
                  </p>

                  {errors.consent && (
                    <p
                      role="alert"
                      className="text-xs text-red-400"
                    >
                      {errors.consent}
                    </p>
                  )}
                </div>
              </fieldset>

              {/* API Error */}

              {apiError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4"
                >
                  <AlertCircle className="size-5 shrink-0 text-red-400" />

                  <p className="text-sm leading-relaxed text-red-300">
                    {apiError}
                  </p>
                </div>
              )}

              {/* Submit Button */}

              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={cn(
                  "group h-13 w-full rounded-xl",
                  "bg-emerald-400 font-semibold",
                  "text-slate-950",
                  "hover:bg-emerald-300",
                  "shadow-[0_0_25px_rgba(52,211,153,0.12)]",
                  "transition-all duration-300"
                )}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 motion-safe:animate-spin" />

                    Initializing Connection...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />

                    Initialize Connection

                    <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Form Footer */}

            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="size-3.5 shrink-0 text-emerald-400/70" />

              <span className="text-center text-[10px] leading-relaxed text-slate-500">
                Your information is collected for
                this connection request.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortalCard>
  );
}

/* ------------------------------------------ */
/*              Main Connection Portal        */
/* ------------------------------------------ */

export default function ConnectionPortal() {
  const reduceMotion = useReducedMotion();

  const [form, setForm] =
    useState<ContactFormData>(initialForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [apiError, setApiError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [result, setResult] =
    useState<ContactResponse | null>(null);

  // Synchronous duplicate-click prevention.
  const pendingRef = useRef(false);
  const abortControllerRef =
    useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Preserve request ID when retrying
  // an unchanged submission.
  const requestRef = useRef<{
    signature: string;
    id: string;
  } | null>(null);

  /* Update individual form fields */

  function updateField<
    K extends keyof ContactFormData
  >(
    key: K,
    value: ContactFormData[K]
  ) {
    if (pendingRef.current) return;

    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));

    setApiError(null);
  }

  /* Handle API submission */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      pendingRef.current ||
      result
    ) {
      return;
    }

    setApiError(null);

    const validation =
      contactFormSchema.safeParse(form);

    /* Client-side validation */

    if (!validation.success) {
      const fieldErrors: FormErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0] as
          keyof ContactFormData;

        if (
          field &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);

      return;
    }

    setErrors({});

    /* Generate an idempotency identifier */

    const signature = JSON.stringify(
      validation.data
    );

    if (
      !requestRef.current ||
      requestRef.current.signature !== signature
    ) {
      requestRef.current = {
        signature,
        id: crypto.randomUUID(),
      };
    }

    pendingRef.current = true;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSubmitting(true);

    try {
      /* Axios API call */

      const response =
        await submitConnectionRequest(
          {
            ...validation.data,

            requestId:
              requestRef.current.id,
          },
          controller.signal
        );

      if (controller.signal.aborted) {
        return;
      }

      setResult(response);

      // Record only confirmed submissions, without personal data.
      trackEngagement("connection_submit", "recorded");
    } catch (error) {
      if (
        axios.isCancel(error) ||
        controller.signal.aborted
      ) {
        return;
      }

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error;

        if (error.response?.status === 409) {
          requestRef.current = null;
        }

        setApiError(
          typeof message === "string"
            ? message
            : "Unable to submit your connection request. Please try again."
        );
      } else {
        setApiError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        pendingRef.current = false;

        setIsSubmitting(false);
      }
    }
  };

  /* Reset connection form */

  const handleReset = () => {
    if (pendingRef.current) return;

    setForm(initialForm);
    setErrors({});
    setApiError(null);
    setResult(null);

    requestRef.current = null;
  };

  return (
    <section
      id="connect"
      aria-labelledby="connection-heading"
      className={cn(
        "relative isolate flex w-full flex-col",
        "items-center justify-center overflow-hidden",
        "bg-[#080C10] px-4 py-20",
        "text-slate-100 sm:px-6",
        "lg:px-8 lg:py-28"
      )}
    >
      {/* Static Grid Background */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      {/* Ambient Green Glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/5 blur-[140px]"
      />

      {/* Main Container */}

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 lg:gap-16">
        {/* Section Header */}

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
            amount: 0.2,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
          }}
          className="flex w-full max-w-4xl flex-col items-center gap-5 text-center"
        >
          <Badge
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              "rounded-full",
              "border-emerald-400/20",
              "bg-emerald-400/5 px-4 py-2",
              "font-mono text-[10px]",
              "tracking-widest text-emerald-300"
            )}
          >
            <Handshake className="size-3.5" />

            05 // THE CONNECTION PORTAL
          </Badge>

          <h2
            id="connection-heading"
            className={cn(
              "font-heading font-bold leading-tight",
              "tracking-[-0.04em]",
              "text-[clamp(2.25rem,5vw,4.5rem)]"
            )}
          >
            Beyond{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Conversations.
            </span>
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
            Every meaningful connection begins with
            an intention. Share an idea, explore
            opportunities or start a conversation
            that could lead to something meaningful.
          </p>
        </motion.div>

        {/* Main Responsive Portal */}

        <div className="flex w-full flex-col items-stretch gap-5 sm:gap-6 lg:flex-row">
          <ConnectionIntentSelector
            selected={form.intent}
            disabled={
              isSubmitting || result !== null
            }
            onSelect={(intent) =>
              updateField("intent", intent)
            }
          />

          <ConnectionForm
            form={form}
            errors={errors}
            apiError={apiError}
            isSubmitting={isSubmitting}
            result={result}
            onChange={updateField}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>

        {/* Philosophy Banner */}

        <div className="flex w-full flex-col items-center justify-between gap-6 rounded-2xl border border-emerald-400/10 bg-[#121A20]/60 p-5 sm:p-6 md:flex-row">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
              <Fingerprint className="size-6 text-emerald-400" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] tracking-widest text-emerald-400">
                THE PHILOSOPHY CONTINUES
              </span>

              <p className="font-heading text-lg font-semibold text-slate-100 sm:text-xl">
                Do More by Doing Less™
              </p>
            </div>
          </div>

          <Link
            href="#ideas"
            data-track="navigation_click"
            data-target="ideas"
            className="group flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Explore the Philosophy

            <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Section Footer */}

        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 sm:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // CONNECTION MODULE
          </span>

          <Link
            href="#explore"
            data-track="navigation_click"
            data-target="explore"
            className="group flex items-center gap-2 font-mono text-xs tracking-wider text-emerald-400 hover:text-emerald-300"
          >
            RETURN TO EXPLORE

            <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-2">
            <MessageCircle className="size-3.5 text-emerald-400" />

            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              MEANINGFUL CONNECTIONS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
