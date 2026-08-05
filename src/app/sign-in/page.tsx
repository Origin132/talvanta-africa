import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { safeNextPath } from "@/lib/auth/redirects";
import { createPageMetadata } from "@/lib/seo-metadata";
export const metadata: Metadata = createPageMetadata({ title: "Sign In | Talvanta Africa", description: "Sign in securely to your Talvanta Africa account.", path: "/sign-in" });
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) { const params = await searchParams; const next = safeNextPath(params.next); const admin = next === "/admin" || next.startsWith("/admin/"); return <AuthShell eyebrow="Account Access" title="Sign in to Talvanta Africa" intro="Access your account using the email address and password associated with your registration.">{admin ? <p className="mb-5 rounded-lg border border-border-grey bg-soft-grey p-4 font-semibold text-navy">Sign in to access this area.</p> : null}{params.error === "authentication_callback_failed" ? <p className="mb-5 rounded-lg border border-error-red/40 bg-red-50 p-4 font-semibold text-error-red" role="alert">We could not complete authentication. Please try signing in again.</p> : null}<AuthForm kind="sign-in" next={next} /></AuthShell>; }
