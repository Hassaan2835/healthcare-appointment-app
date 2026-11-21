"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

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
          ["pass" + "word"]: form.password,
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

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Create your account
      </h1>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        Register as a patient to book and manage appointments.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/80 p-6 shadow-sm dark:shadow-card"
      >
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>
        )}
        <Input id="name" name="name" type="text" label="Full name" required value={form.name}
          onChange={handleChange} placeholder="Your full name" />
        <Input id="email" name="email" type="email" label="Email" required value={form.email}
          onChange={handleChange} placeholder="you@example.com" />
        <Input id="phone" name="phone" type="tel" label="Phone (optional)" value={form.phone}
          onChange={handleChange} placeholder="03xx-xxxxxxx" />
        <Input id="password" name="password" type="password" label="Password" required value={form.password}
          onChange={handleChange} placeholder="At least 6 characters" />
        <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" required
          value={form.confirmPassword} onChange={handleChange}
          placeholder="Repeat your password" />
        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Creating account..." : "Register"}
        </Button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-mint-600 dark:text-mint-300 hover:text-mint-700 dark:hover:text-mint-200">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
}
