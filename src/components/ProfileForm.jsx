"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";

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

  // Day 14: fields and submit button now use the shared ui primitives.
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
      <Input id="profile-name" type="text" label="Full name" required value={name}
        onChange={(event) => setName(event.target.value)} />
      <Input id="profile-phone" type="tel" label="Phone" value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="03xx-xxxxxxx" />
      <Button type="submit" loading={loading}>
        {loading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
