"use server";

import { redirect } from "next/navigation";
import { absoluteUrl } from "@/lib/site-url";
import { clearRecoveryIntent, hasRecoveryIntent } from "@/lib/auth/recovery";
import { safeNextPath } from "@/lib/auth/redirects";
import type { AuthActionState, AuthFieldErrors } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowed = (form: FormData, names: readonly string[]) =>
  [...form.keys()].every((key) => key.startsWith("$ACTION_") || names.includes(key));
const text = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
};
const fail = (message: string, errors?: AuthFieldErrors): AuthActionState => ({ status: "error", message, errors });

export async function signUp(_: AuthActionState, form: FormData): Promise<AuthActionState> {
  const names = ["fullName", "email", "password", "confirmPassword", "accountType", "terms"] as const;
  if (!allowed(form, names)) return fail("We could not create your account. Review the information provided and try again.");
  const fullName = text(form, "fullName");
  const email = text(form, "email").toLowerCase();
  const password = form.get("password");
  const confirmation = form.get("confirmPassword");
  const accountType = form.get("accountType");
  const errors: AuthFieldErrors = {};
  if (fullName.length < 2 || fullName.length > 100) errors.fullName = "Enter your full name (2 to 100 characters).";
  if (!EMAIL.test(email) || email.length > 254) errors.email = "Enter a valid email address.";
  if (typeof password !== "string" || password.length < 8 || password.length > 128) errors.password = "Use a password of 8 to 128 characters.";
  if (typeof confirmation !== "string" || confirmation !== password) errors.confirmPassword = "Passwords must match.";
  if (accountType !== "candidate" && accountType !== "employer") errors.accountType = "Select Candidate or Employer.";
  if (form.get("terms") !== "on") errors.terms = "You must agree to the Terms of Use and Privacy Information.";
  if (Object.keys(errors).length) return fail("Review the highlighted fields and try again.", errors);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: password as string,
    options: { data: { full_name: fullName, account_type: accountType }, emailRedirectTo: absoluteUrl("/auth/callback?next=/account") },
  });
  if (error) return fail("We could not create your account. Review the information provided and try again.");
  if (data.session) redirect("/account");
  return { status: "success", message: "We sent an account-verification link to the email address you provided. Open the message and follow the link to complete your account setup." };
}

export async function signIn(_: AuthActionState, form: FormData): Promise<AuthActionState> {
  if (!allowed(form, ["email", "password", "next"])) return fail("We could not sign you in with those details. Check your email address and password and try again.");
  const email = text(form, "email").toLowerCase();
  const password = form.get("password");
  const errors: AuthFieldErrors = {};
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (typeof password !== "string" || !password) errors.password = "Enter your password.";
  if (Object.keys(errors).length) return fail("Review the highlighted fields and try again.", errors);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: password as string });
  if (error) return fail("We could not sign you in with those details. Check your email address and password and try again.");
  redirect(safeNextPath(form.get("next")));
}

export async function requestPasswordReset(_: AuthActionState, form: FormData): Promise<AuthActionState> {
  const neutral = "If an eligible account exists for that email address, password-reset instructions have been sent.";
  if (!allowed(form, ["email"])) return { status: "success", message: neutral };
  const email = text(form, "email").toLowerCase();
  if (!EMAIL.test(email)) return fail("Enter a valid email address.", { email: "Enter a valid email address." });
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: absoluteUrl("/auth/callback?next=/reset-password") });
  return { status: "success", message: neutral };
}

export async function updatePassword(_: AuthActionState, form: FormData): Promise<AuthActionState> {
  if (!allowed(form, ["password", "confirmPassword"])) return fail("We could not update your password. Request a new reset link and try again.");
  const password = form.get("password");
  const confirmation = form.get("confirmPassword");
  const errors: AuthFieldErrors = {};
  if (typeof password !== "string" || password.length < 8 || password.length > 128) errors.password = "Use a password of 8 to 128 characters.";
  if (typeof confirmation !== "string" || confirmation !== password) errors.confirmPassword = "Passwords must match.";
  if (Object.keys(errors).length) return fail("Review the highlighted fields and try again.", errors);
  if (!(await hasRecoveryIntent())) return fail("We could not update your password. Request a new reset link and try again.");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail("We could not update your password. Request a new reset link and try again.");
  const { error } = await supabase.auth.updateUser({ password: password as string });
  if (error) return fail("We could not update your password. Request a new reset link and try again.");
  await clearRecoveryIntent();
  return { status: "success", message: "Your password has been changed successfully. You can now continue to your account." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearRecoveryIntent();
  redirect("/sign-in");
}
