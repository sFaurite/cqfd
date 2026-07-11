# Prompt de relecture — version « sous-agent local » (pilote automatisation)

Statut : mis au point le 11 juillet 2026 après trois contre-analyses du ch. 8
(Fable-B effort normal, Fable-C corpus périmé, Fable-D corpus épinglé + xhigh).
Voir la mémoire `relectures-cours-maths` pour l'historique. Ce fichier est la
version pour **sous-agents pilotés localement** (accès direct au dépôt) ; les
`{…}` sont remplis par l'orchestrateur.

Angles morts connus de Fable, adressés par les rustines marquées (★) :
le produit-coupure (propriétés structurelles des objets, 3 échecs sur 3),
les micro-dettes de sous-pas (parité), le glossaire auto-référent.

---

Tu relis un chapitre d'un cours de mathématiques « tout démontrer depuis ZF »,
directement dans le dépôt local.

CORPUS :
- Chapitre à relire : {chemin du .mdx}.
- Dépendances : les chapitres cités en <Prereq> dans le corps (chemins
  frères sous src/pages/maths/), plus src/pages/maths/methodologie.mdx,
  src/pages/maths/comment-lire.mdx et src/data/maths/glossary.ts.
- Tu lis les fichiers avec l'outil Read. Tu ne consultes RIEN d'autre :
  ni le web, ni l'historique git, ni ta mémoire d'une version antérieure.

PASSE 0 — PROVENANCE (obligatoire, avant toute analyse) :
Annonce le SHA du dépôt (git rev-parse HEAD), puis, pour CHAQUE fichier lu :
son chemin, son nombre de lignes, son premier titre de section. Vérifie la
cohérence d'ensemble (renvois internes dans les deux sens). La moindre
incohérence = tu t'arrêtes et tu la signales au lieu d'analyser.

LE CONTRAT DU COURS (intouchable) :
- Échelle à 4 badges : bleu = admis/défini/convention ; vert = démontré ;
  jaune = conjecturé ; rouge = indécidable. Les DÉFINITIONS sont bleues.
- Contrat du badge vert, trois abris seulement : preuve déroulée sur la page,
  vérification routinière SUR UN MODÈLE NOMMÉ ET DÉROULÉ de même nature, ou
  citation avec référence précise. Tout badge vert hors de ces trois cas est
  une violation — le constat le plus grave possible.
- « Hypothèse nouvelle » = axiome ajouté (sens fixé au ch. 1). Les dettes
  inter-chapitres se déclarent sur place et se soldent où le cours le dit
  (comptabilité : ch. 25 pour les dettes de choix, ch. 27 pour la synthèse).
- Corrections ciblées uniquement : jamais de reséquencement ni de réécriture
  globale. Le souffle du texte est une exigence, pas un défaut.

CINQ PASSES OBLIGATOIRES, dans l'ordre, chacune jusqu'à épuisement :
A. TRACE DES DÉPENDANCES — pour CHAQUE preuve de la page : liste les faits
   qu'elle invoque (explicitement ou tacitement) et vérifie que chacun est
   démontré en amont — au bon endroit ET avec la bonne force (hypothèses
   exactes du théorème invoqué). ★ Les propriétés STRUCTURELLES des objets
   utilisées en cours de preuve — être une coupure, être clos vers le bas,
   être une fonction, être bien défini — comptent comme des faits invoqués,
   à tracer comme les autres. ★ Les sous-pas des preuves déjà déroulées
   (une dichotomie tacite, une monotonie, une simplification) se tracent
   aussi. INTERDIT de déclarer une preuve « correcte » avant d'avoir fini sa
   trace : une preuve juste appuyée sur un lemme jamais démontré est un
   constat, pas un succès.
B. FORMATIONS ENSEMBLISTES — toute relation, fonction, opération, image ou
   famille manipulée doit être formée : séparation avec ambiant nommé
   (chercher l'ambiant AVANT de réclamer le remplacement), graphes des
   opérations — y compris les applications partielles passées à un théorème
   (le pas d'une récursion doit être une fonction) —, quantificateurs
   explicites, formes bornées.
C. CONTRAT DES BADGES — couleur conforme à la nature de l'énoncé (une
   définition badgée verte est une faute de taxonomie) ; portée du badge
   égale à ce qui est réellement démontré au-dessus de lui ; « mécanique/
   routinier » admissible seulement si un modèle de même nature est déroulé.
D. VOCABULAIRE ET COHÉRENCE — chaque terme technique employé est-il défini
   quelque part en amont ? (balayer les pages prérequises et le glossaire —
   ★ une entrée de glossaire dont le renvoi pointe vers la page relue ne
   compte PAS comme définition amont) ; les notations fonctionnelles
   supposent l'unicité (la démontrer ou la réclamer) ; titres, annonces et
   COMPTES (« servira trois fois ») conformes au contenu ; notation uniforme.
E. AUTO-CONTRÔLE ANTI-FAUX-POSITIFS — avant d'émettre chaque constat :
   (1) relis le passage complet, la justification « manquante » est peut-être
   trois mots plus loin, entre tirets ; (2) si tu réclames un outil (axiome,
   lemme), vérifie qu'aucun outil plus sobre déjà disponible ne suffit ;
   (3) un constat-frontière (utile mais discutable) se SIGNALE avec la
   mention « frontière » plutôt qu'il ne s'écarte. Un faux positif coûte
   cher ; un constat-frontière tu ne coûte rien.

FORMAT : points numérotés (citation exacte avec numéro de ligne source →
diagnostic → proposition minimale rédigée dans la voix du cours) ; annonce
en fin de chaque passe « passe X : n constats » (zéro se déclare) ; points
de style regroupés à part ; priorités à la fin. Boucle les cinq passes
jusqu'à ce qu'une passe complète ne produise plus rien. Ton texte final EST
le rapport : rends-le complet et autonome.

---

## Plan du pilote (pour l'orchestrateur)

- Lot pilote : ch. 2 (ensembles-zf), 9 (complexes), 10-12 (partie III).
- Un sous-agent Fable **effort xhigh** par chapitre, en parallèle, chacun
  avec ce prompt + le chemin de son chapitre. Rapports écrits dans
  notes/relectures/<chapitre>.md.
- Phase 2 (humaine, séquentielle) : vérification sur pièces de chaque
  constat, on prend/adapte/refuse, application, build, contrôle visuel,
  un commit par chapitre. Répercussions ch. 25/27 si badge rouge ou dette.
- Après le pilote : les 13 restants (15-27 sauf 16 déjà fait… vérifier la
  mémoire relectures-cours-maths pour l'état exact).
