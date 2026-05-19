'use client';

import { useEffect, useRef, useState } from 'react';

export type VerticalMilestone = {
  year: string;          // e.g. "2023 — 2026" or "2018"
  ghostYear?: string;    // overrides the big background number; defaults to the first year in `year`
  title: string;
  subtitle?: string;
  body: string;
};

export function VerticalTimeline({
  label = 'ORIGINS',
  items,
}: {
  label?: string;
  items: VerticalMilestone[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    const root = ref.current;
    const track = trackRef.current;
    if (!root || !track) return;

    let raf = 0;
    const tick = () => {
      raf = 0;
      const trackRect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const midpoint = vh / 2;

      // Line fills proportionally to the share of the track sitting above
      // the viewport midpoint. Negative values get clamped → 0; once the
      // track is fully scrolled past the midpoint we hit 1.
      const distance = midpoint - trackRect.top;
      const progress = Math.max(0, Math.min(1, distance / trackRect.height));
      if (fillRef.current) {
        // CSS owns the transform stack (translateX -50% on desktop, none on
        // mobile). We only push the scale value through a custom property.
        fillRef.current.style.setProperty('--vt-scale', progress.toFixed(4));
      }

      // A row becomes active once its dot has been passed by the fill line.
      // We add a small bias so the pulse triggers just before the dot hits
      // dead-center.
      let last = -1;
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const r = row.getBoundingClientRect();
        const center = r.top + r.height / 2;
        if (center < midpoint + 80) last = i;
      });
      setActiveIdx((prev) => (prev === last ? prev : last));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="vtimeline" ref={ref}>
      <header className="vtimeline-head">
        <span className="vtimeline-rule" />
        <h2>{label}</h2>
        <span className="vtimeline-rule" />
      </header>

      <div className="vtimeline-track" ref={trackRef}>
        <span className="vtimeline-line" aria-hidden="true" />
        <span className="vtimeline-line-fill" aria-hidden="true" ref={fillRef} />

        {items.map((m, i) => {
          const side = i % 2 === 0 ? 'right' : 'left';
          const ghost = (m.ghostYear ?? m.year.split(/[—-]/)[0]).trim();
          return (
            <div
              key={i}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className={`vt-row vt-${side}${i <= activeIdx ? ' is-active' : ''}`}
            >
              <span className="vt-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="vt-ghost" aria-hidden="true">
                {ghost}
              </span>
              <div className="vt-card">
                <div className="vt-range">{m.year}</div>
                <h3 className="vt-title">{m.title}</h3>
                {m.subtitle && <div className="vt-sub">{m.subtitle}</div>}
                <p className="vt-body">{m.body}</p>
              </div>
              <span className="vt-dot" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
