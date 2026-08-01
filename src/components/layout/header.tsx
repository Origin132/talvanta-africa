import Link from "next/link";
import { primaryNavigation } from "@/lib/site-navigation";
import { ButtonLink } from "@/components/ui/button";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationLink } from "./navigation-link";
import { PageContainer } from "./page-container";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-grey bg-white/95 backdrop-blur">
      <PageContainer className="relative flex min-h-20 items-center justify-between gap-5">
        <Link
          href="/"
          className="font-heading text-lg font-extrabold tracking-tight text-navy sm:text-xl"
          aria-label="Talvanta Africa home"
        >
          Talvanta <span className="text-green">Africa</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden min-[1180px]:block">
          <ul className="flex items-center gap-1">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <NavigationLink
                  href={item.href}
                  activeClassName="bg-soft-grey font-extrabold text-navy underline decoration-gold decoration-2 underline-offset-8"
                  className="inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold text-slate hover:bg-soft-grey hover:text-green"
                >
                  {item.label}
                </NavigationLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 min-[1180px]:flex">
          <Link className="inline-flex min-h-11 items-center font-bold text-navy hover:text-green focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-gold" href="/sign-in">Sign In</Link>
          <ButtonLink href="/for-employers">Hire Talent</ButtonLink>
        </div>
        <MobileNavigation items={primaryNavigation} />
      </PageContainer>
    </header>
  );
}
