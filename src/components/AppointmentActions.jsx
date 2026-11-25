// Day 17: Cancel / Reschedule — client actions on one appointment.
//
// Lives inside the server-rendered AppointmentCard. Cancel asks once
// for confirmation, then calls DELETE /api/appointments/[id].
// Reschedule shows a small date + slot form and calls PATCH with the
// new time. Both refresh the dashboard on success so the card and the
// stats update without a manual reload.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

const SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function AppointmentActions({ appointmentId, currentDate }) {
  const router = useRouter();
  const [mode, setMode] = useState(null); // null | "cancel" | "reschedule"
  const [date, setDate] = useState(
    currentDate ? new Date(currentDate).toISOString().slice(0, 10) : ""
  );
  const [slot, setSlot] = useState("10:00 AM");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Cancellation failed. Please try again.");
        return;
      }
      setMode(null);
      router.refresh();
    } catch {
      setError("Cancellation failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function reschedule(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slot }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Rescheduling failed. Please try again.");
        return;
      }
      setMode(null);
      router.refresh();
    } catch {
      setError("Rescheduling failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (mode === "cancel") {
    return (
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          Cancel this appointment?
        </p>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button variant="danger" size="sm" loading={busy} onClick={cancel}>
            Yes, cancel it
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => setMode(null)}>
            Keep it
          </Button>
        </div>
      </div>
    );
  }

  if (mode === "reschedule") {
    return (
      <form onSubmit={reschedule} className="flex flex-col items-start gap-2 sm:items-end">
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`date-${appointmentId}`}>
            New date
          </label>
          <input
            id={`date-${appointmentId}`}
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-white/15 dark:bg-navy-900 dark:text-white"
            required
          />
          <label className="sr-only" htmlFor={`slot-${appointmentId}`}>
            New time slot
          </label>
          <select
            id={`slot-${appointmentId}`}
            value={slot}
            onChange={(event) => setSlot(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-white/15 dark:bg-navy-900 dark:text-white"
          >
            {SLOTS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" size="sm" loading={busy}>
            Save new time
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => setMode(null)}>
            Back
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => setMode("reschedule")}>
        Reschedule
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setMode("cancel")}>
        Cancel
      </Button>
    </div>
  );
}
