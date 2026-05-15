# Handoff: DI & UX — Defence Tech Design Innovation & UX Microsite

## Overview

A high-fidelity microsite for an internal Defence Tech Design Innovation & UX practice ("DI & UX"). The site positions the team as a thought leader in defence technology, AI-enabled workflows, UX strategy, and digital transformation, and is structured around five CMS-driven content types: case studies, articles, team members, publications, and events.

Inspired in tone and layout by `microsoft.design` and `design.google`, with editorial typography, HUD/operator-grade chrome details, and an accent-led dark theme.

## About the Design Files

The files in this bundle are **design references created in HTML** — interactive prototypes showing the intended look, layout, copy, and behaviour. They are **not production code to ship as-is.**

The task is to **recreate these designs in the target codebase's existing environment** (likely a Webflow project per the brief, or a React/Next.js/Vue stack with a headless CMS) using its established components, design tokens, and patterns. If no environment exists yet, the recommended stack is:

- **Webflow** if direct CMS authoring + visual control is the priority (matches the brief).
- **Next.js + a headless CMS** (Sanity, Contentful, or Payload) for engineering teams who want full control. Use the design tokens in `styles/tokens.css` as the foundation of a token system; map each section to a CMS Collection (see the `data-cms` attributes throughout the HTML — they document the intended schema).

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, interactions, and motion are all defined. Recreate pixel-perfectly. Where a real codebase already has equivalent primitives (button, card, nav, search overlay), prefer the codebase's components, but match the visual specification documented below.

## CMS schema (read this first)

Every CMS-bound element in the HTML carries a `data-cms="cms.<kind>/<name>"` attribute, e.g. `data-cms="cms.collection/case-study"`. Toggle the **CMS markers** switch in the Tweaks panel to see them rendered inline. These attributes are the source of truth for the schema below.

### Collections

| Collection | Used on | Fields |
|---|---|---|
| `case-study` | Homepage grid, case-study detail | title, slug, tags[], year, client, discipline[], team-size, status, summary, cover (image or video), hero-media, overview-lead, outcome-pull, recognition, sections[ {kind:research\|design\|outcome, eyebrow, h2, body, gallery[]} ], related[] (refs to case-study) |
| `article` | Homepage grid, article detail, related | title, slug, tag (primary, used in filter), tags[], deck, body (rich), cover-media, author (ref→team-member), co-authors[], published-at, read-time, related[] |
| `team-member` | Homepage strip, team detail, related | name, slug, role, bio (rich), portrait, based, joined-at, disciplines[], clearance, speaking[], contact, work[] (refs to case-study), writing[] (refs to article) |
| `publication` | Homepage list | number, title, format ("PDF · 84 pages"), year, file/url |
| `event` | Homepage events strip | name, date-range, location, summary, cta-label, cta-url |
| `capability` | Homepage pillars | number, eyebrow ("01 / UX"), title, body, team-size, link |

### Filters

- Case studies filter by tag: `cmd`, `ai`, `ops`, `intel`, `field` (plus `all`)
- Articles filter by tag: `ai`, `ux`, `research`, `systems`, `strategy` (plus `all`)

The filter UI is a chip row above each grid; chips toggle `aria-pressed` and hide/show items whose `data-tags` list doesn't include the active tag. Implement as a client-side query param or CMS filter binding.

## Pages

### 1. Homepage — `index.html`

| # | Section | Notes |
|---|---|---|
| 1 | **Hero** | Three switchable variants (Tweaks panel): `kinetic` (rotating italic word), `radar` (animated sweeping SVG radar), `dotfield` (canvas dot grid that reacts to the cursor). Always shows the rotator H1 + sub + CTA pair. Meta strip top-left/right, foot strip with location + scroll indicator. |
| 2 | **Stat band** | 4 stats with counter animation triggered on scroll into view. Sits on `var(--bg-1)`. |
| 3 | **Capabilities** | 4-column pillar grid (`cms.collection/capability`). Each card: number, title, body, team-size foot. |
| 4 | **Work / Case studies** | `bg-1` background. Filter chips → grid of 5 case studies (asymmetric 12-col grid: spans of 7/5, 4/4/4, etc.). Each card: media placeholder, meta row, h3, summary. |
| 5 | **Thinking / Articles** | Filter chips → 3-column grid of 9 articles. Cards: media, tag · read-time, h3, body, "Read →" footer. |
| 6 | **Team strip** | 6-card grid (3:4 portraits with initials). `bg-1`. |
| 7 | **Publications** | Vertical list with hover slide-in padding. |
| 8 | **Events** | 3-card grid for upcoming events/hackathons. |
| 9 | **CTA band** | "Have a hard problem worth designing for?" + brief + careers email. `bg-1`. |
| 10 | **Footer** | 5-column grid: brand + 4 link columns, fine-print row, giant wordmark. |

### 2. Article detail — `article.html`

Detail-hero (crumbs, eyebrow, h1, deck, meta row: author, co-author, published, read-time, topic) → wide cover media → centered article body (max 720px) with `.lead` paragraph, h2 sections, blockquote with attribution, bulleted shifts, inline figure with caption, "Continue reading" callout. Related articles grid (3 cards) at bottom.

### 3. Case study detail — `case-study.html`

Detail-hero (crumbs, eyebrow, h1, meta: client/year/discipline/team/status) → full-bleed cover → overview split (lead | outcome stack) → numbered sections: **01 The brief** (two-col), **02 Research** (two-col + 3-image gallery), pull-quote band, **03 Design** (two-col + 5-image gallery), **04 Outcome** (4 stat tiles). Related case studies grid.

### 4. Team profile — `team.html`

Detail-hero (crumbs, eyebrow, h1) → 5/7 split: portrait | bio. Bio: 3 large display paragraphs, meta grid (based, joined, disciplines, clearance, speaking, contact), CTAs (Brief them, LinkedIn). "Selected projects" case study grid. "Recent writing" article grid. "Other Praxians" team strip.

## Shared chrome

### Nav (`scripts/chrome.js` → `NAV_HTML`)

Fixed top, 64px, backdrop-blur. Grid: brand | links (centered) | actions.

- **Brand**: SVG mark (rotated square + diamond + center dot in accent) + text "DI & UX".
- **Primary links**: Work, Thinking, Team (each opens a mega-menu on hover/focus); Capabilities, Events (anchor links).
- **Actions**: theme toggle (sun/moon, animated crossfade), search trigger (rounded pill with ⌘K kbd badge), primary "Brief us →" button. Mobile shows a hamburger that drops a panel of links.

### Mega-menu

Fixed, top:64px, full-width, bg-1. Two-column: left = display-text section header, right = grid of items (title + description) that get a hover left-padding shift. One panel per link, opens on `mouseenter` + `focus`, closes on `mouseleave` (160ms delay), Escape, or clicking another trigger.

### Search overlay (⌘K / Cmd+K)

Full-screen blurred backdrop, centered panel. Display-serif input at 28px. Results grouped by type (Article / Case study / Team / Page) with type-letter icon, title, meta, arrow. ↑↓ navigates, Enter follows the link, Escape closes. Index is hard-coded in `scripts/praxis.js` → `SEARCH_INDEX`; replace with a real index (Algolia, Pagefind, or CMS-driven JSON).

### Footer

5-col grid: brand+blurb+social chips | Practice | Thinking | Team | Operations. Below: fine-print row with copyright + version+deploy stamp. Below that: giant wordmark "DI & UX" at clamp(72px, 14vw, 220px) — fills the viewport width.

## Design Tokens (from `styles/tokens.css`)

### Color — dark (default)

| Token | Value | Use |
|---|---|---|
| `--bg-0` | `#07080a` | Page bg |
| `--bg-1` | `#0c0e12` | Section bg (alternating sections, footer, cards) |
| `--bg-2` | `#12151b` | Media placeholders, search panel |
| `--bg-3` | `#1a1e26` | Elevated chips/buttons |
| `--line` | `rgba(255,255,255,0.08)` | Hairlines |
| `--line-strong` | `rgba(255,255,255,0.16)` | Borders, button outlines |
| `--fg-0` | `#f4f5f7` | Primary text |
| `--fg-1` | `#c8ccd4` | Body text |
| `--fg-2` | `#8a909c` | Meta text, mono labels |
| `--fg-3` | `#5a606b` | Decorative dividers |
| `--accent` | `#7CFFB2` | Signal green (default accent) |
| `--accent-ink` | `#042414` | Text on accent fills |
| `--warn` | `#FFB547` | – |
| `--danger` | `#FF6A3D` | – |
| `--info` | `#4D8DFF` | – |

### Color — light (`[data-theme="light"]`)

| Token | Value |
|---|---|
| `--bg-0` | `#f6f5f1` |
| `--bg-1` | `#efede7` |
| `--bg-2` | `#e6e3da` |
| `--bg-3` | `#d9d6cb` |
| `--line` | `rgba(10,10,12,0.10)` |
| `--line-strong` | `rgba(10,10,12,0.22)` |
| `--fg-0` | `#0b0c0f` |
| `--fg-1` | `#2a2d33` |
| `--fg-2` | `#5d6068` |
| `--fg-3` | `#8a8d95` |

### Type

| Family | CSS var | Use |
|---|---|---|
| Instrument Serif (400/400i) | `--font-display` | All h1/h2/h3, stats, blockquotes |
| Inter (400/500/600) | `--font-sans` | Body, UI |
| JetBrains Mono (400/500) | `--font-mono` | Eyebrows, meta, kbd, labels |

Alternate pairings exposed via Tweaks: Swiss (Inter Tight), Technical (JetBrains Mono display), Classic (Fraunces).

### Type scale (fluid)

| Var | Value |
|---|---|
| `--t-mono` | 11px |
| `--t-mono-lg` | 13px |
| `--t-body` | 16px |
| `--t-body-lg` | 18px |
| `--t-h6` | 20px |
| `--t-h5` | 24px |
| `--t-h4` | `clamp(28px, 2.4vw, 36px)` |
| `--t-h3` | `clamp(36px, 3.4vw, 56px)` |
| `--t-h2` | `clamp(48px, 5vw, 84px)` |
| `--t-h1` | `clamp(64px, 8vw, 144px)` |

Display headings use `line-height: 0.95`, `letter-spacing: -0.025em`. The italic accent in headings is wrapped in `<span class="serif-italic">…</span>` or `<span class="em">…</span>` (em is italic + accent color).

### Spacing scale

`--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128

- `--section-py: clamp(64px, 9vw, 128px)` — vertical padding of every `.section`
- `--gutter: clamp(20px, 4vw, 48px)` — horizontal page gutter
- `--maxw: 1440px` — content max-width

### Radius

`--r-1` 2px · `--r-2` 4px · `--r-3` 8px (cards) · `--r-4` 12px (panels)

### Motion

| Var | Value |
|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-snap` | `cubic-bezier(0.5, 0, 0.1, 1)` |
| `--t-fast` | 180ms |
| `--t-med` | 360ms |
| `--t-slow` | 720ms |

Multiplied by `--motion-mult` (Tweaks). Respect `prefers-reduced-motion`: reveals are disabled in CSS.

## Interactions & behavior

| Behavior | Where | How |
|---|---|---|
| Scroll-triggered reveals | All `.reveal` elements | IntersectionObserver, threshold 0.12, root margin -8%; adds `.in` once, stagger by 60ms × (index % 6) |
| Animated nav with mega-menu | Top nav | Hover/focus opens panel; 160ms hide delay on leave; Escape closes |
| ⌘K global search | Anywhere | Cmd/Ctrl+K toggles overlay; ↑↓ to navigate, Enter to follow, Esc to close |
| Tag filtering | Case study + article grids | Chip click sets `aria-pressed`, filters by `data-tags` |
| Stat counter | Stat band | IntersectionObserver triggers a 1400ms ease-out count to `data-count` value |
| Hero kinetic rotator | `[data-rotator]` | Rotates words every 2400ms with 600ms snap easing on Y-transform; container height 1.15em to allow italic ascenders/descenders |
| Hero radar variant | `.radar-sweep` | CSS keyframe `sweep` — 6s linear rotate |
| Hero dot field variant | `[data-dotfield]` | Canvas grid; dots displace away from cursor within 140px radius |
| Custom cursor | All pages | Two elements (`.cursor-dot`, `.cursor-ring`) follow pointer with lerp; ring scales up on hover targets; `mix-blend-mode: difference` |
| Hover preview cards | Case study cards | `.preview-overlay` fades in (180ms) with "Open case study →" label |
| Theme toggle | Nav | Sun/moon crossfade (180ms opacity, 360ms rotate+scale); persists in `localStorage` |
| Tweaks panel | Toolbar edit-mode | Toggle with edit-mode protocol — see "Tweaks" below |

## Tweaks panel (developer/design tool — usually omit in production)

A floating control panel (bottom-right) that lets the designer toggle: theme (dark/light), accent color (6 swatches), hero variant (kinetic/radar/dotfield), density (compact/balanced/spacious), font pairing (editorial/swiss/technical/classic), motion intensity (0–2×), grid overlay on/off, CMS scaffolding markers on/off. State persists in `localStorage` under `praxis.tweaks.v1` and survives across pages.

**Drop this from production.** It's useful for stakeholder review only.

## Files

```
design_handoff_diux_microsite/
├── README.md                   (this file)
├── index.html                  (homepage)
├── article.html                (article detail template)
├── case-study.html             (case study detail template)
├── team.html                   (team member detail template)
├── styles/
│   ├── tokens.css              (design tokens, reset, primitives, nav, mega-menu, search, footer)
│   └── pages.css               (section layouts: hero, stats, pillars, grids, detail templates)
└── scripts/
    ├── chrome.js               (renders shared nav, mega-menu, search overlay, footer)
    ├── praxis.js               (all interactions: reveals, search, filters, counters, hero, cursor, theme)
    └── tweaks.js               (Tweaks panel — drop in production)
```

## Assets

All imagery is **placeholders** — diagonal-hatch boxes with mono labels like `[ MISSION_COMPOSE_HERO.MP4 ]` (see `.media` styles in `pages.css`). Replace with real assets:

- **Case studies**: cover hero (16:9 video or image), 5–8 supporting screenshots/photos per case.
- **Articles**: 21:9 cover, 1–2 inline figures per article.
- **Team portraits**: 3:4 ratio. Currently rendered as monogram initials over diagonal-hatch.
- **Brand mark**: SVG, inline in `chrome.js`. Replace with the real DI & UX mark.
- **Footer wordmark**: text-rendered, no asset needed.

No icon system is in use — a handful of inline SVGs (search, brand, theme sun/moon) live in `chrome.js`. If the target codebase has a Lucide/Phosphor/custom icon set, swap to that.

## Copy

All copy in the prototype is realistic but original — written for an internal defence-tech design team. Treat it as **starter content**, not final. The CMS-driven sections (case studies, articles, team, publications, events) should be authored in the CMS; everything else (hero, capability pillars, CTA, footer link labels) is page content the developer should expose as editable fields.

## Notes & open questions for the implementer

1. **No icons in cards.** Per the brief's anti-slop guidance, case study and article cards intentionally avoid icon decoration. Don't add them.
2. **Hero variant.** The default is `kinetic`. The radar and dotfield variants are intentionally available — pick one for production and remove the others, or keep all three as a CMS-selected hero treatment.
3. **Custom cursor.** Disabled on touch devices via `@media (hover: none)`. Some users find it annoying — consider making it opt-in or removing for production.
4. **Search.** The current index is a hard-coded array. Wire to the CMS at build time (Pagefind for static, or a search endpoint).
5. **Accessibility.** All interactive elements are keyboard-reachable. Mega-menu uses `aria-expanded`. Reveals respect `prefers-reduced-motion`. Run an axe pass after porting.
6. **Responsive.** Breakpoints at 1080px (collapses to 2-col grids + mobile nav) and 640px (1-col + stacked stats). Test on real devices.

## Contact

Designed by Claude for the DI & UX team. Questions → bounce them back through the same channel.
