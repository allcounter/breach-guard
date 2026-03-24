import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata'
import { JsonLd } from '@/components/json-ld'
import { getFAQSchema } from '@/lib/structured-data'
import { GuideLayout } from '@/components/guide-layout'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { ShieldAlert, Bug, Newspaper, FileWarning, Search, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dataBreachGuide.metadata' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/guides/databrud', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/guides/databrud', locale),
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

export default async function DataBreachGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'dataBreachGuide' })

  const sections = [
    { id: 'what-is', title: t('sections.whatIs.title') },
    { id: 'how-it-happens', title: t('sections.howItHappens.title') },
    { id: 'real-examples', title: t('sections.realExamples.title') },
    { id: 'what-is-exposed', title: t('sections.whatIsExposed.title') },
    { id: 'how-to-check', title: t('sections.howToCheck.title') },
    { id: 'how-to-protect', title: t('sections.howToProtect.title') },
  ]

  const faqItems = t.raw('faq.items') as { question: string; answer: string }[]

  return (
    <>
      <JsonLd data={getFAQSchema(faqItems)} />
      <GuideLayout
        toc={sections}
        faq={faqItems}
        ctaHref="/email"
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

        {/* Standard sections */}
        {renderSection('what-is', 'whatIs', ShieldAlert, t)}
        {renderSection('how-it-happens', 'howItHappens', Bug, t)}
        {renderSection('real-examples', 'realExamples', Newspaper, t)}
        {renderSection('what-is-exposed', 'whatIsExposed', FileWarning, t)}

        {/* howToCheck section with rich text link */}
        <section id="how-to-check" className="mt-10">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.howToCheck.title')}</h2>
          </div>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              {t.rich('sections.howToCheck.content', {
                emailCheckLink: (chunks) => (
                  <Link
                    href="/email"
                    className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </section>

        {renderSection('how-to-protect', 'howToProtect', Lock, t)}
      </GuideLayout>
    </>
  )
}
