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
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « établi », « modélisé », « plausible », « ouvert ».' },
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
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Construire les nombres',
    accroche: 'À partir du seul ensemble vide, fabriquer ℕ puis ℝ — sans rien admettre de plus.',
    chapitres: [
      { slug: 'entiers-naturels', path: '/partie-ii/entiers-naturels', num: 3, titre: 'Les entiers naturels (ℕ)', court: 'Les entiers naturels', accroche: 'La construction de von Neumann : 0 = ∅, et la récurrence démontrée.' },
      { slug: 'reels-dedekind', path: '/partie-ii/reels-dedekind', num: 4, titre: 'Les nombres réels (coupures de Dedekind)', court: 'Les réels', accroche: 'Combler les « trous » de ℚ : une coupure définit un réel. √2 enfin construit.' },
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
