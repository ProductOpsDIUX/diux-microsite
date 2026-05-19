import { listPageSeo } from '@/lib/cms/seo';
import { SeoEditorList } from './editor';

export const metadata = { title: 'SEO · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

const KNOWN_PATHS = [
  { path: '/', label: 'Home' },
  { path: '/article', label: 'Articles' },
  { path: '/case-study', label: 'Case studies' },
  { path: '/team', label: 'Team' },
  { path: '/contact', label: 'Contact' },
];

export default async function SeoPage() {
  const rows = await listPageSeo();
  const byPath = new Map(rows.map((r) => [r.path, r]));

  // Make sure every known path renders, even if the row hasn't been created yet.
  const merged = KNOWN_PATHS.map(({ path, label }) => ({
    label,
    seo:
      byPath.get(path) ?? {
        path,
        title: '',
        description: '',
        og_image: null,
        updated_at: new Date(0).toISOString(),
      },
  }));

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// SEO</div>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">SEO meta</h1>
        <p className="mt-2 text-[14px] text-fg2 max-w-prose">
          Title, description, and OG image per public page. Saved values feed
          <code className="mx-1 text-fg1">generateMetadata()</code> on the matching route.
        </p>
      </header>

      <SeoEditorList items={merged} />
    </div>
  );
}
