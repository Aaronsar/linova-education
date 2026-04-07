import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Pourquoi choisir Linova Education - Ecole BTS Biologie Medicale Paris 12',
  description:
    "Decouvrez pourquoi Linova Education est l'ecole ideale pour votre BTS Biologie Medicale a Paris 12e. Plus de 10 ans d'experience, enseignants experts, certification Qualiopi, 80% d'insertion professionnelle a 6 mois. Formation initiale ou alternance.",
  keywords: [
    'pourquoi choisir Linova',
    'ecole biologie medicale Paris',
    'BTS biologie medicale Paris 12',
    'formation sante Paris',
    'Linova Education avis',
    'ecole laboratoire medical',
    'Diploma Education groupe',
    'alternance biologie medicale',
  ],
  alternates: { canonical: '/ecole/pourquoi-linova' },
};

const faqItems = [
  {
    question: "A qui s'adresse la formation proposee par Linova ?",
    answer:
      "Notre formation BTS Biologie Medicale s'adresse aux bacheliers (bac general avec specialites scientifiques, bac technologique STL ou ST2S, bac professionnel), aux etudiants en reorientation apres une premiere annee d'etudes superieures, et aux professionnels en reconversion souhaitant integrer le secteur de la biologie medicale. Nous accueillons egalement les titulaires d'un DAEU option B.",
  },
  {
    question: "Quelle est l'experience de Linova en formation sante ?",
    answer:
      "Linova s'appuie sur plus de dix ans d'experience au sein du groupe Diploma Education, reconnu dans le secteur de la formation en sante. Ce groupe a forme des milliers d'etudiants dans les metiers de la sante, de la preparation aux etudes de medecine aux formations professionnalisantes. Cette expertise nous permet de proposer un enseignement eprouve et constamment ameliore.",
  },
  {
    question: 'Qui sont les enseignants de Linova ?',
    answer:
      "Nos enseignants sont des professionnels en activite : biologistes medicaux, techniciens de laboratoire experimentes, cadres de sante, chercheurs et praticiens hospitaliers. Ils apportent une expertise de terrain a chaque cours et transmettent des competences directement applicables en milieu professionnel. Leur double casquette enseignant-praticien est un atout majeur de notre pedagogie.",
  },
  {
    question: 'Quels sont les principaux points forts de Linova ?',
    answer:
      "Les points forts de Linova sont nombreux : specialisation 100 % sante, enseignants experts en activite, accompagnement individualise tout au long du parcours, reseau de plus de 50 laboratoires partenaires, certification Qualiopi, taux d'insertion professionnelle superieur a 80 % a 6 mois, et localisation au coeur de Paris dans le 12e arrondissement, facilement accessible en transports.",
  },
  {
    question: 'Quels sont les debouches apres un BTS Biologie Medicale ?',
    answer:
      "Les debouches sont tres varies : technicien de laboratoire medical, technicien preleveur, technicien qualite en laboratoire, technicien en anatomopathologie, en biologie de la reproduction, en immunologie ou en microbiologie. Vous pourrez exercer dans les hopitaux publics (AP-HP), les laboratoires d'analyses privees, les centres de recherche (INSERM, CNRS), l'industrie pharmaceutique ou les etablissements de transfusion sanguine (EFS).",
  },
  {
    question: "Qu'est-ce qui differencie Linova d'une ecole generaliste ?",
    answer:
      "Contrairement aux ecoles generalistes qui proposent des dizaines de formations differentes, Linova est entierement dediee aux metiers de la sante. Cela se traduit par un enseignement plus specialise, des equipements de laboratoire adaptes, un corps enseignant issu exclusivement du secteur medical, un reseau professionnel cible et une connaissance approfondie des attentes des recruteurs du secteur.",
  },
  {
    question: 'La formation est-elle disponible en alternance ?',
    answer:
      "Oui, le BTS Biologie Medicale est disponible en formation initiale (4 500 euros par an) et en alternance. En alternance, les frais de scolarite sont integralement pris en charge par l'OPCO de l'entreprise d'accueil. L'etudiant percoit une remuneration mensuelle et acquiert une experience professionnelle significative de deux ans en laboratoire.",
  },
  {
    question: 'Comment se deroule le processus de candidature ?',
    answer:
      "Le processus de candidature se deroule en trois etapes : vous remplissez le formulaire de candidature en ligne, notre equipe examine votre dossier et vous convie a un entretien de motivation, puis vous recevez une reponse sous 10 jours ouvrables. Nous evaluons votre motivation, votre projet professionnel et votre parcours academique. Les admissions sont ouvertes toute l'annee, dans la limite des places disponibles.",
  },
];

export default function PourquoiLinova() {
  return (
    <>
      <PageHero
        title="Bien plus qu'un diplome :"
        highlight="un veritable tremplin professionnel"
        description="Choisir une ecole, c'est engager un projet de vie. Linova propose une formation unique dans un cadre entierement consacre aux metiers de la sante, avec un taux d'insertion de 80 % a six mois."
      />

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                  Pourquoi nous choisir
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  Une ecole pensee pour votre reussite dans les metiers de la sante
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depuis sa creation, Linova Education poursuit un objectif clair : former des professionnels competents et immediatement operationnels dans le secteur de la biologie medicale. Adossee au groupe Diploma Education, fort de plus de dix ans d&apos;experience dans la formation en sante, notre ecole beneficie d&apos;un savoir-faire pedagogique eprouve.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Nous ne sommes pas une ecole generaliste qui propose des dizaines de formations. Nous sommes specialises a 100 % dans les metiers de la sante, ce qui nous permet de concentrer toutes nos ressources, notre expertise et notre reseau professionnel sur un seul objectif : votre insertion dans le monde du travail.
                </p>
                <CandidaterButton>Decouvrir notre formation</CandidaterButton>
              </div>
              <div className="space-y-6">
                <div className="bg-light rounded-2xl p-6">
                  <div className="text-3xl font-bold text-teal mb-1">10+</div>
                  <p className="text-gray-600 text-sm">annees d&apos;experience dans la formation sante</p>
                </div>
                <div className="bg-light rounded-2xl p-6">
                  <div className="text-3xl font-bold text-teal mb-1">80 %</div>
                  <p className="text-gray-600 text-sm">de taux d&apos;insertion professionnelle a 6 mois</p>
                </div>
                <div className="bg-light rounded-2xl p-6">
                  <div className="text-3xl font-bold text-teal mb-1">Qualiopi</div>
                  <p className="text-gray-600 text-sm">certification qualite delivree par l&apos;Etat</p>
                </div>
                <div className="bg-light rounded-2xl p-6">
                  <div className="text-3xl font-bold text-teal mb-1">Paris 12e</div>
                  <p className="text-gray-600 text-sm">85 avenue Ledru-Rollin, au coeur de Paris</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
              Notre expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Une ecole specialisee, construite pour repondre aux besoins du secteur
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Un seul diplome propose, une specialisation 100 % sante, un encadrement par des specialistes et une pedagogie orientee savoir-faire concret. Chaque element de notre formation a ete concu pour maximiser vos chances de reussite.
            </p>
          </div>

          {/* Points forts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fondee sur l'experience",
                description:
                  "Plus de dix ans d'experience au sein du groupe Diploma Education. Des enseignants biologistes, techniciens et cadres de sante en activite qui transmettent un savoir-faire actualise et directement applicable en laboratoire.",
              },
              {
                title: 'Diplome solide, secteur porteur',
                description:
                  "Un taux d'insertion professionnelle superieur a 80 % a 6 mois. Le secteur de la biologie medicale connait une penurie de techniciens qualifies, avec des milliers de postes a pourvoir d'ici 2030 selon les projections du ministere de la Sante.",
              },
              {
                title: 'Environnement 100 % sante',
                description:
                  "Un ecosysteme d'apprentissage coherent ou tout est pense pour les metiers de la sante : equipements de laboratoire, partenariats avec les hopitaux, stages en milieu professionnel et accompagnement par des experts du domaine.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le groupe Diploma */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy text-sm font-semibold rounded-full mb-6">
                Le groupe Diploma Education
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Adossee a un groupe reconnu dans la formation sante
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Linova Education fait partie du groupe Diploma Education, un acteur majeur de la formation en sante en France. Ce groupe reunit plusieurs entites complementaires qui partagent une meme exigence de qualite et un meme engagement envers la reussite des etudiants.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cette appartenance nous offre un acces privilegie a un reseau etendu de professionnels de sante, des ressources pedagogiques mutualisees et une expertise pedagogique affinee au fil des annees. Les etudiants de Linova beneficient ainsi d&apos;un accompagnement qui depasse le cadre d&apos;une simple ecole.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Diploma Sante : preparations aux etudes de medecine, pharmacie et maieutique</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Diploma Education : formations professionnalisantes, BTS et diplomes europeens</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Linova Education : formation BTS Biologie Medicale, 100 % dediee aux metiers du laboratoire</span>
                </div>
              </div>
            </div>
            <div className="bg-navy rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-8">Le groupe en chiffres</h3>
              <div className="space-y-6">
                <div className="border-b border-white/20 pb-4">
                  <div className="text-3xl font-bold text-yellow">10+</div>
                  <p className="text-gray-300 text-sm mt-1">annees d&apos;experience dans la formation sante</p>
                </div>
                <div className="border-b border-white/20 pb-4">
                  <div className="text-3xl font-bold text-yellow">3</div>
                  <p className="text-gray-300 text-sm mt-1">entites complementaires au sein du groupe</p>
                </div>
                <div className="border-b border-white/20 pb-4">
                  <div className="text-3xl font-bold text-yellow">50+</div>
                  <p className="text-gray-300 text-sm mt-1">laboratoires et etablissements partenaires</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow">Qualiopi</div>
                  <p className="text-gray-300 text-sm mt-1">certification qualite delivree par l&apos;Etat francais</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Nos valeurs fondatrices</h2>
            <p className="text-gray-600 leading-relaxed">
              Trois valeurs guident notre action au quotidien et faconnent l&apos;experience de chaque etudiant au sein de Linova. Elles se traduisent dans notre pedagogie, notre organisation et notre relation avec les etudiants.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Engagement',
                description:
                  "Une equipe pedagogique accessible, rigoureuse et investie dans la reussite de chaque etudiant. Nos enseignants ne se contentent pas de transmettre des connaissances : ils accompagnent, conseillent et guident chaque etudiant vers son objectif professionnel. L'engagement se traduit aussi par un suivi individualise et une disponibilite constante.",
                color: 'bg-teal',
              },
              {
                title: 'Excellence',
                description:
                  "Un diplome reconnu par l'Etat (BTS, niveau Bac+2), une specialisation claire dans la biologie medicale et des exigences academiques elevees. Nous preparons nos etudiants aux standards les plus hauts du secteur, car les laboratoires d'analyses medicales exigent rigueur, precision et fiabilite. L'excellence n'est pas un objectif, c'est notre methode.",
                color: 'bg-navy',
              },
              {
                title: 'Ambition',
                description:
                  "Un apprentissage concret pour construire une carriere significative dans les metiers de la sante. Nous croyons que chaque etudiant porte en lui le potentiel de devenir un professionnel accompli. Notre role est de reveler ce potentiel a travers une formation exigeante, des stages formateurs et un reseau professionnel solide.",
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

      {/* Pedagogie differenciante */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
              Notre pedagogie
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Une approche pedagogique pensee pour le terrain
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Chez Linova, la theorie n&apos;est jamais deconnectee de la pratique. Notre pedagogie repose sur l&apos;alternance entre enseignements theoriques solides et mises en situation professionnelles concretes, pour que chaque etudiant soit immediatement operationnel a l&apos;issue de sa formation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Enseignement par des professionnels',
                description:
                  "Tous nos intervenants exercent dans le secteur de la biologie medicale. Biologistes, techniciens de laboratoire, cadres de sante : ils partagent leur experience quotidienne et les realites du metier. Cette proximite avec le terrain garantit un enseignement toujours a jour des dernieres evolutions techniques et reglementaires.",
              },
              {
                title: 'Travaux pratiques en laboratoire',
                description:
                  "Les etudiants realisent des travaux pratiques sur du materiel professionnel identique a celui utilise dans les laboratoires d'analyses medicales. Biochimie, hematologie, microbiologie, immunologie : chaque discipline est abordee avec les gestes techniques reels du metier.",
              },
              {
                title: 'Stages en milieu professionnel',
                description:
                  "Les stages sont au coeur de notre formation. Ils permettent aux etudiants de decouvrir differents environnements de travail (hopital, laboratoire prive, centre de recherche) et de developper des competences pratiques indispensables. Notre reseau de partenaires facilite la recherche de stages.",
              },
              {
                title: 'Accompagnement individualise',
                description:
                  "Chaque etudiant beneficie d'un suivi personnalise tout au long de son parcours. Entretiens individuels, aide a la recherche de stage ou d'alternance, preparation aux examens, soutien methodologique : notre equipe pedagogique est mobilisee pour accompagner chaque etudiant vers la reussite.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-light rounded-2xl p-8">
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs et accessibilite */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Deux voies d&apos;acces a la formation
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Linova propose le BTS Biologie Medicale en formation initiale et en alternance, pour s&apos;adapter a tous les profils et tous les projets professionnels.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Formation initiale</h3>
              <div className="text-4xl font-bold text-yellow my-4">4 500 &euro;/an</div>
              <p className="text-gray-300 text-sm mb-6">dont 500 &euro; de frais d&apos;inscription</p>
              <ul className="text-left text-gray-300 text-sm space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Formation sur 2 ans
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Stages en laboratoire inclus
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accompagnement personnalise
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Eligible aux bourses du CROUS
                </li>
              </ul>
              <CandidaterButton variant="yellow" className="px-6 py-2.5 text-sm">
                Candidater en initial
              </CandidaterButton>
            </div>
            <div className="bg-teal/20 backdrop-blur rounded-2xl p-8 text-center border border-yellow/30">
              <h3 className="text-xl font-bold text-white mb-2">Alternance</h3>
              <div className="text-4xl font-bold text-yellow my-4">0 &euro;</div>
              <p className="text-gray-300 text-sm mb-6">Frais integralement pris en charge par l&apos;OPCO</p>
              <ul className="text-left text-gray-300 text-sm space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Aucun frais de scolarite
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Remuneration mensuelle
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2 ans d&apos;experience professionnelle
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Insertion facilitee a l&apos;issue de la formation
                </li>
              </ul>
              <CandidaterButton variant="yellow" className="px-6 py-2.5 text-sm">
                Candidater en alternance
              </CandidaterButton>
            </div>
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Notre localisation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Au coeur de Paris, dans le 12e arrondissement
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Linova Education est situee au 85 avenue Ledru-Rollin, dans le 12e arrondissement de Paris. Ce quartier dynamique et bien desservi par les transports en commun offre un cadre ideal pour vos etudes.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                A proximite de nombreux laboratoires d&apos;analyses medicales, hopitaux et centres de recherche, notre localisation facilite la recherche de stages et d&apos;alternances pour nos etudiants.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">85 avenue Ledru-Rollin, 75012 Paris</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">+33 1 89 71 99 44</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Metro Gare de Lyon (lignes 1, 14, RER A et D)</span>
                </div>
              </div>
            </div>
            <div className="bg-light rounded-3xl p-8">
              <h3 className="text-xl font-bold text-dark mb-6">Acces et transports</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-dark text-sm">Metro</p>
                  <p className="text-gray-600 text-sm">Ligne 1 et 14 - Gare de Lyon / Ligne 8 - Ledru-Rollin</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-dark text-sm">RER</p>
                  <p className="text-gray-600 text-sm">RER A et RER D - Gare de Lyon</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-dark text-sm">Bus</p>
                  <p className="text-gray-600 text-sm">Lignes 29, 61, 76, 86 - Arret Ledru-Rollin</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-semibold text-dark text-sm">Velo</p>
                  <p className="text-gray-600 text-sm">Stations Velib&apos; a proximite</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temoignages / Social proof */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Ils ont choisi Linova
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Decouvrez les raisons qui ont pousse nos etudiants a choisir Linova pour leur formation en biologie medicale.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "J'ai choisi Linova pour la specialisation 100 % sante. Les enseignants sont des professionnels en activite, ce qui change tout par rapport a une ecole generaliste.",
                name: 'Etudiante en 2e annee',
                detail: 'BTS Biologie Medicale - Initiale',
              },
              {
                quote: "L'alternance chez Linova m'a permis de financer mes etudes tout en acquierant une experience precieuse en laboratoire. A la fin de mon BTS, j'ai ete embauchee dans mon laboratoire d'accueil.",
                name: 'Diplomee 2024',
                detail: 'BTS Biologie Medicale - Alternance',
              },
              {
                quote: "En reconversion professionnelle, j'avais besoin d'un accompagnement solide. L'equipe de Linova a ete presente a chaque etape, de l'inscription jusqu'a la preparation des examens.",
                name: 'Etudiant en reconversion',
                detail: 'BTS Biologie Medicale - Initiale',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <svg className="w-8 h-8 text-teal/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 leading-relaxed mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold text-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <CandidaterButton>Rejoindre Linova</CandidaterButton>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
