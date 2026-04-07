import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Demarche qualite - Amelioration continue | Linova Education Paris',
  description:
    "Decouvrez la demarche qualite de Linova Education : amelioration continue, certification Qualiopi, indicateurs de performance, ecoute des etudiants et formation des equipes. Ecole BTS Biologie Medicale certifiee a Paris 12e.",
  keywords: [
    'demarche qualite formation',
    'amelioration continue ecole',
    'Linova qualite',
    'certification Qualiopi formation',
    'indicateurs qualite formation sante',
    'referentiel national qualite',
    'accessibilite formation handicap',
    'egalite des chances formation',
  ],
  alternates: { canonical: '/ecole/demarche-qualite' },
};

const faqItems = [
  {
    question: 'Pourquoi Linova s engage-t-elle dans une demarche qualite ?',
    answer:
      "Proposer une formation exigeante ne suffit pas. Le secteur de la biologie medicale evolue constamment, et nos enseignements doivent suivre ces evolutions. La demarche qualite nous permet de structurer nos efforts d'amelioration, de mesurer nos resultats et de garantir a chaque etudiant une formation toujours a la hauteur des attentes du secteur.",
  },
  {
    question: 'Quels elements sont regulierement evalues dans la demarche qualite ?',
    answer:
      "Nous evaluons regulierement nos contenus pedagogiques, nos methodes d'enseignement, nos equipements, l'adequation de nos programmes avec les besoins du marche de l'emploi, la satisfaction de nos etudiants, le taux de reussite aux examens, le taux d'insertion professionnelle et la qualite de l'accompagnement individualize.",
  },
  {
    question: 'Comment Linova prend-elle en compte les evolutions du secteur ?',
    answer:
      "Nos enseignants, etant des professionnels en activite, nous informent des evolutions techniques et reglementaires du secteur. Par ailleurs, nous entretenons des relations etroites avec nos laboratoires partenaires, participons aux evenements professionnels du secteur et consultons regulierement les instances professionnelles pour adapter nos programmes.",
  },
  {
    question: 'Comment les etudiants participent-ils a la demarche qualite ?',
    answer:
      "Les etudiants sont au coeur de notre demarche qualite. Ils remplissent des enquetes de satisfaction a chaque fin de semestre, participent a des conseils de perfectionnement, peuvent faire remonter des suggestions a tout moment via un dispositif d'ecoute permanent, et sont consultes lors de l'evolution des programmes.",
  },
  {
    question: 'Quels indicateurs concrets utilisez-vous ?',
    answer:
      "Nous suivons plusieurs indicateurs cles : le taux de reussite aux examens du BTS, le taux d'insertion professionnelle a 6 mois (actuellement superieur a 80 %), la satisfaction globale des etudiants, le taux de rupture en alternance, le taux d'assiduite et la progression des resultats au cours de la formation.",
  },
  {
    question: "Qu'entendez-vous par accessibilite dans la demarche qualite ?",
    answer:
      "L'accessibilite couvre plusieurs dimensions : l'accueil des personnes en situation de handicap avec des amenagements adaptes, l'egalite des chances sans discrimination de genre, d'origine ou de parcours, et l'accompagnement de la mobilite etudiante. Un referent handicap est disponible pour coordonner les adaptations necessaires.",
  },
  {
    question: 'La certification Qualiopi est-elle liee a la demarche qualite ?',
    answer:
      "La certification Qualiopi est a la fois le fruit et le moteur de notre demarche qualite. Elle atteste de la conformite de nos formations aux 7 criteres du Referentiel National Qualite. Le processus d'audit periodique nous oblige a maintenir et ameliorer continuellement nos pratiques.",
  },
  {
    question: 'Comment Linova forme-t-elle ses propres equipes ?',
    answer:
      "La formation continue de nos equipes est une composante essentielle de notre demarche qualite. Nos enseignants beneficient de formations pedagogiques, de mises a jour sur les evolutions techniques du secteur et participent a des conferences professionnelles. Le personnel administratif est egalement forme aux bonnes pratiques d'accueil et d'accompagnement.",
  },
];

export default function DemarcheQualite() {
  return (
    <>
      <PageHero
        title="Demarche qualite"
        highlight="& amelioration continue"
        description="Proposer une formation exigeante ne suffit pas. Nous evoluons, nous adaptons et nous ameliorons en continu pour garantir a chaque etudiant une formation a la hauteur des exigences du secteur de la biologie medicale."
      />

      {/* Introduction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                  Notre engagement
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  La qualite n&apos;est pas un objectif, c&apos;est une methode
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Chez Linova Education, la qualite n&apos;est pas un label que l&apos;on affiche. C&apos;est une demarche quotidienne, integree dans chaque aspect de notre fonctionnement. De la conception des cours a l&apos;accompagnement des etudiants, chaque processus est pense, evalue et ameliore en permanence.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Cette rigueur nous est dictee par la nature meme du secteur que nous servons : la biologie medicale. Dans un laboratoire d&apos;analyses, l&apos;erreur n&apos;est pas permise. Un resultat inexact peut avoir des consequences graves sur la sante d&apos;un patient. Nous formons nos etudiants avec la meme exigence que celle qui les attend dans leur vie professionnelle.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Notre certification Qualiopi atteste de cette demarche, mais elle n&apos;en est que le reflet. La qualite chez Linova va au-dela des exigences reglementaires : elle est ancree dans notre culture pedagogique.
                </p>
              </div>
              <div className="bg-navy rounded-3xl p-10 text-white">
                <h3 className="text-2xl font-bold mb-6">Nos indicateurs cles</h3>
                <div className="space-y-6">
                  <div className="border-b border-white/20 pb-4">
                    <div className="text-3xl font-bold text-yellow">80 %+</div>
                    <p className="text-gray-300 text-sm mt-1">d&apos;insertion professionnelle a 6 mois</p>
                  </div>
                  <div className="border-b border-white/20 pb-4">
                    <div className="text-3xl font-bold text-yellow">Qualiopi</div>
                    <p className="text-gray-300 text-sm mt-1">certification qualite delivree par l&apos;Etat</p>
                  </div>
                  <div className="border-b border-white/20 pb-4">
                    <div className="text-3xl font-bold text-yellow">7</div>
                    <p className="text-gray-300 text-sm mt-1">criteres du Referentiel National Qualite evalues</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow">100 %</div>
                    <p className="text-gray-300 text-sm mt-1">des enseignants formes aux evolutions du secteur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principes de la demarche */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Les quatre axes de notre demarche qualite
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Notre demarche d&apos;amelioration continue repose sur un cycle vertueux : observer, former, evaluer, ameliorer. Ce processus garantit que nos formations restent toujours en phase avec les besoins du secteur.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Observer',
                description:
                  "Suivre les evolutions du secteur de la biologie medicale, les nouvelles techniques d'analyse, les changements reglementaires et les attentes des recruteurs. Cette veille permanente nous permet d'anticiper les besoins et d'adapter nos enseignements en consequence.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                title: 'Former',
                description:
                  "Former regulierement notre equipe pedagogique pour maintenir un niveau d'excellence. Nos enseignants beneficient de formations continues, participent a des conferences professionnelles et mettent a jour leurs competences en permanence.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                title: 'Evaluer',
                description:
                  "Evaluer periodiquement nos contenus, outils et methodes pour garantir leur pertinence. Les enquetes de satisfaction, les resultats aux examens et les taux d'insertion sont autant d'indicateurs qui guident nos decisions.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Ameliorer',
                description:
                  "Mettre en oeuvre les actions correctives et les ameliorations identifiees. Chaque constat donne lieu a un plan d'action concret, avec des objectifs mesurables et des echeances precises. Le cycle recommence ensuite.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecoute et satisfaction */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy text-sm font-semibold rounded-full mb-6">
                Ecoute et satisfaction
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Les etudiants au coeur de la demarche
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chez Linova, les etudiants ne sont pas de simples beneficiaires de la formation : ils en sont les acteurs. Leur avis, leurs retours et leurs suggestions sont des leviers essentiels de notre amelioration continue.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nous avons mis en place plusieurs dispositifs d&apos;ecoute pour recueillir les retours de nos etudiants de maniere structuree et continue. Ces retours sont analyses, discutes en equipe pedagogique et donnent lieu a des actions concretes.
              </p>
              <div className="space-y-4">
                {[
                  'Enquetes de satisfaction semestrielles anonymes',
                  'Conseils de perfectionnement avec representation etudiante',
                  "Dispositif d'ecoute permanent (boite a idees, referent pedagogique)",
                  "Entretiens individuels de suivi tout au long de la formation",
                  "Bilans de stage systematiques avec analyse des retours",
                  "Suivi des anciens diplomes pour mesurer l'insertion professionnelle",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-light rounded-2xl p-8">
                <h3 className="text-xl font-bold text-dark mb-4">Processus de reclamation</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  Tout etudiant peut formuler une reclamation aupres de l&apos;equipe pedagogique. Chaque reclamation est enregistree, analysee et traitee dans un delai maximal de 15 jours ouvrables. L&apos;etudiant est informe des suites donnees a sa demande.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Ce processus garantit la transparence et la reactivite de notre etablissement face aux difficultes rencontrees par les etudiants.
                </p>
              </div>
              <div className="bg-light rounded-2xl p-8">
                <h3 className="text-xl font-bold text-dark mb-4">Mediation</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  En cas de litige persistant, un mediateur independant peut etre saisi. Cette procedure garantit un traitement equitable et impartial de toute situation conflictuelle. Les coordonnees du mediateur sont communiquees a chaque etudiant en debut de formation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Accessibilite, egalite, mobilite
            </h2>
            <p className="text-gray-600 leading-relaxed">
              La demarche qualite de Linova integre des engagements forts en matiere d&apos;accessibilite, d&apos;egalite des chances et de mobilite etudiante. Ces principes sont au coeur de notre projet pedagogique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Accessibilite',
                description:
                  "Accueil des personnes en situation de handicap avec des amenagements adaptes : locaux accessibles, supports pedagogiques alternatifs, temps supplementaire pour les examens et referent handicap dedie.",
              },
              {
                title: 'Egalite',
                description:
                  "Egalite des chances sans discrimination de genre, d'origine, d'age ou de parcours. Chaque candidat est evalue sur sa motivation et son projet professionnel, independamment de tout autre critere.",
              },
              {
                title: 'Mobilite',
                description:
                  "Accompagnement de la mobilite etudiante pour enrichir les parcours. Nous facilitons l'acces aux stages dans differentes structures (hopital, laboratoire prive, recherche) pour diversifier les experiences.",
              },
              {
                title: 'Indicateurs',
                description:
                  "Des indicateurs concrets pour evaluer et ameliorer nos actions en continu : taux de reussite, taux d'insertion, satisfaction etudiante, taux de rupture en alternance, assiduite et progression.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center mb-4">
                  <span className="font-bold">{i + 1}</span>
                </div>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conformite reglementaire */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Conformite reglementaire
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Un cadre reglementaire strictement respecte
              </h2>
              <p className="text-gray-600 leading-relaxed">
                En tant qu&apos;organisme de formation certifie Qualiopi, Linova respecte l&apos;ensemble des obligations reglementaires liees a la formation professionnelle. Cette conformite est un gage de serieux et de fiabilite pour les etudiants, les financeurs et les employeurs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Referentiel National Qualite',
                  description:
                    "Conformite aux 7 criteres et 32 indicateurs du RNQ, verifiee lors des audits periodiques de certification Qualiopi.",
                },
                {
                  title: 'Code du travail',
                  description:
                    "Respect des dispositions du Livre III de la sixieme partie du Code du travail relatives a la formation professionnelle.",
                },
                {
                  title: 'RGPD',
                  description:
                    "Protection des donnees personnelles des etudiants conformement au Reglement General sur la Protection des Donnees.",
                },
                {
                  title: 'Obligations declaratives',
                  description:
                    "Declaration d'activite aupres de la DREETS, bilan pedagogique et financier annuel, publication des indicateurs de resultats.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-light rounded-xl p-6">
                  <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Rejoignez une ecole engagee dans la qualite
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            Linova Education s&apos;engage a offrir a chaque etudiant une formation de qualite, un accompagnement personnalise et les meilleures conditions de reussite. Candidatez des maintenant pour integrer notre prochaine promotion.
          </p>
          <CandidaterButton variant="yellow">Candidater maintenant</CandidaterButton>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
