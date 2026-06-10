/**
 * Glossaire — termes du cours « Les mathématiques depuis les axiomes ».
 */
export interface TermeGlossaire {
  terme: string;
  def: string;
  voir?: string;
  alias?: string[];
}

export const GLOSSAIRE: TermeGlossaire[] = [
  { terme: 'Axiome', def: 'Énoncé admis sans démonstration, posé explicitement, qui sert de point de départ. On ne le prouve pas : on le choisit.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Définition', def: 'Convention qui nomme un objet ou une propriété à partir de termes déjà connus. Ne se démontre pas, mais ne doit pas être contradictoire.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Théorème', def: 'Énoncé démontré à partir des axiomes et de résultats déjà établis, par des règles de logique.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Démonstration (preuve)', def: 'Suite finie d’étapes logiques menant des hypothèses à la conclusion, chaque étape étant justifiée.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Cohérence (consistance)', def: 'Propriété d’un système d’axiomes qui ne permet pas de démontrer une contradiction. Par les théorèmes de Gödel, un système assez riche ne peut prouver sa propre cohérence.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Théorèmes d’incomplétude (Gödel)', def: 'Résultats (1931) : tout système d’axiomes cohérent, récursivement axiomatisable et assez riche pour l’arithmétique contient des énoncés vrais qu’il ne peut démontrer, et ne peut prouver sa propre cohérence.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Ensemble', def: 'Objet primitif de la théorie : une collection d’objets (eux-mêmes des ensembles). Non défini, régi par les axiomes de ZF.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Ensemble vide (∅)', def: 'L’unique ensemble sans aucun élément. Son existence est garantie par les axiomes ; c’est la brique de base de toute la construction.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Axiomes ZF (Zermelo-Fraenkel)', def: 'Le système d’axiomes standard de la théorie des ensembles : extensionnalité, paire, réunion, parties, séparation, infini, remplacement, fondation.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Axiome de l’infini', def: 'Axiome de ZF affirmant l’existence d’un ensemble inductif (contenant ∅ et stable par successeur). Sans lui, on ne pourrait pas former ℕ.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Ensemble inductif', def: 'Ensemble contenant 0 = ∅ et le successeur de chacun de ses éléments. ℕ est le plus petit d’entre eux.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Successeur', def: 'Opération S(n) = n ∪ {n} : on ajoute à n l’élément « n » lui-même. Engendre les entiers à partir de 0.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Ordinal de von Neumann', def: 'Représentation d’un entier comme l’ensemble de tous ses prédécesseurs : 0 = ∅, n = {0,…,n−1}. Ainsi n possède exactement n éléments.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Récurrence', def: 'Principe de démonstration : si P(0) et P(n) ⇒ P(n+1), alors P(n) pour tout n. Ici ce n’est pas un axiome mais un théorème déduit de la minimalité de ℕ.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Axiomes de Peano', def: 'Caractérisation de ℕ : 0 n’est successeur d’aucun entier, S est injective, et la récurrence vaut. La construction de von Neumann les satisfait.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Nombre rationnel (ℚ)', def: 'Quotient de deux entiers (classe d’équivalence de fractions). Dense, mais « troué » : certaines suites de Cauchy n’y convergent pas.', voir: '/maths/partie-ii/reels-dedekind' },
  { terme: 'Coupure de Dedekind', def: 'Partage de ℚ en deux ensembles (A en dessous, son complémentaire au-dessus), où A n’a pas de plus grand élément. Chaque coupure EST un nombre réel.', voir: '/maths/partie-ii/reels-dedekind' },
  { terme: 'Nombre réel (ℝ)', def: 'Défini comme une coupure de Dedekind de ℚ. Comble les trous de ℚ (ex. √2) ; ℝ est complet (toute partie non vide et majorée a une borne supérieure).', voir: '/maths/partie-ii/reels-dedekind' },
];
