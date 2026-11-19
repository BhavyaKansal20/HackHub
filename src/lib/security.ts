/**
 * Security helpers for API routes — rate limiting, CSRF / origin checking,
 * and Content-Security-Policy header generation.
 *
 * Usage inside any API route handler:
 *   import { checkOrigin, addSecurityHeaders, rateLimit } from "@/lib/security";
 *   const rl = rateLimit(request, "my-action", 10, 60); // 10 req/min
 *   if (rl) return rl;
 *   checkOrigin(request); // throws on cross-origin POST
 */

const ALLOWED_ORIGINS = [
  "https://hackhub.thapar.edu",
  // For local dev:
  "http://localhost:8080",
  "http://localhost:3000",
];

/** Reject cross-origin mutating requests (CSRF mitigation). */
export function checkOrigin(request: Request): void {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") return;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const check = origin ?? (referer ? new URL(referer).origin : null);
  if (!check) return; // server-to-server (cron) — allow
  const host = new URL(request.url).origin;
  if (check === host) return; // same origin — allow
  if (ALLOWED_ORIGINS.includes(check)) return;
  throw new Response("Forbidden — cross-origin request", { status: 403 });
}

/** Add security response headers to any Response. */
export function addSecurityHeaders(res: Response): Response {
  const h = new Headers(res.headers);
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  h.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // TanStack Start requires inline scripts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

// In-memory rate limiter (per Nitro worker; resets on cold start).
// For production scale, replace with Upstash Redis or Supabase.
const rateLimitStore = new Map<string, { count: number; reset: number }>();

/**
 * Simple token-bucket rate limiter.
 * Returns a 429 Response if the limit is exceeded, or null to continue.
 *
 * @param request  Incoming request (used to extract IP from headers)
 * @param action   Bucket key — e.g. "sync", "fit", "evaluate"
 * @param max      Max requests allowed in the window
 * @param windowSec  Window size in seconds
 */
export function rateLimit(
  request: Request,
  action: string,
  max: number,
  windowSec: number,
): Response | null {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.reset) {
    rateLimitStore.set(key, { count: 1, reset: now + windowSec * 1000 });
    return null;
  }
  if (entry.count >= max) {
    const retryAfter = Math.ceil((entry.reset - now) / 1000);
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(max),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(entry.reset / 1000)),
      },
    });
  }
  entry.count++;
  return null;
}

/** Prune stale rate-limit entries to avoid unbounded memory growth. */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.reset) rateLimitStore.delete(key);
  }
}, 60_000);
