import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { createPageMetadata } from "@/lib/seo-metadata";
export const metadata: Metadata = createPageMetadata({ title: "Reset Password | Talvanta Africa", description: "Request password-reset instructions for your Talvanta Africa account.", path: "/forgot-password" });
export default function Page() { return <AuthShell eyebrow="Account Recovery" title="Reset your password" intro="Enter the email address associated with your Talvanta Africa account. If an eligible account exists, password-reset instructions will be sent to that address."><AuthForm kind="forgot" /></AuthShell>; }
