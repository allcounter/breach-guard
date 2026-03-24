'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { ShieldOff, UserX, Monitor, Github } from 'lucide-react'

export function TrustBadges() {
  const t = useTranslations('home')

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Badge
        variant="outline"
        className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-normal"
      >
        <ShieldOff className="h-3.5 w-3.5" />
        {t('badges.noTracking')}
      </Badge>

      <Badge
        variant="outline"
        className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-normal"
      >
        <UserX className="h-3.5 w-3.5" />
        {t('badges.noAccounts')}
      </Badge>

      <Badge
        variant="outline"
        className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-normal"
      >
        <Monitor className="h-3.5 w-3.5" />
        {t('badges.clientSide')}
      </Badge>

      <a
        href="https://github.com/allcounter/breach-guard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        <Badge
          variant="outline"
          className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-normal cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Github className="h-3.5 w-3.5" />
          {t('badges.openSource')}
        </Badge>
      </a>
    </div>
  )
}
