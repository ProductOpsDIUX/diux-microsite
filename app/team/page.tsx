import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { listTeam } from '@/lib/cms/team';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { LinkedInIcon } from '@/components/site/LinkedInIcon';
import {
  VerticalTimeline,
  type VerticalMilestone,
} from '@/components/site/VerticalTimeline';
import type { TeamMember } from '@/lib/supabase/types';

const ORIGINS: VerticalMilestone[] = [
  {
    year: '2018',
    title: 'Develop new capabilities',
    body:
      'Conducted DI training for 50 HCDs and 100 staff via DI boot camp. Applied DI across 11 capability areas with 30+ new initiatives.',
  },
  {
    year: '2019 — 2020',
    ghostYear: '2019',
    title: 'Transform enterprise',
    body:
      'Enhanced DI methodology for enterprise-level impact. Partnered SAF users to co-design new concepts for Army, Air Force and Navy.',
  },
  {
    year: '2021 — 2022',
    ghostYear: '2021',
    title: 'DI & UX is born',
    body:
      'We used to be spread across different PCs such as C3D, CIO, EDS, and Digital Hub, before coming together under Digital Hub as one central DI & UX cluster.',
  },
  {
    year: '2023 — 2024',
    ghostYear: '2023',
    title: 'Expand reach & influence',
    body:
      'Not only did we support SAF projects and DSTA initiatives, but also expanded into MINDEF projects, shaped the DSTA Employee Experience, and collaborated with external parties in MINDEF/SAF and the industry.',
  },
  {
    year: '2025',
    title: 'Scale data-driven UX',
    body:
      'Our 3 chapters (Command Centre Experience, DSTA Experience and Enterprise Experience) covered 8 portfolios, 16 programmes, and 50+ projects/tracks.',
  },
];

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/team');
  return {
    title: seo?.title || 'Team · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function MemberCard({ m }: { m: TeamMember }) {
  return (
    <div className="team-card reveal">
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
        {m.bio && (
          <p style={{ marginTop: 12, color: 'var(--fg-2)', fontSize: 14 }}>{m.bio}</p>
        )}
      </div>
      {m.linkedin_url && (
        <a
          className="team-card-linkedin"
          href={m.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${m.name} on LinkedIn`}
        >
          <LinkedInIcon />
        </a>
      )}
    </div>
  );
}

export default async function TeamPage() {
  const members = await listTeam();
  const leadership = members.filter((m) => m.is_leadership);
  const others = members.filter((m) => !m.is_leadership);

  return (
    <>
      <div data-praxis-chrome="nav"></div>

      <section className="section" style={{ paddingTop: '18vh', paddingBottom: '4vh' }}>
        <div className="wrap">
          <div className="section-head reveal" style={{ borderBottom: 0, paddingBottom: 0, marginBottom: 24 }}>
            <div>
              <div className="eyebrow">// Team</div>
              <h2>
                A design team built around<br />
                <span className="serif-italic">people, not interfaces.</span>
              </h2>
            </div>
          </div>
          <p className="hero-sub reveal" style={{ maxWidth: '70ch' }}>
            We&rsquo;re product designers and strategists building insight dashboards,
            scenario planners, decision-support tools, and analytics systems that help
            defence and enterprise teams think faster and operate better.
          </p>
        </div>
      </section>

      <VerticalTimeline label="ORIGINS OF DI &amp; UX" items={ORIGINS} />

      {leadership.length > 0 && (
        <section className="section team-section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <header className="team-section-head reveal">
              <div className="eyebrow">// Leadership</div>
              <h2>
                Who <span className="serif-italic">leads.</span>
              </h2>
            </header>
            <div className="team-grid">
              {leadership.map((m) => (
                <MemberCard key={m.id} m={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section team-section">
          <div className="wrap">
            <header className="team-section-head reveal">
              <div className="eyebrow">// On the ground</div>
              <h2>
                The people bringing<br />
                <span className="serif-italic">work to life.</span>
              </h2>
            </header>
            <div className="team-grid">
              {others.map((m) => (
                <MemberCard key={m.id} m={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
