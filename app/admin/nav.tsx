'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/home', label: 'Home page' },
  { href: '/admin/case-studies', label: 'Case studies' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/seo', label: 'SEO' },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="px-3 py-4 flex-1 overflow-y-auto">
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-md px-3 py-2 text-[13px] transition-colors ${
                  active
                    ? 'bg-accent/15 text-accent border-l-2 border-accent pl-[10px]'
                    : 'text-fg1 hover:bg-bg2 hover:text-fg0'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 px-3">
        <Link
          href="/"
          target="_blank"
          className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 hover:text-fg0"
        >
          → View live site
        </Link>
      </div>
    </nav>
  );
}
