'use client'

import { useTranslations } from 'next-intl'
import { Send, Clock, MailWarning, AlertTriangle, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type EscalationStep = {
  key: string
  icon: LucideIcon
  colorClasses: string
  borderColorClasses: string
}

const steps: EscalationStep[] = [
  { key: 'send',      icon: Send,          colorClasses: 'text-blue-600 dark:text-blue-400',   borderColorClasses: 'border-blue-300 dark:border-blue-700' },
  { key: 'wait30',    icon: Clock,         colorClasses: 'text-zinc-500 dark:text-zinc-400',   borderColorClasses: 'border-zinc-300 dark:border-zinc-600' },
  { key: 'reminder',  icon: MailWarning,   colorClasses: 'text-amber-600 dark:text-amber-400', borderColorClasses: 'border-amber-300 dark:border-amber-700' },
  { key: 'wait14',    icon: Clock,         colorClasses: 'text-zinc-500 dark:text-zinc-400',   borderColorClasses: 'border-zinc-300 dark:border-zinc-600' },
  { key: 'complaint', icon: AlertTriangle, colorClasses: 'text-red-600 dark:text-red-400',     borderColorClasses: 'border-red-300 dark:border-red-700' },
]

export function EscalationFlowchart() {
  const t = useTranslations('gdprRights.escalation')

  return (
    <div className="mt-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-1 text-base font-semibold">{t('title')}</h3>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">{t('description')}</p>
      <ol className="relative space-y-0">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <li key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-zinc-950 ${step.borderColorClasses}`}>
                  <Icon className={`h-5 w-5 ${step.colorClasses}`} />
                </div>
                {i < steps.length - 1 && (
                  <div className="h-8 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
                )}
              </div>
              <div className="pb-6 pt-1.5">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium">{t(`${step.key}.title` as 'send.title')}</p>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {t(`${step.key}.dayLabel` as 'send.dayLabel')}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {t(`${step.key}.description` as 'send.description')}
                </p>
                {step.key === 'complaint' && (
                  <Link
                    href="/rights/complaint"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {t('complaint.link')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
