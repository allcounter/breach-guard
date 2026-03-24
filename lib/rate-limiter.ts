// lib/rate-limiter.ts
// In-memory rate limiter for /api/breach/email Route Handler.
//
// Dual constraint matching XposedOrNot API limits:
//   - 2 requests per second (burst limit)
//   - 100 requests per day per server IP — we use 90 to leave buffer
//
// ARCHITECTURE NOTE: This Map is module-level and persists across requests
// within the same Node.js/serverless instance. On Vercel Hobby tier, a cold start
// resets state — this is a known tradeoff accepted in exchange for zero infrastructure cost.
// The limiter is best-effort: it prevents abuse during warm periods and protects the
// upstream quota for most usage patterns.

export interface RateLimitResult {
  allowed: boolean
  retryAfter?: number // seconds until caller should retry
  limitType?: 'burst' | 'daily' // which limit was hit (only set when allowed=false)
}

interface IpRecord {
  // Sliding window: timestamps (ms) of requests within the last 1 second
  secondWindow: number[]
}

// Module-level singleton — DO NOT move inside checkRateLimit.
// This Map persists across multiple requests in the same process instance.
const ipMap = new Map<string, IpRecord>()

// Global daily quota — shared across ALL IPs because the upstream XposedOrNot
// API quota (100 req/day) is per server IP, not per client.
let globalDayCount = 0
let globalDayWindowStart = Date.now()

const SECOND_LIMIT = 2 // XposedOrNot: 2 req/sec
const DAY_LIMIT = 90 // XposedOrNot: 100 req/day — using 90 as safety buffer
const DAY_MS = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Periodic cleanup: evict stale burst records every 10 minutes to prevent unbounded growth.
// Guard prevents errors in environments where setInterval is not available.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of ipMap.entries()) {
      const secondExpired = record.secondWindow.every((ts) => now - ts > 1000)
      if (secondExpired) {
        ipMap.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now()

  // Reset global daily window if it has expired (rolling 24h, not calendar day).
  if (now - globalDayWindowStart > DAY_MS) {
    globalDayCount = 0
    globalDayWindowStart = now
  }

  // Check global daily quota first — this protects the server's upstream API quota.
  if (globalDayCount >= DAY_LIMIT) {
    const windowResetAt = globalDayWindowStart + DAY_MS
    const retryAfter = Math.ceil((windowResetAt - now) / 1000)
    return { allowed: false, retryAfter, limitType: 'daily' }
  }

  const existing = ipMap.get(ip)

  if (!existing) {
    // First request from this IP — initialize record and allow.
    ipMap.set(ip, { secondWindow: [now] })
    globalDayCount++
    return { allowed: true }
  }

  // Evict timestamps from secondWindow that are older than 1 second.
  existing.secondWindow = existing.secondWindow.filter((ts) => now - ts < 1000)

  // Check per-second burst limit.
  if (existing.secondWindow.length >= SECOND_LIMIT) {
    const oldestInWindow = existing.secondWindow[0]
    // oldestInWindow is always defined here: secondWindow.length >= 2 means at least 2 elements.
    // TypeScript noUncheckedIndexedAccess requires the undefined guard.
    if (oldestInWindow !== undefined) {
      const retryAfter = Math.ceil((1000 - (now - oldestInWindow)) / 1000)
      return { allowed: false, retryAfter: Math.max(retryAfter, 1), limitType: 'burst' }
    }
  }

  // Request is allowed — record it.
  existing.secondWindow.push(now)
  globalDayCount++
  return { allowed: true }
}

/** Reset all state — test-only, not exported in production builds. */
export const _resetForTesting: (() => void) | undefined =
  process.env.NODE_ENV === 'test'
    ? () => {
        ipMap.clear()
        globalDayCount = 0
        globalDayWindowStart = Date.now()
      }
    : undefined
