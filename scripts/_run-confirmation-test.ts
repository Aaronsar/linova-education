import { sendConfirmationToCandidate } from '../src/lib/resend-emails';

(async () => {
  await sendConfirmationToCandidate({
    firstName: 'Aaron',
    lastName: 'Test',
    email: 'aaron@diploma-sante.fr',
    phone: '06 12 34 56 78',
    appointmentType: 'initial',
    date: '2026-09-15',
    timeSlot: '10:30',
  });
  console.log('✅ Email de confirmation envoyé à aaron@diploma-sante.fr');
})().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
