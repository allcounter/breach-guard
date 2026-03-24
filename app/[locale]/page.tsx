import { getTranslations } from 'next-intl/server';
import { getAlternates, getOpenGraphDefaults, getCanonicalUrl } from '@/lib/metadata';
import { JsonLd } from '@/components/json-ld';
import { getWebApplicationSchema } from '@/lib/structured-data';
import HomeClient from './home-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.metadata' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: getAlternates('/', locale),
    openGraph: {
      ...getOpenGraphDefaults(locale),
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/', locale),
    },
    twitter: {
      card: 'summary_large_image' as const,
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.metadata' });
  return (
    <>
      <JsonLd data={getWebApplicationSchema(locale, t('description'))} />
      <HomeClient />
    </>
  );
}
