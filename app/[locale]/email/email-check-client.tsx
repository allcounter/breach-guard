'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { EmailForm } from '@/components/email-form'
import { BreachResults } from '@/components/breach-results'
import { BreachGuidance } from '@/components/breach-guidance'
import { BreachTimeline } from '@/components/breach-timeline'
import type { EnrichedBreach } from '@/lib/breach-metadata'

export function EmailCheckClient() {
  const [results, setResults] = useState<EnrichedBreach[] | null>(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)
  const tc = useTranslations('common')

  function handleResults(breaches: EnrichedBreach[]) {
    setResults(breaches)
    setHasChecked(true)
    setCheckCount(c => c + 1)
  }

  // Move focus to results after each check — supports re-checking (checkCount increments each time)
  // tabIndex={-1} on the results div makes it programmatically focusable without entering tab order
  useEffect(() => {
    if (checkCount > 0 && resultsRef.current) {
      resultsRef.current.focus()
    }
  }, [checkCount])

  return (
    <div className="space-y-6">
      <EmailForm onResults={handleResults} />

      {hasChecked && results !== null && (
        <>
          {/* tabIndex={-1}: programmatically focusable, not in sequential tab order */}
          {/* outline-none: removes browser focus ring on container (ring stays on interactive children) */}
          <div ref={resultsRef} tabIndex={-1} className="outline-none space-y-6">
            <BreachGuidance breaches={results} />
            <BreachResults breaches={results} />
            {results.filter(b => b.date !== null).length >= 2 && (
              <BreachTimeline breaches={results} />
            )}
          </div>

          {/* XposedOrNot attribution */}
          <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            {tc.rich('attribution.xon', {
              provider: (chunks) => (
                <a
                  href="https://xposedornot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </>
      )}
    </div>
  )
}
