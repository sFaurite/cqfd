/**
 * Registre des cours du hub. La page d'accueil (hub) en dérive.
 */
import type { CourseId } from './nav';

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

export const COURSES: Course[] = [
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
      'De la méthode axiomatique aux nombres réels, en construisant tout depuis l’ensemble vide — rien n’est admis sans le dire.',
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
];

export function courseById(id: CourseId | null): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
