import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  parseDoctorQuery,
  serializeDbDoctor,
  serializeSampleDoctor,
  filterSampleDoctors,
  paginate,
} from "@/lib/doctors-api";

// GET /api/doctors — list doctors from the database.
// Query params:
//   q           search by doctor name, specialty, hospital or city
//   specialty   exact specialty name (e.g. "Cardiology"), "All" means any
//   available   "true" | "false" — only doctors taking appointments
//   page, limit  pagination (limit defaults to 20, max 50)
//
// Response: { doctors, total, page, limit, pages, source }
// `source` is "database" normally; if the database cannot be reached the
// endpoint falls back to the built-in sample data ("sample") so the
// listing page keeps working in a checkout without DATABASE_URL.
export async function GET(request) {
  const { q, specialty, available, page, limit } = parseDoctorQuery(
    request.nextUrl.searchParams
  );

  try {
    const where = {};
    if (specialty && specialty !== "All") {
      where.specialization = specialty;
    }
    if (available !== null) {
      where.available = available;
    }
    if (q) {
      where.OR = [
        { user: { name: { contains: q, mode: "insensitive" } } },
        { specialization: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
      ];
    }

    const [records, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.doctor.count({ where }),
    ]);

    return NextResponse.json({
      doctors: records.map(serializeDbDoctor),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      source: "database",
    });
  } catch (error) {
    console.error("GET /api/doctors database error, using sample data:", error);
    const filtered = filterSampleDoctors({ q, specialty, available });
    const { items, total, page: safePage, pages } = paginate(filtered, page, limit);
    return NextResponse.json({
      doctors: items.map(serializeSampleDoctor),
      total,
      page: safePage,
      limit,
      pages,
      source: "sample",
    });
  }
}
