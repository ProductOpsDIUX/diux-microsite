import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, listArticles } from '@/lib/cms/articles';
import { LegacyScripts } from '@/components/site/LegacyScripts';

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return { title: 'Article not found' };
  return {
    title: `${a.title} · DI & UX`,
    description: a.excerpt || undefined,
    openGraph: a.cover_image ? { images: [a.cover_image] } : undefined,
  };
}

export default async function ArticleDetailPage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // Related = 3 most-recent other published articles
  const all = await listArticles();
  const related = all.filter((a) => a.id !== article.id).slice(0, 3);

  const published = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <>
      <div className="grid-overlay" aria-hidden="true"></div>
      <div data-praxis-chrome="nav"></div>

      <header className="detail-hero">
        <div className="wrap">
          <nav className="crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/article">Thinking</Link>
            <span className="sep">/</span>
            <span>{article.title}</span>
          </nav>
          {article.topic && <div className="eyebrow reveal">// {article.topic}</div>}
          <h1 className="detail-h1 reveal">{article.title}</h1>
          {article.excerpt && (
            <p
              className="reveal"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                lineHeight: 1.25,
                letterSpacing: '-0.01em',
                maxWidth: '36ch',
                color: 'var(--fg-1)',
                margin: '0 0 32px',
              }}
            >
              {article.excerpt}
            </p>
          )}
          {published && (
            <div className="detail-meta">
              <div className="detail-meta-item">
                <div className="k">Published</div>
                <div className="v">{published}</div>
              </div>
              {article.topic && (
                <div className="detail-meta-item">
                  <div className="k">Topic</div>
                  <div className="v">{article.topic}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {article.cover_image && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ paddingTop: 32 }}>
            <div className="media reveal has-image" style={{ aspectRatio: '21/9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.cover_image} alt="" />
            </div>
          </div>
        </section>
      )}

      <article
        className="article-body wrap"
        // Body HTML comes from our admin's Tiptap editor (controlled extensions
        // — no inline scripts allowed by the schema, no XSS surface).
        dangerouslySetInnerHTML={{ __html: article.body_html }}
      />

      {related.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">// Related</div>
                <h2 style={{ fontSize: 'var(--t-h3)' }}>
                  Related <span className="serif-italic">thinking.</span>
                </h2>
              </div>
            </div>
            <div className="article-grid">
              {related.map((r) => (
                <Link key={r.id} className="article-card" href={`/article/${r.slug}`}>
                  <div className="media has-image" style={{ aspectRatio: '16 / 10' }}>
                    {r.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.cover_image} alt="" />
                    ) : (
                      <span className="media-label">[ {r.slug.toUpperCase()} ]</span>
                    )}
                  </div>
                  <div className="case-meta">
                    {r.topic && <span>{r.topic}</span>}
                  </div>
                  <h3>{r.title}</h3>
                  {r.excerpt && <p>{r.excerpt}</p>}
                  <div className="read">
                    <span>Read</span>
                    <span className="arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
