'use client'

import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createEmailSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { EnrichedBreach } from '@/lib/breach-metadata'
import type { BreachCheckResult } from '@/types/api'

function incrementCheckCount() {
  try {
    const current = parseInt(localStorage.getItem('breach-guard-check-count') || '0', 10)
    localStorage.setItem('breach-guard-check-count', String(current + 1))
    window.dispatchEvent(new CustomEvent('breach-guard-check'))
  } catch {
    // localStorage may be unavailable (private browsing, storage full)
  }
}

interface EmailFormError {
  type: 'validation' | 'rate_limited' | 'network' | 'api'
  message: string
}

interface EmailFormProps {
  onResults?: (breaches: EnrichedBreach[]) => void
  onLoading?: (loading: boolean) => void
  onError?: (error: EmailFormError | null) => void
}

export function EmailForm({ onResults, onLoading, onError }: EmailFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<EmailFormError | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const t = useTranslations('emailForm')
  const tv = useTranslations('validation')

  const setErrorState = useCallback(
    (err: EmailFormError | null) => {
      setError(err)
      onError?.(err)
    },
    [onError],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorState(null)

      const schema = createEmailSchema({
        required: tv('emailRequired'),
        invalid: tv('emailInvalid'),
        tooLong: tv('emailTooLong'),
      })
      const result = schema.safeParse({ email })
      if (!result.success) {
        setErrorState({
          type: 'validation',
          message: result.error.issues[0]?.message ?? tv('emailInvalid'),
        })
        return
      }

      setIsChecking(true)
      onLoading?.(true)

      try {
        const response = await fetch('/api/breach/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })

        if (response.status === 429) {
          setErrorState({
            type: 'rate_limited',
            message: t('errors.rateLimit'),
          })
          return
        }

        if (!response.ok) {
          setErrorState({
            type: 'api',
            message: t('errors.serviceUnavailable'),
          })
          return
        }

        const data = (await response.json()) as BreachCheckResult
        onResults?.(data.enrichedBreaches)
        incrementCheckCount()
      } catch {
        setErrorState({
          type: 'network',
          message: t('errors.network'),
        })
      } finally {
        setIsChecking(false)
        onLoading?.(false)
      }
    },
    [email, onResults, onLoading, setErrorState, t, tv],
  )

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder={t('placeholder')}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setErrorState(null)
          }}
          disabled={isChecking}
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
        />
        <Button type="submit" disabled={isChecking || !email.trim()} className="min-h-[44px]">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('checking')}
            </>
          ) : (
            t('submit')
          )}
        </Button>
      </div>
      {error && (
        <p id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error.message}
        </p>
      )}
    </form>
  )
}
