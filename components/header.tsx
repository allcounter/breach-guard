'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Shield, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslations, useLocale } from 'next-intl'

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [, startTransition] = useTransition()
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations('common')

  useEffect(() => {
    startTransition(() => setMounted(true))
  }, [])

  // Cycle: system -> light -> dark -> system
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const Icon = !mounted ? Monitor : theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor
  const nextLocale = locale === 'da' ? 'en' : 'da'

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 whitespace-nowrap text-base sm:text-lg font-semibold tracking-tight"
        >
          <Shield className="h-5 w-5" />
          {t('appName')}
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <Link
            href="/password"
            className="flex min-h-[44px] items-center py-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t('navigation.password')}
          </Link>
          <Link
            href="/email"
            className="flex min-h-[44px] items-center py-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t('navigation.email')}
          </Link>
          <Link
            href="/brokers"
            className="flex min-h-[44px] items-center py-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t('navigation.brokers')}
          </Link>
          <Link
            href="/rights"
            className="flex min-h-[44px] items-center py-2 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t('navigation.rights')}
          </Link>
          <button
            onClick={() => {
              const query = Object.fromEntries(searchParams.entries())
              router.replace(
                { pathname: pathname as '/', query },
                { locale: nextLocale }
              )
            }}
            aria-label={`Switch to ${nextLocale === 'da' ? 'Dansk' : 'English'}`}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {locale === 'da' ? 'EN' : 'DA'}
          </button>
          <button
            onClick={() => setTheme(nextTheme)}
            aria-label={t('theme.switchTo', { theme: nextTheme })}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Icon className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </header>
  )
}
