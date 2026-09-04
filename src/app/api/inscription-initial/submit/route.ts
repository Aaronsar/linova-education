import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getStripeServer } from '@/lib/stripe-server';
import { generateAndStoreContratPdf, type ContratPayload } from '@/lib/generate-contrat';

function str(v: unknown, max = 500) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'Configuration serveur incomplète.' }, { status: 500 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const prenom = str(body.prenom, 80);
  const nom = str(body.nom, 80);
  const email = str(body.email, 200).toLowerCase();
  const telephone = str(body.telephone, 40);

  if (!prenom || !nom || !email.includes('@') || !telephone) {
    return NextResponse.json({ error: 'Identité incomplète (nom, prénom, e-mail, téléphone).' }, { status: 400 });
  }

  const stripePaymentIntentId = str(body.stripe_payment_intent_id, 80);
  const modeAcompte = str(body.mode_acompte, 20);

  if (modeAcompte === 'carte' && stripePaymentIntentId) {
    const stripe = getStripeServer();
    if (stripe) {
      try {
        const pi = await stripe.paymentIntents.retrieve(stripePaymentIntentId);
        if (pi.status !== 'succeeded' && pi.status !== 'processing') {
          return NextResponse.json(
            { error: 'Le paiement Stripe n’est pas confirmé. Réessayez ou contactez-nous.' },
            { status: 400 }
          );
        }
      } catch (err) {
        console.error('[inscription-initial/submit] stripe retrieve', err);
        return NextResponse.json({ error: 'Impossible de vérifier le paiement Stripe.' }, { status: 400 });
      }
    }
  }

  let remarques = str(body.remarques, 20_000);

  const row = {
    prenom,
    nom,
    date_naissance: str(body.date_naissance, 20) || null,
    lieu_naissance: str(body.lieu_naissance, 120),
    nationalite: str(body.nationalite, 80),
    adresse: str(body.adresse, 200),
    code_postal: str(body.code_postal, 20),
    ville: str(body.ville, 80),
    departement: str(body.departement, 80),
    email,
    telephone,
    niveau_etudes: str(body.niveau_etudes, 80),
    filiere_bac: str(body.filiere_bac, 200),
    annee_obtention: str(body.annee_obtention, 20),
    etablissement: str(body.etablissement, 200),
    dernier_diplome: str(body.dernier_diplome, 200),
    numero_secu: '',
    numero_cni: '',
    niveau_anglais: '',
    fichier_cni_url: str(body.fichier_cni_url, 400),
    fichier_photos_url: str(body.fichier_photos_url, 400),
    fichier_releve_url: str(body.fichier_releve_url, 400),
    fichier_cv_url: str(body.fichier_cv_url, 400),
    entreprise_trouvee: str(body.entreprise_trouvee, 80) || 'Formation initiale',
    nom_entreprise: '',
    aide_recherche: false,
    disponible_echange: true,
    creneaux_preferes: '',
    source_decouverte: str(body.source_decouverte, 200),
    newsletter: false,
    remarques,
    statut: 'nouveau',
  };

  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from('candidatures').insert(row).select('id').single();

  if (error) {
    console.error('[inscription-initial/submit]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let contratPath: string | null = null;
  const contratRaw = body.contrat;
  if (contratRaw && typeof contratRaw === 'object' && data?.id) {
    try {
      const c = contratRaw as Record<string, unknown>;
      const payload: ContratPayload = {
        formationLabel: str(c.formationLabel, 200) || 'BTS Biologie Médicale — formation initiale',
        cgiFormation: str(c.cgiFormation, 1000),
        cgiDuree: str(c.cgiDuree, 500),
        fraisAnnuelsLabel: str(c.fraisAnnuelsLabel, 40),
        modeAcompte: str(c.modeAcompte, 20),
        modeSolde: str(c.modeSolde, 20),
        nbCheques: typeof c.nbCheques === 'number' ? c.nbCheques : undefined,
        nbPrelevements: typeof c.nbPrelevements === 'number' ? c.nbPrelevements : undefined,
        echeances: Array.isArray(c.echeances)
          ? c.echeances
              .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
              .map((e) => ({
                index: Number(e.index) || 0,
                dateLabel: str(e.dateLabel, 40),
                montantLabel: str(e.montantLabel, 40),
              }))
          : undefined,
        acompteDetail: str(c.acompteDetail, 500),
        soldeDetail: str(c.soldeDetail, 1000),
        signatureNom: str(c.signatureNom, 120),
        signaturePath: str(c.signaturePath, 400),
        signaturePrelevementNom: str(c.signaturePrelevementNom, 120) || undefined,
        signaturePrelevementPath: str(c.signaturePrelevementPath, 400) || undefined,
        mineur: Boolean(c.mineur),
        accordRepresentant: Boolean(c.accordRepresentant),
        signedAt: str(c.signedAt, 40) || new Date().toISOString(),
      };

      if (payload.signaturePath) {
        const result = await generateAndStoreContratPdf({
          candidatureId: data.id,
          identity: {
            prenom,
            nom,
            dateNaissance: str(body.date_naissance, 20),
            lieuNaissance: str(body.lieu_naissance, 120),
            nationalite: str(body.nationalite, 80),
            adresse: str(body.adresse, 200),
            codePostal: str(body.code_postal, 20),
            ville: str(body.ville, 80),
            email,
            telephone,
          },
          payload,
          existingRemarques: remarques,
        });
        if (result) {
          contratPath = result.path;
          remarques = result.remarques;
        }
      }
    } catch (err) {
      console.error('[inscription-initial/submit] contrat pdf', err);
      // Le dossier est déjà créé : on ne fait pas échouer l’inscription
    }
  }

  return NextResponse.json({ id: data.id, contrat_pdf: contratPath });
}
