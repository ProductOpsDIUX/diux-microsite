// Server-rendered style override that sets the page-level background for
// the article and case-study routes. Each page that wants a different
// background renders one of these — full-page reloads (we use plain
// <a href> across the public site) mean the override naturally clears
// when the visitor navigates to a page that doesn't include it.
export function PageBackground({ color }: { color: string }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `body { background-color: ${color}; }`,
      }}
    />
  );
}
