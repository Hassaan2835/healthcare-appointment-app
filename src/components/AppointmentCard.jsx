// Day 11: Patient Dashboard - one appointment row.
// Receives a Prisma Appointment with its Doctor (and the doctor's User)
// already included by the dashboard page.
//
// Day 14: status pill and panel now come from the shared ui primitives
// (StatusBadge, Card) instead of local copies of the same styles.

import { Card, StatusBadge } from "@/components/ui";
import AppointmentActions from "@/components/AppointmentActions";

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
    <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-300 to-mint-600 font-display text-base font-bold text-navy-950">
          {doctorName.replace("Dr. ", "").split(" ").map((part) => part[0]).slice(0, 2).join("")}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{doctorName}</h3>
          <p className="text-sm text-mint-600 dark:text-mint-300">{specialization}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {formatDate(appointment.date)}
            {appointment.reason ? ` — ${appointment.reason}` : ""}
          </p>
          {typeof fee === "number" && (
            <p className="mt-0.5 text-xs text-slate-500">Fee Rs. {fee} — paid at the clinic</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
        <StatusBadge status={appointment.status} />
        {/* Day 17: only upcoming bookings can be changed — cancelled
            and completed ones stay as history. */}
        {(appointment.status === "PENDING" || appointment.status === "CONFIRMED") && (
          <AppointmentActions appointmentId={appointment.id} currentDate={new Date(appointment.date).toISOString()} />
        )}
      </div>
    </Card>
  );
}
