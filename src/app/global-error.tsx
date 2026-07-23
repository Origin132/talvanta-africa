"use client";

import "./globals.css";

export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto grid min-h-screen w-full max-w-3xl place-items-center px-4 py-16">
          <section className="rounded-[var(--radius)] border border-border-grey bg-soft-grey p-8 sm:p-10" aria-labelledby="global-error-heading">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-error-red">Unexpected error</p>
            <h1 id="global-error-heading" className="mt-3 text-3xl font-extrabold text-navy">Talvanta Africa is temporarily unavailable</h1>
            <p className="mt-4 text-slate">Please try loading the website again. No technical details have been displayed.</p>
            <button type="button" onClick={unstable_retry} className="mt-7 inline-flex min-h-12 items-center justify-center rounded-[var(--radius)] border border-green bg-green px-5 py-3 font-bold text-white hover:border-navy hover:bg-navy">Try again</button>
          </section>
        </main>
      </body>
    </html>
  );
}
