'use client';

import { useState } from 'react';

export default function ContactForm({ embedded = true }: { embedded?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  const containerClass = embedded
    ? 'bg-white rounded-2xl shadow-xl p-6 max-w-sm ml-auto'
    : '';

  return (
    <div className={containerClass}>
      <h3 className="font-[var(--font-outfit)] text-xl font-bold text-dark mb-1">
        Candidater au BTS Biologie Médicale
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Remplissez le formulaire, notre équipe vous recontacte sous 48h.
      </p>

      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-semibold text-dark mb-1">Candidature envoyée !</p>
          <p className="text-sm text-gray-500">Nous vous recontactons sous 48h.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-dark mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-dark mb-1">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-dark mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <label htmlFor="parcours" className="block text-sm font-medium text-dark mb-1">
              Parcours souhaité
            </label>
            <select
              id="parcours"
              name="parcours"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors bg-white"
            >
              <option value="">Sélectionnez...</option>
              <option value="alternance">Alternance</option>
              <option value="initial">Formation initiale</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow text-dark font-semibold rounded-lg hover:brightness-95 transition-all text-sm"
          >
            Envoyer ma candidature
          </button>

          <p className="text-xs text-gray-400 text-center">
            En soumettant ce formulaire, vous acceptez d&apos;être recontacté par Linova Éducation.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <a
              href="/dossier-inscription-alternance"
              className="text-xs text-teal hover:underline"
            >
              Remplir le dossier d&apos;inscription complet
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
