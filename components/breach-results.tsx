'use client'

import { useState } from 'react'
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { dataTypeDescriptions } from '@/lib/breach-metadata'
import type { EnrichedBreach } from '@/lib/breach-metadata'
import { formatAccounts, formatDate } from '@/lib/format'
import { useTranslations, useLocale } from 'next-intl'

interface BreachResultsProps {
  breaches: EnrichedBreach[]
}

const SEVERITY_DOT: Record<EnrichedBreach['severity'], string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
  unknown: 'bg-zinc-400 dark:bg-zinc-500',
}

export function BreachResults({ breaches }: BreachResultsProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null)
  const t = useTranslations('breachResults')
  const locale = useLocale()

  const severityLabels: Record<EnrichedBreach['severity'], string> = {
    high: t('severity.high'),
    medium: t('severity.medium'),
    low: t('severity.low'),
    unknown: t('severity.unknown'),
  }

  // No breaches — positive result
  if (breaches.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardContent className="flex items-center gap-3 pt-6">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-200">
              {t('noBreaches')}
            </p>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              {t('noBreachesAdvice')}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Severity breakdown
  const counts: Record<EnrichedBreach['severity'], number> = { high: 0, medium: 0, low: 0, unknown: 0 }
  for (const b of breaches) counts[b.severity]++
  const activeSeverities = (['high', 'medium', 'low', 'unknown'] as const).filter(s => counts[s] > 0)

  // Split enriched vs unknown
  const enriched = breaches.filter(b => b.severity !== 'unknown')
  const unknown = breaches.filter(b => b.severity === 'unknown')

  function toggle(name: string) {
    setExpandedName(prev => prev === name ? null : name)
  }

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/50">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            {t('summary', { count: breaches.length })}
          </p>
          <div className="flex items-center gap-3">
            {activeSeverities.map(severity => (
              <span key={severity} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <span className={`inline-block h-2 w-2 rounded-full ${SEVERITY_DOT[severity]}`} />
                {counts[severity]} {severityLabels[severity].toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Enriched breaches — table-like rows */}
      {enriched.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          {/* Column header */}
          <div className="grid grid-cols-[auto_1fr_120px_120px_auto] items-center gap-x-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500">
            <span className="w-2.5" />
            <span>{t('colService')}</span>
            <span className="text-right">{t('colDate')}</span>
            <span className="text-right">{t('colAccounts')}</span>
            <span className="w-4" />
          </div>

          {enriched.map((breach, i) => {
            const isExpanded = expandedName === breach.breachName
            return (
              <div key={breach.breachName}>
                {i > 0 && <div className="border-t border-zinc-100 dark:border-zinc-800" />}
                <button
                  onClick={() => toggle(breach.breachName)}
                  className="grid w-full grid-cols-[auto_1fr_120px_120px_auto] items-center gap-x-3 px-4 py-2.5 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${SEVERITY_DOT[breach.severity]}`} title={severityLabels[breach.severity]} />
                  <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {breach.displayName}
                  </span>
                  <span className="text-right text-xs text-zinc-400 dark:text-zinc-500">
                    {breach.date ? formatDate(breach.date, locale) : '—'}
                  </span>
                  <span className="text-right text-xs text-zinc-400 dark:text-zinc-500">
                    {breach.accounts ? formatAccounts(breach.accounts, locale) : '—'}
                  </span>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                    : <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                  }
                </button>
                {isExpanded && (
                  <div className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <div className="ml-[22px] space-y-2">
                      {breach.dataTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {breach.dataTypes.map(dt => (
                            <Badge
                              key={dt}
                              variant="outline"
                              className="text-xs font-normal"
                              title={dataTypeDescriptions[dt] ?? dt}
                            >
                              {dt}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {breach.guidance && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {breach.guidance}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Unknown breaches — compact chips */}
      {unknown.length > 0 && (
        <div className="rounded-lg border border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {t('unknownGroup', { count: unknown.length })}
          </p>
          <div className="flex flex-wrap gap-2">
            {unknown.map(breach => (
              <span
                key={breach.breachName}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT.unknown}`} />
                {breach.displayName}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
