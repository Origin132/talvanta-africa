import { PageContainer } from "@/components/layout/page-container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer className="py-20">
      <section className="max-w-2xl rounded-[var(--radius)] border border-border-grey bg-soft-grey p-8 sm:p-10" aria-labelledby="not-found-heading">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-green">Page not found</p>
        <h1 id="not-found-heading" className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">We could not find that page</h1>
        <p className="mt-4 leading-7 text-slate">The address may be incorrect, the page may have moved, or the content may not be available. Use one of the verified website routes below.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/services" variant="outline">Explore services</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
        </div>
      </section>
    </PageContainer>
  );
}
