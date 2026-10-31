const points = [
  {
    title: "Verified Specialists",
    description: "Every doctor profile is checked - qualifications, hospital and patient reviews included.",
  },
  {
    title: "Transparent Fees",
    description: "Consultation fees are shown upfront on every profile. No surprise charges at the clinic.",
  },
  {
    title: "Instant Booking",
    description: "Book, view and manage appointments from your account, any time of day or night.",
  },
  {
    title: "Private & Secure",
    description: "Your health details stay in your account, protected by secure sign-in.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
            Why HealthCare
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Healthcare that feels
            <span className="text-mint-400"> premium</span>, priced honestly
          </h2>
          <p className="mt-4 leading-relaxed text-slate-400">
            We built the booking experience we wanted for our own families in
            Rawalpindi and Islamabad: verified doctors, honest prices and an
            appointment that starts on time.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/10 bg-navy-800/70 p-5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint-400/15 text-mint-300">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="mt-3 font-semibold text-white">{point.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
