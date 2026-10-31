const steps = [
  {
    number: "01",
    title: "Search & Compare",
    description:
      "Browse verified doctors by specialty, city, fee and rating. Real profiles, real reviews, no guesswork.",
  },
  {
    number: "02",
    title: "Book Your Slot",
    description:
      "Pick a time that suits you and confirm online in under a minute. Your appointment is saved to your account.",
  },
  {
    number: "03",
    title: "Meet Your Doctor",
    description:
      "Visit the clinic at your booked time - no queues, no waiting room delays. Just walk in and be seen.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-white/5 bg-navy-850">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
            Simple by design
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-white/10 bg-navy-800/70 p-7"
            >
              <span className="font-display text-4xl font-extrabold text-mint-400/25">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
