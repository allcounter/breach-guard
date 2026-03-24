'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatAccounts, formatDate } from '@/lib/format'
import { useTranslations, useLocale } from 'next-intl'
import type { EnrichedBreach } from '@/lib/breach-metadata'

const AXIS_LEFT = 40
const AXIS_RIGHT = 760
const AXIS_WIDTH = AXIS_RIGHT - AXIS_LEFT // 720

const SEVERITY_FILL: Record<EnrichedBreach['severity'], string> = {
  high: 'fill-red-600 dark:fill-red-400',
  medium: 'fill-amber-500 dark:fill-amber-400',
  low: 'fill-green-600 dark:fill-green-400',
  unknown: 'fill-zinc-400 dark:fill-zinc-500',
}

function dotRadius(accounts: number | null): number {
  if (!accounts || accounts < 10_000_000) return 5
  if (accounts < 100_000_000) return 8
  return 12
}

interface BreachTimelineProps {
  breaches: EnrichedBreach[]
}

export function BreachTimeline({ breaches }: BreachTimelineProps) {
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const t = useTranslations('breachTimeline')
  const locale = useLocale()

  // Filter to dated breaches only, sorted chronologically
  const dated = breaches
    .filter((b): b is EnrichedBreach & { date: string } => b.date !== null)
    .sort((a, b) => a.date.localeCompare(b.date))

  // Defensive: don't render if fewer than 2 dated breaches
  if (dated.length < 2) return null

  const undatedCount = breaches.length - dated.length

  // Compute year range
  const years = dated.map((b) => new Date(b.date).getFullYear())
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const range = maxYear - minYear || 1

  // Position dots with same-year stagger
  const yearCount: Record<number, number> = {}
  const positioned = dated.map((b) => {
    const year = new Date(b.date).getFullYear()
    const n = yearCount[year] ?? 0
    yearCount[year] = n + 1
    const cx = AXIS_LEFT + ((year - minYear) / range) * AXIS_WIDTH
    const cy = n % 2 === 0 ? 55 : 65
    return { ...b, cx, cy, year }
  })

  // Compute tick years
  const tickInterval = range <= 5 ? 1 : range <= 10 ? 2 : 5
  const ticks: number[] = []
  for (let y = minYear; y <= maxYear; y++) {
    if ((y - minYear) % tickInterval === 0) ticks.push(y)
  }
  if (!ticks.includes(maxYear)) ticks.push(maxYear)

  const selected = selectedName
    ? positioned.find((b) => b.breachName === selectedName) ?? null
    : null

  return (
    <div className="space-y-3">
      {/* Summary stat line */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {t('summary', { count: dated.length, minYear, maxYear })}
      </p>

      {/* SVG Timeline */}
      <svg
        viewBox="0 0 800 120"
        className="w-full"
        role="img"
        aria-label={t('ariaLabel', { count: dated.length, minYear, maxYear })}
      >
        <title>
          {t('title', { count: dated.length, minYear, maxYear })}
        </title>

        {/* Axis line */}
        <line
          x1={AXIS_LEFT}
          y1={60}
          x2={AXIS_RIGHT}
          y2={60}
          className="stroke-zinc-300 dark:stroke-zinc-600"
          strokeWidth={2}
        />

        {/* Year tick labels */}
        {ticks.map((year) => {
          const x = AXIS_LEFT + ((year - minYear) / range) * AXIS_WIDTH
          return (
            <text
              key={year}
              x={x}
              y={85}
              textAnchor="middle"
              className="fill-current text-zinc-400 dark:text-zinc-500"
              fontSize={10}
            >
              {year}
            </text>
          )
        })}

        {/* Breach dots */}
        {positioned.map((b) => (
          <g
            key={b.breachName}
            onClick={() =>
              setSelectedName(selectedName === b.breachName ? null : b.breachName)
            }
          >
            {/* Visual dot */}
            <circle
              cx={b.cx}
              cy={b.cy}
              r={dotRadius(b.accounts)}
              className={SEVERITY_FILL[b.severity]}
            />
            {/* Touch target */}
            <circle
              cx={b.cx}
              cy={b.cy}
              r={22}
              fill="transparent"
              className="cursor-pointer"
              aria-label={`${b.displayName}, ${b.year}`}
            />
          </g>
        ))}
      </svg>

      {/* Undated footnote */}
      {undatedCount > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('undated', { count: undatedCount })}
        </p>
      )}

      {/* Selected breach detail card */}
      {selected && (
        <Card>
          <CardContent className="space-y-2 pt-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{selected.displayName}</p>
              <Button
                variant="ghost"
                onClick={() => setSelectedName(null)}
                aria-label={t('closeDetail')}
                className="h-11 w-11 p-0"
              >
                {t('dismiss')}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(selected.date, locale)}
              {selected.accounts ? ` — ${formatAccounts(selected.accounts, locale)}` : ''}
            </p>
            {selected.dataTypes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selected.dataTypes.map((dt) => (
                  <Badge key={dt} variant="outline" className="text-xs font-normal">
                    {dt}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
