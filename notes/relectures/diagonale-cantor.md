# Relecture — Chapitre 12 : « La diagonale de Cantor : ℝ est indénombrable »

Fichier relu : `src/pages/maths/partie-iii/diagonale-cantor.mdx`.
Méthode : cinq passes (A trace des dépendances, B formations ensemblistes, C contrat
des badges, D vocabulaire et cohérence, E auto-contrôle anti-faux-positifs), bouclées
jusqu'à épuisement. Les numéros de lignes renvoient au fichier relu sauf mention.

---

## Passe 0 — Provenance

**SHA du dépôt** (`git rev-parse HEAD` dans `/home/sfaurite/projets/cqfd`) :
`91600171ed5635134716a85804c1e840558af098`.

Fichiers lus (chemin — nombre de lignes — premier titre de section) :

| Fichier | Lignes | Premier titre |
|---|---|---|
| `src/pages/maths/partie-iii/diagonale-cantor.mdx` | 163 | « Tout serait-il dénombrable ? » |
| `src/pages/maths/partie-iii/denombrables.mdx` | 168 | « Dénombrable : l'infini que l'on peut mettre en file » |
| `src/pages/maths/partie-iii/equipotence.mdx` | 152 | « Peut-on compter l'infini ? » |
| `src/pages/maths/partie-i/ensembles-zf.mdx` | 171 | « Le sol de tout l'édifice » |
| `src/pages/maths/partie-ii/reels-dedekind.mdx` | 395 | « Le dernier pas : combler les trous de ℚ » |
| `src/pages/maths/partie-ii/arithmetique-de-n.mdx` | 253 | « Qu'est-ce que 2 + 2 ? » |
| `src/pages/maths/partie-i/relations-fonctions.mdx` | 148 | « Relier les objets entre eux » |
| `src/pages/maths/methodologie.mdx` | 54 | « Les quatre niveaux » |
| `src/pages/maths/comment-lire.mdx` | 100 | « Les encadrés “Hypothèses de départ” » |
| `src/data/maths/glossary.ts` | 99 | (pas de section — en-tête « Glossaire — termes du cours ») |
| `src/lib/nav/_maths.ts` | 139 | (pas de section — « Navigation — SOURCE UNIQUE de l'ordre du site ») |

`relations-fonctions.mdx` n'est pas cité en `<Prereq>` par la page relue ; il a été lu
pour vérifier (passes B et D) si l'espace de fonctions `A → B`, l'image directe et le
critère « bijective = inversible » sont établis en amont (image directe : oui, l. 39 ;
réciproque : oui, l. 51-76 ; espace de fonctions : **non**, voir constat B1).
`_maths.ts` a été lu pour contrôler la numérotation des chapitres.

**Cohérence d'ensemble (renvois dans les deux sens)** — vérifiée, rien de bloquant :

- Numérotation : équipotence = ch. 10, dénombrables = ch. 11, diagonale = ch. 12,
  hypothèse du continu = ch. 13, polynômes = ch. 17, réels = ch. 8, arithmétique
  de ℕ = ch. 5, axiome du choix = ch. 25 (`_maths.ts`). Tous les renvois numérotés de
  la page (« chapitre 10 » l. 25, 81, 133 ; « chapitre 17 » l. 151, 157 ;
  « chapitre 8 » l. 146 ; « chapitre suivant » l. 163) tombent juste.
- Les cinq cibles `<Prereq>` existent et contiennent bien ce qui est invoqué
  (énumération/dénombrable au ch. 11 ; séparation et Russell au ch. 2 ; borne sup,
  coupures et bon ordre étendu au ch. 8 ; bon ordre de ℕ au ch. 5 ; CSB au ch. 10).
- Le bloc Hypothèses du ch. 10 (« deux [rouges] dans ce chapitre, un au chapitre
  suivant ») couvre toute la partie III : ch. 12 n'a aucun badge rouge et n'ajoute
  aucune hypothèse — conforme (l. 56 le réaffirme).
- Aller-retour glossaire : « Argument diagonal », « Théorème de Cantor », « Nombre
  transcendant » pointent vers la page relue et y sont bel et bien traités ; les
  termes employés par la page (dénombrable, CSB, coupure, borne sup, bon ordre…)
  ont leurs entrées pointant vers l'amont. `symbols.ts` (entrée 2^ℕ) cohérent.
- Actifs présents : `MathsDiagonaleCantor.astro`/`.client.ts`,
  `public/videos/maths-diagonale-cantor.mp4`/`.png`.
- Un renvoi à sens unique relevé : `relations-fonctions.mdx` l. 37 promet une
  démonstration « au chapitre sur la diagonale de Cantor » que la page ne solde pas.
  Ce n'est pas une incohérence de corpus (la page existe, le renvoi est prospectif) :
  traité comme constat D6, pas comme blocage.

Comptabilité des dettes : la page déclare correctement l'ingrédient différé du ch. 11
(borne sur les racines, soldée au ch. 17) aux l. 151 et 157 — aucune dette nouvelle
créée, rien à répercuter aux ch. 25/27.

---

## Passe A — Trace des dépendances

**A1.** l. 71 : « posons $T_n(s) := \sum_{k=0}^{n} 2\,s(k)\,3^{-(k+1)}$ »
(et l. 73 : « $C := \sum_{k \lt n} 2\,s(k)\,3^{-(k+1)}$ » ; l. 96 : « les sommes
partielles $\sum_{k=2}^{n} 2^{-k}$ »).
→ Diagnostic : les sommes finies d'une famille dépendant du rang ne sont légitimées
nulle part. Le théorème de récursion du ch. 5 a un pas *indépendant du rang*
($f(S(n)) = h(f(n))$) ; la version au pas dépendant du rang n'y est qu'une remarque
(« remarque pour plus tard, sans usage immédiat »). Le ch. 11 la cite au moins
explicitement pour ses nombres triangulaires ; ici, l'encart de $J$ n'invoque *aucun*
théorème pour ses $T_n(s)$ — or c'est le fait structurel qui porte tout le transfert
à ℝ (badges verts l. 87 et l. 146). S'ajoute la convention tacite de somme vide
($C = 0$ quand $n = 0$).
→ Proposition minimale (l. 71, après la définition de $T_n(s)$) : « — sommes définies
de proche en proche, comme les nombres triangulaires du chapitre précédent :
$T_0(s) := 2\,s(0)\,3^{-1}$ et $T_{n+1}(s) := T_n(s) + 2\,s(n+1)\,3^{-(n+2)}$, par le
théorème de récursion du chapitre 5 — le pas dépend du rang : c'est la version “en
couple” qui y est notée, celle qui fait évoluer $(n, T_n(s))$. » Et l. 73, après
« la partie commune » : « (pour $n = 0$, $C = 0$ — somme vide) ».

**A2.** l. 151 : « ℝ — réunion des algébriques et des transcendants — serait réunion
de deux ensembles au plus dénombrables, donc dénombrable (deux énumérations à
choisir : un choix fini, aucun axiome du choix requis) — contradiction. »
→ Diagnostic : la parenthèse règle la question du *choix*, mais pas le *mécanisme* :
« réunion de deux au plus dénombrables ⟹ au plus dénombrable » n'est un théorème
nulle part en amont — le seul énoncé général du ch. 11 est badgé **rouge**, et son
cas vert exige des énumérations *données par une formule*. C'est exactement le cas
ici *une fois les deux énumérations choisies* (choix fini, licite), mais l'abri n'est
pas nommé ; et le micro-cas « transcendants vides ou finis » est passé sous silence
(le lemme d'énumération surjective du ch. 11 exige un ensemble *non vide*). Le badge
vert du théorème de 1874 (l. 157) s'adosse à ce pas.
→ Proposition minimale (remplacer la parenthèse) : « (deux énumérations à choisir :
un choix fini, aucun axiome du choix requis — après quoi la famille est explicitement
équipée, et le cas ZF pur de la réunion dénombrable du chapitre précédent conclut ;
si les transcendants étaient vides, la réunion se réduit aux algébriques, et s'ils
étaient finis non vides, le lemme d'énumération surjective y pourvoit en répétant) ».

**A3.** *(léger)* l. 44 : « $d(n) := 1 - s_n(n)$ » ; l. 46 : « le graphe de $d$ est
l'ensemble des couples $(n, \varepsilon)$ … tels que $\varepsilon = 1 - s_n(n)$ ».
→ Diagnostic : la soustraction n'existe pas dans ℕ — le ch. 5 le martèle (« nous
n'avons **pas de soustraction** ») ; la formule de séparation doit être lue dans ℤ
(via l'identification du ch. 6) ou posée par cas — cas que l'étape 3 (l. 48)
déroule d'ailleurs déjà. Trois mots suffisent, et le cours a fait ce scrupule ailleurs
(ch. 11 : « définissons ce compte **sans division** »).
→ Proposition minimale (l. 46, après « formule explicite ») : « — la soustraction se
lit dans ℤ, où elle existe (chapitre 6), et le résultat retombe dans $\{0,1\}$ ; de
façon équivalente : $d(n) := 1$ si $s_n(n) = 0$, et $0$ sinon — ».

**A4.** *(frontière)* l. 96 : « Il existe donc $n$ tel que $n + 1 > \frac{1}{\frac12 - x}$,
d'où … $\frac12 - 2^{-n} > x$ : la somme partielle de rang $n$ dépasse $x$. »
→ Diagnostic : les sommes partielles de cet encart commencent au rang 2 ; l'entier
$n$ fourni par la non-majoration de ℕ peut valoir 0 ou 1 (par exemple pour $x$ très
négatif), rang où « la somme partielle de rang $n$ » n'existe pas. L'énoncé reste
vrai : il suffit d'agrandir $n$.
→ Proposition minimale : « Il existe donc $n$ — que l'on peut prendre $\geq 2$,
quitte à l'agrandir : les $2^{-n}$ décroissent — tel que… ».

**A5.** *(frontière)* l. 85 : « ℝ n'est pas dénombrable — aucune liste
$r_0, r_1, r_2, \ldots$ ne l'épuise. »
→ Diagnostic : « aucune liste ne l'épuise » (aucune surjection ℕ → ℝ, répétitions
permises) est légèrement plus fort que « pas dénombrable » (pas de bijection), qui
est ce que la preuve établit. Le pont est à une ligne — lemme d'énumération
surjective du ch. 11 puis CSB — mais il n'est pas cité.
→ Proposition minimale (fin de l. 81) : « — et “aucune liste” vaut même avec
répétitions : une surjection ℕ → ℝ donnerait $|\mathbb{R}| \le |\mathbb{N}|$ par le
lemme d'énumération surjective du chapitre précédent, puis la même contradiction. »

**Passe A : 5 constats** (dont 2 frontière).

---

## Passe B — Formations ensemblistes

**B1.** l. 25 : « Notons $\{0,1\}^{\mathbb{N}}$ l'ensemble des suites infinies de 0 et
de 1, c'est-à-dire l'ensemble des fonctions $s \colon \mathbb{N} \to \{0,1\}$. »
→ Diagnostic : l'objet central du théorème principal n'est jamais *formé*. Aucun
espace de fonctions n'existe en amont (vérifié au ch. 3 : image directe et réciproque
y sont formées, pas l'ensemble des fonctions $A \to B$ ; le ch. 11 laisse aussi ses
$\mathbb{N}^k$ non formés). L'ambiant est pourtant tout trouvé :
$\mathcal{P}(\mathbb{N} \times \{0,1\})$.
→ Proposition minimale (l. 25) : « — un ensemble bien formé : chaque telle fonction
est une partie de $\mathbb{N} \times \{0,1\}$, et la séparation découpe dans
$\mathcal{P}(\mathbb{N} \times \{0,1\})$, fourni par l'axiome des parties, exactement
les relations totales et univoques ».

**B2.** l. 71 : « on peut poser $J(s) := \sup_n T_n(s)$ » ; l. 77 : « $J$ est une
injection de $\{0,1\}^{\mathbb{N}}$ dans $\mathbb{R}$ ».
→ Diagnostic : deux formations manquent. (i) La borne sup s'applique à une *partie de
ℝ* : l'ensemble $\{T_n(s) : n \in \mathbb{N}\}$ doit être découpé — séparation dans ℝ,
le graphe de $n \mapsto T_n(s)$ en paramètre : c'est mot pour mot le scrupule $S_x$
du ch. 8. (ii) « $J$ est une injection » est un énoncé sur une *fonction* : son
graphe n'est pas formé (totalité = l'étape 1 ; univocité = l'unicité du sup,
démontrée au ch. 8).
→ Proposition minimale (l. 71, à la suite de A1) : « L'ensemble des sommes
$\{T_n(s) : n \in \mathbb{N}\}$ se découpe dans ℝ par séparation, le graphe de
$n \mapsto T_n(s)$ en paramètre — le scrupule de $S_x$ au chapitre 8 — ; et $J$
elle-même a son graphe, $\{(s, x) \in \{0,1\}^{\mathbb{N}} \times \mathbb{R} : x =
\sup_n T_n(s)\}$, séparation encore : total par ce qui précède, univoque par
l'unicité de la borne supérieure (chapitre 8). »

**B3.** *(léger)* l. 151 : « si l'ensemble des transcendants était fini ou
dénombrable » (et l. 155 : « forment une partie indénombrable de ℝ »).
→ Diagnostic : cet ensemble n'est formé nulle part — une séparation dans ℝ, à dire
d'un mot (la formule « n'annule aucun polynôme non nul à coefficients entiers »
s'écrit avec le matériel du ch. 11, informalité d'évaluation déjà couverte par la
mention de l'ingrédient différé).
→ Proposition minimale : « si l'ensemble des transcendants — formé par séparation
dans ℝ — était fini ou dénombrable ».

**Passe B : 3 constats** (dont 1 léger).

---

## Passe C — Contrat des badges

**C1.** l. 66-68, encart « Somme géométrique finie » : « Pour $q \neq 1$, on a
$(1-q)(1 + q + \cdots + q^p) = 1 - q^{p+1}$ : en développant, tous les termes se
télescopent sauf les deux extrêmes. »
→ Diagnostic : identité *nouvelle* (rien en amont), démontrée par une esquisse
(« en développant » — formellement une récurrence sur $p$), et **sans badge** — alors
que deux preuves vertes s'y adossent nommément (l. 71 « par la somme géométrique
ci-dessus », l. 96 « Par la somme géométrique finie »). « Chaque affirmation notable
porte un badge » (comment-lire) : celle-ci est notable.
→ Proposition minimale (fin de l'encart) : « <Badge niveau="demontre">Identité
établie par le développement télescopique — une récurrence sur $p$ la redémontre
terme à terme pour le scrupule ; les deux encarts qui suivent la citeront.</Badge> ».

**C2.** l. 133 : « Bilan : $|E| \lt |\mathcal{P}(E)|$ strictement — où cette notation,
toujours relationnelle et jamais un objet « cardinal », signifie exactement : une
injection existe dans un sens, aucune bijection n'existe. <Badge niveau="demontre">… »
→ Diagnostic : la phrase mêle un théorème (démontré au-dessus, le vert est juste) et
la *définition* de la notation $<$ — jamais posée ailleurs (le ch. 10 ne définit que
$|A| = |B|$ et $|A| \le |B|$). Les définitions sont bleues ; la portée du badge vert
doit s'arrêter au théorème.
→ Proposition minimale : scinder en deux badges accolés (précédent au ch. 2) :
« …aucune bijection n'existe. <Badge niveau="admis">Convention de lecture — du bleu,
comme toute définition : la notation reste relationnelle, fidèle au
chapitre 10.</Badge> <Badge niveau="demontre">Conséquence directe du théorème de
Cantor et de la comparaison par injection du chapitre 10.</Badge> ».

Contrôle du reste : aucun badge vert sans abri (preuve déroulée, modèle nommé, ou
citation référencée — les badges l. 35, 87, 102, 112, 141×2, 146, 157 tiennent,
modulo A1/A2/B2 ci-dessus qui en consolident la portée) ; le bleu de la définition
l. 151 est à sa place ; le badge-citation l. 161 (Liouville/Hermite–Lindemann) est
conforme au troisième abri, références données.

**Passe C : 2 constats.**

---

## Passe D — Vocabulaire et cohérence

**D1.** l. 71 : « qui appartient à $[0,1]$ » ; l. 81 : « Même $[0,1[$ y passe »,
« $[0,1] = [0,1[ \cup \{1\}$ ».
→ Diagnostic : la notation d'intervalle n'est définie nulle part dans le cours
(balayage des chapitres 1-11 : aucune occurrence) ; sa formation (séparation dans ℝ)
n'est pas dite non plus.
→ Proposition minimale (l. 71) : « qui appartient à $[0,1]$ — notation posée ici :
$[0,1] := \{x \in \mathbb{R} : 0 \le x \le 1\}$, séparation dans ℝ, et $[0,1[$ en
exclut $1$ ».

**D2.** l. 67 : « $(1-q)(1 + q + \cdots + q^p) = 1 - q^{p+1}$ »,
« $3^{-(k+1)}$ » ; l. 96 : « $2^n \geq n+1$ », « $2^{-k}$ » ; l. 161 : « $10^{-k!}$ ».
→ Diagnostic : l'exponentiation à exposant variable n'est définie nulle part en
amont (vérifié : les chapitres antérieurs n'utilisent que des carrés, produits
explicites). Ce chapitre est le premier à en avoir besoin, et il la manipule comme
acquise — y compris dans la formule de séparation des $T_n(s)$.
→ Proposition minimale (en tête du rappel l. 66) : « Les puissances s'entendent au
sens du théorème de récursion — $q^0 := 1$, $q^{k+1} := q^k \cdot q$, le pas
« $\cdot\,q$ » étant une fonction de ℚ dans ℚ, même scrupule que $n \cdot x$ au
chapitre 8 — et $q^{-k} := (q^k)^{-1}$ pour $q \neq 0$. »

**D3.** Titre, l. 83 (« Théorème : ℝ est indénombrable »), l. 155 (« une partie
indénombrable de ℝ »).
→ Diagnostic : « indénombrable » n'est défini nulle part (ni amont, ni glossaire).
Pour ℝ, le Resultat se glose lui-même (« n'est pas dénombrable ») ; pour les
transcendants, le sens requis par la preuve est plus fort : « ni fini ni
dénombrable ». Un mot fixe tout.
→ Proposition minimale (fin de l. 81, avant le Resultat) : « Vocabulaire :
*indénombrable* signifiera « ni fini ni dénombrable » — et ℝ n'est pas fini,
puisque ℕ s'y injecte et qu'aucun fini ne loge ℕ (lemme des tiroirs, chapitre 10). »

**D4.** l. 96 : « Le réel codé par $0{,}0111\ldots$ en base 2 est, par définition des
développements, la borne supérieure des sommes partielles ».
→ Diagnostic : « par définition des développements » renvoie à une définition qui
n'existe pas — aucun chapitre ne définit les développements en base $b$ ; la règle
(borne sup des sommes partielles) est en réalité *posée* dans cette phrase même,
en écho à la construction de $J$.
→ Proposition minimale : « Le réel codé par $0{,}0111\ldots$ en base 2 est — posons
la règle de lecture, la même que pour $J$ — la borne supérieure des sommes
partielles ».

**D5.** l. 62, légende de la vidéo : « Toute liste de réels en oublie au moins un :
le nombre construit en inversant chaque chiffre diagonal n'est nulle part dans la
liste. »
→ Diagnostic : c'est mot pour mot la version *naïve* que la section « piège »
déclare fausse telle quelle (l. 93 : « une preuve qui l'ignore est **fausse** » ;
l. 102 : « la diagonale fabrique une nouvelle *écriture*, pas forcément un nouveau
*réel* »). La page se contredit d'une section à l'autre.
→ Proposition minimale (légende) : « Toute liste de réels en oublie au moins un —
l'image classique de la diagonale ; le piège des doubles écritures qu'elle doit
d'abord désamorcer est traité plus bas sur cette page. »

**D6.** `relations-fonctions.mdx` l. 37 : « les formules, écrites dans un alphabet
fini, sont « rares » en un sens que nous rendrons précis et démontrerons au chapitre
sur la diagonale de Cantor. »
→ Diagnostic : promesse explicite du ch. 3, non tenue — la page relue ne dit pas un
mot des formules (vérifié ; le ch. 13 non plus). Toutes les briques sont pourtant en
place : les textes finis sont dénombrables (ch. 11, « bibliothèque de Babel »), et
$\{0,1\}^{\mathbb{N}}$ est indénombrable (ici).
→ Proposition minimale (fin de l. 56) : « Et une promesse du chapitre 3 est tenue au
passage : les formules sans paramètres — des textes finis sur un alphabet fini —
forment un ensemble dénombrable (chapitre précédent) ; les fonctions
$\mathbb{N} \to \{0,1\}$, elles, débordent toute liste. Presque aucune fonction n'est
donnée par une formule. »

**Passe D : 6 constats.**

---

## Passe E — Auto-contrôle anti-faux-positifs

Chaque constat a été relu contre le passage complet ; reclassements opérés :

- A4 et A5 marqués **frontière** (l'énoncé reste vrai, seul le raccord manque).
- A3 et B3 marqués **légers**.
- Sobriété vérifiée pour A1 (aucune définition des sommes sans récursion n'est
  disponible), A2 (le cas explicite du ch. 11 est bien l'outil le plus sobre — pas
  besoin d'un lemme nouveau), D2 (aucune puissance n'existe en amont, grep à l'appui).
- Rejetés comme faux positifs pendant la relecture : la surjectivité tirée de la
  bijection (l. 40 — justifiée sur place) ; l'absence de bloc Hypothèses (couvert
  par le ch. 10 pour toute la partie III) ; les graphes des petites applications
  ($n \mapsto \delta_n$, $A \mapsto \varphi[A]$… — style maison de la partie III,
  formules explicites données) ; le « rappel » l. 66 au type d'encart discutable
  (précédent au ch. 11 → point de style S4) ; « cinq lignes » l. 112 (→ style S1).

**Passe E : 0 constat.**

**Bouclage** : les cinq passes ont été rejouées une seconde fois sur le texte muni
des constats ci-dessus — aucune passe n'a plus rien produit. Arrêt.

---

## Points de style (hors constats)

**S1.** l. 112 : « Preuve complète ci-dessous — cinq lignes » — l'encart compte cinq
étapes *et* une conclusion ; « cinq étapes » serait exact.

**S2.** l. 161 : « au sens de la cardinalité » puis « au sens des cardinaux » — le
cours refuse le cardinal-objet (ch. 10, et l. 133 ici même) ; « au sens de la
comparaison des tailles » serait fidèle à la lettre de ce refus.

**S3.** l. 161 : « tel $\sum_{k\ge 1} 10^{-k!}$ » — série infinie et factorielle,
machinerie non construite avant la partie V ; trois mots d'anticipation (« une
série — notation anticipée, partie V ; lire : borne sup des sommes partielles »)
éviteraient la seule notation flottante de la page.

**S4.** l. 66 : encart typé « rappel » pour un contenu nouveau (précédent identique
au ch. 11 ; simple signalement, le badge de C1 règle l'essentiel).

---

## Priorités

1. **A1 + B2** — légitimer les sommes partielles $T_n(s)$ (récursion au pas dépendant
   du rang) et former $\{T_n(s)\}$ et le graphe de $J$ : c'est la charpente du
   transfert à ℝ, sur laquelle reposent les badges verts l. 87 et l. 146.
2. **D2** — définir les puissances (première apparition dans le cours ; la formule de
   séparation des $T_n(s)$ en dépend).
3. **C1** — badger la somme géométrique finie (deux preuves vertes s'y adossent).
4. **A2** — ancrer « réunion de deux au plus dénombrables » au cas explicite ZF pur
   du ch. 11 (le badge vert du théorème de 1874 en dépend) + micro-cas vide/fini.
5. **B1** — former $\{0,1\}^{\mathbb{N}}$ (l'objet du théorème principal).
6. **D5** — corriger la légende vidéo qui énonce la version naïve démentie plus bas.
7. **D6** — solder la promesse du chapitre 3 (une phrase, briques déjà en place).
8. **C2, D1, D3, D4** — taxonomie et notations (convention $<$ à bleuir ;
   intervalles ; « indénombrable » ; « par définition des développements »).
9. **A3, A4, A5, B3** — légers et frontière (soustraction lue dans ℤ ; rang $n \ge 2$ ;
   glose « aucune liste » ; séparation des transcendants).

Aucune violation du contrat du badge vert au sens fort (aucun vert sans preuve, sans
modèle ou sans référence) ; aucun axiome caché ; les constats consolident des
légitimations internes, des formations et des notations. Total : **16 constats**
(A 5, B 3, C 2, D 6, E 0) et 4 points de style.
