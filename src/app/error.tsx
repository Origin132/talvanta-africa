"use client";

import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto w-full max-w-[var(--page-max-width)] px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="error-heading">
      <div className="max-w-2xl rounded-[var(--radius)] border border-border-grey bg-soft-grey p-8 sm:p-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-error-red">Something went wrong</p>
        <h1 id="error-heading" className="mt-3 text-3xl font-extrabold text-navy">We could not display this page</h1>
        <p className="mt-4 text-slate">Please try again. If the problem continues, return to the homepage.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href="/" variant="outline">Return home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
