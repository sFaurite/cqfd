/**
 * Navigation du cours « La cosmologie, des premiers instants au monde actuel » —
 * SOURCE UNIQUE de l'ordre. Chemins NON préfixés : `index.ts` les préfixe par
 * `/cosmologie`. `num` court de 1 à 24 (les pages méta et annexes sont à 0).
 */
import type { Partie } from './_maths';

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce cours, et ce que signifient les encarts et les badges de fiabilité.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce cours', court: 'Comment lire ce cours', accroche: 'Les encarts dépliables, l’échelle de fiabilité cosmologique, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « observé », « concordant », « extrapolé », « spéculatif ».' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'Le cadre : un univers en expansion',
    accroche: 'Les hypothèses de départ (homogénéité, isotropie), la métrique FLRW et la loi de Hubble-Lemaître.',
    chapitres: [
      { slug: 'principe-cosmologique', path: '/partie-i/principe-cosmologique', num: 1, titre: 'Le principe cosmologique', court: 'Principe cosmologique', accroche: 'Homogénéité et isotropie de l’univers à grande échelle : posées en hypothèse, ancrées dans l’observation.' },
      { slug: 'relativite-cadre', path: '/partie-i/relativite-cadre', num: 2, titre: 'Ce qu’on admet de la relativité générale', court: 'Cadre relativiste', accroche: 'La gravité comme géométrie de l’espace-temps : le cadre que la cosmologie adopte, sans le redémontrer.' },
      { slug: 'metrique-flrw', path: '/partie-i/metrique-flrw', num: 3, titre: 'La métrique FLRW et le facteur d’échelle', court: 'Métrique FLRW', accroche: 'La géométrie d’un univers homogène et isotrope : facteur d’échelle $a(t)$ et courbure $k$.' },
      { slug: 'redshift-hubble', path: '/partie-i/redshift-hubble', num: 4, titre: 'Redshift cosmologique et loi de Hubble-Lemaître', court: 'Redshift & Hubble', accroche: 'L’expansion étire la lumière : redshift $z$, loi $v = H_0 d$, et ce qu’elle mesure vraiment.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'La dynamique : les équations de Friedmann',
    accroche: 'Comment le contenu de l’univers gouverne l’évolution du facteur d’échelle, et fixe son destin.',
    chapitres: [
      { slug: 'equations-friedmann', path: '/partie-ii/equations-friedmann', num: 5, titre: 'Les équations de Friedmann', court: 'Équations de Friedmann', accroche: 'Dérivation ligne à ligne par une coquille newtonienne, puis l’accord avec la relativité générale.' },
      { slug: 'contenu-univers', path: '/partie-ii/contenu-univers', num: 6, titre: 'Le contenu de l’univers : matière, rayonnement, Λ', court: 'Contenu de l’univers', accroche: 'Équations d’état et dilution : comment $\\rho$ évolue avec $a$ pour chaque composante.' },
      { slug: 'parametres-densite', path: '/partie-ii/parametres-densite', num: 7, titre: 'Densité critique et paramètres Ω', court: 'Paramètres Ω', accroche: 'La densité critique, les $\\Omega$, et le lien entre densité totale et géométrie de l’univers.' },
      { slug: 'destin-univers', path: '/partie-ii/destin-univers', num: 8, titre: 'Le destin de l’univers', court: 'Destin de l’univers', accroche: 'Selon son contenu : recontraction, expansion éternelle, ou accélération.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'L’univers chaud primordial',
    accroche: 'Remonter le temps revient à chauffer l’univers : nucléosynthèse, recombinaison et fond diffus.',
    chapitres: [
      { slug: 'univers-chaud', path: '/partie-iii/univers-chaud', num: 9, titre: 'L’univers chaud : remonter le temps, c’est chauffer', court: 'Univers chaud', accroche: 'L’équilibre thermique du plasma primordial : une nouvelle hypothèse, la thermodynamique cosmique.' },
      { slug: 'nucleosynthese', path: '/partie-iii/nucleosynthese', num: 10, titre: 'La nucléosynthèse primordiale (BBN)', court: 'Nucléosynthèse', accroche: 'Les trois premières minutes : abondances primordiales d’hydrogène, d’hélium et de lithium.' },
      { slug: 'recombinaison-cmb', path: '/partie-iii/recombinaison-cmb', num: 11, titre: 'Recombinaison et fond diffus cosmologique', court: 'Recombinaison & CMB', accroche: 'Le découplage matière-rayonnement libère le CMB : la plus vieille lumière observable.' },
      { slug: 'anisotropies-cmb', path: '/partie-iii/anisotropies-cmb', num: 12, titre: 'Les anisotropies du fond diffus', court: 'Anisotropies du CMB', accroche: 'Les minuscules fluctuations du CMB et comment elles fixent les paramètres cosmologiques.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Les premiers instants',
    accroche: 'Les énigmes du Big Bang chaud, l’inflation, et l’origine quantique des structures.',
    chapitres: [
      { slug: 'problemes-big-bang', path: '/partie-iv/problemes-big-bang', num: 13, titre: 'Les problèmes du Big Bang chaud', court: 'Problèmes du Big Bang', accroche: 'Horizon, platitude, monopôles : trois ajustements fins qui réclament une explication.' },
      { slug: 'inflation', path: '/partie-iv/inflation', num: 14, titre: 'L’inflation cosmique', court: 'Inflation', accroche: 'Une expansion exponentielle dans la première fraction de seconde : le champ d’inflaton.' },
      { slug: 'fluctuations-primordiales', path: '/partie-iv/fluctuations-primordiales', num: 15, titre: 'Les fluctuations primordiales', court: 'Fluctuations primordiales', accroche: 'Comment des fluctuations quantiques étirées par l’inflation deviennent les graines des galaxies.' },
      { slug: 'baryogenese', path: '/partie-iv/baryogenese', num: 16, titre: 'La baryogenèse', court: 'Baryogenèse', accroche: 'Pourquoi reste-t-il de la matière ? L’asymétrie matière-antimatière et les conditions de Sakharov.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'La formation des structures',
    accroche: 'De petites surdensités aux galaxies et amas : gravité, matière noire et énergie noire.',
    chapitres: [
      { slug: 'instabilite-jeans', path: '/partie-v/instabilite-jeans', num: 17, titre: 'L’instabilité gravitationnelle de Jeans', court: 'Instabilité de Jeans', accroche: 'Comment une surdensité s’effondre, et comment les perturbations croissent dans un univers en expansion.' },
      { slug: 'matiere-noire', path: '/partie-v/matiere-noire', num: 18, titre: 'La matière noire', court: 'Matière noire', accroche: 'Courbes de rotation, lentilles gravitationnelles, CMB : un faisceau de preuves convergentes.' },
      { slug: 'toile-cosmique', path: '/partie-v/toile-cosmique', num: 19, titre: 'La toile cosmique', court: 'Toile cosmique', accroche: 'Filaments, amas et vides : les grandes structures et ce que les simulations reproduisent.' },
      { slug: 'energie-noire', path: '/partie-v/energie-noire', num: 20, titre: 'L’énergie noire', court: 'Énergie noire', accroche: 'L’expansion accélère : supernovæ de type Ia, constante cosmologique Λ et énergie du vide.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Concordance et questions ouvertes',
    accroche: 'Le modèle standard ΛCDM, ses tensions, ses frontières — et la synthèse déductive du cours.',
    chapitres: [
      { slug: 'modele-lcdm', path: '/partie-vi/modele-lcdm', num: 21, titre: 'Le modèle de concordance ΛCDM', court: 'Modèle ΛCDM', accroche: 'Six paramètres qui ajustent l’ensemble des observations : la synthèse du modèle standard.' },
      { slug: 'tensions-cosmologiques', path: '/partie-vi/tensions-cosmologiques', num: 22, titre: 'Les tensions cosmologiques', court: 'Tensions cosmologiques', accroche: 'La tension de Hubble ($H_0$) et la tension $S_8$ : des fissures dans le modèle de concordance ?' },
      { slug: 'questions-ouvertes', path: '/partie-vi/questions-ouvertes', num: 23, titre: 'Les questions ouvertes', court: 'Questions ouvertes', accroche: 'Nature de la matière et de l’énergie noires, avant le temps de Planck, le multivers.' },
      { slug: 'synthese', path: '/partie-vi/synthese', num: 24, titre: 'Synthèse : de l’hypothèse d’homogénéité au monde actuel', court: 'Synthèse', accroche: 'Le récapitulatif déductif : ce qu’on a posé, ce qu’on a déduit, ce qu’on a observé.' },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des symboles.',
    chapitres: [
      { slug: 'glossaire', path: '/glossaire', num: 0, titre: 'Glossaire', court: 'Glossaire', accroche: 'Tous les termes techniques, reliés à leur page.' },
      { slug: 'symboles', path: '/symboles', num: 0, titre: 'Index des symboles', court: 'Index des symboles', accroche: 'Chaque symbole et grandeur, avec sa valeur et son statut.' },
    ],
  },
];
