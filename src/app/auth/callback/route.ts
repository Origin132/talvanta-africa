import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth/redirects";
import { setRecoveryIntent } from "@/lib/auth/recovery";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));
  const expected = [...url.searchParams.keys()].every((key) => key === "code" || key === "next");
  if (!code || !expected) return NextResponse.redirect(new URL("/sign-in?error=authentication_callback_failed", url.origin));
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/sign-in?error=authentication_callback_failed", url.origin));
  if (next === "/reset-password") await setRecoveryIntent();
  return NextResponse.redirect(new URL(next, url.origin));
}
