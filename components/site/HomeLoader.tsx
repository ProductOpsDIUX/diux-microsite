'use client';

import { useEffect, useState } from 'react';

const DURATION_MS = 3000;
const EXIT_MS = 600;

export function HomeLoader() {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

  useEffect(() => {
    document.documentElement.classList.add('home-loader-active');
    const t1 = setTimeout(() => setPhase('out'), DURATION_MS);
    const t2 = setTimeout(() => {
      setPhase('gone');
      document.documentElement.classList.remove('home-loader-active');
    }, DURATION_MS + EXIT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.classList.remove('home-loader-active');
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div className={`home-loader${phase === 'out' ? ' is-out' : ''}`} aria-hidden="true">
      <svg className="home-loader-mark" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path className="hl-tl" d="M0,0 A100,100 0 0 1 100,100 L0,100 Z" fill="#f4f5f7" />
        <path className="hl-bl" d="M0,100 L100,100 A100,100 0 0 1 0,200 Z" fill="#f4f5f7" />
        <rect className="hl-br" x="100" y="100" width="100" height="100" fill="#f4f5f7" />
        <rect className="hl-tr" x="100" y="0" width="100" height="100" fill="#E63946" />
      </svg>
    </div>
  );
}
