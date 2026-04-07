'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

const steps = [
  { id: 1, title: 'Identite', icon: '1' },
  { id: 2, title: 'Parcours', icon: '2' },
  { id: 3, title: 'Documents', icon: '3' },
  { id: 4, title: 'Alternance', icon: '4' },
  { id: 5, title: 'Finalisation', icon: '5' },
];

interface FormData {
  prenom: string;
  nom: string;
  date_naissance: string;
  lieu_naissance: string;
  nationalite: string;
  adresse: string;
  code_postal: string;
  ville: string;
  departement: string;
  email: string;
  telephone: string;
  niveau_etudes: string;
  filiere_bac: string;
  annee_obtention: string;
  etablissement: string;
  dernier_diplome: string;
  numero_secu: string;
  numero_cni: string;
  niveau_anglais: string;
  entreprise_trouvee: string;
  nom_entreprise: string;
  aide_recherche: string;
  disponible_echange: string;
  creneaux_preferes: string;
  source_decouverte: string;
  newsletter: string;
  remarques: string;
}

interface FileData {
  fichier_cni: File | null;
  fichier_photos: File | null;
  fichier_releve: File | null;
  fichier_cv: File | null;
}

export default function DossierInscription() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    date_naissance: '',
    lieu_naissance: '',
    nationalite: '',
    adresse: '',
    code_postal: '',
    ville: '',
    departement: '',
    email: '',
    telephone: '',
    niveau_etudes: '',
    filiere_bac: '',
    annee_obtention: '',
    etablissement: '',
    dernier_diplome: '',
    numero_secu: '',
    numero_cni: '',
    niveau_anglais: '',
    entreprise_trouvee: '',
    nom_entreprise: '',
    aide_recherche: '',
    disponible_echange: '',
    creneaux_preferes: '',
    source_decouverte: '',
    newsletter: '',
    remarques: '',
  });

  const [files, setFiles] = useState<FileData>({
    fichier_cni: null,
    fichier_photos: null,
    fichier_releve: null,
    fichier_cv: null,
  });

  const [fileNames, setFileNames] = useState<{ fichier_cni: string; fichier_photos: string; fichier_releve: string; fichier_cv: string }>({
    fichier_cni: '',
    fichier_photos: '',
    fichier_releve: '',
    fichier_cv: '',
  });

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof FileData, file: File | null) => {
    setFiles((prev) => ({ ...prev, [field]: file }));
    setFileNames((prev) => ({ ...prev, [field]: file ? file.name : '' }));
  };

  const fetchAddressSuggestions = (query: string) => {
    if (addressDebounceRef.current) {
      clearTimeout(addressDebounceRef.current);
    }
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    addressDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          setAddressSuggestions(data.features);
          setShowSuggestions(true);
        } else {
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  const selectAddressSuggestion = (feature: any) => {
    const props = feature.properties;
    const context = props.context || '';
    const contextParts = context.split(', ');
    const departement = contextParts.length >= 2 ? contextParts[1] : '';
    setFormData((prev) => ({
      ...prev,
      adresse: props.name || '',
      code_postal: props.postcode || '',
      ville: props.city || '',
      departement: departement,
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${folder}/${timestamp}_${safeName}`;
    const { error } = await supabase.storage
      .from('candidatures')
      .upload(filePath, file);
    if (error) throw new Error(`Erreur upload ${file.name}: ${error.message}`);
    return filePath;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      let fichier_cni_url = '';
      let fichier_photos_url = '';
      let fichier_releve_url = '';

      if (files.fichier_cni) {
        fichier_cni_url = await uploadFile(files.fichier_cni, 'cni');
      }
      if (files.fichier_photos) {
        fichier_photos_url = await uploadFile(files.fichier_photos, 'photos');
      }
      if (files.fichier_releve) {
        fichier_releve_url = await uploadFile(files.fichier_releve, 'releves');
      }

      let fichier_cv_url = '';
      if (files.fichier_cv) {
        fichier_cv_url = await uploadFile(files.fichier_cv, 'cv');
      }

      const { error } = await supabase.from('candidatures').insert({
        prenom: formData.prenom,
        nom: formData.nom,
        date_naissance: formData.date_naissance || null,
        lieu_naissance: formData.lieu_naissance,
        nationalite: formData.nationalite,
        adresse: formData.adresse,
        code_postal: formData.code_postal,
        ville: formData.ville,
        departement: formData.departement,
        email: formData.email,
        telephone: formData.telephone,
        niveau_etudes: formData.niveau_etudes,
        filiere_bac: formData.filiere_bac,
        annee_obtention: formData.annee_obtention,
        etablissement: formData.etablissement,
        dernier_diplome: formData.dernier_diplome,
        numero_secu: formData.numero_secu,
        numero_cni: formData.numero_cni,
        niveau_anglais: formData.niveau_anglais,
        fichier_cni_url,
        fichier_photos_url,
        fichier_releve_url,
        fichier_cv_url,
        entreprise_trouvee: formData.entreprise_trouvee,
        nom_entreprise: formData.nom_entreprise,
        aide_recherche: formData.aide_recherche === 'Oui',
        disponible_echange: formData.disponible_echange === 'Oui',
        creneaux_preferes: formData.creneaux_preferes,
        source_decouverte: formData.source_decouverte,
        newsletter: formData.newsletter === 'Oui',
        remarques: formData.remarques,
      });

      if (error) throw new Error(error.message);

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Veuillez reessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal';
  const selectClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white';

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
          <p className="text-gray-600 mb-2">Merci pour votre inscription au BTS Biologie M&eacute;dicale en alternance.</p>
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
              Bienvenue dans votre dossier d&apos;inscription
            </h2>
            <p className="text-gray-600 mb-6">
              Vous &ecirc;tes sur le point de vous inscrire au <strong>BTS Biologie M&eacute;dicale en alternance</strong> chez Linova &Eacute;ducation, Paris 12e. Ce formulaire prend environ <strong>10 minutes</strong>.
            </p>
            <div className="bg-light rounded-xl p-6 mb-8">
              <h3 className="font-bold text-dark mb-3">Pr&eacute;parez ces documents avant de commencer :</h3>
              <ul className="space-y-2">
                {[
                  'Carte d\'identit\u00e9 (recto-verso) ou titre de s\u00e9jour',
                  'Photo de vous',
                  'Dernier relev\u00e9 de notes ou dipl\u00f4me obtenu',
                  'CV (format PDF)',
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
              Commencer mon inscription
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
                  <input
                    type="text"
                    required
                    placeholder="Votre pr&eacute;nom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Date de naissance *</label>
                  <input
                    type="date"
                    required
                    value={formData.date_naissance}
                    onChange={(e) => handleChange('date_naissance', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Lieu de naissance (+ d&eacute;partement) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Paris (75)"
                    value={formData.lieu_naissance}
                    onChange={(e) => handleChange('lieu_naissance', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Nationalit&eacute; *</label>
                <select
                  required
                  value={formData.nationalite}
                  onChange={(e) => handleChange('nationalite', e.target.value)}
                  className={selectClass}
                >
                  <option value="">S&eacute;lectionnez...</option>
                  {[
                    'Francaise', 'Algerienne', 'Allemande', 'Americaine', 'Belge', 'Bresilienne',
                    'Britannique', 'Camerounaise', 'Canadienne', 'Chinoise', 'Congolaise', 'Espagnole',
                    'Guineenne', 'Haitienne', 'Indienne', 'Italienne', 'Ivoirienne', 'Japonaise',
                    'Libanaise', 'Marocaine', 'Mauritanienne', 'Nigeriane', 'Polonaise', 'Portugaise',
                    'Roumaine', 'Russe', 'Senegalaise', 'Suisse', 'Tunisienne', 'Turque', 'Autre',
                  ].map((nat) => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
              </div>

              <hr className="my-6 border-gray-100" />
              <h3 className="font-bold text-dark">Coordonn&eacute;es</h3>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Adresse compl&egrave;te *</label>
                <div className="relative mb-3" ref={suggestionsRef}>
                  <input
                    type="text"
                    required
                    placeholder="Num&eacute;ro et rue"
                    value={formData.adresse}
                    onChange={(e) => {
                      handleChange('adresse', e.target.value);
                      fetchAddressSuggestions(e.target.value);
                    }}
                    onFocus={() => {
                      if (addressSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    className={inputClass}
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
                      {addressSuggestions.map((feature: any, idx: number) => (
                        <div
                          key={idx}
                          className="px-4 py-3 text-sm hover:bg-light cursor-pointer border-b border-gray-50 last:border-0"
                          onClick={() => selectAddressSuggestion(feature)}
                        >
                          {feature.properties.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Code postal"
                    value={formData.code_postal}
                    onChange={(e) => handleChange('code_postal', e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ville"
                    value={formData.ville}
                    onChange={(e) => handleChange('ville', e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="D&eacute;partement"
                    value={formData.departement}
                    onChange={(e) => handleChange('departement', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">T&eacute;l&eacute;phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    className={inputClass}
                  />
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
                <select
                  required
                  value={formData.niveau_etudes}
                  onChange={(e) => handleChange('niveau_etudes', e.target.value)}
                  className={selectClass}
                >
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
                  <input
                    type="text"
                    required
                    placeholder="Ex: STL, ST2S, G&eacute;n&eacute;ral..."
                    value={formData.filiere_bac}
                    onChange={(e) => handleChange('filiere_bac', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Ann&eacute;e d&apos;obtention *</label>
                  <input
                    type="text"
                    required
                    placeholder="2025"
                    value={formData.annee_obtention}
                    onChange={(e) => handleChange('annee_obtention', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">&Eacute;tablissement (ann&eacute;e du bac) *</label>
                <input
                  type="text"
                  required
                  placeholder="Nom du lyc&eacute;e"
                  value={formData.etablissement}
                  onChange={(e) => handleChange('etablissement', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Intitul&eacute; complet du dernier dipl&ocirc;me obtenu *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Baccalaur&eacute;at technologique STL sp&eacute;cialit&eacute; biotechnologies"
                  value={formData.dernier_diplome}
                  onChange={(e) => handleChange('dernier_diplome', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
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
                {formData.nationalite === 'Francaise' || formData.nationalite === '' ? (
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1.5">N&deg; de S&eacute;curit&eacute; Sociale *</label>
                    <input
                      type="text"
                      required={formData.nationalite === 'Francaise'}
                      placeholder="195127510234567"
                      maxLength={15}
                      minLength={15}
                      pattern="[0-9]{15}"
                      value={formData.numero_secu}
                      onChange={(e) => handleChange('numero_secu', e.target.value.replace(/\D/g, ''))}
                      className={inputClass}
                    />
                    <p className="text-xs text-gray-400 mt-1">15 chiffres, sans espaces</p>
                  </div>
                ) : (
                  <div className="bg-light rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-gray-600">Le num&eacute;ro de S&eacute;curit&eacute; Sociale sera demand&eacute; ult&eacute;rieurement pour les &eacute;tudiants &eacute;trangers.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">N&deg; Carte d&apos;identit&eacute; / Titre de s&eacute;jour *</label>
                  <input
                    type="text"
                    required
                    value={formData.numero_cni}
                    onChange={(e) => handleChange('numero_cni', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Niveau estim&eacute; en anglais *</label>
                <select
                  required
                  value={formData.niveau_anglais}
                  onChange={(e) => handleChange('niveau_anglais', e.target.value)}
                  className={selectClass}
                >
                  <option value="">S&eacute;lectionnez...</option>
                  <option value="debutant">D&eacute;butant</option>
                  <option value="intermediaire">Interm&eacute;diaire</option>
                  <option value="avance">Avanc&eacute;</option>
                  <option value="bilingue">Bilingue</option>
                </select>
              </div>

              <hr className="my-6 border-gray-100" />
              <h3 className="font-bold text-dark">Pi&egrave;ces &agrave; d&eacute;poser</h3>

              {([
                { key: 'fichier_cni' as keyof FileData, label: 'Carte d\'identit\u00e9 (recto-verso) *', accept: '.pdf,.jpg,.jpeg,.png' },
                { key: 'fichier_photos' as keyof FileData, label: 'Photo de vous *', accept: '.jpg,.jpeg,.png' },
                { key: 'fichier_releve' as keyof FileData, label: 'Relev\u00e9 de notes ou dipl\u00f4me *', accept: '.pdf,.jpg,.jpeg,.png' },
                { key: 'fichier_cv' as keyof FileData, label: 'CV (format PDF) *', accept: '.pdf' },
              ]).map((doc) => (
                <div key={doc.key}>
                  <label className="block text-sm font-medium text-dark mb-1.5">{doc.label}</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                    fileNames[doc.key] ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-teal'
                  }`}>
                    <input
                      type="file"
                      accept={doc.accept}
                      className="hidden"
                      id={`file-${doc.key}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileChange(doc.key, file);
                      }}
                    />
                    <label htmlFor={`file-${doc.key}`} className="cursor-pointer">
                      {fileNames[doc.key] ? (
                        <>
                          <svg className="w-8 h-8 text-teal mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm text-teal font-medium">{fileNames[doc.key]}</p>
                          <p className="text-xs text-gray-400 mt-1">Cliquez pour changer de fichier</p>
                        </>
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-500">Cliquez pour t&eacute;l&eacute;verser</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG (max 5 Mo)</p>
                        </>
                      )}
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
                      formData.entreprise_trouvee === opt ? 'border-teal bg-teal/5 text-teal' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="entreprise"
                        value={opt}
                        checked={formData.entreprise_trouvee === opt}
                        onChange={(e) => handleChange('entreprise_trouvee', e.target.value)}
                        className="sr-only"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {formData.entreprise_trouvee === 'Oui' && (
                <div className="bg-teal/5 rounded-xl p-5">
                  <label className="block text-sm font-medium text-dark mb-1.5">Nom de l&apos;entreprise</label>
                  <input
                    type="text"
                    placeholder="Nom de l'entreprise d'accueil"
                    value={formData.nom_entreprise}
                    onChange={(e) => handleChange('nom_entreprise', e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}

              {(formData.entreprise_trouvee === 'Non' || formData.entreprise_trouvee === 'En cours de recherche') && (
                <div className="bg-yellow/10 rounded-xl p-5">
                  <p className="text-sm text-dark font-medium mb-3">Souhaites-tu que Linova t&apos;aide dans ta recherche de contrat d&apos;alternance ?</p>
                  <div className="flex gap-3">
                    {[{ label: 'Oui, je veux de l\'aide', value: 'Oui' }, { label: 'Non merci', value: 'Non' }].map((opt) => (
                      <label key={opt.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                        formData.aide_recherche === opt.value ? 'border-teal bg-teal/5 text-teal' : 'border-gray-200 hover:border-teal'
                      }`}>
                        <input
                          type="radio"
                          name="aide"
                          value={opt.value}
                          checked={formData.aide_recherche === opt.value}
                          onChange={(e) => handleChange('aide_recherche', e.target.value)}
                          className="accent-teal"
                        />
                        {opt.label}
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
                    <label key={opt} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                      formData.disponible_echange === opt ? 'border-teal bg-teal/5 text-teal' : 'border-gray-200 hover:border-teal'
                    }`}>
                      <input
                        type="radio"
                        name="disponible"
                        value={opt}
                        checked={formData.disponible_echange === opt}
                        onChange={(e) => handleChange('disponible_echange', e.target.value)}
                        className="accent-teal"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Cr&eacute;neaux pr&eacute;f&eacute;r&eacute;s</label>
                <input
                  type="text"
                  placeholder="Ex: mardi et jeudi apr&egrave;s-midi"
                  value={formData.creneaux_preferes}
                  onChange={(e) => handleChange('creneaux_preferes', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">Comment as-tu connu Linova ?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['R\u00e9seaux sociaux', 'Google', 'Conseiller d\'orientation', 'Bouche-\u00e0-oreille', 'Salon', 'Autre'].map((opt) => (
                    <label key={opt} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                      formData.source_decouverte === opt ? 'border-teal bg-teal/5 text-teal' : 'border-gray-200 hover:border-teal'
                    }`}>
                      <input
                        type="radio"
                        name="source"
                        value={opt}
                        checked={formData.source_decouverte === opt}
                        onChange={(e) => handleChange('source_decouverte', e.target.value)}
                        className="accent-teal"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">Souhaites-tu recevoir nos infos utiles (stages, alternance, conseils) ?</label>
                <div className="flex gap-3">
                  {['Oui', 'Non'].map((opt) => (
                    <label key={opt} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                      formData.newsletter === opt ? 'border-teal bg-teal/5 text-teal' : 'border-gray-200 hover:border-teal'
                    }`}>
                      <input
                        type="radio"
                        name="newsletter"
                        value={opt}
                        checked={formData.newsletter === opt}
                        onChange={(e) => handleChange('newsletter', e.target.value)}
                        className="accent-teal"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Une remarque ou question ?</label>
                <textarea
                  rows={3}
                  placeholder="N'h&eacute;sitez pas &agrave; nous laisser un message..."
                  value={formData.remarques}
                  onChange={(e) => handleChange('remarques', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {submitError && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex gap-4 mt-10">
              <button onClick={prev} disabled={isSubmitting} className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50">
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer mon dossier'
                )}
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
