import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Certification Qualiopi',
  description: "Linova Formation est certifié Qualiopi, label d'État attestant la qualité de nos formations en biologie médicale.",
};

const faqItems = [
  { question: 'Qu\'est-ce que Qualiopi ?', answer: "Qualiopi est une certification qualité délivrée par l'État français. Elle atteste de la conformité d'un organisme de formation aux critères du Référentiel National Qualité." },
  { question: 'Que garantit cette certification ?', answer: "Qualiopi garantit la rigueur pédagogique, la cohérence des parcours, la transparence de la communication, la qualité du suivi étudiant et la conformité réglementaire." },
  { question: 'Comment se déroule l\'audit ?', answer: "L'audit Qualiopi évalue 7 critères : information du public, qualité de l'accompagnement, adaptation aux besoins, compétences des formateurs, intégration des publics spécifiques, ancrage professionnel et gestion administrative." },
  { question: 'Quel impact pour les étudiants ?', answer: "La certification Qualiopi permet aux étudiants de bénéficier de financements publics et garantit un niveau de qualité constant dans leur formation." },
];

export default function Qualiopi() {
  return (
    <>
      <PageHero
        title="Linova certifié"
        highlight="Qualiopi"
        description="Un label d'État attestant la conformité de nos formations aux critères du Référentiel National Qualité."
      />

      {/* Critères */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            7 critères évalués
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            La certification Qualiopi évalue notre organisme sur l&apos;ensemble de ces critères de qualité.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Information du public',
              'Qualité de l\'accompagnement',
              'Adaptation aux besoins',
              'Compétences des formateurs',
              'Intégration des publics spécifiques',
              'Ancrage professionnel et résultats',
              'Gestion administrative',
            ].map((critere, i) => (
              <div key={i} className="flex items-center gap-4 bg-light rounded-xl p-5">
                <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium text-dark">{critere}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Nos garanties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Rigueur pédagogique',
              'Cohérence des parcours',
              'Transparence communicationnelle',
              'Suivi étudiant de qualité',
              'Conformité réglementaire',
            ].map((garantie, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow text-dark flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-sm">{i + 1}</span>
                  </div>
                  <span className="text-white font-medium">{garantie}</span>
                </div>
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
