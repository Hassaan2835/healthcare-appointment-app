import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import DashboardStats from "@/components/DashboardStats";
import AppointmentCard from "@/components/AppointmentCard";
import { Button } from "@/components/ui";

export const metadata = {
  title: "My Dashboard | Healthcare Appointment App",
  description:
    "Your upcoming and past appointments, at a glance. Book, track and manage your visits.",
};

// Day 11: Patient Dashboard.
// Server component, protected by both the auth middleware and the
// session check below. Reads real appointments from Prisma.
//
// Day 16: bookings are saved through POST /api/appointments, so a real
// booking now shows up here instead of the empty state below.
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      appointments: {
        include: {
          doctor: {
            include: { user: { select: { name: true } } },
          },
        },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const appointments = user.appointments || [];
  const isUpcoming = (appointment) =>
    new Date(appointment.date) >= todayStart &&
    (appointment.status === "PENDING" || appointment.status === "CONFIRMED");

  const upcoming = appointments.filter(isUpcoming);
  const past = appointments
    .filter((appointment) => !isUpcoming(appointment))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const stats = {
    total: appointments.length,
    upcoming: upcoming.length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  const nextAppointment = upcoming[0] || null;
  const firstName = user.name.split(" ")[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-600 dark:text-mint-400">
            Patient dashboard
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            {nextAppointment
              ? "Your next visit is coming up — details are below."
              : "You have no upcoming visits. Book your next appointment in under a minute."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/appointments">Book Appointment</Button>
          <Button href="/doctors" variant="outline">
            Find Doctors
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <DashboardStats stats={stats} />
      </div>

      {nextAppointment && (
        <div className="mt-8 rounded-2xl border border-mint-400/30 bg-white dark:bg-navy-800/80 p-6 shadow-sm dark:shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mint-600 dark:text-mint-400">
            Next appointment
          </p>
          <div className="mt-4">
            <AppointmentCard appointment={nextAppointment} />
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          Upcoming appointments
        </h2>
        {upcoming.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {upcoming.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/15 bg-white dark:bg-navy-800/50 px-6 py-10 text-center">
            <p className="font-medium text-slate-900 dark:text-white">No upcoming appointments</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
              When you book a visit it will show up here with the doctor,
              date and status.
            </p>
            <Link
              href="/doctors"
              className="mt-5 inline-block rounded-xl bg-mint-400 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-mint-300"
            >
              Browse Doctors
            </Link>
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Past appointments
          </h2>
          <div className="mt-4 grid gap-4">
            {past.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-slate-500">
        Need to change your details?{" "}
        <Link href="/profile" className="font-medium text-mint-600 dark:text-mint-300 hover:text-mint-700 dark:hover:text-mint-400">
          Go to My Profile
        </Link>
      </p>
    </section>
  );
}
