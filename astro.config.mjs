// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';
import { remarkBaseLinks } from './src/lib/remark-base-links.mjs';

// Sous-chemin de déploiement (GitHub Pages projet : /cqfd/). Source unique :
// sert à la fois à `base` d'Astro et au plugin qui préfixe les liens des MDX.
// Pour revenir à la racine (domaine perso / site utilisateur), mettre BASE = '/'.
const BASE = '/cqfd';

// https://astro.build
export default defineConfig({
  // URL de production (GitHub Pages) + sous-chemin du projet.
  site: 'https://sfaurite.github.io',
  base: BASE,

  // Math rendue AU BUILD : aucun JavaScript de rendu mathématique côté client.
  // @astrojs/mdx hérite par défaut de cette config markdown (extendMarkdownConfig),
  // donc les plugins s'appliquent aussi bien aux .md qu'aux .mdx.
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkMath, [remarkBaseLinks, { base: BASE }]],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  integrations: [mdx()],

  // Sortie 100 % statique → dossier dist/.
  output: 'static',

  build: {
    // Une route = un dossier avec index.html (URLs propres sans .html).
    format: 'directory',
  },

  vite: {
    // Évite des avertissements de pré-bundle sur katex (CSS importé globalement).
    ssr: {
      noExternal: ['katex'],
    },
  },
});
