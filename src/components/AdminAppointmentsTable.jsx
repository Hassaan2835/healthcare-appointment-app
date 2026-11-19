// Day 12: Admin Dashboard - recent appointments table.
// Receives Prisma Appointments with their Patient (User) and Doctor
// (with the doctor's User) already included by the admin page.

const STATUS_STYLES = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  CONFIRMED: "border-mint-400/30 bg-mint-400/10 text-mint-300",
  CANCELLED: "border-red-500/30 bg-red-500/10 text-red-300",
  COMPLETED: "border-white/15 bg-white/5 text-slate-300",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAppointmentsTable({ appointments }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-navy-800/70 shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
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
              className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
            >
              <td className="px-5 py-4">
                <p className="font-medium text-white">
                  {appointment.patient?.name || "Unknown patient"}
                </p>
                <p className="text-xs text-slate-500">
                  {appointment.patient?.email || ""}
                </p>
              </td>
              <td className="px-5 py-4">
                <p className="font-medium text-white">
                  {appointment.doctor?.user?.name || "Doctor"}
                </p>
                <p className="text-xs text-mint-300">
                  {appointment.doctor?.specialization || "General Consultation"}
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                {formatDate(appointment.date)}
              </td>
              <td className="max-w-[180px] truncate px-5 py-4 text-slate-400">
                {appointment.reason || "—"}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[appointment.status] || STATUS_STYLES.PENDING}`}
                >
                  {STATUS_LABELS[appointment.status] || appointment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
