'use client'

import { useState, useCallback, useRef } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PasswordStrength } from '@/components/password-strength'
import { checkPasswordBreach } from '@/lib/hibp'
import { loadZxcvbn, evaluatePassword } from '@/lib/zxcvbn-loader'
import type { ZxcvbnResult } from '@/lib/zxcvbn-loader'

function incrementCheckCount() {
  try {
    const current = parseInt(localStorage.getItem('breach-guard-check-count') || '0', 10)
    localStorage.setItem('breach-guard-check-count', String(current + 1))
    window.dispatchEvent(new CustomEvent('breach-guard-check'))
  } catch {
    // localStorage may be unavailable (private browsing, storage full)
  }
}

export function PasswordForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [zxcvbnResult, setZxcvbnResult] = useState<ZxcvbnResult | null>(null)
  const [breachResult, setBreachResult] = useState<{
    found: boolean
    count: number
  } | null>(null)
  const [isCheckingBreach, setIsCheckingBreach] = useState(false)
  const [zxcvbnReady, setZxcvbnReady] = useState(false)
  const [zxcvbnLoading, setZxcvbnLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)
  const t = useTranslations('passwordForm')
  const tc = useTranslations('common')

  const handleFocus = useCallback(async () => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    setZxcvbnLoading(true)
    try {
      await loadZxcvbn()
      setZxcvbnReady(true)
      // Evaluate current password if user already typed something before focus
      if (password) {
        setZxcvbnResult(evaluatePassword(password))
      }
    } finally {
      setZxcvbnLoading(false)
    }
  }, [password])

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value)
      setError(null)
      // Clear breach result when password changes
      setBreachResult(null)
      // Live strength update
      if (zxcvbnReady) {
        setZxcvbnResult(value ? evaluatePassword(value) : null)
      }
    },
    [zxcvbnReady]
  )

  const handleCheckBreaches = useCallback(async () => {
    if (!password.trim()) return
    setIsCheckingBreach(true)
    setError(null)
    try {
      const result = await checkPasswordBreach(password)
      setBreachResult(result)
      incrementCheckCount()
    } catch {
      setError(t('errors.network'))
    } finally {
      setIsCheckingBreach(false)
    }
  }, [password, t])

  return (
    <div className="space-y-4">
      {/* Password input with visibility toggle */}
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={t('placeholder')}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onFocus={handleFocus}
          className="pr-10"
          autoComplete="off"
          aria-label={t('ariaLabel')}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {/* Loading indicator for zxcvbn */}
      {zxcvbnLoading && (
        <p className="text-xs text-zinc-400">
          {t('loadingStrength')}
        </p>
      )}

      {/* Check Breaches button */}
      <Button
        onClick={handleCheckBreaches}
        disabled={!password.trim() || isCheckingBreach}
        className="w-full min-h-[44px]"
      >
        {isCheckingBreach ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('checking')}
          </>
        ) : (
          t('checkBreaches')
        )}
      </Button>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Results */}
      <PasswordStrength
        result={zxcvbnResult}
        breachResult={breachResult}
        isCheckingBreach={isCheckingBreach}
      />

      {/* HIBP attribution */}
      {(breachResult || isCheckingBreach) && (
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
          {tc.rich('attribution.hibp', {
            provider: (chunks) => (
              <a
                href="https://haveibeenpwned.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      )}
    </div>
  )
}
