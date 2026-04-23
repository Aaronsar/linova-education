import type { Metadata } from 'next';
import RendezVousBooking from '@/components/RendezVousBooking';

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Prenez rendez-vous pour un entretien d'admission au BTS Biologie Médicale de Linova Éducation. Formation initiale ou alternance, à Paris 12e.",
  robots: { index: true, follow: true },
  alternates: { canonical: '/rendez-vous' },
};

export default function RendezVousPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 md:py-24 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow/10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-teal/20 text-teal px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Entretien d’admission
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            Prenez rendez-vous
            <br />
            <span className="text-teal">avec nos admissions</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Un entretien de 45 minutes pour vous guider dans votre projet BTS Biologie Médicale.
            Choix du créneau en 2 minutes.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Confirmation immédiate
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Email de rappel
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Annulation libre
            </div>
          </div>
        </div>
      </section>

      {/* Booking widget */}
      <section className="bg-light py-12 md:py-16 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10">
            <RendezVousBooking />
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📍',
                title: 'Lieu',
                text: '85 Avenue Ledru-Rollin\n75012 Paris\nMétro : Ledru-Rollin (L8)',
              },
              {
                icon: '⏱️',
                title: 'Durée',
                text: '45 minutes\n7j/7\n9h00 – 17h00',
              },
              {
                icon: '📋',
                title: 'Préparez',
                text: 'Votre CV ou bulletins\nVotre projet professionnel\nVos questions',
              },
            ].map((item) => (
              <div key={item.title} className="bg-light rounded-2xl p-6 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm whitespace-pre-line">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-beige rounded-2xl p-6 text-center">
            <p className="text-navy text-sm">
              <strong>Une question ?</strong> Contactez-nous à{' '}
              <a
                href="mailto:admissions@linova-education.fr"
                className="text-teal hover:underline font-medium"
              >
                admissions@linova-education.fr
              </a>{' '}
              ou au{' '}
              <a href="tel:+33189719944" className="text-teal hover:underline font-medium">
                01 89 71 99 44
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
