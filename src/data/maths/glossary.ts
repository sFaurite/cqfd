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
  // — Partie I : méthode axiomatique et ensembles
  { terme: 'Axiome', def: 'Énoncé admis sans démonstration, posé explicitement, qui sert de point de départ. On ne le prouve pas : on le choisit.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Définition', def: 'Convention qui nomme un objet ou une propriété à partir de termes déjà connus. Ne se démontre pas, mais ne doit pas être contradictoire.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Théorème', def: 'Énoncé démontré à partir des axiomes et de résultats déjà établis, par des règles de logique.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Démonstration (preuve)', def: 'Suite finie d’étapes logiques menant des hypothèses à la conclusion, chaque étape étant justifiée.', voir: '/maths/partie-i/methode-axiomatique' },
  { terme: 'Cohérence (consistance)', def: 'Propriété d’un système d’axiomes qui ne permet pas de démontrer une contradiction. Par les théorèmes de Gödel, un système cohérent assez riche ne peut prouver sa propre cohérence.', voir: '/maths/partie-vi/godel' },
  { terme: 'Ensemble', def: 'Objet primitif de la théorie : une collection d’objets (eux-mêmes des ensembles). Non défini, régi par les axiomes de ZF.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Ensemble vide (∅)', def: 'L’unique ensemble sans aucun élément. Son existence est garantie par les axiomes ; c’est la brique de base de toute la construction.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Axiomes ZF (Zermelo-Fraenkel)', def: 'Le système d’axiomes standard de la théorie des ensembles : extensionnalité, paire, réunion, parties, séparation, infini, remplacement, fondation.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Paradoxe de Russell', def: 'L’ensemble des ensembles qui ne s’appartiennent pas mène à une contradiction. C’est lui qui force à restreindre la formation d’ensembles (axiome de séparation).', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Couple ordonné', def: 'Objet (a, b) qui retient l’ordre. Encodé dans ZF par l’astuce de Kuratowski : (a, b) = {{a}, {a, b}}.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Produit cartésien (A × B)', def: 'Ensemble de tous les couples (a, b) avec a ∈ A et b ∈ B. Construit par séparation dans un ensemble de parties.', voir: '/maths/partie-i/ensembles-zf' },
  { terme: 'Relation', def: 'Sous-ensemble d’un produit cartésien A × B : un ensemble de couples. Une relation n’est pas une formule, c’est un objet.', voir: '/maths/partie-i/relations-fonctions' },
  { terme: 'Fonction', def: 'Relation qui associe à chaque élément de départ exactement un élément d’arrivée. C’est un ensemble de couples — pas nécessairement une formule.', voir: '/maths/partie-i/relations-fonctions' },
  { terme: 'Injection, surjection, bijection', def: 'Une fonction est injective si elle sépare (des départs distincts ont des arrivées distinctes), surjective si elle atteint tout, bijective si les deux : elle admet alors une réciproque.', voir: '/maths/partie-i/relations-fonctions' },
  { terme: 'Relation d’équivalence', def: 'Relation réflexive, symétrique et transitive. Elle partage un ensemble en classes disjointes (théorème de partition).', voir: '/maths/partie-i/relations-fonctions' },
  { terme: 'Classe d’équivalence', def: 'Ensemble de tous les éléments équivalents à un élément donné. Deux classes sont égales ou disjointes.', voir: '/maths/partie-i/relations-fonctions' },
  { terme: 'Ensemble quotient (A/∼)', def: 'Ensemble des classes d’équivalence. Identifier ce qui est équivalent : le geste qui fabrique ℤ, ℚ et ℤ/nℤ.', voir: '/maths/partie-i/relations-fonctions' },
  { terme: 'Relation d’ordre', def: 'Relation réflexive, antisymétrique et transitive. Partielle en général (ex. ⊆), totale si deux éléments sont toujours comparables.', voir: '/maths/partie-i/relations-fonctions' },

  // — Partie II : construire les nombres
  { terme: 'Ensemble inductif', def: 'Ensemble contenant 0 = ∅ et le successeur de chacun de ses éléments. ℕ est le plus petit d’entre eux.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Successeur', def: 'Opération S(n) = n ∪ {n} : on ajoute à n l’élément « n » lui-même. Engendre les entiers à partir de 0.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Ordinal de von Neumann', def: 'Représentation d’un entier comme l’ensemble de tous ses prédécesseurs : 0 = ∅, n = {0,…,n−1}. Ainsi n possède exactement n éléments.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Récurrence', def: 'Principe de démonstration : si P(0) et si, pour tout n, P(n) ⇒ P(n+1), alors P(n) pour tout n. Ici ce n’est pas un axiome mais un théorème déduit de la minimalité de ℕ.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Axiomes de Peano', def: 'Caractérisation de ℕ : 0 n’est successeur d’aucun entier, S est injective, et la récurrence vaut. La construction de von Neumann les satisfait.', voir: '/maths/partie-ii/entiers-naturels' },
  { terme: 'Théorème de récursion', def: 'Théorème qui légitime la définition « par récurrence » : à partir d’une valeur initiale et d’une règle de passage, il existe une unique fonction sur ℕ. C’est lui qui autorise à définir +, ×, la factorielle…', voir: '/maths/partie-ii/arithmetique-de-n' },
  { terme: 'Bon ordre', def: 'Ordre pour lequel toute partie non vide possède un plus petit élément. ℕ est bien ordonné — propriété qui donne la division euclidienne et l’identité de Bézout.', voir: '/maths/partie-ii/arithmetique-de-n' },
  { terme: 'Entier relatif (ℤ)', def: 'Construit comme quotient de ℕ × ℕ : le couple (a, b) représente la soustraction « a − b » en attente. Rend la soustraction totale.', voir: '/maths/partie-ii/entiers-relatifs' },
  { terme: 'Intégrité', def: 'Propriété d’un anneau non nul où un produit nul force un facteur nul (ab = 0 ⇒ a = 0 ou b = 0). ℤ est intègre ; ℤ/6ℤ ne l’est pas.', voir: '/maths/partie-ii/entiers-relatifs' },
  { terme: 'Nombre rationnel (ℚ)', def: 'Construit comme quotient de ℤ × ℤ* : le couple (a, b) représente la division « a / b ». Corps ordonné, dense, mais « troué ».', voir: '/maths/partie-ii/rationnels' },
  { terme: 'Densité', def: 'Propriété de ℚ (et ℝ) : entre deux nombres distincts, il en existe toujours un troisième. La densité n’est pas la complétude — ℚ est dense mais troué.', voir: '/maths/partie-ii/rationnels' },
  { terme: 'Corps', def: 'Anneau commutatif où 1 ≠ 0 et où tout élément non nul possède un inverse. ℚ, ℝ, ℂ sont des corps ; ℤ n’en est pas un.', voir: '/maths/partie-ii/rationnels' },
  { terme: 'Propriété d’Archimède', def: 'Pour tous x, y > 0, un multiple entier de x finit par dépasser y. Démontrée dans ℚ (chapitre des rationnels), puis dans ℝ (chapitre 8, §6) ; sert à établir 1/n → 0.', voir: '/maths/partie-ii/reels-dedekind' },
  { terme: 'Coupure de Dedekind', def: 'Partage de ℚ en deux ensembles non vides (A en dessous, son complémentaire au-dessus), où A n’a pas de plus grand élément. Chaque coupure EST un nombre réel.', voir: '/maths/partie-ii/reels-dedekind' },
  { terme: 'Nombre réel (ℝ)', def: 'Défini comme une coupure de Dedekind de ℚ. Comble les trous de ℚ (ex. √2) ; ℝ est complet (toute partie non vide et majorée a une borne supérieure).', voir: '/maths/partie-ii/reels-dedekind' },
  { terme: 'Borne supérieure (complétude)', def: 'Plus petit des majorants. Toute partie non vide majorée de ℝ en possède une : c’est LA propriété qui distingue ℝ de ℚ, moteur de toute l’analyse.', voir: '/maths/partie-ii/reels-dedekind' },
  { terme: 'Nombre complexe (ℂ)', def: 'Défini comme un couple de réels (a, b), noté a + bi, avec la multiplication (a,b)(c,d) = (ac−bd, ad+bc). Alors i = (0,1) vérifie i² = −1. Corps sans ordre compatible avec les opérations.', voir: '/maths/partie-ii/complexes' },
  { terme: 'Module, conjugué', def: 'Pour z = a + bi : conjugué z̄ = a − bi ; norme quadratique N(z) = a² + b² ; module |z| = √N(z). On a z·z̄ = N(z) et N(zw) = N(z)N(w) — les formes en module (|z|² , |zw| = |z||w|) attendent la racine carrée, soldée en partie V.', voir: '/maths/partie-ii/complexes' },

  // — Partie III : compter l’infini
  { terme: 'Équipotence', def: 'Deux ensembles sont équipotents s’il existe une bijection entre eux — « même taille », même infinis. La comparaison des infinis repose sur cette seule idée.', voir: '/maths/partie-iii/equipotence' },
  { terme: 'Théorème de Cantor–Schröder–Bernstein', def: 'Si A s’injecte dans B et B dans A, alors A et B sont équipotents. Démontré sans l’axiome du choix.', voir: '/maths/partie-iii/equipotence' },
  { terme: 'Lemme des tiroirs', def: 'Aucune injection de n+1 objets dans n tiroirs. Sert à définir « fini » sans ambiguïté (l’entier associé est unique).', voir: '/maths/partie-iii/equipotence' },
  { terme: 'Dénombrable', def: 'Équipotent à ℕ : dont on peut énumérer les éléments en une liste sans répétition. ℤ et ℚ le sont ; ℝ non.', voir: '/maths/partie-iii/denombrables' },
  { terme: 'Argument diagonal (Cantor)', def: 'Toute liste de réels en oublie un : celui construit en changeant le n-ième chiffre du n-ième. Prouve que ℝ n’est pas dénombrable.', voir: '/maths/partie-iii/diagonale-cantor' },
  { terme: 'Théorème de Cantor', def: 'Pour tout ensemble E, il n’y a pas de surjection de E sur P(E) : |E| < |P(E)|. D’où une tour d’infinis sans sommet.', voir: '/maths/partie-iii/diagonale-cantor' },
  { terme: 'Nombre transcendant', def: 'Réel qui n’est racine d’aucun polynôme non nul à coefficients entiers. Les transcendants forment « presque tout » ℝ (Cantor) ; e et π en sont.', voir: '/maths/partie-iii/diagonale-cantor' },
  { terme: 'Hypothèse du continu (CH)', def: 'Y a-t-il un infini strictement entre |ℕ| et |ℝ| ? CH répond « non ». Démontrée indécidable dans ZFC, si ZFC est cohérente (Gödel 1938, Cohen 1963).', voir: '/maths/partie-iii/hypothese-continu' },
  { terme: 'Indécidable', def: 'Un énoncé est indécidable dans un système s’il n’y est ni démontrable ni réfutable. À ne pas confondre avec « conjecturé » (encore inconnu).', voir: '/maths/partie-iii/hypothese-continu' },

  // — Partie IV : structures de l’algèbre
  { terme: 'Groupe', def: 'Ensemble muni d’une opération associative, avec neutre et inverses. Axiomatise la symétrie ; abélien si l’opération commute.', voir: '/maths/partie-iv/groupes' },
  { terme: 'Théorème de Lagrange', def: 'Dans un groupe fini, l’ordre de tout sous-groupe divise l’ordre du groupe. Se démontre par les classes latérales (une partition).', voir: '/maths/partie-iv/groupes' },
  { terme: 'Division euclidienne', def: 'Pour a et b > 0, unique écriture a = bq + r avec 0 ≤ r < b. Existence par le bon ordre de ℕ.', voir: '/maths/partie-iv/arithmetique' },
  { terme: 'Identité de Bézout', def: 'Il existe des entiers u, v tels que au + bv = pgcd(a, b). Clé du lemme d’Euclide et de l’inversibilité modulo p.', voir: '/maths/partie-iv/arithmetique' },
  { terme: 'Nombre premier', def: 'Entier > 1 dont les seuls diviseurs positifs sont 1 et lui-même ; caractérisé par le lemme d’Euclide (p | ab ⇒ p | a ou p | b). Il en existe une infinité (Euclide).', voir: '/maths/partie-iv/arithmetique' },
  { terme: 'Théorème fondamental de l’arithmétique', def: 'Tout entier > 1 se factorise en produit de nombres premiers, de façon unique (à l’ordre près).', voir: '/maths/partie-iv/arithmetique' },
  { terme: 'Anneau', def: 'Ensemble muni d’une addition (groupe abélien) et d’une multiplication associative distributive. Dans ce cours : commutatif et unitaire. ℤ en est un.', voir: '/maths/partie-iv/anneaux-corps' },
  { terme: 'Arithmétique modulaire (ℤ/nℤ)', def: 'Quotient de ℤ par la congruence modulo n : un anneau fini à n éléments (« l’horloge »). C’est un corps si et seulement si n est premier.', voir: '/maths/partie-iv/anneaux-corps' },
  { terme: 'Petit théorème de Fermat', def: 'Si p est premier et ne divise pas a, alors a^(p−1) ≡ 1 (mod p). Démontré en trois lignes par le théorème de Lagrange.', voir: '/maths/partie-iv/anneaux-corps' },
  { terme: 'Polynôme', def: 'Suite presque nulle de coefficients — un objet, pas une fonction. Sur le corps ℤ/pℤ (p premier), le polynôme X^p − X est non nul mais sa fonction est nulle.', voir: '/maths/partie-iv/polynomes' },
  { terme: 'Théorème fondamental de l’algèbre', def: 'Tout polynôme non constant à coefficients complexes a une racine dans ℂ. La preuve utilise l’analyse.', voir: '/maths/partie-iv/polynomes' },

  // — Partie V : l’analyse
  { terme: 'Limite (d’une suite)', def: 'uₙ → ℓ si pour tout ε > 0, il existe un rang N au-delà duquel |uₙ − ℓ| < ε. La définition qui a fondé l’analyse rigoureuse.', voir: '/maths/partie-v/suites-limites' },
  { terme: 'Convergence monotone', def: 'Toute suite croissante majorée converge (vers sa borne supérieure). Faux dans ℚ : c’est la complétude de ℝ qui l’autorise.', voir: '/maths/partie-v/suites-limites' },
  { terme: 'Théorème de Bolzano–Weierstrass', def: 'Toute suite bornée de réels admet une sous-suite convergente. Démontré par dichotomie.', voir: '/maths/partie-v/suites-limites' },
  { terme: 'Série', def: 'Suite des sommes partielles u₀ + u₁ + … + uₙ. Converge si cette suite converge. uₙ → 0 est nécessaire mais pas suffisant (série harmonique).', voir: '/maths/partie-v/series' },
  { terme: 'Nombre e', def: 'Défini par la série e = Σ 1/n! ≈ 2,71828. Irrationnel (démontré par Euler ; preuve courte par la série due à Fourier) ; base de l’exponentielle.', voir: '/maths/partie-v/series' },
  { terme: 'Continuité', def: 'f est continue en a si f(x) tend vers f(a) quand x tend vers a (définition ε–δ). Une fonction continue n’est pas forcément « un dessin » (fonction de Dirichlet).', voir: '/maths/partie-v/continuite' },
  { terme: 'Théorème des valeurs intermédiaires', def: 'Une fonction continue qui change de signe sur [a, b] s’annule quelque part. Démontré par la borne supérieure ; faux sur ℚ.', voir: '/maths/partie-v/continuite' },
  { terme: 'Dérivée', def: 'Limite du taux d’accroissement (f(x) − f(a))/(x − a). Dérivable ⇒ continue, mais pas l’inverse (|x| en 0).', voir: '/maths/partie-v/derivation' },
  { terme: 'Théorème des accroissements finis', def: 'Il existe un point où la pente de la tangente égale la pente moyenne : f(b) − f(a) = f′(c)(b − a). D’où « f′ ≥ 0 ⇒ f croissante ».', voir: '/maths/partie-v/derivation' },
  { terme: 'Intégrale de Riemann', def: 'Aire sous une courbe définie comme la valeur commune du sup des sommes inférieures et de l’inf des sommes supérieures (sommes de Darboux).', voir: '/maths/partie-v/integrale' },
  { terme: 'Théorème fondamental de l’analyse', def: 'Dériver et intégrer sont réciproques : si f est continue et F(x) = ∫ₐˣ f, alors F′ = f. Relie tangentes et aires.', voir: '/maths/partie-v/integrale' },
  { terme: 'Exponentielle', def: 'Définie par la série exp(z) = Σ zⁿ/n! sur ℂ. Vérifie exp(a+b) = exp(a)exp(b) et est sa propre dérivée. Sa réciproque sur ]0,∞[ est le logarithme.', voir: '/maths/partie-v/exponentielle' },
  { terme: 'Formule d’Euler', def: 'e^{iθ} = cos θ + i sin θ, d’où e^{iπ} + 1 = 0 : cinq constantes réunies, démontrée terme à terme. π y est défini comme le double du plus petit zéro positif de cos.', voir: '/maths/partie-v/exponentielle' },

  // — Partie VI : les limites de l’édifice
  { terme: 'Théorèmes d’incomplétude (Gödel)', def: 'Résultats (1931) : tout système cohérent, récursivement axiomatisable et assez riche pour l’arithmétique contient des énoncés vrais indémontrables, et ne peut prouver sa propre cohérence.', voir: '/maths/partie-vi/godel' },
  { terme: 'Arithmétisation', def: 'Codage des formules et des démonstrations par des nombres (codes de Gödel), via la factorisation unique. Permet à l’arithmétique de parler d’elle-même.', voir: '/maths/partie-vi/godel' },
  { terme: 'Axiome du choix (AC)', def: 'Pour toute famille d’ensembles non vides, il existe une fonction qui choisit un élément dans chacun. Indépendant de ZF ; ZF + AC = ZFC.', voir: '/maths/partie-vi/axiome-du-choix' },
  { terme: 'Lemme de Zorn', def: 'Tout ensemble ordonné inductif (où toute chaîne a un majorant) possède un élément maximal. Équivalent à l’axiome du choix.', voir: '/maths/partie-vi/axiome-du-choix' },
  { terme: 'Paradoxe de Banach–Tarski', def: 'Théorème de ZFC : une boule se découpe en cinq morceaux réassemblables en deux boules identiques. Les morceaux sont non mesurables — l’intuition, pas les axiomes, est violée.', voir: '/maths/partie-vi/axiome-du-choix' },
  { terme: 'Conjecture', def: 'Énoncé cru vrai mais non démontré (Riemann, Goldbach, P ≠ NP…). Statut distinct d’« indécidable » : une conjecture peut tomber demain.', voir: '/maths/partie-vi/grandes-conjectures' },
  { terme: 'Hypothèse de Riemann', def: 'Tous les zéros non triviaux de la fonction ζ sont sur la droite Re(s) = 1/2. Conjecture ouverte, liée à la répartition des nombres premiers.', voir: '/maths/partie-vi/grandes-conjectures' },
];
