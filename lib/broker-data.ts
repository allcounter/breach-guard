import brokerDataJson from '@/data/broker-data.json'

export type Difficulty = 'easy' | 'medium' | 'hard'
export type Region = 'denmark' | 'sweden' | 'norway' | 'finland' | 'international'
export type BrokerCategory = 'directory' | 'marketing' | 'credit' | 'government' | 'search-engine'

export interface BrokerEntry {
  name: string
  slug: string
  optOutUrl: string
  difficulty: Difficulty
  timeEstimate: string
  lastVerified: string
  steps: string[]
  notes: string | null
  region: Region
  category: BrokerCategory
  dataTypes: string[]
  requiresNationalId: boolean
}

const brokerData: BrokerEntry[] = brokerDataJson as BrokerEntry[]

export function getBrokers(): BrokerEntry[] {
  return brokerData
}

export function getBrokerBySlug(slug: string): BrokerEntry | undefined {
  return brokerData.find((b) => b.slug === slug)
}

export function getBrokersByRegion(region: Region): BrokerEntry[] {
  return brokerData.filter((b) => b.region === region)
}

export function getRegions(): Region[] {
  return ['denmark', 'sweden', 'norway', 'finland', 'international']
}

export function getCategories(): BrokerCategory[] {
  return ['directory', 'marketing', 'credit', 'government', 'search-engine']
}
