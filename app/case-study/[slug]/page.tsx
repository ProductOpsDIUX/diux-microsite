import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseStudyBySlug, listCaseStudies } from '@/lib/cms/case-studies';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { SiteNav } from '@/components/site/SiteNav';
import { PageBackground } from '@/components/site/PageBackground';
import { ForceTheme } from '@/components/site/ForceTheme';
export const revalidate = 60;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

  // The body is rich text (HTML) from the admin's Tiptap editor. Older
  // case studies created before the rich-text switch may still be plain
  // text — detect that and wrap with <p> on paragraph breaks for
  // backwards compatibility.
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(cs.body);
  const bodyHtml = looksLikeHtml
    ? cs.body
    : cs.body
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0)
        .map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
        .join('\n');

  const all = await listCaseStudies();
  const related = all.filter((c) => c.id !== cs.id).slice(0, 3);

  return (
    <>
      <ForceTheme theme="light" />
      <SiteNav />
      <PageBackground color="var(--bg-2)" />

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

      {bodyHtml && (
        <article
          className="article-body wrap"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
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
              {related.map((r) => (
                <a
                  key={r.id}
                  className="case-card span-4"
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
