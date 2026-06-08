/**
 * Navigation — SOURCE UNIQUE de l'ordre du site.
 *
 * Sidebar, fil d'Ariane, boutons précédent/suivant, liens « prérequis » et
 * page d'accueil dérivent TOUS de cette structure. Pour ajouter/réordonner une
 * page, on modifie uniquement ce fichier (et on crée le .mdx correspondant au
 * chemin indiqué dans `path`).
 */

export interface Chapitre {
  /** identifiant court, unique dans tout le site (sert d'ancre/clé) */
  slug: string;
  /** route absolue — DOIT correspondre à l'emplacement du fichier dans src/pages */
  path: string;
  /** numéro de section du cahier des charges (0 pour les pages hors numérotation) */
  num: number;
  /** titre complet (h1) */
  titre: string;
  /** titre court pour la barre latérale (défaut : titre) */
  court?: string;
  /** phrase d'accroche (cartes d'accueil, recherche) */
  accroche?: string;
}

export interface Partie {
  id: string;
  /** chiffre romain affiché (« 0 », « I », … ou « ★ » pour les annexes) */
  roman: string;
  titre: string;
  accroche: string;
  chapitres: Chapitre[];
}

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce site, et ce que signifient les encarts et les badges de fiabilité.',
    chapitres: [
      {
        slug: 'comment-lire',
        path: '/comment-lire',
        num: 0,
        titre: 'Comment lire ce site',
        court: 'Comment lire ce site',
        accroche: 'Le système d’encarts dépliables, l’indicateur de fiabilité, le niveau requis.',
      },
      {
        slug: 'methodologie',
        path: '/methodologie',
        num: 0,
        titre: 'Méthodologie : les niveaux de fiabilité',
        court: 'Méthodologie',
        accroche: 'Ce que veut dire « établi », « modélisé », « plausible », « ouvert ».',
      },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'La relativité restreinte — fondations',
    accroche: 'Deux postulats, et tout en découle : simultanéité, temps, longueurs, espace-temps.',
    chapitres: [
      {
        slug: 'postulats',
        path: '/partie-i/postulats',
        num: 1,
        titre: 'Les deux postulats d’Einstein',
        court: 'Les deux postulats',
        accroche: 'Énoncés, motivés par Michelson-Morley, discutés. Le point de départ de tout.',
      },
      {
        slug: 'consequences',
        path: '/partie-i/consequences',
        num: 2,
        titre: 'Conséquences directes : simultanéité, dilatation du temps, contraction des longueurs',
        court: 'Dilatation du temps',
        accroche: 'L’horloge à lumière : chaque effet démontré à partir des seuls postulats.',
      },
      {
        slug: 'lorentz-gamma',
        path: '/partie-i/lorentz-gamma',
        num: 3,
        titre: 'Le facteur de Lorentz γ',
        court: 'Le facteur γ',
        accroche: 'Dérivation complète du facteur qui mesure tous les effets relativistes.',
      },
      {
        slug: 'transformations-lorentz',
        path: '/partie-i/transformations-lorentz',
        num: 4,
        titre: 'Les transformations de Lorentz et la composition des vitesses',
        court: 'Transformations de Lorentz',
        accroche: 'Le dictionnaire entre référentiels, puis pourquoi on ne dépasse jamais c.',
      },
      {
        slug: 'minkowski',
        path: '/partie-i/minkowski',
        num: 5,
        titre: 'L’espace-temps de Minkowski',
        court: 'Espace-temps de Minkowski',
        accroche: 'Intervalle invariant, cônes de lumière : la géométrie de l’espace-temps.',
      },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Énergie, masse, quantité de mouvement',
    accroche: 'De p = γmv à E² = (mc²)² + (pc)², et ce que « masse » veut vraiment dire.',
    chapitres: [
      {
        slug: 'quantite-mouvement',
        path: '/partie-ii/quantite-mouvement',
        num: 6,
        titre: 'La quantité de mouvement relativiste p = γmv',
        court: 'Quantité de mouvement',
        accroche: 'Pourquoi p = mv ne suffit plus, et comment le corriger.',
      },
      {
        slug: 'energie',
        path: '/partie-ii/energie',
        num: 7,
        titre: 'L’énergie relativiste E = γmc² et l’énergie de repos',
        court: 'Énergie relativiste',
        accroche: 'D’où vient E = mc², l’énergie qu’une masse possède même immobile.',
      },
      {
        slug: 'e-mc2',
        path: '/partie-ii/e-mc2',
        num: 8,
        titre: 'La relation fondamentale E² = (mc²)² + (pc)²',
        court: 'E² = (mc²)² + (pc)²',
        accroche: 'Dérivation complète : comment γ et m s’éliminent pour donner la relation reine.',
      },
      {
        slug: 'particules-sans-masse',
        path: '/partie-ii/particules-sans-masse',
        num: 9,
        titre: 'Les particules sans masse',
        court: 'Particules sans masse',
        accroche: 'Masse nulle ⇒ v = c forcément et p = E/c : de l’énergie sans masse.',
      },
      {
        slug: 'masse-energie-confinee',
        path: '/partie-ii/masse-energie-confinee',
        num: 10,
        titre: 'La masse comme énergie confinée',
        court: 'Masse = énergie confinée',
        accroche: 'Pourquoi ~99 % de la masse du proton est de l’énergie, pas du Higgs.',
      },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'Le saut quantique',
    accroche: 'Le minimum de quantique pour comprendre les particules : ondes, incertitude, champs.',
    chapitres: [
      {
        slug: 'echec-classique',
        path: '/partie-iii/echec-classique',
        num: 11,
        titre: 'Pourquoi la physique classique échoue',
        court: 'L’échec classique',
        accroche: 'Corps noir et effet photoélectrique : là où la physique de 1900 craque.',
      },
      {
        slug: 'dualite-de-broglie',
        path: '/partie-iii/dualite-de-broglie',
        num: 12,
        titre: 'Dualité onde-corpuscule et relation de de Broglie',
        court: 'Dualité & de Broglie',
        accroche: 'Toute particule est aussi une onde : p = h/λ.',
      },
      {
        slug: 'heisenberg',
        path: '/partie-iii/heisenberg',
        num: 13,
        titre: 'Le principe d’incertitude de Heisenberg',
        court: 'Incertitude de Heisenberg',
        accroche: 'Confiner dans un petit espace coûte de l’énergie : la clé des masses.',
      },
      {
        slug: 'champs-quantiques',
        path: '/partie-iii/champs-quantiques',
        num: 14,
        titre: 'La notion de champ quantique',
        court: 'Champs quantiques',
        accroche: 'Une particule est une « excitation » d’un champ qui remplit tout l’espace.',
      },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Le Modèle Standard : les particules',
    accroche: 'Le tableau du Modèle Standard, case par case : fermions, bosons, et le Higgs.',
    chapitres: [
      {
        slug: 'vue-ensemble',
        path: '/partie-iv/vue-ensemble',
        num: 15,
        titre: 'Vue d’ensemble : le tableau du Modèle Standard',
        court: 'Vue d’ensemble',
        accroche: 'La carte de toutes les particules connues, expliquée case par case.',
      },
      {
        slug: 'fermions',
        path: '/partie-iv/fermions',
        num: 16,
        titre: 'Les fermions : quarks et leptons',
        court: 'Quarks & leptons',
        accroche: '6 quarks, 6 leptons, 3 générations : la matière dont tout est fait.',
      },
      {
        slug: 'chiralite',
        path: '/partie-iv/chiralite',
        num: 17,
        titre: 'La chiralité (gaucher / droitier)',
        court: 'Chiralité',
        accroche: 'Une propriété subtile, mais centrale pour la masse et la force faible.',
      },
      {
        slug: 'bosons-jauge',
        path: '/partie-iv/bosons-jauge',
        num: 18,
        titre: 'Les bosons de jauge (messagers des forces)',
        court: 'Bosons de jauge',
        accroche: 'Photon, gluons, W et Z : qui transmet quelle force.',
      },
      {
        slug: 'higgs',
        path: '/partie-iv/higgs',
        num: 19,
        titre: 'Le boson et le champ de Higgs',
        court: 'Higgs',
        accroche: 'Comment le champ de Higgs donne leur masse aux particules élémentaires — et à elles seules.',
      },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'Les quatre interactions fondamentales',
    accroche: 'Électromagnétisme, force forte, force faible, gravitation : portées, messagers, symétries.',
    chapitres: [
      {
        slug: 'electromagnetisme',
        path: '/partie-v/electromagnetisme',
        num: 20,
        titre: 'L’électromagnétisme',
        court: 'Électromagnétisme',
        accroche: 'Portée infinie, photon, et la symétrie de jauge qui protège sa masse nulle.',
      },
      {
        slug: 'interaction-forte',
        path: '/partie-v/interaction-forte',
        num: 21,
        titre: 'L’interaction forte et la force nucléaire résiduelle',
        court: 'Interaction forte',
        accroche: 'Gluons et confinement entre quarks ; pions entre nucléons (force résiduelle).',
      },
      {
        slug: 'interaction-faible',
        path: '/partie-v/interaction-faible',
        num: 22,
        titre: 'L’interaction faible',
        court: 'Interaction faible',
        accroche: 'Changement de saveur, désintégration β, et des messagers massifs W/Z.',
      },
      {
        slug: 'electrofaible',
        path: '/partie-v/electrofaible',
        num: 23,
        titre: 'L’unification électrofaible',
        court: 'Unification électrofaible',
        accroche: 'Comment électromagnétisme et force faible ne font qu’un à haute énergie.',
      },
      {
        slug: 'gravitation',
        path: '/partie-v/gravitation',
        num: 24,
        titre: 'La gravitation',
        court: 'Gravitation',
        accroche: 'Ce que le Modèle Standard dit — et surtout ne dit pas. Le graviton hypothétique.',
      },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Bilan : les problèmes ouverts',
    accroche: 'Ce qu’on ne sait pas encore — la carte honnête des frontières de la physique.',
    chapitres: [
      {
        slug: 'saveurs',
        path: '/partie-vi/saveurs',
        num: 25,
        titre: 'Le problème des saveurs et la hiérarchie des masses',
        court: 'Problème des saveurs',
        accroche: 'Pourquoi ces valeurs de couplage, ces masses ? Personne ne sait.',
      },
      {
        slug: 'masse-neutrinos',
        path: '/partie-vi/masse-neutrinos',
        num: 26,
        titre: 'La masse des neutrinos',
        court: 'Masse des neutrinos',
        accroche: 'Dirac ou seesaw ? Le neutrino est-il sa propre antiparticule ?',
      },
      {
        slug: 'gravite-quantique',
        path: '/partie-vi/gravite-quantique',
        num: 27,
        titre: 'La gravité quantique',
        court: 'Gravité quantique',
        accroche: 'L’absence de théorie unifiant relativité générale et mécanique quantique.',
      },
      {
        slug: 'matiere-noire',
        path: '/partie-vi/matiere-noire',
        num: 28,
        titre: 'Matière noire et énergie noire',
        court: 'Matière & énergie noires',
        accroche: '95 % de l’Univers nous échappe : deux énigmes distinctes.',
      },
      {
        slug: 'asymetrie',
        path: '/partie-vi/asymetrie',
        num: 29,
        titre: 'L’asymétrie matière / antimatière',
        court: 'Asymétrie matière/antimatière',
        accroche: 'Pourquoi reste-t-il de la matière, et pas seulement du rayonnement ?',
      },
      {
        slug: 'hierarchie',
        path: '/partie-vi/hierarchie',
        num: 30,
        titre: 'Le problème de la hiérarchie',
        court: 'Problème de la hiérarchie',
        accroche: 'Pourquoi la gravité est-elle si faible, et la masse du Higgs si « légère » ?',
      },
      {
        slug: 'synthese',
        path: '/partie-vi/synthese',
        num: 31,
        titre: 'Synthèse : ce qu’on sait vs ce qu’on ignore',
        court: 'Synthèse finale',
        accroche: 'La carte complète, colorée par l’indicateur de fiabilité.',
      },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des symboles mathématiques.',
    chapitres: [
      {
        slug: 'glossaire',
        path: '/glossaire',
        num: 0,
        titre: 'Glossaire',
        court: 'Glossaire',
        accroche: 'Tous les termes techniques, définis et reliés à leur page.',
      },
      {
        slug: 'symboles',
        path: '/symboles',
        num: 0,
        titre: 'Index des symboles',
        court: 'Index des symboles',
        accroche: 'γ, p, E, c, λ, ħ… chaque symbole et sa signification.',
      },
    ],
  },
];

/** Liste à plat, dans l'ordre de lecture, de tous les chapitres. */
export const CHAPITRES_PLAT: { partie: Partie; chap: Chapitre }[] = PARTIES.flatMap((partie) =>
  partie.chapitres.map((chap) => ({ partie, chap })),
);

/** Retrouve un chapitre + sa partie à partir de son slug. */
export function chapitreParSlug(slug: string) {
  return CHAPITRES_PLAT.find((e) => e.chap.slug === slug);
}

/** Retrouve un chapitre + sa partie à partir de sa route. */
export function chapitreParPath(path: string) {
  const clean = path.replace(/\/$/, '');
  return CHAPITRES_PLAT.find((e) => e.chap.path.replace(/\/$/, '') === clean);
}

/** Précédent / suivant dans l'ordre de lecture global. */
export function precedentSuivant(slug: string) {
  const i = CHAPITRES_PLAT.findIndex((e) => e.chap.slug === slug);
  return {
    precedent: i > 0 ? CHAPITRES_PLAT[i - 1] : null,
    suivant: i >= 0 && i < CHAPITRES_PLAT.length - 1 ? CHAPITRES_PLAT[i + 1] : null,
  };
}
