/** Préfixe de ligne dans `remarques` pour localiser le PDF. */
export const CONTRAT_PDF_REMARQUE_PREFIX = 'Contrat PDF :';

export function extractPathFromRemarques(remarques: string, prefix: string): string | null {
  if (!remarques) return null;
  const line = remarques.split('\n').find((l) => l.startsWith(prefix));
  if (!line) return null;
  const path = line.slice(prefix.length).trim();
  return path || null;
}

export function extractSignaturePaths(remarques: string): {
  signature?: string;
  signaturePrelevement?: string;
  contratPdf?: string;
} {
  return {
    signature: extractPathFromRemarques(remarques, 'Signature image :') || undefined,
    signaturePrelevement:
      extractPathFromRemarques(remarques, 'Signature prélèvement image :') || undefined,
    contratPdf: extractPathFromRemarques(remarques, CONTRAT_PDF_REMARQUE_PREFIX) || undefined,
  };
}

/** Extrait d’autres chemins storage éventuels dans les remarques. */
export function extractExtraDocPaths(remarques: string): { label: string; path: string }[] {
  const prefixes: { label: string; prefix: string }[] = [
    { label: 'Bulletins', prefix: 'Bulletins : ' },
    { label: 'Lettre de motivation', prefix: 'Lettre motivation : ' },
    { label: 'JDC', prefix: 'JDC : ' },
    { label: 'Responsabilité civile', prefix: 'RC : ' },
    { label: 'Justificatif de bourse', prefix: 'Bourse : ' },
  ];
  return prefixes
    .map(({ label, prefix }) => {
      const path = extractPathFromRemarques(remarques, prefix);
      return path ? { label, path } : null;
    })
    .filter((x): x is { label: string; path: string } => Boolean(x));
}
