import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { CookieSettingsButton } from '@/components/MetaPixel';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: "Comment Linova Éducation utilise vos données personnelles : candidatures, CV, inscriptions, cookies, durées de conservation et droits (RGPD).",
  alternates: { canonical: '/politique-de-confidentialite' },
  robots: { index: true, follow: true },
};

const lastUpdate = '13 novembre 2026';

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero title="Politique de confidentialité" description={`Dernière mise à jour : ${lastUpdate}`} />

      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:my-4 [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_li]:my-1 [&_strong]:text-navy [&_strong]:font-semibold [&_a]:text-teal hover:[&_a]:underline">
          <p>
            Cette page explique quelles données nous recueillons sur linova-education.fr, pourquoi, combien de temps nous les gardons et comment exercer vos droits.
          </p>

          <h2>Qui est responsable de vos données ?</h2>
          <p>
            <strong>Linova Éducation</strong>, SAS au capital de 1&nbsp;000&nbsp;€, 85 avenue Ledru-Rollin, 75012 Paris, RCS Créteil 943 551 341. Pour toute question sur vos données : <a href="mailto:contact@linova.fr">contact@linova.fr</a>.
          </p>

          <h2>Quelles données, et pour quoi faire ?</h2>
          <h3>Candidature et dépôt de CV</h3>
          <p>
            Nom, prénom, e-mail, téléphone, ville, dernier diplôme, CV et message. Ces données servent à étudier votre candidature, à vous recontacter et à vous présenter aux entreprises qui recrutent en alternance. Base légale : les démarches faites à votre demande avant un contrat, et votre consentement.
          </p>
          <h3>Demande d&apos;information, rendez-vous, journée portes ouvertes</h3>
          <p>
            Coordonnées et formation qui vous intéresse, pour répondre à votre demande et vous informer sur nos formations. Base légale : votre consentement et notre intérêt légitime à répondre aux demandes reçues.
          </p>
          <h3>Inscription et scolarité</h3>
          <p>
            Identité, coordonnées, parcours scolaire, pièces du dossier, informations de paiement, informations du contrat d&apos;apprentissage, assiduité et résultats. Ces données servent à gérer votre inscription, votre formation, votre contrat d&apos;apprentissage et votre inscription à l&apos;examen. Base légale : le contrat de formation et nos obligations légales d&apos;organisme de formation et de CFA.
          </p>
          <h3>Aménagements liés à un handicap</h3>
          <p>
            Si vous nous signalez une situation de handicap, ces informations sont utilisées uniquement pour préparer vos aménagements, par la référente handicap et les personnes qui en ont besoin.
          </p>

          <h2>Qui reçoit vos données ?</h2>
          <p>
            Les équipes de Linova Éducation chargées des admissions, du recrutement, de la pédagogie et de l&apos;administration. Selon votre situation : l&apos;entreprise qui vous accueille, son opérateur de compétences (OPCO), le rectorat pour l&apos;examen et les organismes publics à qui nous devons des comptes.
          </p>
          <p>Nous faisons aussi appel à des prestataires techniques, qui agissent sur nos instructions :</p>
          <ul>
            <li>Vercel (hébergement du site) et Supabase (base de données)</li>
            <li>Brevo (envoi des e-mails) et HubSpot (suivi des demandes)</li>
            <li>Stripe et GoCardless (paiements)</li>
            <li>Meta (mesure des campagnes publicitaires, uniquement si vous acceptez le cookie)</li>
          </ul>
          <p>
            Certains de ces prestataires sont établis hors de l&apos;Union européenne, notamment aux États-Unis. Les transferts sont alors encadrés par les garanties prévues par le RGPD (décision d&apos;adéquation ou clauses contractuelles types). Nous ne vendons jamais vos données.
          </p>

          <h2>Combien de temps ?</h2>
          <ul>
            <li>Candidature non retenue ou sans suite : 2 ans au maximum après notre dernier échange</li>
            <li>Demande d&apos;information : 3 ans au maximum après notre dernier échange</li>
            <li>Dossier d&apos;un élève ou d&apos;un apprenti : pendant la formation, puis la durée imposée par la loi pour les documents administratifs, comptables et de formation</li>
            <li>Choix sur les cookies : 6 mois</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Le site fonctionne sans cookie publicitaire. Avec votre accord seulement, nous déposons le pixel Meta, qui nous permet de savoir si nos publicités sur Facebook et Instagram amènent des visiteurs et des candidatures. Si vous refusez, rien n&apos;est déposé et le site marche exactement pareil.
          </p>
          <p>
            Vous pouvez changer d&apos;avis à tout moment :{' '}
            <CookieSettingsButton className="text-teal font-semibold hover:underline cursor-pointer" />.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous pouvez demander à consulter vos données, à les corriger, à les effacer, à en limiter l&apos;usage, à les récupérer, ou vous opposer à leur utilisation. Vous pouvez aussi retirer votre consentement à tout moment.
          </p>
          <p>
            Écrivez à <a href="mailto:contact@linova.fr">contact@linova.fr</a> ou à Linova Éducation, 85 avenue Ledru-Rollin, 75012 Paris. Nous répondons dans un délai d&apos;un mois.
          </p>
          <p>
            Si la réponse ne vous convient pas, vous pouvez saisir la CNIL :{' '}
            <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>.
          </p>

          <h2>Sécurité</h2>
          <p>
            L&apos;accès à vos données est réservé aux personnes qui en ont besoin. Les échanges avec le site sont chiffrés et les CV sont transmis uniquement à l&apos;équipe recrutement.
          </p>

          <p>
            Voir aussi nos <Link href="/mentions-legales">mentions légales</Link> et nos{' '}
            <Link href="/conditions-generales-de-services">conditions générales de services</Link>.
          </p>
        </div>
      </article>
    </>
  );
}
