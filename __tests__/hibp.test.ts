import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { parseHibpResponse } from '../lib/hibp'

// Helper: SHA-1 using Node's crypto (to verify expected values)
function nodeSha1(text: string): string {
  return createHash('sha1').update(text).digest('hex').toUpperCase()
}

describe('SHA-1 known test vectors', () => {
  it('produces correct hash for "password"', () => {
    const hash = nodeSha1('password')
    assert.equal(hash, '5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8')
  })

  it('produces correct hash for empty string', () => {
    const hash = nodeSha1('')
    assert.equal(hash, 'DA39A3EE5E6B4B0D3255BFEF95601890AFD80709')
  })

  it('produces uppercase hex', () => {
    const hash = nodeSha1('test')
    assert.match(hash, /^[0-9A-F]+$/)
  })

  it('produces exactly 40 hex characters', () => {
    const hash = nodeSha1('anything')
    assert.equal(hash.length, 40)
  })
})

describe('parseHibpResponse', () => {
  it('finds a matching suffix with count', () => {
    const response = 'ABC1234:5\r\nDEF5678:10\r\nGHI9012:0\r\n'
    const result = parseHibpResponse(response, 'DEF5678')
    assert.deepEqual(result, { found: true, count: 10 })
  })

  it('returns not found for non-matching suffix', () => {
    const response = 'ABC1234:5\r\nDEF5678:10\r\n'
    const result = parseHibpResponse(response, 'ZZZZZZZ')
    assert.deepEqual(result, { found: false, count: 0 })
  })

  it('filters out padded entries (count = 0)', () => {
    const response = 'ABC1234:0\r\n'
    const result = parseHibpResponse(response, 'ABC1234')
    assert.deepEqual(result, { found: false, count: 0 })
  })

  it('handles empty response', () => {
    const result = parseHibpResponse('', 'ABC1234')
    assert.deepEqual(result, { found: false, count: 0 })
  })

  it('handles large counts', () => {
    const response = 'ABCDEF1234567890ABCDEF1234567890ABCDE:9876543\r\n'
    const result = parseHibpResponse(
      response,
      'ABCDEF1234567890ABCDEF1234567890ABCDE'
    )
    assert.deepEqual(result, { found: true, count: 9876543 })
  })

  it('handles response without trailing CRLF', () => {
    const response = 'ABC1234:5\r\nDEF5678:10'
    const result = parseHibpResponse(response, 'DEF5678')
    assert.deepEqual(result, { found: true, count: 10 })
  })

  it('handles LF-only line endings', () => {
    const response = 'ABC1234:5\nDEF5678:10\n'
    const result = parseHibpResponse(response, 'DEF5678')
    assert.deepEqual(result, { found: true, count: 10 })
  })

  it('correctly extracts 5-char prefix from known hash', () => {
    // "password" SHA-1 = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
    // Prefix: 5BAA6, Suffix: 1E4C9B93F3F0682250B6CF8331B7EE68FD8
    const hash = nodeSha1('password')
    const prefix = hash.slice(0, 5)
    const suffix = hash.slice(5)

    assert.equal(prefix, '5BAA6')
    assert.equal(suffix, '1E4C9B93F3F0682250B6CF8331B7EE68FD8')
    assert.equal(prefix.length, 5)
    assert.equal(suffix.length, 35)
  })
})
