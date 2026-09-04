import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ACOMPTE_CENTS, ACOMPTE_LABEL, FRAIS_ANNUELS_CENTS, FRAIS_ANNUELS_LABEL } from '@/lib/acompte';
import {
  computeFirstPrelevementDate,
  formatDateFr,
  listPrelevementSchedule,
} from '@/lib/gocardless';
import { getStripeServer, isStripeConfiguredServer } from '@/lib/stripe-server';
import { generateAndStoreContratPdf, type ContratPayload } from '@/lib/generate-contrat';
import { PROGRAMME_INITIALE_STANDARD } from '@/lib/inscription-programme';

function str(v: unknown, max = 500) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

/**
 * Après signature du mandat GoCardless : crée la candidature liée au PI Stripe déjà payé.
 */
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Configuration serveur incomplète.' }, { status: 500 });
  }
  if (!isStripeConfiguredServer()) {
    return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 503 });
  }
  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe indisponible.' }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const piId = str(body.payment_intent_id, 80);
    const billingRequestId = str(body.billing_request_id, 80);
    const prenom = str(body.prenom, 80);
    const nom = str(body.nom, 80);
    const email = str(body.email, 200).toLowerCase();
    const telephone = str(body.telephone, 40);
    const adresse = str(body.adresse, 200);
    const codePostal = str(body.code_postal, 20);
    const ville = str(body.ville, 80);
    const nb = Math.max(1, Math.min(7, Number(body.nb_prelevements) || 1));
    const signatureNom = str(body.signature_prelevement_nom, 120);
    const signatureDataUrl = str(body.signature_prelevement_image, 2_000_000);

    if (!piId.startsWith('pi_') || !billingRequestId.startsWith('BRQ')) {
      return NextResponse.json({ error: 'Références paiement / mandat manquantes.' }, { status: 400 });
    }
    if (!prenom || !nom || !email.includes('@') || !telephone) {
      return NextResponse.json({ error: 'Identité incomplète.' }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(piId);
    if (pi.status !== 'succeeded' && pi.status !== 'processing') {
      return NextResponse.json({ error: 'Acompte Stripe non confirmé.' }, { status: 400 });
    }
    if (pi.amount !== ACOMPTE_CENTS) {
      return NextResponse.json({ error: 'Montant d’acompte incorrect.' }, { status: 400 });
    }

    // Finalise le mandat + crée les prélèvements (appel direct du même process)
    const finRes = await fetch(
      new URL('/api/inscription-initial/gocardless/finalize', request.url).toString(),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billing_request_id: billingRequestId }),
      }
    );
    const finData = await finRes.json().catch(() => ({}));
    if (!finRes.ok) {
      return NextResponse.json(
        { error: finData.error || 'Finalisation du mandat impossible.' },
        { status: finRes.status || 500 }
      );
    }

    const supabase = createClient(url, serviceKey);

    // Idempotence : si un dossier existe déjà avec ce PI, on ne recrée pas
    const { data: existing } = await supabase
      .from('candidatures')
      .select('id, remarques')
      .ilike('email', email)
      .ilike('entreprise_trouvee', '%initiale%')
      .order('created_at', { ascending: false })
      .limit(10);
    const already = (existing || []).find((c) => (c.remarques || '').includes(piId));
    if (already) {
      return NextResponse.json({
        id: already.id,
        reused: true,
        mandateId: finData.mandateId,
      });
    }

    // Upload signature prélèvement
    let signaturePath = '';
    if (signatureDataUrl.startsWith('data:')) {
      const base64 = signatureDataUrl.split(',')[1] || '';
      const bytes = Buffer.from(base64, 'base64');
      const path = `initial/signatures/reprise_${Date.now()}.png`;
      const { error: upErr } = await supabase.storage.from('candidatures').upload(path, bytes, {
        contentType: 'image/png',
        upsert: true,
      });
      if (!upErr) signaturePath = path;
    }

    const startDate = computeFirstPrelevementDate();
    const schedule = listPrelevementSchedule(nb, FRAIS_ANNUELS_CENTS, ACOMPTE_CENTS, startDate);
    const scheduleText = schedule
      .map((e) => `${e.index}) ${formatDateFr(e.date)} · ${e.euros} €`)
      .join(' ; ');

    const acompteLine = `Acompte pré-inscription (${ACOMPTE_LABEL}) : payé par carte · Stripe PI=${piId}`;
    const soldeLine = `Paiement annuel : prélèvement SEPA GoCardless · ${nb} échéance(s) · 1er prélèvement ${formatDateFr(startDate)} · calendrier : ${scheduleText} · mandat=${finData.mandateId} · paiements=${(finData.paymentIds || []).join(',')} · dates=${(finData.chargeDates || []).join(',')} · reprise après bug metadata GC`;

    const programme = PROGRAMME_INITIALE_STANDARD;
    const remarques = [
      programme.dossierBanner,
      `Frais annuels : ${FRAIS_ANNUELS_LABEL}`,
      '=== REPRISE MANDAT SEPA (acompte déjà payé, dossier créé via /inscription-initial/reprendre) ===',
      `Signature prélèvement SEPA : ${signatureNom || `${prenom} ${nom}`} · ${new Date().toISOString()}`,
      signaturePath ? `Signature prélèvement image : ${signaturePath}` : null,
      // Signature contrat minimale = même signature pour pouvoir générer le PDF
      `Signature électronique : ${signatureNom || `${prenom} ${nom}`} · ${new Date().toISOString()}`,
      signaturePath ? `Signature image : ${signaturePath}` : null,
      `CGI acceptées : oui (reprise)`,
      `CGS acceptées : oui (reprise)`,
      acompteLine,
      soldeLine,
    ]
      .filter(Boolean)
      .join('\n');

    const row = {
      prenom,
      nom,
      date_naissance: null,
      lieu_naissance: '',
      nationalite: '',
      adresse,
      code_postal: codePostal,
      ville,
      departement: '',
      email,
      telephone,
      niveau_etudes: '',
      filiere_bac: '',
      annee_obtention: '',
      etablissement: '',
      dernier_diplome: '',
      numero_secu: '',
      numero_cni: '',
      niveau_anglais: '',
      fichier_cni_url: '',
      fichier_photos_url: '',
      fichier_releve_url: '',
      fichier_cv_url: '',
      entreprise_trouvee: programme.candidatureTag,
      nom_entreprise: '',
      aide_recherche: false,
      disponible_echange: true,
      creneaux_preferes: '',
      source_decouverte: 'Reprise mandat SEPA',
      newsletter: false,
      remarques,
      statut: 'nouveau',
    };

    const { data, error } = await supabase.from('candidatures').insert(row).select('id').single();
    if (error) {
      console.error('[reprise/finalize] insert', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Contrat PDF (best effort)
    if (signaturePath) {
      try {
        const payload: ContratPayload = {
          formationLabel: programme.successFormation,
          cgiFormation: programme.cgiFormation,
          cgiDuree: programme.cgiDuree,
          fraisAnnuelsLabel: FRAIS_ANNUELS_LABEL,
          modeAcompte: 'carte',
          modeSolde: 'prelevement',
          nbPrelevements: nb,
          echeances: schedule.map((e) => ({
            index: e.index,
            dateLabel: formatDateFr(e.date),
            montantLabel: `${e.euros} €`,
          })),
          acompteDetail: acompteLine,
          soldeDetail: soldeLine,
          signatureNom: signatureNom || `${prenom} ${nom}`,
          signaturePath,
          signaturePrelevementNom: signatureNom || `${prenom} ${nom}`,
          signaturePrelevementPath: signaturePath,
          mineur: false,
          accordRepresentant: false,
          signedAt: new Date().toISOString(),
        };
        await generateAndStoreContratPdf({
          candidatureId: data.id,
          identity: {
            prenom,
            nom,
            dateNaissance: '',
            lieuNaissance: '',
            nationalite: '',
            adresse,
            codePostal,
            ville,
            email,
            telephone,
          },
          payload,
          existingRemarques: remarques,
        });
      } catch (e) {
        console.error('[reprise/finalize] contrat', e);
      }
    }

    return NextResponse.json({
      id: data.id,
      mandateId: finData.mandateId,
      paymentIds: finData.paymentIds || [],
      reference: `INI-${String(data.id).slice(0, 8).toUpperCase()}`,
    });
  } catch (err) {
    console.error('[reprise/finalize]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur reprise' },
      { status: 500 }
    );
  }
}
