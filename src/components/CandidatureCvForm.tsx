'use client';

/**
 * Formulaire de candidature avec dépôt de CV (BTS NDRC en alternance).
 * Envoie tout à /api/candidature-cv, qui transmet la candidature et le CV
 * à recrutement@linova-education.fr.
 */

import { useState } from 'react';
import { trackPixelEvent } from './MetaPixel';

const MAX_CV_BYTES = 4 * 1024 * 1024;
const ACCEPT = '.pdf,.doc,.docx';

const DIPLOMES = [
  'Terminale en cours',
  'Baccalauréat général',
  'Baccalauréat technologique',
  'Baccalauréat professionnel',
  'Bac+1 ou plus',
  'Autre diplôme de niveau 4',
];

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function CandidatureCvForm({
  formation = 'bts-ndrc',
  title = 'Candidater au BTS NDRC en alternance',
  subtitle = 'Déposez votre CV : nous vous recontactons sous 5 jours ouvrés.',
}: {
  formation?: string;
  title?: string;
  subtitle?: string;
}) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [diploma, setDiploma] = useState('');
  const [message, setMessage] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const canSubmit =
    firstname.trim() && lastname.trim() && isValidEmail(email) && phone.trim() && cv && consent && !submitting;

  function handleFile(file: File | null) {
    setError(null);
    if (!file) {
      setCv(null);
      return;
    }
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setCv(null);
      setError('Format non accepté. Formats acceptés : PDF, DOC, DOCX.');
      return;
    }
    if (file.size > MAX_CV_BYTES) {
      setCv(null);
      setError('Votre CV dépasse 4 Mo. Merci de joindre un fichier plus léger.');
      return;
    }
    setCv(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !cv) return;
    setSubmitting(true);
    setError(null);

    const body = new FormData();
    body.set('formation', formation);
    body.set('firstname', firstname.trim());
    body.set('lastname', lastname.trim());
    body.set('email', email.trim());
    body.set('phone', phone.trim());
    body.set('city', city.trim());
    body.set('diploma', diploma);
    body.set('message', message.trim());
    body.set('consent', 'oui');
    body.set('hp', hp);
    body.set('source_url', window.location.href);
    body.set('cv', cv);

    try {
      const res = await fetch('/api/candidature-cv', { method: 'POST', body });
      if (!res.ok) {
        let msg = `Erreur ${res.status}`;
        try {
          msg = (await res.json()).error || msg;
        } catch {
          /* ignore */
        }
        setError(msg);
        return;
      }
      setSuccess(true);
      try {
        const w = window as unknown as { dataLayer?: { push: (e: unknown) => void } };
        w.dataLayer?.push({ event: 'form_submit', form_slug: `candidature-cv-${formation}` });
        trackPixelEvent('Contact');
        trackPixelEvent('CandidatureBTSNDRC');
      } catch {
        /* ignore */
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all text-dark text-sm placeholder-gray-400 bg-white';
  const labelClass = 'block text-xs font-semibold text-gray-500 mb-1';

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-dark text-lg mb-2">Candidature envoyée !</h3>
        <p className="text-sm text-gray-500">
          Merci {firstname}, nous avons bien reçu votre CV. Un e-mail de confirmation vient de vous être envoyé et notre
          équipe vous recontacte sous 5 jours ouvrés.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="font-[var(--font-outfit)] text-xl font-bold text-dark mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="cv-firstname" className={labelClass}>Prénom *</label>
            <input id="cv-firstname" type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} className={inputClass} autoComplete="given-name" required />
          </div>
          <div>
            <label htmlFor="cv-lastname" className={labelClass}>Nom *</label>
            <input id="cv-lastname" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className={inputClass} autoComplete="family-name" required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label htmlFor="cv-email" className={labelClass}>Email *</label>
            <input id="cv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="cv-phone" className={labelClass}>Téléphone *</label>
            <input id="cv-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} autoComplete="tel" required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label htmlFor="cv-city" className={labelClass}>Ville et code postal</label>
            <input id="cv-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} autoComplete="address-level2" />
          </div>
          <div>
            <label htmlFor="cv-diploma" className={labelClass}>Dernier diplôme</label>
            <select id="cv-diploma" value={diploma} onChange={(e) => setDiploma(e.target.value)} className={inputClass}>
              <option value="">— Sélectionner —</option>
              {DIPLOMES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="cv-file" className={labelClass}>Votre CV * (PDF, DOC ou DOCX — 4 Mo maximum)</label>
          <label
            htmlFor="cv-file"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!dragOver) setDragOver(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              dragOver ? 'border-teal bg-teal/5' : 'border-gray-300 hover:border-teal'
            }`}
          >
            <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
            </svg>
            <span className="text-sm text-gray-600 truncate">
              {cv ? cv.name : dragOver ? 'Déposez votre CV ici' : 'Glissez votre CV ici ou cliquez pour le déposer'}
            </span>
          </label>
          <input
            id="cv-file"
            type="file"
            accept={ACCEPT}
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
            className="sr-only"
          />
        </div>

        <div>
          <label htmlFor="cv-message" className={labelClass}>Votre motivation en quelques mots</label>
          <textarea id="cv-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={2000} className={inputClass} />
        </div>

        <label className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed cursor-pointer">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#6DA3A4]" required />
          <span>
            J&apos;accepte que Linova Éducation utilise ces informations et mon CV pour étudier ma candidature, me
            recontacter et me présenter aux entreprises qui recrutent en alternance. *
          </span>
        </label>

        {/* Honeypot anti-spam — invisible pour un humain */}
        <input
          type="text"
          name="hp"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />

        {error && <div className="bg-red-50 text-red-700 rounded-lg px-3 py-2 text-xs">{error}</div>}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-navy text-white py-3 rounded-xl font-bold text-sm hover:bg-navy-dark transition-all hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer ma candidature'
          )}
        </button>

        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Vos données sont destinées à l&apos;équipe recrutement de Linova Éducation et conservées 2 ans maximum. Vous
          pouvez demander leur accès, leur rectification ou leur suppression à recrutement@linova-education.fr.{' '}
          <a href="/politique-de-confidentialite" target="_blank" className="underline hover:text-gray-600">
            Politique de confidentialité
          </a>
        </p>
      </form>
    </div>
  );
}
