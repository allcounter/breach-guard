const suffixes: Record<string, { accounts: string; million: string; billion: string; k: string }> = {
  da: { accounts: 'konti', million: 'million konti', billion: 'milliarder konti', k: 'k konti' },
  en: { accounts: 'accounts', million: 'million accounts', billion: 'billion accounts', k: 'k accounts' },
}

export function formatAccounts(count: number, locale: string = 'da'): string {
  const s = suffixes[locale] ?? suffixes.en!
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1).replace('.0', '')} ${s.billion}`
  }
  if (count >= 1_000_000) {
    return `${Math.round(count / 1_000_000)} ${s.million}`
  }
  if (count >= 1_000) {
    return `${Math.round(count / 1_000).toLocaleString(locale === 'da' ? 'da-DK' : 'en-US')}k ${s.accounts}`
  }
  return `${count.toLocaleString(locale === 'da' ? 'da-DK' : 'en-US')} ${s.accounts}`
}

export function formatDate(dateStr: string, locale: string = 'da'): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale === 'da' ? 'da-DK' : 'en-US', { month: 'long', year: 'numeric' })
}
