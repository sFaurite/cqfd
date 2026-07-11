# Relecture — chapitre 10 « Comparer les infinis : l'équipotence »

Fichier relu : `src/pages/maths/partie-iii/equipotence.mdx`.
Méthode : cinq passes (A trace des dépendances, B formations ensemblistes, C contrat
des badges, D vocabulaire et cohérence, E auto-contrôle anti-faux-positifs), bouclées
jusqu'à épuisement — la seconde boucle complète n'a rien produit de neuf.

---

## Passe 0 — Provenance

SHA du dépôt : `91600171ed5635134716a85804c1e840558af098` (branche `main`, arbre propre).

Fichiers lus (chemin — lignes — premier titre de section) :

| Fichier | Lignes | Premier titre |
|---|---|---|
| `src/pages/maths/partie-iii/equipotence.mdx` | 152 | « Peut-on compter l'infini ? » |
| `src/pages/maths/partie-i/relations-fonctions.mdx` | 148 | « Relier les objets entre eux » |
| `src/pages/maths/partie-ii/entiers-naturels.mdx` | 208 | « L'idée : chaque nombre est l'ensemble de ceux d'avant » |
| `src/pages/maths/partie-ii/arithmetique-de-n.mdx` | 253 | « Qu'est-ce que 2 + 2 ? » |
| `src/pages/maths/methodologie.mdx` | 54 | « Les quatre niveaux » |
| `src/pages/maths/comment-lire.mdx` | 100 | « Les encadrés “Hypothèses de départ” » |
| `src/data/maths/glossary.ts` | 99 | (pas de section — interface `TermeGlossaire` + tableau `GLOSSAIRE`) |
| `src/lib/nav/_maths.ts` | 139 | (navigation — source unique de l'ordre des chapitres) |

Consultations ciblées (grep, pour vérifier l'existence de lemmes invoqués) :
`partie-i/ensembles-zf.mdx`, `partie-ii/entiers-relatifs.mdx`, `partie-ii/rationnels.mdx`,
`partie-ii/reels-dedekind.mdx`, `partie-ii/complexes.mdx`, `partie-iii/denombrables.mdx`
(comptage du badge rouge), `src/data/maths/symbols.ts`.

Cohérence d'ensemble vérifiée :

- Numérotation (`_maths.ts`) : équipotence = **ch. 10**, dénombrables = 11,
  hypothèse du continu = **13**, axiome du choix = **25**, synthèse = 27. Les renvois
  internes de la page (« chapitre 13 » l. 20, « chapitre 25 » l. 98 et 147) sont exacts.
- Renvoi aller-retour : le ch. 4 (`entiers-naturels.mdx` l. 65) promet « l'idée
  deviendra un théorème au chapitre 10 » — c'est bien cette page (voir toutefois D3).
- Les trois entrées du glossaire de la partie III concernées (Équipotence,
  Cantor–Schröder–Bernstein, Lemme des tiroirs) pointent vers cette page : elles ne
  comptent donc pas comme définitions amont, et la page définit elle-même ces objets. ✓
- Compte des rouges annoncé l. 20 (« deux dans ce chapitre, un au chapitre suivant ») :
  deux badges `indecidable` sur la page (l. 98, l. 147), exactement un dans
  `denombrables.mdx` (l. 143). ✓
- Aucune incohérence bloquante : l'analyse peut se dérouler.

---

## Passe A — Trace des dépendances

**A1.** l. 33 : « elle est **réflexive** (l'identité $A \to A$ est une bijection),
**symétrique** (la *réciproque d'une bijection est une bijection*) et **transitive**
(la *composée de deux bijections* en est une) », avec deux liens `<Prereq>` vers le
chapitre 3 ; même invocation l. 106 (« la *composée de deux injections* est
injective »), l. 77 (« $g := \tau \circ f$ … est injective (composée d'une injection
et d'une bijection) ») et l. 95 (« $\psi := \beta \circ \varphi \circ \beta^{-1}$ …
est injective »).
→ **Aucun de ces trois lemmes n'existe en amont.** Le chapitre 3 démontre : la
composée est une *fonction*, l'associativité, la neutralité des identités, et
« bijective ⟺ inversible » avec unicité de $f^{-1}$ — mais nulle part « la réciproque
d'une bijection est une bijection », « la composée de deux injections est injective »,
« la composée de deux bijections est une bijection », ni « l'identité est une
bijection » (grep sur les parties I et II : aucune occurrence). Or ces faits portent
cinq badges verts de la page (l. 33, 67 via l. 77, 85 via la symétrie/transitivité,
95, 106). C'est le constat le plus lourd de la relecture : des preuves justes,
appuyées sur des lemmes jamais démontrés.
→ Proposition minimale (dans la voix du cours), à loger au **chapitre 3**, une phrase
après l'encart « bijective si et seulement si inversible » (l. 76 de
`relations-fonctions.mdx`) :
« Trois corollaires d'une ligne serviront sans relâche. L'identité est une bijection —
inversible, d'inverse elle-même, par neutralité. La réciproque d'une bijection est une
bijection — $f^{-1}$ satisfait les deux identités du théorème, rôles échangés : elle
est inversible, d'inverse $f$. Et la composée $g \circ f$ de deux injections est
injective — $g(f(a)) = g(f(a'))$ force $f(a) = f(a')$ puis $a = a'$ — ; de deux
surjections, surjective — tout $c$ s'écrit $g(b)$, tout $b$ s'écrit $f(a)$ — ; de deux
bijections, bijective. <Badge niveau="demontre">Trois vérifications d'une ligne,
déroulées ici même à partir du théorème et des définitions.</Badge> »
(Variante si l'on refuse de toucher au ch. 3 : dérouler ces trois lignes dans un encart
« rappel » en tête de la présente page, avant la l. 33.)

**A2.** l. 51 : « si $n \lt m$, alors $2n = n + n \lt m + m = 2m$, par deux
applications de la *compatibilité de l'ordre avec l'addition* » (lien `<Prereq>` vers
le chapitre 5) ; badge : « injectivité par compatibilité de l'ordre ».
→ **Ce lemme n'existe pas au chapitre 5** (grep `compatib|croiss|monoton` sur
`arithmetique-de-n.mdx` : zéro occurrence ; le chapitre démontre réflexivité,
transitivité, antisymétrie, totalité, bon ordre — pas la compatibilité). Fait
aggravant hors périmètre mais à consigner : les chapitres 6 (`entiers-relatifs.mdx`
l. 179, « en appliquant la compatibilité de $\mathbb{N}$ aux représentants ») et 8
(`reels-dedekind.mdx` l. 40, « compatibilité de $\le$ avec $+$, deux fois »)
l'invoquent aussi — la lacune est systémique et son lieu naturel de résorption est
le chapitre 5.
→ Proposition minimale, au **chapitre 5**, à la suite de la régularité (l. 120 de
`arithmetique-de-n.mdx`) :
« Un compagnon de la régularité, dans l'autre sens : l'addition **respecte l'ordre**.
Si $m \le n$, alors $m + p \le n + p$ — le témoin voyage : de $m + k = n$ on tire
$(m + p) + k = (m + k) + p = n + p$ par associativité et commutativité. Et la version
stricte : si $m \lt n$, alors $m + p \lt n + p$ — car l'égalité, par régularité
(après commutativité), redonnerait $m = n$. <Badge niveau="demontre">Le témoin de
$\le$ transporté par associativité et commutativité ; le cas strict par
régularité.</Badge> »
Puis, sur la présente page, faire dire à la l. 51 la dichotomie qu'elle tait : « si
$n \neq m$, la totalité de l'ordre (chapitre 5) permet de supposer $n \lt m$ ; alors
$2n = n + n \lt m + n = n + m \lt m + m = 2m$, deux applications de la compatibilité
stricte — donc $2n \neq 2m$. »

**A3.** l. 47 : « tout élément de $\mathbb{N}^*$ est … un successeur (le seul entier
qui n'en soit pas un est $0$, **par construction de $\mathbb{N}$**) », et badge :
« Injectivité et surjectivité par les propriétés du successeur, **démontrées au
chapitre 4** ».
→ Le fait « tout entier est $0$ ou un successeur » n'est pas « par construction » :
c'est le **petit lemme** du chapitre 5 (encart « Antisymétrie et totalité », l. 155
de `arithmetique-de-n.mdx`), démontré par récurrence. L'attribution au chapitre 4 est
inexacte pour la surjectivité (l'injectivité de $S$, elle, est bien au ch. 4).
→ Proposition : « …donc un successeur (tout entier est $0$ ou un successeur — le
petit lemme du <Prereq href="/maths/partie-ii/arithmetique-de-n">chapitre 5</Prereq>)… »
et badge : « Injectivité par l'injectivité du successeur (chapitre 4) ; surjectivité
par le petit lemme “zéro ou successeur” (chapitre 5). »

**A4.** l. 47 (« $\sigma(n) = n+1$ », « si $n+1 = m+1$ »), puis l. 73, 77, 79, 87, 95 :
la page repose partout sur l'identité tacite $n + 1 = S(n)$ (et $n+2 = S(S(n))$),
jamais dérivée — au chapitre 5 elle n'apparaît qu'en sous-calcul de preuves, jamais
comme énoncé.
→ Proposition minimale, une parenthèse à la première occurrence (l. 47) : « ($n+1$
abrège $S(n)$ : $n + 1 = n + S(0) = S(n + 0) = S(n)$, les deux équations de
l'addition — et de même $n + 2 = S(S(n))$) ».

**A5.** l. 51 : « $2n = n + n$ » est affirmé sans justification. Avec le $\times$ du
chapitre 5, $2 \times n = S(1) \times n = 1 \times n + n = (0 \times n + n) + n
= n + n$ — via les deux lemmes de la commutativité de $\times$ ($0 \times n = 0$ et
$S(m) \times n = m \times n + n$) et le lemme A ($0 + n = n$).
→ Proposition : « $2n = n + n$ — dérouler une fois : $2 \times n = S(1) \times n =
1 \times n + n = n + n$, par les deux lemmes de la commutativité de $\times$ et le
lemme A du chapitre 5 — ».

*Frontières (signalées, non comptées) :*
- **A-f1.** l. 134 : « donc $g(b) \in A_{n+1} = g[f[A_n]]$ pour un certain $n$ » —
  le passage de « $g(b) \in A_m$ avec $m \neq 0$ » à « $m$ est un successeur » est la
  dichotomie tacite du petit lemme (ch. 5). Une incise « ($m \neq 0$, donc $m = S(n)$,
  petit lemme du chapitre 5) » suffirait.
- **A-f2.** l. 77 : « $g(i) \in (n+1) \setminus \{n\} = n$ » et « $i \neq n+1$ »
  reposent tous deux sur $n \notin n$ (chapitre 4), non cité dans le pas. Une mention
  « (car $n \notin n$, chapitre 4) » clorait la trace.
- **A-f3.** l. 85 : le « avec $m \lt n$ » suppose tacitement que deux entiers
  distincts sont comparables (totalité du chapitre 5) — même dichotomie tacite qu'en
  A2 ; la retouche d'A2 peut la couvrir d'un mot.

**Passe A : 5 constats** (+ 3 frontières).

---

## Passe B — Formations ensemblistes

**B1.** l. 126 : « le théorème de récursion, appliqué à $X = \mathcal{P}(A)$, au point
de départ $A_0$ et au **pas $S \mapsto g[f[S]]$** ».
→ Le théorème de récursion (ch. 5) exige $h : X \to X$, une **fonction** — un ensemble
de couples. Le « pas » est ici une flèche informelle, jamais formée ; le chapitre 5
lui-même avait pris ce soin pour la multiplication ($h_m$ formée comme graphe,
l. 126 de `arithmetique-de-n.mdx`). Le pas d'une récursion doit être une fonction.
→ Proposition : « …et au pas $T \mapsto g[f[T]]$ — une fonction en bonne et due
forme : son graphe $\{(T, U) \in \mathcal{P}(A) \times \mathcal{P}(A) :
U = g[f[T]]\}$ se forme par séparation, total (les deux images directes existent
toujours, chapitre 3) et univoque ($U$ est déterminé par $T$) — ».

**B2.** l. 126 : « $A_\star := \bigcup_{n \in \mathbb{N}} A_n$ (axiome de la
réunion) ».
→ L'axiome de la réunion s'applique à un **ensemble** de membres : il faut d'abord
former la famille $\{A_n : n \in \mathbb{N}\}$ — l'image directe de la fonction
$n \mapsto A_n$ fournie par la récursion, une séparation dans $\mathcal{P}(A)$
(chapitre 3). La page saute ce demi-pas.
→ Proposition : « (la famille $\{A_n : n \in \mathbb{N}\}$ est l'image directe de la
fonction fournie par la récursion — séparation dans $\mathcal{P}(A)$, chapitre 3 —
et sa réunion existe par l'axiome de la réunion) ».

**B3.** l. 128 : $h$ est définie par cas, sa bonne définition et sa bijectivité sont
démontrées — mais son **graphe n'est jamais formé**, alors que c'est l'étendard du
cours (π au ch. 3, $S$ au ch. 4, $h_m$ au ch. 5, graphes de $\oplus/\otimes$ au ch. 8).
→ Proposition, une phrase avant « *$h$ est bien définie* » : « Charpente d'abord :
$h := \{(a, b) \in A \times B : (a \in A_\star \text{ et } b = f(a)) \text{ ou }
(a \notin A_\star \text{ et } (b, a) \in g)\}$, par séparation dans $A \times B$. »

**B4.** l. 77 et l. 95 : « Soit $\tau : n+1 \to n+1$ la **transposition** échangeant
$a$ et $n$ … : c'est une bijection. »
→ Jamais formée, et sa bijectivité est affirmée sans preuve ni modèle déroulé ; le mot
« transposition » n'existe nulle part en amont (grep parties I–II : zéro occurrence —
il n'arrive qu'au ch. 14, en aval).
→ Proposition, à la première occurrence (l. 77) : « — la transposition se forme par
séparation dans $(n+1) \times (n+1)$ : $\tau := \{(x, y) : (x = a \text{ et } y = n)
\text{ ou } (x = n \text{ et } y = a) \text{ ou } (x \notin \{a, n\} \text{ et }
y = x)\}$ ; totale et univoque par examen des trois cas, et $\tau \circ \tau =
\mathrm{id}_{n+1}$ : elle est inversible, d'inverse elle-même, donc bijective par le
théorème du chapitre 3 — ».

**B5.** l. 77, 79, 87 : « La **restriction** $g|_{n+1} : n+1 \to n$ … », « se
restreindrait en une injection $h|_{m+1}$ … », « la restriction de cette injection à
$n+1$ … ».
→ La notion de restriction n'est **ni définie ni formée** nulle part en amont (grep :
aucune occurrence au sens fonctionnel). Trois usages sur la page.
→ Proposition, à la première occurrence : « — restreindre est un geste licite : pour
$C \subseteq \mathrm{dom}(g)$, on pose $g|_C := \{(x, y) \in g : x \in C\}$
(séparation dans $g$), fonction de $C$ vers le même codomaine, injective dès que $g$
l'est (ce sont les mêmes couples) — ».

**B6.** l. 47 et 51 : $\sigma$, $n \mapsto 2n$ et $2\mathbb{N}$ ne sont pas formés :
pas de graphe ($\sigma := \{(n, m) \in \mathbb{N} \times \mathbb{N}^* : m = S(n)\}$,
séparation), pas d'ambiant pour $2\mathbb{N} := \{m \in \mathbb{N} : \exists k \in
\mathbb{N},\ m = 2k\}$ (séparation dans $\mathbb{N}$) ; et la bonne définition de
$\sigma$ **vers $\mathbb{N}^*$** exige $S(n) \neq 0$ (chapitre 4), jamais mentionné.
Ce sont les premières fonctions de la partie III : le lecteur doit voir la charpente
au moins une fois.
→ Proposition (l. 47) : « — en charpente : $\sigma := \{(n, m) \in \mathbb{N} \times
\mathbb{N}^* : m = S(n)\}$, séparation ; ses valeurs évitent bien $0$, car $0$ n'est
le successeur de personne (chapitre 4) — » ; et (l. 51) « l'ensemble $2\mathbb{N} :=
\{m \in \mathbb{N} : \exists k \in \mathbb{N},\ m = 2k\}$ des entiers pairs
(séparation dans $\mathbb{N}$) ».

*Frontière (signalée, non comptée) :*
- **B-f1.** l. 95 : $\beta \circ \varphi$ compose $\varphi : A \to B$ avec
  $\beta : A \to n$ — codomaine $B$ et domaine $A$ ne coïncident pas (on a
  $B \subseteq A$). La composition du chapitre 3 est énoncée pour des bouts qui se
  raccordent exactement. Un mot (« composée avec $\beta|_B$ », ou « licite car
  $B \subseteq A$ ») fermerait le scrupule.

**Passe B : 6 constats** (+ 1 frontière).

---

## Passe C — Contrat des badges

**C1.** l. 98 : « Un ensemble équipotent à l'une de ses parties strictes est dit
**Dedekind-infini**. »
→ C'est une **définition** — la seule de la page sans badge bleu (équipotence l. 31,
fini l. 59, $\le$ l. 104 ont tous le leur). Les badges voisins couvrent le théorème
(vert) et sa réciproque (rouge), pas la définition.
→ Proposition : après la phrase, ajouter
`<Badge niveau="admis">Définition : un nom pour la propriété que l'hôtel de Hilbert vient d'exhiber sur $\mathbb{N}$.</Badge>`.

**C2.** l. 136 : « tout est fabriqué à partir de $f$, $g$, $\mathbb{N}$, la récursion,
la réunion et la séparation ».
→ La facture omet **l'ensemble des parties** : la récursion est appliquée à
$X = \mathcal{P}(A)$ (l. 126), qui n'existe que par cet axiome.
→ Proposition : « …la récursion, l'ensemble des parties (pour $\mathcal{P}(A)$), la
réunion et la séparation… ».

(Les factures inexactes des badges l. 47 et l. 51 sont comptées en A3 et A2, où vivent
leurs corrections.)

*Frontière (signalée, non comptée) :*
- **C-f1.** l. 98, badge rouge : « indémontrable sans principe de choix (modèles de
  Cohen) » — l'appui méta est cité sans référence précise. La dette est déclarée vers
  le chapitre 25, ce qui la couvre au sens de la comptabilité du cours ; si l'on veut
  la précision dès ici : « (modèles à atomes de Fraenkel, transposés par Cohen en
  1963 — soldé au chapitre 25) ».

**Passe C : 2 constats** (+ 1 frontière).

---

## Passe D — Vocabulaire et cohérence

**D1.** l. 95 : « la transposition de $n$ échangeant $\beta(x)$ et $n-1$ », « une
injection de $n$ dans $n-1$ ».
→ « $n - 1$ » **n'existe pas** : aucune soustraction n'est définie sur $\mathbb{N}$
dans ce cours — le chapitre 4 (l. 65) le dit en toutes lettres (« “$n-1$” n'a aucun
sens à ce stade »), et rien ne l'a créée depuis. Dans une preuve, la notation est
fautive, pas seulement stylistique.
→ Proposition : « …le cas $n = 0$ étant vide, écrivons $n = S(p)$ (petit lemme du
chapitre 5) ; en composant avec la transposition de $n$ échangeant $\beta(x)$ et $p$,
on obtient une injection de $n$ dans $p$ — interdite par le lemme des tiroirs
($p \lt n$). »

**D2.** l. 49 (« une de ses **parties strictes** ») et l. 93 (« $B \subsetneq A$ ») :
ni le vocable « partie stricte » ni le symbole $\subsetneq$ ne sont définis en amont
(grep parties I–II : seule occurrence antérieure, ch. 8, elle-même sans définition ;
absent de `symbols.ts`).
→ Proposition, à la première occurrence (l. 49) : « …qu'une de ses parties
**strictes** — une partie $B \subseteq A$ avec $B \neq A$, ce que note
$B \subsetneq A$ ».

**D3.** l. 85 : la promesse du chapitre 4 (« dire que $n$ “a exactement $n$ éléments” :
l'idée deviendra un **théorème** au chapitre 10 ») n'est pas explicitement soldée : la
page définit « avoir $n$ éléments » et démontre l'**unicité**, mais n'énonce jamais le
versant positif — $n$ a bien $n$ éléments — qui est pourtant l'objet promis (et que le
glossaire affirme à l'entrée « Ordinal de von Neumann »).
→ Proposition, une phrase après la l. 85 : « Et la promesse du chapitre 4 est tenue :
l'identité $\mathrm{id}_n$ est une bijection $n \to n$, donc l'entier $n$ a exactement
$n$ éléments — l'étalon se mesure lui-même, et les tiroirs garantissent qu'aucune
autre mesure ne lui convient. »

*Frontière (signalée, non comptée) :*
- **D-f1.** l. 147 : « le théorème de Hartogs — lui-même démontrable dans ZF — »
  arrive sans la moindre glose : le lecteur ne peut pas savoir ce que le théorème dit.
  Dette déclarée vers le ch. 25, donc admissible ; une incise aiderait : « (à tout
  ensemble, Hartogs associe un bon ordre qui ne s'injecte pas dedans) ».

(Les mots « transposition » et « restriction », jamais définis en amont, sont comptés
avec leurs formations en B4 et B5.)

**Passe D : 3 constats** (+ 1 frontière).

---

## Passe E — Auto-contrôle

Constats écartés pendant la relecture (faux positifs évités) :

- « L'identité est une bijection » (l. 33) : dérivable en une ligne — mais nulle part
  écrite ; rangé dans A1 plutôt qu'en constat séparé.
- $\mathbb{N} \setminus \{0\}$ (l. 45) : la différence ensembliste n'est définie
  formellement nulle part, mais son usage par séparation est uniforme dans tout le
  cours depuis le ch. 5 ($f \setminus \{(0,x)\}$, $\mathbb{Z}^*$, $\mathbb{Q}^*$…) —
  pas un constat de cette page.
- Le badge rouge de la trichotomie (l. 147) : dette explicitement déclarée
  (« À solder au chapitre 25 »), conforme au contrat.
- « $|A| \le |B|$ » comme raccourci de formule (l. 104) : le scrupule de l'encart
  l. 35–37 (pas de $|A|$ isolé) s'y transpose, et la page dit prudemment que la
  relation « **imite** un ordre » (l. 106) — rien à redire.
- La preuve CSB elle-même (injectivité l. 132, surjectivité l. 134) : vérifiée pas à
  pas, correcte — modulo les formations B1–B3 et la frontière A-f1.
- La preuve du lemme des tiroirs (l. 73–81) : récurrence correcte, réduction au cas
  général correcte — modulo A1 (composée), B4 (transposition), B5 (restriction),
  A4 ($n+1 = S(n)$) et les frontières A-f2.

**Passe E : 0 constat nouveau** (les six frontières sont rattachées ci-dessus).

---

## Points de style (hors constats)

1. l. 57 : « $n = \{0, 1, \dots, n-1\}$ » — exactement l'écriture que le chapitre 4
   met en garde (pointillés, « $n-1$ »), alors que la version démontrée
   $n = \{m \in \mathbb{N} : m \lt n\}$ (ch. 5) est disponible. En prose d'annonce,
   c'est tolérable ; écrire la version démontrée serait plus fidèle. Même remarque
   pour les rappels « $n+2 = \{0, \dots, n+1\}$ » de la l. 77.
2. l. 126 : le pas « $S \mapsto g[f[S]]$ » emploie la lettre $S$ — celle du
   successeur, omniprésent dans la partie II. Écrire $T \mapsto g[f[T]]$ (la retouche
   B1 le fait déjà).
3. l. 65 et 81 : les encadrés du lemme des tiroirs n'affichent pas leurs
   quantificateurs (« Si $m \lt n$… » sans « pour tous $m, n \in \mathbb{N}$ »),
   contrairement à l'usage des encadrés des ch. 5–8.
4. La lettre $h$ sert deux fois (l'injection hypothétique $h : n \to m$ de la l. 79,
   la bijection de CSB l. 128) — sections éloignées, gêne minime.

---

## Priorités

1. **A1** — Les lemmes de composition et de réciproque (composée d'injections,
   composée de bijections, réciproque d'une bijection, identité bijective) sont
   invoqués par cinq badges verts de la page et n'existent nulle part : une phrase à
   ajouter au chapitre 3. Constat le plus lourd.
2. **A2** — La « compatibilité de l'ordre avec l'addition » (l. 51) n'existe pas au
   chapitre 5 pointé par le lien — et les chapitres 6 et 8 l'invoquent aussi : lemme à
   ajouter au chapitre 5 (résorbe trois chapitres d'un coup).
3. **B1** — Le pas de la récursion de Cantor–Schröder–Bernstein n'est pas formé comme
   fonction : c'est la preuve-vitrine du chapitre, et le ch. 5 impose ce scrupule.
4. **D1** — « $n-1$ » dans la preuve de la l. 95 : notation sans existence (aucune
   soustraction sur $\mathbb{N}$), interdite en toutes lettres par le chapitre 4.
5. **B4 + B5** — « Transposition » et « restriction » : jamais définies ni formées,
   utilisées cinq fois à des endroits porteurs.
6. **C1** — Badge bleu manquant sur la définition de Dedekind-infini.
7. **A3, A4, A5, B2, B3, B6, C2, D2, D3** — retouches d'une ligne chacune
   (attributions de chapitre, identités tacites, charpentes, glose de $\subsetneq$,
   promesse du ch. 4).

Bilan : passe A : 5 constats — passe B : 6 constats — passe C : 2 constats —
passe D : 3 constats — passe E : 0 constat. **Total : 16 constats**, 6 frontières,
4 points de style. Aucune violation du contrat du badge vert par citation fantôme
*externe* ; en revanche, A1 et A2 sont des badges verts appuyés sur des lemmes amont
inexistants — à corriger en priorité.
