// Day 14: Reusable components — form fields.
// One field style for the whole app: label above, mint focus ring,
// red inline error below. `Input` covers text/date/tel/etc.;
// `Select` and `Textarea` share the same shell so forms stay uniform.

const FIELD_CLASS =
  "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-navy-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:border-mint-400/60 focus:outline-none focus:ring-2 focus:ring-mint-400/30";

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-300">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function Input({ id, label, error, hint, className = "", ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input id={id} className={`${FIELD_CLASS} ${className}`} {...props} />
    </Field>
  );
}

export function Select({ id, label, error, hint, children, className = "", ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <select id={id} className={`${FIELD_CLASS} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Textarea({ id, label, error, hint, className = "", ...props }) {
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea id={id} rows={3} className={`${FIELD_CLASS} ${className}`} {...props} />
    </Field>
  );
}
