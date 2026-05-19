import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, listCaseStudies } from '@/lib/cms/case-studies';
import { LegacyScripts } from '@/components/site/LegacyScripts';

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseStudyBySlug(slug);
  if (!c) return { title: 'Case study not found' };
  return {
    title: `${c.title} · DI & UX`,
    description: c.summary || undefined,
    openGraph: c.hero_image ? { images: [c.hero_image] } : undefined,
  };
}

export default async function CaseStudyDetailPage({ params }: Params) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  // Body is plain text from the admin — render with whitespace preserved
  // and paragraph breaks at blank lines.
  const paragraphs = cs.body.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

  const all = await listCaseStudies();
  const related = all.filter((c) => c.id !== cs.id).slice(0, 3);

  return (
    <>
      <div className="grid-overlay" aria-hidden="true"></div>
      <div data-praxis-chrome="nav"></div>

      <header className="detail-hero">
        <div className="wrap">
          <nav className="crumbs">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <a href="/case-study">Work</a>
            <span className="sep">/</span>
            <span>{cs.title}</span>
          </nav>
          {cs.category && <div className="eyebrow reveal">// {cs.category}</div>}
          <h1 className="detail-h1 reveal">{cs.title}</h1>
          {cs.summary && (
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
              {cs.summary}
            </p>
          )}
          <div className="detail-meta">
            {cs.year && (
              <div className="detail-meta-item">
                <div className="k">Year</div>
                <div className="v">{cs.year}</div>
              </div>
            )}
            {cs.client && (
              <div className="detail-meta-item">
                <div className="k">Client</div>
                <div className="v">{cs.client}</div>
              </div>
            )}
            {cs.category && (
              <div className="detail-meta-item">
                <div className="k">Category</div>
                <div className="v">{cs.category}</div>
              </div>
            )}
            {cs.tags.length > 0 && (
              <div className="detail-meta-item">
                <div className="k">Tags</div>
                <div className="v">{cs.tags.join(' · ')}</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {cs.hero_image && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ paddingTop: 32 }}>
            <div className="media reveal has-image" style={{ aspectRatio: '21/9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cs.hero_image} alt="" />
            </div>
          </div>
        </section>
      )}

      {paragraphs.length > 0 && (
        <article className="article-body wrap">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'lead reveal' : 'reveal'} style={{ whiteSpace: 'pre-wrap' }}>
              {p}
            </p>
          ))}
        </article>
      )}

      {related.length > 0 && (
        <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">// More work</div>
                <h2 style={{ fontSize: 'var(--t-h3)' }}>
                  Other <span className="serif-italic">case studies.</span>
                </h2>
              </div>
            </div>
            <div className="case-grid">
              {related.map((r, i) => (
                <a
                  key={r.id}
                  className={`case-card ${i === 0 ? 'span-7' : 'span-5'}`}
                  href={`/case-study/${r.slug}`}
                >
                  <div className={`media${r.hero_image ? ' has-image' : ''}`}>
                    {r.hero_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.hero_image} alt="" />
                    ) : (
                      <span className="media-label">[ {r.slug.toUpperCase()} ]</span>
                    )}
                  </div>
                  <div className="case-meta">
                    {r.year && <span>{r.year}</span>}
                    {r.client && (
                      <>
                        <span className="dot"></span>
                        <span>{r.client}</span>
                      </>
                    )}
                  </div>
                  <h3>{r.title}</h3>
                  {r.summary && <p>{r.summary}</p>}
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
