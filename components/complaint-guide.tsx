'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  KeyRound,
  FileText,
  Send,
  Mail,
  Phone,
  MapPin,
  Globe,
} from 'lucide-react'

const VIRK_COMPLAINT_URL =
  'https://blanket.virk.dk/blanketafvikler/orbeon/fr/nem_b/73_4f4d22bcd15d00cbc39a5d1a1b05a1b679a0aad7/new'

const checklistItems = [
  'contactedCompany',
  'thirtyDaysPassed',
  'evidenceGathered',
  'originalRequestCopy',
] as const

const filingSteps = [
  { key: 'login', icon: KeyRound },
  { key: 'fillForm', icon: FileText },
  { key: 'submit', icon: Send },
] as const

export function ComplaintGuide() {
  const t = useTranslations('complaintGuide')
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const allChecked = checklistItems.every((item) => checked[item])

  const toggle = (item: string) => {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="space-y-8">
      {/* Pre-complaint checklist */}
      <section>
        <h2 className="text-lg font-semibold">{t('checklist.title')}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t('checklist.description')}
        </p>
        <div className="mt-4 space-y-2">
          {checklistItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {checked[item] ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-zinc-300 dark:text-zinc-600" />
              )}
              <span className="text-sm">
                {t(`checklist.items.${item}` as 'checklist.items.contactedCompany')}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Filing steps */}
      <section>
        <h2 className="text-lg font-semibold">{t('steps.title')}</h2>
        <div className="mt-4 space-y-3">
          {filingSteps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.key}
                className="flex gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <p className="text-sm font-medium">
                      {t(`steps.${step.key}.title` as 'steps.login.title')}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {t(`steps.${step.key}.description` as 'steps.login.description')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Virk.dk complaint button */}
      <section>
        <a
          href={allChecked ? VIRK_COMPLAINT_URL : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!allChecked}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors ${
            allChecked
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'pointer-events-none bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
          }`}
        >
          {t('fileComplaint')}
          <ExternalLink className="h-4 w-4" />
        </a>
        <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          {t('fallbackNote')}
        </p>
      </section>

      {/* No MitID section */}
      <section>
        <h2 className="text-lg font-semibold">{t('noMitId.title')}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t('noMitId.description')}
        </p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            <span>{t('noMitId.email')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            <span>{t('noMitId.phone')}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
            <span>{t('noMitId.mail')}</span>
          </div>
        </div>
      </section>

      {/* Cross-border section */}
      <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
        <div className="flex items-start gap-3">
          <Globe className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {t('crossBorder.title')}
            </h2>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
              {t('crossBorder.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        {t('disclaimer')}
      </p>
    </div>
  )
}
