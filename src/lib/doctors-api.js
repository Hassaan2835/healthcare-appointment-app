// Day 15: Shared helpers for the GET /api/doctors endpoints.
// The database is the source of truth; the sample data in src/data/doctors.js
// is only a fallback so the API still answers when no database is reachable
// (for example in a fresh checkout without DATABASE_URL configured).

import { doctors as sampleDoctors } from "@/data/doctors";

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

// Day 20: sort options for the advanced filters. "newest" is the
// default (most recently added first); the fee and experience sorts
// are the ones patients actually ask for when choosing a doctor.
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "fee-asc", label: "Fee: low to high" },
  { value: "fee-desc", label: "Fee: high to low" },
  { value: "experience", label: "Most experienced" },
];

// Sort a list of serialized doctors (sample or database shape — both
// carry fee and experienceYears). "newest" keeps the input order,
// which the database query already orders by createdAt.
export function sortDoctors(doctors, sort) {
  const sorted = [...doctors];
  if (sort === "fee-asc") sorted.sort((a, b) => (a.fee ?? 0) - (b.fee ?? 0));
  else if (sort === "fee-desc") sorted.sort((a, b) => (b.fee ?? 0) - (a.fee ?? 0));
  else if (sort === "experience")
    sorted.sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0));
  return sorted;
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
// A max fee below the min fee is ignored, so a half-filled range
// never filters everything out by accident.
export function filterSampleDoctors({ q, specialty, available, minFee, maxFee, minExperience }) {
  const needle = (q || "").toLowerCase();
  const max = maxFee !== null && maxFee !== undefined && (minFee === null || minFee === undefined || maxFee >= minFee)
    ? maxFee
    : null;
  return sampleDoctors.filter((doctor) => {
    if (specialty && specialty !== "All" && doctor.specialty !== specialty) return false;
    if (available !== null && doctor.availableToday !== available) return false;
    if (minFee !== null && minFee !== undefined && doctor.fee < minFee) return false;
    if (max !== null && doctor.fee > max) return false;
    if (minExperience !== null && minExperience !== undefined && doctor.experienceYears < minExperience) return false;
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
