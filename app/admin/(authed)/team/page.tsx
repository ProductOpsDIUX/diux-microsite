import Link from 'next/link';
import { listTeam } from '@/lib/cms/team';
import { CollectionHeader, EmptyState } from '@/components/admin/CollectionHeader';

export const metadata = { title: 'Team · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function TeamListPage() {
  const members = await listTeam();

  return (
    <div className="space-y-8">
      <CollectionHeader
        eyebrow="// Team"
        title="Team"
        description="People who appear on /team."
        newHref="/admin/team/new"
        newLabel="New member"
      />

      {members.length === 0 ? (
        <EmptyState
          label="No team members yet"
          newHref="/admin/team/new"
          newLabel="New member"
        />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/team/${m.id}`}
                className="flex items-center gap-4 p-4 rounded-lg border border-line bg-bg1/40 hover:bg-bg1 hover:border-fg2 transition-colors"
              >
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border border-line shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-bg2 border border-line shrink-0 grid place-items-center text-fg2 text-[20px]">
                    {(m.name || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[16px] font-medium text-fg0 truncate">
                    {m.name || '(unnamed)'}
                  </div>
                  <div className="text-[12px] text-fg2 truncate">{m.role}</div>
                </div>
                <div className="text-[11px] font-mono text-fg2">pos {m.position}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
