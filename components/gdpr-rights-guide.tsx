'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Eye,
  Pencil,
  Trash2,
  PauseCircle,
  Download,
  ShieldOff,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  WandSparkles,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getRights, type GdprRight } from '@/lib/gdpr-data'
import { useCopyToClipboard } from '@/lib/use-copy-to-clipboard'
import { EscalationFlowchart } from '@/components/escalation-flowchart'

const iconMap: Record<string, LucideIcon> = {
  Eye,
  Pencil,
  Trash2,
  PauseCircle,
  Download,
  ShieldOff,
}

function RightIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = iconMap[iconName] || Eye
  return <Icon className={className} />
}

export function TemplateCopyButton({ templateKey }: { templateKey: string }) {
  const t = useTranslations('gdprTemplates')
  const tUI = useTranslations('gdprRights')
  const { copied, copy } = useCopyToClipboard()

  const handleCopy = () => {
    const subject = t(`${templateKey}.subject` as 'access.subject')
    const body = t(`${templateKey}.body` as 'access.body')
    const fullTemplate = `${tUI('subjectLabel')}: ${subject}\n\n${body}`
    copy(fullTemplate)
  }

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className="min-h-[44px] gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          {tUI('copied')}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {tUI('copyTemplate')}
        </>
      )}
    </Button>
  )
}

export function TemplatePreview({ templateKey }: { templateKey: string }) {
  const [expanded, setExpanded] = useState(false)
  const t = useTranslations('gdprTemplates')
  const tUI = useTranslations('gdprRights')

  const subject = t(`${templateKey}.subject` as 'access.subject')
  const body = t(`${templateKey}.body` as 'access.body')

  // Highlight [FILL IN: ...] or [UDFYLD: ...] placeholders
  const highlightPlaceholders = (text: string) => {
    const parts = text.split(/(\[(?:FILL IN|UDFYLD):[^\]]*\])/g)
    return parts.map((part, i) => {
      if (part.match(/^\[(?:FILL IN|UDFYLD):/)) {
        return (
          <mark
            key={i}
            className="rounded bg-amber-100 px-0.5 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }

  // Show first 3 lines as preview
  const lines = body.split('\n')
  const previewLines = lines.slice(0, 3).join('\n')
  const hasMore = lines.length > 3

  return (
    <div className="rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
      <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {tUI('templatePreview')}
      </p>
      <p className="mb-3 text-sm font-medium">{tUI('subjectLabel')}: {highlightPlaceholders(subject)}</p>
      <div className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        {expanded ? highlightPlaceholders(body) : highlightPlaceholders(previewLines + (hasMore ? '...' : ''))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              {tUI('collapseTemplate')}
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              {tUI('expandTemplate')}
            </>
          )}
        </button>
      )}
      <p className="mt-3 text-xs text-amber-700 dark:text-amber-300">
        {tUI('placeholderNote')}
      </p>
    </div>
  )
}

function RightCard({ right }: { right: GdprRight }) {
  const t = useTranslations('gdprRights')

  return (
    <AccordionItem value={right.slug}>
      <AccordionTrigger className="py-4 text-left">
        <div className="flex w-full items-center gap-3 pr-2">
          <RightIcon
            iconName={right.icon}
            className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-400"
          />
          <div className="flex-1">
            <span className="font-medium">
              {t(`rights.${right.slug}.title` as 'rights.access.title')}
            </span>
            <span className="ml-2 text-xs text-zinc-500">{right.article}</span>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {t('deadline', { days: right.deadlineDays })}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-2">
          {/* Description */}
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {t(`rights.${right.slug}.description` as 'rights.access.description')}
          </p>
          {/* When to use callout */}
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
              {t(`rights.${right.slug}.whenToUse` as 'rights.access.whenToUse')}
            </p>
          </div>
          {/* Template preview */}
          <TemplatePreview templateKey={right.slug} />
          {/* Copy button */}
          <TemplateCopyButton templateKey={right.slug} />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function GdprRightsGuide() {
  const rights = getRights()
  const t = useTranslations('rightsPage')
  const tWizard = useTranslations('gdprWizard.wizardCta')
  const tComplaint = useTranslations('complaintGuide.complaintCta')

  return (
    <div className="space-y-6">
      {/* CTA links — compact inline */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/rights/wizard"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900/50"
        >
          <WandSparkles className="h-4 w-4" />
          {tWizard('title')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/rights/complaint"
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900/50"
        >
          <AlertTriangle className="h-4 w-4" />
          {tComplaint('title')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Rights accordion */}
      <Accordion type="single" collapsible className="w-full">
        {rights.map((right) => (
          <RightCard key={right.slug} right={right} />
        ))}
      </Accordion>

      {/* Escalation flowchart */}
      <EscalationFlowchart />

      {/* Legal disclaimer */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        {t('disclaimer')}
      </p>
    </div>
  )
}
