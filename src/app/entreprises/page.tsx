import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import CTASection from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Entreprises',
  description: "Recrutez des alternants en BTS Biologie Médicale. Linova accompagne les entreprises dans le recrutement et la formation de futurs collaborateurs.",
};

export default function Entreprises() {
  return (
    <>
      <PageHero
        title="Formez aujourd'hui,"
        highlight="bâtissez votre équipe de demain"
        description="Recrutez un alternant Linova en BTS Biologie Médicale et investissez dans vos talents de demain."
      />

      {/* Avantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Pourquoi recruter un alternant Linova ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Compétences sectorielles',
                description: "Formation exigeante combinant théorie et pratique avec accompagnement pédagogique régulier.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                title: 'Intégration progressive',
                description: "L'alternant progresse semaine après semaine grâce au rythme alterné entre école et entreprise.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                title: 'Coût maîtrisé',
                description: "Aides publiques et financements spécifiques qui réduisent significativement les charges pour l'entreprise.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Investissement futur',
                description: "Formez un collaborateur déjà familier avec votre culture d'entreprise et vos méthodes de travail.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
            ].map((avantage, i) => (
              <div key={i} className="bg-light rounded-2xl p-8 flex gap-6">
                <div className="w-14 h-14 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                  {avantage.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">{avantage.title}</h3>
                  <p className="text-gray-600">{avantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rythme & Coûts */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8">Rythme de l&apos;alternance</h2>
              <div className="bg-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-teal/20 rounded-xl">
                    <div className="text-3xl font-bold text-yellow">2</div>
                    <p className="text-sm text-gray-300 mt-1">jours / semaine en formation</p>
                  </div>
                  <div className="text-center p-4 bg-teal/20 rounded-xl">
                    <div className="text-3xl font-bold text-yellow">3</div>
                    <p className="text-sm text-gray-300 mt-1">jours / semaine en entreprise</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">Coûts et aides</h2>
              <div className="space-y-6">
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Rémunération alternant</h3>
                  <p className="text-gray-300">Entre 795 et 1 766 euros brut / mois selon l&apos;âge</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Coût réel après aides</h3>
                  <p className="text-gray-300">Entre 378 et 563 euros / mois pour un alternant de moins de 26 ans</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="font-semibold text-yellow mb-2">Aide handicap</h3>
                  <p className="text-gray-300">Jusqu&apos;à 6 000 euros supplémentaires pour l&apos;embauche d&apos;un apprenti en situation de handicap</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accompagnement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-16">
            Notre accompagnement
          </h2>
          <div className="space-y-6">
            {[
              { title: 'Définition des besoins', description: "Nous analysons vos besoins en compétences pour identifier le profil idéal." },
              { title: 'Recherche et sélection', description: "Nous présélectionnons les candidats les plus adaptés à votre structure." },
              { title: 'Démarches administratives', description: "Nous vous accompagnons dans toutes les démarches contractuelles." },
              { title: 'Optimisation des aides', description: "Nous maximisons les aides et financements auxquels vous avez droit." },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start bg-light rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-dark mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Vous souhaitez recruter un alternant ?"
        description="Contactez-nous pour en discuter et trouver le profil idéal pour votre structure."
        primaryText="Nous contacter"
        primaryHref="tel:+33189719944"
      />
    </>
  );
}
