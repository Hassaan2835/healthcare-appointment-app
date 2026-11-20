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

  // Day 13: unified with the mint/navy theme (was teal) and given
  // light + dark classes like the rest of the app.
  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-mint-500/60 focus:outline-none focus:ring-2 focus:ring-mint-400/30 dark:border-white/10 dark:bg-navy-900 dark:text-slate-100";
  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-navy-800/70 dark:shadow-card"
    >
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Edit profile</h2>
      {message && (
        <p className="rounded-xl border border-mint-500/30 bg-mint-400/10 px-4 py-3 text-sm text-mint-600 dark:text-mint-300">{message}</p>
      )}
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</p>
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
        className="rounded-xl bg-mint-400 px-5 py-2.5 font-semibold text-navy-950 transition hover:bg-mint-300 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
