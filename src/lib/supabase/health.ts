import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "@/lib/supabase/env";

export type SupabaseConfigurationStatus = Readonly<{
  configured: true;
}>;

export function checkSupabaseConfiguration(): SupabaseConfigurationStatus {
  const { url, publishableKey } = getSupabaseEnvironment();

  createSupabaseClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return { configured: true };
}
