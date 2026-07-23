import { getMockTaliaResponse } from "@/lib/talia/talia-matcher";
import {
  hasSameOrigin,
  isRateLimited,
} from "@/lib/server/submission-security";
import {
  TALIA_MAX_BODY_BYTES,
  validateTaliaRequest,
} from "@/lib/server/talia-validation";
import type { TaliaApiResponse } from "@/lib/talia/talia-types";

const TALIA_RATE_LIMIT = 15;

function json(body: TaliaApiResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function failure(message: string, status: number, headers?: HeadersInit) {
  return json({ success: false, message }, status, headers);
}

export async function POST(request: Request) {
  try {
    if (!hasSameOrigin(request)) {
      return failure("The message could not be processed.", 400);
    }

    if (
      !request.headers
        .get("content-type")
        ?.toLowerCase()
        .startsWith("application/json")
    ) {
      return failure("This endpoint accepts application/json requests only.", 415);
    }

    const declaredLength = Number(request.headers.get("content-length") ?? "0");
    if (
      Number.isFinite(declaredLength) &&
      declaredLength > TALIA_MAX_BODY_BYTES
    ) {
      return failure("The message is too large to process.", 413);
    }

    const rawBody = await request.text();
    if (!rawBody) {
      return failure("The message could not be processed.", 400);
    }
    if (new TextEncoder().encode(rawBody).byteLength > TALIA_MAX_BODY_BYTES) {
      return failure("The message is too large to process.", 413);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return failure("The message could not be processed.", 400);
    }

    const result = validateTaliaRequest(parsed);
    if (!result.valid) {
      return json(
        {
          success: false,
          message: "The message could not be processed.",
          fieldErrors: { messages: result.fieldError },
        },
        422,
      );
    }

    if (await isRateLimited(request, "talia", TALIA_RATE_LIMIT)) {
      return failure(
        "Talia has received several requests. Please wait a few minutes before trying again.",
        429,
        { "Retry-After": "600" },
      );
    }

    const latestMessage = result.messages.at(-1);
    if (!latestMessage) {
      return failure("The message could not be processed.", 400);
    }

    const response = getMockTaliaResponse(latestMessage.content);
    return json(
      {
        success: true,
        message: { role: "assistant", ...response },
      },
      200,
    );
  } catch {
    const correlationId = crypto.randomUUID();
    console.error(
      `[talia-error] endpoint=talia category=unexpected correlation=${correlationId}`,
    );
    return failure("Talia could not respond. Please try again.", 500);
  }
}
