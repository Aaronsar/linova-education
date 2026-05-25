/**
 * Webhook sortant vers le CRM externe (rdv-agenda.vercel.app).
 *
 * Envoyé à chaque changement de statut d'un RDV créé depuis le CRM
 * (identifié via la colonne external_id). Signature HMAC-SHA256 dans
 * le header X-Linova-Signature pour que le CRM puisse valider l'origine.
 *
 * Variables d'env requises sur Vercel :
 *   - CRM_WEBHOOK_URL : URL POST chez le CRM
 *   - CRM_WEBHOOK_SECRET : secret HMAC partagé
 */

import { createHmac } from 'crypto';

export type AppointmentStatus =
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'dossier_accepte'
  | 'dossier_refuse'
  | 'inscrit';

export interface AppointmentStatusChangedPayload {
  event: 'appointment.status_changed';
  appointmentId: string;
  externalId: string | null;
  previousStatus: AppointmentStatus | null;
  newStatus: AppointmentStatus;
  occurredAt: string; // ISO
}

/**
 * Envoie un webhook signé au CRM. Non bloquant — log et continue en cas d'échec.
 * Aucun envoi si externalId est null (RDV pris via le site public, pas via CRM).
 */
export async function notifyCrmStatusChanged(payload: {
  appointmentId: string;
  externalId: string | null;
  previousStatus: AppointmentStatus | null;
  newStatus: AppointmentStatus;
}): Promise<void> {
  if (!payload.externalId) return; // RDV pas issu du CRM

  const url = process.env.CRM_WEBHOOK_URL;
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.warn('[crm-webhook] CRM_WEBHOOK_URL ou CRM_WEBHOOK_SECRET manquant — envoi ignoré');
    return;
  }

  const body: AppointmentStatusChangedPayload = {
    event: 'appointment.status_changed',
    appointmentId: payload.appointmentId,
    externalId: payload.externalId,
    previousStatus: payload.previousStatus,
    newStatus: payload.newStatus,
    occurredAt: new Date().toISOString(),
  };
  const rawBody = JSON.stringify(body);
  const signature = createHmac('sha256', secret).update(rawBody).digest('hex');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Linova-Signature': signature,
        'User-Agent': 'Linova-Webhook/1.0',
      },
      body: rawBody,
    });
    if (!res.ok) {
      console.warn(
        `[crm-webhook] ${url} → ${res.status}: ${(await res.text()).slice(0, 200)}`
      );
    }
  } catch (err) {
    console.warn(
      `[crm-webhook] Network error to ${url}:`,
      err instanceof Error ? err.message : err
    );
  }
}
