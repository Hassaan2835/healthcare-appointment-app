import Link from "next/link";
import { notFound } from "next/navigation";
import { doctors } from "@/data/doctors";

export function generateStaticParams() {
  return doctors.map((doctor) => ({ id: String(doctor.id) }));
}

function initials(name) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function DoctorDetailPage({ params }) {
  const doctor = doctors.find((item) => String(item.id) === params.id);
  if (!doctor) notFound();

  const related = doctors
    .filter((item) => item.specialty === doctor.specialty && item.id !== doctor.id)
    .slice(0, 2);

  const facts = [
    { label: "Experience", value: doctor.experienceYears + " years" },
    { label: "Rating", value: doctor.rating + " (" + doctor.reviews + " reviews)" },
    { label: "Consultation Fee", value: "Rs. " + doctor.fee },
    { label: "Timings", value: doctor.timings },
    { label: "Languages", value: doctor.languages.join(", ") },
    {
      label: "Availability",
      value: doctor.availableToday ? "Available today" : "Next slot tomorrow",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Link href="/doctors" className="text-sm font-medium text-mint-300 transition hover:text-mint-200">
        &larr; Back to all doctors
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-navy-800/70 shadow-card">
        <div className="relative p-7 sm:p-10">
          <div
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-mint-500/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-mint-300 to-mint-600 font-display text-3xl font-bold text-navy-950">
              {initials(doctor.name)}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
                {doctor.specialty}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                {doctor.name}
              </h1>
              <p className="mt-1.5 text-slate-300">{doctor.qualification}</p>
              <p className="mt-1 text-sm text-slate-400">
                {doctor.hospital} - {doctor.city}
              </p>
            </div>
            <div className="sm:ml-auto">
              <Link
                href={"/appointments?doctor=" + doctor.id}
                className="inline-block rounded-xl bg-mint-400 px-6 py-3 font-semibold text-navy-950 shadow-glow transition hover:bg-mint-300"
              >
                Book Appointment
              </Link>
              <p className="mt-2 text-center text-xs text-slate-400">
                Fee Rs. {doctor.fee} - pay at clinic
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-px border-t border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-navy-850 px-7 py-5">
              <p className="text-xs uppercase tracking-wider text-slate-400">{fact.label}</p>
              <p className="mt-1 font-semibold text-white">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-navy-800/70 p-7 sm:p-8">
        <h2 className="font-display text-xl font-bold text-white">About {doctor.name}</h2>
        <p className="mt-3 leading-relaxed text-slate-300">{doctor.about}</p>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-white">
            Other {doctor.specialty} specialists
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.id}>
                <Link
                  href={"/doctors/" + item.id}
                  className="block rounded-2xl border border-white/10 bg-navy-800/70 p-5 transition hover:border-mint-400/50"
                >
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {item.hospital} - {item.city} - Rs. {item.fee}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
