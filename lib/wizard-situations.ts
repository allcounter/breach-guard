export type WizardSituation = {
  slug: string
  icon: string
  primaryRight: string
  secondaryRights: string[]
}

export const wizardSituations: WizardSituation[] = [
  {
    slug: 'breach',
    icon: 'ShieldAlert',
    primaryRight: 'access',
    secondaryRights: ['erasure'],
  },
  {
    slug: 'data-removal',
    icon: 'Trash2',
    primaryRight: 'erasure',
    secondaryRights: [],
  },
  {
    slug: 'unwanted-marketing',
    icon: 'MailX',
    primaryRight: 'objection',
    secondaryRights: [],
  },
  {
    slug: 'wrong-data',
    icon: 'Pencil',
    primaryRight: 'rectification',
    secondaryRights: [],
  },
  {
    slug: 'access-request',
    icon: 'Eye',
    primaryRight: 'access',
    secondaryRights: ['portability'],
  },
]

export function getSituations(): WizardSituation[] {
  return wizardSituations
}

export function getSituationBySlug(slug: string): WizardSituation | undefined {
  return wizardSituations.find((s) => s.slug === slug)
}

export type BreachAction = {
  slug: string
  rightSlugs: string[]
  icon: string
}

export const breachActions: BreachAction[] = [
  { slug: 'passwords-exposed', rightSlugs: ['access'], icon: 'KeyRound' },
  { slug: 'financial-data', rightSlugs: ['access', 'restriction'], icon: 'CreditCard' },
  { slug: 'personal-info', rightSlugs: ['access', 'erasure'], icon: 'User' },
  { slug: 'email-in-breach', rightSlugs: ['access', 'objection'], icon: 'Mail' },
  { slug: 'health-data', rightSlugs: ['access', 'restriction'], icon: 'Heart' },
]
