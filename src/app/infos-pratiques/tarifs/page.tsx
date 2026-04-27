import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import FAQ from '@/components/FAQ';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Tarifs BTS Biologie Medicale - Initial 6000 euros/an, Alternance gratuite | Linova Paris',
  description:
    "Tarifs du BTS Biologie Medicale chez Linova Education Paris 12e : 6 000 euros/an en initial (dont 500 euros de frais d'inscription), 0 euro en alternance (finance par l'OPCO). Echelonnement possible. Salaire alternant de 795 a 1 766 euros/mois.",
  keywords: [
    'tarif BTS Biologie Medicale',
    'cout formation laboratoire Paris',
    'alternance gratuite biologie medicale',
    'financement BTS sante',
    'OPCO formation laboratoire',
    'prix ecole biologie Paris',
    'bourse BTS sante',
  ],
  alternates: { canonical: '/infos-pratiques/tarifs' },
};

const faqItems = [
  {
    question: "Quel est le cout total de la formation en initial ?",
    answer: "Le cout total de la formation initiale est de 6 000 euros par an, soit 12 000 euros pour les deux annees du BTS. Ce tarif comprend l'ensemble de la scolarite, l'acces aux laboratoires et equipements pedagogiques, les supports de cours et la plateforme numerique. Des frais d'inscription de 500 euros (inclus dans les 6 000 euros) sont a regler a la confirmation de l'inscription.",
  },
  {
    question: "Comment fonctionne le financement de l'alternance ?",
    answer: "En alternance, les frais de formation sont integralement pris en charge par l'OPCO (Operateur de Competences) de l'entreprise d'accueil. Vous ne payez rien. De plus, en tant que salarie de l'entreprise, vous percevez une remuneration mensuelle allant de 795 a 1 766 euros brut selon votre age et votre annee de formation. C'est l'employeur qui effectue les demarches aupres de l'OPCO.",
  },
  {
    question: "Est-il possible d'echelonner les paiements en initial ?",
    answer: "Oui, Linova propose un echelonnement des paiements pour les etudiants en formation initiale. Vous pouvez repartir le cout de la scolarite en plusieurs mensualites (jusqu'a 10 fois) sans frais supplementaires. Contactez notre service administratif pour mettre en place un plan de paiement adapte a votre situation.",
  },
  {
    question: "Existe-t-il des aides financieres pour les etudiants en initial ?",
    answer: "Plusieurs dispositifs d'aide existent : la bourse du CROUS (sous conditions de ressources), les aides regionales (Ile-de-France), les aides au logement (APL, ALS), les aides d'urgence du CROUS, et les prets etudiants a taux preferentiel proposes par certaines banques partenaires. Notre equipe vous oriente vers les dispositifs adaptes a votre situation.",
  },
  {
    question: "Quel est le salaire d'un alternant en BTS Biologie Medicale ?",
    answer: "La remuneration de l'alternant depend de son age et de son annee de formation. En premiere annee : 795 euros brut/mois pour les 18-20 ans, 977 euros pour les 21-25 ans, 1 766 euros pour les 26 ans et plus (100% du SMIC). En deuxieme annee : 939 euros brut/mois pour les 18-20 ans, 1 129 euros pour les 21-25 ans, 1 766 euros pour les 26 ans et plus. Ces montants sont des minimums legaux et peuvent etre superieurs selon la convention collective de l'entreprise.",
  },
  {
    question: "Les frais de transport et de restauration sont-ils inclus ?",
    answer: "Les frais de transport et de restauration ne sont pas inclus dans les frais de scolarite. Cependant, les etudiants beneficient du tarif etudiant pour les transports en commun (carte Imagine R ou abonnement Navigo a tarif reduit). En alternance, l'employeur prend en charge 50% du cout de l'abonnement de transport. Notre campus, situe a proximite du metro Ledru-Rollin (ligne 8), est facilement accessible.",
  },
  {
    question: "Qu'est-ce qu'un OPCO et comment ca marche ?",
    answer: "Un OPCO (Operateur de Competences) est un organisme agree par l'Etat charge de financer la formation des apprentis et salaries. Quand une entreprise recrute un alternant, son OPCO prend en charge les couts de la formation aupres de l'ecole. Il existe 11 OPCO en France, chacun couvrant des branches professionnelles specifiques. Les laboratoires et structures de sante relevent generalement de l'OPCO Sante ou de l'OPCO EP. L'entreprise n'a aucune demarche complexe a effectuer : Linova s'occupe de la liaison avec l'OPCO.",
  },
  {
    question: "Y a-t-il des frais supplementaires pendant la formation ?",
    answer: "Non, il n'y a pas de frais supplementaires caches. Le tarif annonce inclut l'acces a l'ensemble des ressources pedagogiques, des equipements de laboratoire et de la plateforme numerique. Les seuls couts additionnels eventuels sont personnels : blouses de laboratoire (environ 20 euros), fournitures scolaires et livres complementaires recommandes (mais non obligatoires, car les supports sont fournis).",
  },
];

export default function Tarifs() {
  return (
    <>
      <PageHero
        title="Tarifs et financement"
        description="Nous avons a coeur de rendre nos formations accessibles a tous. Decouvrez nos tarifs transparents et les nombreuses solutions de financement."
      />

      {/* Tarifs principaux */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Initial */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-teal transition-colors shadow-sm">
              <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-6">
                Formation initiale
              </span>
              <div className="text-5xl font-bold text-dark mb-2">6 000 &euro;</div>
              <p className="text-gray-500 mb-2">par an</p>
              <p className="text-sm text-gray-400 mb-8">Soit 12 000 euros pour les 2 annees du BTS</p>
              <ul className="space-y-4 mb-8">
                {[
                  'Frais d\'inscription : 500 euros (inclus dans le tarif annuel)',
                  'Echelonnement des paiements possible (jusqu\'a 10 fois sans frais)',
                  'Acces complet aux laboratoires et equipements',
                  'Supports de cours et plateforme numerique inclus',
                  'Accompagnement personnalise pour le financement',
                  '12 semaines de stage en milieu professionnel',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <CandidaterButton variant="outline" className="px-6 py-3 text-sm w-full">
                Candidater en initial
              </CandidaterButton>
            </div>

            {/* Alternance */}
            <div className="bg-navy rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-yellow text-dark text-xs font-bold rounded-full">
                Recommande
              </div>
              <span className="inline-block px-3 py-1 bg-white/10 text-yellow text-xs font-semibold rounded-full mb-6">
                Alternance
              </span>
              <div className="text-5xl font-bold text-yellow mb-2">0 &euro;</div>
              <p className="text-gray-300 mb-2">pris en charge par l&apos;OPCO</p>
              <p className="text-sm text-gray-400 mb-8">+ un salaire mensuel pour l&apos;etudiant</p>
              <ul className="space-y-4 mb-8">
                {[
                  '100% des frais pris en charge par l\'OPCO de l\'entreprise',
                  'Statut de salarie avec remuneration mensuelle',
                  'Salaire : de 795 a 1 766 euros brut / mois',
                  'Experience professionnelle des la 1re annee',
                  'Rythme : 2 jours ecole / 3 jours entreprise',
                  'Financement integral + salaire + diplome',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <CandidaterButton variant="yellow" className="px-6 py-3 text-sm w-full">
                Candidater en alternance
              </CandidaterButton>
            </div>
          </div>
        </div>
      </section>

      {/* Detail remuneration alternant */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Remuneration de l&apos;alternant
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            En tant qu&apos;alternant, vous beneficiez d&apos;un statut de salarie et d&apos;une remuneration mensuelle calculee en pourcentage du SMIC. Ce montant depend de votre age et de votre annee de contrat.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-2xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left py-4 px-6">Tranche d&apos;age</th>
                  <th className="text-left py-4 px-6">1re annee</th>
                  <th className="text-left py-4 px-6">2e annee</th>
                  <th className="text-left py-4 px-6">Base de calcul</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { age: '18-20 ans', an1: '795 euros', an2: '939 euros', base: '43% puis 51% du SMIC' },
                  { age: '21-25 ans', an1: '977 euros', an2: '1 129 euros', base: '53% puis 61% du SMIC' },
                  { age: '26 ans et plus', an1: '1 766 euros', an2: '1 766 euros', base: '100% du SMIC' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-light'}>
                    <td className="py-4 px-6 font-semibold text-dark">{row.age}</td>
                    <td className="py-4 px-6 text-teal font-bold">{row.an1}</td>
                    <td className="py-4 px-6 text-teal font-bold">{row.an2}</td>
                    <td className="py-4 px-6 text-gray-500">{row.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-gray-500 text-center">
            Montants bruts mensuels indicatifs bases sur le SMIC en vigueur (1 766,92 euros brut en 2025). La convention collective de l&apos;entreprise peut prevoir des montants superieurs.
          </p>
        </div>
      </section>

      {/* Aides au financement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Aides au financement
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Que vous soyez en formation initiale ou en alternance, de nombreux dispositifs existent pour vous aider a financer vos etudes et votre quotidien.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Bourse du CROUS',
                description: "Attribuee sous conditions de ressources par le Centre Regional des Oeuvres Universitaires. Montant variable selon les echelons (de 0 a 7). Les etudiants en BTS y sont eligibles. Faites votre demande via le Dossier Social Etudiant (DSE) entre janvier et mai.",
                who: 'Initial',
              },
              {
                title: 'Aides regionales Ile-de-France',
                description: "La Region Ile-de-France propose des aides specifiques pour les apprentis et etudiants : aide au transport, aide au premier equipement, aide a la restauration. Renseignez-vous aupres du Conseil Regional ou de notre service administratif.",
                who: 'Initial & Alternance',
              },
              {
                title: 'Aides au logement (APL / ALS)',
                description: "La CAF propose des aides personnalisees au logement pour les etudiants et alternants. Le montant depend de votre loyer, de vos ressources et de votre situation familiale. La demande se fait en ligne sur le site de la CAF.",
                who: 'Initial & Alternance',
              },
              {
                title: 'Pret etudiant garanti par l\'Etat',
                description: "Un pret etudiant a taux preferentiel, sans caution parentale, pouvant atteindre 20 000 euros. Il est propose par plusieurs banques partenaires et garanti par Bpifrance. Le remboursement ne commence qu'a la fin de vos etudes.",
                who: 'Initial',
              },
              {
                title: 'Prise en charge OPCO',
                description: "En alternance, l'integralite des frais de formation est prise en charge par l'OPCO de votre entreprise d'accueil. Linova s'occupe de toutes les demarches administratives aupres de l'operateur de competences.",
                who: 'Alternance',
              },
              {
                title: 'Aide exceptionnelle a l\'apprentissage',
                description: "L'Etat verse une aide de 6 000 euros a l'employeur pour la premiere annee de contrat d'apprentissage. Cette aide facilite le recrutement d'alternants et beneficie indirectement aux etudiants en facilitant l'acces a un contrat.",
                who: 'Alternance',
              },
            ].map((aide, i) => (
              <div key={i} className="bg-light rounded-2xl p-6">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${aide.who === 'Alternance' ? 'bg-yellow/20 text-yellow-700' : aide.who === 'Initial' ? 'bg-teal/10 text-teal' : 'bg-navy/10 text-navy'}`}>
                  {aide.who}
                </span>
                <h3 className="text-lg font-bold text-dark mb-3">{aide.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{aide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparatif initial vs alternance */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Comparatif financier : initial vs alternance
          </h2>
          <p className="text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Pour vous aider a choisir, voici un comparatif financier detaille sur les 2 annees de formation.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white/10 rounded-2xl overflow-hidden">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-gray-300">Critere</th>
                  <th className="text-left py-4 px-6 text-teal font-bold">Initial</th>
                  <th className="text-left py-4 px-6 text-yellow font-bold">Alternance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { critere: 'Frais de scolarite (2 ans)', initial: '12 000 euros', alternance: '0 euro' },
                  { critere: 'Salaire mensuel', initial: 'Aucun', alternance: '795 a 1 766 euros brut' },
                  { critere: 'Experience professionnelle', initial: '12 semaines de stage', alternance: '3 jours/semaine en entreprise' },
                  { critere: 'Financement', initial: 'A la charge de l\'etudiant', alternance: 'OPCO de l\'entreprise' },
                  { critere: 'Statut', initial: 'Etudiant', alternance: 'Salarie' },
                  { critere: 'Conges payes', initial: 'Vacances scolaires', alternance: '5 semaines de conges payes/an' },
                  { critere: 'Protection sociale', initial: 'Securite sociale etudiante', alternance: 'Regime general salarie' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-4 px-6 text-gray-300">{row.critere}</td>
                    <td className="py-4 px-6 text-white">{row.initial}</td>
                    <td className="py-4 px-6 text-white">{row.alternance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Echelonnement et facilites de paiement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Facilites de paiement en initial</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nous comprenons que le financement de vos etudes est un enjeu important. C&apos;est pourquoi Linova Education propose des solutions flexibles pour vous permettre de suivre votre formation en toute serenite.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: 'Echelonnement en 10 fois sans frais',
                    description: 'Repartissez le cout annuel de 6 000 euros en 10 mensualites de 600 euros, sans frais supplementaires ni interets.',
                  },
                  {
                    title: 'Reglement en 3 fois',
                    description: 'Versez 2 000 euros a l\'inscription, 2 000 euros en janvier et 2 000 euros en avril.',
                  },
                  {
                    title: 'Paiement en une fois',
                    description: 'Reglez l\'integralite des frais de scolarite a l\'inscription.',
                  },
                ].map((option, i) => (
                  <div key={i} className="bg-light rounded-xl p-5">
                    <h3 className="font-bold text-dark mb-1">{option.title}</h3>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-light rounded-3xl p-8">
              <h3 className="text-xl font-bold text-dark mb-6">Ce qui est inclus dans le tarif</h3>
              <ul className="space-y-4">
                {[
                  'Totalite des heures de cours (1 350 heures sur 2 ans)',
                  'Acces aux laboratoires equipes de materiel professionnel',
                  'Supports de cours et documentation pedagogique',
                  'Plateforme numerique (replays, QCM, ressources)',
                  'Suivi pedagogique individualise',
                  'Ateliers de preparation a l\'insertion professionnelle',
                  'Accompagnement a la recherche de stage',
                  'Passage de l\'examen final du BTS',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact aide financement */}
      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-dark mb-6">Besoin d&apos;aide pour le financement ?</h2>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Notre equipe vous accompagne dans toutes vos demarches de financement : elaboration de devis precise, orientation vers les dispositifs d&apos;aide adaptes a votre situation, aide a la constitution de votre dossier de bourse ou de pret.
            </p>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              N&apos;hesitez pas a nous contacter pour un rendez-vous personnalise. Nous trouverons ensemble la solution la plus adaptee a votre situation.
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

      <FAQ items={faqItems} title="Questions frequentes sur les tarifs" />

      <CTASection />
    </>
  );
}
