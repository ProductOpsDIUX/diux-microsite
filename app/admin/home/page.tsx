import { getHomeContent } from '@/lib/cms/home';
import { HomeEditor } from './editor';

export const metadata = { title: 'Home page · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminHomePage() {
  const content = await getHomeContent();
  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
            // Home page
          </div>
          <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">
            Edit landing page
          </h1>
          <p className="mt-2 text-[14px] text-fg2 max-w-prose">
            Update the hero, pillars, mission, and stats. Changes go live the moment you save.
          </p>
        </div>
      </header>
      <HomeEditor initial={content} />
    </div>
  );
}
