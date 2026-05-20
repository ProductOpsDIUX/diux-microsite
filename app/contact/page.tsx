import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { LegacyScripts } from '@/components/site/LegacyScripts';
import { SiteNav } from '@/components/site/SiteNav';
import { ContactForm } from '@/components/site/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/contact');
  return {
    title: seo?.title || 'Get in touch · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function Page() {
  return (
    <>
      <div className="grid-overlay" aria-hidden="true"></div>
      <SiteNav />

      <main className="contact-page">
        <div className="wrap contact-grid">
          <aside className="contact-aside">
            <h1 className="contact-title">
              Get in <span className="serif-italic">touch.</span>
            </h1>
            <p className="contact-intro">
              Want to connect? Send us a message here. We&rsquo;ll keep your details on hand, and
              may reach out when the right opportunity opens up.
            </p>
            <ul className="contact-meta">
              <li>
                <span className="contact-meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <a href="mailto:hello@diux.design">hello@diux.design</a>
              </li>
              <li>
                <span className="contact-meta-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                <span>Singapore</span>
              </li>
            </ul>
          </aside>

          <ContactForm />
        </div>

        {/* ============ HIRING ============ */}
        <section className="hiring-section" aria-labelledby="hiring-heading">
          <div className="wrap">
            <div className="eyebrow">// Hiring</div>
            <h2 id="hiring-heading" className="hiring-title">
              Latest <span className="serif-italic">openings.</span>
            </h2>
            <p className="hiring-empty">
              We don&rsquo;t have any open positions at the moment. Keep an eye on this page for the
              next round of opportunities.
            </p>
          </div>
        </section>
      </main>

      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
