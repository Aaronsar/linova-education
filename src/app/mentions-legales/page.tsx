import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: "Mentions légales du site linova-education.fr : éditeur, directeur de la publication, hébergeur, propriété intellectuelle et contact.",
  alternates: { canonical: '/mentions-legales' },
  robots: { index: true, follow: true },
};

const lastUpdate = '13 novembre 2026';

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero title="Mentions légales" description={`Dernière mise à jour : ${lastUpdate}`} />

      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:my-4 [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_li]:my-1 [&_strong]:text-navy [&_strong]:font-semibold [&_a]:text-teal hover:[&_a]:underline">
          <h2>Éditeur du site</h2>
          <p>
            Le site linova-education.fr est édité par <strong>Linova Éducation</strong>, société par actions simplifiée (SAS) au capital de 1&nbsp;000&nbsp;€, immatriculée au Registre du Commerce et des Sociétés de Créteil sous le numéro <strong>943 551 341</strong>.
          </p>
          <ul>
            <li>Siège social : 85 avenue Ledru-Rollin, 75012 Paris</li>
            <li>Téléphone : <a href="tel:+33189719944">01 89 71 99 44</a></li>
            <li>E-mail : <a href="mailto:contact@linova.fr">contact@linova.fr</a></li>
            <li>Directeur de la publication : Dorian Hamou, président</li>
          </ul>

          <h2>Activité</h2>
          <p>
            Linova Éducation est un établissement d&apos;enseignement supérieur privé et un centre de formation d&apos;apprentis (CFA). Il prépare au BTS Biologie Médicale et au BTS Négociation et Digitalisation de la Relation Client (NDRC), diplômes d&apos;État délivrés par le ministère chargé de l&apos;Enseignement supérieur.
          </p>
          <p>
            Linova Éducation est certifié Qualiopi. Le détail figure sur la page{' '}
            <Link href="/ecole/qualiopi">Certification Qualiopi</Link>.
          </p>

          <h2>Hébergeur</h2>
          <p>
            Le site est hébergé par Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis –{' '}
            <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, photos, vidéos, logos et supports présents sur ce site appartiennent à Linova Éducation ou sont utilisés avec l&apos;accord de leurs auteurs. Toute reproduction ou réutilisation, même partielle, sans autorisation écrite est interdite.
          </p>

          <h2>Informations publiées</h2>
          <p>
            Linova Éducation veille à l&apos;exactitude des informations publiées sur ce site et les met à jour régulièrement. Les programmes, calendriers et modalités peuvent évoluer, notamment en cas de changement de la réglementation des diplômes. Les documents remis au moment de l&apos;inscription font foi.
          </p>

          <h2>Données personnelles et cookies</h2>
          <p>
            L&apos;utilisation de vos données et des cookies est décrite dans notre{' '}
            <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
          </p>

          <h2>Conditions générales</h2>
          <p>
            Les inscriptions sont régies par nos{' '}
            <Link href="/conditions-generales-de-services">conditions générales de services</Link>, qui précisent aussi la marche à suivre en cas de réclamation.
          </p>

          <h2>Droit applicable</h2>
          <p>Le site et les présentes mentions sont soumis au droit français.</p>
        </div>
      </article>
    </>
  );
}
