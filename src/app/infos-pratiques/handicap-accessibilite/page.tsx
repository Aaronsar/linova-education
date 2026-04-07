import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Handicap & accessibilité',
  description: "Linova s'engage pour l'accueil des étudiants en situation de handicap. Aménagements physiques, pédagogiques et numériques.",
};

export default function HandicapAccessibilite() {
  return (
    <>
      <PageHero
        title="Handicap"
        highlight="& accessibilité"
        description="Une politique inclusive, active et engagée pour accompagner chaque étudiant, quelle que soit sa situation."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Accès physique</h2>
              <ul className="space-y-4">
                {[
                  'Rampes d\'accès et ascenseurs',
                  'Sanitaires adaptés',
                  'Signalétique accessible',
                  'Espaces de circulation adaptés',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Aménagements pédagogiques</h2>
              <ul className="space-y-4">
                {[
                  'Supports alternatifs (Braille, audio)',
                  'Temps supplémentaire pour les examens',
                  'Technologies d\'assistance',
                  'Référent handicap dédié',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-6">Contactez notre référent handicap</h2>
          <p className="text-gray-600 mb-8">
            Notre référent handicap est votre interlocuteur privilégié pour toute question liée à l&apos;accessibilité et aux aménagements.
          </p>
          <a
            href="mailto:accessibilite@linova.fr"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal text-white font-semibold rounded-full hover:brightness-95 transition-all"
          >
            accessibilite@linova.fr
          </a>
        </div>
      </section>

      <CTASection />
    </>
  );
}
