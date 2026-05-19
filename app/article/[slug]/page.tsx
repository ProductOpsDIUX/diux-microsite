import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, listArticles } from '@/lib/cms/articles';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { SiteNav } from '@/components/site/SiteNav';import { ArticleToc } from '@/components/site/ArticleToc';
import { PageBackground } from '@/components/site/PageBackground';import { buildToc } from '@/lib/html/toc';

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

  // Build the TOC + inject anchor ids into the body HTML on the server.
  const { html: bodyHtml, headings } = buildToc(article.body_html);

  // Related = 3 most-recent other published articles
  const all = await listArticles();
  const related = all.filter((a) => a.id !== article.id).slice(0, 3);

  // display_date (admin-set free text) wins; otherwise format published_at.
  const published =
    article.display_date ||
    (article.published_at
      ? new Date(article.published_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : null);

  return (
    <>
      <SiteNav />
      <PageBackground color="var(--bg-2)" />

      <header className="detail-hero">
        <div className="wrap">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <a href="/article">Thinking</a>
            <span className="sep">/</span>
            <span>{article.title}</span>
          </nav>
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
          {(published || article.author) && (
            <div className="detail-meta">
              {article.author && (
                <div className="detail-meta-item">
                  <div className="k">By</div>
                  <div className="v">{article.author}</div>
                </div>
              )}
              {published && (
                <div className="detail-meta-item">
                  <div className="k">Published</div>
                  <div className="v">{published}</div>
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

      {/* Two-column layout: sticky TOC on the left, article body in the
          middle. The TOC is only rendered when the body has H2+ headings. */}
      <div className="article-with-toc wrap">
        {headings.length > 0 ? (
          <aside className="article-toc-rail">
            <ArticleToc headings={headings} />
          </aside>
        ) : (
          <aside className="article-toc-rail" aria-hidden="true" />
        )}
        <article className="article-body">
          {/* Body HTML comes from our admin's Tiptap editor (controlled
              extensions — no inline scripts allowed by the schema, no XSS
              surface). */}
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          {article.tags.length > 0 && (
            <div className="article-body-tags">
              <span className="article-body-tags-label">Tagged:</span>
              {article.tags.map((t) => (
                <a key={t} className="chip" href={`/article?tag=${encodeURIComponent(t)}`}>
                  #{t}
                </a>
              ))}
            </div>
          )}
        </article>
      </div>

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
                <a key={r.id} className="article-card" href={`/article/${r.slug}`}>
                  <div className="media has-image" style={{ aspectRatio: '16 / 10' }}>
                    {r.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.cover_image} alt="" />
                    ) : (
                      <span className="media-label">[ {r.slug.toUpperCase()} ]</span>
                    )}
                  </div>
                  <h3>{r.title}</h3>
                  {r.excerpt && <p>{r.excerpt}</p>}
                  <div className="read">
                    <span>Read</span>
                    <span className="arrow">→</span>
                  </div>
                </a>
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
