import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-mint-300 to-mint-600 shadow-glow">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-navy-950" fill="currentColor" aria-hidden="true">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            HealthCare<span className="text-mint-400">.</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-300 transition hover:text-mint-300"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-mint-300 sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-mint-400 px-4 py-2 text-sm font-semibold text-navy-950 shadow-glow transition hover:bg-mint-300"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
