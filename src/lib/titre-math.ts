/**
 * Rendu KaTeX des titres de composants (Encart, Resultat, Tournant, Hypotheses).
 *
 * Les attributs JSX (`titre="…"`, `label="…"`) ne passent PAS par remark-math :
 * un titre contenant `$E = mc^2$` s'afficherait tel quel. Ce module rend les
 * segments `$…$` côté serveur avec katex.renderToString ; le reste du titre est
 * échappé. À injecter via `set:html`.
 */
import katex from 'katex';

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** HTML du titre : segments `$…$` rendus en KaTeX inline, texte échappé. */
export function titreHtml(titre: string): string {
  return titre
    .split(/(\$[^$]+\$)/)
    .map((seg) =>
      seg.length > 2 && seg.startsWith('$') && seg.endsWith('$')
        ? katex.renderToString(seg.slice(1, -1), { throwOnError: false })
        : escapeHtml(seg),
    )
    .join('');
}

/** Version texte brut du titre (aria-label) : délimiteurs `$` retirés. */
export function titreTexte(titre: string): string {
  return titre.replace(/\$/g, '');
}
