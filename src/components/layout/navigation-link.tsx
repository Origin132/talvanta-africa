"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type NavigationLinkProps = ComponentProps<typeof Link> & { activeClassName: string };

export function NavigationLink({ activeClassName, className = "", href, ...props }: NavigationLinkProps) {
  const pathname = usePathname();
  const route = typeof href === "string" ? href : href.pathname;
  const isActive = route === "/"
    ? pathname === "/"
    : Boolean(route && (pathname === route || pathname.startsWith(`${route}/`)));

  return <Link {...props} href={href} aria-current={isActive ? "page" : undefined} className={`${className} ${isActive ? activeClassName : ""}`} />;
}
