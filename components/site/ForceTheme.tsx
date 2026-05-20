// Server-rendered inline script that sets `data-theme` on <html> before
// the page paints. Runs synchronously during HTML parse so there's no
// flash of the wrong theme. Full-page navigation (the site uses plain
// <a href>) means the attribute is set fresh on every load.
export function ForceTheme({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute('data-theme','${theme}');`,
      }}
    />
  );
}
