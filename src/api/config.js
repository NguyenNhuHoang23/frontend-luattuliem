const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.API_URL ||
  "/api";

export const API_URL = String(rawApiUrl).replace(/\/$/, "");

function apiOrigin() {
  if (/^https?:\/\//i.test(API_URL)) {
    return API_URL;
  }
  if (typeof window === "undefined") {
    return API_URL;
  }
  return `${window.location.origin}${API_URL.startsWith("/") ? API_URL : `/${API_URL}`}`;
}

/** Laravel still emits localhost:8000 when Dev Tunnel rewrites Host. */
export function rewriteMediaUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }
  return url.replace(
    /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/api/gi,
    apiOrigin(),
  );
}

export function rewriteMediaTree(value) {
  if (typeof value === "string") {
    return rewriteMediaUrl(value);
  }
  if (Array.isArray(value)) {
    return value.map(rewriteMediaTree);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, rewriteMediaTree(nested)]),
    );
  }
  return value;
}
