/**
 * Repères chronologiques et notations du cours « L'histoire humaine ».
 * Même forme que processeurs/symbols.ts : `katex` contient le code KaTeX (sans
 * les $). Ici les « symboles » sont les grandes notations et repères de durée
 * employés dans le cours, avec leur statut d'attestation.
 */
export interface Symbole {
  katex: string;
  nom: string;
  desc: string;
  unite?: string;
  /** valeur de référence, avec statut (attesté / probable / reconstitué) */
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  // Notations du temps
  { katex: '\\text{AP}', nom: 'Avant le présent (AP / BP)', desc: 'Convention de datation comptée à rebours depuis 1950, employée pour la préhistoire et les datations physiques.', unite: 'an', valeur: '« présent » = 1950 (convention)', voir: '/histoire/partie-i/profondeur-du-temps' },
  { katex: '\\text{av. J.-C.}', nom: 'Avant Jésus-Christ', desc: 'Repère conventionnel de l’ère commune. Les dates av. J.-C. se comptent à rebours.', unite: 'an', valeur: 'an 1 = naissance conventionnelle du Christ', voir: '/histoire/methodologie' },
  { katex: 't_{1/2}', nom: 'Demi-vie du carbone 14', desc: 'Durée au bout de laquelle la moitié du carbone 14 d’un échantillon s’est désintégrée. Base de la datation radiocarbone.', unite: 'an', valeur: '≈ 5 730 ans (mesuré)', voir: '/histoire/partie-i/profondeur-du-temps' },
  { katex: 't_{\\max}^{C14}', nom: 'Limite du carbone 14', desc: 'Âge au-delà duquel il reste trop peu de carbone 14 pour mesurer : la méthode atteint sa limite.', unite: 'an', valeur: '≈ 50 000 ans (limite pratique)', voir: '/histoire/partie-i/profondeur-du-temps' },

  // Grands repères de durée (la profondeur du temps)
  { katex: '\\sim 7\\,\\text{Ma}', nom: 'Premiers homininés', desc: 'Apparition estimée des premiers homininés bipèdes, après la séparation d’avec la lignée des chimpanzés.', unite: 'année', valeur: '≈ −7 millions d’années (probable)', voir: '/histoire/partie-i/premiers-hominines' },
  { katex: '\\sim 3{,}3\\,\\text{Ma}', nom: 'Premiers outils de pierre', desc: 'Plus anciens outils taillés attestés, marquant le début du Paléolithique.', unite: 'année', valeur: '≈ −3,3 millions d’années (attesté)', voir: '/histoire/partie-i/genre-homo-outils-feu' },
  { katex: '\\sim 300\\,\\text{ka}', nom: 'Apparition d’Homo sapiens', desc: 'Plus anciens fossiles connus de notre espèce, en Afrique.', unite: 'année', valeur: '≈ −300 000 ans (attesté)', voir: '/histoire/partie-i/sapiens-sortie-afrique' },
  { katex: '\\sim 10\\,\\text{ka}', nom: 'Débuts du Néolithique', desc: 'Premières domestications au Proche-Orient après la fin de la dernière glaciation.', unite: 'année', valeur: '≈ −10 000 ans (attesté)', voir: '/histoire/partie-ii/fin-glaciaire-domestication' },
  { katex: '\\sim 5{,}3\\,\\text{ka}', nom: 'Invention de l’écriture', desc: 'Premières écritures (cunéiforme, hiéroglyphes) : début de l’histoire « écrite ».', unite: 'année', valeur: '≈ −3300 (attesté)', voir: '/histoire/partie-iii/invention-ecriture' },

  // Proportions et échelles
  { katex: '\\dfrac{t_{\\text{écrit}}}{t_{\\text{humain}}}', nom: 'Part de l’histoire écrite', desc: 'Rapport entre la durée de l’histoire écrite (≈ 5 000 ans) et celle du genre Homo (≈ 3 Ma) : moins de 0,2 %.', unite: '—', valeur: '< 0,2 % (ordre de grandeur)', voir: '/histoire/partie-i/profondeur-du-temps' },
  { katex: '\\text{ka},\\ \\text{Ma}', nom: 'Millier / million d’années', desc: 'Unités de durée employées pour la préhistoire : ka = millier d’années, Ma = million d’années.', unite: 'an', voir: '/histoire/partie-i/profondeur-du-temps' },

  // Jalons historiques
  { katex: '476', nom: 'Fin de Rome en Occident', desc: 'Date-repère (déposition du dernier empereur d’Occident) — un jalon symbolique d’une mutation, plus qu’une rupture nette.', unite: 'apr. J.-C.', valeur: '476 (repère conventionnel, débattu)', voir: '/histoire/partie-iv/fin-rome-recompositions' },
  { katex: '\\sim 1450', nom: 'Imprimerie de Gutenberg', desc: 'Mise au point des caractères mobiles métalliques en Europe : révolution de la diffusion du savoir.', unite: 'apr. J.-C.', valeur: '≈ 1450 (attesté)', voir: '/histoire/partie-vi/imprimerie-revolution-information' },
  { katex: '1492', nom: 'Premier voyage transatlantique', desc: 'Traversée de Christophe Colomb : début de la mise en contact durable des continents.', unite: 'apr. J.-C.', valeur: '1492 (attesté)', voir: '/histoire/partie-vi/grandes-decouvertes-premier-monde-global' },
];
