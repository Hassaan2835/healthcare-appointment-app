import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import DashboardStats from "@/components/DashboardStats";
import AdminAppointmentsTable from "@/components/AdminAppointmentsTable";

export const metadata = {
  title: "Admin Dashboard | Healthcare Appointment App",
  description:
    "Overview of patients, doctors and appointments across the clinic.",
};

// Day 12: Admin Dashboard UI.
// Server component, protected by the auth middleware and by the
// ADMIN role check below — non-admin users are sent to their own
// dashboard. Reads live counts and recent records from Prisma.
//
// Note: approving / cancelling bookings from here is a Day 24
// (Admin management) job; this page is a read-only overview.
const ADMIN_STAT_CARDS = [
  { key: "users", label: "Total users", hint: "Patients + doctors + admins" },
  { key: "doctors", label: "Doctors", hint: "Registered doctors" },
  { key: "appointments", label: "Appointments", hint: "All time" },
  { key: "pending", label: "Pending bookings", hint: "Awaiting confirmation" },
];

const ROLE_STYLES = {
  ADMIN: "border-mint-400/30 bg-mint-400/10 text-mint-600 dark:text-mint-300",
  DOCTOR: "border-sky-400/30 bg-sky-400/10 text-sky-600 dark:text-sky-300",
  PATIENT: "border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [
    userRoleCounts,
    doctorCount,
    appointmentStatusCounts,
    recentAppointments,
    doctors,
    recentUsers,
  ] = await Promise.all([
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
    prisma.doctor.count(),
    prisma.appointment.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        patient: { select: { name: true, email: true } },
        doctor: {
          include: { user: { select: { name: true } } },
        },
      },
    }),
    prisma.doctor.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        user: { select: { name: true } },
        _count: { select: { appointments: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  const totalUsers = userRoleCounts.reduce(
    (sum, row) => sum + row._count._all,
    0
  );
  const totalAppointments = appointmentStatusCounts.reduce(
    (sum, row) => sum + row._count._all,
    0
  );
  const pendingCount =
    appointmentStatusCounts.find((row) => row.status === "PENDING")?._count
      ._all || 0;

  const stats = {
    users: totalUsers,
    doctors: doctorCount,
    appointments: totalAppointments,
    pending: pendingCount,
  };

  const firstName = session.user.name?.split(" ")[0] || "Admin";

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-600 dark:text-mint-400">
            Admin dashboard
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            {pendingCount > 0
              ? `${pendingCount} booking${pendingCount === 1 ? "" : "s"} waiting for confirmation.`
              : "Everything is up to date — no bookings waiting for confirmation."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/doctors"
            className="rounded-xl bg-mint-400 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-mint-300"
          >
            View Doctors
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-mint-400/50 px-5 py-2.5 text-sm font-semibold text-mint-600 dark:text-mint-300 transition hover:bg-mint-400 hover:text-navy-950"
          >
            Patient Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <DashboardStats stats={stats} cards={ADMIN_STAT_CARDS} />
      </div>

      <div className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Recent appointments
          </h2>
          <p className="text-sm text-slate-500">
            {totalAppointments} total
          </p>
        </div>
        {recentAppointments.length > 0 ? (
          <div className="mt-4">
            <AdminAppointmentsTable appointments={recentAppointments} />
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/50 px-6 py-10 text-center">
            <p className="font-medium text-slate-900 dark:text-white">No appointments yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Bookings will appear here as soon as patients start booking
              visits (booking saves to the database from Day 16).
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Doctors</h2>
          {doctors.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {doctors.map((doctor) => (
                <li
                  key={doctor.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/70 px-5 py-4 shadow-sm dark:shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-mint-300 to-mint-600 font-display text-sm font-bold text-navy-950">
                      {doctor.user.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {doctor.user.name}
                      </p>
                      <p className="text-sm text-mint-600 dark:text-mint-300">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {doctor._count.appointments} booking
                      {doctor._count.appointments === 1 ? "" : "s"}
                    </p>
                    <p
                      className={
                        doctor.available
                          ? "text-mint-600 dark:text-mint-300"
                          : "text-slate-600 dark:text-slate-400"
                      }
                    >
                      {doctor.available ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/50 px-6 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
              No doctors registered yet.
            </p>
          )}
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Newest users
          </h2>
          {recentUsers.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {recentUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/70 px-5 py-4 shadow-sm dark:shadow-card"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="truncate text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_STYLES[user.role] || ROLE_STYLES.PATIENT}`}
                  >
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/50 px-6 py-8 text-center text-sm text-slate-600 dark:text-slate-400">
              No users registered yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
