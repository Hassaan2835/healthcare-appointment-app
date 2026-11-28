import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  serializeDbDoctor,
  serializeSampleDoctor,
  filterSampleDoctors,
  sortDoctors,
  paginate,
} from "@/lib/doctors-api";
import { doctorQuerySchema, validateBody } from "@/lib/validation";
import { handleApiError } from "@/lib/api-errors";

// GET /api/doctors — list doctors from the database.
// Query params (validated by doctorQuerySchema, Zod, Day 18 —
// invalid values fall back to safe defaults instead of erroring):
//   q           search by doctor name, specialty, hospital or city
//   specialty   exact specialty name (e.g. "Cardiology"), "All" means any
//   available   "true" | "false" — only doctors taking appointments
//   minFee, maxFee   consultation fee range in Rs. (a max below the
//     min is ignored) · minExperience: minimum years of experience
//   sort        "fee-asc" | "fee-desc" | "experience" | "newest"
//   page, limit  pagination (limit defaults to 20, max 50)
//
// Response: { doctors, total, page, limit, pages, source }
// `source` is "database" normally; if the database cannot be reached the
// endpoint falls back to the built-in sample data ("sample") so the
// listing page keeps working in a checkout without DATABASE_URL.
export async function GET(request) {
  const { value: query } = validateBody(
    doctorQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams.entries())
  );
  const { q, specialty, available, minFee, maxFee, minExperience, sort, page, limit } = query;

  // Day 20: advanced filters. A max fee below the min fee is ignored
  // so a half-filled range never filters everything out by accident.
  const max = maxFee !== null && (minFee === null || maxFee >= minFee) ? maxFee : null;
  const orderBy =
    sort === "fee-asc"
      ? { fee: "asc" }
      : sort === "fee-desc"
        ? { fee: "desc" }
        : sort === "experience"
          ? { experience: "desc" }
          : { createdAt: "desc" };

  try {
    const where = {};
    if (specialty && specialty !== "All") {
      where.specialization = specialty;
    }
    if (available !== null) {
      where.available = available;
    }
    if (minFee !== null || max !== null) {
      where.fee = {};
      if (minFee !== null) where.fee.gte = minFee;
      if (max !== null) where.fee.lte = max;
    }
    if (minExperience !== null) {
      where.experience = { gte: minExperience };
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
        orderBy,
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
    const filtered = filterSampleDoctors({ q, specialty, available, minFee, maxFee, minExperience });
    const sorted = sortDoctors(filtered, sort);
    const { items, total, page: safePage, pages } = paginate(sorted, page, limit);
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
