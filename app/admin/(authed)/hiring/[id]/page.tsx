import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHiringRole } from '@/lib/cms/hiring';
import { HiringRoleEditor } from '../editor';

export const metadata = { title: 'Edit role · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function EditHiringRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await getHiringRole(id);
  if (!r) notFound();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2">// Hiring</div>
        <Link href="/admin/hiring" className="text-[12px] text-accent hover:underline mt-1 inline-block">
          ← All roles
        </Link>
        <h1 className="font-display text-[30px] font-semibold text-fg0 mt-1">{r.title}</h1>
      </header>
      <HiringRoleEditor initial={r} />
    </div>
  );
}
