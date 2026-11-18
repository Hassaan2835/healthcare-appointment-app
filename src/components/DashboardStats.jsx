// Day 11: Patient Dashboard - stat cards.
// Pure presentational component so it can be reused by the
// admin dashboard on Day 12 as well.

const CARDS = [
  { key: "total", label: "Total appointments", hint: "All time" },
  { key: "upcoming", label: "Upcoming", hint: "Confirmed + pending" },
  { key: "completed", label: "Completed", hint: "Finished visits" },
  { key: "cancelled", label: "Cancelled", hint: "Cancelled visits" },
];

export default function DashboardStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="rounded-2xl border border-white/10 bg-navy-800/70 p-5 shadow-card"
        >
          <p className="text-sm font-medium text-slate-400">{card.label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">
            {stats[card.key] ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
