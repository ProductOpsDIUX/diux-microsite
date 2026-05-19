'use client';
import Script from 'next/script';

// Loads the legacy interaction scripts that power chrome, the kinetic
// rotator, scroll effects, dotfield, the loader, etc. Each script attaches
// itself by querying the live DOM, so it just needs to run after hydration.
//
// Lenis loads first so /scripts/smooth.js (which depends on window.Lenis)
// can attach the smooth-wheel scroll for the whole site. beforeInteractive
// keeps it out of the critical path without delaying our own scripts.
export function LegacyScripts() {
  return (
    <>
      <Script
        src="https://unpkg.com/lenis@1.1.20/dist/lenis.min.js"
        strategy="afterInteractive"
      />
      <Script src="/scripts/chrome.js" strategy="afterInteractive" />
      <Script src="/scripts/smooth.js" strategy="afterInteractive" />
      <Script src="/scripts/praxis.js" strategy="afterInteractive" />
      <Script src="/scripts/tweaks.js" strategy="afterInteractive" />
    </>
  );
}
