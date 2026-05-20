'use client';

import { useEffect } from 'react';

/**
 * Scroll-driven theme switching for the home page.
 * Watches sentinels around the light-mode zone and toggles
 * `data-theme` on <html> so nav + body transition together.
 *
 * Sentinels: `<div data-scroll-theme="enter-light">` and
 * `<div data-scroll-theme="leave-light">`. Place them at the
 * top and bottom of the section block that should render light.
 */
export function ScrollTheme() {
  useEffect(() => {
    const html = document.documentElement;
    const enter = document.querySelector<HTMLElement>('[data-scroll-theme="enter-light"]');
    const leave = document.querySelector<HTMLElement>('[data-scroll-theme="leave-light"]');
    if (!enter || !leave) return;

    // Remember the user's manual choice so we restore it after the light zone.
    const userTheme = html.getAttribute('data-theme') || 'dark';
    let inLightZone = false;

    const update = () => {
      const enterTop = enter.getBoundingClientRect().top;
      const leaveTop = leave.getBoundingClientRect().top;
      const midpoint = window.innerHeight * 0.45;
      const shouldBeLight = enterTop < midpoint && leaveTop > midpoint;
      if (shouldBeLight === inLightZone) return;
      inLightZone = shouldBeLight;
      html.setAttribute('data-theme', shouldBeLight ? 'light' : userTheme);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      html.setAttribute('data-theme', userTheme);
    };
  }, []);

  return null;
}
