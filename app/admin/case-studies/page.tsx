import { ComingSoon } from '../coming-soon';
export const metadata = { title: 'Case studies · DI & UX CMS', robots: { index: false } };
export default function Page() {
  return (
    <ComingSoon
      title="Case studies"
      blurb="Full CRUD will land in the next iteration using the same patterns as the Home editor (Server Actions, Zod, ImageUploader, automatic revalidation)."
      bullets={['List + filter view', 'Create / edit form with hero image upload', 'Reorder and feature toggle', 'Delete with confirmation']}
    />
  );
}
