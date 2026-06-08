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
  { katex: '\\varnothing', nom: 'Ensemble vide', desc: 'L’unique ensemble sans élément. La brique de base : 0 := ∅.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\in', nom: 'Appartenance', desc: 'x ∈ A : « x est un élément de A ». Relation primitive de la théorie des ensembles.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\subseteq', nom: 'Inclusion', desc: 'A ⊆ B : tout élément de A est élément de B.', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\cup,\\ \\cap', nom: 'Réunion, intersection', desc: 'A ∪ B (éléments de A ou de B) ; A ∩ B (éléments de A et de B).', voir: '/maths/partie-i/ensembles-zf' },
  { katex: '\\{x : P(x)\\}', nom: 'Ensemble en compréhension', desc: 'L’ensemble des x vérifiant la propriété P (encadré par l’axiome de séparation).', voir: '/maths/partie-i/ensembles-zf' },
  { katex: 'S(n)', nom: 'Successeur', desc: 'S(n) = n ∪ {n} : l’entier qui suit n.', voir: '/maths/partie-ii/entiers-naturels' },
  { katex: '\\mathbb{N}', nom: 'Entiers naturels', desc: 'Le plus petit ensemble inductif : {0, 1, 2, …}.', voir: '/maths/partie-ii/entiers-naturels' },
  { katex: '\\mathbb{Q}', nom: 'Nombres rationnels', desc: 'Les quotients d’entiers. Denses mais incomplets (troués).', voir: '/maths/partie-ii/reels-dedekind' },
  { katex: '\\mathbb{R}', nom: 'Nombres réels', desc: 'Les coupures de Dedekind de ℚ. Complet : toute partie majorée a une borne supérieure.', voir: '/maths/partie-ii/reels-dedekind' },
  { katex: '\\forall,\\ \\exists', nom: 'Quantificateurs', desc: '∀ « pour tout », ∃ « il existe ». Briques du langage logique des démonstrations.', voir: '/maths/partie-i/methode-axiomatique' },
  { katex: '\\Rightarrow', nom: 'Implication', desc: 'P ⇒ Q : « si P alors Q ». Le pas élémentaire d’une démonstration.', voir: '/maths/partie-i/methode-axiomatique' },
];
