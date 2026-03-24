import { getTranslations } from 'next-intl/server'
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata'
import { Link } from '@/i18n/navigation'
import { ShieldCheck, Cookie, Database, Code } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPage.metadata' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/privacy', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/privacy', locale),
    },
    twitter: {
      card: 'summary_large_image' as const,
    },
  }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPage' })

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Page heading */}
      <h1 className="text-2xl font-semibold tracking-tight">{t('heading')}</h1>

      {/* TL;DR box */}
      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {t('tldr')}
        </p>
      </div>

      {/* Sections */}
      <div className="mt-10 space-y-10">
        {/* Zero tracking */}
        <section>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.tracking.title')}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('sections.tracking.body')}
          </p>
        </section>

        {/* Cookies */}
        <section>
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.cookies.title')}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t('sections.cookies.body')}
          </p>
        </section>

        {/* Data handling */}
        <section>
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.dataHandling.title')}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t.rich('sections.dataHandling.body', {
              hibpLink: (chunks) => (
                <a
                  href="https://haveibeenpwned.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {chunks}
                </a>
              ),
              xonLink: (chunks) => (
                <a
                  href="https://xposedornot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {chunks}
                </a>
              ),
              emailCheckLink: (chunks) => (
                <Link
                  href="/email"
                  className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {chunks}
                </Link>
              ),
              passwordCheckLink: (chunks) => (
                <Link
                  href="/password"
                  className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>

        {/* Open source */}
        <section>
          <div className="flex items-center gap-3">
            <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">{t('sections.openSource.title')}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t.rich('sections.openSource.body', {
              githubLink: (chunks) => (
                <a
                  href="https://github.com/allcounter/breach-guard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </section>
      </div>

      {/* GDPR rights note */}
      <div className="mt-10">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t.rich('gdprNote', {
            gdprRightsLink: (chunks) => (
              <Link
                href="/rights"
                className="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      {/* Last updated + contact */}
      <div className="mt-10 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{t('lastUpdated')}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {t.rich('contact', {
            emailLink: (chunks) => (
              <a
                href="mailto:privacy@breachguard.dk"
                className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </div>
  )
}
