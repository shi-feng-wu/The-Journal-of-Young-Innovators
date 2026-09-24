const allowedOriginsProd = new Set([
  "https://young-innovator.org",
  "https://www.young-innovator.org",
  "https://young-innovator.com",
  "https://www.young-innovator.com",
]);

// Any local port in development, so a second dev server works too.
const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (allowedOriginsProd.has(origin)) return true;
  return process.env.NODE_ENV !== "production" && localOrigin.test(origin);
}
