'use client'

import { ArrowRight, ShieldAlert, UserX } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const iconMap = {
  dataBreach: ShieldAlert,
  removeBrokers: UserX,
} as const

type GuideCalloutProps = {
  translationKey: 'dataBreach' | 'removeBrokers'
  href: '/guides/databrud' | '/guides/fjern-data-brokers'
}

export function GuideCallout({ translationKey, href }: GuideCalloutProps) {
  const t = useTranslations(`guideCallouts.${translationKey}`)
  const tRoot = useTranslations('guideCallouts')
  const Icon = iconMap[translationKey]

  return (
    <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {t('title')}
          </p>
          <p className="mt-1 text-sm text-blue-800/80 dark:text-blue-200/80">
            {t('description')}
          </p>
          <Link
            href={href}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {tRoot('readMore')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
