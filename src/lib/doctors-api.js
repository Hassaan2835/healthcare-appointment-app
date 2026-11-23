// Day 15: Shared helpers for the GET /api/doctors endpoints.
// The database is the source of truth; the sample data in src/data/doctors.js
// is only a fallback so the API still answers when no database is reachable
// (for example in a fresh checkout without DATABASE_URL configured).

import { doctors as sampleDoctors } from "@/data/doctors";

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

// Parse and validate the query string shared by the list endpoint.
// Invalid values fall back to safe defaults instead of erroring.
export function parseDoctorQuery(searchParams) {
  const q = (searchParams.get("q") || "").trim();
  const specialty = (searchParams.get("specialty") || "").trim();
  const availableParam = (searchParams.get("available") || "").trim().toLowerCase();
  const available =
    availableParam === "true" ? true : availableParam === "false" ? false : null;

  const rawPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const rawLimit = Number.parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  return { q, specialty, available, page, limit };
}

// One public shape for a doctor, whichever source it came from.
// Fields the database does not store yet (hospital, city, rating, ...) are
// null on database records and filled in on sample records.
export function serializeDbDoctor(doctor) {
  return {
    id: doctor.id,
    name: doctor.user?.name || "Dr. (name not set)",
    specialty: doctor.specialization,
    bio: doctor.bio,
    about: doctor.bio,
    qualification: null,
    hospital: null,
    city: null,
    timings: null,
    languages: [],
    experienceYears: doctor.experience,
    rating: null,
    reviews: 0,
    fee: doctor.fee,
    available: doctor.available,
    availableToday: doctor.available,
  };
}

export function serializeSampleDoctor(doctor) {
  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    bio: doctor.about,
    about: doctor.about,
    qualification: doctor.qualification,
    hospital: doctor.hospital,
    city: doctor.city,
    timings: doctor.timings,
    languages: doctor.languages,
    experienceYears: doctor.experienceYears,
    rating: doctor.rating,
    reviews: doctor.reviews,
    fee: doctor.fee,
    available: doctor.availableToday,
    availableToday: doctor.availableToday,
  };
}

// Apply the same filters as the database query to the sample data.
export function filterSampleDoctors({ q, specialty, available }) {
  const needle = q.toLowerCase();
  return sampleDoctors.filter((doctor) => {
    if (specialty && specialty !== "All" && doctor.specialty !== specialty) return false;
    if (available !== null && doctor.availableToday !== available) return false;
    if (!needle) return true;
    return (
      doctor.name.toLowerCase().includes(needle) ||
      doctor.specialty.toLowerCase().includes(needle) ||
      doctor.hospital.toLowerCase().includes(needle) ||
      doctor.city.toLowerCase().includes(needle)
    );
  });
}

export function paginate(items, page, limit) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total,
    page: safePage,
    limit,
    pages,
  };
}
