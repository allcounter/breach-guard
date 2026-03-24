import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

type Messages = Record<string, unknown>;

/**
 * Recursively deep-merges `overlay` onto `base`.
 * Overlay values take precedence; missing overlay keys fall back to base.
 */
function deepMerge(base: Messages, overlay: Messages): Messages {
  const result: Messages = { ...base };
  for (const key of Object.keys(overlay)) {
    const baseVal = base[key];
    const overlayVal = overlay[key];
    if (
      typeof baseVal === 'object' &&
      baseVal !== null &&
      typeof overlayVal === 'object' &&
      overlayVal !== null &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overlayVal)
    ) {
      result[key] = deepMerge(baseVal as Messages, overlayVal as Messages);
    } else {
      result[key] = overlayVal;
    }
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Always load English as the base fallback
  const enMessages: Messages = (await import('../messages/en.json')).default;

  // Load the requested locale's messages and deep-merge over English
  // This ensures missing DA keys fall back to English text
  let messages: Messages;
  if (locale === 'en') {
    messages = enMessages;
  } else {
    const localeMessages: Messages = (await import(`../messages/${locale}.json`)).default;
    messages = deepMerge(enMessages, localeMessages);
  }

  return {
    locale,
    messages,
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[next-intl]', error.message);
      }
    },
    getMessageFallback({ namespace, key }) {
      // This should rarely fire since deep merge covers missing keys
      return `[${namespace}.${key}]`;
    },
  };
});
