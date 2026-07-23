"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TaliaPanel } from "@/components/talia/talia-panel";
import { TALIA_WELCOME_MESSAGE } from "@/lib/talia/mock-responses";
import type {
  TaliaApiResponse,
  TaliaMessage,
  TaliaRequestMessage,
} from "@/lib/talia/talia-types";

const MAX_RETAINED_MESSAGES = 16;

function welcomeMessage(): TaliaMessage {
  return {
    id: "talia-welcome",
    role: "assistant",
    ...TALIA_WELCOME_MESSAGE,
  };
}

function clientMessage(message: Omit<TaliaMessage, "id">): TaliaMessage {
  return { id: crypto.randomUUID(), ...message };
}

export function TaliaLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TaliaMessage[]>([welcomeMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closePanel();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closePanel, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [isOpen, loading, messages]);

  async function sendMessage(override?: string, retry = false) {
    const content = (override ?? input).trim();
    if (!content || loading || content.length > 1_500) return;

    setLoading(true);
    setError(null);
    setLastFailedMessage(null);
    setInput("");

    const userMessage = clientMessage({ role: "user", content });
    const nextMessages = retry ? messages : [...messages, userMessage];
    if (!retry) {
      setMessages(nextMessages.slice(-MAX_RETAINED_MESSAGES));
    }

    const requestMessages: TaliaRequestMessage[] = nextMessages
      .slice(-MAX_RETAINED_MESSAGES)
      .map(({ role, content: messageContent }) => ({
        role,
        content: messageContent,
      }));

    try {
      const response = await fetch("/api/talia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages }),
      });
      const data = (await response.json()) as TaliaApiResponse;

      if (!response.ok || !data.success) {
        const message =
          response.status === 429
            ? "Talia has received several requests. Please wait a few minutes before trying again."
            : response.status === 422
              ? "Please enter a shorter valid message and try again."
              : "Talia could not respond. Your recent messages are still visible, so you can try again.";
        setError(message);
        setLastFailedMessage(content);
        return;
      }

      setMessages((current) =>
        [...current, clientMessage(data.message)].slice(-MAX_RETAINED_MESSAGES),
      );
    } catch {
      setError(
        "Talia could not respond. Your recent messages are still visible, so you can try again.",
      );
      setLastFailedMessage(content);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function clearConversation() {
    setMessages([welcomeMessage()]);
    setInput("");
    setError(null);
    setLastFailedMessage(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <>
      {isOpen ? (
        <TaliaPanel
          panelRef={panelRef}
          inputRef={inputRef}
          messagesEndRef={messagesEndRef}
          messages={messages}
          input={input}
          loading={loading}
          error={error}
          onInputChange={setInput}
          onSubmit={sendMessage}
          onRetry={() => {
            if (lastFailedMessage) void sendMessage(lastFailedMessage, true);
          }}
          onClear={clearConversation}
          onClose={closePanel}
        />
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Talia automated recruitment assistant"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`${isOpen ? "pointer-events-none opacity-0" : ""} fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 flex min-h-12 items-center gap-2 rounded-full border-2 border-white bg-green px-3 py-2 font-bold text-white shadow-[var(--shadow-subtle)] hover:bg-navy sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] sm:right-[max(1.5rem,env(safe-area-inset-right))] sm:px-4`}
      >
        <span
          aria-hidden="true"
          className="grid size-8 place-items-center rounded-full bg-white font-heading text-sm text-green"
        >
          T
        </span>
        <span>Talia</span>
      </button>
    </>
  );
}
