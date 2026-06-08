/**
 * Indicateur de fiabilité — HUB MULTI-COURS.
 *
 * Chaque cours a SA propre échelle (la physique est empirique, les maths sont
 * déductives). Astuce : les clés des presets sont DISJOINTES, donc une seule map
 * fusionnée `FIABILITE` suffit au composant <Badge> (il retrouve toujours le bon
 * libellé/couleur). En revanche la LÉGENDE et la page MÉTHODOLOGIE sont par-cours :
 * elles utilisent `niveauxFor(courseId)`.
 */

export interface NiveauDef {
  color: string;
  emoji: string;
  label: string;
  sens: string;
}

const VERT = '#83c167';
const BLEU = '#58c4dd';
const AMBRE = '#ffce54';
const ROUGE = '#fc6255';

/** Science empirique (physique) : axe = confirmation par l'expérience. */
export const PRESET_EMPIRIQUE = {
  etabli: { color: VERT, emoji: '🟢', label: 'Établi', sens: 'Vérifié expérimentalement à très haute précision ; consensus total.' },
  modelise: { color: BLEU, emoji: '🔵', label: 'Solidement modélisé', sens: 'Théorie très bien confirmée, mais reposant sur un cadre/modèle (preuve indirecte).' },
  plausible: { color: AMBRE, emoji: '🟡', label: 'Plausible / en débat', sens: 'Hypothèse sérieuse, non tranchée par l’expérience.' },
  ouvert: { color: ROUGE, emoji: '🔴', label: 'Ouvert / inconnu', sens: 'Aucune réponse établie : question ouverte.' },
} as const;

/** Mathématiques : axe = statut épistémique (posé vs démontré vs ouvert). */
export const PRESET_MATHS = {
  demontre: { color: VERT, emoji: '🟢', label: 'Démontré', sens: 'Théorème prouvé rigoureusement à partir des axiomes adoptés ; consensus.' },
  admis: { color: BLEU, emoji: '🔵', label: 'Admis', sens: 'Posé par choix : un axiome, une définition, ou un cadre (ZF, logique). Adopté, non démontré — ni « vrai » ni « faux » en soi.' },
  conjecture: { color: AMBRE, emoji: '🟡', label: 'Conjecturé', sens: 'Cru vrai mais non démontré : problème ouvert (Riemann, P vs NP…).' },
  indecidable: { color: ROUGE, emoji: '🔴', label: 'Indécidable', sens: 'Démontré ni prouvable ni réfutable dans le cadre adopté (ex. hypothèse du continu dans ZFC).' },
} as const;

/** Map FUSIONNÉE (clés disjointes) : sert au composant <Badge> pour les deux cours. */
export const FIABILITE = { ...PRESET_EMPIRIQUE, ...PRESET_MATHS };
export type NiveauFiabilite = keyof typeof FIABILITE;

/** Échelle (4 niveaux) PAR COURS — pour la légende et la page Méthodologie. */
const PAR_COURS: Record<string, Record<string, NiveauDef>> = {
  physique: PRESET_EMPIRIQUE,
  maths: PRESET_MATHS,
};

export function niveauxFor(courseId: string | null): Array<{ cle: string } & NiveauDef> {
  const preset = (courseId && PAR_COURS[courseId]) || PRESET_EMPIRIQUE;
  return Object.entries(preset).map(([cle, v]) => ({ cle, ...(v as NiveauDef) }));
}
