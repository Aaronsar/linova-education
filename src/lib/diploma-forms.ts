/**
 * Dictionnaire central des slugs de formulaires hébergés sur le CRM
 * Diploma Santé. Permet de référencer un form par une clé sémantique
 * dans le code (`DIPLOMA_FORMS.contact`) plutôt qu'avec le slug brut
 * "linova-contact-hs214e4f".
 *
 * Pour ajouter un nouveau form, créer la clé ici et copier-coller le slug
 * fourni par le CRM. Le composant <DiplomaFormEmbed form="..." /> accepte
 * soit la clé soit le slug brut.
 */

export const DIPLOMA_FORMS = {
  brochure: 'linova-brochure-hsf4252e',
  contact: 'linova-contact-hs214e4f',
  form: 'linova-form-hs3ae4cf',
  alternant: 'linova-formulaire-alternant-hs353368',
  entreprise: 'linova-formulaire-entreprise-hs7e3887',
  etudiant: 'linova-formulaire-etudiant-hs21cc52',
  handicap: 'linova-formulaire-handicap-hsfc90df',
  dernieresPlaces: 'dernieres-places-linova-hsd04d92',
} as const;

export type DiplomaFormKey = keyof typeof DIPLOMA_FORMS;

/** Base URL du CRM Diploma Santé. Override via NEXT_PUBLIC_DIPLOMA_API_BASE si besoin. */
export const DIPLOMA_API_BASE =
  process.env.NEXT_PUBLIC_DIPLOMA_API_BASE || 'https://rdv-agenda.vercel.app';

/** Résout une clé du dictionnaire OU un slug brut → slug réel à appeler. */
export function resolveDiplomaFormSlug(input: DiplomaFormKey | string): string {
  if (input in DIPLOMA_FORMS) {
    return DIPLOMA_FORMS[input as DiplomaFormKey];
  }
  return input;
}

// ─── Types de retour de l'API CRM ───────────────────────────────────────────

export interface DiplomaFieldOption {
  label: string;
  value: string;
}

export type DiplomaFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea';

export interface DiplomaFormField {
  field_type: DiplomaFieldType;
  field_key: string;
  label: string;
  placeholder?: string | null;
  help_text?: string | null;
  required?: boolean;
  options?: DiplomaFieldOption[];
  order_index: number;
}

export interface DiplomaFormSchema {
  id: string;
  slug: string;
  title: string;
  submit_label?: string | null;
  success_message?: string | null;
  fields: DiplomaFormField[];
  error?: string;
}
