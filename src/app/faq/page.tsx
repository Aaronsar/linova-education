import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes sur le BTS Biologie Médicale | Linova",
  description:
    "Toutes les réponses à vos questions sur le BTS Biologie Médicale chez Linova : admission, alternance, tarifs, débouchés, programme, examen, stages, financement.",
  keywords: [
    'FAQ BTS Biologie Médicale',
    'questions Linova',
    'admission BTS biologie',
    'alternance laboratoire',
    'tarifs formation',
  ],
  alternates: { canonical: '/faq' },
};

const ADMISSION_FAQ = [
  {
    question: "Comment candidater au BTS Biologie Médicale chez Linova ?",
    answer:
      "Vous pouvez candidater de deux manières : via Parcoursup pour la formation initiale (vœux entre janvier et mars), ou directement via notre site en remplissant le formulaire de candidature. Nous vous contactons sous 48h pour un entretien de motivation. Aucun examen écrit, l'admission se fait sur dossier (bulletins, projet professionnel) et entretien.",
  },
  {
    question: "Quels sont les prérequis pour intégrer le BTS ?",
    answer:
      "Le BTS Biologie Médicale est ouvert aux titulaires d'un baccalauréat général, technologique (STL, ST2S) ou professionnel à orientation scientifique. Les profils issus de Bac STL ou général avec spécialités SVT/Physique-Chimie sont les plus représentés. Une première année de licence ou de PASS est aussi un excellent profil pour intégrer la formation.",
  },
  {
    question: "Y a-t-il un entretien de motivation ?",
    answer:
      "Oui, l'entretien d'admission dure environ 45 minutes. Il permet d'évaluer votre motivation, votre projet professionnel et votre intérêt pour le secteur de la biologie médicale. Ce n'est pas un test de connaissances mais un échange. Vous pouvez prendre rendez-vous en ligne sur la page Rendez-vous.",
  },
  {
    question: "À quelle date démarre la formation ?",
    answer:
      "La rentrée a lieu mi-septembre. Les candidatures sont ouvertes dès janvier pour la rentrée suivante, et nous accueillons des candidatures jusqu'à fin août sous réserve de places disponibles. Pour les profils en alternance, la signature du contrat doit être effective avant le démarrage des cours.",
  },
];

const FORMATION_FAQ = [
  {
    question: "Quelle est la différence entre le format initial et l'alternance ?",
    answer:
      "En formation initiale, vous êtes étudiant à plein temps avec 12 semaines de stage obligatoires sur les 2 ans. Tarif : 6 000 €/an (dont 500 € de frais d'inscription). En alternance, vous alternez 2 jours/3 jours entre l'école et un laboratoire d'accueil. Vous êtes salarié, votre formation est gratuite (prise en charge par l'OPCO) et vous percevez une rémunération mensuelle (de 795 € à 1 766 € brut selon âge et année).",
  },
  {
    question: "Combien d'heures de cours par semaine ?",
    answer:
      "En formation initiale, vous avez environ 35 heures de cours hebdomadaires : enseignements généraux (français, anglais, mathématiques), enseignements professionnels (microbiologie, biochimie, hématologie, immunologie) et travaux pratiques en laboratoire. Au total : 510h d'enseignement général et 1 335h d'enseignement professionnel sur les 2 ans.",
  },
  {
    question: "Quel est le contenu du programme ?",
    answer:
      "Le programme couvre toutes les disciplines de la biologie médicale : biochimie, hématologie, microbiologie, immunologie, parasitologie-mycologie, anatomopathologie, génétique. À cela s'ajoutent les techniques d'analyses, l'organisation des laboratoires (norme ISO 15189), la qualité, l'hygiène et la sécurité, ainsi que la communication professionnelle. Voir notre page programme pour le détail.",
  },
  {
    question: "Comment se déroulent les stages ?",
    answer:
      "En formation initiale, 12 semaines de stage minimum sont obligatoires sur les 2 ans, généralement réparties en plusieurs périodes. Les stages se déroulent en laboratoire d'analyses médicales (LBM), à l'hôpital, à l'EFS, dans des centres de recherche ou en industrie pharmaceutique. Linova vous accompagne dans la recherche de votre stage via notre réseau d'entreprises partenaires.",
  },
  {
    question: "Comment se passe l'examen final du BTS ?",
    answer:
      "L'examen national du BTS Biologie Médicale comprend des épreuves écrites (français, anglais, sciences appliquées, biochimie, microbiologie), des épreuves pratiques en laboratoire et la soutenance d'un rapport de stage. Le diplôme est de niveau 5 (Bac+2) reconnu par l'État (RNCP 40027). Notre taux de réussite à Linova est supérieur à la moyenne nationale.",
  },
];

const TARIFS_FAQ = [
  {
    question: "Combien coûte la formation ?",
    answer:
      "En initial : 6 000 € par an, soit 12 000 € pour les 2 ans (frais d'inscription de 500 € inclus). En alternance : 0 €, la formation est intégralement prise en charge par l'OPCO de l'entreprise d'accueil. Vous percevez en plus une rémunération mensuelle. Voir notre page tarifs pour le détail des facilités de paiement.",
  },
  {
    question: "Quelles aides au financement existe-t-il ?",
    answer:
      "Plusieurs dispositifs : la bourse du CROUS (sous conditions), les aides régionales d'Île-de-France, les aides au logement (APL/ALS), un prêt étudiant à taux préférentiel grâce à notre partenariat avec la banque LCL, et l'échelonnement des paiements en 3 ou 10 fois sans frais. Notre service administratif vous accompagne dans toutes les démarches.",
  },
  {
    question: "Puis-je échelonner mes paiements ?",
    answer:
      "Oui, Linova propose plusieurs options sans frais : règlement en 10 mensualités de 600 €, en 3 fois (3 × 2 000 €), ou en une fois à l'inscription. Aucun intérêt ni frais supplémentaire. Contactez notre service administratif pour personnaliser un plan de paiement adapté à votre situation.",
  },
  {
    question: "Combien gagne un alternant ?",
    answer:
      "La rémunération dépend de votre âge et de votre année de formation. En 1re année : 795 € (18-20 ans), 977 € (21-25 ans), 1 766 € (26 ans et +). En 2e année : 939 €, 1 129 €, ou 1 766 €. Ces montants sont les minimums légaux ; la convention collective de l'entreprise peut prévoir mieux.",
  },
];

const DEBOUCHES_FAQ = [
  {
    question: "Quels sont les débouchés après un BTS Biologie Médicale ?",
    answer:
      "Vous pouvez exercer comme technicien(ne) en laboratoire d'analyses médicales (ville ou hôpital), à l'EFS (don du sang), en industrie pharmaceutique, en recherche (INSERM, CNRS), en parasitologie, en anatomopathologie, en biologie de la reproduction (PMA), en toxicologie, en microbiologie, en hématologie. Le taux d'insertion à 6 mois est de 80 %.",
  },
  {
    question: "Quel salaire après le BTS ?",
    answer:
      "Un technicien débutant gagne entre 1 800 € et 2 200 € brut/mois selon le secteur. Avec de l'expérience, le salaire peut atteindre 2 500-2 800 € brut, voire plus avec des responsabilités d'encadrement. Les laboratoires hospitaliers, l'EFS et les centres de recherche offrent généralement des grilles plus avantageuses.",
  },
  {
    question: "Puis-je poursuivre mes études après le BTS ?",
    answer:
      "Oui, plusieurs options : licence professionnelle en biologie médicale ou en biotechnologies (Bac+3), licence générale en sciences de la vie, école d'ingénieur (admissions parallèles), ou DTS imagerie médicale. Certains diplômés intègrent aussi des cursus de manipulateur radio ou des écoles de santé.",
  },
];

const FAQS = [
  { title: 'Admission & candidature', items: ADMISSION_FAQ },
  { title: 'Formation & programme', items: FORMATION_FAQ },
  { title: 'Tarifs & financement', items: TARIFS_FAQ },
  { title: 'Débouchés & carrière', items: DEBOUCHES_FAQ },
];

export default function FAQPage() {
  const allItems = FAQS.flatMap((section) => section.items);

  // Schema.org pour le SEO (rich snippets Google)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <>
      <PageHero
        title="Questions fréquentes"
        highlight="FAQ"
        description="Toutes les réponses à vos questions sur le BTS Biologie Médicale, l'admission, l'alternance, les tarifs et les débouchés."
      />

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Quick navigation */}
      <section className="py-12 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FAQS.map((section, i) => (
              <a
                key={i}
                href={`#section-${i}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-100"
              >
                <p className="text-sm font-semibold text-navy">{section.title}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      {FAQS.map((section, i) => (
        <div key={i} id={`section-${i}`} className="scroll-mt-20">
          <FAQ items={section.items} title={section.title} />
        </div>
      ))}

      {/* Pas de réponse ? */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Pas trouvé votre réponse ?</h2>
          <p className="text-gray-600 mb-8">
            Notre équipe est à votre disposition. Contactez-nous par téléphone, email ou prenez
            directement rendez-vous pour un entretien de 45 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+33189719944"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal text-white font-semibold rounded-full hover:brightness-95 transition-all"
            >
              01 89 71 99 44
            </a>
            <Link
              href="/rendez-vous"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-full hover:brightness-95 transition-all"
            >
              Prendre rendez-vous
            </Link>
            <a
              href="mailto:admissions@linova-education.fr"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all"
            >
              Envoyer un email
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
