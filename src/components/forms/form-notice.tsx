import { PageContainer } from "@/components/layout/page-container";

export function FormNotice({ caution }: { caution: string }) {
  return <section className="border-b border-border-grey bg-white" aria-labelledby="demonstration-notice-heading"><PageContainer className="py-6"><div className="rounded-[var(--radius)] border-l-4 border-gold bg-soft-grey p-5"><h2 id="demonstration-notice-heading" className="font-heading text-lg font-extrabold text-navy">Important demonstration notice</h2><p className="mt-2 font-semibold text-navy">This form is currently operating in demonstration mode. Information entered is validated in the browser but is not transmitted or stored.</p><p className="mt-2 leading-7 text-slate">{caution}</p></div></PageContainer></section>;
}
