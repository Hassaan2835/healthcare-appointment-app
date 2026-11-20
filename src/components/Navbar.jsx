// Day 13: responsive navbar - the links used to simply vanish on
// small screens with no way to reach them. A hamburger button now
// opens a dropdown menu on mobile, and the theme toggle sits next
// to the auth buttons in both layouts.
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/85">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mint-300 to-mint-600 shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-navy-950" fill="currentColor" aria-hidden="true">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            HealthCare<span className="text-mint-600 dark:text-mint-400">.</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className={
                  pathname === link.href
                    ? "text-sm font-semibold text-mint-600 dark:text-mint-300"
                    : "text-sm font-medium text-slate-700 transition hover:text-mint-600 dark:text-slate-300 dark:hover:text-mint-300"
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:text-mint-600 sm:block dark:text-slate-200 dark:hover:text-mint-300"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="hidden rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-navy-950 shadow-glow transition hover:bg-mint-300 min-[400px]:block"
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:text-mint-600 md:hidden dark:border-white/10 dark:bg-navy-800 dark:text-slate-300 dark:hover:text-mint-300"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden dark:border-white/10 dark:bg-navy-900">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={
                    pathname === link.href
                      ? "block rounded-lg bg-mint-400/10 px-3 py-2.5 text-sm font-semibold text-mint-600 dark:text-mint-300"
                      : "block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-mint-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-mint-300"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 dark:border-white/15 dark:text-slate-200"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-mint-400 px-4 py-2.5 text-center text-sm font-semibold text-navy-950"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
