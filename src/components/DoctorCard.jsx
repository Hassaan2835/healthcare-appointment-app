import Link from "next/link";

function initials(name) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export default function DoctorCard({ doctor }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-navy-800/70 p-6 transition hover:-translate-y-1 hover:border-mint-400/50 hover:shadow-glow">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-300 to-mint-600 font-display text-lg font-bold text-navy-950">
          {initials(doctor.name)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
          <p className="text-sm font-medium text-mint-300">{doctor.specialty}</p>
          <p className="mt-1 text-sm text-slate-400">
            {doctor.hospital} - {doctor.city}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-navy-900/80 px-2 py-2.5">
          <dt className="text-xs text-slate-400">Rating</dt>
          <dd className="mt-0.5 font-semibold text-white">
            {doctor.rating} <span className="text-slate-400">({doctor.reviews})</span>
          </dd>
        </div>
        <div className="rounded-xl bg-navy-900/80 px-2 py-2.5">
          <dt className="text-xs text-slate-400">Experience</dt>
          <dd className="mt-0.5 font-semibold text-white">{doctor.experienceYears} yrs</dd>
        </div>
        <div className="rounded-xl bg-navy-900/80 px-2 py-2.5">
          <dt className="text-xs text-slate-400">Fee</dt>
          <dd className="mt-0.5 font-semibold text-mint-300">Rs. {doctor.fee}</dd>
        </div>
      </dl>

      <p className="mt-4 flex items-center gap-2 text-sm">
        <span
          className={
            doctor.availableToday
              ? "h-2 w-2 rounded-full bg-mint-400"
              : "h-2 w-2 rounded-full bg-amber-400"
          }
          aria-hidden="true"
        />
        {doctor.availableToday ? (
          <span className="font-medium text-mint-300">Available today</span>
        ) : (
          <span className="font-medium text-slate-400">Next slot tomorrow</span>
        )}
      </p>

      <Link
        href="/appointments"
        className="mt-4 rounded-xl bg-mint-400 px-4 py-2.5 text-center text-sm font-semibold text-navy-950 transition hover:bg-mint-300"
      >
        Book Appointment
      </Link>
    </article>
  );
}
