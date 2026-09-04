/** GoCardless — prélèvement SEPA pour le solde annuel. */

export const ECHEANCES_PRELEVEMENT_MAX = 7;

/**
 * @deprecated Utiliser computeFirstPrelevementDate() — conservé pour imports existants.
 * La date réelle dépend du jour d’inscription (règle du 30).
 */
export const PRELEVEMENT_START_DATE = '2026-10-05';

export type ModeSolde = 'cheque' | 'prelevement';

export type PrelevementEcheance = {
  index: number;
  date: string; // YYYY-MM-DD
  cents: number;
  euros: string;
};

const GC_API = 'https://api.gocardless.com';
const GC_VERSION = '2015-07-06';

export function isGoCardlessConfigured(): boolean {
  return Boolean(process.env.GOCARDLESS_ACCESS_TOKEN?.trim());
}

export function getGoCardlessToken(): string | null {
  return process.env.GOCARDLESS_ACCESS_TOKEN?.trim() || null;
}

export async function gocardlessFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getGoCardlessToken();
  if (!token) throw new Error('GoCardless n’est pas configuré (GOCARDLESS_ACCESS_TOKEN).');

  const res = await fetch(`${GC_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'GoCardless-Version': GC_VERSION,
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    error?: { message?: string; errors?: { message?: string }[] };
  };

  if (!res.ok) {
    const detail =
      data?.error?.errors?.map((e) => e.message).filter(Boolean).join(' · ') ||
      data?.error?.message ||
      `Erreur GoCardless (${res.status})`;
    throw new Error(detail);
  }

  return data;
}

/**
 * Règle métier GoCardless (délai SEPA) :
 * - inscription avant le 30 du mois M → 1er prélèvement = 5 du mois M+1
 * - inscription à partir du 30 du mois M → 1er prélèvement = 5 du mois M+2
 *
 * Ex. 1–29 sept → 5 oct ; 30 sept / 2 oct → 5 nov.
 */
export function computeFirstPrelevementDate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-based
  const day = now.getDate();
  const monthsAhead = day >= 30 ? 2 : 1;
  const target = new Date(y, m + monthsAhead, 5);
  return toIsoDateLocal(target);
}

export function toIsoDateLocal(d: Date): string {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function formatDateFr(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

/** Répartit le solde en N montants (centimes), reste sur la dernière échéance. */
export function splitSoldeCents(soldeCents: number, n: number): number[] {
  const count = Math.max(1, Math.min(ECHEANCES_PRELEVEMENT_MAX, Math.floor(n)));
  const total = Math.max(0, Math.round(soldeCents));
  const base = Math.floor(total / count);
  const amounts = Array.from({ length: count }, () => base);
  amounts[count - 1] += total - base * count;
  return amounts;
}

export function montantParPrelevementEuros(
  n: number,
  fraisAnnuelsCents: number,
  acompteCents: number
): number {
  const solde = Math.max(0, fraisAnnuelsCents - acompteCents);
  if (n < 1) return solde / 100;
  return Math.round(solde / n) / 100;
}

/** Calendrier complet des prélèvements. */
export function listPrelevementSchedule(
  n: number,
  fraisAnnuelsCents: number,
  acompteCents: number,
  startDate: string = computeFirstPrelevementDate()
): PrelevementEcheance[] {
  const solde = Math.max(0, fraisAnnuelsCents - acompteCents);
  const amounts = splitSoldeCents(solde, n);
  return amounts.map((cents, i) => ({
    index: i + 1,
    date: addMonthsIso(startDate, i),
    cents,
    euros: formatCentsEur(cents),
  }));
}

/** Ajoute `months` mois à une date ISO YYYY-MM-DD (jour conservé au mieux). */
export function addMonthsIso(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y, m - 1 + months, d);
  return toIsoDateLocal(dt);
}

export function formatCentsEur(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * GoCardless limite les metadata à **3 propriétés** sur billing_requests / payments.
 * On compacte le plan de prélèvement dans 3 clés courtes.
 */
export function packBillingMetadata(opts: {
  email: string;
  prenom: string;
  nom: string;
  nb: number;
  soldeCents: number;
  amounts: number[];
  startDate: string;
  basePath: string;
}): Record<string, string> {
  return {
    // email (clé 1)
    e: opts.email.slice(0, 200),
    // identité + chemin (clé 2) — prenom|nom|basePath
    w: `${opts.prenom.slice(0, 40)}|${opts.nom.slice(0, 40)}|${opts.basePath}`.slice(0, 500),
    // plan (clé 3) — nb|solde|start|amount1,amount2,...
    p: `${opts.nb}|${opts.soldeCents}|${opts.startDate}|${opts.amounts.join(',')}`.slice(0, 500),
  };
}

export function unpackBillingMetadata(metadata: Record<string, string> = {}): {
  email: string;
  prenom: string;
  nom: string;
  basePath: string;
  nb: number;
  soldeCents: number;
  startDate: string;
  amounts: number[];
} {
  // Nouveau format compact (e / w / p)
  if (metadata.p || metadata.e || metadata.w) {
    const [prenom = '', nom = '', basePath = '/inscription-initial'] = (metadata.w || '').split('|');
    const [nbRaw = '1', soldeRaw = '0', startDate = '', amountsRaw = ''] = (metadata.p || '').split('|');
    const amounts = amountsRaw
      .split(',')
      .map((x) => Number(x.trim()))
      .filter((n) => n > 0);
    return {
      email: metadata.e || metadata.email || '',
      prenom,
      nom,
      basePath: basePath.startsWith('/inscription-initial') ? basePath : '/inscription-initial',
      nb: Math.max(1, Number(nbRaw) || 1),
      soldeCents: Math.max(0, Number(soldeRaw) || 0),
      startDate: /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate : computeFirstPrelevementDate(),
      amounts,
    };
  }

  // Ancien format (si jamais un BRQ a été créé avant le fix)
  const amounts = metadata.amounts_cents
    ? metadata.amounts_cents
        .split(',')
        .map((x) => Number(x.trim()))
        .filter((n) => n > 0)
    : [];
  return {
    email: metadata.email || '',
    prenom: metadata.prenom || '',
    nom: metadata.nom || '',
    basePath: metadata.base_path || '/inscription-initial',
    nb: Math.max(1, Number(metadata.nb_prelevements) || 1),
    soldeCents: Math.max(0, Number(metadata.solde_cents) || 0),
    startDate: metadata.start_date || computeFirstPrelevementDate(),
    amounts,
  };
}
