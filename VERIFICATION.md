# Vérification — hub multi-cours

Hub assemblé par le skill `cours-deductif` (Mode C) à partir de deux cours existants (physique,
maths), de façon non destructive.

## Vérifications techniques
- `npm run build` (+ Pagefind) : **vert**, **46 pages** indexées.
- Liens internes : **0 cassé** (43 liens uniques ; tous préfixés `/physique/` ou `/maths/`,
  `href="/"` = retour au hub).
- Imports relatifs : **232 références résolues, 0 cassée** (profondeur corrigée après déplacement).

## Isolation des cours (audit adversarial, 1 agent par cours)
- **Badges** : séparation stricte et bidirectionnelle. Physique n'utilise que `etabli`/`modelise`/
  `plausible`/`ouvert` ; maths que `demontre`/`admis`/`conjecture`/`indecidable`. Aucune fuite.
- **Échelles** : `physique/methodologie` montre l'échelle empirique (« Solidement modélisé », pas
  « Indécidable ») ; `maths/methodologie` l'échelle déductive (« Indécidable », pas « Solidement
  modélisé »). La **légende du header change d'échelle selon le cours visité**.
- **Intégrité du contenu déplacé** : démonstrations, encarts, badges, composants interactifs et
  vidéos Manim intacts dans les deux cours (vérifié sur e-mc2, higgs, entiers-naturels, reels-dedekind).

## Mécanisme clé
Les clés de niveau des deux échelles sont **disjointes** → une seule map `FIABILITE` fusionnée sert
le composant `Badge` pour les deux cours, sans le rendre course-aware ; la légende et la page
Méthodologie restent par-cours via `niveauxFor(courseId)`. La résolution se fait **par route**
(les slugs se répètent entre cours).
