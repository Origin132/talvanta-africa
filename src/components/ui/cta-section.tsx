import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "./button";
import type { ActionLink } from "./page-hero";

type CTASectionProps = {
  heading: string;
  supportingText: string;
  primaryAction: ActionLink;
  secondaryAction?: ActionLink;
  variation?: "light" | "dark";
};

export function CTASection({
  heading,
  supportingText,
  primaryAction,
  secondaryAction,
  variation = "dark",
}: CTASectionProps) {
  const isDark = variation === "dark";

  return (
    <section className={isDark ? "bg-navy text-white" : "bg-soft-grey text-slate"}>
      <PageContainer className="py-14 sm:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${isDark ? "text-white" : "text-navy"}`}>
              {heading}
            </h2>
            <p className={`mt-4 text-lg leading-8 ${isDark ? "text-white/85" : "text-slate"}`}>
              {supportingText}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:gap-3">
            <ButtonLink href={primaryAction.href} variant={isDark ? "secondary" : "primary"}>
              {primaryAction.label}
            </ButtonLink>
            {secondaryAction ? (
              <ButtonLink href={secondaryAction.href} variant={isDark ? "light" : "outline"}>
                {secondaryAction.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
