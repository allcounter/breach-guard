import { createHash } from 'node:crypto'

/** SHA-256 hash for cache key derivation. Server-side only. NOT for passwords. */
export function hashCacheKey(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex')
}
