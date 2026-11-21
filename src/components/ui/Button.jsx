// Day 14: Reusable components — shared UI primitives.
//
// Every button in the app should look the same: mint primary actions,
// mint outline for secondary links, and a danger variant for destructive
// actions. `href` renders a Next.js Link instead of a <button> so the
// same component covers both cases, and `loading` swaps the label for
// a spinner and disables the control.

import Link from "next/link";
import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-mint-400 text-navy-950 shadow-glow hover:bg-mint-300",
  outline:
    "border border-mint-400/50 text-mint-600 dark:text-mint-300 hover:bg-mint-400 hover:text-navy-950",
  ghost:
    "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5",
  danger:
    "bg-red-500 text-white hover:bg-red-600",
};

const SIZES = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  loading = false,
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`;

  const content = (
    <>
      {loading && <Spinner size="sm" />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={loading || undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} disabled={loading || props.disabled} {...props}>
      {content}
    </button>
  );
}
