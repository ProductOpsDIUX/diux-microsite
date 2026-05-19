'use client';

import { useEffect, useRef, useState } from 'react';

export type TimelineMilestone = {
  year: string;
  title: string;
  bullets: string[];
};

export function Timeline({ milestones }: { milestones: TimelineMilestone[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Trigger the line-draw + staggered card reveal when the section reaches
  // about a third of the way up the viewport. One-shot — once visible, it
  // stays visible (we don't reverse).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`timeline${active ? ' is-in' : ''}`}>
      <div className="timeline-track" aria-hidden="true">
        <span className="timeline-line" />
        <span className="timeline-line-fill" />
      </div>
      <ol className="timeline-items">
        {milestones.map((m, i) => (
          <li
            key={m.year}
            className="timeline-item"
            style={{ ['--i' as never]: i }}
          >
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-year">{m.year}</div>
            <div className="timeline-title">{m.title}</div>
            <ul className="timeline-bullets">
              {m.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
