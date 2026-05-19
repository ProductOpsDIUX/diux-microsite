import Link from 'next/link';
import { listResources } from '@/lib/cms/resources';
import { CollectionHeader, EmptyState } from '@/components/admin/CollectionHeader';
import type { Resource } from '@/lib/supabase/types';

export const metadata = { title: 'Resources · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

function Row({ r }: { r: Resource }) {
  return (
    <li>
      <Link
        href={`/admin/resources/${r.id}`}
        className="flex items-center gap-4 px-5 py-4 hover:bg-bg2 transition-colors"
      >
        <div className="h-10 w-10 rounded bg-bg2 border border-line shrink-0 grid place-items-center text-fg1 text-[16px]">
          {r.file_path ? '📎' : '🔗'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-medium text-fg0 truncate">
              {r.title}
            </span>
            <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg2 text-fg2 capitalize">
              {r.kind}
            </span>
          </div>
          <div className="text-[12px] text-fg2 mt-1 truncate">{r.url}</div>
        </div>
        <div className="text-[11px] font-mono text-fg2 whitespace-nowrap">pos {r.position}</div>
        <span className="text-fg2 text-[14px]">→</span>
      </Link>
    </li>
  );
}

export default async function ResourcesListPage() {
  const all = await listResources();
  const templates = all.filter((r) => r.kind === 'template');
  const manuals = all.filter((r) => r.kind === 'manual');

  return (
    <div className="space-y-8">
      <CollectionHeader
        eyebrow="// Resources"
        title="Resources"
        description="Links and files for the public Resources page. Tag each one as a template or a manual."
        newHref="/admin/resources/new"
        newLabel="New resource"
      />

      {all.length === 0 ? (
        <EmptyState
          label="No resources yet"
          newHref="/admin/resources/new"
          newLabel="New resource"
        />
      ) : (
        <div className="space-y-8">
          {[
            { label: 'Templates', items: templates },
            { label: 'Manuals', items: manuals },
          ].map(({ label, items }) => (
            <section key={label}>
              <h2 className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-3">
                // {label} {items.length > 0 && <span>· {items.length}</span>}
              </h2>
              {items.length === 0 ? (
                <div className="text-[13px] text-fg2 italic px-1">
                  No {label.toLowerCase()} yet.
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
