import Link from 'next/link';
import { listArticles } from '@/lib/cms/articles';
import { CollectionHeader, EmptyState } from '@/components/admin/CollectionHeader';

export const metadata = { title: 'Articles · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function ArticlesListPage() {
  const articles = await listArticles({ includeDrafts: true });

  return (
    <div className="space-y-8">
      <CollectionHeader
        eyebrow="// Articles"
        title="Articles"
        description="Blog posts. Drafts stay hidden from the public site until published."
        newHref="/admin/articles/new"
        newLabel="New article"
      />

      {articles.length === 0 ? (
        <EmptyState
          label="No articles yet"
          hint="Drafts and published posts will show up here."
          newHref="/admin/articles/new"
          newLabel="New article"
        />
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-bg1/40 overflow-hidden">
          {articles.map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/articles/${a.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-bg2 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[16px] font-medium text-fg0 truncate">
                      {a.title || <span className="text-fg2">(untitled)</span>}
                    </span>
                    {a.is_published ? (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                        Published
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-bg2 text-fg2">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-fg2 mt-1 truncate">
                    /article/{a.slug} {a.topic && <>· {a.topic}</>}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-fg2 whitespace-nowrap">
                  {a.published_at
                    ? new Date(a.published_at).toLocaleDateString()
                    : new Date(a.created_at).toLocaleDateString()}
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
