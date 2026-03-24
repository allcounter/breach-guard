import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { BreachCheckResult, ApiError } from '../types/api'

describe('API types', () => {
  it('BreachCheckResult has exposed boolean and breaches string[]', () => {
    const result: BreachCheckResult = {
      exposed: true,
      breaches: ['Adobe', 'LinkedIn'],
      enrichedBreaches: [],
    }
    assert.equal(typeof result.exposed, 'boolean')
    assert.ok(Array.isArray(result.breaches))
    assert.equal(typeof result.breaches[0], 'string')
  })

  it('BreachCheckResult works with empty breaches', () => {
    const result: BreachCheckResult = {
      exposed: false,
      breaches: [],
      enrichedBreaches: [],
    }
    assert.equal(result.exposed, false)
    assert.equal(result.breaches.length, 0)
  })

  it('ApiError has error string', () => {
    const err: ApiError = { error: 'Something went wrong' }
    assert.equal(typeof err.error, 'string')
  })

  it('ApiError optionally has retryAfter number', () => {
    const err: ApiError = { error: 'Rate limited', retryAfter: 60 }
    assert.equal(typeof err.retryAfter, 'number')
  })
})
