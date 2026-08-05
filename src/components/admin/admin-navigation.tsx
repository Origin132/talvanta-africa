"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Overview",
    href: "/admin",
    active: (path: string) => path === "/admin",
  },
  {
    label: "Recruitment Requests",
    href: "/admin/recruitment-requests",
    active: (path: string) => path.startsWith("/admin/recruitment-requests"),
  },
] as const;

export function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Administration navigation">
      <ul className="flex gap-1 overflow-x-auto py-3">
        {items.map((item) => {
          const active = item.active(pathname);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg px-4 font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold ${active ? "bg-white text-navy" : "text-white hover:bg-white/10"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <li className="shrink-0">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg px-4 font-bold text-white underline decoration-gold decoration-2 underline-offset-4 hover:bg-white/10"
          >
            Return to Website
          </Link>
        </li>
      </ul>
    </nav>
  );
}
