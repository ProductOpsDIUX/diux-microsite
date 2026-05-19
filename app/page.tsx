import { getHomeContent } from '@/lib/cms/home';
import { LegacyScripts } from '@/components/site/LegacyScripts';

export const revalidate = 60; // ISR fallback; admin save also triggers explicit revalidate

export default async function HomePage() {
  const c = await getHomeContent();

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

      {/* chrome.js injects the footer here */}
      <div data-praxis-chrome="footer"></div>

      <LegacyScripts />
    </>
  );
}
