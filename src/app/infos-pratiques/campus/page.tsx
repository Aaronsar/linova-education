import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';
import FAQ from '@/components/FAQ';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Campus Paris 12e - Laboratoires et equipements | Linova Education',
  description:
    "Decouvrez le campus Linova Education au 85 Avenue Ledru-Rollin, Paris 12e. Laboratoires equipes, salles modernes, espaces collaboratifs. Metro Ledru-Rollin (ligne 8). Visite sur rendez-vous.",
  keywords: [
    'campus Linova Paris 12',
    'ecole biologie medicale Paris',
    'laboratoire formation sante Paris',
    'avenue Ledru-Rollin ecole',
    'metro Ledru-Rollin formation',
    'visite campus BTS biologie',
    'equipements laboratoire formation',
  ],
  alternates: { canonical: '/infos-pratiques/campus' },
};

const faqItems = [
  {
    question: "Ou se situe exactement le campus Linova ?",
    answer: "Le campus Linova Education se situe au 85 Avenue Ledru-Rollin, dans le 12e arrondissement de Paris. Il est a 2 minutes a pied de la station de metro Ledru-Rollin (ligne 8) et a proximite de la Gare de Lyon. Le quartier est agreable, vivant et bien desservi par les transports en commun.",
  },
  {
    question: "Comment venir au campus en transports en commun ?",
    answer: "Le campus est facilement accessible en metro via la ligne 8 (station Ledru-Rollin, a 2 minutes a pied). Vous pouvez aussi emprunter la ligne 1 (station Gare de Lyon, a 10 minutes a pied), la ligne 5 (station Quai de la Rapee, a 8 minutes), ou plusieurs lignes de bus (dont les lignes 29, 56, 61, 76, 86 et 91). La Gare de Lyon est a 10 minutes a pied pour les etudiants venant de banlieue.",
  },
  {
    question: "Le campus dispose-t-il de laboratoires ?",
    answer: "Oui, le campus est equipe de laboratoires professionnels permettant la realisation de travaux pratiques en conditions reelles. Vous y trouverez des equipements de biochimie, microbiologie, hematologie et immuno-hematologie, similaires a ceux utilises dans les laboratoires d'analyses medicales.",
  },
  {
    question: "Peut-on visiter le campus avant de s'inscrire ?",
    answer: "Bien sur ! Nous encourageons les futurs etudiants a visiter nos locaux avant de candidater. Contactez-nous par telephone au 01 89 71 99 44 ou par email a contact@linova-education.fr pour organiser une visite personnalisee. Nous organisons egalement des journees portes ouvertes regulieres.",
  },
  {
    question: "Y a-t-il des espaces de restauration a proximite ?",
    answer: "Le campus est situe dans un quartier tres anime du 12e arrondissement, avec de nombreux restaurants, boulangeries, supermarches et cafes a proximite immediate. Le marche d'Aligre, l'un des plus celebres de Paris, se trouve a quelques minutes a pied. Vous trouverez facilement des options de restauration pour tous les budgets.",
  },
  {
    question: "Le campus est-il accessible aux personnes en situation de handicap ?",
    answer: "Oui, le campus est entierement accessible aux personnes a mobilite reduite : rampes d'acces, ascenseurs, sanitaires adaptes, espaces de circulation larges et signaletique accessible. Un referent handicap est disponible pour organiser tout amenagement necessaire. Contactez-nous a accessibilite@linova.fr.",
  },
  {
    question: "Quels sont les horaires d'ouverture du campus ?",
    answer: "Le campus est ouvert du lundi au vendredi de 9h a 13h et de 14h a 18h pour l'accueil administratif. Les salles de cours et laboratoires sont accessibles aux horaires des enseignements. Les etudiants peuvent egalement utiliser les espaces collaboratifs pendant les heures d'ouverture.",
  },
  {
    question: "Le campus dispose-t-il du Wi-Fi ?",
    answer: "Oui, l'ensemble du campus beneficie d'une connexion Wi-Fi haut debit gratuite accessible a tous les etudiants et enseignants. Chaque salle de cours et laboratoire est equipe de prises electriques pour recharger vos appareils. Une plateforme numerique est egalement mise a disposition pour acceder aux supports de cours, QCM et replays.",
  },
];

export default function Campus() {
  return (
    <>
      <PageHero
        title="Notre campus"
        highlight="un espace pense pour apprendre et pratiquer"
        description="Au coeur de Paris 12e, decouvrez un environnement moderne et professionnel qui facilite vos apprentissages et vos mises en pratique en laboratoire."
      />

      {/* Localisation et infos pratiques */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Map */}
            <div className="bg-gray rounded-3xl aspect-[4/3] flex items-center justify-center overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.8!2d2.3768!3d48.8487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUwJzU1LjUiTiAywrAyMic0My44IkU!5e0!3m2!1sfr!2sfr!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '1.5rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Linova Education - Campus Paris 12e - 85 Avenue Ledru-Rollin"
              />
            </div>

            {/* Contact info */}
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Paris 12e arrondissement
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-8">
                Informations pratiques
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-1">Adresse</h3>
                    <p className="text-gray-600">85, Avenue Ledru-Rollin<br />75012 Paris</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-1">Telephone</h3>
                    <a href="tel:+33189719944" className="text-teal hover:underline">+33 1 89 71 99 44</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-1">Email</h3>
                    <a href="mailto:contact@linova-education.fr" className="text-teal hover:underline">contact@linova-education.fr</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-1">Horaires d&apos;accueil</h3>
                    <p className="text-gray-600">Lundi - Vendredi : 9h-13h / 14h-18h</p>
                    <p className="text-sm text-gray-500 mt-1">Ferme le week-end et les jours feries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark mb-1">Metro</h3>
                    <p className="text-gray-600">Ledru-Rollin (ligne 8) - 2 min a pied</p>
                    <p className="text-sm text-gray-500 mt-1">Gare de Lyon (lignes 1, 14, RER A/D) - 10 min a pied</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acces et transports */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Comment venir au campus
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Situe au coeur du 12e arrondissement de Paris, le campus Linova est parfaitement desservi par les transports en commun et facilement accessible depuis toute l&apos;Ile-de-France.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Metro',
                description: 'Ligne 8 - Station Ledru-Rollin a 2 minutes a pied. Ligne 1 - Station Gare de Lyon a 10 minutes a pied.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: 'RER et trains',
                description: 'Gare de Lyon (RER A, RER D, TGV) a 10 minutes a pied. Ideal pour les etudiants de banlieue.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                ),
              },
              {
                title: 'Bus',
                description: 'Lignes 29, 56, 61, 76, 86 et 91 a proximite. Plusieurs arrets dans un rayon de 200 metres.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                ),
              },
              {
                title: 'Velo et trottinette',
                description: 'Stations Velib\' a proximite immediate. Stationnement velo securise disponible devant le campus.',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((transport, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-4">
                  {transport.icon}
                </div>
                <h3 className="font-bold text-dark mb-2">{transport.title}</h3>
                <p className="text-sm text-gray-600">{transport.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-6">
            Nos equipements
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Le campus Linova dispose d&apos;equipements modernes et professionnels pour offrir aux etudiants les meilleures conditions d&apos;apprentissage en biologie medicale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Laboratoires de biologie medicale',
                description: "Nos laboratoires sont equipes de materiel professionnel identique a celui utilise dans les laboratoires d'analyses medicales : automates de biochimie, microscopes, centrifugeuses, etuves, hottes de securite microbiologique, spectrophotometres, et materiel de prelevement. Les etudiants pratiquent dans des conditions reelles du metier.",
                features: ['Automates de biochimie et hematologie', 'Microscopes optiques professionnels', 'Hottes de securite microbiologique', 'Materiel de prelevement sanguin'],
              },
              {
                title: 'Salles de cours modernes',
                description: "Les salles de cours sont equipees de videoprojecteurs, tableaux interactifs et d'une connexion Wi-Fi haut debit. Leur configuration permet differents formats d'enseignement : cours magistraux, travaux diriges en petits groupes, travaux pratiques et presentations orales.",
                features: ['Videoprojecteurs et tableaux interactifs', 'Wi-Fi haut debit gratuit', 'Prises electriques dans chaque salle', 'Configuration modulable'],
              },
              {
                title: 'Plateforme numerique',
                description: "Les etudiants ont acces a une plateforme pedagogique numerique complete comprenant les supports de cours, des QCM d'entrainement, des replays de certains cours, des ressources complementaires et des outils de communication avec l'equipe pedagogique.",
                features: ['Supports de cours telechargeable', 'QCM d\'entrainement en ligne', 'Replays de cours et conferences', 'Messagerie avec l\'equipe pedagogique'],
              },
              {
                title: 'Espaces collaboratifs',
                description: "Des zones de travail en groupe sont mises a disposition pour les etudiants. Ces espaces favorisent les echanges, le travail collaboratif et la preparation aux examens. Un espace detente est egalement disponible pour les pauses.",
                features: ['Zones de travail en groupe', 'Espace detente et convivialite', 'Acces libre pendant les horaires d\'ouverture', 'Ambiance propice a la concentration'],
              },
            ].map((equip, i) => (
              <div key={i} className="bg-light rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-4">
                  <span className="font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{equip.title}</h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">{equip.description}</p>
                <ul className="space-y-2">
                  {equip.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Le quartier */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Le quartier : un cadre de vie agreable
          </h2>
          <p className="text-gray-300 text-center mb-16 max-w-3xl mx-auto">
            Le 12e arrondissement de Paris est un quartier vivant et apprecie des etudiants. Entre commerces de proximite, espaces verts et lieux culturels, vous beneficiez d&apos;un cadre ideal pour vos etudes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Restauration et commerces',
                items: [
                  'Marche d\'Aligre a 5 minutes',
                  'Nombreux restaurants et cafes',
                  'Supermarches et commerces de proximite',
                  'Boulangeries et sandwicheries pour le dejeuner',
                ],
              },
              {
                title: 'Espaces verts et detente',
                items: [
                  'Promenade Plantee (Coulee verte) toute proche',
                  'Parc de Bercy a 15 minutes',
                  'Bois de Vincennes accessible en metro',
                  'Bords de Seine pour les pauses',
                ],
              },
              {
                title: 'Services et vie pratique',
                items: [
                  'Bibliotheques municipales a proximite',
                  'Pharmacies et centres medicaux',
                  'Salles de sport et piscines',
                  'Cinemas et lieux culturels',
                ],
              },
            ].map((category, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-yellow mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-200">
                      <svg className="w-4 h-4 text-yellow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visiter le campus */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Visitez notre campus
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4 max-w-3xl mx-auto">
            Rien ne vaut une visite pour decouvrir nos locaux, rencontrer notre equipe et vous projeter dans votre future formation. Nous vous accueillons sur rendez-vous pour une visite personnalisee de nos laboratoires, salles de cours et espaces de travail.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto">
            Nous organisons egalement des journees portes ouvertes a dates regulieres. C&apos;est l&apos;occasion de rencontrer nos enseignants, d&apos;echanger avec des etudiants actuels et de poser toutes vos questions sur la formation, l&apos;admission et la vie etudiante.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CandidaterButton>Candidater maintenant</CandidaterButton>
            <a
              href="tel:+33189719944"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-dark text-dark font-semibold rounded-full hover:bg-dark hover:text-white transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Planifier une visite
            </a>
          </div>
        </div>
      </section>

      {/* Accessibilite du campus */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Un campus accessible a tous</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Linova Education s&apos;engage pour l&apos;accessibilite de son campus aux personnes en situation de handicap. Nos locaux sont conformes aux normes d&apos;accessibilite en vigueur et nous mettons tout en oeuvre pour garantir un accueil inclusif.
              </p>
              <ul className="space-y-3">
                {[
                  'Rampes d\'acces et ascenseurs pour tous les niveaux',
                  'Sanitaires adaptes aux personnes a mobilite reduite',
                  'Signaletique claire et accessible',
                  'Espaces de circulation larges et degages',
                  'Places de stationnement PMR a proximite',
                  'Referent handicap disponible sur rendez-vous',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <a href="/infos-pratiques/handicap-accessibilite" className="inline-flex items-center gap-2 text-teal font-semibold hover:underline text-sm">
                  En savoir plus sur notre politique d&apos;accessibilite
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dark mb-6">Chiffres cles du campus</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '25', label: 'etudiants max par promotion' },
                  { value: '100%', label: 'accessibilite PMR' },
                  { value: 'Ligne 8', label: 'metro Ledru-Rollin' },
                  { value: '9h-18h', label: 'horaires d\'accueil' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-teal">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} title="Questions frequentes sur le campus" />

      <CTASection />
    </>
  );
}
