"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Preference = "accepted" | "rejected" | "dismissed";

const STORAGE_KEY = "talvanta-cookie-preference";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shouldShow = true;
    try {
      shouldShow = !window.localStorage.getItem(STORAGE_KEY);
    } catch {}
    const timer = window.setTimeout(() => setVisible(shouldShow), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function choose(preference: Preference) {
    try {
      window.localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // The choice still dismisses the non-blocking banner for this page view.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      aria-labelledby="cookie-heading"
      className="fixed inset-x-3 top-[calc(5rem+max(0.75rem,env(safe-area-inset-top)))] z-50 mx-auto max-w-4xl rounded-[var(--radius)] border border-border-grey bg-white p-4 shadow-[0_16px_50px_rgb(16_42_67/0.22)] sm:p-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 id="cookie-heading" className="font-heading text-lg font-extrabold text-navy">
            Local website preferences
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate">
            This demonstration does not use analytics. Your choice is stored
            locally so this notice does not appear on every visit. Essential
            website features remain available.{" "}
            <Link href="/privacy" className="font-bold text-green underline underline-offset-2">
              Read the privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => choose("accepted")} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green px-4 py-2 text-sm font-bold text-white hover:bg-navy">
            Accept
          </button>
          <button type="button" onClick={() => choose("rejected")} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-green bg-white px-4 py-2 text-sm font-bold text-green hover:bg-soft-grey">
            Reject non-essential
          </button>
          <button type="button" onClick={() => choose("dismissed")} className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-slate hover:bg-soft-grey" aria-label="Dismiss cookie preference notice">
            Dismiss
          </button>
        </div>
      </div>
    </section>
  );
}
