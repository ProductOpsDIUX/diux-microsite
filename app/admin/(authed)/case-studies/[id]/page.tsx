import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCaseStudy } from '@/lib/cms/case-studies';
import { CaseStudyEditor } from '../editor';

export const metadata = { title: 'Edit case study · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getCaseStudy(id);
  if (!item) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
          // Case studies
        </div>
        <Link href="/admin/case-studies" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All case studies
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">
          {item.title || '(untitled)'}
        </h1>
      </header>
      <CaseStudyEditor initial={item} />
    </div>
  );
}
