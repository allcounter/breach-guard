import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata'
import { JsonLd } from '@/components/json-ld'
import { getFAQSchema } from '@/lib/structured-data'
import { GuideLayout } from '@/components/guide-layout'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { Building2, AlertTriangle, Scale, ListChecks, RefreshCw, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brokerRemovalGuide.metadata' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/guides/fjern-data-brokers', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/guides/fjern-data-brokers', locale),
    },
    twitter: { card: 'summary_large_image' as const },
  }
}

function renderSection(
  id: string,
  key: string,
  Icon: LucideIcon,
  t: Awaited<ReturnType<typeof getTranslations>>
) {
  return (
    <section id={id} className="mt-10">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold">{t(`sections.${key}.title`)}</h2>
      </div>
      <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {(t(`sections.${key}.content`) as string).split('\n\n').map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}

export default async function BrokerRemovalGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'brokerRemovalGuide' })

  const sections = [
    { id: 'what-are-brokers', title: t('sections.whatAreBrokers.title') },
    { id: 'why-remove', title: t('sections.whyRemove.title') },
    { id: 'your-rights', title: t('sections.yourRights.title') },
    { id: 'step-by-step', title: t('sections.stepByStep.title') },
    { id: 'after-removal', title: t('sections.afterRemoval.title') },
    { id: 'prevention', title: t('sections.prevention.title') },
  ]

  const faqItems = t.raw('faq.items') as { question: string; answer: string }[]

  return (
    <>
      <JsonLd data={getFAQSchema(faqItems)} />
      <GuideLayout
        toc={sections}
        faq={faqItems}
        ctaHref="/brokers"
        ctaLabel={t('cta.label')}
        locale={locale}
      >
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('heading')}
        </h1>

        {/* Introduction */}
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t('intro').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Standard section */}
        {renderSection('what-are-brokers', 'whatAreBrokers', Building2, t)}

        {/* whyRemove section with cross-link to data breach guide */}
        <section id="why-remove" className="mt-10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.whyRemove.title')}</h2>
          </div>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              {t.rich('sections.whyRemove.content', {
                dataBreachGuideLink: (chunks) => (
                  <Link
                    href="/guides/databrud"
                    className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </section>

        {/* yourRights section with GDPR wizard link */}
        <section id="your-rights" className="mt-10">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.yourRights.title')}</h2>
          </div>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              {t.rich('sections.yourRights.content', {
                wizardLink: (chunks) => (
                  <Link
                    href="/rights/wizard"
                    className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </section>

        {/* stepByStep section with broker guide link */}
        <section id="step-by-step" className="mt-10">
          <div className="flex items-center gap-3">
            <ListChecks className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.stepByStep.title')}</h2>
          </div>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              {t.rich('sections.stepByStep.content', {
                brokerGuideLink: (chunks) => (
                  <Link
                    href="/brokers"
                    className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </section>

        {renderSection('after-removal', 'afterRemoval', RefreshCw, t)}
        {renderSection('prevention', 'prevention', ShieldCheck, t)}
      </GuideLayout>
    </>
  )
}
