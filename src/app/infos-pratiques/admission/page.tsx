import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Admission',
  description: "Découvrez les modalités d'admission au BTS Biologie Médicale chez Linova. Examen de dossier et entretien de motivation.",
};

export default function Admission() {
  return (
    <>
      <PageHero
        title="Rejoignez"
        highlight="Linova Éducation"
        description="Un processus d'admission simple et humain, basé sur la motivation et la cohérence de votre projet professionnel."
      />

      {/* Profils acceptés */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Profils acceptés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bac général',
                description: "Avec un intérêt pour les sciences et le secteur de la santé.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                ),
              },
              {
                title: 'Bac technologique',
                description: "ST2S, STL avec spécialisation biochimie ou biotechnologie.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
              },
              {
                title: 'Bac professionnel',
                description: "Laboratoire, industries pharmaceutiques, expérimentation animale.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((profil, i) => (
              <div key={i} className="bg-light rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6">
                  {profil.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{profil.title}</h3>
                <p className="text-gray-600">{profil.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes */}
      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            4 étapes simples
          </h2>
          <div className="space-y-8">
            {[
              { step: '1', title: 'Dépôt du formulaire en ligne', description: "Remplissez votre dossier de candidature directement sur notre site ou via Parcoursup." },
              { step: '2', title: 'Contact téléphonique', description: "Notre équipe vous contacte pour fixer un rendez-vous d'entretien." },
              { step: '3', title: 'Entretien & étude du dossier', description: "Un entretien en présentiel avec étude approfondie de votre dossier et de votre projet." },
              { step: '4', title: 'Réponse sous 48h', description: "Vous recevez votre réponse d'admission dans les 48 heures suivant l'entretien." },
            ].map((etape, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  {etape.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-dark mb-2">{etape.title}</h3>
                  <p className="text-gray-600">{etape.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accompagnement */}
      <section className="py-20" id="alternance">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6">Notre accompagnement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Aide à la recherche d\'entreprise pour les alternants',
                'Suivi pédagogique individualisé',
                'Classes limitées à 25 alternants maximum',
                'Prise en compte des situations de handicap',
                'Simplification des démarches administratives',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Prêt à candidater ?"
        description="Contactez-nous pour démarrer votre processus d'admission."
        primaryText="Nous contacter"
        primaryHref="tel:+33189719944"
      />
    </>
  );
}
