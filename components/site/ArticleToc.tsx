'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/lib/html/toc';

// Sticky table of contents for the article detail pages. Three-level
// hierarchy (H2/H3/H4); clicking an entry jumps to the section (the
// site's smooth-scroll handles the animation). The active entry is
// highlighted as the user scrolls.

export function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    // Mark a heading active when it's in the upper third of the viewport.
    // rootMargin pulls the bottom inwards so the active state flips just
    // before the heading leaves the top region.
    const io = new IntersectionObserver(
      (entries) => {
        // Among all currently-intersecting headings, pick the one nearest
        // the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -66% 0px',
        threshold: [0, 1],
      }
    );

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => !!n);
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="article-toc" aria-label="Table of contents">
      <div className="article-toc-label">// Contents</div>
      <ol className="article-toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`article-toc-item article-toc-l${h.level}${
              activeId === h.id ? ' is-active' : ''
            }`}
          >
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
