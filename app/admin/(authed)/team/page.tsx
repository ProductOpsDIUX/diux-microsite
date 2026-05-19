import { ComingSoon } from '../../coming-soon';
export const metadata = { title: 'Team · DI & UX CMS', robots: { index: false } };
export default function Page() {
  return (
    <ComingSoon
      title="Team"
      blurb="Member CRUD with portrait upload + reordering."
      bullets={['Name, role, short bio, portrait', 'Drag-to-reorder via the position column', 'Bulk publish workflow not needed — singleton page']}
    />
  );
}
