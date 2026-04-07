import Link from 'next/link';
import Image from 'next/image';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

const stats = [
  { value: '2M', label: 'professionnels de santé en France' },
  { value: '60K', label: 'techniciens de laboratoire' },
  { value: '4K', label: 'laboratoires en France' },
  { value: '47K', label: "offres d'emploi par an" },
  { value: '80%', label: "d'insertion à 6 mois" },
];

const blogPosts = [
  {
    title: 'Linova Formation obtient la certification Qualiopi',
    date: '10 décembre 2025',
    category: 'Actualité',
    slug: '#',
    image: '/images/photos/boite-petri.png',
    alt: 'Boite de Petri en laboratoire',
  },
  {
    title: 'Les qualités indispensables pour devenir technicien(ne) de laboratoire',
    date: '3 octobre 2025',
    category: 'Débouchés',
    slug: '#',
    image: '/images/photos/tp-concentration.png',
    alt: 'Etudiante concentree en travaux pratiques',
  },
  {
    title: 'Stage en BTS Biologie Médicale : comment le réussir ?',
    date: '3 octobre 2025',
    category: 'BTS Biologie Médicale',
    slug: '#',
    image: '/images/photos/prof-cours.jpg',
    alt: 'Professeur donnant un cours en classe',
  },
];

const faqItems = [
  {
    question: 'Quels types de formations proposez-vous ?',
    answer: "Nous proposons le BTS Biologie Médicale, un diplôme d'État reconnu, disponible en formation initiale et en alternance. Notre spécialisation 100 % santé nous permet de vous offrir un enseignement de qualité, ancré dans la réalité du terrain.",
  },
  {
    question: "L'alternance est-elle possible ?",
    answer: "Oui, nous proposons le BTS Biologie Médicale en alternance avec un rythme de 2 jours en formation et 3 jours en entreprise. Les frais de formation sont entièrement pris en charge par l'OPCO de l'entreprise d'accueil.",
  },
  {
    question: 'Votre école est-elle accessible aux personnes en situation de handicap ?',
    answer: "Absolument. Notre campus est accessible aux personnes à mobilité réduite et nous proposons des aménagements pédagogiques adaptés. Un référent handicap est disponible pour accompagner chaque étudiant dans son parcours.",
  },
  {
    question: 'Comment se déroulent les évaluations ?',
    answer: "Les évaluations combinent un contrôle continu et des examens finaux (écrits, oraux et pratiques). Le BTS comporte 9 unités d'évaluation avec des coefficients allant de 2 à 6.",
  },
  {
    question: 'Quels sont les débouchés après le BTS ?',
    answer: "Les débouchés sont nombreux : technicien de laboratoire médical, préleveur, technicien qualité, technicien en anatomopathologie... Vous pouvez exercer en hôpital, laboratoire privé, centre de recherche ou industrie pharmaceutique.",
  },
  {
    question: 'Peut-on poursuivre ses études après le BTS ?',
    answer: "Oui, vous pouvez poursuivre en licence professionnelle bio-analyses et biotechnologies, BUT, DETLM ou encore à l'international dans le domaine de la santé.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-16">
            {/* Left: Image placeholder */}
            <div className="relative flex justify-center order-2 lg:order-1">
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                <div className="absolute inset-0 bg-yellow rounded-full" />
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-teal/30 rounded-full" />
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <Image
                    src="/images/photos/future-etudiante.png"
                    alt="Future etudiante Linova souriante"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right: Text */}
            <div className="order-1 lg:order-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark leading-tight">
                UNE ÉCOLE DÉDIÉE
                <br />
                <span className="text-teal">AUX MÉTIERS DE</span>
                <br />
                <span className="text-teal">LA SANTÉ</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Nous formons les professionnels de demain capables d&apos;évoluer dans des environnements exigeants : laboratoires, établissements de soins, structures médico-sociales... Notre objectif est clair : transmettre une expertise rigoureuse et aider chaque étudiant à construire un projet professionnel ancré dans le réel.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/formations/bts-biologie-medicale"
                  className="px-8 py-3.5 bg-yellow text-dark font-semibold rounded-full hover:brightness-95 transition-all text-lg"
                >
                  Découvrir nos formations
                </Link>
                <Link
                  href="/infos-pratiques/admission"
                  className="px-8 py-3.5 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all text-lg"
                >
                  Candidater
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: 'PROFESSIONNALISER AVEC EXIGENCE',
                description: "Notre pédagogie combine rigueur scientifique et pratique de terrain pour former des professionnels immédiatement opérationnels.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: 'DE LA FORMATION À LA VOCATION',
                description: "Nous accompagnons chaque étudiant dans la construction d'un parcours cohérent, de l'admission jusqu'à l'insertion professionnelle.",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'DES EXPERTS, CONNECTÉS AU TERRAIN',
                description: "Nos enseignants sont des professionnels en activité : biologistes, techniciens, cadres de santé. Ils transmettent un savoir-faire concret.",
              },
            ].map((pillar, i) => (
              <div key={i} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-teal/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6 group-hover:bg-teal group-hover:text-white transition-all">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Un secteur en pleine croissance
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-2xl mx-auto">
            La biologie médicale est un secteur porteur avec des besoins de recrutement croissants.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow mb-2">{stat.value}</div>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formation highlight */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Notre formation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                BTS Biologie Médicale
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Un diplôme national en 2 ans pour devenir technicien de laboratoire médical. Formation disponible en initial et en alternance, certifiée RNCP 40027.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  '1 350 heures de formation',
                  'Alternance : 2 jours école / 3 jours entreprise',
                  'Stage : 12 semaines en formation initiale',
                  'Certification Qualiopi',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/formations/bts-biologie-medicale"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow text-dark font-semibold rounded-full hover:brightness-95 transition-all"
              >
                En savoir plus
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/photos/etudiants-labo.png"
                  alt="Etudiants en travaux pratiques au laboratoire"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-teal text-white p-6 rounded-2xl shadow-lg">
                <div className="text-3xl font-bold">80%</div>
                <div className="text-sm">d&apos;insertion à 6 mois</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20 bg-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">Dernières actualités</h2>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-2 text-teal font-semibold hover:underline">
              Voir tout
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-dark group-hover:text-teal transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400">{post.date}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 text-teal font-semibold">
              Voir toutes les actualités
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqItems} />

      {/* CTA */}
      <CTASection />
    </>
  );
}
