import Link from 'next/link';
import { CaseStudyEditor } from '../editor';

export const metadata = { title: 'New case study · DI & UX CMS', robots: { index: false } };

export default function NewCaseStudyPage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">
          // Case studies
        </div>
        <Link href="/admin/case-studies" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All case studies
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">New case study</h1>
      </header>
      <CaseStudyEditor initial={null} />
    </div>
  );
}
