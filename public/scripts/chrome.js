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
      <a href="/" class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 856 883" fill="none" aria-hidden="true">
            <rect x="438" y="37" width="392" height="392" fill="#EE2537"/>
            <rect x="438" y="454" width="392" height="392" fill="currentColor"/>
            <path d="M413 429.5C413 377.956 402.848 326.917 383.123 279.297C363.398 231.676 334.486 188.408 298.039 151.961C261.592 115.514 218.324 86.6022 170.703 66.8773C123.083 47.1523 72.0438 37 20.5 37L20.5 429.5H413Z" fill="currentColor"/>
            <path d="M20.5 846C72.0438 846 123.083 835.848 170.703 816.123C218.324 796.398 261.592 767.486 298.039 731.039C334.486 694.592 363.398 651.324 383.123 603.703C402.848 556.083 413 505.044 413 453.5L20.5 453.5L20.5 846Z" fill="currentColor"/>
          </svg>
        </span>
        <span>DI &amp; UX</span>
      </a>
      <div class="nav-links">
        <button class="nav-link" data-mega="work" aria-expanded="false">Case studies <span class="caret">▾</span></button>
        <button class="nav-link" data-mega="thinking" aria-expanded="false">Blog <span class="caret">▾</span></button>
        <a class="nav-link" href="/team">Team</a>
        <a class="nav-link" href="/resources">Resources</a>
        <a class="nav-link" href="/#events">Events</a>
      </div>
      <div class="nav-actions">
        <a href="/contact" class="btn btn-primary nav-connect-cta">Connect <span class="arrow">→</span></a>
        <button class="nav-mobile-trigger" data-mobile-nav aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <div class="nav-mobile-panel">
    <a href="/case-study">Case studies</a>
    <a href="/article">Blog</a>
    <a href="/team">Team</a>
    <a href="/resources">Resources</a>
    <a href="/#events">Events</a>
    <a href="/#publications">Publications</a>
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
          <a class="megamenu-item" href="/case-study">
            <div class="megamenu-item-title">Mission Compose</div>
            <div class="megamenu-item-desc">Joint planning workspace · 2025</div>
          </a>
          <a class="megamenu-item" href="/case-study">
            <div class="megamenu-item-title">Aegis Console</div>
            <div class="megamenu-item-desc">Multi-domain awareness · 2025</div>
          </a>
          <a class="megamenu-item" href="/case-study">
            <div class="megamenu-item-title">Forge</div>
            <div class="megamenu-item-desc">AI document workflows · 2024</div>
          </a>
          <a class="megamenu-item" href="/case-study">
            <div class="megamenu-item-title">Beacon</div>
            <div class="megamenu-item-desc">Edge sensor configurator · 2024</div>
          </a>
          <a class="megamenu-item" href="/case-study">
            <div class="megamenu-item-title">Sentry</div>
            <div class="megamenu-item-desc">Threat triage workspace · 2024</div>
          </a>
          <a class="megamenu-item" href="/case-study">
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
          <a class="megamenu-item" href="/article">
            <div class="megamenu-item-title">Designing trust into autonomous systems</div>
            <div class="megamenu-item-desc">AI · 12 min read</div>
          </a>
          <a class="megamenu-item" href="/article">
            <div class="megamenu-item-title">The new operator: from joystick to dialogue</div>
            <div class="megamenu-item-desc">UX · 8 min read</div>
          </a>
          <a class="megamenu-item" href="/article">
            <div class="megamenu-item-title">Sensor fusion as a design material</div>
            <div class="megamenu-item-desc">Research · 14 min read</div>
          </a>
          <a class="megamenu-item" href="/article">
            <div class="megamenu-item-title">Cognitive load on the modern bridge</div>
            <div class="megamenu-item-desc">Research · 10 min read</div>
          </a>
        </div>
      </div>
    </div>
  </div>

`;

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
              <svg viewBox="0 0 856 883" fill="none" aria-hidden="true">
                <rect x="438" y="37" width="392" height="392" fill="#EE2537"/>
                <rect x="438" y="454" width="392" height="392" fill="currentColor"/>
                <path d="M413 429.5C413 377.956 402.848 326.917 383.123 279.297C363.398 231.676 334.486 188.408 298.039 151.961C261.592 115.514 218.324 86.6022 170.703 66.8773C123.083 47.1523 72.0438 37 20.5 37L20.5 429.5H413Z" fill="currentColor"/>
                <path d="M20.5 846C72.0438 846 123.083 835.848 170.703 816.123C218.324 796.398 261.592 767.486 298.039 731.039C334.486 694.592 363.398 651.324 383.123 603.703C402.848 556.083 413 505.044 413 453.5L20.5 453.5L20.5 846Z" fill="currentColor"/>
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
            <li><a href="/case-study">Case studies</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/#events">Events</a></li>
            <li><a href="/#publications">Publications</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>// Blog</h5>
          <ul>
            <li><a href="/article">Articles</a></li>
            <li><a href="#">Newsletter</a></li>
            <li><a href="#">Field notes</a></li>
            <li><a href="#">Talks</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h5>// Team</h5>
          <ul>
            <li><a href="/team">People</a></li>
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
      if (what === 'nav' || what === 'all') html += NAV_HTML;
      if (what === 'footer' || what === 'all') html += FOOTER_HTML;
      el.outerHTML = html;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else { inject(); }

  function scrambleWord(el, opts) {
    const target = (el.dataset.scramble || el.textContent || '').toUpperCase();
    if (!target) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%@&!?$+=/*';
    const duration = (opts && opts.duration) || 1600;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      // Reveal characters left-to-right with a soft easing.
      const revealed = Math.floor(t * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        if (ch === ' ') { out += ' '; continue; }
        if (i < revealed) out += ch;
        else out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  function runLoader() {
    const el = document.querySelector('[data-loader]');
    if (!el) return;
    if (sessionStorage.getItem('diux.loader.v1')) { el.remove(); return; }
    // Seed each word with random glyphs immediately so nothing flashes blank.
    el.querySelectorAll('[data-scramble]').forEach(w => {
      const t = w.dataset.scramble;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%@&!?$+=/*';
      let s = '';
      for (let i = 0; i < t.length; i++) s += chars[Math.floor(Math.random() * chars.length)];
      w.textContent = s;
    });
    requestAnimationFrame(() => {
      el.querySelectorAll('[data-scramble]').forEach(w => scrambleWord(w, { duration: 1500 }));
    });
    const HOLD = 3000;
    setTimeout(() => {
      sessionStorage.setItem('diux.loader.v1', '1');
      el.classList.add('done');
      document.documentElement.classList.remove('loader-active');
      setTimeout(() => el.classList.add('gone'), 1000);
    }, HOLD);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else { runLoader(); }
})();
