/** Textes programme pour inscription initiale (partagés formulaire + contrat PDF). */

export interface InscriptionProgrammeCopy {
  heroSubtitle: string;
  heroMeta: string;
  introLead: string;
  formationLabel: string;
  dureeLabel: string;
  dossierBanner: string;
  candidatureTag: string;
  successFormation: string;
  cgiFormation: string;
  cgiDuree: string;
  chequeDos: string;
  documentsPrep: string[];
}

export const PROGRAMME_INITIALE_STANDARD: InscriptionProgrammeCopy = {
  heroSubtitle: 'BTS Biologie Médicale — Formation initiale',
  heroMeta: 'Cycle 2026 — 2028 · Rentrée septembre 2026',
  introLead:
    'S’inscrire chez Linova, c’est rejoindre une école entièrement dédiée aux métiers de la santé. Ce dossier concerne le BTS Biologie Médicale en formation initiale (cycle 2026-2028).',
  formationLabel: 'BTS Biologie Médicale — initiale',
  dureeLabel: '2 ans — 2026-2028',
  dossierBanner: '=== DOSSIER FORMATION INITIALE 2026-2028 ===',
  candidatureTag: 'Formation initiale',
  successFormation: 'BTS Biologie Médicale — formation initiale',
  cgiFormation:
    'Inscription au BTS Biologie Médicale en formation initiale pour le cycle 2026-2028, contrat conclu à distance (droit de rétractation art. 6).',
  cgiDuree: 'Formation de sept. 2026 à juin 2028, sous statut étudiant, avec stages obligatoires.',
  chequeDos: 'acompte BTS BM initiale 2026-2028',
  documentsPrep: [
    'Pièce d’identité (recto/verso)',
    'Photo d’identité récente',
    'Diplôme du bac ou relevé de notes le plus récent',
    'Bulletins de Terminale (et Première si disponibles)',
    'CV et lettre de motivation',
    'JDC (si moins de 25 ans)',
    'Attestation d’assurance responsabilité civile',
    'Notification de bourse (obligatoire pour le tarif boursier)',
  ],
};

export const PROGRAMME_INITIALE_ANNEE2: InscriptionProgrammeCopy = {
  heroSubtitle: 'BTS Biologie Médicale — Entrée en 2ᵉ année',
  heroMeta: 'Formation initiale · 2ᵉ année · Rentrée septembre 2026',
  introLead:
    'S’inscrire chez Linova, c’est rejoindre une école entièrement dédiée aux métiers de la santé. Ce dossier concerne l’entrée en 2ᵉ année du BTS Biologie Médicale en formation initiale.',
  formationLabel: 'BTS Biologie Médicale — 2ᵉ année (initiale)',
  dureeLabel: '1 an — 2ᵉ année (2026-2027)',
  dossierBanner: '=== DOSSIER FORMATION INITIALE — ENTRÉE 2E ANNÉE ===',
  candidatureTag: 'Formation initiale — 2e année',
  successFormation: 'BTS Biologie Médicale — formation initiale, entrée en 2ᵉ année',
  cgiFormation:
    'Inscription au BTS Biologie Médicale en formation initiale, en entrée directe en 2ᵉ année (année scolaire 2026-2027), contrat conclu à distance (droit de rétractation art. 6).',
  cgiDuree:
    'Formation de la 2ᵉ année, de sept. 2026 à juin 2027, sous statut étudiant, avec stages obligatoires.',
  chequeDos: 'acompte BTS BM initiale 2e année',
  documentsPrep: [
    'Pièce d’identité (recto/verso)',
    'Photo d’identité récente',
    'Relevé de notes / bulletins de 1ère année de BTS',
    'Attestation de scolarité ou relevé de 1ère année',
    'CV et lettre de motivation',
    'JDC (si moins de 25 ans)',
    'Attestation d’assurance responsabilité civile',
    'Notification de bourse (obligatoire pour le tarif boursier)',
  ],
};
