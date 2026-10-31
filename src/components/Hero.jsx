import Link from "next/link";

const stats = [
  { value: "120+", label: "Verified Doctors" },
  { value: "4.9", label: "Average Rating" },
  { value: "24/7", label: "Online Booking" },
  { value: "15 min", label: "Avg. Booking Time" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-mint-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-mint-400/30 bg-mint-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mint-300">
          Premium Healthcare - Rawalpindi &amp; Islamabad
        </p>

        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Book a Doctor Appointment in{" "}
          <span className="bg-gradient-to-r from-mint-300 to-mint-600 bg-clip-text text-transparent">
            Minutes
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
          Find verified specialists, compare transparent fees and book your
          visit online. No phone calls, no queues, no waiting in line.
        </p>

        <form
          action="/doctors"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-navy-800/80 p-3 shadow-card backdrop-blur sm:flex-row sm:items-center"
        >
          <label htmlFor="hero-search" className="sr-only">
            Search doctors
          </label>
          <input
            id="hero-search"
            type="search"
            placeholder="Search doctors, specialties, hospitals..."
            className="w-full flex-1 rounded-xl bg-navy-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-mint-400/60"
          />
          <button
            type="submit"
            className="rounded-xl bg-mint-400 px-6 py-3 font-semibold text-navy-950 shadow-glow transition hover:bg-mint-300"
          >
            Find a Doctor
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/appointments" className="text-sm font-medium text-slate-300 transition hover:text-mint-300">
            Book Appointment -&gt;
          </Link>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <Link href="/register" className="text-sm font-medium text-slate-300 transition hover:text-mint-300">
            Create free account -&gt;
          </Link>
        </div>

        <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-navy-800/60 px-4 py-5"
            >
              <dd className="font-display text-2xl font-bold text-white">{stat.value}</dd>
              <dd className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
