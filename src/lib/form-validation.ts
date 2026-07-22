import type { FormErrors } from "@/types/forms";

export function valueOf(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

export function addRequiredText(errors: FormErrors, data: FormData, name: string, label: string, minimum = 1) {
  const value = valueOf(data, name);
  if (!value) errors[name] = `Enter ${label.toLowerCase()}.`;
  else if (value.length < minimum) errors[name] = `${label} must be at least ${minimum} characters.`;
}

export function addRequiredChoice(errors: FormErrors, data: FormData, name: string, message: string) {
  if (!valueOf(data, name)) errors[name] = message;
}

export function addRequiredCheck(errors: FormErrors, data: FormData, name: string, message: string) {
  if (!data.has(name)) errors[name] = message;
}

export function addRequiredCheckGroup(errors: FormErrors, data: FormData, name: string, message: string) {
  if (data.getAll(name).length === 0) errors[name] = message;
}

export function addEmail(errors: FormErrors, data: FormData, name: string) {
  const value = valueOf(data, name);
  if (!value) errors[name] = "Enter an email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[name] = "Enter an email address in a valid format.";
}

export function addTelephone(errors: FormErrors, data: FormData, name: string) {
  const value = valueOf(data, name);
  if (!value) errors[name] = "Enter a telephone number.";
  else if (!/^\+?[0-9()\-\s.]{7,25}$/.test(value) || value.replace(/\D/g, "").length < 7) errors[name] = "Enter a valid telephone number with at least 7 digits.";
}

export function addOptionalUrl(errors: FormErrors, data: FormData, name: string) {
  const value = valueOf(data, name);
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
  } catch {
    errors[name] = "Enter a full valid URL beginning with http:// or https://.";
  }
}

export function addNumberRange(errors: FormErrors, data: FormData, name: string, label: string, minimum: number, maximum: number) {
  const value = valueOf(data, name);
  const number = Number(value);
  if (!value) errors[name] = `Enter ${label.toLowerCase()}.`;
  else if (!Number.isInteger(number) || number < minimum || number > maximum) errors[name] = `${label} must be a whole number from ${minimum} to ${maximum}.`;
}
