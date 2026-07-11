# Relecture — « Les axiomes des ensembles (ZF) » (`partie-i/ensembles-zf.mdx`)

Rapport autonome. Méthode : cinq passes (A trace des dépendances, B formations
ensemblistes, C contrat des badges, D vocabulaire et cohérence, E auto-contrôle
anti-faux-positifs), bouclées jusqu'à épuisement. Corrections proposées : ciblées,
dans la voix du cours, jamais de reséquencement.

---

## Passe 0 — Provenance

**SHA du dépôt** : `91600171ed5635134716a85804c1e840558af098` (HEAD de
`/home/sfaurite/projets/cqfd`, branche `main`, arbre propre).

Fichiers lus (outil Read uniquement ; ni web, ni historique git, ni mémoire) :

| Fichier | Lignes (`wc -l`) | Premier titre de section |
|---|---|---|
| `/home/sfaurite/projets/cqfd/src/pages/maths/partie-i/ensembles-zf.mdx` | 171 | `## Le sol de tout l'édifice` |
| `/home/sfaurite/projets/cqfd/src/pages/maths/partie-i/methode-axiomatique.mdx` | 218 | `## Pourquoi commencer par poser des règles du jeu` |
| `/home/sfaurite/projets/cqfd/src/pages/maths/methodologie.mdx` | 54 | `## Les quatre niveaux` |
| `/home/sfaurite/projets/cqfd/src/pages/maths/comment-lire.mdx` | 100 | `## Les encadrés « Hypothèses de départ »` |
| `/home/sfaurite/projets/cqfd/src/data/maths/glossary.ts` | 99 | (fichier TS ; premier bloc commenté : « Partie I : méthode axiomatique et ensembles ») |
| `/home/sfaurite/projets/cqfd/src/pages/maths/partie-i/relations-fonctions.mdx` | 148 | `## Relier les objets entre eux` — consulté **uniquement** pour la vérification des renvois dans les deux sens (l. 17, 23) et la recherche de définitions de ∪/∩/⊆ ; hors corpus d'analyse |

Le seul `<Prereq>` du corps du chapitre relu pointe (deux fois, l. 19 et 32) vers
`/maths/partie-i/methode-axiomatique` : c'est donc l'unique chapitre-dépendance.

**Cohérence d'ensemble (renvois dans les deux sens)** :

- ensembles-zf → methode-axiomatique (l. 19, 32) : la cible existe ; elle nomme bien la
  « logique classique du premier ordre avec égalité » (methode-axiomatique l. 79) que la
  l. 32 invoque, et sa clôture (l. 218) annonce bien le présent chapitre (« l'ensemble »). ✓
- ensembles-zf l. 171 annonce « Le prochain chapitre les organise en relations et en
  fonctions » : `relations-fonctions.mdx` existe et son ouverture (l. 17) renvoie en retour
  vers ensembles-zf (« couple de Kuratowski et produit cartésien »). ✓
- Glossaire : les entrées « Ensemble », « Ensemble vide », « Axiomes ZF », « Paradoxe de
  Russell », « Couple ordonné » pointent vers la page relue ; la liste des huit axiomes de
  l'entrée « Axiomes ZF » coïncide avec le bloc Hypothèses de la page. ✓
- **Un renvoi résout mais pointe au mauvais étage** : l'entrée « Produit cartésien (A × B) »
  du glossaire pointe vers `relations-fonctions`, alors que la construction (et son badge
  vert) vivent dans la page relue — et que relations-fonctions lui-même crédite le chapitre
  précédent. Le fichier cible existe, aucun renvoi n'est cassé : ce n'est pas une
  incohérence de corpus bloquante, c'est un constat de contenu, traité en D3.

Corpus cohérent : l'analyse peut se dérouler.

---

## Passe A — Trace des dépendances

Preuves de la page et faits invoqués :

- **Russell (l. 42–67)** : compréhension non restreinte (hypothèse locale, refermée),
  instanciation en x = R, dichotomie R ∈ R ∨ R ∉ R (tiers exclu, posé en
  methode-axiomatique l. 77), introduction de ¬. Tout est en amont, preuve déroulée. ✓
- **Existence de ∅ (l. 104–110)** : un ensemble E existe (axiome d'infini, seul axiome
  d'existence inconditionnelle de la liste — vérifié, aucun outil plus sobre disponible),
  séparation avec x ≠ x, réflexivité de = (methode-axiomatique l. 72). ✓
- **Unicité de ∅ (l. 112–131)** : extensionnalité + implication sous hypothèse jamais
  réalisée (« vraie par vacuité », geste couvert par la preuve sous hypothèse et
  l'explosion, toutes deux posées au ch. 1). ✓ — l'unicité couvre au passage
  l'indépendance du ∅ défini vis-à-vis du E choisi. ✓
- **Singletons, paires, réunions (l. 135)** : voir A3 et B1.
- **Kuratowski (l. 147–159)** : voir A1.
- **Produit cartésien (l. 167)** : emboîtements déroulés ({a}, {a,b} parties de A ∪ B ;
  éléments de P(A ∪ B) ; (a,b) élément de P(P(A ∪ B))), puis séparation à ambiant nommé.
  La trace passe, *modulo* deux notions non formées en amont : ∪ binaire (B1) et
  « partie/sous-ensemble » (D1) — propriétés structurelles porteuses de la preuve.

### A1. La propriété caractéristique du couple n'est pas démontrée — et la page promet qu'elle l'est

> l. 155 : « Un examen des cas (selon que $a = b$ ou non) montre qu'on reconstruit $a$
> puis $b$ sans ambiguïté. »
>
> l. 145 (texte principal) : « la propriété caractéristique, elle, tient toujours —
> **l'encart ci-dessous traite précisément ce cas**. »

**Diagnostic.** Le sens ⇒ de $(a,b) = (c,d) \iff a = c \wedge b = d$ n'est pas déroulé :
« un examen des cas… montre » est un appel à la preuve, pas une preuve ; la récupération
de $b$ « par élimination » n'est pas explicitée ; et le cas $a = b$ — que la l. 145
promet nommément traité dans l'encart — n'y est que mentionné. Or ce lemme porte tout :
le produit cartésien (l. 167), puis les relations et fonctions du chapitre suivant.
Une preuve juste appuyée sur un lemme jamais démontré est un constat. (Versant badge :
voir C1 — c'est la même plaie, vue du contrat.)

**Proposition minimale** (remplace, dans l'encart, la phrase « Pour $\Rightarrow$… sans
ambiguïté », et déroule les deux cas annoncés — sans $\bigcap$ ni $\cap$, donc sans
nouvelle notation) :

> Le sens $\Leftarrow$ est immédiat (substitution des égaux). Pour $\Rightarrow$,
> supposons $\{\{a\},\{a,b\}\} = \{\{c\},\{c,d\}\}$ et déroulons les deux cas annoncés.
>
> **Cas $a = b$.** Alors $(a,b) = \{\{a\}\}$ : l'ensemble $\{\{c\},\{c,d\}\}$ n'a qu'un
> élément, donc $\{c\} = \{c,d\} = \{a\}$. De $\{c\} = \{a\}$ on tire $c = a$ ; de
> $\{c,d\} = \{a\}$ on tire $d = a = b$. Les deux composantes coïncident.
>
> **Cas $a \neq b$.** D'abord $a = c$ : l'élément $\{a\}$ du membre de gauche appartient à
> $\{\{c\},\{c,d\}\}$, donc $\{a\} = \{c\}$ ou $\{a\} = \{c,d\}$. Dans le second cas, $c$
> et $d$ appartiennent à $\{a\}$, donc $c = d = a$ ; alors $(c,d) = \{\{a\}\}$, et
> $\{a,b\}$, élément du membre de gauche, devrait valoir $\{a\}$ — ce qui forcerait
> $b = a$, exclu. Reste $\{a\} = \{c\}$, d'où $a = c$. Ensuite $b = d$ : l'élément
> $\{a,b\}$ appartient à $\{\{a\},\{a,d\}\}$ ; si $\{a,b\} = \{a\}$, alors $b = a$,
> exclu ; donc $\{a,b\} = \{a,d\}$, et $b$, distinct de $a$, ne peut être que $d$.
>
> Chaque pas ne mobilise que l'extensionnalité : deux ensembles écrits en extension sont
> égaux exactement quand ils ont les mêmes éléments.

(Si l'on tient à garder la jolie remarque « $a$ est l'unique élément de
$\bigcap(a,b)$ », il faut d'abord former $\cap$ — voir B2 ; sinon la supprimer.)
Accessoirement, passer l'encart du type `plusloin` au type `calcul` : une démonstration
déroulée ligne à ligne, dont dépend la suite du cours, n'est pas un approfondissement
« qu'on peut sauter sans perdre le fil » (contrat des encarts, comment-lire l. 53 et 66).

### A2. Les « conséquences intuitives » de la fondation ne sont ni démontrables ici, ni situées

> l. 84 : « Conséquences intuitives : pas de boucle $x \in x$, pas de cycle
> $x_0 \ni x_1 \ni \cdots \ni x_0$, pas de chaîne d'appartenance infinie descendante. »

**Diagnostic.** Trois énoncés mathématiques invoqués comme conséquences, sans preuve ni
localisation. Les deux premiers sont des vérifications d'une ligne — mais qui exigent le
singleton $\{x\}$ (resp. l'ensemble $\{x_0,\dots,x_n\}$), construit seulement à la
l. 135 ; le troisième exige les fonctions et $\mathbb{N}$ (partie II) — il n'est même pas
*énonçable* à ce stade. Le mot « intuitives » hedge, mais le lecteur ne sait pas si c'est
démontré, démontrable, ou admis.

**Proposition minimale** (une incise) :

> Conséquences intuitives — qu'on saura démontrer : les deux premières en une ligne dès
> que le singleton sera construit (plus bas), la troisième une fois les fonctions et
> $\mathbb{N}$ disponibles (partie II) — : pas de boucle $x \in x$, …

### A3. « Un seul élément, par extensionnalité » : l'axiome crédité n'est pas le bon

> l. 135 : « on obtient le **singleton** $\{a\} := \{a, a\}$ (un seul élément, par
> extensionnalité) »

**Diagnostic.** Que $\{a,a\}$ ait un seul élément sort directement de l'axiome de la
paire (« dont les éléments sont précisément $a$ et $b$ », avec $b = a$) : aucune
extensionnalité là-dedans. Ce que l'extensionnalité garantit, c'est autre chose —
l'*unicité* de l'ensemble ainsi décrit, donc la licéité de la notation (voir D2, où ce
crédit trouve sa vraie place).

**Proposition minimale.** « on obtient le **singleton** $\{a\} := \{a, a\}$ (ses éléments
sont précisément $a$ et $a$ — un seul, donc, par l'axiome même) ».

**Passe A : 3 constats.**

---

## Passe B — Formations ensemblistes

Formations vérifiées et conformes : $\varnothing$ (séparation, ambiant $E$ nommé),
$\{a,b\}$ et $\{a\}$ (paire), $(a,b)$ (paire deux fois), $A \times B$ (séparation,
ambiant $\mathcal{P}(\mathcal{P}(A \cup B))$ nommé — l'ambiant existe, nul besoin de
remplacement : conforme à la consigne « chercher l'ambiant d'abord »). Restent :

### B1. La réunion binaire ∪ n'est jamais formée — mais utilisée trois fois

> l. 82 (axiome 6) : « avec chaque $x$, contient aussi $x \cup \{x\}$ » ;
> l. 135 : « on forme $\{a\} \cup \{b\} = \{a, b\}$ » ;
> l. 167 : « à l'intérieur de $\mathcal{P}(\mathcal{P}(A \cup B))$ ».

**Diagnostic.** L'axiome 3 forme $\bigcup E$ ; la réunion **binaire** $A \cup B$, elle,
n'est définie nulle part — ni sur la page, ni au ch. 1, ni au glossaire (et le chapitre
suivant ne la pose pas non plus : vérifié). La l. 135 en contient le germe (« en
combinant paire et réunion ») sans jamais poser la notation. C'est d'autant plus visible
que l'axiome 6 prend soin, dans sa parenthèse, de ne pas écrire $\varnothing$ « pas
encore défini » — tout en écrivant $x \cup \{x\}$, pas davantage défini. La notation sert
ensuite dans tout le cours ($S(n) := n \cup \{n\}$…).

**Proposition minimale.** À la l. 135, poser la définition au moment où le texte la
« combine » déjà :

> En combinant paire et réunion, on pose la **réunion binaire** :
> $A \cup B := \bigcup \{A, B\}$ — la paire $\{A,B\}$ existe (axiome 2), sa réunion aussi
> (axiome 3), et ses éléments sont exactement ceux de $A$ et ceux de $B$. En particulier
> $\{a\} \cup \{b\} = \{a, b\}$, puis de proche en proche…

Et dans la parenthèse de l'axiome 6, étendre la précaution déjà prise pour $\varnothing$ :

> (On n'écrit pas « contient $\varnothing$ » … juste en dessous. De même, $x \cup \{x\}$
> désigne ici l'ensemble dont les éléments sont ceux de $x$, plus $x$ lui-même — la
> notation $\cup$ sera construite quelques lignes plus bas.)

### B2. L'axiome de fondation manipule ∩, ∅ et « non vide » avant toute définition — au mépris du standard que l'axiome 6 vient de fixer

> l. 84 : « Tout ensemble non vide $A$ possède un élément **minimal pour $\in$** : un
> $y \in A$ tel que $y \cap A = \varnothing$. »

**Diagnostic.** Deux lignes après que l'axiome 6 a refusé d'écrire $\varnothing$ (« ce
symbole n'est pas encore défini »), l'axiome 8 écrit $\varnothing$, « non vide » **et**
$\cap$ — l'intersection n'étant définie nulle part sur la page ni en amont (elle resurgit
l. 155 avec $\bigcap(a,b)$ et $\{a\} \cap \{a,b\}$, cf. A1). Double standard interne.

**Proposition minimale.** Énoncer la fondation en mots, comme le reste de la liste :

> 8. **Fondation.** Tout ensemble $A$ ayant au moins un élément possède un élément
> **minimal pour $\in$** : un $y \in A$ dont aucun élément n'appartient à $A$ (une fois
> nos notations construites, on l'écrira $y \cap A = \varnothing$). Conséquences…

Et, si l'on garde une écriture symbolique quelque part (ou l'intuition par $\bigcap$ de
l'encart Kuratowski), former l'intersection binaire d'une ligne, au même endroit que la
réunion binaire (l. 135) : « l'**intersection** $A \cap B := \{x \in A : x \in B\}$, par
séparation dans l'ambiant $A$ » — elle servira dès le chapitre suivant, qui l'emploie.

### B3 (frontière). La formule de séparation du produit cartésien n'est pas écrite

> l. 167 : « il ne reste qu'à découper par séparation. »

L'ambiant est nommé, la propriété est lisible dans l'écriture en extension
$\{(a,b) : a \in A,\ b \in B\}$, et la l. 73 a verrouillé « propriété = formule à
paramètres ». Une ligne du type « les $z$ de $\mathcal{P}(\mathcal{P}(A \cup B))$ tels
que $\exists a \in A\ \exists b \in B,\ z = (a,b)$ » rendrait le quantificateur explicite
— utile, non exigible. Signalé, sans plus.

**Passe B : 2 constats + 1 frontière.**

---

## Passe C — Contrat des badges

Badges vérifiés conformes : l. 36 (bleu, choix de modélisation), l. 63 (vert, preuve de
Russell déroulée au-dessus), l. 88 (bleu, adoption du cadre — la mention Gödel renvoie à
un résultat établi au ch. 1), l. 98 (vert par **citation référencée** + bleu pour
l'*adoption* d'AC : la séparation des deux statuts sur deux badges est exemplaire),
l. 167 (vert, emboîtements déroulés — modulo B1/D1). Restent :

### C1. Badge vert hors des trois abris sur la propriété caractéristique du couple — le constat le plus grave de la page

> l. 157 : `<Badge niveau="demontre">Vérification finie, entièrement mécanique :
> Kuratowski encode bien le couple ordonné.</Badge>`

**Diagnostic.** Aucun des trois abris du contrat (methodologie l. 23–28) n'est occupé :
la preuve n'est **pas déroulée** sur la page (cf. A1 — « un examen des cas… montre ») ;
« entièrement mécanique » revendique l'abri « vérification routinière », mais **aucun
modèle nommé et déroulé de même nature** n'accompagne le badge ; aucune **référence**
n'est citée. C'est une violation du contrat du badge vert.

**Proposition minimale.** Dérouler la preuve (texte proposé en A1) : le badge devient
alors conforme au premier abri ; reformuler son infobulle en conséquence, p. ex. :
« Démontré ci-dessus, cas $a = b$ et $a \neq b$ déroulés — seule l'extensionnalité est
mobilisée. »

### C2. Badge du résultat « ∃! ∅ » : la portée annoncée est plus étroite que l'énoncé couvert

> l. 124 : « $\exists!\, \varnothing \quad \text{tel que} \quad \forall x,\ x \notin
> \varnothing$ » ; l. 127 : `<Badge niveau="demontre">Déduit rigoureusement de l'axiome
> d'extensionnalité.</Badge>`

**Diagnostic.** Le résultat encadré affirme existence **et** unicité ($\exists!$).
L'unicité vient de l'extensionnalité (encart), mais l'existence — déroulée dans le texte
principal juste au-dessus — vient de l'axiome d'infini et de la séparation. L'infobulle
ne crédite qu'un des deux versants : portée du badge ≠ ce qui est réellement démontré
au-dessus de lui.

**Proposition minimale.** Infobulle : « Existence par séparation dans l'ensemble que
fournit l'axiome d'infini (texte ci-dessus) ; unicité par extensionnalité (encart) —
les deux sont déroulées. »

### C3 (frontière). « De proche en proche » sous badge vert : une méta-itération, pas une récurrence

> l. 135 : « puis de proche en proche n'importe quel ensemble fini écrit en extension.
> <Badge niveau="demontre">Constructions directes à partir des axiomes 2 et 3.</Badge> »

Aucune récurrence interne n'est disponible à ce stade — mais il n'en faut pas : pour
chaque écriture concrète $\{a_1,\dots,a_n\}$, la construction est une suite finie
explicite d'applications des axiomes 2 et 3, exactement comme les démonstrations du ch. 1
sont des suites finies de pas. C'est une itération au niveau du méta-langage, du même
statut que celles que le cours assume depuis le début. Signalé pour mémoire ; une incise
« (pour chaque écriture concrète, une construction finie explicite) » lèverait toute
ambiguïté. Pas d'écart exigé.

**Passe C : 2 constats + 1 frontière.**

---

## Passe D — Vocabulaire et cohérence

Vérifiés sans constat : « univers du discours », « symbole non logique » (glosés sur
place, l. 31–32) ; « logique du premier ordre avec égalité » (posée ch. 1, renvoi
exact) ; « schéma » (glosé l. 73) ; « inductif » (défini l. 82, cohérent avec le
glossaire) ; « compréhension non restreinte » (définie l. 40) ; « modèle » et
« forcing » (l. 96 — « modèle » est introduit au ch. 1, encart « Vrai ne veut pas dire
démontrable » ; « forcing » est un nom propre de méthode, non utilisé) ; le compte de la
l. 171 (« l'axiome d'Infini, dont nous ne nous sommes servis jusqu'ici que pour disposer
d'un ensemble quelconque ») est exact — un seul usage, l. 104 ; « le neuvième de notre
liste » (l. 92) est exact — huit axiomes posés ; la liste du glossaire (« Axiomes ZF »)
coïncide avec le bloc Hypothèses.

### D1. « Sous-ensemble » / « partie » : employé, jamais défini en amont

> l. 80 (axiome 4) : « il existe $\mathcal{P}(E)$, l'ensemble de tous les
> **sous-ensembles** de $E$ » ; l. 167 : « $\{a\}$ et $\{a, b\}$ sont des **parties** de
> $A \cup B$ » (fait structurel porteur de la preuve du produit cartésien).

**Diagnostic.** Ni la page, ni le ch. 1, ni le glossaire ne définissent
« sous-ensemble »/« partie » (l'entrée « Relation d'ordre » cite ⊆ en exemple mais
pointe vers l'aval). Le chapitre suivant le reconnaît noir sur blanc : « un mot que le
chapitre précédent a employé **sans le figer** » (relations-fonctions l. 23), et c'est là
que $\subseteq$ est posé. Mais la preuve de la l. 167 exige que le lecteur sache dès
maintenant ce qu'est une partie. Une glose en mots — sans voler au ch. 3 sa définition
officielle ni sa notation — suffit et laisse vraie sa phrase « sans le figer ».

**Proposition minimale.** Axiome 4 : « il existe $\mathcal{P}(E)$, l'ensemble de tous les
sous-ensembles de $E$ — les ensembles dont chaque élément appartient à $E$ ».

### D2. Les notations fonctionnelles {a,b}, ⋃E, 𝒫(E), {x ∈ E : P(x)} supposent une unicité jamais remarquée

> l. 78–81 : « il existe **un** ensemble $\{a,b\}$ **dont** les éléments sont
> précisément… », « il existe **l'**ensemble $\bigcup E$ », « il existe
> $\mathcal{P}(E)$ », « il existe $\{x \in E : P(x)\}$ ».

**Diagnostic.** Chacune de ces écritures est une notation *fonctionnelle* : elle désigne
« le » ensemble répondant à une description — ce qui présuppose son unicité. La page la
démontre soigneusement pour $\varnothing$… et ne dit mot des autres, alors que l'argument
est identique (deux candidats ont les mêmes éléments, donc sont égaux par
extensionnalité). C'est exactement l'endroit où loger le crédit « extensionnalité »
retiré en A3.

**Proposition minimale** (une phrase après l'encart d'unicité, avant « Singletons,
paires, réunions ») :

> Ce petit argument a une portée générale : chacune de nos écritures — $\{a,b\}$,
> $\bigcup E$, $\mathcal{P}(E)$, $\{x \in E : P(x)\}$ — désigne *un* ensemble et un seul,
> car deux candidats auraient les mêmes éléments, donc seraient égaux. Les axiomes
> donnent l'existence ; l'extensionnalité rend les notations licites.

### D3. Glossaire : le renvoi « Produit cartésien » pointe vers l'aval

> `glossary.ts` l. 23 : `{ terme: 'Produit cartésien (A × B)', …, voir:
> '/maths/partie-i/relations-fonctions' }`

**Diagnostic.** La construction du produit cartésien — définition, ambiant, badge vert —
vit dans la page relue (l. 167) ; le chapitre relations-fonctions la *crédite* au
chapitre précédent et y renvoie (sa l. 17). Un lecteur cliquant « voir » depuis le
glossaire est envoyé une page trop loin. (Règle de relecture : un renvoi de glossaire ne
vaut définition amont que s'il pointe où la notion est réellement formée.)

**Proposition minimale.** `voir: '/maths/partie-i/ensembles-zf'`.

### D4. « Paramètres » : jamais glosé

> l. 73 : « écrite avec $\in$, $=$ et la logique, éventuellement **avec paramètres** » ;
> l. 81 : « (éventuellement avec paramètres) ».

**Diagnostic.** Le mot est technique et décisif (c'est lui qui permettra de séparer avec
$x \in A$, $A$ donné — dont la séparation du produit cartésien, qui mentionne $A$ et
$B$) ; aucune définition en amont ni sur place.

**Proposition minimale.** l. 73 : « éventuellement avec paramètres — c'est-à-dire en y
mentionnant des ensembles déjà donnés, comme le $E$ lui-même ou tout autre ensemble sous
la main ».

### D5. « Famille » dans l'énoncé d'AC : le mot n'existe pas encore

> l. 92 : « étant donnée une **famille** d'ensembles non vides, on peut choisir
> simultanément un élément dans chacun ».

**Diagnostic.** « Famille » (objet indexé, donc fonction) n'est défini nulle part en
amont — et ne peut pas l'être : les fonctions n'existent qu'au chapitre suivant. La
section est un aparté assumé, mais un mot suffit pour ne rien laisser passer en
contrebande.

**Proposition minimale.** « étant donnée une famille — entendez, pour l'instant : un
ensemble — d'ensembles non vides, on peut choisir simultanément un élément dans chacun ;
l'énoncé précis attendra les fonctions ».

### D6. La page présente AC… sans dire ce que fait *ce cours*

> l. 92 : « **On adjoint souvent** un axiome supplémentaire […] ZF + AC se note
> **ZFC**. »

**Diagnostic.** Le lecteur qui referme le chapitre ne sait pas si AC fait partie des
hypothèses du cours. Le bloc Hypothèses n'en pose que huit — l'implicite est « non » —,
mais la promesse du cours (« quand on ajoute une hypothèse, on le dit », ch. 1 l. 24, et
le régime des dettes déclarées sur place) mérite une phrase explicite ici, à l'endroit
même où AC entre en scène.

**Proposition minimale** (en clôture de la section « À part ») :

> Ce cours, lui, travaille dans ZF : les huit axiomes ci-dessus, pas un de plus. Chaque
> fois qu'un résultat exigera l'axiome du choix — ou un fragment —, nous le dirons sur
> place, et le chapitre que la partie VI lui consacre soldera les comptes.

### D7 (frontière). « Ici, et seulement ici, nous avons le droit de dire « admettons » »

> l. 19 (Tournant).

Engagement qui porte sur tout le cours : si un chapitre ultérieur pose une hypothèse
nouvelle (AC, précisément, dont la partie VI tient la comptabilité), la clause « et
seulement ici » sera à réconcilier avec lui. À la lettre, elle reste défendable (le cours
peut ne jamais *adopter* AC, seulement en déclarer les usages comme dettes) — c'est
pourquoi je signale sans exiger. Si D6 est retenu, les deux phrases se répondent et le
risque disparaît.

**Passe D : 6 constats + 1 frontière.**

---

## Passe E — Auto-contrôle anti-faux-positifs

Chaque constat ci-dessus a été relu contre le passage complet (règle 1), contre l'outil
le plus sobre (règle 2), et classé « frontière » en cas de doute (règle 3). Candidats
**éliminés** à ce filtre :

1. *« ∅ défini avant la preuve d'unicité »* (l. 107–110) — écarté : la phrase « Son
   unicité mérite, elle, une preuve » enchaîne immédiatement sur l'encart ; l'ordre
   local est assumé et l'unicité couvre aussi l'indépendance du choix de $E$. Conforme au
   refrain du ch. 1 à l'échelle du paragraphe.
2. *« L'existence d'un ensemble via l'axiome d'infini est un marteau-pilon »* (l. 104) —
   écarté : dans la liste posée, l'infini est le seul axiome d'existence
   inconditionnelle ; la convention logique « domaine non vide » n'a pas été posée au
   ch. 1, donc aucun outil plus sobre n'est disponible.
3. *« La dichotomie R ∈ R ∨ R ∉ R n'est pas justifiée »* (l. 52–53) — écarté : tiers
   exclu, posé explicitement au ch. 1 (l. 77).
4. *« Référence Wikipédia = référence imprécise »* (l. 98) — écarté : c'est le format de
   citation du cours (ch. 1, quatre occurrences) ; cohérence de pratique.

**Frontière retenue en propre :**

### E1 (frontière). L'indépendance d'AC est énoncée absolument ; elle est relative à Con(ZF)

> l. 96 : « Gödel (1938) a montré qu'on ne peut pas **réfuter** AC à partir de ZF […] AC
> est donc strictement **indépendant** de ZF ».

Si ZF était incohérente, elle réfuterait (et démontrerait) AC. La réserve existe dans
l'encart — « si ZF est cohérente, chacune l'est aussi » — mais accrochée à la cohérence
des deux théories étendues, pas aux impossibilités elles-mêmes. Lecture charitable
possible (le tiret final gouverne tout l'encart), d'où : frontière. Incise candidate :
« on ne peut pas réfuter AC à partir de ZF (sous-entendu partout ici : si ZF est
cohérente) ».

**Passe E : 0 constat, 1 frontière ; 4 candidats éliminés.**

---

## Bouclage

Les cinq passes ont été rejouées intégralement une seconde fois après stabilisation de la
liste (traces re-suivies avec les propositions en place, badges recontrôlés, balayage
vocabulaire de la page entière) : **aucun constat nouveau**. Arrêt.

---

## Points de style (hors constats)

- **S1.** Encart « Pourquoi (a,b) encode vraiment l'ordre » : type `plusloin` → `calcul`
  une fois la preuve déroulée (lié à A1/C1 ; cf. contrat des familles d'encarts,
  comment-lire l. 53 et 66–68).
- **S2.** l. 73 : « leur version logique formelle viendra plus tard **si nécessaire** » —
  promesse invérifiable ; « les traités de logique les donnent ; ce cours n'en aura pas
  besoin » serait plus franc, si c'est le cas.
- **S3.** l. 124 : $\exists!\,\varnothing$ utilise le symbole $\varnothing$ comme variable
  liée avant de le consacrer comme constante — abus standard et inoffensif ; « il existe
  un unique ensemble sans élément, qu'on note $\varnothing$ » l'éviterait.
- **S4.** l. 73 : « **Je** les énonce intuitivement » — seul « je » de la page (et des
  pages lues), qui parlent en « nous/on » ; uniformiser.

---

## Priorités

1. **A1 + C1** — Dérouler la preuve de la propriété caractéristique du couple de
   Kuratowski (cas $a=b$ et $a\neq b$) : seul badge vert de la page hors des trois abris,
   et promesse de la l. 145 non tenue ; lemme porteur de tout l'aval. (Avec S1.)
2. **B1** — Former la réunion binaire $A \cup B := \bigcup\{A,B\}$ à la l. 135 et gloser
   $x \cup \{x\}$ dans l'axiome 6 ; la notation sert trois fois ici et dans tout le cours.
3. **B2** — Réénoncer la fondation sans $\cap$/$\varnothing$/« non vide » (ou en mots +
   forme symbolique différée), pour honorer le standard que l'axiome 6 fixe lui-même ;
   au besoin, former $A \cap B$ par séparation à côté de la réunion binaire.
4. **D1** — Gloser « sous-ensemble » à l'axiome 4 (en mots, compatible avec le « sans le
   figer » du ch. 3) : la preuve du produit cartésien s'appuie dessus.
5. **C2** — Compléter l'infobulle du badge « ∃! ∅ » (existence : infini + séparation ;
   unicité : extensionnalité).
6. **D2 + A3** — Une phrase « l'extensionnalité rend toutes nos notations licites » après
   l'encart d'unicité ; réattribuer le « par extensionnalité » du singleton.
7. **D3** — Glossaire : renvoi « Produit cartésien » → `/maths/partie-i/ensembles-zf`.
8. **D6** — Déclarer la politique AC du cours (une phrase en clôture de la section
   « À part ») ; puis **D4**, **D5**, **A2** (gloses d'un trait chacune).
9. **Frontières à trancher par l'auteur** : E1 (Con(ZF) tacite), D7 (« ici, et seulement
   ici »), B3 (formule de séparation du ×), C3 (« de proche en proche »).

**Bilan : 13 constats (A 3, B 2, C 2, D 6, E 0) + 4 frontières (B 1, C 1, D 1, E 1) ;
aucune incohérence de corpus bloquante ; une seule violation du contrat vert (C1).**
