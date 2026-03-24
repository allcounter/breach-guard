import { getTranslations } from 'next-intl/server'
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata'
import { PasswordForm } from '@/components/password-form'
import { GuideCallout } from '@/components/guide-callout'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'passwordPage.metadata' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/password', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/password', locale),
    },
    twitter: {
      card: 'summary_large_image' as const,
    },
  }
}

export default async function PasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'passwordPage' })

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('heading')}
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {t('subheading')}
        </p>
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          {t('explanation')}
        </p>
      </div>
      <PasswordForm />
      <GuideCallout
        translationKey="dataBreach"
        href="/guides/databrud"
      />
    </div>
  )
}
