export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-teal-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
          Trusted Healthcare, Made Simple
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Book a Doctor Appointment in Minutes
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Find verified doctors, check their availability and book your visit
          online — no phone calls, no waiting in line.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/doctors"
            className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-teal-700"
          >
            Find a Doctor
          </a>
          <a
            href="/appointments"
            className="rounded-lg border border-teal-600 px-6 py-3 font-medium text-teal-700 transition hover:bg-teal-50"
          >
            Book Appointment
          </a>
        </div>
        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          <div>
            <dd className="text-2xl font-bold text-slate-900">Verified</dd>
            <dd className="text-sm text-slate-500">Doctors &amp; specialists</dd>
          </div>
          <div>
            <dd className="text-2xl font-bold text-slate-900">Online</dd>
            <dd className="text-sm text-slate-500">Booking &amp; rescheduling</dd>
          </div>
          <div>
            <dd className="text-2xl font-bold text-slate-900">Support</dd>
            <dd className="text-sm text-slate-500">For patients &amp; clinics</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
