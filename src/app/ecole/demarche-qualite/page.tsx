import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Démarche qualité',
  description: "Linova s'engage dans une démarche d'amélioration continue : écoute des étudiants, formation des équipes, accessibilité et égalité des chances.",
};

const faqItems = [
  { question: 'Pourquoi une démarche qualité ?', answer: "Proposer une formation exigeante ne suffit pas. Nous évoluons, nous adaptons et nous améliorons en continu en écoutant nos étudiants, formateurs et partenaires." },
  { question: 'Quels éléments sont évalués ?', answer: "Nous évaluons régulièrement nos contenus pédagogiques, nos outils et nos méthodes d'enseignement pour garantir leur pertinence et leur efficacité." },
  { question: 'Comment prenez-vous en compte les évolutions du secteur ?', answer: "Nous observons les évolutions du secteur de la biologie médicale et formons régulièrement notre équipe pédagogique pour rester à la pointe." },
  { question: 'Qu\'entendez-vous par accessibilité ?', answer: "L'accessibilité concerne l'accueil des personnes en situation de handicap, l'égalité des chances sans discrimination, et la mobilité étudiante." },
  { question: 'Quels indicateurs utilisez-vous ?', answer: "Nous mesurons le taux de réussite aux examens, le taux d'insertion professionnelle et la satisfaction des étudiants pour piloter notre démarche qualité." },
];

export default function DemarcheQualite() {
  return (
    <>
      <PageHero
        title="Démarche qualité"
        highlight="& amélioration continue"
        description="Proposer une formation exigeante ne suffit pas. Nous évoluons, nous adaptons et nous améliorons en continu."
      />

      {/* Principes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Qualité & amélioration continue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Observer',
                description: "Suivre les évolutions du secteur de la biologie médicale pour adapter nos enseignements.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                title: 'Former',
                description: "Former régulièrement notre équipe pédagogique pour maintenir un niveau d'excellence.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                title: 'Évaluer',
                description: "Évaluer périodiquement nos contenus, outils et méthodes pour garantir leur pertinence.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Accessibilité, égalité, mobilité
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Accessibilité', description: "Accueil des personnes en situation de handicap avec des aménagements adaptés." },
              { title: 'Égalité', description: "Égalité des chances sans discrimination, pour tous les parcours." },
              { title: 'Mobilité', description: "Accompagnement de la mobilité étudiante pour enrichir les parcours." },
              { title: 'Indicateurs', description: "Des indicateurs concrets pour évaluer et améliorer nos actions en continu." },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center mb-4">
                  <span className="font-bold">{i + 1}</span>
                </div>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
