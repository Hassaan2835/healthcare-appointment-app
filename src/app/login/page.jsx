"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

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

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-center text-slate-600 dark:text-slate-400">
        Log in to manage your appointments.
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
        <Input
          id="email"
          type="email"
          label="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <Input
          id="password"
          type="password"
          label="Password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Your password"
        />
        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Logging in..." : "Log in"}
        </Button>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Do not have an account?{" "}
          <Link href="/register" className="font-medium text-mint-600 dark:text-mint-300 hover:text-mint-700 dark:hover:text-mint-200">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
}
