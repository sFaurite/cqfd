/**
 * Plugin remark : préfixe TOUS les liens internes absolus des fichiers .md/.mdx
 * par la base du site (ex. « /cqfd »), au build.
 *
 * Couvre en un seul passage, sans toucher au contenu source :
 *   - les liens Markdown `[texte](/chemin)` et images `![](/chemin)` ;
 *   - les éléments JSX (`<Prereq href="/chemin">`, `<a href="/chemin">`,
 *     `<img src="/chemin">`) via leurs attributs `href` / `src`.
 *
 * Ne touche pas : URLs externes (http…, //…), ancres (#…), chemins relatifs,
 * ni les valeurs déjà préfixées par la base. Idempotent.
 *
 * La base est passée en option ({ base: '/cqfd' }) depuis astro.config.mjs pour
 * rester l'unique source de vérité avec `base:` d'Astro.
 */
export function remarkBaseLinks({ base = '' } = {}) {
  const B = base.replace(/\/$/, '');

  const prefix = (url) => {
    if (typeof url !== 'string' || !url) return url;
    if (/^([a-z]+:)?\/\//i.test(url) || url.startsWith('#')) return url; // externe / ancre
    if (!url.startsWith('/')) return url; // relatif
    if (!B) return url;
    if (url === B || url.startsWith(B + '/')) return url; // déjà préfixé
    return B + url;
  };

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;

    if ((node.type === 'link' || node.type === 'image') && typeof node.url === 'string') {
      node.url = prefix(node.url);
    }

    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      for (const attr of node.attributes || []) {
        if (
          attr &&
          attr.type === 'mdxJsxAttribute' &&
          (attr.name === 'href' || attr.name === 'src') &&
          typeof attr.value === 'string'
        ) {
          attr.value = prefix(attr.value);
        }
      }
    }

    for (const child of node.children || []) visit(child);
  };

  return (tree) => {
    visit(tree);
  };
}

export default remarkBaseLinks;
