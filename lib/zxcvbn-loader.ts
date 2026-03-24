/**
 * Lazy-loaded zxcvbn-ts singleton.
 *
 * zxcvbn-ts + dictionaries are ~400KB — we don't want them in the initial bundle.
 * This module loads everything on first call to loadZxcvbn(), then caches it.
 *
 * Usage:
 * 1. Call loadZxcvbn() on password field focus (triggers lazy load)
 * 2. Call evaluatePassword(password) on each keystroke (returns null if not loaded yet)
 *
 * @see https://zxcvbn-ts.github.io/zxcvbn/guide/lazy-loading/
 */
import type { ZxcvbnResult } from '@zxcvbn-ts/core'

let zxcvbnLoaded = false
let zxcvbnFn: ((password: string) => ZxcvbnResult) | null = null

/**
 * Lazy-load zxcvbn-ts core + language packs.
 * Safe to call multiple times — only loads once.
 */
export async function loadZxcvbn(): Promise<void> {
  if (zxcvbnLoaded) return

  const [{ zxcvbn, zxcvbnOptions }, commonPkg, enPkg] = await Promise.all([
    import('@zxcvbn-ts/core'),
    import('@zxcvbn-ts/language-common'),
    import('@zxcvbn-ts/language-en'),
  ])

  zxcvbnOptions.setOptions({
    dictionary: {
      ...commonPkg.dictionary,
      ...enPkg.dictionary,
    },
    graphs: commonPkg.adjacencyGraphs,
    translations: enPkg.translations,
  })

  zxcvbnFn = zxcvbn
  zxcvbnLoaded = true
}

/**
 * Evaluate password strength. Returns null if zxcvbn hasn't loaded yet or password is empty.
 */
export function evaluatePassword(password: string): ZxcvbnResult | null {
  if (!zxcvbnFn || !password) return null
  return zxcvbnFn(password)
}

export type { ZxcvbnResult }
