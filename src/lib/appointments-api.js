// Day 16: shared helpers for POST /api/appointments.
//
// The Appointment model stores a single `date` DateTime and has no
// separate time-slot column, so the time slot the booking form collects
// ("10:00 AM") is folded into that datetime here. The slot label is
// derived back from the stored datetime when an appointment is
// serialized, so the model stays untouched and the slot still shows
// up in API responses and on the dashboard.

const SLOT_PATTERN = /^(\d{1,2}):(\d{2})\s*([AP]M)$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseSlot(slot) {
  if (typeof slot !== "string") return null;
  const match = SLOT_PATTERN.exec(slot.trim());
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

export function slotLabelFromDate(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${period}`;
}

// Combine a "YYYY-MM-DD" date with an optional "HH:MM AM/PM" slot into
// one Date. Without a slot the appointment starts at 09:00. Returns
// null when the date or the slot is not valid.
export function combineDateAndSlot(dateStr, slot) {
  if (typeof dateStr !== "string" || !DATE_PATTERN.test(dateStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const parsed = slot ? parseSlot(slot) : { hours: 9, minutes: 0 };
  if (!parsed) return null;
  const date = new Date(year, month - 1, day, parsed.hours, parsed.minutes, 0, 0);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

// Only the patient who booked an appointment — or an admin — may
// cancel or reschedule it. Doctors cannot change a patient's booking
// from here; that stays with the patient and the admin desk.
export function canManageAppointment(session, appointment) {
  if (!session?.user?.id || !appointment) return false;
  return (
    appointment.patientId === session.user.id ||
    session.user.role === "ADMIN"
  );
}

export function serializeAppointment(appointment) {
  return {
    id: appointment.id,
    doctorId: appointment.doctorId,
    doctorName: appointment.doctor?.user?.name || null,
    specialty: appointment.doctor?.specialization || null,
    date: appointment.date.toISOString(),
    slot: slotLabelFromDate(appointment.date),
    status: appointment.status,
    reason: appointment.reason,
    notes: appointment.notes,
    createdAt: appointment.createdAt.toISOString(),
  };
}
