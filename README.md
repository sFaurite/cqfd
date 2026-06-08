# Depuis les fondations — hub multi-cours

Portail réunissant **deux cours déductifs** (« chaque résultat est posé en hypothèse ou démontré ») :

- **`/physique`** — *De la relativité au Modèle Standard* (36 pages, 15 composants interactifs, 6 vidéos Manim).
- **`/maths`** — *Les mathématiques depuis les axiomes* (9 pages, 2 composants interactifs, 1 vidéo Manim).

Chaque cours conserve sa navigation, son glossaire/index, et **sa propre échelle de fiabilité** :
empirique pour la physique (établi / modélisé / plausible / ouvert), déductive pour les maths
(démontré / admis / conjecturé / indécidable). Construit avec le skill `cours-deductif` (Mode C).

## Démarrage

```bash
npm install
npm run dev        # http://localhost:4321  (/, /physique, /maths)
npm run build      # build statique + recherche → dist/  (46 pages)
npm run preview
npm run check
```

## Architecture (multi-cours)

- **`src/lib/courses.ts`** — registre des cours (cartes du hub).
- **`src/lib/nav/`** — une arborescence par cours (`_physique.ts`, `_maths.ts`), assemblée et
  **préfixée** dans `index.ts` (`/physique/…`, `/maths/…`) + helpers résolus **par route**.
- **`src/lib/fiability.ts`** — presets fusionnés à **clés disjointes** : une seule map sert le
  composant `Badge` pour les deux cours, tandis que la légende et la page Méthodologie sont
  **par cours** (`niveauxFor(courseId)`).
- **`src/data/<cours>/`** — glossaire + symboles par cours.
- **`src/pages/`** — `index.astro` = hub ; `physique/…` et `maths/…` = les deux cours.
- Les layouts et `Sidebar`/`Breadcrumb`/`PrevNext`/`LegendFiabilite` sont **course-aware** : ils
  déduisent le cours du **préfixe d'URL**.

## Vidéos Manim

Présentes dans `public/videos/` (partagées entre les deux cours). Régénérables avec
`bash manim/install.sh` puis `bash manim/render.sh` (les scènes des deux cours sont dans `manim/`).
