import { LegacyScripts } from './LegacyScripts';
import { SiteNav } from './SiteNav';

export function PlaceholderPage({ eyebrow, title, body }: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <>
      <SiteNav />
      <main className="section" style={{ minHeight: '70vh', paddingTop: '20vh' }}>
        <div className="wrap">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="hero-h1" style={{ marginTop: 12 }}>{title}</h1>
          {body && <p className="hero-sub" style={{ marginTop: 24 }}>{body}</p>}
        </div>
      </main>
      <div data-praxis-chrome="footer"></div>
      <LegacyScripts />
    </>
  );
}
