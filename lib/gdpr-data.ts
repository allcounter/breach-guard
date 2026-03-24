export type GdprRight = {
  slug: string
  article: string
  icon: string
  deadlineDays: number
}

export const gdprRights: GdprRight[] = [
  { slug: 'access',        article: 'Art. 15', icon: 'Eye',         deadlineDays: 30 },
  { slug: 'rectification', article: 'Art. 16', icon: 'Pencil',      deadlineDays: 30 },
  { slug: 'erasure',       article: 'Art. 17', icon: 'Trash2',      deadlineDays: 30 },
  { slug: 'restriction',   article: 'Art. 18', icon: 'PauseCircle', deadlineDays: 30 },
  { slug: 'portability',   article: 'Art. 20', icon: 'Download',    deadlineDays: 30 },
  { slug: 'objection',     article: 'Art. 21', icon: 'ShieldOff',   deadlineDays: 30 },
]

export function getRights(): GdprRight[] {
  return gdprRights
}
