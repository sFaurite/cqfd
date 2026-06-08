# Depuis les fondations — hub multi-cours

Portail réunissant **quatre cours déductifs** (« rien n'est utilisé sans être soit une hypothèse posée
au grand jour, soit une déduction, soit une observation ») :

- **`/physique`** — *De la relativité au Modèle Standard* (36 pages, 15 composants interactifs, 6 vidéos Manim).
- **`/maths`** — *Les mathématiques depuis les axiomes* (9 pages, 2 composants interactifs, 1 vidéo Manim).
- **`/processeurs`** — *Des atomes au système d'exploitation* (35 pages, 16 composants interactifs, 10 vidéos Manim).
- **`/cosmologie`** — *La cosmologie, des premiers instants au monde actuel* (29 pages, 8 composants interactifs, 6 vidéos Manim).

Chaque cours conserve sa navigation, son glossaire/index, et **sa propre échelle de fiabilité** :

| Cours | Échelle (4 niveaux) | Axe |
| --- | --- | --- |
| Physique | établi / modélisé / plausible / ouvert | confirmation expérimentale |
| Maths | démontré / admis / conjecturé / indécidable | statut épistémique |
| Processeurs | fondé / convention / idéalisé / implémentation | degré de nécessité (la physique impose vs l'ingénieur choisit) |
| Cosmologie | observé / concordant / extrapolé / spéculatif | degré d'ancrage observationnel (mesuré vs modélisé ΛCDM vs extrapolé vs spéculé) |

Construit avec le skill `cours-deductif` (Mode C puis Mode A pour le 4ᵉ cours). Sortie 100 % statique (**110 pages**).

## Le cours « processeurs »

On remonte toute la pile, du silicium jusqu'au boot d'un OS, en six parties (30 chapitres) :

1. **La matière qui calcule** — niveaux d'énergie, bandes, semiconducteurs, dopage, jonction PN.
2. **Le transistor, interrupteur commandé** — MOSFET, seuil, inverseur CMOS, abstraction 0/1.
3. **L'algèbre du tout-ou-rien** — Boole, portes universelles (NAND), circuits, complément à deux, ALU.
4. **La mémoire et le temps** — bascules RS/D, horloge, automates, SRAM/DRAM, hiérarchie/cache.
5. **L'architecture d'un processeur** — von Neumann, ISA, datapath, fetch-decode-execute, pipeline, interruptions.
6. **Du matériel au logiciel (le boot)** — reset/ROM, firmware/UEFI, bootloader, mode protégé/MMU, premier processus.

La marque de fabrique du cours : à chaque étage, le badge distingue ce que **la physique impose**
(`fondé`) de ce que **l'ingénieur choisit** (`convention`), des **modèles simplifiés** (`idéalisé`)
et de ce qui **dépend de la puce** (`implémentation`). Les changements de cadre (on admet la physique
quantique ; on choisit le binaire, le complément à deux, von Neumann, un jeu d'instructions) sont
signalés par un bandeau `<Tournant>`.

## Le cours « cosmologie »

On suit l'histoire de l'univers d'un seul tenant, de l'hypothèse d'homogénéité jusqu'au monde actuel,
en six parties (24 chapitres) :

1. **Le cadre : un univers en expansion** — principe cosmologique, cadre de la relativité générale,
   métrique FLRW et facteur d'échelle, redshift et loi de Hubble-Lemaître.
2. **La dynamique : les équations de Friedmann** — dérivation, contenu de l'univers, paramètres Ω, destin.
3. **L'univers chaud primordial** — histoire thermique, nucléosynthèse, recombinaison et fond diffus, anisotropies.
4. **Les premiers instants** — problèmes du Big Bang chaud, inflation, fluctuations primordiales, baryogenèse.
5. **La formation des structures** — instabilité de Jeans, matière noire, toile cosmique, énergie noire.
6. **Concordance & questions ouvertes** — modèle ΛCDM, tensions cosmologiques, questions ouvertes, synthèse.

La marque de fabrique : le badge distingue le **mesuré** (`observé` — expansion, fond diffus, abondances)
de ce que **prédit le modèle ΛCDM** (`concordant` — matière noire froide, Λ), des **extrapolations**
théoriques sérieuses (`extrapolé` — inflation, baryogenèse) et de la pure **spéculation** (`spéculatif` —
avant Planck, multivers). Les ajouts de cadre (on pose le principe cosmologique, on admet la relativité
générale, on introduit la thermodynamique cosmique, l'inflation) sont signalés par `<Tournant>` et `<Hypotheses>`.

## Démarrage

```bash
npm install
npm run dev        # http://localhost:4321  (/, /physique, /maths, /processeurs, /cosmologie)
npm run build      # build statique + recherche → dist/  (110 pages)
npm run preview
npm run check
```

## Architecture (multi-cours)

- **`src/lib/courses.ts`** — registre des cours (cartes du hub), avec libellé court par cours.
- **`src/lib/nav/`** — une arborescence par cours (`_physique.ts`, `_maths.ts`, `_processeurs.ts`,
  `_cosmologie.ts`), assemblée et **préfixée** dans `index.ts` (`/physique/…`, `/maths/…`,
  `/processeurs/…`, `/cosmologie/…`) + helpers résolus **par route**.
- **`src/lib/fiability.ts`** — presets fusionnés à **clés disjointes** (`PRESET_EMPIRIQUE`,
  `PRESET_MATHS`, `PRESET_INGENIERIE`, `PRESET_COSMO`) : une seule map sert le composant `Badge` pour
  tous les cours, tandis que la légende et la page Méthodologie sont **par cours** (`niveauxFor(courseId)`).
- **`src/data/<cours>/`** — glossaire + symboles par cours.
- **`src/pages/`** — `index.astro` = hub ; `physique/…`, `maths/…`, `processeurs/…`, `cosmologie/…` = les quatre cours.
- Les layouts et `Sidebar`/`Breadcrumb`/`PrevNext`/`LegendFiabilite` sont **course-aware** : ils
  déduisent le cours du **préfixe d'URL**.

## Vidéos Manim

Présentes dans `public/videos/` (partagées, non préfixées). Régénérables avec `bash manim/install.sh`
puis `bash manim/render.sh` (les scènes des quatre cours sont dans `manim/` et listées sous
« VOS SCÈNES » ; les 6 scènes du cours cosmologie : `expansion_univers`, `friedmann_destins`,
`histoire_thermique`, `recombinaison_cmb`, `courbe_rotation`, `acceleration_expansion`).
