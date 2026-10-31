const reviews = [
  {
    name: "Fatima Noor",
    area: "Satellite Town, Rawalpindi",
    text: "Booked a dermatologist in two minutes and was seen exactly on time. The fee shown on the profile was exactly what I paid at the clinic.",
    doctor: "Dermatology visit",
  },
  {
    name: "Ahmed Raza",
    area: "F-8, Islamabad",
    text: "My father sees his cardiologist through this app. No more phone calls or waiting rooms - the appointment is confirmed before we leave home.",
    doctor: "Cardiology follow-up",
  },
  {
    name: "Areeba Khan",
    area: "Bahria Town, Rawalpindi",
    text: "The doctor profiles with real ratings made choosing easy. Our pediatrician is wonderful with kids and booking the follow-up took seconds.",
    doctor: "Pediatrics visit",
  },
];

export default function Testimonials() {
  return (
    <section className="border-t border-white/5 bg-navy-850">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
            Patient stories
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Loved by Patients
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-2xl border border-white/10 bg-navy-800/70 p-6"
            >
              <div className="text-amber-400" aria-label="5 star rating">
                ★★★★★
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="mt-4 border-t border-white/10 pt-4">
                <p className="font-semibold text-white">{review.name}</p>
                <p className="text-xs text-slate-400">
                  {review.area} - {review.doctor}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
