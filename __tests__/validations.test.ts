import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { emailSchema, type EmailInput } from '../lib/validations'

describe('emailSchema', () => {
  it('accepts a valid email', () => {
    const result = emailSchema.safeParse({ email: 'user@example.com' })
    assert.equal(result.success, true)
  })

  it('rejects empty string with "Email is required"', () => {
    const result = emailSchema.safeParse({ email: '' })
    assert.equal(result.success, false)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message)
      assert.ok(
        messages.some((m) => m.includes('Email is required')),
        `Expected "Email is required" in ${JSON.stringify(messages)}`
      )
    }
  })

  it('rejects non-email string', () => {
    const result = emailSchema.safeParse({ email: 'notanemail' })
    assert.equal(result.success, false)
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message)
      assert.ok(
        messages.some((m) => m.toLowerCase().includes('valid email')),
        `Expected "valid email" in ${JSON.stringify(messages)}`
      )
    }
  })

  it('rejects email exceeding RFC 5321 max length (254 chars)', () => {
    const longEmail = 'a'.repeat(255) + '@test.com'
    const result = emailSchema.safeParse({ email: longEmail })
    assert.equal(result.success, false)
  })

  it('rejects missing email field', () => {
    const result = emailSchema.safeParse({})
    assert.equal(result.success, false)
  })

  it('EmailInput type is compatible with valid parsed data', () => {
    const result = emailSchema.safeParse({ email: 'test@example.com' })
    if (result.success) {
      const data: EmailInput = result.data
      assert.equal(typeof data.email, 'string')
    }
  })
})
