'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  getBrokers,
  getRegions,
  getCategories,
  type Difficulty,
  type Region,
  type BrokerCategory,
} from '@/lib/broker-data'

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium:
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const difficultyOptions: Array<Difficulty | 'all'> = ['all', 'easy', 'medium', 'hard']

export function BrokerGuide() {
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>(
    'all',
  )
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all')

  const t = useTranslations('brokerGuide')
  const tSteps = useTranslations('brokerSteps')
  const tNotes = useTranslations('brokerNotes')

  const brokers = getBrokers()
  const regions = getRegions()
  const categories = getCategories()

  const filtered = useMemo(() => {
    return brokers.filter((b) => {
      const matchesSearch = b.name
        .toLowerCase()
        .includes(search.toLowerCase().trim())
      const matchesDifficulty =
        difficultyFilter === 'all' || b.difficulty === difficultyFilter
      const matchesRegion =
        regionFilter === 'all' || b.region === regionFilter
      return matchesSearch && matchesDifficulty && matchesRegion
    })
  }, [brokers, search, difficultyFilter, regionFilter])

  const grouped = useMemo(() => {
    const groups = new Map<BrokerCategory, typeof filtered>()
    // Maintain category order from getCategories()
    for (const cat of categories) {
      const categoryBrokers = filtered.filter((b) => b.category === cat)
      if (categoryBrokers.length > 0) {
        groups.set(cat, categoryBrokers)
      }
    }
    return groups
  }, [filtered, categories])

  function getTranslatedStep(slug: string, index: number, fallback: string): string {
    try {
      const key = `${slug}.${index + 1}`
      const translated = tSteps(key as Parameters<typeof tSteps>[0])
      // Fallback: next-intl returns [namespace.key] for missing keys, or the key itself
      if (translated === key || (translated.startsWith('[') && translated.endsWith(']'))) {
        return fallback
      }
      return translated
    } catch {
      return fallback
    }
  }

  function getTranslatedNote(slug: string, fallback: string): string {
    try {
      const translated = tNotes(slug as Parameters<typeof tNotes>[0])
      if (translated === slug || (translated.startsWith('[') && translated.endsWith(']'))) {
        return fallback
      }
      return translated
    } catch {
      return fallback
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + filters row */}
      <div className="flex flex-wrap items-end gap-3">
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', ...regions] as const).map((opt) => (
            <Button
              key={opt}
              variant={regionFilter === opt ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRegionFilter(opt)}
              className="h-9 text-xs"
            >
              {opt === 'all'
                ? t('region.all')
                : t(`region.${opt}` as `region.${Region}`)}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {difficultyOptions.map((opt) => (
            <Button
              key={opt}
              variant={difficultyFilter === opt ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter(opt)}
              className="h-9 text-xs capitalize"
            >
              {opt === 'all'
                ? t('filterAll')
                : t(
                    `difficulty.${opt}` as
                      | 'difficulty.easy'
                      | 'difficulty.medium'
                      | 'difficulty.hard',
                  )}
            </Button>
          ))}
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {t('resultCount', { count: filtered.length })}
        </span>
      </div>

      {/* Quick-win callout (Denmark or All) */}
      {(regionFilter === 'denmark' || regionFilter === 'all') && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                {t('quickWin.title')}
              </p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                {t('quickWin.description')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Swedish disclaimer */}
      {regionFilter === 'sweden' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {t('swedenDisclaimer')}
          </p>
        </div>
      )}

      {/* Category-grouped broker accordions */}
      {grouped.size === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t('noResults')}
        </p>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([category, categoryBrokers]) => (
            <div key={category}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                {t(`category.${category}` as `category.${BrokerCategory}`)}
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {categoryBrokers.map((broker) => (
                  <AccordionItem key={broker.slug} value={broker.slug}>
                    <AccordionTrigger className="py-4 text-left">
                      <div className="flex w-full items-center gap-2 pr-2">
                        <span className="flex-1 font-medium">
                          {broker.name}
                        </span>
                        {broker.requiresNationalId && (
                          <Badge
                            variant="outline"
                            className="shrink-0 text-xs"
                          >
                            {t('requiresId')}
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={`shrink-0 text-xs ${difficultyColors[broker.difficulty]}`}
                        >
                          {t(
                            `difficulty.${broker.difficulty}` as
                              | 'difficulty.easy'
                              | 'difficulty.medium'
                              | 'difficulty.hard',
                          )}
                        </Badge>
                        <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                          {broker.timeEstimate}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pb-2">
                        {/* Steps */}
                        <ol className="list-decimal space-y-1.5 pl-5 text-sm">
                          {broker.steps.map((step, i) => (
                            <li
                              key={i}
                              className="text-zinc-700 dark:text-zinc-300"
                            >
                              {getTranslatedStep(broker.slug, i, step)}
                            </li>
                          ))}
                        </ol>

                        {/* Opt-out link */}
                        <a
                          href={broker.optOutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                        >
                          {t('goToOptOut')}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        {/* Notes */}
                        {broker.notes && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {t('note')}{' '}
                            {getTranslatedNote(broker.slug, broker.notes)}
                          </p>
                        )}

                        {/* Last verified */}
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                          {t('lastVerified')} {broker.lastVerified}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
