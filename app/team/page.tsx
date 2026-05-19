import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { PlaceholderPage } from '@/components/site/PlaceholderPage';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/team');
  return {
    title: seo?.title || 'Team · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="// Team"
      title="The people"
      body="Team grid will be ported in a follow-up; the admin CRUD is fully wired."
    />
  );
}
