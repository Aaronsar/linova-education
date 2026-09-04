/** Persistance + URL pour les parcours /inscription-initial* */

export const INSCRIPTION_FILES_STORE = 'files';

export const STEP_SLUGS = [
  'intro',
  'identite',
  'parcours',
  'projet',
  'documents',
  'signature',
  'paiement',
] as const;

export type StepSlug = (typeof STEP_SLUGS)[number];

export type ProgressFileKey =
  | 'fichier_cni'
  | 'fichier_photos'
  | 'fichier_releve'
  | 'fichier_bulletins'
  | 'fichier_cv'
  | 'fichier_motivation'
  | 'fichier_jdc'
  | 'fichier_rc'
  | 'fichier_bourse';

export interface InscriptionProgressDraft {
  version: 1;
  step: number;
  formData: Record<string, unknown>;
  existingFiles: Partial<Record<ProgressFileKey, string>>;
  fileNames: Record<ProgressFileKey, string>;
  dossierExistant: { docsCount: number; origine: string } | null;
  savedAt: string;
}

export interface InscriptionProgressConfig {
  basePath: string;
  progressKey: string;
  filesDb: string;
  draftKey: string;
}

export const PROGRESS_STANDARD: InscriptionProgressConfig = {
  basePath: '/inscription-initial',
  progressKey: 'linova_inscription_initial_progress',
  filesDb: 'linova_inscription_initial_files',
  draftKey: 'linova_inscription_initial_draft',
};

export const PROGRESS_2A: InscriptionProgressConfig = {
  basePath: '/inscription-initial-2a',
  progressKey: 'linova_inscription_initial_2a_progress',
  filesDb: 'linova_inscription_initial_2a_files',
  draftKey: 'linova_inscription_initial_2a_draft',
};

/** @deprecated — préférer PROGRESS_STANDARD.progressKey */
export const INSCRIPTION_PROGRESS_KEY = PROGRESS_STANDARD.progressKey;
/** @deprecated */
export const INSCRIPTION_FILES_DB = PROGRESS_STANDARD.filesDb;

export function stepToSlug(step: number): StepSlug {
  const clamped = Math.max(0, Math.min(6, Math.round(step)));
  return STEP_SLUGS[clamped];
}

export function slugToStep(slug: string | null | undefined): number | null {
  if (!slug) return null;
  const idx = STEP_SLUGS.indexOf(slug as StepSlug);
  return idx >= 0 ? idx : null;
}

/** Construit l’URL avec ?etape=… en conservant d’éventuels autres params (ex. paiement=ok). */
export function buildInscriptionUrl(
  basePath: string,
  step: number,
  extra?: Record<string, string | null | undefined>
): string {
  const params = new URLSearchParams();
  params.set('etape', stepToSlug(step));
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v != null && v !== '') params.set(k, v);
    }
  }
  const q = params.toString();
  return q ? `${basePath}?${q}` : basePath;
}

export function readStepFromLocation(): number | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return slugToStep(params.get('etape'));
}

export function syncInscriptionUrl(
  basePath: string,
  step: number,
  mode: 'push' | 'replace' = 'replace',
  extra?: Record<string, string | null | undefined>
) {
  if (typeof window === 'undefined') return;
  const current = new URLSearchParams(window.location.search);
  const merged: Record<string, string | null | undefined> = {
    paiement: current.get('paiement'),
    session_id: current.get('session_id'),
    ...extra,
  };
  const url = buildInscriptionUrl(basePath, step, merged);
  if (mode === 'push') {
    window.history.pushState({ step }, '', url);
  } else {
    window.history.replaceState({ step }, '', url);
  }
}

export function loadProgressDraft(
  progressKey: string = PROGRESS_STANDARD.progressKey
): InscriptionProgressDraft | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(progressKey);
    if (!raw) return null;
    const data = JSON.parse(raw) as InscriptionProgressDraft;
    if (!data || data.version !== 1 || typeof data.step !== 'number') return null;
    return data;
  } catch {
    return null;
  }
}

export function saveProgressDraft(
  draft: Omit<InscriptionProgressDraft, 'version' | 'savedAt'>,
  progressKey: string = PROGRESS_STANDARD.progressKey
) {
  if (typeof window === 'undefined') return;
  const payload: InscriptionProgressDraft = {
    version: 1,
    ...draft,
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(progressKey, JSON.stringify(payload));
  } catch (err) {
    console.warn('[inscription-initial] localStorage plein ou indisponible', err);
  }
}

export function clearProgressDraft(progressKey: string = PROGRESS_STANDARD.progressKey) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(progressKey);
  } catch {
    /* ignore */
  }
}

function openFilesDb(filesDb: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(filesDb, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(INSCRIPTION_FILES_STORE)) {
        db.createObjectStore(INSCRIPTION_FILES_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
  });
}

export async function saveFileBlob(
  key: ProgressFileKey,
  file: File,
  filesDb: string = PROGRESS_STANDARD.filesDb
): Promise<void> {
  const db = await openFilesDb(filesDb);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(INSCRIPTION_FILES_STORE, 'readwrite');
    tx.objectStore(INSCRIPTION_FILES_STORE).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB put failed'));
  });
  db.close();
}

export async function deleteFileBlob(
  key: ProgressFileKey,
  filesDb: string = PROGRESS_STANDARD.filesDb
): Promise<void> {
  const db = await openFilesDb(filesDb);
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(INSCRIPTION_FILES_STORE, 'readwrite');
    tx.objectStore(INSCRIPTION_FILES_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB delete failed'));
  });
  db.close();
}

export async function loadAllFileBlobs(
  filesDb: string = PROGRESS_STANDARD.filesDb
): Promise<Partial<Record<ProgressFileKey, File>>> {
  const db = await openFilesDb(filesDb);
  const result = await new Promise<Partial<Record<ProgressFileKey, File>>>((resolve, reject) => {
    const tx = db.transaction(INSCRIPTION_FILES_STORE, 'readonly');
    const store = tx.objectStore(INSCRIPTION_FILES_STORE);
    const req = store.openCursor();
    const out: Partial<Record<ProgressFileKey, File>> = {};
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) {
        resolve(out);
        return;
      }
      const key = cursor.key as ProgressFileKey;
      const value = cursor.value;
      if (value instanceof File) {
        out[key] = value;
      } else if (value instanceof Blob) {
        out[key] = new File([value], key, { type: value.type || 'application/octet-stream' });
      }
      cursor.continue();
    };
    req.onerror = () => reject(req.error || new Error('IndexedDB cursor failed'));
  });
  db.close();
  return result;
}

export async function clearAllFileBlobs(
  filesDb: string = PROGRESS_STANDARD.filesDb
): Promise<void> {
  try {
    const db = await openFilesDb(filesDb);
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(INSCRIPTION_FILES_STORE, 'readwrite');
      tx.objectStore(INSCRIPTION_FILES_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB clear failed'));
    });
    db.close();
  } catch {
    /* ignore */
  }
}

export async function clearAllInscriptionProgress(
  config: InscriptionProgressConfig = PROGRESS_STANDARD
) {
  clearProgressDraft(config.progressKey);
  await clearAllFileBlobs(config.filesDb);
  try {
    sessionStorage.removeItem(config.draftKey);
  } catch {
    /* ignore */
  }
}
