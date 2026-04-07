import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Notre expertise - Formation sante et biologie medicale | Linova Education Paris',
  description:
    "Decouvrez l'expertise de Linova Education dans la formation en biologie medicale. Plus de 10 ans d'experience au sein du groupe Diploma Education, enseignants professionnels, pedagogie de terrain et certification Qualiopi. Ecole specialisee a Paris 12e.",
  keywords: [
    'expertise formation sante',
    'Linova Education expertise',
    'groupe Diploma Education',
    'formation biologie medicale',
    'enseignants professionnels sante',
    'pedagogie biologie medicale',
    'ecole specialisee sante Paris',
    'BTS biologie medicale expertise',
  ],
  alternates: { canonical: '/ecole/notre-expertise' },
};

const faqItems = [
  {
    question: "Quel est l'avantage de Linova par rapport a une ecole generaliste ?",
    answer:
      "Linova est 100 % dediee aux metiers de la sante. Cela signifie des enseignants exclusivement issus du secteur medical, des equipements de laboratoire professionnels, un reseau de partenaires cible dans la biologie medicale et une connaissance approfondie des attentes des recruteurs. Une ecole generaliste ne peut pas offrir ce niveau de specialisation.",
  },
  {
    question: 'Quel est le lien entre Linova et le groupe Diploma Education ?',
    answer:
      "Linova fait partie du groupe Diploma Education qui comprend Diploma Sante (preparations aux etudes de medecine, pharmacie et maieutique) et Diploma Education (formations professionnalisantes). Cette appartenance garantit un savoir-faire pedagogique eprouve, des ressources mutualisees et un reseau professionnel etendu dans le secteur de la sante.",
  },
  {
    question: 'Qui sont les enseignants de Linova ?',
    answer:
      "Nos enseignants sont des professionnels en activite dans le secteur de la biologie medicale : biologistes medicaux exercant en laboratoire, techniciens de laboratoire experimentes, cadres de sante, chercheurs et praticiens hospitaliers. Leur double casquette enseignant-praticien garantit un enseignement actualise et directement applicable.",
  },
  {
    question: 'Quelles sont les valeurs fondatrices de Linova ?',
    answer:
      "Trois valeurs guident notre action : l'exigence (un enseignement rigoureux et des standards eleves), la clarte (une pedagogie concrete et structuree) et l'accompagnement (un suivi personnalise adapte a chaque parcours). Ces valeurs se traduisent dans chaque aspect de notre formation.",
  },
  {
    question: 'Comment Linova adapte-t-elle sa formation aux evolutions du secteur ?',
    answer:
      "Nos enseignants, etant des professionnels en activite, integrent naturellement les evolutions techniques et reglementaires dans leurs cours. Par ailleurs, nous mettons regulierement a jour nos programmes en concertation avec nos laboratoires partenaires et les instances professionnelles du secteur.",
  },
  {
    question: "Linova propose-t-elle d'autres formations que le BTS Biologie Medicale ?",
    answer:
      "Actuellement, Linova se concentre exclusivement sur le BTS Biologie Medicale. Cette specialisation nous permet de consacrer toutes nos ressources a cette formation, garantissant un niveau de qualite optimal. Le BTS est disponible en formation initiale et en alternance.",
  },
  {
    question: 'Quel est le taux de reussite et d insertion de Linova ?',
    answer:
      "Linova affiche un taux d'insertion professionnelle superieur a 80 % a six mois apres l'obtention du diplome. Ce resultat est le fruit de notre pedagogie de terrain, de notre reseau de partenaires et de l'accompagnement individualise que nous proposons a chaque etudiant.",
  },
  {
    question: 'Quels equipements sont disponibles pour les etudiants ?',
    answer:
      "Les etudiants ont acces a des laboratoires equipes de materiel professionnel : automates d'analyses biochimiques, microscopes optiques, materiel de microbiologie, postes de securite microbiologique et equipements d'hematologie. Ces outils sont identiques a ceux utilises dans les laboratoires d'analyses medicales.",
  },
];

export default function NotreExpertise() {
  return (
    <>
      <PageHero
        title="Une formation nee d'un"
        highlight="savoir-faire reconnu dans les metiers de la sante"
        description="Linova n'est pas une ecole generaliste. Entierement dediee aux formations medicales, elle s'appuie sur plus de dix ans d'experience au sein du groupe Diploma Education pour former les techniciens de laboratoire de demain."
      />

      {/* Introduction narrative */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
              Notre histoire
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-8">
              D&apos;ou vient notre expertise en formation sante ?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Linova Education est nee d&apos;un constat simple : le secteur de la biologie medicale manque cruellement de techniciens qualifies. Les laboratoires d&apos;analyses medicales, les hopitaux et les centres de recherche peinent a recruter des professionnels formes aux standards actuels du metier. Face a cette realite, le groupe Diploma Education a decide de creer une ecole entierement dediee a cette formation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fort de plus de dix ans d&apos;experience dans la formation en sante, le groupe Diploma Education a developpe une expertise pedagogique unique. De la preparation aux etudes de medecine aux formations professionnalisantes, le groupe a accompagne des milliers d&apos;etudiants vers les metiers de la sante. Linova est l&apos;aboutissement de cette experience : une ecole specialisee, focalisee sur un seul diplome, le BTS Biologie Medicale.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Cette specialisation n&apos;est pas un hasard. Elle est le resultat d&apos;une reflexion approfondie sur les besoins du secteur et les attentes des etudiants. En se concentrant sur une seule formation, Linova peut offrir un niveau de qualite, d&apos;encadrement et de specialisation impossible a atteindre dans une ecole generaliste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Groupe Diploma */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Le groupe
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Partie integrante du groupe Diploma Education
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Le groupe Diploma Education est reconnu dans le secteur de la formation en sante avec deux poles complementaires. Cette structure permet une mutualisation des ressources, un partage d&apos;expertise et un reseau professionnel elargi au benefice de chaque etudiant.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                L&apos;appartenance au groupe offre a Linova une assise financiere solide, un acces a des methodes pedagogiques eprouvees et une credibilite reconnue par les professionnels du secteur. Les recruteurs connaissent le groupe Diploma et font confiance a la qualite de ses formations.
              </p>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-dark mb-2">Diploma Sante</h3>
                  <p className="text-gray-600 text-sm">
                    Preparations aux etudes de medecine, pharmacie et maieutique. Un accompagnement complet pour reussir les concours et les selections les plus exigeants du domaine medical.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-dark mb-2">Diploma Education</h3>
                  <p className="text-gray-600 text-sm">
                    Formations professionnalisantes : BTS, diplomes europeens et certifications. Des parcours concus pour une insertion rapide et durable dans le monde professionnel.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-teal">
                  <h3 className="font-bold text-teal mb-2">Linova Education</h3>
                  <p className="text-gray-600 text-sm">
                    Formation BTS Biologie Medicale en initial et alternance. Une ecole 100 % dediee aux metiers du laboratoire medical, au coeur de Paris (12e arrondissement).
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-navy rounded-3xl p-10 text-white">
                <h3 className="text-2xl font-bold mb-8">L&apos;expertise du groupe en chiffres</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-yellow">10+</div>
                    <p className="text-gray-300 text-sm mt-1">ans d&apos;experience</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow">3</div>
                    <p className="text-gray-300 text-sm mt-1">entites complementaires</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow">80 %</div>
                    <p className="text-gray-300 text-sm mt-1">d&apos;insertion a 6 mois</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow">50+</div>
                    <p className="text-gray-300 text-sm mt-1">partenaires professionnels</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="font-bold text-dark mb-4">Certification Qualiopi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Linova est certifiee Qualiopi, le label d&apos;Etat qui atteste de la conformite de nos formations aux criteres du Referentiel National Qualite. Cette certification garantit la rigueur de notre pedagogie et permet a nos etudiants de beneficier de financements publics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piliers pedagogiques */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Trois piliers pedagogiques
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Notre approche pedagogique repose sur trois piliers fondamentaux qui guident l&apos;ensemble de nos actions, de la conception des programmes a l&apos;accompagnement quotidien des etudiants.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Exigence',
                description:
                  "Des enseignants investis, issus du terrain, qui transmettent un savoir-faire rigoureux et actualise. L'exigence chez Linova, c'est refuser la mediocrite et viser l'excellence a chaque etape de la formation. Nos etudiants sont prepares aux standards les plus eleves du secteur, car les laboratoires medicaux ne tolerent aucune approximation.",
              },
              {
                title: 'Clarte',
                description:
                  "Une pedagogie concrete et structuree, pensee pour rendre accessibles les concepts les plus complexes de la biologie medicale. Chaque cours est organise de maniere progressive, du fondamental au specialise, pour que chaque etudiant puisse construire ses connaissances sur des bases solides et comprendre le sens de chaque apprentissage.",
              },
              {
                title: 'Accompagnement',
                description:
                  "Un suivi adapte aux parcours varies de nos etudiants, avec une attention particuliere portee a chacun. Que vous soyez bachelier, etudiant en reorientation ou professionnel en reconversion, notre equipe pedagogique adapte son accompagnement a votre situation. Entretiens individuels, tutorat, aide a la recherche de stage : personne n'est laisse seul.",
              },
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corps enseignant */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy text-sm font-semibold rounded-full mb-6">
              Nos enseignants
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Des professionnels en activite au service de votre formation
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Chez Linova, nous avons fait le choix delibere de confier l&apos;enseignement a des professionnels qui exercent quotidiennement dans le secteur de la biologie medicale. Ce n&apos;est pas un complement : c&apos;est le coeur de notre modele pedagogique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Biologistes medicaux',
                description:
                  "Medecins biologistes et pharmaciens biologistes qui dirigent des laboratoires et supervisent les analyses. Ils transmettent une vision globale du fonctionnement d'un laboratoire.",
              },
              {
                title: 'Techniciens de laboratoire',
                description:
                  "Techniciens experimentes qui realisent quotidiennement des analyses en biochimie, hematologie, microbiologie et immunologie. Ils enseignent les gestes techniques du metier.",
              },
              {
                title: 'Cadres de sante',
                description:
                  "Cadres de sante qui encadrent des equipes en laboratoire. Ils apportent une expertise en organisation du travail, gestion de la qualite et management.",
              },
              {
                title: 'Chercheurs et praticiens',
                description:
                  "Chercheurs et praticiens hospitaliers qui travaillent a la pointe de la biologie medicale. Ils ouvrent des perspectives sur les innovations et l'avenir du secteur.",
              },
            ].map((profile, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-dark mb-2">{profile.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{profile.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methode pedagogique detaillee */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Methode pedagogique
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Apprendre en faisant : la pedagogie du terrain
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Notre methode pedagogique repose sur un principe fondamental : la theorie prend tout son sens lorsqu&apos;elle est immediatement mise en pratique. Chaque concept enseigne en cours est rapidement applique en travaux pratiques, en travaux diriges ou en situation de stage.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cette approche garantit que les etudiants ne se contentent pas d&apos;apprendre des notions abstraites, mais qu&apos;ils developpent des competences reelles, directement transposables en milieu professionnel. A l&apos;issue de leur formation, nos diplomes sont immediatement operationnels.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Le programme du BTS Biologie Medicale couvre l&apos;ensemble des disciplines essentielles : biochimie, hematologie, microbiologie, immunologie, anatomopathologie, biologie moleculaire et assurance qualite. Chaque discipline est enseignee par un specialiste du domaine.
              </p>
              <CandidaterButton variant="teal">Candidater maintenant</CandidaterButton>
            </div>
            <div className="space-y-6">
              <div className="bg-light rounded-2xl p-6">
                <h3 className="font-bold text-dark mb-3">Phase 1 : Les fondamentaux (Semestres 1 et 2)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acquisition des connaissances de base en biologie cellulaire, chimie, physique et sciences du vivant. Introduction aux techniques de laboratoire et aux bonnes pratiques professionnelles. Premiers travaux pratiques encadres.
                </p>
              </div>
              <div className="bg-light rounded-2xl p-6">
                <h3 className="font-bold text-dark mb-3">Phase 2 : La specialisation (Semestres 3 et 4)</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Approfondissement des disciplines de specialite : biochimie clinique, hematologie-hemostase, microbiologie, immunologie et parasitologie. Travaux pratiques avances sur automates d&apos;analyses. Stages en laboratoire.
                </p>
              </div>
              <div className="bg-light rounded-2xl p-6">
                <h3 className="font-bold text-dark mb-3">Phase 3 : La professionnalisation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Stage long en milieu professionnel, preparation a l&apos;examen national, projet professionnel. Les etudiants en alternance beneficient d&apos;une immersion continue en entreprise tout au long de la formation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipements et infrastructure */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Des equipements professionnels a votre disposition
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Pour former des techniciens de laboratoire competents, il faut des equipements identiques a ceux utilises en milieu professionnel. Chez Linova, les etudiants travaillent sur du materiel de pointe.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Automates d analyses',
                description: "Automates de biochimie et d'hematologie identiques a ceux des laboratoires d'analyses medicales.",
              },
              {
                title: 'Microscopes optiques',
                description: 'Microscopes de haute qualite pour les observations en hematologie, cytologie et parasitologie.',
              },
              {
                title: 'Materiel de microbiologie',
                description: "Postes de securite microbiologique, etuves, autoclaves et milieux de culture pour l'etude des micro-organismes.",
              },
              {
                title: 'Equipements d hematologie',
                description: 'Automates de numeration, lames colorees et materiel de coagulation pour les analyses sanguines.',
              },
              {
                title: 'Outils de biologie moleculaire',
                description: 'Thermocycleurs (PCR), electrophorese et materiel de biologie moleculaire pour les techniques modernes.',
              },
              {
                title: 'Logiciels professionnels',
                description: "Systemes informatiques de gestion de laboratoire (SIL) et logiciels d'assurance qualite.",
              },
            ].map((equip, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-yellow text-dark flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold mb-2">{equip.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{equip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseau de partenaires */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
              Reseau professionnel
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Un reseau de partenaires au service de votre insertion
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Linova a developpe un reseau de plus de 50 partenaires professionnels : laboratoires d&apos;analyses medicales, hopitaux, centres de recherche et etablissements de sante. Ce reseau facilite la recherche de stages, d&apos;alternances et d&apos;emplois pour nos etudiants.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Laboratoires prives',
                description: "Laboratoires d'analyses medicales de ville et groupes de biologie medicale.",
              },
              {
                title: 'Hopitaux publics',
                description: "Hopitaux de l'AP-HP et centres hospitaliers universitaires de la region Ile-de-France.",
              },
              {
                title: 'Centres de recherche',
                description: 'Instituts de recherche (INSERM, CNRS, Institut Pasteur) et laboratoires de R&D.',
              },
              {
                title: 'Industrie pharmaceutique',
                description: 'Laboratoires pharmaceutiques et societes de biotechnologie de la region parisienne.',
              },
            ].map((partner, i) => (
              <div key={i} className="bg-light rounded-xl p-6">
                <h3 className="font-bold text-dark mb-2">{partner.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{partner.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <CandidaterButton>Rejoindre Linova Education</CandidaterButton>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
