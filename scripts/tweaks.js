/* ============================================================
   PRAXIS — Tweaks panel (vanilla JS, no React)
   Renders a floating "Tweaks" panel that writes through to
   PRAXIS_TWEAKS.update(). Toggle via the toolbar's edit-mode.
   ============================================================ */
(function () {
  'use strict';

  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'style') Object.assign(n.style, attrs[k]);
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach(k => {
      if (k == null) return;
      n.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
    });
    return n;
  }

  function row(label, control) {
    return el('div', { class: 'tw-row' },
      el('div', { class: 'tw-label' }, label),
      control
    );
  }

  function radio(name, value, options, onChange) {
    const wrap = el('div', { class: 'tw-radio' });
    options.forEach(o => {
      const b = el('button', {
        class: 'tw-radio-opt' + (o.value === value ? ' is-on' : ''),
        onclick: () => onChange(o.value)
      }, o.label);
      wrap.appendChild(b);
    });
    return wrap;
  }
  function toggle(value, onChange) {
    return el('button', {
      class: 'tw-toggle' + (value ? ' is-on' : ''),
      onclick: () => onChange(!value)
    }, el('span', { class: 'tw-toggle-knob' }));
  }
  function slider(value, min, max, step, onChange) {
    const inp = el('input', { type: 'range', min, max, step, value, class: 'tw-slider' });
    const num = el('span', { class: 'tw-slider-num' }, String(Number(value).toFixed(1)));
    inp.addEventListener('input', () => { num.textContent = Number(inp.value).toFixed(1); onChange(parseFloat(inp.value)); });
    return el('div', { class: 'tw-slider-wrap' }, inp, num);
  }
  function colorBtns(value, onChange) {
    const colors = ['#7CFFB2', '#FFB547', '#4D8DFF', '#FF6A3D', '#C9A227', '#E8E8E8'];
    return el('div', { class: 'tw-colors' },
      colors.map(c => el('button', {
        class: 'tw-color' + (c === value ? ' is-on' : ''),
        style: { background: c },
        title: c,
        onclick: () => onChange(c)
      }))
    );
  }
  function select(value, options, onChange) {
    const sel = el('select', { class: 'tw-select' });
    options.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value; opt.textContent = o.label;
      if (o.value === value) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', () => onChange(sel.value));
    return sel;
  }

  let panelRoot = null;
  let opened = false;

  function build() {
    const T = window.PRAXIS_TWEAKS;
    if (!T) return;
    const s = T.load();
    function set(p) { T.update(p); rerender(); }

    const body = el('div', { class: 'tw-body' },
      el('section', { class: 'tw-section' },
        el('h4', null, 'Theme'),
        row('Mode', radio('theme', s.theme, [
          { value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }
        ], v => set({ theme: v }))),
        row('Density', radio('density', s.density, [
          { value: 'compact', label: 'Compact' }, { value: 'balanced', label: 'Balanced' }, { value: 'spacious', label: 'Spacious' }
        ], v => set({ density: v })))
      ),
      el('section', { class: 'tw-section' },
        el('h4', null, 'Accent'),
        colorBtns(s.accent, v => set({ accent: v }))
      ),
      el('section', { class: 'tw-section' },
        el('h4', null, 'Hero'),
        row('Variant', radio('hero', s.heroVariant, [
          { value: 'kinetic', label: 'Kinetic' }, { value: 'radar', label: 'Radar' }, { value: 'dotfield', label: 'Dot field' }
        ], v => set({ heroVariant: v })))
      ),
      el('section', { class: 'tw-section' },
        el('h4', null, 'Type'),
        row('Pairing', select(s.fontPair, [
          { value: 'editorial', label: 'Editorial · Instrument + Inter' },
          { value: 'swiss', label: 'Swiss · Inter Tight' },
          { value: 'technical', label: 'Technical · JetBrains Mono' },
          { value: 'classic', label: 'Classic · Fraunces' }
        ], v => set({ fontPair: v })))
      ),
      el('section', { class: 'tw-section' },
        el('h4', null, 'Motion & dev'),
        row('Motion', slider(s.motion, 0, 2, 0.1, v => set({ motion: v }))),
        row('Grid overlay', toggle(s.grid === 'on', v => set({ grid: v ? 'on' : 'off' }))),
        row('CMS markers', toggle(s.cmsMarkers === 'on', v => set({ cmsMarkers: v ? 'on' : 'off' })))
      ),
      el('section', { class: 'tw-section' },
        el('button', { class: 'tw-reset', onclick: () => { T.update(T.defaults); rerender(); } }, 'Reset to defaults')
      )
    );

    return el('div', { class: 'tw-panel' },
      el('header', { class: 'tw-head' },
        el('div', { class: 'tw-title' }, 'Tweaks'),
        el('button', {
          class: 'tw-close',
          onclick: close
        }, '×')
      ),
      body
    );
  }

  function rerender() {
    if (!panelRoot) return;
    const next = build();
    panelRoot.replaceChildren(next);
  }
  function open() {
    if (!panelRoot) {
      panelRoot = el('div', { class: 'tw-root' });
      document.body.appendChild(panelRoot);
    }
    panelRoot.style.display = 'block';
    rerender();
    opened = true;
  }
  function close() {
    if (panelRoot) panelRoot.style.display = 'none';
    opened = false;
    try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
  }

  // Host protocol — register listener BEFORE announcing availability
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') open();
    else if (d.type === '__deactivate_edit_mode') close();
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}

  // Inject styles once
  const css = `
    .tw-root {
      position: fixed; right: 24px; bottom: 24px; z-index: 1000;
      width: 320px;
      background: #0c0e12; color: #f4f5f7;
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 12px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.5);
      font-family: var(--font-sans, system-ui);
      font-size: 13px;
      max-height: 85vh; overflow: auto;
    }
    .tw-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      position: sticky; top: 0; background: #0c0e12; z-index: 1;
    }
    .tw-title {
      font-family: var(--font-mono, ui-monospace);
      font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
      color: #c8ccd4;
    }
    .tw-close {
      background: none; border: 0; color: #8a909c; font-size: 22px; cursor: pointer; line-height: 1;
      width: 24px; height: 24px;
    }
    .tw-close:hover { color: #f4f5f7; }
    .tw-section {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .tw-section h4 {
      margin: 0 0 12px;
      font-family: var(--font-mono, ui-monospace);
      font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
      color: #8a909c; font-weight: 400;
    }
    .tw-row { display: grid; grid-template-columns: 80px 1fr; gap: 12px; align-items: center; margin-bottom: 10px; }
    .tw-row:last-child { margin-bottom: 0; }
    .tw-label { color: #c8ccd4; font-size: 12px; }
    .tw-radio { display: flex; gap: 0; border: 1px solid rgba(255,255,255,0.16); border-radius: 6px; overflow: hidden; }
    .tw-radio-opt {
      flex: 1; padding: 6px 8px;
      background: transparent; color: #c8ccd4; border: 0;
      font-family: var(--font-mono, ui-monospace);
      font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase;
      cursor: pointer; border-right: 1px solid rgba(255,255,255,0.10);
    }
    .tw-radio-opt:last-child { border-right: 0; }
    .tw-radio-opt.is-on { background: #7CFFB2; color: #042414; }
    .tw-toggle {
      width: 36px; height: 20px; border-radius: 999px;
      background: rgba(255,255,255,0.12); border: 0; cursor: pointer; position: relative;
      transition: background 180ms ease;
    }
    .tw-toggle.is-on { background: #7CFFB2; }
    .tw-toggle-knob {
      position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
      background: #fff; border-radius: 50%;
      transition: transform 180ms ease;
    }
    .tw-toggle.is-on .tw-toggle-knob { transform: translateX(16px); background: #042414; }
    .tw-slider-wrap { display: flex; align-items: center; gap: 8px; }
    .tw-slider { flex: 1; accent-color: #7CFFB2; }
    .tw-slider-num { font-family: var(--font-mono, ui-monospace); font-size: 11px; color: #8a909c; min-width: 24px; text-align: right; }
    .tw-colors { display: flex; gap: 6px; flex-wrap: wrap; }
    .tw-color {
      width: 26px; height: 26px; border-radius: 50%; cursor: pointer;
      border: 2px solid transparent; padding: 0;
    }
    .tw-color.is-on { border-color: #fff; }
    .tw-select {
      width: 100%; padding: 6px 8px;
      background: #12151b; color: #f4f5f7;
      border: 1px solid rgba(255,255,255,0.16); border-radius: 6px;
      font-family: var(--font-mono, ui-monospace); font-size: 11px;
    }
    .tw-reset {
      width: 100%; padding: 8px;
      background: transparent; color: #c8ccd4;
      border: 1px solid rgba(255,255,255,0.16); border-radius: 6px;
      font-family: var(--font-mono, ui-monospace);
      font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
      cursor: pointer;
    }
    .tw-reset:hover { background: rgba(255,255,255,0.04); color: #f4f5f7; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
