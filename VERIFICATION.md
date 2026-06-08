# Vérification — hub multi-cours

Hub assemblé par le skill `cours-deductif` : d'abord deux cours (physique, maths) en Mode C, puis
ajout d'un **troisième cours** (`processeurs` — *Des atomes au système d'exploitation*), puis d'un
**quatrième cours** (`cosmologie` — *La cosmologie, des premiers instants au monde actuel*) sous son
propre préfixe, de façon non destructive (Mode A sur un sous-arbre du hub).

## Vérifications techniques (hub complet)
- `npm run build` (+ Pagefind) : **vert, 110 pages** indexées (14 928 mots).
- `npm run check` (astro check) : **0 erreur, 0 warning** (132 fichiers ; quelques `hints` préexistants).
- Cours processeurs : **35 pages**, **16 composants interactifs**, **10 vidéos Manim** (720p + posters).
- Cours cosmologie : **29 pages** (24 chapitres + comment-lire, méthodologie, accueil, glossaire, symboles),
  **8 composants interactifs**, **6 vidéos Manim** (rendues 720p + posters).

## Cours « processeurs » — isolation et rigueur
- **Échelle de fiabilité dédiée** : `PRESET_INGENIERIE` (`fondé` / `convention` / `idéalisé` /
  `implémentation`), clés **disjointes** de la physique et des maths.
- **Isolation des échelles (vérifiée par grep bidirectionnel)** : aucune clé physique/maths dans les
  chapitres processeurs ; aucune clé ingénierie dans physique/maths. La **légende du header** affiche
  l'échelle ingénierie sur les pages `/processeurs/…`.
- **Badges** : **chaque** chapitre porte des badges (5 à 13 par page).
- **Honnêteté épistémologique** : les changements de cadre sont signalés par `<Tournant>` — on admet
  la physique quantique (`atomes-niveaux`), on choisit le binaire et le complément à deux
  (`binaire-complement`), l'abstraction 0/1 (`abstraction-numerique`), le modèle de von Neumann
  (`von-neumann`), le jeu d'instructions (`isa`), la rétroaction → mémoire (`bascule-rs`).
- **Liens internes** : **66 liens vérifiés, 0 cassé** (tous résolvent vers une page existante).

## Cours « cosmologie » — isolation et rigueur
- **Échelle de fiabilité dédiée** : `PRESET_COSMO` (`observé` / `concordant` / `extrapolé` /
  `spéculatif`), clés **disjointes** des trois autres cours, fusionnées dans `FIABILITE` sans collision.
- **Isolation des échelles (grep bidirectionnel)** : **aucune** clé étrangère (physique/maths/
  ingénierie/chimie/réseaux/…) dans les chapitres cosmologie ; **aucune** clé cosmo (`observe`/
  `concordance`/`extrapole`/`speculatif`) dans les autres cours. La **légende du header** affiche bien
  l'échelle observationnelle sur les pages `/cosmologie/…` (vérifié visuellement).
- **Badges** : **chaque** chapitre en porte (3 à 12 par page ; 164 badges au total — 61 `observé`,
  62 `concordant`, 30 `extrapolé`, 11 `spéculatif`).
- **Honnêteté épistémologique** : changements de cadre signalés par `<Tournant>` — on pose le principe
  cosmologique (`principe-cosmologique`), on admet la relativité générale (`relativite-cadre`), on
  introduit la thermodynamique cosmique (`univers-chaud`), on constate les problèmes du Big Bang
  (`problemes-big-bang`) et on ajoute l'inflaton (`inflation`, via `<Hypotheses>`).
- **Liens internes** : **27 cibles `/cosmologie/…` vérifiées, 0 cassé** ; aucun lien non préfixé.
- **Page modèle** (`equations-friedmann`, écrite à la main) : dérivation ligne à ligne par coquille
  newtonienne, encart `<plusloin>` sur l'accord RG + terme de pression, interactif `FriedmannFate`,
  vidéo `friedmann-destins`.

## Contrôle visuel (Playwright, serveur de dev)
- **Hub** : **4 cartes** de cours (physique ⊙, maths ∅, processeurs ⊞, cosmologie Λ) ; pied de page
  listant les 4 échelles.
- **Accueil cosmologie** : hero orange (Λ), échelle observé/concordant/extrapolé/spéculatif, 6 parties.
- **Page modèle `equations-friedmann`** : sidebar « Cosmologie » + « ← Tous les cours », fil d'Ariane,
  KaTeX (équation de Friedmann encadrée), badges + infobulles, **interactif `FriedmannFate` réactif**
  (preset Einstein-de Sitter → bascule de « accélérée » à « éternelle décélérée »), vidéo lue. 0 erreur console.
- **Page dense `recombinaison-cmb`** : interactif `BlackbodyCMB` rendu (pic de Planck ≈ 160 GHz à 2,73 K),
  badges, KaTeX, **la légende du header bascule sur l'échelle cosmologie**. 0 erreur console.
- **Processeurs — 16/16 composants interactifs** rendus (canvas dessiné) sur leurs pages, **0 erreur console**.
- **Interaction testée et fonctionnelle** (processeurs) : MOSFET (seuil → canal → lampe), inverseur CMOS, marges de
  bruit, additionneur, complément à deux, bascule D (front d'horloge), automate (tourniquet), cache,
  datapath, pipeline, MMU, frise de boot, et le **MiniCpu** (processeur à programme enregistré qui
  exécute réellement un petit programme : fetch-decode-execute, PC/registres/mémoire mis à jour,
  désassemblage surligné).
- KaTeX, encarts dépliables, vidéos Manim (lecture + poster de repli) présents et corrects.

## Génération (workflows multi-agents)
- **Processeurs** — composants : 1 agent par composant (15 générés + MOSFET à la main) ; contenu :
  29 chapitres rédigés puis vérifiés/corrigés par un second agent (chapitre modèle `mosfet-interrupteur`
  à la main).
- **Cosmologie** — composants : 8 composants interactifs écrits à la main (patron `_canvas.ts`) ;
  contenu : page modèle `equations-friedmann` écrite à la main, puis **workflow `content.mjs`** pour les
  **23 autres chapitres** (1 agent rédige le corps MDX, 1 agent fact-checke/corrige/écrit le fichier).
  Post-traitement de la **profondeur d'import** (`../../` → `../../../` sur les chapitres à 3 niveaux,
  sed idempotent ancré qui épargne la page modèle déjà correcte). Corrections de justesse appliquées par
  les agents (ex. déviation de la lumière par le Soleil ≈ 1,75″ et non le double de la valeur newtonienne ;
  recombinaison à ~3000 K expliquée par le rapport photons/baryons ; badges manquants ajoutés).

## Mécanisme clé (rappel)
Les clés des **quatre** échelles sont **disjointes** → une seule map `FIABILITE` fusionnée sert le
composant `Badge` pour tous les cours, sans le rendre course-aware ; la légende et la page
Méthodologie restent par-cours via `niveauxFor(courseId)`. La résolution se fait **par route** (les
slugs `comment-lire`, `glossaire`, `methodologie`… se répètent d'un cours à l'autre).
