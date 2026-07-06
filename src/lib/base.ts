/**
 * Gestion du préfixe d'URL (« base ») pour un déploiement sous un sous-chemin
 * (ex. GitHub Pages projet : https://sfaurite.github.io/cqfd/).
 *
 * `import.meta.env.BASE_URL` vaut la valeur de `base` de astro.config.mjs,
 * terminée par un « / » (ex. « /cqfd/ », ou « / » à la racine). On centralise
 * ici pour que TOUT lien interne du site passe par le même point : changer la
 * base (ou revenir à la racine) ne demande alors que d'éditer astro.config.
 */

/** Base sans slash final : « /cqfd » (ou « » à la racine). */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Préfixe un chemin ABSOLU interne (« /maths/… », « /videos/x.mp4 ») par la base.
 * Laisse intacts : URLs externes (http…, //…), ancres (#…), et chemins déjà préfixés.
 */
export function withBase(path: string): string {
  if (!path) return path;
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('#')) return path; // externe / protocole / ancre
  if (!path.startsWith('/')) return path; // relatif : on ne touche pas
  if (BASE && (path === BASE || path.startsWith(BASE + '/'))) return path; // déjà préfixé
  return BASE + path;
}

/**
 * Retire la base d'un pathname (ex. `Astro.url.pathname`) pour le comparer aux
 * chemins de navigation (qui, eux, sont stockés SANS base côté source mais
 * préfixés à l'émission). Utilisé par la résolution du cours/chapitre courant.
 */
export function stripBase(pathname: string): string {
  if (!BASE) return pathname;
  if (pathname === BASE) return '/';
  if (pathname.startsWith(BASE + '/')) return pathname.slice(BASE.length);
  return pathname;
}
