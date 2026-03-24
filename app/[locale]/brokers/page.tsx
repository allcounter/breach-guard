import { getTranslations } from 'next-intl/server'
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata'
import { BrokerGuide } from '@/components/broker-guide'
import { GuideCallout } from '@/components/guide-callout'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brokersPage.metadata' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/brokers', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/brokers', locale),
    },
    twitter: {
      card: 'summary_large_image' as const,
    },
  }
}

export default async function BrokersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brokersPage' })

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('heading')}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t('subheading')}
        </p>
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          {t('warning')}
        </p>
      </div>
      <BrokerGuide />
      <GuideCallout
        translationKey="removeBrokers"
        href="/guides/fjern-data-brokers"
      />
    </div>
  )
}
