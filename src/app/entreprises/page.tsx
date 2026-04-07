import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import FAQ from '@/components/FAQ';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Entreprises - Recrutez un alternant BTS Biologie Medicale | Linova Paris',
  description:
    "Recrutez un alternant en BTS Biologie Medicale avec Linova Education. Accompagnement complet : selection des profils, demarches OPCO, suivi pedagogique. Cout maitrise : 378 a 563 euros/mois apres aides. Aide de 6 000 euros pour les employeurs.",
  keywords: [
    'recruter alternant biologie medicale',
    'apprentissage laboratoire Paris',
    'OPCO formation biologie',
    'alternance technicien laboratoire',
    'cout alternant biologie medicale',
    'aide recrutement apprenti',
    'partenariat ecole laboratoire',
  ],
  alternates: { canonical: '/entreprises' },
};

const faqItems = [
  {
    question: "Quel est le profil des alternants formes par Linova ?",
    answer: "Nos alternants sont des etudiants motives, selectionnes sur dossier et entretien de motivation, titulaires d'un baccalaureat general (scientifique), technologique (ST2S, STL) ou professionnel en lien avec les sciences de la sante. Ils suivent une formation rigoureuse en BTS Biologie Medicale combinant theorie et pratique en laboratoire. Ils sont formes aux techniques de biochimie, microbiologie, hematologie et aux normes qualite du secteur.",
  },
  {
    question: "Quel est le rythme de l'alternance ?",
    answer: "Le rythme est de 2 jours en formation a l'ecole (lundi-mardi ou jeudi-vendredi) et 3 jours en entreprise. Ce rythme est constant tout au long de l'annee, ce qui permet a l'alternant de s'impliquer durablement dans les activites de votre structure et d'acquerir une veritable autonomie. Les periodes d'examens sont planifiees a l'avance.",
  },
  {
    question: "Combien coute un alternant pour l'entreprise ?",
    answer: "Le cout reel d'un alternant est tres maitrise grace aux aides publiques. La remuneration brute varie de 795 a 1 766 euros/mois selon l'age. Apres deduction de l'aide exceptionnelle de 6 000 euros la premiere annee, le cout reel mensuel se situe entre 378 et 563 euros/mois pour un alternant de moins de 26 ans. Les frais de formation sont integralement pris en charge par votre OPCO.",
  },
  {
    question: "Quelles sont les aides financieres pour l'employeur ?",
    answer: "Plusieurs aides sont cumulables : l'aide exceptionnelle a l'apprentissage (6 000 euros pour la premiere annee), l'exoneration de charges sociales (partielle ou totale selon la taille de l'entreprise), le financement de la formation par l'OPCO (aucun cout de scolarite pour l'employeur), et une aide supplementaire pouvant atteindre 6 000 euros pour l'embauche d'un apprenti en situation de handicap (via l'AGEFIPH).",
  },
  {
    question: "Comment se deroule le processus de recrutement ?",
    answer: "Linova vous accompagne a chaque etape : 1) Nous definissons ensemble vos besoins en competences. 2) Nous preselectionnons les candidats les plus adaptes a votre structure. 3) Vous menez les entretiens avec les candidats retenus. 4) Une fois votre choix fait, nous prenons en charge toutes les demarches administratives : contrat d'apprentissage, liaison avec l'OPCO, convention de formation. Delai moyen : 2 a 4 semaines entre la demande et la signature du contrat.",
  },
  {
    question: "Quel type de contrat est conclu avec l'alternant ?",
    answer: "L'alternant est recrute via un contrat d'apprentissage d'une duree de 2 ans correspondant a la duree du BTS. C'est un contrat de travail a duree determinee (CDD) ou indeterminee (CDI) qui donne a l'alternant le statut de salarie de votre entreprise, avec tous les droits associes : remuneration, conges payes, protection sociale, cotisation retraite.",
  },
  {
    question: "Linova assure-t-elle un suivi de l'alternant en entreprise ?",
    answer: "Oui, un suivi pedagogique regulier est assure par Linova. Un tuteur pedagogique de l'ecole et un maitre d'apprentissage de votre entreprise sont designes pour encadrer l'alternant. Des bilans periodiques sont realises pour evaluer la progression, ajuster les missions si necessaire et garantir la coherence entre la formation theorique et la pratique en entreprise.",
  },
  {
    question: "Quelles structures peuvent accueillir un alternant en biologie medicale ?",
    answer: "Toutes les structures du secteur de la biologie medicale et de la sante peuvent recruter un alternant : laboratoires d'analyses medicales (publics et prives), hopitaux et CHU, cliniques, etablissements francais du sang, centres de recherche biomedicale, industries pharmaceutiques et biotechnologiques, organismes de controle qualite et cabinets d'anatomopathologie.",
  },
];

export default function Entreprises() {
  return (
    <>
      <PageHero
        title="Formez aujourd'hui,"
        highlight="batissez votre equipe de demain"
        description="Recrutez un alternant Linova en BTS Biologie Medicale et investissez dans vos talents de demain. Accompagnement complet, demarches simplifiees, cout maitrise."
      />

      {/* Chiffres cles */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '80%', label: 'Taux d\'insertion a 6 mois' },
              { value: '2/3', label: 'Rythme ecole/entreprise par semaine' },
              { value: '6 000 euros', label: 'Aide employeur 1re annee' },
              { value: '0 euro', label: 'Cout de formation pour l\'entreprise' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal">{stat.value}</div>
                <p className="text-sm text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
            Avantages employeurs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Pourquoi recruter un alternant Linova ?
          </h2>
          <p className="text-gray-600 mb-16 max-w-3xl">
            En recrutant un alternant en BTS Biologie Medicale chez Linova, vous formez un futur collaborateur deja familiarise avec votre structure, vos methodes et votre culture d&apos;entreprise. Un investissement strategique pour repondre a vos besoins en competences et preparer l&apos;avenir.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Competences sectorielles pointues',
                description: "La formation Linova est exigeante et specialisee : biochimie, microbiologie, hematologie, immuno-hematologie, qualite et securite au laboratoire. Votre alternant arrive avec des bases solides et une formation technique alignee sur les besoins reels du terrain.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                title: 'Integration progressive et durable',
                description: "Grace au rythme 2 jours ecole / 3 jours entreprise, l'alternant s'integre progressivement dans votre equipe. Sur 2 ans, il acquiert une veritable autonomie et une connaissance approfondie de votre organisation, de vos protocoles et de votre environnement professionnel.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                title: 'Cout maitrise et aides publiques',
                description: "Avec l'aide exceptionnelle de 6 000 euros et le financement de la formation par l'OPCO, le cout reel d'un alternant de moins de 26 ans se situe entre 378 et 563 euros par mois seulement. Un investissement minime pour former un futur collaborateur operationnel.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Investissement pour l\'avenir',
                description: "80% de nos diplomes sont en emploi a 6 mois. A l'issue de son BTS, votre alternant peut devenir un collaborateur a part entiere, deja forme a vos methodes. Vous gagnez du temps et de l'argent sur le recrutement et la formation d'un nouveau salarie.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                title: 'Accompagnement administratif complet',
                description: "Linova prend en charge toutes les demarches administratives : redaction du contrat d'apprentissage, liaison avec l'OPCO, depot du contrat, convention de formation. Vous n'avez qu'a vous concentrer sur l'integration de votre alternant.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: 'Suivi pedagogique et qualite',
                description: "Un tuteur pedagogique de Linova suit la progression de l'alternant en lien avec votre maitre d'apprentissage. Des bilans reguliers garantissent la coherence entre formation theorique et missions en entreprise. Linova est certifie Qualiopi, gage de qualite.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
              },
            ].map((avantage, i) => (
              <div key={i} className="bg-light rounded-2xl p-8 flex gap-6">
                <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                  {avantage.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">{avantage.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{avantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rythme & Couts */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Rythme de l&apos;alternance</h2>
              <p className="text-gray-300 mb-8">
                Le rythme est stable et previsible tout au long de l&apos;annee, ce qui facilite l&apos;organisation de votre service et l&apos;integration de l&apos;alternant dans vos activites.
              </p>
              <div className="bg-white/10 rounded-2xl p-8 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-teal/20 rounded-xl">
                    <div className="text-3xl font-bold text-yellow">2</div>
                    <p className="text-sm text-gray-300 mt-1">jours / semaine en formation</p>
                    <p className="text-xs text-gray-400 mt-1">Lundi-mardi ou jeudi-vendredi</p>
                  </div>
                  <div className="text-center p-4 bg-teal/20 rounded-xl">
                    <div className="text-3xl font-bold text-yellow">3</div>
                    <p className="text-sm text-gray-300 mt-1">jours / semaine en entreprise</p>
                    <p className="text-xs text-gray-400 mt-1">Du mercredi au vendredi ou du lundi au mercredi</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-5">
                <h3 className="font-semibold text-yellow mb-2">Duree du contrat</h3>
                <p className="text-gray-300 text-sm">Le contrat d&apos;apprentissage dure 2 ans, correspondant aux 2 annees du BTS. La formation debute en septembre et se termine a l&apos;issue des epreuves du BTS (juin de la 2e annee).</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Couts et aides financieres</h2>
              <p className="text-gray-300 mb-8">
                L&apos;alternance est un dispositif financierement avantageux pour l&apos;entreprise grace aux aides publiques et au financement de la formation par l&apos;OPCO.
              </p>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Remuneration de l&apos;alternant</h3>
                  <p className="text-gray-300 text-sm mb-3">La remuneration varie selon l&apos;age de l&apos;alternant :</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">18-20 ans</span>
                      <span className="text-white font-semibold">795 - 939 euros brut / mois</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">21-25 ans</span>
                      <span className="text-white font-semibold">977 - 1 129 euros brut / mois</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">26 ans et plus</span>
                      <span className="text-white font-semibold">1 766 euros brut / mois</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Cout reel apres aides</h3>
                  <p className="text-gray-300 text-sm">Entre 378 et 563 euros / mois pour un alternant de moins de 26 ans, apres deduction de l&apos;aide exceptionnelle de 6 000 euros.</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Aide exceptionnelle a l&apos;apprentissage</h3>
                  <p className="text-gray-300 text-sm">6 000 euros verses par l&apos;Etat pour la 1re annee du contrat d&apos;apprentissage. Applicable a toutes les entreprises.</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Aide handicap</h3>
                  <p className="text-gray-300 text-sm">Jusqu&apos;a 6 000 euros supplementaires via l&apos;AGEFIPH pour l&apos;embauche d&apos;un apprenti en situation de handicap. Cumulable avec les autres aides.</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Formation 100% financee</h3>
                  <p className="text-gray-300 text-sm">Les frais de formation sont integralement pris en charge par votre OPCO. Aucun cout pedagogique pour l&apos;entreprise.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structures d'accueil */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Quelles structures peuvent recruter ?
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Le BTS Biologie Medicale prepare a travailler dans une grande variete de structures du secteur de la sante et de la biologie. Voici les principaux types d&apos;employeurs qui recrutent nos alternants.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Laboratoires d\'analyses medicales',
                description: 'Laboratoires de biologie medicale publics et prives, groupes de laboratoires, plateaux techniques.',
                missions: 'Analyses de routine, prelevements, gestion de la phase pre-analytique, controle qualite.',
              },
              {
                title: 'Hopitaux et CHU',
                description: 'Services de biologie des centres hospitaliers, CHU, cliniques et etablissements de sante.',
                missions: 'Analyses biologiques d\'urgence, hematologie, microbiologie, biochimie hospitaliere.',
              },
              {
                title: 'Etablissements francais du sang',
                description: 'Sites EFS, centres de collecte et de traitement du sang et de ses derives.',
                missions: 'Immuno-hematologie, qualification biologique des dons, controle qualite.',
              },
              {
                title: 'Centres de recherche',
                description: 'Unites de recherche biomedicale, INSERM, CNRS, instituts Pasteur et equivalents.',
                missions: 'Participation aux protocoles de recherche, analyses experimentales, documentation.',
              },
              {
                title: 'Industrie pharmaceutique et biotech',
                description: 'Laboratoires de controle qualite, services R&D, entreprises de biotechnologie.',
                missions: 'Controle qualite des matieres premieres et produits finis, analyses microbiologiques.',
              },
              {
                title: 'Cabinets d\'anatomopathologie',
                description: 'Structures specialisees dans l\'examen des tissus et cellules a visee diagnostique.',
                missions: 'Techniques histologiques, cytologie, preparation et coloration des lames.',
              },
            ].map((structure, i) => (
              <div key={i} className="bg-light rounded-2xl p-6">
                <h3 className="text-lg font-bold text-dark mb-2">{structure.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{structure.description}</p>
                <div className="border-t border-gray-200 pt-3">
                  <span className="text-xs font-semibold text-teal uppercase">Missions types</span>
                  <p className="text-gray-500 text-sm mt-1">{structure.missions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accompagnement entreprise */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Notre accompagnement employeur
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Linova Education vous accompagne a chaque etape du processus de recrutement, de la definition de vos besoins a l&apos;integration de l&apos;alternant. Notre objectif : vous faire gagner du temps et securiser votre recrutement.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: '1. Definition des besoins',
                    description: "Nous analysons vos besoins en competences, votre organisation et vos attentes pour identifier le profil ideal. Quelles missions confier a l'alternant ? Quelles competences developper ? Quel rythme est le plus adapte ?",
                  },
                  {
                    title: '2. Preselection des candidats',
                    description: "Nous preselectionnons les candidats les plus adaptes a votre structure en fonction de leur profil, de leur motivation et de la coherence de leur projet. Vous recevez des CV qualifies et prepares a l'entretien.",
                  },
                  {
                    title: '3. Demarches administratives',
                    description: "Nous prenons en charge l'integralite des demarches administratives : redaction du contrat d'apprentissage (CERFA), declaration aupres de l'OPCO, convention de formation, depot du contrat. Vous n'avez qu'a signer.",
                  },
                  {
                    title: '4. Optimisation des aides',
                    description: "Nous vous informons et vous accompagnons pour maximiser les aides et financements auxquels vous avez droit : aide exceptionnelle, exonerations de charges, aide AGEFIPH le cas echeant.",
                  },
                  {
                    title: '5. Suivi pendant la formation',
                    description: "Un tuteur pedagogique Linova assure le suivi de l'alternant en lien avec votre maitre d'apprentissage. Des bilans periodiques evaluent la progression et ajustent les missions si necessaire.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-navy rounded-3xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-6">Missions confiables a l&apos;alternant</h3>
                <p className="text-gray-300 text-sm mb-6">
                  L&apos;alternant en BTS Biologie Medicale peut realiser un large eventail de missions au sein de votre structure, avec un niveau d&apos;autonomie croissant au fil de la formation.
                </p>
                <ul className="space-y-3">
                  {[
                    'Realisation des prelevements biologiques',
                    'Analyses en biochimie, hematologie et microbiologie',
                    'Gestion de la phase pre-analytique',
                    'Maintenance et calibration des automates',
                    'Controle qualite interne et externe',
                    'Gestion des stocks et reactifs',
                    'Participation a la demarche qualite',
                    'Saisie et validation technique des resultats',
                    'Accueil et orientation des patients (si applicable)',
                    'Documentation et procedures',
                  ].map((mission, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-200">{mission}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-dark mb-4">Le role du maitre d&apos;apprentissage</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Le maitre d&apos;apprentissage est le referent de l&apos;alternant dans votre entreprise. Il l&apos;accompagne au quotidien, lui confie des missions progressives et evalue sa montee en competences.
                </p>
                <ul className="space-y-2">
                  {[
                    'Doit justifier d\'au moins 2 ans d\'experience professionnelle',
                    'Encadre 2 alternants maximum simultanement',
                    'Participe aux bilans pedagogiques avec Linova',
                    'Beneficie d\'un guide du maitre d\'apprentissage fourni par Linova',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temoignages / confiance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Pourquoi les entreprises nous font confiance
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Linova Education fait partie du groupe Diploma Education, avec plus de 10 ans d&apos;experience dans la formation aux metiers de la sante. Notre certification Qualiopi garantit la qualite de nos formations et de notre accompagnement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Certification Qualiopi',
                description: "Notre certification Qualiopi, delivree par l'Etat, atteste de la qualite de nos formations selon les 7 criteres du Referentiel National Qualite. C'est un gage de serieux et de conformite pour les entreprises partenaires.",
              },
              {
                title: 'Groupe Diploma Education',
                description: "Linova beneficie de l'expertise et du reseau du groupe Diploma Education, present dans la formation sante depuis plus de 10 ans. Cette appartenance garantit un savoir-faire eprouve et une solidite institutionnelle.",
              },
              {
                title: '80% d\'insertion a 6 mois',
                description: "Notre taux d'insertion professionnelle de 80% a 6 mois temoigne de la qualite de notre formation et de l'adequation de nos diplomes avec les besoins du marche de la biologie medicale.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-light rounded-2xl p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-6 text-lg font-bold">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact entreprise */}
      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-dark mb-6">
              Vous souhaitez recruter un alternant ?
            </h2>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Contactez notre equipe relations entreprises pour discuter de vos besoins et recevoir des profils qualifies. Nous vous accompagnons de A a Z dans le recrutement de votre futur collaborateur.
            </p>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Que vous soyez un laboratoire d&apos;analyses medicales, un hopital, un centre de recherche ou une entreprise du secteur biomedical, nous avons le profil adapte a vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+33189719944"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal text-white font-semibold rounded-full hover:brightness-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                01 89 71 99 44
              </a>
              <a
                href="mailto:contact@linova-education.fr"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all"
              >
                contact@linova-education.fr
              </a>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} title="Questions frequentes pour les entreprises" />

      <CTASection
        title="Vous souhaitez recruter un alternant ?"
        description="Contactez-nous pour en discuter et trouver le profil ideal pour votre structure."
        primaryText="Nous contacter"
        primaryHref="tel:+33189719944"
      />
    </>
  );
}
