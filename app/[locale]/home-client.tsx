'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { KeyRound, Mail, UserX, Scale } from 'lucide-react'
import { TrustBadges } from '@/components/trust-badges'
import { TrustCounters } from '@/components/trust-counters'

export default function HomeClient() {
  const t = useTranslations('home')

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 sm:py-16">
      {/* Hero */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
          {t('hero.description')}
        </p>
      </div>

      {/* Trust badges */}
      <div className="mb-8 sm:mb-10">
        <TrustBadges />
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/password" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <div className="mb-2">
                <KeyRound className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <CardTitle className="text-base">{t('cards.password.title')}</CardTitle>
              <CardDescription>
                {t('cards.password.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/email" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Mail className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <CardTitle className="text-base">{t('cards.email.title')}</CardTitle>
              <CardDescription>
                {t('cards.email.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/brokers" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <div className="mb-2">
                <UserX className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <CardTitle className="text-base">{t('cards.brokers.title')}</CardTitle>
              <CardDescription>
                {t('cards.brokers.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/rights" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Scale className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <CardTitle className="text-base">{t('cards.rights.title')}</CardTitle>
              <CardDescription>
                {t('cards.rights.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Counters */}
      <div className="mt-8 sm:mt-12">
        <TrustCounters />
      </div>

      {/* Trust footer */}
      <div className="mt-10 sm:mt-16 text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {t.rich('trust', {
            privacyLink: (chunks) => (
              <Link
                href="/privacy"
                className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  )
}
