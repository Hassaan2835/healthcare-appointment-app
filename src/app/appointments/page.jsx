import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book an Appointment - HealthCare",
  description: "Book an appointment with a verified doctor in Rawalpindi or Islamabad.",
};

export default function AppointmentsPage({ searchParams }) {
  const doctorId = searchParams?.doctor || "";

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-400">
          Online booking
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Book an Appointment
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Pick your doctor, date and time. It takes less than a minute and the
          fee is paid at the clinic.
        </p>
      </div>
      <div className="mt-10">
        <BookingForm initialDoctorId={doctorId} />
      </div>
    </section>
  );
}
