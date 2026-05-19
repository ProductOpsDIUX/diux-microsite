import Link from 'next/link';
import { listTeam } from '@/lib/cms/team';
import { CollectionHeader, EmptyState } from '@/components/admin/CollectionHeader';
import type { TeamMember } from '@/lib/supabase/types';

export const metadata = { title: 'Team · DI & UX CMS', robots: { index: false } };
export const dynamic = 'force-dynamic';

function TeamRow({ m }: { m: TeamMember }) {
  return (
    <li>
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
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-medium text-fg0 truncate">
              {m.name || '(unnamed)'}
            </span>
            {m.is_leadership && (
              <span className="shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                Leadership
              </span>
            )}
          </div>
          <div className="text-[12px] text-fg2 truncate">{m.role}</div>
        </div>
        <div className="text-[11px] font-mono text-fg2">pos {m.position}</div>
      </Link>
    </li>
  );
}

export default async function TeamListPage() {
  const members = await listTeam();

  // Leadership keeps its position-based ordering (set by the editor); the
  // larger on-the-ground group is shown alphabetically so the client can
  // find a name fast.
  const leadership = members
    .filter((m) => m.is_leadership)
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  const others = members
    .filter((m) => !m.is_leadership)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8">
      <CollectionHeader
        eyebrow="// Team"
        title="Team"
        description="People who appear on /team. Toggle a member's “Leadership” flag in their editor to group them here and on the public site."
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
        <div className="space-y-8">
          <section>
            <h2 className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-3">
              // Leadership {leadership.length > 0 && <span>· {leadership.length}</span>}
            </h2>
            {leadership.length === 0 ? (
              <div className="text-[13px] text-fg2 italic px-1">
                No leadership members yet — toggle “Show under Leadership” on any
                member's editor to add them here.
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leadership.map((m) => (
                  <TeamRow key={m.id} m={m} />
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-3">
              // On the ground {others.length > 0 && <span>· {others.length}</span>}
            </h2>
            {others.length === 0 ? (
              <div className="text-[13px] text-fg2 italic px-1">
                No on-the-ground members yet.
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {others.map((m) => (
                  <TeamRow key={m.id} m={m} />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
