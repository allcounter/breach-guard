import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { checkRateLimit, _resetForTesting, type RateLimitResult } from '../lib/rate-limiter'

describe('checkRateLimit', () => {
  beforeEach(() => {
    _resetForTesting?.()
  })

  it('allows the first request from an IP', () => {
    const result = checkRateLimit('10.0.0.1')
    assert.equal(result.allowed, true)
  })

  it('allows a second request within the same second', () => {
    const ip = '10.0.0.2'
    checkRateLimit(ip) // 1st
    const result = checkRateLimit(ip) // 2nd
    assert.equal(result.allowed, true)
  })

  it('blocks the third request within the same second (burst limit)', () => {
    const ip = '10.0.0.3'
    checkRateLimit(ip) // 1st
    checkRateLimit(ip) // 2nd
    const result = checkRateLimit(ip) // 3rd — should be blocked
    assert.equal(result.allowed, false)
    assert.equal(result.limitType, 'burst')
    assert.ok(
      result.retryAfter !== undefined && result.retryAfter >= 1,
      `Expected retryAfter >= 1, got ${result.retryAfter}`
    )
  })

  it('does not affect different IPs', () => {
    const ipA = '10.0.0.4'
    const ipB = '10.0.0.5'
    checkRateLimit(ipA) // 1st for A
    checkRateLimit(ipA) // 2nd for A
    checkRateLimit(ipA) // 3rd for A — blocked

    // B should still be allowed
    const result = checkRateLimit(ipB)
    assert.equal(result.allowed, true)
  })

  it('returns RateLimitResult shape with allowed boolean', () => {
    const result: RateLimitResult = checkRateLimit('10.0.0.6')
    assert.equal(typeof result.allowed, 'boolean')
  })

  it('returns limitType "burst" when burst-limited', () => {
    const ip = '10.0.0.7'
    checkRateLimit(ip) // 1st
    checkRateLimit(ip) // 2nd
    const result = checkRateLimit(ip) // 3rd — burst blocked
    assert.equal(result.allowed, false)
    assert.equal(result.limitType, 'burst')
  })

  it('returns limitType "daily" when global daily limit hit', () => {
    // Use unique IPs (1 call each) to avoid burst limits.
    // Global quota is 90 — the 91st call should be blocked.
    for (let i = 0; i < 90; i++) {
      const result = checkRateLimit(`daily-test-${i}`)
      assert.equal(result.allowed, true, `Request ${i + 1} should be allowed`)
    }
    // 91st request with a new IP — global quota exhausted
    const result = checkRateLimit('daily-test-overflow')
    assert.equal(result.allowed, false)
    assert.equal(result.limitType, 'daily')
    assert.ok(
      result.retryAfter !== undefined && result.retryAfter > 0,
      `Expected retryAfter > 0, got ${result.retryAfter}`
    )
  })
})
