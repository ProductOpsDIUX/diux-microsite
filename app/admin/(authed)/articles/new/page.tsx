import Link from 'next/link';
import { ArticleEditor } from '../editor';

export const metadata = { title: 'New article · DI & UX CMS', robots: { index: false } };

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
          // Articles
        </div>
        <Link href="/admin/articles" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All articles
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">New article</h1>
      </header>
      <ArticleEditor initial={null} />
    </div>
  );
}
