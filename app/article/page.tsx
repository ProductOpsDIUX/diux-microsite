import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { listArticles } from '@/lib/cms/articles';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { SiteNav } from '@/components/site/SiteNav';
import { PageBackground } from '@/components/site/PageBackground';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/article');
  return {
    title: seo?.title || 'Articles · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

type Params = { searchParams: Promise<{ tag?: string }> };

function formatDate(a: { display_date: string; published_at: string | null }) {
  if (a.display_date) return a.display_date;
  if (a.published_at) {
    return new Date(a.published_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  return '';
}

export default async function ArticleIndexPage({ searchParams }: Params) {
  const { tag } = await searchParams;
  const all = await listArticles();
  const activeTag = (tag || '').toLowerCase().trim() || null;

  // Distinct tags across all (published) articles, alphabetised.
  const allTags = Array.from(
    new Set(all.flatMap((a) => a.tags))
  ).sort((a, b) => a.localeCompare(b));

  const articles = activeTag
    ? all.filter((a) => a.tags.includes(activeTag))
    : all;

  return (
    <>
      <SiteNav />
      <PageBackground color="var(--bg-2)" />

      <section className="section" style={{ paddingTop: '18vh' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">// Thoughts</div>
              <h2>
                Field notes from<br />
                <span className="serif-italic">inside the loop.</span>
              </h2>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="filter-bar" data-filter-bar>
              <span className="label">// Filter</span>
              <a
                href="/article"
                className={`chip${!activeTag ? ' is-active' : ''}`}
                aria-pressed={!activeTag}
              >
                All
              </a>
              {allTags.map((t) => (
                <a
                  key={t}
                  href={`/article?tag=${encodeURIComponent(t)}`}
                  className={`chip${activeTag === t ? ' is-active' : ''}`}
                  aria-pressed={activeTag === t}
                >
                  {t}
                </a>
              ))}
            </div>
          )}

          {articles.length === 0 ? (
            <p className="hero-sub" style={{ marginTop: 32 }}>
              {activeTag
                ? <>No articles tagged <em>{activeTag}</em> yet.</>
                : <>No articles yet — check back soon.</>}
            </p>
          ) : (
            <div className="article-grid">
              {articles.map((a) => {
                const date = formatDate(a);
                return (
                  <a key={a.id} className="article-card reveal" href={`/article/${a.slug}`}>
                    <div className="media has-image" style={{ aspectRatio: '16 / 10' }}>
                      {a.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.cover_image} alt="" />
                      ) : (
                        <span className="media-label">[ {a.slug.toUpperCase()} ]</span>
                      )}
                    </div>
                    <div className="case-meta">
                      {a.topic && <span>{a.topic}</span>}
                      {a.topic && date && <span className="dot"></span>}
                      {date && <span>{date}</span>}
                    </div>
                    <h3>{a.title}</h3>
                    {a.excerpt && <p>{a.excerpt}</p>}
                    {a.tags.length > 0 && (
                      <div className="article-card-tags">
                        {a.tags.map((t) => (
                          <span key={t} className="article-card-tag">#{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="read">
                      <span>Read</span>
                      <span className="arrow">→</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
