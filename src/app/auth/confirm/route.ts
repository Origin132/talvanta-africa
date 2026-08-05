import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/redirects";
import { setRecoveryIntent } from "@/lib/auth/recovery";
import { createClient } from "@/lib/supabase/server";

const confirmationTypes = ["email", "recovery"] as const satisfies readonly EmailOtpType[];
type ConfirmationType = (typeof confirmationTypes)[number];

const destinations: Record<ConfirmationType, string> = {
  email: "/account",
  recovery: "/reset-password",
};

function isConfirmationType(value: string | null): value is ConfirmationType {
  return confirmationTypes.some((type) => type === value);
}

function failureUrl(type: string | null, origin: string) {
  const recovery = type === "recovery";
  const url = new URL(recovery ? "/reset-password" : "/verify-email", origin);
  url.searchParams.set(
    "error",
    recovery ? "recovery_confirmation_failed" : "email_confirmation_failed",
  );
  return url;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const tokenHashes = url.searchParams.getAll("token_hash");
  const types = url.searchParams.getAll("type");
  const nextValues = url.searchParams.getAll("next");
  const expected = [...url.searchParams.keys()].every((key) =>
    ["token_hash", "type", "next"].includes(key),
  );
  const tokenHash = tokenHashes.length === 1 ? tokenHashes[0] : null;
  const type = types.length === 1 ? types[0] : null;
  const rawNext = nextValues.length === 1 ? nextValues[0] : null;
  const failureType = types.includes("recovery") ? "recovery" : type;

  if (!expected || !tokenHash || !isConfirmationType(type) || !rawNext) {
    return NextResponse.redirect(failureUrl(failureType, url.origin));
  }

  const next = safeNextPath(rawNext, "");
  if (!next || next !== destinations[type]) {
    return NextResponse.redirect(failureUrl(type, url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) return NextResponse.redirect(failureUrl(type, url.origin));
  if (type === "recovery") await setRecoveryIntent();

  return NextResponse.redirect(new URL(next, url.origin));
}
