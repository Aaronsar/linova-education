'use client';

/**
 * Formulaire de candidature compact aux couleurs Linova.
 *
 * - 4 champs essentiels : Prénom, Nom, Email, Téléphone (+ type de formation optionnel)
 * - Soumission via /api/hubspot/submit (proxy server-side vers HubSpot Forms API)
 * - Pas d'iframe ni de script HubSpot : style 100% intégré au site
 */

import { useState } from 'react';

interface Props {
  embedded?: boolean;
  /** Type de formation pré-rempli si le formulaire est sur une page spécifique */
  defaultFormationType?: 'initial' | 'alternance';
  /** Personnalise le titre — laisser vide pour le titre par défaut */
  title?: string;
  /** Personnalise le sous-titre */
  subtitle?: string;
}

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function ContactForm({
  embedded = true,
  defaultFormationType,
  title = 'Candidater au BTS Biologie Médicale',
  subtitle = 'Remplissez le formulaire, notre équipe vous recontacte sous 48h.',
}: Props) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formationType, setFormationType] = useState<string>(defaultFormationType || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit =
    firstname.trim() &&
    lastname.trim() &&
    isValidEmail(email) &&
    phone.trim() &&
    !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/hubspot/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: email.trim(),
          phone: phone.trim(),
          formationType: formationType || undefined,
          pageUri: typeof window !== 'undefined' ? window.location.href : '',
          pageName: typeof document !== 'undefined' ? document.title : '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  }

  const containerClass = embedded
    ? 'bg-white rounded-2xl shadow-xl p-6 max-w-sm ml-auto'
    : '';

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all text-dark text-sm placeholder-gray-400';

  if (success) {
    return (
      <div className={containerClass}>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-bold text-dark text-lg mb-2">Candidature envoyée !</h3>
          <p className="text-sm text-gray-500">
            Merci {firstname}, notre équipe vous recontacte sous 48h.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <h3 className="font-[var(--font-outfit)] text-xl font-bold text-dark mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Prénom *</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Marie"
              className={inputClass}
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Nom *</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Dupont"
              className={inputClass}
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="marie.dupont@gmail.com"
            className={inputClass}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Téléphone *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 12 34 56 78"
            className={inputClass}
            autoComplete="tel"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Type de formation</label>
          <select
            value={formationType}
            onChange={(e) => setFormationType(e.target.value)}
            className={inputClass}
          >
            <option value="">À définir</option>
            <option value="initial">Initial</option>
            <option value="alternance">Alternance</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg px-3 py-2 text-xs">{error}</div>
        )}

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
            <>
              Envoyer ma candidature
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        <p className="text-[10px] text-gray-400 text-center mt-2 leading-relaxed">
          En soumettant, vous acceptez d&apos;être recontacté par Linova Éducation.
          Vos données sont traitées conformément à notre politique de confidentialité.
        </p>
      </form>
    </div>
  );
}
