import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
  varchar,
} from "drizzle-orm/pg-core";

export const aiTopicEnum = pgEnum("ai_topic", [
  "profile",
  "journey",
  "expertise",
  "leadership",
  "philosophy",
  "connection",
  "other",
]);

export const aiStatusEnum = pgEnum("ai_status", [
  "success",
  "insufficient_context",
  "failed",
]);

export const aiDailyUsage = pgTable("ai_daily_usage", {
  day: text("day").primaryKey(),

  requests: integer("requests")
    .notNull()
    .default(0),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const aiInteractions = pgTable(
  "ai_interactions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    topic: aiTopicEnum("topic")
      .notNull()
      .default("other"),

    status: aiStatusEnum("status")
      .notNull(),

    responseTimeMs: integer("response_time_ms")
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("ai_interactions_created_at_idx")
      .on(table.createdAt),

    index("ai_interactions_topic_idx")
      .on(table.topic),
  ]
);


export const connectionIntentEnum = pgEnum(
  "connection_intent",
  [
    "collaboration",
    "networking",
    "innovation",
    "opportunity",
    "general",
  ]
);

export const connectionStatusEnum = pgEnum(
  "connection_status",
  [
    "new",
    "reviewed",
    "replied",
    "archived",
  ]
);

export const notificationStatusEnum = pgEnum(
  "connection_notification_status",
  [
    "pending",
    "sent",
    "failed",
    "disabled",
  ]
);

export const connectionRequests = pgTable(
  "connection_requests",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    intent: connectionIntentEnum("intent")
      .notNull(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    email: varchar("email", {
      length: 254,
    }).notNull(),

    organization: varchar("organization", {
      length: 150,
    }),

    message: text("message")
      .notNull(),

    status: connectionStatusEnum("status")
      .default("new")
      .notNull(),

    notificationStatus: notificationStatusEnum(
      "notification_status"
    )
      .default("disabled")
      .notNull(),

    consentedAt: timestamp("consented_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("connection_requests_created_at_idx")
      .on(table.createdAt),

    index("connection_requests_intent_idx")
      .on(table.intent),

    index("connection_requests_status_idx")
      .on(table.status),
  ]
);

export const contactDailyUsage = pgTable(
  "contact_daily_usage",
  {
    day: text("day")
      .primaryKey(),

    requests: integer("requests")
      .default(0)
      .notNull(),
  }
);

export type ConnectionRequest =
  typeof connectionRequests.$inferSelect;

export type NewConnectionRequest =
  typeof connectionRequests.$inferInsert;


  export const visitorSessions = pgTable(
  "visitor_sessions",
  {
    id: uuid("id").primaryKey(),

    device: varchar("device", {
      length: 20,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    lastSeenAt: timestamp("last_seen_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("visitor_sessions_created_at_idx")
      .on(table.createdAt),
  ]
);

export const engagementEvents = pgTable(
  "engagement_events",
  {
    id: uuid("id").primaryKey(),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => visitorSessions.id, {
        onDelete: "cascade",
      }),

    eventName: varchar("event_name", {
      length: 50,
    }).notNull(),

    target: varchar("target", {
      length: 80,
    }).notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("engagement_events_session_idx")
      .on(table.sessionId),

    index("engagement_events_name_idx")
      .on(table.eventName),

    index("engagement_events_created_at_idx")
      .on(table.createdAt),
  ]
);

export type VisitorSession =
  typeof visitorSessions.$inferSelect;

export type EngagementEvent =
  typeof engagementEvents.$inferSelect;