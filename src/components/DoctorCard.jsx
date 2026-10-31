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
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
          {initials(doctor.name)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{doctor.name}</h3>
          <p className="text-sm font-medium text-teal-700">{doctor.specialty}</p>
          <p className="mt-1 text-sm text-slate-500">
            {doctor.hospital} - {doctor.city}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <dt className="text-slate-500">Rating</dt>
          <dd className="font-semibold text-slate-900">
            {doctor.rating} ({doctor.reviews})
          </dd>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <dt className="text-slate-500">Experience</dt>
          <dd className="font-semibold text-slate-900">{doctor.experienceYears} yrs</dd>
        </div>
        <div className="rounded-lg bg-slate-50 px-2 py-2">
          <dt className="text-slate-500">Fee</dt>
          <dd className="font-semibold text-slate-900">Rs. {doctor.fee}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm">
        {doctor.availableToday ? (
          <span className="font-medium text-teal-700">Available today</span>
        ) : (
          <span className="font-medium text-slate-500">Next slot tomorrow</span>
        )}
      </p>

      <Link
        href="/appointments"
        className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-teal-700"
      >
        Book Appointment
      </Link>
    </article>
  );
}
