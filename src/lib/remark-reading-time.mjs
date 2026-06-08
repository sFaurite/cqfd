/**
 * Plugin remark minimal : calcule le temps de lecture et le nombre de mots,
 * puis les injecte dans le frontmatter (frontmatter.minutesLecture, .motsCount).
 *
 * Volontairement sans dépendance externe (pas de unist-util-visit ni
 * mdast-util-to-string) : on parcourt récursivement l'AST et on agrège la
 * valeur textuelle des nœuds. Vitesse de lecture retenue : 150 mots/min
 * (volontairement basse car le contenu est dense en math et en démonstrations).
 */
const MOTS_PAR_MINUTE = 150;

function collecterTexte(node, acc) {
  if (!node) return;
  if (typeof node.value === 'string') acc.push(node.value);
  if (Array.isArray(node.children)) {
    for (const enfant of node.children) collecterTexte(enfant, acc);
  }
}

export function remarkReadingTime() {
  return function (tree, file) {
    const morceaux = [];
    collecterTexte(tree, morceaux);
    const texte = morceaux.join(' ');
    const mots = texte.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(mots / MOTS_PAR_MINUTE));

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.minutesLecture = minutes;
    file.data.astro.frontmatter.motsCount = mots;
  };
}
