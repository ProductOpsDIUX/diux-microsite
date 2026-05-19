import type { Metadata } from 'next';
import { getPageSeo } from '@/lib/cms/seo';
import { PlaceholderPage } from '@/components/site/PlaceholderPage';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('/contact');
  return {
    title: seo?.title || 'Contact · DI & UX',
    description: seo?.description || '',
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="// Contact"
      title="Get in touch"
      body="Contact page will be ported in a follow-up."
    />
  );
}
