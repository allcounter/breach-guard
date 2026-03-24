import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limiter'
import { emailSchema } from '@/lib/validations'
import { enrichBreachList } from '@/lib/breach-metadata'
import { hashCacheKey } from '@/lib/hash'
import type { BreachCheckResult, ApiError } from '@/types/api'

// --- Response cache (MAIL-04) ---
// Module-level Map persists across requests in the same serverless instance.
// Key: SHA-256 hash of email, Value: { data, timestamp }.
const responseCache = new Map<string, { data: BreachCheckResult; timestamp: number }>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

function getCachedResponse(email: string): BreachCheckResult | null {
  const key = hashCacheKey(email)
  const cached = responseCache.get(key)
  if (!cached) return null
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key)
    return null
  }
  return cached.data
}

function setCachedResponse(email: string, data: BreachCheckResult): void {
  const key = hashCacheKey(email)
  responseCache.set(key, { data, timestamp: Date.now() })
  // Evict stale entries periodically (keep cache bounded).
  if (responseCache.size > 500) {
    const now = Date.now()
    for (const [k, v] of responseCache) {
      if (now - v.timestamp > CACHE_TTL_MS) {
        responseCache.delete(k)
      }
    }
  }
}

// CSRF protection: verify the request originates from our own domain.
// Browsers always send Origin on cross-origin POST requests.
// If Origin is absent (same-origin or non-browser client), we allow the request.
function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // same-origin requests and curl/Postman don't send Origin
  const host = request.headers.get('host')
  if (!host) return false
  try {
    const originHost = new URL(origin).host
    return originHost === host
  } catch {
    return false
  }
}

// Helper: extract client IP from request headers.
// On Vercel: x-vercel-forwarded-for is set by Vercel infrastructure (harder to spoof).
// On other hosts: fall back to x-forwarded-for (first value) or x-real-ip.
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<BreachCheckResult | ApiError>> {
  // Step 0: CSRF check — reject cross-origin POST requests.
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { error: 'Forbidden' } satisfies ApiError,
      { status: 403 },
    )
  }

  // Step 1: Rate limit check (FNDN-05).
  const ip = getClientIp(request)
  const rateLimitResult = checkRateLimit(ip)

  if (!rateLimitResult.allowed) {
    const retryAfterSeconds = rateLimitResult.retryAfter ?? 60
    const errorMessage =
      rateLimitResult.limitType === 'burst'
        ? 'Too many requests. Please wait a few seconds.'
        : `We've reached our daily limit. Please try again in ${Math.ceil(retryAfterSeconds / 3600)} ${Math.ceil(retryAfterSeconds / 3600) === 1 ? 'hour' : 'hours'}.`
    return NextResponse.json(
      {
        error: errorMessage,
        retryAfter: retryAfterSeconds,
      } satisfies ApiError,
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
        },
      },
    )
  }

  // Step 2: Parse and validate request body (FNDN-06).
  let body: unknown
  try {
    body = await request.json()
  } catch {
    // FNDN-07: no user data in error responses
    return NextResponse.json(
      { error: 'Invalid request body' } satisfies ApiError,
      { status: 400 },
    )
  }

  const parsed = emailSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email address' } satisfies ApiError,
      { status: 422 },
    )
  }

  const { email } = parsed.data

  // Step 2.5: Check cache (MAIL-04) — cached hits don't count against rate limit.
  const cached = getCachedResponse(email)
  if (cached) {
    return NextResponse.json(cached)
  }

  // Step 3: Proxy to XposedOrNot API (FNDN-04, FNDN-07).
  // FNDN-07 compliance: email appears only in the encoded URL, never in log strings.
  try {
    const upstream = await fetch(
      `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      },
    )

    // XposedOrNot returns HTTP 404 when the email is NOT in any breach database.
    if (upstream.status === 404) {
      const result: BreachCheckResult = { exposed: false, breaches: [], enrichedBreaches: [] }
      setCachedResponse(email, result)
      return NextResponse.json(result)
    }

    // XposedOrNot rate limit (MAIL-06).
    // Forward the upstream Retry-After header when present; fall back to 3600s.
    if (upstream.status === 429) {
      const upstreamRetryAfter = upstream.headers.get('Retry-After')
      const retryAfterSeconds =
        upstreamRetryAfter && /^\d+$/.test(upstreamRetryAfter)
          ? parseInt(upstreamRetryAfter, 10)
          : 3600
      return NextResponse.json(
        {
          error: 'Service rate limited. Please try again in a few hours.',
          retryAfter: retryAfterSeconds,
        } satisfies ApiError,
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
      )
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again shortly.' } satisfies ApiError,
        { status: 502 },
      )
    }

    const data: unknown = await upstream.json()

    // Validate upstream response structure before processing.
    // XposedOrNot response shape: { "breaches": [["Adobe", "LinkedIn"]], "email": "..." }
    const rawBreaches = (data as Record<string, unknown>)?.breaches
    const breachArrays = Array.isArray(rawBreaches) ? rawBreaches : []
    // Flatten and filter to strings only — defensive against upstream API changes.
    const breachNames: string[] = breachArrays
      .flat()
      .filter((item): item is string => typeof item === 'string')

    // Enrich with curated metadata (GUID-03, GUID-04).
    const enrichedBreaches = enrichBreachList(breachNames)

    const result: BreachCheckResult = {
      exposed: breachNames.length > 0,
      breaches: breachNames,
      enrichedBreaches,
    }

    setCachedResponse(email, result)
    return NextResponse.json(result)
  } catch {
    // FNDN-07: catch block must NOT reference `email` variable.
    return NextResponse.json(
      { error: 'Could not check for breaches. Please try again shortly.' } satisfies ApiError,
      { status: 500 },
    )
  }
}
