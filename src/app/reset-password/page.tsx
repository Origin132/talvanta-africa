import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { ButtonLink } from "@/components/ui/button";
import { hasRecoveryIntent } from "@/lib/auth/recovery";
import { createClient } from "@/lib/supabase/server";
export const metadata: Metadata = { title: "Update Password | Talvanta Africa", description: "Set a new password for your Talvanta Africa account.", robots: { index: false, follow: false } };
export default async function Page() { const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); const valid = Boolean(user) && await hasRecoveryIntent(); return <AuthShell eyebrow="Account Recovery" title={valid ? "Create a new password" : "Reset link unavailable"} intro={valid ? "Choose a new password for your Talvanta Africa account." : "This password-reset link is invalid, expired, or has already been used. Request a new password-reset email to continue."}>{valid ? <AuthForm kind="reset" /> : <><ButtonLink className="w-full" href="/forgot-password">Request Another Reset Link</ButtonLink><p className="mt-4 text-center text-sm"><Link className="font-bold text-green underline" href="/sign-in">Return to Sign In</Link></p></>}</AuthShell>; }
