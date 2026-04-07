import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import FAQ from '@/components/FAQ';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Handicap et accessibilite - Accueil inclusif | Linova Education Paris',
  description:
    "Linova Education s'engage pour l'accueil des etudiants en situation de handicap. Referent handicap dedie, amenagements physiques, pedagogiques et numeriques. Campus accessible PMR. Accompagnement personnalise.",
  keywords: [
    'handicap formation BTS biologie',
    'accessibilite ecole sante Paris',
    'amenagement handicap formation',
    'referent handicap Linova',
    'PMR ecole Paris 12',
    'formation inclusive biologie medicale',
    'accessibilite campus Paris',
  ],
  alternates: { canonical: '/infos-pratiques/handicap-accessibilite' },
};

const faqItems = [
  {
    question: "Linova est-elle accessible aux personnes en fauteuil roulant ?",
    answer: "Oui, l'ensemble du campus est accessible aux personnes a mobilite reduite. Nos locaux disposent de rampes d'acces, d'ascenseurs pour tous les niveaux, de sanitaires adaptes, d'espaces de circulation larges et de places de stationnement PMR a proximite. Les laboratoires et salles de cours sont egalement accessibles.",
  },
  {
    question: "Qui est le referent handicap et quel est son role ?",
    answer: "Le referent handicap est un membre de l'equipe Linova specialement forme pour accompagner les etudiants en situation de handicap. Son role est d'evaluer vos besoins specifiques, de coordonner la mise en place des amenagements necessaires (physiques, pedagogiques, organisationnels), de faire le lien avec les equipes enseignantes, et de vous orienter vers les organismes et dispositifs d'aide adaptes. Contactez-le a accessibilite@linova.fr.",
  },
  {
    question: "Quels types d'amenagements pedagogiques sont possibles ?",
    answer: "Les amenagements sont definis au cas par cas selon vos besoins : tiers-temps pour les examens, supports de cours en formats alternatifs (numeriques, agrandis, audio), technologies d'assistance (logiciels de lecture d'ecran, amplificateurs), adaptation des conditions de passage des epreuves, soutien pedagogique renforce, et amenagement des horaires si necessaire.",
  },
  {
    question: "Peut-on beneficier d'un tiers-temps pour les examens du BTS ?",
    answer: "Oui, les etudiants disposant d'une reconnaissance de handicap (MDPH, medecin agree) peuvent beneficier d'un tiers-temps supplementaire pour les epreuves du BTS, conformement a la reglementation nationale. Notre referent handicap vous accompagne dans les demarches administratives necessaires aupres de l'academie et du rectorat.",
  },
  {
    question: "Faut-il signaler sa situation de handicap lors de la candidature ?",
    answer: "Nous vous encourageons a nous informer de votre situation le plus tot possible, idealement des la candidature ou l'entretien de motivation. Cela nous permet de preparer en amont les amenagements necessaires et de vous accueillir dans les meilleures conditions. Cette information reste strictement confidentielle et n'a aucun impact negatif sur votre candidature.",
  },
  {
    question: "Existe-t-il des aides financieres specifiques pour les etudiants handicapes ?",
    answer: "Oui, plusieurs dispositifs existent : l'AGEFIPH propose des aides pour les apprentis en situation de handicap, la MDPH peut attribuer des aides compensatoires, les OPCO peuvent mobiliser des financements supplementaires pour l'alternance, et l'employeur peut beneficier d'une aide pouvant atteindre 6 000 euros pour le recrutement d'un apprenti handicape. Notre referent handicap vous oriente vers les dispositifs adaptes.",
  },
  {
    question: "L'alternance est-elle possible pour les etudiants en situation de handicap ?",
    answer: "Absolument. L'alternance est tout a fait compatible avec une situation de handicap. Des amenagements de poste peuvent etre mis en place dans l'entreprise d'accueil avec l'aide de l'AGEFIPH ou du FIPHFP. Le contrat d'apprentissage pour les personnes en situation de handicap peut d'ailleurs etre prolonge jusqu'a 4 ans (au lieu de 2) et il n'y a pas de limite d'age pour conclure un contrat d'apprentissage.",
  },
  {
    question: "Comment Linova forme-t-elle ses enseignants a l'accueil du handicap ?",
    answer: "L'equipe pedagogique de Linova est sensibilisee a l'accueil des etudiants en situation de handicap. Des sessions de formation et d'information sont regulierement organisees pour les enseignants sur les differents types de handicap, les amenagements possibles et les bonnes pratiques pedagogiques inclusives. Le referent handicap joue un role de coordination pour garantir la coherence des amenagements.",
  },
];

export default function HandicapAccessibilite() {
  return (
    <>
      <PageHero
        title="Handicap"
        highlight="& accessibilite"
        description="Une politique inclusive, active et engagee pour accompagner chaque etudiant, quelle que soit sa situation. Referent handicap dedie et amenagements personnalises."
      />

      {/* Engagement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Engagement inclusif
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Notre engagement pour l&apos;accessibilite
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Linova Education place l&apos;inclusion au coeur de sa mission. Nous croyons que chaque etudiant, quelle que soit sa situation de handicap, doit pouvoir acceder a une formation de qualite dans les meilleures conditions possibles. Notre demarche inclusive s&apos;inscrit dans le cadre de la loi du 11 fevrier 2005 pour l&apos;egalite des droits et des chances.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Membre du groupe Diploma Education, certifie Qualiopi, Linova repond aux exigences du Referentiel National Qualite en matiere d&apos;accessibilite et d&apos;individualisation des parcours de formation. Cela signifie que nous adaptons nos methodes, nos supports et notre organisation pour repondre aux besoins specifiques de chaque apprenant.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Notre referent handicap est votre interlocuteur privilegie des votre premier contact avec Linova. Il vous accompagne tout au long de votre parcours, de la candidature a l&apos;obtention du diplome, en passant par l&apos;insertion professionnelle.
              </p>
            </div>
            <div className="bg-light rounded-3xl p-8">
              <h3 className="text-xl font-bold text-dark mb-6">Les piliers de notre politique inclusive</h3>
              <div className="space-y-5">
                {[
                  { number: '1', title: 'Accueil et ecoute', description: 'Chaque etudiant est recu individuellement pour evaluer ses besoins specifiques.' },
                  { number: '2', title: 'Amenagements personnalises', description: 'Les adaptations sont definies au cas par cas et mises en place rapidement.' },
                  { number: '3', title: 'Suivi continu', description: 'Le referent handicap assure un suivi regulier tout au long de la formation.' },
                  { number: '4', title: 'Coordination', description: 'Liaison avec les enseignants, les entreprises et les organismes specialises.' },
                  { number: '5', title: 'Insertion professionnelle', description: 'Accompagnement specifique pour la recherche de stage ou d\'entreprise d\'alternance.' },
                ].map((pilier, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {pilier.number}
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-sm">{pilier.title}</h4>
                      <p className="text-gray-600 text-sm">{pilier.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acces physique et amenagements pedagogiques */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Nos amenagements
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-teal text-white flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Acces physique</h3>
              <p className="text-gray-600 text-sm mb-5">
                Le campus est entierement accessible aux personnes a mobilite reduite, conformement aux normes ERP en vigueur.
              </p>
              <ul className="space-y-3">
                {[
                  'Rampes d\'acces aux entrees du batiment',
                  'Ascenseurs desservant tous les niveaux',
                  'Sanitaires adaptes PMR a chaque etage',
                  'Signaletique claire et contrastee',
                  'Espaces de circulation larges (minimum 1,40 m)',
                  'Places de stationnement PMR a proximite',
                  'Eclairage adapte dans toutes les salles',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Amenagements pedagogiques</h3>
              <p className="text-gray-600 text-sm mb-5">
                Les adaptations pedagogiques sont definies individuellement avec le referent handicap pour repondre a vos besoins specifiques.
              </p>
              <ul className="space-y-3">
                {[
                  'Tiers-temps pour les examens et evaluations',
                  'Supports de cours en formats alternatifs',
                  'Documents numeriques accessibles',
                  'Supports agrandis ou en audio',
                  'Adaptation des travaux pratiques',
                  'Amenagement des horaires si necessaire',
                  'Soutien pedagogique individualise renforce',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-yellow text-dark flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Technologies d&apos;assistance</h3>
              <p className="text-gray-600 text-sm mb-5">
                Des outils numeriques et technologies d&apos;assistance sont mis a disposition pour faciliter l&apos;apprentissage.
              </p>
              <ul className="space-y-3">
                {[
                  'Logiciels de lecture d\'ecran',
                  'Amplificateurs de son et boucles magnetiques',
                  'Logiciels de transcription',
                  'Claviers et souris adaptes',
                  'Applications de prise de notes automatique',
                  'Plateforme numerique accessible WCAG',
                  'Ecrans de taille adaptable',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Processus d'accompagnement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Le parcours d&apos;accompagnement
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            De votre premier contact a l&apos;obtention de votre diplome, notre referent handicap vous accompagne a chaque etape cle de votre parcours.
          </p>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Premier contact et evaluation des besoins',
                description: "Des votre candidature, vous pouvez signaler votre situation de handicap (en toute confidentialite). Le referent handicap vous recoit pour un entretien individuel afin d'evaluer vos besoins specifiques et identifier les amenagements necessaires.",
              },
              {
                step: '2',
                title: 'Mise en place des amenagements',
                description: "Avant votre rentree, les amenagements physiques, pedagogiques et technologiques sont mis en place. Les enseignants sont informes (avec votre accord) des adaptations a appliquer. Un plan d'accompagnement personnalise est etabli.",
              },
              {
                step: '3',
                title: 'Suivi regulier tout au long de la formation',
                description: "Des points reguliers sont organises avec le referent handicap pour evaluer l'efficacite des amenagements et les ajuster si necessaire. Le referent fait le lien entre vous, les enseignants et l'equipe pedagogique.",
              },
              {
                step: '4',
                title: 'Preparation aux examens et amenagements specifiques',
                description: "Le referent coordonne les demarches aupres du rectorat et de l'academie pour l'obtention des amenagements d'examen (tiers-temps, secretaire, materiel adapte). Tout est prepare en amont pour que vous passiez vos epreuves dans les meilleures conditions.",
              },
              {
                step: '5',
                title: 'Accompagnement a l\'insertion professionnelle',
                description: "Pour la recherche de stage ou d'entreprise d'alternance, le referent handicap vous accompagne dans les demarches specifiques : contact avec l'AGEFIPH, amenagement de poste, sensibilisation de l'employeur, aides au recrutement.",
              },
            ].map((etape, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  {etape.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-lg font-bold text-dark mb-2">{etape.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{etape.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aides et dispositifs */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Aides et dispositifs specifiques
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            De nombreux dispositifs existent pour soutenir les etudiants en situation de handicap dans leur parcours de formation et d&apos;insertion professionnelle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AGEFIPH',
                description: "L'Association de Gestion du Fonds pour l'Insertion Professionnelle des Personnes Handicapees finance des aides a la formation, a l'amenagement de poste et au maintien dans l'emploi pour les travailleurs handicapes du secteur prive.",
              },
              {
                title: 'MDPH',
                description: "La Maison Departementale des Personnes Handicapees evalue vos besoins et vous attribue les droits et prestations adaptes : reconnaissance de la qualite de travailleur handicape (RQTH), allocation, carte mobilite inclusion, etc.",
              },
              {
                title: 'Aide employeur (6 000 euros)',
                description: "L'Etat verse une aide pouvant atteindre 6 000 euros a l'employeur qui recrute un apprenti en situation de handicap. Cela facilite votre acces a l'alternance et motive les entreprises a vous accueillir.",
              },
              {
                title: 'Contrat d\'apprentissage amenage',
                description: "Pour les personnes en situation de handicap, le contrat d'apprentissage peut etre prolonge jusqu'a 4 ans (au lieu de 2) et il n'y a pas de limite d'age pour y acceder. Le rythme peut egalement etre adapte.",
              },
              {
                title: 'Amenagement d\'examen',
                description: "Le rectorat accorde des amenagements pour les epreuves du BTS sur presentation de documents medicaux : tiers-temps, secretaire d'examen, agrandissement des sujets, utilisation de materiel adapte, salle individuelle.",
              },
              {
                title: 'Cap emploi',
                description: "Le reseau Cap emploi accompagne les personnes handicapees dans leur recherche d'emploi et de stage. Notre referent handicap travaille en lien avec Cap emploi pour faciliter votre insertion professionnelle.",
              },
            ].map((aide, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-yellow mb-3">{aide.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{aide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types de handicap accompagnes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Types de handicap accompagnes
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Linova accueille et accompagne les etudiants presentant tout type de handicap. Voici les principales situations pour lesquelles des amenagements specifiques peuvent etre mis en place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Handicap moteur', description: 'Accessibilite des locaux, mobilier adapte, amenagement des postes de travail en laboratoire.' },
              { title: 'Handicap visuel', description: 'Supports agrandis, logiciels de lecture, documents numeriques accessibles, signaletique en braille.' },
              { title: 'Handicap auditif', description: 'Boucle magnetique, transcription, interpretation LSF si necessaire, supports visuels renforces.' },
              { title: 'Troubles DYS', description: 'Dyslexie, dysorthographie, dyscalculie : supports adaptes, temps supplementaire, outils numeriques.' },
              { title: 'Troubles psychiques', description: 'Amenagement des horaires, suivi renforce, accompagnement psychologique, flexibilite organisationnelle.' },
              { title: 'Maladies chroniques', description: 'Amenagement des horaires, absences justifiees, adaptation du rythme, suivi medical coordonne.' },
            ].map((type, i) => (
              <div key={i} className="bg-light rounded-xl p-6">
                <h3 className="font-bold text-dark mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact referent */}
      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-sm">
            <h2 className="text-3xl font-bold text-dark mb-6">Contactez notre referent handicap</h2>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
              Notre referent handicap est votre interlocuteur privilegie pour toute question liee a l&apos;accessibilite et aux amenagements. N&apos;hesitez pas a le contacter des votre premiere reflexion sur votre projet de formation. Toutes les informations partagees restent strictement confidentielles.
            </p>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Que vous ayez une question sur les amenagements possibles, les aides financieres, ou que vous souhaitiez simplement echanger sur votre situation avant de candidater, nous sommes a votre ecoute.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:accessibilite@linova.fr"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal text-white font-semibold rounded-full hover:brightness-95 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                accessibilite@linova.fr
              </a>
              <a
                href="tel:+33189719944"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                01 89 71 99 44
              </a>
            </div>
            <div className="mt-8">
              <CandidaterButton variant="outline">Candidater chez Linova</CandidaterButton>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} title="Questions frequentes sur le handicap et l'accessibilite" />

      <CTASection />
    </>
  );
}
