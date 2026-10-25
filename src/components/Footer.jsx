import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
        <p className="text-sm text-slate-600">
          &copy; {new Date().getFullYear()} HealthCare Appointment App. All rights reserved.
        </p>
        <nav className="flex gap-6 text-sm text-slate-600">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <Link href="/doctors" className="hover:text-teal-600">Doctors</Link>
          <Link href="/appointments" className="hover:text-teal-600">Appointments</Link>
        </nav>
      </div>
    </footer>
  );
}
