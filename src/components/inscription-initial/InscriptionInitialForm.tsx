'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ACOMPTE_CENTS, ACOMPTE_LABEL, ECHEANCES_CHEQUE_MAX, montantParChequeEuros, type ModeAcompte } from '@/lib/acompte';
import {
  ECHEANCES_PRELEVEMENT_MAX,
  computeFirstPrelevementDate,
  formatDateFr,
  listPrelevementSchedule,
  montantParPrelevementEuros,
  type ModeSolde,
} from '@/lib/gocardless';
import {
  clearAllInscriptionProgress,
  deleteFileBlob,
  loadAllFileBlobs,
  loadProgressDraft,
  readStepFromLocation,
  saveFileBlob,
  saveProgressDraft,
  syncInscriptionUrl,
  type InscriptionProgressConfig,
  PROGRESS_STANDARD,
} from '@/lib/inscription-initial-progress';
import StripeAcompteBlock from '@/components/StripeAcompteBlock';
import SignaturePad from '@/components/SignaturePad';
import {
  PROGRAMME_INITIALE_ANNEE2,
  PROGRAMME_INITIALE_STANDARD,
  type InscriptionProgrammeCopy,
} from '@/lib/inscription-programme';

export type { InscriptionProgrammeCopy };
export { PROGRAMME_INITIALE_STANDARD, PROGRAMME_INITIALE_ANNEE2 };

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
  /** Signature électronique spécifique au mandat de prélèvement (étape paiement). */
  signature_prelevement_nom: string;
  signature_prelevement_image: string;
  /** Mode de règlement du solde annuel. */
  mode_solde: ModeSolde;
  /** Nombre de chèques pour le solde annuel (1 à 10). */
  nb_cheques: number;
  /** Nombre de prélèvements SEPA (1 à 7). */
  nb_prelevements: number;
  /** Acompte de pré-inscription : carte ou chèque. */
  mode_acompte: '' | ModeAcompte;
  stripe_payment_intent_id: string;
  /** Engagement d'envoyer rapidement le chèque d'acompte. */
  engage_depot_cheque: boolean;
  gocardless_billing_request_id: string;
  gocardless_mandate_id: string;
  /** Tarif boursier : oui uniquement si justificatif joint. */
  est_boursier: '' | 'oui' | 'non';
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

export interface InscriptionInitialFormProps {
  progress?: InscriptionProgressConfig;
  fraisAnnuelsCents: number;
  fraisAnnuelsLabel: string;
  /** Ex. « 5 000 € » boursiers ; null = ne pas afficher de tarif boursier. */
  fraisBoursiersLabel?: string | null;
  /** Montant boursier en centimes ; requis si fraisBoursiersLabel est défini. */
  fraisBoursiersCents?: number | null;
  /** Libellé interne dans les remarques (ex. tarif-2a). */
  tarifCode?: string;
  programme?: InscriptionProgrammeCopy;
}

export default function InscriptionInitialForm({
  progress = PROGRESS_STANDARD,
  fraisAnnuelsCents,
  fraisAnnuelsLabel,
  fraisBoursiersLabel = '5 000 €',
  fraisBoursiersCents = 500_000,
  tarifCode,
  programme = PROGRAMME_INITIALE_STANDARD,
}: InscriptionInitialFormProps) {
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
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
    signature_prelevement_nom: '',
    signature_prelevement_image: '',
    mode_solde: 'cheque',
    nb_cheques: 1,
    nb_prelevements: 1,
    mode_acompte: '',
    stripe_payment_intent_id: '',
    engage_depot_cheque: false,
    gocardless_billing_request_id: '',
    gocardless_mandate_id: '',
    est_boursier: '',
  });

  const [files, setFiles] = useState<FileData>({ ...EMPTY_FILES });
  const [fileNames, setFileNames] = useState<FileNames>({ ...EMPTY_FILE_NAMES });
  /** Chemins storage déjà présents (dossier alternance / candidature existante). */
  const [existingFiles, setExistingFiles] = useState<Partial<Record<FileKey, string>>>({});
  const offreTarifBoursier = Boolean(fraisBoursiersLabel && fraisBoursiersCents);
  const hasJustificatifBourse = Boolean(files.fichier_bourse || existingFiles.fichier_bourse);
  const tarifBoursierActif =
    offreTarifBoursier && formData.est_boursier === 'oui' && hasJustificatifBourse;
  const fraisCentsAppliques =
    tarifBoursierActif && fraisBoursiersCents ? fraisBoursiersCents : fraisAnnuelsCents;
  const fraisLabelApplique =
    tarifBoursierActif && fraisBoursiersLabel ? fraisBoursiersLabel : fraisAnnuelsLabel;
  const fraisAnnuelMention = tarifBoursierActif
    ? `${fraisLabelApplique} (tarif boursier, justificatif joint)`
    : fraisBoursiersLabel
      ? `${fraisAnnuelsLabel} (${fraisBoursiersLabel} boursiers sur justificatif)`
      : fraisAnnuelsLabel;
  const [dossierExistant, setDossierExistant] = useState<{
    docsCount: number;
    origine: string;
  } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const emailLookupRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLookupEmail = useRef('');

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
    if (file) {
      setExistingFiles((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      void saveFileBlob(field, file, progress.filesDb).catch(() => {
        /* persistance fichier best-effort */
      });
    } else {
      void deleteFileBlob(field, progress.filesDb).catch(() => {
        /* ignore */
      });
    }
  };

  const goToStep = (target: number, historyMode: 'push' | 'replace' = 'push') => {
    const nextStep = Math.max(0, Math.min(6, target));
    setSubmitError('');
    setStep(nextStep);
    syncInscriptionUrl(progress.basePath, nextStep, historyMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyExistingCandidature = (c: {
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
    filiere_bac: string;
    annee_obtention: string;
    etablissement: string;
    source_decouverte: string;
    entreprise_trouvee: string;
    docs: Partial<Record<FileKey, string>>;
    docsCount: number;
  }) => {
    const filiere = (c.filiere_bac || '').toLowerCase();
    let type_bac = '';
    if (filiere.includes('stl')) type_bac = 'stl';
    else if (filiere.includes('pro') || filiere.includes('assp') || filiere.includes('sapat'))
      type_bac = 'pro';
    else if (filiere.includes('étranger') || filiere.includes('etranger')) type_bac = 'etranger';
    else if (filiere.includes('général') || filiere.includes('general') || filiere)
      type_bac = 'general';

    const sourceMap: Record<string, string> = {
      'Réseaux sociaux': 'Réseaux sociaux',
      'Reseaux sociaux': 'Réseaux sociaux',
      Google: 'Internet',
      Internet: 'Internet',
      "Conseiller d'orientation": 'Établissement scolaire',
      'Bouche-à-oreille': 'Recommandation',
      Salon: 'Salon étudiant',
    };
    const source =
      sourceMap[c.source_decouverte] ||
      (SOURCE_OPTIONS.includes(c.source_decouverte as (typeof SOURCE_OPTIONS)[number])
        ? c.source_decouverte
        : '');

    setFormData((prev) => ({
      ...prev,
      prenom: c.prenom || prev.prenom,
      nom: c.nom || prev.nom,
      date_naissance: c.date_naissance ? String(c.date_naissance).slice(0, 10) : prev.date_naissance,
      lieu_naissance: c.lieu_naissance || prev.lieu_naissance,
      nationalite: c.nationalite || prev.nationalite,
      adresse: c.adresse || prev.adresse,
      code_postal: c.code_postal || prev.code_postal,
      ville: c.ville || prev.ville,
      departement: c.departement || prev.departement,
      email: c.email || prev.email,
      telephone: c.telephone || prev.telephone,
      type_bac: type_bac || prev.type_bac,
      precision_bac: c.filiere_bac && type_bac !== 'stl' ? c.filiere_bac : prev.precision_bac,
      annee_obtention: c.annee_obtention || prev.annee_obtention,
      etablissement: c.etablissement || prev.etablissement,
      source_decouverte: source || prev.source_decouverte,
    }));

    const reused: Partial<Record<FileKey, string>> = {};
    const names: Partial<FileNames> = {};
    (['fichier_cni', 'fichier_photos', 'fichier_releve', 'fichier_cv'] as FileKey[]).forEach(
      (key) => {
        const path = c.docs[key];
        if (path) {
          reused[key] = path;
          names[key] = `Déjà en dossier · ${path.split('/').pop() || 'document'}`;
        }
      }
    );
    setExistingFiles(reused);
    setFileNames((prev) => ({ ...prev, ...names }));
    setFiles((prev) => {
      const next = { ...prev };
      (Object.keys(reused) as FileKey[]).forEach((k) => {
        next[k] = null;
      });
      return next;
    });

    const origine = (c.entreprise_trouvee || '').toLowerCase().includes('initial')
      ? 'formation initiale'
      : 'alternance';
    setDossierExistant({ docsCount: c.docsCount, origine });
  };

  const lookupByEmail = (email: string) => {
    if (emailLookupRef.current) clearTimeout(emailLookupRef.current);
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@') || normalized.length < 5) {
      setDossierExistant(null);
      return;
    }
    if (normalized === lastLookupEmail.current) return;

    emailLookupRef.current = setTimeout(async () => {
      setLookupLoading(true);
      try {
        const res = await fetch('/api/inscription-initial/lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: normalized }),
        });
        const data = await res.json();
        lastLookupEmail.current = normalized;
        if (data.found && data.candidature) {
          applyExistingCandidature(data.candidature);
        } else {
          setDossierExistant(null);
        }
      } catch {
        /* silencieux */
      } finally {
        setLookupLoading(false);
      }
    }, 450);
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

  /** Restaure brouillon + étape URL au chargement. */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const paiementReturn =
        params.get('paiement') === 'ok' || Boolean(params.get('session_id'));
      const urlStep = readStepFromLocation();
      const draft = loadProgressDraft(progress.progressKey);

      try {
        if (draft && !paiementReturn) {
          const restoredForm = {
            ...formData,
            ...(draft.formData as Partial<FormData>),
          } as FormData;
          setFormData(restoredForm);
          setExistingFiles(draft.existingFiles || {});
          setFileNames({ ...EMPTY_FILE_NAMES, ...(draft.fileNames || {}) });
          setDossierExistant(draft.dossierExistant || null);

          const blobs = await loadAllFileBlobs(progress.filesDb);
          if (!cancelled && Object.keys(blobs).length > 0) {
            setFiles((prev) => {
              const next = { ...prev };
              (Object.keys(blobs) as FileKey[]).forEach((key) => {
                const f = blobs[key];
                if (f) next[key] = f;
              });
              return next;
            });
            setFileNames((prev) => {
              const next = { ...prev };
              (Object.keys(blobs) as FileKey[]).forEach((key) => {
                const f = blobs[key];
                if (f) next[key] = f.name || prev[key] || key;
              });
              return next;
            });
          }

          const stepToUse =
            urlStep != null ? urlStep : Math.max(0, Math.min(6, draft.step));
          if (!cancelled) {
            setStep(stepToUse);
            syncInscriptionUrl(progress.basePath, stepToUse, 'replace');
            setDraftRestored(true);
          }
        } else if (urlStep != null) {
          if (!cancelled) {
            setStep(urlStep);
            syncInscriptionUrl(progress.basePath, urlStep, 'replace');
          }
        } else if (!paiementReturn) {
          syncInscriptionUrl(progress.basePath, 0, 'replace');
        }
      } catch (err) {
        console.warn('[inscription-initial] restauration brouillon', err);
        if (urlStep != null && !cancelled) setStep(urlStep);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Bouton précédent du navigateur. */
  useEffect(() => {
    const onPopState = () => {
      const s = readStepFromLocation();
      if (s != null) {
        setStep(s);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  /** Autosauvegarde du formulaire (hors fichiers binaires → IndexedDB). */
  useEffect(() => {
    if (!hydrated || submitted) return;
    const timer = window.setTimeout(() => {
      saveProgressDraft({
        step,
        formData: formData as unknown as Record<string, unknown>,
        existingFiles,
        fileNames,
        dossierExistant,
      }, progress.progressKey);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [hydrated, submitted, step, formData, existingFiles, fileNames, dossierExistant]);

  const next = () => goToStep(Math.min(step + 1, 6), 'push');
  const prev = () => goToStep(Math.max(step - 1, 1), 'push');

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

  const firstPrelevementDate = computeFirstPrelevementDate();
  const prelevementSchedule = listPrelevementSchedule(
    formData.nb_prelevements,
    fraisCentsAppliques,
    ACOMPTE_CENTS,
    firstPrelevementDate
  );

  const signaturePrelevementNomOk = (() => {
    const expected = `${formData.prenom} ${formData.nom}`.trim().toLowerCase().replace(/\s+/g, ' ');
    const typed = formData.signature_prelevement_nom.trim().toLowerCase().replace(/\s+/g, ' ');
    return typed.length > 0 && typed === expected;
  })();

  const planChequesOk =
    formData.mode_solde === 'cheque' &&
    formData.nb_cheques >= 1 &&
    formData.nb_cheques <= ECHEANCES_CHEQUE_MAX;

  const planPrelevementChoixOk =
    formData.mode_solde === 'prelevement' &&
    formData.nb_prelevements >= 1 &&
    formData.nb_prelevements <= ECHEANCES_PRELEVEMENT_MAX;

  const planPrelevementOk =
    planPrelevementChoixOk &&
    signaturePrelevementNomOk &&
    Boolean(formData.signature_prelevement_image);

  const planSoldeOk = planChequesOk || planPrelevementOk;

  const acompteCartePaye = Boolean(formData.stripe_payment_intent_id);
  const acompteChequeOk =
    formData.mode_acompte === 'cheque' && formData.engage_depot_cheque;
  const acomptePret =
    (formData.mode_acompte === 'carte' && acompteCartePaye) || acompteChequeOk;

  const handleSubmit = async (paymentOverride?: {
    mode_acompte: ModeAcompte;
    stripe_payment_intent_id?: string;
    gocardless_mandate_id?: string;
    gocardless_billing_request_id?: string;
    prelevement_note?: string;
    formSnapshot?: FormData;
    existingSnapshot?: Partial<Record<FileKey, string>>;
  }) => {
    const fd = paymentOverride?.formSnapshot || formData;
    const existingSnap = paymentOverride?.existingSnapshot || existingFiles;
    const mode = paymentOverride?.mode_acompte || fd.mode_acompte;
    const stripeId =
      paymentOverride?.stripe_payment_intent_id || fd.stripe_payment_intent_id;
    const gcMandate =
      paymentOverride?.gocardless_mandate_id || fd.gocardless_mandate_id;

    if (!canSubmit && !paymentOverride?.formSnapshot) {
      setSubmitError('Merci de cocher toutes les déclarations obligatoires avant de valider.');
      return;
    }
    const soldeOk =
      (fd.mode_solde === 'cheque' &&
        fd.nb_cheques >= 1 &&
        fd.nb_cheques <= ECHEANCES_CHEQUE_MAX) ||
      (fd.mode_solde === 'prelevement' &&
        fd.nb_prelevements >= 1 &&
        fd.nb_prelevements <= ECHEANCES_PRELEVEMENT_MAX &&
        Boolean(fd.signature_prelevement_image) &&
        fd.signature_prelevement_nom.trim().length > 0);
    if (!soldeOk) {
      setSubmitError(
        fd.mode_solde === 'prelevement'
          ? `Complétez le nombre de prélèvements (1 à ${ECHEANCES_PRELEVEMENT_MAX}) et la signature électronique du prélèvement.`
          : `Indiquez le nombre de chèques pour l’année (1 à ${ECHEANCES_CHEQUE_MAX}).`
      );
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
    if (mode === 'cheque' && !fd.engage_depot_cheque) {
      setSubmitError(
        'Confirmez que vous enverrez le chèque d’acompte dès que possible pour bloquer votre inscription.'
      );
      return;
    }
    if (fd.mode_solde === 'prelevement' && !gcMandate) {
      setSubmitError('Signez le mandat de prélèvement GoCardless avant d’envoyer le dossier.');
      return;
    }
    if (offreTarifBoursier) {
      if (fd.est_boursier !== 'oui' && fd.est_boursier !== 'non') {
        setSubmitError('Indiquez si vous êtes boursier(e) à l’étape des pièces justificatives.');
        return;
      }
      if (fd.est_boursier === 'oui' && !files.fichier_bourse && !existingSnap.fichier_bourse) {
        setSubmitError(
          'Joignez un justificatif de bourse (notification CROUS ou équivalent) pour bénéficier du tarif boursier.'
        );
        return;
      }
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
        if (file) {
          uploads[key] = await uploadFile(file, folder);
        } else if (existingSnap[key]) {
          uploads[key] = existingSnap[key]!;
        }
      }

      let signature_url = '';
      if (fd.signature_image?.startsWith('data:')) {
        const res = await fetch(fd.signature_image);
        const blob = await res.blob();
        const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
        signature_url = await uploadFile(file, 'signatures');
      } else if (fd.signature_image?.startsWith('initial/')) {
        signature_url = fd.signature_image;
      }

      let signature_prelevement_url = '';
      if (fd.mode_solde === 'prelevement') {
        if (fd.signature_prelevement_image?.startsWith('data:')) {
          const res = await fetch(fd.signature_prelevement_image);
          const blob = await res.blob();
          const file = new File([blob], `signature_prelevement_${Date.now()}.png`, {
            type: 'image/png',
          });
          signature_prelevement_url = await uploadFile(file, 'signatures');
        } else if (fd.signature_prelevement_image?.startsWith('initial/')) {
          signature_prelevement_url = fd.signature_prelevement_image;
        }
      }

      const bacLabel = BAC_OPTIONS.find((o) => o.value === fd.type_bac)?.label || fd.type_bac;
      const filiere =
        fd.precision_bac.trim().length > 0
          ? `${bacLabel} — ${fd.precision_bac.trim()}`
          : bacLabel;

      const source =
        fd.source_decouverte === 'Recommandation' && fd.source_recommandation
          ? `Recommandation : ${fd.source_recommandation}`
          : fd.source_decouverte;

      const montantCheque = montantParChequeEuros(fd.nb_cheques, fraisCentsAppliques);
      const montantPrelev = montantParPrelevementEuros(
        fd.nb_prelevements,
        fraisCentsAppliques,
        ACOMPTE_CENTS
      );
      const startDate = computeFirstPrelevementDate();
      const schedule =
        fd.mode_solde === 'prelevement'
          ? listPrelevementSchedule(
              fd.nb_prelevements,
              fraisCentsAppliques,
              ACOMPTE_CENTS,
              startDate
            )
          : [];
      const scheduleText = schedule
        .map((e) => `${e.index}) ${formatDateFr(e.date)} · ${e.euros} €`)
        .join(' ; ');

      const acompteLine =
        mode === 'carte'
          ? `Acompte pré-inscription (${ACOMPTE_LABEL}) : payé par carte · Stripe PI=${stripeId}`
          : `Acompte pré-inscription (${ACOMPTE_LABEL}) : chèque — envoi/dépôt dès que possible pour bloquer l'inscription (en attente de réception)`;

      const soldeLine =
        fd.mode_solde === 'prelevement'
          ? `Paiement annuel : prélèvement SEPA GoCardless · ${fd.nb_prelevements} échéance(s) · ~${montantPrelev.toFixed(2)} € / mois · 1er prélèvement ${formatDateFr(startDate)} · calendrier : ${scheduleText} · mandat=${gcMandate}${paymentOverride?.prelevement_note ? ` · ${paymentOverride.prelevement_note}` : ''}`
          : `Paiement annuel : ${fd.nb_cheques} chèque(s) · ~${montantCheque.toFixed(2)} € / chèque (indicatif${tarifBoursierActif ? ', tarif boursier' : ' hors tarif boursier'})`;

      const remarques = [
        programme.dossierBanner,
        tarifCode ? `Tarif : ${tarifCode} · frais annuels ${fraisAnnuelMention}` : `Frais annuels : ${fraisAnnuelMention}`,
        fd.est_boursier === 'oui'
          ? 'Boursier : oui · justificatif joint'
          : fd.est_boursier === 'non'
            ? 'Boursier : non'
            : null,
        dossierExistant
          ? `Prérempli depuis un dossier existant (${dossierExistant.origine}) · ${dossierExistant.docsCount} doc(s) réutilisé(s)`
          : null,
        `Motivation : ${fd.motivation}`,
        `Poursuite d'études : ${fd.poursuite_etudes}`,
        `Contact urgence : ${fd.urgence_nom} — ${fd.urgence_telephone} (${fd.urgence_lien})`,
        `Situation particulière : ${fd.situation_particuliere || 'Non'}`,
        `Droit à l'image : ${fd.droit_image}`,
        `Bulletin joint déclaré : ${fd.bulletin_joint ? 'Oui' : 'Non'}`,
        fd.precision_bac ? `Précision bac : ${fd.precision_bac}` : null,
        uploads.fichier_bulletins ? `Bulletins : ${uploads.fichier_bulletins}` : null,
        uploads.fichier_motivation ? `Lettre motivation : ${uploads.fichier_motivation}` : null,
        uploads.fichier_jdc ? `JDC : ${uploads.fichier_jdc}` : null,
        uploads.fichier_rc ? `RC : ${uploads.fichier_rc}` : null,
        uploads.fichier_bourse ? `Bourse : ${uploads.fichier_bourse}` : null,
        `CGI acceptées : oui`,
        `CGS acceptées : oui`,
        `Signature électronique : ${fd.signature_nom} · ${new Date().toISOString()}`,
        signature_url ? `Signature image : ${signature_url}` : null,
        fd.mode_solde === 'prelevement'
          ? `Signature prélèvement SEPA : ${fd.signature_prelevement_nom} · ${new Date().toISOString()}`
          : null,
        signature_prelevement_url
          ? `Signature prélèvement image : ${signature_prelevement_url}`
          : null,
        `Mineur : ${isMinor ? 'oui' : 'non'}${isMinor ? ` — accord représentant : ${fd.accord_representant ? 'oui' : 'non'}` : ''}`,
        acompteLine,
        soldeLine,
      ]
        .filter(Boolean)
        .join('\n');

      const signedAt = new Date().toISOString();
      const contratPayload = signature_url
        ? {
            formationLabel: programme.successFormation,
            cgiFormation: programme.cgiFormation,
            cgiDuree: programme.cgiDuree,
            fraisAnnuelsLabel: fraisAnnuelMention,
            modeAcompte: mode,
            modeSolde: fd.mode_solde,
            nbCheques: fd.mode_solde === 'cheque' ? fd.nb_cheques : undefined,
            nbPrelevements: fd.mode_solde === 'prelevement' ? fd.nb_prelevements : undefined,
            echeances: schedule.map((e) => ({
              index: e.index,
              dateLabel: formatDateFr(e.date),
              montantLabel: `${e.euros} €`,
            })),
            acompteDetail: acompteLine,
            soldeDetail: soldeLine,
            signatureNom: fd.signature_nom,
            signaturePath: signature_url,
            signaturePrelevementNom:
              fd.mode_solde === 'prelevement' ? fd.signature_prelevement_nom : undefined,
            signaturePrelevementPath: signature_prelevement_url || undefined,
            mineur: isMinor,
            accordRepresentant: fd.accord_representant,
            signedAt,
          }
        : undefined;

      const res = await fetch('/api/inscription-initial/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: fd.prenom,
          nom: fd.nom,
          date_naissance: fd.date_naissance || null,
          lieu_naissance: fd.lieu_naissance,
          nationalite: fd.nationalite,
          adresse: fd.adresse,
          code_postal: fd.code_postal,
          ville: fd.ville,
          departement: fd.departement,
          email: fd.email,
          telephone: fd.telephone,
          niveau_etudes: fd.annee_obtention ? `Bac ${fd.annee_obtention}` : 'Bac',
          filiere_bac: filiere,
          annee_obtention: fd.annee_obtention,
          etablissement: fd.etablissement,
          dernier_diplome: filiere,
          fichier_cni_url: uploads.fichier_cni || '',
          fichier_photos_url: uploads.fichier_photos || '',
          fichier_releve_url: uploads.fichier_releve || '',
          fichier_cv_url: uploads.fichier_cv || '',
          entreprise_trouvee: programme.candidatureTag,
          source_decouverte: source,
          remarques,
          mode_acompte: mode,
          stripe_payment_intent_id: stripeId,
          contrat: contratPayload,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Envoi du dossier impossible.');
      const data = payload as { id?: string };

      await clearAllInscriptionProgress(progress);
      window.history.replaceState({}, '', progress.basePath);

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
    if (!planSoldeOk) {
      setSubmitError(
        formData.mode_solde === 'prelevement'
          ? !planPrelevementChoixOk
            ? `Indiquez d’abord le nombre de prélèvements (1 à ${ECHEANCES_PRELEVEMENT_MAX}).`
            : 'Signez électroniquement l’engagement de prélèvement avant de payer l’acompte.'
          : `Indiquez d’abord le nombre de chèques pour l’année (1 à ${ECHEANCES_CHEQUE_MAX}).`
      );
      return;
    }
    handleChange('mode_acompte', 'carte');
    handleChange('stripe_payment_intent_id', paymentIntentId);

    // Solde par prélèvement : on signe le mandat après l’acompte, puis on envoie le dossier.
    if (formData.mode_solde === 'prelevement') {
      setSubmitError('');
      await startGoCardlessMandate({
        mode_acompte: 'carte',
        stripe_payment_intent_id: paymentIntentId,
      });
      return;
    }

    await handleSubmit({ mode_acompte: 'carte', stripe_payment_intent_id: paymentIntentId });
  };

  const startGoCardlessMandate = async (acompteOverride?: {
    mode_acompte: ModeAcompte;
    stripe_payment_intent_id?: string;
  }) => {
    if (!planPrelevementChoixOk) {
      setSubmitError(`Indiquez le nombre de prélèvements (1 à ${ECHEANCES_PRELEVEMENT_MAX}).`);
      return;
    }
    if (!signaturePrelevementNomOk || !formData.signature_prelevement_image) {
      setSubmitError(
        'Signez électroniquement l’engagement de prélèvement (nom + signature dessinée) avant de continuer.'
      );
      return;
    }
    const mode = acompteOverride?.mode_acompte || formData.mode_acompte;
    const stripeId =
      acompteOverride?.stripe_payment_intent_id || formData.stripe_payment_intent_id;
    if (mode === 'carte' && !stripeId) {
      setSubmitError('Payez d’abord l’acompte par carte.');
      return;
    }
    if (mode === 'cheque' && !formData.engage_depot_cheque) {
      setSubmitError('Confirmez l’envoi du chèque d’acompte avant le mandat de prélèvement.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Important : le PaymentIntent doit être dans le brouillon même si setState n’a pas encore flushé.
      await saveDraftForStripe({
        mode_acompte: mode === 'carte' || mode === 'cheque' ? mode : 'carte',
        stripe_payment_intent_id: stripeId || undefined,
      });
      const startDate = computeFirstPrelevementDate();
      const res = await fetch('/api/inscription-initial/gocardless/create-mandate-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          prenom: formData.prenom,
          nom: formData.nom,
          basePath: progress.basePath,
          nb_prelevements: formData.nb_prelevements,
          frais_annuels_cents: fraisCentsAppliques,
          start_date: startDate,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Acompte déjà payé : on laisse un message clair pour reprendre le mandat sans re-payer.
        const base =
          data.error ||
          'Impossible de démarrer le mandat de prélèvement GoCardless.';
        throw new Error(
          stripeId
            ? `${base} Votre acompte carte a bien été reçu (${stripeId}). Rechargez la page et cliquez à nouveau sur « Signer le mandat » — ne payez pas une seconde fois.`
            : base
        );
      }
      if (data.billingRequestId) {
        handleChange('gocardless_billing_request_id', data.billingRequestId);
        sessionStorage.setItem(
          `${progress.draftKey}_gc_brq`,
          String(data.billingRequestId)
        );
      }
      if (!data.authorisationUrl) throw new Error('URL de mandat manquante.');
      window.location.href = data.authorisationUrl;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur GoCardless.');
      setIsSubmitting(false);
    }
  };

  /** Sauvegarde le dossier avant redirection Stripe / GoCardless. */
  const saveDraftForStripe = async (overrides?: {
    mode_acompte?: ModeAcompte;
    stripe_payment_intent_id?: string;
  }) => {
    // Upload des fichiers encore locaux pour ne pas les perdre au retour Stripe
    const mergedExisting: Partial<Record<FileKey, string>> = { ...existingFiles };
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
      if (file) {
        mergedExisting[key] = await uploadFile(file, folder);
      }
    }

    let signature_url = '';
    if (formData.signature_image?.startsWith('data:')) {
      const res = await fetch(formData.signature_image);
      const blob = await res.blob();
      const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
      signature_url = await uploadFile(file, 'signatures');
    }

    let signature_prelevement_url = '';
    if (formData.signature_prelevement_image?.startsWith('data:')) {
      const res = await fetch(formData.signature_prelevement_image);
      const blob = await res.blob();
      const file = new File([blob], `signature_prelevement_${Date.now()}.png`, {
        type: 'image/png',
      });
      signature_prelevement_url = await uploadFile(file, 'signatures');
    }

    setExistingFiles(mergedExisting);
    setFiles({ ...EMPTY_FILES });

    const draftForm = {
      ...formData,
      mode_acompte: (overrides?.mode_acompte || formData.mode_acompte || 'carte') as ModeAcompte,
      stripe_payment_intent_id:
        overrides?.stripe_payment_intent_id || formData.stripe_payment_intent_id,
      signature_image: signature_url || formData.signature_image,
      signature_prelevement_image:
        signature_prelevement_url || formData.signature_prelevement_image,
    };

    const draft = {
      formData: draftForm,
      existingFiles: mergedExisting,
      fileNames,
      dossierExistant,
      signature_url,
      savedAt: new Date().toISOString(),
    };
    sessionStorage.setItem(progress.draftKey, JSON.stringify(draft));
    saveProgressDraft({
      step: 6,
      formData: draftForm as unknown as Record<string, unknown>,
      existingFiles: mergedExisting,
      fileNames,
      dossierExistant,
    }, progress.progressKey);
  };

  /** Retour Stripe Buy Button → finalise le dossier depuis le brouillon. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const paiementOk = params.get('paiement') === 'ok';
    const paymentIntentId = params.get('payment_intent');
    if (!sessionId && !paiementOk && !paymentIntentId) return;

    const raw =
      sessionStorage.getItem(progress.draftKey) ||
      (() => {
        const draft = loadProgressDraft(progress.progressKey);
        return draft ? JSON.stringify({ ...draft, signature_url: '' }) : null;
      })();
    if (!raw) return;

    let cancelled = false;

    (async () => {
      try {
        const draft = JSON.parse(raw) as {
          formData: FormData;
          existingFiles: Partial<Record<FileKey, string>>;
          fileNames: FileNames;
          dossierExistant: typeof dossierExistant;
          signature_url?: string;
        };

        setFormData({ ...draft.formData, mode_acompte: 'carte' });
        setExistingFiles(draft.existingFiles || {});
        setFileNames(draft.fileNames || { ...EMPTY_FILE_NAMES });
        setDossierExistant(draft.dossierExistant || null);
        setStep(6);

        const stripeRef = sessionId || `buybtn_${Date.now()}`;
        // Réutilise la logique d'envoi avec l'état du brouillon (évite les closures stale)
        setIsSubmitting(true);
        setSubmitError('');

        const fd = draft.formData;
        const uploads = { ...(draft.existingFiles || {}) };
        const bacLabel = BAC_OPTIONS.find((o) => o.value === fd.type_bac)?.label || fd.type_bac;
        const filiere =
          fd.precision_bac.trim().length > 0 ? `${bacLabel} — ${fd.precision_bac.trim()}` : bacLabel;
        const source =
          fd.source_decouverte === 'Recommandation' && fd.source_recommandation
            ? `Recommandation : ${fd.source_recommandation}`
            : fd.source_decouverte;
        const montantCheque = montantParChequeEuros(fd.nb_cheques, fraisCentsAppliques);

        const remarques = [
          programme.dossierBanner,
          tarifCode ? `Tarif : ${tarifCode} · frais annuels ${fraisAnnuelMention}` : `Frais annuels : ${fraisAnnuelMention}`,
          fd.est_boursier === 'oui'
            ? 'Boursier : oui · justificatif joint'
            : fd.est_boursier === 'non'
              ? 'Boursier : non'
              : null,
          draft.dossierExistant
            ? `Prérempli depuis un dossier existant (${draft.dossierExistant.origine}) · ${draft.dossierExistant.docsCount} doc(s) réutilisé(s)`
            : null,
          `Motivation : ${fd.motivation}`,
          `Poursuite d'études : ${fd.poursuite_etudes}`,
          `Contact urgence : ${fd.urgence_nom} — ${fd.urgence_telephone} (${fd.urgence_lien})`,
          `Situation particulière : ${fd.situation_particuliere || 'Non'}`,
          `Droit à l'image : ${fd.droit_image}`,
          `Bulletin joint déclaré : ${fd.bulletin_joint ? 'Oui' : 'Non'}`,
          fd.precision_bac ? `Précision bac : ${fd.precision_bac}` : null,
          uploads.fichier_bulletins ? `Bulletins : ${uploads.fichier_bulletins}` : null,
          uploads.fichier_motivation ? `Lettre motivation : ${uploads.fichier_motivation}` : null,
          uploads.fichier_jdc ? `JDC : ${uploads.fichier_jdc}` : null,
          uploads.fichier_rc ? `RC : ${uploads.fichier_rc}` : null,
          uploads.fichier_bourse ? `Bourse : ${uploads.fichier_bourse}` : null,
          `CGI acceptées : oui`,
          `CGS acceptées : oui`,
          `Signature électronique : ${fd.signature_nom} · ${new Date().toISOString()}`,
          draft.signature_url ||
          (typeof fd.signature_image === 'string' && fd.signature_image.startsWith('initial/'))
            ? `Signature image : ${draft.signature_url || fd.signature_image}`
            : null,
          `Acompte pré-inscription (${ACOMPTE_LABEL}) : payé par carte (Stripe Buy Button) · ref=${stripeRef}`,
          `Paiement annuel : ${fd.nb_cheques} chèque(s) · ~${montantCheque.toFixed(2)} € / chèque (indicatif hors tarif boursier)`,
        ]
          .filter(Boolean)
          .join('\n');

        if (cancelled) return;

        const submitRes = await fetch('/api/inscription-initial/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prenom: fd.prenom,
            nom: fd.nom,
            date_naissance: fd.date_naissance || null,
            lieu_naissance: fd.lieu_naissance,
            nationalite: fd.nationalite,
            adresse: fd.adresse,
            code_postal: fd.code_postal,
            ville: fd.ville,
            departement: fd.departement,
            email: fd.email,
            telephone: fd.telephone,
            niveau_etudes: fd.annee_obtention ? `Bac ${fd.annee_obtention}` : 'Bac',
            filiere_bac: filiere,
            annee_obtention: fd.annee_obtention,
            etablissement: fd.etablissement,
            dernier_diplome: filiere,
            fichier_cni_url: uploads.fichier_cni || '',
            fichier_photos_url: uploads.fichier_photos || '',
            fichier_releve_url: uploads.fichier_releve || '',
            fichier_cv_url: uploads.fichier_cv || '',
            entreprise_trouvee: programme.candidatureTag,
            source_decouverte: source,
            remarques,
            mode_acompte: 'carte',
            stripe_payment_intent_id: sessionId || params.get('payment_intent') || '',
          }),
        });
        const payload = await submitRes.json().catch(() => ({}));
        if (!submitRes.ok) throw new Error(payload.error || 'Envoi du dossier impossible.');
        const data = payload as { id?: string };

        await clearAllInscriptionProgress(progress);
        window.history.replaceState({}, '', progress.basePath);
        const ref = data?.id
          ? `INI-${String(data.id).slice(0, 8).toUpperCase()}`
          : `INI-${Date.now().toString(36).toUpperCase()}`;
        if (!cancelled) {
          setReference(ref);
          setSubmitted(true);
        }
      } catch (err) {
        if (!cancelled) {
          setSubmitError(
            err instanceof Error
              ? err.message
              : 'Paiement reçu, mais l’envoi du dossier a échoué. Contactez-nous.'
          );
          setStep(6);
        }
      } finally {
        if (!cancelled) setIsSubmitting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Retour GoCardless → planifie les prélèvements puis envoie le dossier. */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('gocardless') === 'exit') {
      setSubmitError('Mandat de prélèvement annulé. Vous pouvez réessayer ou choisir le règlement par chèque.');
      setStep(6);
      syncInscriptionUrl(progress.basePath, 6, 'replace');
      return;
    }
    if (params.get('gocardless') !== 'ok') return;

    const brq =
      params.get('billing_request') ||
      sessionStorage.getItem(`${progress.draftKey}_gc_brq`) ||
      formData.gocardless_billing_request_id;
    if (!brq) {
      setSubmitError('Retour GoCardless sans référence de mandat. Reprenez le prélèvement.');
      setStep(6);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsSubmitting(true);
      setSubmitError('');
      setStep(6);
      try {
        // Restaure le brouillon si besoin
        const raw = sessionStorage.getItem(progress.draftKey);
        if (raw) {
          const draft = JSON.parse(raw) as {
            formData: FormData;
            existingFiles: Partial<Record<FileKey, string>>;
            fileNames: FileNames;
            dossierExistant: typeof dossierExistant;
          };
          setFormData({
            ...draft.formData,
            mode_solde: 'prelevement',
            gocardless_billing_request_id: brq,
          });
          setExistingFiles(draft.existingFiles || {});
          setFileNames(draft.fileNames || { ...EMPTY_FILE_NAMES });
          setDossierExistant(draft.dossierExistant || null);
        }

        const fin = await fetch('/api/inscription-initial/gocardless/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billing_request_id: brq }),
        });
        const finData = await fin.json().catch(() => ({}));
        if (!fin.ok) throw new Error(finData.error || 'Finalisation du mandat impossible.');

        if (cancelled) return;
        handleChange('gocardless_mandate_id', finData.mandateId);
        handleChange('gocardless_billing_request_id', brq);
        handleChange('mode_solde', 'prelevement');

        const draftRaw = sessionStorage.getItem(progress.draftKey);
        const parsed = draftRaw
          ? (JSON.parse(draftRaw) as {
              formData: FormData;
              existingFiles?: Partial<Record<FileKey, string>>;
            })
          : null;
        const draftForm: FormData = {
          ...(parsed?.formData || formData),
          mode_solde: 'prelevement',
          gocardless_billing_request_id: brq,
          gocardless_mandate_id: finData.mandateId,
        };
        const modeAcompte = (draftForm.mode_acompte || 'carte') as ModeAcompte;
        const stripeId = draftForm.stripe_payment_intent_id || '';

        const note = `paiements=${(finData.paymentIds || []).join(',')} · dates=${(finData.chargeDates || []).join(',')}`;
        await handleSubmit({
          mode_acompte: modeAcompte,
          stripe_payment_intent_id: stripeId,
          gocardless_mandate_id: finData.mandateId,
          gocardless_billing_request_id: brq,
          prelevement_note: note,
          formSnapshot: draftForm,
          existingSnapshot: parsed?.existingFiles || existingFiles,
        });
        sessionStorage.removeItem(`${progress.draftKey}_gc_brq`);
      } catch (err) {
        if (!cancelled) {
          setSubmitError(
            err instanceof Error
              ? err.message
              : 'Mandat reçu, mais la finalisation a échoué. Contactez-nous.'
          );
        }
      } finally {
        if (!cancelled) setIsSubmitting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }) => {
    const hasNew = Boolean(fileNames[fileKey] && files[fileKey]);
    const hasExisting = Boolean(existingFiles[fileKey]) && !hasNew;
    const shown = hasNew || hasExisting;

    return (
      <div>
        <label className="block text-sm font-medium text-dark mb-1.5">
          {label}
          {required ? ' *' : ' (facultatif)'}
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${
            shown ? 'border-teal bg-teal/5' : 'border-gray-200 hover:border-teal'
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
            {hasExisting ? (
              <>
                <p className="text-sm text-teal font-medium">Document déjà en dossier</p>
                <p className="text-xs text-gray-500 mt-1 break-all">
                  {fileNames[fileKey] || existingFiles[fileKey]}
                </p>
                <p className="text-xs text-gray-400 mt-1">Cliquez pour remplacer si besoin</p>
              </>
            ) : fileNames[fileKey] ? (
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
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Chargement de votre dossier…</p>
      </div>
    );
  }

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
            Merci pour votre inscription au <strong>{programme.successFormation}</strong>.
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
            {programme.heroSubtitle}
          </p>
          <p className="text-gray-400 text-sm">{programme.heroMeta}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {draftRestored && step > 0 && (
          <div className="mb-6 rounded-xl border border-teal/30 bg-teal/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-teal-900">
              Votre progression a été restaurée. Vous pouvez continuer où vous en étiez.
            </p>
            <button
              type="button"
              onClick={() => setDraftRestored(false)}
              className="text-xs font-semibold text-teal underline cursor-pointer self-start sm:self-auto"
            >
              Fermer
            </button>
          </div>
        )}

        {step > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s) => {
                const reachable = s.id <= step;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!reachable}
                    onClick={() => {
                      if (reachable) goToStep(s.id, 'push');
                    }}
                    className={`flex flex-col items-center flex-1 bg-transparent border-0 p-0 ${
                      reachable ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    aria-current={step === s.id ? 'step' : undefined}
                  >
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
                  </button>
                );
              })}
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
              <p className="text-gray-600 mb-6">{programme.introLead}</p>
              <button
                onClick={next}
                className="w-full py-4 bg-yellow text-dark font-semibold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer"
              >
                Commencer mon inscription
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Environ 15 minutes · si vous avez déjà candidaté en alternance, votre e-mail
                préremplira une grande partie du dossier.
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
                <p className="font-medium text-dark">{programme.formationLabel}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Durée</p>
                <p className="font-medium text-dark">{programme.dureeLabel}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Lieu</p>
                <p className="font-medium text-dark">85 av. Ledru-Rollin, 75012 Paris</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Frais de scolarité</p>
                <p className="font-medium text-dark">
                  {fraisBoursiersLabel
                    ? `${fraisAnnuelsLabel} / an · ${fraisBoursiersLabel} boursiers (justificatif obligatoire)`
                    : `${fraisAnnuelsLabel} / an`}
                </p>
              </div>
            </div>

            <div className="bg-teal/5 border border-teal/20 rounded-xl p-5 text-sm text-gray-700">
              <p className="font-semibold text-dark mb-2">Remboursement — en un coup d&apos;œil</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Droit de rétractation de 14 jours (acompte remboursé).</li>
                <li>
                  Remboursement intégral : échec au bac, refus de titre de séjour, formation non
                  ouverte.
                </li>
                <li>
                  Si vous trouvez une <strong>alternance</strong> et basculez sur ce parcours,
                  l&apos;acompte de formation initiale vous est remboursé.
                </li>
                <li>Tout remboursement dû sous 30 jours maximum.</li>
              </ul>
            </div>

            <div className="bg-light rounded-xl p-6">
              <h3 className="font-bold text-dark mb-3">Préparez ces documents</h3>
              <ul className="space-y-2">
                {programme.documentsPrep.map((doc, i) => (
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
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    handleChange('email', e.target.value);
                    lookupByEmail(e.target.value);
                  }}
                  onBlur={(e) => lookupByEmail(e.target.value)}
                  className={inputClass}
                />
                {lookupLoading && (
                  <p className="text-xs text-gray-400 mt-1.5">Recherche d&apos;un dossier existant…</p>
                )}
              </div>

              {dossierExistant && (
                <div className="rounded-xl border border-teal/30 bg-teal/5 p-4 text-sm text-gray-700 space-y-2">
                  <p className="font-semibold text-dark">
                    On a retrouvé un dossier lié à cet e-mail
                  </p>
                  <p>
                    Vous avez déjà un dossier en cours (souvent une candidature{' '}
                    <strong>{dossierExistant.origine}</strong>). On a prérempli identité, parcours
                    et {dossierExistant.docsCount > 0 ? (
                      <>
                        <strong>{dossierExistant.docsCount} document
                        {dossierExistant.docsCount > 1 ? 's' : ''}</strong> déjà déposé
                        {dossierExistant.docsCount > 1 ? 's' : ''}
                      </>
                    ) : (
                      'les infos disponibles'
                    )}
                    — pas besoin de tout ressaisir. Vérifiez juste que tout est à jour, puis
                    complétez ce qui manque pour la formation initiale.
                  </p>
                </div>
              )}

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
              {offreTarifBoursier && (
                <div className="rounded-xl border-2 border-teal/30 bg-teal/5 p-5 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-dark">
                      Tarif boursier : {fraisBoursiersLabel} au lieu de {fraisAnnuelsLabel}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Pour en bénéficier, déclarez-vous boursier(e) et joignez un justificatif
                      (notification CROUS ou équivalent).
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        value: 'oui' as const,
                        label: `Oui, je suis boursier(e) — tarif ${fraisBoursiersLabel}`,
                      },
                      {
                        value: 'non' as const,
                        label: `Non — tarif ${fraisAnnuelsLabel}`,
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                          formData.est_boursier === opt.value
                            ? 'border-teal bg-white text-teal'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="est_boursier"
                          value={opt.value}
                          checked={formData.est_boursier === opt.value}
                          onChange={() => handleChange('est_boursier', opt.value)}
                          className="mt-0.5 accent-teal"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {formData.est_boursier === 'oui' && (
                    <FileUpload
                      fileKey="fichier_bourse"
                      label="Justificatif de bourse"
                      required
                    />
                  )}
                </div>
              )}

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
              {!offreTarifBoursier && (
                <FileUpload fileKey="fichier_bourse" label="Notification de bourse" />
              )}
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Le RIB n&apos;est demandé qu&apos;après admission, uniquement pour le prélèvement
              SEPA.
            </p>

            {submitError && step === 4 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{submitError}</p>
              </div>
            )}

            <div className="flex gap-4 mt-10">
              <button
                onClick={prev}
                className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={() => {
                  if (offreTarifBoursier) {
                    if (formData.est_boursier !== 'oui' && formData.est_boursier !== 'non') {
                      setSubmitError(
                        'Indiquez si vous êtes boursier(e) pour déterminer le tarif applicable.'
                      );
                      return;
                    }
                    if (formData.est_boursier === 'oui' && !hasJustificatifBourse) {
                      setSubmitError(
                        'Joignez un justificatif de bourse (notification CROUS ou équivalent) pour bénéficier du tarif boursier.'
                      );
                      return;
                    }
                  }
                  next();
                }}
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
                <strong>{programme.successFormation}</strong>
              </p>
              <p>
                <span className="text-gray-500">Frais annuels :</span>{' '}
                {fraisBoursiersLabel
                  ? tarifBoursierActif
                    ? `${fraisBoursiersLabel} — tarif boursier (justificatif joint)`
                    : `${fraisAnnuelsLabel} (${fraisBoursiersLabel} boursiers sur justificatif)`
                  : fraisAnnuelsLabel}
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
                  <strong>Art. 1 —</strong> {programme.cgiFormation}
                </p>
                <p>
                  <strong>Art. 2 —</strong> {programme.cgiDuree}
                </p>
                <p>
                  <strong>Art. 5 —</strong> Acompte de {ACOMPTE_LABEL} (carte ou chèque) ; solde
                  annuel par chèque (1 à {ECHEANCES_CHEQUE_MAX} échéances) ou par prélèvement SEPA
                  (1 à {ECHEANCES_PRELEVEMENT_MAX} échéances max.). En cas de prélèvement : le
                  premier a lieu le 5 du mois suivant l&apos;inscription, ou le 5 du mois
                  d&apos;après si l&apos;inscription est faite à partir du 30 du mois (délai SEPA
                  GoCardless). Pour une inscription à la date du jour, le premier prélèvement serait
                  le <strong>{formatDateFr(firstPrelevementDate)}</strong>, puis chaque mois à la
                  même date jusqu&apos;à solde.
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
                  visa/titre de séjour, formation non ouverte, ou obtention d&apos;un contrat
                  d&apos;alternance entraînant le basculement hors formation initiale.
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
              Choisissez le règlement du solde annuel (chèque ou prélèvement), puis l&apos;acompte de
              pré-inscription ({ACOMPTE_LABEL}) par carte ou par chèque.
            </p>
            <div className="mb-8 rounded-xl border border-gray-200 bg-light p-4 text-sm">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                Frais de scolarité applicables
              </p>
              <p className="font-semibold text-dark">{fraisAnnuelMention}</p>
              {offreTarifBoursier && !tarifBoursierActif && (
                <p className="text-xs text-gray-500 mt-1">
                  Tarif boursier {fraisBoursiersLabel} : justificatif de bourse requis à l&apos;étape
                  des pièces.
                </p>
              )}
            </div>

            {/* 1. Échéancier annuel — chèque OU prélèvement */}
            <div className="mb-10">
              <h3 className="font-bold text-dark mb-2">1. Paiement du solde annuel</h3>
              <p className="text-sm text-gray-500 mb-4">
                Après l&apos;acompte, le solde se règle par chèque ou par prélèvement SEPA.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-5">
                {(
                  [
                    {
                      value: 'cheque' as const,
                      title: 'Chèques',
                      desc: `1 à ${ECHEANCES_CHEQUE_MAX} chèques pour l’année`,
                    },
                    {
                      value: 'prelevement' as const,
                      title: 'Prélèvement bancaire',
                      desc: `Jusqu’à ${ECHEANCES_PRELEVEMENT_MAX} prélèvements · 1er le ${formatDateFr(firstPrelevementDate)}`,
                    },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-col gap-1 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.mode_solde === opt.value
                        ? 'border-teal bg-teal/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="mode_solde"
                        value={opt.value}
                        checked={formData.mode_solde === opt.value}
                        onChange={() => {
                          handleChange('mode_solde', opt.value);
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

              {formData.mode_solde === 'cheque' && (
                <>
                  <p className="text-sm text-gray-500 mb-3">
                    Combien de chèques souhaitez-vous prévoir ? (1 à {ECHEANCES_CHEQUE_MAX})
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
                      {montantParChequeEuros(formData.nb_cheques, fraisCentsAppliques).toFixed(2)} €
                    </strong>{' '}
                    par chèque (indicatif) — solde après acompte de {ACOMPTE_LABEL}.
                  </p>
                </>
              )}

              {formData.mode_solde === 'prelevement' && (
                <>
                  <p className="text-sm text-gray-500 mb-3">
                    Combien de prélèvements mensuels ? (1 à {ECHEANCES_PRELEVEMENT_MAX}) — premier
                    le{' '}
                    <strong className="text-dark">{formatDateFr(firstPrelevementDate)}</strong>
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: ECHEANCES_PRELEVEMENT_MAX }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          handleChange('nb_prelevements', n);
                          setSubmitError('');
                        }}
                        className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                          formData.nb_prelevements === n
                            ? 'border-teal bg-teal/5 text-teal'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3 mb-4">
                    Environ{' '}
                    <strong className="text-dark">
                      {montantParPrelevementEuros(
                        formData.nb_prelevements,
                        fraisCentsAppliques,
                        ACOMPTE_CENTS
                      ).toFixed(2)}{' '}
                      €
                    </strong>{' '}
                    par prélèvement (indicatif) — solde après acompte de {ACOMPTE_LABEL}.
                  </p>

                  <div className="rounded-xl border border-gray-200 bg-light/60 p-4 mb-5">
                    <p className="text-sm font-semibold text-dark mb-2">
                      Calendrier des prélèvements
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Inscription à partir du 30 du mois → le premier prélèvement bascule au mois
                      suivant (délai SEPA).
                    </p>
                    <ul className="space-y-1.5 text-sm text-gray-700">
                      {prelevementSchedule.map((e) => (
                        <li key={e.index} className="flex justify-between gap-3">
                          <span>
                            {e.index}
                            {e.index === 1 ? 'er' : 'e'} prélèvement —{' '}
                            <strong className="text-dark">{formatDateFr(e.date)}</strong>
                          </span>
                          <span className="font-medium text-dark whitespace-nowrap">
                            {e.euros} €
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-5 space-y-5 mb-2">
                    <div>
                      <h4 className="font-bold text-dark mb-1">
                        Signature électronique — engagement de prélèvement
                      </h4>
                      <p className="text-xs text-gray-500">
                        En signant, vous acceptez le calendrier ci-dessus et le mandat SEPA
                        GoCardless qui suivra après l&apos;acompte.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">
                        Nom et prénom (tels qu&apos;indiqués à l&apos;identité) *
                      </label>
                      <input
                        type="text"
                        value={formData.signature_prelevement_nom}
                        onChange={(e) =>
                          handleChange('signature_prelevement_nom', e.target.value)
                        }
                        placeholder={`${formData.prenom} ${formData.nom}`.trim() || 'Prénom Nom'}
                        className={inputClass}
                      />
                      {formData.signature_prelevement_nom && !signaturePrelevementNomOk && (
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
                        value={formData.signature_prelevement_image}
                        onChange={(dataUrl) =>
                          handleChange('signature_prelevement_image', dataUrl)
                        }
                      />
                    </div>
                  </div>
                </>
              )}
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
                      desc: 'Paiement sur cette page — place bloquée tout de suite',
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
                          // Ne pas effacer stripe_payment_intent_id : l’acompte peut déjà être payé.
                          if (opt.value !== 'cheque') {
                            handleChange('engage_depot_cheque', false);
                          }
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
                  {!planSoldeOk ? (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4">
                      {formData.mode_solde === 'prelevement' && planPrelevementChoixOk
                        ? 'Signez électroniquement l’engagement de prélèvement (nom + signature) avant de régler l’acompte.'
                        : 'Indiquez d’abord le mode et le nombre d’échéances pour le solde annuel.'}
                    </p>
                  ) : formData.stripe_payment_intent_id ? (
                    <div className="rounded-xl border border-teal/30 bg-teal/5 p-5 space-y-4">
                      <p className="text-sm text-dark font-semibold">
                        Acompte de {ACOMPTE_LABEL} déjà payé par carte
                      </p>
                      <p className="text-xs text-gray-600 font-mono break-all">
                        Réf. Stripe : {formData.stripe_payment_intent_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formData.mode_solde === 'prelevement'
                          ? 'Il reste à signer le mandat de prélèvement SEPA, puis le dossier sera envoyé. Ne payez pas une seconde fois.'
                          : 'Vous pouvez finaliser l’envoi du dossier ci-dessous.'}
                      </p>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          if (formData.mode_solde === 'prelevement') {
                            void startGoCardlessMandate({
                              mode_acompte: 'carte',
                              stripe_payment_intent_id: formData.stripe_payment_intent_id,
                            });
                          } else {
                            void handleSubmit({
                              mode_acompte: 'carte',
                              stripe_payment_intent_id: formData.stripe_payment_intent_id,
                            });
                          }
                        }}
                        className="w-full py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 transition-all text-base cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting
                          ? 'Traitement en cours…'
                          : formData.mode_solde === 'prelevement'
                            ? 'Signer le mandat de prélèvement et envoyer le dossier'
                            : 'Finaliser et envoyer mon dossier'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <StripeAcompteBlock
                        email={formData.email}
                        prenom={formData.prenom}
                        nom={formData.nom}
                        onPaid={handleCardPaid}
                        disabled={isSubmitting}
                        returnPath={progress.basePath}
                        onBeforeConfirm={saveDraftForStripe}
                      />
                      <p className="text-xs text-gray-500 text-center mt-3">
                        {formData.mode_solde === 'prelevement'
                          ? 'Après le paiement de l’acompte, vous serez redirigé vers GoCardless pour signer le mandat de prélèvement, puis le dossier sera envoyé.'
                          : 'Les champs carte s’affichent ici. Après paiement réussi, le dossier est envoyé automatiquement.'}
                      </p>
                    </>
                  )}
                  {isSubmitting && !formData.stripe_payment_intent_id && (
                    <p className="text-sm text-gray-500 text-center mt-4">
                      {formData.mode_solde === 'prelevement'
                        ? 'Traitement en cours…'
                        : 'Paiement reçu — envoi du dossier en cours…'}
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
                        Au dos : nom, prénom et « {programme.chequeDos} »
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
                    onClick={() => {
                      if (formData.mode_solde === 'prelevement') {
                        void startGoCardlessMandate({ mode_acompte: 'cheque' });
                      } else {
                        void handleSubmit({ mode_acompte: 'cheque' });
                      }
                    }}
                    disabled={isSubmitting || !formData.engage_depot_cheque || !planSoldeOk}
                    className="w-full py-4 bg-yellow text-dark font-bold rounded-xl hover:brightness-95 transition-all text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting
                      ? 'Envoi en cours…'
                      : formData.mode_solde === 'prelevement'
                        ? 'Signer le mandat de prélèvement et envoyer le dossier'
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
