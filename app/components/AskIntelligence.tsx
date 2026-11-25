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
  Bot,
  Sparkles,
  Send,
  RotateCcw,
  GitBranch,
  Network,
  Lightbulb,
  ShieldCheck,
  BookOpen,
  LoaderCircle,
  AlertCircle,
  UserRound,
  BrainCircuit,
  Compass,
} from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Aceternity UI
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Magic UI
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedBeam } from "@/components/ui/animated-beam";

// Services and types
import { sendChatMessage } from "@/services/chat.service";

import type {
  ChatMessage,
} from "@/lib/chat-schema";

import { cn } from "@/lib/utils";
import { trackEngagement } from "@/lib/analytics";

/* ------------------------------------------ */
/*             Suggested Questions            */
/* ------------------------------------------ */

const suggestedQuestions = [
  {
    icon: UserRound,
    title: "Founder Profile",
    question: "Who is Sonia?",
  },
  {
    icon: GitBranch,
    title: "Professional Journey",
    question:
      "What is Sonia's professional background?",
  },
  {
    icon: Network,
    title: "Expertise",
    question:
      "What are Sonia's areas of expertise?",
  },
  {
    icon: Compass,
    title: "Leadership",
    question:
      "What is known about Sonia's leadership experience?",
  },
  {
    icon: Lightbulb,
    title: "Philosophy",
    question:
      "What is the philosophy of i-SmokeStack?",
  },
];

/* ------------------------------------------ */
/*                Initial Message             */
/* ------------------------------------------ */

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",

    role: "assistant",

    content:
      "Welcome to Ask Intelligence. I am the SONIA.OS AI discovery guide. Ask me about Sonia, her professional identity or the i-SmokeStack philosophy. I will use the available professional sources to guide your exploration.",
  },
];

/* ------------------------------------------ */
/*              Reusable Card Wrapper         */
/* ------------------------------------------ */

function IntelligenceCard({
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
        "rounded-3xl border border-emerald-400/10",
        "p-1",
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

      <Card
        className={cn(
          "relative flex h-full flex-1 flex-col",
          "gap-0 overflow-hidden rounded-[20px]",
          "border-white/5 bg-[#121A20]/95",
          "p-0 text-slate-100 backdrop-blur-xl"
        )}
      >
        {children}
      </Card>
    </div>
  );
}

/* ------------------------------------------ */
/*          AI Intelligence Visualization     */
/* ------------------------------------------ */

function IntelligenceVisual({
  isLoading,
}: {
  isLoading: boolean;
}) {
  const reduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex min-h-32 w-full items-center justify-between gap-5 overflow-hidden rounded-2xl border border-emerald-400/10 bg-[#0D1716] p-4"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#34d39910,transparent_70%)]" />

      {/* Knowledge Input */}
      <div
        ref={inputRef}
        className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-[#10251F]"
      >
        <BookOpen className="size-5 text-emerald-400" />
      </div>

      {/* Central AI Core */}
      <div
        ref={aiRef}
        className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-[#123328] shadow-[0_0_35px_rgba(52,211,153,0.12)]"
      >
        <BrainCircuit
          className={cn(
            "size-8 text-emerald-300",
            isLoading &&
              "motion-safe:animate-pulse"
          )}
          strokeWidth={1.5}
        />
      </div>

      {/* AI Output */}
      <div
        ref={outputRef}
        className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-[#10251F]"
      >
        <Sparkles className="size-5 text-emerald-400" />
      </div>

      {/* Magic UI Animated Beams */}
      {!reduceMotion && (
        <>
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={inputRef}
            toRef={aiRef}
            duration={isLoading ? 1.5 : 4}
            pathColor="#334155"
            pathWidth={2}
            gradientStartColor="#34D399"
            gradientStopColor="#A7F3D0"
          />

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={aiRef}
            toRef={outputRef}
            duration={isLoading ? 1.5 : 4}
            pathColor="#334155"
            pathWidth={2}
            gradientStartColor="#34D399"
            gradientStopColor="#A7F3D0"
          />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------ */
/*               Discovery Sidebar            */
/* ------------------------------------------ */

function DiscoverySidebar({
  isLoading,
  onQuestionSelect,
}: {
  isLoading: boolean;
  onQuestionSelect: (question: string) => void;
}) {
  return (
    <IntelligenceCard className="w-full lg:w-85 lg:shrink-0 xl:w-92.5">
      <div className="flex flex-1 flex-col gap-6 p-5 sm:p-6">
        {/* Sidebar Introduction */}
        <div className="flex items-center gap-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
            <Sparkles className="size-7 text-emerald-400" />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="font-heading text-xl font-semibold text-slate-100">
              Ask Intelligence
            </h3>

            <span className="font-mono text-[10px] tracking-widest text-emerald-400">
              AI DISCOVERY GUIDE
            </span>
          </div>
        </div>

        <p className="font-sans text-sm leading-relaxed text-slate-400">
          Explore professional experiences, leadership,
          expertise and ideas through a conversational
          discovery experience.
        </p>

        {/* Knowledge Processing Visual */}
        <IntelligenceVisual isLoading={isLoading} />

        <Separator className="bg-white/5" />

        {/* Suggested Questions */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SUGGESTED EXPLORATIONS
          </span>

          <div className="flex flex-wrap gap-3 lg:flex-col">
            {suggestedQuestions.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  disabled={isLoading}
                  onClick={() =>
                    onQuestionSelect(item.question)
                  }
                  className={cn(
                    "group flex min-w-0 items-center gap-3",
                    "rounded-xl border border-white/5",
                    "bg-[#0D1716] p-3 text-left",
                    "basis-full sm:basis-[calc(50%-0.375rem)]",
                    "lg:basis-auto lg:w-full",
                    "transition-colors duration-200",
                    "hover:border-emerald-400/25",
                    "hover:bg-emerald-400/5",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    "focus-visible:outline-2",
                    "focus-visible:outline-emerald-400"
                  )}
                >
                  <Icon className="size-4 shrink-0 text-emerald-400" />

                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-heading text-sm font-medium text-slate-200 group-hover:text-emerald-300">
                      {item.title}
                    </span>

                    <span className="text-xs leading-relaxed text-slate-500">
                      {item.question}
                    </span>
                  </span>

                  <ArrowUpRight className="size-4 shrink-0 text-slate-600 group-hover:text-emerald-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsible AI Information */}
        <div className="mt-auto flex flex-col gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-400" />

            <span className="font-heading text-sm font-medium text-emerald-300">
              Responsible AI
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-400">
            This assistant uses curated professional
            information and does not impersonate Sonia.
            Questions are processed by Google Gemini.
            Please avoid sharing personal or sensitive
            information.
          </p>
        </div>
      </div>
    </IntelligenceCard>
  );
}

/* ------------------------------------------ */
/*                Chat Message                */
/* ------------------------------------------ */

function MessageBubble({
  message,
}: {
  message: ChatMessage;
}) {
  const reduceMotion = useReducedMotion();

  const isAssistant =
    message.role === "assistant";

  return (
    <motion.div
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y: 8 }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.25,
      }}
      className={cn(
        "flex w-full items-start gap-3",
        isAssistant
          ? "justify-start"
          : "flex-row-reverse"
      )}
    >
      {/* Message Avatar */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center",
          "justify-center rounded-xl border",
          isAssistant
            ? "border-emerald-400/20 bg-emerald-400/10"
            : "border-white/10 bg-white/5"
        )}
      >
        {isAssistant ? (
          <Bot className="size-5 text-emerald-400" />
        ) : (
          <UserRound className="size-4 text-slate-300" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "flex min-w-0 max-w-[85%]",
          "flex-col gap-3 rounded-2xl border",
          "p-3 sm:p-4",
          isAssistant
            ? "border-white/5 bg-[#0D1716]"
            : "border-emerald-400/20 bg-emerald-400/10"
        )}
      >
        <span
          className={cn(
            "font-mono text-[9px] tracking-widest",
            isAssistant
              ? "text-emerald-400"
              : "text-slate-400"
          )}
        >
          {isAssistant
            ? "SONIA.OS ASSISTANT"
            : "YOU"}
        </span>

        <p className="whitespace-pre-wrap wrap-break-word font-sans text-sm leading-relaxed text-slate-200">
          {message.content}
        </p>

        {/* Verified Source References */}
        {message.sources &&
          message.sources.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-3.5 text-emerald-400" />

                <span className="font-mono text-[9px] tracking-widest text-slate-500">
                  KNOWLEDGE SOURCES
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {message.sources.map((source) => (
                  <div
                    key={source.id}
                    className="flex flex-col gap-1 rounded-lg border border-emerald-400/10 bg-emerald-400/5 p-3"
                  >
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 wrap-break-word text-xs text-emerald-300 hover:text-emerald-200"
                      >
                        {source.title}

                        <ArrowUpRight className="size-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-emerald-300">
                        {source.title}
                      </span>
                    )}

                    <span className="text-[10px] leading-relaxed text-slate-400">
                      {source.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------ */
/*                Loading Message             */
/* ------------------------------------------ */

function LoadingMessage() {
  return (
    <div
      role="status"
      className="flex items-start gap-3"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
        <Bot className="size-5 text-emerald-400" />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#0D1716] p-4">
        <span className="font-mono text-[9px] tracking-widest text-emerald-400">
          SONIA.OS ASSISTANT
        </span>

        <div className="flex items-center gap-2">
          <LoaderCircle className="size-4 text-emerald-400 motion-safe:animate-spin" />

          <span className="text-xs text-slate-400">
            Exploring available information...
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------ */
/*               Intelligence Console         */
/* ------------------------------------------ */

function IntelligenceConsole({
  messages,
  input,
  isLoading,
  error,
  onInputChange,
  onSubmit,
  onReset,
}: {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: (question: string) => void;
  onReset: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: reduceMotion
        ? "instant"
        : "smooth",
    });
  }, [messages, isLoading, error, reduceMotion]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSubmit(input);
  };

  return (
    <IntelligenceCard className="w-full lg:flex-1">
      {/* Console Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10">
            <Bot className="size-5 text-emerald-400" />
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="font-heading text-base font-semibold text-slate-100 sm:text-lg">
              Intelligence Console
            </h3>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isLoading
                    ? "bg-amber-400 motion-safe:animate-pulse"
                    : "bg-emerald-400"
                )}
              />

              <span className="font-mono text-[9px] tracking-wider text-slate-400">
                {isLoading
                  ? "PROCESSING REQUEST"
                  : "READY FOR QUESTIONS"}
              </span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isLoading}
          onClick={onReset}
          aria-label="Reset conversation"
          className="gap-2 text-slate-400 hover:bg-white/5 hover:text-emerald-300"
        >
          <RotateCcw className="size-4" />

          <span className="hidden sm:inline">
            Reset
          </span>
        </Button>
      </div>

      {/* Chat Messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-label="AI conversation"
        aria-live="polite"
        aria-relevant="additions"
        className={cn(
          "flex h-105 min-h-0 w-full",
          "flex-col gap-6 overflow-y-auto",
          "overscroll-contain p-4",
          "sm:h-120 sm:p-6",
          "lg:h-140",
          "scrollbar-thin",
          "[scrollbar-color:#334155_transparent]"
        )}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingMessage />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4"
          >
            <AlertCircle className="size-5 shrink-0 text-red-400" />

            <p className="text-sm leading-relaxed text-red-300">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <div className="mt-auto border-t border-white/5 bg-[#0D1217] p-4 sm:p-5">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3"
        >
          <div className="flex w-full items-end gap-3 rounded-2xl border border-white/10 bg-[#080C10] p-2 transition-colors focus-within:border-emerald-400/40">
            <Textarea
              value={input}
              onChange={(event) =>
                onInputChange(event.target.value)
              }
              placeholder="Ask something about Sonia..."
              aria-label="Ask Intelligence a question"
              maxLength={1000}
              disabled={isLoading}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();

                  onSubmit(input);
                }
              }}
              className={cn(
                "max-h-32 min-h-12 flex-1",
                "resize-y border-0 bg-transparent",
                "text-sm leading-relaxed text-slate-200",
                "placeholder:text-slate-600",
                "shadow-none focus-visible:ring-0"
              )}
            />

            <Button
              type="submit"
              size="icon"
              disabled={
                isLoading ||
                input.trim().length < 2
              }
              aria-label="Send question"
              className={cn(
                "size-11 shrink-0 rounded-xl",
                "bg-emerald-400 text-slate-950",
                "hover:bg-emerald-300",
                "disabled:opacity-40"
              )}
            >
              {isLoading ? (
                <LoaderCircle className="size-5 motion-safe:animate-spin" />
              ) : (
                <Send className="size-5" />
              )}
            </Button>
          </div>

          {/* Input Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="font-mono text-[10px] text-slate-500">
              Enter to send · Shift + Enter for new line
            </span>

            <span
              className={cn(
                "font-mono text-[10px]",
                input.length >= 950
                  ? "text-amber-400"
                  : "text-slate-500"
              )}
            >
              {input.length}/1000
            </span>
          </div>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-center">
          <Sparkles className="size-3 shrink-0 text-emerald-400/70" />

          <span className="text-[10px] leading-relaxed text-slate-500">
            Powered by Google Gemini. AI responses may
            contain errors; consult the listed sources.
          </span>
        </div>
      </div>
    </IntelligenceCard>
  );
}

/* ------------------------------------------ */
/*            Main Ask Intelligence           */
/* ------------------------------------------ */

export default function AskIntelligence() {
  const reduceMotion = useReducedMotion();

  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  // Prevent simultaneous requests from rapid clicks.
  const pendingRef = useRef(false);

  /* ---------------------------------------- */
  /*               Submit Question            */
  /* ---------------------------------------- */

  const handleSendMessage = async (
    question: string
  ) => {
    const trimmedQuestion = question.trim();

    if (
      pendingRef.current ||
      trimmedQuestion.length < 2 ||
      trimmedQuestion.length > 1000
    ) {
      return;
    }

    pendingRef.current = true;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),

      role: "user",

      content: trimmedQuestion,
    };

    // Do not send the static welcome message.
    const history = messages
      .filter((message) =>
        message.id !== "welcome"
      )
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      // Axios API call through service layer.
      const response = await sendChatMessage({
        question: trimmedQuestion,
        history,
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),

        role: "assistant",

        content: response.answer,

        sources: response.sources,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      // Track successful responses from both typed and suggested questions.
      // Never include conversation content in engagement analytics.
      trackEngagement("ai_question", "answered");
    } catch (requestError) {
      // Remove failed turn from conversation history
      // and restore the question for retry.
      setMessages((previous) =>
        previous.filter(
          (message) =>
            message.id !== userMessage.id
        )
      );

      setInput(trimmedQuestion);

      if (axios.isAxiosError(requestError)) {
        const apiError =
          requestError.response?.data?.error;

        setError(
          typeof apiError === "string"
            ? apiError
            : "Unable to connect to Ask Intelligence. Please try again."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      pendingRef.current = false;

      setIsLoading(false);
    }
  };

  /* ---------------------------------------- */
  /*              Reset Conversation          */
  /* ---------------------------------------- */

  const handleReset = () => {
    if (pendingRef.current) return;

    setMessages(initialMessages);
    setInput("");
    setError(null);
  };

  return (
    <section
      id="ai"
      aria-labelledby="intelligence-heading"
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
              "fill-emerald-400/15",
              "stroke-emerald-400/10",
              "mask-[radial-gradient(ellipse_at_center,white,transparent_75%)]"
            )}
          />
        </div>
      )}

      {/* Ambient Background Glow */}
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
              "flex items-center gap-2 rounded-full",
              "border-emerald-400/20",
              "bg-emerald-400/5 px-4 py-2",
              "font-mono text-[10px]",
              "tracking-widest text-emerald-300"
            )}
          >
            <Sparkles className="size-3.5" />

            04 // THE INTELLIGENCE INTERFACE
          </Badge>

          <h2
            id="intelligence-heading"
            className={cn(
              "font-heading font-bold leading-tight",
              "tracking-[-0.04em]",
              "text-[clamp(2.25rem,5vw,4.5rem)]"
            )}
          >
            Curiosity Meets{" "}

            <span className="bg-linear-to-r from-emerald-200 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Intelligence.
            </span>
          </h2>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-slate-400 sm:text-base lg:text-lg">
            Every question opens a new possibility.
            Discover the professional identity beyond
            the profile through an intelligent,
            source-grounded conversation.
          </p>
        </motion.div>

        {/* Main AI Interface */}
        <div className="flex w-full flex-col items-stretch gap-5 sm:gap-6 lg:flex-row">
          <DiscoverySidebar
            isLoading={isLoading}
            onQuestionSelect={handleSendMessage}
          />

          <IntelligenceConsole
            messages={messages}
            input={input}
            isLoading={isLoading}
            error={error}
            onInputChange={setInput}
            onSubmit={handleSendMessage}
            onReset={handleReset}
          />
        </div>

        {/* Section Footer */}
        <div className="flex w-full flex-col items-center justify-between gap-5 border-t border-white/5 pt-6 sm:flex-row">
          <span className="font-mono text-[10px] tracking-widest text-slate-500">
            SONIA.OS // AI DISCOVERY MODULE
          </span>

          <Link
            href="#connect"
            data-track="navigation_click"
            data-target="connect"
            className="group flex items-center gap-2 font-mono text-xs tracking-wider text-emerald-400 hover:text-emerald-300"
          >
            CONTINUE TO CONNECT

            <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-400" />

            <span className="font-mono text-[10px] tracking-widest text-slate-500">
              AI DISCOVERY
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}