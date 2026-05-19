import { ComingSoon } from '../coming-soon';
export const metadata = { title: 'SEO · DI & UX CMS', robots: { index: false } };
export default function Page() {
  return (
    <ComingSoon
      title="SEO"
      blurb="Per-page title, meta description, and OG image. Saved values are read by generateMetadata() in each route."
      bullets={['Editable rows for /, /article, /case-study, /team, /contact', 'Live preview of the Google search snippet', 'OG image upload (uses the same ImageUploader)']}
    />
  );
}
