import Link from 'next/link';
import { HiringRoleEditor } from '../editor';

export const metadata = { title: 'New role · DI & UX CMS', robots: { index: false } };

export default function NewHiringRolePage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// Hiring</div>
        <Link href="/admin/hiring" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All roles
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">New role</h1>
      </header>
      <HiringRoleEditor initial={null} />
    </div>
  );
}
