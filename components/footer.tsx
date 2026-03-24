'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')

  const linkClass = 'text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Single row: all links inline with separator dots */}
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/password" className={linkClass}>{t('tools.password')}</Link>
          <Link href="/email" className={linkClass}>{t('tools.email')}</Link>
          <Link href="/brokers" className={linkClass}>{t('tools.brokers')}</Link>
          <Link href="/rights" className={linkClass}>{t('tools.rights')}</Link>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <Link href="/guides/databrud" className={linkClass}>{t('guides.dataBreach')}</Link>
          <Link href="/guides/fjern-data-brokers" className={linkClass}>{t('guides.removeBrokers')}</Link>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <Link href="/privacy" className={linkClass}>{t('legal.privacy')}</Link>
        </nav>

        {/* Copyright */}
        <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
          {t('copyright', { year: new Date().getFullYear() })} · {t('noTracking')}
        </p>
      </div>
    </footer>
  )
}
