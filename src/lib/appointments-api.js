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

// Validate a booking request body. Returns { value } on success or
// { errors } with human-readable messages, first error first.
export function validateBookingBody(body) {
  const errors = [];
  const doctorId = typeof body?.doctorId === "string" ? body.doctorId.trim() : "";
  const date = typeof body?.date === "string" ? body.date.trim() : "";
  const slot = typeof body?.slot === "string" ? body.slot.trim() : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  if (!doctorId) {
    errors.push("Please select a doctor.");
  }
  if (!date) {
    errors.push("Please choose an appointment date.");
  } else if (!DATE_PATTERN.test(date)) {
    errors.push("Please choose a valid appointment date.");
  }
  if (slot && !parseSlot(slot)) {
    errors.push("Please pick a valid time slot.");
  }
  if (reason.length > 500) {
    errors.push("Reason for visit is too long (max 500 characters).");
  }
  if (notes.length > 1000) {
    errors.push("Notes are too long (max 1000 characters).");
  }

  if (errors.length > 0) return { errors };

  const dateTime = combineDateAndSlot(date, slot || null);
  if (!dateTime) {
    return { errors: ["Please choose a valid appointment date."] };
  }
  if (dateTime.getTime() <= Date.now()) {
    return { errors: ["Please choose a future date and time."] };
  }

  return {
    value: { doctorId, date, slot: slot || null, dateTime, reason, notes },
  };
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
