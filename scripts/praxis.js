/* ============================================================
   PRAXIS — Shared interactions
   Run after DOMContentLoaded. Loaded as a regular script.
   ============================================================ */
(function () {
  'use strict';

  // ----------------------------------------------------------
  // Tweaks state — shared across pages via localStorage
  // ----------------------------------------------------------
  const TWEAK_KEY = 'praxis.tweaks.v1';
  const TWEAK_DEFAULTS = {
    theme: 'dark',
    accent: '#7CFFB2',
    heroVariant: 'kinetic',
    density: 'balanced',
    fontPair: 'editorial',
    grid: 'off',
    motion: 1,
    cmsMarkers: 'off'
  };
  function loadTweaks() {
    try {
      const raw = localStorage.getItem(TWEAK_KEY);
      if (!raw) return { ...TWEAK_DEFAULTS };
      return { ...TWEAK_DEFAULTS, ...JSON.parse(raw) };
    } catch { return { ...TWEAK_DEFAULTS }; }
  }
  function saveTweaks(t) {
    try { localStorage.setItem(TWEAK_KEY, JSON.stringify(t)); } catch {}
  }
  const FONT_PAIRS = {
    editorial: {
      display: '"Instrument Serif", "Times New Roman", serif',
      sans: '"Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace'
    },
    swiss: {
      display: '"Inter Tight", "Inter", sans-serif',
      sans: '"Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace'
    },
    technical: {
      display: '"JetBrains Mono", ui-monospace, monospace',
      sans: '"Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace'
    },
    classic: {
      display: '"Fraunces", "Times New Roman", serif',
      sans: '"Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace'
    }
  };
  function applyTweaks(t) {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.theme);
    r.setAttribute('data-density', t.density);
    r.setAttribute('data-grid', t.grid);
    r.setAttribute('data-cms-show', t.cmsMarkers);
    r.setAttribute('data-hero-variant', t.heroVariant);
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--motion-mult', String(t.motion));
    const pair = FONT_PAIRS[t.fontPair] || FONT_PAIRS.editorial;
    r.style.setProperty('--font-display', pair.display);
    r.style.setProperty('--font-sans', pair.sans);
    r.style.setProperty('--font-mono', pair.mono);
    // Re-render hero if needed
    document.querySelectorAll('[data-hero-stage]').forEach(el => {
      el.dispatchEvent(new CustomEvent('praxis:variant', { detail: t.heroVariant }));
    });
  }
  // expose
  window.PRAXIS_TWEAKS = {
    load: loadTweaks, save: saveTweaks, apply: applyTweaks, defaults: TWEAK_DEFAULTS,
    update(patch) {
      const cur = loadTweaks();
      const next = { ...cur, ...patch };
      saveTweaks(next);
      applyTweaks(next);
      return next;
    }
  };
  // Apply ASAP to avoid FOUC
  applyTweaks(loadTweaks());

  // ----------------------------------------------------------
  // Mega menu
  // ----------------------------------------------------------
  function initMegaMenu() {
    // Theme toggle
    const themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const T = window.PRAXIS_TWEAKS;
        const cur = T.load().theme;
        T.update({ theme: cur === 'dark' ? 'light' : 'dark' });
      });
    }
    // Mobile nav toggle
    const mTrigger = document.querySelector('[data-mobile-nav]');
    if (mTrigger) {
      mTrigger.addEventListener('click', () => {
        document.body.classList.toggle('nav-mobile-open');
      });
      document.querySelectorAll('.nav-mobile-panel a').forEach(a =>
        a.addEventListener('click', () => document.body.classList.remove('nav-mobile-open'))
      );
    }
    const triggers = document.querySelectorAll('[data-mega]');
    const menus = document.querySelectorAll('.megamenu');
    let active = null;
    let hideTimer = null;

    function open(name) {
      clearTimeout(hideTimer);
      menus.forEach(m => m.setAttribute('data-open', m.dataset.megaPanel === name ? 'true' : 'false'));
      triggers.forEach(t => t.setAttribute('aria-expanded', t.dataset.mega === name ? 'true' : 'false'));
      active = name;
    }
    function closeSoon() {
      hideTimer = setTimeout(close, 160);
    }
    function close() {
      menus.forEach(m => m.setAttribute('data-open', 'false'));
      triggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      active = null;
    }
    triggers.forEach(t => {
      t.addEventListener('mouseenter', () => open(t.dataset.mega));
      t.addEventListener('focus', () => open(t.dataset.mega));
      t.addEventListener('mouseleave', closeSoon);
      t.addEventListener('click', (e) => { e.preventDefault(); active === t.dataset.mega ? close() : open(t.dataset.mega); });
    });
    menus.forEach(m => {
      m.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      m.addEventListener('mouseleave', closeSoon);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // ----------------------------------------------------------
  // Search overlay (⌘K)
  // ----------------------------------------------------------
  const SEARCH_INDEX = [
    // Articles
    { type: 'Article', title: 'Designing trust into autonomous mission systems', meta: 'AI · Trust · 12 min', url: 'article.html' },
    { type: 'Article', title: 'The new operator: from joystick to dialogue', meta: 'UX · Interaction · 8 min', url: 'article.html' },
    { type: 'Article', title: 'Sensor fusion as a design material', meta: 'AI · Data · 14 min', url: 'article.html' },
    { type: 'Article', title: 'Cognitive load on the modern bridge', meta: 'Research · 10 min', url: 'article.html' },
    { type: 'Article', title: 'A pattern language for command interfaces', meta: 'Systems · 16 min', url: 'article.html' },
    { type: 'Article', title: 'Why glanceable beats comprehensive', meta: 'UX · Heuristics · 6 min', url: 'article.html' },
    // Case studies
    { type: 'Case study', title: 'Mission Compose — Joint planning workspace', meta: 'Workspace · 2025', url: 'case-study.html' },
    { type: 'Case study', title: 'Aegis Console — Multi-domain awareness', meta: 'Operator UI · 2025', url: 'case-study.html' },
    { type: 'Case study', title: 'Forge — AI-assisted document workflows', meta: 'AI Tools · 2024', url: 'case-study.html' },
    { type: 'Case study', title: 'Beacon — Edge sensor configurator', meta: 'Field tools · 2024', url: 'case-study.html' },
    { type: 'Case study', title: 'Sentry — Threat triage for analysts', meta: 'Intel · 2024', url: 'case-study.html' },
    { type: 'Case study', title: 'Atlas — Roadmap intelligence platform', meta: 'Strategy · 2025', url: 'case-study.html' },
    // Team
    { type: 'Team', title: 'Maya Okafor — Head of Design Innovation', meta: 'Leadership', url: 'team.html' },
    { type: 'Team', title: 'Jonas Lindqvist — Principal AI/UX Researcher', meta: 'Research', url: 'team.html' },
    { type: 'Team', title: 'Aria Venkatesan — Staff Interaction Designer', meta: 'Design', url: 'team.html' },
    // Pages
    { type: 'Page', title: 'Capabilities — UX, AI, Innovation, Transformation', meta: 'About', url: 'index.html#capabilities' },
    { type: 'Page', title: 'Publications & resources', meta: 'Library', url: 'index.html#publications' },
    { type: 'Page', title: 'Hackathons & events', meta: 'Programs', url: 'index.html#events' }
  ];

  function initSearch() {
    const trigger = document.querySelector('[data-search-trigger]');
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    const input = overlay.querySelector('.search-input');
    const results = overlay.querySelector('.search-results');
    let active = -1;
    let filtered = [];

    function render(q) {
      const query = (q || '').trim().toLowerCase();
      filtered = query
        ? SEARCH_INDEX.filter(r => r.title.toLowerCase().includes(query) || r.type.toLowerCase().includes(query) || r.meta.toLowerCase().includes(query))
        : SEARCH_INDEX.slice(0, 8);
      const groups = {};
      filtered.forEach(r => { (groups[r.type] = groups[r.type] || []).push(r); });
      results.innerHTML = '';
      let idx = 0;
      Object.keys(groups).forEach(g => {
        const wrap = document.createElement('div');
        wrap.className = 'search-group';
        wrap.innerHTML = `<h6>${g}</h6>`;
        groups[g].forEach(r => {
          const i = idx++;
          const row = document.createElement('a');
          row.className = 'search-result';
          row.href = r.url;
          row.dataset.idx = i;
          row.innerHTML = `
            <div class="search-result-icon">${r.type[0]}</div>
            <div>
              <div class="search-result-title">${r.title}</div>
              <div class="search-result-meta">${r.meta}</div>
            </div>
            <div class="search-result-arrow">→</div>`;
          row.addEventListener('mouseenter', () => setActive(i));
          wrap.appendChild(row);
        });
        results.appendChild(wrap);
      });
      if (filtered.length === 0) {
        results.innerHTML = `<div style="padding: 40px 20px; text-align:center;" class="mono">No results — try "AI" or "operator"</div>`;
      }
      active = filtered.length ? 0 : -1;
      setActive(active);
    }
    function setActive(i) {
      active = i;
      results.querySelectorAll('.search-result').forEach(el => {
        el.classList.toggle('is-active', Number(el.dataset.idx) === i);
      });
    }
    function open() {
      overlay.setAttribute('data-open', 'true');
      input.value = '';
      render('');
      setTimeout(() => input.focus(), 50);
    }
    function close() {
      overlay.setAttribute('data-open', 'false');
    }
    if (trigger) trigger.addEventListener('click', open);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    input.addEventListener('input', () => render(input.value));
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        overlay.getAttribute('data-open') === 'true' ? close() : open();
      } else if (e.key === 'Escape' && overlay.getAttribute('data-open') === 'true') {
        close();
      } else if (overlay.getAttribute('data-open') === 'true') {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(active + 1, filtered.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
        else if (e.key === 'Enter' && active >= 0) {
          const row = results.querySelector(`.search-result[data-idx="${active}"]`);
          if (row) window.location.href = row.href;
        }
      }
    });
  }

  // ----------------------------------------------------------
  // Cursor
  // ----------------------------------------------------------
  function initCursor() {
    if (matchMedia('(hover: none)').matches) return;
    const dot = document.createElement('div'); dot.className = 'cursor-dot';
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.append(dot, ring);
    let dx = 0, dy = 0, rx = 0, ry = 0, mx = 0, my = 0;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function tick() {
      dx += (mx - dx) * 0.6; dy += (my - dy) * 0.6;
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();
    document.addEventListener('mouseenter', () => { dot.style.opacity = 1; ring.style.opacity = 0.6; });
    document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
    // Hover targets
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, .chip, .case-card, .article-card, .team-card, .pub-item');
      if (t) {
        ring.style.width = '52px'; ring.style.height = '52px';
        dot.style.width = '4px'; dot.style.height = '4px';
      }
    });
    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest('a, button, .chip, .case-card, .article-card, .team-card, .pub-item');
      if (t) {
        ring.style.width = '36px'; ring.style.height = '36px';
        dot.style.width = '8px'; dot.style.height = '8px';
      }
    });
  }

  // ----------------------------------------------------------
  // Magnetic hover
  // ----------------------------------------------------------
  function initMagnetic() {
    // Magnetic hover disabled per design preference.
  }

  // ----------------------------------------------------------
  // Reveals
  // ----------------------------------------------------------
  function initReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 6) * 60}ms`);
      io.observe(el);
    });
  }

  // ----------------------------------------------------------
  // Tag filter (used on homepage articles)
  // ----------------------------------------------------------
  function initFilters() {
    document.querySelectorAll('[data-filter-bar]').forEach(bar => {
      const targetSel = bar.dataset.filterTarget;
      const target = document.querySelector(targetSel);
      if (!target) return;
      const chips = bar.querySelectorAll('[data-filter]');
      chips.forEach(c => c.addEventListener('click', () => {
        chips.forEach(o => o.setAttribute('aria-pressed', 'false'));
        c.setAttribute('aria-pressed', 'true');
        const tag = c.dataset.filter;
        target.querySelectorAll('[data-tags]').forEach(card => {
          const tags = card.dataset.tags.split(',');
          const show = tag === 'all' || tags.includes(tag);
          card.style.display = show ? '' : 'none';
          card.style.opacity = show ? '' : '0';
        });
      }));
    });
  }

  // ----------------------------------------------------------
  // Stat counter
  // ----------------------------------------------------------
  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const dur = 1400;
        const start = performance.now();
        function step(t) {
          const k = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = (target * eased).toFixed(decimals);
          if (k < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    els.forEach(e => io.observe(e));
  }

  // ----------------------------------------------------------
  // Hero variants — kinetic word rotator + dotfield
  // ----------------------------------------------------------
  function initHero() {
    // Kinetic rotator
    document.querySelectorAll('[data-rotator]').forEach(el => {
      if (el.dataset.rotatorInit === '1') return;
      el.dataset.rotatorInit = '1';
      const words = el.dataset.rotator.split('|');
      // Clear any existing text/children before injecting our own
      el.textContent = '';
      el.style.position = 'relative';
      el.style.display = 'inline-block';
      el.style.verticalAlign = 'baseline';
      // Allow vertical headroom for italic ascenders/descenders (Instrument g/p/j)
      el.style.height = '1.15em';
      el.style.paddingTop = '0.1em';
      el.style.marginBottom = '-0.1em';
      el.style.overflow = 'hidden';
      el.style.lineHeight = '1';

      const widthSetter = document.createElement('span');
      widthSetter.style.visibility = 'hidden';
      widthSetter.style.position = 'absolute';
      widthSetter.style.top = '0';
      widthSetter.style.left = '0';
      widthSetter.style.whiteSpace = 'nowrap';
      widthSetter.style.fontStyle = 'italic';
      widthSetter.style.pointerEvents = 'none';
      el.appendChild(widthSetter);

      const inner = document.createElement('span');
      inner.className = 'kinetic-rotator-inner';
      inner.style.display = 'block';
      inner.style.transition = 'transform 600ms cubic-bezier(0.5,0,0.1,1)';
      inner.style.willChange = 'transform';

      const slideH = 1.15; // em — must match container height
      words.forEach(w => {
        const s = document.createElement('span');
        s.textContent = w;
        s.style.display = 'block';
        s.style.height = slideH + 'em';
        s.style.lineHeight = slideH;
        s.style.fontStyle = 'italic';
        s.style.color = 'var(--accent)';
        s.style.whiteSpace = 'nowrap';
        inner.appendChild(s);
      });
      el.appendChild(inner);

      let i = 0;
      function setWidth(w) {
        widthSetter.textContent = w;
        el.style.minWidth = (widthSetter.offsetWidth + 4) + 'px';
      }
      setWidth(words[0]);
      setInterval(() => {
        i = (i + 1) % words.length;
        inner.style.transform = `translateY(-${i * slideH}em)`;
        setWidth(words[i]);
      }, 2400);
    });

    // Dotfield (canvas)
    document.querySelectorAll('[data-dotfield]').forEach(canvas => {
      const ctx = canvas.getContext('2d');
      let w, h, dpr;
      let mx = -9999, my = -9999;
      const dots = [];
      function resize() {
        dpr = Math.min(2, devicePixelRatio || 1);
        const r = canvas.getBoundingClientRect();
        w = r.width; h = r.height;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dots.length = 0;
        const step = 28;
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            dots.push({ x, y, ox: x, oy: y });
          }
        }
      }
      window.addEventListener('resize', resize);
      addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        mx = e.clientX - r.left; my = e.clientY - r.top;
      });
      resize();
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7CFFB2';
      function tick() {
        ctx.clearRect(0, 0, w, h);
        for (const d of dots) {
          const dx = d.ox - mx, dy = d.oy - my;
          const dist = Math.hypot(dx, dy);
          const max = 140;
          if (dist < max) {
            const f = (1 - dist / max) * 18;
            d.x = d.ox + (dx / (dist || 1)) * f;
            d.y = d.oy + (dy / (dist || 1)) * f;
          } else {
            d.x += (d.ox - d.x) * 0.1;
            d.y += (d.oy - d.y) * 0.1;
          }
          const intensity = Math.max(0, 1 - dist / max);
          ctx.fillStyle = intensity > 0.05
            ? `oklch(0.92 0.18 152 / ${0.25 + intensity * 0.7})`
            : 'rgba(160,170,180,0.18)';
          const size = 1 + intensity * 2.5;
          ctx.fillRect(d.x - size/2, d.y - size/2, size, size);
        }
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  // ----------------------------------------------------------
  // Hero variant switcher: show the right .hero-stage-variant
  // ----------------------------------------------------------
  function syncHeroVariant() {
    const stages = document.querySelectorAll('[data-hero-stage]');
    stages.forEach(s => {
      const cur = document.documentElement.getAttribute('data-hero-variant') || 'kinetic';
      s.querySelectorAll('[data-variant]').forEach(v => {
        v.style.display = v.dataset.variant === cur ? '' : 'none';
      });
    });
  }
  document.addEventListener('praxis:variant', syncHeroVariant);
  document.querySelectorAll('[data-hero-stage]').forEach(s =>
    s.addEventListener('praxis:variant', syncHeroVariant)
  );

  // ----------------------------------------------------------
  // Init all
  // ----------------------------------------------------------
  function boot() {
    initMegaMenu();
    initSearch();
    initCursor();
    initMagnetic();
    initReveals();
    initFilters();
    initCounters();
    initHero();
    syncHeroVariant();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
