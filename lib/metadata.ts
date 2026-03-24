import { routing } from '@/i18n/routing';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://breachguard.dk';

/**
 * Build hreflang alternate URLs for a given path.
 *
 * For the default locale (`da`) paths are unprefixed (localePrefix: 'as-needed').
 * For non-default locales the locale segment is prepended.
 * `x-default` points to the default-locale (unprefixed) URL.
 */
export function getAlternates(href: string, locale?: string) {
  const languages: Record<string, string> = {};

  // Look up localized pathnames (guide pages have different slugs per locale)
  const pathConfig = (routing as { pathnames?: Record<string, string | Record<string, string>> }).pathnames?.[href];

  for (const loc of routing.locales) {
    const localePath =
      typeof pathConfig === 'object' ? (pathConfig[loc] ?? href) : href;

    if (loc === routing.defaultLocale) {
      languages[loc] = `${BASE_URL}${localePath}`;
    } else {
      languages[loc] = `${BASE_URL}/${loc}${localePath}`;
    }
  }

  // x-default mirrors the default locale (unprefixed)
  const defaultUrl = languages[routing.defaultLocale]!;
  languages['x-default'] = defaultUrl;

  // Self-referencing canonical for the active locale (SEO best practice)
  const canonical = locale ? (languages[locale] ?? defaultUrl) : defaultUrl;

  return {
    canonical,
    languages,
  };
}

/**
 * Shared Open Graph defaults for all pages.
 * OG uses underscore locale format (da_DK, en_US), NOT hyphen.
 */
export function getOpenGraphDefaults(locale: string) {
  return {
    siteName: 'Breach Guard',
    locale: locale === 'da' ? 'da_DK' : 'en_US',
    type: 'website' as const,
  };
}

/**
 * Convenience helper to extract the canonical URL for a given route and locale.
 * Used as the `url` field in Open Graph metadata.
 */
export function getCanonicalUrl(href: string, locale: string): string {
  return getAlternates(href, locale).canonical;
}
