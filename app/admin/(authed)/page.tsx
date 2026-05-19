import Link from 'next/link';
import { getPublicClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getCounts() {
  try {
    const sb = getPublicClient();
    const [cs, art, pub, team] = await Promise.all([
      sb.from('case_studies').select('*', { count: 'exact', head: true }),
      sb.from('articles').select('*', { count: 'exact', head: true }),
      sb.from('articles').select('*', { count: 'exact', head: true }).eq('is_published', true),
      sb.from('team_members').select('*', { count: 'exact', head: true }),
    ]);
    return {
      caseStudies: cs.count ?? 0,
      articles: art.count ?? 0,
      articlesPublished: pub.count ?? 0,
      team: team.count ?? 0,
    };
  } catch (e) {
    console.error('admin counts fetch skipped', e);
    return { caseStudies: 0, articles: 0, articlesPublished: 0, team: 0 };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const tiles = [
    { href: '/admin/home', label: 'Home page', desc: 'Edit hero, pillars, mission, stats', stat: 'Singleton' },
    { href: '/admin/case-studies', label: 'Case studies', desc: 'Manage selected work', stat: `${counts.caseStudies} total` },
    { href: '/admin/articles', label: 'Articles', desc: 'Blog posts with drafts', stat: `${counts.articlesPublished} live · ${counts.articles - counts.articlesPublished} draft` },
    { href: '/admin/team', label: 'Team', desc: 'Names, roles, photos', stat: `${counts.team} members` },
    { href: '/admin/seo', label: 'SEO', desc: 'Per-page title, description, OG image', stat: '5 pages' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// Dashboard</div>
        <h1 className="font-display text-[34px] font-semibold text-fg0 mt-1">Welcome back.</h1>
        <p className="mt-2 text-[14px] text-fg2 max-w-prose">
          Update any section below. Changes go live the moment you save — the live site is revalidated automatically.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="block rounded-lg border border-line bg-bg1/40 p-5 hover:bg-bg1 hover:border-fg2 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-[18px] font-semibold text-fg0">{t.label}</div>
                <div className="text-[13px] text-fg2 mt-1">{t.desc}</div>
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.1em] text-fg2 whitespace-nowrap">
                {t.stat}
              </div>
            </div>
            <div className="mt-4 text-[12px] text-accent">Open editor →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
