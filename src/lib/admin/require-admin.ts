import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type AdminAccessResult =
  | { status: "ready"; user: User }
  | { status: "forbidden" }
  | { status: "error" };

export async function requireAdmin(
  nextPath = "/admin",
): Promise<AdminAccessResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: hasRole, error: roleError } = await supabase.rpc("has_role", {
    requested_role: "admin",
  });

  if (roleError) return { status: "error" };
  if (!hasRole) return { status: "forbidden" };
  return { status: "ready", user };
}
