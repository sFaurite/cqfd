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

/**
 * Ingénierie / informatique matérielle : l'axe n'est ni « certitude empirique » ni
 * « statut mathématique », mais le DEGRÉ DE NÉCESSITÉ. Du silicium à l'OS, chaque
 * étage ajoute des choix qui ne se déduisent pas de la physique. Distinguer ce que
 * la nature impose de ce que l'ingénieur décide est ici le cœur de l'honnêteté.
 */
export const PRESET_INGENIERIE = {
  fonde: { color: VERT, emoji: '🟢', label: 'Fondé', sens: 'Imposé par une loi physique vérifiée ou une déduction logique stricte (jonction PN, théorème de Boole). Nécessaire : ne pourrait pas être autrement.' },
  convention: { color: BLEU, emoji: '🔵', label: 'Convention', sens: 'Choix d’ingénierie ou convention adoptée (logique positive, complément à deux, jeu d’instructions). Vrai « par décret » — utile et cohérent, mais pourrait être différent.' },
  idealise: { color: AMBRE, emoji: '🟡', label: 'Idéalisé', sens: 'Modèle simplifié, valable sous conditions (transistor = interrupteur parfait, délai de porte nul). La réalité physique est plus nuancée.' },
  implementation: { color: ROUGE, emoji: '🔴', label: 'Implémentation', sens: 'Dépend de la puce, du fabricant ou du firmware (timings exacts, microcode, tables ACPI). Non universel : varie d’un système à l’autre.' },
} as const;

/** Map FUSIONNÉE (clés disjointes) : sert au composant <Badge> pour les trois cours. */
export const FIABILITE = { ...PRESET_EMPIRIQUE, ...PRESET_MATHS, ...PRESET_INGENIERIE };
export type NiveauFiabilite = keyof typeof FIABILITE;

/** Échelle (4 niveaux) PAR COURS — pour la légende et la page Méthodologie. */
const PAR_COURS: Record<string, Record<string, NiveauDef>> = {
  physique: PRESET_EMPIRIQUE,
  maths: PRESET_MATHS,
  processeurs: PRESET_INGENIERIE,
};

export function niveauxFor(courseId: string | null): Array<{ cle: string } & NiveauDef> {
  const preset = (courseId && PAR_COURS[courseId]) || PRESET_EMPIRIQUE;
  return Object.entries(preset).map(([cle, v]) => ({ cle, ...(v as NiveauDef) }));
}
