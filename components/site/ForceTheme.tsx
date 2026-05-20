'use client';

import { useEffect } from 'react';

export function ForceTheme({ theme }: { theme: 'light' | 'dark' }) {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute('data-theme');
    html.setAttribute('data-theme', theme);
    return () => {
      html.setAttribute('data-theme', prev ?? 'dark');
    };
  }, [theme]);

  return null;
}
