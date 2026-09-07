/** Tag interne si Postgres n'accepte pas encore le statut `desinscrit`. */
export const DESINSCRIT_TAG = '[[linova:desinscrit]]';

export function hasDesinscritTag(notes: string | null | undefined): boolean {
  return Boolean(notes?.includes(DESINSCRIT_TAG));
}

export function applyDesinscritTag(notes: string | null | undefined): string {
  const base = notes || '';
  if (base.includes(DESINSCRIT_TAG)) return base;
  const trimmed = base.trim();
  return trimmed ? `${DESINSCRIT_TAG}\n${trimmed}` : DESINSCRIT_TAG;
}

export function stripDesinscritTag(notes: string | null | undefined): string {
  return (notes || '')
    .split('\n')
    .filter((line) => line.trim() !== DESINSCRIT_TAG)
    .join('\n')
    .replace(DESINSCRIT_TAG, '')
    .replace(/^\n+/, '')
    .trim();
}

export function isDesinscrit(
  statut: string | null | undefined,
  notes?: string | null
): boolean {
  return statut === 'desinscrit' || hasDesinscritTag(notes);
}

export function displayStatut(
  statut: string | null | undefined,
  notes?: string | null
): string {
  if (isDesinscrit(statut, notes)) return 'desinscrit';
  return statut || 'nouveau';
}
