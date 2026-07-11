# Relecture — chapitre « Les ensembles dénombrables » (partie III)

Fichier relu : `src/pages/maths/partie-iii/denombrables.mdx`.
Méthode : cinq passes (A trace des dépendances, B formations ensemblistes, C contrat des badges,
D vocabulaire/cohérence, E anti-faux-positifs), bouclées jusqu'à épuisement — la seconde boucle
complète n'a rien produit de neuf.

---

## Passe 0 — provenance

**SHA du dépôt** : `91600171ed5635134716a85804c1e840558af098` (branche main, arbre propre).

Fichiers lus (chemin — lignes — premier titre de section) :

| Fichier | Lignes | Premier titre |
|---|---|---|
| `src/pages/maths/partie-iii/denombrables.mdx` | 168 | « Dénombrable : l'infini que l'on peut mettre en file » |
| `src/pages/maths/partie-iii/equipotence.mdx` | 152 | « Peut-on compter l'infini ? » |
| `src/pages/maths/partie-ii/entiers-naturels.mdx` | 208 | « L'idée : chaque nombre est l'ensemble de ceux d'avant » |
| `src/pages/maths/partie-ii/arithmetique-de-n.mdx` | 253 | « Qu'est-ce que 2 + 2 ? » |
| `src/pages/maths/partie-ii/entiers-relatifs.mdx` | 258 | « Une soustraction qui n'existe pas encore » |
| `src/pages/maths/partie-ii/rationnels.mdx` | 215 | « La division en attente » |
| `src/pages/maths/partie-ii/reels-dedekind.mdx` | 395 | « Le dernier pas : combler les trous de ℚ » |
| `src/pages/maths/methodologie.mdx` | 54 | « Les quatre niveaux » |
| `src/pages/maths/comment-lire.mdx` | 100 | « Les encadrés “Hypothèses de départ” » |
| `src/data/maths/glossary.ts` | 99 | (fichier TS — pas de section ; tableau `GLOSSAIRE`) |

**Cohérence d'ensemble** : vérifiée, aucune incohérence bloquante.
- Les six `<Prereq>` du corps pointent vers des pages existantes, toutes lues.
- Renvois dans les deux sens : la fin d'`equipotence.mdx` annonce « les dénombrables » ; la page
  relue s'ouvre sur « Au chapitre précédent » avec Prereq vers equipotence ; sa fin annonce la
  diagonale de Cantor (page présente au glossaire).
- Numérotation des chapitres cohérente : ch. 5 = arithmétique de ℕ (le fichier se désigne ainsi),
  ch. 25 = axiome du choix (même numéro au ch. 10 et ici), ch. 17 = polynômes (compatible avec
  l'ordre du glossaire, partie IV = ch. 14–17), ch. 13 = hypothèse du continu (ch. 10).
- Glossaire : l'entrée « Dénombrable » renvoie vers la page relue — elle ne compte donc pas comme
  définition amont (règle ★ de la passe D) ; la définition amont est bien sur la page (l. 24).
- La vidéo `maths-zigzag-rationnels` (l. 73) n'a pas été vérifiée (hors corpus) ; sa légende est
  cohérente avec le texte (l. 75 fait la passerelle grille des couples / grille des fractions).

---

## Passe A — trace des dépendances

**A1. (l. 44) Outil de « retranchement » mal étiqueté et mal pointé.**
> « d'où $2 \le 1$ en retranchant $2k'$ de chaque côté — la compatibilité de l'ordre avec
> l'addition — absurde aussi » (Prereq vers `arithmetique-de-n`)

Diagnostic : retrancher un terme commun d'une inégalité, c'est la **simplification**
($x+z \le y+z \Rightarrow x \le y$), pas la compatibilité (qui est le sens direct, ajouter).
Et ni l'une ni l'autre n'est énoncée au ch. 5 : les deux vivent au **ch. 6**, mini-lemmes de
l'encart « ≤ est bien défini, total, compatible avec + » (`entiers-relatifs.mdx`, l. 170).
Le renvoi actuel pointe donc le mauvais chapitre avec le mauvais nom.
Proposition minimale : « — la *simplification* de l'ordre par l'addition, mini-lemme du
<Prereq href="/maths/partie-ii/entiers-relatifs">chapitre 6</Prereq> — ».
(Le même couple nom/cible existe au ch. 10, l. 51, hors périmètre de cette relecture, mais à
retoucher d'un même geste si l'on veut l'uniformité.)

**A2. (l. 50) Bien-définition de $f$ : l'unicité de $k$ dans chaque forme n'est pas couverte.**
> « Le fait préliminaire garantit que $f$ est bien définie sur tout $\mathbb{N}$, sans ambiguïté. »

Diagnostic : le fait préliminaire (l. 44) donne l'existence d'une écriture $2k$ *ou* $2k+1$ et
l'exclusion mutuelle **entre les deux formes** — mais pas l'unicité de $k$ *dans* chaque forme.
Or $f(2k) := -k$ exige : $2k = 2k' \Rightarrow k = k'$ (et de même pour $2k+1$), sans quoi
l'univocité du graphe n'est pas acquise. Les deux ingrédients sont disponibles en amont :
$n \mapsto 2n$ est injective (strictement croissante, chapitre précédent, encart « Encore plus
fort ») et $S$ est injective (ch. 4).
Proposition minimale, après la phrase citée : « — et le $k$ y est unique : $n \mapsto 2n$ est
injective (<Prereq href="/maths/partie-iii/equipotence">chapitre précédent</Prereq>, la bijection
sur les pairs), et $S$ l'est aussi, donc $2k+1 = 2k'+1$ force $k = k'$. »

**A3. (l. 94) Injectivité de $\pi$ : la monotonie de $T$ est un sous-pas tacite.**
> « ainsi $k$ est *le* plus grand indice $j$ vérifiant $T_j \le N$ — il est déterminé par $N$ seul. »

Diagnostic : de $T_k \le N \lt T_{k+1}$ on ne tire « $k$ est le plus grand » qu'en sachant que
$T$ est croissante ($j \ge k+1 \Rightarrow T_j \ge T_{k+1} \gt N$). Cette monotonie
($T_{j+1} = T_j + (j+1) \gt T_j$, récurrence immédiate) n'est énoncée nulle part — c'est
exactement le type de sous-pas que la preuve déroulée doit tracer.
Proposition minimale : « ($T$ est croissante — $T_{j+1} = T_j + (j+1) \gt T_j$, récurrence
immédiate — donc tout $j \gt k$ donne $T_j \ge T_{k+1} \gt N$) ».

**A4. (l. 98) Corollaire $A \times B$ : l'application produit n'est ni une composée ni un acquis.**
> « donnent la bijection $N \mapsto (f(m), g(n))$, où $(m,n) := \pi^{-1}(N)$ — une composition de
> bijections. » Badge : « Composition explicite de bijections déjà établies. »

Diagnostic : la flèche est $(f \times g) \circ \pi^{-1}$, et le facteur $f \times g :
(m,n) \mapsto (f(m), g(n))$ — l'application **produit** — n'est pas une composée de bijections
déjà établies : sa bijectivité (deux lignes, composante par composante) n'est démontrée nulle part
en amont dans le corpus. Le badge « déjà établies » survend d'un cran.
Proposition minimale : « — où l'application produit $(m,n) \mapsto (f(m), g(n))$ est bijective
composante par composante (injective : un couple est déterminé par ses deux coordonnées, et $f$,
$g$ séparent ; surjective de même), et la composée avec $\pi^{-1}$ conclut. »

**A5. (l. 156) Suites finies : la lecture « longueur $k+1$ = couple » est tacite.**
> « une bijection $h_k : \mathbb{N}^k \to \mathbb{N}$ en induit une pour $\mathbb{N}^{k+1}$ via
> $(s, n) \mapsto \pi(h_k(s), n)$ »

Diagnostic : les éléments de $\mathbb{N}^{k+1}$ sont des fonctions de domaine $k+1$, pas des
couples $(s, n)$ : la flèche réellement définie est $s' \mapsto \pi(h_k(s'{\restriction}k),\,
s'(k))$, et elle repose sur le fait structurel que $s' \mapsto (s'{\restriction}k,\, s'(k))$ est
une bijection $\mathbb{N}^{k+1} \to \mathbb{N}^k \times \mathbb{N}$ (restriction/prolongement) ;
la bijectivité de $h_{k+1}$ (par composantes, $\pi$ et $h_k$ étant bijectives) est tacite aussi.
Proposition minimale : « via $s' \mapsto \pi\big(h_k(s'{\restriction}k),\, s'(k)\big)$ — une suite
de longueur $k+1$ *est* le couple (sa restriction à $k$, sa dernière valeur), et cette lecture est
bijective ; $h_{k+1}$ hérite alors de la bijectivité de $h_k$ et de $\pi$. »

**A6. (l. 163) Algébriques : polynôme nul et ensembles de racines vides.**
> « il y a donc une énumération explicite $P_0, P_1, P_2, \dots$ de ces polynômes » ; « Les racines
> de chaque $P_i$, en nombre fini, s'énumèrent par ordre croissant — une partie finie non vide de
> $\mathbb{R}$ »

Diagnostic double. (i) « ces polynômes » énumère *tous* les polynômes à coefficients entiers, y
compris le polynôme nul — dont l'ensemble de racines est $\mathbb{R}$ entier, pas un fini : il faut
restreindre aux polynômes **non nuls** (la borne « au plus $d$ racines » n'est d'ailleurs énoncée
que pour eux). (ii) « non vide » est faux en général : $X^2 + 1$ n'a aucune racine réelle ; le cas
vide doit être gagé pour que les énumérations uniformes existent (répéter une racine fixe, p. ex.
$0$, racine de $X$).
Proposition minimale : « une énumération explicite $P_0, P_1, \dots$ des polynômes **non nuls** » ;
puis « — une partie finie de $\mathbb{R}$, éventuellement vide (auquel cas on énumère $0$, racine
de $X$, en boucle) ; si elle est non vide, totalement ordonnée, elle se range de façon unique en
croissant… ».

**A7. (l. 158) Alphabet : la non-vacuité est une hypothèse utilisée.**
> « Fixons un alphabet fini $\Sigma$ […] Dans l'autre sens, $\mathbb{N}$ s'injecte dans les
> textes : « a », « aa », « aaa », … »

Diagnostic : si $\Sigma = \varnothing$, l'ensemble des textes se réduit à la suite vide et
$\mathbb{N}$ ne s'y injecte pas ; l'injection retour utilise un caractère « a », donc $\Sigma$
non vide — hypothèse jamais posée.
Proposition minimale : « Fixons un alphabet fini **non vide** $\Sigma$ — disons qu'il contient un
caractère « a » — ».

**A8. (l. 24, 30–32, 139–141, 163) « Au plus dénombrable » ⟷ $|E| \le |\mathbb{N}|$ : une
équivalence employée, jamais établie.**
> l. 24 : « Il est **au plus dénombrable** s'il est fini ou dénombrable. » ; l. 139 (titre du
> Résultat) : « Réunion dénombrable d'ensembles au plus dénombrables » vs l. 141 (formule) :
> « $\forall i,\ |A_i| \le |\mathbb{N}|$ » ; l. 163 : « — au plus dénombrable, dans ZF pur » ;
> l. 32 (badge du lemme) : « En particulier, un fini non vide admet toujours une telle
> énumération ».

Diagnostic : la page utilise « au plus dénombrable » (défini : fini ou dénombrable) comme synonyme
de « $|E| \le |\mathbb{N}|$ ». Le sens facile (fini ou dénombrable $\Rightarrow$ injection dans
$\mathbb{N}$ : bijection avec $n \subseteq \mathbb{N}$, ou avec $\mathbb{N}$) est utilisé au badge
du lemme (« un fini non vide admet… ») et par le titre du Résultat — une ligne, jamais écrite. Le
sens difficile ($|E| \le |\mathbb{N}| \Rightarrow$ fini ou dénombrable, qui exige « toute partie
infinie de $\mathbb{N}$ est dénombrable », démontré nulle part en amont) est affirmé en passant à
la l. 163 (« au plus dénombrable, dans ZF pur ») — sans y être nécessaire, puisque la conclusion
finale passe par Cantor–Schröder–Bernstein.
Proposition minimale : (a) après le lemme (l. 32), une phrase : « Et « au plus dénombrable » entre
bien dans ce cadre, dans le sens qui nous servira : un fini est équipotent à un entier
$n \subseteq \mathbb{N}$, un dénombrable à $\mathbb{N}$ — dans les deux cas $|E| \le |\mathbb{N}|$.
(La réciproque est vraie aussi, mais demande d'énumérer les parties infinies de $\mathbb{N}$ ;
rien sur cette page n'en a besoin.) » ; (b) l. 163, remplacer « — au plus dénombrable, dans ZF
pur » par « — elle s'injecte donc dans $\mathbb{N}$, dans ZF pur » ; (c) au Résultat l. 139,
préciser au besoin le titre : « (au sens : $|A_i| \le |\mathbb{N}|$) ».

*Constats-frontière (signalés, non comptés)* :
- (l. 32) l'injectivité de $x \mapsto \min e^{-1}(x)$ n'est pas justifiée — une demi-ligne
  (« l'image par $e$ du numéro minimal redonne $x$ ») suffirait ;
- (l. 135) « on écarte les $A_i$ vides » : le patch (réindexer, ou répéter un élément fixe de la
  réunion si elle est non vide) reste tacite dans l'esquisse ;
- (l. 44) « $2 \le 1$ […] absurde » : la non-vérité de $2 \le 1$ (antisymétrie + $0$ n'est pas un
  successeur, le modèle du « $x+5=3$ » du ch. 5) est tacite mais routinière ;
- (l. 92) le lemme cité est démontré au ch. 8 **pour $\mathbb{Z}$** ; son application à une partie
  de $\mathbb{N}$ passe par l'identification $\mathbb{N} \subseteq \mathbb{Z}$ et l'accord des
  ordres (plongement, ch. 6) — une demi-parenthèse le dirait.

**Passe A : 8 constats** (+ 4 frontières signalées).

---

## Passe B — formations ensemblistes

**B1. (l. 88 et 156) Récursion « à rang » utilisée deux fois, alors que le théorème du ch. 5 est à
pas fixe.**
> l. 88 : « par le théorème de récursion : $T_0 := 0$ et $T_{k+1} := T_k + (k+1)$ » ;
> l. 156 : « Le théorème de récursion (chapitre 5) construit ainsi une suite explicite de
> bijections $(h_k)$ »

Diagnostic : le théorème du ch. 5 s'énonce avec un pas $h : X \to X$ **indépendant du rang** ;
ici les deux pas dépendent de $k$ ($T_k + (k+1)$ ; l'extension de $h_k$ utilise $k$). Le ch. 5
signale la version générale $f(S(n)) = H(n, f(n))$ mais en remarque, « sans usage immédiat » —
l'usage, c'est ici, et il est tacite. De plus, le pas d'une récursion doit être une **fonction** :
pour $T$, faire évoluer le couple ($X = \mathbb{N} \times \mathbb{N}$, pas $(k, t) \mapsto
(k+1,\, t + k + 1)$, graphe par séparation) ; pour $(h_k)$, même geste avec pour ambiant des
valeurs $X = \mathcal{P}\big(\mathcal{P}(\mathbb{N} \times \mathbb{N}) \times \mathbb{N}\big)$
(chaque $h_k$ est une partie de $\mathcal{P}(\mathbb{N} \times \mathbb{N}) \times \mathbb{N}$).
Proposition minimale, à la première occurrence (l. 88) : « — la version « à rang » du théorème,
obtenue comme le ch. 5 l'annonce en faisant évoluer le couple $(k, T_k)$ : le pas
$(k, t) \mapsto (k+1,\, t+k+1)$ est une fonction $\mathbb{N} \times \mathbb{N} \to \mathbb{N}
\times \mathbb{N}$, graphe par séparation — » ; et à la l. 156, renvoyer : « (même version « à
rang » que pour les $T_k$, le couple $(k, h_k)$ évoluant dans $\mathbb{N} \times
\mathcal{P}(\mathcal{P}(\mathbb{N} \times \mathbb{N}) \times \mathbb{N})$) ».

**B2. (l. 154) $\mathbb{N}^{\lt\mathbb{N}}$ : la réunion est posée sans former la famille — alors
qu'un ambiant direct existe.**
> « l'ensemble de toutes les suites finies est $\mathbb{N}^{\lt\mathbb{N}} :=
> \bigcup_{k \in \mathbb{N}} \mathbb{N}^k$ »

Diagnostic : l'axiome de la réunion s'applique à un *ensemble* d'ensembles ; la famille
$\{\mathbb{N}^k : k \in \mathbb{N}\}$ n'est pas formée. Nul besoin de remplacement : une suite
finie est une partie de $\mathbb{N} \times \mathbb{N}$, donc une **séparation directe** dans
$\mathcal{P}(\mathbb{N} \times \mathbb{N})$ suffit.
Proposition minimale : « $\mathbb{N}^{\lt\mathbb{N}} := \{\, f \in \mathcal{P}(\mathbb{N} \times
\mathbb{N}) : \exists k \in \mathbb{N},\ f \text{ est une fonction de } k \text{ dans }
\mathbb{N} \,\}$ — une séparation dans $\mathcal{P}(\mathbb{N} \times \mathbb{N})$, qu'on lit
$\bigcup_{k} \mathbb{N}^k$. » (À loger naturellement dans le badge bleu réclamé en C2.)

**B3. (l. 32, 46–50, 106, 108, 156, 158) Aucun « mot de charpente » pour les applications
assemblées du chapitre.**
Diagnostic : le chapitre assemble de nombreuses fonctions nouvelles par cas ou par formule
($e$ du lemme, $f$ par parité, $j(r) := (p_r, q_r)$, $(z,q) \mapsto \pi(g(z), q-1)$,
$N \mapsto h_{k+1}^{-1}(n)$, les codages de textes) sans jamais dire qu'elles *sont* des ensembles
— alors que les ch. 4 à 8 ont payé ce dû à chaque étage, et que le ch. 7 a montré le geste du
« mot de charpente, une fois pour toutes ». La partie III n'a pas de dispense.
Proposition minimale, une seule phrase à la première fonction assemblée (après le lemme l. 32 ou à
la définition de $f$ l. 46) : « Mot de charpente, une fois pour toutes — le moule du
<Prereq href="/maths/partie-ii/rationnels">chapitre 7</Prereq> : chaque application de ce chapitre
a pour graphe une partie d'un produit cartésien nommé, formée par séparation ; totalité et
univocité sont, à chaque fois, exactement les points que le texte vérifie. Nous ne le redirons
pas. »

**Passe B : 3 constats.**

---

## Passe C — contrat des badges

**C1. (l. 163) Badge vert « Démontré modulo un ingrédient différé » : hors des trois abris, et
avec une phrase interne contradictoire.** *(constat le plus grave de la page)*
> « Démontré **modulo un ingrédient différé** : la borne « au plus $d$ racines pour un degré
> $d$ », établie au chapitre 17 et citée ici comme anticipation explicite. Jusqu'à ce chapitre,
> ce théorème est annoncé, pas utilisé. »

Diagnostic, en trois volets. (i) Le contrat du vert connaît trois abris : preuve déroulée,
routinier sur modèle déroulé, citation avec **référence externe** précise (méthodologie, l. 23-28).
« Complet modulo un chapitre futur » n'en est aucun : la preuve sur page est explicitement trouée,
et la « citation » pointe vers l'aval du cours, pas vers une référence. (ii) La phrase « ce
théorème est annoncé, pas utilisé » est contredite trois lignes plus haut : la preuve de l'encart
**l'utilise** (la finitude de chaque ensemble de racines en dépend entièrement) ; elle n'est vraie
que re-scopée (« rien d'autre dans le cours ne s'y appuie d'ici le ch. 17 »). (iii) L'« ingrédient
différé » n'est pas seul : l'évaluation d'un polynôme en un réel (puissances et sommes finies, par
récursion sur le modèle du $n \cdot x$ du ch. 8) et le « degré » relèvent du même appareil
différé — le badge minimise.
Proposition minimale, dans la voix du cours : occuper réellement l'abri « citation » et re-scoper
la phrase — « Démontré, **au chapitre 17 près** : la borne « au plus $d$ racines pour un degré
$d$ » y sera établie ; en attendant, elle a le statut d'une citation — référence externe : tout
traité d'algèbre, p. ex. Landau, *Grundlagen der Analysis*, ou [réf. ↗ vers l'article standard],
comme le ch. 8 l'a fait pour les vérifications de $\mathbb{R}$. L'appareil même des polynômes
(évaluation — sommes finies et puissances par récursion, le geste du $n \cdot x$ du ch. 8 —,
degré) est différé avec elle. D'ici le chapitre 17, cet encart — hors du fil principal — est le
seul endroit du cours à s'appuyer sur cette anticipation, et rien d'autre ne s'y adosse. »
*Frontière sur la couleur* : l'encart étant un « plusloin » explicitement étiqueté « esquisse
honnête » et la dette déclarée, on peut défendre le vert une fois l'abri-citation occupé ; sans
référence externe, le vert est une violation du contrat. Toute retouche de la comptabilité des
dettes est à répercuter aux ch. 25/27 selon la règle du cours.

**C2. (l. 154) Des définitions notables sans badge bleu.**
> « Formalisons d'abord l'objet : une **suite finie** d'entiers est une fonction dont le domaine
> est un entier de von Neumann — $\mathbb{N}^k$ désigne […] $\mathbb{N}^{\lt\mathbb{N}} :=
> \bigcup_{k \in \mathbb{N}} \mathbb{N}^k$. »

Diagnostic : trois définitions (suite finie, $\mathbb{N}^k$, $\mathbb{N}^{\lt\mathbb{N}}$) qui
portent un théorème entier — sans la moindre pastille, alors que la définition de « dénombrable »
(l. 24) porte le bleu réglementaire et que toute définition notable du cours en porte un.
Proposition minimale : ajouter à la fin du paragraphe
`<Badge niveau="admis">Trois définitions — suite finie, ℕ^k, ℕ^{<ℕ} ; la dernière se forme par
séparation dans P(ℕ×ℕ) (une suite finie est une partie de ℕ×ℕ qui se trouve être une fonction de
domaine un entier). Rien à démontrer, tout à former.</Badge>` — ce qui solde B2 du même geste.

**C3. (l. 143) Badge rouge : le « mis en défaut » ne nomme aucun modèle.**
> « le choix dénombrable (ACω) suffit à le démontrer, et des modèles de ZF sans choix le mettent
> en défaut. »

Diagnostic : l'indécidabilité est un théorème méta ; le ch. 10, pour ses deux rouges, nommait
« les modèles de Cohen ». Ici, « des modèles » reste anonyme — la précision qui fait la valeur du
rouge manque d'un cran par rapport au standard que la partie III s'est elle-même fixé.
Proposition minimale : « et des modèles de ZF sans choix le mettent en défaut — celui de
Feferman–Lévy, où $\mathbb{R}$ lui-même est réunion dénombrable d'ensembles dénombrables ; détails
au chapitre 25. »

*Constat-frontière (signalé, non compté)* : (l. 147) le vert du « cas explicite » s'abrite sur la
preuve de la l. 135 — déroulée pour l'essentiel, mais dont le patch des $A_i$ vides reste tacite
(cf. frontière de la passe A).

**Passe C : 3 constats** (+ 1 frontière signalée).

---

## Passe D — vocabulaire et cohérence

**D1. (l. 21) « Aucune hypothèse nouvelle — à une exception près » : faux ami au sens du ch. 1.**
> « **Aucune hypothèse nouvelle** — à une exception près, signalée le moment venu par le badge
> rouge « indécidable » »

Diagnostic : « hypothèse nouvelle » = axiome ajouté (sens fixé au ch. 1). « À une exception près »
annonce donc littéralement qu'un axiome est ajouté — or rien n'est adopté (le badge l. 143 le dit
lui-même : « Rien n'est adopté ici »). Le ch. 10 avait paré le coup (« que nous n'adoptons pas
ici ») ; ici la précaution manque.
Proposition minimale : « **Aucune hypothèse nouvelle** — mais un avertissement, signalé le moment
venu par le badge rouge « indécidable », comme au chapitre précédent : un théorème « standard » de
ce chapitre cache un principe de choix qui **ne se déduit pas** de ZF — et que nous n'adopterons
pas. »

**D2. (l. 86 vs l. 154) Collision de notation : $\mathbb{N}^2$ contre $\mathbb{N}^k$.**
> l. 86 : « $D_k := \{(m,n) \in \mathbb{N}^2 : m+n = k\}$ » ; l. 154 : « $\mathbb{N}^k$ désigne
> l'ensemble des fonctions de $k$ vers $\mathbb{N}$ »

Diagnostic : sur la même page, $\mathbb{N}^2$ (l. 86) désigne le carré cartésien (des couples) et
$\mathbb{N}^k$ (l. 154) l'ensemble des fonctions de domaine $k$ — pour $k = 2$, deux ensembles
distincts sous le même symbole. La notation doit être uniforme.
Proposition minimale : écrire « $(m,n) \in \mathbb{N} \times \mathbb{N}$ » à la l. 86 (seule
occurrence de $\mathbb{N}^2$-cartésien), comme la l. 79 le fait déjà.

**D3. (l. 32) Notation $e^{-1}(x)$ pour une fibre d'application non injective : jamais définie.**
> « l'application $x \mapsto \min e^{-1}(x)$ (bon ordre de $\mathbb{N}$, aucun choix) »

Diagnostic : en amont, l'exposant $-1$ n'existe que pour la réciproque d'une bijection (ch. 3 via
ch. 10) ; $e$ est une surjection quelconque, et $e^{-1}(x)$ — l'image réciproque d'un point —
est une notation neuve, non introduite.
Proposition minimale : « $x \mapsto \min \{\, n \in \mathbb{N} : e(n) = x \,\}$ — partie non vide
de $\mathbb{N}$ par surjectivité, séparation puis bon ordre ».

**D4. (l. 21) La liste des acquis omet $\mathbb{R}$, deux fois sollicité.**
> « Les axiomes ZF et tout ce qui en a déjà été déduit : $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$,
> l'équipotence et le théorème de Cantor–Schröder–Bernstein. »

Diagnostic : le chapitre invoque le ch. 8 (lemme du plus grand élément, l. 92) et loge les
algébriques dans $\mathbb{R}$ (l. 162-163) ; « tout ce qui en a déjà été déduit » couvre certes
$\mathbb{R}$, mais l'énumération qui suit le laisse en angle mort — l'annonce doit être conforme
au contenu.
Proposition minimale : « … $\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$, l'équipotence
et le théorème de Cantor–Schröder–Bernstein. »

**D5. (l. 92) Soustractions écrites dans $\mathbb{N}$, où le cours martèle qu'elle n'existe pas.**
> « Posons $n := N - T_k \in \mathbb{N}$ » ; « Posons $m := k - n \in \mathbb{N}$ »

Diagnostic : la partie II insiste — pas de soustraction dans $\mathbb{N}$. La lecture licite passe
par $\mathbb{Z}$ (différence positive ou nulle, donc dans l'image de $\mathbb{N}$ par la forme
canonique — le geste que le ch. 8, l. 224, prend soin d'expliciter) ou par le témoin de $\le$.
Ici le geste est muet.
Proposition minimale, à la première occurrence : « Posons $n := N - T_k$ — différence prise dans
$\mathbb{Z}$, positive ou nulle puisque $T_k \le N$, donc dans $\mathbb{N}$ par la
<Prereq href="/maths/partie-ii/entiers-relatifs">forme canonique</Prereq>, le geste du
chapitre 8 — ».

*Constats-frontière (signalés, non comptés)* :
- (l. 147) « C'est la **première fois** dans ce cours qu'un théorème « standard » révèle une
  hypothèse cachée » : défendable — les deux rouges du ch. 10 étaient présentés comme
  caractérisation suggérée et question ouverte, non comme théorèmes de manuel à preuve trouée —
  mais un lecteur comptera trois rouges avant celui-ci ; préciser « qu'un théorème que les manuels
  *démontrent* révèle, dans sa preuve même, une hypothèse cachée » verrouillerait le compte ;
- (l. 79/88) la notation $\frac{(m+n)(m+n+1)}{2}$ suppose aussi l'*unicité* de la moitié
  ($2y = 2y'\Rightarrow y = y'$ : l'injectivité du doublement, ch. 10) — l'encart justifie
  l'existence, l'unicité reste tacite ;
- (l. 163) « polynôme » est glosé sur place (« *est* la suite finie de ses coefficients »),
  conforme à la définition à venir du ch. 17 (glossaire) — acceptable pour une esquisse, mais
  « degré » et « annule » restent des mots d'aval (couverts par la retouche C1).

**Passe D : 5 constats** (+ 3 frontières signalées).

---

## Passe E — auto-contrôle anti-faux-positifs

Chaque constat ci-dessus a été relu contre le texte complet ; candidats écartés :
- l'existence de la parité (l. 44) : $2(k+1) = (2k+1)+1$ est bien couvert par distributivité et
  lois de $+$ (ch. 5) — pas de constat ;
- « fixons $e_0 \in E$ » (l. 32) : instanciation existentielle sur un ensemble non vide, aucun
  choix — pas de constat ;
- « z ≤ 0 ou z ≥ 1 » (l. 52) : totalité de l'ordre de $\mathbb{Z}$ + point (v) du ch. 6 — outils
  en place, pas de constat ;
- le « choix fini et explicite » du codage (l. 158) : correct, un fini non vide s'instancie sans
  axiome — pas de constat ;
- « l'opposé est injectif dans $\mathbb{Z}$ » (l. 54) : c'est l'unicité $[(0,n)] = [(0,m)]
  \Rightarrow n = m$, démontrée dans l'encart « forme canonique » du ch. 6 — pas de constat ;
- la légende de la vidéo (l. 73), qui « numérote toutes les fractions » avec répétitions : le
  texte (l. 75) et la preuve par CSB assument l'écart — pas de constat.
Les points utiles mais discutables ont été versés en « frontière » dans leurs passes (7 au total),
conformément à la consigne.

**Passe E : 0 constat.**

---

## Points de style (aucune action requise)

- (l. 98 vs l. 48/108) Les bijections locales du corollaire s'appellent $f$ et $g$, alors que $f$
  est déjà, sur la même page, la bijection $\mathbb{N} \to \mathbb{Z}$ dont la l. 108 reparle
  (« la bijection $f$ construite plus haut ») ; renommer les locales ($u$, $v$) éviterait la
  microseconde d'hésitation.
- (l. 92) « c'est le lemme […] démontré au chapitre des réels » : ajouter « (pour $\mathbb{Z}$ —
  donc pour toute partie de $\mathbb{N}$, via l'identification) » — cf. frontière A.
- (l. 67) « À l'infini, doubler ne grossit pas. » — excellent ; rien à toucher au souffle du
  texte, qui est ici particulièrement réussi (la file d'attente, le scandale de la densité, la
  bibliothèque de Babel).

---

## Priorités

1. **C1** (l. 163) — badge vert « modulo un ingrédient différé » : hors des trois abris du
   contrat ; phrase interne contradictoire (« annoncé, pas utilisé ») ; ingrédients différés
   sous-comptés. Occuper l'abri-citation (référence externe) et re-scoper. *Répercuter toute
   retouche de comptabilité aux ch. 25/27.*
2. **A8** (l. 24/139/163) — « au plus dénombrable » ⟷ $|E| \le |\mathbb{N}|$ : équivalence
   employée jamais établie ; écrire le sens facile, reformuler la l. 163.
3. **A2** (l. 50) — bien-définition de $f$ : l'unicité de $k$ dans chaque forme manque (une
   phrase, outils en place aux ch. 4 et 10).
4. **B1** (l. 88, 156) — récursion « à rang » utilisée deux fois sans le dire ; le pas doit être
   une fonction (couple $(k, \cdot)$, ambiants nommés).
5. **A3** (l. 94) — monotonie de $T$ : sous-pas tacite de l'injectivité de $\pi$.
6. **D1** (l. 21) — « à une exception près » : contredit le sens fixé d'« hypothèse nouvelle » ;
   reformuler en avertissement.
7. **A4** (l. 98) — l'application produit n'est pas une « composition de bijections déjà
   établies » ; deux lignes la règlent.
8. **A6** (l. 163) — polynômes non nuls ; ensembles de racines éventuellement vides (« non vide »
   actuel faux pour $X^2+1$).
9. **B2 + C2** (l. 154) — former $\mathbb{N}^{\lt\mathbb{N}}$ (séparation dans
   $\mathcal{P}(\mathbb{N} \times \mathbb{N})$, pas de remplacement) et badger les définitions —
   un seul edit.
10. **A1** (l. 44) — renvoi « compatibilité »/ch. 5 → « simplification »/ch. 6.
11. **A7** (l. 158) — alphabet non vide.
12. **A5, B3, C3, D2, D3, D4, D5** — retouches d'une ligne chacune (couple/restriction des
    suites, mot de charpente, modèle de Feferman–Lévy, $\mathbb{N}^2$ vs $\mathbb{N}^k$,
    fibre $e^{-1}$, $\mathbb{R}$ dans les acquis, soustractions dans $\mathbb{N}$).

Bilan : **A 8 · B 3 · C 3 · D 5 · E 0 — 19 constats**, 7 frontières signalées, 3 points de style.
Aucune violation du type « vert sans abri » hors C1 ; l'architecture du chapitre (ordre des
résultats, honnêteté ACω) est saine et ne demande aucun reséquencement.
