import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Accessibilité',
  description: "Linova Éducation s'engage pour l'accessibilité de ses formations aux personnes en situation de handicap.",
};

export default function Accessibilite() {
  return (
    <>
      <PageHero
        title="Accessibilité"
        highlight="& inclusion"
        description="Linova met en place une politique handicap claire, active et engagée pour accompagner chaque étudiant dans son parcours."
      />

      {/* Piliers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Identifier les besoins',
                description: "En amont de la formation, nous identifions les besoins spécifiques de chaque étudiant pour préparer les adaptations nécessaires.",
              },
              {
                title: 'Coordonner les adaptations',
                description: "Tout au long du parcours, nous coordonnons les aménagements pédagogiques et matériels pour garantir l'égalité des chances.",
              },
              {
                title: 'Tracer les actions',
                description: "Nous assurons la traçabilité de toutes les actions mises en place pour un suivi rigoureux et transparent.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-light rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-teal text-white flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aménagements */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Accès physique et pédagogique
              </h2>
              <ul className="space-y-4">
                {[
                  'Campus accessible aux fauteuils roulants (rampes, ascenseurs, sanitaires adaptés)',
                  'Supports de cours alternatifs (Braille, audio)',
                  'Temps supplémentaire pour les examens',
                  'Technologies d\'assistance disponibles',
                  'Référent handicap dédié',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Accessibilité numérique
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Notre site et nos outils pédagogiques suivent les standards RGAA pour être compatibles avec les technologies d&apos;assistance : lecteurs d&apos;écran, navigation au clavier, logiciels de grossissement.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Contact accessibilité :</p>
                <a href="mailto:accessibilite@linova.fr" className="text-teal font-semibold hover:underline">
                  accessibilite@linova.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
