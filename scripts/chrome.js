/* ============================================================
   PRAXIS — Shared chrome (nav, search, footer)
   Inject into pages via data attributes:
     <div data-praxis-chrome></div>
   Run before praxis.js so listeners attach to live nodes.
   ============================================================ */
(function () {
  'use strict';

  const NAV_HTML = `
  <nav class="nav" role="navigation">
    <div class="nav-inner">
      <a href="index.html" class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="20" height="20" stroke="currentColor" stroke-width="1.2"/>
            <path d="M11 2 L20 11 L11 20 L2 11 Z" stroke="var(--accent)" stroke-width="1.2" fill="none"/>
            <circle cx="11" cy="11" r="2" fill="var(--accent)"/>
          </svg>
        </span>
        <span>DI &amp; UX</span>
      </a>
      <div class="nav-links">
        <button class="nav-link" data-mega="work" aria-expanded="false">Work <span class="caret">▾</span></button>
        <button class="nav-link" data-mega="thinking" aria-expanded="false">Thinking <span class="caret">▾</span></button>
        <button class="nav-link" data-mega="team" aria-expanded="false">Team <span class="caret">▾</span></button>
        <a class="nav-link" href="index.html#capabilities">Capabilities</a>
        <a class="nav-link" href="index.html#events">Events</a>
      </div>
      <div class="nav-actions">
        <button class="nav-theme-toggle" data-theme-toggle aria-label="Toggle theme" title="Toggle theme">
          <svg class="theme-icon theme-icon-sun" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <circle cx="8" cy="8" r="3"/>
            <path d="M8 1.5v1.5M8 13v1.5M1.5 8h1.5M13 8h1.5M3.3 3.3l1 1M11.7 11.7l1 1M3.3 12.7l1-1M11.7 4.3l1-1"/>
          </svg>
          <svg class="theme-icon theme-icon-moon" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z"/>
          </svg>
        </button>
        <button class="nav-mobile-trigger" data-mobile-nav aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
        <button class="nav-search-trigger magnet" data-magnet="0.2" data-search-trigger>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M11 11 L14 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <span>Search</span>
          <span class="kbd">⌘K</span>
        </button>
        <a href="#contact" class="btn btn-primary magnet" data-magnet="0.3">Brief us <span class="arrow">→</span></a>
      </div>
    </div>
  </nav>

  <div class="nav-mobile-panel">
    <a href="index.html#work">Work</a>
    <a href="index.html#thinking">Thinking</a>
    <a href="team.html">Team</a>
    <a href="index.html#capabilities">Capabilities</a>
    <a href="index.html#events">Events</a>
    <a href="index.html#publications">Publications</a>
  </div>

  <div class="megamenu" data-mega-panel="work">
    <div class="megamenu-inner">
      <div class="megamenu-section">
        <h4>// Practice</h4>
        <p style="font-family: var(--font-display); font-size: 28px; line-height: 1.15; letter-spacing: -0.015em; margin: 0; max-width: 14ch;">Mission-grade design for the systems people actually use.</p>
      </div>
      <div class="megamenu-section">
        <h4>// Recent work</h4>
        <div class="megamenu-list">
          <a class="megamenu-item" href="case-study.html">
            <div class="megamenu-item-title">Mission Compose</div>
            <div class="megamenu-item-desc">Joint planning workspace · 2025</div>
          </a>
          <a class="megamenu-item" href="case-study.html">
            <div class="megamenu-item-title">Aegis Console</div>
            <div class="megamenu-item-desc">Multi-domain awareness · 2025</div>
          </a>
          <a class="megamenu-item" href="case-study.html">
            <div class="megamenu-item-title">Forge</div>
            <div class="megamenu-item-desc">AI document workflows · 2024</div>
          </a>
          <a class="megamenu-item" href="case-study.html">
            <div class="megamenu-item-title">Beacon</div>
            <div class="megamenu-item-desc">Edge sensor configurator · 2024</div>
          </a>
          <a class="megamenu-item" href="case-study.html">
            <div class="megamenu-item-title">Sentry</div>
            <div class="megamenu-item-desc">Threat triage workspace · 2024</div>
          </a>
          <a class="megamenu-item" href="case-study.html">
            <div class="megamenu-item-title">Atlas</div>
            <div class="megamenu-item-desc">Roadmap intelligence · 2025</div>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="megamenu" data-mega-panel="thinking">
    <div class="megamenu-inner">
      <div class="megamenu-section">
        <h4>// Thought leadership</h4>
        <p style="font-family: var(--font-display); font-size: 28px; line-height: 1.15; letter-spacing: -0.015em; margin: 0; max-width: 14ch;">Field notes from designing inside the loop.</p>
      </div>
      <div class="megamenu-section">
        <h4>// Latest articles</h4>
        <div class="megamenu-list">
          <a class="megamenu-item" href="article.html">
            <div class="megamenu-item-title">Designing trust into autonomous systems</div>
            <div class="megamenu-item-desc">AI · 12 min read</div>
          </a>
          <a class="megamenu-item" href="article.html">
            <div class="megamenu-item-title">The new operator: from joystick to dialogue</div>
            <div class="megamenu-item-desc">UX · 8 min read</div>
          </a>
          <a class="megamenu-item" href="article.html">
            <div class="megamenu-item-title">Sensor fusion as a design material</div>
            <div class="megamenu-item-desc">Research · 14 min read</div>
          </a>
          <a class="megamenu-item" href="article.html">
            <div class="megamenu-item-title">Cognitive load on the modern bridge</div>
            <div class="megamenu-item-desc">Research · 10 min read</div>
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="megamenu" data-mega-panel="team">
    <div class="megamenu-inner">
      <div class="megamenu-section">
        <h4>// People</h4>
        <p style="font-family: var(--font-display); font-size: 28px; line-height: 1.15; letter-spacing: -0.015em; margin: 0; max-width: 14ch;">A multidisciplinary studio inside defence.</p>
      </div>
      <div class="megamenu-section">
        <h4>// Disciplines</h4>
        <div class="megamenu-list">
          <a class="megamenu-item" href="team.html">
            <div class="megamenu-item-title">Interaction Design</div>
            <div class="megamenu-item-desc">14 designers</div>
          </a>
          <a class="megamenu-item" href="team.html">
            <div class="megamenu-item-title">UX Research</div>
            <div class="megamenu-item-desc">9 researchers</div>
          </a>
          <a class="megamenu-item" href="team.html">
            <div class="megamenu-item-title">AI &amp; ML Strategy</div>
            <div class="megamenu-item-desc">7 specialists</div>
          </a>
          <a class="megamenu-item" href="team.html">
            <div class="megamenu-item-title">Service Design</div>
            <div class="megamenu-item-desc">6 designers</div>
          </a>
          <a class="megamenu-item" href="team.html">
            <div class="megamenu-item-title">Design Systems</div>
            <div class="megamenu-item-desc">5 engineers</div>
          </a>
          <a class="megamenu-item" href="team.html">
            <div class="megamenu-item-title">Innovation Labs</div>
            <div class="megamenu-item-desc">4 leads</div>
          </a>
        </div>
      </div>
    </div>
  </div>`;

  const SEARCH_HTML = `
  <div id="search-overlay" class="search-overlay" data-open="false" role="dialog" aria-label="Search">
    <div class="search-panel">
      <div class="search-input-row">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.6"/>
          <path d="M14 14 L18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <input class="search-input" type="text" placeholder="Search articles, case studies, people…" />
        <span class="kbd">ESC</span>
      </div>
      <div class="search-results"></div>
      <div class="search-foot">
        <span>DI & UX · Index v3</span>
        <span class="keys"><span class="kbd">↑</span><span class="kbd">↓</span> navigate · <span class="kbd">↵</span> open</span>
      </div>
    </div>
  </div>`;

  const FOOTER_HTML = `
  <footer class="footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="brand" style="margin-bottom: 24px;">
            <span class="brand-mark">
              <svg viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="20" height="20" stroke="currentColor" stroke-width="1.2"/>
                <path d="M11 2 L20 11 L11 20 L2 11 Z" stroke="var(--accent)" stroke-width="1.2" fill="none"/>
                <circle cx="11" cy="11" r="2" fill="var(--accent)"/>
              </svg>
            </span>
            <span>DI &amp; UX</span>
          </div>
          <p style="color: var(--fg-2); max-width: 32ch; font-size: 14px; margin: 0 0 24px;">A defence-tech design innovation &amp; UX practice. We design the tools the mission depends on.</p>
          <div style="display: flex; gap: 8px;">
            <a href="#" class="chip">LinkedIn</a>
            <a href="#" class="chip">GitHub</a>
            <a href="#" class="chip">Substack</a>
          </div>
        </div>
        <div class="footer-col">
          <h5>// Practice</h5>
          <ul>
            <li><a href="case-study.html">Case studies</a></li>
            <li><a href="index.html#capabilities">Capabilities</a></li>
            <li><a href="index.html#events">Events</a></li>
            <li><a href="index.html#publications">Publications</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>// Thinking</h5>
          <ul>
            <li><a href="article.html">Articles</a></li>
            <li><a href="#">Newsletter</a></li>
            <li><a href="#">Field notes</a></li>
            <li><a href="#">Talks</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>// Team</h5>
          <ul>
            <li><a href="team.html">People</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Internships</a></li>
            <li><a href="#">Fellowship</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>// Operations</h5>
          <ul>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 DI & UX Design Practice · Cleared for public release</span>
        <span>v3.4.1 · Last deploy 2026-05-03 09:14 UTC</span>
      </div>
      <div class="footer-display">DI &amp; UX</div>
    </div>
  </footer>`;

  function inject() {
    document.querySelectorAll('[data-praxis-chrome]').forEach(el => {
      const what = el.dataset.praxisChrome || 'all';
      let html = '';
      if (what === 'nav' || what === 'all') html += NAV_HTML + SEARCH_HTML;
      if (what === 'footer' || what === 'all') html += FOOTER_HTML;
      el.outerHTML = html;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else { inject(); }

  function runLoader() {
    const el = document.querySelector('[data-loader]');
    if (!el) return;
    if (sessionStorage.getItem('diux.loader.v1')) { el.remove(); return; }
    const HOLD = 2200;
    setTimeout(() => {
      sessionStorage.setItem('diux.loader.v1', '1');
      el.classList.add('done');
      document.documentElement.classList.remove('loader-active');
      setTimeout(() => el.classList.add('gone'), 1200);
    }, HOLD);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else { runLoader(); }
})();
