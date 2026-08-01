"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp, requestPasswordReset, updatePassword } from "@/app/auth/actions";
import { Declaration, TextField } from "@/components/forms/form-controls";
import { Button, ButtonLink } from "@/components/ui/button";
import { initialAuthState, type AuthActionState } from "@/lib/auth/types";

type Kind = "sign-up" | "sign-in" | "forgot" | "reset";
const actions = { "sign-up": signUp, "sign-in": signIn, forgot: requestPasswordReset, reset: updatePassword };
const labels = { "sign-up": ["Create Account", "Creating Account..."], "sign-in": ["Sign In", "Signing In..."], forgot: ["Send Reset Instructions", "Sending..."], reset: ["Update Password", "Updating Password..."] } as const;

function Submit({ kind }: { kind: Kind }) {
  const { pending } = useFormStatus();
  return <Button className="w-full" type="submit" disabled={pending} aria-disabled={pending}>{pending ? labels[kind][1] : labels[kind][0]}</Button>;
}

function Status({ state, successTitle }: { state: AuthActionState; successTitle?: string }) {
  if (!state.message) return null;
  return <div className={`rounded-lg border p-4 ${state.status === "error" ? "border-error-red/40 bg-red-50 text-error-red" : "border-green/30 bg-green/5 text-navy"}`} role={state.status === "error" ? "alert" : "status"} aria-live="polite">{successTitle && state.status === "success" ? <h2 className="font-heading text-xl font-extrabold">{successTitle}</h2> : null}<p className={successTitle && state.status === "success" ? "mt-2" : "font-semibold"}>{state.message}</p>{kindlessExtra(state, successTitle)}</div>;
}
function kindlessExtra(state: AuthActionState, title?: string) {
  if (state.status !== "success" || title !== "Check your email") return null;
  return <p className="mt-2 text-sm">Didn’t receive the message? Check your spam or junk folder and confirm that the email address was entered correctly.</p>;
}

export function AuthForm({ kind, next = "/account" }: { kind: Kind; next?: string }) {
  const [state, action] = useActionState(actions[kind], initialAuthState);
  const e = state.errors ?? {};
  if (kind === "reset" && state.status === "success") return <><Status state={state} successTitle="Password updated" /><ButtonLink className="mt-5 w-full" href="/account">Continue to Account</ButtonLink></>;
  if (kind === "sign-up" && state.status === "success") return <Status state={state} successTitle="Check your email" />;
  return <form action={action} className="space-y-5" noValidate>
    <Status state={state} />
    {kind === "sign-up" ? <TextField label="Full Name" name="fullName" type="text" autoComplete="name" maxLength={100} required error={e.fullName} /> : null}
    {kind !== "reset" ? <TextField label="Email Address" name="email" type="email" autoComplete="email" maxLength={254} required error={e.email} /> : null}
    {kind === "sign-up" || kind === "sign-in" || kind === "reset" ? <TextField label={kind === "reset" ? "New Password" : "Password"} name="password" type="password" autoComplete={kind === "sign-in" ? "current-password" : "new-password"} minLength={kind === "sign-in" ? undefined : 8} maxLength={128} required error={e.password} helperText={kind === "sign-up" || kind === "reset" ? "Use at least 8 characters. Supabase may enforce additional project-level protections." : undefined} /> : null}
    {kind === "sign-up" || kind === "reset" ? <TextField label={kind === "reset" ? "Confirm New Password" : "Confirm Password"} name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required error={e.confirmPassword} /> : null}
    {kind === "sign-up" ? <fieldset aria-describedby={e.accountType ? "accountType-error" : undefined}><legend className="font-bold text-navy">Account Type <span className="text-error-red" aria-hidden="true">*</span></legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{[["candidate", "Candidate", "Create a professional account for profile management, career preferences, and future document handling."], ["employer", "Employer", "Create an organisation account for recruitment requests and future hiring management."]].map(([value, label, detail]) => <label key={value} className="flex cursor-pointer gap-3 rounded-lg border border-border-grey p-4 focus-within:border-green focus-within:ring-3 focus-within:ring-green/15"><input className="mt-1 size-5 accent-green" type="radio" name="accountType" value={value} required /><span><strong className="block text-navy">{label}</strong><span className="mt-1 block text-sm leading-6 text-slate">{detail}</span></span></label>)}</div>{e.accountType ? <p id="accountType-error" className="mt-2 font-semibold text-error-red">Error: {e.accountType}</p> : null}</fieldset> : null}
    {kind === "sign-up" ? <Declaration name="terms" required error={e.terms}>I have read and agree to the Terms of Use and Privacy Information.</Declaration> : null}
    {kind === "sign-up" ? <p className="-mt-3 text-sm text-slate">Read the <Link className="font-bold text-green underline" href="/terms">Terms of Use</Link> and <Link className="font-bold text-green underline" href="/privacy">Privacy Information</Link>.</p> : null}
    {kind === "sign-in" ? <input type="hidden" name="next" value={next} /> : null}
    <Submit kind={kind} />
    {kind === "sign-in" ? <div className="flex flex-wrap justify-between gap-3 text-sm"><Link className="font-bold text-green underline" href="/forgot-password">Forgot your password?</Link><Link className="font-bold text-green underline" href="/sign-up">Create an account</Link></div> : null}
  </form>;
}
