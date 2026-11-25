import { z } from "zod";

export const sectionIds = [
  "explore",
  "journey",
  "expertise",
  "ideas",
  "ai",
  "connect",
  "footer",
] as const;

export const analyticsEventNames = [
  "session_start",
  "section_view",
  "navigation_click",
  "hero_action",
  "journey_chapter",
  "knowledge_node",
  "leadership_open",
  "challenge_selected",
  "engine_run",
  "engine_reset",
  "ai_question",
  "connection_intent",
  "connection_submit",
  "footer_action",
  "heartbeat",
] as const;

export type AnalyticsEventName =
  (typeof analyticsEventNames)[number];

const eventTargets: Record<
  AnalyticsEventName,
  readonly string[]
> = {
  session_start: ["site"],

  section_view: sectionIds,

  navigation_click: [
    ...sectionIds,
    "leadership",
  ],

  hero_action: [
    "journey",
    "expertise",
    "leadership",
    "ideas",
    "ai",
  ],

  journey_chapter: [
    "01",
    "02",
    "03",
    "04",
  ],

  knowledge_node: [
    "01",
    "02",
    "03",
    "04",
    "05",
  ],

  leadership_open: [
    "01",
    "02",
    "03",
    "04",
  ],

  challenge_selected: [
    "workflow",
    "information",
    "repetition",
    "complexity",
  ],

  engine_run: [
    "workflow",
    "information",
    "repetition",
    "complexity",
  ],

  engine_reset: ["engine"],

  ai_question: ["answered"],

  connection_intent: [
    "collaboration",
    "networking",
    "innovation",
    "opportunity",
    "general",
  ],

  connection_submit: ["recorded"],

  footer_action: [
    ...sectionIds,
    "privacy",
    "back_to_top",
  ],

  heartbeat: ["site"],
};

export const analyticsEventSchema = z
  .object({
    eventId: z.string().uuid(),

    sessionId: z.string().uuid(),

    eventName: z.enum(analyticsEventNames),

    target: z.string().min(1).max(80),

    device: z.enum([
      "mobile",
      "tablet",
      "desktop",
    ]),
  })
  .superRefine((data, context) => {
    if (
      !eventTargets[data.eventName].includes(
        data.target
      )
    ) {
      context.addIssue({
        code: "custom",
        path: ["target"],
        message: "Invalid analytics target.",
      });
    }
  });

export type AnalyticsEventInput = z.infer<
  typeof analyticsEventSchema
>;

export const analyticsSummarySchema = z.object({
  sessions: z.number(),

  interactions: z.number(),

  averageVisibleSeconds: z.number(),

  engagementRate: z.number(),

  aiInteractions: z.number(),

  connections: z.number(),

  days: z.number(),

  sections: z.array(
    z.object({
      section: z.string(),
      views: z.number(),
    })
  ),

  topActions: z.array(
    z.object({
      eventName: z.string(),
      target: z.string(),
      total: z.number(),
    })
  ),
});

export type AnalyticsSummary = z.infer<
  typeof analyticsSummarySchema
>;