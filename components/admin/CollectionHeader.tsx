import Link from 'next/link';
import { Button } from './ui';

export function CollectionHeader({
  eyebrow,
  title,
  description,
  newHref,
  newLabel = 'New',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  newHref: string;
  newLabel?: string;
}) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">{eyebrow}</div>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">{title}</h1>
        {description && <p className="mt-2 text-[14px] text-fg2 max-w-prose">{description}</p>}
      </div>
      <Link href={newHref}>
        <Button variant="primary">+ {newLabel}</Button>
      </Link>
    </header>
  );
}

export function EmptyState({ label, hint, newHref, newLabel }: {
  label: string;
  hint?: string;
  newHref: string;
  newLabel: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-bg1/30 p-10 text-center">
      <div className="font-display text-[18px] text-fg0">{label}</div>
      {hint && <div className="mt-1 text-[13px] text-fg2">{hint}</div>}
      <div className="mt-5">
        <Link
          href={newHref}
          className="inline-flex items-center rounded-md bg-accent text-bg0 px-4 py-2 text-[13px] font-medium"
        >
          + {newLabel}
        </Link>
      </div>
    </div>
  );
}
