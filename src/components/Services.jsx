const services = [
  {
    name: "General Consultation",
    description:
      "Everyday health concerns, check-ups and referrals handled by experienced general physicians.",
    icon: "M9 12h3l1.5-3 2 5L17 12h4M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z",
  },
  {
    name: "Cardiology",
    description:
      "Heart health screening, ECG and follow-up care with specialist cardiologists.",
    icon: "M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.3.9-1.4 2.6-2.3 4.3-2.3 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z",
  },
  {
    name: "Dermatology",
    description:
      "Skin, hair and nail consultations - from acne and allergies to cosmetic concerns.",
    icon: "M12 3l1.8 4.6L18 9.2l-4.2 1.6L12 15.4l-1.8-4.6L6 9.2l4.2-1.6L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z",
  },
  {
    name: "Pediatrics",
    description:
      "Gentle, friendly care for infants, children and teenagers, including vaccinations.",
    icon: "M12 21a9 9 0 100-18 9 9 0 000 18zM8.5 10h.01M15.5 10h.01M8.8 14.2c.9 1 2 1.5 3.2 1.5s2.3-.5 3.2-1.5",
  },
  {
    name: "Dental Care",
    description:
      "Cleaning, fillings, root canal and cosmetic dentistry with modern equipment.",
    icon: "M7.5 4C5 4 3.5 5.8 3.5 8.2c0 1.7.7 2.9 1.2 4.3.5 1.3.8 3 1.1 4.7.2 1 .5 2.8 1.7 2.8 1.4 0 1.4-2 2-3.4.2-.6.7-1.1 1.5-1.1s1.3.5 1.5 1.1c.6 1.4.6 3.4 2 3.4 1.2 0 1.5-1.8 1.7-2.8.3-1.7.6-3.4 1.1-4.7.5-1.4 1.2-2.6 1.2-4.3C20.5 5.8 19 4 16.5 4c-1.7 0-2.7 1-4.5 1S9.2 4 7.5 4z",
  },
  {
    name: "Eye Care",
    description:
      "Complete eye examinations, vision testing and treatment for common eye conditions.",
    icon: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
  },
];

export default function Services() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
          What we treat
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Our Services
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Choose a specialty and book an appointment with a doctor who fits
          your needs and schedule.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.name}
            className="group rounded-2xl border border-white/10 bg-navy-800/70 p-6 transition hover:-translate-y-1 hover:border-mint-400/50 hover:shadow-glow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-400/10 text-mint-300 transition group-hover:bg-mint-400 group-hover:text-navy-950">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={service.icon} />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{service.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {service.description}
            </p>
            <a
              href="/doctors"
              className="mt-4 inline-block text-sm font-medium text-mint-300 transition hover:text-mint-200"
            >
              Book this service -&gt;
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
