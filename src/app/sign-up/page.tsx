import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { createPageMetadata } from "@/lib/seo-metadata";
export const metadata: Metadata = createPageMetadata({ title: "Create an Account | Talvanta Africa", description: "Create a candidate or employer account with Talvanta Africa.", path: "/sign-up" });
export default function Page() { return <AuthShell eyebrow="Create an Account" title="Join Talvanta Africa" intro="Create an account to manage your professional or organisation information through a secure authenticated experience."><AuthForm kind="sign-up" /></AuthShell>; }
