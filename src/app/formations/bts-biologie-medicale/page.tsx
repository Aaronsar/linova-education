import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'BTS Biologie Médicale',
  description: "BTS Biologie Médicale en 2 ans à Paris. Formation initiale et alternance. RNCP 40027. 1350h de formation. Certification Qualiopi.",
};

const faqItems = [
  { question: 'Quels sont les prérequis ?', answer: "Être titulaire d'un baccalauréat (général, technologique ou professionnel). Les bacs STL, ST2S et les bacs pro laboratoire sont particulièrement adaptés." },
  { question: 'Combien de temps dure la formation ?', answer: "La formation dure 2 ans, avec un total de 1 350 heures de cours. En alternance, le rythme est de 2 jours en école et 3 jours en entreprise." },
  { question: 'L\'alternance est-elle possible ?', answer: "Oui, le BTS est accessible en alternance. Les frais de formation sont entièrement pris en charge par l'OPCO de l'entreprise, et l'étudiant perçoit un salaire." },
  { question: 'Quel est le coût de la formation ?', answer: "En formation initiale : 6 000 euros par an. En alternance : les frais sont intégralement pris en charge par l'employeur via son OPCO." },
  { question: 'Quels sont les débouchés ?', answer: "Technicien de laboratoire médical, préleveur, technicien qualité, technicien en anatomopathologie, technicien en biologie de la reproduction. Postes en hôpitaux, laboratoires privés, centres de recherche, industrie pharmaceutique." },
];

export default function BTSBiologieMedicale() {
  return (
    <>
      {/* Hero with form */}
      <section className="bg-navy py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Title */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                BTS Biologie Médicale
              </h1>
              <p className="mt-3 text-2xl md:text-3xl font-bold text-teal leading-snug">
                Le diplôme qui ouvre les portes du laboratoire
              </p>
              <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-lg">
                Un diplôme national en 2 ans pour devenir technicien de laboratoire médical. Formation certifiée RNCP 40027.
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { value: '2 ans', label: 'Durée' },
                  { value: '1 350h', label: 'Formation' },
                  { value: '80%', label: 'Insertion' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-yellow">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            Programme de formation
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Un programme complet alliant enseignement général et formation professionnelle.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enseignement général */}
            <div className="bg-light rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-dark">Enseignement général</h3>
                  <p className="text-sm text-gray-500">510 heures</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Culture générale et expression',
                  'Anglais',
                  'Mathématiques',
                  'Physique-chimie',
                ].map((m, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-navy" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Enseignement professionnel */}
            <div className="bg-light rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-teal text-white flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-dark">Enseignement professionnel</h3>
                  <p className="text-sm text-gray-500">1 335 heures</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  'Organisation et gestion qualité du laboratoire',
                  'Analyses médicales communes (biochimie, microbiologie, hématologie)',
                  'Amélioration des méthodes d\'analyse',
                  'Communication et collaboration professionnelles',
                  'Éthique scientifique',
                ].map((m, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-teal" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rythme */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Deux parcours possibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-teal transition-colors">
              <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-4">Formation initiale</span>
              <h3 className="text-2xl font-bold text-dark mb-4">Parcours classique</h3>
              <p className="text-gray-600 mb-6">12 semaines de stage obligatoire en milieu professionnel pour une immersion complète.</p>
              <div className="text-3xl font-bold text-dark mb-1">6 000 &euro;/an</div>
              <p className="text-sm text-gray-500 mb-6">Échelonnement possible</p>
              <Link href="/infos-pratiques/admission" className="inline-flex items-center gap-2 text-teal font-semibold hover:underline">
                En savoir plus
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="bg-navy rounded-2xl p-8 text-white">
              <span className="inline-block px-3 py-1 bg-yellow text-dark text-xs font-semibold rounded-full mb-4">Alternance</span>
              <h3 className="text-2xl font-bold mb-4">Parcours en entreprise</h3>
              <p className="text-gray-300 mb-6">2 jours en école, 3 jours en entreprise. Rémunération mensuelle et expérience terrain.</p>
              <div className="text-3xl font-bold text-yellow mb-1">0 &euro;</div>
              <p className="text-sm text-gray-300 mb-6">Pris en charge par l&apos;OPCO</p>
              <Link href="/infos-pratiques/admission" className="inline-flex items-center gap-2 text-yellow font-semibold hover:underline">
                En savoir plus
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Débouchés */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            Débouchés professionnels
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Le BTS Biologie Médicale ouvre les portes de nombreux métiers dans un secteur en tension.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Technicien(ne) de laboratoire médical',
              'Préleveur(se)',
              'Technicien(ne) qualité',
              'Technicien(ne) en biologie de la reproduction',
              'Technicien(ne) en anatomopathologie',
            ].map((metier, i) => (
              <div key={i} className="bg-light rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium text-dark">{metier}</span>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <h3 className="text-xl font-bold text-dark mb-6 text-center">Employeurs potentiels</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Hôpitaux',
                'Laboratoires privés',
                'Centres de don du sang',
                'Centres de recherche',
                'Industrie pharmaceutique',
              ].map((emp, i) => (
                <span key={i} className="px-5 py-2.5 bg-navy text-white rounded-full text-sm">
                  {emp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
