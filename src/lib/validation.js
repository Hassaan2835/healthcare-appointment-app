// Day 18: request validation with Zod.
//
// Replaces the hand-rolled validators that lived in
// src/lib/appointments-api.js (Days 16-17) and the inline checks in
// the register / profile routes. Every schema produces the same
// friendly messages the old checks did, so clients see no behaviour
// change — they just also get a `details` list of { field, message }
// on a 400, so a form can highlight every bad field at once.
//
// validateBody(schema, body) returns { value } on success or
// { errors } — the same shape the old validators returned, so routes
// barely change. dateTime is computed by the schema itself (the
// "YYYY-MM-DD" date + optional "HH:MM AM/PM" slot folded into one
// Date, see combineDateAndSlot in appointments-api.js).

import { z } from "zod";
import { combineDateAndSlot, parseSlot } from "./appointments-api";
import { DEFAULT_LIMIT, MAX_LIMIT } from "./doctors-api";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const dateField = (requiredMessage) =>
  z
    .string({
      required_error: requiredMessage,
      invalid_type_error: requiredMessage,
    })
    .trim()
    .min(1, requiredMessage)
    .regex(DATE_PATTERN, "Please choose a valid appointment date.");

const slotField = z
  .string({ invalid_type_error: "Please pick a valid time slot." })
  .trim()
  .optional()
  .nullable();

const reasonField = z
  .string({ invalid_type_error: "Reason for visit must be text." })
  .trim()
  .max(500, "Reason for visit is too long (max 500 characters).")
  .optional();

const notesField = z
  .string({ invalid_type_error: "Notes must be text." })
  .trim()
  .max(1000, "Notes are too long (max 1000 characters).")
  .optional();

// Shared date + slot rules for booking and rescheduling: the slot
// must parse, the combined datetime must be a real calendar date,
// and it must be in the future. Guarded on the date pattern so a
// malformed date reports its own message once, not twice.
function checkDateAndSlot(data, ctx) {
  if (data.slot && !parseSlot(data.slot)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["slot"],
      message: "Please pick a valid time slot.",
    });
    return;
  }
  if (!DATE_PATTERN.test(data.date || "")) return;
  const dateTime = combineDateAndSlot(data.date, data.slot || null);
  if (!dateTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["date"],
      message: "Please choose a valid appointment date.",
    });
  } else if (dateTime.getTime() <= Date.now()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["date"],
      message: "Please choose a future date and time.",
    });
  }
}

// POST /api/appointments — { doctorId, date, slot?, reason?, notes? }
export const bookingSchema = z
  .object({
    doctorId: z
      .string({
        required_error: "Please select a doctor.",
        invalid_type_error: "Please select a doctor.",
      })
      .trim()
      .min(1, "Please select a doctor."),
    date: dateField("Please choose an appointment date."),
    slot: slotField,
    reason: reasonField.default(""),
    notes: notesField.default(""),
  })
  .superRefine((data, ctx) => checkDateAndSlot(data, ctx))
  .transform((data) => ({
    ...data,
    dateTime: combineDateAndSlot(data.date, data.slot || null),
  }));

// PATCH /api/appointments/[id] — { date, slot?, reason?, notes? }.
// reason / notes are only overwritten when present in the body, so
// hasReason / hasNotes record whether the key was sent at all.
export const rescheduleSchema = z
  .object({
    date: dateField("Please choose a new appointment date."),
    slot: slotField,
    reason: reasonField,
    notes: notesField,
  })
  .superRefine((data, ctx) => checkDateAndSlot(data, ctx))
  .transform((data) => ({
    ...data,
    dateTime: combineDateAndSlot(data.date, data.slot || null),
    hasReason: "reason" in data,
    hasNotes: "notes" in data,
  }));

// POST /api/register — { name, email, password, phone? }
export const registerSchema = z.object({
  name: z
    .string({
      required_error: "Please enter your full name.",
      invalid_type_error: "Please enter your full name.",
    })
    .trim()
    .min(2, "Please enter your full name."),
  email: z
    .string({
      required_error: "Please enter a valid email address.",
      invalid_type_error: "Please enter a valid email address.",
    })
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  password: z
    .string({
      required_error: "Password must be at least 6 characters long.",
      invalid_type_error: "Password must be at least 6 characters long.",
    })
    .min(6, "Password must be at least 6 characters long."),
  phone: z
    .string({ invalid_type_error: "Please enter a valid phone number." })
    .trim()
    .optional()
    .default(""),
});

// PATCH /api/profile — { name, phone? }. Email and role can never be
// changed through this route, so they are not in the schema at all —
// extra keys are stripped by Zod, never passed to Prisma.
export const profileSchema = z
  .object({
    name: z
      .string({
        required_error: "Please enter your full name.",
        invalid_type_error: "Please enter your full name.",
      })
      .trim()
      .min(2, "Please enter your full name."),
    phone: z
      .string({ invalid_type_error: "Please enter a valid phone number." })
      .trim()
      .max(30, "Please enter a valid phone number.")
      .optional()
      .default(""),
  })
  .superRefine((data, ctx) => {
    if (data.phone && data.phone.length < 7) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Please enter a valid phone number.",
      });
    }
  });

// GET /api/doctors query string — lenient by design: invalid values
// fall back to safe defaults instead of erroring, as before.
//   q, specialty: free text · available: "true" | "false"
//   page: >= 1, defaults to 1 · limit: 1-50, defaults to 20
export const doctorQuerySchema = z.object({
  q: z.string().trim().default(""),
  specialty: z.string().trim().default(""),
  available: z
    .string()
    .trim()
    .toLowerCase()
    .transform((value) =>
      value === "true" ? true : value === "false" ? false : null
    )
    .default(null),
  page: z
    .string()
    .optional()
    .transform((value) => {
      const page = Number.parseInt(value || "1", 10);
      return Number.isFinite(page) && page > 0 ? page : 1;
    }),
  limit: z
    .string()
    .optional()
    .transform((value) => {
      const limit = Number.parseInt(value || String(DEFAULT_LIMIT), 10);
      return Number.isFinite(limit) && limit > 0
        ? Math.min(limit, MAX_LIMIT)
        : DEFAULT_LIMIT;
    }),
});

// Validate a parsed body (or query object) against a schema.
// Returns { value } on success, or { errors } — a list of
// { field, message } in schema order, first error first.
export function validateBody(schema, body) {
  const result = schema.safeParse(body ?? {});
  if (result.success) return { value: result.data };
  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
  return { errors };
}
