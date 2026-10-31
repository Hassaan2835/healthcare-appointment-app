"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-navy-900 px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold tracking-tight text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-center text-slate-400">
        Log in to manage your appointments.
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
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="Your password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-mint-400 px-4 py-2.5 font-semibold text-navy-950 transition hover:bg-mint-300 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-sm text-slate-400">
          Do not have an account?{" "}
          <Link href="/register" className="font-medium text-mint-300 hover:text-mint-200">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
