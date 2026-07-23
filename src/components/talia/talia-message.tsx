import Link from "next/link";
import type { TaliaMessage as TaliaMessageType } from "@/lib/talia/talia-types";

type TaliaMessageProps = {
  message: TaliaMessageType;
};

export function TaliaMessage({ message }: TaliaMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <li
      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
      aria-label={isAssistant ? "Talia said" : "You said"}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isAssistant
            ? "rounded-bl-md border border-border-grey bg-white text-slate"
            : "rounded-br-md bg-navy text-white"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.internalLink ? (
          <Link
            href={message.internalLink.href}
            className={`mt-2 inline-flex min-h-10 items-center font-bold underline decoration-2 underline-offset-4 ${
              isAssistant
                ? "text-green hover:text-navy"
                : "text-white hover:text-gold"
            }`}
          >
            {message.internalLink.label}
          </Link>
        ) : null}
      </div>
    </li>
  );
}
