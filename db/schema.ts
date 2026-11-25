import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  timestamp,
  index,
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