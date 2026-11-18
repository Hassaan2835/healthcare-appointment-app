// Day 11: Patient Dashboard - one appointment row.
// Receives a Prisma Appointment with its Doctor (and the doctor's User)
// already included by the dashboard page.

const STATUS_STYLES = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  CONFIRMED: "border-mint-400/30 bg-mint-400/10 text-mint-300",
  CANCELLED: "border-red-500/30 bg-red-500/10 text-red-300",
  COMPLETED: "border-white/15 bg-white/5 text-slate-300",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AppointmentCard({ appointment }) {
  const doctor = appointment.doctor;
  const doctorName = doctor?.user?.name || "Doctor";
  const specialization = doctor?.specialization || "General Consultation";
  const fee = doctor?.fee;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-navy-800/70 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-300 to-mint-600 font-display text-base font-bold text-navy-950">
          {doctorName.replace("Dr. ", "").split(" ").map((part) => part[0]).slice(0, 2).join("")}
        </div>
        <div>
          <h3 className="font-semibold text-white">{doctorName}</h3>
          <p className="text-sm text-mint-300">{specialization}</p>
          <p className="mt-1 text-sm text-slate-400">
            {formatDate(appointment.date)}
            {appointment.reason ? ` — ${appointment.reason}` : ""}
          </p>
          {typeof fee === "number" && (
            <p className="mt-0.5 text-xs text-slate-500">Fee Rs. {fee} — paid at the clinic</p>
          )}
        </div>
      </div>

      <span
        className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[appointment.status] || STATUS_STYLES.PENDING}`}
      >
        {STATUS_LABELS[appointment.status] || appointment.status}
      </span>
    </article>
  );
}
