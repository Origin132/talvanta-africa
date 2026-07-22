import Link from "next/link";
import { primaryNavigation } from "@/lib/site-navigation";
import { ButtonLink } from "@/components/ui/button";
import { MobileNavigation } from "./mobile-navigation";
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

        <nav aria-label="Primary navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold text-slate hover:bg-soft-grey hover:text-green xl:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/hire-talent">Hire Talent</ButtonLink>
        </div>
        <MobileNavigation items={primaryNavigation} />
      </PageContainer>
    </header>
  );
}
