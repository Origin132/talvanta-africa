"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const items = [
  { label: "Overview", href: "/account/candidate", active: (path: string) => path === "/account/candidate" },
  { label: "Profile", href: "/account/candidate/profile", active: (path: string) => path.startsWith("/account/candidate/profile") },
  { label: "Documents", href: "/account/candidate/documents", active: (path: string) => path.startsWith("/account/candidate/documents") },
  { label: "Settings", href: "/account/settings", active: (path: string) => path.startsWith("/account/settings") },
] as const;
export function CandidateNavigation() { const pathname = usePathname(); return <nav aria-label="Candidate account navigation" className="border-b border-border-grey"><ul className="flex gap-1 overflow-x-auto py-3" role="list">{items.map((item) => { const active = item.active(pathname); return <li key={item.href} className="shrink-0"><Link href={item.href} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-lg px-4 font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold ${active ? "bg-navy text-white" : "text-navy hover:bg-white hover:text-green"}`}>{item.label}</Link></li>; })}</ul></nav>; }
