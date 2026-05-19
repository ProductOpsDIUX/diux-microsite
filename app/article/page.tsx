import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { listArticles } from '@/lib/cms/articles';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { SiteNav } from '@/components/site/SiteNav';
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/article');
  return {
    title: seo?.title || 'Articles · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default async function ArticleIndexPage() {
  const articles = await listArticles();

  return (
    <>
      <SiteNav />

      <section className="section" style={{ paddingTop: '18vh' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">// Thinking</div>
              <h2>
                Field notes from<br />
                <span className="serif-italic">inside the loop.</span>
              </h2>
            </div>
          </div>

          {articles.length === 0 ? (
            <p className="hero-sub" style={{ marginTop: 32 }}>
              No articles yet — check back soon.
            </p>
          ) : (
            <div className="article-grid">
              {articles.map((a) => (
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
                    {a.topic && a.published_at && <span className="dot"></span>}
                    {a.published_at && (
                      <span>
                        {new Date(a.published_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <h3>{a.title}</h3>
                  {a.excerpt && <p>{a.excerpt}</p>}
                  <div className="read">
                    <span>Read</span>
                    <span className="arrow">→</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
