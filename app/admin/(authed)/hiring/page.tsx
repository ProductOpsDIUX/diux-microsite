import Link from 'next/link';
import { listAllHiringRoles } from '@/lib/cms/hiring';
import { CollectionHeader, EmptyState } from '@/components/admin/CollectionHeader';
import type { HiringRole } from '@/lib/supabase/types';

export const metadata = { title: 'Hiring · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

function Row({ r }: { r: HiringRole }) {
  return (
    <li>
      <Link
        href={`/admin/hiring/${r.id}`}
        className="flex items-center gap-4 px-5 py-4 hover:bg-bg2 transition-colors"
      >
        <div className="h-10 w-10 rounded bg-bg2 border border-line shrink-0 grid place-items-center text-fg1 text-[16px]">
          {r.is_open ? '🟢' : '⚪'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-medium text-fg0 truncate">{r.title}</span>
            {!r.is_open && (
              <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg2 text-fg2">
                hidden
              </span>
            )}
          </div>
          <div className="text-[12px] text-fg2 mt-1 truncate">
            {[r.department, r.location].filter(Boolean).join(' · ') || r.url}
          </div>
        </div>
        <div className="text-[11px] font-mono text-fg2 whitespace-nowrap">pos {r.position}</div>
        <span className="text-fg2 text-[14px]">→</span>
      </Link>
    </li>
  );
}

export default async function HiringListPage() {
  const all = await listAllHiringRoles();
  const open = all.filter((r) => r.is_open);
  const closed = all.filter((r) => !r.is_open);

  return (
    <div className="space-y-8">
      <CollectionHeader
        eyebrow="// Hiring"
        title="Hiring"
        description="Open roles shown under the 'Latest openings' strip on the contact page. Each one links out to its DSTA Careers posting."
        newHref="/admin/hiring/new"
        newLabel="New role"
      />

      {all.length === 0 ? (
        <EmptyState label="No roles yet" newHref="/admin/hiring/new" newLabel="New role" />
      ) : (
        <div className="space-y-8">
          {[
            { label: 'Open', items: open },
            { label: 'Closed', items: closed },
          ].map(({ label, items }) => (
            <section key={label}>
              <h2 className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-3">
                // {label} {items.length > 0 && <span>· {items.length}</span>}
              </h2>
              {items.length === 0 ? (
                <div className="text-[13px] text-fg2 italic px-1">
                  No {label.toLowerCase()} roles.
                </div>
              ) : (
                <ul className="divide-y divide-line rounded-lg border border-line bg-bg1/40 overflow-hidden">
                  {items.map((r) => (
                    <Row key={r.id} r={r} />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
