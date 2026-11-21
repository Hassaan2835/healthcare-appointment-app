// Day 14: Reusable components — appointment status badge.
// The status colours were copy-pasted in AppointmentCard and
// AdminAppointmentsTable; this is now the single source of truth.
// Pass an appointment `status` (PENDING / CONFIRMED / CANCELLED /
// COMPLETED), or any `tone` + `children` for a generic pill.

const STATUS_STYLES = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
  CONFIRMED: "border-mint-400/30 bg-mint-400/10 text-mint-600 dark:text-mint-300",
  CANCELLED: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300",
  COMPLETED:
    "border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

const TONE_STYLES = {
  mint: "border-mint-400/30 bg-mint-400/10 text-mint-600 dark:text-mint-300",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
  red: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300",
  neutral:
    "border-slate-200 dark:border-white/15 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300",
};

export default function StatusBadge({ status, tone, children, className = "" }) {
  const style = status
    ? STATUS_STYLES[status] || STATUS_STYLES.PENDING
    : TONE_STYLES[tone] || TONE_STYLES.neutral;
  const label = status ? STATUS_LABELS[status] || status : children;

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${style} ${className}`}
    >
      {label}
    </span>
  );
}
