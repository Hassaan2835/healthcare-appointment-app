"use client";

import { useMemo, useState } from "react";
import { doctors } from "@/data/doctors";
import { Button, Input, Select } from "@/components/ui";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
];

export default function BookingForm({ initialDoctorId = "" }) {
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);

  const doctor = useMemo(
    () => doctors.find((item) => String(item.id) === String(doctorId)),
    [doctorId]
  );

  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!doctor) {
      setError("Please select a doctor.");
      return;
    }
    if (!date) {
      setError("Please choose an appointment date.");
      return;
    }
    if (date < today) {
      setError("Appointment date cannot be in the past.");
      return;
    }
    if (!slot) {
      setError("Please pick a time slot.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Please enter the patient name.");
      return;
    }
    if (phone.trim().length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setBooked({ doctor, date, slot, name, phone, reason });
  }

  if (booked) {
    return (
      <div className="rounded-2xl border border-mint-400/30 bg-white dark:bg-navy-800/80 p-7 text-center shadow-sm dark:shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-400/15 text-mint-600 dark:text-mint-300">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
          Appointment Request Sent
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {booked.name}, your visit with {booked.doctor.name} ({booked.doctor.specialty})
          is requested for {booked.date} at {booked.slot}. The clinic will confirm
          shortly on {booked.phone}.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Online booking confirmation goes live with our booking system update.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/doctors" variant="outline">
            Browse More Doctors
          </Button>
          <Button type="button" onClick={() => setBooked(null)}>
            Book Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/80 p-6 shadow-sm dark:shadow-card sm:p-7"
    >
      {error && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}

      <Select
        id="doctor"
        label="Select doctor"
        value={doctorId}
        onChange={(event) => setDoctorId(event.target.value)}
      >
        <option value="">Choose a doctor...</option>
        {doctors.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} - {item.specialty} ({item.city})
          </option>
        ))}
      </Select>

      {doctor && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 dark:bg-navy-900/80 px-4 py-3 text-sm">
          <span className="text-slate-700 dark:text-slate-300">
            {doctor.hospital} - {doctor.timings}
          </span>
          <span className="font-semibold text-mint-600 dark:text-mint-300">Fee Rs. {doctor.fee}</span>
        </div>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input
          id="date"
          type="date"
          label="Appointment date"
          min={today}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <Input
          id="name"
          type="text"
          label="Patient name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name of the patient"
        />
      </div>

      <div className="mt-5">
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Time slot</span>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSlot(time)}
              className={
                slot === time
                  ? "rounded-full bg-mint-400 px-3.5 py-1.5 text-sm font-semibold text-navy-950"
                  : "rounded-full border border-slate-200 dark:border-white/15 px-3.5 py-1.5 text-sm text-slate-700 dark:text-slate-300 transition hover:border-mint-400/60 hover:text-mint-600 dark:hover:text-mint-300"
              }
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Input
          id="phone"
          type="tel"
          label="Phone number"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="03xx-xxxxxxx"
        />
        <Input
          id="reason"
          type="text"
          label="Reason for visit (optional)"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="e.g. Regular check-up"
        />
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full">
        Confirm Booking Request
      </Button>
      <p className="mt-3 text-center text-xs text-slate-500">
        No payment now - consultation fee is paid at the clinic.
      </p>
    </form>
  );
}
