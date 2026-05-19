import Link from 'next/link';
import { TeamMemberEditor } from '../editor';

export const metadata = { title: 'New team member · DI & UX CMS', robots: { index: false } };

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// Team</div>
        <Link href="/admin/team" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All members
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">New member</h1>
      </header>
      <TeamMemberEditor initial={null} />
    </div>
  );
}
