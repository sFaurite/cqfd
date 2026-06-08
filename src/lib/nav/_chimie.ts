/**
 * Navigation du cours « La chimie depuis l'atome » — SOURCE UNIQUE de l'ordre.
 * Chemins NON préfixés : `index.ts` les préfixe par `/chimie`.
 */
import type { Partie } from './_maths';

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce cours, et ce que signifient les encarts et les badges de fiabilité.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce cours', court: 'Comment lire ce cours', accroche: 'Les encarts dépliables, l’échelle de fiabilité physico-chimique, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les quatre niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « quantique », « établi par l’expérience », « règle empirique », « qualitatif ».' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'L’atome quantique',
    accroche: 'Le seul vrai point de départ : la matière est quantique. Orbitales, niveaux d’énergie, et la construction des atomes.',
    chapitres: [
      { slug: 'postulats-quantiques', path: '/partie-i/postulats-quantiques', num: 1, titre: 'Le point de départ : la matière est quantique', court: 'Postulats quantiques', accroche: 'Quantification de l’énergie, dualité onde-corpuscule, fonction d’onde : le socle admis de tout le cours.' },
      { slug: 'atome-hydrogene', path: '/partie-i/atome-hydrogene', num: 2, titre: 'L’atome d’hydrogène : niveaux et orbitales', court: 'Atome d’hydrogène', accroche: 'Le seul atome résolu exactement : niveaux quantifiés, nombres n, l, m, et la forme des orbitales.' },
      { slug: 'structure-electronique', path: '/partie-i/structure-electronique', num: 3, titre: 'Construire les atomes : Pauli, Klechkowski, Hund', court: 'Structure électronique', accroche: 'Remplir les orbitales : la nécessité (Pauli) et les règles approchées (Klechkowski, Hund), avec leurs exceptions.' },
      { slug: 'ecrantage-charge-effective', path: '/partie-i/ecrantage-charge-effective', num: 4, titre: 'Écrantage et charge effective', court: 'Écrantage', accroche: 'Pourquoi un électron externe « voit » moins que la charge totale du noyau : la clé des tendances périodiques.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Périodicité et liaison chimique',
    accroche: 'Du tableau périodique comme carte de la structure électronique aux différents modèles de la liaison.',
    chapitres: [
      { slug: 'tableau-periodique', path: '/partie-ii/tableau-periodique', num: 5, titre: 'Le tableau périodique : une carte de la structure électronique', court: 'Tableau périodique', accroche: 'Le tableau n’est pas une liste : c’est le reflet direct du remplissage des orbitales. Blocs s, p, d, f.' },
      { slug: 'tendances-periodiques', path: '/partie-ii/tendances-periodiques', num: 6, titre: 'Tendances périodiques : rayon, ionisation, électronégativité', court: 'Tendances périodiques', accroche: 'Pourquoi ces grandeurs varient régulièrement dans le tableau, déduites de la charge effective.' },
      { slug: 'liaison-covalente-lewis', path: '/partie-ii/liaison-covalente-lewis', num: 7, titre: 'La liaison covalente et le modèle de Lewis', court: 'Liaison covalente (Lewis)', accroche: 'Le partage d’électrons, la règle de l’octet et les charges formelles : un modèle empirique puissant et limité.' },
      { slug: 'liaison-ionique-metallique', path: '/partie-ii/liaison-ionique-metallique', num: 8, titre: 'Liaisons ionique et métallique', court: 'Liaisons ionique & métallique', accroche: 'Transfert d’électrons (ionique) et mer d’électrons délocalisés (métallique) : deux autres façons de lier les atomes.' },
      { slug: 'orbitales-moleculaires', path: '/partie-ii/orbitales-moleculaires', num: 9, titre: 'Au-delà de Lewis : les orbitales moléculaires', court: 'Orbitales moléculaires', accroche: 'OM liantes et antiliantes, ordre de liaison, et le paramagnétisme de O₂ que Lewis ne sait pas expliquer.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'Géométrie, polarité et états de la matière',
    accroche: 'De la forme des molécules (VSEPR) à leur polarité, puis aux forces qui décident des états de la matière.',
    chapitres: [
      { slug: 'vsepr-geometrie', path: '/partie-iii/vsepr-geometrie', num: 10, titre: 'La géométrie des molécules : VSEPR', court: 'VSEPR', accroche: 'Les doublets se repoussent : une règle empirique simple qui prédit la forme 3D des molécules.' },
      { slug: 'polarite-moments-dipolaires', path: '/partie-iii/polarite-moments-dipolaires', num: 11, titre: 'Polarité : moments dipolaires', court: 'Polarité', accroche: 'Géométrie + électronégativité = moment dipolaire. Pourquoi CO₂ est apolaire mais H₂O ne l’est pas.' },
      { slug: 'interactions-intermoleculaires', path: '/partie-iii/interactions-intermoleculaires', num: 12, titre: 'Les forces entre molécules', court: 'Forces intermoléculaires', accroche: 'Van der Waals, liaison hydrogène : les interactions faibles qui gouvernent cohésion, solubilité, points d’ébullition.' },
      { slug: 'etats-matiere-transitions', path: '/partie-iii/etats-matiere-transitions', num: 13, titre: 'États de la matière et changements d’état', court: 'États de la matière', accroche: 'Solide, liquide, gaz : un équilibre entre agitation thermique et forces intermoléculaires. Diagrammes de phases.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Thermochimie : énergie et spontanéité',
    accroche: 'Qu’est-ce qui rend une réaction possible ? Enthalpie, entropie, enthalpie libre : la machinerie de la spontanéité.',
    chapitres: [
      { slug: 'energie-enthalpie', path: '/partie-iv/energie-enthalpie', num: 14, titre: 'Énergie et enthalpie des réactions', court: 'Énergie & enthalpie', accroche: 'Premier principe, chaleur de réaction, loi de Hess : la comptabilité énergétique d’une transformation.' },
      { slug: 'entropie-second-principe', path: '/partie-iv/entropie-second-principe', num: 15, titre: 'Entropie et second principe', court: 'Entropie', accroche: 'L’entropie comme nombre de micro-états (S = k ln Ω), pas comme « désordre ». Pourquoi l’univers a un sens.' },
      { slug: 'enthalpie-libre-spontaneite', path: '/partie-iv/enthalpie-libre-spontaneite', num: 16, titre: 'Enthalpie libre et spontanéité', court: 'Enthalpie libre', accroche: 'ΔG = ΔH − TΔS : le critère qui tranche, à température et pression données, ce qui est spontané.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'Équilibres, cinétique et réactions en solution',
    accroche: 'L’équilibre chimique, la vitesse des réactions, puis les grandes familles : acide-base et oxydoréduction.',
    chapitres: [
      { slug: 'equilibre-chimique', path: '/partie-v/equilibre-chimique', num: 17, titre: 'L’équilibre chimique', court: 'Équilibre chimique', accroche: 'Constante d’équilibre, quotient réactionnel, principe de Le Chatelier : la réaction qui ne va pas « jusqu’au bout ».' },
      { slug: 'cinetique-chimique', path: '/partie-v/cinetique-chimique', num: 18, titre: 'Cinétique : la vitesse des réactions', court: 'Cinétique', accroche: 'Énergie d’activation, loi d’Arrhenius, catalyse : la thermodynamique dit « si », la cinétique dit « à quelle vitesse ».' },
      { slug: 'acide-base', path: '/partie-v/acide-base', num: 19, titre: 'Réactions acide-base', court: 'Acide-base', accroche: 'Brønsted, pH, pKa, tampons et titrages : transferts de protons en solution aqueuse.' },
      { slug: 'oxydoreduction', path: '/partie-v/oxydoreduction', num: 20, titre: 'Oxydoréduction et potentiels', court: 'Oxydoréduction', accroche: 'Transferts d’électrons, nombre d’oxydation, potentiels standard et piles : de la rouille à la batterie.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Ouverture : la chimie du carbone',
    accroche: 'Pourquoi un seul élément engendre des millions de molécules : squelettes, fonctions et mécanismes.',
    chapitres: [
      { slug: 'carbone-squelette', path: '/partie-vi/carbone-squelette', num: 21, titre: 'Le carbone : un squelette pour la diversité', court: 'Le carbone', accroche: 'Hybridation sp³/sp²/sp, chaînes, cycles et isoméries : l’art du carbone de construire des édifices variés.' },
      { slug: 'groupes-fonctionnels', path: '/partie-vi/groupes-fonctionnels', num: 22, titre: 'Groupes fonctionnels et familles de molécules', court: 'Groupes fonctionnels', accroche: 'Alcools, amines, acides, esters… : ces poignées réactives qui définissent les familles de la chimie organique.' },
      { slug: 'mecanismes-reactionnels', path: '/partie-vi/mecanismes-reactionnels', num: 23, titre: 'Mécanismes : la danse des électrons', court: 'Mécanismes', accroche: 'Flèches courbes, nucléophiles et électrophiles : comment les liaisons se font et se défont, étape par étape.' },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des symboles.',
    chapitres: [
      { slug: 'glossaire', path: '/glossaire', num: 0, titre: 'Glossaire', court: 'Glossaire', accroche: 'Tous les termes techniques, reliés à leur page.' },
      { slug: 'symboles', path: '/symboles', num: 0, titre: 'Index des symboles et constantes', court: 'Index des symboles', accroche: 'Chaque symbole, grandeur et constante, avec son unité et son statut.' },
    ],
  },
];
