# Analyse complète des cours — fact-check et améliorations

*Générée le 2026-06-09/10 par un workflow multi-agents : 52 agents de fact-check (un par partie de cours + glossaires, 200 chapitres relus intégralement), contre-expertise adversariale de chaque signalement par un agent indépendant (avec recherche web pour les cas critiques/importants), 8 agents d'amélioration (un par cours) et un agent de cohérence inter-cours. ~300 agents au total.*

## Synthèse

- **227 signalements** émis par le fact-check, dont après contre-expertise : **141 confirmés** (2 critiques, 34 importants, 105 mineurs), **43 réfutés** (signalements pédants ou simplifications défendables, écartés), et **43 non contre-expertisés** (réseaux et fin de processeurs : la vérification a été interrompue par la limite de session — signalements bruts à confirmer, listés à part).
- Qualité d'ensemble **très élevée** : aucune partie n'est gravement fautive ; l'essentiel des problèmes confirmés sont des imprécisions, des badges mal calibrés ou des références internes périmées. Seules **2 erreurs critiques** (qui enseignent quelque chose de faux) ont été trouvées sur 200 chapitres.
- Demandes récurrentes des 8 bilans d'amélioration : **auto-évaluation** (absente de tout le hub), **liens croisés inter-cours** (un seul lien dans tout le hub), et un **chapitre charnière manquant** par cours.

## Tableau de bord par cours

| Cours | Confirmés (crit./imp./min.) | À vérifier | Bilan en une phrase |
|---|---|---|---|
| Physique | 24 (1/4/19) | 0 | Promesse déductive tenue (I–III), badges fins ; s'étiole en V–VI (hypothèses, interactifs) |
| Mathématiques | 7 (0/2/5) | 0 | Excellente rigueur mais cours embryonnaire (4 chapitres) ; ℤ et ℚ revendiqués jamais construits |
| Chimie | 22 (0/6/16) | 0 | Chaîne atome→réactivité réellement tenue ; manque « solutions » et qq badges 🟢 à recalibrer |
| Cosmologie | 31 (0/9/22) | 0 | Remarquable ; transitions de chapitres héritées d'un ancien ordre, partie IV sans interactif |
| Histoire | 25 (1/6/18) | 0 | Honnêteté épistémique exemplaire ; 1 erreur critique (Valla), badges « débattu » parfois inversés |
| IA | 16 (0/2/14) | 0 | Démonstrations complètes, badges fins ; RL manquant avant RLHF, 2 Prereq mal ciblés |
| Processeurs | 16 (0/5/11) | 15 | Chaîne atome→OS continue, échelle bien appliquée ; qq badges 🟢/convention incohérents |
| Réseaux | 0 (0/0/0) | 28 | Calibration quasi irréprochable des ~140 badges ; ARP absent (trou déductif MAC→IP) |

---

## 1. Erreurs confirmées, par cours

Chaque entrée : fichier, texte incriminé, problème, correction proposée (validée ou amendée par la contre-expertise).

### Physique — 24 confirmés

#### 🔴 CRITIQUE — `src/pages/physique/partie-ii/quantite-mouvement.mdx`

> Un calcul de la même quantité après le choc donne une valeur **différente** : $p_{\text{av}} \neq p_{\text{ap}}$ dans $R$.

**Problème** : Faux pour la collision décrite. Les vitesses passent de {+u,−u} à {−u,+u} : même ensemble, simplement échangé entre deux objets identiques. Dans R, p_av = m(w1+w2) = p_ap exactement. Ce rebond élastique 1D ne peut pas exhiber l'échec de p=mv ; un élève qui refait le calcul trouve la conservation et le texte lui enseigne un résultat mathématique faux.

**Correction** : Remplacer l'encart « Une collision qui trahit p = mv » (lignes 29–43 de /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-ii/quantite-mouvement.mdx) par :

<Encart type="calcul" titre="Une collision qui trahit p = mv">
On considère deux objets identiques de masse $m$ qui se percutent et **restent collés** (collision parfaitement inélastique). Dans le référentiel $R'$ du centre de masse, ils arrivent l'un vers l'autre à la même vitesse $\pm u$ et l'amas final est au repos.

**Étape 1 — Bilan dans $R'$.** Avant : $p'_{\text{av}} = m u + m(-u) = 0$. Après : l'amas est immobile, donc $p'_{\text{ap}} = 0$. La quantité de mouvement classique est conservée. ✔

**Étape 2 — On change de référentiel.** $R'$ se déplace à la vitesse $V$ par rapport au laboratoire $R$. Pour trouver les vitesses dans $R$, on **n'ajoute pas** simplement $V$ : on utilise la composition relativiste

$$ w = \frac{u + V}{1 + \dfrac{uV}{c^2}}. $$

**Étape 3 — Vitesses dans $R$.** Avant le choc, l'objet à $+u$ a la vitesse $w_1 = \dfrac{u+V}{1+uV/c^2}$ ; celui à $-u$ a la vitesse $w_2 = \dfrac{-u+V}{1-uV/c^2}$. Après le choc, l'amas — immobile dans $R'$ — avance à la vitesse $V$ dans $R$.

**Étape 4 — Bilan classique dans $R$.** Avant : $p_{\text{av}} = m w_1 + m w_2 = 2mV\,\dfrac{1-u^2/c^2}{1-u^2V^2/c^4}$. Après : $p_{\text{ap}} = 2mV$.

**Étape 5 — Le verdict.** Dès que $u \neq 0$ (et $V \neq 0$), le facteur $\dfrac{1-u^2/c^2}{1-u^2V^2/c^4}$ est strictement inférieur à 1 : $p_{\text{av}} \neq p_{\text{ap}}$ dans $R$. Or rien de physique n'a changé en changeant de point de vue. Donc $\sum m v$ **n'est pas un invariant de conservation** en relativité. ∎
</Encart>

Ajustement de cohérence : dans l'encart « Le problème en une image » (ligne 20), remplacer « se cognent de plein fouet et rebondissent » par « se cognent de plein fouet et restent collées ». Optionnel : à la ligne 81 (« En reprenant la collision symétrique de tout à l'heure »), préciser que la dérivation complète de f(v)=γ(v) utilise la collision rasante 2D de Lewis–Tolman (1909).

*Sources : Vérification numérique directe (Python) : rebond élastique → p_av = p_ap = 0,70330 (diff 0) ; inélastique → 0,70330 vs 1,0 pour u=0,6c, V=0,5c, m=1 ; Lewis & Tolman (1909), collision rasante symétrique : la quantité de mouvement newtonienne n'y est pas conservée, ce qui force p = γmv — https://www.semanticscholar.org/paper/ec999fc4c51776fa4844df7bb66f459e077b8f37 (Peters, Am. J. Phys.) ; « Relativistic momentum and kinetic energy, and E=mc² » — https://arxiv.org/pdf/physics/0612202 ; Firk, « Introduction to Relativistic Collisions » — https://arxiv.org/pdf/1011.1943*

#### 🟠 Important — `src/data/physique/glossary.ts`

> Énergie qu’il faut fournir pour séparer les constituants d’un système lié (noyau, proton). Compte négativement dans la masse totale.

**Problème** : Vrai pour un noyau ou un atome, mais faux pour le proton cité en exemple : sa masse (~938 MeV) excède largement la somme des masses de ses quarks (~9 MeV) — l'énergie de confinement QCD compte POSITIVEMENT dans la masse. De plus, le confinement interdit de séparer les quarks, quelle que soit l'énergie fournie. L'exemple contredit la page « masse-energie-confinee » vers laquelle pointe l'entrée.

**Correction** : Énergie qu’il faut fournir pour séparer les constituants d’un système lié (noyau, atome, molécule). Compte négativement dans la masse totale. Le proton est l’exception inverse : l’énergie de confinement y ajoute l’essentiel de la masse (voir « Masse = énergie confinée »).

*Sources : https://physics.aps.org/articles/v11/118 ; https://www.snexplores.org/article/much-protons-mass-comes-from-energy-of-particles-inside ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-ii/masse-energie-confinee.mdx (encart ligne 93 : Δm < 0 pour le proton, confinement)*

#### 🟠 Important — `src/pages/physique/partie-iv/chiralite.mdx`

> L'interaction faible ne couple qu'aux fermions de chiralité **gauche** (et aux antifermions de chiralité droite).

**Problème** : Vrai uniquement pour les courants chargés (échange de W, désintégration bêta). Le boson Z — présenté dans le cours comme messager de l'interaction faible — se couple aussi aux fermions de chiralité droite (couplage ∝ Q·sin²θ_W), mesuré avec précision au LEP via les asymétries. L'énoncé absolu, posé en Résultat avec badge 🟢 etabli, enseigne que le Z ignore les fermions droits, ce qui est faux.

**Correction** : Remplacer la première phrase du Resultat ligne 46 de /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-iv/chiralite.mdx par : « Les courants chargés de l'interaction faible (bosons W) ne couplent que les fermions de chiralité **gauche** (et les antifermions de chiralité droite) ; le courant neutre (boson Z) se couple aussi, plus faiblement, aux fermions droits, tout en violant lui aussi la parité. » (conserver « La symétrie miroir n'est pas une loi de la Nature. » et le badge). Corriger aussi interaction-faible.mdx:98 (même énoncé absolu) et :104 (« violation maximale » ne vaut que pour les courants chargés).

*Sources : https://pdg.web.cern.ch/pdg/2020/reviews/rpp2020-rev-standard-model.pdf ; https://www2.ph.ed.ac.uk/~playfer/PPlect16.pdf ; https://cds.cern.ch/record/819632/files/p1.pdf ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-iv/bosons-jauge.mdx (ligne 51 : W et Z transmettent l'interaction faible)*

#### 🟠 Important — `src/pages/physique/partie-v/electrofaible.mdx`

> Les quatre particules messagères de l'électrofaible (les bosons $W^+$, $W^-$, $Z^0$ et le photon $\gamma$) jouent alors des rôles totalement interchangeables.

**Problème** : Faux même à haute énergie : le W⁺ est chargé, le photon neutre — la charge étant conservée à toute énergie, ils ne sont jamais interchangeables. Dans la phase symétrique, les quatre bosons sont W₁, W₂, W₃ (SU(2)) et B (U(1)), avec deux couplages g et g' distincts ; γ et Z⁰ ne sont que des mélanges qui n'émergent qu'après la brisure.

**Correction** : Remplacer la phrase « Les quatre particules messagères de l'électrofaible (les bosons $W^+$, $W^-$, $Z^0$ et le photon $\gamma$) jouent alors des rôles totalement interchangeables. » par : « Les quatre bosons de la théorie deviennent alors tous sans masse et relèvent d'une même description unifiée ; le photon $\gamma$ et le $Z^0$ y perdent même leur identité propre : ce ne sont que des mélanges de deux bosons plus fondamentaux ($W_3$ et $B$), qui ne se distinguent qu'après la brisure de symétrie. (Les $W^\pm$, eux, restent chargés : à aucune énergie un $W^+$ ne devient un photon.) »

*Sources : https://en.wikipedia.org/wiki/Electroweak_interaction ; https://www.hep.phy.cam.ac.uk/~chpotter/particleandnuclearphysics/Lecture_10_Electroweak.pdf ; https://arxiv.org/pdf/hep-ph/9812300*

#### 🟠 Important — `src/pages/physique/partie-v/interaction-faible.mdx`

> Plus précisément, elle n'agit que sur les fermions de <Prereq href="/physique/partie-iv/chiralite">chiralité gauche</Prereq> (et les antifermions de chiralité droite).

**Problème** : Vrai uniquement pour le courant chargé (bosons W±). Le Z⁰ — présenté plus haut dans ce même chapitre comme l'un des trois messagers faibles — se couple aussi aux fermions de chiralité droite (couplage ∝ sin²θ_W), sauf aux neutrinos. La violation de parité du courant neutre n'est d'ailleurs pas maximale, contrairement à ce que suggère le badge suivant.

**Correction** : Ligne 98, remplacer la phrase par : « Plus précisément, les courants chargés (échanges de $W^\pm$) n'agissent que sur les fermions de <Prereq href="/physique/partie-iv/chiralite">chiralité gauche</Prereq> (et les antifermions de chiralité droite) ; le $Z^0$, lui, se couple aux deux chiralités — sauf aux neutrinos — mais avec des intensités différentes. » Ligne 104, remplacer le badge par : « Violation maximale de la parité par les courants chargés faibles : établie par l'expérience de Wu sur le $^{60}$Co et confirmée d'innombrables fois depuis. »

*Sources : https://pdg.lbl.gov/2024/reviews/rpp2024-rev-standard-model.pdf ; https://arxiv.org/pdf/hep-ex/9909053 ; https://arxiv.org/pdf/1703.04978*

#### 🟡 Mineur — `src/data/physique/glossary.ts`

> Particule composite faite de quarks liés par la force forte : baryons (3 quarks, ex. proton) et mésons (quark + antiquark, ex. pion).

**Problème** : Présentée comme une classification exhaustive, elle est dépassée : des hadrons exotiques — tétraquarks et pentaquarks — sont observés expérimentalement (LHCb, pentaquarks en 2015, plusieurs tétraquarks confirmés depuis, ex. T_cc⁺ en 2021).

**Correction** : Particule composite faite de quarks liés par la force forte : baryons (3 quarks, ex. proton) et mésons (quark + antiquark, ex. pion) ; des états exotiques (tétraquarks, pentaquarks) ont aussi été observés depuis 2015.

*Sources : LHCb, « Observation of J/ψp resonances consistent with pentaquark states », Phys. Rev. Lett. 115, 072001 (2015) ; LHCb, « Observation of an exotic narrow doubly charmed tetraquark T_cc⁺ », Nature Physics 18, 751–754 (2022) ; Particle Data Group, Review of Particle Physics — section « Heavy non-qq̄ mesons » / états exotiques ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-v/interaction-forte.mdx (ligne 56 : « Deux façons d'y parvenir », aucune nuance sur les exotiques)*

#### 🟡 Mineur — `src/data/physique/glossary.ts`

> Son seuil en fréquence prouve que la lumière est faite de quanta d’énergie E = hν (Einstein, 1905).

**Problème** : « Prouve » est épistémiquement trop fort : le seuil photoélectrique s'explique aussi par un modèle semi-classique (matière quantifiée, champ classique — Lamb & Scully 1969). La preuve directe du photon vient d'expériences ultérieures (Compton 1923, anti-corrélations de Grangier et al. 1986). Gênant dans un cours « déductif » qui étiquette ses niveaux de preuve.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/physique/glossary.ts (ligne 36), remplacer « Son seuil en fréquence prouve que la lumière est faite de quanta d’énergie E = hν (Einstein, 1905). » par « Son seuil en fréquence a conduit Einstein à postuler que la lumière échange l’énergie par quanta E = hν (1905), hypothèse confirmée ensuite (effet Compton, optique quantique). »

*Sources : Lamb & Scully (1969), « The photoelectric effect without photons », in Polarisation, Matière et Rayonnement (Presses Universitaires de France) ; Grangier, Roger & Aspect (1986), Europhys. Lett. 1, 173 — anti-corrélations sur photon unique, preuve directe de la quantification du champ ; Compton (1923), Phys. Rev. 21, 483 — diffusion X confirmant le quantum de lumière ; Kimble, Dagenais & Mandel (1977), Phys. Rev. Lett. 39, 691 — antibunching*

#### 🟡 Mineur — `src/pages/physique/partie-i/consequences.mdx`

> elles affichaient un écart de quelques centaines de nanosecondes par rapport aux horloges restées au sol

**Problème** : Hafele–Keating (1971) : vers l'est l'écart mesuré était de −59 ± 10 ns (quelques dizaines, pas centaines) ; seul le sens ouest donnait +273 ± 7 ns. Le badge attenant « Écart prédit et mesuré à mieux que 10 % » surévalue l'accord : vers l'est, prédit −40 ± 23 ns contre mesuré −59 ± 10 ns, soit ~50 % d'écart entre valeurs centrales, compatible seulement au sein des barres d'erreur.

**Correction** : Remplacer (lignes 206–209 de /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/consequences.mdx) : « elles affichaient un écart de quelques centaines de nanosecondes par rapport aux horloges restées au sol, conforme au calcul » par « elles affichaient des écarts de quelques dizaines à quelques centaines de nanosecondes par rapport aux horloges restées au sol (−59 ns vers l'est, +273 ns vers l'ouest), conformes au calcul » ; et remplacer le badge « Écart prédit et mesuré à mieux que 10 %. » par « Accord avec la prédiction dans les incertitudes (à ~1 % vers l'ouest) ; répétitions de 1996 et 2010 bien plus précises. »

*Sources : Hafele J.C., Keating R.E., « Around-the-World Atomic Clocks: Predicted Relativistic Time Gains », Science 177(4044), 166–168 (1972) ; Hafele J.C., Keating R.E., « Around-the-World Atomic Clocks: Observed Relativistic Time Gains », Science 177(4044), 168–170 (1972) ; NPL, répétition du 25e anniversaire (1996) et répétition de 2010 — accord à quelques % ; voir aussi https://en.wikipedia.org/wiki/Hafele%E2%80%93Keating_experiment*

#### 🟡 Mineur — `src/pages/physique/partie-i/lorentz-gamma.mdx`

> attaquons maintenant son premier grand effet géométrique : la **contraction des longueurs**.

**Problème** : Incohérence de structure : la contraction des longueurs a déjà été démontrée au chapitre précédent (consequences.mdx, auquel cette page renvoie d'ailleurs en introduction), et le chapitre suivant est « Les transformations de Lorentz ». L'annonce oriente le lecteur vers un contenu déjà traité.

**Correction** : attaquons maintenant la règle de traduction complète entre référentiels : les **transformations de Lorentz**.

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/lorentz-gamma.mdx (ligne 123) ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/consequences.mdx (lignes 216-272 : démonstration de la contraction) ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/transformations-lorentz.mdx (lignes 18-22 : la contraction est un prérequis déjà acquis) ; /home/sfaurite/tmp/cours-hub/src/lib/nav/_physique.ts (lignes 65-101 : ordre des chapitres)*

#### 🟡 Mineur — `src/pages/physique/partie-i/minkowski.mdx`

> Seul un rayon lumineux relie les deux événements : $c\lvert\Delta t\rvert = \lvert\Delta x\rvert$.

**Problème** : Le tableau des trois genres suit la définition générale s² = (cΔt)² − Δx² − Δy² − Δz² ; la condition de genre lumière y est donc c|Δt| = √(Δx²+Δy²+Δz²). La forme c|Δt| = |Δx| n'est valable qu'en 1D, restriction qui n'est annoncée qu'à la section suivante (« en posant Δy=Δz=0 »).

**Correction** : Dans la cellule genre lumière du tableau (ligne 102 de /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/minkowski.mdx), remplacer « $c\lvert\Delta t\rvert = \lvert\Delta x\rvert$ » par « $c\lvert\Delta t\rvert = \sqrt{\Delta x^2 + \Delta y^2 + \Delta z^2}$ ».

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/minkowski.mdx (lignes 40, 90, 102, 111 — incohérence interne) ; Landau & Lifchitz, Théorie des champs, §2 (intervalle nul : c²Δt² = Δx²+Δy²+Δz²) ; Taylor & Wheeler, Spacetime Physics (condition lightlike en 3D spatiale)*

#### 🟡 Mineur — `src/pages/physique/partie-i/postulats.mdx`

> elle est au cœur du fonctionnement du GPS, qui en tiendrait compte sous peine d'erreurs de plusieurs kilomètres par jour.

**Problème** : Phrase inversée : « qui en tiendrait compte sous peine d'erreurs » dit le contraire de l'intention (c'est s'il n'en tenait PAS compte qu'il y aurait erreur). De plus, la dérive de ~10 km/jour vient des effets de rythme d'horloge (dilatation du temps + décalage gravitationnel), pas spécifiquement de la relativité de la simultanéité, dont l'effet sur le GPS (synchronisation, Sagnac) est de l'ordre de dizaines de mètres.

**Correction** : La relativité de la simultanéité est une conséquence directe et vérifiée des postulats. Le GPS, lui, doit tenir compte des effets relativistes sous peine de dériver d'environ 10 km par jour (dilatation du temps et décalage gravitationnel) ; la relativité de la simultanéité intervient dans la synchronisation des horloges entre satellites et sol (correction de Sagnac, quelques dizaines de mètres).

*Sources : Ashby, N., « Relativity in the Global Positioning System », Living Reviews in Relativity 6, 1 (2003) — net clock offset ≈ +38 µs/jour ⇒ ~11 km/jour si non corrigé ; correction Sagnac ≤ 207 ns ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/postulats.mdx (ligne 109)*

#### 🟡 Mineur — `src/pages/physique/partie-i/transformations-lorentz.mdx`

> Ces deux énoncés sont posés au chapitre des <Prereq href="/physique/partie-i/consequences">deux postulats d'Einstein</Prereq>.

**Problème** : Le lien pointe vers la page « consequences » alors que les deux postulats sont énoncés et discutés dans la page « postulats ». Le texte du lien est correct mais le href renvoie au mauvais chapitre.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/transformations-lorentz.mdx, ligne 37, remplacer <Prereq href="/physique/partie-i/consequences">deux postulats d'Einstein</Prereq> par <Prereq href="/physique/partie-i/postulats">deux postulats d'Einstein</Prereq>.

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/transformations-lorentz.mdx (ligne 37) ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/postulats.mdx (titre : Les deux postulats d'Einstein) ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-i/consequences.mdx (même phrase avec href correct vers /physique/partie-i/postulats)*

#### 🟡 Mineur — `src/pages/physique/partie-ii/particules-sans-masse.mdx`

> C'est la formule générale de la vitesse, valable pour **toute** particule :

**Problème** : v = pc²/E est obtenue en simplifiant γ et m dans p = γmv et E = γmc², expressions qui présupposent m ≠ 0 (pour m = 0, γ diverge et γm est une forme 0×∞ ; la simplification de l'Étape 2 est un 0/0). L'appliquer ensuite au cas m = 0 (Étape 5) est un saut logique dans un cours qui se veut déductif — le résultat v = c est correct, mais pas déduit.

**Correction** : Remplacer la phrase de l'Étape 3 par : « **Étape 3.** On isole $v$ en multipliant les deux membres par $c^2$. Telle quelle, la formule est démontrée pour $m \neq 0$ (la simplification de l'Étape 2 le suppose). Mais elle s'étend continûment au cas sans masse : à énergie $E$ fixée, quand $m \to 0$, la relation $E^2 = (mc^2)^2 + (pc)^2$ donne $p \to E/c$, donc $v \to c$ — elle coïncide d'ailleurs avec la vitesse de groupe $v = dE/dp$ calculée sur $E = \sqrt{(mc^2)^2 + (pc)^2}$, valable pour toute masse, y compris nulle. C'est donc bien la formule générale de la vitesse, pour **toute** particule : »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-ii/particules-sans-masse.mdx (Encart calcul, Étapes 1-5) ; /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-ii/energie.mdx (E=γmc² dérivée via le théorème de l'énergie cinétique, donc pour v<c, m≠0) ; L. Okun, « The concept of mass », Physics Today 42(6), 1989 — p=γmv/E=γmc² indéfinies pour m=0 ; Taylor & Wheeler, Spacetime Physics, ch. 7-8 — v/c = pc/E et E=pc pour m=0 ; dE/dp = pc²/E valable pour tout m depuis E²=(mc²)²+(pc)²*

#### 🟡 Mineur — `src/pages/physique/partie-iii/dualite-de-broglie.mdx`

> vitesse typique $v \approx 7{,}3 \times 10^{6}\ \text{m/s}$ (un électron accéléré sous une centaine de volts)

**Problème** : Incohérence interne : v = 7,3×10⁶ m/s correspond à une énergie cinétique de ~151 eV, donc une tension d'environ 150 V, pas « une centaine de volts ». Sous 100 V, v ≈ 5,9×10⁶ m/s et λ ≈ 0,12 nm (et non 0,10 nm). Le calcul qui suit (p ≈ 6,6×10⁻²⁴ kg·m/s, λ ≈ 1,0×10⁻¹⁰ m) est correct pour 7,3×10⁶ m/s.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-iii/dualite-de-broglie.mdx (ligne 79), remplacer « (un électron accéléré sous une centaine de volts) » par « (un électron accéléré sous environ 150 volts) ».

*Sources : Calcul direct : E = ½m_e v² = 151 eV pour v = 7,3×10⁶ m/s ; λ = h/√(2m_e eU) ⇒ λ[nm] ≈ 1,226/√U[V], soit U ≈ 150 V pour λ = 1,0 Å ; Valeurs CODATA : m_e = 9,109×10⁻³¹ kg, h = 6,626×10⁻³⁴ J·s, e = 1,602×10⁻¹⁹ C ; Exemple classique des manuels (Davisson-Germer / microscopie électronique) : électron sous 150 V ⇔ λ = 1 Å*

#### 🟡 Mineur — `src/pages/physique/partie-iv/bosons-jauge.mdx`

> Photon et gluons de masse nulle, $W$ et $Z$ massifs : mesurés au CERN.

**Problème** : Les masses des W/Z sont bien mesurées au CERN, mais la masse nulle du photon n'est pas une mesure du CERN : c'est une borne supérieure (< ~10⁻¹⁸ eV) issue de tests de la loi de Coulomb et d'observations astrophysiques (champs magnétiques du vent solaire). Celle des gluons est une contrainte indirecte (jamais observés libres, cohérence QCD). L'attribution globale « mesurés au CERN » est inexacte.

**Correction** : <Badge niveau="etabli">$W$ et $Z$ massifs : mesurés au CERN. Le $Z$ a été produit des millions de fois au LEP ; sa masse vaut $91{,}19$ GeV/$c^2$, et celle des $W$ environ $80{,}4$ GeV/$c^2$. La masse du photon, elle, est bornée à moins de $10^{-18}$ eV/$c^2$ par des tests de la loi de Coulomb et des observations astrophysiques ; celle des gluons, jamais observés libres, est tenue pour nulle par cohérence de la QCD.</Badge>

*Sources : PDG, Particle Listings « gamma » : m_γ < 1×10⁻¹⁸ eV (Ryutov 2007, champ magnétique du vent solaire) ; Williams, Faller & Hill, Phys. Rev. Lett. 26 (1971) : test de la loi de Coulomb, m_γ < ~10⁻¹⁴ eV ; PDG, Particle Listings « g (gluon) » : Mass m = 0, valeur théorique ; quelques MeV non exclus ; Découverte du gluon : événements à trois jets, TASSO/PETRA, DESY, 1979 (pas le CERN)*

#### 🟡 Mineur — `src/pages/physique/partie-iv/chiralite.mdx`

> S'il n'existait que des gauchers, il n'y aurait personne avec qui les coupler — et la particule serait obligatoirement de masse nulle, filant à $c$ pour l'éternité.

**Problème** : Exact pour un fermion chargé (seule la masse de Dirac est permise), mais faux en général : un fermion neutre peut acquérir une masse de Majorana construite avec sa seule composante gauche (couplée à son propre conjugué de charge, qui est droit). C'est précisément l'hypothèse sérieuse, non tranchée, pour les neutrinos.

**Correction** : Ligne 64, après « filant à $c$ pour l'éternité. », ajouter : « (Une exception subtile existe pour un fermion électriquement **neutre**, qui peut se coupler à sa propre image conjuguée : c'est la masse dite « de Majorana », hypothèse sérieuse et encore ouverte pour les neutrinos.) »

*Sources : M. Srednicki, Quantum Field Theory, ch. 36 (masse de Majorana d'un fermion de Weyl unique) ; S. Weinberg, Phys. Rev. Lett. 43, 1566 (1979) — opérateur de dimension 5 donnant une masse de Majorana aux neutrinos sans composante droite ; PDG Review « Neutrino Masses, Mixing, and Oscillations » (2024) ; C. Giunti & C. W. Kim, Fundamentals of Neutrino Physics and Astrophysics, ch. 6*

#### 🟡 Mineur — `src/pages/physique/partie-iv/fermions.mdx`

> Les générations 2 et 3, plus lourdes, se désintègrent en une fraction de seconde et n'apparaissent que dans les rayons cosmiques ou les accélérateurs.

**Problème** : Faux pour les neutrinos ν_μ et ν_τ, qui font partie des générations 2 et 3 : aucune désintégration de neutrino n'a jamais été observée (ils oscillent mais ne se désintègrent pas), et ils abondent dans les flux solaire et atmosphérique. L'affirmation ne vaut que pour les fermions chargés (μ, τ, quarks c, s, t, b).

**Correction** : Remplacer la phrase incriminée (l.125 de /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-iv/fermions.mdx) par : « Les quarks et les leptons chargés des générations 2 et 3, plus lourds, se désintègrent en une fraction de seconde et n'apparaissent que dans les rayons cosmiques ou les accélérateurs ; leurs neutrinos $\nu_\mu$ et $\nu_\tau$, eux, ne se désintègrent pas (ils oscillent entre saveurs) et arrivent en abondance dans les flux solaire et atmosphérique. » Ajuster aussi le badge l.127, p. ex. : « La stabilité des fermions de première génération et la désintégration rapide des quarks et leptons chargés des générations supérieures sont mesurées en accélérateur ; aucune désintégration de neutrino n'a jamais été observée. »

*Sources : Particle Data Group, Review of Particle Physics — propriétés des neutrinos (limites sur la durée de vie, aucune désintégration observée) ; SNO (Q.R. Ahmad et al., PRL 2002) — conversion de saveur des neutrinos solaires : ~2/3 du flux arrive en ν_μ/ν_τ ; Super-Kamiokande (Y. Fukuda et al., PRL 1998) — oscillations des neutrinos atmosphériques ν_μ ; Prix Nobel de physique 2015 (Kajita, McDonald) — oscillations des neutrinos, déjà cité l.99 du fichier*

#### 🟡 Mineur — `src/pages/physique/partie-iv/vue-ensemble.mdx`

> le positron est prédit par Dirac (1928) puis observé en 1932

**Problème** : L'équation de Dirac date bien de 1928, mais la prédiction explicite de l'anti-électron date de 1931 (article « Quantised Singularities in the Electromagnetic Field ») ; entre 1929 et 1930, Dirac interprétait encore les « trous » comme des protons.

**Correction** : le positron est prédit par Dirac en 1931 (à partir de son équation de 1928) puis observé par Anderson en 1932

*Sources : P. A. M. Dirac, « Quantised Singularities in the Electromagnetic Field », Proc. R. Soc. A 133, 60 (1931) — prédiction explicite de l'anti-électron ; P. A. M. Dirac, « A Theory of Electrons et Protons », Proc. R. Soc. A 126, 360 (1930) — trous interprétés comme des protons ; C. D. Anderson, « The Positive Electron », Phys. Rev. 43, 491 (1933) ; première annonce dans Science (1932)*

#### 🟡 Mineur — `src/pages/physique/partie-v/electrofaible.mdx`

> \cos\theta_W = \frac{m_W}{m_Z}, \qquad \sin^2\theta_W \approx 0{,}231.

**Problème** : Incohérence numérique : avec la définition donnée (cos θ_W = m_W/m_Z, schéma « on-shell »), m_W = 80,4 et m_Z = 91,2 GeV donnent sin²θ_W = 1 − (m_W/m_Z)² ≈ 0,223. La valeur 0,231 correspond à une autre définition (sin²θ_eff ou schéma MS-bar ≈ 0,2312). Le lecteur qui refait le calcul trouve 0,223, pas 0,231.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-v/electrofaible.mdx (ligne 61), remplacer « $$ \cos\theta_W = \frac{m_W}{m_Z}, \qquad \sin^2\theta_W \approx 0{,}231. $$ » par « $$ \cos\theta_W = \frac{m_W}{m_Z}, \qquad \sin^2\theta_W = 1 - \frac{m_W^2}{m_Z^2} \approx 0{,}223. $$ »

*Sources : PDG, Review of Particle Physics, « Electroweak Model and Constraints on New Physics » : sin²θ_W on-shell = 1 − m_W²/m_Z² = 0,22305 ; sin²θ̂(M_Z) MS-bar = 0,23129 ; sin²θ_eff^lept ≈ 0,23155 ; Calcul direct : 1 − (80,4/91,2)² = 0,2228 ; 1 − (80,3692/91,1880)² = 0,2232*

#### 🟡 Mineur — `src/pages/physique/partie-v/gravitation.mdx`

> | Image d'un trou noir | Telescope Event Horizon (M87, Sgr A*) | 2019, 2022 |

**Problème** : Nom propre inversé : la collaboration s'appelle « Event Horizon Telescope » (EHT). « Telescope Event Horizon » n'est ni le nom anglais ni une traduction française correcte (qui serait « télescope de l'horizon des événements »).

**Correction** : | Image d'un trou noir | Event Horizon Telescope (M87, Sgr A*) | 2019, 2022 |

*Sources : https://eventhorizontelescope.org/ ; EHT Collaboration, ApJL 875 L1 (2019) — First M87 Event Horizon Telescope Results ; EHT Collaboration, ApJL 930 L12 (2022) — First Sagittarius A* Event Horizon Telescope Results*

#### 🟡 Mineur — `src/pages/physique/partie-v/interaction-forte.mdx`

> seules existent librement les combinaisons de couleur **neutre** (« blanche »). Deux façons d'y parvenir :

**Problème** : Présenté comme exhaustif, c'est périmé : des hadrons exotiques neutres en couleur autres que qqq et qq̄ ont été observés — tétraquarks (Z_c(3900) en 2013, T_cc⁺ en 2021) et pentaquarks (états P_c, LHCb 2015). Ce sont des découvertes établies, pas des hypothèses.

**Correction** : Ligne 56 : remplacer « Deux façons d'y parvenir : » par « Les deux façons les plus simples d'y parvenir : ». Après le paragraphe ligne 65, ajouter : « Depuis 2013, des combinaisons blanches plus exotiques ont aussi été observées (expériences BESIII et LHCb) : **tétraquarks** ($qq\bar{q}\bar{q}$, comme le $T_{cc}^+$ en 2021) et **pentaquarks** ($qqqq\bar{q}$, états $P_c$ découverts en 2015) — toujours neutres en couleur, conformément à la règle. »

*Sources : LHCb, « Observation of J/ψp resonances consistent with pentaquark states », Phys. Rev. Lett. 115, 072001 (2015) ; LHCb, « Observation of an exotic narrow doubly charmed tetraquark T_cc+ », Nature Physics 18, 751 (2022), arXiv:2109.01038 ; BESIII, « Observation of a charged charmoniumlike structure Zc(3900) », Phys. Rev. Lett. 110, 252001 (2013) ; Particle Data Group, Review of Particle Physics — section « Exotic mesons » / pentaquark listings*

#### 🟡 Mineur — `src/pages/physique/partie-vi/asymetrie.mdx`

> Pour environ **un milliard** de paires qui se sont mutuellement détruites en libérant deux photons chacune

**Problème** : L'annihilation « deux photons » vaut pour e⁺e⁻ ; une paire baryon–antibaryon (p–p̄) s'annihile surtout en pions, qui se désintègrent ensuite en photons, neutrinos et e±. De plus, la phrase suivante (« Ce sont précisément les photons du fond diffus cosmologique ») surinterprète : les photons du CMB proviennent du bain thermique, thermalisé jusqu'à la recombinaison, pas directement des photons d'annihilation.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-vi/asymetrie.mdx (ligne 36), remplacer « Pour environ **un milliard** de paires qui se sont mutuellement détruites en libérant deux photons chacune » par « Pour environ **un milliard** de paires qui se sont mutuellement détruites en libérant leur énergie sous forme de rayonnement », et remplacer « Ce sont précisément les photons du fond diffus cosmologique que l'on détecte encore. » par « Leur énergie a alimenté le bain de photons dont le fond diffus cosmologique est l'héritier — environ un milliard de photons pour chaque baryon survivant. »

*Sources : Klempt, Batty & Richard, « The antinucleon–nucleon interaction at low energy: annihilation dynamics », Phys. Rep. 413 (2005) — annihilation N–N̄ dominée par des états multi-pions (~5 pions en moyenne) ; Kolb & Turner, The Early Universe (1990), ch. 3 — η baryon/photon, bain thermique et conservation de l'entropie ; Fixsen et al., ApJ 473 (1996) — spectre de corps noir du CMB (COBE/FIRAS) : photons thermalisés jusqu'à la recombinaison ; Planck Collaboration 2018 (A&A 641, A6) — η ≈ 6×10⁻¹⁰, concordance CMB / nucléosynthèse*

#### 🟡 Mineur — `src/pages/physique/partie-vi/gravite-quantique.mdx`

> Cela ne fonctionne proprement que si la constante de couplage n'a pas une dimension « négative »

**Problème** : Le critère de renormalisabilité porte sur la dimension de MASSE (énergie) du couplage : elle doit être ≥ 0. Or le texte illustre ensuite avec G qui « porte des unités de (longueur)² » — une puissance positive de longueur. Sans préciser qu'il s'agit de la dimension en masse (G ~ masse⁻²), le lecteur voit une contradiction apparente entre « pas de dimension négative » et « (longueur)² ».

**Correction** : Remplacer le paragraphe ligne 47 de /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-vi/gravite-quantique.mdx par : « Cela ne fonctionne proprement que si la constante de couplage n'a pas une dimension négative **en énergie** : c'est le cas, par exemple, de la constante de structure fine $\alpha \approx 1/137$, qui est **sans dimension**. Or la constante de couplage de la gravité, c'est essentiellement $G$ (la constante de Newton), et $G$ **a une dimension** : en unités naturelles ($\hbar = c = 1$), où une longueur est l'inverse d'une énergie, elle porte des unités de (longueur)$^2$ = (énergie)$^{-2}$ — soit une dimension d'énergie $-2$, bel et bien négative. C'est ce signe qui condamne la renormalisation. »

*Sources : Peskin & Schroeder, An Introduction to Quantum Field Theory, §10.1 : critère de comptage de puissances — couplage de dimension de masse négative ⇒ théorie non renormalisable ; Zee, Quantum Field Theory in a Nutshell, ch. III.2 et VIII : G_N = 1/M_Pl², dimension de masse −2, d'où non-renormalisabilité de la gravité ; 't Hooft & Veltman (1974), « One-loop divergencies in the theory of gravitation », Ann. Inst. Henri Poincaré A20, 69 : divergences de la gravité quantifiée perturbativement*

#### 🟡 Mineur — `src/pages/physique/partie-vi/masse-neutrinos.mdx`

> moins de $\sim 0{,}8\ \text{eV}/c^2$ par limite directe (expérience KATRIN)

**Problème** : Affirmation périmée : la limite directe de KATRIN publiée en avril 2025 (Science, analyse de 259 jours de données) est m_ν < 0,45 eV/c² à 90 % CL. La valeur 0,8 eV correspond au résultat de 2022. La phrase reste vraie en tant que borne supérieure, mais n'est plus l'état de l'art.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/physique/partie-vi/masse-neutrinos.mdx (ligne 66), remplacer « moins de $\sim 0{,}8\ \text{eV}/c^2$ par limite directe (expérience KATRIN) » par « moins de $\sim 0{,}45\ \text{eV}/c^2$ par limite directe (expérience KATRIN, 2025) »

*Sources : KATRIN Collaboration, « Direct neutrino-mass measurement based on 259 days of KATRIN data », Science 388, eadq9592 (avril 2025) — m_ν < 0,45 eV/c² à 90 % CL (arXiv:2406.13516) ; KATRIN Collaboration, Nature Physics 18, 160–166 (2022) — ancienne limite m_ν < 0,8 eV/c²*

### Mathématiques — 7 confirmés

#### 🟠 Important — `src/pages/maths/partie-ii/reels-dedekind.mdx`

> si $A \not\subseteq B$, un $q \in A \setminus B$ minore $B$ tout entier (clôture vers le bas de $A$), donc $B \subseteq A$

**Problème** : Le mot « minore » est faux : q MAJORE B (tout b ∈ B vérifie b < q, sinon la clôture vers le bas de B donnerait q ∈ B, contradiction avec q ∉ B). De plus, cette étape de majoration utilise la clôture vers le bas de B, pas celle de A ; c'est l'inclusion finale B ⊆ A qui utilise celle de A. Tel quel, l'argument est un non-sequitur (si q minorait B, la clôture de A ne donnerait pas B ⊆ A).

**Correction** : Remplacer la ligne 157 par : <Badge niveau="demontre">Ordre total déduit de la définition : si $A \not\subseteq B$, soit $q \in A \setminus B$ ; tout $b \in B$ vérifie $b < q$ (sinon $q \le b$ et la clôture vers le bas de $B$ donnerait $q \in B$) ; la clôture vers le bas de $A$ donne alors $B \subseteq A$.</Badge>

*Sources : https://math.hws.edu/eck/math331/guide2020/02-dedekind-cuts.html ; Rudin, Principles of Mathematical Analysis, Appendix to Chapter 1, Step 2 — https://www.lehman.edu/faculty/rbettiol/lehman_teaching/2020mat320/baby_Rudin.pdf ; https://en.wikipedia.org/wiki/Dedekind_cut*

#### 🟠 Important — `src/pages/maths/partie-ii/reels-dedekind.mdx`

> Contrairement aux chapitres de physique de la Partie I, où l'expérience nous *imposait* de nouvelles hypothèses

**Problème** : Référence interne fausse : la Partie I de CE cours de maths ne contient aucun chapitre de physique (uniquement « methode-axiomatique » et « ensembles-zf »). La phrase semble copiée d'un autre cours du hub (cosmologie). Le lecteur est renvoyé vers des chapitres inexistants.

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-ii/reels-dedekind.mdx (ligne 196) « Contrairement aux chapitres de physique de la Partie I, où l'expérience nous *imposait* de nouvelles hypothèses, ici tout est **pure déduction** » par « Contrairement aux sciences expérimentales — voyez les cours de physique de ce hub —, où l'expérience *impose* en cours de route de nouvelles hypothèses, ici tout est **pure déduction** ». Conserver la suite (« — d'où l'absence de tout “tournant” ») : le bandeau « Tournant » est bien défini dans maths/comment-lire.mdx.

*Sources : /home/sfaurite/tmp/cours-hub/src/lib/nav/_maths.ts (Partie I : methode-axiomatique, ensembles-zf uniquement) ; /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-i/ (seuls fichiers : methode-axiomatique.mdx, ensembles-zf.mdx) ; /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-ii/reels-dedekind.mdx ligne 196 ; /home/sfaurite/tmp/cours-hub/src/pages/maths/comment-lire.mdx lignes 35-41 (bandeau « Tournant » défini)*

#### 🟡 Mineur — `src/data/maths/glossary.ts`

> tout système d’axiomes cohérent et assez riche pour l’arithmétique contient des énoncés vrais qu’il ne peut démontrer

**Problème** : Hypothèse d'axiomatisabilité effective (récursive) manquante : l'arithmétique vraie Th(ℕ) est cohérente, contient toute l'arithmétique et est complète — elle échappe au théorème car non récursivement axiomatisable. Détail historique : Gödel 1931 supposait l'ω-cohérence ; l'affaiblissement à la simple cohérence est dû à Rosser (1936).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/maths/glossary.ts (l. 17), remplacer « tout système d’axiomes cohérent et assez riche pour l’arithmétique » par « tout système d’axiomes cohérent, récursivement axiomatisable et assez riche pour l’arithmétique » (le reste de la définition est inchangé).

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-i/methode-axiomatique.mdx (l. 93-113 : énoncé exact avec l'hypothèse de récursivité) ; Gödel, « Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I », 1931 (ω-cohérence) ; Rosser, « Extensions of some theorems of Gödel and Church », JSL, 1936 (affaiblissement à la cohérence) ; Stanford Encyclopedia of Philosophy, « Gödel's Incompleteness Theorems » (nécessité de l'axiomatisabilité effective ; contre-exemple Th(ℕ))*

#### 🟡 Mineur — `src/data/maths/glossary.ts`

> ℝ est complet (toute partie majorée a une borne supérieure)

**Problème** : Il manque « non vide » : l'ensemble vide est majoré par n'importe quel réel mais n'a pas de borne supérieure dans ℝ. La propriété de la borne supérieure s'énonce toujours pour les parties non vides.

**Correction** : ℝ est complet (toute partie non vide et majorée a une borne supérieure)

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-ii/reels-dedekind.mdx (l.163-167 : énoncé et preuve avec non-vacuité) ; Rudin, Principles of Mathematical Analysis, déf. 1.10 (least-upper-bound property : « every nonempty subset bounded above… ») ; /home/sfaurite/tmp/cours-hub/src/data/maths/symbols.ts l.22 (même omission)*

#### 🟡 Mineur — `src/data/maths/symbols.ts`

> Complet : toute partie majorée a une borne supérieure.

**Problème** : Même omission que dans le glossaire : sans la condition « non vide », l'énoncé est faux (∅ est majoré mais n'a pas de borne supérieure dans ℝ).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/maths/symbols.ts (ligne 22), remplacer la desc par : 'Les coupures de Dedekind de ℚ. Complet : toute partie non vide et majorée a une borne supérieure.'

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-ii/reels-dedekind.mdx (lignes 163 et 167 : énoncé et preuve avec hypothèse non vide) ; Rudin, Principles of Mathematical Analysis, déf. 1.10 et thm 1.19 (least-upper-bound property pour parties non vides majorées) ; /home/sfaurite/tmp/cours-hub/src/data/maths/glossary.ts ligne 29 (même omission)*

#### 🟡 Mineur — `src/pages/maths/partie-i/ensembles-zf.mdx`

> s'obtient par séparation à l'intérieur d'un $\mathcal{P}(\mathcal{P}(A \cup B))$ bien choisi — tout existe déjà grâce aux axiomes 3, 4 et 5

**Problème** : La construction nécessite aussi l'axiome de la paire (axiome 2) : il sert à former A ∪ B = ⋃{A, B} et à fabriquer chaque couple de Kuratowski {{a},{a,b}}. L'énumération « axiomes 3, 4 et 5 » (réunion, parties, séparation) est incomplète.

**Correction** : Remplacer, ligne 167 de /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-i/ensembles-zf.mdx, « tout existe déjà grâce aux axiomes 3, 4 et 5 » par « tout existe déjà grâce aux axiomes 2, 3, 4 et 5 »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-i/ensembles-zf.mdx (numérotation des axiomes, lignes 77-84 ; passage incriminé, ligne 167) ; Construction standard : A×B ⊆ P(P(A∪B)) avec A∪B = ⋃{A,B} — cf. K. Kunen, Set Theory (ch. I) ; T. Jech, Set Theory (ch. 1)*

#### 🟡 Mineur — `src/pages/maths/partie-i/methode-axiomatique.mdx`

> Tout système cohérent, récursivement axiomatisable et assez riche pour l'arithmétique contient un énoncé } G \text{ ni démontrable ni réfutable.} […] Théorème démontré en 1931

**Problème** : Gödel (1931) n'a prouvé la non-réfutabilité de G que sous l'hypothèse plus forte d'ω-cohérence. La version énoncée ici, avec la simple cohérence, est le théorème de Gödel–Rosser, démontré par Rosser en 1936. L'attribution « démontré en 1931 » est donc imprécise pour cet énoncé exact.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/maths/partie-i/methode-axiomatique.mdx, ligne 99, remplacer le badge par : <Badge niveau="demontre" slot="badge">Démontré par Gödel (1931) sous une hypothèse légèrement plus forte (l'ω-cohérence) ; la forme ci-dessus, sous la seule cohérence, est due à Rosser (1936). Jamais remis en cause.</Badge>

*Sources : K. Gödel, « Über formal unentscheidbare Sätze der Principia Mathematica und verwandter Systeme I », Monatshefte für Mathematik und Physik, 1931 (hypothèse d'ω-cohérence pour la non-réfutabilité) ; J. B. Rosser, « Extensions of Some Theorems of Gödel and Church », Journal of Symbolic Logic 1(3), 1936 (cohérence simple suffit) ; Stanford Encyclopedia of Philosophy, « Gödel's Incompleteness Theorems » (attribue explicitement le renforcement à Rosser 1936) ; P. Smith, An Introduction to Gödel's Theorems, CUP (distingue théorème de Gödel et théorème de Gödel–Rosser)*

### Chimie — 22 confirmés

#### 🟠 Important — `src/data/chimie/symbols.ts`

> A = atome central, X = doublets liants, E = doublets non liants ; détermine la géométrie de la molécule.

**Problème** : Dans la notation VSEPR AXₙEₘ, n compte les atomes liés à A (une liaison multiple compte pour un seul X), pas les doublets liants. Avec « X = doublets liants », CO₂ deviendrait AX₄ (au lieu de AX₂) et SO₂ serait mal classé : la géométrie prédite serait fausse pour toute molécule à liaison multiple.

**Correction** : A = atome central, X = atomes liés à A (une liaison multiple compte pour un seul X), E = doublets non liants ; détermine la géométrie de la molécule.

*Sources : https://en.wikipedia.org/wiki/VSEPR_theory ; https://chem.libretexts.org/Bookshelves/General_Chemistry/Map:_Chemistry_-_The_Central_Science_(Brown_et_al.)/09:_Molecular_Geometry_and_Bonding_Theories/9.02:_The_VSEPR_Model ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-iii/vsepr-geometrie.mdx (lignes 35 et 56 : « X un atome lié », « CO₂ est AX₂ »)*

#### 🟠 Important — `src/data/chimie/symbols.ts`

> valeur: 'tabulé (règle empirique) ; ex. CH₃COOH ≈ 4,76'

**Problème** : Statut épistémique mal calibré au regard de l'échelle du cours : un pKa est une constante d'équilibre mesurée de façon reproductible (potentiométrie, conductimétrie…), donc 🔵 « expérimental », pas 🟡 « règle empirique » (règle prédictive approchée). La valeur 4,76 elle-même est correcte.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/chimie/symbols.ts (ligne 46), remplacer « valeur: 'tabulé (règle empirique) ; ex. CH₃COOH ≈ 4,76' » par « valeur: 'tabulé (mesuré expérimentalement) ; ex. CH₃COOH ≈ 4,76' ». En complément, dans /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (ligne 77), retirer « pKa tabulés » des exemples du niveau 🟡 (remplacer « électronégativité, pKa tabulés » par « électronégativité, règles de prédiction des pKa ») pour lever la contradiction avec la ligne 76 qui classe les constantes d'équilibre en 🔵.

*Sources : https://pubs.acs.org/doi/10.1021/ja01343a013 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3747999/ ; https://www.acdlabs.com/wp-content/uploads/download/docs/Technical-Document-Introduction-to-pKa.pdf ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (lignes 76-77)*

#### 🟠 Important — `src/pages/chimie/partie-i/postulats-quantiques.mdx`

> Lorsqu'un système est **lié** (confiné, comme un électron retenu par un noyau), ses grandeurs observables — au premier rang desquelles l'énergie — ne prennent que des valeurs **discrètes**

**Problème** : Faux en généralité : pour un état lié, seule l'énergie (et certaines observables comme le moment cinétique) a un spectre discret. La position et la quantité de mouvement d'un électron lié restent des observables à spectre continu. Tel quel, le postulat enseigne que « tout » est quantifié dans un système lié.

**Correction** : Lorsqu'un système est **lié** (confiné, comme un électron retenu par un noyau), son énergie — et certaines autres grandeurs, comme le moment cinétique — ne prend que des valeurs **discrètes**, séparées par des écarts finis. D'autres grandeurs, comme la position, restent continues.

*Sources : https://en.wikipedia.org/wiki/Bound_state ; https://en.wikipedia.org/wiki/Discrete_spectrum*

#### 🟠 Important — `src/pages/chimie/partie-ii/orbitales-moleculaires.mdx`

> **Autant de liantes que d'antiliantes.** Chaque combinaison « somme » liante est accompagnée d'une combinaison « différence » antiliante.

**Problème** : Énoncé comme « principe incontournable [qui] gouverne tout diagramme d'OM » et badgé 🟢 (« conséquences mathématiques directes »), c'est faux en général : N OA peuvent donner des OM non liantes (allyle, liaison 3 centres-4 électrons : liante + non liante + antiliante). Le chapitre Lewis invoque justement ces liaisons à 3 centres pour SF₆ — contradiction interne. L'appariement strict ne vaut que pour 2 OA.

**Correction** : Ligne 42, remplacer le point 2 par : « 2. **Pour deux OA, une liante et une antiliante.** La combinaison « somme » est liante, la combinaison « différence » antiliante. Au-delà de deux OA, certaines des $N$ OM peuvent être **non liantes** : c'est le cas des liaisons à 3 centres invoquées pour $SF_6$ au chapitre précédent (une liante, une non liante, une antiliante). » Ligne 46, remplacer « Les points 1 et 2 découlent de l'algèbre linéaire appliquée à Schrödinger » par « Le point 1 découle de l'algèbre linéaire appliquée à Schrödinger ; le point 2 décrit le cas de deux OA — celui de tout ce chapitre » et le badge par : « La conservation du nombre d'états est une conséquence mathématique directe de la méthode variationnelle ; l'appariement strict liant/antiliant, lui, ne vaut que pour deux OA. »

*Sources : https://en.wikipedia.org/wiki/Three-center_four-electron_bond ; https://chem.libretexts.org/Courses/SUNY_Potsdam/Book:_Organic_Chemistry_II_(Walker)/13:_Extended_pi_Systems_and_Aromaticity/13.03:_Molecular_orbitals_for_three-carbon_systems ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-ii/liaison-covalente-lewis.mdx (lignes 108-110, liaisons à 3 centres pour SF₆)*

#### 🟠 Important — `src/pages/chimie/partie-ii/tableau-periodique.mdx`

> **Groupe** (la colonne) = le nombre d'**électrons de valence**, donc une **configuration de valence commune** à toute la colonne.

**Problème** : Faux dans la numérotation IUPAC à 18 colonnes utilisée par la page même (« groupe 17 », « groupe 18 ») : les halogènes du groupe 17 ont 7 électrons de valence, pas 17. L'égalité numéro de groupe = électrons de valence ne tient que pour les groupes 1–2 ; pour le bloc p il faut retrancher 10 ; pour le bloc d c'est plus subtil. Pris au pied de la lettre, on enseigne une équivalence numérique fausse.

**Correction** : - **Groupe** (la colonne) ↔ une **configuration de valence commune** à toute la colonne. Le numéro IUPAC donne le nombre d'**électrons de valence** : directement pour les groupes 1–2, en retranchant 10 pour les groupes 13–18 (ex. groupe 17 : $7$ électrons de valence, $ns^2\,np^5$) ; pour le bloc d (groupes 3–12), le décompte est plus subtil.

*Sources : https://en.wikipedia.org/wiki/Group_(periodic_table) ; https://sciencenotes.org/halogen-elements-list-and-facts/ ; https://www.vedantu.com/chemistry/electronic-configuration-of-group-17-elements ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-ii/tableau-periodique.mdx (lignes 70-84)*

#### 🟠 Important — `src/pages/chimie/partie-ii/tableau-periodique.mdx`

> La correspondance position $\leftrightarrow$ configuration de valence est exacte par construction : le tableau **est** le diagramme de remplissage. Position et configuration se déduisent l'une de l'autre.

**Problème** : Badge 🟢 quantique mal calibré : la correspondance n'est exacte que pour le remplissage idéal de Klechkowski. Une vingtaine d'éléments y dérogent dans leur état fondamental réel (Cr 3d⁵4s¹, Cu 3d¹⁰4s¹, Nb, Mo, Ru, Rh, Pd 4d¹⁰, Ag, Pt, Au…). Une même colonne n'a pas toujours la même configuration (groupe 10 : Ni 3d⁸4s², Pd 4d¹⁰, Pt 5d⁹6s¹), et « période = n maximal » échoue pour Pd (n max = 4 en période 5).

**Correction** : Remplacer la ligne 74 de /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-ii/tableau-periodique.mdx par : <Badge niveau="empirique">La correspondance position $\leftrightarrow$ configuration de valence est exacte pour le remplissage **idéalisé** (ordre de Klechkowski) : le tableau **est** ce diagramme déplié. Mais les configurations réelles s'en écartent pour une vingtaine d'éléments des blocs d et f (Cr, Cu, Nb, Mo, Pd, Pt, Au… — vu au chapitre précédent) : la lecture position $\rightarrow$ configuration est fiable, pas infaillible (ex. groupe 10 : Ni $3d^8 4s^2$, Pd $4d^{10}$, Pt $5d^9 6s^1$).</Badge> — et nuancer la puce « Période » ligne 71 en ajoutant « (pour la configuration idéalisée ; Pd, $[\text{Kr}]\,4d^{10}$, fait exception) ».

*Sources : https://physics.nist.gov/PhysRefData/Handbook/Tables/palladiumtable1.htm ; https://en.wikipedia.org/wiki/Aufbau_principle ; https://en.wikipedia.org/wiki/Electron_configurations_of_the_elements_(data_page) ; https://arxiv.org/pdf/1706.02535*

#### 🟡 Mineur — `src/data/chimie/symbols.ts`

> Variation du nombre de micro-états accessibles au cours de la réaction.

**Problème** : ΔrS n'est pas la variation du nombre de micro-états (ΔΩ, sans dimension) mais k_B fois la variation de son logarithme : ΔS = k_B ln(Ω_f/Ω_i). Telle quelle, la phrase est dimensionnellement incohérente avec l'unité J·K⁻¹·mol⁻¹ donnée juste à côté et contredit la formule S = k_B ln Ω de la ligne suivante.

**Correction** : Mesure la variation du nombre de micro-états accessibles au cours de la réaction : ΔS = k_B ln(Ω_f/Ω_i).

*Sources : /home/sfaurite/tmp/cours-hub/src/data/chimie/symbols.ts (lignes 36-37 : unité J·K⁻¹·mol⁻¹ et formule S = k_B ln Ω adjacente) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-iv/entropie-second-principe.mdx (lignes 26, 42, 92 : formulations correctes du cours) ; /home/sfaurite/tmp/cours-hub/src/data/chimie/glossary.ts (ligne 39) ; Atkins & de Paula, Physical Chemistry : S = k_B ln Ω, donc ΔS = k_B ln(Ω_f/Ω_i)*

#### 🟡 Mineur — `src/pages/chimie/partie-i/atome-hydrogene.mdx`

> Le noyau étant près de 1 800 fois plus lourd que l'électron, on le suppose immobile. Cette approximation rend le problème *exactement* soluble

**Problème** : L'approximation du proton fixe n'est pas ce qui rend le problème exactement soluble : le problème à deux corps coulombien est lui aussi exactement soluble (séparation du centre de masse, masse réduite μ). L'hypothèse simplifie seulement le formalisme.

**Correction** : on le suppose immobile. Cette approximation simplifie le problème sans changer sa solubilité *exacte* (le problème à deux corps se ramène exactement à un corps de masse réduite) ; elle n'introduit qu'un écart infime (~0,05 %) sur la valeur de l'énergie.

*Sources : Cohen-Tannoudji, Diu, Laloë, Mécanique quantique, t. I, ch. VII (atome d'hydrogène : séparation du centre de masse, masse réduite) ; Griffiths, Introduction to Quantum Mechanics, §4.2 (hydrogen atom, reduced-mass correction) ; CODATA : constante de Rydberg R_∞ vs R_H, rapport m_p/m_e ≈ 1836,15 → μ/mₑ ≈ 1 − 5,45×10⁻⁴ (~0,05 %)*

#### 🟡 Mineur — `src/pages/chimie/partie-i/atome-hydrogene.mdx`

> On y reconnaît des constantes **fondamentales** (valeurs mesurées) : masse de l'électron $m_e$ […] charge élémentaire $e$ […] constante de Planck $h$

**Problème** : Depuis la révision du SI de 2019, h et e ont des valeurs exactes fixées par définition (h = 6,62607015×10⁻³⁴ J·s, e = 1,602176634×10⁻¹⁹ C) ; seules m_e et ε₀ restent mesurées. Le chapitre postulats-quantiques le dit d'ailleurs explicitement pour h — contradiction interne.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-i/atome-hydrogene.mdx (ligne 64), remplacer « (valeurs mesurées) » par « ($h$ et $e$ sont fixées par définition du SI depuis 2019 ; $m_e$ et $\varepsilon_0$ sont mesurées) », pour s'harmoniser avec la formulation de postulats-quantiques.mdx.

*Sources : BIPM, Brochure SI 9e édition (2019) : h = 6,62607015×10⁻³⁴ J·s et e = 1,602176634×10⁻¹⁹ C exactes par définition ; CODATA 2018 : m_e et ε₀ (= e²/2αhc) restent des grandeurs mesurées avec incertitude ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-i/postulats-quantiques.mdx ligne 36 ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-iv/entropie-second-principe.mdx ligne 48*

#### 🟡 Mineur — `src/pages/chimie/partie-i/atome-hydrogene.mdx`

> Les contraintes $0 \leq l \leq n-1$ et $-l \leq m \leq l$ découlent des conditions de normalisation (partie radiale) et de mono-valuation de $\psi$ (partie angulaire).

**Problème** : Attribution imprécise : la mono-valuation (en φ) n'impose que m entier. La contrainte −l ≤ m ≤ l vient de la régularité/normalisabilité des solutions de l'équation polaire (fonctions de Legendre associées aux pôles θ = 0, π), pas de la mono-valuation.

**Correction** : Les contraintes $0 \leq l \leq n-1$ et $-l \leq m \leq l$ découlent de la normalisabilité de la partie radiale ($l \leq n-1$) et de la régularité de la partie angulaire aux pôles ($|m| \leq l$) ; la mono-valuation de $\psi$ n'impose que $m$ entier.

*Sources : Griffiths, Introduction to Quantum Mechanics, §4.1.1–4.1.2 (équation polaire, fonctions de Legendre associées régulières ⇒ l entier, |m| ≤ l ; e^{imφ} mono-valué ⇒ m entier) ; Cohen-Tannoudji, Diu, Laloë, Mécanique quantique, ch. VI (harmoniques sphériques) et ch. VII (atome d'hydrogène, troncature de la série radiale ⇒ l ≤ n−1) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-i/atome-hydrogene.mdx, ligne 85 (badge) et ligne 43 (encart, ne précise pas le mécanisme)*

#### 🟡 Mineur — `src/pages/chimie/partie-i/ecrantage-charge-effective.mdx`

> La valeur *exacte* de $Z^*$ se calcule numériquement, en résolvant l'atome à plusieurs électrons (méthodes de type Hartree-Fock) : c'est une grandeur bien définie.

**Problème** : Z* n'est pas une observable uniquement définie : sa valeur « exacte » dépend de la définition adoptée (ajustement sur ⟨r⟩ à la Clementi-Raimondi, sur les énergies orbitalaires, etc.). Dire « grandeur bien définie » suggère à tort une définition canonique unique.

**Correction** : Des valeurs de référence de $Z^*$ se calculent numériquement, en résolvant l'atome à plusieurs électrons (méthodes de type Hartree-Fock, valeurs de Clementi-Raimondi) — $Z^*$ reste toutefois une grandeur de modèle, dont la valeur dépend de la convention choisie pour la définir.

*Sources : E. Clementi, D. L. Raimondi, « Atomic Screening Constants from SCF Functions », J. Chem. Phys. 38, 2686 (1963) — Z* défini par convention : exposants de Slater optimisés en énergie SCF, Z* = n·ζ ; J. C. Slater, « Atomic Shielding Constants », Phys. Rev. 36, 57 (1930) — autre convention, valeurs différentes (Na 3s : 2,20 vs 2,51 chez Clementi-Raimondi, vs ≈1,84 depuis l'énergie d'ionisation 5,14 eV) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-i/ecrantage-charge-effective.mdx lignes 41 et 63 (la ligne 63 répète la formulation fautive)*

#### 🟡 Mineur — `src/pages/chimie/partie-i/postulats-quantiques.mdx`

> Le **principe** est nécessaire : une onde confinée a des niveaux discrets, indexés par l'entier $n$. C'est une conséquence directe des hypothèses 2 et 3.

**Problème** : Incohérence interne : le résultat est déduit de l'hypothèse 3 (de Broglie) + condition d'onde stationnaire, et il RETROUVE l'hypothèse 2 — le texte le dit lui-même juste après (« exactement ce que postulait l'hypothèse 2 — sauf qu'ici nous l'avons obtenu »). Citer l'hypothèse 2 comme prémisse rend la déduction circulaire.

**Correction** : Dans le Badge ligne 92, remplacer « C'est une conséquence directe des hypothèses 2 et 3. » par « C'est une conséquence directe de l'hypothèse 3 (et du confinement) : on retrouve ce que postulait l'hypothèse 2. »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-i/postulats-quantiques.mdx (l.46, l.68-86, l.92, l.96 — incohérence interne, vérification par lecture directe)*

#### 🟡 Mineur — `src/pages/chimie/partie-i/structure-electronique.mdx`

> ils s'évitent « automatiquement », ce qui réduit leur répulsion électrostatique moyenne. Cet effet purement quantique — l'**énergie d'échange** — abaisse l'énergie des configurations à spins parallèles.

**Problème** : Explication conventionnelle correcte seulement à orbitales gelées (E = J − K). Les calculs variationnels précis (He excité, etc.) montrent que dans l'état haut-spin la répulsion e-e est souvent PLUS grande : la stabilisation vient surtout de la contraction des orbitales et de l'attraction noyau-électron accrue (moindre écrantage).

**Correction** : ils s'évitent « automatiquement » (le « trou de Fermi »). À orbitales fixées, cet évitement réduit leur répulsion moyenne : c'est l'**énergie d'échange**, qui abaisse l'énergie des configurations à spins parallèles. Dans le détail, les calculs précis montrent que la stabilisation passe surtout par une **contraction des orbitales**, moins écrantées, qui renforce l'attraction du noyau.

*Sources : E. R. Davidson, J. Chem. Phys. 41, 656 (1964) et 42, 4199 (1965) — états 1s2s de He : ⟨1/r12⟩ plus grand dans le triplet ; J. Katriel & R. Pauncz, Adv. Quantum Chem. 10, 143-185 (1977) — revue : origine de la règle de Hund ; R. J. Boyd, Nature 310, 480-481 (1984) — « A quantum mechanical explanation for Hund's multiplicity rule » ; T. Oyamada, K. Hongo, Y. Kawazoe, H. Yasuhara, J. Chem. Phys. 133, 164113 (2010) — QMC, atomes 2p/3p : stabilisation par attraction noyau-électron accrue*

#### 🟡 Mineur — `src/pages/chimie/partie-ii/orbitales-moleculaires.mdx`

> Lewis « expliquait » cela en disant que He a déjà son octet

**Problème** : He n'a pas un octet mais un duet (1s², 2 électrons). Le chapitre Lewis du même cours insiste explicitement : « H et He plafonnent à 2 électrons, jamais 8 ». Incohérence interne et erreur factuelle légère.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-ii/orbitales-moleculaires.mdx (ligne 72), remplacer « Lewis « expliquait » cela en disant que He a déjà son octet » par « Lewis « expliquait » cela en disant que He a déjà son duet (couche 1s saturée, 2 électrons) »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-ii/orbitales-moleculaires.mdx (ligne 72) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-ii/liaison-covalente-lewis.mdx (ligne 101 : « H et He plafonnent à 2 électrons, jamais 8 ») ; Chimie générale : règle du duet — He a la configuration 1s², couche K saturée à 2 électrons*

#### 🟡 Mineur — `src/pages/chimie/partie-ii/orbitales-moleculaires.mdx`

> le gain de la liante est exactement effacé par le coût de l'antiliante

**Problème** : « Exactement » n'est vrai qu'en négligeant le recouvrement S. En LCAO avec recouvrement, l'antiliante est déstabilisée davantage que la liante n'est stabilisée (facteurs 1/(1−S) et 1/(1+S)), d'où une interaction nette répulsive pour He₂ — c'est précisément ce qui garantit l'absence de liaison, au-delà du simple OL = 0. Même imprécision dans le badge de l'ordre de liaison (« Chaque électron antiliant annule la stabilisation apportée par un électron liant »).

**Correction** : Ligne 72 : remplacer « le gain de la liante est exactement effacé par le coût de l'antiliante » par « le coût de l'antiliante efface — et même dépasse légèrement, à cause du recouvrement des orbitales — le gain de la liante : le bilan net est répulsif ». Ligne 56 (badge ordre de liaison) : remplacer « Chaque électron antiliant annule la stabilisation apportée par un électron liant. » par « Chaque électron antiliant annule (au moins) la stabilisation apportée par un électron liant. »

*Sources : Atkins & de Paula, Physical Chemistry (11e éd.), §9B Molecular orbital theory : « an antibonding orbital is more antibonding than a bonding orbital is bonding » (conséquence des énergies (α±β)/(1±S)) ; I. N. Levine, Quantum Chemistry (7e éd.), traitement LCAO de H₂⁺/H₂ avec intégrale de recouvrement S ; Chemistry LibreTexts, Molecular Orbital Theory (He₂) : interaction nette répulsive quand liante et antiliante sont toutes deux pleines ; Vérification algébrique directe : stabilisation (Sα−β)/(1+S) < déstabilisation (Sα−β)/(1−S) pour S>0*

#### 🟡 Mineur — `src/pages/chimie/partie-iv/energie-enthalpie.mdx`

> À pression constante (le cas usuel en chimie, à l'air libre), sa variation égale la chaleur échangée : $\Delta H = Q_P$.

**Problème** : ΔH = Q_P n'est vrai qu'en l'absence de travail autre que celui des forces de pression. La condition manque, alors que le cours considère ensuite explicitement un travail électrique (w_utile = −ΔG, piles) au chapitre enthalpie-libre, cas où ΔH ≠ Q_P. Même imprécision reprise dans enthalpie-libre-spontaneite.mdx (« la chaleur reçue par le système est par définition q_syst = ΔH »).

**Correction** : Dans energie-enthalpie.mdx (hypothèse 2) : « À pression constante et en l'absence de travail autre que celui des forces de pression (le cas usuel en chimie, à l'air libre), sa variation égale la chaleur échangée : $\Delta H = Q_P$. » Dans enthalpie-libre-spontaneite.mdx (ligne 38) : remplacer « la chaleur reçue par le système est par définition $q_{\text{syst}} = \Delta H$ » par « la chaleur reçue par le système vaut $q_{\text{syst}} = \Delta H$ (en l'absence de travail autre que celui des forces de pression — hypothèse que la section finale sur le travail utile lèvera explicitement) ».

*Sources : Atkins & de Paula, Physical Chemistry, ch. 2 : ΔH = q_p à P constante « provided no additional (non-expansion) work » ; Dérivation interne : ΔU=Q+W (hypothèse 1 du cours, /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-iv/energie-enthalpie.mdx l.25) ⇒ ΔH=Q_P+w' si travail non-PV w' ; Incohérence interne : /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-iv/enthalpie-libre-spontaneite.mdx l.38 vs l.119 (travail électrique d'une pile)*

#### 🟡 Mineur — `src/pages/chimie/partie-v/acide-base.mdx`

> À la demi-équivalence, on a neutralisé la moitié de l'acide — et là, un résultat se déduit sans approximation.

**Problème** : L'implication [AH]=[A⁻] ⇒ pH = pKa est exacte, mais identifier la demi-équivalence à [AH]=[A⁻] est une approximation : le bilan de matière/charge donne [A⁻] = C/2 + [H₃O⁺] − [OH⁻]. On néglige la dissociation propre de l'acide et l'autoprotolyse, ce qui devient faux en solution diluée ou pour un pKa proche de 0 ou 14. « Sans approximation » est donc un surclassement épistémique.

**Correction** : Ligne 106 : remplacer « et là, un résultat se déduit sans approximation. » par « et là, un résultat se déduit presque sans approximation. ». Dans l'encart (ligne 126), remplacer « la moitié de l'acide a été transformée en sa base conjuguée : $[\text{AH}] = [\text{A}^-]$. Le rapport vaut $1$ » par « la moitié de l'acide a été transformée en sa base conjuguée : $[\text{AH}] \approx [\text{A}^-]$. En toute rigueur, les bilans de matière et de charge donnent $[\text{A}^-] = C/2 + [\text{H}_3\text{O}^+] - [\text{OH}^-]$ : négliger les termes $[\text{H}_3\text{O}^+] - [\text{OH}^-]$ est une excellente approximation tant que l'acide n'est ni trop dilué ni de $pK_a$ extrême. Le rapport vaut alors $1$ ». Le Resultat encadré « Demi-équivalence » et son badge restent inchangés.

*Sources : Dérivation directe : électroneutralité [Na⁺]+[H₃O⁺]=[A⁻]+[OH⁻] et conservation [AH]+[A⁻]=C ⇒ [AH]=[A⁻] ⟺ pH=7 ; D. Harris, Quantitative Chemical Analysis, ch. titrages acide-base (pH ≈ pKa à V_e/2, traitement exact par bilan de charge) ; Skoog, West, Holler, Crouch, Fundamentals of Analytical Chemistry, titrage d'un acide faible ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-v/acide-base.mdx (lignes 106, 126, 130-138)*

#### 🟡 Mineur — `src/pages/chimie/partie-v/acide-base.mdx`

> Tout ce que nous avons bâti au chapitre précédent — la constante $K$, le sens d'évolution, la relation avec l'enthalpie libre — s'applique directement.

**Problème** : D'après la navigation (src/lib/nav/_chimie.ts), le chapitre précédant acide-base (n°19) est la cinétique (n°18), pas l'équilibre chimique (n°17). Le renvoi « chapitre précédent » vers la constante K est donc inexact ; l'erreur se répète aux lignes « l'outil du chapitre précédent » et « établie au chapitre précédent ».

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-v/acide-base.mdx, remplacer aux trois occurrences : ligne 18 « bâti au chapitre précédent » → « bâti au chapitre sur l'équilibre chimique » ; ligne 46 « l'outil du chapitre précédent » → « l'outil du chapitre sur l'équilibre chimique » ; ligne 62 « établie au chapitre précédent » → « établie au chapitre sur l'équilibre chimique ». Les liens Prereq existants vers /chimie/partie-v/equilibre-chimique restent inchangés.

*Sources : /home/sfaurite/tmp/cours-hub/src/lib/nav/_chimie.ts (lignes 72-74 : ordre 17 équilibre, 18 cinétique, 19 acide-base) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-v/acide-base.mdx (lignes 18, 46, 62) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-v/cinetique-chimique.mdx (ligne 19 : cite l'équilibre comme Prereq distinct)*

#### 🟡 Mineur — `src/pages/chimie/partie-v/oxydoreduction.mdx`

> $F \approx 96\,485\ \text{C·mol}^{-1}$, valeur **expérimentale** = charge d'une mole d'électrons

**Problème** : Périmé depuis la redéfinition du SI de 2019 : e (1,602 176 634×10⁻¹⁹ C) et NA (6,022 140 76×10²³ mol⁻¹) sont désormais des valeurs exactes fixées, donc F = NA·e = 96 485,332 12… C·mol⁻¹ est une constante exacte par définition, plus une valeur expérimentale. La définition « charge d'une mole d'électrons » et la valeur numérique sont, elles, correctes.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-v/oxydoreduction.mdx ligne 68, remplacer « ($F \approx 96\,485\ \text{C·mol}^{-1}$, valeur **expérimentale** = charge d'une mole d'électrons) » par « ($F \approx 96\,485\ \text{C·mol}^{-1}$, charge d'une mole d'électrons : $F = N_A\,e$, valeur **fixée exactement** par la redéfinition du SI de 2019) »

*Sources : BIPM, Brochure SI 9e édition (2019) : e et NA sont des constantes définissantes exactes ; CODATA 2018/2022 : F = 96 485,332 12 C·mol⁻¹ (valeur exacte) ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-i/postulats-quantiques.mdx:36 (h « fixée par définition du SI depuis 2019 ») ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-iv/entropie-second-principe.mdx:48 (kB « fixée par définition » depuis 2019)*

#### 🟡 Mineur — `src/pages/chimie/partie-v/oxydoreduction.mdx`

> comme s'il « possédait » entièrement les électrons des liaisons les plus électronégatives

**Problème** : Formulation incorrecte : une liaison n'est pas « électronégative », ce sont les atomes qui le sont. La convention attribue les électrons de chaque liaison à l'atome le plus électronégatif de la paire (le badge qui suit le dit d'ailleurs correctement). Telle quelle, la phrase est inintelligible et peut induire en erreur.

**Correction** : Remplacer « comme s'il « possédait » entièrement les électrons des liaisons les plus électronégatives » par « comme si, dans chaque liaison, l'atome le plus électronégatif « possédait » entièrement les électrons du doublet de liaison »

*Sources : IUPAC Gold Book, « oxidation state » : charge de l'atome après approximation ionique de ses liaisons hétéronucléaires (électrons attribués au partenaire le plus électronégatif) ; Karen, McArdle, Takats, « Comprehensive definition of oxidation state (IUPAC Recommendations 2016) », Pure Appl. Chem. 88(8), 831-839 ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-v/oxydoreduction.mdx ligne 42 (le badge énonce correctement la convention)*

#### 🟡 Mineur — `src/pages/chimie/partie-vi/carbone-squelette.mdx`

> Plus de la moitié des composés connus contiennent un seul élément. Pas l'oxygène, pas l'hydrogène : le carbone.

**Problème** : L'exclusion rhétorique de l'hydrogène est factuellement fausse : la quasi-totalité des composés du carbone contiennent aussi de l'hydrogène, donc H figure lui aussi dans bien plus de la moitié des composés connus. Le fait visé (le carbone structure la grande majorité des composés répertoriés, ~85-90 % du registre CAS) est juste, mais la formulation laisse croire que H est minoritaire.

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-vi/carbone-squelette.mdx (ligne 18) « Plus de la moitié des composés connus contiennent un seul élément. Pas l'oxygène, pas l'hydrogène : le **carbone**. » par « La grande majorité des composés connus contiennent un même élément : le **carbone**. L'hydrogène l'accompagne presque toujours, mais c'est le carbone qui fournit le squelette. »

*Sources : https://www.britannica.com/science/hydrogen ; https://chemed.chem.purdue.edu/genchem/topicreview/bp/ch10/hydrogen.php*

#### 🟡 Mineur — `src/pages/chimie/partie-vi/carbone-squelette.mdx`

> Toutes les liaisons sont des $\sigma$, à symétrie de révolution autour de l'axe internucléaire, d'où la **libre rotation** autour des liaisons C–C.

**Problème** : La rotation autour de C–C n'est pas strictement libre : l'éthane présente une barrière de torsion d'environ 12 kJ·mol⁻¹ (conformations décalée/éclipsée), mesurée et bien établie. La symétrie de révolution de la liaison σ explique que la barrière soit faible, pas qu'elle soit nulle. Affirmation sans hedging dans un cours qui revendique la rigueur épistémique.

**Correction** : Remplacer la fin de la phrase ligne 82 par : « d'où la **rotation quasi libre** autour des liaisons C–C : il subsiste une petite barrière de torsion (~12 kJ·mol⁻¹ dans l'éthane, entre conformations décalée et éclipsée), franchie des milliards de fois par seconde à température ambiante — d'où des conformations, et non des isomères séparables. »

*Sources : Connaissance établie : barrière de torsion de l'éthane ~12 kJ/mol (2,9 kcal/mol), conformation décalée favorisée, mesurée par spectroscopie et calculs ab initio ; /home/sfaurite/tmp/cours-hub/src/pages/chimie/partie-vi/carbone-squelette.mdx ligne 82*

### Cosmologie — 31 confirmés

#### 🟠 Important — `src/data/cosmologie/symbols.ts`

> valeur: '≈ 8,5×10⁻²⁷ kg/m³ (≈ 6 protons/m³, pour H₀ ≈ 70)'

**Problème** : Incohérence numérique : avec H₀ = 70 km/s/Mpc, ρc = 3H₀²/(8πG) ≈ 9,2×10⁻²⁷ kg/m³ (≈ 5,5 protons/m³). La valeur 8,5×10⁻²⁷ correspond à H₀ ≈ 67,4 (Planck), et donne ≈ 5,1 protons/m³, pas 6.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/cosmologie/symbols.ts (ligne 26), remplacer valeur: '≈ 8,5×10⁻²⁷ kg/m³ (≈ 6 protons/m³, pour H₀ ≈ 70)' par valeur: '≈ 8,6×10⁻²⁷ kg/m³ (≈ 5 protons/m³, pour H₀ ≈ 67,7)' — cohérent avec l'encart de calcul du chapitre parametres-densite.mdx (H₀≈67,7 ; 8,6×10⁻²⁷ ; 5,2 protons/m³).

*Sources : Calcul direct : ρc = 3H₀²/(8πG), G = 6,674×10⁻¹¹ (CODATA), m_p = 1,673×10⁻²⁷ kg → H₀=70 : 9,20×10⁻²⁷ kg/m³ (5,5 p/m³) ; H₀=67,4 : 8,53×10⁻²⁷ (5,1 p/m³) ; H₀=67,7 : 8,6×10⁻²⁷ (5,2 p/m³) ; https://www.astronomy.ohio-state.edu/ryden.1/ast162_10/notes41.html (ρc ≈ 9×10⁻²⁷ kg/m³ pour H₀≈70, ~5–6 protons/m³) ; https://astroweb.case.edu/ssm/astroconstants.html ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/parametres-densite.mdx (lignes 56–72 : H₀≈67,7 → 8,6×10⁻²⁷ kg/m³ → 5,2 protons/m³)*

#### 🟠 Important — `src/pages/cosmologie/partie-i/metrique-flrw.mdx`

> On peut alors écrire la métrique sans terme croisé $dt\,dx$ (sinon une direction temporelle serait privilégiée)

**Problème** : Justification erronée. Un terme croisé g_{ti} ≠ 0 définit un 3-vecteur non nul dans chaque section spatiale, c'est-à-dire une direction SPATIALE privilégiée, ce qui viole l'isotropie. « Une direction temporelle privilégiée » n'a pas de sens ici ; dans un cours déductif, c'est le raisonnement lui-même qui est enseigné faux (la conclusion, elle, est correcte).

**Correction** : Remplacer « On peut alors écrire la métrique sans terme croisé $dt\,dx$ (sinon une direction temporelle serait privilégiée) » par « On peut alors écrire la métrique sans terme croisé $dt\,dx$ (un tel terme définirait en chaque point un vecteur spatial privilégié, ce qui violerait l'isotropie) » — le reste de la phrase (« et avec un coefficient $-c^2$... ») est inchangé.

*Sources : https://cosmo.nyu.edu/yacine/teaching/GR_2019/lectures/lecture26.pdf ; https://knzhou.github.io/notes/cos.pdf ; https://ned.ipac.caltech.edu/level5/March01/Carroll3/Carroll8.html ; https://people.ast.cam.ac.uk/~pettini/Intro%20Cosmology/Lecture03.pdf*

#### 🟠 Important — `src/pages/cosmologie/partie-i/metrique-flrw.mdx`

> <Badge niveau="observe">Cohérent avec le fond diffus et la répartition des structures à grande échelle ; consensus empirique.</Badge>

**Problème** : Badge mal calibré et incohérent avec le chapitre principe-cosmologique, qui badge ce même principe en « concordance » et insiste que l'homogénéité n'est « jamais démontrée », non vérifiable de l'extérieur. « observe » = mesuré directement, ce qui ne vaut que pour l'isotropie locale ; le texte même du badge (« cohérent avec ») est un langage de concordance.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-i/metrique-flrw.mdx (ligne 25), remplacer : <Badge niveau="observe">Cohérent avec le fond diffus et la répartition des structures à grande échelle ; consensus empirique.</Badge> par : <Badge niveau="concordance">Postulat cohérent avec le fond diffus et la répartition des structures à grande échelle ; remarquablement appuyé mais jamais démontré (cf. chapitre précédent).</Badge>

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-i/principe-cosmologique.mdx (lignes 20, 47, 84 : badge final concordance, « jamais démontrée ») ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (ligne 61 : observe = « Mesuré directement » ; ligne 62 : concordance) ; https://arxiv.org/abs/1104.1300 (Maartens 2011, Is the Universe homogeneous? — l'homogénéité n'est pas testable directement, seule l'isotropie l'est)*

#### 🟠 Important — `src/pages/cosmologie/partie-ii/equations-friedmann.mdx`

> Le terme $\tfrac{8\pi G}{3}\rho$ est **toujours positif** : la matière-énergie pousse à l'expansion (ou, vu autrement, freine la contraction).

**Problème** : Faux causalement : la gravité de la matière décélère l'expansion (ä<0, cf. l'équation d'accélération donnée plus bas dans le même chapitre). Et en phase de contraction, une densité plus grande augmente H², donc accélère la chute au lieu de la freiner. La phrase contredit le propre encart « plus loin » du chapitre (« une gravité attractive qui décélère ») et celui de destin-univers.

**Correction** : Remplacer, ligne 78 de /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/equations-friedmann.mdx, la phrase « Le terme $\tfrac{8\pi G}{3}\rho$ est **toujours positif** : la matière-énergie pousse à l'expansion (ou, vu autrement, freine la contraction). » par : « Le terme $\tfrac{8\pi G}{3}\rho$ est **toujours positif** : à un instant donné, plus l'univers est dense, plus $H^2$ est grand. Attention au sens causal : au fil du temps, la gravité de la matière **freine** l'expansion ($\ddot a < 0$, voir l'équation d'accélération plus bas) et, en phase de contraction, elle accélère la chute. »

*Sources : https://en.wikipedia.org/wiki/Friedmann_equations ; https://www.astro.utah.edu/~wik/courses/astr4080spring2021/keyconcepts/ch4.html ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/equations-friedmann.mdx (lignes 22, 78, 89-91, 98 : contradictions internes)*

#### 🟠 Important — `src/pages/cosmologie/partie-iii/anisotropies-cmb.mdx`

> L'observation place le premier pic à $\ell_{\text{pic}} \approx 220$, soit $\theta_\star \approx 180^\circ/220 \approx 0{,}8^\circ$ — exactement la valeur attendue pour un espace **plat**

**Problème** : Incohérence numérique : avec r_s ≈ 144 Mpc et D_* ≈ 13,9 Gpc (ΛCDM plat), π·D_*/r_s ≈ 300, pas 220 ; l'échelle acoustique mesurée est θ_* ≈ 0,60° (100θ_* = 1,041, Planck), pas 0,8°. Le 1er pic est à ℓ₁ ≈ 0,73·ℓ_A à cause d'un déphasage (effets de potentiel/projection). Pris au pied de la lettre, le calcul de l'encart suggérerait un univers fermé.

**Correction** : Dans l'encart « Position du premier pic et platitude » : à l'Étape 1, noter l'échelle acoustique $\ell_A \approx \pi/\theta_\star \approx \pi\,D_\star/r_s$ (au lieu de $\ell_{\text{pic}}$). Remplacer l'Étape 3 par : « **Étape 3 — Lecture numérique.** Avec $r_s \approx 147\ \mathrm{Mpc}$ et $D_\star \approx 13{,}9\ \mathrm{Gpc}$ (modèle plat), on prédit $\theta_\star \approx 0{,}6^\circ$, soit $\ell_A \approx 300$. Les pics ne tombent pas exactement sur les multiples de $\ell_A$ : le pilotage gravitationnel des oscillations les décale vers les bas $\ell$, et le premier pic est attendu à $\ell_1 \approx 0{,}73\,\ell_A \approx 220$ pour un espace **plat** ($k=0$). C'est exactement là que l'observation le place (Planck : $100\,\theta_\star = 1{,}0411 \pm 0{,}0003$). » La boîte finale ($\ell_{\text{pic}} \approx 220 \Rightarrow \Omega_{\text{tot}} = 1{,}000 \pm 0{,}005$) peut rester telle quelle.

*Sources : https://arxiv.org/abs/1807.06209 (Planck 2018 VI : 100θ*=1,0411±0,0003, r*=144,4 Mpc, ℓ_A≈301) ; https://arxiv.org/abs/astro-ph/0006436 (Hu, Fukugita, Zaldarriaga & Tegmark 2001 : ℓ₁=ℓ_A(1−φ₁), φ₁≈0,267) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iii/anisotropies-cmb.mdx (l. 54 : r_s≈147 Mpc ; l. 79–89 : encart incriminé) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-vi/modele-lcdm.mdx (l. 64 : θ*=r_s/D* mesuré à mieux que 0,1 %)*

#### 🟠 Important — `src/pages/cosmologie/partie-iii/nucleosynthese.mdx`

> Les neutrons libres se désintègrent ($n \to p + e^- + \bar\nu_e$, demi-vie $\approx 880$ s)

**Problème** : 880 s est la durée de vie MOYENNE du neutron (τ ≈ 878–880 s, PDG), pas sa demi-vie. La demi-vie vaut τ·ln2 ≈ 610 s. Confusion classique mais factuelle : un lecteur retiendrait une demi-vie fausse de 44 %.

**Correction** : Ligne 57 de /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iii/nucleosynthese.mdx : remplacer « demi-vie $\approx 880$ s » par « durée de vie moyenne $\approx 880$ s ».

*Sources : https://pdgprod.lbl.gov/pdgprod/pdgLive/DataBlock.action?node=S017T ; https://en.wikipedia.org/wiki/Neutron_lifetime_puzzle ; https://par.nsf.gov/servlets/purl/10535419*

#### 🟠 Important — `src/pages/cosmologie/partie-iv/inflation.mdx`

> Un volume de la taille d'un proton devient alors plus grand qu'une orange — en une fraction infime de seconde.

**Problème** : Application numérique fausse en tant qu'image : un proton (~10⁻¹⁵ m) multiplié par e⁶⁰ ≈ 10²⁶ donne ~10¹¹ m, soit environ la distance Terre–Soleil (0,5–1 UA), pas une orange (~0,1 m). L'équivalence suggérée est fausse de ~12 ordres de grandeur ; pour aboutir à une orange il faudrait partir de ~10⁻²⁷ m.

**Correction** : Un volume de la taille d'un proton est alors étiré jusqu'à ~10¹¹ m — de l'ordre de la distance Terre–Soleil — en une fraction infime de seconde.

*Sources : https://www.ctc.cam.ac.uk/outreach/origins/inflation_zero.php ; https://ned.ipac.caltech.edu/level5/March05/Guth/Guth1.html ; https://arxiv.org/pdf/0904.4584*

#### 🟠 Important — `src/pages/cosmologie/partie-v/matiere-noire.mdx`

> Les courbes de rotation plates sont mesurées sur des centaines de galaxies (Rubin, Ford, années 1970), par décalage Doppler de l'hydrogène à 21 cm.

**Problème** : Attribution erronée : Vera Rubin et Kent Ford travaillaient en spectroscopie OPTIQUE (raies Hα et [NII] des régions HII), pas à 21 cm. Les courbes plates à grand rayon en radio 21 cm sont dues à Roberts & Whitehurst (1975) et surtout Bosma (1978). De plus, Rubin et al. n'avaient mesuré que quelques dizaines de galaxies dans les années 1970 ; les « centaines » viennent de compilations ultérieures.

**Correction** : Les courbes de rotation plates ont d'abord été mesurées en spectroscopie optique (raies Hα des régions HII : Rubin et Ford, années 1970), puis confirmées et étendues bien au-delà du disque visible par la raie à 21 cm de l'hydrogène (Roberts 1975, Bosma 1978) ; elles sont aujourd'hui établies sur des centaines de galaxies. Le fait est empirique et robuste.

*Sources : https://ui.adsabs.harvard.edu/abs/1970ApJ...159..379R/abstract ; https://arxiv.org/abs/1605.04909 ; https://ned.ipac.caltech.edu/level5/Sept03/Bosma/Bosma_app.html ; https://ned.ipac.caltech.edu/level5/Sept16/Bertone/Bertone4.html*

#### 🟠 Important — `src/pages/cosmologie/partie-vi/tensions-cosmologiques.mdx`

> confirmé par des méthodes locales variées (céphéides, mais aussi étoiles de la branche des géantes rouges, lentilles gravitationnelles à délai temporel)

**Problème** : Présenter la méthode TRGB comme confirmant le désaccord à 4–6 σ est unilatéral : la calibration TRGB du groupe CCHP (Freedman et al. 2019–2024, y compris JWST) donne H₀ ≈ 69,8–70,4, compatible à la fois avec Planck et SH0ES, et est précisément l'argument phare du camp « pas de tension ». D'autres calibrations TRGB (EDD, ~71,5–73) donnent des valeurs hautes : la littérature TRGB est divisée, elle ne « confirme » pas la tension.

**Correction** : Remplacer dans le Badge (ligne 73) : « confirmé par des méthodes locales variées (céphéides, mais aussi étoiles de la branche des géantes rouges, lentilles gravitationnelles à délai temporel) » par « confirmé par plusieurs méthodes locales (céphéides, lentilles gravitationnelles à délai temporel) ; la méthode de la branche des géantes rouges (TRGB) donne selon les équipes des valeurs intermédiaires (~70, compatibles avec les deux routes) ou hautes (~72–73) — ce désaccord interne fait lui-même partie du débat »

*Sources : https://arxiv.org/abs/2408.06153 ; https://arxiv.org/abs/2304.06693 ; https://arxiv.org/abs/2108.00007 ; https://arxiv.org/abs/1907.05922*

#### 🟡 Mineur — `src/data/cosmologie/symbols.ts`

> nom: 'Densité d’énergie', desc: 'Densité de masse-énergie d’une composante […]', unite: 'kg·m⁻³'

**Problème** : Incohérence nom/unité : une densité d’énergie se mesure en J·m⁻³, pas en kg·m⁻³. Le cours utilise en fait la convention « densité de masse(-équivalente) » (cohérente avec p = w·ρc² et ρc = 3H²/(8πG) en kg/m³).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/cosmologie/symbols.ts (ligne 25), remplacer nom: 'Densité d’énergie' par nom: 'Densité de masse-énergie', en gardant unite: 'kg·m⁻³' et la desc inchangée (déjà cohérente). Optionnel : ajouter en fin de desc « La densité d’énergie proprement dite est ε = ρc² (J·m⁻³). »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/equations-friedmann.mdx (l.85 : ρ = densité d'énergie totale / c²) ; /home/sfaurite/tmp/cours-hub/src/data/cosmologie/symbols.ts (l.26 ρc en kg/m³ ; l.28 p = w·ρc²) ; Analyse dimensionnelle SI : énergie/volume = J·m⁻³ ; convention standard ε = ρc² (cf. Ryden, Introduction to Cosmology)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-i/metrique-flrw.mdx`

> la classification des espaces à courbure constante (théorème de Killing–Robertson–Walker)

**Problème** : Appellation non standard, amalgame de deux résultats distincts : la classification des espaces à courbure constante est le théorème de Killing–Hopf (Killing 1891, Hopf 1926) ; Robertson (1935) et Walker (1936) ont démontré l'unicité de la métrique des espaces-temps homogènes et isotropes. Un « théorème de Killing–Robertson–Walker » n'existe pas dans la littérature.

**Correction** : la classification des espaces à courbure constante (théorème de Killing–Hopf), dont Robertson et Walker ont déduit l'unicité de la métrique (1935–1936)

*Sources : Killing, « Ueber die Clifford-Kleinschen Raumformen », Math. Ann. 39 (1891) ; Hopf, « Zum Clifford-Kleinschen Raumproblem », Math. Ann. 95 (1926) ; Robertson, « Kinematics and World-Structure », ApJ 82 (1935), 284 ; Walker, « On Milne's theory of world-structure », Proc. London Math. Soc. 42 (1936), 90*

#### 🟡 Mineur — `src/pages/cosmologie/partie-i/redshift-hubble.mdx`

> Le redshift des galaxies est mesuré directement (des milliers de spectres depuis Hubble, 1929)

**Problème** : Attribution historique erronée : les premiers décalages spectraux de galaxies ont été mesurés par Vesto Slipher dès 1912 (une quarantaine de « nébuleuses » avant 1925). Hubble (1929) a établi la relation distance–vitesse, en s'appuyant largement sur les vitesses radiales de Slipher.

**Correction** : Dans le Badge ligne 69 de /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-i/redshift-hubble.mdx, remplacer « (des milliers de spectres depuis Hubble, 1929) » par « (des milliers de spectres depuis Slipher, 1912 ; Hubble, 1929, y a ajouté les distances et établi la proportionnalité) »

*Sources : Slipher, V. M. (1913), « The radial velocity of the Andromeda Nebula », Lowell Observatory Bulletin No. 58 (mesure de sept. 1912) ; Slipher, V. M. (1917), « Nebulae », Proc. Amer. Phil. Soc. 56, 403 — vitesses radiales de 25 nébuleuses spirales ; Hubble, E. (1929), « A relation between distance and radial velocity among extra-galactic nebulae », PNAS 15, 168 — utilise les vitesses de Slipher/Humason*

#### 🟡 Mineur — `src/pages/cosmologie/partie-i/relativite-cadre.mdx`

> L'expansion est un fait mesuré directement (décalage vers le rouge des galaxies, dès Hubble en 1929), indépendant de tout modèle.

**Problème** : « dès Hubble en 1929 » est inexact : les redshifts galactiques sont mesurés dès 1912 par Slipher ; 1929 est la date de la loi distance–vitesse de Hubble, pas celle des premiers décalages vers le rouge. Même erreur d'attribution que dans redshift-hubble.mdx.

**Correction** : L'expansion est un fait mesuré directement (décalage vers le rouge des galaxies, mesuré dès Slipher en 1912 puis érigé en loi distance–vitesse par Hubble en 1929), indépendant de tout modèle.

*Sources : V.M. Slipher, « The radial velocity of the Andromeda Nebula », Lowell Observatory Bulletin n° 58 (1913, mesures de sept. 1912) ; V.M. Slipher, « Nebulae », Proc. Amer. Phil. Soc. 56 (1917) : 25 vitesses radiales de spirales ; E. Hubble, « A relation between distance and radial velocity among extra-galactic nebulae », PNAS 15, 168–173 (1929) ; Résolution B4 de l'UAI (2018) renommant la loi « Hubble–Lemaître » (Lemaître 1927)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-i/relativite-cadre.mdx`

> <Badge niveau="observe">Cette constante de couplage fixe « combien » une quantité d'énergie donnée courbe l'espace-temps ; sa valeur, ajustée pour retrouver la gravité de Newton à faible champ

**Problème** : Le contenu du badge est un énoncé théorique : le facteur 8πG/c⁴ est dérivé en exigeant la limite newtonienne, ce n'est pas une mesure directe. Selon l'échelle du cours, « observe » = mesuré directement (redshifts, CMB, abondances) ; seule la constante G est mesurée (Cavendish), pas le couplage en tant que tel.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-i/relativite-cadre.mdx (ligne 53), remplacer niveau="observe" par niveau="concordance" dans le badge « Cette constante de couplage fixe "combien"… ». Le texte du slot reste inchangé : il décrit déjà un ajustement théorique, justification adéquate pour « Concordant ».

*Sources : /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (PRESET_COSMO : définitions « observe » et « concordance ») ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-i/relativite-cadre.mdx (l. 53 badge incriminé ; l. 59-61 usage cohérent d'extrapole/concordance) ; S. Carroll, Spacetime and Geometry, §4.2 (la limite newtonienne ∇²Φ=4πGρ fixe le couplage 8πG/c⁴) ; aussi Lecture Notes on General Relativity, arXiv:gr-qc/9712019*

#### 🟡 Mineur — `src/pages/cosmologie/partie-ii/contenu-univers.mdx`

> c'est le régime accéléré dans lequel nous venons d'entrer ($z_\Lambda \approx 0{,}3$, soit il y a quelques milliards d'années)

**Problème** : Conflation de deux événements : z_Λ≈0,3 est l'égalité des densités ρ_m=ρ_Λ ((1+z)³=Ω_Λ/Ω_m≈2,2 → z≈0,31). Mais l'accélération (ä>0) commence dès que ρ_Λ>ρ_m/2, soit (1+z)³=2Ω_Λ/Ω_m≈4,5, z≈0,65 (~6 milliards d'années). L'entrée dans le « régime accéléré » précède donc la domination de Λ.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/contenu-univers.mdx (ligne 161), remplacer « — c'est le régime accéléré dans lequel nous venons d'entrer ($z_\Lambda \approx 0{,}3$, soit il y a quelques milliards d'années). » par « — c'est l'ère de $\Lambda$, dans laquelle nous venons d'entrer ($z_\Lambda \approx 0{,}3$, soit il y a quelques milliards d'années). L'accélération de l'expansion, elle, avait commencé un peu plus tôt, vers $z \approx 0{,}65$ : il suffit que $\rho_\Lambda$ dépasse $\rho_m/2$ pour que l'attraction de la matière soit vaincue. »

*Sources : Calcul direct : équation d'accélération de Friedmann, ä>0 ⇔ ρ_Λ>ρ_m/2 ⇔ (1+z)³=2Ω_Λ/Ω_m≈4,45 → z≈0,65 ; égalité ρ_m=ρ_Λ : (1+z)³=Ω_Λ/Ω_m≈2,23 → z≈0,31 ; Frieman, Turner & Huterer, ARA&A 46, 385 (2008) : transition décélération→accélération à z≈0,6–0,7 ; Planck 2018 (A&A 641, A6) : Ω_m≈0,315, Ω_Λ≈0,685, cohérent avec z_acc≈0,63 et z_Λ≈0,30 ; Cohérence interne : /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/destin-univers.mdx (condition p<−ρc²/3) et partie-v/energie-noire.mdx (q₀≈−0,54) ne donnent aucun redshift d'onset qui corrigerait la phrase*

#### 🟡 Mineur — `src/pages/cosmologie/partie-ii/destin-univers.mdx`

> Les amas liés gravitationnellement (le nôtre compris) résistent

**Problème** : La Voie lactée n'appartient pas à un amas lié : notre structure liée est le Groupe local (quelques dizaines de galaxies) ; l'amas le plus proche (Virgo) ne nous est pas lié et sera emporté hors de l'horizon. « le nôtre compris » est donc inexact si « amas » désigne un amas de galaxies.

**Correction** : Les structures liées gravitationnellement (notre Groupe local compris) résistent

*Sources : Nagamine & Loeb 2003, « Future evolution of nearby large-scale structures in a universe dominated by a cosmological constant », New Astronomy 8, 439 (Groupe local lié ; Virgo non lié, emporté hors de l'horizon) ; Krauss & Scherrer 2007, « The Return of a Static Universe and the End of Cosmology », GRG 39, 1545 ; van den Bergh 2000, « The Galaxies of the Local Group » (le Groupe local est un groupe d'environ 40-80 galaxies, pas un amas) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-v/toile-cosmique.mdx:57 (le cours distingue explicitement groupes et amas)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-ii/equations-friedmann.mdx`

> pour $k>0$ (univers fermé), il finit par l'emporter et $H$ s'annule — l'expansion s'arrête puis s'inverse. Le signe de l'énergie totale $U$ décide donc du destin.

**Problème** : Vrai seulement si ρ se dilue plus vite que a⁻² (matière, rayonnement) et sans Λ : avec une constante cosmologique, un univers fermé peut s'étendre éternellement (le terme Λ, constant, finit par dominer le terme de courbure en a⁻²). Le chapitre destin-univers ajoute correctement la condition « sans Λ », absente ici, et le composant FriedmannFate du même chapitre montre des cas fermés accélérés.

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/equations-friedmann.mdx (ligne 78) : « pour $k>0$ (univers fermé), il finit par l'emporter et $H$ s'annule — l'expansion s'arrête puis s'inverse. Le signe de l'énergie totale $U$ décide donc du destin. » par « pour $k>0$ (univers fermé) et un contenu qui se dilue plus vite que $a^{-2}$ — c'est le cas de la matière seule de notre dérivation, sans constante cosmologique —, il finit par l'emporter et $H$ s'annule : l'expansion s'arrête puis s'inverse. Dans ce cas, et dans ce cas seulement, le signe de l'énergie totale $U$ décide du destin. »

*Sources : B. Ryden, Introduction to Cosmology, ch. 5–6 : « geometry is destiny » n'est vrai que pour un univers de matière seule (w > −1/3, sans Λ) ; Modèles de Lemaître : univers fermés avec Λ en expansion éternelle (le terme Λ constant domine la courbure en a⁻²) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/destin-univers.mdx lignes 33–35 (condition explicite « fermé + matière seule, sans Λ ») ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/equations-friedmann.mdx lignes 75, 85, 100, 106 (badge RG avec ρ total, encart pression/Λ, FriedmannFate, badge ΛCDM accéléré quasi plat)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-ii/parametres-densite.mdx`

> Valeur numérique aujourd'hui (~6 protons par m³)

**Problème** : Le calcul mené dans l'encart aboutit à 5,2 protons/m³ (vérifié : 8,6×10⁻²⁷/1,67×10⁻²⁷ = 5,15). Arrondir 5,2 à « ~6 » dans le titre est incohérent avec le résultat démontré ; l'arrondi naturel est ~5.

**Correction** : Ligne 56 : remplacer titre="Valeur numérique aujourd'hui (~6 protons par m³)" par titre="Valeur numérique aujourd'hui (5 à 6 protons par m³)"

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-ii/parametres-densite.mdx (lignes 56-72) ; Recalcul numérique : 3H₀²/(8πG)/m_p = 5,154 pour H₀=67,7 km/s/Mpc ; 5,99 pour H₀=73 km/s/Mpc*

#### 🟡 Mineur — `src/pages/cosmologie/partie-ii/parametres-densite.mdx`

> La platitude $\Omega_k \approx 0$ est mesurée à mieux que $0{,}5\,\%$ près par le fond diffus (Planck)

**Problème** : Cette précision (Ω_k = 0,0007 ± 0,0019, soit ~0,2 %) requiert la combinaison Planck + BAO. Le CMB Planck seul donne Ω_k = −0,011 ± 0,007 (avec lensing), et préfère même légèrement un univers fermé sans lensing (−0,044 +0,018/−0,015). Attribuer « mieux que 0,5 % » au seul fond diffus est inexact.

**Correction** : La platitude $\Omega_k \approx 0$ est mesurée à mieux que $0{,}5\,\%$ près en combinant le fond diffus (Planck) et les oscillations acoustiques de baryons (BAO) : l'univers est plat à la précision de nos instruments.

*Sources : Planck 2018 results VI (Planck Collaboration, arXiv:1807.06209), §7.3 : Ω_K = −0,044 +0,018/−0,015 (TT,TE,EE+lowE), −0,0106 ± 0,0065 (+lensing), 0,0007 ± 0,0019 (+BAO) ; Di Valentino, Melchiorri & Silk 2019, Nature Astronomy, « Planck evidence for a closed Universe » (préférence du CMB seul pour Ω_K < 0)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iii/anisotropies-cmb.mdx`

> Avec les paramètres standard, $r_s \approx 147\ \mathrm{Mpc}$ (comobile).

**Problème** : 147 Mpc est l'horizon sonore à l'époque de drag (z ≈ 1060), la règle des BAO. Tel que défini dans l'encart (intégrale jusqu'à la recombinaison t_*, pertinente pour les pics du CMB), r_s ≈ 144,4 Mpc (Planck 2018). Écart ~2 %.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iii/anisotropies-cmb.mdx (ligne 54), remplacer « Avec les paramètres standard, $r_s \approx 147\ \mathrm{Mpc}$ (comobile). » par « Avec les paramètres standard, $r_s \approx 144\ \mathrm{Mpc}$ (comobile) à la dernière diffusion — et $\approx 147\ \mathrm{Mpc}$ à l'époque de drag, un peu plus tard, la valeur qui sert de règle aux BAO. »

*Sources : Planck 2018 results VI. Cosmological parameters, A&A 641, A6 (2020), Table 2 : r_⋆ = 144,43 ± 0,26 Mpc (z_⋆ = 1089,92) ; r_drag = 147,09 ± 0,26 Mpc (z_drag = 1059,94) ; Cohérence interne : 100θ⋆ = 1,0411 (Planck 2018) ⇒ θ⋆ = r_⋆/D_⋆ ≈ 144,4/13870 Mpc, en accord avec ℓ ≈ 220 cité ligne 87 du chapitre*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iii/recombinaison-cmb.mdx`

> $$ T_{\mathrm{rec}} \approx \frac{158\,000\ \mathrm{K}}{40} \approx 3700\ \mathrm{K}, $$

**Problème** : Erreur d'arithmétique affichée : 158 000/40 = 3950 K, pas 3700 K (écart ~7 %). Pour obtenir 3700 K il faudrait un logarithme effectif ≈ 42–43.

**Correction** : Ligne 57 : remplacer « $$ T_{\mathrm{rec}} \approx \frac{158\,000\ \mathrm{K}}{40} \approx 3700\ \mathrm{K}, $$ » par « $$ T_{\mathrm{rec}} \approx \frac{158\,000\ \mathrm{K}}{42} \approx 3700\ \mathrm{K}, $$ » ; et ligne 55, remplacer « passe alors de $\approx 21$ à $\approx 40$ » par « passe alors de $\approx 21$ à $\approx 42$ ».

*Sources : Calcul direct : 158000/40 = 3950 ; 158000/42 ≈ 3762 ; log effectif pour 3700 K = 42,7 ; Ryden, Introduction to Cosmology, ch. 9 : Saha donne x_e = 1/2 à z ≈ 1370, T ≈ 3740 K ; Weinberg, Cosmology, §2.3 (recombinaison, équation de Saha)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iii/recombinaison-cmb.mdx`

> et l'on retient conventionnellement le point où la moitié des électrons sont recombinés, vers $\sim 3000\ \mathrm{K}$

**Problème** : La mi-recombinaison (x_e = 0,5) se produit vers 3700–4000 K (z ≈ 1300–1400) d'après Saha. T ≈ 3000 K (z ≈ 1090) correspond au découplage des photons (pic de la fonction de visibilité, surface de dernière diffusion), quand la fraction d'ionisation est déjà bien inférieure à 50 %.

**Correction** : Remplacer la ligne 59 de /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iii/recombinaison-cmb.mdx par : « là où la moitié des électrons sont recombinés ($z \approx 1370$). Le découplage effectif des photons — la dernière diffusion — survient un peu plus bas, vers $\sim 3000\ \mathrm{K}$ ($z \approx 1100$) : c'est ce point que l'on retient pour le CMB. $\qquad\blacksquare$ »

*Sources : Ryden, Introduction to Cosmology, ch. 8 : x_e=1/2 à z≈1370 (T≈3740 K) via Saha ; dernière diffusion z≈1100, T≈3000 K ; Dodelson, Modern Cosmology, §3/4 : recombinaison Saha vers T≈3700–4000 K, découplage z≈1090 ; Planck 2018 results VI : z_* = 1089,9 (surface de dernière diffusion) ; Weinberg, Cosmology (2008), §2.3 : ionisation 50 % vers 3700–4200 K selon Ω_b h²*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iii/recombinaison-cmb.mdx`

> Or la recombinaison a lieu **une cinquantaine de fois plus tard et plus froid**, vers $3000\ \mathrm{K}$.

**Problème** : Le facteur ~53 ne vaut que pour la température. En temps, l'écart est de plusieurs ordres de grandeur : l'univers atteint 158 000 K (z ≈ 58 000) vers quelques dizaines/centaines d'années, contre 380 000 ans pour la recombinaison (rapport ~10³–10⁴, pas 50).

**Correction** : Remplacer à la ligne 29 de src/pages/cosmologie/partie-iii/recombinaison-cmb.mdx : « Or la recombinaison a lieu **une cinquantaine de fois plus tard et plus froid**, vers $3000\ \mathrm{K}$. » par « Or la recombinaison a lieu bien plus tard, à une température **une cinquantaine de fois plus basse**, vers $3000\ \mathrm{K}$. »

*Sources : T(z)=T0(1+z), T0=2,7255 K (Planck 2018) → 158 000 K ⇔ z≈58 000 ; Ère radiative : t ≈ 2,4 g*^{-1/2} (T/MeV)^{-2} s, g*=3,36 → t≈7×10⁹ s ≈ 220 ans (Kolb & Turner, The Early Universe ; Ryden, Introduction to Cosmology) ; Recombinaison : z≈1100, t≈380 000 ans (Planck 2018, déjà cité dans le chapitre lignes 21 et 65)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iv/baryogenese.mdx`

> Au chapitre suivant, nous la suivons tandis que l'univers continue de refroidir, jusqu'au moment décisif où la lumière se libère enfin de la matière.

**Problème** : Renvoi de navigation faux : la libération de la lumière (recombinaison/CMB) est traitée en partie III, déjà lue. Ce chapitre (n° 16) est le dernier de la partie IV ; le chapitre suivant est « L'instabilité de Jeans » (partie V, formation des structures).

**Correction** : Au chapitre suivant, nous la suivons tandis que la gravité amplifie les graines primordiales pour bâtir galaxies et amas : l'instabilité de Jeans et la formation des structures.

*Sources : /home/sfaurite/tmp/cours-hub/src/lib/nav/_cosmologie.ts (lignes 51, 64, 73 : ordre des chapitres 11, 16, 17) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iv/baryogenese.mdx (ligne 106) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iii/recombinaison-cmb.mdx (chapitre traitant la libération de la lumière)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iv/fluctuations-primordiales.mdx`

> La **hauteur relative et la position** de ces pics dépendent directement de $n_s$ : un spectre incliné incline aussi l'enveloppe des pics

**Problème** : La position des pics acoustiques est fixée par l'horizon sonore à la recombinaison et la distance de diamètre angulaire (géométrie), pas par n_s. L'indice spectral incline l'enveloppe et donc les hauteurs relatives, mais il ne déplace pratiquement pas les pics. Un lecteur retiendrait à tort que la position des pics mesure n_s.

**Correction** : La **hauteur relative** de ces pics (l'enveloppe du spectre) dépend directement de $n_s$ : un spectre incliné incline aussi l'enveloppe des pics ; leur **position**, elle, est fixée par l'horizon sonore et la géométrie — et l'ajustement est remarquable.

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iii/anisotropies-cmb.mdx (l.71, 75-98 : position du 1er pic = géométrie/courbure via r_s) ; Hu & Dodelson 2002, ARA&A 40, « Cosmic Microwave Background Anisotropies » : positions des pics fixées par l'échelle acoustique θ⋆ = r_s/D_A ; n_s incline l'enveloppe ; Planck 2018 results VI (A&A 641, A6) : θ⋆ mesuré indépendamment de n_s ; n_s contraint par la pente large bande du spectre*

#### 🟡 Mineur — `src/pages/cosmologie/partie-iv/inflation.mdx`

> Reste à comprendre **comment**, à partir de cet univers fraîchement réchauffé, se sont formés les noyaux légers des premières minutes : c'est la nucléosynthèse primordiale, notre prochaine étape.

**Problème** : Renvoi de navigation faux : la nucléosynthèse est traitée en partie III (chapitre 10), déjà lue avant ce chapitre 14. Le chapitre suivant dans l'ordre du cours (_cosmologie.ts) est « Les fluctuations primordiales » (n° 15). La transition promet un chapitre qui n'est pas le suivant.

**Correction** : Remplacer la phrase incriminée par : « C'est de cet univers fraîchement réchauffé que part la nucléosynthèse primordiale, déjà étudiée en partie III. Au chapitre suivant, nous verrons que l'inflation engendre en prime les graines des structures : les fluctuations primordiales. »

*Sources : /home/sfaurite/tmp/cours-hub/src/lib/nav/_cosmologie.ts (chap. 10 nucleosynthese partie-iii ; chap. 14 inflation ; chap. 15 fluctuations-primordiales) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iv/inflation.mdx ligne 103 ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-iv/fluctuations-primordiales.mdx (ouverture sur les graines des structures, pas la BBN)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-v/energie-noire.mdx`

> naît d'une **naine blanche** qui accrète de la matière jusqu'à frôler une masse critique universelle, la **masse de Chandrasekhar**

**Problème** : Le scénario simple-dégénéré à masse de Chandrasekhar est présenté comme LE mécanisme. Le consensus actuel (≤2025) est qu'une fraction importante, voire majoritaire, des SN Ia provient de canaux sub-Chandrasekhar (double détonation) ou de fusions de deux naines blanches. L'uniformité des SN Ia est un fait empirique (standardisation de Phillips), pas une conséquence démontrée du seuil de Chandrasekhar.

**Correction** : Remplacer la première moitié de l'encart (ligne 30) par : « Une supernova de type Ia est l'explosion thermonucléaire d'une **naine blanche**. Dans le scénario classique, elle accrète de la matière jusqu'à frôler la **masse de Chandrasekhar** ($\approx 1{,}4\,M_\odot$) ; d'autres canaux (fusion de deux naines blanches, double détonation sous cette masse) sont aujourd'hui jugés importants, voire dominants. Leur valeur de chandelle standard est avant tout **empirique** : après une calibration fine sur la forme de leur courbe de lumière (largeur du pic, couleur — relation de Phillips), leur luminosité absolue est connue à mieux que 10 %. » (conserver la dernière phrase de l'encart inchangée).

*Sources : Maoz, Mannucci & Nelemans 2014, ARA&A 52, 107 — revue des progéniteurs de SN Ia : aucun canal unique démontré ; Gilfanov & Bogdán 2010, Nature 463, 924 — flux X des elliptiques : canal simple-dégénéré ≲5 % ; Shen et al. 2018, ApJ 865, 15 — naines blanches hypervéloces Gaia, survivantes du scénario double-détonation D6 ; Flörs et al. 2020, MNRAS 491, 2902 — Ni/Fe nébulaire : la majorité des SN Ia normales compatibles sub-Chandrasekhar*

#### 🟡 Mineur — `src/pages/cosmologie/partie-v/toile-cosmique.mdx`

> décroissant comme une loi de puissance $\xi(r) \approx (r/r_0)^{-1{,}8}$ avec $r_0 \approx 5\ \text{Mpc}$

**Problème** : La longueur de corrélation canonique est r₀ ≈ 5 h⁻¹ Mpc, soit ≈ 7 Mpc en unités absolues (h ≈ 0,68). Donner « 5 Mpc » sans le h⁻¹ est incohérent avec le r_s ≈ 150 Mpc cité plus loin, qui est, lui, en Mpc absolus. L'exposant −1,8 est correct.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-v/toile-cosmique.mdx (ligne 33), remplacer « avec $r_0 \approx 5\ \text{Mpc}$ » par « avec $r_0 \approx 7\ \text{Mpc}$ »

*Sources : Davis & Peebles 1983, ApJ 267, 465 : r₀ = 5,4 h⁻¹ Mpc, γ ≈ 1,77 ; Hawkins et al. 2003 (2dFGRS), MNRAS 346, 78 : r₀ ≈ 5,05 h⁻¹ Mpc ; Zehavi et al. 2005 (SDSS), ApJ 630, 1 : r₀ ≈ 5,6 h⁻¹ Mpc ; Cohérence interne : r_s ≈ 150 Mpc absolus (≈ 100 h⁻¹ Mpc) cité lignes 69-78 du même chapitre*

#### 🟡 Mineur — `src/pages/cosmologie/partie-vi/modele-lcdm.mdx`

> <Badge niveau="speculatif">L'énergie noire est, dans ΛCDM, une simple constante $\Lambda$. Mais *pourquoi* le vide possède une densité d'énergie non nulle

**Problème** : Calibrage incohérent avec questions-ouvertes.mdx, où exactement le même problème de la constante cosmologique est étiqueté « extrapole » (« le problème de la constante cosmologique est ouvert… »). L'énoncé badgé (Λ ajuste les données mais sa physique est inconnue) n'est pas lui-même spéculatif au sens de l'échelle (avant Planck, gravité quantique, multivers) : c'est un constat établi sur un problème ouvert.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-vi/modele-lcdm.mdx (ligne 114), remplacer `<Badge niveau="speculatif">` par `<Badge niveau="extrapole">` (texte du badge inchangé).

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/methodologie.mdx (lignes 43-59 : définitions et exemples des niveaux) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-vi/questions-ouvertes.mdx (ligne 53 : même problème badgé extrapole ; lignes 25 et 62 : critère discriminant extrapolé/spéculatif) ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-vi/modele-lcdm.mdx (ligne 112 : badge parallèle matière noire en extrapole)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-vi/tensions-cosmologiques.mdx`

> la probabilité qu'un tel écart soit un simple hasard statistique est inférieure à un sur un million

**Problème** : Inversion classique de la p-value : 5 σ donne la probabilité d'observer un tel écart SI les deux mesures visaient la même valeur (p ≈ 5,7×10⁻⁷ bilatéral), pas la probabilité que l'écart « soit un hasard ». Cette dernière dépendrait des probabilités a priori (théorème de Bayes). Le chiffre « un sur un million » est par ailleurs correct.

**Correction** : la probabilité d'observer un tel écart si les deux méthodes mesuraient en réalité la même valeur — par pur hasard statistique — est inférieure à un sur un million

*Sources : Wasserstein & Lazar 2016, « The ASA Statement on p-Values », The American Statistician 70(2), principe 2 : les p-values ne mesurent ni la probabilité que l'hypothèse soit vraie, ni celle que les données soient dues au seul hasard ; Calcul direct de la queue gaussienne : p(5σ) = 2,87×10⁻⁷ (unilatéral), 5,73×10⁻⁷ (bilatéral), tous deux < 10⁻⁶ ; /home/sfaurite/tmp/cours-hub/src/pages/cosmologie/partie-vi/tensions-cosmologiques.mdx, lignes 49–73 (contexte sans encart correctif)*

#### 🟡 Mineur — `src/pages/cosmologie/partie-vi/tensions-cosmologiques.mdx`

> deux nombres que ΛCDM devrait prédire de façon univoque sont mesurés *différemment* selon qu'on les lit dans l'univers jeune ou dans l'univers proche

**Problème** : État de l'art 2024–2025 incomplet : les BAO de DESI (DR1 2024, DR2 2025), combinés au CMB et aux supernovæ, montrent une préférence de 2,8 à 4,2 σ pour une énergie noire évolutive (w₀wₐCDM) par rapport à Λ constante — devenue la troisième « tension » majeure discutée. Le chapitre ne la mentionne qu'indirectement (« énergie noire évolutive » comme candidate pour H₀).

**Correction** : Ajouter à la fin de la section « Systématiques, ou physique nouvelle ? » (après le paragraphe suivant le tableau) : « Depuis 2024, un indice indépendant alimente ce débat : les BAO du relevé DESI (DR1 2024, DR2 2025), combinés au CMB et aux supernovæ, préfèrent une énergie noire évoluant dans le temps (modèle w₀wₐCDM) à la constante Λ, entre 2,8 et 4,2 σ selon le jeu de supernovæ utilisé — indice débattu, non confirmé, mais surveillé de près. Notons qu'il ne résout pas la tension de Hubble : le meilleur ajustement tend plutôt à l'aggraver. »

*Sources : DESI Collaboration 2024, « DESI 2024 VI: Cosmological Constraints from the Measurements of Baryon Acoustic Oscillations », arXiv:2404.03002 (préférence 2,5–3,9 σ pour w₀wₐCDM selon le jeu de SNe) ; DESI Collaboration 2025, « DESI DR2 Results II: Measurements of Baryon Acoustic Oscillations and Model Extensions », arXiv:2503.14738 (2,8–4,2 σ avec CMB+SNe ; ~3,1 σ DESI+CMB seuls) ; Efstathiou 2024, « Evolving Dark Energy or Supernovae Systematics? », arXiv:2408.07175 (caractère débattu, dépendance au jeu DES-SN5YR)*

### Histoire — 25 confirmés

#### 🔴 CRITIQUE — `src/pages/histoire/partie-vi/renaissance-humanisme.mdx`

> À Florence, vers 1440, un secrétaire de chancellerie nommé Lorenzo Valla prend une feuille

**Problème** : Erreur de lieu et de fonction : en 1440, Valla n'est pas à Florence mais au service du roi Alphonse V d'Aragon, à la cour de Naples (alors en conflit avec le pape Eugène IV — contexte qui motive précisément le traité contre la Donation). Il n'a jamais été secrétaire de la chancellerie florentine (poste de Bruni ou Poggio).

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-vi/renaissance-humanisme.mdx : « À Florence, vers 1440, un secrétaire de chancellerie nommé Lorenzo Valla prend une feuille » par « À la cour de Naples, vers 1440, un secrétaire du roi Alphonse V d'Aragon nommé Lorenzo Valla prend une feuille » (optionnel : noter que le conflit entre Alphonse et le pape Eugène IV donne son contexte politique au traité).

*Sources : https://www.britannica.com/biography/Lorenzo-Valla ; https://www.encyclopedia.com/people/literature-and-arts/scholars-antiquarians-and-orientalists-biographies/lorenzo-valla ; https://history.hanover.edu/texts/vallaintro.html*

#### 🟠 Important — `src/data/histoire/symbols.ts`

> nom: 'Premier voyage transatlantique', desc: 'Traversee de Christophe Colomb : debut de la mise en contact durable des continents.'

**Problème** : Le voyage de Colomb (1492) n'est pas le premier voyage transatlantique : les Scandinaves (Leif Erikson) ont atteint l'Amerique du Nord vers l'an 1000, fait atteste archeologiquement (L'Anse aux Meadows, Terre-Neuve). Le nom est donc faux, meme si la description vise bien la mise en contact DURABLE.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/histoire/symbols.ts (ligne 38), remplacer nom: 'Premier voyage transatlantique' par nom: 'Voyage de Colomb' (le champ katex affiche déjà « 1492 »). Garder la desc telle quelle ; option : la compléter par « (des Scandinaves avaient atteint Terre-Neuve vers l'an 1000, sans contact durable) ».

*Sources : https://www.nature.com/articles/s41586-021-03972-8 ; https://whc.unesco.org/en/list/4/ ; https://parks.canada.ca/lhn-nhs/nl/meadows*

#### 🟠 Important — `src/data/histoire/symbols.ts`

> nom: 'Premiers outils de pierre', valeur: '≈ −3,3 millions d'annees (atteste)'

**Problème** : La date de 3,3 Ma repose essentiellement sur le site unique de Lomekwi 3 (Harmand et al., 2015), qui reste conteste. Le consensus robuste pour les plus anciens outils est l'Oldowayen ~2,6 Ma (Gona). Le badge « atteste » (sources directes concordantes) surevalue une donnee encore debattue selon l'echelle du cours.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/histoire/symbols.ts, ligne 26, remplacer la valeur « ≈ −3,3 millions d'années (attesté) » par « ≈ −3,3 millions d'années (débattu) » — ou, plus cohérent encore avec le chapitre : « ≈ −2,6 millions d'années (attesté) ; ~3,3 Ma (Lomekwi) débattu ». Aligne le symbole sur le texte du chapitre qui dit déjà « statut discuté ».

*Sources : https://www.nature.com/articles/nature14464 (Harmand et al. 2015, Lomekwi 3 = 3,3 Ma) ; https://www.sciencedirect.com/science/article/abs/pii/S0047248420300014 (Domínguez-Rodrigo et al., What is 'in situ'? Reply to Harmand 2015) ; https://brill.com/view/journals/jaa/17/2/article-p173_5.xml (Pliocene Archaeology at Lomekwi 3? New Evidence Fuels More Skepticism, 2019) ; https://en.wikipedia.org/wiki/Lomekwi_3*

#### 🟠 Important — `src/pages/histoire/partie-iii/invention-ecriture.mdx`

> pour écrire « Jean », on pourrait dessiner un *geai* (l'oiseau) suivi d'une *dent*. Le sens des images disparaît ; seul reste le son **/ʒã/ + /dã/**

**Problème** : Exemple phonétiquement faux : « geai » se prononce /ʒɛ/, pas /ʒã/ ; et « Jean » /ʒɑ̃/ est monosyllabique, donc geai + dent (/ʒɛ.dɑ̃/) ne peut pas l'écrire. L'exemple censé illustrer le principe du rébus — cœur du chapitre — ne fonctionne pas si le lecteur le teste.

**Correction** : Remplacer la 1re phrase de l'encart par : « En français : pour écrire le prénom « Théo », on pourrait dessiner une tasse de *thé* suivie d'*eau*. Le sens des images disparaît ; seul reste le son **/te/ + /o/**. »

*Sources : https://fr.wiktionary.org/wiki/geai (geai = /ʒɛ/) ; https://fr.wiktionary.org/wiki/Jean (Jean = /ʒɑ̃/, 1 syllabe)*

#### 🟠 Important — `src/pages/histoire/partie-iv/mondes-paralleles-chine-inde-amerique.mdx`

> Attribuer « la » Grande Muraille à Qin Shi Huang est une simplification tenace : il relie des murs antérieurs, mais l'édifice de pierre célèbre est largement postérieur.

**Problème** : Badge niveau="debattu" mal calibré : selon l'échelle, 🔴 = « controversé entre historiens ». Or le contenu énoncé (muraille visitée essentiellement Ming, murs Qin-Han en terre damée, Qin Shi Huang reliant des murs antérieurs) est un fait archéologiquement établi et consensuel. Seule l'idée reçue populaire est en cause, pas un débat savant.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iv/mondes-paralleles-chine-inde-amerique.mdx (ligne 34), remplacer : <Badge niveau="debattu">Attribuer « la » Grande Muraille à Qin Shi Huang est une simplification tenace : il relie des murs antérieurs, mais l'édifice de pierre célèbre est largement postérieur.</Badge> par : <Badge niveau="atteste">Attribuer « la » Grande Muraille à Qin Shi Huang est une idée reçue tenace dans la culture populaire, mais la chronologie est archéologiquement établie : il relie des murs antérieurs, et l'édifice de pierre célèbre est largement postérieur.</Badge>

*Sources : /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (PRESET_HISTOIRE, lignes 100-105) ; https://en.wikipedia.org/wiki/History_of_the_Great_Wall_of_China ; https://whc.unesco.org/en/list/438/ ; https://education.nationalgeographic.org/resource/great-wall-china/*

#### 🟠 Important — `src/pages/histoire/partie-iv/mondes-paralleles-chine-inde-amerique.mdx`

> Le diffusionnisme transocéanique est rejeté par le consensus, mais survit dans la culture populaire — d'où l'utilité de le nommer.

**Problème** : Badge niveau="debattu" mal calibré, et de façon risquée : il étiquette 🔴 (« controversé entre historiens ») la réfutation des théories d'apport égyptien/chinois/atlante, alors que le texte du badge lui-même dit que le rejet est consensuel. Un lecteur scannant les badges pourrait croire que la question d'un contact transocéanique reste scientifiquement ouverte.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iv/mondes-paralleles-chine-inde-amerique.mdx (ligne 52), remplacer : <Badge niveau="debattu">Le diffusionnisme transocéanique est rejeté par le consensus, mais survit dans la culture populaire — d'où l'utilité de le nommer.</Badge> par : <Badge niveau="atteste">Le rejet du diffusionnisme transocéanique fait consensus archéologique : aucune trace matérielle d'un contact, continuité des formes locales. La théorie ne survit que dans la culture populaire — d'où l'utilité de la nommer.</Badge>

*Sources : https://en.wikipedia.org/wiki/Pre-Columbian_transoceanic_contact_theories ; https://link.springer.com/article/10.1007/s11759-010-9132-x ; https://www.researchgate.net/publication/237233188_The_Fringe_of_American_Archaeology_Transoceanic_and_Transcontinental_Contacts_in_Prehistoric_America ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (définition du niveau « debattu », ligne 104)*

#### 🟠 Important — `src/pages/histoire/partie-iv/rome-republique-empire.mdx`

> Les généraux, à partir de Marius, recrutent des soldats sans terre qui leur deviennent personnellement fidèles : naissent les **armées-clientèles**

**Problème** : Affirmation périmée présentée sans badge : la « réforme marianique » (Marius ouvrant le recrutement aux prolétaires en 107 av. J.-C., créant des armées-clientèles) est largement remise en cause par la recherche récente (F. Cadiou, L'armée imaginaire, 2018 ; M. Taylor). La prolétarisation du recrutement fut graduelle, les capite censi déjà enrôlés avant, et la levée de 107 exceptionnelle.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iv/rome-republique-empire.mdx (ligne 41), remplacer : « Les généraux, à partir de Marius, recrutent des soldats sans terre qui leur deviennent personnellement fidèles : naissent les **armées-clientèles**, instruments de guerre civile. » par : « Selon le récit traditionnel, les généraux, à partir de Marius (107 av. J.-C.), recrutent des soldats sans terre qui leur deviennent personnellement fidèles : naîtraient ainsi les **armées-clientèles**, instruments de guerre civile. <Badge niveau="debattu">La recherche récente (F. Cadiou, *L'armée imaginaire*, 2018) conteste cette rupture marianique : l'évolution du recrutement fut graduelle, les plus pauvres étaient déjà enrôlés avant 107 et la conscription perdura. La fidélité personnelle des soldats aux *imperatores* des guerres civiles, elle, est bien attestée.</Badge> »

*Sources : https://bmcr.brynmawr.edu/2021/2021.06.02/ ; https://en.wikipedia.org/wiki/Marian_reforms ; https://acoup.blog/2023/06/30/collections-the-marian-reforms-werent-a-thing/ ; https://www.lesbelleslettres.com/livre/9782251447650/l-armee-imaginaire*

#### 🟡 Mineur — `src/data/histoire/glossary.ts`

> qui prolonge Rome plus de mille ans apres la chute de l'Occident

**Problème** : De la chute de l'Occident (476) a celle de Constantinople (1453), il s'ecoule 977 ans, soit MOINS de mille ans. « plus de mille ans » est donc inexact pour l'ancrage choisi (476).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/histoire/glossary.ts (ligne 48), remplacer « qui prolonge Rome plus de mille ans après la chute de l’Occident » par « qui prolonge Rome près de mille ans après la chute de l’Occident ».

*Sources : /home/sfaurite/tmp/cours-hub/src/data/histoire/symbols.ts (ligne 36 : 476 comme repère conventionnel de la fin de Rome en Occident) ; /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-v/trois-heritiers-rome.mdx (ligne 27 : « plus de mille ans » correctement ancré en 330) ; Dates conventionnelles : déposition de Romulus Augustule (476) et prise de Constantinople (1453) ; 1453 − 476 = 977 ans*

#### 🟡 Mineur — `src/pages/histoire/partie-ii/village-neolithique.mdx`

> les chasseurs-cueilleurs de la culture **Jōmon** fabriquent des poteries très tôt — parmi les plus anciennes connues au monde, autour du XIVe-XIIIe millénaire av. J.-C. selon les datations actuelles

**Problème** : Les plus anciennes poteries Jōmon (site d'Odai Yamamoto I, Jōmon initial) sont datées d'environ 16 500-15 500 cal BP, soit ~14 500 av. J.-C., c'est-à-dire la fin du XVe millénaire av. J.-C. La fourchette « XIVe-XIIIe millénaire » sous-estime légèrement leur ancienneté pour les exemplaires les plus précoces (le gros de la phase initiale s'étale toutefois bien sur le XIVe-XIIIe millénaire).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-ii/village-neolithique.mdx (ligne 33), remplacer « autour du XIVe-XIIIe millénaire av. J.-C. selon les datations actuelles » par « autour du XVe-XIIIe millénaire av. J.-C. selon les datations actuelles ».

*Sources : Nakamura et al. 2001, Radiocarbon 43 — datations AMS des résidus carbonisés d'Odai Yamamoto I (~13 780 BP, ~16 500-15 500 cal BP) ; Habu, Ancient Jomon of Japan, Cambridge University Press, 2004 (Jōmon initial dès ~16 500 cal BP) ; Kuzmin 2006, Antiquity — chronologie des plus anciennes céramiques d'Asie de l'Est ; Wu et al. 2012, Science — Xianrendong (~20 000-19 000 cal BP), confirmant « parmi les plus anciennes » et non « la plus ancienne »*

#### 🟡 Mineur — `src/pages/histoire/partie-iii/egypte-etat-territorial.mdx`

> la **palette de Narmer**, qui montre un roi coiffé des deux couronnes frappant un ennemi

**Problème** : Formulation visuellement inexacte : sur la scène de massacre, Narmer porte uniquement la couronne blanche de Haute-Égypte ; il porte la couronne rouge sur l'autre face, dans une autre scène. Il n'est jamais « coiffé des deux couronnes » en frappant. L'encart suivant dit correctement « portant successivement les deux couronnes ».

**Correction** : la **palette de Narmer**, qui montre un roi portant la couronne blanche du Sud en frappant un ennemi sur une face, et la couronne rouge du Nord sur l'autre

*Sources : Quibell, J.E., « Slate Palette from Hieraconpolis », ZÄS 36 (1898) — publication originale de la palette ; Toby Wilkinson, Early Dynastic Egypt (1999) — iconographie des couronnes sur la palette de Narmer ; Encart du fichier lui-même (ligne 40) : « portant successivement les deux couronnes » ; Wikipedia : « Narmer Palette » — description face par face (couronne blanche côté massacre, rouge côté procession)*

#### 🟡 Mineur — `src/pages/histoire/partie-iii/egypte-etat-territorial.mdx`

> les **papyri du Ouadi el-Jarf** (découverts en 2013, publiés à partir de 2016 par Pierre Tallet)

**Problème** : Date de publication imprécise : les premières publications de Tallet (avec G. Marouard) datent de 2014 (Near Eastern Archaeology notamment), et l'édition complète du « Journal de Merer » (Les papyrus de la mer Rouge I, IFAO) date de 2017. « À partir de 2016 » ne correspond à aucun des deux jalons.

**Correction** : les **papyri du Ouadi el-Jarf** (découverts en 2013, présentés dès 2014 et édités en 2017 par Pierre Tallet)

*Sources : https://shs.hal.science/halshs-03627028 ; https://www.journals.uchicago.edu/doi/abs/10.5615/neareastarch.77.1.0004 ; https://en.wikipedia.org/wiki/Diary_of_Merer*

#### 🟡 Mineur — `src/pages/histoire/partie-iii/invention-ecriture.mdx`

> en repérant des noms royaux (Ptolémée, Cléopâtre) encadrés de cartouches, il calibre des valeurs phonétiques

**Problème** : Dans le contexte du paragraphe (« La pierre de Rosette… »), la phrase laisse croire que les deux cartouches viennent de Rosette. Or la partie hiéroglyphique de Rosette ne conserve que Ptolémée ; le cartouche de Cléopâtre provient de l'obélisque de Philae (obélisque Bankes), que Champollion a croisé avec Rosette.

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iii/invention-ecriture.mdx (ligne 75) : « en repérant des noms royaux (Ptolémée, Cléopâtre) encadrés de cartouches, il calibre des valeurs phonétiques » par « en repérant des noms royaux dans des cartouches — Ptolémée sur la pierre de Rosette, Cléopâtre sur un obélisque de Philae —, il calibre des valeurs phonétiques »

*Sources : Champollion, Lettre à M. Dacier (1822) : valeurs phonétiques calibrées sur les cartouches de Ptolémée (Rosette) et de Cléopâtre (obélisque de Philae) ; British Museum, notice de la pierre de Rosette : registre hiéroglyphique incomplet ; décret de Memphis (196 av. J.-C.), seuls cartouches de Ptolémée V — antérieur au mariage avec Cléopâtre Ire ; Obélisque Bankes (Philae, auj. Kingston Lacy) : base grecque mentionnant Ptolémée et Cléopâtre ; lithographie de Bankes (1821) transmise à Champollion début 1822*

#### 🟡 Mineur — `src/pages/histoire/partie-iii/naissance-cites-mesopotamie.mdx`

> surgit une ville de plusieurs dizaines de milliers d'habitants, ceinte d'une muraille

**Problème** : Rattaché à « Vers 3500 avant notre ère », c'est anachronique : la muraille connue d'Uruk (~9 km, attribuée à Gilgamesh par la tradition) date du Dynastique archaïque I (~2900 av. J.-C.), et les effectifs de plusieurs dizaines de milliers correspondent à l'apogée (~3100-2900), comme le dit d'ailleurs correctement l'encart plus bas. Vers 3500, la ville est bien plus modeste et sans rempart attesté.

**Correction** : Remplacer dans l'intro (ligne 17) « surgit une ville de plusieurs dizaines de milliers d'habitants, ceinte d'une muraille, dominée par d'immenses bâtiments de brique » par « surgit une ville dominée par d'immenses bâtiments de brique, qui atteindra plusieurs dizaines de milliers d'habitants et sera, quelques siècles plus tard, ceinte d'une muraille »

*Sources : Encart interne du chapitre lui-même, ligne 52 de /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iii/naissance-cites-mesopotamie.mdx (apogée 3100-2900, muraille attribuée à Gilgamesh) ; H. Nissen, The Early History of the Ancient Near East (muraille du Dynastique archaïque I, ~2900 av. J.-C., briques plano-convexes) ; G. Algaze, The End of Prehistory and the Uruk World System (croissance d'Uruk : ~70-100 ha en Uruk moyen, ~250 ha en Uruk récent) ; M. Liverani, Uruk: The First City (chronologie de l'urbanisation et du rempart)*

#### 🟡 Mineur — `src/pages/histoire/partie-iii/naissance-cites-mesopotamie.mdx`

> **Caral** (vallée de Supe, ~3000–2500 av. J.-C.) élève des plateformes monumentales **sans trace claire de guerre**

**Problème** : Fourchette décalée : les datations radiocarbone publiées pour Caral (Shady, Haas & Creamer, Science 2001) donnent ~2600-2000 av. J.-C. Les dates proches de 3000 concernent la tradition Caral-Supe/Norte Chico au sens large (autres sites), et l'occupation de Caral se poursuit bien après 2500.

**Correction** : **Caral** (vallée de Supe, ~2600–2000 av. J.-C., dans une tradition régionale amorcée vers 3000) élève des plateformes monumentales **sans trace claire de guerre**

*Sources : Shady Solís, Haas & Creamer, « Dating Caral, a Preceramic Site in the Supe Valley… », Science 292 (2001), 723–726 : occupation ~2627–2020 cal BC ; Haas, Creamer & Ruiz, « Dating the Late Archaic occupation of the Norte Chico region in Peru », Nature 432 (2004) : dates ~3000 av. J.-C. sur d'autres sites de la tradition ; UNESCO, « Ville sacrée de Caral-Supe » : civilisation datée ~3000–1800 av. J.-C. (Archaïque tardif), fin bien après 2500*

#### 🟡 Mineur — `src/pages/histoire/partie-iii/premiers-empires-droit.mdx`

> Pour l'effondrement : **archéologie des destructions** (couches d'incendie), **archives diplomatiques** (lettres d'Amarna, archives d'Ougarit)

**Problème** : Les lettres d'Amarna (~1360-1330 av. J.-C.) précèdent l'effondrement d'environ 150 ans : elles documentent le système international de l'âge du bronze récent, pas la crise de ~1200. Les sources contemporaines de la crise sont les archives d'Ougarit et la correspondance hittite (demandes de grain). Pour un cours centré sur la critique des sources, l'amalgame mérite une nuance.

**Correction** : Remplacer la ligne 24 de /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iii/premiers-empires-droit.mdx par : « 4. Pour l'effondrement : **archéologie des destructions** (couches d'incendie), **archives diplomatiques** (lettres d'Amarna pour le système interconnecté du XIVe siècle ; archives d'Ougarit, contemporaines de la crise), et données **paléoclimatiques** (carottes, pollens). »

*Sources : Eric H. Cline, 1177 B.C.: The Year Civilization Collapsed (Princeton UP, 2014, éd. rév. 2021) — Amarna comme source du système du XIVe s., archives d'Ougarit contemporaines de la crise ; William L. Moran, The Amarna Letters (Johns Hopkins UP, 1992) — datation du corpus aux règnes d'Amenhotep III et Akhenaton (~1360-1330 av. J.-C.) ; Itamar Singer, A Political History of Ugarit, in Handbook of Ugaritic Studies (Brill, 1999) — dernières lettres d'Ougarit (demandes de grain, navires ennemis) jusqu'à la destruction ~1190-1185*

#### 🟡 Mineur — `src/pages/histoire/partie-iv/fin-rome-recompositions.mdx`

> entre 235 et 284, une vingtaine d'empereurs se succèdent, presque tous assassinés

**Problème** : Surestimation : environ la moitié des empereurs de la période sont assassinés ; plusieurs meurent autrement de mort violente ou prématurée — au combat (Philippe l'Arabe, Dèce, premier empereur tué face à un ennemi extérieur), de la peste (Claude II le Gothique), en captivité perse (Valérien), par suicide (Gordien Ier).

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-iv/fin-rome-recompositions.mdx (ligne 27) « entre 235 et 284, une vingtaine d'empereurs se succèdent, presque tous assassinés » par « entre 235 et 284, une vingtaine d'empereurs se succèdent, presque tous morts de mort violente (assassinat, bataille, captivité) »

*Sources : Res Gestae Divi Saporis (capture de Valérien, 260) ; Lactance, De mortibus persecutorum 5 ; Aurelius Victor, De Caesaribus 29 et Zosime I.23 (mort de Dèce à Abritus, 251) ; Historia Augusta, Vie de Claude (mort de Claude II de la peste, 270) ; Hérodien VII (suicide de Gordien I) ; D. Kienast, Römische Kaisertabelle (dates et fins de règne) ; D. Potter, The Roman Empire at Bay, AD 180–395*

#### 🟡 Mineur — `src/pages/histoire/partie-iv/rome-republique-empire.mdx`

> Des **assemblées** (comices) votent les lois et élisent, mais selon un système censitaire où le poids du vote dépend de la fortune.

**Problème** : Généralisation inexacte : seuls les comices centuriates votent par classes censitaires (élection des consuls et préteurs). Les comices tributes et le concile de la plèbe — qui votent l'essentiel des lois et élisent les magistrats inférieurs — sont organisés par tribus, sans pondération directe par la fortune.

**Correction** : Des **assemblées** (comices) votent les lois et élisent, mais selon des systèmes inégalitaires — censitaire, où le poids du vote dépend de la fortune, pour les comices centuriates qui élisent les hautes magistratures ; par tribus pour les assemblées qui votent la plupart des lois.

*Sources : Cicéron, De re publica II, 39-40 (pondération censitaire des comices centuriates) ; Lex Hortensia (287 av. J.-C.) : les plébiscites du concile de la plèbe ont force de loi ; A. Lintott, The Constitution of the Roman Republic, Oxford, 1999, chap. 5 (assemblées) ; C. Nicolet, Le métier de citoyen dans la Rome républicaine, Gallimard, 1976 (vote par tribus vs centuries)*

#### 🟡 Mineur — `src/pages/histoire/partie-v/ruptures-fin-moyen-age.mdx`

> Les chroniques narratives (Boccace, Jean de Venette, Gilles le Muisit, l'Égyptien al-Maqrīzī pour le monde mamelouk) : vivantes mais exagérantes, écrites par des survivants.

**Problème** : al-Maqrīzī (1364-1442) est né APRÈS la peste noire de 1347-1352 ; il n'en est pas un survivant mais un compilateur tardif (~80-100 ans après), à la différence des trois autres chroniqueurs cités, contemporains. Le qualificatif « écrites par des survivants » ne lui convient pas, ce qui affaiblit la distinction de critique des sources que le chapitre revendique.

**Correction** : Remplacer la phrase (ligne 20) par : « Les **chroniques** narratives (Boccace, Jean de Venette, Gilles le Muisit) : vivantes mais exagérantes, écrites par des survivants ; pour le monde mamelouk, le compilateur plus tardif al-Maqrīzī (né vers 1364) récapitule la peste à partir de sources antérieures. »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-v/ruptures-fin-moyen-age.mdx (ligne 20) ; Dates al-Maqrīzī 1364-1442, historien mamelouk ; Black Death 1347-1352 (connaissance établie)*

#### 🟡 Mineur — `src/pages/histoire/partie-v/ruptures-fin-moyen-age.mdx`

> les navires génois la portent en Méditerranée — Messine fin 1347, Marseille, Gênes, l'Égypte début 1348

**Problème** : La peste atteint l'Égypte (Alexandrie) dès l'automne 1347, quasi simultanément à Messine (octobre 1347), et non « début 1348 » ; Le Caire est touché début 1348. La séquence place donc l'Égypte trop tard d'un trimestre environ.

**Correction** : Remplacer « l'Égypte début 1348 » par : « Alexandrie à l'automne 1347, puis Marseille et Gênes au tournant de 1348 ». Phrase complète : « …puis les navires génois la portent en Méditerranée — Messine et Alexandrie à l'automne 1347, puis Marseille et Gênes au tournant de 1348. » (Le Caire, lui, ne sera frappé qu'à l'été-automne 1348.)

*Sources : Michael W. Dols, The Black Death in the Middle East (1977) — Alexandrie automne 1347, Le Caire pic automne 1348 ; https://en.wikipedia.org/wiki/Black_Death_in_the_Middle_East ; https://en.wikipedia.org/wiki/Black_Death*

#### 🟡 Mineur — `src/pages/histoire/partie-vi/etat-moderne-science-naissante.mdx`

> Attesté par les ouvrages eux-mêmes (*Astronomia nova*, *Harmonices mundi*, *Sidereus nuncius*) et les instruments conservés.

**Problème** : Le badge couvre une phrase citant les phases de Vénus, or celles-ci ne figurent pas dans le *Sidereus nuncius* (mars 1610), antérieur à leur observation (sept.-déc. 1610). Elles sont attestées par la correspondance de Galilée (anagramme à Kepler via G. de' Medici, déc. 1610) puis publiées dans les Lettres sur les taches solaires (1613).

**Correction** : Attesté par les ouvrages eux-mêmes (*Astronomia nova*, *Harmonices mundi*, *Sidereus nuncius*), la correspondance de Galilée (les phases de Vénus, observées fin 1610, sont annoncées par lettres puis publiées en 1613 dans les *Lettres sur les taches solaires*) et les instruments conservés.

*Sources : Galilée, Sidereus nuncius, Venise, mars 1610 (contenu : Lune, étoiles fixes, satellites de Jupiter — pas Vénus) ; Galilée, lettre à Giuliano de' Medici du 11 décembre 1610, anagramme « Haec immatura… » = « Cynthiae figuras aemulatur mater amorum » (Le Opere, éd. Favaro, vol. X) ; Galilée, Istoria e dimostrazioni intorno alle macchie solari (Lettres sur les taches solaires), Rome, 1613 — première publication des phases de Vénus ; Stillman Drake, Galileo at Work: His Scientific Biography, 1978 (chronologie des observations de Vénus, sept.-déc. 1610)*

#### 🟡 Mineur — `src/pages/histoire/partie-vi/grandes-decouvertes-premier-monde-global.mdx`

> témoignages nahuas recueillis par Sahagún (*Codex de Florence*, vers 1577) et rassemblés plus tard sous le titre *Visión de los vencidos*

**Problème** : Formulation trompeuse : *Visión de los vencidos* est une anthologie moderne publiée en 1959 par Miguel León-Portilla, qui rassemble le Codex de Florence ET d'autres sources nahuas (Anales de Tlatelolco, cantares…). « Plus tard », sans date ni auteur, laisse croire à une compilation d'époque coloniale.

**Correction** : …recueillis par Sahagún (*Codex de Florence*, vers 1577), rassemblés au XXe siècle avec d'autres sources nahuas par Miguel León-Portilla dans l'anthologie *Visión de los vencidos* (1959)

*Sources : Miguel León-Portilla (éd.), Visión de los vencidos. Relaciones indígenas de la conquista, UNAM, 1959 (trad. nahuatl Á. M. Garibay) ; Bernardino de Sahagún, Historia general de las cosas de Nueva España (Codex de Florence), achevé v. 1575-1577 ; Contexte vérifié dans /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-vi/grandes-decouvertes-premier-monde-global.mdx (lignes 21, 31, 52)*

#### 🟡 Mineur — `src/pages/histoire/partie-vi/imprimerie-revolution-information.mdx`

> le total réellement imprimé sur le demi-siècle se chiffre, selon des estimations prudentes fondées sur les tirages connus des ateliers, en **plusieurs millions d'exemplaires**

**Problème** : Sous-estimation : avec ~28 000-30 000 éditions et des tirages moyens de 400 à 1000 exemplaires, les estimations courantes (p. ex. Buringh & van Zanden) donnent de l'ordre de 12 millions d'exemplaires imprimés avant 1501, certaines allant jusqu'à 20 millions. « Plusieurs millions » est vrai comme minimum mais en deçà même des estimations prudentes.

**Correction** : le total réellement imprimé sur le demi-siècle se chiffre, selon les estimations fondées sur les tirages connus des ateliers, en **plusieurs millions d'exemplaires** — vraisemblablement plus de dix millions, les estimations courantes allant de 12 à 20 millions —

*Sources : Lucien Febvre & Henri-Jean Martin, L'Apparition du livre (1958) : 30 000-35 000 éditions, 15 à 20 millions d'exemplaires avant 1501 ; Eltjo Buringh & Jan Luiten van Zanden, « Charting the 'Rise of the West' », Journal of Economic History 69(2), 2009 : ~12,6 millions de livres imprimés en Europe occidentale au XVe siècle ; Incunabula Short Title Catalogue (British Library) : ~28 500-30 000 éditions recensées, chiffre déjà cité dans le chapitre*

#### 🟡 Mineur — `src/pages/histoire/partie-vi/reforme-fractures-religieuses.mdx`

> Aucun témoignage contemporain de Luther ne le décrit : il apparaît surtout sous la plume de Melanchthon, **après** la mort de Luther (1546).

**Problème** : Affirmation dépassée depuis 2006 : une note de Georg Rörer, secrétaire de Luther, rédigée vers 1540-1544 (donc du vivant de Luther) et redécouverte en 2006, mentionne l'affichage de thèses « aux portes des églises de Wittenberg ». Ce n'est pas un témoignage oculaire de 1517, mais « aucun témoignage contemporain de Luther » est inexact en l'état du dossier.

**Correction** : Aucun témoignage de première main de 1517 ne le décrit : le récit classique vient de Melanchthon (1546, après la mort de Luther) ; une note de Georg Rörer (vers 1544, découverte en 2006) mentionne l'affichage, sans être un témoignage oculaire.

*Sources : Martin Treu, « Der Thesenanschlag fand (nicht) statt. Ein neuer Fund aus der Universitäts- und Landesbibliothek Jena », Luther 78 (2007), p. 140-144 ; Volker Leppin & Timothy J. Wengert, « Sources for and against the Posting of the Ninety-Five Theses », Lutheran Quarterly 29 (2015), p. 373-398 ; Note manuscrite de Georg Rörer, Thüringer Universitäts- und Landesbibliothek Jena (exemplaire du Nouveau Testament de 1540 utilisé pour la révision de la Bible) ; /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-vi/reforme-fractures-religieuses.mdx (lignes 31-33)*

#### 🟡 Mineur — `src/pages/histoire/partie-vi/renaissance-humanisme.mdx`

> Valla le prouve sans sortir du document, par sa seule langue.

**Problème** : Contradiction interne : l'encart liste juste au-dessus le « silence des sources contemporaines », qui est un argument externe au document ; Valla mobilise aussi des arguments historiques (les empereurs ont continué de gouverner l'Occident après Constantin). La conclusion surjoue la pure critique interne.

**Correction** : Remplacer « Valla le prouve sans sortir du document, par sa seule langue. » par : « Valla le prouve essentiellement de l'intérieur — langue et cohérence —, en y joignant le silence des sources contemporaines. »

*Sources : Lorenzo Valla, De falso credita et ementita Constantini donatione (1440), trad. C. B. Coleman (1922) : arguments philologiques, historiques (successeurs de Constantin, monnaies) et ex silentio ; Stanford Encyclopedia of Philosophy, « Lorenzo Valla », section sur la Donation de Constantin ; /home/sfaurite/tmp/cours-hub/src/pages/histoire/partie-vi/renaissance-humanisme.mdx, lignes 40-45 (contradiction interne de l'encart)*

#### 🟡 Mineur — `src/pages/histoire/partie-vi/renaissance-humanisme.mdx`

> la renaissance carolingienne (IXe siècle)

**Problème** : Datation tronquée : la renaissance carolingienne commence sous Charlemagne dès les années 780, donc à la fin du VIIIe siècle, et se poursuit au IXe.

**Correction** : la renaissance carolingienne (fin VIIIe-IXe siècle)

*Sources : Admonitio generalis (789) et Epistola de litteris colendis (~784-785), actes fondateurs sous Charlemagne ; Pierre Riché, Éducation et culture dans l'Occident barbare / La vie quotidienne dans l'Empire carolingien : datation fin VIIIe-IXe s. ; Encyclopædia Universalis, art. « Renaissance carolingienne » : renouveau culturel de la fin du VIIIe et du IXe siècle*

### IA — 16 confirmés

#### 🟠 Important — `src/pages/ia/partie-i/regression-lineaire.mdx`

> Que le bol n'ait qu'un fond n'est pas un dessin, c'est un théorème.

**Problème** : Le « théorème » démontré dans le chapitre est seulement la semi-définie positivité de la hessienne, donc la convexité : cela garantit que tout minimum local est global, PAS l'unicité du minimum. Si les colonnes de X sont liées (features colinéaires), l'ensemble des minimiseurs est un sous-espace affine entier (vallée plate). Le titre de section « un seul minimum » et « ce bol n'a qu'un seul fond » enseignent une implication fausse (convexe ⟹ minimum unique). L'encart « équations normales » corrige d'ailleurs : unicité seulement sous rang plein.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-i/regression-lineaire.mdx : (1) l.53, remplacer « Et tout l'intérêt vient de ce que ce bol n'a **qu'un seul** fond. » par « Et tout l'intérêt vient de la forme de ce bol : pas de fausse cuvette où se piéger, tout creux en est le fond. » ; (2) l.55, retitrer « ### La convexité : tout minimum est global » ; (3) l.57, remplacer « Que le bol n'ait qu'un fond n'est pas un dessin, c'est un théorème. » par « Que ce bol n'ait aucune fausse cuvette n'est pas un dessin, c'est un théorème. » ; (4) après l.93, ajouter : « Un mot de prudence : la convexité garantit que tout minimum est global, pas qu'il est unique. Si les colonnes de $X$ sont liées (variables redondantes), le fond du bol est une vallée plate : tout un sous-espace affine de minimiseurs, tous aussi bons. L'unicité exige la convexité **stricte** (hessienne définie positive), c'est-à-dire $X$ de rang plein — exactement la condition de l'encart sur les équations normales ci-dessous. »

*Sources : https://utminers.utep.edu/xzeng/2017spring_math5330/MATH_5330_Computational_Methods_of_Linear_Algebra_files/ln08.pdf ; https://math.ucla.edu/~njhu/notes/nla/lsq/leastsquares/ ; https://ai.stanford.edu/~gwthomas/notes/convexity.pdf ; https://arxiv.org/abs/1410.1078*

#### 🟠 Important — `src/pages/ia/partie-ii/descente-de-gradient.mdx`

> En non convexe lisse (avec $\eta \le 1/\beta$), on démontre seulement que le gradient s'annule à la limite ($\min_{s \le t}\|\nabla L(\theta_s)\| \to 0$)

**Problème** : Badge « prouve » dont l'énoncé est faux sans l'hypothèse que L est minorée : pour L(θ) = −θ (gradient 0-lipschitzien), la descente avance indéfiniment et ‖∇L‖ = 1 ne tend jamais vers 0. La preuve standard somme les baisses de perte, ce qui exige inf L > −∞. De plus, min‖∇L‖ → 0 n'implique pas la convergence des itérés vers un point critique, alors que le badge conclut « convergence vers un point critique ».

**Correction** : Remplacer le contenu du Badge ligne 152 de /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-ii/descente-de-gradient.mdx par : « En non convexe lisse, si $L$ est **minorée** (cas d'une perte $\ge 0$) et $\eta \le 1/\beta$, on démontre seulement $\min_{s \le t}\|\nabla L(\theta_s)\| \to 0$ : le gradient devient arbitrairement petit le long de la trajectoire — pas la convergence des itérés vers un minimum, encore moins le minimum global. »

*Sources : https://arxiv.org/html/2406.17506 — Rotaru, Glineur, Patrinos : « We assume the function f to be bounded from below and denote f* := inf f > −∞ » pour borner min ‖∇f(x_i)‖² ; https://www.cs.ubc.ca/~schmidtm/Courses/540-W18/L4.pdf — Schmidt (UBC CPSC 540) : f minorée par f* requis pour min_t ‖∇f(x^t)‖² ≤ 2(f(x⁰)−f*)/k ; Nesterov, Introductory Lectures on Convex Optimization (2004), §1.2.3 : méthode du gradient sur f ∈ C^{1,1}_L bornée inférieurement ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-ii/descente-de-gradient.mdx, lignes 30 (hypothèses sans minoration), 127 (le cas convexe exige bien un minimiseur), 152 (badge incriminé)*

#### 🟡 Mineur — `src/data/ia/glossary.ts`

> Théorème : un réseau à une couche cachée assez large peut approcher n'importe quelle fonction continue.

**Problème** : L'énoncé omet la restriction à un domaine compact. Le théorème (Cybenko 1989, Hornik 1991) garantit l'approximation uniforme des fonctions continues sur un compact ; sans cette restriction l'énoncé est faux (un réseau ReLU fini, affine par morceaux, ne peut pas approcher eˣ sur ℝ tout entier).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/ia/glossary.ts (ligne 35), remplacer la def par : 'Théorème : un réseau à une couche cachée assez large peut approcher n’importe quelle fonction continue sur un domaine borné (compact), avec la précision voulue. <em>Existence</em> d’un réseau — pas garantie qu’on l’apprenne.'

*Sources : Cybenko, G. (1989), « Approximation by superpositions of a sigmoidal function », Mathematics of Control, Signals and Systems 2:303–314 ; Hornik, K. (1991), « Approximation capabilities of multilayer feedforward networks », Neural Networks 4(2):251–257 ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-iii/approximation-universelle.mdx (badge l. 35 et encart l. 41 : hypothèse de compacité déclarée essentielle)*

#### 🟡 Mineur — `src/data/ia/glossary.ts`

> chaque position calcule une <strong>requête</strong> et la compare aux <strong>clés</strong> de toutes les autres

**Problème** : En self-attention, chaque position compare sa requête aux clés de TOUTES les positions, y compris la sienne (l'attention sur soi-même est non seulement permise mais souvent dominante). « toutes les autres » suggère à tort une exclusion de soi.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/data/ia/glossary.ts (ligne 48), remplacer « la compare aux <strong>clés</strong> de toutes les autres pour pondérer leurs <strong>valeurs</strong> » par « la compare aux <strong>clés</strong> de toutes les positions (la sienne comprise) pour pondérer leurs <strong>valeurs</strong> »

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-v/mecanisme-attention.mdx (lignes 83, 88, 95 : softmax sur toutes les positions, « lui-même compris ») ; Vaswani et al., « Attention Is All You Need », 2017 — Attention(Q,K,V)=softmax(QK^T/√d_k)V, somme sur toutes les positions sans exclusion de la diagonale*

#### 🟡 Mineur — `src/pages/ia/partie-i/neurone-formel.mdx`

> en général, d'un **hyperplan** (un sous-espace affine de dimension $n-1$)

**Problème** : L'affirmation n'est vraie que si $\mathbf{w} \neq \mathbf{0}$. Si $\mathbf{w} = \mathbf{0}$, l'ensemble $\{x : b = 0\}$ est soit vide soit $\mathbb{R}^n$ tout entier, et la « normale » comme « il pointe vers le côté $z>0$ » n'ont plus de sens. Pour un cours déductif qui étiquette ce résultat « prouve », l'hypothèse manquante mérite d'être posée.

**Correction** : Dans l'Étape 2 de l'encart (ligne 75 de /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-i/neurone-formel.mdx), remplacer « en général, d'un **hyperplan** (un sous-espace affine de dimension $n-1$). » par « en général, d'un **hyperplan** (un sous-espace affine de dimension $n-1$) — à condition que $\mathbf{w} \neq \mathbf{0}$, ce que nous supposons désormais : si $\mathbf{w} = \mathbf{0}$, la sortie du neurone est constante et il n'y a pas de frontière. »

*Sources : Définition standard d'un hyperplan affine : ensemble des solutions d'une équation linéaire non triviale (forme affine de partie linéaire non nulle) — ex. S. Lang, Linear Algebra ; Wikipédia « Hyperplan » ; Vérification directe : si w=0, {x : b=0} = ∅ (b≠0) ou ℝⁿ (b=0), donc jamais de dimension n−1 ; Contexte du fichier /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-i/neurone-formel.mdx : encart « calcul » avec ∎ (l.69–84), badge « prouvé » du Resultat (l.92), bloc Hypotheses sans condition w≠0 (l.26–30)*

#### 🟡 Mineur — `src/pages/ia/partie-i/regression-lineaire.mdx`

> La perte $L$ est donc une **forme quadratique** en $(w, b)$

**Problème** : Terminologie incorrecte : une « forme quadratique » est par définition un polynôme homogène de degré 2. Or L contient des termes linéaires (croisés avec les y_i) et un terme constant ((1/n)Σy_i²) : c'est une fonction quadratique (polynôme de degré 2), pas une forme quadratique. La phrase précédente disait correctement « fonction quadratique ».

**Correction** : Remplacer dans la ligne 49 : « La perte $L$ est donc une **forme quadratique** en $(w, b)$ » par « La perte $L$ est donc une **fonction quadratique** (un polynôme de degré 2) en $(w, b)$ ». Le terme « forme quadratique » reste réservé à $u^\top H\,u$ dans l'encart de convexité (ligne 79), où il est correct.

*Sources : Définition standard : forme quadratique = polynôme homogène de degré 2 (q(λu)=λ²q(u)), cf. tout cours d'algèbre bilinéaire / fr.wikipedia.org/wiki/Forme_quadratique ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-i/regression-lineaire.mdx lignes 49 et 79 (usage strict correct de « forme quadratique » pour u^T H u)*

#### 🟡 Mineur — `src/pages/ia/partie-i/regression-logistique.mdx`

> L'absence de solution analytique vient de la non-linéarité de $\sigma$ dans les conditions d'optimalité $\nabla\mathcal{L}_{\text{CE}} = 0$.

**Problème** : Badge « prouve » discutable : que les conditions d'optimalité soient transcendantes est exact, mais l'inexistence d'une formule fermée n'est ni démontrée dans le cours ni un théorème standard (la « non-linéarité » seule ne prouve rien : les équations quadratiques sont non linéaires et se résolvent). C'est un fait universellement admis, pas un résultat prouvé au sens de l'échelle. Par ailleurs, pour des données linéairement séparables, $\nabla\mathcal{L}_{CE}=0$ n'a même aucune solution (poids divergents).

**Correction** : Remplacer le contenu du badge (ligne 123 de /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-i/regression-logistique.mdx) par : « Les conditions d'optimalité $\nabla\mathcal{L}_{\text{CE}} = 0$ sont des équations transcendantes en $(w,b)$ à cause de $\sigma$ : la résolution algébrique des équations normales ne s'applique plus, et aucune formule fermée n'est connue. (Cas extrême : pour des données parfaitement séparables, le minimum n'est même pas atteint — les poids divergent.) » Et dans le texte courant, remplacer « sans formule fermée pour $(w,b)$ » par « sans formule fermée connue pour $(w,b)$ ».

*Sources : Bishop, Pattern Recognition and Machine Learning, §4.3.3 (affirme l'absence de forme fermée « due to the nonlinearity of the logistic sigmoid », sans preuve) ; Albert & Anderson (1984), On the existence of maximum likelihood estimates in logistic regression models, Biometrika 71(1):1-10 (non-existence du MLE en cas de séparation parfaite) ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (ligne 115 : « prouve » = « Résultat mathématique prouvé ») ; Hastie, Tibshirani & Friedman, Elements of Statistical Learning, §4.4 (résolution itérative IRLS, pas de forme fermée affirmée sans preuve)*

#### 🟡 Mineur — `src/pages/ia/partie-ii/descente-de-gradient.mdx`

> en l'absence de séparation parfaite des données (sinon le minimum file à l'infini), un unique fond, qui est le minimum global.

**Problème** : L'unicité du minimiseur de l'entropie croisée en régression logistique exige, outre la non-séparation, que la matrice des variables soit de rang plein (pas de variables linéairement redondantes). Avec deux variables colinéaires, la perte est convexe mais non strictement : les minimiseurs forment tout un sous-espace affine. La valeur minimale est unique, pas le point.

**Correction** : Remplacer « un unique fond, qui est le minimum global. » par « un fond, qui est le minimum global — un point unique dès que les variables d'entrée ne sont pas linéairement redondantes (matrice de données de rang plein, qui rend la perte strictement convexe). »

*Sources : Albert & Anderson (1984), « On the existence of maximum likelihood estimates in logistic regression models », Biometrika 71(1):1-10 (non-séparation ⇒ existence ; rang plein ⇒ unicité) ; Hastie, Tibshirani & Friedman, The Elements of Statistical Learning, §4.4 (hessien XᵀWX de la régression logistique) ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-ii/descente-de-gradient.mdx:53 ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-i/regression-logistique.mdx (aucune hypothèse de rang plein posée en amont)*

#### 🟡 Mineur — `src/pages/ia/partie-iii/optimiseurs-sgd-adam.mdx`

> Pour une fonction **convexe**, le SGD converge vers le minimum si la suite des pas $\eta_t$ (le pas peut décroître au cours du temps) satisfait les **conditions de Robbins-Monro**

**Problème** : Énoncé incomplet badgé « prouve » : les conditions de Robbins-Monro sur le pas ne suffisent pas seules. Les théorèmes standard exigent aussi des hypothèses de régularité (variance des gradients stochastiques bornée, ou gradients bornés), et en convexe simple la convergence porte sur les valeurs/itérés moyennés ou vers l'ensemble des minimiseurs.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-iii/optimiseurs-sgd-adam.mdx : (1) ligne 72, remplacer « Pour une fonction **convexe**, le SGD converge vers le minimum si la suite des pas $\eta_t$ (le pas peut décroître au cours du temps) satisfait les **conditions de Robbins-Monro** : » par « Pour une fonction **convexe** et sous des hypothèses de régularité standard (fonction suffisamment lisse, variance des gradients stochastiques bornée), le SGD converge vers le minimum si la suite des pas $\eta_t$ (le pas peut décroître au cours du temps) satisfait les **conditions de Robbins-Monro** : » ; (2) ligne 78, remplacer le texte du badge « Convergence garantie en convexe sous ces conditions sur le pas. » par « Convergence garantie en convexe sous ces conditions sur le pas et des hypothèses de régularité standard (lissité, variance bornée). » (le niveau « prouve » peut être conservé une fois les hypothèses énoncées).

*Sources : Robbins & Monro (1951), « A Stochastic Approximation Method », Ann. Math. Statist. 22(3):400-407 — le théorème original suppose déjà des observations bornées ; Bottou, Curtis & Nocedal (2018), « Optimization Methods for Large-Scale Machine Learning », SIAM Review 60(2), théorèmes 4.6-4.10 — exigent L-lissité et variance bornée en plus des conditions sur le pas ; Bertsekas & Tsitsiklis (2000), « Gradient Convergence in Gradient Methods with Errors », SIAM J. Optim. 10(3) — hypothèses de lissité et de croissance du bruit ; Contre-exemple : f(x)=x⁴ convexe C∞, descente de gradient déterministe avec η_t=1/t et x₁=10 diverge (pas de L-lissité globale)*

#### 🟡 Mineur — `src/pages/ia/partie-iii/perceptron-multicouche.mdx`

> Ce résultat n'est pas une anecdote : c'est un théorème d'impossibilité. Il a, historiquement, gelé le domaine pendant des années.

**Problème** : Raccourci historiographique : ce n'est pas le résultat XOR seul (trivial et connu avant) qui a gelé le domaine, mais la critique plus large de Minsky & Papert (1969) sur les perceptrons, combinée à l'absence d'algorithme pour entraîner les réseaux multicouches — dont on savait déjà qu'ils pouvaient calculer XOR. Aucune attribution ni date n'est donnée.

**Correction** : Remplacer (ligne 75) « Ce résultat n'est pas une anecdote : c'est un théorème d'impossibilité. Il a, historiquement, gelé le domaine pendant des années. » par : « Ce résultat n'est pas une anecdote : c'est un théorème d'impossibilité. Popularisé par la critique de Minsky et Papert (1969), il a contribué à geler le domaine pendant des années — non parce qu'on ignorait qu'un réseau multicouche résout le XOR, mais parce qu'on ne savait pas encore entraîner de tels réseaux. »

*Sources : Minsky M. & Papert S., Perceptrons: An Introduction to Computational Geometry, MIT Press, 1969 (les auteurs savaient qu'un réseau multicouche calcule XOR ; leur scepticisme portait sur l'extension de l'apprentissage) ; Olazaran M., « A Sociological Study of the Official History of the Perceptrons Controversy », Social Studies of Science 26(3), 1996 ; Rumelhart D., Hinton G. & Williams R., « Learning representations by back-propagating errors », Nature 323, 1986 (popularisation de la rétropropagation, fin de l'« hiver » connexionniste) ; Goodfellow I., Bengio Y. & Courville A., Deep Learning, MIT Press, 2016, §1.2 et §6.1*

#### 🟡 Mineur — `src/pages/ia/partie-iii/regularisation-overfitting.mdx`

> les réseaux modernes, massivement **sur-paramétrés** (des milliards de paramètres pour bien moins d'exemples), interpolent parfaitement l'entraînement

**Problème** : Généralisation excessive : vrai pour le régime étudié par Zhang et al. (vision : p >> n, erreur d'entraînement nulle), mais faux pour les grands modèles de langage actuels, entraînés sur bien plus de tokens que de paramètres (régime Chinchilla, ~20 tokens/paramètre) et qui n'interpolent pas (perte d'entraînement > 0).

**Correction** : Or des réseaux massivement **sur-paramétrés** (en vision notamment : bien plus de paramètres que d'exemples) peuvent interpoler parfaitement l'entraînement *et généraliser quand même très bien*.

*Sources : Zhang et al. 2017, « Understanding deep learning requires rethinking generalization », arXiv:1611.03530 (erreur d'entraînement nulle sur CIFAR-10/ImageNet, vision) ; Hoffmann et al. 2022, « Training Compute-Optimal Large Language Models » (Chinchilla), arXiv:2203.15556 (~20 tokens/paramètre, régime sous-paramétré en tokens) ; Belkin et al. 2019, « Reconciling modern machine-learning practice and the bias–variance trade-off », PNAS, arXiv:1812.11118 (double descente au point d'interpolation) ; Nakkiran et al. 2019, « Deep Double Descent », arXiv:1912.02292*

#### 🟡 Mineur — `src/pages/ia/partie-iv/plongements.mdx`

> <Badge niveau="boitenoire">Principe linguistique empirique. Il fonctionne remarquablement bien, mais reste une hypothèse posée, jamais établie comme théorème.</Badge>

**Problème** : Le texte même du badge (« fonctionne remarquablement bien... jamais établie comme théorème ») correspond quasi mot pour mot à la définition de 🔵 robuste (« régularité expérimentale très reproductible sans preuve générale »). Le 🔴 boitenoire (« mal compris théoriquement ») fait doublon avec le badge de la ligne 90 qui couvre déjà, à juste titre, le « pourquoi » mal compris. Calibration incohérente avec l'a priori analogue du chapitre convolution (badgé 🟡).

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-iv/plongements.mdx (ligne 52), remplacer : <Badge niveau="boitenoire">Principe linguistique empirique. Il fonctionne remarquablement bien, mais reste une hypothèse posée, jamais établie comme théorème.</Badge> par : <Badge niveau="robuste">Principe linguistique empirique. Il fonctionne remarquablement bien, mais reste une hypothèse posée, jamais établie comme théorème.</Badge>

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-iv/plongements.mdx (l.49-53, 64-66, 88-90) ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (PRESET_IA, l.114-119) ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-iv/convolution.mdx (Tournant l.21-25) ; /home/sfaurite/tmp/cours-hub/src/components/Badge.astro (doc du slot : le texte justifie le niveau)*

#### 🟡 Mineur — `src/pages/ia/partie-v/mecanisme-attention.mdx`

> Le mot « banque » n'a de sens qu'à la lumière de « rivière » — qui se trouve cinq mots plus loin.

**Problème** : Erreur de comptage : dans « la banque de la rivière était boueuse », « rivière » se trouve trois mots après « banque » (de, la, rivière), pas cinq.

**Correction** : Remplacer « — qui se trouve cinq mots plus loin. » par « — qui se trouve trois mots plus loin. » (ligne 19 de /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-v/mecanisme-attention.mdx)

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-v/mecanisme-attention.mdx (ligne 19, comptage direct sur la phrase citée)*

#### 🟡 Mineur — `src/pages/ia/partie-v/mecanisme-attention.mdx`

> Reprenons la phrase « la banque de la rivière était boueuse ».

**Problème** : L'ambiguïté illustrée est celle de l'anglais bank (établissement financier / berge). En français, « banque » ne désigne jamais la berge d'une rivière : la phrase est un calque non idiomatique et la polysémie que l'attention est censée résoudre n'existe pas dans la langue du cours.

**Correction** : Dans mecanisme-attention.mdx ligne 19, remplacer la première phrase par : « Reprenons la phrase « la banque de la rivière était boueuse » — calque assumé du célèbre exemple anglais *the bank of the river*, où *bank* signifie aussi bien « banque » que « berge ». » Le reste du paragraphe est inchangé. Cette variante minimale préserve la ligne 95 et la vidéo Manim ia-attention-qkv qui réutilisent les tokens « banque »/« rivière ». Propager la même mention d'emprunt dans src/pages/ia/partie-iv/plongements.mdx ligne 102, où l'exemple est introduit (« *banque* a un seul vecteur, qu'il s'agisse d'une rivière ou d'un guichet »).

*Sources : https://www.cnrtl.fr/definition/banque (TLFi : aucun sens « berge ») ; https://www.larousse.fr/dictionnaires/francais/banque/7855 ; Devlin et al. 2019, BERT, arXiv:1810.04805 (exemple canonique anglais bank : bank deposit vs river bank) ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-v/mecanisme-attention.mdx (lignes 19, 95)*

#### 🟡 Mineur — `src/pages/ia/partie-v/transformer.mdx`

> <Badge niveau="prouve">La *nécessité* d'ajouter une information de position découle de l'équivariance ci-dessus.</Badge>

**Problème** : L'équivariance n'est démontrée que pour l'attention non masquée. Le masque causal du décodeur (introduit juste après) brise cette symétrie, et la nécessité ne découle alors plus du théorème : des décodeurs sans aucun encodage positionnel apprennent l'information de position (NoPE — Haviv et al. 2022 ; Kazemnejad et al. 2023). Le badge 🟢 sur-étend le résultat prouvé.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-v/transformer.mdx (ligne 80), remplacer « <Badge niveau="prouve">La *nécessité* d'ajouter une information de position découle de l'équivariance ci-dessus.</Badge> » par : « <Badge niveau="prouve">Pour l'attention *bidirectionnelle* (non masquée), la nécessité d'ajouter une information de position découle de l'équivariance ci-dessus.</Badge> <Badge niveau="robuste">Le masque causal du décodeur (section suivante) brise cette équivariance : des décodeurs *sans aucun* encodage positionnel explicite (« NoPE ») apprennent l'ordre malgré tout (Haviv et al. 2022 ; Kazemnejad et al. 2023). Pour eux, l'encodage positionnel est une aide empirique, pas une nécessité démontrée.</Badge> »

*Sources : Haviv et al. 2022, « Transformer Language Models without Positional Encodings Still Learn Positional Information », Findings of ACL 2022, arXiv:2203.16634 ; Kazemnejad et al. 2023, « The Impact of Positional Encoding on Length Generalization in Transformers », NeurIPS 2023, arXiv:2305.19466 ; Vérification algébrique : softmax(P S P^T + M) P V = P softmax(S + P^T M P) V ; équivariance ssi P^T M P = M, faux pour le masque triangulaire causal*

#### 🟡 Mineur — `src/pages/ia/partie-vi/lois-echelle.mdx`

> (typiquement $\alpha$ de l'ordre de $0{,}05$ à $0{,}1$ pour le langage)

**Problème** : Cette plage reprend les exposants de Kaplan et al. 2020 (α_N ≈ 0,076, α_D ≈ 0,095, α_C ≈ 0,05), mais la ré-analyse Chinchilla (Hoffmann et al. 2022, citée plus loin dans le chapitre), avec un protocole corrigé (schedule de LR ajusté au budget), trouve ≈ 0,34 pour la taille et ≈ 0,28 pour les données. Présenter 0,05–0,1 comme « typique » sans réserve est légèrement périmé : l'exposant dépend fortement du protocole.

**Correction** : Remplacer « (typiquement $\alpha$ de l'ordre de $0{,}05$ à $0{,}1$ pour le langage) » par « (pour le langage, les premières mesures donnaient $\alpha$ de l'ordre de $0{,}05$ à $0{,}1$ — Kaplan et al., 2020 ; des protocoles plus soignés comme Chinchilla, 2022, qu'on retrouvera plus bas, trouvent plutôt $\alpha \approx 0{,}3$ : la valeur dépend fortement du protocole d'entraînement) »

*Sources : Kaplan et al. 2020, « Scaling Laws for Neural Language Models », arXiv:2001.08361 (α_N≈0,076, α_D≈0,095, α_C^min≈0,050, fits sans perte irréductible) ; Hoffmann et al. 2022, « Training Compute-Optimal Large Language Models », arXiv:2203.15556 (fit paramétrique L=E+A/N^α+B/D^β : E≈1,69, α≈0,34, β≈0,28) ; Porian et al. 2024, « Resolving Discrepancies in Compute-Optimal Scaling of Language Models », arXiv:2406.19146 (explique l'écart Kaplan/Chinchilla par le protocole) ; /home/sfaurite/tmp/cours-hub/src/pages/ia/partie-vi/lois-echelle.mdx (ligne 30 : l'équation inclut L_∞ ; lignes 79-86 : Chinchilla déjà cité)*

### Processeurs — 16 confirmés

#### 🟠 Important — `src/pages/processeurs/partie-i/jonction-pn.mdx`

> Partant d'un $I_S$ minuscule (de l'ordre du nanoampère pour le Si), il faut accumuler environ une dizaine de ces tranches pour atteindre un courant « utile » (le milliampère)

**Problème** : Incohérence arithmétique : de 1 nA à 1 mA il n'y a que 6 décades, soit 6 tranches de 60 mV ≈ 0,36 V — pas « une dizaine », et pas 0,6–0,7 V. Pour retrouver le seuil encadré, il faut ~10–12 décades, donc I_S ~ 0,1 pA à 1 fA, ce qui est d'ailleurs l'ordre de grandeur réel d'une jonction Si idéale (n = 1). Les I_S au nA concernent des diodes réelles avec n ≈ 2, où la pente n'est plus 60 mV/décade.

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/jonction-pn.mdx (ligne 91) : « Partant d'un $I_S$ minuscule (de l'ordre du nanoampère pour le Si), il faut accumuler environ une dizaine de ces tranches pour atteindre un courant « utile » (le milliampère) » par « Partant d'un $I_S$ minuscule (de l'ordre du picoampère, voire du femtoampère, pour une jonction Si idéale), il faut accumuler une dizaine de ces tranches — 10 à 12 décades — pour atteindre un courant « utile » (le milliampère) »

*Sources : Sedra/Smith, Microelectronic Circuits, ch. 3 (I_S ~ 10^-15 A pour une diode small-signal) — https://silo.tips/download/sedra-smith-microelectronic-circuits-6-e-chapter-3-diodes-s-c-lin-ee-national-ch ; Berkeley EECS, The Diode (I_S typique ~ 10^-12 A pour Si) — https://icbook.eecs.berkeley.edu/sites/icbook.eecs.berkeley.edu/files/diode.pdf ; Modèle SPICE 1N4148 : IS=2.52n, N=1.752 (le nA va avec n≈1,75, pas 60 mV/décade) — https://github.com/evenator/LTSpice-Libraries/blob/master/cmp/standard.dio ; Wikipedia, Diode modelling — https://en.wikipedia.org/wiki/Diode_modelling*

#### 🟠 Important — `src/pages/processeurs/partie-ii/mosfet-interrupteur.mdx`

> Si $V_{GS} < V_{th}$ : pas de canal. Source et drain sont séparés par le substrat ; **aucun courant** ne passe. Le transistor est **bloqué**.

**Problème** : Étiquetée 🟢 fonde, l'affirmation « aucun courant » est fausse en physique : il existe une conduction sous-seuil (inversion faible, courant de diffusion exponentiel en V_GS, pente ~60-100 mV/décade) ; la transition est progressive et V_th est une définition conventionnelle. Le chapitre suivant qualifie lui-même ce seuil net d'idéalisation (badge 🟡 ligne 24 d'inverseur-cmos), d'où une incohérence interne.

**Correction** : Ligne 27 de /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-ii/mosfet-interrupteur.mdx, remplacer le point et son badge par : « - Si $V_{GS} < V_{th}$ : pas de canal d'inversion fort. Source et drain sont séparés par le substrat ; **pratiquement aucun courant** ne passe. Le transistor est **bloqué**. <Badge niveau="idealise">En réalité subsiste une conduction sous-seuil, exponentiellement faible en $V_{GS}$ (≈ 60–100 mV par décade à température ambiante) ; on la néglige en logique — c'est l'idéalisation assumée plus bas (« interrupteur parfait »).</Badge> »

*Sources : https://en.wikipedia.org/wiki/Subthreshold_conduction ; https://en.wikipedia.org/wiki/Subthreshold_slope ; https://www.iue.tuwien.ac.at/phd/stockinger/node13.html ; Sze & Ng, Physics of Semiconductor Devices ; Taur & Ning, Fundamentals of Modern VLSI Devices*

#### 🟠 Important — `src/pages/processeurs/partie-iii/portes-nand.mdx`

> <Badge niveau="convention">Bâtir les circuits à partir de NAND/NOR est un choix motivé par l'efficacité du CMOS, pas par la logique.

**Problème** : Badge mal calibré et incohérent avec le reste du cours : la même affirmation est badgée niveau="implementation" dans algebre-boole.mdx (« qu'une puce préfère le NAND tient à des raisons technologiques… ça, c'est de l'implémentation »). Le Tournant juste au-dessus dit d'ailleurs « nous posons un choix d'implémentation ». La préférence NAND/NOR dépend de la technologie (CMOS) et du fondeur, pas d'une convention d'interface type ISA ou logique positive.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iii/portes-nand.mdx ligne 120, remplacer niveau="convention" par niveau="implementation" : <Badge niveau="implementation">Bâtir les circuits à partir de NAND/NOR est un choix motivé par l'efficacité du CMOS, pas par la logique. On pourrait tout faire avec NOR seule, ou tout autre ensemble universel.</Badge>

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iii/algebre-boole.mdx (ligne 143) ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iii/portes-nand.mdx (ligne 117, Tournant) ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts (PRESET_INGENIERIE) ; https://www.geeksforgeeks.org/digital-logic/introduction-to-logic-family/*

#### 🟠 Important — `src/pages/processeurs/partie-iv/hierarchie-cache.mdx`

> <Badge niveau="fonde">La localité est une propriété empirique, mais observée si universellement sur les programmes réels qu'on la traite comme un fondement de l'architecture.

**Problème** : Badge mal calibré et incohérent avec le texte. L'échelle réserve 🟢 fonde aux lois physiques vérifiées ou déductions strictes. Or le Tournant immédiatement au-dessus affirme explicitement que la localité « n'est pas une loi de la nature » mais « une régularité empirique du comportement des programmes » qu'« on admet comme un fait d'observation ». Le badge fonde contredit donc à la fois l'échelle du cours et le paragraphe adjacent.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iv/hierarchie-cache.mdx (ligne 61), remplacer le badge par : <Badge niveau="idealise">La localité est une régularité empirique des programmes réels, pas une loi de la nature : on l'admet comme hypothèse de modèle, si universellement vérifiée qu'on la traite comme un fondement de l'architecture. Une fois la localité admise, le succès de la hiérarchie mémoire en est la conséquence logique directe : il suffit de garder près du processeur ce qui vient de servir, plus son voisinage.</Badge>

*Sources : https://dl.acm.org/doi/10.1145/1070838.1070856 ; http://denninginstitute.com/pjd/PUBS/CACMcols/cacmJul05.pdf ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/methodologie.mdx (lignes 24-31, définition du niveau fonde) ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iv/hierarchie-cache.mdx (lignes 52-61, Tournant et badge incriminé)*

#### 🟠 Important — `src/pages/processeurs/partie-v/von-neumann.mdx`

> $$ \text{débit utile} \;\le\; \frac{\text{débit du bus}}{\text{instructions} + \text{données}} $$

**Problème** : Formule mal formée dans un <Resultat> badgé 🟢 fonde : le dénominateur « instructions + données » n'est défini nulle part comme grandeur. Lu naturellement (trafics), diviser un débit par une somme de trafics est dimensionnellement incohérent ; lu comme « nombre d'accès mémoire par instruction », la notation ne le dit pas. Une formule présentée comme déduction stricte doit être bien posée.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-v/von-neumann.mdx (ligne 88), remplacer « $$ \text{débit utile} \;\le\; \frac{\text{débit du bus}}{\text{instructions} + \text{données}} $$ » par « $$ \text{débit}_{\text{instructions}} \;+\; \text{débit}_{\text{données}} \;\le\; \text{débit du bus} $$ ». Cette forme est bien posée (somme des deux flux bornée par le débit du canal unique), conserve le style du cours et correspond exactement au texte du badge déjà en place (« Le débit total est borné par celui du bus ») — aucune autre modification nécessaire.

*Sources : https://en.wikipedia.org/wiki/Von_Neumann_architecture ; https://www.techtarget.com/whatis/definition/von-Neumann-bottleneck ; https://www.sigarch.org/the-von-neumann-bottleneck-revisited/ ; Backus, J. (1978). Can Programming Be Liberated from the von Neumann Style? CACM 21(8) — lecture Turing 1977, origine du terme « von Neumann bottleneck »*

#### 🟡 Mineur — `src/pages/processeurs/partie-i/bandes-energie.mdx`

> La **bande de valence** : celle issue des niveaux occupés par les électrons de valence (les plus externes). À basse température, elle est *pleine* — tous ses états sont occupés.

**Problème** : Généralisation excessive : ce n'est vrai que pour les isolants et semi-conducteurs. Dans un métal (Cu, Na…), la bande issue des électrons de valence est partiellement remplie — c'est précisément le cas (c) du chapitre suivant, qui contredit cette définition générale.

**Correction** : - La **bande de valence** : celle issue des niveaux occupés par les électrons de valence (les plus externes). Dans un isolant ou un semi-conducteur, elle est *pleine* à basse température — tous ses états sont occupés ; le cas du métal, où cette bande reste partiellement remplie, est traité au chapitre suivant.

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/bandes-energie.mdx (ligne 75, sans badge nuançant) ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/conducteurs-isolants.mdx (ligne 77 cas (c) métal « dernière bande partiellement remplie » ; ligne 88 tableau « Cuivre | bande partielle ») ; Kittel, Introduction to Solid State Physics — bande s à moitié remplie des métaux alcalins (Na) et du Cu ; Ashcroft & Mermin, Solid State Physics, ch. Band Structure of Metals*

#### 🟡 Mineur — `src/pages/processeurs/partie-i/conducteurs-isolants.mdx`

> la probabilité d'occuper un état d'énergie $\sim E_g$ au-dessus de $E_F$ varie comme $\exp\!\big(-(E - E_F)/kT\big)$, avec $E_F$ au milieu du gap, soit un écart $E_g/2$

**Problème** : Auto-contradictoire : le bas de la bande de conduction se trouve à E_g/2 au-dessus de E_F (E_F étant à mi-gap), pas à « ∼E_g au-dessus de E_F ». La phrase dit d'abord un écart E_g puis conclut E_g/2. La formule finale σ ∝ exp(−E_g/2kT) est correcte, mais la justification telle qu'écrite est incohérente.

**Correction** : Remplacer dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/conducteurs-isolants.mdx (ligne 97) : « la probabilité d'occuper un état d'énergie $\sim E_g$ au-dessus de $E_F$ varie comme $\exp\!\big(-(E - E_F)/kT\big)$, avec $E_F$ au milieu du gap, soit un écart $E_g/2$ » par « la probabilité d'occuper un état au bas de la bande de conduction, situé à $E_g/2$ au-dessus de $E_F$ (placé au milieu du gap), varie comme $\exp\!\big(-(E - E_F)/kT\big)$ »

*Sources : Kittel, Introduction to Solid State Physics, ch. 8 (intrinsic carrier concentration : n_i ∝ exp(−E_g/2kT), E_F à mi-gap) ; Ashcroft & Mermin, Solid State Physics, ch. 28 (semiconducteurs intrinsèques, niveau de Fermi à mi-gap à correction de masse effective près) ; Cohérence interne du fichier : l'application numérique ligne 103 utilise déjà E_g/2kT ≈ 21*

#### 🟡 Mineur — `src/pages/processeurs/partie-i/jonction-pn.mdx`

> et $k_B/q \approx 25{,}9\ \text{mV}$ à 300 K (soit $k_B T/q \approx 25{,}9\ \text{mV}$ à cette température)

**Problème** : Dimensionnellement faux : k_B/q ≈ 86,2 µV/K (volts par kelvin), pas 25,9 mV. C'est k_B·T/q qui vaut 25,9 mV à 300 K — la parenthèse redondante le dit correctement juste après, signe d'un reliquat d'édition. Tel quel, le premier membre enseigne une constante avec une mauvaise dimension.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/jonction-pn.mdx (ligne 60), remplacer « et $k_B/q \approx 25{,}9\ \text{mV}$ à 300 K (soit $k_B T/q \approx 25{,}9\ \text{mV}$ à cette température) » par « et $k_B T/q \approx 25{,}9\ \text{mV}$ à 300 K »

*Sources : CODATA/SI 2019 : k_B = 1,380649×10⁻²³ J/K et e = 1,602176634×10⁻¹⁹ C (valeurs exactes) ⇒ k_B/q = 86,1733 µV/K ; Calcul direct : k_B×300/q = 25,852 mV ≈ 25,9 mV (tension thermique à 300 K) ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/jonction-pn.mdx, encart « Pourquoi l'équilibre, et combien vaut la barrière », ligne 60*

#### 🟡 Mineur — `src/pages/processeurs/partie-i/silicium-dopage.mdx`

> de $10^{15}$ à $10^{19}$ atomes dopants par cm³, soit une impureté pour quelques millions à quelques milliers d'atomes de silicium

**Problème** : Calcul du ratio inexact à la borne basse : avec 5×10²² atomes de Si/cm³, un dopage de 10¹⁵ cm⁻³ donne 1 impureté pour 5×10⁷ atomes (dizaines de millions), pas « quelques millions ». La borne haute (10¹⁹ → 1 pour 5×10³) est correcte.

**Correction** : soit une impureté pour quelques dizaines de millions à quelques milliers d'atomes de silicium

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/silicium-dopage.mdx (ligne 25 : densité atomique du Si ≈ 5×10²² cm⁻³ ; ligne 92 : texte incriminé) ; Densité atomique du silicium ≈ 5,0×10²² atomes/cm³ (valeur standard, cf. Sze, Physics of Semiconductor Devices)*

#### 🟡 Mineur — `src/pages/processeurs/partie-i/silicium-dopage.mdx`

> La colonne IV du tableau périodique impose 4 électrons de valence ; la structure tétraédrique en découle.

**Problème** : Badge « fonde » (déduction stricte) trop fort pour la seconde moitié : la structure tétraédrique ne découle pas strictement des 4 électrons de valence. Le carbone (même colonne) cristallise de préférence en graphite (sp²), et l'étain est métallique (β-Sn) à température ambiante. Pour Si, le réseau diamant est la structure d'équilibre observée — un fait expérimental issu de l'énergétique, pas une déduction.

**Correction** : Dans /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/silicium-dopage.mdx (ligne 19), remplacer : <Badge niveau="fonde">La colonne IV du tableau périodique impose 4 électrons de valence ; la structure tétraédrique en découle.</Badge> par : <Badge niveau="fonde">La colonne IV du tableau périodique impose 4 électrons de valence.</Badge> <Badge niveau="idealise">Le silicium cristallise en réseau tétraédrique (structure diamant) : structure d'équilibre observée, cohérente avec ses 4 liaisons mais non déductible de la seule colonne — le carbone préfère le graphite, l'étain β est métallique.</Badge>

*Sources : Kittel, Introduction to Solid State Physics — structures cristallines de C, Si, Sn ; transition α–β de l'étain à 13,2 °C ; phase β-Sn du silicium sous pression (~11 GPa) ; CRC Handbook of Chemistry and Physics — le graphite est la forme stable du carbone à conditions ambiantes (ΔfG° du diamant ≈ +2,9 kJ/mol) ; /home/sfaurite/tmp/cours-hub/src/lib/fiability.ts:46 — définition du niveau « fonde » : « déduction logique stricte… ne pourrait pas être autrement » ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-i/silicium-dopage.mdx:61 — précédent maison de scission fonde/idealise dans le même fichier*

#### 🟡 Mineur — `src/pages/processeurs/partie-ii/abstraction-numerique.mdx`

> $$ A \gg 1 \text{ au basculement} \;\text{et}\; A \approx 0 \text{ aux plateaux} \;\Longrightarrow\; V_{out}\in\{\,\approx V_{OL},\ \approx V_{OH}\,\}. $$

**Problème** : L'implication, étiquetée 🟢 fonde, omet l'hypothèse énoncée juste avant dans la prose (« tant que l'entrée reste hors de la zone interdite »). Telle qu'écrite, elle est fausse : pour une entrée au point de basculement, V_out ≈ V_DD/2, valeur intermédiaire. La forte pente ne « projette » rien en statique ; c'est la restriction du domaine d'entrée qui garantit la sortie aux plateaux.

**Correction** : Remplacer la formule l.95 de /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-ii/abstraction-numerique.mdx par : $$ V_{in} \le V_{IL} \;\text{ou}\; V_{in} \ge V_{IH},\ \text{et}\ A \approx 0 \text{ aux plateaux} \;\Longrightarrow\; V_{out}\in\{\,\approx V_{OL},\ \approx V_{OH}\,\}. $$ et compléter le badge (l.97) : « Le gain A ≫ 1 au centre sert à rendre la zone interdite [V_IL, V_IH] étroite, donc les marges de bruit positives. »

*Sources : Rabaey, Chandrakasan, Nikolić, Digital Integrated Circuits, 2e éd., §1.3 (propriété régénérative ; V_IL/V_IH définis aux points de gain unité) ; Weste & Harris, CMOS VLSI Design, 4e éd., ch. 2 (caractéristique de transfert DC, marges de bruit) ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-ii/abstraction-numerique.mdx l.65 (style maison : hypothèse incluse dans la formule), l.91 (condition énoncée en prose), l.95-97 (formule et badge incriminés)*

#### 🟡 Mineur — `src/pages/processeurs/partie-ii/mosfet-structure.mdx`

> historiquement du métal, d’où le sigle **M**étal-**O**xyde-**S**emiconducteur ; aujourd’hui souvent du silicium polycristallin

**Problème** : Affirmation périmée pour le sujet du cours : depuis 2007 (Intel 45 nm, technologie high-k/metal gate, généralisée vers 28-22 nm chez les autres fondeurs), tous les processeurs avancés sont revenus à des grilles métalliques, sur un diélectrique high-k (HfO2) qui a remplacé le SiO2. Le polysilicium reste courant seulement sur les nœuds matures.

**Correction** : historiquement du métal, d'où le sigle **M**étal-**O**xyde-**S**emiconducteur ; puis du silicium polycristallin des années 1970 aux années 2000 ; les nœuds avancés sont revenus depuis ~2007 à une grille métallique, sur un isolant à haute permittivité (« high-k ») remplaçant le SiO₂

*Sources : Mistry et al., « A 45nm Logic Technology with High-k+Metal Gate Transistors… », IEDM 2007 (Intel Penryn, première production HKMG) ; Bohr, Chau, Ghani, Mistry, « The High-k Solution », IEEE Spectrum, octobre 2007 ; Adoption HKMG par les fondeurs à 32/28 nm (TSMC 28 nm gate-last, Samsung/GlobalFoundries gate-first, 2011-2012) puis sur tous les FinFET/GAA ; Contexte interne : /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-ii/mosfet-structure.mdx, lignes 37, 45 (badge limité aux dimensions) et 83 (fuites tunnel, motivation même du high-k)*

#### 🟡 Mineur — `src/pages/processeurs/partie-ii/mosfet-structure.mdx`

> Mais un semiconducteur en contient toujours quelques-uns, créés par agitation thermique. Le champ de la grille les **trie** : il les rassemble juste sous l’oxyde.

**Problème** : Mécanisme incomplet pour le dispositif décrit : dans un MOSFET, les électrons de la couche d'inversion proviennent essentiellement des îlots n+ source/drain adjacents (alimentation quasi instantanée), pas du tri des minoritaires thermiques. La génération thermique n'est le mécanisme dominant que pour un condensateur MOS isolé (et elle est lente, ~ms). Or l'encart explique l'inversion dans la structure avec îlots n+ déjà présents.

**Correction** : Dans l'encart « Pourquoi une couche d'inversion ? » (ligne 60), insérer après « il les rassemble juste sous l'oxyde. » : « Dans le transistor complet, ces électrons sont surtout fournis — presque instantanément — par les réservoirs $n^+$ de la source et du drain tout proches ; la génération thermique seule y parviendrait aussi, mais lentement (de l'ordre de la milliseconde). »

*Sources : S.M. Sze & K.K. Ng, Physics of Semiconductor Devices, 3e éd., ch. 4 (condensateur MIS : réponse des minoritaires limitée par la génération, C-V basse/haute fréquence) ; Y. Tsividis & C. McAndrew, Operation and Modeling of the MOS Transistor, 3e éd., ch. 2-3 (rôle des régions n+ comme source de la charge d'inversion) ; Y. Taur & T.H. Ning, Fundamentals of Modern VLSI Devices, §2.3 (MOS capacitor vs MOSFET : alimentation de la couche d'inversion) ; A.S. Sedra & K.C. Smith, Microelectronic Circuits, ch. MOSFET : les électrons du canal sont attirés depuis les régions n+ source/drain*

#### 🟡 Mineur — `src/pages/processeurs/partie-iii/algebre-boole.mdx`

> ni à décrire leurs combinaisons par l'algèbre inventée par George Boole en 1854

**Problème** : Boole a introduit son algèbre de la logique dès 1847 (The Mathematical Analysis of Logic) ; 1854 est la date de An Investigation of the Laws of Thought, qui la développe. Dater l'« invention » de 1854 est une approximation historiographique courante mais inexacte.

**Correction** : Remplacer « ni à décrire leurs combinaisons par l'algèbre inventée par George Boole en 1854 » par « ni à décrire leurs combinaisons par l'algèbre introduite par George Boole en 1847 et développée dans ses *Laws of Thought* (1854) »

*Sources : George Boole, The Mathematical Analysis of Logic (1847) ; George Boole, An Investigation of the Laws of Thought (1854) ; Stanford Encyclopedia of Philosophy, « The Algebra of Logic Tradition » / notice George Boole*

#### 🟡 Mineur — `src/pages/processeurs/partie-iii/binaire-complement.mdx`

> On aurait pu choisir l'octal ; l'hexadécimal gagne car $16 = 2^4$ tombe juste sur le quartet.

**Problème** : Justification bancale : l'octal « tombe juste » tout autant sur les triplets de bits (8 = 2³). La vraie raison de la victoire de l'hexadécimal est que l'octet de 8 bits se découpe exactement en deux quartets, alors que 8 n'est pas divisible par 3 (un octet en octal chevauche les frontières).

**Correction** : On aurait pu choisir l'octal ; l'hexadécimal gagne car l'octet de 8 bits se découpe exactement en deux quartets ($8 = 2 \times 4$), alors que $8$ n'est pas multiple de $3$ : en octal, les chiffres chevauchent la frontière des octets.

*Sources : Wikipedia, « Hexadecimal » (adoption liée à l'octet, IBM System/360, 1964) ; Wikipedia, « Octal » (usage sur mots de 12/24/36 bits : PDP-8, IBM 7090, PDP-10) ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iii/binaire-complement.mdx (octet défini ligne 62, citation ligne 154)*

#### 🟡 Mineur — `src/pages/processeurs/partie-iv/hierarchie-cache.mdx`

> <Badge niveau="fonde" slot="badge">Tension imposée par la physique : densité, distance de propagation finie et coût ne se contournent pas simultanément.

**Problème** : Le badge fonde présente le coût comme « imposé par la physique ». La distance de propagation et la densité relèvent bien de contraintes physiques, mais le coût (« petit et cher », « le silicium rapide se paie au millimètre carré ») est une réalité économique et industrielle, pas une loi physique vérifiée ni une déduction stricte.

**Correction** : <Badge niveau="fonde" slot="badge">Densité et distance de propagation finie sont imposées par la physique : rapide ⇒ petit, grand ⇒ lent. Le volet coût, lui, est un fait économique et industriel. On ne peut qu'arbitrer.</Badge>

*Sources : /home/sfaurite/tmp/cours-hub/src/pages/processeurs/methodologie.mdx (lignes 24-28 : définition stricte du niveau « fondé ») ; /home/sfaurite/tmp/cours-hub/src/pages/processeurs/partie-iv/hierarchie-cache.mdx (l. 18 « presque physique », l. 24 contrainte (3) coût, l. 30 badge incriminé, l. 52-54 Tournant physique vs empirique)*

---

## 2. Signalements non contre-expertisés (à confirmer)

La contre-expertise de ces signalements (cours réseaux, fin de processeurs) a été interrompue. Ils émanent du fact-check mais n'ont **pas** été validés par un second agent : à relire avant application. Sont listés ici les critiques/importants ; les mineurs sont en annexe.

#### 🟠 Important (non vérifié) — `src/pages/processeurs/partie-v/von-neumann.mdx`

> De ce choix découle, lui sans alternative, le résultat majeur : **une même machine peut exécuter n'importe quel programme**.

**Problème allégué** : Sur-affirmation badgée 🟢 fonde : l'universalité ne découle PAS strictement du programme enregistré seul. Il faut aussi un répertoire d'instructions suffisant (branchement conditionnel, comme le dit justement isa.mdx : « le pouvoir de calcul ne vient pas de la richesse de l'ISA, mais de la présence du branchement conditionnel »). De plus, une machine Harvard à programme enregistré est tout aussi universelle : ce n'est pas la mémoire unique qui force l'universalité.

**Correction proposée** : Ajouter l'hypothèse manquante : « une même machine peut exécuter n'importe quel programme, *pourvu que son répertoire d'instructions contienne un branchement conditionnel et des opérations de base suffisantes* (cf. chapitre ISA) ». Préciser que c'est le programme enregistré (présent aussi en Harvard) qui rend la machine reprogrammable, pas le choix de la mémoire unique. Ajuster le badge en conséquence.

#### 🟠 Important (non vérifié) — `src/pages/processeurs/partie-vi/bootloader.mdx`

> à cet instant, le maillon précédent **cesse d'exister** en tant qu'autorité — son code peut même être écrasé

**Problème allégué** : Faux pour le maillon firmware→bootloader, et badgé 🟢 fonde. Un bootloader BIOS dépend des services du BIOS (INT 13h pour lire le disque) ; un bootloader UEFI dépend des Boot Services jusqu'à ExitBootServices, et les Runtime Services + le SMM persistent même sous l'OS. Écraser le code du firmware à cet instant planterait la machine.

**Correction proposée** : Nuancer : « après le saut, le flot d'exécution appartient au suivant ; dans le modèle séquentiel pur, le précédent n'a plus d'autorité ». Ajouter (badge 🔴 implementation) que dans un PC réel le bootloader rappelle les services du firmware (INT 13h, Boot Services) — son code ne peut être écrasé qu'une fois ces services abandonnés (ExitBootServices), et SMM/Runtime Services survivent au-delà.

#### 🟠 Important (non vérifié) — `src/pages/processeurs/partie-vi/mode-protege-mmu.mdx`

> sans contrôle au niveau du silicium, aucune isolation logicielle ne peut être garantie, puisque le programme contrôlerait justement le logiciel censé le surveiller

**Problème allégué** : Badge 🟢 fonde (« nécessité logique ») mal calibré : l'isolation purement logicielle existe et est démontrée — bytecode vérifié (JVM, WebAssembly), software fault isolation, OS Singularity tournant entièrement en ring 0. La nécessité du contrôle matériel ne vaut que sous l'hypothèse « on exécute du code machine natif arbitraire non vérifié », non posée ici.

**Correction proposée** : Soit ajouter l'hypothèse explicite (« pour exécuter du code natif arbitraire, sans vérification préalable, le contrôle doit être matériel »), soit requalifier en 🔵 convention/choix d'architecture en mentionnant l'alternative de l'isolation par vérification logicielle (SFI, bytecode vérifié).

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-i/bruit-shannon.mdx`

> C'est exactement pourquoi les modems analogiques plafonnaient vers $33{,}6\ \mathrm{kbit/s}$ : ils butaient sur la borne de Shannon de la bande vocale.

**Problème allégué** : Incohérence interne : le texte vient de calculer C ≈ 31 kbit/s (B = 3100 Hz, SNR 30 dB), puis affirme que les modems plafonnaient à 33,6 kbit/s en butant sur cette borne — or 33,6 > 31 violerait la borne « infranchissable » qu'on vient d'établir. Atteindre 33,6 kbit/s sur 3100 Hz exige SNR ≥ 32,6 dB (vérifié numériquement) ; les bonnes lignes offraient plutôt 33–38 dB.

**Correction proposée** : Soit recalculer avec un SNR plus réaliste (35 dB → C ≈ 36 kbit/s, et 33,6 kbit/s « frôle » alors la borne), soit reformuler : « les modems V.34 à 33,6 kbit/s exploitaient des lignes un peu meilleures (SNR ~33–38 dB, C ≈ 34–39 kbit/s) et s'approchaient de la borne de Shannon de la bande vocale sans pouvoir la dépasser ».

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-i/bruit-shannon.mdx`

> une borne supérieure absolue au débit qu'on peut transmettre **avec un taux d'erreur arbitrairement faible** sur un canal bruité de bande $B$ et de rapport signal sur bruit $S/N$

**Problème allégué** : Hypothèse manquante : la formule C = B log2(1+S/N) vaut pour un bruit additif **blanc gaussien** (AWGN). Pour un bruit non gaussien de même puissance, la capacité est en général PLUS grande (le bruit gaussien est le pire cas à puissance fixée) : la formule n'est donc pas une borne supérieure pour tout « canal bruité ». Gênant dans un cours déductif qui revendique d'expliciter ses hypothèses.

**Correction proposée** : Préciser l'hypothèse dans l'énoncé ou le badge : « sur un canal à bruit additif blanc gaussien (AWGN) de bande B — hypothèse satisfaite par le bruit thermique introduit plus haut ». Optionnel : noter que le bruit gaussien est le cas le plus défavorable à puissance donnée, ce qui justifie son usage comme référence.

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-iv/routage.mdx`

> un opérateur qui possède `203.0.0.0/16` … `203.0.255.0/24` peut les **agréger** en une seule annonce `203.0.0.0/16`. Une ligne au lieu de 256.

**Problème allégué** : La borne de départ de la plage est fausse : la liste des 256 préfixes à agréger doit aller de 203.0.0.0/24 à 203.0.255.0/24. Telle qu'écrite, la plage commence par le /16 lui-même (l'agrégat), ce qui rend l'exemple incohérent : on ne peut pas « agréger » un /16 avec des /24 qu'il contient déjà pour obtenir ce même /16.

**Correction proposée** : Remplacer par : « un opérateur qui possède `203.0.0.0/24` … `203.0.255.0/24` peut les agréger en une seule annonce `203.0.0.0/16`. Une ligne au lieu de 256. »

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-iv/sous-reseaux.mdx`

> Si raccourcir le masque divise, **rallonger les zéros** réunit.

**Problème allégué** : Inversion : raccourcir le masque (moins de 1, préfixe plus court) et rallonger les zéros désignent la MÊME opération, qui agrège. C'est allonger le masque/préfixe qui divise, comme le dit d'ailleurs la section précédente (« Allonger le préfixe de 2 bits crée 4 sous-réseaux »). La phrase se contredit elle-même et contredit le reste du chapitre.

**Correction proposée** : « Si allonger le masque divise, rallonger les zéros (raccourcir le préfixe) réunit. » ou « Si allonger le préfixe divise, le raccourcir réunit. »

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-v/udp.mdx`

> En IPv4, il est facultatif ; en IPv6, il est obligatoire car IP ne protège plus les données.

**Problème allégué** : Les faits (facultatif en IPv4, obligatoire en IPv6) sont exacts, mais la justification est fausse : le checksum IPv4 ne couvre que l'en-tête IP, jamais les données. IPv4 n'a donc jamais « protégé les données ». La vraie raison (RFC 8200) : IPv6 supprime toute somme de contrôle d'en-tête, donc le checksum UDP (via le pseudo-en-tête) devient la seule protection, notamment des adresses.

**Correction proposée** : Remplacer par : « En IPv4, il est facultatif ; en IPv6, il est obligatoire, car IPv6 a supprimé la somme de contrôle d'en-tête IP : le checksum UDP (qui couvre aussi les adresses via le pseudo-en-tête) devient alors la seule protection contre une corruption de l'adressage. »

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-vi/qos-ouverture.mdx`

> Le seul vrai *théorème* de toute la pile vit tout en bas : Shannon fixe le plafond, et rien au-dessus ne peut le percer.

**Problème allégué** : Contredit le chapitre lui-même : 50 lignes plus haut, la loi de Little et la divergence M/M/1 sont badgées « theoreme », et la table de synthèse de la même page marque « Trame & CRC : norme + theoreme ». Le cours invoque aussi Nyquist comme théorème (échelle de fiabilité). Affirmer qu'il n'y a qu'un seul théorème dans la pile est faux dans le cadre épistémique du cours.

**Correction proposée** : Reformuler : « Les vrais théorèmes de la pile sont rares — Nyquist et Shannon tout en bas, les garanties algébriques du CRC, la loi de Little dans les files — et c'est Shannon qui fixe le plafond que rien au-dessus ne peut percer. »

#### 🟠 Important (non vérifié) — `src/pages/reseaux/partie-vi/tls-securite.mdx`

> c'est-à-dire qu'inverser l'opération sans la clé est calculatoirement infaisable. Cette infaisabilité repose sur des problèmes (factorisation, logarithme discret)

**Problème allégué** : La phrase porte sur les trois primitives postulées (chiffrement symétrique, asymétrique, hachage), mais seule la crypto asymétrique repose sur la factorisation/le log discret. La sécurité d'AES ou de SHA-2 ne se réduit à aucun problème de théorie des nombres : elle est empirique (résistance à la cryptanalyse). De plus, une fonction de hachage n'a pas de clé : « inverser sans la clé » ne s'y applique pas.

**Correction proposée** : Distinguer : « Pour l'asymétrique, cette infaisabilité repose sur des problèmes (factorisation, logarithme discret) que personne ne sait résoudre vite mais que personne n'a démontré durs ; pour le chiffrement symétrique et le hachage (sans clé), elle repose seulement sur des décennies de cryptanalyse infructueuse. »

---

## 3. Cohérence inter-cours

Vérification de la cohérence inter-cours sur les 8 cours du hub (181 chapitres MDX). Les faits partagés sont globalement très concordants : 13,6 eV (chimie partie-i ↔ cosmologie recombinaison, badges « experimental » / « observe » compatibles), constantes physiques numériquement identiques partout (c = 299 792 458 m/s ; h = 6,626×10⁻³⁴ J·s ; e = 1,602×10⁻¹⁹ C ; ε₀ = 8,854×10⁻¹² F/m ; k_B = 1,380649×10⁻²³ J/K ; G = 6,674×10⁻¹¹), masses de particules cohérentes (m_e c² = 0,511 MeV, m_p c² = 938 MeV entre physique partie-ii/iv/vi et cosmologie nucléosynthèse), η ≈ 6×10⁻¹⁰ et « un milliard de photons par baryon » identiques entre physique/asymetrie et cosmologie/baryogenese-nucleosynthese-recombinaison, T_CMB cohérente (2,7255 / 2,725 / 2,7 K selon la précision), âge 13,8 Ga, mécanisme des bandes (liant/antiliant, N niveaux → bande) cohérent entre processeurs partie-i et chimie partie-ii, imprimerie cohérente dans histoire (Gutenberg ~1454-1455, Jikji 1377, Bi Sheng ~1040, rôle d'« amplificateur » répété à l'identique dans imprimerie/reforme/renaissance, papier venu de Chine cohérent avec routes-echanges-eurasie). Les échelles de fiabilité sont compatibles sur les faits partagés (ex. composition sombre : physique « modelise » ↔ cosmologie « concordance » ; courbes de rotation : « etabli » ↔ « observe »). Cinq incohérences réelles ont été relevées, dont une importante : le statut épistémique des constantes h et e dans chimie/atome-hydrogene (« valeurs mesurées ») contredit frontalement physique (et le propre chapitre postulats-quantiques de chimie) qui les déclare « fixées par définition du SI 2019 » — point sensible dans un hub dont la pédagogie repose précisément sur le statut des énoncés. Le reste est mineur (arrondis 5/27/68 vs 4,9/26/69 ; 9 vs ≥10 ordres de grandeur pour le déficit baryogénétique du Modèle Standard ; « dizaines d'ordres de grandeur » vs 10¹²⁰ ; notation k vs k_B et 0,025 vs 0,026 eV). Constat structurel : il n'existe qu'UN seul lien croisé inter-cours dans tout le hub (chimie/liaison-ionique-metallique → processeurs/bandes-energie), alors qu'au moins une douzaine d'endroits réexpliquent ou utilisent ce qu'un autre cours démontre.

### Incohérences relevées

- **[important]** `src/pages/chimie/partie-i/atome-hydrogene.mdx`, `src/pages/chimie/partie-i/postulats-quantiques.mdx`, `src/pages/physique/methodologie.mdx`, `src/pages/physique/partie-iii/heisenberg.mdx`, `src/pages/physique/partie-iii/dualite-de-broglie.mdx`
  Statut épistémique des constantes fondamentales contradictoire. chimie/atome-hydrogene (ligne 64, encart « Reconstituer la valeur 13,6 eV ») qualifie m_e, e, ε₀ ET h de « constantes fondamentales (valeurs mesurées) ». Or physique/methodologie (l. 73-74, badge etabli : « Ces nombres définissent désormais les unités SI ; ils n'ont, par construction, aucune incertitude » pour c, h, e, N_A), physique/heisenberg (l. 40 : h « fixée par convention », badge etabli), physique/dualite-de-broglie (l. 68) et même chimie/postulats-quantiques (l. 36 : h « fixée par définition du SI depuis 2019 ») affirment que h et e sont exactes par définition depuis 2019. Le même fait reçoit donc deux statuts incompatibles entre cours (et au sein même du cours de chimie), dans un hub dont toute la pédagogie repose sur la distinction mesuré/défini/déduit.
  → *Dans l'encart de chimie/atome-hydrogene, distinguer : m_e et ε₀ sont mesurées ; e et h sont exactes par définition du SI depuis 2019 (formulation déjà utilisée dans chimie/postulats-quantiques et physique). Par exemple : « des constantes fondamentales — deux mesurées (m_e, ε₀), deux fixées par définition du SI depuis 2019 (e, h) ».*
- **[mineur]** `src/pages/physique/partie-vi/matiere-noire.mdx`, `src/pages/cosmologie/partie-ii/parametres-densite.mdx`, `src/pages/cosmologie/partie-v/matiere-noire.mdx`
  Composition de l'univers légèrement discordante. physique/matiere-noire (l. 110) affiche ≈5 % + ≈27 % + ≈68 % = 100 % (soit Ω_m ≈ 0,32, valeurs Planck 2015). cosmologie/parametres-densite (l. 83, 139) donne Ω_b ≈ 0,049, Ω_m ≈ 0,31, Ω_Λ ≈ 0,69 (donc matière noire ≈ 0,26, valeurs Planck 2018) ; cosmologie/matiere-noire (l. 81) confirme Ω_m ≈ 0,31 / Ω_b ≈ 0,049. Le lecteur qui passe d'un cours à l'autre trouve 27 % vs 26 % de matière noire et 68 % vs 69 % d'énergie noire, et un total matière 32 % vs 31 %.
  → *Harmoniser sur Planck 2018 dans physique/matiere-noire : ≈5 % matière ordinaire + ≈26 % matière noire + ≈69 % énergie noire (cohérent avec Ω_m ≈ 0,31 et Ω_Λ ≈ 0,69 du cours de cosmologie).*
- **[mineur]** `src/pages/physique/partie-vi/asymetrie.mdx`, `src/pages/cosmologie/partie-iv/baryogenese.mdx`
  Ampleur du déficit du Modèle Standard pour la baryogenèse discordante. physique/asymetrie (l. 73) : le MS prédit η ~ 10⁻¹⁸, « environ un milliard de fois trop petit » par rapport aux 6×10⁻¹⁰ observés (≈ 8-9 ordres de grandeur). cosmologie/baryogenese (l. 91) : la violation de CP du MS prédit un η « inférieur d'au moins dix ordres de grandeur » à la valeur observée (donc η ≲ 10⁻²⁰). Les deux chapitres traitent exactement le même fait avec des ordres de grandeur incompatibles (10⁻¹⁸ vs ≲10⁻²⁰).
  → *Aligner les deux formulations, par exemple « huit à dix ordres de grandeur trop petit selon les estimations (η_MS ~ 10⁻¹⁸ à 10⁻²⁰) » dans les deux chapitres, ou choisir une même valeur de référence.*
- **[mineur]** `src/pages/physique/partie-vi/matiere-noire.mdx`, `src/pages/cosmologie/partie-v/energie-noire.mdx`, `src/pages/cosmologie/partie-vi/questions-ouvertes.mdx`
  Problème de la constante cosmologique : ordre de grandeur du désaccord vague d'un côté, précis de l'autre. physique/matiere-noire (l. 96) parle d'un calcul faux « par un facteur gigantesque (des dizaines d'ordres de grandeur) », tandis que cosmologie/energie-noire (l. 103-105) et questions-ouvertes (l. 53) donnent « 10¹²⁰ fois plus grande » / « cent vingt ordres de grandeur (10¹²⁰ à 10¹²³) ». « Des dizaines » laisse imaginer 20-60 ordres, très en deçà des ~120 affirmés (et badgés) dans le cours de cosmologie.
  → *Dans physique/matiere-noire, écrire « par environ 120 ordres de grandeur » (ou « ~10¹²⁰ ») pour coller au chiffre établi dans cosmologie/energie-noire.*
- **[mineur]** `src/pages/processeurs/partie-i/conducteurs-isolants.mdx`, `src/pages/processeurs/partie-i/bandes-energie.mdx`, `src/pages/reseaux/partie-i/bruit-shannon.mdx`
  Notation et arrondi de la constante de Boltzmann non harmonisés. processeurs/conducteurs-isolants (l. 101) note la constante « k » (k ≈ 8,62×10⁻⁵ eV/K) et donne kT ≈ 0,026 eV à 300 K, alors que processeurs/bandes-energie (l. 55) donne k_B T ≈ 0,025 eV à 300 K, et que tout le reste du hub (reseaux/bruit-shannon, cosmologie, chimie, processeurs/jonction-pn) note k_B. Même cours, même grandeur, deux symboles et deux arrondis (la valeur exacte à 300 K est 0,02585 eV).
  → *Uniformiser sur k_B partout (renommer k en k_B dans conducteurs-isolants) et choisir un arrondi unique à 300 K (par ex. k_B T ≈ 0,026 eV ou ≈ 25,9 meV, déjà utilisé dans jonction-pn) dans les deux chapitres de processeurs.*

### Liens croisés manquants (occasions de maillage du hub)

- cosmologie/partie-iii/recombinaison-cmb.mdx utilise E_I = 13,6 eV et le piège k_B T : un Prereq vers /chimie/partie-i/atome-hydrogene (où E_n = −13,6/n² eV est déduit et la valeur reconstituée depuis les constantes) renforcerait le faisceau inter-cours.
- processeurs/partie-i/atomes-niveaux.mdx pose la quantification et Pauli en socle « sans les redémontrer » et réutilise la même analogie de la corde de guitare : lien naturel vers /chimie/partie-i/postulats-quantiques (où la quantification d'une onde confinée est déduite) et /physique/partie-iii/dualite-de-broglie.
- processeurs/partie-i/bandes-energie.mdx décrit liant/antiliant « type H₂ » sans pointer vers /chimie/partie-ii/orbitales-moleculaires qui le démontre (LCAO, ψ_A ± ψ_B) ; le lien inverse chimie → processeurs existe déjà (le seul lien inter-cours du hub), le lien retour manque.
- physique/partie-vi/matiere-noire.mdx refait la démonstration v(r) = √(GM/r) et le récit supernovae 1998 que cosmologie/partie-v/matiere-noire.mdx et energie-noire.mdx développent en détail (amas du Boulet, MOND, Ω) : aucun lien dans les deux sens.
- physique/partie-vi/asymetrie.mdx et cosmologie/partie-iv/baryogenese.mdx traitent le même η ≈ 6×10⁻¹⁰ et le même échec du Modèle Standard (Sakharov) sans se référencer mutuellement.
- cosmologie/partie-i/relativite-cadre.mdx admet la relativité « sans la construire » alors que le cours de physique la construit (partie-i/postulats à minkowski pour la restreinte, partie-v/gravitation pour la RG, mêmes tests : Mercure, Eddington 1919, LIGO 2015) : un lien éviterait la double explication.
- ia/partie-i/regression-logistique.mdx et ia/partie-ii/fonction-de-perte.mdx introduisent l'entropie croisée −log p sans lien vers /reseaux/partie-i/bit-information qui démontre la « surprise » −log₂ p et l'entropie de Shannon.
- chimie/partie-iv/entropie-second-principe.mdx (S = k_B ln Ω) et reseaux/partie-i/bit-information.mdx (H = −Σ p log₂ p) : le pont Boltzmann–Shannon (même structure logarithmique, comptage de micro-états vs incertitude moyenne) n'est exploité dans aucun des deux sens.
- reseaux/partie-i/bruit-shannon.mdx fonde le bruit thermique sur k_B T sans lien vers /chimie/partie-iii/etats-matiere-transitions (énergie d'agitation k_B T par degré de liberté) ni /processeurs/partie-i/conducteurs-isolants (même k_B T ≈ 25 meV à 300 K).
- processeurs/partie-i/conducteurs-isolants.mdx (conductivité en e^(−E_g/2kT)) et chimie/partie-v/cinetique-chimique.mdx (Arrhenius e^(−E_a/RT)) utilisent le même facteur de Boltzmann pour franchir une barrière : aucun renvoi croisé.
- cosmologie/partie-iii (univers-chaud, recombinaison : corps noir, photons ionisants) ne pointe pas vers /physique/partie-iii/echec-classique qui établit le corps noir et le photon (h ν).
- cosmologie/partie-iii/nucleosynthese.mdx manipule (m_n − m_p)c² = 1,293 MeV et les masses en MeV sans lien vers /physique/partie-ii/e-mc2 ou /physique/partie-ii/masse-energie-confinee qui établissent et expliquent cette équivalence masse-énergie.

---

## 4. Propositions d'améliorations, par cours

### Physique

**Bilan** : Cours remarquable : la promesse déductive est réellement tenue dans les parties I-III (démonstrations ligne à ligne complètes, contradiction galiléenne explicitée), et les ~200 badges sont finement calibrés (fait mesuré vs interprétation, jusqu'à deux badges sur un même résultat). Trois faiblesses : la comptabilité des hypothèses s'étiole après la partie III (pas d'Hypotheses en II/V/VI, pas de Tournant pour la relativité générale), l'interactivité s'effondre en V-VI (0 vidéo, presque aucun composant), et le cours vit en vase clos dans le hub (aucun lien croisé, alors que la cosmologie recouvre la partie VI). Corrections ciblées, pas de refonte.

**Points forts** :
- Démonstrations réellement complètes et accessibles dès la Terminale : horloge à lumière, élimination de γ dans E²=(mc²)²+(pc)², seuil 2mₑc², rapport 10³⁶ — chaque étape justifiée, avec rappels lycée systématiques (Pythagore, développement limité).
- Honnêteté épistémique exemplaire : badges nuancés distinguant observation et interprétation (matière noire : courbes 🟢 mais masse manquante 🔵 ; Higgs : v=246 GeV établi, le champ 🔵), Tournants explicites aux entrées du quantique et du Modèle Standard, et une page méthodologie qui assume « on ne déduit pas tout des deux postulats ».
- Vulgarisation techniquement juste là où presque tout le monde se trompe : c n'est pas « la vitesse de la lumière », 99 % de la masse du proton ne vient pas du Higgs, deux « forces fortes » distinguées (fondamentale vs résiduelle), l'image de la mélasse explicitement corrigée.
- Architecture solide : navigation dérivée d'une source unique (_physique.ts), tous les liens internes vérifiés valides, liens Prereq systématiques qui matérialisent le graphe de dépendances, glossaire et index des symboles reliés aux pages de démonstration.

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | fiabilite | **Tenir la promesse des encadrés « Hypothèses » (parties II, V, VI)** — comment-lire.mdx promet un encadré d'hypothèses « au début de chaque grande partie », mais seuls partie-i (3 chapitres) et echec-classique en ont. Ajouter : en Partie II (quantite-mouvement.mdx pose « on garde la conservation de p, on corrige l'outil » sans la badger comme exigence posée), en Partie V (le principe de jauge, vraie hypothèse fondatrice, est introduit dans electromagnetisme.mdx sans <Hypotheses> ni <Tournant>), et en tête de Partie VI. Sinon, reformuler la promesse. |
| 🔺 Haute | fiabilite | **<Tournant> manquant pour la relativité générale** — gravitation.mdx (partie-v) fait entrer la relativité générale — un changement de cadre majeur, non déduit des deux postulats : le principe d'équivalence est une hypothèse nouvelle, reléguée dans un encart « plus loin ». Ajouter un bandeau <Tournant> + un <Hypotheses> (principe d'équivalence, ancré sur Apollo 15/Eötvös), exactement comme le site le fait pour le quantique (echec-classique) et le Modèle Standard (vue-ensemble). C'est le seul changement de cadre non signalé. |
| 🔺 Haute | contenu | **Chapitre manquant : l'antimatière (Dirac)** — synthese.mdx affirme « marier la relativité avec la mécanique quantique force l'existence des champs et de l'antimatière », mais cette déduction n'est démontrée nulle part — fermions.mdx mentionne l'antiparticule en passant. Ajouter un chapitre en fin de Partie III : E²=(mc²)²+(pc)² admet des solutions d'énergie négative ⇒ prédiction du positron (1928) ⇒ observation (Anderson, 1932). Tout l'outillage existe déjà (e-mc2, champs-quantiques) ; c'est LE chaînon déductif manquant du récit. |
| 🔺 Haute | pedagogie | **Aucune auto-évaluation dans tout le cours** — Aucun quiz, exercice ou question d'application dans les 31 chapitres. Créer un composant QCM (3-5 questions/chapitre, feedback renvoyant vers le Prereq concerné) ou un encart « À vous de jouer » : calculer γ d'un muon cosmique, le seuil de création de paires, la portée de la force faible depuis m_W, le rapport F_em/F_grav. Commencer par les parties I-II, dont les calculs s'y prêtent parfaitement, puis des questions conceptuelles (vrai/faux badgé) pour IV-VI. |
| 🔺 Haute | interactif | **Réutiliser RotationCurve et la vidéo courbe-rotation dans matiere-noire** — matiere-noire.mdx démontre v(r)=√(GM(r)/r) puis décrit la courbe plate… en texte et tableau statique. Le composant interactif RotationCurve.astro et la vidéo Manim courbe-rotation.mp4 existent déjà (produits pour la cosmologie) : les insérer après l'encart calcul pour laisser le lecteur comparer prédiction képlérienne et courbe observée. Gain immédiat, coût quasi nul. |
| ▪ Moyenne | interactif | **Vidéos Manim absentes des parties V et VI** — Les 6 vidéos du cours (light-clock, light-cone, lorentz-transform, energy-triangle, de-broglie, higgs-field) se concentrent sur les parties I-IV ; zéro en V-VI. Prioriser trois scènes : le tube de flux qui se tend et casse en paire quark-antiquark (interaction-forte, l'« élastique » du texte), le potentiel en chapeau mexicain et la brisure électrofaible (electrofaible, complète l'image de la bouteille de vin de higgs.mdx), et la comparaison des portées/intensités des 4 forces (gravitation). |
| ▪ Moyenne | interactif | **Interactifs manquants : corps noir (echec-classique) et chiralité** — echec-classique.mdx, chapitre charnière (le Tournant quantique), n'a aucun composant : ajouter un explorateur du spectre du corps noir (curseur température, courbe Rayleigh-Jeans divergente vs courbe de Planck) en adaptant BlackbodyCMB.client.ts existant. chiralite.mdx (5 encarts, 0 interactif, 0 figure) gagnerait un widget spin/hélicité gaucher-droitier — concept réputé abstrait, central pour le Higgs. |
| ▪ Moyenne | structure | **Aucun lien croisé vers les autres cours du hub** — Le hub compte 8 cours mais physique ne pointe vers aucun (et réciproquement). Ajouter : matiere-noire → cours cosmologie (expansion, CMB, courbes de rotation, énergie noire — fort recouvrement), gravitation → cosmologie (Friedmann, ondes gravitationnelles), vue-ensemble (analogie Mendeleïev) → chimie (tableau périodique), echec-classique → chimie (raies spectrales, vidéo chimie-saut-quantique existante). Un encart « Voir aussi dans le hub » suffirait. |
| ▪ Moyenne | coherence | **Teaser cassé en fin de matiere-noire et lien hiérarchie erroné** — matiere-noire.mdx s'achève sur « l'objet du prochain chapitre, où nous regarderons comment on espère, enfin, percer le noir » — or le chapitre suivant (nav _physique.ts) est l'asymétrie matière/antimatière. Corriger le teaser ou ajouter une section « comment on cherche » (détection directe, axions). Aussi : gravitation.mdx l.109 lie « le problème de hiérarchie » vers /partie-vi/gravite-quantique alors que /partie-vi/hierarchie existe et est le bon renvoi. |
| ▪ Moyenne | contenu | **Lacunes du glossaire et de l'index des symboles** — Manquent au glossaire (53 entrées) : brisure spontanée de symétrie, couplage de Yukawa, liberté asymptotique, chromodynamique quantique, matrice CKM, violation CP, constante cosmologique, WIMP/axion, particule virtuelle, principe d'équivalence, ondes gravitationnelles, positron. Dans symbols.ts : G (pourtant utilisé dans gravitation et matiere-noire), k_B (équipartition, echec-classique), α_s, Λ, ε₀ et la valeur de fond du Higgs v ≈ 246 GeV (higgs.mdx). |
| ▫ Basse | fiabilite | **Calibration ponctuelle de quelques badges** — Deux ajustements : (1) lorentz-gamma badge le Resultat « Facteur de Lorentz » en 🟢 « définition mathématique » — une définition ne se vérifie pas ; reformuler pour badger la prédiction qui en découle. (2) vue-ensemble badge la dichotomie fermions/bosons en 🟢 alors que le théorème spin-statistique relève du cadre TQC (🔵) — distinguer le fait observé (exclusion de Pauli, laser) de son explication théorique, comme le site le fait si bien ailleurs. |
| ▫ Basse | pedagogie | **Récapitulatif de la chaîne d'hypothèses en tête de Partie VI** — Avant l'inventaire des problèmes ouverts (saveurs.mdx), ajouter une mini-carte « où en est la déduction » : 2 postulats (I) → conservation posée (II) → 4 hypothèses quantiques (III) → tableau du MS dicté par l'expérience (IV) → principe de jauge (V). Le lecteur visualiserait d'un coup tout ce qui a été admis vs démontré — l'aboutissement naturel de la promesse du site, que la synthèse finale ne fait qu'en prose. |

### Mathématiques

**Bilan** : Un cours embryonnaire (4 chapitres contre 24–33 ailleurs dans le hub) mais d'une qualité déductive remarquable : Gödel posé d'emblée, récurrence démontrée et non admise, preuves complètes au ε près. Trois failles principales : la chaîne ∅→ℕ→ℤ→ℚ→ℝ est revendiquée mais ℤ et ℚ ne sont jamais construits (et la multiplication des coupures est badgée 🟢 sans définition) ; des résidus du gabarit physique trahissent le copier-collé (« chapitres de physique », accroche de méthodologie) ; le badge 🔴 n'est jamais exercé. Aucun exercice, aucun lien inter-cours, et une fin en promesse non tenue.

**Points forts** :
- Calibration épistémique fine des badges : l'indépendance d'AC badgée 🟢 (théorème de Gödel/Cohen) distinguée de son adoption badgée 🔵 (choix), et la cohérence de ZF honnêtement en 🟡 conjecturé.
- Discipline déductive exemplaire sur ℕ et ℝ : la récurrence démontrée comme théorème (minimalité de ℕ), l'absence de maximum de A_√2 prouvée avec le ε explicite, la complétude de ℝ par réunion de coupures — rien d'escamoté.
- Interactifs bien placés au cœur conceptuel : VonNeumannOrdinals et la vidéo Manim build-naturals pour « chaque entier est l'ensemble de ses prédécesseurs », DedekindCut pour « voir le point naître du vide ».
- Pages d'intro de haut niveau : la méthodologie assume que l'échelle maths classe des statuts logiques (🔵 n'est pas « moins sûr » que 🟢) et que tout « démontré » est relatif à ZF — l'aveu fondateur est explicite.

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | contenu | **Construire réellement ℤ et ℚ (chapitre manquant)** — reels-dedekind.mdx affirme « nous avons construit ℕ, puis ℤ, puis ℚ » mais aucun chapitre ne le fait : la chaîne déductive est rompue en son milieu. Ajouter en partie-ii un chapitre « De ℕ à ℚ » : théorème de récursion (pour définir + et × sur ℕ), relations d'équivalence et quotients, ℤ = ℕ²/∼ (même différence), ℚ = ℤ×ℤ*/∼ (même rapport), division euclidienne et gcd — utilisés sans preuve par la démonstration de l'irrationalité de √2. |
| 🔺 Haute | contenu | **Étendre le cours : cardinalité, infinis, puis analyse** — 4 chapitres contre 24–33 pour les autres cours du hub. Ajouter une Partie III « Les infinis » : fonctions/bijections, dénombrabilité de ℚ, diagonale de Cantor (ℝ non dénombrable), théorème de Cantor, hypothèse du continu badgée 🔴, Zorn/AC. Puis une Partie IV « L'analyse » (suites, limites, continuité, valeurs intermédiaires via la borne sup) — reels-dedekind promet déjà « limites, continuité, dérivées — sujet du prochain chapitre » qui n'existe pas. |
| 🔺 Haute | fiabilite | **Déclarer la dette déductive de reels-dedekind** — Le badge 🟢 « (A_√2)² = 2 pour la multiplication des coupures » (l. 145) s'appuie sur une multiplication jamais définie ; seules l'ordre et la borne sup sont construits. De même, « Tout fut déduit des axiomes ZF » surclame (gcd, division euclidienne, arithmétique de ℕ non établis). Ajouter un encart 🔬 « ce qu'on n'a pas détaillé » listant les opérations sur les coupures (cas des signes) et reformuler les badges : la promesse du cours est précisément de ne rien passer en contrebande. |
| 🔺 Haute | coherence | **Purger les résidus du cours de physique** — Trois copier-collés trahissent le gabarit physique : (1) reels-dedekind l. 196 « Contrairement aux chapitres de physique de la Partie I » — la Partie I de CE cours est la méthode axiomatique ; (2) comment-lire décrit le Tournant comme « hypothèses imposées par l'expérience, ancrées dans des faits » — faux en maths, où un tournant pose des axiomes par choix ; (3) _maths.ts l. 31 : l'accroche de Méthodologie cite l'échelle physique « établi, modélisé, plausible, ouvert » au lieu de démontré/admis/conjecturé/indécidable. |
| ▪ Moyenne | fiabilite | **Activer le badge 🔴 avec l'hypothèse du continu** — Le niveau 🔴 indécidable n'apparaît dans aucun chapitre (0 usage hors pages d'intro), alors que l'échelle le présente avec l'hypothèse du continu comme exemple canonique. Ajouter dans ensembles-zf (à la suite de l'encart sur l'indépendance d'AC, qui pose déjà Gödel/Cohen et le forcing) un encart « L'hypothèse du continu » avec un Resultat badgé 🔴 — en attendant le futur chapitre sur les cardinaux qui lui donnerait tout son sens. |
| ▪ Moyenne | structure | **Corriger la fin en cul-de-sac du dernier chapitre** — reels-dedekind s'achève sur « limites, continuité, dérivées — c'est le sujet du prochain chapitre », mais le bouton « suivant » mène au glossaire. Tant que la partie analyse n'existe pas, remplacer par une conclusion honnête (« ce sera l'objet d'une future partie ») ou un renvoi vers les annexes — la promesse non tenue contredit le contrat de lecture du site. |
| ▪ Moyenne | contenu | **Combler le glossaire et l'index des symboles** — Manquent au glossaire : axiome du choix / ZFC, paradoxe de Russell, couple de Kuratowski, produit cartésien, indécidable, hypothèse du continu, borne supérieure, complétude (ordre), entier relatif ℤ, lemme/corollaire, modèle, schéma d'axiomes. L'entrée ℚ évoque « suites de Cauchy » jamais introduites dans le cours. Aux symboles : ℤ, 𝒫(E), ∉, (a,b), A×B, ∃!, ⋃E, sup, ⟺, ∧/∨/¬. Garder le motif existant : chaque entrée pointe vers son chapitre via « voir ». |
| ▪ Moyenne | pedagogie | **Ajouter une auto-évaluation par chapitre** — Aucun exercice ni quiz dans tout le cours (ni composant dédié dans le hub). Ajouter en fin de chapitre un encart « À vous de jouer » avec 2–3 exercices guidés et solution dépliable : prouver que S est injective et que 0 n'est successeur de personne (entiers-naturels), construire A_√3 et vérifier les 3 clauses (reels-dedekind), montrer {a}={b} ⇒ a=b par extensionnalité (ensembles-zf), identifier le type d'un énoncé donné — axiome, définition, théorème (methode-axiomatique). |
| ▪ Moyenne | interactif | **Interactif et Manim pour la Partie I (zéro actuellement)** — Toute l'interactivité est en partie-ii (VonNeumannOrdinals, DedekindCut, vidéo build-naturals) ; la partie-i n'a rien. Ajouter : un explorable « paradoxe de Russell » (cocher des ensembles, voir R∈R osciller) dans ensembles-zf ; une vidéo Manim « la machine à théorèmes » (axiomes → règles d'inférence → théorèmes, avec l'énoncé G hors d'atteinte) pour methode-axiomatique. Et une scène Manim « coupure qui fait naître √2 » en écho au composant DedekindCut. |
| ▫ Basse | structure | **Tisser des liens croisés avec les autres cours du hub** — Aucun lien n'entre ni ne sort du cours maths (vérifié par grep). Ajouter : depuis methode-axiomatique, un contrepoint vers les postulats du cours de physique (axiome choisi vs hypothèse imposée par l'expérience) ; depuis ensembles-zf/Gödel vers le cours IA (théorème d'approximation universelle = vrai théorème, badge 🟢 du preset IA) et vers réseaux (théorème de Shannon). En retour, faire pointer ces cours vers /maths/partie-i/methode-axiomatique quand ils invoquent « démontré ». |
| ▫ Basse | pedagogie | **Relier l'esquisse de √2 (ch. 1) à la preuve complète (ch. 4)** — La preuve de l'irrationalité de √2 apparaît deux fois : esquisse dans methode-axiomatique (badge honnête sur son statut), version complète dans reels-dedekind. Ajouter dans l'esquisse un lien « preuve complète, une fois ℚ disponible » vers /maths/partie-ii/reels-dedekind, et dans le ch. 4 un rappel « déjà esquissée au ch. 1 ». Au passage : l'encart « les axiomes de Peano sont satisfaits » est typé 📐 rappel alors que c'est du contenu nouveau — le passer en 🔬 plusloin. |
| ▫ Basse | coherence | **Corriger le libellé bancal du badge indécidable** — Dans methodologie.mdx (l. 32) et comment-lire.mdx (l. 82), le tooltip dit « Démontré ni prouvable ni réfutable dans le cadre » — phrase agrammaticale. Écrire « On a démontré qu'il n'est ni prouvable ni réfutable dans le cadre adopté ». C'est le texte qui définit le niveau le plus subtil de l'échelle : il doit être impeccable. |

### Chimie

**Bilan** : Cours d'une qualité épistémique rare : la chaîne « atome quantique → orbitales → liaison → thermo → réactivité » est réellement tenue, les Prereq maillent les 23 chapitres (tous les liens vérifiés résolvent) et l'échelle de fiabilité est appliquée avec finesse, jusqu'à distinguer forme 🟢 et valeur 🔵 d'une même équation. Trois manques principaux : aucun chapitre « solutions/solubilité » alors que la partie V se joue en solution, aucune auto-évaluation, et une dérive du badge 🟢 vers « déduit mathématiquement » sur la thermo. Quatre chapitres pivots restent sans composant interactif.

**Points forts** :
- Honnêteté épistémique exemplaire : Tournants explicites aux changements de cadre (adoption de la MQ, octet, hybridation, flèches courbes = bookkeeping), et badges nuancés au sein d'un même résultat (forme −1/n² 🟢 vs 13,6 eV 🔵).
- Chaîne déductive effective, pas déclarative : démonstrations ligne à ligne (ΔSunivers≥0 → ΔG≤0, ΔrG°=−RT ln K, pH=pKa), et le dernier chapitre referme le fil rouge jusqu'au premier postulat.
- Douze composants interactifs dédiés bien placés aux moments décisifs (config électronique avec exceptions Cr/Cu, diagramme OM pour O₂, titrage, VSEPR), plus 4 vidéos Manim ciblées.
- Appareil de référence soigné : glossaire avec renvoi « voir » vers la page d'introduction de chaque terme, index des symboles précisant le statut épistémique de chaque valeur (définie / mesurée / tabulée d'un modèle).

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | contenu | **Ajouter un chapitre « Solutions, dissolution, solubilité »** — La partie V s'intitule « réactions en solution » mais rien ne construit la solution aqueuse : solvatation, concentration, électrolytes, activité (introduite en 3 lignes dans equilibre-chimique), solubilité et produit de solubilité Ks sont absents. Ajouter un chapitre en tête de partie V (ou fin de III), déduit des interactions intermoléculaires (« qui se ressemble s'assemble » → solvatation → activité), avant acide-base qui saute directement à [H3O+]. |
| 🔺 Haute | fiabilite | **Recalibrer le badge 🟢 sur les déductions thermodynamiques** — L'échelle définit 🟢 = « découle des principes quantiques et lois de conservation ». Or ΔrG°=−RT ln K, Q<K⇒sens direct (equilibre-chimique), pH=pKa (acide-base) et « le catalyseur ne change pas ΔG » (cinetique) sont badgés 🟢, tandis que ΔG<0, déduit du même second principe, est badgé 🔵 (enthalpie-libre l.64). Trancher : soit étendre explicitement 🟢 à « déduction exacte depuis principes admis » dans methodologie.mdx, soit rebadger ces résultats thermo en 🔵. Incohérence visible pour un lecteur attentif. |
| 🔺 Haute | interactif | **Composants interactifs pour équilibre, redox et diagramme de phases** — Quatre chapitres pivots n'ont aucun composant : equilibre-chimique (simulateur Q vs K avec perturbations Le Chatelier — le piège du gaz inerte s'y prêterait), oxydoreduction (pile + échelle des E° + curseur Nernst), etats-matiere-transitions (diagramme P–T cliquable avec point triple et anomalie de l'eau), interactions-intermoleculaires (explorateur de points d'ébullition vs masse/polarité/liaison H). Prioriser équilibre et redox, cœur de la partie V. |
| 🔺 Haute | pedagogie | **Créer une auto-évaluation par chapitre** — Aucun exercice ni QCM dans tout le cours (et aucun composant Quiz dans le hub). Ajouter un bloc « À vous » en fin de chapitre : 3 à 5 questions auto-corrigées qui testent précisément la chaîne déductive (ex. : « ce résultat est-il 🟢 ou 🟡 ? », écrire une config électronique, prédire une géométrie VSEPR, signe de ΔG selon T). Le format « deviner le badge » renforcerait l'objectif épistémique unique du cours. Commencer par structure-electronique, Lewis, enthalpie-libre, equilibre. |
| ▪ Moyenne | contenu | **Étoffer la partie VI : stéréochimie et familles de réactions** — La partie VI reste une « ouverture » : la chiralité et les énantiomères n'existent qu'en alias du glossaire, et aucune famille de réactions (substitution/élimination/addition, SN1 vs SN2) n'est traitée alors que la vidéo Manim SN2 et la section « preuves cinétiques et stéréochimiques » de mecanismes-reactionnels les appellent. Ajouter un chapitre « Stéréochimie : la molécule dans le miroir » et/ou « SN1/SN2 : deux mécanismes départagés par l'expérience », démonstration idéale de la méthode du cours. |
| ▪ Moyenne | fiabilite | **Hypotheses/Tournant manquants à plusieurs débuts de chaîne** — ecrantage-charge-effective n'a ni <Hypotheses> ni <Tournant> alors que Slater est une recette empirique fondant toute la partie II ; acide-base introduit le cadre de Brønsted (changement de cadre type Tournant) avec un simple badge ; cinetique-chimique pose la loi de vitesse v=k[A]^a[B]^b sans encadré ; equilibre-chimique « admet » ΔrG=ΔrG°+RT ln Q au détour d'un encart calcul. Ajouter un <Tournant> ou <Hypotheses> explicite à ces quatre endroits, comme le font déjà Lewis et structure-electronique. |
| ▪ Moyenne | interactif | **Vidéo Manim : interférence liante/antiliante (LCAO)** — Seules 4 vidéos Manim couvrent le cours, aucune en partie II alors que orbitales-moleculaires est le sommet déductif (O₂ paramagnétique qui départage Lewis et OM). Une animation « deux ondes ψA±ψB : la densité s'accumule ou s'évide entre les noyaux, le niveau descend ou monte » est le candidat idéal — c'est exactement le type de phénomène continu que Manim rend mieux qu'un texte. Second candidat : le remplissage micro-états/entropie (S=k ln Ω) en complément du composant existant. |
| ▪ Moyenne | structure | **Lien croisé vers le cours de physique (Pauli, spin, fermions)** — Un seul lien sortant vers le hub (bandes d'énergie → processeurs, dans liaison-ionique-metallique). Or le hub contient un cours de physique qui traite fermions et spin (physique/partie-iv/fermions mentionne déjà la chimie). Ajouter un Prereq « ce principe est approfondi dans le cours de physique » dans postulats-quantiques (postulat 4) et structure-electronique (Tournant Pauli), et un lien entropie/second principe ↔ cosmologie ou processeurs si pertinent. Cela matérialise la promesse « hub ». |
| ▪ Moyenne | pedagogie | **Poser les prérequis implicites : gaz parfait et logarithme** — PV=nRT n'est jamais énoncé ni badgé, alors qu'il est utilisé en creux (activités des gaz, Le Chatelier à pression, rapport kBT/cohésion) ; le logarithme est massivement employé (pH, ln K, Arrhenius, Nernst) sans l'encart « Rappel » promis par comment-lire (« ce qu'est un logarithme »). Ajouter un encart Rappel log dans acide-base ou equilibre-chimique, et un encart badgé 🟡 « le gaz parfait : un modèle limite » dans etats-matiere-transitions. |
| ▫ Basse | contenu | **Compléter le glossaire (~8 entrées)** — Manquent : mole/masse molaire (définie seulement dans comment-lire), activité, solvatation/solubilité, avancement/stœchiométrie, équation de Nernst, polarisabilité, forces de London (noyées en alias de « liaison hydrogène »), pile/électrolyse. Ajouter ces entrées avec leur champ « voir » ; séparer London/Debye/Keesom de la liaison hydrogène pour refléter la hiérarchie présentée dans interactions-intermoleculaires. |
| ▫ Basse | coherence | **Corriger le Badge orphelin et les références de chapitre en dur** — Dans equilibre-chimique.mdx l.94, un <Badge niveau="quantique" slot="badge"> se trouve en plein paragraphe, hors de tout <Resultat> : l'attribut slot y est inopérant (à retirer). Dans mecanismes-reactionnels.mdx, « (octet, ch. 7) » (l.52) et « ch. 18 » (l.72, 74) référencent des numéros en dur, fragiles si la nav change : remplacer par des liens <Prereq> vers liaison-covalente-lewis et cinetique-chimique, comme partout ailleurs. |

### Cosmologie

**Bilan** : Cours d'une qualité remarquable : chaîne déductive rigoureuse, badges finement calibrés, Tournants honnêtes à chaque changement de cadre, démonstrations ligne à ligne complètes. Les défauts sont périphériques : six transitions de fin de chapitre héritées d'un ancien ordre chronologique, trois Prereq mal ciblés, parties IV et VI sans aucun interactif ni vidéo, la réionisation absente alors que τ figure dans les six paramètres ΛCDM, aucune auto-évaluation, aucun lien vers les autres cours du hub. Quelques corrections rapides et 3-4 interactifs ciblés le rendraient exemplaire.

**Points forts** :
- Honnêteté épistémique exemplaire : <Tournant> et <Hypotheses> systématiques aux changements de cadre (RG, thermodynamique, inflation, matière noire, Λ), badges qui distinguent le fait mesuré de la lecture du modèle — jusqu'à doubler les badges sur un même Resultat (platitude : observé + concordant)
- Démonstrations ligne à ligne réellement complètes et au niveau annoncé (Terminale/L1) : redshift, coquille newtonienne de Friedmann, lois de dilution, Saha avec le grand logarithme ln(1/η), croissance δ∝a, conditions de Sakharov, q₀, écart 5σ de la tension de Hubble
- Statut des constantes explicité partout (défini par convention / mesuré / en tension), glossaire et index des symboles reliés à la page où chaque notion est démontrée
- Fil narratif et analogies de grande qualité (ballon gonflé, crayon sur la pointe, tribunal de l'annihilation, mousse de savon), qui portent l'intuition avant le calcul

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | coherence | **Corriger six transitions de fin de chapitre obsolètes** — Reliquats d'un ancien ordre chronologique : inflation.mdx annonce « la nucléosynthèse, notre prochaine étape » (réel suivant : fluctuations primordiales) ; baryogenese.mdx annonce la libération de la lumière (réel : instabilité de Jeans) ; energie-noire.mdx dit que le destin de l'univers est « le sujet du chapitre suivant » (c'est la partie II) ; tensions annonce « le chapitre de synthèse » (réel : questions ouvertes) ; synthese.mdx référence un « chapitre de clôture » inexistant ; instabilite-jeans promet « les premières étoiles » qui n'arrivent jamais. |
| 🔺 Haute | structure | **Réparer trois liens Prereq mal ciblés** — modele-lcdm.mdx l.17 : « énergie noire » pointe vers /cosmologie/partie-ii/destin-univers au lieu de /cosmologie/partie-v/energie-noire. instabilite-jeans.mdx l.19 : « fluctuations primordiales » pointe vers /partie-iii/anisotropies-cmb alors que le chapitre /partie-iv/fluctuations-primordiales existe. nucleosynthese.mdx l.96 : « les étoiles et leurs explosions » pointe vers /partie-ii/contenu-univers, qui ne parle pas de nucléosynthèse stellaire. Tous les autres href vérifiés résolvent correctement. |
| 🔺 Haute | interactif | **Doter la partie IV d'interactifs et d'une vidéo Manim** — La partie IV (problèmes du Big Bang, inflation, fluctuations, baryogenèse) — le tournant épistémique majeur du cours — n'a aucun composant interactif ni vidéo. Ajouter : un interactif « problème de l'horizon » (les ~10⁴ parcelles causales sur la sphère CMB) ; un slider e-folds montrant \|Ω−1\| écrasé et les modes qui sortent de l'horizon ; une vidéo Manim « l'inflation aplatit et dilue » sur le modèle des 6 vidéos existantes (expansion-univers, friedmann-destins...). |
| 🔺 Haute | contenu | **Ajouter le chaînon manquant : âges sombres, premières étoiles, réionisation** — Le récit saute de la recombinaison (z≈1100) aux structures actuelles. Or τ, « profondeur optique de réionisation », figure dans le tableau des six paramètres ΛCDM (modele-lcdm) sans être expliqué nulle part, et instabilite-jeans se clôt sur la promesse des premières étoiles. Ajouter un chapitre en partie V (ou une section dans toile-cosmique) : âges sombres, allumage des premières étoiles, réionisation et sa mesure (CMB, forêt Lyman-α), + entrées glossaire « réionisation », « âges sombres ». |
| 🔺 Haute | interactif | **Visualiser la concordance (Ωm, ΩΛ) et la toile cosmique** — modele-lcdm décrit en texte « trois bandes (CMB, SNe, BAO) qui se coupent en un seul point » : en faire un composant interactif du plan (Ωm, ΩΛ) — c'est l'image emblématique de la concordance. Et toile-cosmique, chapitre le plus visuel du cours, n'a ni image, ni vidéo, ni interactif : ajouter une vidéo Manim (effondrement d'un champ gaussien en filaments) ou un interactif ξ(r) montrant la bosse BAO à 150 Mpc. |
| ▪ Moyenne | interactif | **Interactif η→abondances (BBN) et explorateur du spectre Cℓ** — nucleosynthese.mdx contient l'encart « Une seule molette pour tout régler » qui décrit littéralement un slider η → abondances (D, ³He, ⁴He, ⁷Li) sans le fournir : le réaliser, avec les barres d'observation pour matérialiser la concordance (et le problème du lithium). Dans anisotropies-cmb, un explorateur du spectre de puissance (varier Ωb, Ωm, courbure et voir les pics se déplacer) rendrait tangible le tableau « chaque pic contraint un paramètre ». |
| ▪ Moyenne | pedagogie | **Ajouter des auto-évaluations en fin de partie** — Aucun exercice ni quiz dans tout le cours. Ajouter en fin de chaque partie 3 à 5 questions « Vérifiez votre compréhension » (encarts dépliables ou petit composant QCM) : distinguer redshift cosmologique et Doppler, recalculer ρc, prédire le destin selon (Ωm, ΩΛ), expliquer le 1/7 de la BBN — et surtout un exercice signature du cours : « classez cette affirmation sur l'échelle 🟢🔵🟡🔴 et justifiez », qui entraîne exactement la compétence épistémique visée. |
| ▪ Moyenne | structure | **Tisser les liens croisés vers le cours de physique du hub** — Aucun lien inter-cours n'existe. Le cours physique du hub couvre pourtant : la relativité (cible idéale depuis relativite-cadre, qui admet la RG « sans la redémontrer »), le modèle standard et le Higgs (depuis univers-chaud et sa frise thermique), /physique/partie-vi/matiere-noire (depuis partie-v/matiere-noire), /physique/partie-vi/asymetrie (depuis baryogenese), masse-neutrinos et gravite-quantique (depuis questions-ouvertes). Ajouter des encarts ou des Prereq inter-cours explicites. |
| ▪ Moyenne | coherence | **Harmoniser notations et valeurs numériques** — d_H désigne le rayon de Hubble c/H dans symbols.ts mais l'horizon causal (intégrale) dans problemes-big-bang : distinguer d_H et R_H et clarifier dans l'index. η (BBN, baryogenèse) vs η_B (symboles) : unifier. La platitude est citée ±0,002 (problemes-big-bang), ±0,005 (anisotropies), « mieux que 1 % » (modele-lcdm) : choisir une valeur de référence unique. Compléter l'index des symboles : q₀, r_s, τ, A_s, σ₈, Ω_k, Y_p, c_s, ℓ. |
| ▪ Moyenne | fiabilite | **Corriger le Resultat sans label ni badge dans inflation.mdx** — inflation.mdx l.83 : <Resultat titre="Durée minimale de l'inflation"> utilise la prop inexistante « titre » au lieu de « label » (Resultat.astro n'accepte que label) — le ruban affiche le générique « Résultat ». C'est aussi l'un des très rares Resultat du cours sans badge de fiabilité : ajouter un badge 🟡 extrapole (N≳60 dépend du scénario inflationnaire). Vérifier par grep qu'aucun autre composant du cours ne passe une prop inexistante. |
| ▪ Moyenne | contenu | **Actualiser énergie noire et tensions (DESI, sirènes standard)** — energie-noire affirme « les mesures actuelles donnent w=−1 à quelques pour cent près, sans trancher » : intégrer les résultats DESI (2024-2025) qui favorisent une énergie noire dynamique (w₀wₐ) à ~3-4σ dans certaines combinaisons — parfait exemple vivant de la frontière 🔵/🟡. Dans tensions-cosmologiques, mentionner les sirènes standard (ondes gravitationnelles + contrepartie) comme troisième route indépendante vers H₀, encore peu contraignante mais décisive à terme. |
| ▫ Basse | contenu | **Définir les distances cosmologiques utilisées implicitement** — L'argument central des supernovæ (« plus faibles donc plus lointaines ») repose sur la distance de luminosité, jamais définie ; problemes-big-bang utilise la distance de diamètre angulaire d_A sans la poser. Ajouter un encart « calcul » ou une section en partie I/II : distance comobile, distance angulaire, distance de luminosité, et pourquoi elles diffèrent dans un univers en expansion. Compléter aussi le glossaire : horizon sonore, MOND, quintessence, leptogenèse, amas du Boulet, modes B, e-fold. |

### Histoire

**Bilan** : Cours d histoire remarquable. Honnetete epistemique exemplaire, badges denses sur 28 chapitres, Tournant et Hypotheses systematiques, decentrage anti-eurocentrique reussi. Manques surtout pedagogiques et d integration au hub : aucune auto-evaluation, zero lien croise vers les autres cours, couverture interactive inegale et une video Manim orpheline, glossaire lacunaire sur des termes de methode. Enrichissable sans toucher a la biologie.

**Points forts** :
- Honnetete epistemique de premier ordre : echelle a 4 niveaux appliquee avec finesse, badges distinguant le fait de son interpretation.
- Marqueurs de cadre exemplaires : Tournant aux vraies bascules, Hypotheses en tete de chaine deductive.
- Decentrage et lutte contre les mythes : miracle grec nuance, diffusionnisme refute, imprimerie en perspective mondiale.
- Chaine comment le sait-on tenue de bout en bout, tous les liens Prereq internes valides.

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | pedagogie | **Ajouter une auto-evaluation a chaque chapitre** — Aucun chapitre ne propose d exercice ni de question recapitulative. Ajouter 2-3 questions de raisonnement en fin de chapitre, via un encart depliable revelant la reponse badgee. |
| 🔺 Haute | structure | **Creer des liens croises vers les autres cours du hub** — Histoire ne pointe vers aucun autre cours alors que la convention existe (chimie vers processeurs). Brancher carbone 14 vers chimie/processeurs, ecriture et imprimerie vers reseaux, base 60 vers notations, via Prereq inter-cours. |
| ▪ Moyenne | interactif | **Raccorder ou retirer la video Manim orpheline histoire-thermique** — Le fichier histoire-thermique.mp4 et son script existent mais ne sont references nulle part. L inserer la ou il illustre un propos (datation thermoluminescence, combustion) ou le retirer. |
| ▪ Moyenne | interactif | **Renforcer la couverture Manim des Parties II et V** — Seuls 4 chapitres sur 26 ont une video ; Neolithique et Moyen Age n en ont aucune. Ajouter diffusion neolithique, routes eurasiennes et Peste noire, lien vassalique. Reutiliser HistoireCarteMigrations et HistoireFriseChrono. |
| ▪ Moyenne | contenu | **Completer le glossaire avec les termes de methode** — Termes utilises sans entree : satrapie, polyptyque, epigraphie, stratigraphie, incunable, diffusionnisme, anachronisme, calibration, ostracisme, dharma, monotheisme. Ajouter definition courte et lien voir. |
| ▪ Moyenne | contenu | **Combler le sujet religieux : monotheismes et empires** — Les monotheismes (judaisme, christianisme dans Rome, islam et echanges eurasiens) n ont pas de traitement dedie. Scinder ou ajouter un chapitre, en gardant la grille de fiabilite pour les sources tardives et debats d origine. |
| ▪ Moyenne | fiabilite | **Marquer un Tournant dans grandes-decouvertes-premier-monde-global** — Ce chapitre acte la premiere mondialisation, changement de cadre majeur, mais sans bandeau Tournant. Ajouter un Tournant : un seul monde connecte, sources globales, debut des empires coloniaux. |
| ▫ Basse | fiabilite | **Homogeneiser la finesse des badges laconiques** — Quelques badges repetent juste le niveau (invention-ecriture, foyers d ecriture : texte probable au lieu d une justification). Reecrire ces 3-4 badges pour qu ils disent pourquoi ce niveau. |
| ▫ Basse | coherence | **Referencer Etat moderne et science naissante comme prerequis** — Seul chapitre jamais cible par un Prereq. Verifier que la revolution scientifique est rappelee la ou elle est mobilisee, en echo de la demonstration grecque ou de l imprime savant, pour resserrer le maillage. |
| ▫ Basse | structure | **Ajouter une page de synthese et frise recapitulative finale** — Le cours s arrete sans page de bilan reliant les grands tournants ni recapitulant la part attestee/reconstituee/debattue. Une page finale avec HistoireFriseChrono listant les seuils Tournant donnerait une vue d ensemble. |

### IA

**Bilan** : Cours d'une qualité épistémique remarquable : les 24 chapitres tiennent la promesse déductive (vraies démonstrations ligne à ligne, badges finement calibrés, controverses citées avec sources), avec une progression narrative soignée du neurone au RLHF. Les manques sont périphériques : le RL invoqué sans être construit (seule entorse à la chaîne), aucun exercice, deux Prereq mal ciblés, un glossaire en retard sur le texte, zéro lien croisé vers les autres cours du hub, et une couverture inégale en vidéos Manim (4) et interactifs (5 chapitres nus).

**Points forts** :
- Honnêteté épistémique exemplaire et calibration fine des badges : le 1/√dk marqué 🔵 « semi-formel », l'approximation universelle démontée de ses sur-interprétations, les débats cités avec références (Jain & Wallace 2019, Schaeffer 2023, Chinchilla)
- Vraies démonstrations complètes dans les encarts calcul : les 4 équations de backprop, l'équivariance par permutation de l'attention, la décomposition biais-variance, le weight decay, Bradley-Terry — avec exemple numérique vérifiable à la main
- Trame narrative forte : chaque chapitre se clôt par un accroche-suite motivé, les Prereq tissent une chaîne déductive dense et (à deux exceptions près) exacte, et l'alignement referme la boucle sur la grille à quatre couleurs
- 10 composants interactifs dédiés tous utilisés à bon escient (playground du neurone, paysage de perte, graphe de backprop, heatmap d'attention, lois d'échelle log-log...), souvent réutilisés intelligemment entre chapitres

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | contenu | **Combler le maillon manquant : l'apprentissage par renforcement avant le RLHF** — Le chapitre alignement invoque PPO/RLHF alors que le RL n'a jamais été construit — seule entorse réelle à la promesse déductive (reconnue dans un encart « pourquoi on ne détaille pas le RL ici »). Ajouter un chapitre court en partie VI (ou une annexe) « Optimiser sans gradient direct : le gradient de politique » : récompense espérée, REINFORCE dérivé ligne à ligne (badge prouve), puis PPO en recette. Le chapitre alignement pointerait dessus via <Prereq>. |
| 🔺 Haute | pedagogie | **Ajouter exercices et auto-évaluation par chapitre** — Aucun exercice dans tout le cours (ni dans le hub : aucun composant quiz). Créer un type d'encart « exercice » (solution dépliable, fermée par défaut) et en ajouter 2-3 par chapitre, calibrés sur le style déductif : redériver σ'(z)=σ(1−σ), faire à la main une passe backprop sur le réseau 2 couches du chap. 8, prédire l'effet de η sur la parabole, classer 5 affirmations sur l'échelle 🟢🔵🟡🔴 (excellent exercice d'épistémologie propre à ce cours). |
| 🔺 Haute | interactif | **Vidéo Manim pour la rétropropagation (et le bloc transformer)** — 4 vidéos Manim seulement (descente-gradient, approximation-bosses, convolution-filtre, attention-qkv). La rétropropagation — résultat phare 🟢 du cours — n'a que l'interactif IaBackpropGraph : une vidéo montrant δ^L se propager couche par couche avec (W^T δ)⊙σ' apparaissant en surimpression serait l'ajout le plus rentable. Second candidat : l'assemblage du bloc transformer (résidu + LayerNorm + FFN), chapitre dense en texte et sans vidéo. |
| 🔺 Haute | structure | **Corriger deux Prereq mal ciblés dans retropropagation.mdx** — Dans src/pages/ia/partie-ii/retropropagation.mdx, lignes 18 et 133, deux <Prereq href="/ia/partie-ii/derivees-gradient"> dont le texte parle de la règle θ←θ−η∇L et des « garanties de convergence de la descente de gradient » : la cible correcte est /ia/partie-ii/descente-de-gradient. Aussi : fonction-de-perte.mdx (ch. 4) utilise <Prereq> vers derivees-gradient (ch. 5), une référence AVANT — prévoir une variante « à venir » plutôt qu'un prérequis, pour préserver la sémantique déductive. |
| ▪ Moyenne | contenu | **Compléter le glossaire (~15 termes utilisés mais absents)** — Manquent dans src/data/ia/glossary.ts des termes définis dans les chapitres : softmax, entropie croisée (en entrée propre, pas en alias), hyperparamètre, ensemble de validation/test, gradient évanescent, double descente, encodage positionnel, masque causal, connexion résiduelle (alias seulement), one-hot, transfert d'apprentissage, SFT, modèle de récompense, DPO/PPO, reward hacking, hallucination, fenêtre de contexte. Chaque ajout avec « voir » vers la page d'introduction. |
| ▪ Moyenne | fiabilite | **Hypotheses et Tournant manquants dans plusieurs chapitres qui posent un cadre** — Retropropagation pose son modèle en prose (« tout cela est posé en hypothèse ») sans bloc <Hypotheses> ; idem perceptron-multicouche, sequences-limite-rnn et generation-decodage. Le transformer — qualifié de « triomphe d'ingénierie empirique » — et la tokenisation (BPE glouton) n'ont aucun <Tournant> alors qu'on y adopte des recettes structurantes ; generation-decodage mériterait un Tournant « on quitte la probabilité pour la décision ». Les badges 🟡 existent, mais le bandeau rend le changement de cadre visible. |
| ▪ Moyenne | structure | **Liens croisés vers les autres cours du hub (aucun aujourd'hui)** — Aucun lien sortant ni entrant entre /ia et les 7 autres cours. Candidats naturels : entropie croisée ↔ entropie de Shannon du cours réseaux (qui a son interactif ReseauShannon et un préset « théorème ») ; dérivées/gradient ↔ cours maths ; budget de calcul C des lois d'échelle et GPU ↔ cours processeurs. Ajouter des encarts « voir aussi » ou des Prereq inter-cours dans les deux sens (et depuis réseaux/processeurs vers ia). |
| ▪ Moyenne | contenu | **Chapitre « utiliser le modèle » : prompting, in-context learning, fenêtre de contexte** — La partie VI s'arrête à l'alignement : rien sur l'apprentissage en contexte (few-shot) — phénomène 🔴 emblématique parfaitement raccord avec l'axe épistémique du cours —, ni sur la fenêtre de contexte (conséquence directe du coût O(n²) déjà démontré) et le cache KV. Un chapitre « L'inférence : prompts et contexte » entre generation-decodage et lois-echelle bouclerait le parcours jusqu'à l'usage réel, sans aucun contenu biologique. |
| ▪ Moyenne | interactif | **Interactifs manquants : non-linéarités, gradient évanescent RNN, température** — Chapitres sans aucun interactif ni vidéo : fonction-de-perte, non-linearites, reseaux-convolutifs, sequences-limite-rnn, alignement. Les plus rentables : (1) un traceur d'activations (sigmoïde/tanh/ReLU + leur dérivée, produit des dérivées sur k couches → on voit le gradient s'évanouir) servant à la fois non-linearites et sequences-limite-rnn ; (2) un curseur de température/top-k re-pondérant une vraie distribution de tokens dans generation-decodage (extension d'IaTokenizer). |
| ▪ Moyenne | pedagogie | **Page de synthèse finale avec carte des questions ouvertes** — L'alignement se clôt par un beau paragraphe-bilan à quatre couleurs, mais le cours n'a pas de page de synthèse. Ajouter un chapitre final « Synthèse : ce qui est prouvé, ce qui marche, ce qu'on ignore » : la chaîne déductive complète en un schéma, et une carte des questions ouvertes (généralisation, émergence, interprétabilité, alignement) en réutilisant le composant OpenProblemsMap déjà présent dans le cours physique. |
| ▫ Basse | contenu | **Traiter l'initialisation des poids et la normalisation d'activation** — La page méthodologie cite « l'initialisation des poids » comme exemple de recette 🟡, mais aucun chapitre ne la traite ; la normalisation n'apparaît que via LayerNorm dans le transformer. Ajouter une section dans optimiseurs-sgd-adam (ou non-linearites) : pourquoi l'init aléatoire à bonne échelle (Xavier/He, dérivable par le même calcul de variance que le 1/√dk du chap. attention — joli écho interne), et la normalisation comme stabilisateur 🔵 au mécanisme débattu 🔴. |
| ▫ Basse | coherence | **Harmoniser notations et titres entre chapitres, symboles et nav** — L'index des symboles note 𝓛, a^(l), W^(l) ; les chapitres II/V utilisent L, a^ℓ, z^ℓ, et σ désigne tantôt la sigmoïde (partie I), tantôt l'activation générique (rétropropagation) — préciser « σ = activation quelconque » ou noter a(·). Ajouter au passage δ^ℓ, ⊙ (Hadamard) et FFN à symbols.ts. Enfin, le titre nav de la méthodologie (« les quatre niveaux de fiabilité ») diffère du titre de page (« les niveaux de fiabilité »). |

### Processeurs

**Bilan** : Cours d'une qualité épistémique rare : la chaîne « atome → OS » est réellement continue, chaque chapitre s'ouvre sur les acquis et se ferme sur la question suivante, et l'échelle fondé/convention/idéalisé/implémentation est appliquée avec une finesse remarquable (forme vs valeur, nécessité vs décret). Tous les liens internes vérifiés sont valides. Les manques sont périphériques : fabrication des puces et multicœur absents, aucune auto-évaluation, zéro lien croisé vers les autres cours du hub, glossaire incomplet sur la fin du cours, et quelques chapitres clés sans support visuel.

**Points forts** :
- Honnêteté épistémique exemplaire et constante : Tournants placés à chaque vrai changement de cadre (admission de la quantique, abstraction 0/1, rétroaction, frontière matériel/logiciel), Hypothèses numérotées en tête des chaînes déductives, et badges qui distinguent systématiquement la forme (fondée) de la valeur (implémentation).
- Fil déductif continu sur 30 chapitres avec transitions soignées : chaque page se termine par la question qui motive la suivante, jusqu'à la synthèse finale qui rejoue toute la pile maillon par maillon avec son statut.
- Instrumentation riche et bien distribuée : 14 composants interactifs dédiés (PNJunction, NoiseMargin, MiniCpu, PipelineDiagram, BootSequence...), 10 vidéos Manim aux moments charnières, calculs ligne à ligne réellement complets (marges de bruit, points fixes de la bascule RS, CPI).
- Appareil de référence solide : glossaire de 41 termes avec renvois vers la page d'introduction de chaque notion, index des symboles précisant le statut de chaque valeur numérique, navigation et Prereq tous cohérents avec la source unique _processeurs.ts.

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | contenu | **Ajouter un chapitre sur la fabrication des puces (lithographie)** — Le récit « du caillou à l'OS » saute de la jonction PN au MOSFET sans jamais dire comment on grave des milliards de transistors. Ajouter en fin de partie II un chapitre « Graver le silicium » : wafer, photolithographie, dopage par implantation, finesse de gravure, rendement. L'échelle de fiabilité s'y prête parfaitement (diffraction limitant la gravure = fonde, choix du nœud et du procédé = implementation, « loi » de Moore = convention/observation, pas une loi). |
| 🔺 Haute | pedagogie | **Créer un dispositif d'auto-évaluation en fin de chapitre** — Aucun exercice ni QCM dans tout le hub (aucun composant de quiz dans src/components). Créer un composant Quiz/Exercices (encart dépliable avec correction) et l'ajouter en fin de chapitre : conversions complément à deux, tables de vérité NAND, calcul de CPI avec bulles, et surtout des questions méta exploitant l'échelle du cours (« cette affirmation est-elle fondée, convention, idéalisée ou implémentation ? ») qui font travailler l'axe épistémique central. |
| 🔺 Haute | structure | **Ajouter les liens croisés vers les autres cours du hub** — Zéro lien sortant de processeurs vers les 7 autres cours (vérifié par grep), alors que chimie pointe déjà vers processeurs. Ajouter : depuis atomes-niveaux (Tournant « on admet la quantique ») un renvoi vers chimie/partie-i où l'atome quantique est construit en détail ; depuis abstraction-numerique ou binaire-complement vers reseaux (« depuis le bit », Shannon) ; depuis le socle quantique vers physique. Cela renforce la promesse déductive : l'hypothèse admise ici est développée ailleurs. |
| ▪ Moyenne | contenu | **Couvrir multicœur, consommation et mur de la fréquence** — La dissipation (E ~ C·V²) n'apparaît qu'en encart de l'inverseur CMOS ; rien sur le plafonnement des fréquences, le passage au multicœur ni la cohérence de cache — pourtant citée dans comment-lire comme exemple d'encart « plus loin ». Ajouter un chapitre ou une section en fin de partie V : pourquoi la physique (dissipation, délais) a imposé le multicœur, et ce que la concurrence change (fonde : la chaleur ; convention : SMP ; implementation : protocoles MESI). |
| ▪ Moyenne | contenu | **Combler les lacunes du glossaire et de l'index des symboles** — Termes traités dans le cours mais absents du glossaire (41 entrées) : boutisme/endianness (isa.mdx), appel système/syscall (premier-processus), métastabilité (bascule-rs et bascule-d), microcode (section entière de controle-fetch-execute), TLB (mode-protege-mmu), forwarding/court-circuit (pipeline), niveau de Fermi. Symboles manquants dans symbols.ts : V_bi, I_S, V_gamma (jonction-pn), t_hold (seul t_setup figure), NM_L/NM_H (le texte les définit, l'index ne liste que N_M). |
| ▪ Moyenne | interactif | **Donner un support visuel au chapitre 1 (atomes-niveaux)** — C'est la porte d'entrée du cours et le seul chapitre de la partie I sans aucun composant interactif ni vidéo (5 badges, 3 encarts, mais rien à manipuler). Ajouter une vidéo Manim « onde stationnaire sur une corde → niveaux discrets » (l'analogie déjà rédigée dans l'encart intuition) ou un interactif de remplissage des niveaux par Pauli — un équivalent ChimieConfigElectronique existe déjà dans le hub et pourrait être adapté. |
| ▪ Moyenne | fiabilite | **Recalibrer le badge de l'équation de Shockley (jonction-pn)** — Dans jonction-pn.mdx, le Resultat « Comportement de diode » affiche la formule exacte I = I_S(e^{qV/kT} − 1) avec un badge fonde, puis le paragraphe suivant la badge idealise (facteur d'idéalité, résistance série). Incohérence locale : séparer l'énoncé qualitatif (unidirectionnalité = fonde, le badge le justifie déjà ainsi) de la loi quantitative (idealise), par exemple en mettant la formule dans un second Resultat badgé idealise ou en double-badgeant le Resultat. |
| ▪ Moyenne | interactif | **Vidéos Manim pour la mémoire (partie IV) et le début du boot** — La partie IV n'a qu'une vidéo (d-flip-flop) ; memoires-sram-dram et bascule-rs, moments très visuels, n'en ont pas : animer la cellule DRAM qui fuit et son rafraîchissement, ou la rétroaction RS qui se verrouille, serait idéal. En partie VI, reset-rom/firmware/bootloader n'ont aucune vidéo (boot-sequence n'apparaît qu'au dernier chapitre) et l'interactif BootSequence est dupliqué tel quel dans reset-rom et deux fois dans premier-processus — varier ou paramétrer l'étape mise en avant. |
| ▫ Basse | coherence | **Vrais badges dans le tableau de synthèse final** — Le tableau « Synthèse : remonter toute la pile » de premier-processus.mdx écrit les statuts en gras texte (**fonde**, **convention**) au lieu d'utiliser le composant Badge : on perd la couleur, l'infobulle explicative et la cohérence visuelle avec tout le cours, précisément à l'endroit où l'échelle de fiabilité est récapitulée. Remplacer chaque statut par un <Badge niveau="..."> avec une justification courte en infobulle. |
| ▫ Basse | contenu | **Expliquer comment le CPU parle aux périphériques (MMIO)** — interruptions-dma.mdx pose en hypothèse « des fils de signalisation » mais ne dit jamais comment le CPU lit/écrit les registres d'un périphérique : E/S mappées en mémoire vs instructions d'E/S dédiées. Ajouter une courte section (ou un encart plus-loin) dans interruptions-dma ou von-neumann : le périphérique vu comme des adresses (convention d'architecture), avec la carte mémoire propre à chaque plateforme (implementation). Cela prépare aussi le firmware qui « réveille » les bus. |

### Réseaux

**Bilan** : Cours d'une qualité épistémique rare : la chaîne déductive est réelle (le log dérivé de l'additivité, les garanties du CRC démontrées une à une), l'échelle théorème/norme/heuristique/déploiement est appliquée avec une calibration quasi irréprochable sur ~140 badges, et chaque chapitre nomme honnêtement ses limites. Les manques sont périphériques mais nets : ARP/NAT/ICMP absents à la charnière lien-réseau, aucun exercice, couverture interactive inégale (13 chapitres sur 22 sans composant ni vidéo), zéro lien inter-cours, et une entorse à la promesse (handshake TCP sans Tournant).</bilan>

**Points forts** :
- Calibration exemplaire des badges : le CRC distingue les garanties démontrées (théorème) du choix du polynôme générateur (norme) ; AIMD est badgé heuristique avec l'argument de Chiu-Jain explicitement présenté comme justification non optimale ; BGP en déploiement.
- Honnêteté épistémique systématique : « détecter n'est pas corriger, ni être infaillible » (CRC), « perte = congestion est un pari faux en radio » (TCP), « ce que TLS ne protège PAS » (métadonnées), « la QoS arbitre une pénurie qu'elle ne supprime pas ».
- Vraie progression déductive motivée : la « tentation de l'infini » de Nyquist (M non borné) crée la fissure qui appelle Shannon ; chaque chapitre se ferme sur la question qui ouvre le suivant.
- Synthèse finale remarquable (qos-ouverture) : la table étage par étage avec statut dominant referme exactement la promesse de comment-lire — « une cathédrale de conventions posée sur un unique pilier physique ».

| Priorité | Catégorie | Amélioration |
|---|---|---|
| 🔺 Haute | contenu | **Ajouter ARP : le chaînon manquant entre MAC et IP** — ARP est totalement absent (aucune occurrence dans les 22 chapitres). Or le routage (partie-iv/routage.mdx) conclut « transmettre au prochain saut » sans jamais dire comment l'hôte obtient la MAC de ce saut : la chaîne déductive Partie III → IV a un trou. Ajouter une section « Relier IP au lien : ARP » en fin d'adressage-ip.mdx (ou un chapitre court), badgée norme (RFC 826) + deploiement (cache ARP), avec l'angle déductif : deux espaces d'adresses ⇒ nécessité d'une traduction. |
| 🔺 Haute | pedagogie | **Ajouter des exercices d'auto-évaluation par chapitre** — Aucun exercice, quiz ni auto-évaluation dans tout le cours (grep exercice\|quiz\|auto-évalu : zéro résultat). Ajouter en fin de chaque chapitre 2-3 « À vous » avec solution dans un Encart replié : calculer C pour B et SNR donnés, dérouler un CRC court, trouver la route longest-prefix pour 3 destinations, découper un /24 en 4 sous-réseaux, dérouler une résolution DNS. Le cours s'y prête : les encarts calcul fournissent déjà le modèle de correction ligne à ligne. |
| 🔺 Haute | fiabilite | **Tenir la promesse : Tournant + Hypothèses dans tcp-connexion** — comment-lire.mdx cite « le déroulé du handshake TCP » comme exemple type de bandeau Tournant, mais tcp-connexion.mdx n'a ni <Tournant> ni <Hypotheses> (seul chapitre normatif majeur dans ce cas avec commutation et modulation). Ajouter un <Hypotheses> (ce que TCP suppose d'IP : pertes, duplication, réordonnancement possibles) et un <Tournant> au moment où l'on adopte le handshake SYN/SYN-ACK/ACK. Faire de même, plus brièvement, dans modulation.mdx et commutation.mdx. |
| 🔺 Haute | interactif | **Chronogrammes interactifs pour le codage de ligne** — codage-ligne.mdx décrit NRZ, NRZI et Manchester — des formes d'onde — sans aucun visuel (ni composant ni vidéo). Créer un composant ReseauCodageLigne : l'utilisateur tape une suite de bits, voit les trois chronogrammes côte à côte, et une longue suite de 0 fait visiblement dériver l'horloge en NRZ. C'est le chapitre où l'écart texte/visualisation est le plus criant du cours, et le composant est simple (canvas 2D, motif des 7 composants Reseau* existants). |
| ▪ Moyenne | contenu | **Donner au NAT la place que l'échelle lui promet** — Le NAT est l'exemple phare du niveau 🔴 deploiement (méthodologie, comment-lire, preset fiability.ts) mais n'est traité qu'en 2 phrases dans ports-multiplexage.mdx. Ajouter une section dédiée (fin de ports-multiplexage ou d'adressage-ip) : pénurie IPv4 → adresses privées RFC 1918 (norme) → réécriture du quadruplet (déploiement) → conséquences sur le bout-en-bout. Cela relierait adressage, ports et l'ouverture IPv6, et justifierait l'exemple canonique de l'échelle. |
| ▪ Moyenne | contenu | **ICMP et fragmentation : combler une référence pendante** — symbols.ts annonce pour la MTU « au-delà, il faut fragmenter », mais la fragmentation n'apparaît nulle part ; ICMP, ping et traceroute sont absents alors que routage.mdx introduit le TTL (traceroute en est l'exploitation directe). Ajouter dans routage.mdx un encart « Observer le réseau : ICMP, ping, traceroute » (pédagogiquement précieux : le lecteur peut expérimenter) et un encart MTU/fragmentation (norme IPv4 vs interdiction IPv6, Path MTU Discovery en heuristique). |
| ▪ Moyenne | contenu | **Compléter le glossaire (10+ termes utilisés mais non définis)** — 24 entrées seulement ; manquent des termes employés dans le cours : entropie, baud, encapsulation, best-effort, checksum, broadcast, passerelle, TTL, certificat/CA/PKI, Diffie-Hellman, QUIC, DNSSEC/DoH, Spanning Tree, gigue (seulement alias de QoS) — plus ARP, NAT, DHCP, fragmentation une fois ajoutés. Compléter src/data/reseaux/glossary.ts avec le champ voir pointant vers la page d'introduction. Ajouter aussi λ, μ, ρ (file M/M/1 de qos-ouverture) à symbols.ts. |
| ▪ Moyenne | interactif | **Vidéo Manim « encapsulation » et visuel pour Nyquist** — Deux moments clés sans visuel : (1) http-web.mdx raconte la traversée complète des couches en texte — une vidéo Manim « la poupée russe des en-têtes » (HTTP ⊂ TCP ⊂ IP ⊂ Ethernet, construction puis épluchage à chaque routeur) serait la scène phare du cours ; (2) nyquist.mdx établit le facteur 2B sans aucune image — animer l'échantillonnage à 2 points/période et l'aliasing (la sinusoïde qui « tourne à l'envers ») rendrait le théorème central visible. |
| ▪ Moyenne | interactif | **Composants interactifs DNS, TLS et commutation** — Trois chapitres à fort potentiel sans interactif : dns.mdx (descente de l'arbre racine → .fr → cerema.fr, avec cache et TTL qui court-circuitent les étapes au second clic), tls-securite.mdx (handshake pas à pas avec un attaquant MITM qu'on active, déjoué par la vérification du certificat), commutation.mdx (simulateur d'apprentissage de la table MAC, l'encart « Une trace pas à pas » existe déjà comme storyboard). Prioriser DNS, le plus simple et le plus parlant. |
| ▪ Moyenne | structure | **Tisser les liens croisés avec les autres cours du hub** — Aucun lien inter-cours dans les deux sens (grep sur les 8 cours : zéro). Ajouter des renvois ciblés : trame-parite/crc → cours processeurs (XOR, portes logiques) ; signal-bande-passante → cours physique (ondes, Fourier) ; bit-information → cours ia (entropie et entropie croisée des fonctions de perte) ; bruit-shannon → physique (thermodynamique, k_B T). Quelques Prereq ou encarts « ailleurs dans le hub » suffisent et valorisent l'architecture multi-cours. |
| ▫ Basse | coherence | **Corriger l'usage du composant Hypotheses dans bruit-shannon** — Dans bruit-shannon.mdx (l.129), <Hypotheses titre="Une vue simplifiée de l'ADSL"> sert de note de simplification de modèle en fin de chapitre, pas d'hypothèses numérotées en début de chaîne déductive — contrairement à la sémantique posée dans comment-lire. La reconvertir en Encart type plusloin (« L'ADSL réel : DMT, sous-canaux »). Au passage, ajouter un mini-Tournant dans crc.mdx à la section « Le générateur n'est pas un théorème » (seul chapitre sans Tournant ni Hypotheses qui change de statut). |
| ▫ Basse | pedagogie | **Encart « ordres de grandeur » transversal** — Le cours manie RTT, débits et latences sans tableau de repères. Ajouter (dans qos-ouverture ou tcp-connexion) un encart badgé deploiement : propagation lumière ~5 µs/km en fibre, RTT intra-ville ~1 ms / transatlantique ~80 ms / géostationnaire ~500 ms, débits typiques cuivre/fibre/Wi-Fi. Cela ancre les calculs (RTO, slow start, divergence des files) dans des valeurs tangibles et illustre la distinction borne théorique / valeur de terrain posée en méthodologie. |
| ▫ Basse | structure | **Scinder qos-ouverture : la synthèse mérite sa page** — qos-ouverture.mdx cumule quatre rôles : métriques QoS, théorie des files (M/M/1, Little), neutralité du net, et synthèse complète de la pile. La table de relecture finale (étage / établi / statut) est la morale du cours entier ; en faire une page de conclusion séparée (« Relire la pile, du bit à HTTPS ») la rendrait visible dans la sidebar et atterrirait mieux après TLS, au lieu d'être enfouie sous DiffServ. Le chapitre QoS resterait centré sur files et priorisation. |

---

## Annexe — signalements mineurs non contre-expertisés

- `src/data/processeurs/glossary.ts` : « décodeur » est donné comme alias de « Multiplexeur », mais un décodeur est un circuit distinct (il active une sortie parmi 2ⁿ selon un code de n bits), pas un sélecteur d'entrée. Un lecteur cherchant « décodeur » obtiendrait la définition du MUX, qui est fausse pour ce terme. → *Retirer 'décodeur' des alias, ou créer une entrée dédiée : « Décodeur : circuit combinatoire qui active une sortie parmi 2ⁿ selon le code binaire de n bits d'entrée (ex. sélection d'une ligne mémoire). »*
- `src/data/processeurs/glossary.ts` : « Harvard » est donné comme alias de « Architecture de von Neumann », alors que l'architecture Harvard est précisément le modèle opposé (mémoires d'instructions et de données séparées). Une recherche sur « Harvard » renverrait une définition contraire au terme cherché. → *Retirer 'Harvard' des alias, ou ajouter une entrée propre : « Architecture Harvard : modèle où instructions et données résident dans des mémoires séparées, accessibles simultanément (par opposition à von Neumann). »*
- `src/pages/processeurs/partie-v/controle-fetch-execute.mdx` : L'incrément réel dépend de la taille de l'*instruction*, pas de la « taille du mot » machine : sur x86 les instructions font 1 à 15 octets alors que le mot fait 64 bits. Le chapitre datapath.mdx le dit d'ailleurs correctement (« autant d'octets que pèse une instruction, souvent +4 »). → *Remplacer par : « l'incrément réel en octets dépend de la taille de l'instruction (fixe en RISC, souvent +4 ; variable en x86) », pour s'aligner sur la formulation correcte de datapath.mdx.*
- `src/pages/processeurs/partie-v/interruptions-dma.mdx` : Présenté comme général alors que c'est dépendant de l'ISA : x86 déroute bien (#DE), mais en RISC-V et ARM (AArch64) la division entière par zéro NE lève PAS d'exception matérielle (résultat défini, p. ex. tous bits à 1 ou 0). Les deux autres exemples (opcode invalide, accès interdit) sont, eux, généraux. → *Nuancer : « Une division par zéro (sur les architectures qui la déroutent, comme x86 — RISC-V et ARM renvoient un résultat défini sans exception), un opcode invalide… » ou remplacer l'exemple par un cas universel, et/ou ajouter un badge 🔴 implementation.*
- `src/pages/processeurs/partie-v/interruptions-dma.mdx` : Légèrement trop fort : le multitâche *coopératif* (Mac OS classique, Windows 3.x) existe sans interruption d'horloge ; c'est le multitâche *préemptif* qui l'exige. La parenthèse montre que c'est bien la préemption qui est visée, mais le mot « multitâche » seul est trop large pour un badge 🟢 fonde (« conditions logiques minimales »). → *Écrire « pas de multitâche *préemptif* » (le multitâche coopératif existe sans horloge, mais un programme en boucle le bloque — d'où la nécessité du minuteur pour reprendre la main de force).*
- `src/pages/processeurs/partie-v/pipeline.mdx` : Attribution historique simplifiée à la limite du faux : la chaîne d'assemblage automobile existait avant Ford (Ransom Olds, 1901, chaîne stationnaire), et la chaîne *mobile* de Highland Park (1913) est l'œuvre d'une équipe d'ingénieurs de Ford (Avery, Martin, Sorensen…), pas une idée personnelle de Henry Ford. C'est un mythe historiographique connu. → *Reformuler : « Les usines Ford ont généralisé l'idée géniale (chaîne d'assemblage mobile, 1913) : ne jamais laisser un poste vide » — ou « chez Ford, on a eu l'idée… », sans attribuer l'invention à Henry Ford personnellement.*
- `src/pages/processeurs/partie-vi/bootloader.mdx` : Vrai seulement pour le BIOS hérité. Le firmware UEFI inclut obligatoirement un pilote FAT et sait lire des fichiers sur l'ESP — le même chapitre le dit trois paragraphes plus loin (« le firmware sait déjà lire une partition […] et y lancer un fichier .efi »). Contradiction interne. → *Restreindre la portée : « Le firmware BIOS hérité ne sait lire que des secteurs bruts […] » ou « Historiquement, le firmware ne savait lire que des secteurs bruts », pour rester cohérent avec le passage sur l'UEFI.*
- `src/pages/processeurs/partie-vi/firmware-uefi.mdx` : Anachronisme léger affirmé sans badge : l'intégration du contrôleur mémoire dans le processeur ne date que d'AMD K8 (2003) et d'Intel Nehalem (2008). À l'époque du BIOS décrit dans le même chapitre, il résidait dans le chipset (northbridge). → *Écrire « un contrôleur de DRAM, aujourd'hui intégré au processeur (historiquement dans le chipset de la carte mère) » ou ajouter un badge 🔴 implementation sur la localisation du contrôleur.*
- `src/pages/processeurs/partie-vi/firmware-uefi.mdx` : « dès le départ » est trompeur : même sous UEFI, un cœur x86 sort du reset en mode réel 16 bits ; c'est le firmware qui bascule en mode protégé/long dans ses toutes premières instructions. Le 32/64 bits ne vaut « dès le départ » que pour l'environnement offert aux applications EFI. → *Préciser, p. ex. « environnement remis au bootloader : 16 bits (mode réel) vs 32/64 bits », ou noter que le CPU démarre toujours en mode réel et que l'UEFI bascule très tôt en mode long.*
- `src/pages/processeurs/partie-vi/mode-protege-mmu.mdx` : Imprécision contradictoire avec le mécanisme décrit juste après : l'adresse virtuelle n'atteint jamais le bus mémoire ; la MMU la traduit en amont, et c'est l'adresse physique qui est placée sur le bus. → *Reformuler : « Toute adresse qu'un programme calcule et émet est une adresse virtuelle ; la MMU la traduit en adresse physique avant qu'elle n'atteigne le bus mémoire et la RAM. »*
- `src/pages/processeurs/partie-vi/premier-processus.mdx` : Le firmware (BIOS/UEFI) n'a strictement aucun rôle dans le choix du premier processus : c'est un choix de la distribution/de l'OS, modifiable via le paramètre noyau init=. Mentionner le firmware ici contredit la chaîne d'autorité que le cours vient d'établir (le firmware a passé la main bien avant). → *Écrire : « c'est un choix de distribution (ou du noyau, via le paramètre de ligne de commande init=), pas une loi. »*
- `src/pages/processeurs/partie-vi/premier-processus.mdx` : Surstatement : sans interruption d'horloge, toute autre interruption asynchrone (clavier, disque, réseau) ferait quand même exécuter le noyau, qui pourrait reprendre la main. Ce que l'horloge apporte spécifiquement est une reprise GARANTIE et périodique, indépendante de tout événement extérieur. → *Préciser : « sans aucune interruption asynchrone, le noyau ne reprendrait jamais la main ; et seule l'interruption d'horloge garantit une reprise périodique, indépendante de tout événement extérieur — c'est elle qui fonde la préemption. »*
- `src/data/reseaux/glossary.ts` : La formulation laisse entendre que tout codage de ligne, NRZ inclus, permet la récupération d'horloge. Or NRZ est précisément le contre-exemple classique : une longue suite de bits identiques ne produit aucune transition et fait perdre la synchronisation. C'est la raison d'être de Manchester (transition garantie à chaque bit). → *Reformuler pour ne pas attribuer la récupération d'horloge à tous les codes, p. ex. : « Façon de représenter les bits 0 et 1 par des niveaux ou transitions de tension (NRZ, Manchester…). Les bons codes garantissent assez de transitions pour que le récepteur récupère l'horloge — ce que NRZ ne fait pas sur de longues suites identiques. »*
- `src/data/reseaux/glossary.ts` : Affirmation périmée en tant que définition générale : HTTP/3 (RFC 9114, 2022) est transporté sur QUIC au-dessus d'UDP et représente une part substantielle du trafic web en 2025. « Transporté sur TCP » n'est exact que pour HTTP/1.x et HTTP/2. → *Préciser : « …transporté sur TCP (HTTP/1.1, HTTP/2) ou, depuis HTTP/3, sur QUIC au-dessus d'UDP. » Ou a minima « historiquement transporté sur TCP ».*
- `src/data/reseaux/symbols.ts` : Statut mal calibré au regard de l'échelle du cours : la charge utile maximale de 1500 octets est fixée par la norme IEEE 802.3 (🔵 norme), pas une simple convention. Ce sont les écarts (jumbo frames, MTU de tunnels) qui relèvent du déploiement (🔴). Le commentaire de l'interface annonce d'ailleurs un statut « théorème / norme / déploiement », et « convention courante » n'en fait pas partie. → *Remplacer par : « 1500 octets sur Ethernet (norme IEEE 802.3 ; jumbo frames possibles selon déploiement) ».*
- `src/pages/reseaux/partie-i/bit-information.mdx` : Le baud n'est pas « un symbole » mais une unité de DÉBIT : 1 baud = 1 symbole par seconde. La glose contredit le début de la même phrase (« les symboles par seconde en bauds ») et la définition correcte donnée dans nyquist.mdx (« débit symbole, mesuré en bauds »). → *Remplacer par : « un baud correspond à un symbole physique transmis par seconde (le baud mesure une cadence de symboles), tandis que le bit mesure une quantité d'information ».*
- `src/pages/reseaux/partie-i/signal-bande-passante.mdx` : Surénoncé : sous les conditions de Dirichlet, la série de Fourier converge vers s(t) aux points de continuité, mais aux discontinuités elle converge vers la demi-somme des limites gauche/droite — pas nécessairement vers la valeur du signal. Or l'exemple phare du chapitre est précisément le créneau, discontinu (avec en prime le phénomène de Gibbs pour les sommes partielles). → *Nuancer : « l'égalité est exacte en tout point où le signal est continu ; aux sauts (comme ceux du créneau), la série converge vers la moyenne des deux valeurs de part et d'autre ». Éventuellement mentionner le phénomène de Gibbs en encart « plus loin ».*
- `src/pages/reseaux/partie-ii/codage-ligne.mdx` : Formulation trop forte : le scrambling rend les longues suites identiques très improbables mais ne les élimine pas de façon déterministe — il existe des séquences d'entrée (connues p. ex. en SONET/SDH) qui reproduisent de longues suites malgré le brouilleur. Contrairement au 4B/5B, la garantie est statistique, pas absolue. → *Écrire « qui rend les longues suites très improbables sans doubler la bande (garantie statistique, contrairement au 4B/5B qui garantit déterministement les transitions) ».*
- `src/pages/reseaux/partie-ii/codage-ligne.mdx` : Attribution approximative : le théorème de Nyquist borne le débit de symboles (R ≤ 2B). L'affirmation « passer une composante à f_max exige B ≥ f_max » est la définition d'un canal passe-bas de bande B (analyse de Fourier, chapitre signal-bande-passante), pas le théorème de Nyquist. La conclusion (Manchester double la bande) reste juste. → *Invoquer le chapitre signal/bande passante : « un canal de bande B ne laisse passer aucune composante au-delà de B, donc B ≥ f_max » ; réserver « Nyquist » à la borne 2B symboles/s. Ajuster de même le badge « imposé par Nyquist » en « imposé par la physique du canal (Fourier) ».*
- `src/pages/reseaux/partie-ii/trame-parite.mdx` : Mécanisme imprécis : en Ethernet réel, la fin de trame est signalée par la couche physique (perte de porteuse, délimiteur de fin de flux, silence inter-trames), pas par un comptage de longueur. De plus, dans l'Ethernet dominant (Ethernet II), le champ est un Type (EtherType ≥ 1536), pas une longueur ; le champ longueur (802.3 brut) sert surtout à distinguer données et bourrage. → *Reformuler : « Ethernet, lui, n'utilise pas de fanion : un préambule fixe (+ SFD) marque le début, et la fin est signalée par la couche physique elle-même (arrêt de la porteuse, puis silence inter-trames). » Si l'on garde le champ longueur, préciser qu'il appartient à la variante IEEE 802.3 et qu'en Ethernet II ce champ est un type.*
- `src/pages/reseaux/partie-iii/acces-medium.mdx` : Erreur de calcul cinématique : si A émet à t=0 d'un bout et B à t=τ/2 de l'autre, les fronts se rencontrent quand vt = L − v(t−τ/2), soit t = 3τ/4 (aux 3/4 du câble côté A). À t=τ, c'est le signal de A qui arrive chez B et permet à B de détecter la collision ; les signaux se sont superposés avant. → *Écrire : « À t=3τ/4, les deux signaux se rencontrent sur le câble : collision. À t=τ, le signal de A atteint B, qui détecte alors la collision. » (Ou supprimer l'instant précis : « les deux signaux se superposent : collision ».)*
- `src/pages/reseaux/partie-iii/acces-medium.mdx` : Idéalisation présentée comme un fait : dans IEEE 802.3, la tranche (slot time) vaut 512 temps de bit (51,2 µs à 10 Mbit/s), dimensionnée pour être SUPÉRIEURE à l'aller-retour pire cas (propagation + répéteurs + jam), pas exactement égale à 2τ. L'égalité slot = 2τ est l'approximation des manuels, non signalée ici. → *Préciser : « chaque tranche valant 512 temps de bit, soit 51,2 µs à 10 Mbit/s — dimensionnée par la norme pour dépasser le temps d'aller-retour maximal 2τ » ou marquer l'égalité 2τ comme idéalisation.*
- `src/pages/reseaux/partie-iii/acces-medium.mdx` : Badge 🟢 theoreme trop fort : la superposition est bien physique, mais « se brouillent nécessairement » n'est pas un théorème. Le 1000BASE-T full-duplex émet simultanément dans les deux sens sur les mêmes paires et sépare les signaux par annulation d'écho ; l'effet de capture permet parfois de décoder le signal le plus fort. L'indécodabilité vaut pour un récepteur tiers sur un bus, pas en absolu. → *Reformuler : « La superposition des signaux est un fait physique ; un récepteur tiers ne peut pas, en pratique, séparer deux trames superposées de puissances comparables » — ou garder 🟢 pour la seule superposition et noter que l'annulation d'écho (1000BASE-T) contourne le brouillage quand on connaît son propre signal.*
- `src/pages/reseaux/partie-iii/commutation.mdx` : Badge 🔵 norme mal calibré pour la seconde moitié de la phrase : la platitude des MAC est bien normative, mais « ne passe pas à l'échelle » est un argument d'ingénierie, pas une prescription de norme. Le chapitre mac-ethernet.mdx badge d'ailleurs explicitement le même argument 🟡 heuristique (« argument de passage à l'échelle, pas un théorème ») : incohérence interne de calibration. → *Scinder en deux badges : 🔵 norme pour « l'adresse MAC est plate et non hiérarchique (IEEE 802) » et 🟡 heuristique pour « la commutation à plat ne passe pas à l'échelle planétaire », alignant ainsi la calibration sur celle de mac-ethernet.mdx.*
- `src/pages/reseaux/partie-iii/mac-ethernet.mdx` : Imprécision : seul le bit I/G (individuel/groupe) classe les destinataires (unicast vs multicast, le broadcast étant l'adresse tout-à-un, cas particulier de groupe). Le second bit du premier octet est le bit U/L (universel/local), qui indique le mode d'administration de l'adresse, pas le type de destinataire. La phrase laisse croire que les deux bits servent à la classification unicast/multicast/broadcast. → *Écrire : « Le bit individuel/groupe du premier octet permet de classer les destinataires : » (et mentionner le bit U/L séparément, comme le fait déjà le badge qui suit), ou « Deux bits du premier octet ont un sens particulier ; le premier (I/G) classe les destinataires ».*
- `src/pages/reseaux/partie-iv/adressage-ip.mdx` : La longueur de 32 bits est bien fixée par la RFC 791, mais la notation décimale pointée n'y est pas définie : c'est une convention d'écriture humaine de fait (apparue dans la pratique et d'autres documents), pas un « choix d'en-tête » de la RFC 791 — l'en-tête ne transporte que les 32 bits bruts. → *« 32 bits, 4 octets : des choix d'en-tête fixés par la RFC 791. La notation pointée, elle, est une convention d'écriture devenue standard de fait. »*
- `src/pages/reseaux/partie-iv/adressage-ip.mdx` : Affirmation un peu périmée si présentée comme absolue : l'adresse gravée (burned-in) existe, mais l'adresse MAC effective est modifiable par logiciel, et la randomisation MAC est aujourd'hui activée par défaut sur les smartphones et OS récents en Wi-Fi. « Fixe » n'est plus vrai en pratique. → *Nuancer : « gravée dans la carte à l'usine (même si les systèmes modernes peuvent la remplacer ou la randomiser par logiciel) » — ou renvoyer à la nuance déjà faite au chapitre Ethernet si elle y figure.*
- `src/pages/reseaux/partie-iv/sous-reseaux.mdx` : Formule donnée sans domaine de validité : elle vaut pour n ≤ 30. Pour /31 elle donne 0 alors que la RFC 3021 autorise 2 hôtes sur les liens point à point (pas d'adresse réseau ni de broadcast), et pour /32 elle donne −1 alors qu'un /32 désigne 1 hôte. Pour un cours déductif, l'exception mérite une note. → *Préciser « pour n ≤ 30 » et ajouter en encart/note : les /31 (RFC 3021, liens point à point : 2 hôtes) et /32 (route d'hôte : 1 adresse) échappent à la règle du −2.*
- `src/pages/reseaux/partie-v/ports-multiplexage.mdx` : Généralisation inexacte : le démultiplexage par quadruplet ne vaut que pour le transport orienté connexion (sockets TCP connectées). En UDP, le noyau démultiplexe uniquement sur (IP, port) de destination : un même socket reçoit les datagrammes de toutes les sources. Le quadruplet identifie bien une conversation, mais n'est pas le mécanisme universel de démultiplexage de la couche transport. → *Préciser : « Le quadruplet identifie une conversation de façon unique ; le démultiplexage effectif l'utilise intégralement pour les connexions TCP, tandis qu'UDP n'aiguille que sur (IP, port) de destination et laisse l'application distinguer les sources. »*
- `src/pages/reseaux/partie-v/tcp-connexion.mdx` : Conflation de deux propriétés : la protection contre les vieux SYN dupliqués (l'argument développé dans l'encart et conclu par « le rôle profond de l'ISN imprévisible ») exige seulement un ISN frais/non réutilisé — RFC 793 prescrivait une horloge, parfaitement prévisible. L'imprévisibilité (RFC 1948/6528) répond à un autre problème : empêcher un attaquant hors chemin de forger l'ACK y+1 et d'injecter des données. → *Distinguer les deux : « l'ISN n'est pas zéro mais un point de départ frais, pour qu'aucun écho d'une connexion passée ne soit pris pour du courant (RFC 793 utilisait une horloge) ; les piles modernes le rendent de plus imprévisible (RFC 6528) afin qu'un attaquant qui n'a pas vu y ne puisse pas forger l'ACK y+1 ».*
- `src/pages/reseaux/partie-vi/http-web.mdx` : Les connexions persistantes ont été introduites avec HTTP/1.1 dans la RFC 2068 (1997), reprise par la RFC 2616 (1999). La RFC 7230 n'est que la révision de 2014. Telle quelle, la phrase laisse croire que HTTP/1.1 a été défini par la RFC 7230, ce qui est anachronique d'environ 17 ans. → *« Persistance définie avec HTTP/1.1 dès la RFC 2068 (1997), spécification révisée depuis (RFC 2616, 7230, aujourd'hui RFC 9112) ».*
- `src/pages/reseaux/partie-vi/http-web.mdx` : Le déroulé part de `https://exemple.fr` et ouvre TCP sur le port 443 (étape 2), mais omet le handshake TLS : sur le port 443, écrire `GET / HTTP/1.1` en clair directement sur le flux TCP ne fonctionne pas. La requête est émise à l'intérieur du tunnel TLS. Le report de TLS au chapitre suivant est signalé en fin de chapitre, mais pas dans le déroulé lui-même, qui décrit donc un enchaînement factuellement incomplet. → *Insérer une étape « 2 bis. Négocier TLS (objet du chapitre suivant) : le canal est chiffré avant tout octet HTTP », ou préciser à l'étape 3 « (à travers le tunnel TLS que le chapitre suivant explique) ».*
- `src/pages/reseaux/partie-vi/tls-securite.mdx` : Légèrement trop fort : la RFC 8446 conserve un mode PSK seul (reprise de session ou clé pré-partagée) qui n'utilise aucun échange Diffie-Hellman et n'offre pas de confidentialité persistante. L'obligation du (EC)DHE éphémère ne vaut que pour le handshake initial fondé sur certificat — le cas discuté ici, mais la formulation absolue est inexacte. → *« Pour un handshake initial avec certificat, TLS 1.3 n'autorise plus que l'échange Diffie-Hellman éphémère ; seul le mode PSK (reprise de session) peut s'en passer, au prix de la confidentialité persistante. »*
