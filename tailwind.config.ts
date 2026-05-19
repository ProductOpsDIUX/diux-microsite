import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: {
    // The legacy design system at /styles already provides resets and base
    // typography. Disable Tailwind preflight so it doesn't clobber them.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Mirror tokens.css so admin UI feels native to the site
        bg0: 'var(--bg-0)',
        bg1: 'var(--bg-1)',
        bg2: 'var(--bg-2)',
        fg0: 'var(--fg-0)',
        fg1: 'var(--fg-1)',
        fg2: 'var(--fg-2)',
        line: 'var(--line)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
