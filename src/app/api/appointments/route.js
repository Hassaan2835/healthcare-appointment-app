import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import {
  validateBookingBody,
  serializeAppointment,
} from "@/lib/appointments-api";

// POST /api/appointments — book a visit with a doctor.
// Auth required: the appointment is always created for the signed-in
// user, so nobody can book on someone else's behalf.
//
// Body: { doctorId, date ("YYYY-MM-DD"), slot ("HH:MM AM/PM", optional),
//         reason?, notes? }
// The slot is folded into the stored datetime (the Appointment model
// has no separate slot column); see src/lib/appointments-api.js.
//
// Responses:
//   201  booking created — { message, appointment }
//   400  missing or invalid fields — { error }
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
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to book an appointment." },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { value, errors } = validateBookingBody(body);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: value.doctorId },
      include: { user: { select: { name: true } } },
    });
    if (!doctor) {
      return NextResponse.json(
        {
          error:
            "Doctor not found. Online booking is only available for doctors listed in the system.",
        },
        { status: 404 }
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
      return NextResponse.json(
        { error: "That time slot is already booked. Please pick another time." },
        { status: 409 }
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
      },
    });

    return NextResponse.json(
      {
        message: "Appointment booked.",
        appointment: serializeAppointment(appointment),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Booking is unavailable right now. Please try again later." },
      { status: 503 }
    );
  }
}
