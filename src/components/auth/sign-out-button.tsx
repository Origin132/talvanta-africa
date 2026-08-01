"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="outline" disabled={pending}>{pending ? "Signing Out..." : "Sign Out"}</Button>;
}

export function SignOutButton() { return <form action={signOut}><Submit /></form>; }
