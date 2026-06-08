/**
 * Registre des cours du hub. La page d'accueil (hub) en dérive.
 */
import type { CourseId } from './nav';

export interface Course {
  id: CourseId;
  title: string;
  blurb: string;
  logo: string;
  home: string; // racine du cours
  accent: string; // variable CSS de couleur d'accent
}

export const COURSES: Course[] = [
  {
    id: 'physique',
    title: 'De la relativité au Modèle Standard',
    blurb:
      'La physique fondamentale, des deux postulats d’Einstein jusqu’aux particules élémentaires et aux grands problèmes ouverts.',
    logo: '⊙',
    home: '/physique',
    accent: 'var(--c-blue)',
  },
  {
    id: 'maths',
    title: 'Les mathématiques depuis les axiomes',
    blurb:
      'De la méthode axiomatique aux nombres réels, en construisant tout depuis l’ensemble vide — rien n’est admis sans le dire.',
    logo: '∅',
    home: '/maths',
    accent: 'var(--c-purple)',
  },
];

export function courseById(id: CourseId | null): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
