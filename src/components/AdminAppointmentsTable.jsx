// Day 12: Admin Dashboard - recent appointments table.
// Receives Prisma Appointments with their Patient (User) and Doctor
// (with the doctor's User) already included by the admin page.
//
// Day 14: the status pill now comes from the shared StatusBadge
// primitive instead of a local copy of the status styles.

import { StatusBadge } from "@/components/ui";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAppointmentsTable({ appointments }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/70 shadow-sm dark:shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10 text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <th scope="col" className="px-5 py-4 font-semibold">
              Patient
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Doctor
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Date
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Reason
            </th>
            <th scope="col" className="px-5 py-4 font-semibold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment.id}
              className="border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-100 dark:hover:bg-white/[0.03]"
            >
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900 dark:text-white">
                  {appointment.patient?.name || "Unknown patient"}
                </p>
                <p className="text-xs text-slate-500">
                  {appointment.patient?.email || ""}
                </p>
              </td>
              <td className="px-5 py-4">
                <p className="font-medium text-slate-900 dark:text-white">
                  {appointment.doctor?.user?.name || "Doctor"}
                </p>
                <p className="text-xs text-mint-600 dark:text-mint-300">
                  {appointment.doctor?.specialization || "General Consultation"}
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-700 dark:text-slate-300">
                {formatDate(appointment.date)}
              </td>
              <td className="max-w-[180px] truncate px-5 py-4 text-slate-600 dark:text-slate-400">
                {appointment.reason || "—"}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={appointment.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
