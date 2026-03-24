import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://breachguard.dk';

const pages: { path: string; priority: number }[] = [
  { path: '/', priority: 1.0 },
  { path: '/password', priority: 0.8 },
  { path: '/email', priority: 0.8 },
  { path: '/brokers', priority: 0.8 },
  { path: '/rights', priority: 0.8 },
  { path: '/rights/wizard', priority: 0.6 },
  { path: '/rights/complaint', priority: 0.6 },
  { path: '/privacy', priority: 0.6 },
  { path: '/guides/databrud', priority: 0.7 },
  { path: '/guides/fjern-data-brokers', priority: 0.7 },
];

// Localized path overrides for non-default locales (guide pages have different slugs)
const localizedPaths: Record<string, Record<string, string>> = {
  '/guides/databrud': { en: '/guides/data-breach' },
  '/guides/fjern-data-brokers': { en: '/guides/remove-data-brokers' },
};

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority }) => {
    const languages: Record<string, string> = {};

    for (const locale of routing.locales) {
      const localePath = localizedPaths[path]?.[locale] ?? path;
      if (locale === routing.defaultLocale) {
        languages[locale] = `${BASE_URL}${localePath}`;
      } else {
        languages[locale] = `${BASE_URL}/${locale}${localePath}`;
      }
    }

    // x-default mirrors the default locale (unprefixed)
    languages['x-default'] = languages[routing.defaultLocale]!;

    return {
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority,
      alternates: {
        languages,
      },
    };
  });
}
