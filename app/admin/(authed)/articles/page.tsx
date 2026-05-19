import { ComingSoon } from '../../coming-soon';
export const metadata = { title: 'Articles · DI & UX CMS', robots: { index: false } };
export default function Page() {
  return (
    <ComingSoon
      title="Articles"
      blurb="Blog post CRUD with a Tiptap rich text editor and a draft/published toggle."
      bullets={['Title, slug, excerpt, cover image, topic', 'Tiptap rich text body (bold, italic, lists, links, headings, code)', 'Draft state (unpublished posts are excluded by RLS on the public read)', 'Publish / unpublish with revalidation']}
    />
  );
}
