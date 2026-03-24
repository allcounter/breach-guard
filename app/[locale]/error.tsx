'use client'

import { useTranslations } from 'next-intl'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common.error')

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h2>
      <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        {t('description')}
      </p>
      <Button variant="outline" onClick={reset} className="min-h-[44px] gap-2">
        <RotateCcw className="h-4 w-4" />
        {t('retry')}
      </Button>
    </div>
  )
}
