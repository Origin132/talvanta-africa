import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";

export function AuthShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main className="bg-soft-grey py-12 sm:py-16"><PageContainer><div className="mx-auto max-w-xl"><div className="mb-7 text-center"><p className="font-bold uppercase tracking-[0.16em] text-green">{eyebrow}</p><h1 className="mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">{title}</h1><p className="mt-4 leading-7 text-slate">{intro}</p></div><div className="rounded-[var(--radius)] border border-border-grey bg-white p-5 shadow-sm sm:p-8">{children}</div></div></PageContainer></main>;
}
