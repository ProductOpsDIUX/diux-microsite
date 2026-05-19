import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTeamMember } from '@/lib/cms/team';
import { TeamMemberEditor } from '../editor';

export const metadata = { title: 'Edit member · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getTeamMember(id);
  if (!member) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// Team</div>
        <Link href="/admin/team" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All members
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">
          {member.name || '(unnamed)'}
        </h1>
      </header>
      <TeamMemberEditor initial={member} />
    </div>
  );
}
