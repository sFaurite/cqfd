/**
 * Navigation — SOURCE UNIQUE de l'ordre du site.
 * Sidebar, fil d'Ariane, précédent/suivant et liens « prérequis » en dérivent.
 */

export interface Chapitre {
  slug: string;
  path: string;
  num: number;
  titre: string;
  court?: string;
  accroche?: string;
}

export interface Partie {
  id: string;
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
    accroche: 'Comment lire ce site, et ce que signifient les encarts et les badges.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce site', court: 'Comment lire ce site', accroche: 'Les encarts dépliables, l’indicateur de fiabilité, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « démontré », « admis », « conjecturé », « indécidable ».' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'La méthode axiomatique et les ensembles',
    accroche: 'Qu’est-ce qu’un axiome, démontrer, et le sol commun : la théorie des ensembles.',
    chapitres: [
      { slug: 'methode-axiomatique', path: '/partie-i/methode-axiomatique', num: 1, titre: 'La méthode axiomatique', court: 'La méthode axiomatique', accroche: 'Axiomes, définitions, théorèmes : ce qu’on admet et ce qu’on démontre. Et ses limites (Gödel).' },
      { slug: 'ensembles-zf', path: '/partie-i/ensembles-zf', num: 2, titre: 'Les axiomes des ensembles (ZF)', court: 'Les ensembles (ZF)', accroche: 'Le langage et les axiomes à partir desquels tout l’édifice se construit.' },
      { slug: 'relations-fonctions', path: '/partie-i/relations-fonctions', num: 3, titre: 'Relations, fonctions et quotients', court: 'Relations et fonctions', accroche: 'Couples, fonctions, bijections — et l’outil roi de toute la suite : le passage au quotient.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Construire les nombres',
    accroche: 'À partir du seul ensemble vide, fabriquer ℕ, ℤ, ℚ, ℝ puis ℂ — sans rien admettre de plus.',
    chapitres: [
      { slug: 'entiers-naturels', path: '/partie-ii/entiers-naturels', num: 4, titre: 'Les entiers naturels (ℕ)', court: 'Les entiers naturels', accroche: 'La construction de von Neumann : 0 = ∅, et la récurrence démontrée.' },
      { slug: 'arithmetique-de-n', path: '/partie-ii/arithmetique-de-n', num: 5, titre: 'L’arithmétique de ℕ : addition, multiplication, ordre', court: 'L’arithmétique de ℕ', accroche: 'Définir + et × sans les connaître déjà : le théorème de récursion, puis les lois démontrées.' },
      { slug: 'entiers-relatifs', path: '/partie-ii/entiers-relatifs', num: 6, titre: 'Les entiers relatifs (ℤ)', court: 'Les entiers relatifs', accroche: 'Soustraire sans jamais « compter en négatif » : ℤ construit comme quotient de ℕ × ℕ.' },
      { slug: 'rationnels', path: '/partie-ii/rationnels', num: 7, titre: 'Les nombres rationnels (ℚ)', court: 'Les rationnels', accroche: 'Les fractions comme classes d’équivalence : un corps ordonné, dense — et pourtant troué.' },
      { slug: 'reels-dedekind', path: '/partie-ii/reels-dedekind', num: 8, titre: 'Les nombres réels (coupures de Dedekind)', court: 'Les réels', accroche: 'Combler les « trous » de ℚ : une coupure définit un réel. √2 enfin construit.' },
      { slug: 'complexes', path: '/partie-ii/complexes', num: 9, titre: 'Les nombres complexes (ℂ)', court: 'Les complexes', accroche: 'i n’a rien de mystérieux : un couple de réels, une multiplication qui tourne — et aucun ordre possible.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'Compter l’infini',
    accroche: 'Deux ensembles infinis peuvent-ils avoir des tailles différentes ? Cantor répond — et ouvre un abîme.',
    chapitres: [
      { slug: 'equipotence', path: '/partie-iii/equipotence', num: 10, titre: 'Comparer les infinis : l’équipotence', court: 'L’équipotence', accroche: 'Même taille = une bijection. L’hôtel de Hilbert, et le théorème de Cantor–Schröder–Bernstein.' },
      { slug: 'denombrables', path: '/partie-iii/denombrables', num: 11, titre: 'Les ensembles dénombrables', court: 'Le dénombrable', accroche: 'ℤ et ℚ ne sont pas plus gros que ℕ : le zigzag qui énumère toutes les fractions.' },
      { slug: 'diagonale-cantor', path: '/partie-iii/diagonale-cantor', num: 12, titre: 'La diagonale de Cantor : ℝ est indénombrable', court: 'La diagonale de Cantor', accroche: 'L’argument le plus célèbre des mathématiques : aucune liste ne peut épuiser ℝ.' },
      { slug: 'hypothese-continu', path: '/partie-iii/hypothese-continu', num: 13, titre: 'L’hypothèse du continu', court: 'L’hypothèse du continu', accroche: 'Existe-t-il un infini entre ℕ et ℝ ? La question que ZFC ne peut pas trancher.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Les structures de l’algèbre',
    accroche: 'Les mêmes règles surgissent partout : on les axiomatise — groupes, anneaux, corps — et on démontre une fois pour toutes.',
    chapitres: [
      { slug: 'groupes', path: '/partie-iv/groupes', num: 14, titre: 'Les groupes : la symétrie axiomatisée', court: 'Les groupes', accroche: 'Quatre axiomes suffisent : symétries, additions, rotations — et le théorème de Lagrange.' },
      { slug: 'arithmetique', path: '/partie-iv/arithmetique', num: 15, titre: 'L’arithmétique de ℤ : division et nombres premiers', court: 'L’arithmétique de ℤ', accroche: 'Division euclidienne, Bézout, l’infinité des premiers d’Euclide et l’unicité de la factorisation.' },
      { slug: 'anneaux-corps', path: '/partie-iv/anneaux-corps', num: 16, titre: 'Anneaux, corps et arithmétique modulaire', court: 'Anneaux et corps', accroche: 'ℤ/nℤ : des mondes finis où l’on calcule — et ℤ/pℤ est un corps exactement quand p est premier.' },
      { slug: 'polynomes', path: '/partie-iv/polynomes', num: 17, titre: 'Les polynômes et leurs racines', court: 'Les polynômes', accroche: 'Division, racines, factorisation — jusqu’au théorème fondamental de l’algèbre.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'L’analyse : dompter l’infini',
    accroche: 'ε enfin apprivoisé : limites, continuité, dérivée, intégrale — tout le calcul fondé sur la borne supérieure.',
    chapitres: [
      { slug: 'suites-limites', path: '/partie-v/suites-limites', num: 18, titre: 'Suites et limites', court: 'Suites et limites', accroche: 'La définition en ε qui a fondé l’analyse, et la convergence monotone déduite de la borne sup.' },
      { slug: 'series', path: '/partie-v/series', num: 19, titre: 'Les séries : sommer l’infini', court: 'Les séries', accroche: 'Sommes géométriques, la divergence harmonique, le nombre e — et son irrationalité démontrée.' },
      { slug: 'continuite', path: '/partie-v/continuite', num: 20, titre: 'La continuité et les valeurs intermédiaires', court: 'La continuité', accroche: 'ε-δ, et le théorème des valeurs intermédiaires déduit de la complétude de ℝ.' },
      { slug: 'derivation', path: '/partie-v/derivation', num: 21, titre: 'La dérivée', court: 'La dérivée', accroche: 'Le taux d’accroissement passé à la limite : Rolle, accroissements finis, variations démontrées.' },
      { slug: 'integrale', path: '/partie-v/integrale', num: 22, titre: 'L’intégrale de Riemann', court: 'L’intégrale', accroche: 'L’aire sous une courbe définie rigoureusement — et le théorème fondamental qui relie aire et dérivée.' },
      { slug: 'exponentielle', path: '/partie-v/exponentielle', num: 23, titre: 'L’exponentielle, π et la formule d’Euler', court: 'exp, π et Euler', accroche: 'exp, cos, sin définis par séries, π construit rigoureusement — et e^iπ + 1 = 0 démontré.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Les limites de l’édifice',
    accroche: 'Gödel, le choix, le continu, les grandes conjectures : ce que l’édifice ne peut pas atteindre — dit avec précision.',
    chapitres: [
      { slug: 'godel', path: '/partie-vi/godel', num: 24, titre: 'Les théorèmes d’incomplétude de Gödel', court: 'Gödel', accroche: 'Tout système assez riche contient des énoncés vrais indémontrables — l’idée de la preuve, et ce qu’elle ne dit pas.' },
      { slug: 'axiome-du-choix', path: '/partie-vi/axiome-du-choix', num: 25, titre: 'L’axiome du choix et ses monstres', court: 'L’axiome du choix', accroche: 'Zorn, le bon ordre, Banach–Tarski : ce que le neuvième axiome permet — et ce qu’il coûte.' },
      { slug: 'grandes-conjectures', path: '/partie-vi/grandes-conjectures', num: 26, titre: 'Le front ouvert : les grandes conjectures', court: 'Les grandes conjectures', accroche: 'Riemann, Goldbach, Collatz, P vs NP — et celles qui sont tombées : Fermat, Poincaré.' },
      { slug: 'synthese', path: '/partie-vi/synthese', num: 27, titre: 'Synthèse : la carte de l’édifice', court: 'Synthèse', accroche: 'Ce qui est posé, ce qui est démontré, ce qui est indécidable — et ce qui reste ouvert.' },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des symboles.',
    chapitres: [
      { slug: 'glossaire', path: '/glossaire', num: 0, titre: 'Glossaire', court: 'Glossaire', accroche: 'Tous les termes techniques, reliés à leur page.' },
      { slug: 'symboles', path: '/symboles', num: 0, titre: 'Index des symboles', court: 'Index des symboles', accroche: 'Chaque symbole et sa signification.' },
    ],
  },
];

export const CHAPITRES_PLAT: { partie: Partie; chap: Chapitre }[] = PARTIES.flatMap((partie) =>
  partie.chapitres.map((chap) => ({ partie, chap })),
);
export function chapitreParSlug(slug: string) {
  return CHAPITRES_PLAT.find((e) => e.chap.slug === slug);
}
export function chapitreParPath(path: string) {
  const clean = path.replace(/\/$/, '');
  return CHAPITRES_PLAT.find((e) => e.chap.path.replace(/\/$/, '') === clean);
}
export function precedentSuivant(slug: string) {
  const i = CHAPITRES_PLAT.findIndex((e) => e.chap.slug === slug);
  return {
    precedent: i > 0 ? CHAPITRES_PLAT[i - 1] : null,
    suivant: i >= 0 && i < CHAPITRES_PLAT.length - 1 ? CHAPITRES_PLAT[i + 1] : null,
  };
}
