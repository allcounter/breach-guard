/**
 * Client-side HIBP Pwned Passwords k-Anonymity check.
 *
 * Flow:
 * 1. SHA-1 hash the password entirely in the browser (SubtleCrypto)
 * 2. Send only the first 5 hex characters to api.pwnedpasswords.com
 * 3. Receive all matching suffixes + breach counts
 * 4. Compare locally — the full hash never leaves the browser
 *
 * @see https://haveibeenpwned.com/API/v3#PwnedPasswords
 */

/** SHA-1 hash a string and return uppercase hex. */
export async function sha1Hash(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/**
 * Parse HIBP Pwned Passwords range response.
 *
 * Response format: CRLF-delimited lines of `SUFFIX:COUNT`.
 * With `Add-Padding: true`, some entries have count 0 (padding) — filter them out.
 */
export function parseHibpResponse(
  responseText: string,
  suffix: string
): { found: boolean; count: number } {
  const lines = responseText.split(/\r?\n/)
  for (const line of lines) {
    if (!line) continue
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const lineSuffix = line.slice(0, colonIndex)
    const countStr = line.slice(colonIndex + 1)
    if (lineSuffix === suffix) {
      const count = parseInt(countStr, 10)
      if (count > 0) return { found: true, count }
    }
  }
  return { found: false, count: 0 }
}

/**
 * Check if a password has been exposed in known data breaches.
 *
 * Uses the HIBP Pwned Passwords k-Anonymity model:
 * - Hashes password with SHA-1 client-side
 * - Sends only the 5-character prefix to HIBP
 * - Compares suffixes locally
 *
 * @returns `{ found: true, count: N }` if breached, `{ found: false, count: 0 }` if clean
 */
export async function checkPasswordBreach(
  password: string
): Promise<{ found: boolean; count: number }> {
  const hash = await sha1Hash(password)
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
    {
      headers: { 'Add-Padding': 'true' },
    }
  )

  if (!response.ok) {
    throw new Error(`HIBP API error: ${response.status}`)
  }

  const text = await response.text()
  return parseHibpResponse(text, suffix)
}
