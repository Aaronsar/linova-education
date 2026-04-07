import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Notre expertise',
  description: "Linova s'appuie sur plus de 10 ans d'expérience dans la formation santé au sein du groupe Diploma Éducation.",
};

const faqItems = [
  { question: 'Quel est l\'avantage par rapport à une école généraliste ?', answer: "Linova est 100 % dédiée aux métiers de la santé. Cela signifie des enseignants spécialisés, des équipements adaptés et un réseau professionnel ciblé dans le secteur de la biologie médicale." },
  { question: 'Quel est le lien avec le groupe Diploma ?', answer: "Linova fait partie du groupe Diploma Éducation qui comprend Diploma Santé (préparations aux études de médecine) et Diploma Éducation (formations professionnalisantes). Cette appartenance garantit un savoir-faire éprouvé." },
  { question: 'Qui sont les enseignants ?', answer: "Nos enseignants sont des professionnels en activité : biologistes, techniciens de laboratoire, cadres de santé. Ils apportent une expertise terrain et une connaissance actualisée du secteur." },
  { question: 'Quelles sont les valeurs de Linova ?', answer: "Exigence, clarté et accompagnement. Nous formons avec précision et bienveillance pour que chaque étudiant développe les compétences nécessaires à une carrière réussie." },
];

export default function NotreExpertise() {
  return (
    <>
      <PageHero
        title="Une formation née d'un"
        highlight="savoir-faire reconnu dans les métiers de la santé"
        description="Linova n'est pas une école généraliste. Entièrement dédiée aux formations médicales, elle s'appuie sur plus de dix ans d'expérience au sein du groupe Diploma Éducation."
      />

      {/* Groupe Diploma */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Le groupe
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Partie intégrante du groupe Diploma Éducation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Le groupe Diploma est reconnu dans le secteur de la formation en santé avec deux pôles complémentaires.
              </p>
              <div className="space-y-6">
                <div className="bg-light rounded-xl p-6">
                  <h3 className="font-bold text-dark mb-2">Diploma Santé</h3>
                  <p className="text-gray-600 text-sm">Préparations aux études de médecine, pharmacie et maïeutique.</p>
                </div>
                <div className="bg-light rounded-xl p-6">
                  <h3 className="font-bold text-dark mb-2">Diploma Éducation</h3>
                  <p className="text-gray-600 text-sm">Formations professionnalisantes : BTS, diplômes européens.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray rounded-3xl aspect-square flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-20 h-20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-sm font-medium">Photo groupe</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piliers */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Trois piliers pédagogiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Exigence',
                description: "Des enseignants investis, issus du terrain, qui transmettent un savoir-faire rigoureux et actualisé.",
              },
              {
                title: 'Clarté',
                description: "Une pédagogie concrète et structurée, pensée pour rendre accessible les concepts les plus complexes.",
              },
              {
                title: 'Accompagnement',
                description: "Un suivi adapté aux parcours variés de nos étudiants, avec une attention particulière portée à chacun.",
              },
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
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
