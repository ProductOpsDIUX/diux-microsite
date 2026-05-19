import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { AdminNav } from '../nav';

export const metadata = { title: 'Admin · DI & UX', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/admin/sign-in');
  const user = await currentUser();

  return (
    <div className="admin-root flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-line bg-bg1 flex flex-col">
        <div className="px-6 py-5 border-b border-line">
          <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-fg2">
            // CMS
          </div>
          <div className="font-display text-[18px] font-semibold text-fg0 mt-1">DI &amp; UX</div>
        </div>

        <AdminNav />

        <div className="mt-auto p-4 border-t border-line flex items-center gap-3">
          <UserButton afterSignOutUrl="/admin/sign-in" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] text-fg0">
              {user?.firstName || user?.username || 'Editor'}
            </div>
            <div className="truncate text-[11px] text-fg2">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-4xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
