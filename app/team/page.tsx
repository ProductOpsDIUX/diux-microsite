import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { listTeam } from '@/lib/cms/team';
import { LegacyScripts } from '@/components/site/LegacyScripts';

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
      <div className="grid-overlay" aria-hidden="true"></div>
      <div data-praxis-chrome="nav"></div>

      <section className="section" style={{ paddingTop: '18vh' }}>
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">// Team</div>
              <h2>
                The people behind<br />
                <span className="serif-italic">the work.</span>
              </h2>
            </div>
          </div>

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

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
