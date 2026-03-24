'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not available')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), resetDelay)
    } catch (err) {
      console.error('Failed to copy to clipboard')
    }
  }, [resetDelay])

  return { copied, copy }
}
