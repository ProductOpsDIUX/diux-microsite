import Link from 'next/link';
import { listCaseStudies } from '@/lib/cms/case-studies';
import { CollectionHeader, EmptyState } from '@/components/admin/CollectionHeader';

export const metadata = { title: 'Case studies · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function CaseStudiesListPage() {
  const items = await listCaseStudies();

  return (
    <div className="space-y-8">
      <CollectionHeader
        eyebrow="// Case studies"
        title="Case studies"
        description="Selected work that appears on the home page and the /case-study index."
        newHref="/admin/case-studies/new"
        newLabel="New case study"
      />

      {items.length === 0 ? (
        <EmptyState
          label="No case studies yet"
          newHref="/admin/case-studies/new"
          newLabel="New case study"
        />
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-bg1/40 overflow-hidden">
          {items.map((c) => (
            <li key={c.id}>
              <Link
                href={`/admin/case-studies/${c.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-bg2 transition-colors"
              >
                {c.hero_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.hero_image}
                    alt=""
                    className="w-14 h-14 rounded object-cover border border-line shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded bg-bg2 border border-line shrink-0 grid place-items-center text-fg2 text-[10px] font-mono">
                    no img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[16px] font-medium text-fg0 truncate">
                      {c.title || <span className="text-fg2">(untitled)</span>}
                    </span>
                    {c.featured && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-fg2 mt-1 truncate">
                    {c.year} {c.client && <>· {c.client}</>} {c.category && <>· {c.category}</>}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-fg2 whitespace-nowrap">
                  pos {c.position}
                </div>
                <span className="text-fg2 text-[14px]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
