import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';
import { CandidaterButton } from '@/components/CandidaterModal';

export const metadata: Metadata = {
  title: 'Accessibilite et inclusion - Politique handicap | Linova Education Paris',
  description:
    "Linova Education s'engage pour l'accessibilite de ses formations aux personnes en situation de handicap. Referent handicap dedie, amenagements pedagogiques et physiques, accessibilite numerique RGAA. BTS Biologie Medicale accessible a tous a Paris 12e.",
  keywords: [
    'accessibilite formation handicap',
    'politique handicap ecole',
    'referent handicap formation',
    'amenagements pedagogiques handicap',
    'accessibilite numerique RGAA',
    'inclusion formation sante',
    'BTS biologie medicale handicap',
    'egalite des chances formation',
  ],
  alternates: { canonical: '/ecole/accessibilite' },
};

const faqItems = [
  {
    question: 'Linova accueille-t-elle les etudiants en situation de handicap ?',
    answer:
      "Oui, Linova s'engage a accueillir tous les etudiants, y compris ceux en situation de handicap. Nous mettons en place des amenagements adaptes a chaque situation : amenagements physiques (accessibilite des locaux), amenagements pedagogiques (supports alternatifs, temps supplementaire) et accompagnement personnalise par notre referent handicap.",
  },
  {
    question: 'Qui est le referent handicap de Linova ?',
    answer:
      "Le referent handicap est un membre de l'equipe pedagogique forme a l'accueil et a l'accompagnement des personnes en situation de handicap. Il est l'interlocuteur privilegie des etudiants concernes et coordonne les amenagements necessaires avec l'equipe pedagogique, les services exterieurs et les employeurs (en cas d'alternance).",
  },
  {
    question: "Quels types d'amenagements sont possibles ?",
    answer:
      "Les amenagements dependent de la nature du handicap et sont definis au cas par cas avec l'etudiant et le referent handicap. Ils peuvent inclure : temps supplementaire pour les examens (tiers temps), supports de cours en formats alternatifs, adaptation du poste de travail en laboratoire, amenagement des horaires, mise a disposition de technologies d'assistance et accompagnement renforce.",
  },
  {
    question: 'Le campus de Linova est-il accessible aux fauteuils roulants ?',
    answer:
      "Oui, notre campus situe au 85 avenue Ledru-Rollin (Paris 12e) est accessible aux personnes a mobilite reduite. Les locaux disposent de rampes d'acces, d'ascenseurs, de sanitaires adaptes et de salles de cours accessibles. Les laboratoires sont egalement amenages pour permettre l'acces aux fauteuils roulants.",
  },
  {
    question: 'Comment signaler un besoin d amenagement ?',
    answer:
      "Vous pouvez signaler un besoin d'amenagement des la candidature, en le mentionnant dans votre dossier d'inscription, ou a tout moment de votre formation en contactant le referent handicap par email (accessibilite@linova.fr) ou en prenant rendez-vous directement. Plus le signalement est fait tot, mieux nous pouvons preparer les adaptations necessaires.",
  },
  {
    question: 'Le site web de Linova est-il accessible ?',
    answer:
      "Notre site web et nos outils pedagogiques numeriques sont concus en conformite avec les standards du RGAA (Referentiel General d'Amelioration de l'Accessibilite). Ils sont compatibles avec les technologies d'assistance : lecteurs d'ecran, navigation au clavier, logiciels de grossissement. Nous travaillons continuellement a l'amelioration de l'accessibilite numerique.",
  },
  {
    question: "Quels organismes exterieurs accompagnent Linova dans sa politique handicap ?",
    answer:
      "Linova travaille en lien avec plusieurs organismes specialises : la MDPH (Maison Departementale des Personnes Handicapees), l'AGEFIPH (Association de Gestion du Fonds pour l'Insertion Professionnelle des Personnes Handicapees), les services de medecine preventive et les associations specialisees dans l'accompagnement des etudiants en situation de handicap.",
  },
  {
    question: "L'alternance est-elle possible pour les etudiants en situation de handicap ?",
    answer:
      "Absolument. Les etudiants en situation de handicap peuvent suivre la formation en alternance. Des aides supplementaires existent pour les employeurs qui accueillent des alternants en situation de handicap (aides AGEFIPH, amenagement du poste de travail). Le referent handicap accompagne l'etudiant et l'employeur dans la mise en place des adaptations necessaires.",
  },
];

export default function Accessibilite() {
  return (
    <>
      <PageHero
        title="Accessibilite"
        highlight="& inclusion"
        description="Linova met en place une politique handicap claire, active et engagee pour accompagner chaque etudiant dans son parcours. Parce que la formation en biologie medicale doit etre accessible a tous."
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
                  Une ecole ouverte a tous les parcours
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Chez Linova Education, nous croyons que le talent et la motivation ne connaissent pas de limites. Chaque personne, quelle que soit sa situation, doit pouvoir acceder a une formation de qualite en biologie medicale. C&apos;est pourquoi nous avons fait de l&apos;accessibilite et de l&apos;inclusion des piliers de notre projet pedagogique.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Notre politique d&apos;accessibilite ne se limite pas a la conformite reglementaire. Elle traduit une conviction profonde : la diversite des parcours et des profils enrichit notre communaute etudiante et prepare nos diplomes a travailler dans des equipes plurielles, reflet de la societe.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Un referent handicap dedie coordonne l&apos;ensemble des actions d&apos;accessibilite. Il est l&apos;interlocuteur privilegie des etudiants en situation de handicap, des familles, des employeurs (en alternance) et des organismes specialises.
                </p>
              </div>
              <div className="bg-teal rounded-3xl p-10 text-white">
                <h3 className="text-2xl font-bold mb-6">Contacter le referent handicap</h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  Notre referent handicap est disponible pour repondre a toutes vos questions sur l&apos;accessibilite de notre formation et les amenagements possibles.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/70">Email</p>
                    <a href="mailto:accessibilite@linova.fr" className="text-yellow font-semibold hover:underline">
                      accessibilite@linova.fr
                    </a>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/70">Telephone</p>
                    <a href="tel:+33189719944" className="text-yellow font-semibold hover:underline">
                      +33 1 89 71 99 44
                    </a>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-sm text-white/70">Adresse</p>
                    <p className="text-white font-semibold">85 avenue Ledru-Rollin, 75012 Paris</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les 3 piliers */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Trois etapes pour un accompagnement adapte
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Notre demarche d&apos;accessibilite s&apos;articule autour de trois etapes cles, qui garantissent un accompagnement complet et personnalise de chaque etudiant en situation de handicap.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Identifier les besoins',
                description:
                  "En amont de la formation, nous identifions les besoins specifiques de chaque etudiant lors d'un entretien avec le referent handicap. Cet echange confidentiel permet de comprendre la nature du handicap, les adaptations deja utilisees et les amenagements necessaires pour suivre la formation dans les meilleures conditions. Un plan d'accompagnement personnalise est ensuite etabli.",
              },
              {
                title: 'Coordonner les adaptations',
                description:
                  "Tout au long du parcours, le referent handicap coordonne les amenagements pedagogiques et materiels. Il travaille en lien avec l'equipe enseignante, les services administratifs, les employeurs (en alternance) et les organismes exterieurs (MDPH, AGEFIPH) pour garantir la mise en place effective des adaptations convenues et leur ajustement en fonction de l'evolution des besoins.",
              },
              {
                title: 'Tracer et evaluer',
                description:
                  "Nous assurons la tracabilite de toutes les actions mises en place : amenagements, entretiens, suivis, ajustements. Cette tracabilite permet un suivi rigoureux et transparent, conforme aux exigences de la certification Qualiopi. Des bilans reguliers avec l'etudiant permettent d'evaluer l'efficacite des amenagements et de les ajuster si necessaire.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-teal text-white flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenagements physiques et pedagogiques */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">
                Amenagements
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Acces physique et pedagogique
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Notre campus du 12e arrondissement de Paris est concu pour etre accessible au plus grand nombre. Les amenagements physiques et pedagogiques sont complementaires et s&apos;adaptent a chaque situation individuelle.
              </p>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-dark">Accessibilite physique du campus</h3>
                {[
                  "Campus entierement accessible aux fauteuils roulants (rampes d'acces, ascenseurs)",
                  'Sanitaires adaptes aux personnes a mobilite reduite a chaque etage',
                  'Laboratoires amenages pour permettre l acces et le travail en fauteuil roulant',
                  'Places de stationnement reservees a proximite de l entree',
                  'Signaletique en relief et en gros caracteres dans les espaces communs',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 list-none">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="text-lg font-bold text-dark">Amenagements pedagogiques</h3>
                {[
                  'Supports de cours en formats alternatifs (Braille, audio, grands caracteres)',
                  'Temps supplementaire pour les examens (tiers temps)',
                  "Adaptation du poste de travail en laboratoire selon les besoins",
                  "Technologies d'assistance disponibles (lecteur d'ecran, logiciels de grossissement)",
                  'Amenagement des horaires en cas de contraintes medicales',
                  'Tuteur pedagogique dedie en complement du referent handicap',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 list-none">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Accessibilite numerique
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Notre site web et nos outils pedagogiques numeriques sont concus en conformite avec les standards du RGAA (Referentiel General d&apos;Amelioration de l&apos;Accessibilite) pour etre compatibles avec les technologies d&apos;assistance.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Compatibilite avec les lecteurs d ecran (JAWS, NVDA, VoiceOver)',
                  'Navigation complete au clavier sans souris',
                  'Contrastes de couleurs conformes aux normes WCAG 2.1 niveau AA',
                  'Textes alternatifs sur toutes les images',
                  'Structure semantique des pages avec titres hierarchises',
                  'Possibilite d agrandir les textes sans perte de lisibilite',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-light rounded-xl p-6 mb-6">
                <h3 className="font-bold text-dark mb-3">Declaration d&apos;accessibilite</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Conformement a l&apos;article 47 de la loi du 11 fevrier 2005, Linova Education s&apos;engage a rendre ses services numeriques accessibles. Notre site vise la conformite au RGAA version 4. Nous menons regulierement des audits d&apos;accessibilite pour identifier et corriger les eventuels defauts.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Si vous rencontrez un probleme d&apos;accessibilite sur notre site, n&apos;hesitez pas a nous le signaler.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-600 mb-2">Signaler un probleme d&apos;accessibilite :</p>
                <a href="mailto:accessibilite@linova.fr" className="text-teal font-semibold hover:underline">
                  accessibilite@linova.fr
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partenaires et ressources externes */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nos partenaires pour l&apos;accessibilite
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Linova travaille en lien avec des organismes specialises pour garantir un accompagnement complet et professionnel des etudiants en situation de handicap.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'MDPH',
                fullName: 'Maison Departementale des Personnes Handicapees',
                description: "Reconnaissance du handicap, orientation et droits des personnes en situation de handicap. La MDPH de Paris est notre interlocuteur privilegie.",
              },
              {
                title: 'AGEFIPH',
                fullName: 'Association de Gestion du Fonds pour l Insertion Professionnelle',
                description: "Aides financieres pour les employeurs accueillant des alternants en situation de handicap. Financement d'amenagements de poste de travail.",
              },
              {
                title: 'CAP Emploi',
                fullName: 'Service d accompagnement vers l emploi',
                description: "Accompagnement specialise vers l'emploi pour les personnes en situation de handicap. Aide a la recherche d'alternance et de stage adaptes.",
              },
              {
                title: 'Medecine preventive',
                fullName: 'Service de sante au travail',
                description: "Evaluation des capacites, preconisation d'amenagements et suivi medical des etudiants en situation de handicap tout au long de la formation.",
              },
            ].map((partner, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="text-yellow font-bold text-lg mb-1">{partner.title}</h3>
                <p className="text-white/60 text-xs mb-3">{partner.fullName}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Egalite des chances */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-navy/10 text-navy text-sm font-semibold rounded-full mb-6">
                Egalite des chances
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
                Au-dela du handicap : l&apos;inclusion pour tous
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                L&apos;engagement de Linova en matiere d&apos;inclusion ne se limite pas au handicap. Nous defendons l&apos;egalite des chances pour tous, independamment du genre, de l&apos;origine, de l&apos;age, du parcours scolaire ou de la situation sociale.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Chaque candidature est evaluee sur des criteres objectifs : motivation, projet professionnel, aptitudes et potentiel. Nous croyons que la diversite des profils est une richesse pour notre communaute etudiante et prepare nos diplomes a travailler dans des environnements professionnels varies.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                En alternance, nous accompagnons les etudiants issus de quartiers prioritaires de la politique de la ville et ceux en situation de precarite vers des employeurs sensibles a la diversite et a l&apos;inclusion.
              </p>
              <div className="bg-light rounded-xl p-6">
                <h3 className="font-bold text-dark mb-3">Nos engagements concrets</h3>
                <div className="space-y-3">
                  {[
                    "Aucune discrimination a l'admission : evaluation sur la motivation et le projet professionnel",
                    "Parite dans les processus de selection et dans l'equipe pedagogique",
                    "Accompagnement renforce pour les etudiants en situation de precarite",
                    "Facilites de paiement pour la formation initiale",
                    "Aide a la recherche de logement et d'aides sociales",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-light rounded-2xl p-8">
                <h3 className="text-xl font-bold text-dark mb-4">Lutte contre les discriminations</h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  Linova applique une politique de tolerance zero envers toute forme de discrimination. Le reglement interieur de l&apos;etablissement interdit explicitement les comportements discriminatoires et prevoit des sanctions en cas de manquement.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Tout etudiant victime ou temoin de discrimination peut en faire part au referent pedagogique ou a la direction, qui traitera la situation avec diligence et confidentialite.
                </p>
              </div>
              <div className="bg-light rounded-2xl p-8">
                <h3 className="text-xl font-bold text-dark mb-4">Dispositif de veille</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Un dispositif de veille permet d&apos;identifier les situations de fragilite ou de difficulte rencontrees par les etudiants. L&apos;equipe pedagogique est formee a detecter les signaux faibles et a orienter les etudiants vers les ressources appropriees : services sociaux, soutien psychologique, aide au logement, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Processus d'accueil handicap */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Le parcours d&apos;accueil d&apos;un etudiant en situation de handicap
            </h2>
            <p className="text-gray-600 leading-relaxed">
              De la candidature a l&apos;obtention du diplome, voici les etapes de l&apos;accompagnement propose par Linova aux etudiants en situation de handicap.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Prise de contact',
                description: "Premier echange avec le referent handicap pour comprendre la situation et les besoins.",
              },
              {
                step: '02',
                title: 'Evaluation',
                description: "Analyse detaillee des besoins d'amenagement en concertation avec l'etudiant et, si necessaire, avec des professionnels de sante.",
              },
              {
                step: '03',
                title: "Plan d'accompagnement",
                description: "Elaboration d'un plan d'accompagnement personnalise definissant les amenagements physiques, pedagogiques et organisationnels.",
              },
              {
                step: '04',
                title: 'Mise en oeuvre',
                description: "Mise en place effective des amenagements avant le debut de la formation et information de l'equipe pedagogique.",
              },
              {
                step: '05',
                title: 'Suivi continu',
                description: "Points d'etape reguliers avec l'etudiant pour evaluer l'efficacite des amenagements et les ajuster si necessaire.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-2xl font-bold text-teal/30 mb-2">{item.step}</div>
                <h3 className="font-bold text-dark text-sm mb-2">{item.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Une question sur l&apos;accessibilite ?
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            N&apos;hesitez pas a contacter notre referent handicap pour discuter de votre situation et des amenagements possibles. Chaque parcours est unique et merite un accompagnement personnalise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CandidaterButton variant="yellow">Candidater maintenant</CandidaterButton>
            <a
              href="mailto:accessibilite@linova.fr"
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-full px-8 py-3.5 text-base border-2 border-white text-white hover:bg-white hover:text-teal transition-all"
            >
              Contacter le referent handicap
            </a>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />
      <CTASection />
    </>
  );
}
