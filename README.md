# Depuis les fondations — hub multi-cours

Portail réunissant **trois cours déductifs** (« rien n'est utilisé sans être soit une hypothèse posée
au grand jour, soit une déduction ») :

- **`/physique`** — *De la relativité au Modèle Standard* (36 pages, 15 composants interactifs, 6 vidéos Manim).
- **`/maths`** — *Les mathématiques depuis les axiomes* (9 pages, 2 composants interactifs, 1 vidéo Manim).
- **`/processeurs`** — *Des atomes au système d'exploitation* (35 pages, 16 composants interactifs, 10 vidéos Manim).

Chaque cours conserve sa navigation, son glossaire/index, et **sa propre échelle de fiabilité** :

| Cours | Échelle (4 niveaux) | Axe |
| --- | --- | --- |
| Physique | établi / modélisé / plausible / ouvert | confirmation expérimentale |
| Maths | démontré / admis / conjecturé / indécidable | statut épistémique |
| Processeurs | fondé / convention / idéalisé / implémentation | degré de nécessité (la physique impose vs l'ingénieur choisit) |

Construit avec le skill `cours-deductif` (Mode C). Sortie 100 % statique (**81 pages**).

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

## Démarrage

```bash
npm install
npm run dev        # http://localhost:4321  (/, /physique, /maths, /processeurs)
npm run build      # build statique + recherche → dist/  (81 pages)
npm run preview
npm run check
```

## Architecture (multi-cours)

- **`src/lib/courses.ts`** — registre des cours (cartes du hub), avec libellé court par cours.
- **`src/lib/nav/`** — une arborescence par cours (`_physique.ts`, `_maths.ts`, `_processeurs.ts`),
  assemblée et **préfixée** dans `index.ts` (`/physique/…`, `/maths/…`, `/processeurs/…`) + helpers
  résolus **par route**.
- **`src/lib/fiability.ts`** — presets fusionnés à **clés disjointes** (`PRESET_EMPIRIQUE`,
  `PRESET_MATHS`, `PRESET_INGENIERIE`) : une seule map sert le composant `Badge` pour les trois cours,
  tandis que la légende et la page Méthodologie sont **par cours** (`niveauxFor(courseId)`).
- **`src/data/<cours>/`** — glossaire + symboles par cours.
- **`src/pages/`** — `index.astro` = hub ; `physique/…`, `maths/…`, `processeurs/…` = les trois cours.
- Les layouts et `Sidebar`/`Breadcrumb`/`PrevNext`/`LegendFiabilite` sont **course-aware** : ils
  déduisent le cours du **préfixe d'URL**.

## Vidéos Manim

Présentes dans `public/videos/` (partagées, non préfixées). Régénérables avec `bash manim/install.sh`
puis `bash manim/render.sh` (les scènes des trois cours sont dans `manim/` ; les 10 scènes du cours
processeurs y sont listées sous « VOS SCÈNES »).
