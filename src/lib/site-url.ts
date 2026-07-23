const LOCAL_SITE_URL = "http://localhost:3000";

function normaliseUrl(value: string) {
  return value.replace(/\/+$/, "");
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

  if (process.env.VERCEL_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be configured for production.");
  }

  return LOCAL_SITE_URL;
}

export function absoluteUrl(path = "/") {
  const pathname = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${getSiteUrl()}${pathname}`;
}
