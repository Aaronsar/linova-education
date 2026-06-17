import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '@/components/ContactForm';
import { CandidaterButton } from '@/components/CandidaterModal';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'BTS Biologie Médicale - Formation en 2 ans à Paris',
  description: "BTS Biologie Médicale en 2 ans à Paris, en initial ou alternance. RNCP 40027, 1350h de formation, 80% d'insertion à 6 mois. École certifiée Qualiopi. Candidatez dès maintenant.",
  keywords: ['BTS Biologie Médicale', 'formation laboratoire Paris', 'alternance biologie médicale', 'technicien laboratoire', 'RNCP 40027'],
  alternates: { canonical: '/formations/bts-biologie-medicale' },
};

const faqItems = [
  { question: "Qu'est-ce que le BTS Biologie Médicale ?", answer: "C'est un diplôme national en deux ans qui forme des techniciens capables de réaliser des analyses biologiques en appui au diagnostic et au suivi médical, avec une forte dimension technique et scientifique." },
  { question: 'Quels sont les objectifs principaux de la formation ?', answer: "Vous apprendrez à prélever et gérer des échantillons, réaliser des analyses (biochimie, microbiologie, hématologie...), interpréter des résultats, et travailler en respectant les normes de qualité et de sécurité en laboratoire." },
  { question: 'Est-il possible de suivre ce BTS en alternance ?', answer: "Oui, Linova propose le BTS Biologie Médicale à la fois en formation initiale et en alternance, avec un accompagnement adapté selon le mode choisi." },
  { question: "Comment se déroulent l'évaluation et la certification ?", answer: "L'évaluation combine des contrôles continus, des épreuves certificatives et la validation des blocs de compétences du référentiel RNCP, assurant une reconnaissance nationale du diplôme." },
  { question: 'Linova accompagne-t-elle les étudiants ayant des besoins spécifiques ?', answer: "Oui, nous accordons une attention particulière à l'accessibilité, à l'individualisation des parcours et à l'accompagnement des profils variés (réorientation, reconversion, situation de handicap)." },
  { question: 'Quels métiers peut-on exercer après ce BTS ?', answer: "Technicien de laboratoire biomédical, préleveur, assistant qualité, technicien en biologie de la reproduction, technicien en anatomopathologie, dans des structures hospitalières, privées, industrielles ou de recherche." },
  { question: "Quelles sont les possibilités de poursuite d'études ?", answer: "Licences professionnelles (bio-analyses, biotechnologies, santé, qualité), BUT, diplôme d'État de technicien de laboratoire médical (DETLM), écoles de santé à l'étranger, ou concours dans les secteurs paramédicaux et police scientifique." },
];

const epreuves = [
  { unite: 'U1 – Culture générale et expression', nature: 'Écrite', duree: '4 h', coeff: '3' },
  { unite: 'U2 – Langue vivante étrangère 1', nature: 'Orale', duree: '20 min (+20 min)', coeff: '2' },
  { unite: 'U3 – Mathématiques', nature: 'Écrite', duree: '2 h', coeff: '2' },
  { unite: 'U4 – Physique-chimie', nature: 'Écrite', duree: '2 h', coeff: '2' },
  { unite: 'U5 – Organisation & qualité au laboratoire', nature: 'Pratique + orale', duree: '1 h 30', coeff: '4' },
  { unite: 'U6 – Analyses biomédicales courantes', nature: 'Pratique', duree: '3 h', coeff: '6' },
  { unite: 'U7 – Méthodes à visée thérapeutique', nature: 'Pratique', duree: '3 h', coeff: '5' },
  { unite: 'U8 – Communication & développement pro', nature: 'Orale', duree: '30 min', coeff: '2' },
  { unite: 'U9 – Prélèvements biologiques', nature: 'Pratique simulée', duree: '45 min', coeff: '3' },
];

const programme = [
  { matiere: 'Culture générale et expression', h1: '4 h/sem', h2: '4 h/sem', total: '120 h' },
  { matiere: 'Anglais', h1: '4 h/sem', h2: '4 h/sem', total: '120 h' },
  { matiere: 'Mathématiques', h1: '4 h/sem', h2: '4 h/sem', total: '120 h' },
  { matiere: 'Physique-chimie', h1: '6 h/sem', h2: '4 h/sem', total: '150 h' },
];

const programPro = [
  { matiere: 'Qualité et organisation au laboratoire (BC1)', h1: '6 h/sem', h2: '6 h/sem', total: '180 h' },
  { matiere: 'Analyses médicales courantes (BC2)', h1: '20 h/sem', h2: '18 h/sem', total: '570 h' },
  { matiere: 'Amélioration des méthodes / Pratiques thérapeutiques (BC3)', h1: '6 h/sem', h2: '8 h/sem', total: '210 h' },
  { matiere: 'Communication et collaboration pro (BC4)', h1: '5.5 h/sem', h2: '5.5 h/sem', total: '120 h' },
  { matiere: 'Éthique scientifique', h1: '—', h2: '1 h/sem', total: '30 h' },
];

export default function BTSBiologieMedicale() {
  return (
    <>
      {/* Hero with form */}
      <section className="bg-navy py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                BTS <span className="text-teal italic">Biologie Médicale</span>
              </h1>
              <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-lg">
                Le BTS Biologie Médicale est un diplôme national en deux ans qui forme des techniciens capables de réaliser des analyses biologiques en lien avec le diagnostic et le suivi médical. Il allie rigueur scientifique, maîtrise technique, et ancrage professionnel.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { label: 'RNCP 40027', sublabel: 'France Compétences' },
                  { label: 'Prérequis', sublabel: 'Baccalauréat général, technologique ou professionnel' },
                  { label: 'Durée', sublabel: '1 350 heures de formation' },
                  { label: 'Rythme', sublabel: 'Initial & alternance' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white font-medium">{item.label}</span>
                    <span className="text-gray-400">– {item.sublabel}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { value: '2 ans', label: 'Durée' },
                  { value: '1 350h', label: 'Formation' },
                  { value: '80%', label: 'Insertion' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-yellow">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ContactForm form="contact" pixelEvent="CandidatureBTSBM" />
            </div>
          </div>
        </div>
      </section>

      {/* Programme pédagogique */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-6">Pédagogie</span>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            <span className="text-teal italic">Programme</span> pédagogique
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 leading-relaxed mb-6">
                La formation proposée par Linova repose sur une approche pédagogique complète, articulée autour de :
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Cours théoriques approfondis en biologie, biochimie, microbiologie, hématologie',
                  'Travaux pratiques en laboratoire sur équipements professionnels',
                  'Mises en situation professionnelles',
                  'Accompagnement individualisé pour chaque étudiant',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Un responsable pédagogique suit chaque étudiant tout au long de sa formation. Des évaluations régulières, des sessions de révision, et une plateforme numérique complètent le dispositif.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark mb-4">Objectifs pédagogiques</h3>
              <p className="text-gray-600 mb-4">Préparer des techniciens biologistes capables de :</p>
              <ul className="space-y-3">
                {[
                  'Maîtriser les techniques d\'analyses médicales en laboratoire',
                  'Comprendre et appliquer les protocoles qualité et hygiène',
                  'Interpréter les résultats et contribuer au diagnostic médical',
                  'Travailler en équipe pluridisciplinaire',
                  'S\'insérer rapidement dans le secteur biomédical ou poursuivre vers une licence professionnelle',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CandidaterButton>Candidater maintenant</CandidaterButton>
              </div>
            </div>
          </div>
          <div className="mt-12 relative rounded-2xl overflow-hidden aspect-[21/9]">
            <Image
              src="/images/photos/techniques-analyse.png"
              alt="Techniques d'analyse en laboratoire de biologie medicale"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Rythme : Initial vs Alternance */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            Une formation complète et professionnalisante
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Le BTS est accessible en formation initiale ou en alternance, selon votre profil et votre projet professionnel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Initial */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-teal transition-colors">
              <span className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-4">Formation initiale</span>
              <h3 className="text-2xl font-bold text-dark mb-6">Parcours classique</h3>
              <ul className="space-y-3 mb-6">
                {[
                  '25 semaines de cours réparties sur l\'année',
                  '12 semaines de stage en milieu professionnel',
                  '3 à 4 semaines de vacances scolaires',
                  'Rythme : lundi-mardi-mercredi ou mercredi-jeudi-vendredi',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-teal font-medium mb-6">Pret etudiant facilite via notre partenaire LCL</p>
              <CandidaterButton variant="teal" className="px-6 py-2.5 text-sm">
                Candidater en initial
              </CandidaterButton>
            </div>

            {/* Alternance */}
            <div className="bg-navy rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-yellow text-dark text-xs font-bold rounded-full">Recommandé</div>
              <span className="inline-block px-3 py-1 bg-white/10 text-yellow text-xs font-semibold rounded-full mb-4">Alternance</span>
              <h3 className="text-2xl font-bold mb-6">Parcours en entreprise</h3>
              <ul className="space-y-3 mb-6">
                {[
                  '2 jours de cours par semaine (lundi-mardi ou jeudi-vendredi)',
                  '3 jours en entreprise',
                  'Statut salarié avec rémunération mensuelle',
                  'Expérience concrète dès la première année',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-3xl font-bold text-yellow mb-1">0 &euro;</div>
              <p className="text-sm text-gray-300 mb-6">Frais intégralement pris en charge par l&apos;OPCO</p>
              <CandidaterButton variant="yellow" className="px-6 py-2.5 text-sm">
                Candidater en alternance
              </CandidaterButton>
            </div>
          </div>
        </div>
      </section>

      {/* Évaluation & Certification */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Évaluation, certification et reconnaissance
          </h2>
          <p className="text-gray-600 leading-relaxed mb-10 max-w-3xl">
            Le BTS Biologie Médicale est validé selon des modalités rigoureuses, encadrées par le référentiel national du diplôme.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-light rounded-2xl p-6">
              <h3 className="font-bold text-dark mb-4">Modalités d&apos;évaluation</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Contrôle continu tout au long de la formation</li>
                <li>Épreuves finales : écrites, orales et pratiques</li>
                <li>Soutenance de stage : présentation orale de 45 min</li>
              </ul>
            </div>
            <div className="bg-light rounded-2xl p-6">
              <h3 className="font-bold text-dark mb-4">Disciplines évaluées</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>TP en biochimie, microbiologie et hématologie</li>
                <li>Épreuves écrites en biologie, physique-chimie, maths et anglais</li>
                <li>Épreuve facultative en langue vivante 2</li>
              </ul>
            </div>
            <div className="bg-light rounded-2xl p-6">
              <h3 className="font-bold text-dark mb-4">Évaluation encadrée par</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Traçabilité des acquis (portfolio, grilles)</li>
                <li>Outils d&apos;adaptation pédagogique</li>
                <li>Démarche qualité continue (Qualiopi)</li>
              </ul>
            </div>
          </div>

          {/* Tableau des épreuves */}
          <h3 className="text-xl font-bold text-dark mb-6">Les épreuves de l&apos;examen final</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left py-3 px-4 rounded-tl-lg">Unité / Épreuve</th>
                  <th className="text-left py-3 px-4">Nature</th>
                  <th className="text-left py-3 px-4">Durée</th>
                  <th className="text-left py-3 px-4 rounded-tr-lg">Coeff.</th>
                </tr>
              </thead>
              <tbody>
                {epreuves.map((e, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-light' : 'bg-white'}>
                    <td className="py-3 px-4 font-medium text-dark">{e.unite}</td>
                    <td className="py-3 px-4 text-gray-600">{e.nature}</td>
                    <td className="py-3 px-4 text-gray-600">{e.duree}</td>
                    <td className="py-3 px-4 font-bold text-teal">{e.coeff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Programme détaillé */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Programme détaillé</h2>
          <p className="text-gray-600 mb-10">Le contenu du BTS Biologie Médicale est défini par le Ministère de l&apos;Enseignement Supérieur.</p>

          {/* Enseignement général */}
          <h3 className="text-lg font-bold text-dark mb-4">Enseignements généraux — 510 h</h3>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="text-left py-3 px-4 rounded-tl-lg">Matière</th>
                  <th className="text-left py-3 px-4">1re année</th>
                  <th className="text-left py-3 px-4">2e année</th>
                  <th className="text-left py-3 px-4 rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {programme.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-light'}>
                    <td className="py-3 px-4 font-medium text-dark">{p.matiere}</td>
                    <td className="py-3 px-4 text-gray-600">{p.h1}</td>
                    <td className="py-3 px-4 text-gray-600">{p.h2}</td>
                    <td className="py-3 px-4 font-bold text-teal">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enseignement professionnel */}
          <h3 className="text-lg font-bold text-dark mb-4">Enseignements professionnels — 1 335 h</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-teal text-white">
                  <th className="text-left py-3 px-4 rounded-tl-lg">Matière</th>
                  <th className="text-left py-3 px-4">1re année</th>
                  <th className="text-left py-3 px-4">2e année</th>
                  <th className="text-left py-3 px-4 rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {programPro.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-light'}>
                    <td className="py-3 px-4 font-medium text-dark">{p.matiere}</td>
                    <td className="py-3 px-4 text-gray-600">{p.h1}</td>
                    <td className="py-3 px-4 text-gray-600">{p.h2}</td>
                    <td className="py-3 px-4 font-bold text-teal">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-white rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="font-bold text-dark">Stages en milieu professionnel (initial)</p>
              <p className="text-sm text-gray-500">7 semaines en 1re année + 7 semaines en 2e année</p>
            </div>
            <span className="text-xl font-bold text-teal">14 semaines</span>
          </div>
        </div>
      </section>

      {/* Accessibilité & Accompagnement */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-12">
            Accessibilité, individualisation et accompagnement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-light rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-teal text-white flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark mb-3">Accessibilité pour tous</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Locaux adaptés PMR</li>
                <li>Référente handicap dédiée</li>
                <li>Adaptation des rythmes, supports et évaluations</li>
              </ul>
            </div>
            <div className="bg-light rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark mb-3">Individualisation des parcours</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Suivi pédagogique avec bilans individualisés</li>
                <li>Tutorat et soutien méthodologique</li>
                <li>Ressources complémentaires sur plateforme</li>
              </ul>
            </div>
            <div className="bg-light rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-yellow text-dark flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark mb-3">Engagements de Linova</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Politique active d&apos;égalité des chances</li>
                <li>Accompagnement à la mobilité</li>
                <li>Environnement exigeant, bienveillant et humain</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Méthodes & Blocs de compétences */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Méthodes mobilisées</h2>
              <ul className="space-y-3">
                {[
                  'Cours théoriques en présentiel (magistraux, travaux dirigés)',
                  'Travaux pratiques en laboratoire',
                  'Mises en situation professionnelles et études de cas',
                  'Plateforme pédagogique numérique (supports, QCM, replays)',
                  'Ateliers de préparation aux entretiens et rédaction de CV',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Blocs de compétences</h2>
              <div className="space-y-4">
                {[
                  'Prélever et gérer la phase pré-analytique',
                  'Réaliser les analyses',
                  'Gérer les résultats',
                  'Contribuer à la recherche et au développement',
                  'Organiser, communiquer, se former et former',
                ].map((bloc, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-full bg-yellow text-dark flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {i + 1}
                    </div>
                    <span>{bloc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-white/10 rounded-xl p-6">
                <p className="text-sm text-gray-300 mb-1">Certificateur</p>
                <p className="font-semibold">MESR – Ministère de l&apos;Enseignement Supérieur et de la Recherche</p>
                <p className="text-sm text-gray-400 mt-1">Enregistrement : 01/01/2025 – 31/12/2029</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modalités d'accès */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Modalités et délais d&apos;accès</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Le processus d&apos;admission est conçu pour être simple, transparent et centré sur la motivation et la cohérence de votre projet.
              </p>
              <ul className="space-y-3">
                {[
                  'Admission sur dossier et entretien de motivation',
                  'Inscription via Parcoursup ou directement auprès de l\'établissement',
                  'Délais d\'accès : 5 jours max après validation du dossier',
                  'Alternance : admission définitive à la signature du contrat employeur',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6">Coûts et financements</h2>
              <div className="space-y-4">
                <div className="bg-light rounded-xl p-6">
                  <h3 className="font-bold text-dark mb-2">Formation initiale</h3>
                  <p className="text-xs text-teal font-medium mt-2">Pret etudiant facilite via notre partenaire LCL</p>
                </div>
                <div className="bg-navy rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-2">Formation en alternance</h3>
                  <p className="text-2xl font-bold text-yellow">0 &euro;</p>
                  <p className="text-sm text-gray-300 mt-1">Frais pris en charge par l&apos;OPCO. Statut salarié avec rémunération.</p>
                </div>
              </div>
              <Link href="/infos-pratiques/tarifs" className="inline-flex items-center gap-2 mt-6 text-teal font-semibold hover:underline">
                En savoir plus sur les tarifs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Débouchés */}
      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">
            Débouchés professionnels &amp; poursuites d&apos;études
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Le BTS Biologie Médicale prépare à une insertion rapide dans le monde du travail, tout en offrant des possibilités variées de poursuites d&apos;études.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Métiers */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-6">Insertion professionnelle directe</h3>
              <div className="space-y-3 mb-8">
                {[
                  'Technicien de laboratoire biomédical',
                  'Préleveur en laboratoire ou en site hospitalier',
                  'Assistant qualité / Technicien assurance qualité',
                  'Technicien en biologie de la reproduction',
                  'Technicien en anatomopathologie',
                ].map((metier, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-dark text-sm">{metier}</span>
                  </div>
                ))}
              </div>
              <h4 className="font-bold text-dark mb-3">Employeurs potentiels</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Laboratoires hospitaliers ou privés',
                  'Établissements français du sang',
                  'Centres de recherche médicale',
                  'Industrie pharmaceutique / biotech',
                ].map((emp, i) => (
                  <span key={i} className="px-4 py-2 bg-navy text-white rounded-full text-xs">{emp}</span>
                ))}
              </div>
            </div>

            {/* Poursuites */}
            <div>
              <h3 className="text-xl font-bold text-dark mb-6">Poursuites d&apos;études possibles</h3>
              <div className="space-y-4">
                {[
                  { title: 'Licences professionnelles', desc: 'Bio-analyses, biotechnologies, qualité, santé' },
                  { title: 'BUT', desc: 'Biologie, hygiène-sécurité-environnement (HSE)' },
                  { title: 'DETLM', desc: "Diplôme d'État de technicien de laboratoire médical (niveau licence)" },
                  { title: 'International', desc: 'Écoles de santé en Roumanie, Espagne, Hongrie...' },
                  { title: 'Concours', desc: 'Secteurs paramédicaux, santé publique, police scientifique' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
                    <h4 className="font-bold text-dark mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Candidater */}
          <div className="mt-16 text-center">
            <CandidaterButton>Candidater au BTS Biologie Médicale</CandidaterButton>
          </div>
        </div>
      </section>

      <FAQ items={faqItems} />

      {/* CTA final */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à rejoindre Linova ?</h2>
          <p className="text-gray-300 text-lg mb-10">Faites le premier pas vers votre carrière dans les métiers de la santé.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CandidaterButton className="px-8 py-3.5 text-lg">Candidater maintenant</CandidaterButton>
            <CandidaterButton variant="white" className="px-8 py-3.5 text-lg">Demander des informations</CandidaterButton>
          </div>
        </div>
      </section>
    </>
  );
}
