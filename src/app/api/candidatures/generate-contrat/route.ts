import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractSignaturePaths } from '@/lib/contrat-remarques';
import {
  contratPayloadFromRemarques,
  generateAndStoreContratPdf,
} from '@/lib/generate-contrat';
import {
  PROGRAMME_INITIALE_ANNEE2,
  PROGRAMME_INITIALE_STANDARD,
} from '@/lib/inscription-programme';
import {
  FRAIS_ANNUELS_2A_LABEL,
  FRAIS_ANNUELS_LABEL,
  FRAIS_BOURSIERS_2A_LABEL,
} from '@/lib/acompte';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const accessToken = authHeader?.replace(/^Bearer\s+/i, '');
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data: userData, error: userErr } = await anonClient.auth.getUser(accessToken);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { candidatureId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const candidatureId = body.candidatureId?.trim();
  if (!candidatureId) {
    return NextResponse.json({ error: 'candidatureId manquant' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: cand, error } = await supabase
    .from('candidatures')
    .select('*')
    .eq('id', candidatureId)
    .single();

  if (error || !cand) {
    return NextResponse.json({ error: 'Candidature introuvable' }, { status: 404 });
  }

  const isAnnee2 = String(cand.entreprise_trouvee || '').includes('2e année');
  const programme = isAnnee2 ? PROGRAMME_INITIALE_ANNEE2 : PROGRAMME_INITIALE_STANDARD;
  const fraisLabel = isAnnee2
    ? `${FRAIS_ANNUELS_2A_LABEL} (${FRAIS_BOURSIERS_2A_LABEL} boursiers sur justificatif)`
    : FRAIS_ANNUELS_LABEL;

  const payload = contratPayloadFromRemarques(cand.remarques || '', {
    formationLabel: programme.successFormation,
    cgiFormation: programme.cgiFormation,
    cgiDuree: programme.cgiDuree,
    fraisAnnuelsLabel: fraisLabel,
    signatureNom: `${cand.prenom} ${cand.nom}`.trim(),
  });

  if (!payload) {
    return NextResponse.json(
      {
        error:
          'Impossible de générer le contrat : signature électronique introuvable dans le dossier.',
      },
      { status: 400 }
    );
  }

  try {
    const result = await generateAndStoreContratPdf({
      candidatureId: cand.id,
      identity: {
        prenom: cand.prenom || '',
        nom: cand.nom || '',
        dateNaissance: cand.date_naissance || '',
        lieuNaissance: cand.lieu_naissance || '',
        nationalite: cand.nationalite || '',
        adresse: cand.adresse || '',
        codePostal: cand.code_postal || '',
        ville: cand.ville || '',
        email: cand.email || '',
        telephone: cand.telephone || '',
      },
      payload,
      existingRemarques: cand.remarques || '',
    });

    if (!result) {
      return NextResponse.json({ error: 'Génération impossible (config serveur).' }, { status: 500 });
    }

    return NextResponse.json({
      path: result.path,
      remarques: result.remarques,
      alreadyHad: Boolean(extractSignaturePaths(cand.remarques || '').contratPdf),
    });
  } catch (err) {
    console.error('[generate-contrat]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erreur génération contrat' },
      { status: 500 }
    );
  }
}
