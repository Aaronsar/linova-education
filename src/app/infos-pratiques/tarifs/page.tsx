import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Tarifs et financement',
  description: "Tarifs du BTS Biologie Médicale chez Linova : 6000 euros/an en initial, 0 euro en alternance. Aides et échelonnement possibles.",
};

export default function Tarifs() {
  return (
    <>
      <PageHero
        title="Tarifs et financement"
        description="Nous avons à coeur de rendre nos formations accessibles à tous."
      />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Initial */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-teal transition-colors shadow-sm">
              <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-6">
                Formation initiale
              </span>
              <div className="text-5xl font-bold text-dark mb-2">6 000 &euro;</div>
              <p className="text-gray-500 mb-8">par an</p>
              <ul className="space-y-4 mb-8">
                {[
                  'Frais d\'inscription : 300 euros',
                  'Échelonnement des paiements possible',
                  'Accès à des aides ou bourses selon situation',
                  'Accompagnement personnalisé pour le financement',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/infos-pratiques/admission"
                className="block text-center px-6 py-3 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all"
              >
                Candidater en initial
              </Link>
            </div>

            {/* Alternance */}
            <div className="bg-navy rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-yellow text-dark text-xs font-bold rounded-full">
                Recommandé
              </div>
              <span className="inline-block px-3 py-1 bg-white/10 text-yellow text-xs font-semibold rounded-full mb-6">
                Alternance
              </span>
              <div className="text-5xl font-bold text-yellow mb-2">0 &euro;</div>
              <p className="text-gray-300 mb-8">pris en charge par l&apos;OPCO</p>
              <ul className="space-y-4 mb-8">
                {[
                  '100% des frais pris en charge par l\'employeur',
                  'Statut de salarié avec rémunération mensuelle',
                  'Expérience professionnelle dès la 1re année',
                  'Financement intégral + salaire + diplôme',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/infos-pratiques/admission"
                className="block text-center px-6 py-3 bg-yellow text-dark font-semibold rounded-full hover:brightness-95 transition-all"
              >
                Candidater en alternance
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 bg-light rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-dark mb-4">Besoin d&apos;aide pour le financement ?</h3>
            <p className="text-gray-600 mb-6">
              Notre équipe vous accompagne avec un suivi personnalisé : devis précis, orientation vers les dispositifs d&apos;aide adaptés à votre situation.
            </p>
            <a
              href="tel:+33189719944"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-white font-semibold rounded-full hover:brightness-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +33 1 89 71 99 44
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
