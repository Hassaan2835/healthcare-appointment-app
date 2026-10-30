"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initialName, initialPhone }) {
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Update failed. Please try again.");
        return;
      }

      setMessage("Profile updated successfully.");
      router.refresh();
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Edit profile</h2>
      {message && (
        <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-700">{message}</p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      <div>
        <label htmlFor="profile-name" className={labelClass}>Full name</label>
        <input id="profile-name" type="text" required value={name}
          onChange={(event) => setName(event.target.value)} className={inputClass} />
      </div>
      <div>
        <label htmlFor="profile-phone" className={labelClass}>Phone</label>
        <input id="profile-phone" type="tel" value={phone}
          onChange={(event) => setPhone(event.target.value)} className={inputClass}
          placeholder="03xx-xxxxxxx" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
