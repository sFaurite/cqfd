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

/**
 * Cosmologie : l'axe est le DEGRÉ D'ANCRAGE OBSERVATIONNEL. Du fait mesuré
 * (expansion, fond diffus, abondances) à la spéculation pure (avant Planck,
 * multivers), en passant par ce que le modèle ΛCDM prédit et concorde, et par
 * les extrapolations théoriques sérieuses mais non tranchées (inflation, nature
 * de l'énergie noire). Distinguer le mesuré du modélisé et du spéculé est ici
 * le cœur de l'honnêteté.
 */
export const PRESET_COSMO = {
  observe: { color: VERT, emoji: '🟢', label: 'Observé', sens: 'Mesuré directement : expansion (redshifts), fond diffus, abondances primordiales, structure à grande échelle. Fait empirique robuste, consensus.' },
  concordance: { color: BLEU, emoji: '🔵', label: 'Concordant (ΛCDM)', sens: 'Prédit par le modèle standard ΛCDM et concordant avec toutes les observations, mais reposant sur le modèle (matière noire froide, constante cosmologique Λ).' },
  extrapole: { color: AMBRE, emoji: '🟡', label: 'Extrapolé', sens: 'Extrapolation théorique au-delà du directement testé : inflation, baryogenèse, nature physique de l’énergie noire. Sérieux, non tranché.' },
  speculatif: { color: ROUGE, emoji: '🔴', label: 'Spéculatif', sens: 'Au-delà de toute donnée : avant le temps de Planck, gravité quantique, multivers. Aucune réponse établie.' },
} as const;

/**
 * Chimie : l'axe est le DEGRÉ DE NÉCESSITÉ PHYSICO-CHIMIQUE. Du principe quantique
 * inviolable (structure électronique, conservation) à la tendance qualitative et
 * contextuelle, en passant par le fait mesuré et la règle empirique prédictive mais
 * approchée. Distinguer ce que la mécanique quantique impose de ce qui n'est qu'une
 * règle commode est ici le cœur de l'honnêteté.
 */
export const PRESET_CHIMIE = {
  quantique: { color: VERT, emoji: '🟢', label: 'Quantique / fondamental', sens: 'Découle des principes quantiques et des lois de conservation (structure électronique, conservation de la matière et de la charge). Nécessaire : ne pourrait pas être autrement.' },
  experimental: { color: BLEU, emoji: '🔵', label: 'Établi par l’expérience', sens: 'Mesuré de façon reproductible (enthalpies, constantes d’équilibre, périodicité). Fait expérimental robuste reposant sur la mesure.' },
  empirique: { color: AMBRE, emoji: '🟡', label: 'Règle empirique', sens: 'Modèle ou règle prédictive mais approchée (règle de l’octet, VSEPR, électronégativité, pKa tabulés). Utile, pas exacte.' },
  qualitatif: { color: ROUGE, emoji: '🔴', label: 'Qualitatif / contextuel', sens: 'Tendance qualitative dépendant fortement du contexte (réactivité « générale », effets de solvant). Non universel.' },
} as const;

/**
 * Réseaux : l'axe va de la NÉCESSITÉ THÉORIQUE à la CONFIGURATION LOCALE. Du théorème
 * (Shannon, Nyquist) et de la physique du signal, à la norme/RFC adoptée mondialement,
 * puis à l'heuristique d'ingénierie révisable, jusqu'à ce qui dépend du déploiement.
 * Distinguer la limite physique de la convention et du réglage est ici le cœur de l'honnêteté.
 */
export const PRESET_RESEAUX = {
  theoreme: { color: VERT, emoji: '🟢', label: 'Théorème / limite physique', sens: 'Imposé par un théorème (Shannon, Nyquist) ou par la physique du signal. Nécessaire : borne infranchissable.' },
  norme: { color: BLEU, emoji: '🔵', label: 'Norme / standard', sens: 'Fixé par une norme ou un RFC adopté mondialement (IP, TCP, Ethernet, DNS). Vrai par convention — cohérent et universel, mais aurait pu être autre.' },
  heuristique: { color: AMBRE, emoji: '🟡', label: 'Heuristique d’ingénierie', sens: 'Choix d’algorithme révisable (contrôle de congestion, valeurs de délai, taille de MTU). Raisonnable, non unique.' },
  deploiement: { color: ROUGE, emoji: '🔴', label: 'Dépend du déploiement', sens: 'Varie selon l’implémentation, l’opérateur ou la configuration (NAT, politiques, valeurs réelles d’un réseau). Non universel.' },
} as const;

/**
 * Histoire : l'axe est le DEGRÉ D'ATTESTATION PAR LES SOURCES. Du fait attesté par des
 * sources directes concordantes (et l'archéologie) à la question débattue entre historiens,
 * en passant par la reconstruction probable à large consensus et la reconstitution à partir
 * d'indices lacunaires. On ne « démontre » pas l'histoire : on l'établit sur des traces.
 */
export const PRESET_HISTOIRE = {
  atteste: { color: VERT, emoji: '🟢', label: 'Attesté', sens: 'Établi par des sources directes concordantes (documents, archéologie, datations). Fait historique solidement établi.' },
  probable: { color: BLEU, emoji: '🔵', label: 'Probable', sens: 'Reconstruction très probable faisant large consensus, appuyée sur des preuves convergentes mais indirectes.' },
  reconstitue: { color: AMBRE, emoji: '🟡', label: 'Reconstitué', sens: 'Reconstitué à partir d’indices lacunaires ; interprétation plausible mais incertaine, susceptible de révision.' },
  debattu: { color: ROUGE, emoji: '🔴', label: 'Débattu', sens: 'Controversé entre historiens, ou reposant sur des sources fragiles ou tardives. Pas de réponse tranchée.' },
} as const;

/**
 * Intelligence artificielle : l'axe va du THÉORÈME PROUVÉ à la BOÎTE NOIRE EMPIRIQUE.
 * Du résultat démontré (gradient, rétropropagation, approximation universelle) à la
 * question ouverte (pourquoi un réseau généralise), en passant par la régularité
 * empirique très robuste et la recette d'ingénierie qui marche sans garantie. L'apprentissage
 * profond est largement empirique : distinguer le prouvé du « ça marche » est le cœur de l'honnêteté.
 */
export const PRESET_IA = {
  prouve: { color: VERT, emoji: '🟢', label: 'Démontré', sens: 'Résultat mathématique prouvé (calcul du gradient, rétropropagation = règle de chaîne, optimisation convexe, théorème d’approximation universelle). Nécessaire.' },
  robuste: { color: BLEU, emoji: '🔵', label: 'Empiriquement robuste', sens: 'Régularité expérimentale très reproductible mais sans preuve générale (efficacité de la descente de gradient stochastique, des architectures, lois d’échelle). Fiable en pratique.' },
  recette: { color: AMBRE, emoji: '🟡', label: 'Recette / heuristique', sens: 'Choix d’ingénierie qui marche sans garantie (taux d’apprentissage, normalisation, dropout, initialisation). Réglage, pas théorème.' },
  boitenoire: { color: ROUGE, emoji: '🔴', label: 'Boîte noire / ouvert', sens: 'Mal compris ou non expliqué théoriquement (pourquoi tel modèle généralise, interprétabilité). Question ouverte.' },
} as const;

/** Map FUSIONNÉE (clés disjointes) : sert au composant <Badge> pour tous les cours. */
export const FIABILITE = {
  ...PRESET_EMPIRIQUE,
  ...PRESET_MATHS,
  ...PRESET_INGENIERIE,
  ...PRESET_COSMO,
  ...PRESET_CHIMIE,
  ...PRESET_RESEAUX,
  ...PRESET_HISTOIRE,
  ...PRESET_IA,
};
export type NiveauFiabilite = keyof typeof FIABILITE;

/** Échelle (4 niveaux) PAR COURS — pour la légende et la page Méthodologie. */
const PAR_COURS: Record<string, Record<string, NiveauDef>> = {
  physique: PRESET_EMPIRIQUE,
  maths: PRESET_MATHS,
  processeurs: PRESET_INGENIERIE,
  cosmologie: PRESET_COSMO,
  chimie: PRESET_CHIMIE,
  reseaux: PRESET_RESEAUX,
  histoire: PRESET_HISTOIRE,
  ia: PRESET_IA,
};

export function niveauxFor(courseId: string | null): Array<{ cle: string } & NiveauDef> {
  const preset = (courseId && PAR_COURS[courseId]) || PRESET_EMPIRIQUE;
  return Object.entries(preset).map(([cle, v]) => ({ cle, ...(v as NiveauDef) }));
}
