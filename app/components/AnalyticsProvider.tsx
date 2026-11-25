"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  Activity,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  ANALYTICS_EVENT,
  type EngagementPayload,
} from "@/lib/analytics";

import {
  analyticsEventSchema,
  sectionIds,
} from "@/lib/analytics-schema";

import {
  recordAnalyticsEvent,
} from "@/services/analytics.service";

const SESSION_KEY = "sonia_session_id";

const CONSENT_KEY = "sonia_analytics_consent";

const CONSENT_EVENT = "sonia:analytics-consent";

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
      sessionStorage.removeItem(
        SESSION_KEY
      );
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

  const enabled =
    consent === "enabled";

  useEffect(() => {
    if (!enabled) return;

    let sessionId: string;

    try {
      sessionId = getSessionId();
    } catch {
      return;
    }

    const device =
      getDeviceCategory();

    const seenSections =
      new Set<string>();

    let active = true;

    /* Record validated event */

    function send(
      payload: EngagementPayload
    ) {
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

      // Analytics must not block normal
      // application interactions.

      void recordAnalyticsEvent(
        validation.data
      ).catch(() => {
        // Best-effort analytics.
      });
    }

    /* Session initialization */

    send({
      eventName: "session_start",
      target: "site",
    });

    /* Automatic section tracking */

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (document.hidden) return;

          for (const entry of entries) {
            const section =
              entry.target.id;

            if (
              entry.isIntersecting &&
              !seenSections.has(section)
            ) {
              seenSections.add(section);

              send({
                eventName: "section_view",
                target: section,
              });
            }
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

    function handleClick(
      event: MouseEvent
    ) {
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

      const eventName =
        element.dataset.track;

      const target =
        element.dataset.target;

      if (!eventName || !target) {
        return;
      }

      // Runtime schema checks the
      // event name and target allowlist.

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
          eventName:
            validation.data.eventName,

          target:
            validation.data.target,
        });
      }
    }

    /* Manual interaction tracking */

    function handleCustomEvent(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<EngagementPayload>;

      if (customEvent.detail) {
        send(customEvent.detail);
      }
    }

    document.addEventListener(
      "click",
      handleClick
    );

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

      if (!document.hidden) {
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

    syncHeartbeat();

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    /* Cleanup */

    return () => {
      active = false;

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
    };
  }, [enabled]);

  return (
    <>
      {children}

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