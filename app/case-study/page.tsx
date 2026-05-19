import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { PlaceholderPage } from '@/components/site/PlaceholderPage';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/case-study');
  return {
    title: seo?.title || 'Case studies · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="// Selected work"
      title="Case studies"
      body="Case studies will be ported in a follow-up; the admin CRUD is fully wired."
    />
  );
}
