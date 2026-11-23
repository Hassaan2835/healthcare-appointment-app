"use client";

import { useEffect, useMemo, useState } from "react";
import DoctorCard from "@/components/DoctorCard";
import Spinner from "@/components/ui/Spinner";
import { SPECIALTIES } from "@/data/doctors";

// Day 15: the listing now reads from GET /api/doctors instead of the
// built-in sample data, so search and specialty filters run server-side.
export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Debounce the search input so we don't fetch on every keystroke.
  const debouncedQuery = useMemo(() => query.trim(), [query]);
  const [debounced, setDebounced] = useState(debouncedQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(debouncedQuery), 300);
    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (debounced) params.set("q", debounced);
    if (specialty !== "All") params.set("specialty", specialty);

    fetch("/api/doctors?" + params.toString())
      .then((response) => {
        if (!response.ok) throw new Error("The doctors list could not be loaded.");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setDoctors(data.doctors || []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {
        if (!cancelled) setError("The doctors list could not be loaded. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, specialty, reloadKey]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-600 dark:text-mint-400">
          Verified specialists
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Find a Doctor
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
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
          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800 px-4 py-3.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 shadow-sm dark:shadow-card focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/40"
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
                : "rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/60 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:border-mint-400/60 hover:text-mint-600 dark:hover:text-mint-300"
            }
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <Spinner size="lg" label="Loading doctors…" />
          <p className="text-sm">Loading doctors…</p>
        </div>
      ) : error ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/50 px-6 py-12 text-center">
          <p className="font-medium text-slate-900 dark:text-white">Something went wrong</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-4 rounded-xl bg-mint-400 px-4 py-2 text-sm font-semibold text-navy-950 transition hover:bg-mint-300"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <p className="mt-10 text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
            Showing {doctors.length} of {total} doctors
          </p>

          {doctors.length > 0 ? (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/50 px-6 py-12 text-center">
              <p className="font-medium text-slate-900 dark:text-white">No doctors found</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Try a different name or specialty, or clear the filters to see all
                doctors.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSpecialty("All");
                }}
                className="mt-4 rounded-xl border border-mint-400/50 px-4 py-2 text-sm font-medium text-mint-600 dark:text-mint-300 transition hover:bg-mint-400 hover:text-navy-950"
              >
                Clear search and filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
