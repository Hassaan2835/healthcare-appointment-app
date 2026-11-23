import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializeDbDoctor, serializeSampleDoctor } from "@/lib/doctors-api";
import { doctors as sampleDoctors } from "@/data/doctors";

// GET /api/doctors/[id] — one doctor by id.
// Looks in the database first, then in the built-in sample data, so the
// doctor detail page keeps working in a checkout without DATABASE_URL.
export async function GET(request, { params }) {
  const id = params.id;

  try {
    const record = await prisma.doctor.findUnique({
      where: { id },
      include: { user: { select: { name: true } } },
    });
    if (record) {
      return NextResponse.json({ doctor: serializeDbDoctor(record), source: "database" });
    }
  } catch (error) {
    console.error(`GET /api/doctors/${id} database error, trying sample data:`, error);
  }

  const sample = sampleDoctors.find((doctor) => String(doctor.id) === id);
  if (sample) {
    return NextResponse.json({ doctor: serializeSampleDoctor(sample), source: "sample" });
  }

  return NextResponse.json({ error: "Doctor not found." }, { status: 404 });
}
