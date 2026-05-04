/**
 * Helper exécuté via tsx pour appeler les fonctions email TypeScript.
 * Voir scripts/send-test-emails.mjs (point d'entrée).
 */

import {
  sendInscriptionConfirmation,
  sendDossierAdmission,
  sendCandidatureRejected,
} from '../src/lib/resend-emails';

const baseParams = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont.test@example.com',
  phone: '06 12 34 56 78',
  date: '2026-09-15',
  timeSlot: '10:30',
  currentStudies: 'Terminale STL',
};

const initialParams = { ...baseParams, appointmentType: 'initial' };
const alternanceParams = { ...baseParams, appointmentType: 'alternance' };

(async () => {
  console.log('1/4 Confirmation d\'inscription (initial)...');
  await sendInscriptionConfirmation(initialParams);
  console.log('  ✅ envoyé');

  console.log('2/4 Confirmation d\'inscription (alternance)...');
  await sendInscriptionConfirmation(alternanceParams);
  console.log('  ✅ envoyé');

  console.log('3/4 Dossier d\'admission...');
  await sendDossierAdmission(alternanceParams);
  console.log('  ✅ envoyé');

  console.log('4/4 Candidature non retenue...');
  await sendCandidatureRejected(alternanceParams);
  console.log('  ✅ envoyé');

  console.log(`\n✨ Les 4 emails sont partis vers ${process.env.EMAIL_TEST_REDIRECT}`);
})().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
