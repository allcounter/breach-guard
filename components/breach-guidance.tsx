'use client'

import { ShieldCheck, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { EnrichedBreach } from '@/lib/breach-metadata'

interface BreachGuidanceProps {
  breaches: EnrichedBreach[]
}

export function BreachGuidance({ breaches }: BreachGuidanceProps) {
  const t = useTranslations('breachGuidance')
  const tWizard = useTranslations('gdprWizard')

  if (breaches.length === 0) return null

  // General guidance items — translated
  const generalGuidance = [
    t('steps.changePasswords'),
    t('steps.enable2fa'),
    t('steps.checkReuse'),
    t('steps.useManager'),
  ]

  // Collect unique breach-specific guidance, sorted by severity (data arrives pre-sorted).
  const specificGuidance: string[] = []
  const seen = new Set<string>()

  for (const breach of breaches) {
    if (breach.guidance && !seen.has(breach.guidance)) {
      seen.add(breach.guidance)
      specificGuidance.push(breach.guidance)
    }
  }

  // Combine: general first (actionable steps), then specific per-breach.
  // De-duplicate: if a general item is already covered by specific guidance, skip.
  const allSteps = [...generalGuidance]
  for (const step of specificGuidance) {
    if (!allSteps.some((s) => s.toLowerCase() === step.toLowerCase())) {
      allSteps.push(step)
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-blue-800 dark:text-blue-200">
          <ShieldCheck className="h-5 w-5" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ol className="space-y-2">
          {allSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-blue-900 dark:text-blue-100">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <Link
          href={{
            pathname: '/rights/wizard',
            query: { situation: 'breach', step: 'details' },
          }}
          className="mt-4 flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          {tWizard('breachGuidanceLink')}
        </Link>
      </CardContent>
    </Card>
  )
}
