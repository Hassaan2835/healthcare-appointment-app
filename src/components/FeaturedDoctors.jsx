import Link from "next/link";
import DoctorCard from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";

export default function FeaturedDoctors() {
  const featured = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
          Handpicked for you
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Top Rated Doctors
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Our highest rated specialists, trusted by hundreds of patients in
          Rawalpindi and Islamabad.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/doctors"
          className="inline-block rounded-xl border border-mint-400/50 px-6 py-3 font-medium text-mint-300 transition hover:bg-mint-400 hover:text-navy-950"
        >
          View All Doctors
        </Link>
      </div>
    </section>
  );
}
