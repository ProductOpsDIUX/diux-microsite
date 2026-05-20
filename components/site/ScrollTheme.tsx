'use client';

import { useEffect } from 'react';

/**
 * Scroll-driven theme switching for the home page.
 * Watches two sentinel divs (`enter-light`, `leave-light`) and toggles
 * `data-theme` on <html> so nav + body transition together.
 *
 * The site no longer has a manual theme toggle — dark is the baseline,
 * and this component flips to light only while the user is between the
 * two sentinels.
 */
export function ScrollTheme() {
  useEffect(() => {
    const html = document.documentElement;
    const enter = document.querySelector<HTMLElement>('[data-scroll-theme="enter-light"]');
    const leave = document.querySelector<HTMLElement>('[data-scroll-theme="leave-light"]');
    if (!enter || !leave) return;

    let inLightZone = false;
    const update = () => {
      const enterTop = enter.getBoundingClientRect().top;
      const leaveTop = leave.getBoundingClientRect().top;
      const midpoint = window.innerHeight * 0.45;
      const shouldBeLight = enterTop < midpoint && leaveTop > midpoint;
      if (shouldBeLight === inLightZone) return;
      inLightZone = shouldBeLight;
      html.setAttribute('data-theme', shouldBeLight ? 'light' : 'dark');
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      html.setAttribute('data-theme', 'dark');
    };
  }, []);

  return null;
}
