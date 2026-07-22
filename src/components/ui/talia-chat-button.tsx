export function TaliaChatButton() {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:right-[max(1.5rem,env(safe-area-inset-right))]">
      <button
        type="button"
        aria-describedby="talia-coming-soon"
        aria-disabled="true"
        title="Talia AI Assistant — coming soon"
        className="flex size-12 items-center justify-center rounded-full border-2 border-white bg-green p-2 font-bold text-white shadow-[var(--shadow-subtle)] hover:bg-navy lg:h-auto lg:w-auto lg:min-h-12 lg:gap-2 lg:px-4 lg:py-3"
      >
        <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-white font-heading text-sm text-green">
          T
        </span>
        <span className="sr-only lg:not-sr-only">Talia AI</span>
      </button>
      <span id="talia-coming-soon" className="sr-only">
        Talia AI Assistant — coming soon. This placeholder is not yet functional.
      </span>
    </div>
  );
}
