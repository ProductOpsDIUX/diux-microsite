'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/lib/html/toc';

// Table of contents for the article detail pages.
// - Desktop: a sticky sidebar on the left.
// - Mobile (≤1024px, controlled in CSS): a small floating tab pinned to
//   the left edge of the viewport. Tapping it slides out a drawer with
//   the same TOC; selecting an item scrolls to the section and closes
//   the drawer.

export function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  // Scroll-spy: mark a heading active when it's in the upper third of the
  // viewport. The drawer reuses the same active state.
  useEffect(() => {
    if (headings.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -66% 0px', threshold: [0, 1] }
    );

    const nodes = headings
      .map((h) => document.getElementById(h.id))
      .filter((n): n is HTMLElement => !!n);
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [headings]);

  // Lock body scroll while the mobile drawer is open so the page doesn't
  // shift around behind the overlay.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, [open]);

  // Close drawer on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (headings.length === 0) return null;

  const list = (
    <ol className="article-toc-list">
      {headings.map((h) => (
        <li
          key={h.id}
          className={`article-toc-item article-toc-l${h.level}${
            activeId === h.id ? ' is-active' : ''
          }`}
        >
          <a
            href={`#${h.id}`}
            onClick={() => {
              // Close the mobile drawer once an item is picked. The site's
              // smooth-scroll click listener handles the actual scroll.
              setOpen(false);
            }}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Desktop / inline sidebar */}
      <nav className="article-toc" aria-label="Table of contents">
        <div className="article-toc-label">// Contents</div>
        {list}
      </nav>

      {/* Mobile floating tab — hidden on desktop via CSS. */}
      <button
        type="button"
        className="article-toc-tab"
        aria-expanded={open}
        aria-controls="article-toc-drawer"
        aria-label={open ? 'Close table of contents' : 'Open table of contents'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="article-toc-tab-icon" aria-hidden="true">
          {/* Three lines = list icon */}
          <span /><span /><span />
        </span>
        <span className="article-toc-tab-text">Contents</span>
      </button>

      {/* Mobile drawer + backdrop */}
      <div
        className={`article-toc-backdrop${open ? ' is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="article-toc-drawer"
        className={`article-toc-drawer${open ? ' is-open' : ''}`}
        aria-hidden={!open}
      >
        <div className="article-toc-drawer-head">
          <div className="article-toc-label">// Contents</div>
          <button
            type="button"
            className="article-toc-drawer-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>
        {list}
      </aside>
    </>
  );
}
