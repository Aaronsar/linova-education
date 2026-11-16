/**
 * Soumission serveur-à-serveur à un formulaire du CRM Diploma Santé.
 *
 * Le composant <DiplomaFormEmbed> fait la même chose côté navigateur. Ce
 * module permet de poster depuis une route API Next (par exemple après
 * un upload de fichier) sans re-rendre un form côté client.
 */

import { DIPLOMA_API_BASE, resolveDiplomaFormSlug, type DiplomaFormKey } from './diploma-forms';

export interface DiplomaCrmSubmission {
  /** Clé sémantique (DIPLOMA_FORMS) ou slug brut. */
  form: DiplomaFormKey | string;
  /** Map des field_key → valeur telle qu'attendue par le form CRM. */
  data: Record<string, string>;
  sourceUrl?: string;
  utm?: Partial<Record<'source' | 'medium' | 'campaign' | 'term' | 'content', string>>;
}

export async function submitToDiplomaCrm({
  form,
  data,
  sourceUrl = '',
  utm = {},
}: DiplomaCrmSubmission): Promise<void> {
  const slug = resolveDiplomaFormSlug(form);
  const payload = {
    data,
    hp: '',
    source_url: sourceUrl,
    utm_source: utm.source || '',
    utm_medium: utm.medium || '',
    utm_campaign: utm.campaign || '',
    utm_term: utm.term || '',
    utm_content: utm.content || '',
  };

  const res = await fetch(`${DIPLOMA_API_BASE}/api/forms/${encodeURIComponent(slug)}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`CRM Diploma HTTP ${res.status} : ${text || 'réponse vide'}`);
  }
}
