# Vérification — hub multi-cours

Hub assemblé par le skill `cours-deductif` : d'abord deux cours (physique, maths) en Mode C, puis
ajout d'un **troisième cours** (`processeurs` — *Des atomes au système d'exploitation*) sous son
propre préfixe, de façon non destructive.

## Vérifications techniques (hub complet)
- `npm run build` (+ Pagefind) : **vert, 81 pages** indexées (11 525 mots).
- `npm run check` (astro check) : **0 erreur** (110 fichiers ; quelques `hints` préexistants côté physique).
- Cours processeurs : **35 pages** (30 chapitres + comment-lire, méthodologie, accueil, glossaire, symboles),
  **16 composants interactifs**, **10 vidéos Manim** (rendues 720p + posters).

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

## Contrôle visuel (Playwright, serveur de dev)
- **Hub** : 3 cartes de cours (physique, maths, processeurs ⊞).
- **16/16 composants interactifs** rendus (canvas dessiné) sur leurs pages de chapitre, **0 erreur console**.
- **Interaction testée et fonctionnelle** : MOSFET (seuil → canal → lampe), inverseur CMOS, marges de
  bruit, additionneur, complément à deux, bascule D (front d'horloge), automate (tourniquet), cache,
  datapath, pipeline, MMU, frise de boot, et le **MiniCpu** (processeur à programme enregistré qui
  exécute réellement un petit programme : fetch-decode-execute, PC/registres/mémoire mis à jour,
  désassemblage surligné).
- KaTeX, encarts dépliables, vidéos Manim (lecture + poster de repli) présents et corrects.

## Génération (workflows multi-agents)
- **Composants interactifs** : 1 agent par composant (contrat `_canvas.ts` + exemple), 15 composants
  générés puis `astro check` à 0 erreur ; le 16ᵉ (MOSFET, gabarit) écrit à la main.
- **Contenu** : 29 chapitres, chacun **rédigé** par un agent puis **vérifié/corrigé/écrit** par un
  second (fact-checking adversarial : ex. tension directe d'une LED bleue corrigée à ≈3 V,
  attribution couplage vs Pauli rectifiée, ajout de `<Hypotheses>`/`<Tournant>` manquants). Chapitre
  modèle (`mosfet-interrupteur`) écrit à la main comme étalon.

## Mécanisme clé (rappel)
Les clés des **trois** échelles sont **disjointes** → une seule map `FIABILITE` fusionnée sert le
composant `Badge` pour tous les cours, sans le rendre course-aware ; la légende et la page
Méthodologie restent par-cours via `niveauxFor(courseId)`. La résolution se fait **par route** (les
slugs `comment-lire`, `glossaire`, `methodologie`… se répètent d'un cours à l'autre).
