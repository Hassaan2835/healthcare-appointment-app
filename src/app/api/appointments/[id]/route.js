import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import {
  validateRescheduleBody,
  canManageAppointment,
  serializeAppointment,
} from "@/lib/appointments-api";

// PATCH / DELETE /api/appointments/[id] — reschedule or cancel one
// booking. Auth required, and only the patient who booked it (or an
// admin) may change it.
//
// PATCH — reschedule. Body: { date ("YYYY-MM-DD"), slot ("HH:MM AM/PM",
// optional), reason?, notes? } — reason / notes are only overwritten
// when they are present in the body.
//   200  rescheduled — { message, appointment }
//   400  missing or invalid fields — { error }
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
// COMPLETED visit is history.

const CHANGEABLE = ["PENDING", "CONFIRMED"];

const includeDoctor = {
  doctor: { include: { user: { select: { name: true } } } },
};

async function loadAppointment(id) {
  return prisma.appointment.findUnique({
    where: { id },
    include: includeDoctor,
  });
}

function notFound() {
  return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
}

function forbidden() {
  return NextResponse.json(
    { error: "You can only change your own appointments." },
    { status: 403 }
  );
}

function notChangeable(appointment) {
  return NextResponse.json(
    {
      error:
        appointment.status === "CANCELLED"
          ? "This appointment is already cancelled."
          : "This appointment can no longer be changed.",
    },
    { status: 409 }
  );
}

async function authorize(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { error: "You must be logged in to manage appointments." },
        { status: 401 }
      ),
    };
  }
  return { session };
}

export async function PATCH(request, { params }) {
  const { session, error } = await authorize(request);
  if (error) return error;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { value, errors } = validateRescheduleBody(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  try {
    const appointment = await loadAppointment(params.id);
    if (!appointment) return notFound();
    if (!canManageAppointment(session, appointment)) return forbidden();
    if (!CHANGEABLE.includes(appointment.status)) return notChangeable(appointment);

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
      return NextResponse.json(
        { error: "That time slot is already booked. Please pick another time." },
        { status: 409 }
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

    return NextResponse.json(
      {
        message: "Appointment rescheduled.",
        appointment: serializeAppointment(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/appointments/[id] error:", error);
    return NextResponse.json(
      { error: "Rescheduling is unavailable right now. Please try again later." },
      { status: 503 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { session, error } = await authorize(request);
  if (error) return error;

  try {
    const appointment = await loadAppointment(params.id);
    if (!appointment) return notFound();
    if (!canManageAppointment(session, appointment)) return forbidden();
    if (!CHANGEABLE.includes(appointment.status)) return notChangeable(appointment);

    const updated = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED" },
      include: includeDoctor,
    });

    return NextResponse.json(
      {
        message: "Appointment cancelled.",
        appointment: serializeAppointment(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/appointments/[id] error:", error);
    return NextResponse.json(
      { error: "Cancellation is unavailable right now. Please try again later." },
      { status: 503 }
    );
  }
}
