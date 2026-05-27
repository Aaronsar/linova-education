'use client';

/**
 * Form React custom qui consomme l'API Diploma Santé.
 *
 * Pourquoi pas l'iframe ou le script embed.js du CRM ?
 *   - L'iframe casse la charte (couleurs/typo)
 *   - Le script natif n'affiche pas les labels visibles et utilise
 *     des checkboxes au lieu de radios pour les "Oui/Non"
 *
 * Approche : on récupère le schema JSON, on rend nous-mêmes le HTML
 * aux couleurs Linova (teal/navy/yellow), on submit à l'API.
 *
 * Endpoints :
 *   GET  {DIPLOMA_API_BASE}/api/forms/{slug}/public   → schema
 *   POST {DIPLOMA_API_BASE}/api/forms/{slug}/submit   → submission
 *
 * Usage :
 *   <DiplomaFormEmbed form="contact" />
 *   <DiplomaFormEmbed form="linova-contact-hs214e4f" />   // slug brut OK aussi
 */

import { useState, useEffect, useMemo } from 'react';
import {
  DIPLOMA_API_BASE,
  resolveDiplomaFormSlug,
  type DiplomaFormSchema,
  type DiplomaFormField,
  type DiplomaFieldType,
  type DiplomaFormKey,
} from '@/lib/diploma-forms';

interface DiplomaFormEmbedProps {
  /** Clé du dictionnaire DIPLOMA_FORMS ou slug brut */
  form: DiplomaFormKey | string;
  /** Texte facultatif sous le bouton submit */
  footerText?: string;
  /** Callback déclenché après succès (ex : fermer une modal) */
  onSuccess?: () => void;
  /** Empêche d'afficher le titre venant du schema (utile si déjà mis au-dessus) */
  hideTitle?: boolean;
}

type SubmissionState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; message?: string | null }
  | { kind: 'error'; error: string };

const FIELD_PAIR_KEYS_GRID = ['firstname', 'lastname', 'prenom', 'nom'];

export default function DiplomaFormEmbed({
  form,
  footerText,
  onSuccess,
  hideTitle,
}: DiplomaFormEmbedProps) {
  const slug = useMemo(() => resolveDiplomaFormSlug(form), [form]);
  const [schema, setSchema] = useState<DiplomaFormSchema | null>(null);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [submitState, setSubmitState] = useState<SubmissionState>({ kind: 'idle' });

  // ─── Fetch schema ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSchemaError(null);
    fetch(`${DIPLOMA_API_BASE}/api/forms/${encodeURIComponent(slug)}/public`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<DiplomaFormSchema>;
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.error) {
          setSchemaError(data.error);
        } else {
          setSchema(data);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setSchemaError(err instanceof Error ? err.message : 'Erreur de chargement');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ─── Helpers de paire de champs (grid 2 cols) ────────────────────────────
  const fieldGroups = useMemo(() => {
    if (!schema) return [];
    const sorted = [...schema.fields].sort((a, b) => a.order_index - b.order_index);
    const groups: DiplomaFormField[][] = [];
    let i = 0;
    while (i < sorted.length) {
      const current = sorted[i];
      const next = sorted[i + 1];
      const isPairable =
        next &&
        current.field_type !== 'textarea' &&
        next.field_type !== 'textarea' &&
        current.field_type !== 'select' &&
        next.field_type !== 'select' &&
        (current.field_type === 'text' || current.field_type === 'email' || current.field_type === 'tel' || current.field_type === 'number') &&
        (next.field_type === 'text' || next.field_type === 'email' || next.field_type === 'tel' || next.field_type === 'number') &&
        FIELD_PAIR_KEYS_GRID.includes(current.field_key.toLowerCase()) &&
        FIELD_PAIR_KEYS_GRID.includes(next.field_key.toLowerCase());
      if (isPairable) {
        groups.push([current, next]);
        i += 2;
      } else {
        groups.push([current]);
        i += 1;
      }
    }
    return groups;
  }, [schema]);

  // ─── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schema || submitState.kind === 'submitting') return;

    // Validation client basique des required
    const missing = schema.fields.filter((f) => {
      if (!f.required) return false;
      const v = values[f.field_key];
      if (Array.isArray(v)) return v.length === 0;
      return !v || !String(v).trim();
    });
    if (missing.length) {
      setSubmitState({
        kind: 'error',
        error: `Champ${missing.length > 1 ? 's' : ''} obligatoire${missing.length > 1 ? 's' : ''} : ${missing.map((m) => m.label).join(', ')}`,
      });
      return;
    }

    setSubmitState({ kind: 'submitting' });

    // Sérialise les valeurs (les multi-checkboxes → CSV)
    const data: Record<string, string> = {};
    for (const f of schema.fields) {
      const v = values[f.field_key];
      if (Array.isArray(v)) data[f.field_key] = v.join(',');
      else if (v !== undefined && v !== null) data[f.field_key] = String(v);
    }

    // UTM params depuis l'URL
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

    const payload = {
      data,
      hp: '', // honeypot toujours vide
      source_url: typeof window !== 'undefined' ? window.location.href : '',
      utm_source: urlParams?.get('utm_source') || '',
      utm_medium: urlParams?.get('utm_medium') || '',
      utm_campaign: urlParams?.get('utm_campaign') || '',
      utm_term: urlParams?.get('utm_term') || '',
      utm_content: urlParams?.get('utm_content') || '',
    };

    try {
      const res = await fetch(`${DIPLOMA_API_BASE}/api/forms/${encodeURIComponent(slug)}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setSubmitState({ kind: 'success', message: schema.success_message });

      // Tracking (best-effort)
      try {
        const w = window as unknown as {
          dataLayer?: { push: (e: unknown) => void };
          fbq?: (cmd: string, evt: string) => void;
        };
        w.dataLayer?.push({ event: 'form_submit', form_slug: slug });
        w.fbq?.('track', 'Contact');
      } catch {
        // silencieux
      }

      onSuccess?.();
    } catch (err) {
      setSubmitState({
        kind: 'error',
        error: err instanceof Error ? err.message : 'Erreur lors de l\'envoi',
      });
    }
  }

  // ─── Rendu ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (schemaError || !schema) {
    return (
      <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
        {schemaError || 'Impossible de charger le formulaire.'}
      </div>
    );
  }

  if (submitState.kind === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-[var(--font-outfit)] text-xl font-bold text-navy mb-2">Merci !</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          {submitState.message || 'Votre demande a bien été enregistrée. Notre équipe vous recontacte rapidement.'}
        </p>
      </div>
    );
  }

  const submitLabel = schema.submit_label || 'Envoyer';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {!hideTitle && schema.title && (
        <h3 className="font-[var(--font-outfit)] text-xl font-bold text-dark mb-2">{schema.title}</h3>
      )}

      {fieldGroups.map((group, gi) => (
        <div
          key={`g-${gi}`}
          className={group.length === 2 ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}
        >
          {group.map((field) => (
            <FieldRenderer
              key={field.field_key}
              field={field}
              value={values[field.field_key]}
              onChange={(v) =>
                setValues((prev) => ({ ...prev, [field.field_key]: v }))
              }
            />
          ))}
        </div>
      ))}

      {/* Honeypot — ne devrait jamais être rempli par un humain */}
      <input
        type="text"
        name="hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        onChange={() => {}}
      />

      {submitState.kind === 'error' && (
        <div className="bg-red-50 text-red-700 rounded-lg px-3 py-2 text-xs">
          {submitState.error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitState.kind === 'submitting'}
        className="w-full bg-teal text-white py-3 rounded-xl font-bold text-sm hover:brightness-95 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {submitState.kind === 'submitting' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            {submitLabel}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      {footerText && (
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">{footerText}</p>
      )}
    </form>
  );
}

// ─── Renderer d'un champ ───────────────────────────────────────────────────

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: DiplomaFormField;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  const inputClass =
    'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all text-dark text-sm placeholder-gray-400 bg-white';

  const requiredStar = field.required && (
    <span className="text-teal ml-0.5" aria-hidden="true">*</span>
  );

  const labelEl = (
    <label htmlFor={field.field_key} className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {field.label}
      {requiredStar}
    </label>
  );

  const helpEl = field.help_text ? (
    <p className="text-[11px] text-gray-400 mt-1">{field.help_text}</p>
  ) : null;

  const strValue = typeof value === 'string' ? value : '';
  const arrValue = Array.isArray(value) ? value : [];

  const type: DiplomaFieldType = field.field_type;

  // ─── Checkbox 2 options → radio Oui/Non
  if (type === 'checkbox' && field.options && field.options.length === 2) {
    return (
      <div>
        {labelEl}
        <div className="flex gap-2">
          {field.options.map((opt) => {
            const checked = strValue === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex-1 cursor-pointer rounded-xl border px-4 py-2.5 text-sm transition-all ${
                  checked
                    ? 'border-teal bg-teal/10 text-navy font-semibold'
                    : 'border-gray-200 text-dark hover:border-teal/50'
                }`}
              >
                <input
                  type="radio"
                  name={field.field_key}
                  value={opt.value}
                  checked={checked}
                  onChange={() => onChange(opt.value)}
                  className="sr-only"
                  required={field.required}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {helpEl}
      </div>
    );
  }

  // ─── Checkbox multi (>2 options) → vraies checkboxes
  if (type === 'checkbox' && field.options && field.options.length > 2) {
    return (
      <div>
        {labelEl}
        <div className="space-y-1.5">
          {field.options.map((opt) => {
            const checked = arrValue.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer text-sm text-dark"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...arrValue, opt.value]
                      : arrValue.filter((x) => x !== opt.value);
                    onChange(next);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-teal focus:ring-teal/30"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {helpEl}
      </div>
    );
  }

  // ─── Radio
  if (type === 'radio' && field.options) {
    return (
      <div>
        {labelEl}
        <div className="space-y-1.5">
          {field.options.map((opt) => {
            const checked = strValue === opt.value;
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer text-sm text-dark"
              >
                <input
                  type="radio"
                  name={field.field_key}
                  value={opt.value}
                  checked={checked}
                  onChange={() => onChange(opt.value)}
                  className="w-4 h-4 border-gray-300 text-teal focus:ring-teal/30"
                  required={field.required}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {helpEl}
      </div>
    );
  }

  // ─── Select
  if (type === 'select' && field.options) {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <select
            id={field.field_key}
            name={field.field_key}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={`${inputClass} appearance-none pr-10`}
          >
            <option value="">{field.placeholder || '— Sélectionner —'}</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {helpEl}
      </div>
    );
  }

  // ─── Textarea
  if (type === 'textarea') {
    return (
      <div>
        {labelEl}
        <textarea
          id={field.field_key}
          name={field.field_key}
          value={strValue}
          placeholder={field.placeholder || ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={4}
          className={`${inputClass} resize-none`}
        />
        {helpEl}
      </div>
    );
  }

  // ─── text / email / tel / number
  const htmlType =
    type === 'email' ? 'email'
    : type === 'tel' ? 'tel'
    : type === 'number' ? 'number'
    : 'text';

  const autoComplete =
    field.field_key.toLowerCase().includes('email') ? 'email'
    : field.field_key.toLowerCase().includes('phone') || field.field_key.toLowerCase().includes('tel') ? 'tel'
    : field.field_key.toLowerCase() === 'firstname' || field.field_key.toLowerCase() === 'prenom' ? 'given-name'
    : field.field_key.toLowerCase() === 'lastname' || field.field_key.toLowerCase() === 'nom' ? 'family-name'
    : undefined;

  return (
    <div>
      {labelEl}
      <input
        id={field.field_key}
        name={field.field_key}
        type={htmlType}
        value={strValue}
        placeholder={field.placeholder || ''}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        autoComplete={autoComplete}
        className={inputClass}
      />
      {helpEl}
    </div>
  );
}
