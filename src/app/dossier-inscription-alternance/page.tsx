'use client';

import { useState } from 'react';
import Image from 'next/image';

const steps = [
  { id: 1, title: 'Identite', icon: '1' },
  { id: 2, title: 'Parcours', icon: '2' },
  { id: 3, title: 'Documents', icon: '3' },
  { id: 4, title: 'Alternance', icon: '4' },
  { id: 5, title: 'Finalisation', icon: '5' },
];

export default function DossierInscription() {
  const [step, setStep] = useState(0); // 0 = intro
  const [submitted, setSubmitted] = useState(false);
  const [entrepriseTrouvee, setEntrepriseTrouvee] = useState('');

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[var(--font-outfit)] text-3xl font-bold text-dark mb-4">Dossier envoy&eacute; !</h1>
          <p className="text-gray-600 mb-2">Merci pour votre candidature au BTS Biologie M&eacute;dicale en alternance.</p>
          <p className="text-gray-600 mb-8">Notre &eacute;quipe vous recontacte sous <strong>48 heures</strong> pour planifier votre entretien de motivation.</p>
          <a href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-navy text-white font-semibold rounded-full hover:brightness-95 transition-all">
            Retour &agrave; l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Image src="/images/logos/logo-sans-baseline-blanc.svg" alt="Linova" width={120} height={35} className="mx-auto" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Dossier d&apos;inscription
          </h1>
          <p className="text-xl text-teal font-semibold mb-2">BTS Biologie M&eacute;dicale - Alternance</p>
          <p className="text-gray-400 text-sm">Rentr&eacute;e 2026 - 2027</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Step indicator */}
        {step > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.id ? 'bg-teal text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > s.id ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.icon}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${step >= s.id ? 'text-teal font-semibold' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 0: Intro */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-6">
              Bienvenue dans votre dossier de candidature
            </h2>
            <p className="text-gray-600 mb-6">
              Vous &ecirc;tes sur le point de candidater au <strong>BTS Biologie M&eacute;dicale en alternance</strong> chez Linova &Eacute;ducation, Paris 12e. Ce formulaire prend environ <strong>10 minutes</strong>.
            </p>
            <div className="bg-light rounded-xl p-6 mb-8">
              <h3 className="font-bold text-dark mb-3">Pr&eacute;parez ces documents avant de commencer :</h3>
              <ul className="space-y-2">
                {[
                  'Carte d\'identit\u00e9 (recto-verso) ou titre de s\u00e9jour',
                  '2 photos d\'identit\u00e9 r\u00e9centes',
                  'Dernier relev\u00e9 de notes ou dipl\u00f4me obtenu',
                  'Num\u00e9ro de S\u00e9curit\u00e9 Sociale',
                ].map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={next} className="w-full py-4 bg-yellow text-dark font-semibold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer">
              Commencer ma candidature
            </button>
          </div>
        )}

        {/* Step 1: Identite */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">Faisons connaissance</h2>
            <p className="text-gray-500 text-sm mb-8">Vos informations personnelles et coordonn&eacute;es</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Pr&eacute;nom *</label>
                  <input type="text" required placeholder="Votre pr&eacute;nom" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                  <input type="text" required placeholder="Votre nom" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Date de naissance *</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Lieu de naissance (+ d&eacute;partement) *</label>
                  <input type="text" required placeholder="Paris (75)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Nationalit&eacute; *</label>
                <input type="text" required placeholder="Fran&ccedil;aise" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
              </div>

              <hr className="my-6 border-gray-100" />
              <h3 className="font-bold text-dark">Coordonn&eacute;es</h3>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Adresse compl&egrave;te *</label>
                <input type="text" required placeholder="Num&eacute;ro et rue" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal mb-3" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <input type="text" required placeholder="Code postal" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                  <input type="text" required placeholder="Ville" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                  <input type="text" placeholder="D&eacute;partement" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                  <input type="email" required placeholder="votre@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">T&eacute;l&eacute;phone *</label>
                  <input type="tel" required placeholder="06 12 34 56 78" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={next} className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer">
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Parcours scolaire */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">Ton parcours scolaire</h2>
            <p className="text-gray-500 text-sm mb-8">Formation et dipl&ocirc;mes obtenus</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Niveau d&apos;&eacute;tudes actuel *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white">
                  <option value="">S&eacute;lectionnez...</option>
                  <option value="terminale">Terminale</option>
                  <option value="bachelier">Bachelier</option>
                  <option value="bac+1">Bac+1</option>
                  <option value="bac+2">Bac+2</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Fili&egrave;re de baccalaur&eacute;at *</label>
                  <input type="text" required placeholder="Ex: STL, ST2S, G&eacute;n&eacute;ral..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Ann&eacute;e d&apos;obtention *</label>
                  <input type="text" required placeholder="2025" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">&Eacute;tablissement (ann&eacute;e du bac) *</label>
                <input type="text" required placeholder="Nom du lyc&eacute;e" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Intitul&eacute; complet du dernier dipl&ocirc;me obtenu *</label>
                <textarea required rows={3} placeholder="Ex: Baccalaur&eacute;at technologique STL sp&eacute;cialit&eacute; biotechnologies" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={prev} className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Retour
              </button>
              <button onClick={next} className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer">
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">Documents officiels</h2>
            <p className="text-gray-500 text-sm mb-8">Informations administratives et pi&egrave;ces justificatives</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">N&deg; de S&eacute;curit&eacute; Sociale *</label>
                  <input type="text" required placeholder="1 XX XX XX XXX XXX XX" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">N&deg; Carte d&apos;identit&eacute; / Titre de s&eacute;jour *</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Niveau estim&eacute; en anglais *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white">
                  <option value="">S&eacute;lectionnez...</option>
                  <option value="debutant">D&eacute;butant</option>
                  <option value="intermediaire">Interm&eacute;diaire</option>
                  <option value="avance">Avanc&eacute;</option>
                  <option value="bilingue">Bilingue</option>
                </select>
              </div>

              <hr className="my-6 border-gray-100" />
              <h3 className="font-bold text-dark">Pi&egrave;ces &agrave; d&eacute;poser</h3>

              {[
                { label: 'Carte d\'identit\u00e9 (recto-verso) *', accept: '.pdf,.jpg,.jpeg,.png' },
                { label: '2 photos d\'identit\u00e9 r\u00e9centes *', accept: '.jpg,.jpeg,.png' },
                { label: 'Relev\u00e9 de notes ou dipl\u00f4me *', accept: '.pdf,.jpg,.jpeg,.png' },
              ].map((doc, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-dark mb-1.5">{doc.label}</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-teal transition-colors cursor-pointer">
                    <input type="file" accept={doc.accept} className="hidden" id={`file-${i}`} />
                    <label htmlFor={`file-${i}`} className="cursor-pointer">
                      <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-500">Cliquez pour t&eacute;l&eacute;verser</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG (max 5 Mo)</p>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={prev} className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Retour
              </button>
              <button onClick={next} className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer">
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Alternance */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">Ton alternance</h2>
            <p className="text-gray-500 text-sm mb-8">Ton projet professionnel et ta recherche d&apos;entreprise</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-3">As-tu d&eacute;j&agrave; trouv&eacute; une entreprise d&apos;accueil ? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Oui', 'Non', 'En cours de recherche'].map((opt) => (
                    <label key={opt} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                      entrepriseTrouvee === opt ? 'border-teal bg-teal/5 text-teal' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="entreprise"
                        value={opt}
                        checked={entrepriseTrouvee === opt}
                        onChange={(e) => setEntrepriseTrouvee(e.target.value)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {entrepriseTrouvee === 'Oui' && (
                <div className="bg-teal/5 rounded-xl p-5">
                  <label className="block text-sm font-medium text-dark mb-1.5">Nom de l&apos;entreprise</label>
                  <input type="text" placeholder="Nom de l'entreprise d'accueil" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
                </div>
              )}

              {(entrepriseTrouvee === 'Non' || entrepriseTrouvee === 'En cours de recherche') && (
                <div className="bg-yellow/10 rounded-xl p-5">
                  <p className="text-sm text-dark font-medium mb-3">Souhaites-tu que Linova t&apos;aide dans ta recherche de contrat d&apos;alternance ?</p>
                  <div className="flex gap-3">
                    {['Oui, je veux de l\'aide', 'Non merci'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-teal transition-all text-sm">
                        <input type="radio" name="aide" className="accent-teal" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={prev} className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Retour
              </button>
              <button onClick={next} className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer">
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Finalisation */}
        {step === 5 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">Derni&egrave;res infos</h2>
            <p className="text-gray-500 text-sm mb-8">Quelques questions avant de valider votre dossier</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-3">Es-tu disponible pour un &eacute;change avec notre &eacute;quipe ?</label>
                <div className="flex gap-3">
                  {['Oui', 'Non'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-teal transition-all text-sm">
                      <input type="radio" name="disponible" className="accent-teal" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Cr&eacute;neaux pr&eacute;f&eacute;r&eacute;s</label>
                <input type="text" placeholder="Ex: mardi et jeudi apr&egrave;s-midi" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal" />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">Comment as-tu connu Linova ?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['R\u00e9seaux sociaux', 'Google', 'Conseiller d\'orientation', 'Bouche-\u00e0-oreille', 'Salon', 'Autre'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-teal transition-all text-sm">
                      <input type="radio" name="source" className="accent-teal" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">Souhaites-tu recevoir nos infos utiles (stages, alternance, conseils) ?</label>
                <div className="flex gap-3">
                  {['Oui', 'Non'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-teal transition-all text-sm">
                      <input type="radio" name="newsletter" className="accent-teal" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Une remarque ou question ?</label>
                <textarea rows={3} placeholder="N'h&eacute;sitez pas &agrave; nous laisser un message..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={prev} className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer">
                Retour
              </button>
              <button
                onClick={() => setSubmitted(true)}
                className="flex-1 py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer"
              >
                Envoyer mon dossier
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              En soumettant ce formulaire, vous acceptez d&apos;&ecirc;tre recontact&eacute; par Linova &Eacute;ducation.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
