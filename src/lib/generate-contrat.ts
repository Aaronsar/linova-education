import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  buildContratInscriptionPdf,
  type ContratInscriptionData,
} from '@/lib/contrat-inscription-pdf';
import { CONTRAT_PDF_REMARQUE_PREFIX, extractSignaturePaths } from '@/lib/contrat-remarques';

export type ContratPayload = {
  formationLabel: string;
  cgiFormation: string;
  cgiDuree: string;
  fraisAnnuelsLabel: string;
  modeAcompte: string;
  modeSolde: string;
  nbCheques?: number;
  nbPrelevements?: number;
  echeances?: { index: number; dateLabel: string; montantLabel: string }[];
  acompteDetail: string;
  soldeDetail: string;
  signatureNom: string;
  signaturePath: string;
  signaturePrelevementNom?: string;
  signaturePrelevementPath?: string;
  mineur?: boolean;
  accordRepresentant?: boolean;
  signedAt?: string;
};

function serviceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

async function downloadStorageBytes(
  supabase: SupabaseClient,
  path: string
): Promise<Uint8Array | null> {
  if (!path || path.startsWith('data:')) return null;
  const { data, error } = await supabase.storage.from('candidatures').download(path);
  if (error || !data) {
    console.warn('[contrat] download fail', path, error?.message);
    return null;
  }
  return new Uint8Array(await data.arrayBuffer());
}

function formatSignedAt(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toLocaleString('fr-FR');
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export async function generateAndStoreContratPdf(opts: {
  candidatureId: string;
  identity: ContratInscriptionData['identity'];
  payload: ContratPayload;
  existingRemarques?: string;
}): Promise<{ path: string; remarques: string } | null> {
  const supabase = serviceSupabase();
  if (!supabase) return null;

  const signedAtIso = opts.payload.signedAt || new Date().toISOString();
  const reference = `INI-${opts.candidatureId.slice(0, 8).toUpperCase()}`;

  const [sigBytes, sigPrevBytes] = await Promise.all([
    downloadStorageBytes(supabase, opts.payload.signaturePath),
    opts.payload.signaturePrelevementPath
      ? downloadStorageBytes(supabase, opts.payload.signaturePrelevementPath)
      : Promise.resolve(null),
  ]);

  const pdfData: ContratInscriptionData = {
    reference,
    signedAtLabel: formatSignedAt(signedAtIso),
    formationLabel: opts.payload.formationLabel,
    cgiFormation: opts.payload.cgiFormation,
    cgiDuree: opts.payload.cgiDuree,
    fraisAnnuelsLabel: opts.payload.fraisAnnuelsLabel,
    lieu: '85 avenue Ledru-Rollin, 75012 Paris',
    identity: opts.identity,
    mineur: Boolean(opts.payload.mineur),
    accordRepresentant: Boolean(opts.payload.accordRepresentant),
    modeAcompte: opts.payload.modeAcompte,
    modeSolde: opts.payload.modeSolde,
    nbCheques: opts.payload.nbCheques,
    nbPrelevements: opts.payload.nbPrelevements,
    echeances: opts.payload.echeances,
    acompteDetail: opts.payload.acompteDetail,
    soldeDetail: opts.payload.soldeDetail,
    signatureNom: opts.payload.signatureNom,
    signaturePng: sigBytes,
    signaturePrelevementNom: opts.payload.signaturePrelevementNom,
    signaturePrelevementPng: sigPrevBytes,
  };

  const pdfBytes = await buildContratInscriptionPdf(pdfData);
  const path = `initial/contrats/${opts.candidatureId}_contrat.pdf`;

  const { error: upErr } = await supabase.storage.from('candidatures').upload(path, pdfBytes, {
    contentType: 'application/pdf',
    upsert: true,
  });
  if (upErr) {
    console.error('[contrat] upload', upErr.message);
    throw new Error(`Upload contrat PDF impossible : ${upErr.message}`);
  }

  let remarques = opts.existingRemarques || '';
  const line = `${CONTRAT_PDF_REMARQUE_PREFIX}${path}`;
  if (remarques.includes(CONTRAT_PDF_REMARQUE_PREFIX)) {
    remarques = remarques
      .split('\n')
      .map((l) => (l.startsWith(CONTRAT_PDF_REMARQUE_PREFIX) ? line : l))
      .join('\n');
  } else {
    remarques = remarques ? `${remarques}\n${line}` : line;
  }

  const { error: updErr } = await supabase
    .from('candidatures')
    .update({ remarques })
    .eq('id', opts.candidatureId);
  if (updErr) {
    console.error('[contrat] update remarques', updErr.message);
  }

  return { path, remarques };
}

/** Reconstruit un payload minimal depuis les remarques (dossiers déjà envoyés). */
export function contratPayloadFromRemarques(
  remarques: string,
  fallback: {
    formationLabel: string;
    cgiFormation: string;
    cgiDuree: string;
    fraisAnnuelsLabel: string;
    signatureNom: string;
  }
): ContratPayload | null {
  const paths = extractSignaturePaths(remarques);
  if (!paths.signature) return null;

  const lines = remarques.split('\n');
  const find = (re: RegExp) => lines.find((l) => re.test(l)) || '';

  const acompteDetail =
    find(/^Acompte pré-inscription/) || 'Acompte de pré-inscription : voir dossier';
  const soldeDetail = find(/^Paiement annuel/) || 'Solde annuel : voir dossier';
  const modeSolde = /prélèvement/i.test(soldeDetail) ? 'prelevement' : 'cheque';
  const modeAcompte = /carte/i.test(acompteDetail) ? 'carte' : 'cheque';

  const sigNomMatch = find(/^Signature électronique :/).match(
    /^Signature électronique :\s*(.+?)\s*·/
  );
  const prevNomMatch = find(/^Signature prélèvement SEPA :/).match(
    /^Signature prélèvement SEPA :\s*(.+?)\s*·/
  );

  const fraisMatch = find(/frais annuels|Frais annuels/i);
  const fraisAnnuelsLabel =
    fraisMatch.match(/([\d\s]+€)/)?.[1]?.replace(/\s+/g, ' ').trim() ||
    fallback.fraisAnnuelsLabel;

  const nbPrev = Number(soldeDetail.match(/(\d+)\s*échéance/)?.[1] || 0) || undefined;
  const nbCheq = Number(soldeDetail.match(/(\d+)\s*chèque/)?.[1] || 0) || undefined;

  return {
    formationLabel: fallback.formationLabel,
    cgiFormation: fallback.cgiFormation,
    cgiDuree: fallback.cgiDuree,
    fraisAnnuelsLabel,
    modeAcompte,
    modeSolde,
    nbCheques: nbCheq,
    nbPrelevements: nbPrev,
    acompteDetail,
    soldeDetail,
    signatureNom: sigNomMatch?.[1]?.trim() || fallback.signatureNom,
    signaturePath: paths.signature,
    signaturePrelevementNom: prevNomMatch?.[1]?.trim(),
    signaturePrelevementPath: paths.signaturePrelevement,
    mineur: /Mineur :\s*oui/i.test(remarques),
    accordRepresentant: /accord représentant :\s*oui/i.test(remarques),
  };
}
