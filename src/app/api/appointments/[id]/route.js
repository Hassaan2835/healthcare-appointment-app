import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendAppointmentEmail } from "@/lib/email";
import {
  canManageAppointment,
  serializeAppointment,
} from "@/lib/appointments-api";
import { rescheduleSchema, validateBody } from "@/lib/validation";
import {
  ApiError,
  handleApiError,
  parseJsonBody,
  requireSession,
  validationError,
} from "@/lib/api-errors";

// PATCH / DELETE /api/appointments/[id] — reschedule or cancel one
// booking. Auth required, and only the patient who booked it (or an
// admin) may change it. On success the patient is emailed about the
// change (Day 19, src/lib/email.js).
//
// PATCH — reschedule. Body: { date ("YYYY-MM-DD"), slot ("HH:MM AM/PM",
// optional), reason?, notes? } — validated by rescheduleSchema (Zod,
// Day 18); reason / notes are only overwritten when present in the body.
//   200  rescheduled — { message, appointment }
//   400  missing or invalid fields — { error, details }
//   401  not logged in — { error }
//   403  not your appointment — { error }
//   404  no appointment with that id — { error }
//   409  the doctor already has a booking at the new time, or the
//        appointment can no longer be changed — { error }
//   503  the database cannot be reached — { error }
//
// DELETE — cancel. No body. The appointment is kept as a record with
// status CANCELLED, never hard-deleted, so the dashboard history and
// the admin view stay accurate.
//   200  cancelled — { message, appointment }
//   401 / 403 / 404 / 409 / 503 as above.
//
// Only PENDING or CONFIRMED appointments can be cancelled or
// rescheduled: a CANCELLED appointment is already closed, and a
// COMPLETED visit is history. All errors are { error, details? } —
// see src/lib/api-errors.js.

const CHANGEABLE = ["PENDING", "CONFIRMED"];

const includeDoctor = {
  doctor: { include: { user: { select: { name: true } } } },
  patient: { select: { name: true, email: true } },
};

async function loadAppointment(id) {
  return prisma.appointment.findUnique({
    where: { id },
    include: includeDoctor,
  });
}

function loadOrThrow(appointment, session) {
  if (!appointment) {
    throw new ApiError(404, "Appointment not found.");
  }
  if (!canManageAppointment(session, appointment)) {
    throw new ApiError(403, "You can only change your own appointments.");
  }
  if (!CHANGEABLE.includes(appointment.status)) {
    throw new ApiError(
      409,
      appointment.status === "CANCELLED"
        ? "This appointment is already cancelled."
        : "This appointment can no longer be changed."
    );
  }
  return appointment;
}

export async function PATCH(request, { params }) {
  try {
    const session = await requireSession(
      "You must be logged in to manage appointments."
    );
    const body = await parseJsonBody(request);
    const { value, errors } = validateBody(rescheduleSchema, body);
    if (errors) throw validationError(errors);

    const appointment = loadOrThrow(await loadAppointment(params.id), session);

    // The new time must be free for this doctor — same rule as booking,
    // but the appointment being moved does not clash with itself.
    const clash = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        date: value.dateTime,
        status: { not: "CANCELLED" },
        id: { not: appointment.id },
      },
    });
    if (clash) {
      throw new ApiError(
        409,
        "That time slot is already booked. Please pick another time."
      );
    }

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        date: value.dateTime,
        reason: value.hasReason ? value.reason || null : undefined,
        notes: value.hasNotes ? value.notes || null : undefined,
      },
      include: includeDoctor,
    });

    // Day 19: tell the patient about the new time. A failed send
    // never fails the reschedule.
    await sendAppointmentEmail("rescheduled", updated);

    return NextResponse.json(
      {
        message: "Appointment rescheduled.",
        appointment: serializeAppointment(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(
      error,
      "Rescheduling is unavailable right now. Please try again later.",
      503
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireSession(
      "You must be logged in to manage appointments."
    );
    const appointment = loadOrThrow(await loadAppointment(params.id), session);

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED" },
      include: includeDoctor,
    });

    // Day 19: confirm the cancellation by email.
    await sendAppointmentEmail("cancelled", updated);

    return NextResponse.json(
      {
        message: "Appointment cancelled.",
        appointment: serializeAppointment(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(
      error,
      "Cancellation is unavailable right now. Please try again later.",
      503
    );
  }
}
