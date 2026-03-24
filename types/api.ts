// Shared API response types — used by Route Handler responses and future client code.

import type { EnrichedBreach } from '@/lib/breach-metadata'

// The normalized shape returned by /api/breach/email.
// XposedOrNot returns { breaches: [["Adobe","LinkedIn"]] } (nested array-of-arrays).
// The Route Handler flattens this to a simple string[].
// enrichedBreaches adds curated metadata (severity, guidance, data types) per breach.
export interface BreachCheckResult {
  exposed: boolean
  breaches: string[]
  enrichedBreaches: EnrichedBreach[]
}

// Standard error response shape for all /api/* routes.
// retryAfter is included on 429 responses (seconds until retry is safe).
export interface ApiError {
  error: string
  retryAfter?: number
}
