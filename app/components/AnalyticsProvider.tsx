"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import axios from "axios";

import {
  Activity,
  ShieldCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  ANALYTICS_EVENT,
  type EngagementPayload,
} from "@/lib/analytics";

import {
  analyticsEventSchema,
  sectionIds,
  type AnalyticsEventInput,
} from "@/lib/analytics-schema";

import {
  recordAnalyticsEvents,
} from "@/services/analytics.service";

const SESSION_KEY = "sonia_session_id";
const SESSION_STARTED_KEY = "sonia_session_started";
const SEEN_SECTIONS_KEY = "sonia_seen_sections";
const CONSENT_KEY = "sonia_analytics_consent";
const CONSENT_EVENT = "sonia:analytics-consent";

const BATCH_FLUSH_INTERVAL_MS = 3000;
const BATCH_FLUSH_SIZE = 8;
const MAX_QUEUE_SIZE = 40;
const MAX_RETRY_ATTEMPTS = 2;

/* ------------------------------------------ */
/*              Consent Management            */
/* ------------------------------------------ */

function subscribe(
  callback: () => void
) {
  window.addEventListener(
    CONSENT_EVENT,
    callback
  );

  return () => {
    window.removeEventListener(
      CONSENT_EVENT,
      callback
    );
  };
}

function getConsent() {
  try {
    return (
      sessionStorage.getItem(CONSENT_KEY) ??
      "unset"
    );
  } catch {
    return "unset";
  }
}

function getServerConsent() {
  return "unset";
}

function updateConsent(enabled: boolean) {
  try {
    sessionStorage.setItem(
      CONSENT_KEY,
      enabled ? "enabled" : "disabled"
    );

    if (!enabled) {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_STARTED_KEY);
      sessionStorage.removeItem(SEEN_SECTIONS_KEY);
    }

    window.dispatchEvent(
      new Event(CONSENT_EVENT)
    );
  } catch {
    // Tracking remains disabled if storage
    // is unavailable.
  }
}

/* ------------------------------------------ */
/*               Visitor Session              */
/* ------------------------------------------ */

function getSessionId() {
  let sessionId =
    sessionStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    sessionStorage.setItem(
      SESSION_KEY,
      sessionId
    );
  }

  return sessionId;
}

function loadSeenSections(): Set<string> {
  try {
    const raw = sessionStorage.getItem(
      SEEN_SECTIONS_KEY
    );

    if (!raw) {
      return new Set<string>();
    }

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return new Set(
        parsed.filter(
          (item): item is string =>
            typeof item === "string"
        )
      );
    }
  } catch {
    // Ignore storage read errors.
  }

  return new Set<string>();
}

function saveSeenSections(seen: Set<string>) {
  try {
    sessionStorage.setItem(
      SEEN_SECTIONS_KEY,
      JSON.stringify(Array.from(seen))
    );
  } catch {
    // Ignore storage write errors.
  }
}

function getDeviceCategory():
  | "mobile"
  | "tablet"
  | "desktop" {
  const width = window.innerWidth;

  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

function isTransientAnalyticsError(
  error: unknown
): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return error.response.status >= 500;
}

/* ------------------------------------------ */
/*               Main Analytics Provider      */
/* ------------------------------------------ */

export default function AnalyticsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const consent = useSyncExternalStore(
    subscribe,
    getConsent,
    getServerConsent
  );

  const enabled = consent === "enabled";
  const showBanner = consent === "unset";

  useEffect(() => {
    if (!enabled) return;

    let sessionId: string;

    try {
      sessionId = getSessionId();
    } catch {
      return;
    }

    const device = getDeviceCategory();
    const seenSections = loadSeenSections();

    let active = true;
    const queue: AnalyticsEventInput[] = [];
    let flushTimer:
      | ReturnType<typeof setTimeout>
      | undefined;
    let retryTimer:
      | ReturnType<typeof setTimeout>
      | undefined;
    let inFlightController: AbortController | null =
      null;
    let flushing = false;

    function clearTimers() {
      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = undefined;
      }

      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = undefined;
      }
    }

    async function flushQueue(attempt = 0) {
      if (!active || flushing || queue.length === 0) {
        return;
      }

      if (flushTimer) {
        clearTimeout(flushTimer);
        flushTimer = undefined;
      }

      flushing = true;
      const batch = queue.splice(0, 20);
      const controller = new AbortController();
      inFlightController = controller;

      try {
        await recordAnalyticsEvents(
          batch,
          controller.signal
        );

        if (active && queue.length > 0) {
          scheduleFlush();
        }
      } catch (error) {
        if (
          !active ||
          axios.isCancel(error) ||
          controller.signal.aborted
        ) {
          return;
        }

        if (
          isTransientAnalyticsError(error) &&
          attempt < MAX_RETRY_ATTEMPTS
        ) {
          const requeue = batch.slice(
            0,
            Math.max(0, MAX_QUEUE_SIZE - queue.length)
          );
          queue.unshift(...requeue);

          const backoffMs = 1500 * (attempt + 1);
          retryTimer = setTimeout(() => {
            retryTimer = undefined;
            void flushQueue(attempt + 1);
          }, backoffMs);
        }
      } finally {
        if (inFlightController === controller) {
          inFlightController = null;
        }
        flushing = false;
      }
    }

    function scheduleFlush() {
      if (!active || flushTimer || retryTimer) {
        return;
      }

      flushTimer = setTimeout(() => {
        flushTimer = undefined;
        void flushQueue(0);
      }, BATCH_FLUSH_INTERVAL_MS);
    }

    /* Queue validated event */

    function send(payload: EngagementPayload) {
      if (!active) return;

      const validation =
        analyticsEventSchema.safeParse({
          eventId: crypto.randomUUID(),
          sessionId,
          device,
          ...payload,
        });

      if (!validation.success) {
        return;
      }

      if (queue.length >= MAX_QUEUE_SIZE) {
        queue.shift();
      }

      queue.push(validation.data);

      if (queue.length >= BATCH_FLUSH_SIZE) {
        void flushQueue(0);
      } else {
        scheduleFlush();
      }
    }

    /* Session initialization (once per browser session) */

    try {
      if (
        !sessionStorage.getItem(SESSION_STARTED_KEY)
      ) {
        sessionStorage.setItem(
          SESSION_STARTED_KEY,
          "1"
        );
        send({
          eventName: "session_start",
          target: "site",
        });
      }
    } catch {
      send({
        eventName: "session_start",
        target: "site",
      });
    }

    /* Automatic section tracking */

    const observer = new IntersectionObserver(
      (entries) => {
        if (document.hidden) return;

        let changed = false;

        for (const entry of entries) {
          const section = entry.target.id;

          if (
            entry.isIntersecting &&
            !seenSections.has(section)
          ) {
            seenSections.add(section);
            changed = true;

            send({
              eventName: "section_view",
              target: section,
            });
          }
        }

        if (changed) {
          saveSeenSections(seenSections);
        }
      },
      {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const section =
        document.getElementById(id);

      if (section) {
        observer.observe(section);
      }
    });

    /* Delegated click tracking */

    function handleClick(event: MouseEvent) {
      if (
        !(event.target instanceof Element)
      ) {
        return;
      }

      const element =
        event.target.closest<HTMLElement>(
          "[data-track][data-target]"
        );

      if (
        !element ||
        element.matches(":disabled") ||
        element.getAttribute(
          "aria-disabled"
        ) === "true"
      ) {
        return;
      }

      const eventName = element.dataset.track;
      const target = element.dataset.target;

      if (!eventName || !target) {
        return;
      }

      const validation =
        analyticsEventSchema.safeParse({
          eventId: crypto.randomUUID(),
          sessionId,
          device,
          eventName,
          target,
        });

      if (validation.success) {
        send({
          eventName: validation.data.eventName,
          target: validation.data.target,
        });
      }
    }

    /* Manual interaction tracking */

    function handleCustomEvent(event: Event) {
      const customEvent =
        event as CustomEvent<EngagementPayload>;

      if (customEvent.detail) {
        send(customEvent.detail);
      }
    }

    document.addEventListener("click", handleClick);

    window.addEventListener(
      ANALYTICS_EVENT,
      handleCustomEvent
    );

    /* Visible-page duration */

    let heartbeat:
      | ReturnType<typeof setInterval>
      | undefined;

    function stopHeartbeat() {
      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = undefined;
      }
    }

    function syncHeartbeat() {
      stopHeartbeat();

      if (!document.hidden) {
        heartbeat = setInterval(() => {
          if (!document.hidden) {
            send({
              eventName: "heartbeat",
              target: "site",
            });
          }
        }, 15000);
      }
    }

    function handleVisibility() {
      syncHeartbeat();

      if (document.hidden) {
        void flushQueue(0);
      } else {
        sectionIds.forEach((id) => {
          const element =
            document.getElementById(id);

          if (element) {
            observer.unobserve(element);
            observer.observe(element);
          }
        });
      }
    }

    function handlePageHide() {
      void flushQueue(0);
    }

    syncHeartbeat();

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener(
      "pagehide",
      handlePageHide
    );

    /* Cleanup (also runs immediately on consent withdrawal) */

    return () => {
      active = false;
      queue.length = 0;

      clearTimers();
      inFlightController?.abort();
      inFlightController = null;

      observer.disconnect();
      stopHeartbeat();

      document.removeEventListener(
        "click",
        handleClick
      );

      window.removeEventListener(
        ANALYTICS_EVENT,
        handleCustomEvent
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "pagehide",
        handlePageHide
      );
    };
  }, [enabled]);

  return (
    <>
      {children}

      {/* Unobtrusive Opt-In Consent Prompt */}
      {showBanner && (
        <aside
          aria-label="Analytics consent preference"
          className="fixed bottom-4 right-4 left-4 z-40 mx-auto max-w-sm rounded-2xl border border-emerald-400/20 bg-[#121A20]/95 p-4 text-slate-100 shadow-2xl backdrop-blur-xl sm:left-auto"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" />
              <div className="flex flex-col gap-1">
                <span className="font-heading text-xs font-semibold text-slate-100">
                  Optional Engagement Analytics
                </span>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Help measure section exploration without storing IP addresses, chat text, or contact details.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Dismiss analytics prompt"
              onClick={() => updateConsent(false)}
              className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateConsent(false)}
              className="h-8 rounded-lg text-xs text-slate-400 hover:bg-white/5 hover:text-slate-100"
            >
              Decline
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => updateConsent(true)}
              className="h-8 rounded-lg bg-emerald-400 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
            >
              Enable Analytics
            </Button>
          </div>
        </aside>
      )}

      {/* Analytics Preferences */}

      <div className="flex w-full flex-col items-center border-t border-emerald-400/10 bg-[#080C10] px-4 py-5 text-slate-100 sm:px-6">
        <div className="flex w-full max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 size-5 shrink-0 text-emerald-400" />

            <div className="flex flex-col gap-1">
              <span className="font-heading text-sm font-medium">
                Engagement analytics
              </span>

              <p className="max-w-xl text-xs leading-relaxed text-slate-400">
                Optional session-based tracking helps
                evaluate how visitors explore SONIA.OS.
                Analytics does not record your chat
                text or contact messages.
              </p>

              <span className="font-mono text-[10px] text-slate-500">
                {enabled
                  ? "TRACKING ENABLED"
                  : "TRACKING DISABLED"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            aria-pressed={enabled}
            onClick={() =>
              updateConsent(!enabled)
            }
            className="w-full shrink-0 rounded-xl border-emerald-400/20 bg-emerald-400/5 text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200 sm:w-auto"
          >
            <Activity className="size-4" />

            {enabled
              ? "Disable Analytics"
              : "Enable Analytics"}
          </Button>
        </div>
      </div>
    </>
  );
}
