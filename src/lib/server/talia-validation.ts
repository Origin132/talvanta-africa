import type { TaliaRequestMessage } from "@/lib/talia/talia-types";

export const TALIA_MAX_BODY_BYTES = 30 * 1024;
export const TALIA_MAX_MESSAGES = 16;
export const TALIA_MAX_USER_LENGTH = 1_500;
export const TALIA_MAX_ASSISTANT_LENGTH = 3_000;

type ValidationSuccess = {
  valid: true;
  messages: TaliaRequestMessage[];
};

type ValidationFailure = {
  valid: false;
  fieldError: string;
};

export type TaliaValidationResult = ValidationSuccess | ValidationFailure;

export function validateTaliaRequest(value: unknown): TaliaValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, fieldError: "Enter a valid message." };
  }

  const record = value as Record<string, unknown>;
  if (
    Object.keys(record).some((key) => key !== "messages") ||
    !Array.isArray(record.messages) ||
    record.messages.length === 0 ||
    record.messages.length > TALIA_MAX_MESSAGES
  ) {
    return { valid: false, fieldError: "Enter a valid message." };
  }

  const messages: TaliaRequestMessage[] = [];
  for (const item of record.messages) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return { valid: false, fieldError: "Enter a valid message." };
    }

    const message = item as Record<string, unknown>;
    if (
      Object.keys(message).some(
        (key) => key !== "role" && key !== "content",
      ) ||
      (message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string"
    ) {
      return { valid: false, fieldError: "Enter a valid message." };
    }

    const content = message.content.trim();
    const maximum =
      message.role === "user"
        ? TALIA_MAX_USER_LENGTH
        : TALIA_MAX_ASSISTANT_LENGTH;
    if (!content || content.length > maximum) {
      return { valid: false, fieldError: "Enter a valid message." };
    }

    messages.push({ role: message.role, content });
  }

  if (messages.at(-1)?.role !== "user") {
    return { valid: false, fieldError: "Enter a valid message." };
  }

  return { valid: true, messages };
}
