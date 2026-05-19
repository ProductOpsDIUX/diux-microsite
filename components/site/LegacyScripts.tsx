'use client';
import Script from 'next/script';

// Loads the legacy interaction scripts that power chrome, the kinetic
// rotator, scroll effects, dotfield, the loader, etc. Each script attaches
// itself by querying the live DOM, so it just needs to run after hydration.
export function LegacyScripts() {
  return (
    <>
      <Script src="/scripts/chrome.js" strategy="afterInteractive" />
      <Script src="/scripts/smooth.js" strategy="afterInteractive" />
      <Script src="/scripts/praxis.js" strategy="afterInteractive" />
      <Script src="/scripts/tweaks.js" strategy="afterInteractive" />
    </>
  );
}
