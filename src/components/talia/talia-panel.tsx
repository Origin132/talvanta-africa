import type { RefObject } from "react";
import { TaliaForm } from "@/components/talia/talia-form";
import { TaliaMessage } from "@/components/talia/talia-message";
import { TaliaQuickActions } from "@/components/talia/talia-quick-actions";
import type { TaliaMessage as TaliaMessageType } from "@/lib/talia/talia-types";

type TaliaPanelProps = {
  panelRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  messages: TaliaMessageType[];
  input: string;
  loading: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: (message?: string) => void;
  onRetry: () => void;
  onClear: () => void;
  onClose: () => void;
};

export function TaliaPanel({
  panelRef,
  inputRef,
  messagesEndRef,
  messages,
  input,
  loading,
  error,
  onInputChange,
  onSubmit,
  onRetry,
  onClear,
  onClose,
}: TaliaPanelProps) {
  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="talia-title"
      aria-describedby="talia-description"
      tabIndex={-1}
      className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-[60] flex max-h-[calc(100dvh-1rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-2xl border border-border-grey bg-white shadow-[0_20px_60px_rgb(16_42_67/0.25)] sm:inset-x-auto sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))] sm:h-[min(42rem,calc(100dvh-2rem))] sm:w-[min(25rem,calc(100vw-2rem))]"
    >
      <header className="flex shrink-0 items-start justify-between gap-4 bg-navy px-4 py-3 text-white">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-white font-heading text-sm font-extrabold text-green"
            >
              T
            </span>
            <div>
              <h2 id="talia-title" className="font-heading text-lg font-extrabold">
                Talia
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-white/80">
                <span aria-hidden="true" className="size-2 rounded-full bg-gold" />
                Automated website assistant
              </p>
            </div>
          </div>
          <p id="talia-description" className="sr-only">
            Rule-based recruitment guidance from Talvanta Africa
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-xl text-2xl leading-none text-white hover:bg-white/10"
          aria-label="Close Talia chat"
        >
          ×
        </button>
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-soft-grey p-4"
        aria-live="polite"
        aria-busy={loading}
      >
        <ol className="space-y-3">
          {messages.map((message) => (
            <TaliaMessage key={message.id} message={message} />
          ))}
        </ol>
        {loading ? (
          <p className="mt-3 text-sm font-semibold text-slate" role="status">
            Talia is selecting an approved response…
          </p>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-border-grey bg-soft-grey px-3 py-2">
        <TaliaQuickActions disabled={loading} onSelect={onSubmit} />
        <button
          type="button"
          onClick={onClear}
          disabled={loading || messages.length === 1}
          className="mt-2 inline-flex min-h-10 items-center text-xs font-bold text-slate underline underline-offset-2 hover:text-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear conversation
        </button>
      </div>

      <TaliaForm
        inputRef={inputRef}
        value={input}
        disabled={loading}
        error={error}
        onChange={onInputChange}
        onSubmit={() => onSubmit()}
        onRetry={onRetry}
      />
    </div>
  );
}
