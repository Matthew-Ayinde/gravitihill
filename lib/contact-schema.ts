import * as z from "zod/mini";

/**
 * The contact schema — the one schema on the site that has to run in a browser.
 *
 * ── Why this file uses `zod/mini` ───────────────────────────────────────────
 * Everything in lib/schemas.ts validates content at build time and never
 * crosses the client boundary, so it uses Zod's ergonomic API. This schema is
 * imported by ContactForm, which is a client component, so it ships. The
 * classic API pulled ~50 kB gzipped onto /contact — the single most
 * commercially important page on the site — for eight fields of validation.
 *
 * `zod/mini` is the same library through a tree-shakable entry point, not a
 * second validation stack: identical semantics, identical `safeParse`,
 * identical issue shape. It is still the single source of truth, still shared
 * verbatim between the form and the route handler.
 *
 * The rule, so this does not drift: content schemas → lib/schemas.ts.
 * Anything a client component imports → zod/mini, here.
 */

export const ENQUIRY_TYPES = [
  "Brand Development",
  "Business Advisory",
  "Executive Coaching",
  "Market Expansion",
  "General",
] as const;

export const BUDGET_RANGES = [
  "Under ₦5m",
  "₦5m – ₦20m",
  "₦20m – ₦50m",
  "Over ₦50m",
  "Not yet defined",
] as const;

export const enquiryTypeSchema = z.enum(ENQUIRY_TYPES);
export const budgetRangeSchema = z.enum(BUDGET_RANGES);

/**
 * Errors are written in the interface voice — plain, specific, no apology.
 * Values are trimmed by the caller before parsing, so length checks measure
 * real content rather than whitespace.
 */
export const contactSchema = z.object({
  name: z.string().check(z.minLength(2, "Enter your full name")),
  company: z.string().check(z.minLength(2, "Enter your company")),
  role: z.string().check(z.minLength(2, "Enter your role")),
  email: z.email("Enter a work email so we can reply"),
  phone: z.optional(z.string()),
  enquiryType: enquiryTypeSchema,
  budget: z.optional(z.union([budgetRangeSchema, z.literal("")])),
  message: z
    .string()
    .check(z.minLength(20, "Tell us a little more — 20 characters at least")),
  /**
   * Honeypot. Bots fill it; humans never see it.
   *
   * Deliberately unconstrained. Constraining it to empty (`maxLength(0)`) made
   * a filled honeypot fail *validation*, which returns 400 — and a 400 tells
   * the bot precisely which field to drop on the retry. The route accepts the
   * value, then answers 200 without sending, so a filled honeypot is
   * indistinguishable from a successful submission.
   */
  website: z.optional(z.string()),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Trim every string before validating, so " " never passes a length check. */
export function normaliseContactInput(input: ContactInput): ContactInput {
  return {
    ...input,
    name: input.name.trim(),
    company: input.company.trim(),
    role: input.role.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() ?? "",
    message: input.message.trim(),
  };
}
