import type { FormEvent, KeyboardEvent, RefObject } from "react";

const MAX_MESSAGE_LENGTH = 1_500;

type TaliaFormProps = {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  disabled: boolean;
  error: string | null;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onRetry: () => void;
};

export function TaliaForm({
  inputRef,
  value,
  disabled,
  error,
  onChange,
  onSubmit,
  onRetry,
}: TaliaFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border-grey bg-white p-3">
      {error ? (
        <div
          role="alert"
          className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-error-red/30 bg-error-red/5 p-3 text-xs text-error-red"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={disabled}
            className="shrink-0 font-bold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      ) : null}

      <label htmlFor="talia-message" className="sr-only">
        Message Talia
      </label>
      <div className="flex items-end gap-2">
        <textarea
          ref={inputRef}
          id="talia-message"
          rows={2}
          maxLength={MAX_MESSAGE_LENGTH}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Talia a question"
          className="min-h-12 min-w-0 flex-1 resize-none rounded-xl border border-border-grey bg-white px-3 py-2 text-sm text-slate placeholder:text-slate/60 focus:border-green disabled:bg-soft-grey"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-green px-4 font-bold text-white hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
      <p className="mt-2 text-[0.6875rem] leading-4 text-slate">
        Talia is a rule-based demonstration assistant. Messages are processed
        by this website to select an approved response. Do not include sensitive
        personal information.
      </p>
    </form>
  );
}
