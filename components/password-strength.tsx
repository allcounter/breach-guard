'use client'

import type { ZxcvbnResult } from '@/lib/zxcvbn-loader'
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

interface PasswordStrengthProps {
  result: ZxcvbnResult | null
  breachResult: { found: boolean; count: number } | null
  isCheckingBreach: boolean
}

const SCORE_COLORS = [
  'bg-red-500',
  'bg-red-400',
  'bg-amber-400',
  'bg-green-500',
  'bg-emerald-500',
] as const

const SCORE_TEXT_COLORS = [
  'text-red-600',
  'text-red-500',
  'text-amber-600',
  'text-green-600',
  'text-emerald-600',
] as const

export function PasswordStrength({
  result,
  breachResult,
  isCheckingBreach,
}: PasswordStrengthProps) {
  const t = useTranslations('passwordStrength')

  if (!result && !breachResult && !isCheckingBreach) return null

  return (
    <Card className="mt-4">
      <CardContent className="space-y-4">
        {/* Strength meter */}
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">{t('strength')}</span>
              <span className={`font-medium ${SCORE_TEXT_COLORS[result.score]}`}>
                {t(`scores.${result.score}` as 'scores.0' | 'scores.1' | 'scores.2' | 'scores.3' | 'scores.4')}
              </span>
            </div>

            {/* 5-segment bar */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i <= result.score
                      ? SCORE_COLORS[result.score]
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            {/* Crack time */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t('crackTime', { time: result.crackTimesDisplay.offlineSlowHashing1e4PerSecond })}
            </p>

            {/* Feedback: warning + suggestions */}
            {(result.feedback.warning || result.feedback.suggestions.length > 0) && (
              <div className="space-y-1 rounded-md bg-zinc-50 p-3 text-sm dark:bg-zinc-900">
                {result.feedback.warning && (
                  <p className="font-medium text-amber-700 dark:text-amber-400">
                    {result.feedback.warning}
                  </p>
                )}
                {result.feedback.suggestions.length > 0 && (
                  <ul className="list-disc space-y-0.5 pl-4 text-zinc-600 dark:text-zinc-400">
                    {result.feedback.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Breach check result */}
        {isCheckingBreach && (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('checkingBreaches')}
          </div>
        )}

        {breachResult && !isCheckingBreach && (
          <div
            className={`flex items-start gap-3 rounded-md p-3 ${
              breachResult.found
                ? 'bg-red-50 dark:bg-red-950/30'
                : 'bg-green-50 dark:bg-green-950/30'
            }`}
          >
            {breachResult.found ? (
              <>
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">
                    {t('found', { count: breachResult.count })}
                  </p>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400/80">
                    {t('foundAdvice')}
                  </p>
                </div>
              </>
            ) : (
              <>
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">
                    {t('notFound')}
                  </p>
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400/80">
                    {t('notFoundAdvice')}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
