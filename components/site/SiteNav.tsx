import { listCaseStudies } from '@/lib/cms/case-studies';
import { listArticles } from '@/lib/cms/articles';

// Public-site top navigation. Server-rendered so the megamenu dropdowns
// can show the actual most-recent case studies and articles from Supabase.
// praxis.js handles the hover-to-open + click-outside-to-close behaviour
// via the .nav-link[data-mega] triggers and .megamenu[data-mega-panel].

export async function SiteNav() {
  const [cases, articles] = await Promise.all([
    listCaseStudies(),
    listArticles(),
  ]);
  const recentCases = cases.slice(0, 5);
  const recentArticles = articles.slice(0, 5);

  return (
    <>
      <nav className="nav" role="navigation">
        <div className="nav-inner">
          <a href="/" className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 856 883" fill="none" aria-hidden="true">
                <rect x="438" y="37" width="392" height="392" fill="#EE2537" />
                <rect x="438" y="454" width="392" height="392" fill="currentColor" />
                <path d="M413 429.5C413 377.956 402.848 326.917 383.123 279.297C363.398 231.676 334.486 188.408 298.039 151.961C261.592 115.514 218.324 86.6022 170.703 66.8773C123.083 47.1523 72.0438 37 20.5 37L20.5 429.5H413Z" fill="currentColor" />
                <path d="M20.5 846C72.0438 846 123.083 835.848 170.703 816.123C218.324 796.398 261.592 767.486 298.039 731.039C334.486 694.592 363.398 651.324 383.123 603.703C402.848 556.083 413 505.044 413 453.5L20.5 453.5L20.5 846Z" fill="currentColor" />
              </svg>
            </span>
            <span>DI &amp; UX</span>
          </a>
          <div className="nav-links">
            {/* Both dropdown triggers are real anchor links — clicking them
                navigates to the index page, hovering opens the megamenu. */}
            <a className="nav-link" href="/case-study" data-mega="work" aria-expanded="false">
              Case studies <span className="caret">▾</span>
            </a>
            <a className="nav-link" href="/article" data-mega="thinking" aria-expanded="false">
              Thoughts <span className="caret">▾</span>
            </a>
            <a className="nav-link" href="/team">Team</a>
            <a className="nav-link" href="/resources">Resources</a>
            <a className="nav-link" href="/#events">Events</a>
          </div>
          <div className="nav-actions">
            <button className="nav-theme-toggle" data-theme-toggle aria-label="Toggle theme" title="Toggle theme">
              <svg className="theme-icon theme-icon-sun" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.3 3.3l1 1M11.7 11.7l1 1M3.3 12.7l1-1M11.7 4.3l1-1" />
              </svg>
              <svg className="theme-icon theme-icon-moon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" />
              </svg>
            </button>
            <button className="nav-mobile-trigger" data-mobile-nav aria-label="Open menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className="nav-mobile-panel">
        <a href="/case-study">Case studies</a>
        <a href="/article">Thoughts</a>
        <a href="/team">Team</a>
        <a href="/resources">Resources</a>
        <a href="/#events">Events</a>
        <a href="/#publications">Publications</a>
      </div>

      {recentCases.length > 0 && (
        <div className="megamenu" data-mega-panel="work">
          <div className="megamenu-inner">
            <div className="megamenu-section">
              <h4>// Practice</h4>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.015em', margin: 0, maxWidth: '14ch' }}>
                Mission-grade design for the systems people actually use.
              </p>
              <a href="/case-study" className="megamenu-cta" style={{ display: 'inline-block', marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                All case studies →
              </a>
            </div>
            <div className="megamenu-section">
              <h4>// Recent work</h4>
              <div className="megamenu-list">
                {recentCases.map((c) => (
                  <a key={c.id} className="megamenu-item" href={`/case-study/${c.slug}`}>
                    <div className="megamenu-item-title">{c.title}</div>
                    <div className="megamenu-item-desc">
                      {[c.category || c.client, c.year].filter(Boolean).join(' · ')}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {recentArticles.length > 0 && (
        <div className="megamenu" data-mega-panel="thinking">
          <div className="megamenu-inner">
            <div className="megamenu-section">
              <h4>// Thought leadership</h4>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.015em', margin: 0, maxWidth: '14ch' }}>
                Field notes from designing inside the loop.
              </p>
              <a href="/article" className="megamenu-cta" style={{ display: 'inline-block', marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                All thoughts →
              </a>
            </div>
            <div className="megamenu-section">
              <h4>// Latest</h4>
              <div className="megamenu-list">
                {recentArticles.map((a) => (
                  <a key={a.id} className="megamenu-item" href={`/article/${a.slug}`}>
                    <div className="megamenu-item-title">{a.title}</div>
                    <div className="megamenu-item-desc">
                      {a.author || ''}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
