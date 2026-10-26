const services = [
  {
    name: "General Consultation",
    description:
      "Everyday health concerns, check-ups and referrals handled by experienced general physicians.",
  },
  {
    name: "Cardiology",
    description:
      "Heart health screening, ECG and follow-up care with specialist cardiologists.",
  },
  {
    name: "Dermatology",
    description:
      "Skin, hair and nail consultations — from acne and allergies to cosmetic concerns.",
  },
  {
    name: "Pediatrics",
    description:
      "Gentle, friendly care for infants, children and teenagers, including vaccinations.",
  },
  {
    name: "Dental Care",
    description:
      "Cleaning, fillings, root canal and cosmetic dentistry with modern equipment.",
  },
  {
    name: "Eye Care",
    description:
      "Complete eye examinations, vision testing and treatment for common eye conditions.",
  },
];

export default function Services() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Our Services
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Choose a specialty and book an appointment with a doctor who fits
          your needs and schedule.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.name}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {service.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {service.description}
            </p>
            <a
              href="/doctors"
              className="mt-4 inline-block text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Book this service →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
