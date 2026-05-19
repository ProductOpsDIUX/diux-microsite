import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/cms/articles';
import { ArticleEditor } from '../editor';

export const metadata = { title: 'Edit article · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
          // Articles
        </div>
        <Link href="/admin/articles" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All articles
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">
          {article.title || '(untitled)'}
        </h1>
      </header>
      <ArticleEditor initial={article} />
    </div>
  );
}
