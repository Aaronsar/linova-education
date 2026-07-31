'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ACOMPTE_LABEL, ECHEANCES_CHEQUE_MAX, montantParChequeEuros, type ModeAcompte } from '@/lib/acompte';
import StripeAcompteBlock from '@/components/StripeAcompteBlock';
import SignaturePad from '@/components/SignaturePad';

const steps = [
  { id: 1, title: 'Identité' },
  { id: 2, title: 'Parcours' },
  { id: 3, title: 'Projet' },
  { id: 4, title: 'Documents' },
  { id: 5, title: 'Signature' },
  { id: 6, title: 'Paiement' },
];

const BAC_OPTIONS = [
  { value: 'general', label: 'Baccalauréat général — spécialités scientifiques' },
  { value: 'stl', label: 'Baccalauréat technologique STL (Biotechnologies ou SPCL)' },
  { value: 'pro', label: 'Baccalauréat professionnel (ASSP, SAPAT ou autre)' },
  { value: 'etranger', label: 'Diplôme étranger' },
] as const;

const SOURCE_OPTIONS = [
  'Internet',
  'Réseaux sociaux',
  'Établissement scolaire',
  'Salon étudiant',
  'Recommandation',
] as const;

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
  type_bac: string;
  precision_bac: string;
  annee_obtention: string;
  etablissement: string;
  bulletin_joint: boolean;
  motivation: string;
  poursuite_etudes: string;
  source_decouverte: string;
  source_recommandation: string;
  urgence_nom: string;
  urgence_telephone: string;
  urgence_lien: string;
  situation_particuliere: string;
  droit_image: string;
  certifie_exactitude: boolean;
  engage_assiduite: boolean;
  accepte_cgi: boolean;
  accepte_cgs: boolean;
  accord_representant: boolean;
  signature_nom: string;
  signature_image: string;
  /** Nombre de chèques pour le solde annuel (1 à 10). */
  nb_cheques: number;
  /** Acompte de pré-inscription : carte ou chèque. */
  mode_acompte: '' | ModeAcompte;
  stripe_payment_intent_id: string;
  /** Engagement d'envoyer rapidement le chèque d'acompte. */
  engage_depot_cheque: boolean;
}

type FileKey =
  | 'fichier_cni'
  | 'fichier_photos'
  | 'fichier_releve'
  | 'fichier_bulletins'
  | 'fichier_cv'
  | 'fichier_motivation'
  | 'fichier_jdc'
  | 'fichier_rc'
  | 'fichier_bourse';

type FileData = Record<FileKey, File | null>;
type FileNames = Record<FileKey, string>;

const EMPTY_FILES: FileData = {
  fichier_cni: null,
  fichier_photos: null,
  fichier_releve: null,
  fichier_bulletins: null,
  fichier_cv: null,
  fichier_motivation: null,
  fichier_jdc: null,
  fichier_rc: null,
  fichier_bourse: null,
};

const EMPTY_FILE_NAMES: FileNames = {
  fichier_cni: '',
  fichier_photos: '',
  fichier_releve: '',
  fichier_bulletins: '',
  fichier_cv: '',
  fichier_motivation: '',
  fichier_jdc: '',
  fichier_rc: '',
  fichier_bourse: '',
};

export default function InscriptionInitial() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [reference, setReference] = useState('');

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
    type_bac: '',
    precision_bac: '',
    annee_obtention: '',
    etablissement: '',
    bulletin_joint: false,
    motivation: '',
    poursuite_etudes: '',
    source_decouverte: '',
    source_recommandation: '',
    urgence_nom: '',
    urgence_telephone: '',
    urgence_lien: '',
    situation_particuliere: '',
    droit_image: '',
    certifie_exactitude: false,
    engage_assiduite: false,
    accepte_cgi: false,
    accepte_cgs: false,
    accord_representant: false,
    signature_nom: '',
    signature_image: '',
    nb_cheques: 1,
    mode_acompte: '',
    stripe_payment_intent_id: '',
    engage_depot_cheque: false,
  });

  const [files, setFiles] = useState<FileData>({ ...EMPTY_FILES });
  const [fileNames, setFileNames] = useState<FileNames>({ ...EMPTY_FILE_NAMES });

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: FileKey, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setSubmitError(`Le fichier « ${file.name} » dépasse 10 Mo.`);
      return;
    }
    setSubmitError('');
    setFiles((prev) => ({ ...prev, [field]: file }));
    setFileNames((prev) => ({ ...prev, [field]: file ? file.name : '' }));
  };

  const fetchAddressSuggestions = (query: string) => {
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    addressDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await res.json();
        if (data.features?.length > 0) {
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
      departement,
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

  const next = () => {
    setSubmitError('');
    setStep((s) => Math.min(s + 1, 6));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => {
    setSubmitError('');
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMinor = (() => {
    if (!formData.date_naissance) return false;
    const birth = new Date(formData.date_naissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age < 18;
  })();

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `initial/${folder}/${timestamp}_${safeName}`;
    const { error } = await supabase.storage.from('candidatures').upload(filePath, file);
    if (error) throw new Error(`Erreur upload ${file.name}: ${error.message}`);
    return filePath;
  };

  const signatureNomOk = (() => {
    const expected = `${formData.prenom} ${formData.nom}`.trim().toLowerCase().replace(/\s+/g, ' ');
    const typed = formData.signature_nom.trim().toLowerCase().replace(/\s+/g, ' ');
    return typed.length > 0 && typed === expected;
  })();

  const canSubmit =
    formData.certifie_exactitude &&
    formData.engage_assiduite &&
    formData.accepte_cgi &&
    formData.accepte_cgs &&
    signatureNomOk &&
    Boolean(formData.signature_image) &&
    (!isMinor || formData.accord_representant);

  const planChequesOk =
    formData.nb_cheques >= 1 && formData.nb_cheques <= ECHEANCES_CHEQUE_MAX;

  const handleSubmit = async (paymentOverride?: {
    mode_acompte: ModeAcompte;
    stripe_payment_intent_id?: string;
  }) => {
    const mode = paymentOverride?.mode_acompte || formData.mode_acompte;
    const stripeId =
      paymentOverride?.stripe_payment_intent_id || formData.stripe_payment_intent_id;

    if (!canSubmit) {
      setSubmitError('Merci de cocher toutes les déclarations obligatoires avant de valider.');
      return;
    }
    if (!planChequesOk) {
      setSubmitError(`Indiquez le nombre de chèques pour l’année (1 à ${ECHEANCES_CHEQUE_MAX}).`);
      return;
    }
    if (!mode) {
      setSubmitError('Choisissez le mode de règlement de l’acompte (carte ou chèque).');
      return;
    }
    if (mode === 'carte' && !stripeId) {
      setSubmitError('Finalisez le paiement par carte de l’acompte avant d’envoyer le dossier.');
      return;
    }
    if (mode === 'cheque' && !formData.engage_depot_cheque) {
      setSubmitError(
        'Confirmez que vous enverrez le chèque d’acompte dès que possible pour bloquer votre inscription.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const uploads: Partial<Record<FileKey, string>> = {};
      const uploadMap: { key: FileKey; folder: string }[] = [
        { key: 'fichier_cni', folder: 'cni' },
        { key: 'fichier_photos', folder: 'photos' },
        { key: 'fichier_releve', folder: 'releves' },
        { key: 'fichier_bulletins', folder: 'bulletins' },
        { key: 'fichier_cv', folder: 'cv' },
        { key: 'fichier_motivation', folder: 'motivation' },
        { key: 'fichier_jdc', folder: 'jdc' },
        { key: 'fichier_rc', folder: 'rc' },
        { key: 'fichier_bourse', folder: 'bourse' },
      ];

      for (const { key, folder } of uploadMap) {
        const file = files[key];
        if (file) uploads[key] = await uploadFile(file, folder);
      }

      let signature_url = '';
      if (formData.signature_image) {
        const res = await fetch(formData.signature_image);
        const blob = await res.blob();
        const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
        signature_url = await uploadFile(file, 'signatures');
      }

      const bacLabel = BAC_OPTIONS.find((o) => o.value === formData.type_bac)?.label || formData.type_bac;
      const filiere =
        formData.precision_bac.trim().length > 0
          ? `${bacLabel} — ${formData.precision_bac.trim()}`
          : bacLabel;

      const source =
        formData.source_decouverte === 'Recommandation' && formData.source_recommandation
          ? `Recommandation : ${formData.source_recommandation}`
          : formData.source_decouverte;

      const montantCheque = montantParChequeEuros(formData.nb_cheques);

      const acompteLine =
        mode === 'carte'
          ? `Acompte pré-inscription (${ACOMPTE_LABEL}) : payé par carte · Stripe PI=${stripeId}`
          : `Acompte pré-inscription (${ACOMPTE_LABEL}) : chèque — envoi/dépôt dès que possible pour bloquer l'inscription (en attente de réception)`;

      const remarques = [
        '=== DOSSIER FORMATION INITIALE 2026-2028 ===',
        `Motivation : ${formData.motivation}`,
        `Poursuite d'études : ${formData.poursuite_etudes}`,
        `Contact urgence : ${formData.urgence_nom} — ${formData.urgence_telephone} (${formData.urgence_lien})`,
        `Situation particulière : ${formData.situation_particuliere || 'Non'}`,
        `Droit à l'image : ${formData.droit_image}`,
        `Bulletin joint déclaré : ${formData.bulletin_joint ? 'Oui' : 'Non'}`,
        formData.precision_bac ? `Précision bac : ${formData.precision_bac}` : null,
        uploads.fichier_bulletins ? `Bulletins : ${uploads.fichier_bulletins}` : null,
        uploads.fichier_motivation ? `Lettre motivation : ${uploads.fichier_motivation}` : null,
        uploads.fichier_jdc ? `JDC : ${uploads.fichier_jdc}` : null,
        uploads.fichier_rc ? `RC : ${uploads.fichier_rc}` : null,
        uploads.fichier_bourse ? `Bourse : ${uploads.fichier_bourse}` : null,
        `CGI acceptées : oui`,
        `CGS acceptées : oui`,
        `Signature électronique : ${formData.signature_nom} · ${new Date().toISOString()}`,
        signature_url ? `Signature image : ${signature_url}` : null,
        `Mineur : ${isMinor ? 'oui' : 'non'}${isMinor ? ` — accord représentant : ${formData.accord_representant ? 'oui' : 'non'}` : ''}`,
        acompteLine,
        `Paiement annuel : ${formData.nb_cheques} chèque(s) · ~${montantCheque.toFixed(2)} € / chèque (indicatif hors tarif boursier)`,
      ]
        .filter(Boolean)
        .join('\n');

      const { data, error } = await supabase
        .from('candidatures')
        .insert({
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
          niveau_etudes: formData.annee_obtention ? `Bac ${formData.annee_obtention}` : 'Bac',
          filiere_bac: filiere,
          annee_obtention: formData.annee_obtention,
          etablissement: formData.etablissement,
          dernier_diplome: filiere,
          numero_secu: '',
          numero_cni: '',
          niveau_anglais: '',
          fichier_cni_url: uploads.fichier_cni || '',
          fichier_photos_url: uploads.fichier_photos || '',
          fichier_releve_url: uploads.fichier_releve || '',
          fichier_cv_url: uploads.fichier_cv || '',
          entreprise_trouvee: 'Formation initiale',
          nom_entreprise: '',
          aide_recherche: false,
          disponible_echange: 'Oui',
          creneaux_preferes: '',
          source_decouverte: source,
          newsletter: false,
          remarques,
          statut: 'nouveau',
        })
        .select('id')
        .single();

      if (error) throw new Error(error.message);

      const ref = data?.id
        ? `INI-${String(data.id).slice(0, 8).toUpperCase()}`
        : `INI-${Date.now().toString(36).toUpperCase()}`;
      setReference(ref);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardPaid = async (paymentIntentId: string) => {
    if (!planChequesOk) {
      setSubmitError(`Indiquez d’abord le nombre de chèques pour l’année (1 à ${ECHEANCES_CHEQUE_MAX}).`);
      return;
    }
    handleChange('mode_acompte', 'carte');
    handleChange('stripe_payment_intent_id', paymentIntentId);
    await handleSubmit({ mode_acompte: 'carte', stripe_payment_intent_id: paymentIntentId });
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal';
  const selectClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white';

  const FileUpload = ({
    fileKey,
    label,
    required,
    accept = '.pdf,.jpg,.jpeg,.png',
  }: {
    fileKey: FileKey;
    label: string;
    required?: boolean;
    accept?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-dark mb-1.5">
        {label}
        {required ? ' *' : ' (facultatif)'}
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${
          fileNames[fileKey] ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-teal'
        }`}
      >
        <input
          type="file"
          accept={accept}
          className="hidden"
          id={`file-${fileKey}`}
          onChange={(e) => handleFileChange(fileKey, e.target.files?.[0] || null)}
        />
        <label htmlFor={`file-${fileKey}`} className="cursor-pointer block">
          {fileNames[fileKey] ? (
            <>
              <p className="text-sm text-teal font-medium">{fileNames[fileKey]}</p>
              <p className="text-xs text-gray-400 mt-1">Cliquez pour changer</p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">Cliquez pour téléverser</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG ou PNG — 10 Mo max</p>
            </>
          )}
        </label>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 md:p-12 max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[var(--font-outfit)] text-3xl font-bold text-dark mb-4">
            Candidature envoyée
          </h1>
          <p className="text-gray-600 mb-2">
            Merci pour votre inscription au <strong>BTS Biologie Médicale — formation initiale</strong>.
          </p>
          {reference && (
            <p className="text-sm text-gray-500 mb-4">
              Référence : <span className="font-mono font-semibold text-dark">{reference}</span>
            </p>
          )}
          <p className="text-gray-600 mb-8">
            Un accusé de réception vous est adressé par courriel
            {formData.mode_acompte === 'cheque'
              ? '. Pensez à déposer / envoyer votre chèque d’acompte dès que possible pour bloquer votre inscription'
              : ', avec la confirmation du paiement de l’acompte'}
            , et le détail de votre échéancier ({formData.nb_cheques} chèque
            {formData.nb_cheques > 1 ? 's' : ''} pour l’année). Nous vous proposons un entretien
            sous <strong>48 heures ouvrées</strong>.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-navy text-white font-semibold rounded-full hover:brightness-95 transition-all"
          >
            Retour à l&apos;accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-navy py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Image
              src="/images/logos/logo-sans-baseline-blanc.svg"
              alt="Linova"
              width={120}
              height={35}
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Dossier d&apos;inscription</h1>
          <p className="text-xl text-teal font-semibold mb-2">
            BTS Biologie Médicale — Formation initiale
          </p>
          <p className="text-gray-400 text-sm">Cycle 2026 — 2028 · Rentrée septembre 2026</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {step > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step >= s.id ? 'bg-teal text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step > s.id ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      s.id
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 hidden sm:block ${
                      step >= s.id ? 'text-teal font-semibold' : 'text-gray-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-500"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Intro */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
            <div>
              <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-4">
                Bienvenue chez Linova
              </h2>
              <p className="text-gray-600">
                S&apos;inscrire chez Linova, c&apos;est rejoindre une école entièrement dédiée aux
                métiers de la santé. Ce dossier concerne le{' '}
                <strong>BTS Biologie Médicale en formation initiale</strong> (cycle 2026-2028). La
                saisie prend environ <strong>15 minutes</strong>.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-dark mb-3">Comment se déroule votre inscription</h3>
              <ol className="space-y-3">
                {[
                  'Vous complétez le formulaire et déposez vos pièces justificatives.',
                  'Vous validez le dossier : acompte de pré-inscription (400 €) par carte ou chèque, puis échéancier annuel (jusqu’à 10 chèques).',
                  'Nous examinons votre candidature et proposons un entretien sous 48 h ouvrées.',
                  'Vous recevez notre réponse sous 10 jours ouvrés après l’entretien.',
                  'En cas d’admission, votre place est confirmée ; le solde se règle ensuite selon l’échéancier.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal/10 text-teal text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-light rounded-xl p-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Formation</p>
                <p className="font-medium text-dark">BTS Biologie Médicale — initiale</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Durée</p>
                <p className="font-medium text-dark">2 ans — 2026-2028</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Lieu</p>
                <p className="font-medium text-dark">85 av. Ledru-Rollin, 75012 Paris</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Frais de scolarité</p>
                <p className="font-medium text-dark">6 000 € / an · 5 000 € boursiers</p>
              </div>
            </div>

            <div className="bg-teal/5 border border-teal/20 rounded-xl p-5 text-sm text-gray-700">
              <p className="font-semibold text-dark mb-2">Remboursement — en un coup d&apos;œil</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Droit de rétractation de 14 jours (acompte remboursé).</li>
                <li>Remboursement intégral : échec au bac, refus de titre de séjour, formation non ouverte.</li>
                <li>Tout remboursement dû sous 30 jours maximum.</li>
              </ul>
            </div>

            <div className="bg-light rounded-xl p-6">
              <h3 className="font-bold text-dark mb-3">Préparez ces documents</h3>
              <ul className="space-y-2">
                {[
                  'Pièce d’identité (recto/verso)',
                  'Photo d’identité récente',
                  'Diplôme du bac ou relevé de notes le plus récent',
                  'Bulletins de Terminale (et Première si disponibles)',
                  'CV et lettre de motivation',
                  'JDC (si moins de 25 ans)',
                  'Attestation d’assurance responsabilité civile',
                  'Notification de bourse (le cas échéant)',
                ].map((doc, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                    <svg
                      className="w-5 h-5 text-teal flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                Le numéro de sécurité sociale et le RIB ne sont demandés qu&apos;après admission.
              </p>
            </div>

            <button
              onClick={next}
              className="w-full py-4 bg-yellow text-dark font-semibold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer"
            >
              Commencer mon inscription
            </button>
          </div>
        )}

        {/* Step 1 — Identité */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">
              Identité du candidat
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Tous les champs sont obligatoires, sauf mention contraire.
            </p>
            <p className="text-xs text-gray-500 mb-6">
              Les données sont traitées par Linova Éducation pour la gestion de votre candidature
              (RGPD).{' '}
              <a href="/conditions-generales-de-services" className="text-teal underline">
                En savoir plus
              </a>
              .
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Prénom *</label>
                  <input
                    type="text"
                    required
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
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_naissance}
                    onChange={(e) => handleChange('date_naissance', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Lieu de naissance *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ville (+ département)"
                    value={formData.lieu_naissance}
                    onChange={(e) => handleChange('lieu_naissance', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Nationalité *</label>
                <select
                  required
                  value={formData.nationalite}
                  onChange={(e) => handleChange('nationalite', e.target.value)}
                  className={selectClass}
                >
                  <option value="">Sélectionnez...</option>
                  {[
                    'Française',
                    'Algérienne',
                    'Allemande',
                    'Américaine',
                    'Belge',
                    'Brésilienne',
                    'Britannique',
                    'Camerounaise',
                    'Canadienne',
                    'Chinoise',
                    'Congolaise',
                    'Espagnole',
                    'Guinéenne',
                    'Haïtienne',
                    'Indienne',
                    'Italienne',
                    'Ivoirienne',
                    'Japonaise',
                    'Libanaise',
                    'Marocaine',
                    'Mauritanienne',
                    'Nigériane',
                    'Polonaise',
                    'Portugaise',
                    'Roumaine',
                    'Russe',
                    'Sénégalaise',
                    'Suisse',
                    'Tunisienne',
                    'Turque',
                    'Autre',
                  ].map((nat) => (
                    <option key={nat} value={nat}>
                      {nat}
                    </option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-100" />
              <h3 className="font-bold text-dark">Coordonnées</h3>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Adresse complète *
                </label>
                <div className="relative mb-3" ref={suggestionsRef}>
                  <input
                    type="text"
                    required
                    placeholder="Numéro et rue"
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
                    placeholder="Département"
                    value={formData.departement}
                    onChange={(e) => handleChange('departement', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Téléphone portable *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="06 12 34 56 78"
                    value={formData.telephone}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={next}
                className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Situation scolaire */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">
              Situation scolaire
            </h2>
            <p className="text-gray-500 text-sm mb-8">Votre baccalauréat et votre établissement</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-3">Type de baccalauréat *</label>
                <div className="space-y-2">
                  {BAC_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        formData.type_bac === opt.value
                          ? 'border-teal bg-teal/5 text-teal'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type_bac"
                        value={opt.value}
                        checked={formData.type_bac === opt.value}
                        onChange={(e) => handleChange('type_bac', e.target.value)}
                        className="mt-0.5 accent-teal"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {(formData.type_bac === 'general' ||
                formData.type_bac === 'pro' ||
                formData.type_bac === 'etranger') && (
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    {formData.type_bac === 'general'
                      ? 'Spécialités *'
                      : formData.type_bac === 'pro'
                        ? 'Précisez la filière *'
                        : 'Précisez le diplôme *'}
                  </label>
                  <input
                    type="text"
                    value={formData.precision_bac}
                    onChange={(e) => handleChange('precision_bac', e.target.value)}
                    className={inputClass}
                    placeholder={
                      formData.type_bac === 'general'
                        ? 'Ex. SVT, Physique-Chimie…'
                        : 'Précision'
                    }
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Année d&apos;obtention (ou prévue) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2026"
                    value={formData.annee_obtention}
                    onChange={(e) => handleChange('annee_obtention', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Établissement fréquenté cette année *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nom du lycée / établissement"
                    value={formData.etablissement}
                    onChange={(e) => handleChange('etablissement', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <label
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                  formData.bulletin_joint
                    ? 'border-teal bg-teal/5 text-teal'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.bulletin_joint}
                  onChange={(e) => handleChange('bulletin_joint', e.target.checked)}
                  className="mt-0.5 accent-teal"
                />
                Le dernier bulletin de notes disponible est joint au dossier
              </label>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={prev}
                className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={next}
                className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Projet */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">
              Projet d&apos;orientation
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Motivation, poursuite d&apos;études et contact d&apos;urgence
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Pourquoi avez-vous choisi le BTS Biologie Médicale ? *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.motivation}
                  onChange={(e) => handleChange('motivation', e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Expliquez votre motivation…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">
                  Envisagez-vous une poursuite d&apos;études après le BTS ? *
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Oui', 'Non', 'Je ne sais pas encore'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                        formData.poursuite_etudes === opt
                          ? 'border-teal bg-teal/5 text-teal'
                          : 'border-gray-200 hover:border-teal'
                      }`}
                    >
                      <input
                        type="radio"
                        name="poursuite"
                        value={opt}
                        checked={formData.poursuite_etudes === opt}
                        onChange={(e) => handleChange('poursuite_etudes', e.target.value)}
                        className="accent-teal"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">
                  Comment avez-vous connu Linova ? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SOURCE_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                        formData.source_decouverte === opt
                          ? 'border-teal bg-teal/5 text-teal'
                          : 'border-gray-200 hover:border-teal'
                      }`}
                    >
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
                {formData.source_decouverte === 'Recommandation' && (
                  <input
                    type="text"
                    className={`${inputClass} mt-3`}
                    placeholder="Par qui ?"
                    value={formData.source_recommandation}
                    onChange={(e) => handleChange('source_recommandation', e.target.value)}
                  />
                )}
              </div>

              <hr className="border-gray-100" />
              <h3 className="font-bold text-dark">Personne à contacter en cas d&apos;urgence</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.urgence_nom}
                    onChange={(e) => handleChange('urgence_nom', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.urgence_telephone}
                    onChange={(e) => handleChange('urgence_telephone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Lien de parenté *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex. mère, père, tuteur…"
                  value={formData.urgence_lien}
                  onChange={(e) => handleChange('urgence_lien', e.target.value)}
                  className={inputClass}
                />
              </div>

              <hr className="border-gray-100" />

              <div>
                <label className="block text-sm font-medium text-dark mb-3">
                  Souhaitez-vous signaler une situation particulière (santé, handicap, aménagement)
                  ? *
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Si oui, un échange confidentiel vous sera proposé avec notre référent handicap
                  (Meryeme Benramdane). Cette information n&apos;entre pas dans l&apos;appréciation
                  de votre candidature.
                </p>
                <div className="flex gap-3">
                  {['Oui', 'Non'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 cursor-pointer transition-all text-sm ${
                        formData.situation_particuliere === opt
                          ? 'border-teal bg-teal/5 text-teal'
                          : 'border-gray-200 hover:border-teal'
                      }`}
                    >
                      <input
                        type="radio"
                        name="situation"
                        value={opt}
                        checked={formData.situation_particuliere === opt}
                        onChange={(e) => handleChange('situation_particuliere', e.target.value)}
                        className="accent-teal"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-3">Droit à l&apos;image *</label>
                <p className="text-xs text-gray-500 mb-3">
                  Réponse libre, sans incidence sur la candidature, révocable à tout moment
                  (article 15).
                </p>
                <div className="space-y-2">
                  {[
                    {
                      value: 'autorise',
                      label: "J'autorise Linova Éducation à utiliser mon image dans ses supports de communication",
                    },
                    { value: 'refuse', label: 'Je ne l’autorise pas' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        formData.droit_image === opt.value
                          ? 'border-teal bg-teal/5 text-teal'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="droit_image"
                        value={opt.value}
                        checked={formData.droit_image === opt.value}
                        onChange={(e) => handleChange('droit_image', e.target.value)}
                        className="mt-0.5 accent-teal"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={prev}
                className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={next}
                className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Documents */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">
              Pièces à téléverser
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Formats acceptés : PDF, JPG ou PNG — 10 Mo max par fichier. Un dossier incomplet
              reste enregistrable : vous pourrez compléter plus tard si besoin.
            </p>

            <div className="space-y-5">
              <FileUpload fileKey="fichier_cni" label="Pièce d'identité (recto/verso)" required />
              <FileUpload
                fileKey="fichier_photos"
                label="Photo d'identité récente"
                required
                accept=".jpg,.jpeg,.png"
              />
              <FileUpload
                fileKey="fichier_releve"
                label="Diplôme du bac / attestation / relevé de notes"
                required
              />
              <FileUpload fileKey="fichier_bulletins" label="Bulletins de Terminale (et Première)" />
              <FileUpload fileKey="fichier_cv" label="Curriculum vitae" required accept=".pdf,.jpg,.jpeg,.png" />
              <FileUpload fileKey="fichier_motivation" label="Lettre de motivation" />
              <FileUpload fileKey="fichier_jdc" label="Certificat JDC (moins de 25 ans)" />
              <FileUpload
                fileKey="fichier_rc"
                label="Attestation d'assurance responsabilité civile"
              />
              <FileUpload fileKey="fichier_bourse" label="Notification de bourse" />
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Le RIB n&apos;est demandé qu&apos;après admission, uniquement pour le prélèvement
              SEPA.
            </p>

            <div className="flex gap-4 mt-10">
              <button
                onClick={prev}
                className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={next}
                className="flex-1 py-3.5 bg-teal text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Signature CGI / CGS */}
        {step === 5 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">
              Conditions générales et signature
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Lisez les conditions, acceptez-les, puis apposez votre signature électronique avant de
              passer au paiement.
            </p>

            <div className="bg-light rounded-xl p-5 mb-8 text-sm space-y-2">
              <p>
                <span className="text-gray-500">Candidat :</span>{' '}
                <strong>
                  {formData.prenom} {formData.nom}
                </strong>
              </p>
              <p>
                <span className="text-gray-500">Formation :</span>{' '}
                <strong>BTS Biologie Médicale — formation initiale — 2026-2028</strong>
              </p>
              <p>
                <span className="text-gray-500">Frais annuels :</span> 6 000 € (5 000 € boursiers)
              </p>
              <p>
                <span className="text-gray-500">Acompte de pré-inscription :</span>{' '}
                <strong>{ACOMPTE_LABEL}</strong> (carte ou chèque)
              </p>
              <p>
                <span className="text-gray-500">Lieu :</span> 85 avenue Ledru-Rollin, 75012 Paris
              </p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-dark mb-3">
                Conditions générales d&apos;inscription (CGI)
              </h3>
              <div className="border border-gray-200 rounded-xl p-4 max-h-56 overflow-y-auto text-xs text-gray-600 space-y-3 leading-relaxed">
                <p>
                  <strong>Art. 1 —</strong> Inscription au BTS Biologie Médicale en formation
                  initiale, contrat conclu à distance (droit de rétractation art. 6).
                </p>
                <p>
                  <strong>Art. 2 —</strong> Formation de sept. 2026 à juin 2028, sous statut
                  étudiant, avec stages obligatoires.
                </p>
                <p>
                  <strong>Art. 5 —</strong> Acompte de {ACOMPTE_LABEL} (carte ou chèque) ; solde
                  annuel par chèque (1 à 10 échéances).
                </p>
                <p>
                  <strong>Art. 6 —</strong> Rétractation sous 14 jours calendaires sans frais ;
                  remboursement intégral de l&apos;acompte.
                </p>
                <p>
                  <strong>Art. 7 —</strong> Désistement après ce délai et avant la rentrée :
                  acompte de {ACOMPTE_LABEL} acquis à Linova.
                </p>
                <p>
                  <strong>Art. 8 —</strong> Interruption après rentrée : barème dégressif (25 % /
                  50 % / 75 % / 100 % des frais annuels selon la date).
                </p>
                <p>
                  <strong>Art. 9 —</strong> Remboursement intégral : non-obtention du bac, refus de
                  visa/titre de séjour, formation non ouverte.
                </p>
                <p>
                  <strong>Art. 14 —</strong> Données personnelles traitées pour la candidature et
                  la scolarité ; droits RGPD exercables auprès du DPO Linova ; réclamation CNIL
                  possible.
                </p>
                <p>
                  <strong>Art. 19 —</strong> La validation électronique vaut signature (art. 1366
                  et 1367 du code civil).
                </p>
                <p className="text-gray-400">
                  Le formulaire type de rétractation (annexe B) vous sera joint au courriel de
                  confirmation d&apos;inscription.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-dark mb-3">
                Conditions générales de services (CGS)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Les CGS de Linova Éducation font partie du contrat de formation (rang supérieur aux
                CGI). Merci de les consulter avant de signer.
              </p>
              <a
                href="/conditions-generales-de-services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline mb-4"
              >
                Ouvrir les Conditions générales de services
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            <div className="space-y-3 mb-8">
              {(
                [
                  {
                    key: 'certifie_exactitude' as const,
                    label:
                      'Je certifie l’exactitude des informations fournies dans le présent dossier.',
                  },
                  {
                    key: 'engage_assiduite' as const,
                    label:
                      'Je m’engage à suivre avec assiduité la formation BTS Biologie Médicale dispensée par Linova Éducation.',
                  },
                  {
                    key: 'accepte_cgi' as const,
                    label:
                      'J’ai lu et j’accepte les conditions générales d’inscription (CGI), et notamment les articles 6 à 10 relatifs à la rétractation, au désistement et au remboursement.',
                  },
                  {
                    key: 'accepte_cgs' as const,
                    label:
                      'J’ai lu et j’accepte les Conditions Générales de Services (CGS) de Linova Éducation.',
                  },
                ] as const
              ).map((item) => (
                <label
                  key={item.key}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                    formData[item.key]
                      ? 'border-teal bg-teal/5 text-dark'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData[item.key]}
                    onChange={(e) => handleChange(item.key, e.target.checked)}
                    className="mt-0.5 accent-teal"
                  />
                  {item.label}
                </label>
              ))}

              {isMinor && (
                <label
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                    formData.accord_representant
                      ? 'border-teal bg-teal/5 text-dark'
                      : 'border-yellow/40 bg-yellow/5 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.accord_representant}
                    onChange={(e) => handleChange('accord_representant', e.target.checked)}
                    className="mt-0.5 accent-teal"
                  />
                  Je suis mineur(e) et déclare disposer de l&apos;accord de mon représentant légal
                  (coordonnées d&apos;urgence renseignées). Un lien de contresignature lui sera
                  adressé par courriel.
                </label>
              )}
            </div>

            <div className="mb-8 rounded-xl border border-gray-200 p-5 space-y-5">
              <div>
                <h3 className="font-bold text-dark mb-1">Signature électronique</h3>
                <p className="text-xs text-gray-500">
                  Conformément à l&apos;article 19 des CGI et aux articles 1366 et 1367 du code
                  civil, votre signature ci-dessous a la même valeur qu&apos;une signature
                  manuscrite.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Nom et prénom (tels qu&apos;indiqués à l&apos;identité) *
                </label>
                <input
                  type="text"
                  value={formData.signature_nom}
                  onChange={(e) => handleChange('signature_nom', e.target.value)}
                  placeholder={`${formData.prenom} ${formData.nom}`.trim() || 'Prénom Nom'}
                  className={inputClass}
                />
                {formData.signature_nom && !signatureNomOk && (
                  <p className="text-xs text-amber-700 mt-1.5">
                    Le nom signé doit correspondre à « {formData.prenom} {formData.nom} ».
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Dessinez votre signature *
                </label>
                <SignaturePad
                  value={formData.signature_image}
                  onChange={(dataUrl) => handleChange('signature_image', dataUrl)}
                />
              </div>

              <p className="text-xs text-gray-400">
                Date et heure de signature : enregistrées automatiquement à la validation du
                dossier.
              </p>
            </div>

            {submitError && step === 5 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={prev}
                className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={() => {
                  if (!canSubmit) {
                    setSubmitError(
                      !formData.accepte_cgi || !formData.accepte_cgs
                        ? 'Acceptez les CGI et les CGS avant de continuer.'
                        : !signatureNomOk || !formData.signature_image
                          ? 'Complétez votre signature électronique (nom + signature dessinée).'
                          : 'Merci de cocher toutes les déclarations obligatoires avant de continuer.'
                    );
                    return;
                  }
                  next();
                }}
                disabled={!canSubmit}
                className="flex-1 py-4 bg-teal text-white font-bold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Signer et continuer vers le paiement
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              Prochaine étape : règlement de l&apos;acompte de {ACOMPTE_LABEL} (carte ou chèque).
            </p>
          </div>
        )}

        {/* Step 6 — Paiement */}
        {step === 6 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
            <h2 className="font-[var(--font-outfit)] text-2xl font-bold text-dark mb-2">
              Paiement
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Choisissez votre échéancier annuel, puis réglez l&apos;acompte de pré-inscription (
              {ACOMPTE_LABEL}) par carte ou par chèque.
            </p>

            {/* 1. Échéancier annuel — chèques uniquement */}
            <div className="mb-10">
              <h3 className="font-bold text-dark mb-2">1. Paiement du solde annuel</h3>
              <p className="text-sm text-gray-500 mb-4">
                Le solde se règle uniquement par chèque. Combien de chèques souhaitez-vous
                prévoir ? (1 à {ECHEANCES_CHEQUE_MAX})
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: ECHEANCES_CHEQUE_MAX }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      handleChange('nb_cheques', n);
                      setSubmitError('');
                    }}
                    className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                      formData.nb_cheques === n
                        ? 'border-teal bg-teal/5 text-teal'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Environ{' '}
                <strong className="text-dark">
                  {montantParChequeEuros(formData.nb_cheques).toFixed(2)} €
                </strong>{' '}
                par chèque (indicatif, hors tarif boursier) — solde après acompte de{' '}
                {ACOMPTE_LABEL}.
              </p>
            </div>

            {/* 2. Acompte — carte ou chèque */}
            <div className="mb-6">
              <h3 className="font-bold text-dark mb-2">2. Acompte de pré-inscription</h3>
              <p className="text-sm text-gray-500 mb-4">
                Montant : <strong className="text-dark">{ACOMPTE_LABEL}</strong>, imputé sur les
                frais de scolarité. Carte ou chèque.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {(
                  [
                    {
                      value: 'carte' as const,
                      title: 'Carte bancaire',
                      desc: 'Paiement immédiat — place bloquée tout de suite',
                    },
                    {
                      value: 'cheque' as const,
                      title: 'Chèque',
                      desc: 'À déposer / envoyer dès que possible pour bloquer l’inscription',
                    },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col gap-1 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.mode_acompte === opt.value
                        ? 'border-teal bg-teal/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mode_acompte"
                        value={opt.value}
                        checked={formData.mode_acompte === opt.value}
                        onChange={() => {
                          handleChange('mode_acompte', opt.value);
                          handleChange('stripe_payment_intent_id', '');
                          handleChange('engage_depot_cheque', false);
                          setSubmitError('');
                        }}
                        className="accent-teal"
                      />
                      <span className="font-semibold text-dark text-sm">{opt.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 pl-6">{opt.desc}</span>
                  </label>
                ))}
              </div>

              {formData.mode_acompte === 'carte' && (
                <div>
                  {!planChequesOk ? (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4">
                      Indiquez d&apos;abord le nombre de chèques pour l&apos;année.
                    </p>
                  ) : (
                    <StripeAcompteBlock
                      email={formData.email}
                      prenom={formData.prenom}
                      nom={formData.nom}
                      onPaid={handleCardPaid}
                      disabled={isSubmitting}
                    />
                  )}
                  {isSubmitting && (
                    <p className="text-sm text-gray-500 text-center mt-4">
                      Paiement reçu — envoi du dossier en cours…
                    </p>
                  )}
                </div>
              )}

              {formData.mode_acompte === 'cheque' && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 space-y-2">
                    <p className="font-semibold">
                      Important — bloquer votre inscription
                    </p>
                    <p>
                      Si vous payez l&apos;acompte par chèque, vous devez le{' '}
                      <strong>déposer ou l&apos;envoyer dès que possible</strong>. La place
                      n&apos;est définitivement bloquée qu&apos;à réception du chèque.
                    </p>
                  </div>

                  <div className="rounded-xl bg-light border border-gray-100 p-5 text-sm text-gray-700 space-y-2">
                    <p className="font-semibold text-dark">Modalités</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        Montant : <strong>{ACOMPTE_LABEL}</strong>
                      </li>
                      <li>
                        Ordre : <strong>Linova Éducation</strong>
                      </li>
                      <li>
                        Adresse : <strong>85, avenue Ledru-Rollin — 75012 Paris</strong>
                      </li>
                      <li>
                        Au dos : nom, prénom et « acompte BTS BM initiale 2026-2028 »
                      </li>
                    </ul>
                  </div>

                  <label
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                      formData.engage_depot_cheque
                        ? 'border-teal bg-teal/5 text-dark'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.engage_depot_cheque}
                      onChange={(e) => handleChange('engage_depot_cheque', e.target.checked)}
                      className="mt-0.5 accent-teal"
                    />
                    Je m&apos;engage à déposer / envoyer le chèque d&apos;acompte de{' '}
                    {ACOMPTE_LABEL} dès que possible afin de bloquer mon inscription.
                  </label>

                  <button
                    onClick={() => handleSubmit({ mode_acompte: 'cheque' })}
                    disabled={isSubmitting || !formData.engage_depot_cheque || !planChequesOk}
                    className="w-full py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting
                      ? 'Envoi en cours…'
                      : `Valider ma candidature — acompte ${ACOMPTE_LABEL} par chèque`}
                  </button>
                </div>
              )}
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={prev}
                disabled={isSubmitting}
                className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Retour
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
