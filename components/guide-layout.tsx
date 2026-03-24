import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { TableOfContents, MobileToc } from '@/components/table-of-contents'
import { FaqAccordion } from '@/components/faq-accordion'
import { ArrowRight } from 'lucide-react'

type GuideLayoutProps = {
  children: React.ReactNode
  toc: { id: string; title: string }[]
  faq: { question: string; answer: string }[]
  ctaHref: '/password' | '/email' | '/brokers' | '/rights'
  ctaLabel: string
  locale: string
}

export async function GuideLayout({
  children,
  toc,
  faq,
  ctaHref,
  ctaLabel,
  locale,
}: GuideLayoutProps) {
  const t = await getTranslations({ locale, namespace: 'guideLayout' })

  // Add FAQ to TOC sections
  const allSections = [...toc, { id: 'faq', title: t('faq') }]

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        <article className="max-w-2xl">
          <MobileToc sections={allSections} />

          {children}

          {/* FAQ section */}
          <section id="faq" className="mt-12">
            <h2 className="mb-6 text-xl font-semibold">{t('faq')}</h2>
            <FaqAccordion items={faq} />
          </section>

          {/* CTA box */}
          <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-950/30">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Last updated */}
          <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500">
            {t('lastUpdated')}
          </p>
        </article>

        {/* Desktop sidebar TOC */}
        <aside className="hidden lg:block">
          <TableOfContents sections={allSections} />
        </aside>
      </div>
    </div>
  )
}
