export type SupabaseEnvironment = Readonly<{
  url: string;
  publishableKey: string;
}>;

function configurationError(message: string) {
  return new Error(`Supabase configuration error: ${message}`);
}

function validatedProjectUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw configurationError("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
  }

  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  const isSupabaseProject =
    url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  const isLocalDevelopment =
    process.env.NODE_ENV !== "production" &&
    isLocalHost &&
    ["http:", "https:"].includes(url.protocol);

  if (!isSupabaseProject && !isLocalDevelopment) {
    throw configurationError(
      process.env.NODE_ENV === "production"
        ? "NEXT_PUBLIC_SUPABASE_URL must be an HTTPS Supabase project URL."
        : "NEXT_PUBLIC_SUPABASE_URL must be an HTTPS Supabase project URL or a localhost URL in development.",
    );
  }

  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw configurationError(
      "NEXT_PUBLIC_SUPABASE_URL must contain only the project origin.",
    );
  }

  return url.origin;
}

export function getSupabaseEnvironment(): SupabaseEnvironment {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!rawUrl) {
    throw configurationError("NEXT_PUBLIC_SUPABASE_URL is required.");
  }
  if (!publishableKey) {
    throw configurationError(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required.",
    );
  }

  return {
    url: validatedProjectUrl(rawUrl),
    publishableKey,
  };
}
