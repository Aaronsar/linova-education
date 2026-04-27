import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import FAQ from '@/components/FAQ';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Admission BTS Biologie Medicale - Dossier et Entretien | Linova Paris',
  description:
    "Candidatez au BTS Biologie Medicale chez Linova Education a Paris 12e. Admission sur dossier et entretien de motivation. Reponse sous 48h. Bac general, technologique (ST2S, STL) ou professionnel acceptes. Inscription hors Parcoursup possible.",
  keywords: [
    'admission BTS Biologie Medicale',
    'inscription BTS biologie Paris',
    'candidature alternance laboratoire',
    'entretien motivation BTS sante',
    'dossier admission Linova',
    'BTS biologie hors Parcoursup',
    'ecole sante Paris 12',
  ],
  alternates: { canonical: '/infos-pratiques/admission' },
};

const faqItems = [
  {
    question: "Quels sont les prerequis pour integrer le BTS Biologie Medicale ?",
    answer: "Vous devez etre titulaire d'un baccalaureat general (avec un interet pour les sciences), technologique (ST2S ou STL avec specialisation biochimie ou biotechnologie) ou professionnel (laboratoire, industries pharmaceutiques, experimentation animale). Les etudiants en reconversion professionnelle ou issus d'autres filieres peuvent aussi candidater : chaque dossier est etudie individuellement en fonction de la coherence du projet professionnel.",
  },
  {
    question: "Comment se deroule l'entretien de motivation ?",
    answer: "L'entretien dure environ 20 a 30 minutes et se deroule en presentiel dans nos locaux au 85 Avenue Ledru-Rollin, Paris 12e. Il est mene par un membre de l'equipe pedagogique. Nous evaluons votre motivation, votre connaissance du secteur de la biologie medicale, la coherence de votre projet professionnel et votre capacite a vous investir dans une formation exigeante. Il ne s'agit pas d'un examen de connaissances, mais d'un echange humain et constructif.",
  },
  {
    question: "Peut-on s'inscrire hors Parcoursup ?",
    answer: "Oui, tout a fait. Linova Education propose une inscription directe hors Parcoursup. Vous pouvez deposer votre candidature a tout moment via notre formulaire en ligne ou en nous contactant directement par telephone au 01 89 71 99 44. Cela concerne aussi bien la formation initiale que l'alternance.",
  },
  {
    question: "Quel est le delai de reponse apres l'entretien ?",
    answer: "Nous nous engageons a vous communiquer une reponse d'admission dans un delai maximum de 48 heures apres votre entretien de motivation. Si votre candidature est acceptee, vous recevrez un dossier d'inscription complet avec toutes les demarches a suivre.",
  },
  {
    question: "Faut-il avoir un employeur avant de candidater en alternance ?",
    answer: "Non, vous pouvez candidater en alternance meme si vous n'avez pas encore trouve d'entreprise d'accueil. Linova vous accompagne activement dans la recherche d'une entreprise : ateliers CV, preparation aux entretiens, diffusion de votre profil aupres de notre reseau de laboratoires et structures partenaires. Votre admission definitive en alternance est confirmee a la signature du contrat d'apprentissage.",
  },
  {
    question: "Peut-on candidater en cours d'annee ?",
    answer: "La rentree principale a lieu en septembre. Cependant, des admissions decalees peuvent etre envisagees en fonction des places disponibles et de votre situation. Contactez-nous pour etudier votre cas particulier. Nous vous conseillerons la meilleure option selon votre profil.",
  },
  {
    question: "Y a-t-il des frais pour candidater ?",
    answer: "Le depot de candidature et l'entretien de motivation sont entierement gratuits et sans engagement. Les frais d'inscription ne sont dus qu'en cas d'acceptation et de confirmation de votre inscription. En alternance, les frais de formation sont integralement pris en charge par l'OPCO de l'entreprise d'accueil.",
  },
  {
    question: "Quels documents fournir pour le dossier de candidature ?",
    answer: "Vous devrez fournir : une copie de votre piece d'identite, vos releves de notes des deux dernieres annees, votre diplome du baccalaureat (ou attestation de reussite), un CV a jour, une lettre de motivation exposant votre projet professionnel, et eventuellement tout document attestant d'experiences en lien avec le secteur de la sante ou de la biologie (stages, benevolat, emplois).",
  },
];

export default function Admission() {
  return (
    <>
      <PageHero
        title="Rejoignez"
        highlight="Linova Education"
        description="Un processus d'admission simple et humain, base sur la motivation et la coherence de votre projet professionnel. Reponse garantie sous 48 heures."
      />

      {/* Introduction / Presentation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Admission 2025-2026
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Un processus d&apos;admission centre sur votre projet
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Chez Linova Education, nous croyons que la motivation et la coherence du projet professionnel sont les meilleurs indicateurs de reussite. C&apos;est pourquoi notre processus d&apos;admission repose sur un examen approfondi de votre dossier et un entretien personnalise, plutot que sur un concours ou des epreuves ecrites.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Notre objectif est de vous connaitre, de comprendre votre parcours et vos aspirations, et de verifier que le BTS Biologie Medicale correspond a votre projet de carriere dans les metiers de la sante. Chaque candidature est traitee avec attention et bienveillance.
              </p>
              <div className="flex flex-wrap gap-4">
                <CandidaterButton>Deposer ma candidature</CandidaterButton>
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
            </div>
            <div className="bg-light rounded-3xl p-8">
              <h3 className="text-xl font-bold text-dark mb-6">En resume</h3>
              <div className="space-y-5">
                {[
                  { label: 'Selection', value: 'Dossier + entretien de motivation' },
                  { label: 'Reponse', value: 'Sous 48 heures' },
                  { label: 'Inscriptions', value: 'Parcoursup ou candidature directe' },
                  { label: 'Rentree', value: 'Septembre 2025' },
                  { label: 'Places', value: '25 places maximum par promotion' },
                  { label: 'Cout candidature', value: 'Gratuit et sans engagement' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="font-semibold text-dark text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profils acceptes */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Profils acceptes
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Le BTS Biologie Medicale est accessible a differents profils de bacheliers. Nous valorisons avant tout la motivation, le serieux et l&apos;interet pour le secteur de la sante.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bac general',
                description: "Avec un interet marque pour les sciences de la vie, la biologie et la chimie. Les specialites SVT, physique-chimie ou mathematiques sont un atout. Les etudiants issus d'un parcours general apportent une solide culture scientifique.",
                details: ['Specialites scientifiques recommandees', 'Culture generale solide', 'Capacites d\'analyse et de synthese'],
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                ),
              },
              {
                title: 'Bac technologique',
                description: "Les bacs ST2S (Sciences et Technologies de la Sante et du Social) et STL (Sciences et Technologies de Laboratoire) avec specialisation biochimie-biologie ou biotechnologie sont particulierement adaptes a cette formation.",
                details: ['ST2S : profil sante et social', 'STL biochimie-biologie', 'STL biotechnologies'],
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
              },
              {
                title: 'Bac professionnel',
                description: "Les titulaires d'un bac professionnel en lien avec les sciences de la sante ou du laboratoire sont les bienvenus. Une forte motivation et un projet professionnel coherent sont indispensables.",
                details: ['Laboratoire controle qualite', 'Industries pharmaceutiques', 'Bio-industries de transformation'],
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((profil, i) => (
              <div key={i} className="bg-white rounded-2xl p-8">
                <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6">
                  {profil.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-4 text-center">{profil.title}</h3>
                <p className="text-gray-600 text-sm mb-6">{profil.description}</p>
                <ul className="space-y-2">
                  {profil.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white rounded-2xl p-8 border-l-4 border-teal">
            <h3 className="text-lg font-bold text-dark mb-3">Reconversion professionnelle et profils atypiques</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Vous etes en reconversion professionnelle, en reprise d&apos;etudes ou issu d&apos;une autre filiere ? Votre candidature est la bienvenue. Nous etudions chaque dossier au cas par cas et valorisons les experiences personnelles et professionnelles qui temoignent d&apos;une relle motivation pour le secteur de la biologie medicale. N&apos;hesitez pas a nous contacter pour un echange prealable.
            </p>
          </div>
        </div>
      </section>

      {/* Etapes d'admission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Les 4 etapes de votre admission
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Notre processus d&apos;admission est concu pour etre rapide, transparent et humain. De la candidature a la reponse, tout se deroule en quelques jours.
          </p>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Depot du formulaire en ligne',
                description: "Remplissez votre dossier de candidature directement sur notre site via le bouton \"Candidater\" ou par telephone. Vous pouvez egalement candidater via Parcoursup. Le dossier comprend vos informations personnelles, votre parcours scolaire, votre CV et votre lettre de motivation.",
                duration: '10 minutes',
              },
              {
                step: '2',
                title: 'Contact telephonique par notre equipe',
                description: "Dans les 24 a 48 heures suivant la reception de votre dossier, un membre de notre equipe pedagogique vous contacte par telephone pour echanger sur votre candidature et fixer un rendez-vous d'entretien. C'est l'occasion de poser vos premieres questions.",
                duration: '24-48h apres depot',
              },
              {
                step: '3',
                title: 'Entretien de motivation et etude du dossier',
                description: "L'entretien se deroule en presentiel au 85 Avenue Ledru-Rollin, Paris 12e (metro Ledru-Rollin, ligne 8). Durant 20 a 30 minutes, nous echangeons sur votre parcours, votre projet professionnel, votre connaissance du secteur de la biologie medicale et votre motivation. Il ne s'agit pas d'un concours mais d'un dialogue constructif.",
                duration: '20-30 minutes',
              },
              {
                step: '4',
                title: 'Reponse d\'admission sous 48h',
                description: "Vous recevez votre reponse d'admission par email et par telephone dans les 48 heures suivant l'entretien. En cas d'acceptation, vous recevrez votre dossier d'inscription complet. En alternance, votre admission definitive est confirmee a la signature du contrat d'apprentissage avec votre entreprise d'accueil.",
                duration: 'Sous 48 heures',
              },
            ].map((etape, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-xl font-bold">
                  {etape.step}
                </div>
                <div className="pt-1 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-dark">{etape.title}</h3>
                    <span className="px-3 py-0.5 bg-teal/10 text-teal text-xs font-semibold rounded-full">{etape.duration}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{etape.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <CandidaterButton variant="teal">Demarrer ma candidature</CandidaterButton>
          </div>
        </div>
      </section>

      {/* Choix initial vs alternance */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Formation initiale ou alternance ?
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Le BTS Biologie Medicale est accessible en formation initiale ou en alternance. Chaque parcours a ses specificites. Nous vous aidons a choisir celui qui correspond le mieux a votre situation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border-2 border-transparent hover:border-teal transition-colors shadow-sm">
              <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-4">Formation initiale</span>
              <h3 className="text-2xl font-bold text-dark mb-4">Parcours classique</h3>
              <p className="text-gray-600 text-sm mb-6">
                Ideal pour les etudiants souhaitant se concentrer pleinement sur leurs etudes avec des periodes de stage en milieu professionnel.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '12 semaines de stage obligatoire',
                  'Tarif : 6 000 euros par an',
                  'Echelonnement des paiements possible',
                  'Cours en presentiel du lundi au vendredi',
                  'Accompagnement a la recherche de stage',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <CandidaterButton variant="teal" className="px-6 py-2.5 text-sm w-full">
                Candidater en initial
              </CandidaterButton>
            </div>

            <div className="bg-navy rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-yellow text-dark text-xs font-bold rounded-full">
                Recommande
              </div>
              <span className="inline-block px-3 py-1 bg-white/10 text-yellow text-xs font-semibold rounded-full mb-4">Alternance</span>
              <h3 className="text-2xl font-bold mb-4">Parcours en entreprise</h3>
              <p className="text-gray-300 text-sm mb-6">
                Formation 100% financee par l&apos;OPCO, avec un salaire mensuel et une experience professionnelle des la premiere annee.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '2 jours ecole / 3 jours entreprise',
                  'Formation gratuite (financee par l\'OPCO)',
                  'Salaire : 795 a 1 766 euros brut / mois',
                  'Statut salarie avec contrat d\'apprentissage',
                  'Accompagnement a la recherche d\'entreprise',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <CandidaterButton variant="yellow" className="px-6 py-2.5 text-sm w-full">
                Candidater en alternance
              </CandidaterButton>
            </div>
          </div>
        </div>
      </section>

      {/* Accompagnement */}
      <section className="py-20" id="alternance">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Notre accompagnement a chaque etape</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Linova Education ne se contente pas de vous former : nous vous accompagnons avant, pendant et apres votre formation. Du depot de candidature a l&apos;obtention de votre diplome, notre equipe est a vos cotes pour maximiser vos chances de reussite.
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: 'Recherche d\'entreprise pour les alternants',
                    description: 'Ateliers CV et lettre de motivation, coaching entretien, diffusion de votre profil aupres de nos partenaires.',
                  },
                  {
                    title: 'Suivi pedagogique individualise',
                    description: 'Un responsable pedagogique dedie suit votre progression tout au long de la formation.',
                  },
                  {
                    title: 'Classes a taille humaine',
                    description: 'Maximum 25 etudiants par promotion pour garantir un encadrement de qualite.',
                  },
                  {
                    title: 'Accompagnement administratif',
                    description: 'Aide aux demarches d\'inscription, de financement et de contractualisation.',
                  },
                  {
                    title: 'Prise en compte du handicap',
                    description: 'Referent handicap dedie et amenagements personnalises selon vos besoins.',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-light rounded-xl p-5">
                    <h3 className="font-bold text-dark mb-1 text-sm">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-navy rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">Pourquoi choisir Linova ?</h3>
              <div className="space-y-6">
                {[
                  { value: '80%', label: 'Taux d\'insertion professionnelle a 6 mois' },
                  { value: '48h', label: 'Delai de reponse apres entretien' },
                  { value: '25', label: 'Etudiants maximum par promotion' },
                  { value: '10+', label: 'Annees d\'experience du groupe Diploma Education' },
                  { value: '0 euros', label: 'Cout de la formation en alternance' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-yellow min-w-[80px]">{stat.value}</div>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <CandidaterButton variant="yellow">Rejoindre Linova</CandidaterButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents et calendrier */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-8">Documents a fournir</h2>
              <p className="text-gray-600 mb-6">
                Pour constituer votre dossier de candidature, merci de preparer les documents suivants :
              </p>
              <ul className="space-y-4">
                {[
                  'Copie de votre piece d\'identite (carte nationale d\'identite ou passeport)',
                  'Releves de notes des deux dernieres annees scolaires',
                  'Diplome du baccalaureat ou attestation de reussite',
                  'Curriculum vitae (CV) a jour',
                  'Lettre de motivation detaillant votre projet professionnel',
                  'Photo d\'identite recente',
                  'Justificatif de domicile de moins de 3 mois',
                  'Attestation de securite sociale ou de mutuelle',
                ].map((doc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark mb-8">Calendrier d&apos;admission</h2>
              <div className="space-y-4">
                {[
                  { period: 'Janvier - Juin', event: 'Ouverture des candidatures et entretiens', active: true },
                  { period: 'Mars - Juillet', event: 'Campagne Parcoursup (voeux, confirmation, resultats)', active: true },
                  { period: 'Avril - Aout', event: 'Recherche d\'entreprise pour les alternants', active: true },
                  { period: 'Juin - Aout', event: 'Finalisation des inscriptions et demarches administratives', active: false },
                  { period: 'Septembre', event: 'Rentree scolaire et debut des cours', active: false },
                ].map((item, i) => (
                  <div key={i} className={`rounded-xl p-5 ${item.active ? 'bg-teal/10 border-l-4 border-teal' : 'bg-white'}`}>
                    <span className={`text-sm font-semibold ${item.active ? 'text-teal' : 'text-gray-500'}`}>{item.period}</span>
                    <p className="font-medium text-dark mt-1">{item.event}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Les candidatures hors Parcoursup sont acceptees tout au long de l&apos;annee, dans la limite des places disponibles. Contactez-nous pour connaitre les disponibilites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Parcoursup */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Candidater via Parcoursup ou en direct
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            Linova Education est reference sur Parcoursup. Vous pouvez nous ajouter dans vos voeux lors de la phase de formulation. Mais vous pouvez egalement candidater directement aupres de notre etablissement, sans passer par la plateforme. Dans les deux cas, le processus d&apos;admission est identique : dossier + entretien de motivation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-light rounded-2xl p-8 text-left">
              <h3 className="text-lg font-bold text-dark mb-4">Via Parcoursup</h3>
              <ul className="space-y-3">
                {[
                  'Formulez votre voeu pendant la phase de voeux',
                  'Completez votre dossier avant la date limite',
                  'Recevez nos reponses dans le calendrier officiel',
                  'Confirmez votre choix si accepte',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-teal/5 rounded-2xl p-8 text-left border-2 border-teal">
              <h3 className="text-lg font-bold text-dark mb-4">Candidature directe</h3>
              <ul className="space-y-3">
                {[
                  'Deposez votre candidature a tout moment',
                  'Entretien dans les jours qui suivent',
                  'Reponse sous 48 heures',
                  'Pas de contrainte de calendrier Parcoursup',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <CandidaterButton>Deposer ma candidature maintenant</CandidaterButton>
        </div>
      </section>

      <FAQ items={faqItems} title="Questions frequentes sur l'admission" />

      <CTASection
        title="Pret a candidater ?"
        description="Contactez-nous pour demarrer votre processus d'admission. Notre equipe repond a toutes vos questions."
        primaryText="Nous contacter"
        primaryHref="tel:+33189719944"
      />
    </>
  );
}
