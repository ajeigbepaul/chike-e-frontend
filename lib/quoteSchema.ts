import { z } from "zod";

/**
 * Validation for the customer Request Quote form.
 *
 * Numbers are held as strings so what is displayed and what is validated can
 * never disagree - storing Number("05") while the box still reads "05" is how
 * leading zeros slipped through before. The form converts to numbers on submit.
 */

export const MAX_EXPECTED_PRICE = 1_000_000_000;
export const MAX_MESSAGE_LENGTH = 2000;

// Permissive on purpose: local (08031234567) and international
// (+234 803 123 4567) forms, with spaces, dashes or parens.
export const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

export const buildQuoteSchema = (moq: number) =>
  z.object({
    quantity: z
      .string()
      .trim()
      .min(1, "Quantity is required")
      .refine((v) => /^\d+$/.test(v), "Enter a whole number")
      .refine(
        (v) => Number(v) >= moq,
        moq > 1 ? `Minimum order is ${moq}` : "Quantity must be at least 1"
      ),

    expectedPrice: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || /^\d+(\.\d{1,2})?$/.test(v),
        "Enter an amount, e.g. 15000 or 15000.50"
      )
      .refine((v) => v === "" || Number(v) > 0, "Price must be greater than 0")
      .refine(
        (v) => v === "" || Number(v) <= MAX_EXPECTED_PRICE,
        "That price looks too large"
      ),

    customerName: z
      .string()
      .trim()
      .min(2, "Enter your full name")
      .max(100, "Name is too long"),

    customerEmail: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(254, "Email is too long")
      .email("Enter a valid email address"),

    customerPhone: z
      .string()
      .trim()
      .refine((v) => v === "" || PHONE_RE.test(v), "Enter a valid phone number"),

    company: z.string().trim().max(100, "Company name is too long"),

    message: z
      .string()
      .trim()
      .max(MAX_MESSAGE_LENGTH, "Message is too long"),

    urgency: z.enum(["low", "medium", "high"]),
  });

export type QuoteFormValues = z.infer<ReturnType<typeof buildQuoteSchema>>;
