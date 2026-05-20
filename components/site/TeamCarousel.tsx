'use client';

import type { TeamMember } from '@/lib/supabase/types';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export function TeamCarousel({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;
  // Duplicate the list once so the marquee loop is seamless.
  const loop = [...members, ...members];
  return (
    <div className="team-marquee" data-team-marquee>
      <div
        className="team-marquee-track"
        style={{ ['--team-marquee-count' as string]: members.length }}
      >
        {loop.map((m, i) => (
          <a key={`${m.id}-${i}`} className="team-marquee-card" href="/team">
            <div className="portrait">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} />
              ) : (
                <span className="initials">{initials(m.name)}</span>
              )}
            </div>
            <div className="info">
              <div className="name">{m.name}</div>
              <div className="role">{m.role}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
