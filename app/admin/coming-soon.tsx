import Link from 'next/link';

export function ComingSoon({
  title,
  blurb,
  bullets,
}: {
  title: string;
  blurb: string;
  bullets: string[];
}) {
  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
          // {title}
        </div>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">{title}</h1>
        <p className="mt-2 text-[14px] text-fg2 max-w-prose">{blurb}</p>
      </header>

      <div className="rounded-lg border border-line bg-bg1/40 p-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-3">
          // Planned
        </div>
        <ul className="space-y-2 text-[14px] text-fg1">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-[13px] text-fg2">
        Status: schema, types, and revalidation are already in place. Editors will reuse the same
        primitives as the <Link className="text-accent hover:underline" href="/admin/home">Home editor</Link>.
      </div>
    </div>
  );
}
