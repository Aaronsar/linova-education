import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Pourquoi choisir Linova',
  description: "Découvrez pourquoi Linova Éducation est l'école idéale pour votre formation en biologie médicale. Plus de 10 ans d'expérience, enseignants experts, insertion à 80%.",
};

const faqItems = [
  { question: 'À qui s\'adresse la formation ?', answer: "Notre formation s'adresse aux bacheliers (bac général, technologique ou professionnel), aux étudiants en réorientation et aux professionnels en reconversion souhaitant intégrer le secteur de la biologie médicale." },
  { question: 'Quelle est l\'expérience de Linova ?', answer: "Linova s'appuie sur plus de dix ans d'expérience au sein du groupe Diploma Éducation, reconnu dans le secteur de la formation en santé." },
  { question: 'Qui sont les encadrants ?', answer: "Nos enseignants sont des professionnels en activité : biologistes, techniciens de laboratoire, cadres de santé. Ils apportent une expertise de terrain à chaque cours." },
  { question: 'Quels sont les points forts de Linova ?', answer: "Spécialisation 100 % santé, enseignants experts, accompagnement individualisé, réseau de partenaires professionnels et taux d'insertion supérieur à 80 % à 6 mois." },
  { question: 'Quels sont les débouchés ?', answer: "Technicien de laboratoire médical, préleveur, technicien qualité, technicien en anatomopathologie, en biologie de la reproduction... dans les hôpitaux, laboratoires privés, centres de recherche ou l'industrie pharmaceutique." },
  { question: 'Qu\'est-ce qui différencie Linova d\'une école généraliste ?', answer: "Contrairement aux écoles généralistes, Linova est entièrement dédiée aux métiers de la santé. Cela se traduit par un enseignement plus spécialisé, des équipements adaptés et un réseau professionnel ciblé." },
];

export default function PourquoiLinova() {
  return (
    <>
      <PageHero
        title="Bien plus qu'un diplôme :"
        highlight="un véritable tremplin professionnel"
        description="Choisir une école, c'est engager un projet de vie. Linova propose une formation unique dans un cadre entièrement consacré aux métiers de la santé."
      />

      {/* Expertise */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
              Notre expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Une école spécialisée, construite pour répondre aux besoins du secteur
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Un seul diplôme proposé, une spécialisation 100 % santé, un encadrement par des spécialistes et une pédagogie orientée savoir-faire concret.
            </p>
          </div>

          {/* Points forts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Fondée sur l\'expérience',
                description: "Plus de dix ans d'expérience au sein du groupe Diploma Éducation. Des enseignants biologistes, techniciens et cadres de santé en activité.",
                icon: '🎓',
              },
              {
                title: 'Diplôme solide, secteur porteur',
                description: "Un taux d'insertion professionnelle supérieur à 80 % à 6 mois. Accès à des emplois qualifiés avec une pénurie attendue de techniciens d'ici 2030.",
                icon: '📈',
              },
              {
                title: 'Environnement 100 % santé',
                description: "Un écosystème d'apprentissage cohérent, un accompagnement attentif et un réseau de partenaires issus du secteur de la biologie médicale.",
                icon: '🏥',
              },
            ].map((item, i) => (
              <div key={i} className="bg-light rounded-2xl p-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Engagement',
                description: "Une équipe pédagogique accessible, rigoureuse et investie dans la réussite de chaque étudiant.",
                color: 'bg-teal',
              },
              {
                title: 'Excellence',
                description: "Un diplôme reconnu par l'État, une spécialisation claire et des exigences académiques élevées.",
                color: 'bg-navy',
              },
              {
                title: 'Ambition',
                description: "Un apprentissage concret pour construire une carrière significative dans les métiers de la santé.",
                color: 'bg-yellow',
              },
            ].map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-12 h-1 ${value.color} rounded-full mb-6`} />
                <h3 className="text-xl font-bold text-dark mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
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
