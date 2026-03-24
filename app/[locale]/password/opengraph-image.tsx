import { ImageResponse } from 'next/og'
import { OgImageLayout, size, contentType } from '@/lib/og-image'

export { size, contentType }
export const alt = 'Breach Guard — Password Check'

import da from '@/messages/da.json'
import en from '@/messages/en.json'

const messages = { da, en } as const

function getMessages(locale: string) {
  return locale === 'en' ? messages.en : messages.da
}

export function generateStaticParams() {
  return [{ locale: 'da' }, { locale: 'en' }]
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getMessages(locale)

  return new ImageResponse(
    OgImageLayout({
      title: t.ogImage.password.title,
      description: t.ogImage.password.description,
    }),
    { ...size }
  )
}
