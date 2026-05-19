'use client';
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ButtonHTMLAttributes } from 'react';

// ──────────────────────────────────────────────────────────────────────
// Field — wraps a label, an input, and an optional error/help message.
// All admin form controls go through these primitives so styling, error
// presentation, and a11y are consistent across editors.
// ──────────────────────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
          {label} {required && <span className="text-accent">*</span>}
        </span>
        {hint && <span className="text-[11px] text-fg2/70">{hint}</span>}
      </div>
      {children}
      {error && <div className="mt-1.5 text-[12px] text-red-400">{error}</div>}
    </label>
  );
}

const inputBase =
  'w-full rounded-md border border-line bg-bg1 px-3 py-2.5 text-[14px] text-fg0 ' +
  'placeholder:text-fg2/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent ' +
  'disabled:opacity-50 disabled:cursor-not-allowed transition-colors';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return <input ref={ref} {...props} className={`${inputBase} ${props.className ?? ''}`} />;
  }
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return (
      <textarea
        ref={ref}
        rows={4}
        {...props}
        className={`${inputBase} resize-y leading-relaxed ${props.className ?? ''}`}
      />
    );
  }
);

// ──────────────────────────────────────────────────────────────────────
// Button — three variants, all share the same height + radius so they
// align cleanly in toolbars.
// ──────────────────────────────────────────────────────────────────────

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
};

export function Button({ variant = 'secondary', loading, children, disabled, ...rest }: ButtonProps) {
  const styles = {
    primary: 'bg-accent text-bg0 hover:bg-accent/90',
    secondary: 'border border-line bg-bg1 text-fg0 hover:bg-bg2',
    ghost: 'text-fg1 hover:text-fg0 hover:bg-bg2',
    danger: 'border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20',
  }[variant];
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${styles} ${rest.className ?? ''}`}
    >
      {loading && (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-r-transparent animate-spin" />
      )}
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Card — section container used to group related fields in editors.
// ──────────────────────────────────────────────────────────────────────

export function Card({
  title,
  description,
  children,
  actions,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-bg1/50 p-6">
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 mb-5">
          <div>
            {title && (
              <h2 className="font-display text-[20px] font-semibold text-fg0">{title}</h2>
            )}
            {description && <p className="text-[13px] text-fg2 mt-1">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Toast — minimal save/feedback banner. The editor pages own the state;
// this is just presentation.
// ──────────────────────────────────────────────────────────────────────

export function Toast({ kind, children }: { kind: 'success' | 'error' | 'info'; children: React.ReactNode }) {
  const tone = {
    success: 'border-accent/40 bg-accent/10 text-accent',
    error: 'border-red-500/40 bg-red-500/10 text-red-300',
    info: 'border-line bg-bg2 text-fg1',
  }[kind];
  return (
    <div className={`rounded-md border px-4 py-3 text-[13px] ${tone}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
