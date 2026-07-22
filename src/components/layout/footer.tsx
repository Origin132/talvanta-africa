import Link from "next/link";
import { PageContainer } from "./page-container";

const linkGroups = [
  {
    title: "Quick links",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Jobs", href: "/jobs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Employers",
    links: [
      { label: "For Employers", href: "/employers" },
      { label: "Hire Talent", href: "/hire-talent" },
      { label: "Recruitment Services", href: "/services" },
    ],
  },
  {
    title: "Job seekers",
    links: [
      { label: "For Job Seekers", href: "/job-seekers" },
      { label: "Explore Jobs", href: "/jobs" },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <PageContainer className="pb-28 pt-12 sm:pb-24 sm:pt-16">
        <div className="grid gap-10 border-b border-white/20 pb-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-heading text-2xl font-extrabold"
              aria-label="Talvanta Africa home"
            >
              Talvanta <span className="text-gold">Africa</span>
            </Link>
            <p className="mt-4 max-w-sm font-heading text-lg font-bold text-white">
              Connecting exceptional talent with growing businesses.
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/80">
              Talvanta Africa is an AI-powered HR recruitment and talent-solutions company connecting qualified professionals with growing businesses across Nigeria and Africa.
            </p>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={`${group.title} footer links`}>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-10 items-center text-sm text-white/85 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-5 pt-8 text-sm text-white/75 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p>© {year} Talvanta Africa.</p>
            <p className="mt-2 max-w-2xl">
              Demonstration project: placeholder content and features are clearly identified and are not live recruitment services.
            </p>
          </div>
          <nav aria-label="Legal links">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li><Link className="hover:text-gold" href="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-gold" href="/terms">Terms</Link></li>
            </ul>
          </nav>
        </div>
      </PageContainer>
    </footer>
  );
}
