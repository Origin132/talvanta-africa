import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ButtonLink } from "@/components/ui/button";
export const metadata: Metadata = { title: "Verify Your Email | Talvanta Africa", description: "Complete email verification for your Talvanta Africa account.", robots: { index: false, follow: false } };
export default function Page() { return <AuthShell eyebrow="Account Verification" title="Verify your email address" intro="Your Talvanta Africa account requires email verification before account access is completed."><div className="space-y-4 leading-7 text-slate"><p>Open the verification email and follow its secure link. If it is not in your inbox, check your spam or junk folder.</p><p>After verification, return to Sign In if you are not taken directly to your account.</p><ButtonLink className="w-full" href="/sign-in">Return to Sign In</ButtonLink></div></AuthShell>; }
