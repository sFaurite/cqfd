/**
 * Registre des cours du hub. La page d'accueil (hub) en dérive.
 */
import type { CourseId } from './nav';
import { withBase } from './base';

export interface Course {
  id: CourseId;
  title: string;
  /** libellé court (fil d'Ariane, onglets) */
  short: string;
  blurb: string;
  logo: string;
  home: string; // racine du cours
  accent: string; // variable CSS de couleur d'accent
}

const COURSES_RAW: Course[] = [
  {
    id: 'physique',
    title: 'De la relativité au Modèle Standard',
    short: 'Physique',
    blurb:
      'La physique fondamentale, des deux postulats d’Einstein jusqu’aux particules élémentaires et aux grands problèmes ouverts.',
    logo: '⊙',
    home: '/physique',
    accent: 'var(--c-blue)',
  },
  {
    id: 'maths',
    title: 'Les mathématiques depuis les axiomes',
    short: 'Maths',
    blurb:
      'Des axiomes de ZF à la formule d’Euler : les nombres, les infinis de Cantor, les structures de l’algèbre et l’analyse — tout construit depuis l’ensemble vide, rien n’est admis sans le dire.',
    logo: '∅',
    home: '/maths',
    accent: 'var(--c-purple)',
  },
  {
    id: 'processeurs',
    title: 'Des atomes au système d’exploitation',
    short: 'Processeurs',
    blurb:
      'Comment un caillou de silicium en vient à exécuter un OS : des niveaux d’énergie atomiques au transistor, aux portes logiques, à l’architecture, jusqu’au boot du noyau.',
    logo: '⊞',
    home: '/processeurs',
    accent: 'var(--c-teal)',
  },
  {
    id: 'cosmologie',
    title: 'La cosmologie, des premiers instants au monde actuel',
    short: 'Cosmologie',
    blurb:
      'L’histoire de l’univers, de l’hypothèse d’homogénéité aux équations de Friedmann, du fond diffus à la formation des galaxies, jusqu’au modèle ΛCDM, à la matière et l’énergie noires.',
    logo: 'Λ',
    home: '/cosmologie',
    accent: 'var(--c-orange)',
  },
  {
    id: 'chimie',
    title: 'La chimie depuis l’atome',
    short: 'Chimie',
    blurb:
      'Toute la chimie remonte à un seul fait : l’atome est quantique. Des orbitales au tableau périodique, de la liaison à la thermodynamique, jusqu’à la chimie du carbone — on reconstruit la matière sans rien admettre en douce.',
    logo: '⚗',
    home: '/chimie',
    accent: 'var(--c-red)',
  },
  {
    id: 'reseaux',
    title: 'Les réseaux depuis le bit',
    short: 'Réseaux',
    blurb:
      'Du signal physique au web réparti : la limite de Shannon, la trame, l’adressage IP, le routage, TCP et sa fiabilité, puis DNS et HTTP. On distingue le théorème de la norme, de l’heuristique et du déploiement.',
    logo: '🌐',
    home: '/reseaux',
    accent: 'var(--c-green)',
  },
  {
    id: 'histoire',
    title: 'L’histoire humaine : des premiers hommes aux temps modernes',
    short: 'Histoire',
    blurb:
      'Des premiers Homo aux Temps modernes, non pas une liste de dates mais comment on sait : sources, archéologie, datations. Chaque affirmation porte un badge d’attestation — attesté, probable, reconstitué ou débattu.',
    logo: '🏛️',
    home: '/histoire',
    accent: '#e08bbf',
  },
  {
    id: 'ia',
    title: 'L’IA moderne, de zéro',
    short: 'IA',
    blurb:
      'Du neurone au transformer, brique par brique : perte et descente de gradient, rétropropagation, réseaux profonds, attention, grands modèles de langage. On sépare le démontré de l’empiriquement robuste, de la recette et de la boîte noire.',
    logo: '🧠',
    home: '/ia',
    accent: 'var(--c-yellow)',
  },
];

/** La racine de chaque cours est préfixée par la base du site (déploiement /cqfd/). */
export const COURSES: Course[] = COURSES_RAW.map((c) => ({ ...c, home: withBase(c.home) }));

export function courseById(id: CourseId | null): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
