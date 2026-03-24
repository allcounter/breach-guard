import { getTranslations } from 'next-intl/server'
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata'
import { ComplaintGuide } from '@/components/complaint-guide'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'complaintGuide.metadata' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/rights/complaint', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/rights/complaint', locale),
    },
    twitter: {
      card: 'summary_large_image' as const,
    },
  }
}

export default async function ComplaintPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'complaintGuide' })
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{t('heading')}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t('subheading')}</p>
      </div>
      <ComplaintGuide />
    </div>
  )
}
