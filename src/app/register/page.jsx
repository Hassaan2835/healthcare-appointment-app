"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: <redacted>
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      router.push("/login");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-navy-900 px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold tracking-tight text-white">
        Create your account
      </h1>
      <p className="mt-2 text-center text-slate-400">
        Register as a patient to book and manage appointments.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-navy-800/80 p-6 shadow-card"
      >
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="name" className={labelClass}>Full name</label>
          <input id="name" name="name" type="text" required value={form.name}
            onChange={handleChange} className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required value={form.email}
            onChange={handleChange} className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
          <input id="phone" name="phone" type="tel" value={form.phone}
            onChange={handleChange} className={inputClass} placeholder="03xx-xxxxxxx" />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input id="password" name="password" type="password" required value={form.password}
            onChange={handleChange} className={inputClass} placeholder="At least 6 characters" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required
            value={form.confirmPassword} onChange={handleChange} className={inputClass}
            placeholder="Repeat your password" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-mint-400 px-4 py-2.5 font-semibold text-navy-950 transition hover:bg-mint-300 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-mint-300 hover:text-mint-200">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}
