import { z } from "zod";

import {
  connectionIntentValues,
} from "@/data/connection";

export const contactIntentSchema = z.enum(
  connectionIntentValues
);

export const contactFormSchema = z.object({
  intent: contactIntentSchema,

  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long.")
    .regex(
      /^[^\r\n]+$/,
      "Please enter a valid name."
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254)
    .transform((value) => value.toLowerCase()),

  organization: z
    .string()
    .trim()
    .max(150, "Organization name is too long.")
    .default(""),

  message: z
    .string()
    .trim()
    .min(20, "Please enter at least 20 characters.")
    .max(2000, "Message cannot exceed 2000 characters."),

  consent: z
    .boolean()
    .refine(
      (value) => value === true,
      {
        message:
          "Please agree to be contacted regarding this request.",
      }
    ),

  // Honeypot field for basic bot protection.
  website: z.string().max(200).default(""),
});

export const contactRequestSchema =
  contactFormSchema.extend({
    requestId: z.string().uuid(),
  });

export const contactResponseSchema = z.object({
  success: z.literal(true),

  requestId: z.string().uuid(),

  message: z.string(),
});

export type ContactFormData = z.infer<
  typeof contactFormSchema
>;

export type ContactRequest = z.infer<
  typeof contactRequestSchema
>;

export type ContactResponse = z.infer<
  typeof contactResponseSchema
>;