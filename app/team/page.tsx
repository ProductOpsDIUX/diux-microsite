import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { listTeam } from '@/lib/cms/team';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { Timeline, type TimelineMilestone } from '@/components/site/Timeline';

const ORIGINS: TimelineMilestone[] = [
  {
    year: '2018',
    title: 'Develop new capabilities',
    bullets: [
      'Conducted DI training for 50 HCDs and 100 staff via DI boot camp',
      'Applied DI across 11 capability areas with 30+ new initiatives',
    ],
  },
  {
    year: '2019 — 2020',
    title: 'Transform enterprise',
    bullets: [
      'Enhanced DI methodology for enterprise-level impact',
      'Partnered SAF users to co-design new concepts for Army, Air Force and Navy',
    ],
  },
  {
    year: '2021 — 2022',
    title: 'DI & UX is born 🎉',
    bullets: [
      'We used to be spread across different PCs such as C3D, CIO, EDS, and Digital Hub, before coming together under Digital Hub as one central DI & UX cluster',
    ],
  },
  {
    year: '2023 — 2024',
    title: 'Expand reach & influence',
    bullets: [
      'Not only did we support SAF projects and DSTA initiatives, but also expanded into MINDEF projects, shaped the DSTA Employee Experience and collaborated with external parties in MINDEF/SAF and the industry',
    ],
  },
  {
    year: '2025',
    title: 'Scale data-driven UX',
    bullets: [
      'Our 3 chapters (Command Centre Experience, DSTA Experience and Enterprise Experience) covered 8 portfolios, 16 programmes, and 50+ projects/tracks',
    ],
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

export default async function TeamPage() {
  const members = await listTeam();

  return (
    <>
      <div data-praxis-chrome="nav"></div>

      <section className="section" style={{ paddingTop: '18vh' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">// Team</div>
              <h2>
                A design team built around<br />
                <span className="serif-italic">people, not interfaces.</span>
              </h2>
            </div>
          </div>

          <p className="hero-sub reveal" style={{ marginTop: 24, marginBottom: 48, maxWidth: '70ch' }}>
            We&rsquo;re product designers and strategists building insight dashboards,
            scenario planners, decision-support tools, and analytics systems that help
            defence and enterprise teams think faster and operate better.
          </p>

          {members.length === 0 ? (
            <p className="hero-sub" style={{ marginTop: 32 }}>
              No team members yet.
            </p>
          ) : (
            <div className="team-grid">
              {members.map((m) => (
                <div key={m.id} className="team-card reveal">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="team-origins">
        <div className="wrap">
          <div className="team-origins-head">
            <div className="eyebrow">Origins of DI &amp; UX</div>
            <h2>How it started</h2>
            <p>
              DI &amp; UX began with one conviction: defence technology didn&rsquo;t need
              more complexity. It needed better thinking.
            </p>
          </div>
          <Timeline milestones={ORIGINS} />
        </div>
      </section>

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
