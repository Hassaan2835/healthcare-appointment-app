// Day 14: Reusable components — surface card.
// The standard bordered panel used by dashboards, forms and detail
// pages. `padding` can be tightened for dense layouts; extra classes
// (e.g. flex layout) pass through via `className`.

const PADDINGS = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
};

export default function Card({ children, padding = "md", className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800/70 shadow-sm dark:shadow-card ${PADDINGS[padding] || PADDINGS.md} ${className}`}
    >
      {children}
    </div>
  );
}
