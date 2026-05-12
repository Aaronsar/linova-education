'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';

interface Inscription {
  id: string;
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
  fichier_cni_url: string;
  fichier_photos_url: string;
  fichier_releve_url: string;
  entreprise_trouvee: string;
  nom_entreprise: string;
  aide_recherche: string;
  disponible_echange: string;
  creneaux_preferes: string;
  source_decouverte: string;
  newsletter: string;
  remarques: string;
  statut: string;
  notes_admin: string;
  created_at: string;
}

const statusOptions = [
  { value: 'nouveau', label: 'Recu', bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  { value: 'en_cours', label: 'En traitement', bg: 'bg-yellow/20', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  { value: 'entretien', label: 'Dossier complet', bg: 'bg-teal/15', text: 'text-teal-700', dot: 'bg-teal' },
  { value: 'accepte', label: 'Inscrit', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  { value: 'refuse', label: 'Refuse', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
];

function calculateAge(dateStr: string): number | null {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function InscriptionDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [inscription, setInscription] = useState<Inscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [notesAdmin, setNotesAdmin] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchInscription();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const fetchInscription = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('candidatures')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (!error && data) {
      setInscription(data);
      setNotesAdmin(data.notes_admin || '');
      // Pré-charge les URLs signées pour les fichiers (bucket privé : on ne peut
      // pas utiliser getPublicUrl, il faut signer chaque accès). Validité 1 h.
      const paths = [data.fichier_cni_url, data.fichier_photos_url, data.fichier_releve_url].filter(
        (p): p is string => Boolean(p)
      );
      if (paths.length) {
        const { data: signed } = await supabase.storage
          .from('candidatures')
          .createSignedUrls(paths, 3600);
        if (signed) {
          const map: Record<string, string> = {};
          signed.forEach((item) => {
            if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
          });
          setSignedUrls(map);
        }
      }
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus: string) => {
    if (!inscription) return;
    setSavingStatus(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        showSaveMessage('Session expirée, veuillez vous reconnecter');
        return;
      }
      const res = await fetch('/api/candidatures/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ candidatureId: inscription.id, newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('updateStatus error:', data.error);
        showSaveMessage(`Erreur : ${data.error || 'mise à jour échouée'}`);
        return;
      }
      setInscription((prev) => prev ? { ...prev, statut: newStatus } : prev);
      if (data.emailWarning) {
        showSaveMessage(`Statut mis à jour · ${data.emailWarning}`);
      } else if (newStatus === 'accepte') {
        showSaveMessage('Statut mis à jour · email d\'inscription envoyé');
      } else if (newStatus === 'refuse') {
        showSaveMessage('Statut mis à jour · email de refus programmé (J+1)');
      } else {
        showSaveMessage('Statut mis à jour');
      }
    } finally {
      setSavingStatus(false);
    }
  };

  const saveNotes = async () => {
    if (!inscription) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from('candidatures')
      .update({ notes_admin: notesAdmin })
      .eq('id', inscription.id);

    if (error) {
      console.error('saveNotes error:', error);
      showSaveMessage(`Erreur : ${error.message}`);
    } else {
      showSaveMessage('Notes enregistrées');
    }
    setSavingNotes(false);
  };

  const showSaveMessage = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const getFileDownloadUrl = (path: string): string | null => {
    if (!path) return null;
    return signedUrls[path] || null;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <svg className="animate-spin h-8 w-8 text-teal mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 text-sm">Chargement de la fiche...</p>
      </div>
    );
  }

  if (!inscription) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-dark mb-2">Inscription introuvable</h2>
        <p className="text-gray-500 mb-6">Cette inscription n&apos;existe pas ou a ete supprimee.</p>
        <a href="/espace-candidature" className="inline-flex items-center gap-2 text-teal font-medium hover:underline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour a la liste
        </a>
      </div>
    );
  }

  const age = calculateAge(inscription.date_naissance);
  const currentStatus = statusOptions.find((s) => s.value === (inscription.statut || 'nouveau')) || statusOptions[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Save notification */}
      {saveMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-600 text-white px-5 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {saveMessage}
        </div>
      )}

      {/* Back link */}
      <a href="/espace-candidature" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark text-sm font-medium mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour a la liste
      </a>

      {/* Header card with photo, name, status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Photo placeholder */}
          <div className="flex-shrink-0">
            {inscription.fichier_photos_url ? (
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getFileDownloadUrl(inscription.fichier_photos_url) || ''}
                  alt={`${inscription.prenom} ${inscription.nom}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-navy/10 flex items-center justify-center">
                <span className="text-3xl font-bold text-navy">
                  {(inscription.prenom?.[0] || '').toUpperCase()}{(inscription.nom?.[0] || '').toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name and info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="font-[var(--font-outfit)] text-2xl font-bold text-dark">
                {inscription.prenom} {inscription.nom}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.bg} ${currentStatus.text}`}>
                <span className={`w-2 h-2 rounded-full ${currentStatus.dot}`} />
                {currentStatus.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
              {age !== null && (
                <span>{age} ans</span>
              )}
              {inscription.date_naissance && (
                <span>Ne(e) le {formatDate(inscription.date_naissance)}</span>
              )}
              {inscription.lieu_naissance && (
                <span>{inscription.lieu_naissance}</span>
              )}
              {inscription.nationalite && (
                <span>{inscription.nationalite}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">Dossier recu le {formatDateTime(inscription.created_at)}</p>
          </div>

          {/* Status dropdown */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1">Changer le statut</label>
            <select
              value={inscription.statut || 'nouveau'}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={savingStatus}
              className="w-full sm:w-44 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal bg-white disabled:opacity-50"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <Section title="Coordonnees">
            <InfoGrid>
              <InfoItem label="Email" value={inscription.email} href={`mailto:${inscription.email}`} />
              <InfoItem label="Telephone" value={inscription.telephone} href={`tel:${inscription.telephone}`} />
              <InfoItem label="Adresse" value={[inscription.adresse, `${inscription.code_postal} ${inscription.ville}`, inscription.departement].filter(Boolean).join(', ')} />
            </InfoGrid>
          </Section>

          {/* Parcours scolaire */}
          <Section title="Parcours scolaire">
            <InfoGrid>
              <InfoItem label="Niveau d'etudes" value={inscription.niveau_etudes} />
              <InfoItem label="Filiere bac" value={inscription.filiere_bac} />
              <InfoItem label="Annee d'obtention" value={inscription.annee_obtention} />
              <InfoItem label="Etablissement" value={inscription.etablissement} />
              <InfoItem label="Dernier diplome" value={inscription.dernier_diplome} span={2} />
              <InfoItem label="Niveau anglais" value={inscription.niveau_anglais} />
            </InfoGrid>
          </Section>

          {/* Alternance */}
          <Section title="Alternance">
            <InfoGrid>
              <InfoItem label="Entreprise trouvee" value={inscription.entreprise_trouvee} />
              {inscription.nom_entreprise && (
                <InfoItem label="Nom de l'entreprise" value={inscription.nom_entreprise} />
              )}
              <InfoItem label="Souhaite aide recherche" value={inscription.aide_recherche} />
            </InfoGrid>
          </Section>

          {/* Informations complementaires */}
          <Section title="Informations complementaires">
            <InfoGrid>
              <InfoItem label="Disponible pour echange" value={inscription.disponible_echange} />
              <InfoItem label="Creneaux preferes" value={inscription.creneaux_preferes} />
              <InfoItem label="Source decouverte" value={inscription.source_decouverte} />
              <InfoItem label="Newsletter" value={inscription.newsletter} />
              {inscription.remarques && (
                <InfoItem label="Remarques" value={inscription.remarques} span={2} />
              )}
            </InfoGrid>
          </Section>
        </div>

        {/* Right column: documents, admin notes, identity */}
        <div className="space-y-6">
          {/* Identite administrative */}
          <Section title="Identite administrative">
            <div className="space-y-3">
              <InfoItem label="N. Securite Sociale" value={inscription.numero_secu} />
              <InfoItem label="N. CNI / Titre de sejour" value={inscription.numero_cni} />
            </div>
          </Section>

          {/* Documents */}
          <Section title="Documents">
            <div className="space-y-3">
              <FileLink label="Carte d'identite" path={inscription.fichier_cni_url} getUrl={getFileDownloadUrl} />
              <FileLink label="Photos d'identite" path={inscription.fichier_photos_url} getUrl={getFileDownloadUrl} />
              <FileLink label="Releve de notes / Diplome" path={inscription.fichier_releve_url} getUrl={getFileDownloadUrl} />
            </div>
          </Section>

          {/* Admin notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-[var(--font-outfit)] text-base font-bold text-dark mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notes internes
            </h3>
            <textarea
              rows={5}
              value={notesAdmin}
              onChange={(e) => setNotesAdmin(e.target.value)}
              placeholder="Ajouter des notes sur cet etudiant..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none mb-3"
            />
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="w-full py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {savingNotes ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les notes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----- Reusable components ----- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
      <h3 className="font-[var(--font-outfit)] text-base font-bold text-dark mb-4 pb-3 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function InfoItem({
  label,
  value,
  href,
  span = 1,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
  span?: number;
}) {
  const display = value || '--';
  return (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      {href && value ? (
        <a href={href} className="text-sm text-teal font-medium hover:underline">
          {display}
        </a>
      ) : (
        <p className="text-sm text-dark">{display}</p>
      )}
    </div>
  );
}

function FileLink({
  label,
  path,
  getUrl,
}: {
  label: string;
  path: string | null | undefined;
  getUrl: (p: string) => string | null;
}) {
  if (!path) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xs text-gray-400">Non fourni</p>
        </div>
      </div>
    );
  }

  const url = getUrl(path);

  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-teal/5 hover:bg-teal/10 transition-colors group"
    >
      <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-dark font-medium group-hover:text-teal transition-colors">{label}</p>
        <p className="text-xs text-gray-400 truncate">{path.split('/').pop()}</p>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-teal transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}
