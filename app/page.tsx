import { getHomeContent } from '@/lib/cms/home';
import { listCaseStudies } from '@/lib/cms/case-studies';
import { listArticles } from '@/lib/cms/articles';
import { LegacyScripts } from '@/components/site/LegacyScripts';

export const revalidate = 60; // ISR fallback; admin save also triggers explicit revalidate

// Alternating span pattern that matches the legacy home page case grid.
const CASE_SPANS = ['span-7', 'span-5', 'span-4', 'span-4', 'span-4'];

export default async function HomePage() {
  const [c, cases, articles] = await Promise.all([
    getHomeContent(),
    listCaseStudies(),
    listArticles(),
  ]);
  // Show featured case studies first, fall back to whatever's in position order.
  const featuredCases = cases.filter((cs) => cs.featured);
  const homeCases = (featuredCases.length ? featuredCases : cases).slice(0, 5);
  const homeArticles = articles.slice(0, 6);

  return (
    <>
      <div className="grid-overlay" aria-hidden="true"></div>
      {/* chrome.js injects the nav and footer here */}
      <div data-praxis-chrome="nav"></div>

      {/* ============ HERO ============ */}
      <header className="hero hud-corners" data-cms="cms.section/hero">
        <div className="hero-stage" data-hero-stage>
          <div data-variant="kinetic"></div>
          <canvas data-variant="dotfield" data-dotfield className="dotfield"></canvas>
        </div>

        <div className="hero-content">
          <h1 className="hero-h1 reveal">
            {c.hero_h1_prefix}
            <br />
            <span className="em" data-rotator={c.hero_h1_rotator.join('|')}></span>
            <br />
            {c.hero_h1_suffix}
          </h1>
          <p className="hero-sub reveal">{c.hero_sub}</p>
        </div>
      </header>

      {/* ============ CAPABILITIES / PILLARS ============ */}
      <section className="caps-scroll" id="capabilities" data-caps-section>
        <div className="caps-scroll-inner">
          <div className="wrap caps-scroll-grid">
            <div className="caps-scroll-left">
              <div className="eyebrow">// Pillars</div>
              <h2>
                <span className="caps-h-count" aria-hidden="true">
                  {c.pillars.map((_, i) => (
                    <span key={i} className={`caps-h-num${i === 0 ? ' is-active' : ''}`}>
                      {i + 1}
                    </span>
                  ))}
                </span>{' '}
                dimensions,
                <br />a shared collective purpose.
              </h2>
            </div>
            <div className="caps-scroll-mark" aria-hidden="true">
              DI &amp; UX
            </div>
            <div className="caps-scroll-right">
              {c.pillars.map((p, i) => (
                <article key={i} className={`caps-card${i === 0 ? ' is-active' : ''}`}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MISSION ============ */}
      <section className="manifesto" data-manifesto-section>
        <div className="manifesto-inner">
          <div className="wrap">
            <div className="manifesto-head">
              <div className="eyebrow">{c.mission_eyebrow}</div>
            </div>
            <p className="manifesto-text" data-manifesto>
              {c.mission_lines.map((line, i) => (
                <span key={i} className={`line${i === c.mission_lines.length - 1 ? '' : ''}`}>
                  {line.split(' ').map((w, j) => (
                    <span key={j} className="word">
                      {w}
                      {j < line.split(' ').length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="stat-band">
        <div className="wrap">
          <div className="stat-grid">
            {c.stats.map((s, i) => (
              <div key={i} className="stat reveal">
                <div className="stat-num">
                  {/^[0-9]+$/.test(s.value) ? (
                    <span data-count={s.value}>0</span>
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: s.value }} />
                  )}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WORK / CASE STUDIES ============ */}
      {homeCases.length > 0 && (
        <section
          className="section"
          id="work"
          style={{
            background: 'var(--bg-1)',
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">// Selected work</div>
                <h2>
                  Mission-grade<br />
                  <span className="serif-italic">software, shipped.</span>
                </h2>
              </div>
              <div className="actions">
                <a href="/case-study" className="btn">
                  All case studies <span className="arrow">→</span>
                </a>
              </div>
            </div>

            <div className="case-grid">
              {homeCases.map((cs, i) => (
                <a
                  key={cs.id}
                  className={`case-card ${CASE_SPANS[i] ?? 'span-4'} reveal`}
                  href={`/case-study/${cs.slug}`}
                  data-tags={cs.tags.join(',')}
                >
                  <div className={`media${cs.hero_image ? ' has-image' : ''}`}>
                    {cs.hero_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cs.hero_image} alt="" />
                    ) : (
                      <span className="media-label">[ {cs.slug.toUpperCase()} ]</span>
                    )}
                    <div className="preview-overlay">
                      <span className="label">Open case study →</span>
                    </div>
                  </div>
                  <div className="case-meta">
                    {cs.year && <span>{cs.year}</span>}
                    {cs.client && (
                      <>
                        <span className="dot"></span>
                        <span>{cs.client}</span>
                      </>
                    )}
                    {cs.category && (
                      <>
                        <span className="dot"></span>
                        <span>{cs.category}</span>
                      </>
                    )}
                  </div>
                  <h3>{cs.title}</h3>
                  {cs.summary && <p>{cs.summary}</p>}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ THINKING / ARTICLES ============ */}
      {homeArticles.length > 0 && (
        <section className="section" id="thinking">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">// Thinking</div>
                <h2>
                  Field notes from<br />
                  <span className="serif-italic">inside the loop.</span>
                </h2>
              </div>
              <div className="actions">
                <a href="/article" className="btn">
                  All articles <span className="arrow">→</span>
                </a>
              </div>
            </div>

            <div className="article-grid">
              {homeArticles.map((a) => (
                <a key={a.id} className="article-card reveal" href={`/article/${a.slug}`}>
                  <div className={`media${a.cover_image ? ' has-image' : ''}`} style={{ aspectRatio: '16 / 10' }}>
                    {a.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover_image} alt="" />
                    ) : (
                      <span className="media-label">[ {a.slug.toUpperCase()} ]</span>
                    )}
                  </div>
                  <div className="case-meta">
                    {a.topic && <span>{a.topic}</span>}
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
          </div>
        </section>
      )}

      {/* chrome.js injects the footer here */}
      <div data-praxis-chrome="footer"></div>

      <LegacyScripts />
    </>
  );
}
