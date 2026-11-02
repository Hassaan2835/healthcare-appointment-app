"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { doctors } from "@/data/doctors";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
  "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-navy-900 px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/30";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

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
      <div className="rounded-2xl border border-mint-400/30 bg-navy-800/80 p-7 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint-400/15 text-mint-300">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-white">
          Appointment Request Sent
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-300">
          {booked.name}, your visit with {booked.doctor.name} ({booked.doctor.specialty})
          is requested for {booked.date} at {booked.slot}. The clinic will confirm
          shortly on {booked.phone}.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Online booking confirmation goes live with our booking system update.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/doctors" className="rounded-xl border border-mint-400/50 px-5 py-2.5 text-sm font-semibold text-mint-300 transition hover:bg-mint-400 hover:text-navy-950">
            Browse More Doctors
          </Link>
          <button
            type="button"
            onClick={() => setBooked(null)}
            className="rounded-xl bg-mint-400 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-mint-300"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-navy-800/80 p-6 shadow-card sm:p-7"
    >
      {error && (
        <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="doctor" className={labelClass}>Select doctor</label>
        <select
          id="doctor"
          value={doctorId}
          onChange={(event) => setDoctorId(event.target.value)}
          className={inputClass}
        >
          <option value="">Choose a doctor...</option>
          {doctors.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {item.specialty} ({item.city})
            </option>
          ))}
        </select>
      </div>

      {doctor && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-900/80 px-4 py-3 text-sm">
          <span className="text-slate-300">
            {doctor.hospital} - {doctor.timings}
          </span>
          <span className="font-semibold text-mint-300">Fee Rs. {doctor.fee}</span>
        </div>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>Appointment date</label>
          <input
            id="date"
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>Patient name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Full name of the patient"
          />
        </div>
      </div>

      <div className="mt-5">
        <span className={labelClass}>Time slot</span>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setSlot(time)}
              className={
                slot === time
                  ? "rounded-full bg-mint-400 px-3.5 py-1.5 text-sm font-semibold text-navy-950"
                  : "rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-slate-300 transition hover:border-mint-400/60 hover:text-mint-300"
              }
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClass}
            placeholder="03xx-xxxxxxx"
          />
        </div>
        <div>
          <label htmlFor="reason" className={labelClass}>Reason for visit (optional)</label>
          <input
            id="reason"
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={inputClass}
            placeholder="e.g. Regular check-up"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-mint-400 px-4 py-3 font-semibold text-navy-950 shadow-glow transition hover:bg-mint-300"
      >
        Confirm Booking Request
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        No payment now - consultation fee is paid at the clinic.
      </p>
    </form>
  );
}
