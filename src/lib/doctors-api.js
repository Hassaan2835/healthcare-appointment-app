// Day 15: Shared helpers for the GET /api/doctors endpoints.
// The database is the source of truth; the sample data in src/data/doctors.js
// is only a fallback so the API still answers when no database is reachable
// (for example in a fresh checkout without DATABASE_URL configured).

import { doctors as sampleDoctors } from "@/data/doctors";

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

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
