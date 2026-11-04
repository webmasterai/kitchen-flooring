import { z } from "zod";
import { quoteServiceOptions } from "./content";

const serviceValues = quoteServiceOptions.map((o) => o.value) as [
  string,
  ...string[],
];

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(254, "Email is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone number.")
    .max(40, "Phone number is too long.")
    .regex(/^[0-9+().\-\s]+$/, "Phone number contains invalid characters."),
  service: z.enum(serviceValues, {
    error: "Please select a service.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a bit about your project.")
    .max(5000, "Message is too long."),
  areaSize: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const MAX_QUOTE_BODY_BYTES = 20_000;
