/**
 * Questions du QCM d'admission BTS Biologie Médicale.
 *
 * ⚠️ Ce fichier est PUBLIC (utilisé côté client). Il NE contient JAMAIS
 * les bonnes réponses — celles-ci sont dans `admission-qcm-answers.ts`,
 * importé uniquement côté serveur.
 */

export interface QcmQuestion {
  id: string;
  category: string;
  text: string;
  options: { value: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

export const QCM_QUESTIONS: QcmQuestion[] = [
  // Hygiène et sécurité
  {
    id: 'Q1',
    category: 'Hygiène et sécurité',
    text: 'Au laboratoire, il faut porter une blouse :',
    options: [
      { value: 'A', text: 'Pour faire joli' },
      { value: 'B', text: 'Pour se protéger' },
      { value: 'C', text: 'Pour éviter la contamination' },
      { value: 'D', text: 'Uniquement en chimie' },
    ],
  },
  {
    id: 'Q2',
    category: 'Hygiène et sécurité',
    text: 'Il est interdit de :',
    options: [
      { value: 'A', text: 'Manger au laboratoire' },
      { value: 'B', text: 'Boire au laboratoire' },
      { value: 'C', text: 'Porter des gants' },
      { value: 'D', text: 'Se laver les mains' },
    ],
  },
  {
    id: 'Q3',
    category: 'Hygiène et sécurité',
    text: 'Les gants servent à :',
    options: [
      { value: 'A', text: 'Chauffer les mains' },
      { value: 'B', text: 'Remplacer le lavage des mains' },
      { value: 'C', text: 'Éviter la contamination' },
      { value: 'D', text: 'Protéger les mains' },
    ],
  },
  // Biologie
  {
    id: 'Q4',
    category: 'Biologie',
    text: 'Une cellule eucaryote possède :',
    options: [
      { value: 'A', text: 'Un noyau' },
      { value: 'B', text: 'Pas de noyau' },
      { value: 'C', text: 'Des organites' },
      { value: 'D', text: 'Seulement une membrane' },
    ],
  },
  {
    id: 'Q5',
    category: 'Biologie',
    text: 'Une bactérie est :',
    options: [
      { value: 'A', text: 'Une cellule procaryote' },
      { value: 'B', text: 'Une cellule eucaryote' },
      { value: 'C', text: 'Un virus' },
      { value: 'D', text: 'Un champignon' },
    ],
  },
  {
    id: 'Q6',
    category: 'Biologie',
    text: 'La membrane cellulaire sert à :',
    options: [
      { value: 'A', text: 'Protéger la cellule' },
      { value: 'B', text: 'Contrôler les échanges' },
      { value: 'C', text: 'Produire de l\'ADN' },
      { value: 'D', text: 'Stocker l\'énergie' },
    ],
  },
  // Biochimie
  {
    id: 'Q7',
    category: 'Biochimie',
    text: 'Le sucre (glucose) est :',
    options: [
      { value: 'A', text: 'Un lipide' },
      { value: 'B', text: 'Un glucide' },
      { value: 'C', text: 'Une source d\'énergie' },
      { value: 'D', text: 'Une protéine' },
    ],
  },
  {
    id: 'Q8',
    category: 'Biochimie',
    text: 'Les lipides servent à :',
    options: [
      { value: 'A', text: 'Stocker de l\'énergie' },
      { value: 'B', text: 'Remplacer les glucides' },
      { value: 'C', text: 'Être dissous dans l\'eau' },
      { value: 'D', text: 'Constituer les membranes' },
    ],
  },
  {
    id: 'Q9',
    category: 'Biochimie',
    text: 'Les glucides sont :',
    options: [
      { value: 'A', text: 'Une source d\'énergie rapide' },
      { value: 'B', text: 'Toujours insolubles' },
      { value: 'C', text: 'Présents dans le pain' },
      { value: 'D', text: 'Des graisses' },
    ],
  },
  // Hématologie
  {
    id: 'Q10',
    category: 'Hématologie',
    text: 'Les globules rouges transportent :',
    options: [
      { value: 'A', text: 'L\'oxygène' },
      { value: 'B', text: 'Le dioxyde de carbone' },
      { value: 'C', text: 'Les anticorps' },
      { value: 'D', text: 'Les hormones' },
    ],
  },
  {
    id: 'Q11',
    category: 'Hématologie',
    text: 'Les globules rouges contiennent :',
    options: [
      { value: 'A', text: 'De l\'hémoglobine' },
      { value: 'B', text: 'De l\'ADN' },
      { value: 'C', text: 'Un noyau' },
      { value: 'D', text: 'De l\'insuline' },
    ],
  },
  // Physique-chimie
  {
    id: 'Q12',
    category: 'Physique-chimie',
    text: 'Le pH mesure :',
    options: [
      { value: 'A', text: 'L\'acidité' },
      { value: 'B', text: 'La température' },
      { value: 'C', text: 'La basicité' },
      { value: 'D', text: 'La masse' },
    ],
  },
  {
    id: 'Q13',
    category: 'Physique-chimie',
    text: 'Une solution neutre a un pH :',
    options: [
      { value: 'A', text: '7' },
      { value: 'B', text: '0' },
      { value: 'C', text: '14' },
      { value: 'D', text: '10' },
    ],
  },
  {
    id: 'Q14',
    category: 'Physique-chimie',
    text: 'Une solution acide a un pH :',
    options: [
      { value: 'A', text: 'Inférieur à 7' },
      { value: 'B', text: 'Supérieur à 7' },
      { value: 'C', text: 'Égal à 7' },
      { value: 'D', text: 'Égal à 14' },
    ],
  },
  // Mathématiques
  {
    id: 'Q15',
    category: 'Mathématiques',
    text: '1 litre correspond à :',
    options: [
      { value: 'A', text: '1 mL' },
      { value: 'B', text: '100 mL' },
      { value: 'C', text: '1000 mL' },
      { value: 'D', text: '10 mL' },
    ],
  },
  {
    id: 'Q16',
    category: 'Mathématiques',
    text: 'Une dilution par 2 signifie :',
    options: [
      { value: 'A', text: 'Diviser la concentration par 2' },
      { value: 'B', text: 'Multiplier la concentration par 2' },
      { value: 'C', text: 'Ajouter de l\'eau' },
      { value: 'D', text: 'Chauffer la solution' },
    ],
  },
  {
    id: 'Q17',
    category: 'Mathématiques',
    text: '2 + 3 × 4 =',
    options: [
      { value: 'A', text: '20' },
      { value: 'B', text: '14' },
      { value: 'C', text: '24' },
      { value: 'D', text: '10' },
    ],
  },
  // Documentation et traçabilité
  {
    id: 'Q18',
    category: 'Documentation et traçabilité',
    text: 'Un résultat de laboratoire doit être :',
    options: [
      { value: 'A', text: 'Écrit' },
      { value: 'B', text: 'Mémorisé uniquement' },
      { value: 'C', text: 'Lisible' },
      { value: 'D', text: 'Effacé après lecture' },
    ],
  },
  {
    id: 'Q19',
    category: 'Documentation et traçabilité',
    text: 'Identifier un échantillon permet :',
    options: [
      { value: 'A', text: 'D\'éviter les erreurs' },
      { value: 'B', text: 'De gagner du temps' },
      { value: 'C', text: 'De tracer le patient' },
      { value: 'D', text: 'De ne rien écrire' },
    ],
  },
  {
    id: 'Q20',
    category: 'Documentation et traçabilité',
    text: 'Un protocole sert à :',
    options: [
      { value: 'A', text: 'Remplacer le technicien' },
      { value: 'B', text: 'Éviter d\'apprendre' },
      { value: 'C', text: 'Expliquer une méthode' },
      { value: 'D', text: 'Faire toujours la même manipulation' },
    ],
  },
];
