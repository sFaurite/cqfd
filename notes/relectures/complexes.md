# Relecture — chapitre 9 « Les nombres complexes (ℂ) »

Fichier relu : `src/pages/maths/partie-ii/complexes.mdx`
Méthode : cinq passes (A trace des dépendances, B formations ensemblistes, C contrat des badges,
D vocabulaire et cohérence, E auto-contrôle anti-faux-positifs), bouclées jusqu'à épuisement
(deuxième boucle complète : aucun constat nouveau). Les numéros de ligne renvoient au fichier source.

---

## Passe 0 — Provenance

**SHA du dépôt** : `91600171ed5635134716a85804c1e840558af098` (branche `main`, arbre propre).

Fichiers lus (chemin — lignes — premier titre de section) :

| Fichier | Lignes | Premier titre |
|---|---|---|
| `src/pages/maths/partie-ii/complexes.mdx` | 202 | « Le scandale des “imaginaires” » |
| `src/pages/maths/partie-i/ensembles-zf.mdx` | 171 | « Le sol de tout l'édifice » |
| `src/pages/maths/partie-ii/reels-dedekind.mdx` | 395 | « Le dernier pas : combler les trous de ℚ » |
| `src/pages/maths/partie-i/relations-fonctions.mdx` | 148 | « Relier les objets entre eux » |
| `src/pages/maths/methodologie.mdx` | 54 | « Les quatre niveaux » |
| `src/pages/maths/comment-lire.mdx` | 100 | « Comment lire ce site » (page entière ; premier `##` : « Les encadrés “Hypothèses de départ” ») |
| `src/data/maths/glossary.ts` | 99 | (fichier de données, pas de section) |

Dépendances `<Prereq>` du corps : `/maths/partie-i/ensembles-zf` (l. 28), `/maths/partie-ii/reels-dedekind`
(l. 28, 102), `/maths/partie-i/relations-fonctions` (l. 174). Les trois fichiers existent.

Cohérence d'ensemble, dans les deux sens :
- le ch. 8 (`reels-dedekind.mdx`, l. 395) annonce « un nombre dont le carré vaut −1 … le sujet du
  prochain chapitre » — tenu ici ;
- « chapitre 2 » (l. 71) = `ensembles-zf` et « chapitre 8 » (l. 157) = `reels-dedekind` : numérotation
  conforme à celle que le ch. 8 emploie lui-même (« chapitres 6 et 7 » pour ℤ et ℚ) et au glossaire
  (« chapitre 8, §6 » pour Archimède) ;
- le composant `MathsCalculEquationnel` (l. 159) existe et accepte `jeu="complexe"`
  (`src/components/interactive/MathsCalculEquationnel.astro`, l. 11) ;
- le glossaire pointe vers la page (« Nombre complexe (ℂ) », « Module, conjugué ») et des chapitres
  aval y renvoient (`partie-iv/polynomes`, `partie-v/exponentielle`, `partie-vi/synthese`, nav).

Aucune incohérence bloquante : l'analyse peut se dérouler.

---

## Passe A — Trace des dépendances : 6 constats (+1 frontière)

**A1. (l. 131) L'« intégrité » de ℝ est invoquée sans avoir jamais été établie, et le cas x = −y est escamoté.**
> « or deux réels positifs de même carré sont égaux — si $x^2 = y^2$ avec $x, y \ge 0$, alors
> $(x-y)(x+y) = 0$, et l'intégrité du corps $\mathbb{R}$ force $x = y$ ou $x = -y$, donc $x = y$. »

Diagnostic : le glossaire ne connaît l'intégrité que pour ℤ (entrée « Intégrité » → chapitre 6) ; le
ch. 8 ne démontre nulle part « $ab = 0 \Rightarrow a = 0$ ou $b = 0$ » pour ℝ. C'est le seul appui non
soldé d'une preuve couverte par un badge vert (badge l. 135). De plus, le « donc $x = y$ » saute le
cas $x = -y$ (qui ne donne $x = y$ que par la positivité). Outil plus sobre déjà disponible :
l'inverse, exactement le geste du lemme de l'encart « inverse » (l. 86).
Proposition minimale (remplacer la fin de la phrase) :
> « … alors $(x-y)(x+y) = 0$ ; si $x + y \neq 0$, la multiplication par son inverse dans $\mathbb{R}$
> donne $x - y = 0$ ; et si $x + y = 0$, la positivité des deux membres force $x = y = 0$ — de
> $0 \le x = -y$ et $0 \le y$, l'antisymétrie tire $y = 0$. Dans les deux cas, $x = y$. »

**A2. (l. 168) « le même calcul … n'utilisait que les axiomes de corps » — sauf $z \cdot 0 = 0$.**
> « or $(-z)(-z) = z^2$, par le même calcul de distributivité que dans le lemme de l'encart
> « inverse », qui n'utilisait que les axiomes de corps — valables dans $\mathbb{C}$. »

Diagnostic : le calcul du lemme (l. 86) passe par « $x(-x+x) = x \cdot 0 = 0$ ». Or $x \cdot 0 = 0$
n'est pas un axiome de corps : c'est un fait que le ch. 8 établit pour ℝ *directement sur les
coupures* ($0^* \otimes B = 0^*$, puis signes), et que rien n'établit pour ℂ. (L'unicité de l'opposé,
elle, est bien générique : le micro-lemme (a) du ch. 8 ne consomme que les lois de ⊕, toutes
déclarées pour ℂ.)
Proposition minimale (compléter la parenthèse) :
> « — valables dans $\mathbb{C}$, avec, en prime, $z \cdot 0 = 0$ : calcul direct sur les couples,
> $(a,b)\cdot(0,0) = (a\cdot 0 - b\cdot 0,\ a\cdot 0 + b\cdot 0) = (0,0)$. »

**A3. (l. 79) Le décompte des axiomes de corps omet les opposés additifs et $0 \neq 1$.**
> « Associativité, commutativité, distributivité, neutres $0 := (0,0)$ et $1 := (1,0)$ : chaque
> vérification est un développement mécanique… »

Diagnostic : deux clauses du corps manquent à l'appel. Les **opposés** — pourtant utilisés dès la
l. 63 ($-i$), puis à l'étape 1 de l'encart d'ordre (l. 168, « en ajoutant $-z$ ») — et
**$0 \neq 1$** — vérifié seulement à l'étape 4 du même encart (l. 174), donc *après* le badge
« ℂ est un corps » (l. 98), alors que le glossaire l'inscrit dans la définition même de « corps ».
Proposition minimale (compléter l'énumération) :
> « Associativité, commutativité, distributivité, neutres $0 := (0,0)$ et $1 := (1,0)$, opposés —
> $-(a,b) := (-a,-b)$, dont la somme avec $(a,b)$ s'annule composante à composante — et $0 \neq 1$,
> deux couples distincts par la propriété caractéristique puisque $0 \neq 1$ dans $\mathbb{R}$
> (chapitre 8) : chaque vérification est un développement mécanique… »

**A4. (l. 147) « la multiplication par −1 » : identification non calculée.**
> « $(a,b) \mapsto (-b,a) \mapsto (-a,-b)$ — le demi-tour, c'est-à-dire la multiplication par $-1$. »

Diagnostic : que le demi-tour *soit* la multiplication par $(-1,0)$ est un calcul d'une ligne, tacite
dans un chapitre qui déroule tous les autres.
Proposition minimale :
> « — le demi-tour, c'est-à-dire la multiplication par $-1$ :
> $(-1,0)\cdot(a,b) = (-1\cdot a - 0\cdot b,\ -1\cdot b + 0\cdot a) = (-a,\,-b)$. »

**A5. (l. 102) La complétude est invoquée sans ses hypothèses (partie non vide et majorée).**
> « obtenue comme borne supérieure des $t \ge 0$ tels que $t^2 \le N(z)$, grâce à la complétude »

Diagnostic : le théorème du ch. 8 (§4) exige une partie **non vide et majorée** ; ni l'une ni
l'autre n'est vérifiée, et la dette déclarée ne couvre que « le carré de cette borne vaut $N(z)$ »,
pas l'existence de la borne.
Proposition minimale :
> « obtenue comme borne supérieure des $t \ge 0$ tels que $t^2 \le N(z)$ — partie de $\mathbb{R}$
> formée par séparation, non vide ($0$ y est) et majorée par $N(z) + 1$ : tout $t > N(z) + 1 \ge 1$
> vérifie $t^2 \ge t > N(z)$ — grâce à la complétude »

**A6. (l. 82) Le réordonnancement des sommes cite la commutativité, mais pas l'associativité.**
> « Les deux couples coïncident composante par composante (commutativité de $+$ dans $\mathbb{R}$),
> donc sont égaux. »

Diagnostic : passer de $ac + ae - bd - bf$ à $ac - bd + ae - bf$ réordonne une somme de quatre
termes : commutativité **et** associativité.
Proposition minimale : « (commutativité et associativité de $+$ dans $\mathbb{R}$) ».

**Frontière A-f1 (amont, ch. 8).** Le neutre multiplicatif de ℝ ($1 \cdot x = x$, utilisé ici
l. 73, 86, 92, 145, 170) : la facture du ch. 8 (badge du Résultat « ℝ est un corps ordonné
complet », l. 337) annonce « neutres et opposés démontrés (encarts) », mais aucun encart du ch. 8 ne
déroule $A \otimes 1^* = A$ (seul $A \oplus 0^* = A$ l'est, l. 222). Défaut de comptabilité *du
ch. 8*, pas de cette page — à solder là-bas (double inclusion d'une ligne, à la mode de
$A \oplus 0^* = A$), signalé ici parce que la trace y aboutit.

**Passe A : 6 constats** (+1 frontière).

---

## Passe B — Formations ensemblistes : 1 constat

**B1. (l. 34, 67, 102) Aucun graphe formé : il manque le « mot de charpente » du chapitre 8.**
Les opérations $+,\ \cdot$ sur ℂ, le plongement $\varphi : a \mapsto (a,0)$, le conjugué
$z \mapsto \bar z$ et la norme $N : \mathbb{C} \to \mathbb{R}$ sont manipulés comme fonctions sans
qu'aucun graphe ne soit formé — alors que le ch. 8 s'imposait ce scrupule (« Les graphes
$\oplus, \otimes$… se forment par séparation dans les produits cartésiens appropriés », l. 314), et
formait même le graphe de $t \mapsto t^*$. L'ambiant existe partout (produits cartésiens de ℂ et ℝ,
ch. 2) : une phrase suffit.
Proposition minimale (après le badge de la l. 98) :
> « Mot de charpente, comme au chapitre 8 : ici aucun quotient, donc aucun représentant à choisir —
> les composantes d'un couple étant uniques (propriété caractéristique), chaque formule définit sans
> ambiguïté — et les graphes de $+,\ \cdot : \mathbb{C} \times \mathbb{C} \to \mathbb{C}$ et du
> plongement $a \mapsto (a,0)$ se forment par séparation dans les produits cartésiens appropriés ;
> il en ira de même, à la section suivante, du conjugué et de la norme. »

(La partie « majorée/séparation » de la racine carrée est comptée en A5 ; l'ensemble de la preuve
d'ordre ne forme aucun ensemble — rien à réclamer là.)

**Passe B : 1 constat.**

---

## Passe C — Contrat des badges : 2 constats (+1 frontière)

**C1. (l. 71) La convention d'identification $a \leftrightarrow (a,0)$ n'a pas son badge bleu.**
> « Nous identifions désormais le réel $a$ et le couple $(a,0)$. »

Diagnostic : le ch. 8 badgeait la sienne (« Convention d'identification, adossée au théorème
ci-dessus — troisième du genre… », l. 331). Ici la convention suit le badge vert du plongement,
nue — une convention est du bleu.
Proposition minimale (ajouter après la phrase) :
> `<Badge niveau="admis">Convention d'identification, adossée au théorème de plongement qui précède
> — quatrième du genre après $\mathbb{N} \subseteq \mathbb{Z}$, $\mathbb{Z} \subseteq \mathbb{Q}$
> et $\mathbb{Q} \subseteq \mathbb{R}$.</Badge>`

**C2. (l. 102) Les définitions du conjugué, de la norme et du module n'ont pas de badge.**
> « posons le **conjugué** $\bar{z} := (a,-b)$ … et la **norme quadratique** $N(z) := a^2 + b^2$ …
> Le **module**, lui, sera $\lvert z \rvert := \sqrt{N(z)}$ »

Diagnostic : trois définitions notables sans badge bleu, dans un cours où « chaque affirmation
notable porte l'un des quatre niveaux » (méthodologie) et où le ch. 8 badgeait coupure, ℝ,
majorant/sup.
Proposition minimale (en fin de paragraphe) :
> `<Badge niveau="admis">Trois définitions — conjugué, norme quadratique, module ; la troisième vient
> avec la petite dette déclarée ci-dessus, les deux premières sans aucune.</Badge>`

Notes de passe, sans constat séparé :
- le badge « ℂ est un corps » (l. 98) redevient exactement conforme une fois la retouche **A3**
  appliquée (opposés et $0 \neq 1$ au décompte) — même défaut, même remède, compté une fois ;
- badges vérifiés conformes aux trois abris : l. 60, 71, 75, 108, 135, 184 (preuves déroulées ou
  modèle nommé de même nature), l. 197 (citation avec référence externe, signalée comme telle),
  l. 36 et 153 (bleus de définition/convention).

**Frontière C-f1. (l. 153)** Le badge bleu de l'anticipation trigonométrique : couleur défendable
(un emprunt *posé*, en quarantaine déclarée — « rien d'ici la partie V n'en dépend »), mais c'est un
usage du bleu que la méthodologie ne liste pas nommément (axiome, définition, cadre). Signalé
frontière ; aucune retouche réclamée.

**Passe C : 2 constats** (+1 frontière).

---

## Passe D — Vocabulaire et cohérence : 4 constats (+3 frontières)

**D1. (l. 110) La notation $z^{-1}$ suppose l'unicité de l'inverse — jamais démontrée ni réclamée.**
> « $z^{-1} = \frac{\bar z}{N(z)}$ »

Diagnostic : le ch. 8 n'avait pas ce besoin ($A^{-1}$ y est une formule) ; ici « l'inverse » et la
notation fonctionnelle exigent l'unicité. Elle coûte une ligne, avec l'algèbre déjà payée.
Proposition minimale :
> « Et l'inverse calculé plus haut — l'unique, d'ailleurs : si $zw = zw' = 1$, alors
> $w = w(zw') = (wz)w' = w'$, la même algèbre que l'unicité de l'opposé au chapitre 8 — se relit
> avec structure : … »

**D2. (l. 90, 110) La barre de fraction n'est pas introduite pour les réels, ni pour un complexe sur un réel.**
> « $w := \left( \frac{a}{a^2+b^2},\ \frac{-b}{a^2+b^2} \right)$ » puis « $\frac{\bar z}{N(z)}$ »

Diagnostic : le ch. 8 n'écrit de fractions que pour des rationnels ; $x/y$ entre réels apparaît ici
sans convention, et $\bar z/N(z)$ divise un complexe par un réel — la convention $r\,(x,y)$ n'arrive
qu'à la l. 149.
Proposition minimale : l. 88, « Le lemme autorise la division par $a^2+b^2$ dans $\mathbb{R}$ —
diviser, c'est multiplier par l'inverse : $x/y$ abrège $x \cdot y^{-1}$. » ; l. 110, « — où
$\bar z/N(z)$ abrège le couple $\big(a/N(z),\ -b/N(z)\big)$, c'est-à-dire $w$. »

**D3. (l. 63) $-i$ : notation d'opposé avant toute mention des opposés de ℂ.**
> « mais aussi $-i = (0,-1)$, dont le carré vaut $(-1,0)$ par le même calcul »

Diagnostic : au fil de la lecture, aucun opposé n'existe encore dans ℂ (ils n'entrent au décompte
qu'avec la retouche A3, section suivante). Un « := » et trois mots suffisent.
Proposition minimale :
> « mais aussi son opposé $-i := (0,-1)$ — la vérification composante à composante est celle de la
> section suivante — dont le carré vaut $(-1,0)$ par le même calcul »

**D4. (l. 77, 98) « corps » sans la garde d'informalité des chapitres 7 et 8.**
> « Tout non nul s'inverse : ℂ est un corps »

Diagnostic : le ch. 8 verrouille le mot (« “corps” — et “sous-corps” avec lui — reste ici
informel… la définition officielle attend la partie IV ») ; cette page l'affirme dans un badge vert
sans reprendre la garde. (La section d'ordre, elle, est irréprochable : « corps ordonné » y est
défini opérationnellement par (C1)/(C2).)
Proposition minimale (fin du badge l. 98) :
> « — « corps » gardant, comme aux chapitres 7 et 8, son sens informel : la liste des lois
> effectivement vérifiées, en attendant la définition officielle de la partie IV. »

**Frontière D-f1. (l. 195-200)** Le Résultat du théorème fondamental de l'algèbre énonce, sous badge
vert de citation, un théorème dont le terme central (« polynôme », et tacitement $z^n$) n'est pas
défini — la page le dit elle-même (l. 200 : « qui définira officiellement la notion même de
polynôme »), mais après le badge. Un demi-mot dans le badge 197 (« la notion même de polynôme sera
définie en partie IV ») fermerait la boucle. Frontière : le signalement existe, seule sa place se
discute.

**Frontière D-f2. (l. 163)** « l'ordre lexicographique du dictionnaire, par exemple, est total » —
affirmation d'aparté, jamais déroulée, jamais utilisée par la preuve. Admissible en motivation ;
signalée pour mémoire.

**Frontière D-f3. (glossaire, l. 50)** L'entrée « Module, conjugué » énonce $z\bar z = |z|^2$ — la
forme qui porte la dette — là où la page démontre la forme sans dette $z\bar z = N(z)$. Résumé
admissible pour un glossaire ; à retoucher seulement si l'on veut l'alignement parfait avec la
comptabilité de la page.

**Passe D : 4 constats** (+3 frontières).

---

## Passe E — Auto-contrôle : 0 constat

Chaque constat a été relu contre son passage complet ; deux candidats ont été rétrogradés en
frontière au terme du contrôle :
- l'appui du lemme (l. 86) sur « $x \cdot x = 0$ … en multipliant par l'inverse » : tous les faits
  consommés ($x^{-1}$ existe, $x^{-1} \cdot 0 = 0$, associativité) sont au ch. 8, au bon endroit —
  seul le neutre $1 \cdot x = x$ pèche, et c'est la frontière A-f1 (défaut de facture *amont*) ;
- le badge bleu de l'anticipation (C-f1) : la couleur est défendable, on signale sans s'écarter.
Vérifications négatives notables : aucune définition badgée verte ; aucun badge vert hors des trois
abris ; les comptes annoncés (« quatre règles », « une comme modèle », « vérifié en trois lignes »,
« la seule [anticipation] du chapitre ») sont exacts ; les renvois « plus bas » (l. 18, 63) aboutissent.

**Passe E : 0 constat.**

Une deuxième boucle complète des cinq passes, retouches proposées en tête, n'a rien produit de
nouveau : point fixe atteint.

---

## Points de style (hors constats)

- **S1 (l. 42)** : $i := (0,1)$ — la définition la plus célèbre du chapitre est la seule sans badge
  bleu ; soit lui donner le sien, soit élargir d'un mot le badge de la l. 36.
- **S2 (l. 102)** : « unique racine carrée positive » — l'unicité n'est prouvée qu'à la l. 131
  (corollaire de l'encart Brahmagupta) ; un demi-renvoi (« l'unicité sera vérifiée dans l'encart
  ci-dessous ») éviterait l'anticipation muette.
- **S3 (l. 56-61)** : le Résultat encadré contient la clause définitionnelle « où $i := (0,1)$ »
  sous badge vert — acceptable (la clause précise l'objet, le badge couvre le théorème), noté pour
  mémoire.

---

## Priorités

1. **A1** — l'« intégrité de ℝ » invoquée sans preuve amont + cas $x = -y$ escamoté : seul trou réel
   sous un badge vert ; la réécriture par l'inverse règle les deux d'un coup.
2. **A3** — opposés additifs et $0 \neq 1$ absents du décompte du corps (l. 79) : c'est la portée du
   badge « ℂ est un corps » (l. 98) qui est en jeu.
3. **A5** — hypothèses de la complétude (non vide, majorée) non vérifiées pour la racine carrée.
4. **C1, C2** — badges bleus manquants (convention d'identification ; conjugué/norme/module).
5. **A2, A4, A6** — micro-pas tacites ($z \cdot 0 = 0$ dans ℂ ; multiplication par $-1$ ;
   associativité de $+$) : une ligne chacun.
6. **B1** — mot de charpente : graphes des opérations, du plongement, du conjugué et de la norme.
7. **D1–D4** — unicité de l'inverse pour $z^{-1}$ ; conventions de fraction ; $-i$ ; garde
   d'informalité de « corps ».

Hors page (frontières à traiter chez leurs propriétaires) : facture du ch. 8 (neutre multiplicatif
$A \otimes 1^* = A$ jamais déroulé alors que la facture l'annonce « démontré (encarts) ») ; badge du
TFA (déplacer d'un cran le signalement « polynôme non encore défini ») ; entrée de glossaire
« Module, conjugué » (forme avec dette). Toute retouche appliquée devra être répercutée dans la
comptabilité des ch. 25/27 conformément à la règle du cours.

**Bilan : 13 constats (A : 6, B : 1, C : 2, D : 4, E : 0), 5 frontières, 3 points de style.**
