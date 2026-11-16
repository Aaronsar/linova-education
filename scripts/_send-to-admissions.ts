/**
 * Envoi one-shot du mail "Confirmation d'inscription — alternance"
 * directement à admissions@linova-education.fr (sans redirection test).
 */

import { sendInscriptionConfirmation } from '../src/lib/resend-emails';

const params = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'admissions@linova-education.fr',
  phone: '06 12 34 56 78',
  appointmentType: 'alternance',
  date: '',
  timeSlot: '',
  currentStudies: 'Terminale STL',
};

(async () => {
  console.log('Envoi à admissions@linova-education.fr (alternance, sans redirect)...');
  await sendInscriptionConfirmation(params);
  console.log('✅ Email envoyé');
})().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
