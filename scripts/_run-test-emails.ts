/**
 * Helper exécuté via tsx pour appeler les fonctions email TypeScript.
 * Voir scripts/send-test-emails.mjs (point d'entrée).
 */

import {
  sendInscriptionConfirmation,
  sendDossierAdmission,
  sendCandidatureRejected,
} from '../src/lib/resend-emails';

const params = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont.test@example.com',
  phone: '06 12 34 56 78',
  appointmentType: 'initial',
  date: '2026-09-15',
  timeSlot: '10:30',
  currentStudies: 'Terminale STL',
};

(async () => {
  console.log('1/3 Confirmation d\'inscription...');
  await sendInscriptionConfirmation(params);
  console.log('  ✅ envoyé');

  console.log('2/3 Dossier d\'admission...');
  await sendDossierAdmission(params);
  console.log('  ✅ envoyé');

  console.log('3/3 Candidature non retenue...');
  await sendCandidatureRejected(params);
  console.log('  ✅ envoyé');

  console.log(`\n✨ Les 3 emails sont partis vers ${process.env.EMAIL_TEST_REDIRECT}`);
})().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
