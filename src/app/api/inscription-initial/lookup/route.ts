import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Recherche une candidature existante (ex. dossier alternance) par e-mail
 * pour préremplir le dossier formation initiale.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !email.includes('@') || email.length < 5) {
      return NextResponse.json({ found: false });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('candidatures')
      .select(
        'id, prenom, nom, date_naissance, lieu_naissance, nationalite, adresse, code_postal, ville, departement, email, telephone, filiere_bac, annee_obtention, etablissement, dernier_diplome, source_decouverte, fichier_cni_url, fichier_photos_url, fichier_releve_url, fichier_cv_url, entreprise_trouvee, statut, created_at'
      )
      .ilike('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[inscription-initial/lookup]', error.message);
      return NextResponse.json({ found: false }, { status: 200 });
    }

    if (!data) {
      return NextResponse.json({ found: false });
    }

    const row = data as Record<string, string | null>;

    const docs = {
      fichier_cni: row.fichier_cni_url || '',
      fichier_photos: row.fichier_photos_url || '',
      fichier_releve: row.fichier_releve_url || '',
      fichier_cv: row.fichier_cv_url || '',
    };

    const docsCount = Object.values(docs).filter(Boolean).length;

    return NextResponse.json({
      found: true,
      candidature: {
        id: row.id || '',
        prenom: row.prenom || '',
        nom: row.nom || '',
        date_naissance: row.date_naissance || '',
        lieu_naissance: row.lieu_naissance || '',
        nationalite: row.nationalite || '',
        adresse: row.adresse || '',
        code_postal: row.code_postal || '',
        ville: row.ville || '',
        departement: row.departement || '',
        email: row.email || email,
        telephone: row.telephone || '',
        filiere_bac: row.filiere_bac || '',
        annee_obtention: row.annee_obtention || '',
        etablissement: row.etablissement || '',
        dernier_diplome: row.dernier_diplome || '',
        source_decouverte: row.source_decouverte || '',
        entreprise_trouvee: row.entreprise_trouvee || '',
        statut: row.statut || '',
        docs,
        docsCount,
      },
    });
  } catch (err) {
    console.error('[inscription-initial/lookup]', err);
    return NextResponse.json({ found: false }, { status: 200 });
  }
}
