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
          password: form.password,
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
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">
        Create your account
      </h1>
      <p className="mt-2 text-center text-slate-600">
        Register as a patient to book and manage appointments.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
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
          className="w-full rounded-lg bg-teal-600 px-4 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-teal-700 hover:text-teal-800">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}
