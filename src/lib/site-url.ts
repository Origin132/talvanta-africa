const LOCAL_SITE_URL = "http://localhost:3000";

function normaliseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function vercelDeploymentUrl() {
  const value =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!value) return undefined;

  const candidate = value.startsWith("http") ? value : `https://${value}`;
  const url = new URL(candidate);
  if (url.protocol !== "https:") {
    throw new Error("Vercel deployment URLs must use HTTPS.");
  }
  return normaliseUrl(url.origin);
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      const isLocal = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
      if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocal)) {
        throw new Error("The site URL must use HTTPS outside local development.");
      }
      return normaliseUrl(url.toString());
    } catch (error) {
      if (process.env.VERCEL_ENV === "production") throw error;
    }
  }

  if (process.env.VERCEL === "1") {
    const vercelUrl = vercelDeploymentUrl();
    if (vercelUrl) return vercelUrl;
  }

  if (process.env.VERCEL_ENV === "production") {
    throw new Error(
      "A production site URL must be available from NEXT_PUBLIC_SITE_URL or Vercel.",
    );
  }

  return LOCAL_SITE_URL;
}

export function absoluteUrl(path = "/") {
  const pathname = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${getSiteUrl()}${pathname}`;
}
