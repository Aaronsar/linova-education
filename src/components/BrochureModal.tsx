'use client';

/**
 * Modal "Demander notre brochure" — déclenché par l'événement
 * `open-brochure-modal` dispatché depuis le Header ou n'importe où.
 *
 * Form Diploma Santé slug "brochure".
 */

import { useState, useEffect } from 'react';
import DiplomaFormEmbed from './DiplomaFormEmbed';

export default function BrochureModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-brochure-modal', handler);
    return () => window.removeEventListener('open-brochure-modal', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 pt-8">
          <h3 className="font-[var(--font-outfit)] text-xl font-bold text-dark mb-1">
            Recevoir la brochure
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Téléchargez la brochure du BTS Biologie Médicale — programme, débouchés,
            tarifs et modalités d&apos;admission.
          </p>
          <DiplomaFormEmbed
            form="brochure"
            hideTitle
            onSuccess={() => setTimeout(() => setOpen(false), 2500)}
          />
        </div>
      </div>
    </div>
  );
}
