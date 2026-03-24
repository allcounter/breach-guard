'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  KeyRound,
  CreditCard,
  User,
  Mail,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { breachActions } from '@/lib/wizard-situations'
import { getRights } from '@/lib/gdpr-data'

const iconMap: Record<string, LucideIcon> = {
  KeyRound,
  CreditCard,
  User,
  Mail,
  Heart,
}

export function BreachActionChecklist() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const t = useTranslations('breachActions')
  const tRights = useTranslations('gdprRights')
  const rights = getRights()

  function toggle(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        {t('description')}
      </p>
      <div className="space-y-2">
        {breachActions.map((action) => {
          const Icon = iconMap[action.icon] || User
          const isExpanded = expanded.has(action.slug)
          const matchedRights = action.rightSlugs
            .map((slug) => rights.find((r) => r.slug === slug))
            .filter(Boolean)

          return (
            <div key={action.slug}>
              <button
                onClick={() => toggle(action.slug)}
                className="flex w-full min-h-[44px] items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
              >
                <Icon className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                <span className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t(`scenarios.${action.slug}.label` as 'scenarios.passwords-exposed.label')}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />
                )}
              </button>
              {isExpanded && (
                <div className="ml-4 mt-2 space-y-3 border-l-2 border-blue-200 pl-4 pb-2 dark:border-blue-800">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {t(`scenarios.${action.slug}.action` as 'scenarios.passwords-exposed.action')}
                  </p>
                  {matchedRights.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {t('recommendedTemplates')}
                      </p>
                      <div className="space-y-1">
                        {matchedRights.map((right) => {
                          if (!right) return null
                          return (
                            <Link
                              key={right.slug}
                              href="/rights"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              {tRights(`rights.${right.slug}.title` as 'rights.access.title')}{' '}
                              <span className="text-xs text-zinc-400">({right.article})</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4">
        <Link
          href="/rights"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          {t('viewAllRights')}
        </Link>
      </div>
    </div>
  )
}
