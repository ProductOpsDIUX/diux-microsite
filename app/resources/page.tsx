import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { listResources } from '@/lib/cms/resources';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { SiteNav } from '@/components/site/SiteNav';import type { Resource } from '@/lib/supabase/types';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/resources');
  return {
    title: seo?.title || 'Resources · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

function ResourceCard({ r }: { r: Resource }) {
  const isFile = !!r.file_path;
  return (
    <a
      className="resource-card reveal"
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      // The download attribute hints to the browser to save uploaded files
      // directly. External links ignore it.
      download={isFile ? '' : undefined}
    >
      <div className="resource-card-thumb" aria-hidden="true">
        {r.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.thumbnail} alt="" />
        ) : (
          <span className="resource-card-thumb-placeholder">
            {r.title.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="resource-card-body">
        <div className="resource-card-title">{r.title}</div>
        {r.description && <p className="resource-card-desc">{r.description}</p>}
      </div>
      <span className="resource-card-arrow" aria-hidden="true">
        {isFile ? 'Download →' : 'Open →'}
      </span>
    </a>
  );
}

export default async function ResourcesPage() {
  const all = await listResources();
  const templates = all.filter((r) => r.kind === 'template');
  const manuals = all.filter((r) => r.kind === 'manual');

  return (
    <>
      <SiteNav />

      <section className="section" style={{ paddingTop: '18vh' }}>
        <div className="wrap">
          <div className="section-head reveal" style={{ borderBottom: 0, paddingBottom: 0, marginBottom: 24 }}>
            <div>
              <div className="eyebrow">// Resources</div>
              <h2>
                Our <span className="serif-italic">Repository.</span>
              </h2>
            </div>
          </div>
          <p className="hero-sub reveal" style={{ maxWidth: '70ch', marginBottom: 64 }}>
            Templates, manuals, and practical artefacts from the DI &amp; UX practice —
            ready to use.
          </p>

          {all.length === 0 && (
            <p className="hero-sub">No resources yet — check back soon.</p>
          )}

          {templates.length > 0 && (
            <section className="resource-section">
              <h3 className="resource-section-title">// Templates</h3>
              <div className="resource-grid">
                {templates.map((r) => (
                  <ResourceCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}

          {manuals.length > 0 && (
            <section className="resource-section">
              <h3 className="resource-section-title">// Manuals</h3>
              <div className="resource-grid">
                {manuals.map((r) => (
                  <ResourceCard key={r.id} r={r} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
