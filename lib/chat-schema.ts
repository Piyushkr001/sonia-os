import { z } from "zod";

export const chatTopicSchema = z.enum([
  "profile",
  "journey",
  "expertise",
  "leadership",
  "philosophy",
  "connection",
  "other",
]);

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),

  content: z
    .string()
    .trim()
    .min(1)
    .max(3000),
});

export const chatRequestSchema = z.object({
  question: z
    .string()
    .trim()
    .min(2, "Please enter a valid question.")
    .max(1000, "Question is too long."),

  history: z
    .array(chatMessageSchema)
    .max(8)
    .default([]),
});

export const aiOutputSchema = z.object({
  answer: z.string().trim().min(1).max(3000),

  topic: chatTopicSchema,

  sourceIds: z
    .array(z.string())
    .max(10),
});

export const chatResponseSchema = z.object({
  success: z.literal(true),

  answer: z.string(),

  topic: chatTopicSchema,

  sources: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      source: z.string(),
      url: z.string().optional(),
    })
  ),

  responseTimeMs: z.number(),
});

export type ChatRequest = z.infer<
  typeof chatRequestSchema
>;

export type ChatResponse = z.infer<
  typeof chatResponseSchema
>;

export type ChatTopic = z.infer<
  typeof chatTopicSchema
>;

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatResponse["sources"];
};