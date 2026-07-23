import { PageContainer } from "@/components/layout/page-container";

export function FormNotice({ caution, processingText }: { caution: string; processingText: string }) {
  return <section className="border-b border-border-grey bg-white" aria-labelledby="submission-notice-heading"><PageContainer className="py-6"><div className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5"><h2 id="submission-notice-heading" className="font-heading text-lg font-extrabold text-navy">Important submission notice</h2><p className="mt-2 font-semibold text-navy">{processingText}</p><p className="mt-2 leading-7 text-slate">{caution}</p></div></PageContainer></section>;
}
