import breachData from '@/data/breach-metadata.json'

// Severity levels ordered from most to least severe.
const SEVERITY_ORDER = { high: 0, medium: 1, low: 2, unknown: 3 } as const

export type Severity = 'high' | 'medium' | 'low'

export interface BreachMetadataEntry {
  breachName: string
  displayName: string
  date: string
  accounts: number
  dataTypes: string[]
  severity: Severity
  guidance: string
}

export interface EnrichedBreach {
  breachName: string
  displayName: string
  date: string | null
  accounts: number | null
  dataTypes: string[]
  severity: 'high' | 'medium' | 'low' | 'unknown'
  guidance: string | null
}

// Build case-insensitive lookup map at module load time.
const metadataMap = new Map<string, BreachMetadataEntry>()
for (const entry of breachData as BreachMetadataEntry[]) {
  metadataMap.set(entry.breachName.toLowerCase(), entry)
}

/**
 * Look up breach metadata by name (case-insensitive).
 */
export function getBreachMetadata(breachName: string): BreachMetadataEntry | null {
  return metadataMap.get(breachName.toLowerCase()) ?? null
}

/**
 * Enrich a list of breach names from XposedOrNot with curated metadata.
 * Unknown breaches get severity "unknown" and null metadata fields.
 * Results are sorted: high > medium > low > unknown, then alphabetically.
 */
export function enrichBreachList(breachNames: string[]): EnrichedBreach[] {
  const enriched = breachNames.map((name): EnrichedBreach => {
    const metadata = getBreachMetadata(name)
    if (metadata) {
      return {
        breachName: metadata.breachName,
        displayName: metadata.displayName,
        date: metadata.date,
        accounts: metadata.accounts,
        dataTypes: metadata.dataTypes,
        severity: metadata.severity,
        guidance: metadata.guidance,
      }
    }
    return {
      breachName: name,
      displayName: name,
      date: null,
      accounts: null,
      dataTypes: [],
      severity: 'unknown',
      guidance: null,
    }
  })

  // Sort by severity (high first), then alphabetically by display name.
  return enriched.sort((a, b) => {
    const severityDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    if (severityDiff !== 0) return severityDiff
    return a.displayName.localeCompare(b.displayName)
  })
}

/**
 * Data type descriptions for tooltips/glossary (GUID-06).
 */
export const dataTypeDescriptions: Record<string, string> = {
  'Email addresses': 'Your email address — can be used for spam and phishing',
  'Passwords': 'Your password, possibly in hashed or plaintext form',
  'Password hints': 'Hints that may reveal your password or parts of it',
  'Usernames': 'Your username on the breached service',
  'Phone numbers': 'Your phone number — risk of SMS phishing and SIM swapping',
  'Physical addresses': 'Your home or mailing address',
  'IP addresses': 'Your IP address at the time — can reveal approximate location',
  'Dates of birth': 'Your date of birth — commonly used for identity verification',
  'Credit cards': 'Credit card numbers or partial card data',
  'Social security numbers': 'SSN or national ID — high risk of identity theft',
  'Names': 'Your full name or display name',
  'Genders': 'Your gender as registered on the service',
  'Employers': 'Your employer or company name',
  'Job titles': 'Your professional title',
  'Security questions and answers': 'Security Q&A — change these on all services',
  'Passport numbers': 'Your passport number — consider replacing your passport',
}
