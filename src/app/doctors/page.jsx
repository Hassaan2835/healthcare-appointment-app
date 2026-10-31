"use client";

import { useMemo, useState } from "react";
import DoctorCard from "@/components/DoctorCard";
import { doctors, SPECIALTIES } from "@/data/doctors";

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesSpecialty = specialty === "All" || doctor.specialty === specialty;
      const matchesQuery =
        q === "" ||
        doctor.name.toLowerCase().includes(q) ||
        doctor.specialty.toLowerCase().includes(q) ||
        doctor.hospital.toLowerCase().includes(q) ||
        doctor.city.toLowerCase().includes(q);
      return matchesSpecialty && matchesQuery;
    });
  }, [query, specialty]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Find a Doctor
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Search verified doctors by name, specialty, hospital or city and book
          your appointment online.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <label htmlFor="doctor-search" className="sr-only">
          Search doctors
        </label>
        <input
          id="doctor-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, specialty, hospital or city..."
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["All", ...SPECIALTIES].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSpecialty(item)}
            className={
              specialty === item
                ? "rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white"
                : "rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
            }
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500" aria-live="polite">
        Showing {results.length} of {doctors.length} doctors
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="font-medium text-slate-900">No doctors found</p>
          <p className="mt-1 text-sm text-slate-600">
            Try a different name or specialty, or clear the filters to see all
            doctors.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSpecialty("All");
            }}
            className="mt-4 rounded-lg border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </section>
  );
}
