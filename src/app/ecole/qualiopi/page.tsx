import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Certification Qualiopi - Label qualite Etat | Linova Education Paris',
  description:
    "Linova Education est certifiee Qualiopi, le label d'Etat attestant la qualite de nos formations en biologie medicale. Decouvrez les 7 criteres du Referentiel National Qualite, les garanties pour les etudiants et les avantages de cette certification. Ecole BTS a Paris 12e.",
  keywords: [
    'certification Qualiopi',
    'label qualite formation',
    'Referentiel National Qualite',
    'Qualiopi formation sante',
    'criteres Qualiopi',
    'organisme formation certifie',
    'financement formation Qualiopi',
    'audit qualite formation',
  ],
  alternates: { canonical: '/ecole/qualiopi' },
};

const faqItems = [
  {
    question: "Qu'est-ce que la certification Qualiopi exactement ?",
    answer:
      "Qualiopi est une certification qualite delivree par l'Etat francais depuis le 1er janvier 2022. Elle atteste de la conformite d'un organisme de formation aux criteres du Referentiel National Qualite (RNQ). Cette certification est obligatoire pour tout organisme souhaitant beneficier de financements publics ou mutualises (CPF, OPCO, Pole emploi, etc.).",
  },
  {
    question: 'Que garantit la certification Qualiopi pour les etudiants ?',
    answer:
      "Pour les etudiants, Qualiopi garantit plusieurs elements essentiels : la clarte des informations sur la formation (objectifs, duree, tarifs, debouches), la qualite de l'accompagnement pedagagique, l'adaptation de la formation aux besoins du marche, la competence des formateurs, la prise en compte des publics specifiques (handicap, reconversion) et la mesure des resultats (insertion, reussite).",
  },
  {
    question: 'Comment se deroule l audit Qualiopi ?',
    answer:
      "L'audit Qualiopi est realise par un organisme certificateur accredite par le COFRAC (Comite francais d'accreditation). L'auditeur verifie la conformite de l'organisme aux 7 criteres et 32 indicateurs du Referentiel National Qualite. L'audit initial dure generalement 1 a 2 jours, suivi d'un audit de surveillance a 18 mois et d'un audit de renouvellement a 3 ans.",
  },
  {
    question: 'Quels sont les 7 criteres du Referentiel National Qualite ?',
    answer:
      "Les 7 criteres sont : 1. Information du public sur les prestations, 2. Identification des objectifs et adaptation des prestations, 3. Adaptation aux publics beneficiaires, 4. Adequation des moyens pedagogiques et techniques, 5. Qualification et competences des personnels, 6. Inscription dans l'environnement professionnel, 7. Recueil et prise en compte des appreciations.",
  },
  {
    question: 'Qualiopi permet-elle d acceder a des financements ?',
    answer:
      "Oui, c'est l'un des avantages majeurs de la certification Qualiopi. Elle est obligatoire pour qu'un organisme de formation puisse beneficier de financements publics ou mutualises. Concretement, cela signifie que les etudiants de Linova peuvent faire financer leur formation par un OPCO (en alternance), par le CPF, par Pole emploi ou par d'autres dispositifs de financement.",
  },
  {
    question: 'Comment Linova maintient-elle sa certification Qualiopi ?',
    answer:
      "Linova maintient sa certification par une demarche d'amelioration continue : mise a jour reguliere des programmes, formation des equipes, enquetes de satisfaction, suivi des indicateurs de resultats et preparation rigoureuse des audits de surveillance et de renouvellement. La certification n'est pas un acquis definitif : elle exige un travail permanent.",
  },
  {
    question: "Quelle difference entre Qualiopi et les autres labels qualite ?",
    answer:
      "Qualiopi est la seule certification qualite exigee par la loi pour les organismes de formation. Contrairement aux labels prives (ISO 9001, NF Service, etc.), Qualiopi est specifiquement concue pour les organismes de formation et evaluee selon des criteres adaptes a ce secteur. Elle est delivree par des organismes accredites par le COFRAC, ce qui garantit l'impartialite et la rigueur de l'evaluation.",
  },
  {
    question: 'Que se passe-t-il si un organisme perd sa certification Qualiopi ?',
    answer:
      "Un organisme qui perd sa certification Qualiopi ne peut plus beneficier de financements publics ou mutualises. Les etudiants en cours de formation continuent leur parcours, mais les nouvelles inscriptions financees par des fonds publics sont suspendues. C'est pourquoi Linova accorde une importance capitale au maintien de sa certification.",
  },
];

export default function Qualiopi() {
  return (
    <>
      <PageHero
        title="Linova certifiee"
        highlight="Qualiopi"
        description="Un label d'Etat attestant la conformite de nos formations aux criteres du Referentiel National Qualite. Cette certification est votre garantie d'une formation rigoureuse, structuree et reconnue."
      />

      {/* Qu'est-ce que Qualiopi */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                  Comprendre Qualiopi
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                  Qu&apos;est-ce que la certification Qualiopi ?
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  La certification Qualiopi est le label qualite de reference pour les organismes de formation en France. Instauree par la loi du 5 septembre 2018 pour la liberte de choisir son avenir professionnel, elle est obligatoire depuis le 1er janvier 2022 pour tout organisme souhaitant acceder aux financements publics.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Delivree par un organisme certificateur accredite par le COFRAC (Comite francais d&apos;accreditation), la certification Qualiopi atteste de la conformite d&apos;un organisme de formation aux 7 criteres et 32 indicateurs du Referentiel National Qualite (RNQ).
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Pour Linova Education, cette certification n&apos;est pas une simple formalite administrative. C&apos;est l&apos;aboutissement concret de notre demarche qualite et la preuve que notre formation repond aux standards les plus exigeants du secteur.
                </p>
              </div>
              <div className="bg-light rounded-3xl p-10">
                <h3 className="text-xl font-bold text-dark mb-6">Ce que Qualiopi signifie pour vous</h3>
                <div className="space-y-5">
                  {[
                    {
                      label: 'Formation reconnue',
                      detail: 'Une formation evaluee et validee par un organisme independant accredite par l Etat.',
                    },
                    {
                      label: 'Financements accessibles',
                      detail: 'Eligibilite aux financements OPCO (alternance), CPF, Pole emploi et autres dispositifs publics.',
                    },
                    {
                      label: 'Qualite garantie',
                      detail: 'Des standards pedagogiques eleves, verifies lors d audits reguliers par des auditeurs independants.',
                    },
                    {
                      label: 'Transparence totale',
                      detail: 'Des informations claires sur les objectifs, contenus, tarifs et resultats de la formation.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-4">
                      <p className="font-semibold text-dark text-sm">{item.label}</p>
                      <p className="text-gray-600 text-sm mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les 7 criteres */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Les 7 criteres du Referentiel National Qualite
            </h2>
            <p className="text-gray-600 leading-relaxed">
              La certification Qualiopi evalue notre organisme sur l&apos;ensemble de ces criteres de qualite. Chaque critere fait l&apos;objet d&apos;une analyse approfondie lors des audits, avec des preuves concretes a l&apos;appui.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Information du public',
                description:
                  "Clarte et accessibilite des informations communiquees sur les prestations proposees : objectifs, duree, tarifs, prerequis, modalites d'evaluation et debouches.",
                indicators: '3 indicateurs',
              },
              {
                title: "Identification des objectifs",
                description:
                  "Definition precise des objectifs de la formation, adaptation des prestations aux publics accueillis et conception des contenus pedagogiques en adequation avec les besoins identifies.",
                indicators: '4 indicateurs',
              },
              {
                title: 'Adaptation aux publics',
                description:
                  "Prise en compte des besoins specifiques de chaque apprenant : prerequis, parcours anterieurs, situations de handicap, contraintes professionnelles et personnelles.",
                indicators: '5 indicateurs',
              },
              {
                title: 'Moyens pedagogiques',
                description:
                  "Adequation des moyens pedagogiques, techniques et d'encadrement aux objectifs de la formation. Equipements, supports, outils numeriques et ressources documentaires adaptes.",
                indicators: '6 indicateurs',
              },
              {
                title: 'Qualification des personnels',
                description:
                  "Competences et qualifications des formateurs, developpement professionnel continu, veille pedagogique et sectorielle pour maintenir un haut niveau d'expertise.",
                indicators: '6 indicateurs',
              },
              {
                title: 'Ancrage professionnel',
                description:
                  "Inscription de l'organisme dans son environnement socio-economique : partenariats professionnels, veille sectorielle, contribution a l'insertion professionnelle des diplomes.",
                indicators: '4 indicateurs',
              },
              {
                title: 'Recueil des appreciations',
                description:
                  "Collecte et prise en compte des retours des beneficiaires, des financeurs et des partenaires. Traitement des reclamations et mise en oeuvre d'actions d'amelioration.",
                indicators: '4 indicateurs',
              },
            ].map((critere, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-dark">{critere.title}</span>
                    <span className="block text-xs text-teal">{critere.indicators}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{critere.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus d'audit */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy text-sm font-semibold rounded-full mb-6">
              Le processus
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Comment se deroule la certification ?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              La certification Qualiopi s&apos;inscrit dans un cycle de 3 ans, avec des audits reguliers qui garantissent le maintien de la qualite dans le temps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Audit initial',
                description: "Un auditeur accredite par le COFRAC evalue la conformite de l'organisme aux 32 indicateurs du RNQ. L'audit dure 1 a 2 jours sur site.",
              },
              {
                step: '02',
                title: 'Certification',
                description: "Si l'audit est conforme, la certification Qualiopi est delivree pour une duree de 3 ans. Le logo Qualiopi peut etre utilise sur les supports de communication.",
              },
              {
                step: '03',
                title: 'Audit de surveillance',
                description: "A 18 mois, un audit de surveillance verifie que les pratiques sont maintenues et que les eventuelles non-conformites ont ete corrigees.",
              },
              {
                step: '04',
                title: 'Renouvellement',
                description: "A 3 ans, un audit complet de renouvellement est realise. Il evalue l'ensemble des criteres et la dynamique d'amelioration continue de l'organisme.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-light rounded-2xl p-6 h-full">
                  <div className="text-4xl font-bold text-teal/20 mb-4">{item.step}</div>
                  <h3 className="font-bold text-dark mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Les garanties de la certification Qualiopi
            </h2>
            <p className="text-gray-300 leading-relaxed">
              La certification Qualiopi offre des garanties concretes aux etudiants, aux financeurs et aux employeurs. Voici ce que cette certification implique pour Linova Education.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Rigueur pedagogique',
                description: "Des programmes structures, des objectifs clairs et des methodes d'enseignement validees par des experts.",
              },
              {
                title: 'Coherence des parcours',
                description: "Un parcours de formation logique et progressif, du diagnostic initial a l'evaluation finale, en passant par l'accompagnement.",
              },
              {
                title: 'Transparence communicationnelle',
                description: "Des informations precises et accessibles sur tous les aspects de la formation : contenu, duree, tarifs, modalites et resultats.",
              },
              {
                title: 'Suivi etudiant de qualite',
                description: "Un accompagnement personnalise tout au long de la formation, avec des points d'etape reguliers et un referent pedagogique dedie.",
              },
              {
                title: 'Conformite reglementaire',
                description: "Le respect de l'ensemble des obligations legales et reglementaires liees a la formation professionnelle en France.",
              },
              {
                title: 'Amelioration continue',
                description: "Un engagement dans une demarche d'amelioration permanente, alimentee par les retours des etudiants et les audits periodiques.",
              },
            ].map((garantie, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-yellow text-dark flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-sm">{i + 1}</span>
                  </div>
                  <span className="text-white font-bold">{garantie.title}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{garantie.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact sur les financements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Financements
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Qualiopi ouvre l&apos;acces aux financements
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                La certification Qualiopi est la condition sine qua non pour qu&apos;un organisme de formation puisse beneficier de financements publics ou mutualises. Pour les etudiants de Linova, cela signifie des possibilites de financement diversifiees.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                En alternance, les frais de scolarite sont integralement pris en charge par l&apos;OPCO de l&apos;entreprise d&apos;accueil. En formation initiale, d&apos;autres dispositifs de financement peuvent etre mobilises selon la situation de l&apos;etudiant.
              </p>
              <CandidaterButton variant="teal">En savoir plus sur les financements</CandidaterButton>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'OPCO (alternance)',
                  description: "En alternance, les frais de formation sont pris en charge par l'Operateur de Competences (OPCO) de l'entreprise d'accueil. L'etudiant ne paie rien.",
                  highlight: 'Prise en charge a 100 %',
                },
                {
                  title: 'CPF (Compte Personnel de Formation)',
                  description: "Le Compte Personnel de Formation peut etre utilise pour financer tout ou partie de la formation, sous reserve d'eligibilite.",
                  highlight: 'Variable selon les droits acquis',
                },
                {
                  title: 'Pole emploi / France Travail',
                  description: "Les demandeurs d'emploi peuvent beneficier d'aides au financement de la formation via Pole emploi (AIF, ARE, etc.).",
                  highlight: 'Sous conditions d eligibilite',
                },
                {
                  title: 'Financement personnel',
                  description: "En formation initiale, des facilites de paiement sont proposees (echelonnement, pret etudiant LCL). Contactez le service admissions pour un echange personnalise.",
                  highlight: 'Facilites de paiement',
                },
              ].map((item, i) => (
                <div key={i} className="bg-light rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-dark">{item.title}</h3>
                    <span className="text-xs font-semibold text-teal bg-teal/10 px-3 py-1 rounded-full">{item.highlight}</span>
                  </div>
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
            Une formation certifiee, un avenir assure
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            La certification Qualiopi est votre garantie d&apos;une formation de qualite, reconnue par l&apos;Etat et les professionnels du secteur. Rejoignez Linova Education et preparez votre avenir dans la biologie medicale.
          </p>
          <CandidaterButton variant="yellow">Candidater maintenant</CandidaterButton>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
