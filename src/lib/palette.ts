/**
 * Palette partagée — UNIQUE source de vérité des couleurs.
 *
 * Inspirée de la charte « 3Blue1Brown / Manim ». Ces mêmes valeurs sont
 * répliquées :
 *   - en variables CSS dans src/styles/global.css (préfixe --c-…) pour la mise en page ;
 *   - dans manim/theme.py pour les vidéos.
 * Toute modification doit être reportée aux trois endroits pour rester cohérente.
 */

export const PALETTE = {
  // Fonds (mode sombre par défaut)
  bg: '#0e1116',
  bgElev: '#161b22',
  surface: '#1b2230',
  border: '#2b3444',

  // Textes
  text: '#e6edf3',
  muted: '#9da7b3',

  // Couleurs « Manim »
  blue: '#58c4dd', // BLUE — relativité, axes, lumière
  blueD: '#3c7c8c',
  yellow: '#ffd866', // YELLOW — résultats, énergie, accents
  red: '#fc6255', // RED — alertes, vitesse, danger
  green: '#83c167', // GREEN — établi, rappels
  purple: '#c39bd3', // PURPLE — quantique, « pour aller plus loin »
  teal: '#5cd0b3', // TEAL — champs
  orange: '#ff9f40',
  pink: '#e08bbf',
} as const;

/**
 * Niveaux de fiabilité — DÉFINIS DANS src/lib/fiability.ts (configurable par domaine).
 * Réexportés ici pour compatibilité des imports existants.
 */
export { FIABILITE, type NiveauFiabilite } from './fiability';

/** Couleurs/emoji des 4 types d'encart dépliable. */
export const ENCART = {
  calcul: { color: '#58c4dd', emoji: '🧮', label: 'Calcul détaillé', open: false },
  rappel: { color: '#83c167', emoji: '📐', label: 'Rappel', open: false },
  plusloin: { color: '#c39bd3', emoji: '🔬', label: 'Pour aller plus loin', open: false },
  intuition: { color: '#ffd866', emoji: '💡', label: 'Intuition', open: true },
} as const;

export type TypeEncart = keyof typeof ENCART;
