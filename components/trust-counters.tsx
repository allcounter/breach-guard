'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import brokerData from '@/data/broker-data.json'

export function TrustCounters() {
  const t = useTranslations('home')
  const [checkCount, setCheckCount] = useState<number | null>(null)

  // Read localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('breach-guard-check-count')
      if (stored) {
        const parsed = parseInt(stored, 10)
        if (parsed > 0) setCheckCount(parsed)
      }
    } catch {
      // localStorage unavailable
    }
  }, [])

  // Listen for live updates via CustomEvent
  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem('breach-guard-check-count')
        if (stored) {
          const parsed = parseInt(stored, 10)
          if (parsed > 0) setCheckCount(parsed)
        }
      } catch {
        // ignore
      }
    }
    window.addEventListener('breach-guard-check', handler)
    return () => window.removeEventListener('breach-guard-check', handler)
  }, [])

  const showPersonal = checkCount !== null && checkCount > 0

  return (
    <div
      className={`grid ${showPersonal ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-4 sm:gap-6 text-center`}
    >
      <div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight">
          {brokerData.length}+
        </div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {t('counters.brokers')}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight">
          700+
        </div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {t('counters.breaches')}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight">
          6
        </div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {t('counters.templates')}
        </div>
      </div>

      {showPersonal && (
        <div className="transition-opacity duration-500 ease-in-out">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {checkCount}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t('counters.personalChecks')}
          </div>
        </div>
      )}
    </div>
  )
}
