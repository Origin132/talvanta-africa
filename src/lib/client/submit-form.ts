import type { SubmissionApiResponse } from "@/types/api";

export type ClientSubmissionResult = {
  status: number;
  response?: SubmissionApiResponse;
};

export async function submitFormJson(endpoint: string, payload: Record<string, unknown>): Promise<ClientSubmissionResult> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data: unknown;
  try { data = await response.json(); } catch { return { status: response.status }; }
  if (!data || typeof data !== "object" || !("success" in data)) return { status: response.status };
  return { status: response.status, response: data as SubmissionApiResponse };
}
