/**
 * Test : envoie à aaron@diploma-sante.fr les 2 emails qui partiraient
 * pour une candidature passée à "Inscrit" puis "Refusé".
 *
 * Force la redirection via EMAIL_TEST_REDIRECT — le sujet est préfixé.
 * Utilise un jeu de données réaliste (champ candidatures).
 */

import {
  sendInscriptionConfirmation,
  sendCandidatureRejected,
} from '../src/lib/resend-emails';

const candidatureParams = {
  firstName: 'Alexane',
  lastName: 'Greff-Thomas',
  email: 'alexane.gtpro@gmail.com',
  phone: '0755606290',
  appointmentType: 'alternance', // toutes les candidatures sont alternance
  date: '',
  timeSlot: '',
  currentStudies: 'Bac STL — Sciences et Technologies de Laboratoire',
};

(async () => {
  console.log('1/2 Confirmation d\'inscription (candidature passée à Inscrit)...');
  await sendInscriptionConfirmation(candidatureParams);
  console.log('  ✅ envoyé');

  console.log('2/2 Candidature non retenue (candidature passée à Refusé, J+1)...');
  await sendCandidatureRejected(candidatureParams);
  console.log('  ✅ envoyé');

  console.log(`\n✨ Les 2 emails sont partis vers ${process.env.EMAIL_TEST_REDIRECT}`);
})().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
