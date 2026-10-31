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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
          Verified specialists
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Find a Doctor
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
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
          className="w-full rounded-xl border border-white/10 bg-navy-800 px-4 py-3.5 text-slate-100 placeholder:text-slate-500 shadow-card focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/40"
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
                ? "rounded-full bg-mint-400 px-4 py-2 text-sm font-semibold text-navy-950"
                : "rounded-full border border-white/15 bg-navy-800/60 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-mint-400/60 hover:text-mint-300"
            }
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-400" aria-live="polite">
        Showing {results.length} of {doctors.length} doctors
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-navy-800/50 px-6 py-12 text-center">
          <p className="font-medium text-white">No doctors found</p>
          <p className="mt-1 text-sm text-slate-400">
            Try a different name or specialty, or clear the filters to see all
            doctors.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSpecialty("All");
            }}
            className="mt-4 rounded-xl border border-mint-400/50 px-4 py-2 text-sm font-medium text-mint-300 transition hover:bg-mint-400 hover:text-navy-950"
          >
            Clear search and filters
          </button>
        </div>
      )}
    </section>
  );
}
