/**
 * Backfill : envoie l'email "Confirmation d'inscription" à tous les candidats
 * actuellement en statut accepte_alternance / accepte_initial qui n'ont pas
 * encore reçu l'email (inscription_email_sent_at IS NULL).
 *
 * IMPORTANT : exécuter avec EMAIL_TEST_REDIRECT="" pour envoyer aux VRAIS
 * destinataires. Sinon les emails partiront vers l'adresse de redirection.
 */

import { createClient } from '@supabase/supabase-js';
import { sendInscriptionConfirmation } from '../src/lib/resend-emails';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

(async () => {
  if (process.env.EMAIL_TEST_REDIRECT?.trim()) {
    console.log(`⚠️  EMAIL_TEST_REDIRECT actif (${process.env.EMAIL_TEST_REDIRECT}) — les emails iront vers la redirection, pas les vrais destinataires.`);
  } else {
    console.log('🚀 EMAIL_TEST_REDIRECT vide — envoi aux VRAIS destinataires.');
  }
  console.log('');

  const { data: candidates, error } = await supabase
    .from('candidatures')
    .select('id, prenom, nom, email, telephone, statut, niveau_etudes')
    .in('statut', ['accepte_alternance', 'accepte_initial'])
    .is('inscription_email_sent_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Erreur fetch :', error.message);
    process.exit(1);
  }
  if (!candidates?.length) {
    console.log('Aucun candidat à backfill.');
    return;
  }

  console.log(`📋 ${candidates.length} candidat(s) à traiter :\n`);
  candidates.forEach((c) => {
    console.log(`  • ${c.prenom.trim()} ${c.nom.trim()} — ${c.email} (${c.statut})`);
  });
  console.log('');

  let success = 0;
  let failed = 0;

  for (const c of candidates) {
    const appointmentType: 'alternance' | 'initial' =
      c.statut === 'accepte_initial' ? 'initial' : 'alternance';
    process.stdout.write(`✉️  ${c.prenom.trim()} ${c.nom.trim()} (${appointmentType})... `);
    try {
      await sendInscriptionConfirmation({
        firstName: c.prenom?.trim() || '',
        lastName: c.nom?.trim() || '',
        email: c.email,
        phone: c.telephone || '',
        appointmentType,
        date: '',
        timeSlot: '',
        currentStudies: c.niveau_etudes || undefined,
      });
      await supabase
        .from('candidatures')
        .update({ inscription_email_sent_at: new Date().toISOString() })
        .eq('id', c.id);
      console.log('✅');
      success++;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown';
      console.log(`❌ ${message}`);
      failed++;
    }
    // Petite pause anti rate-limit Brevo
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('');
  console.log('──────────────────────────');
  console.log(`✅ Succès : ${success}`);
  console.log(`❌ Échecs : ${failed}`);
})().catch((err) => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
