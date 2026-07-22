import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink, type ButtonVariant } from "./button";

export type ActionLink = {
  label: string;
  href: string;
};

type PageHeroProps = {
  title: string;
  supportingText: string;
  eyebrow?: string;
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
  variation?: "light" | "dark";
};

export function PageHero({
  title,
  supportingText,
  eyebrow,
  primaryAction,
  secondaryAction,
  variation = "light",
}: PageHeroProps) {
  const isDark = variation === "dark";
  const primaryVariant: ButtonVariant = isDark ? "secondary" : "primary";
  const secondaryVariant: ButtonVariant = isDark ? "light" : "outline";

  return (
    <section className={isDark ? "bg-navy text-white" : "bg-soft-grey text-slate"}>
      <PageContainer className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className={`mb-4 text-sm font-extrabold uppercase tracking-[0.16em] ${isDark ? "text-gold" : "text-green"}`}>
              {eyebrow}
            </p>
          ) : null}
          <h1 className={`max-w-[18ch] text-balance text-[2.125rem] font-extrabold leading-[1.12] tracking-tight min-[360px]:text-4xl sm:max-w-3xl sm:text-5xl lg:text-6xl ${isDark ? "text-white" : "text-navy"}`}>
            {title}
          </h1>
          <p className={`mt-6 max-w-2xl text-pretty text-lg leading-8 sm:text-xl ${isDark ? "text-white/85" : "text-slate"}`}>
            {supportingText}
          </p>
          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-3">
              {primaryAction ? (
                <ButtonLink href={primaryAction.href} variant={primaryVariant}>
                  {primaryAction.label}
                </ButtonLink>
              ) : null}
              {secondaryAction ? (
                <ButtonLink href={secondaryAction.href} variant={secondaryVariant}>
                  {secondaryAction.label}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </section>
  );
}
