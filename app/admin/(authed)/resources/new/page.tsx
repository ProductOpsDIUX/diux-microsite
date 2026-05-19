import Link from 'next/link';
import { ResourceEditor } from '../editor';

export const metadata = { title: 'New resource · DI & UX CMS', robots: { index: false } };

export default function NewResourcePage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// Resources</div>
        <Link href="/admin/resources" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All resources
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">New resource</h1>
      </header>
      <ResourceEditor initial={null} />
    </div>
  );
}
