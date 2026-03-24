'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  ShieldAlert,
  Trash2,
  MailX,
  Pencil,
  Eye,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Check,
  ChevronRight,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getSituations, getSituationBySlug } from '@/lib/wizard-situations'
import { getRights } from '@/lib/gdpr-data'
import { TemplateCopyButton, TemplatePreview } from '@/components/gdpr-rights-guide'
import { BreachActionChecklist } from '@/components/breach-action-checklist'

type WizardStep = 'situation' | 'details' | 'result'

const iconMap: Record<string, LucideIcon> = {
  ShieldAlert,
  Trash2,
  MailX,
  Pencil,
  Eye,
}

const stepOrder: WizardStep[] = ['situation', 'details', 'result']

function StepIndicator({ current }: { current: WizardStep }) {
  const t = useTranslations('gdprWizard.steps')
  const stepLabels: WizardStep[] = ['situation', 'details', 'result']
  const currentIndex = stepOrder.indexOf(current)

  return (
    <div className="mb-8 flex items-center justify-center gap-0">
      {stepLabels.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i < currentIndex
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  : i === currentIndex
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
              }`}
            >
              {i < currentIndex ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs ${
                i === currentIndex
                  ? 'font-medium text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {t(step)}
            </span>
          </div>
          {i < stepLabels.length - 1 && (
            <div
              className={`mx-2 mt-[-1rem] h-0.5 w-8 ${
                i < currentIndex
                  ? 'bg-green-300 dark:bg-green-700'
                  : 'bg-zinc-200 dark:bg-zinc-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function SituationStep({
  onSelect,
}: {
  onSelect: (slug: string) => void
}) {
  const t = useTranslations('gdprWizard.situations')
  const situations = getSituations()

  return (
    <div className="space-y-3">
      {situations.map((situation) => {
        const Icon = iconMap[situation.icon] || Eye
        return (
          <button
            key={situation.slug}
            onClick={() => onSelect(situation.slug)}
            className="flex w-full items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/30 min-h-[44px]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {t(`${situation.slug}.title` as 'breach.title')}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                {t(`${situation.slug}.description` as 'breach.description')}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
          </button>
        )
      })}
    </div>
  )
}

function DetailsStep({
  situationSlug,
  onNext,
  onBack,
}: {
  situationSlug: string
  onNext: () => void
  onBack: () => void
}) {
  const t = useTranslations('gdprWizard')
  const tSit = useTranslations('gdprWizard.situations')

  const situation = getSituationBySlug(situationSlug)
  if (!situation) return null

  const Icon = iconMap[situation.icon] || Eye

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
            {tSit(`${situationSlug}.title` as 'breach.title')}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tSit(`${situationSlug}.details` as 'breach.details')}
        </p>
      </div>

      {situationSlug === 'breach' && (
        <Link
          href="/email"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowRight className="h-4 w-4" />
          {tSit(`${situationSlug}.checkBreachesLink` as 'breach.checkBreachesLink')}
        </Link>
      )}

      {situationSlug === 'data-removal' && (
        <Link
          href="/brokers"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowRight className="h-4 w-4" />
          {tSit(`${situationSlug}.brokerGuideLink` as 'data-removal.brokerGuideLink')}
        </Link>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backButton')}
        </button>
        <button
          onClick={onNext}
          className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {t('nextButton')}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function ResultStep({
  situationSlug,
  onRestart,
}: {
  situationSlug: string
  onRestart: () => void
}) {
  const t = useTranslations('gdprWizard')
  const tSit = useTranslations('gdprWizard.situations')
  const tRights = useTranslations('gdprRights')

  const situation = getSituationBySlug(situationSlug)
  const rights = getRights()

  if (!situation) return null

  const primaryRight = rights.find((r) => r.slug === situation.primaryRight)
  const secondaryRights = situation.secondaryRights
    .map((slug) => rights.find((r) => r.slug === slug))
    .filter(Boolean)

  if (!primaryRight) return null

  return (
    <div className="space-y-6">
      {/* Recommended right */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {t('recommendedRight')}
        </p>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {tRights(`rights.${primaryRight.slug}.title` as 'rights.access.title')}
          </h3>
          <Badge variant="outline" className="text-xs">
            {primaryRight.article}
          </Badge>
        </div>
      </div>

      {/* Recommendation text */}
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {tSit(`${situationSlug}.recommendation` as 'breach.recommendation')}
      </p>

      {/* Template preview + copy */}
      <TemplatePreview templateKey={primaryRight.slug} />
      <TemplateCopyButton templateKey={primaryRight.slug} />

      {/* 30-day deadline badge */}
      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950">
        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
          {t('deadline')}
        </span>
      </div>

      {/* Next steps */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
        <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tSit(`${situationSlug}.nextSteps` as 'breach.nextSteps')}
        </p>
      </div>

      {/* Secondary rights */}
      {secondaryRights.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t('alsoConsider')}
          </p>
          <div className="space-y-2">
            {secondaryRights.map((right) => {
              if (!right) return null
              return (
                <Link
                  key={right.slug}
                  href="/rights"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ChevronRight className="h-4 w-4" />
                  {tRights(`rights.${right.slug}.title` as 'rights.access.title')} ({right.article})
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Breach action checklist */}
      {situationSlug === 'breach' && <BreachActionChecklist />}

      {/* Escalation link */}
      <Link
        href="/rights/complaint"
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
      >
        <ArrowRight className="h-4 w-4" />
        {t('escalationLink')}
      </Link>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <RotateCcw className="h-4 w-4" />
        {t('restartButton')}
      </button>
    </div>
  )
}

export function GdprWizard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawStep = searchParams.get('step')
  const step: WizardStep = rawStep && stepOrder.includes(rawStep as WizardStep)
    ? (rawStep as WizardStep)
    : 'situation'
  const situationSlug = searchParams.get('situation') || ''

  function setStep(newStep: WizardStep, params?: Record<string, string>) {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('step', newStep)
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        newParams.set(k, v)
      }
    }
    // Remove situation param when going back to step 1
    if (newStep === 'situation') {
      newParams.delete('situation')
      newParams.delete('step')
    }
    const query = Object.fromEntries(newParams.entries())
    router.replace({ pathname: pathname as '/rights/wizard', query })
  }

  return (
    <div>
      <StepIndicator current={step} />
      {step === 'situation' && (
        <SituationStep
          onSelect={(slug) => setStep('details', { situation: slug })}
        />
      )}
      {step === 'details' && (
        <DetailsStep
          situationSlug={situationSlug}
          onNext={() => setStep('result')}
          onBack={() => setStep('situation')}
        />
      )}
      {step === 'result' && (
        <ResultStep
          situationSlug={situationSlug}
          onRestart={() => setStep('situation')}
        />
      )}
    </div>
  )
}
