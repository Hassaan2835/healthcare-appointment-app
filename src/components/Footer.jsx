import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/appointments", label: "My Appointments" },
  { href: "/profile", label: "My Profile" },
];

const specialties = [
  "General Consultation",
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Dental Care",
  "Eye Care",
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold text-white">
            HealthCare<span className="text-mint-400">.</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Premium doctor appointments for Rawalpindi and Islamabad. Verified
            specialists, transparent fees and zero waiting in line.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-mint-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Specialties
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {specialties.map((item) => (
              <li key={item}>
                <Link href="/doctors" className="transition hover:text-mint-300">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Contact
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li>Rawalpindi, Punjab, Pakistan</li>
            <li>support@healthcare.example</li>
            <li>Mon - Sat, 9 AM - 9 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} HealthCare Appointment App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
