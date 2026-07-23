"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <section className="mx-auto w-full max-w-[var(--page-max-width)] px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="error-heading">
      <div className="max-w-2xl rounded-[var(--radius)] border border-border-grey bg-soft-grey p-8 sm:p-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-error-red">Something went wrong</p>
        <h1 id="error-heading" className="mt-3 text-3xl font-extrabold text-navy">We could not display this page</h1>
        <p className="mt-4 leading-7 text-slate">This may be temporary. Try loading this section again, return home, or use the contact centre if the problem continues.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={unstable_retry}>Try again</Button>
          <ButtonLink href="/" variant="outline">Return home</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Contact centre</ButtonLink>
        </div>
      </div>
    </section>
  );
}
