import type { Metadata } from 'next';
import Link from 'next/link';
import CandidatureCvForm from '@/components/CandidatureCvForm';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'BTS NDRC en alternance à distance - Rentrée janvier 2027',
  description:
    "BTS NDRC (Négociation et Digitalisation de la Relation Client) en alternance, 100 % à distance sur plateforme e-learning. RNCP 38368, 1 350 h sur 2 ans, 0 € pour l'apprenti. École certifiée Qualiopi. Déposez votre CV.",
  keywords: ['BTS NDRC', 'BTS NDRC alternance', 'BTS NDRC à distance', 'BTS NDRC en ligne', 'alternance commerce', 'RNCP 38368'],
  alternates: { canonical: '/formations/bts-ndrc' },
};

const MISE_A_JOUR = '13 novembre 2026';

const faqItems = [
  { question: "Qu'est-ce que le BTS NDRC ?", answer: "Le BTS Négociation et Digitalisation de la Relation Client est un diplôme national de niveau 5 (bac+2), délivré par le ministère de l'Enseignement supérieur. Il forme des commerciaux capables de gérer toute la relation client : prospection, négociation, vente, fidélisation, en face à face, à distance et en ligne." },
  { question: 'La formation est-elle vraiment à distance ?', answer: "Oui. Les cours ont lieu en classes virtuelles en direct avec vos formateurs, complétées par des modules, des exercices et des replays sur notre plateforme e-learning. Vous suivez la formation depuis chez vous ou depuis votre entreprise, avec un ordinateur et une connexion internet. Les épreuves de l'examen se passent en présentiel, dans un centre d'examen désigné par le rectorat." },
  { question: 'Combien coûte la formation ?', answer: "Rien pour l'apprenti. En contrat d'apprentissage, les frais de formation sont pris en charge par l'opérateur de compétences (OPCO) de l'entreprise. Vous êtes salarié et rémunéré pendant vos deux années de formation." },
  { question: "Faut-il déjà avoir une entreprise pour candidater ?", answer: "Non. Vous pouvez candidater sans entreprise : notre équipe étudie votre profil, vous accompagne dans votre recherche et peut vous présenter des offres d'entreprises partenaires. Votre admission devient définitive à la signature du contrat d'apprentissage." },
  { question: 'Quand commence la formation ?', answer: "La première promotion démarre en janvier 2027. Les contrats d'apprentissage peuvent être signés dès décembre 2026. La formation dure deux ans et prépare à la session d'examen du BTS." },
  { question: 'De quel matériel ai-je besoin ?', answer: "Un ordinateur équipé d'une webcam et d'un micro, et une connexion internet stable. Vos accès à la plateforme e-learning vous sont remis avant le premier cours, avec une prise en main guidée." },
  { question: 'Comment suis-je accompagné à distance ?', answer: "Vous avez un responsable pédagogique référent, une assistance technique et pédagogique joignable par mail et téléphone, des points de suivi réguliers, et un échange organisé avec votre maître d'apprentissage. Votre assiduité et votre progression sont suivies sur la plateforme." },
  { question: 'La formation est-elle accessible aux personnes en situation de handicap ?', answer: "Oui. Notre référente handicap étudie avec vous les aménagements possibles : adaptation des supports, du rythme, des évaluations et demande d'aménagement des épreuves d'examen. Signalez votre situation dès votre candidature pour que nous puissions préparer votre accueil." },
];

const Check = ({ className = 'text-teal' }: { className?: string }) => (
  <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CtaLink = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <a
    href="#candidater"
    className={`inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all bg-yellow text-dark hover:brightness-95 px-8 py-3.5 text-base ${className}`}
  >
    {children}
  </a>
);

const epreuves = [
  { code: 'E1', nom: 'Culture générale et expression', coef: '3', forme: 'Écrit', duree: '4 h' },
  { code: 'E2', nom: 'Communication en langue vivante étrangère 1 (anglais)', coef: '3', forme: 'Oral', duree: '30 min (+ 30 min de préparation)' },
  { code: 'E3', nom: 'Culture économique, juridique et managériale', coef: '3', forme: 'Écrit', duree: '4 h' },
  { code: 'E4', nom: 'Relation client et négociation-vente', coef: '5', forme: 'Oral', duree: '40 min (+ 40 min de préparation)' },
  { code: 'E5', nom: 'Relation client à distance et digitalisation', coef: '4', forme: 'Écrit et pratique', duree: '3 h + 40 min' },
  { code: 'E6', nom: 'Relation client et animation de réseaux', coef: '3', forme: 'Oral', duree: '30 min' },
];

const remuneration = [
  { age: '16 à 17 ans', a1: '27 %', a2: '39 %' },
  { age: '18 à 20 ans', a1: '43 %', a2: '51 %' },
  { age: '21 à 25 ans', a1: '53 %', a2: '61 %' },
  { age: '26 ans et plus', a1: '100 %', a2: '100 %' },
];

export default function BTSNDRCPage() {
  return (
    <>
      {/* Hero + candidature */}
      <section className="pt-32 pb-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block px-4 py-1.5 bg-yellow text-dark text-sm font-semibold rounded-full">Alternance uniquement</span>
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full">100 % à distance</span>
                <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full">Rentrée janvier 2027</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                BTS <span className="text-teal italic">NDRC</span> en alternance
              </h1>
              <p className="mt-3 text-xl text-gray-200 font-medium">Négociation et Digitalisation de la Relation Client</p>
              <p className="hidden md:block mt-6 text-gray-300 text-lg leading-relaxed max-w-lg">
                Un diplôme national bac+2 pour devenir commercial, préparé en deux ans en contrat d&apos;apprentissage. Vous apprenez le métier en entreprise et suivez vos cours à distance, en direct avec vos formateurs, sur notre plateforme e-learning.
              </p>
              <div className="mt-8 space-y-3 hidden md:block">
                {[
                  { label: 'RNCP 38368', sublabel: 'Diplôme d\'État de niveau 5 (bac+2)' },
                  { label: 'Prérequis', sublabel: 'Baccalauréat ou titre de niveau 4' },
                  { label: 'Durée', sublabel: '1 350 heures de formation sur 2 ans' },
                  { label: 'Modalité', sublabel: 'À distance, classes virtuelles et e-learning' },
                  { label: 'Coût', sublabel: '0 € pour l\'apprenti, formation rémunérée' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="text-yellow" />
                    <p>
                      <span className="text-white font-medium">{item.label}</span>
                      <span className="text-gray-400"> – {item.sublabel}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 hidden md:flex flex-wrap gap-8">
                {[
                  { value: '2 ans', label: 'Durée' },
                  { value: '1 350 h', label: 'Formation' },
                  { value: '0 €', label: 'Pour l\'apprenti' },
                  { value: 'Janv. 2027', label: 'Rentrée' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-yellow">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div id="candidater" className="scroll-mt-28 order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <CandidatureCvForm />
            </div>
            <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2 md:hidden rounded-2xl bg-yellow/10 border border-yellow/30 p-5">
              <div className="flex items-start gap-3">
                <Check className="text-yellow" />
                <div>
                  <p className="text-white font-semibold text-lg leading-snug">
                    Admis au BTS, votre alternance est assurée.
                  </p>
                  <p className="text-gray-200 text-sm mt-2 leading-relaxed">
                    Dès que votre candidature est validée, notre équipe vous présente directement des entreprises partenaires et vous accompagne jusqu&apos;à la signature de votre contrat d&apos;apprentissage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation & objectifs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">La formation</span>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            <span className="text-teal italic">Objectifs</span> de la formation
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Le titulaire du BTS NDRC est un commercial généraliste, capable d&apos;exercer dans tous les secteurs d&apos;activité et dans tout type d&apos;entreprise. Il accompagne le client tout au long du processus commercial, quel que soit le canal de contact : en face à face, par téléphone, par mail ou sur les réseaux sociaux.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Chez Linova, vous préparez ce diplôme en alternance : vous mettez en pratique en entreprise ce que vous apprenez en cours, avec un formateur référent et un maître d&apos;apprentissage qui suivent votre progression pendant deux ans.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">À l&apos;issue de la formation, vous saurez</h3>
              <ul className="space-y-3">
                {[
                  'Cibler et prospecter de nouveaux clients',
                  'Négocier, vendre et accompagner la relation client',
                  'Organiser et animer un évènement commercial',
                  'Exploiter et partager l\'information commerciale',
                  'Gérer la relation client à distance et la e-relation',
                  'Animer une communauté et développer la vente en ligne',
                  'Animer un réseau de distributeurs, de partenaires ou de vente directe',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* À distance */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            Une formation <span className="text-teal italic">à distance</span>, mais jamais seul
          </h2>
          <p className="text-gray-600 text-center mb-14 max-w-3xl mx-auto">
            La formation se déroule entièrement à distance, selon un calendrier d&apos;alternance remis avant la signature du contrat. Les heures de formation ont lieu sur le temps de travail.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { titre: 'Classes virtuelles en direct', texte: 'Des cours en visioconférence avec vos formateurs, à horaires fixes, où l\'on échange, pose ses questions et travaille en groupe.' },
              { titre: 'Plateforme e-learning', texte: 'Supports de cours, vidéos, exercices, quiz et replays accessibles à tout moment, sur ordinateur, tablette ou téléphone.' },
              { titre: 'Suivi individuel', texte: 'Un responsable pédagogique référent, des points réguliers et un échange organisé avec votre maître d\'apprentissage.' },
              { titre: 'Assistance', texte: 'Une aide technique et pédagogique par mail et téléphone, avec une réponse sous 48 h ouvrées.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-yellow text-dark flex items-center justify-center font-bold mb-4">{i + 1}</div>
                <h3 className="font-bold text-dark mb-2">{item.titre}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.texte}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-3">Assiduité et suivi</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Présence relevée à chaque classe virtuelle</li>
                <li>Temps de connexion et travaux rendus suivis sur la plateforme</li>
                <li>Bilans réguliers transmis à l&apos;apprenti et à l&apos;entreprise</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-dark mb-3">Moyens techniques nécessaires</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Un ordinateur avec webcam et micro</li>
                <li>Une connexion internet stable</li>
                <li>Accès à la plateforme remis avant le premier cours, avec prise en main guidée</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            <span className="text-teal italic">Programme</span> de la formation
          </h2>
          <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">
            1 350 heures de formation réparties sur deux ans, la durée prévue par la réglementation pour un BTS préparé en apprentissage. Le programme suit le référentiel national du diplôme (arrêté du 19 mars 2024) : trois blocs professionnels, trois enseignements généraux et des ateliers de professionnalisation.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {[
              { titre: 'Relation client et négociation-vente', points: ['Cibler et prospecter la clientèle', 'Négocier et accompagner la relation client', 'Organiser et animer un évènement commercial', 'Exploiter et mutualiser l\'information commerciale'] },
              { titre: 'Relation client à distance et digitalisation', points: ['Maîtriser la relation omnicanale', 'Animer la relation client digitale', 'Développer la relation client en e-commerce'] },
              { titre: 'Relation client et animation de réseaux', points: ['Implanter et promouvoir l\'offre chez des distributeurs', 'Développer et animer un réseau de partenaires', 'Créer et animer un réseau de vente directe'] },
            ].map((bloc, i) => (
              <div key={i} className="bg-navy text-white rounded-2xl p-6">
                <p className="text-xs text-yellow font-semibold uppercase tracking-wide mb-2">Bloc professionnel {i + 1}</p>
                <h3 className="font-bold text-lg mb-4">{bloc.titre}</h3>
                <ul className="space-y-2">
                  {bloc.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-200">
                      <Check className="text-yellow" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { titre: 'Culture générale et expression', texte: 'Synthèse de documents, argumentation, expression écrite et orale.' },
              { titre: 'Langue vivante étrangère 1', texte: 'Anglais professionnel : compréhension, échange et négociation.' },
              { titre: 'Culture économique, juridique et managériale', texte: 'Comprendre l\'entreprise, son environnement, le droit et le management.' },
            ].map((item, i) => (
              <div key={i} className="bg-light rounded-2xl p-6">
                <p className="text-xs text-teal font-semibold uppercase tracking-wide mb-2">Enseignement général</p>
                <h3 className="font-bold text-dark mb-2">{item.titre}</h3>
                <p className="text-sm text-gray-600">{item.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Évaluation */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">Évaluation et certification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-dark mb-3">Pendant la formation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Quiz et exercices sur la plateforme</li>
                <li>Devoirs et contrôles réguliers</li>
                <li>BTS blancs écrits et oraux</li>
                <li>Bilans semestriels</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-dark mb-3">Examen final</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Examen national organisé par le rectorat</li>
                <li>Épreuves ponctuelles écrites, orales et pratiques, en fin de 2e année</li>
                <li>Épreuves passées en présentiel, dans un centre d&apos;examen</li>
                <li>Linova vous inscrit à l&apos;examen et vous y prépare</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-dark mb-3">Validation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Diplôme obtenu avec une moyenne générale de 10/20</li>
                <li>Validation possible par blocs de compétences</li>
                <li>120 crédits ECTS</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-bold text-dark mb-6">Les épreuves de l&apos;examen</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left py-3 px-4">Épreuve</th>
                  <th className="text-left py-3 px-4">Coefficient</th>
                  <th className="text-left py-3 px-4">Forme</th>
                  <th className="text-left py-3 px-4">Durée</th>
                </tr>
              </thead>
              <tbody>
                {epreuves.map((e) => (
                  <tr key={e.code} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-dark"><span className="font-semibold">{e.code}</span> – {e.nom}</td>
                    <td className="py-3 px-4 text-gray-600">{e.coef}</td>
                    <td className="py-3 px-4 text-gray-600">{e.forme}</td>
                    <td className="py-3 px-4 text-gray-600">{e.duree}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Épreuves ponctuelles définies par le règlement d&apos;examen du diplôme (arrêté du 19 mars 2024). Deux épreuves facultatives peuvent être présentées : langue vivante étrangère 2 et engagement étudiant. Les oraux E4 et E6 s&apos;appuient sur vos activités en entreprise.
          </p>
        </div>
      </section>

      {/* Méthodes & certificateur */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Méthodes mobilisées</h2>
              <ul className="space-y-3">
                {[
                  'Classes virtuelles en direct avec les formateurs',
                  'Modules e-learning, vidéos, quiz et replays sur la plateforme',
                  'Études de cas, jeux de rôle et simulations de négociation',
                  'Travaux tirés de vos missions en entreprise',
                  'Entraînements aux épreuves écrites et orales',
                  'Suivi individuel et liaison avec le maître d\'apprentissage',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-yellow" />
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Certification</h2>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-6">
                  <p className="text-sm text-gray-300 mb-1">Intitulé</p>
                  <p className="font-semibold">BTS Négociation et Digitalisation de la Relation Client</p>
                  <p className="text-sm text-gray-400 mt-1">Diplôme de niveau 5 – Fiche RNCP 38368, enregistrée jusqu&apos;au 31 décembre 2028 – Code NSF 312 (Commerce, vente)</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <p className="text-sm text-gray-300 mb-1">Certificateur</p>
                  <p className="font-semibold">Ministère de l&apos;Enseignement Supérieur et de la Recherche</p>
                  <a href="https://www.francecompetences.fr/recherche/rncp/38368/" target="_blank" rel="noopener noreferrer" className="text-sm text-yellow hover:underline mt-1 inline-block">
                    Voir la fiche sur France Compétences
                  </a>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <p className="text-sm text-gray-300 mb-1">Équivalences et passerelles</p>
                  <p className="text-sm text-gray-200">Les blocs de compétences peuvent être validés séparément. Des dispenses d&apos;épreuves d&apos;enseignement général sont possibles pour les titulaires d&apos;un autre BTS ou d&apos;un diplôme de niveau supérieur.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accès, délais, coûts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Prérequis, modalités et délais d&apos;accès</h2>
              <h3 className="font-bold text-dark mb-3">Public et prérequis</h3>
              <ul className="space-y-3 mb-8">
                {[
                  'Être titulaire du baccalauréat (général, technologique ou professionnel) ou d\'un titre de niveau 4',
                  'Avoir entre 16 et 29 ans révolus à la signature du contrat d\'apprentissage (sans limite d\'âge pour les personnes reconnues travailleur handicapé)',
                  'Disposer d\'un ordinateur et d\'une connexion internet',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <h3 className="font-bold text-dark mb-3">Les étapes de l&apos;admission</h3>
              <ol className="space-y-3 mb-8">
                {[
                  'Vous déposez votre candidature et votre CV en ligne',
                  'Notre équipe étudie votre dossier et vous répond sous 5 jours ouvrés',
                  'Entretien de motivation à distance',
                  'Signature du contrat d\'apprentissage avec l\'entreprise : votre admission est définitive',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ol>
              <h3 className="font-bold text-dark mb-3">Délais d&apos;accès</h3>
              <p className="text-gray-600 leading-relaxed">
                Rentrée de la première promotion en janvier 2027. Les candidatures sont ouvertes et étudiées au fil de l&apos;eau, jusqu&apos;à ce que la promotion soit complète. Le contrat d&apos;apprentissage peut débuter jusqu&apos;à trois mois avant le début des cours.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Coût et financement</h2>
              <div className="space-y-4">
                <div className="bg-navy rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-2">Pour l&apos;apprenti</h3>
                  <p className="text-2xl font-bold text-yellow">0 &euro;</p>
                  <p className="text-sm text-gray-300 mt-1">Aucun frais de scolarité ni d&apos;inscription. Vous êtes salarié et rémunéré selon votre âge et votre année de formation.</p>
                </div>
                <div className="bg-light rounded-xl p-6">
                  <h3 className="font-bold text-dark mb-2">Pour l&apos;entreprise</h3>
                  <p className="text-sm text-gray-600">La formation est financée par l&apos;opérateur de compétences (OPCO) de l&apos;entreprise, selon le niveau de prise en charge fixé par la branche professionnelle. Linova s&apos;occupe des démarches administratives avec l&apos;employeur.</p>
                </div>
              </div>
              <Link href="/infos-pratiques/tarifs" className="inline-flex items-center gap-2 mt-6 text-teal font-semibold hover:underline">
                En savoir plus sur le financement
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Accessibilité</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                La formation est ouverte aux personnes en situation de handicap. Notre référente handicap étudie avec vous les aménagements nécessaires : supports, rythme, évaluations et aménagement des épreuves d&apos;examen.
              </p>
              <Link href="/infos-pratiques/handicap-accessibilite" className="inline-flex items-center gap-2 text-teal font-semibold hover:underline">
                Handicap et accessibilité chez Linova
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cadre de l'apprentissage */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Votre <span className="text-teal italic">contrat d&apos;apprentissage</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">
            Vous êtes salarié de l&apos;entreprise qui vous embauche, avec les mêmes droits que les autres salariés. Voici ce que prévoit le Code du travail.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-lg font-bold text-dark mb-4">Vos droits et vos engagements</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  'Un contrat de travail écrit, signé avec l\'entreprise et déposé auprès de son opérateur de compétences (OPCO)',
                  'Le temps passé en formation compte comme du temps de travail et il est payé',
                  'Cinq semaines de congés payés par an, la protection sociale et les avantages des salariés de l\'entreprise',
                  'Un maître d\'apprentissage qui vous accompagne dans l\'entreprise',
                  'Une période de 45 jours en entreprise pendant laquelle le contrat peut être rompu librement par vous ou par l\'employeur',
                  'La carte d\'étudiant des métiers',
                  'En retour : suivre tous les cours, rendre les travaux demandés et vous présenter à l\'examen',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3"><Check /><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-lg font-bold text-dark mb-4">Rémunération minimale</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="text-left py-3 px-4">Âge</th>
                      <th className="text-left py-3 px-4">1re année</th>
                      <th className="text-left py-3 px-4">2e année</th>
                    </tr>
                  </thead>
                  <tbody>
                    {remuneration.map((r) => (
                      <tr key={r.age} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-dark font-medium">{r.age}</td>
                        <td className="py-3 px-4 text-gray-600">{r.a1}</td>
                        <td className="py-3 px-4 text-gray-600">{r.a2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                En pourcentage du SMIC (ou du salaire minimum conventionnel s&apos;il est plus élevé, à partir de 21 ans). La convention collective de l&apos;entreprise peut prévoir davantage.
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-lg font-bold text-dark mb-3">En cas de difficulté</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Parlez-en d&apos;abord à votre responsable pédagogique : Linova fait le lien avec votre entreprise. Si le désaccord avec l&apos;employeur persiste, vous pouvez saisir gratuitement le médiateur de l&apos;apprentissage. En cas de rupture du contrat, Linova vous aide à retrouver une entreprise et vous pouvez poursuivre votre formation pendant six mois.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-lg font-bold text-dark mb-3">Réclamations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Une remarque ou une réclamation sur la formation ? Écrivez à <a href="mailto:contact@linova.fr" className="text-teal hover:underline">contact@linova.fr</a>. Vous recevez un accusé de réception sous 48 h et une réponse dans les 30 jours. Le détail figure dans nos{' '}
                <Link href="/conditions-generales-de-services" className="text-teal hover:underline">conditions générales de services</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Débouchés */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            Débouchés &amp; poursuites d&apos;études
          </h2>
          <p className="text-gray-600 text-center mb-14 max-w-3xl mx-auto">
            Le BTS NDRC permet d&apos;entrer directement dans la vie active ou de continuer vers un bac+3.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-light rounded-2xl p-8">
              <h3 className="text-lg font-bold text-dark mb-4">Métiers visés</h3>
              <ul className="space-y-2 text-gray-700">
                {['Commercial terrain ou sédentaire', 'Conseiller de clientèle', 'Chargé d\'affaires', 'Téléconseiller, conseiller client à distance', 'Animateur de réseau, animateur des ventes', 'Chargé de développement commercial', 'Commercial e-commerce, community manager commercial'].map((m, i) => (
                  <li key={i} className="flex items-start gap-3"><Check /><span>{m}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-light rounded-2xl p-8">
              <h3 className="text-lg font-bold text-dark mb-4">Poursuites d&apos;études</h3>
              <ul className="space-y-2 text-gray-700">
                {['Licence professionnelle (commerce, vente, marketing, banque-assurance)', 'Bachelor commerce, marketing ou business développement', 'Licence 3 en économie-gestion', 'École de commerce par admission parallèle'].map((m, i) => (
                  <li key={i} className="flex items-start gap-3"><Check /><span>{m}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Indicateurs & contact */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Indicateurs de résultats</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Le BTS NDRC en alternance est une nouvelle formation chez Linova : la première promotion démarre en janvier 2027. Il n&apos;y a donc pas encore de résultats à présenter.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Les indicateurs seront publiés ici dès qu&apos;ils seront disponibles : taux d&apos;obtention du diplôme, taux de poursuite d&apos;études, taux d&apos;interruption en cours de formation, taux de rupture des contrats, taux d&apos;insertion professionnelle et satisfaction des apprentis.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Contact</h2>
              <div className="bg-white rounded-2xl p-6 space-y-3 text-gray-700">
                <p><span className="font-semibold text-dark">Candidatures :</span> <a href="mailto:recrutement@linova-education.fr" className="text-teal hover:underline">recrutement@linova-education.fr</a></p>
                <p><span className="font-semibold text-dark">Téléphone :</span> <a href="tel:+33189719944" className="text-teal hover:underline">01 89 71 99 44</a></p>
                <p><span className="font-semibold text-dark">Adresse :</span> Linova Éducation, 85 avenue Ledru-Rollin, 75012 Paris</p>
                <p><span className="font-semibold text-dark">Handicap :</span> notre référente handicap est joignable aux mêmes coordonnées</p>
              </div>
              <p className="text-xs text-gray-500 mt-4">Page mise à jour le {MISE_A_JOUR}.</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <CtaLink>Candidater au BTS NDRC</CtaLink>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />

      {/* CTA final */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à vous lancer dans le commerce ?</h2>
          <p className="text-gray-300 text-lg mb-10">Déposez votre CV : notre équipe vous recontacte sous 5 jours ouvrés.</p>
          <CtaLink className="text-lg">Déposer ma candidature</CtaLink>
        </div>
      </section>
    </>
  );
}
