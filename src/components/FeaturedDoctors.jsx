import Link from "next/link";
import DoctorCard from "@/components/DoctorCard";
import { doctors } from "@/data/doctors";

export default function FeaturedDoctors() {
  const featured = [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Top Rated Doctors
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Our highest rated specialists, trusted by hundreds of patients in
            Rawalpindi and Islamabad.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/doctors"
            className="inline-block rounded-lg border border-teal-600 px-6 py-3 font-medium text-teal-700 transition hover:bg-teal-50"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
}
