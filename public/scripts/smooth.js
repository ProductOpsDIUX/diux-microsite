/* Lenis smooth-scroll — valiente-style lag */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.Lenis) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new window.Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Offset for the fixed top nav (64px) plus a little visual breathing room.
  // Lenis doesn't read CSS scroll-margin-top, so we apply the offset here.
  const NAV_OFFSET = -96;

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: NAV_OFFSET });
  });

  window.__lenis = lenis;
})();
