import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Conditions Générales de Services | Linova Éducation',
  description:
    "Conditions Générales de Services (CGS) de Linova Éducation : droits et obligations des étudiants, prix, droit de rétractation, propriété intellectuelle, règlement des litiges.",
  alternates: { canonical: '/conditions-generales-de-services' },
  robots: { index: true, follow: true },
};

const lastUpdate = '4 juin 2025';

export default function CGSPage() {
  return (
    <>
      <PageHero
        title="Conditions Générales de Services"
        description={`Dernière mise à jour : ${lastUpdate}`}
      />

      <article className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 cgs-content text-gray-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:my-4 [&_ul]:my-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:my-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_li]:my-1 [&_strong]:text-navy [&_strong]:font-semibold [&_a]:text-teal hover:[&_a]:underline">

          <h2>1. Informations légales et objet des présentes Conditions Générales de Services</h2>
          <p>
            Le présent document, en ce compris ses annexes (ci-avant et ci-après les «&nbsp;Conditions Générales de Services&nbsp;» ou «&nbsp;CGS&nbsp;») de la société <strong>Linova Éducation</strong>, SAS, société par actions simplifiée, au capital social de 1&nbsp;000,00&nbsp;€, dont le siège social est situé au <strong>85 Avenue Ledru-Rollin, 75012 Paris</strong>, immatriculée au Registre du Commerce et des Sociétés de Créteil sous le numéro <strong>943 551 341</strong>, représentée par Monsieur Dorian HAMOU agissant et ayant les pouvoirs nécessaires en tant que président (ci-après «&nbsp;Linova Éducation&nbsp;») ont pour objet de définir les droits et obligations au titre du Contrat de Formation :
          </p>
          <ul>
            <li>de Linova Éducation&nbsp;;</li>
            <li>
              de toute personne physique capable et/ou le cas échéant disposant d&apos;une autorisation parentale pour ce faire, et n&apos;étant soumise à aucune interdiction et/ou restriction légale, réglementaire ou conventionnelle l&apos;empêchant de participer à un Programme et ayant pris connaissance de la Brochure d&apos;un Programme, interrogé Linova Éducation à ce sujet, reçu une parfaite et complète information de Linova Éducation sur le sujet et avoir renseigné le Dossier d&apos;Inscription et, le cas échéant, l&apos;ensemble des formalités légales, réglementaires et conventionnelles pour ce faire afin de bénéficier d&apos;un Programme, pour ses besoins personnels exclusivement (ci-avant et ci-après un «&nbsp;Étudiant&nbsp;»).
            </li>
          </ul>
          <p>
            Tout ou partie des Programmes pourront faire l&apos;objet d&apos;un paiement par une personne physique ou une personne morale tierce (ci-après le «&nbsp;Répondant Financier&nbsp;»).
          </p>
          <p>
            Les Conditions Générales de Services, le Dossier d&apos;Inscription et la Brochure forment ensemble le «&nbsp;Contrat de Formation&nbsp;», lequel exprime l&apos;intégralité des obligations de Linova Éducation et de l&apos;Étudiant (ensemble ou distinctement la/les «&nbsp;Partie(s)&nbsp;») relatives à leur objet. Le fait pour l&apos;une des Parties de ne pas se prévaloir d&apos;un manquement par l&apos;autre Partie à l&apos;une quelconque des obligations visées dans les présentes ne saurait être interprété pour l&apos;avenir comme une renonciation à l&apos;obligation en cause.
          </p>
          <p>En cas de contradiction entre&nbsp;:</p>
          <ol>
            <li>Les Conditions Générales de Services</li>
            <li>Le Dossier d&apos;Inscription</li>
            <li>La Brochure</li>
          </ol>
          <p>
            le document de rang supérieur prévaudra pour l&apos;interprétation de l&apos;obligation en cause. Toute modification, notamment par avenant, complètera ou modifiera le document contractuel correspondant, sans remettre en cause la présente hiérarchie de la documentation contractuelle. Enfin, chaque document de rang supérieur peut compléter ou amender le document de rang inférieur.
          </p>
          <p>
            En tant que de besoin, le Dossier d&apos;Inscription vaut contrat de formation professionnelle pour les Étudiants qui seront en contrat de professionnalisation ou d&apos;apprentissage conformément aux articles L.&nbsp;6353-1 et L.&nbsp;6353-2 du Code du travail.
          </p>
          <p>
            L&apos;Étudiant déclare et garantit porter à la connaissance du Répondant Financier le Contrat de Formation et se porte fort de son parfait engagement.
          </p>
          <p>
            Linova Éducation a souscrit une assurance «&nbsp;responsabilité civile&nbsp;» auprès de la société&nbsp;: <strong>Axa France</strong>.
          </p>
          <p>
            Pour toute information, interrogation, réclamation relatives aux Programmes, l&apos;Étudiant ainsi que toutes les parties prenantes sont invités à adresser leurs demandes à l&apos;adresse de courrier électronique suivante&nbsp;: <a href="mailto:contact@linova.fr">contact@linova.fr</a>. Un accusé de réception sera envoyé sous 48&nbsp;h et une réponse sera apportée sous 30 jours.
          </p>
          <p>
            Il peut également joindre le service client de Linova Éducation au numéro suivant <a href="tel:+33189719944"><strong>01 89 71 99 44</strong></a> (numéro non surtaxé), du lundi au vendredi de 9&nbsp;h à 18&nbsp;h, hors jours fériés.
          </p>
          <p>
            Linova Éducation se réserve le droit de modifier les présentes Conditions Générales de Services à tout moment et en avertira l&apos;Étudiant a minima un (1) mois avant leur entrée en vigueur, lesquelles prendront effet pour chaque Étudiant lors de l&apos;Année de Formation suivante, sauf précision contraire. L&apos;Étudiant qui refuse ces modifications peut résilier son Programme à la fin de l&apos;année de formation en cours dans les conditions prévues aux présentes CGS ou, si les CGS prévoient une modification substantielle pour l&apos;année en cours, dans un délai de quinze (15) jours. Passé ce délai, les nouvelles CGS seront présumées acceptées.
          </p>

          <h2>2. Présentation des Programmes</h2>
          <p>
            Linova Éducation propose différents Programmes de formation, lesquels sont accessibles, en tout ou partie, à la discrétion de Linova Éducation, en présentiel dans les locaux de Linova Éducation ou à distance via un environnement numérique dédié (ou extranet).
          </p>
          <p>
            Les Programmes sont détaillés dans une fiche de présentation dont prend connaissance l&apos;Étudiant avant de souscrire aux présentes Conditions Générales (ci-après la «&nbsp;Brochure&nbsp;»).
          </p>
          <p>
            Toutefois, l&apos;Étudiant est informé que cette Brochure est strictement descriptive. Elle a pour objet d&apos;informer l&apos;Étudiant sur Linova Éducation, sur les compétences enseignées lors du Programme et les éventuels diplômes remis à l&apos;issue de l&apos;année de formation (sous réserve de remplir les critères d&apos;évaluation précisés en cours d&apos;année). Le contenu et le calendrier de la formation restent à la libre discrétion de Linova Éducation, qui peut procéder à des ajustements pour en assurer le bon déroulement.
          </p>

          <h2>3. Conditions et modalités de souscription à un Contrat de Formation</h2>

          <h3>3.1 Information préalable</h3>
          <p>
            L&apos;Étudiant peut consulter une Brochure décrivant un Programme en se rapprochant de Linova Éducation ou en la téléchargeant sur le site internet de Linova Éducation. Il prend le temps nécessaire pour comprendre la Brochure et poser toutes les questions utiles à Linova Éducation. Lorsque l&apos;Étudiant se dit intéressé par un Programme, Linova Éducation peut lui adresser un devis détaillé avec les conditions financières.
          </p>

          <h3>3.2 Processus de souscription à un Contrat de Formation</h3>
          <p>
            Lorsque l&apos;Étudiant considère être pleinement informé, il peut souscrire à un Contrat de Formation. Il renseigne les informations demandées dans le Dossier d&apos;Inscription, y compris l&apos;annexe financière indiquant le prix du Programme. Ce dossier peut prendre la forme d&apos;un CERFA, si nécessaire.
          </p>
          <p>
            L&apos;Étudiant garantit l&apos;exactitude des informations fournies, et notamment l&apos;adresse email utilisée pour la communication avec Linova Éducation. Il doit informer Linova Éducation de tout changement de coordonnées. Linova Éducation ne pourra être tenue responsable des conséquences d&apos;un manquement à cette obligation.
          </p>
          <p>
            Tout étudiant en formation initiale ou en apprentissage doit obtenir son attestation CVEC avant l&apos;inscription. Certains Programmes ne sont accessibles qu&apos;aux étudiants disposant de diplômes spécifiques, mentionnés dans la Brochure.
          </p>

          <h3>3.3 Confirmation de la souscription par Linova Éducation</h3>
          <p>
            Une fois le Dossier d&apos;Inscription complet reçu, Linova Éducation se réserve le droit d&apos;accepter ou de refuser la candidature. Les Programmes étant limités en capacité, une sélection peut être opérée sur dossier, entretien ou test de motivation.
          </p>
          <p>
            Les contrats d&apos;apprentissage ou de professionnalisation doivent aussi être validés par la DDTEFP et l&apos;OPCO concerné. Linova Éducation ne saurait être tenue responsable d&apos;un refus externe.
          </p>
          <p>
            Tous les éléments nécessaires à ces contrats doivent être transmis au service alternance de Linova Éducation au plus tard 15 jours avant le début du Programme. La souscription ne sera définitive qu&apos;après validation et paiement effectif.
          </p>

          <h3>3.4 Durée du Contrat de Formation</h3>
          <p>
            Le Contrat est applicable pour la durée du Programme. Chaque Programme est organisé en Années de Formation dont les dates sont communiquées par Linova Éducation, et peuvent être ajustées.
          </p>
          <p>
            Toute demande de résiliation doit être envoyée un (1) mois avant la fin de l&apos;Année en cours par lettre recommandée avec AR, et ne prendra effet que pour l&apos;année suivante. Le début d&apos;une Année de Formation peut être décalé sur demande conjointe des Parties.
          </p>

          <h2>4. Participation au Programme</h2>
          <p>
            L&apos;emploi du temps est transmis par mail. L&apos;Étudiant s&apos;engage à le consulter régulièrement. Il peut également recevoir des notifications par email, qui prévalent sur toute autre source.
          </p>
          <p>
            Les formations ont lieu en présentiel ou à distance. L&apos;Étudiant doit disposer du matériel nécessaire pour les formations à distance.
          </p>
          <p>
            L&apos;Étudiant s&apos;engage à respecter les règles de conduite, le règlement intérieur, la charte informatique ou tout autre document transmis par Linova Éducation. En cas de comportement fautif, l&apos;Étudiant garantit Linova Éducation contre tout recours.
          </p>

          <h2>5. Assiduité et Discipline</h2>
          <p>Un registre d&apos;appel est tenu pour chaque séance.</p>
          <p>
            En cas d&apos;absence, l&apos;Étudiant (ou sa famille/tuteur) doit avertir Linova Éducation et justifier du motif.
          </p>
          <p>Trente-cinq (35) heures d&apos;absence injustifiée entraînent une procédure disciplinaire progressive&nbsp;:</p>
          <ol>
            <li>Premier avertissement (copie à l&apos;employeur)&nbsp;;</li>
            <li>Deuxième avertissement (copie à l&apos;employeur)&nbsp;;</li>
            <li>Conseil de discipline&nbsp;: décision pouvant aller jusqu&apos;à l&apos;exclusion.</li>
          </ol>
          <p>
            L&apos;Étudiant peut être sanctionné sur sa moyenne ou voir ses absences déduites de sa rémunération s&apos;il est en alternance. Le suivi des absences est consultable à tout moment sur l&apos;extranet.
          </p>

          <h2>6. Résiliation anticipée</h2>
          <p>
            En cas de non-respect par l&apos;une des Parties de tout ou partie de ses obligations au titre des présentes CGS, l&apos;autre Partie pourra résilier le Contrat de Formation par lettre recommandée avec accusé de réception, sans indemnité.
          </p>
          <p>L&apos;Étudiant pourra également résilier le Contrat dans les cas suivants&nbsp;:</p>
          <ul>
            <li>
              Échec à un diplôme requis pour l&apos;entrée dans le Programme, sous réserve de notification écrite accompagnée d&apos;une copie des résultats, dans les 8 jours suivant leur publication&nbsp;;
            </li>
            <li>Refus de visa, dans les mêmes conditions, avec justificatif officiel.</li>
          </ul>
          <p>Le courrier de résiliation doit être adressé à&nbsp;:</p>
          <ul>
            <li>l&apos;Étudiant ou son représentant légal&nbsp;;</li>
            <li>l&apos;OPCO ou tout organisme tiers financeur&nbsp;;</li>
            <li>le cas échéant, la Maison des Examens.</li>
          </ul>
          <p>
            En cas de résiliation, les droits de scolarité restent dus, sauf en cas de force majeure, au sens du Code civil. Linova Éducation se réserve le droit de refuser toute réinscription d&apos;un Étudiant exclu pour faute. Toute résiliation emporte suppression de l&apos;accès à l&apos;environnement numérique dédié (extranet).
          </p>

          <h2>7. Prix et règlement</h2>
          <p>
            Le prix du Programme figure dans l&apos;annexe financière du Dossier d&apos;Inscription, en euros TTC. Linova Éducation n&apos;émet pas d&apos;appels à paiements. L&apos;Étudiant s&apos;engage à respecter l&apos;échéancier, notamment en fournissant les chèques à l&apos;inscription.
          </p>
          <p><strong>Le prix inclut&nbsp;:</strong></p>
          <ul>
            <li>les prestations pédagogiques,</li>
            <li>les documents réglementaires (conventions de stage),</li>
            <li>l&apos;accès aux locaux.</li>
          </ul>
          <p><strong>Le prix n&apos;inclut pas (liste indicative)&nbsp;:</strong></p>
          <ul>
            <li>les livres recommandés,</li>
            <li>les frais personnels (photocopies, téléphone…),</li>
            <li>les frais médicaux,</li>
            <li>la cotisation à la sécurité sociale,</li>
            <li>les outils numériques nécessaires pour le distanciel.</li>
          </ul>
          <p>
            Le tarif peut être révisé chaque année. L&apos;Étudiant en sera informé au moins deux (2) mois avant application. S&apos;il refuse le nouveau tarif, il peut résilier son inscription avant la rentrée via lettre recommandée avec AR.
          </p>
          <p>
            En cas de financement partiel par un Répondant Financier, le reste est à la charge de l&apos;Étudiant. Si aucune attestation de prise en charge n&apos;est reçue au premier jour du Programme, Linova Éducation facturera la totalité à l&apos;Étudiant.
          </p>

          <h2>8. Propriété intellectuelle — Supports remis à l&apos;Étudiant</h2>
          <p>
            Tous les supports pédagogiques remis à l&apos;Étudiant sont la propriété exclusive de Linova Éducation (ou de ses licenciés)&nbsp;: documents, logiciels, bases de données, scripts, etc.
          </p>
          <p>
            L&apos;Étudiant n&apos;a qu&apos;un droit d&apos;usage personnel, non transférable, gratuit et temporaire, valable pendant toute la durée du Contrat de Formation.
          </p>
          <p>
            Toute reproduction, diffusion, adaptation ou exploitation — même partielle — sans autorisation est interdite et constitue une contrefaçon au sens du Code de la propriété intellectuelle.
          </p>
          <p>
            Les supports peuvent inclure des mentions ou dispositifs de protection technique que l&apos;Étudiant s&apos;engage à ne pas modifier, supprimer ou contourner.
          </p>

          <h2>9. Propriété intellectuelle — Créations réalisées par les Étudiants</h2>
          <p>
            Les travaux réalisés par les Étudiants pendant leur Programme, seuls ou en groupe, sont considérés comme œuvres collectives sous la direction de Linova Éducation, qui en détient tous les droits patrimoniaux.
          </p>
          <p>Les droits concernés incluent, entre autres&nbsp;:</p>
          <ul>
            <li>reproduction, représentation, diffusion&nbsp;;</li>
            <li>modification, adaptation, traduction&nbsp;;</li>
            <li>incorporation à d&apos;autres œuvres&nbsp;;</li>
            <li>exploitation commerciale, enregistrement à titre de marque, etc.</li>
          </ul>
          <p>
            L&apos;Étudiant reconnaît céder ces droits de manière gratuite, sans limite géographique ni technologique, pour toute la durée légale de protection. Il renonce expressément à toute rémunération complémentaire au titre de l&apos;article L.&nbsp;131-6 du Code de la propriété intellectuelle.
          </p>

          <h2>10. Droit de rétractation</h2>
          <p>
            L&apos;Étudiant peut se rétracter dans un délai de quatorze (14) jours francs après chaque nouvelle souscription à un Programme, sans avoir à justifier sa décision.
          </p>
          <p>
            Il doit envoyer le formulaire de rétractation annexé aux présentes, par courrier ou email à&nbsp;: <strong>Linova Éducation — 85, Avenue Ledru-Rollin 75012 Paris</strong> — <a href="mailto:contact@linova.fr">contact@linova.fr</a>.
          </p>
          <p>
            Si des prestations ont été commencées avant la fin du délai, l&apos;Étudiant devra payer un montant proportionnel aux services rendus. Le remboursement interviendra dans les 14 jours à compter de la réception de la demande de rétractation, par le même moyen de paiement utilisé à l&apos;inscription.
          </p>

          <h2>11. Données personnelles</h2>
          <p>
            Les données personnelles de l&apos;Étudiant sont traitées conformément à la <strong>Charte Vie Privée de Linova Éducation</strong>, remise à l&apos;Étudiant à l&apos;inscription.
          </p>

          <h2>12. Dispositions diverses</h2>

          <h3>12.1 Correspondance — Preuve</h3>
          <p>
            Les échanges se font principalement par courrier électronique. L&apos;Étudiant accepte que ces échanges aient valeur probante. Les données de connexion ou d&apos;émission/réception de mail font foi sauf preuve écrite contraire.
          </p>

          <h3>12.2 Non-validité partielle</h3>
          <p>
            Si une clause des CGS est déclarée nulle ou non écrite, le reste du contrat demeure applicable sauf si l&apos;équilibre contractuel en est affecté.
          </p>

          <h3>12.3 Titres</h3>
          <p>Les titres insérés dans les CGS sont uniquement indicatifs.</p>

          <h2>13. Droit applicable et règlement des litiges</h2>
          <p>Les CGS sont soumises au droit français.</p>
          <p>
            En cas de litige, l&apos;Étudiant s&apos;engage à rechercher d&apos;abord une solution amiable auprès de Linova Éducation.
          </p>
          <p>À défaut d&apos;accord amiable, l&apos;Étudiant peut&nbsp;:</p>
          <ul>
            <li>
              recourir à une médiation à l&apos;aide des outils publics (ex.&nbsp;: <a href="https://www.economie.gouv.fr/mediation-conso" target="_blank" rel="noopener noreferrer">economie.gouv.fr/mediation-conso</a>)&nbsp;;
            </li>
            <li>
              utiliser la plateforme de règlement en ligne des litiges&nbsp;: <a href="https://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/odr</a>&nbsp;;
            </li>
            <li>saisir les juridictions françaises compétentes.</li>
          </ul>

          <h2>14. Spécificité de l&apos;apprentissage</h2>
          <p>
            En cas de litige lié au contrat d&apos;apprentissage, l&apos;entreprise d&apos;accueil doit être contactée en premier lieu. Si le conflit persiste, le médiateur de l&apos;apprentissage peut être saisi.
          </p>
          <p>
            En cas de démission, l&apos;Étudiant doit obligatoirement passer par le médiateur. Un délai de 5 jours calendaires s&apos;applique après la saisine avant notification à l&apos;employeur, suivis de 7 jours avant rupture effective.
          </p>

          <p className="mt-12 text-sm text-gray-500">
            Date de dernière mise à jour des CGS&nbsp;: <strong>{lastUpdate}</strong>.
          </p>

          <hr className="my-12" />

          <h2>Annexe — Formulaire de rétractation</h2>
          <div className="bg-light rounded-2xl p-6">
            <p className="text-sm text-gray-600 mb-4">
              <strong>À l&apos;attention de Linova Éducation</strong><br />
              85, Avenue Ledru-Rollin — 75012 Paris<br />
              <a href="mailto:contact@linova.fr" className="text-teal hover:underline">contact@linova.fr</a>
            </p>
            <p className="text-sm text-gray-700 mb-4">
              Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de formation suivante&nbsp;:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-none p-0">
              <li>Programme&nbsp;: ______________________________</li>
              <li>Date d&apos;inscription&nbsp;: ________________________</li>
              <li>Nom et prénom de l&apos;Étudiant&nbsp;: ______________</li>
              <li>Adresse&nbsp;: _________________________________</li>
              <li>Date&nbsp;: ______________</li>
              <li>Signature (en cas d&apos;envoi papier)</li>
            </ul>
          </div>

        </div>
      </article>
    </>
  );
}
