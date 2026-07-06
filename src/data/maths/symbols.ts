/**
 * Index des symboles du cours « Les mathématiques depuis les axiomes ».
 */
export interface Symbole {
  katex: string;
  nom: string;
  desc: string;
  unite?: string;
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  // — Logique et ensembles
  { katex: '\\varnothing', nom: 'Ensemble vide', desc: 'L’unique ensemble sans élément. La brique de base : 0 := ∅.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\in', nom: 'Appartenance', desc: 'x ∈ A : « x est un élément de A ». Relation primitive de la théorie des ensembles.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\subseteq', nom: 'Inclusion', desc: 'A ⊆ B : tout élément de A est élément de B.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\cup,\\ \\cap', nom: 'Réunion, intersection', desc: 'A ∪ B (éléments de A ou de B) ; A ∩ B (éléments de A et de B).', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\mathcal{P}(E)', nom: 'Ensemble des parties', desc: 'L’ensemble de tous les sous-ensembles de E. Toujours strictement plus grand que E (Cantor).', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\{x : P(x)\\}', nom: 'Ensemble en compréhension', desc: 'L’ensemble des x vérifiant la propriété P (encadré par l’axiome de séparation).', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '(a, b)', nom: 'Couple ordonné', desc: 'Paire ordonnée, encodée par Kuratowski : (a, b) = {{a}, {a, b}}. Retient l’ordre, contrairement à {a, b}.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: 'A \\times B', nom: 'Produit cartésien', desc: 'Ensemble des couples (a, b) avec a ∈ A et b ∈ B.', voir: '/maths/partie-i/relations-fonctions' },
  { katex: '\\forall,\\ \\exists', nom: 'Quantificateurs', desc: '∀ « pour tout », ∃ « il existe ». Briques du langage logique des démonstrations.', voir: '/maths/partie-i/methode-axiomatique' },
  { katex: '\\Rightarrow,\\ \\iff', nom: 'Implication, équivalence', desc: 'P ⇒ Q : « si P alors Q ». P ⇔ Q : « P équivaut à Q ».', voir: '/maths/partie-i/methode-axiomatique' },

  // — Fonctions et relations
  { katex: 'f : A \\to B', nom: 'Fonction', desc: 'Associe à chaque a ∈ A un unique f(a) ∈ B. C’est un ensemble de couples.', voir: '/maths/partie-i/relations-fonctions' },
  { katex: 'g \\circ f', nom: 'Composition', desc: '(g ∘ f)(x) = g(f(x)) : appliquer f puis g.', voir: '/maths/partie-i/relations-fonctions' },
  { katex: 'f^{-1}', nom: 'Réciproque', desc: 'La fonction inverse d’une bijection : f⁻¹(f(x)) = x. À distinguer de l’image réciproque f⁻¹(B).', voir: '/maths/partie-i/relations-fonctions' },
  { katex: '[a]', nom: 'Classe d’équivalence', desc: 'L’ensemble des éléments équivalents à a (pour une relation ∼). Les classes forment une partition.', voir: '/maths/partie-i/relations-fonctions' },
  { katex: 'A/{\\sim}', nom: 'Ensemble quotient', desc: 'L’ensemble des classes d’équivalence. Le geste qui fabrique ℤ, ℚ, ℤ/nℤ.', voir: '/maths/partie-i/relations-fonctions' },

  // — Les nombres
  { katex: 'S(n)', nom: 'Successeur', desc: 'S(n) = n ∪ {n} : l’entier qui suit n.', voir: '/maths/partie-ii/entiers-naturels' },
  { katex: '\\mathbb{N}', nom: 'Entiers naturels', desc: 'Le plus petit ensemble inductif : {0, 1, 2, …}.', voir: '/maths/partie-ii/entiers-naturels' },
  { katex: '\\mathbb{Z}', nom: 'Entiers relatifs', desc: 'Quotient de ℕ × ℕ : le couple (a, b) code « a − b ». Rend la soustraction totale.', voir: '/maths/partie-ii/entiers-relatifs' },
  { katex: '\\mathbb{Q}', nom: 'Nombres rationnels', desc: 'Quotient de ℤ × ℤ* : le couple (a, b) code « a / b ». Corps ordonné, dense, incomplet.', voir: '/maths/partie-ii/rationnels' },
  { katex: '\\mathbb{R}', nom: 'Nombres réels', desc: 'Les coupures de Dedekind de ℚ. Complet : toute partie non vide et majorée a une borne supérieure.', voir: '/maths/partie-ii/reels-dedekind' },
  { katex: '\\sup,\\ \\inf', nom: 'Borne sup, borne inf', desc: 'Plus petit majorant / plus grand minorant. Leur existence dans ℝ EST la complétude.', voir: '/maths/partie-ii/reels-dedekind' },
  { katex: '\\mathbb{C}', nom: 'Nombres complexes', desc: 'Les couples de réels (a, b) = a + bi, avec i² = −1. Corps, mais sans ordre compatible.', voir: '/maths/partie-ii/complexes' },
  { katex: 'i', nom: 'Unité imaginaire', desc: 'Le couple (0, 1) ∈ ℂ. Vérifie i² = −1 — vérifié, pas décrété.', voir: '/maths/partie-ii/complexes' },
  { katex: '\\bar{z},\\ |z|', nom: 'Conjugué, module', desc: 'z = a + bi : z̄ = a − bi, |z| = √(a²+b²). On a z·z̄ = |z|² et |zw| = |z||w|.', voir: '/maths/partie-ii/complexes' },

  // — Cardinalité
  { katex: '|A| = |B|', nom: 'Équipotence', desc: 'Il existe une bijection entre A et B : ils ont « la même taille ».', voir: '/maths/partie-iii/equipotence' },
  { katex: '\\aleph_0', nom: 'Aleph-zéro', desc: 'La taille (cardinal) de ℕ : le plus petit infini. ℤ et ℚ l’ont aussi.', voir: '/maths/partie-iii/denombrables' },
  { katex: '2^{\\mathbb{N}}', nom: 'Suites binaires / parties de ℕ', desc: 'L’ensemble des suites de 0 et 1, équipotent à P(ℕ) et à ℝ. Non dénombrable (diagonale).', voir: '/maths/partie-iii/diagonale-cantor' },

  // — Algèbre
  { katex: 'e,\\ a^{-1}', nom: 'Neutre, inverse (groupe)', desc: 'e : élément neutre (e·a = a) ; a⁻¹ : inverse de a (a·a⁻¹ = e). Uniques dans un groupe.', voir: '/maths/partie-iv/groupes' },
  { katex: '\\mid', nom: 'Divise', desc: 'a | b : « a divise b », c’est-à-dire b = ak pour un entier k.', voir: '/maths/partie-iv/arithmetique' },
  { katex: '\\gcd(a,b)', nom: 'PGCD', desc: 'Plus grand commun diviseur. Vérifie l’identité de Bézout : au + bv = pgcd(a, b).', voir: '/maths/partie-iv/arithmetique' },
  { katex: 'a \\equiv b \\ (\\mathrm{mod}\\ n)', nom: 'Congruence', desc: '« a et b ont le même reste modulo n », c.-à-d. n | (a − b).', voir: '/maths/partie-iv/anneaux-corps' },
  { katex: '\\mathbb{Z}/n\\mathbb{Z}', nom: 'Entiers modulo n', desc: 'Anneau fini à n éléments (« l’horloge »). Corps si et seulement si n est premier.', voir: '/maths/partie-iv/anneaux-corps' },
  { katex: 'K[X]', nom: 'Polynômes', desc: 'Anneau des polynômes à coefficients dans K. Division euclidienne et racines comme dans ℤ.', voir: '/maths/partie-iv/polynomes' },

  // — Analyse
  { katex: 'u_n \\to \\ell', nom: 'Limite d’une suite', desc: '∀ε > 0, ∃N, ∀n ≥ N : |uₙ − ℓ| < ε. La définition fondatrice de l’analyse.', voir: '/maths/partie-v/suites-limites' },
  { katex: '\\sum_{n} u_n', nom: 'Série', desc: 'Limite des sommes partielles. Converge ssi (u₀ + … + uₙ) converge.', voir: '/maths/partie-v/series' },
  { katex: 'e', nom: 'Nombre d’Euler (base)', desc: 'e = Σ 1/n!. Irrationnelle, et même transcendante.', valeur: '≈ 2,718281828', voir: '/maths/partie-v/series' },
  { katex: "f'(a)", nom: 'Dérivée', desc: 'Limite du taux d’accroissement (f(x) − f(a))/(x − a) en a.', voir: '/maths/partie-v/derivation' },
  { katex: '\\int_a^b f', nom: 'Intégrale de Riemann', desc: 'Aire sous la courbe : valeur commune du sup des sommes inférieures et de l’inf des supérieures.', voir: '/maths/partie-v/integrale' },
  { katex: '\\exp,\\ \\ln', nom: 'Exponentielle, logarithme', desc: 'exp(z) = Σ zⁿ/n! ; ln est sa réciproque sur ]0, ∞[. Les puissances réelles (a > 0) : aˣ = exp(x ln a).', voir: '/maths/partie-v/exponentielle' },
  { katex: '\\pi', nom: 'Pi', desc: 'Défini comme le double du plus petit zéro positif de cos. Vérifie e^{iπ} + 1 = 0. Transcendant.', valeur: '≈ 3,14159265', voir: '/maths/partie-v/exponentielle' },

  // — Limites de l’édifice
  { katex: '\\mathrm{Con}(T)', nom: 'Cohérence de T', desc: 'L’énoncé « T ne démontre pas 0 = 1 ». Par Gödel, T ne peut pas le démontrer (s’il est cohérent).', voir: '/maths/partie-vi/godel' },
  { katex: '\\mathsf{ZFC}', nom: 'ZF + choix', desc: 'Les axiomes ZF augmentés de l’axiome du choix : le cadre de référence des mathématiques actuelles.', voir: '/maths/partie-vi/axiome-du-choix' },
  { katex: '\\zeta(s)', nom: 'Fonction zêta', desc: 'ζ(s) = Σ 1/nˢ (pour s > 1), prolongée analytiquement à ℂ. L’hypothèse de Riemann porte sur les zéros de ce prolongement.', voir: '/maths/partie-vi/grandes-conjectures' },
];
