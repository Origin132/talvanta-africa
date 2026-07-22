import { PageContainer } from "@/components/layout/page-container";

export default function Loading() {
  return (
    <PageContainer className="py-20" role="status" aria-live="polite">
      <div className="max-w-2xl rounded-[var(--radius)] border border-border-grey bg-soft-grey p-8">
        <p className="font-heading text-2xl font-extrabold text-navy">Loading page</p>
        <p className="mt-3 text-slate">Please wait while the requested content is prepared.</p>
      </div>
    </PageContainer>
  );
}
