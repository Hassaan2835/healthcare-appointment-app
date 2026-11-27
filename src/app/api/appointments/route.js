import { sendAppointmentEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializeAppointment } from "@/lib/appointments-api";
import { bookingSchema, validateBody } from "@/lib/validation";
import {
  ApiError,
  handleApiError,
  parseJsonBody,
  requireSession,
  validationError,
} from "@/lib/api-errors";

// POST /api/appointments — book a visit with a doctor.
// Auth required: the appointment is always created for the signed-in
// user, so nobody can book on someone else's behalf. On success the
// patient gets a booking-confirmation email (Day 19, src/lib/email.js;
// skipped with a console note when SMTP is not configured).
//
// Body: { doctorId, date ("YYYY-MM-DD"), slot ("HH:MM AM/PM", optional),
//         reason?, notes? } — validated by bookingSchema (Zod, Day 18).
// The slot is folded into the stored datetime (the Appointment model
// has no separate slot column); see src/lib/appointments-api.js.
//
// Responses (all errors are { error, details? } — see api-errors.js):
//   201  booking created — { message, appointment }
//   400  missing or invalid fields — { error, details }
//   401  not logged in — { error }
//   404  doctorId is not a doctor in the system — { error }
//   409  that doctor already has a booking at this date and time — { error }
//   503  the database cannot be reached — { error }
//
// Note: the sample doctors on the listing page are fallback data, not
// database records, so booking one of them returns 404 until the
// database holds real doctors (see the Day 15 note in
// src/app/api/doctors/route.js). Real bookings are never faked:
// when the database is down the endpoint answers 503 instead of
// pretending the booking succeeded.
export async function POST(request) {
  try {
    const session = await requireSession(
      "You must be logged in to book an appointment."
    );
    const body = await parseJsonBody(request);
    const { value, errors } = validateBody(bookingSchema, body);
    if (errors) throw validationError(errors);

    const doctor = await prisma.doctor.findUnique({
      where: { id: value.doctorId },
      include: { user: { select: { name: true } } },
    });
    if (!doctor) {
      throw new ApiError(
        404,
        "Doctor not found. Online booking is only available for doctors listed in the system."
      );
    }

    const clash = await prisma.appointment.findFirst({
      where: {
        doctorId: value.doctorId,
        date: value.dateTime,
        status: { not: "CANCELLED" },
      },
    });
    if (clash) {
      throw new ApiError(
        409,
        "That time slot is already booked. Please pick another time."
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId: value.doctorId,
        date: value.dateTime,
        reason: value.reason || null,
        notes: value.notes || null,
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        patient: { select: { name: true, email: true } },
      },
    });

    // Day 19: email the patient their booking confirmation. A failed
    // send never fails the booking — sendAppointmentEmail logs it and
    // the 201 below still goes out.
    await sendAppointmentEmail("booked", appointment);

    return NextResponse.json(
      {
        message: "Appointment booked.",
        appointment: serializeAppointment(appointment),
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(
      error,
      "Booking is unavailable right now. Please try again later.",
      503
    );
  }
}
