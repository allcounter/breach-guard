import type { FAQPage, WebSite, WebApplication, WithContext } from 'schema-dts';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://breachguard.dk';

/**
 * WebSite schema — rendered in the root layout so every page includes it.
 * Uses hyphen format for inLanguage (da-DK, en-US) per schema.org convention.
 */
export function getWebSiteSchema(locale: string): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Breach Guard',
    url: BASE_URL,
    inLanguage: locale === 'da' ? 'da-DK' : 'en-US',
  };
}

/**
 * WebApplication schema — rendered on the home page only.
 * Describes the app as a free security tool available on any platform.
 */
export function getWebApplicationSchema(
  locale: string,
  description: string
): WithContext<WebApplication> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Breach Guard',
    url: BASE_URL,
    description,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'DKK',
    },
    inLanguage: locale === 'da' ? 'da-DK' : 'en-US',
  };
}

/**
 * FAQPage schema — rendered on guide pages with FAQ sections.
 * Each question/answer pair becomes a mainEntity item.
 */
export function getFAQSchema(
  questions: { question: string; answer: string }[]
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question' as const,
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: q.answer,
      },
    })),
  };
}
