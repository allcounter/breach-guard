import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['da', 'en'],
  defaultLocale: 'da',
  localePrefix: 'as-needed',
  localeCookie: false,
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/password': '/password',
    '/email': '/email',
    '/brokers': '/brokers',
    '/rights': '/rights',
    '/rights/wizard': '/rights/wizard',
    '/rights/complaint': '/rights/complaint',
    '/privacy': '/privacy',
    '/guides/databrud': {
      da: '/guides/databrud',
      en: '/guides/data-breach',
    },
    '/guides/fjern-data-brokers': {
      da: '/guides/fjern-data-brokers',
      en: '/guides/remove-data-brokers',
    },
  },
});
