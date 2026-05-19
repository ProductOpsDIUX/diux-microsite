import type { Metadata } from 'next';
import Link from 'next/link';
import { getPageSeo } from '@/lib/cms/seo';
import { listCaseStudies } from '@/lib/cms/case-studies';
import { LegacyScripts } from '@/components/site/LegacyScripts';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/case-study');
  return {
    title: seo?.title || 'Case studies · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default async function CaseStudyIndexPage() {
  const items = await listCaseStudies();

  return (
    <>
      <div className="grid-overlay" aria-hidden="true"></div>
      <div data-praxis-chrome="nav"></div>

      <section className="section" style={{ paddingTop: '18vh' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">// Selected work</div>
              <h2>
                Mission-grade<br />
                <span className="serif-italic">software, shipped.</span>
              </h2>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="hero-sub" style={{ marginTop: 32 }}>
              No case studies yet — check back soon.
            </p>
          ) : (
            <div className="case-grid">
              {items.map((c, i) => {
                // First card takes a wider span, then alternate 7/5 splits.
                const span = i === 0 ? 'span-7' : i % 2 === 1 ? 'span-5' : 'span-7';
                return (
                  <Link
                    key={c.id}
                    className={`case-card ${span} reveal`}
                    href={`/case-study/${c.slug}`}
                    data-tags={c.tags.join(',')}
                  >
                    <div className={`media${c.hero_image ? ' has-image' : ''}`}>
                      {c.hero_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.hero_image} alt="" />
                      ) : (
                        <span className="media-label">[ {c.slug.toUpperCase()} ]</span>
                      )}
                      <div className="preview-overlay">
                        <span className="label">Open case study →</span>
                      </div>
                    </div>
                    <div className="case-meta">
                      {c.year && <span>{c.year}</span>}
                      {c.client && (
                        <>
                          <span className="dot"></span>
                          <span>{c.client}</span>
                        </>
                      )}
                      {c.category && (
                        <>
                          <span className="dot"></span>
                          <span>{c.category}</span>
                        </>
                      )}
                    </div>
                    <h3>{c.title}</h3>
                    {c.summary && <p>{c.summary}</p>}
                  </Link>
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
