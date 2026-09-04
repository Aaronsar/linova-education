import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { ACOMPTE_LABEL } from '@/lib/acompte';
import { ECHEANCES_PRELEVEMENT_MAX } from '@/lib/gocardless';
import { ECHEANCES_CHEQUE_MAX } from '@/lib/acompte';

export type ContratEcheance = {
  index: number;
  dateLabel: string;
  montantLabel: string;
};

export type ContratInscriptionData = {
  reference: string;
  signedAtLabel: string;
  formationLabel: string;
  cgiFormation: string;
  cgiDuree: string;
  fraisAnnuelsLabel: string;
  lieu: string;
  identity: {
    prenom: string;
    nom: string;
    dateNaissance: string;
    lieuNaissance: string;
    nationalite: string;
    adresse: string;
    codePostal: string;
    ville: string;
    email: string;
    telephone: string;
  };
  mineur: boolean;
  accordRepresentant: boolean;
  modeAcompte: 'carte' | 'cheque' | string;
  modeSolde: 'cheque' | 'prelevement' | string;
  nbCheques?: number;
  nbPrelevements?: number;
  echeances?: ContratEcheance[];
  acompteDetail: string;
  soldeDetail: string;
  signatureNom: string;
  signaturePng?: Uint8Array | null;
  signaturePrelevementNom?: string;
  signaturePrelevementPng?: Uint8Array | null;
};

const MARGIN = 50;
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - MARGIN * 2;
const NAVY = rgb(0.09, 0.18, 0.24);
const TEAL = rgb(0.1, 0.45, 0.48);
const GRAY = rgb(0.35, 0.38, 0.42);
const LIGHT = rgb(0.94, 0.95, 0.96);

/** Helvetica / WinAnsi : remplace les caractères hors jeu pour éviter les crashs. */
function sanitizePdfText(text: string): string {
  return text
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/[^\x00-\xFF]/g, '?');
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitizePdfText(text).replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

type Cursor = { page: PDFPage; y: number; doc: PDFDocument; font: PDFFont; bold: PDFFont };

async function ensureSpace(c: Cursor, needed: number): Promise<void> {
  if (c.y - needed >= MARGIN + 20) return;
  c.page = c.doc.addPage([PAGE_W, PAGE_H]);
  c.y = PAGE_H - MARGIN;
  drawHeader(c);
  c.y -= 28;
}

function drawHeader(c: Cursor) {
  c.page.drawRectangle({
    x: 0,
    y: PAGE_H - 36,
    width: PAGE_W,
    height: 36,
    color: NAVY,
  });
  c.page.drawText(sanitizePdfText('Linova Education — Contrat d’inscription'), {
    x: MARGIN,
    y: PAGE_H - 24,
    size: 10,
    font: c.bold,
    color: rgb(1, 1, 1),
  });
}

function drawFooter(page: PDFPage, font: PDFFont, pageIndex: number, total: number, ref: string) {
  page.drawText(sanitizePdfText(`Ref. ${ref}  ·  Page ${pageIndex}/${total}`), {
    x: MARGIN,
    y: 22,
    size: 8,
    font,
    color: GRAY,
  });
  page.drawText(sanitizePdfText('Document electronique — art. 1366 et 1367 du code civil'), {
    x: PAGE_W - MARGIN - 250,
    y: 22,
    size: 7,
    font,
    color: GRAY,
  });
}

async function drawParagraph(
  c: Cursor,
  text: string,
  opts?: { size?: number; color?: ReturnType<typeof rgb>; bold?: boolean; gap?: number }
) {
  const size = opts?.size ?? 9.5;
  const font = opts?.bold ? c.bold : c.font;
  const color = opts?.color ?? GRAY;
  const lines = wrapText(text, font, size, CONTENT_W);
  const lineH = size + 3;
  await ensureSpace(c, lines.length * lineH + (opts?.gap ?? 8));
  for (const line of lines) {
    c.page.drawText(line, { x: MARGIN, y: c.y, size, font, color });
    c.y -= lineH;
  }
  c.y -= opts?.gap ?? 6;
}

async function drawHeading(c: Cursor, text: string) {
  await ensureSpace(c, 28);
  c.page.drawText(sanitizePdfText(text), { x: MARGIN, y: c.y, size: 12, font: c.bold, color: NAVY });
  c.y -= 6;
  c.page.drawRectangle({
    x: MARGIN,
    y: c.y,
    width: 80,
    height: 1.5,
    color: TEAL,
  });
  c.y -= 16;
}

async function drawKeyValue(c: Cursor, label: string, value: string) {
  await ensureSpace(c, 16);
  const safeLabel = sanitizePdfText(label);
  const labelW = c.bold.widthOfTextAtSize(safeLabel, 9);
  c.page.drawText(safeLabel, { x: MARGIN, y: c.y, size: 9, font: c.bold, color: NAVY });
  const lines = wrapText(value || '—', c.font, 9, CONTENT_W - labelW - 8);
  c.page.drawText(lines[0], {
    x: MARGIN + labelW + 6,
    y: c.y,
    size: 9,
    font: c.font,
    color: GRAY,
  });
  c.y -= 13;
  for (let i = 1; i < lines.length; i++) {
    await ensureSpace(c, 13);
    c.page.drawText(lines[i], {
      x: MARGIN + labelW + 6,
      y: c.y,
      size: 9,
      font: c.font,
      color: GRAY,
    });
    c.y -= 13;
  }
}

async function drawSignatureBlock(
  c: Cursor,
  title: string,
  nom: string,
  png: Uint8Array | null | undefined,
  signedAt: string
) {
  await ensureSpace(c, 140);
  c.page.drawRectangle({
    x: MARGIN,
    y: c.y - 120,
    width: CONTENT_W,
    height: 125,
    color: LIGHT,
    borderColor: rgb(0.85, 0.87, 0.9),
    borderWidth: 1,
  });
  c.page.drawText(sanitizePdfText(title), {
    x: MARGIN + 12,
    y: c.y - 16,
    size: 10,
    font: c.bold,
    color: NAVY,
  });
  c.page.drawText(sanitizePdfText(`Signataire : ${nom}`), {
    x: MARGIN + 12,
    y: c.y - 32,
    size: 9,
    font: c.font,
    color: GRAY,
  });
  c.page.drawText(sanitizePdfText(`Date / heure : ${signedAt}`), {
    x: MARGIN + 12,
    y: c.y - 46,
    size: 8,
    font: c.font,
    color: GRAY,
  });

  if (png && png.length > 0) {
    try {
      let img;
      try {
        img = await c.doc.embedPng(png);
      } catch {
        img = await c.doc.embedJpg(png);
      }
      const maxW = 220;
      const maxH = 55;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      c.page.drawImage(img, {
        x: MARGIN + 12,
        y: c.y - 115,
        width: w,
        height: h,
      });
    } catch {
      c.page.drawText('(Signature image non lisible)', {
        x: MARGIN + 12,
        y: c.y - 80,
        size: 8,
        font: c.font,
        color: GRAY,
      });
    }
  } else {
    c.page.drawText('(Signature manquante)', {
      x: MARGIN + 12,
      y: c.y - 80,
      size: 8,
      font: c.font,
      color: GRAY,
    });
  }
  c.y -= 140;
}

/** Génère le PDF binaire du contrat d’inscription initiale. */
export async function buildContratInscriptionPdf(
  data: ContratInscriptionData
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const c: Cursor = { page, y: PAGE_H - MARGIN, doc, font, bold };

  drawHeader(c);
  c.y -= 40;

  c.page.drawText(sanitizePdfText('CONTRAT D’INSCRIPTION'), {
    x: MARGIN,
    y: c.y,
    size: 18,
    font: bold,
    color: NAVY,
  });
  c.y -= 18;
  c.page.drawText(sanitizePdfText(data.formationLabel), {
    x: MARGIN,
    y: c.y,
    size: 11,
    font: bold,
    color: TEAL,
  });
  c.y -= 14;
  await drawParagraph(
    c,
    `Référence dossier : ${data.reference}  ·  Signé électroniquement le ${data.signedAtLabel}`,
    { size: 9, color: GRAY, gap: 12 }
  );

  await drawHeading(c, '1. Identité de l’étudiant(e)');
  const id = data.identity;
  await drawKeyValue(c, 'Nom / prénom :', `${id.prenom} ${id.nom}`.trim());
  await drawKeyValue(c, 'Date / lieu de naissance :', `${id.dateNaissance || '—'} — ${id.lieuNaissance || '—'}`);
  await drawKeyValue(c, 'Nationalité :', id.nationalite || '—');
  await drawKeyValue(
    c,
    'Adresse :',
    `${id.adresse}, ${id.codePostal} ${id.ville}`.replace(/^, |, $/g, '')
  );
  await drawKeyValue(c, 'E-mail / téléphone :', `${id.email}  ·  ${id.telephone}`);
  if (data.mineur) {
    await drawKeyValue(
      c,
      'Mineur :',
      data.accordRepresentant
        ? 'Oui — accord du représentant légal déclaré'
        : 'Oui — accord représentant non confirmé'
    );
  }
  c.y -= 6;

  await drawHeading(c, '2. Formation et frais');
  await drawKeyValue(c, 'Formation :', data.formationLabel);
  await drawKeyValue(c, 'Lieu :', data.lieu);
  await drawKeyValue(c, 'Frais annuels :', data.fraisAnnuelsLabel);
  await drawKeyValue(c, 'Acompte de pré-inscription :', ACOMPTE_LABEL);
  c.y -= 4;

  await drawHeading(c, '3. Modalités de paiement');
  await drawParagraph(c, data.acompteDetail, { size: 9, gap: 4 });
  await drawParagraph(c, data.soldeDetail, { size: 9, gap: 8 });

  if (data.modeSolde === 'prelevement' && data.echeances?.length) {
    await drawParagraph(
      c,
      `Calendrier des prélèvements SEPA (${data.nbPrelevements || data.echeances.length} échéance(s), max. ${ECHEANCES_PRELEVEMENT_MAX}) :`,
      { size: 9, bold: true, color: NAVY, gap: 4 }
    );
    for (const e of data.echeances) {
      await drawParagraph(
        c,
        `  ${e.index}${e.index === 1 ? 'er' : 'e'} prélèvement — ${e.dateLabel} — ${e.montantLabel}`,
        { size: 9, gap: 2 }
      );
    }
    c.y -= 6;
  } else if (data.modeSolde === 'cheque') {
    await drawParagraph(
      c,
      `Solde annuel par chèque : ${data.nbCheques || 1} chèque(s) (1 à ${ECHEANCES_CHEQUE_MAX}).`,
      { size: 9, gap: 8 }
    );
  }

  await drawHeading(c, '4. Conditions générales d’inscription (CGI)');
  await drawParagraph(c, `Art. 1 — ${data.cgiFormation}`, { size: 8.5, gap: 5 });
  await drawParagraph(c, `Art. 2 — ${data.cgiDuree}`, { size: 8.5, gap: 5 });
  await drawParagraph(
    c,
    `Art. 5 — Acompte de ${ACOMPTE_LABEL} (carte ou chèque) ; solde annuel par chèque (1 à ${ECHEANCES_CHEQUE_MAX}) ou prélèvement SEPA (1 à ${ECHEANCES_PRELEVEMENT_MAX} max.). En cas de prélèvement, le premier a lieu le 5 du mois suivant l’inscription, ou le 5 du mois d’après si l’inscription est faite à partir du 30 du mois (délai SEPA GoCardless).`,
    { size: 8.5, gap: 5 }
  );
  await drawParagraph(
    c,
    'Art. 6 — Rétractation sous 14 jours calendaires sans frais ; remboursement intégral de l’acompte.',
    { size: 8.5, gap: 5 }
  );
  await drawParagraph(
    c,
    `Art. 7 — Désistement après ce délai et avant la rentrée : acompte de ${ACOMPTE_LABEL} acquis à Linova.`,
    { size: 8.5, gap: 5 }
  );
  await drawParagraph(
    c,
    'Art. 8 — Interruption après rentrée : barème dégressif (25 % / 50 % / 75 % / 100 % des frais annuels selon la date).',
    { size: 8.5, gap: 5 }
  );
  await drawParagraph(
    c,
    'Art. 9 — Remboursement intégral : non-obtention du bac, refus de visa/titre de séjour, formation non ouverte, ou obtention d’un contrat d’alternance entraînant le basculement hors formation initiale.',
    { size: 8.5, gap: 5 }
  );
  await drawParagraph(
    c,
    'Art. 14 — Données personnelles traitées pour la candidature et la scolarité ; droits RGPD exercables auprès du DPO Linova ; réclamation CNIL possible.',
    { size: 8.5, gap: 5 }
  );
  await drawParagraph(
    c,
    'Art. 19 — La validation électronique vaut signature (art. 1366 et 1367 du code civil).',
    { size: 8.5, gap: 10 }
  );

  await drawHeading(c, '5. Conditions générales de services (CGS)');
  await drawParagraph(
    c,
    'Les CGS de Linova Éducation font partie du contrat de formation (rang supérieur aux CGI). Elles sont consultables sur linova-education.fr/conditions-generales-de-services. L’étudiant(e) déclare les avoir lues et acceptées.',
    { size: 8.5, gap: 12 }
  );

  await drawHeading(c, '6. Déclarations et signatures électroniques');
  await drawParagraph(
    c,
    'L’étudiant(e) certifie l’exactitude des informations fournies, s’engage à suivre la formation avec assiduité, et accepte les CGI et les CGS. La signature ci-dessous a la même valeur qu’une signature manuscrite.',
    { size: 9, gap: 10 }
  );

  await drawSignatureBlock(
    c,
    'Signature du contrat (CGI / CGS)',
    data.signatureNom,
    data.signaturePng,
    data.signedAtLabel
  );

  if (data.modeSolde === 'prelevement' && data.signaturePrelevementNom) {
    await drawSignatureBlock(
      c,
      'Signature — engagement de prélèvement SEPA',
      data.signaturePrelevementNom,
      data.signaturePrelevementPng,
      data.signedAtLabel
    );
  }

  await ensureSpace(c, 40);
  await drawParagraph(
    c,
    'Linova Éducation — 85 avenue Ledru-Rollin, 75012 Paris — Document généré automatiquement à la validation du dossier d’inscription.',
    { size: 8, color: GRAY, gap: 0 }
  );

  const pages = doc.getPages();
  pages.forEach((p, i) => drawFooter(p, font, i + 1, pages.length, data.reference));

  return doc.save();
}

/** Préfixe / parsing remarques : voir `@/lib/contrat-remarques`. */
export {
  CONTRAT_PDF_REMARQUE_PREFIX,
  extractPathFromRemarques,
  extractSignaturePaths,
} from '@/lib/contrat-remarques';

