// Parses a body_html string from the Tiptap editor and:
//   1. Finds every <h2> / <h3> / <h4>
//   2. Injects an id="…" attribute so they're anchorable
//   3. Returns a flat list of headings the TOC component can render
//
// Tiptap's StarterKit output is well-formed, no script tags allowed by the
// extension schema — so a regex pass is enough; we don't pull in a full DOM
// parser on the server.

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')   // strip inline tags inside the heading
    .replace(/&[a-z0-9#]+;/g, '') // strip HTML entities
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'section';
}

const HEADING_RE = /<h([234])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi;

export function buildToc(html: string): { html: string; headings: TocHeading[] } {
  if (!html) return { html: '', headings: [] };

  const headings: TocHeading[] = [];
  const used = new Set<string>();

  const nextHtml = html.replace(HEADING_RE, (_match, levelStr, existingAttrs = '', inner) => {
    const level = Number(levelStr) as 2 | 3 | 4;
    const textOnly = String(inner).replace(/<[^>]+>/g, '').trim();
    if (!textOnly) return _match;

    // Reuse an existing id if the editor already set one; otherwise slugify.
    const existingId = /\bid\s*=\s*"([^"]+)"/i.exec(existingAttrs || '')?.[1];
    let id = existingId || slugify(textOnly);
    // De-dupe duplicates with a numeric suffix.
    let suffix = 2;
    while (used.has(id)) id = `${slugify(textOnly)}-${suffix++}`;
    used.add(id);

    headings.push({ id, text: textOnly, level });

    // Rebuild the opening tag with the id attribute. Drop any existing id
    // (we already accounted for it above) but preserve other attrs.
    const attrs = (existingAttrs || '').replace(/\sid\s*=\s*"[^"]*"/i, '').trim();
    const openTag = `<h${level} id="${id}"${attrs ? ' ' + attrs : ''}>`;
    return `${openTag}${inner}</h${level}>`;
  });

  return { html: nextHtml, headings };
}
