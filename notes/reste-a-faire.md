# Reste à faire — cours de maths (état au 11 juillet 2026, après le pilote)

## Relectures par sous-agents : étendre aux 13 chapitres restants

Le pilote (ch. 2, 9, 10, 11, 12) est intégré et publié : 5 rapports dans
`notes/relectures/`, 9 commits (d2d69e6..5f02424), ~101 constats pris sur 113,
0 répercussion ch. 25/27 nécessaire. Le prompt `notes/prompt-relecture-agent.md`
est validé tel quel — quasi aucun faux positif, les rustines ★ ont attrapé
l'angle mort produit-coupure (facture du ch. 8).

**À relire : ch. 15 à 27** (13 chapitres). État exact du ch. 16 à vérifier —
le plan du pilote le disait « déjà fait », la mémoire de la campagne n°2 non ;
indice consigné pour le ch. 16 : la formation des graphes renvoie à la
charpente du ch. 6 (annoncée pour ℤ/nℤ). Les lourds d'abord : 22, 24, 25.

Leçons du pilote pour l'orchestrateur du prochain lot :

1. Lancer par vagues de ~5 agents xhigh en parallèle (~30 min, ~800k tokens).
2. **Traiter les retouches amont partagées avant les commits de chapitres**
   (au pilote : lemmes de composition au ch. 3, compatibilité/simplification
   de l'ordre au ch. 5, neutre multiplicatif au ch. 8) — plusieurs rapports
   convergent souvent vers la même lacune amont.
3. Vérifier le **point d'insertion** des propositions sur pièces : deux fois
   sur cinq rapports, la proposition visait le mauvais endroit (insertion
   avant la définition de ≤ ; renvoi vers le ch. 6 au lieu du ch. 5).
4. Un commit par chapitre, décisions prendre/adapter/refuser motivées dans le
   message ; badge rouge ou dette qui bouge ⇒ répercuter ch. 25 (solde) et
   ch. 27 (synthèse) — au pilote, rien n'a bougé, mais les ch. 15-27
   contiennent la comptabilité elle-même : vigilance accrue.
5. Build + contrôle KaTeX (`grep -c katex-error`) après chaque chapitre ;
   attention aux apostrophes typographiques dans les grep de vérification.

## Divers (hors relecture)

- Warning KaTeX du build : `a = \mathrm{identité}` en mode math dans
  `src/pages/ia/partie-i/regression-lineaire.mdx` l. 20 (cours d'IA, antérieur
  au pilote) — une retouche d'un mot quand on repassera sur ce cours.
- Page récapitulative `/maths/exercices` : à maintenir quand un atelier s'ajoute.
- Certificat Lean (ch. 14) : rêve d'extension lean4game consigné dans la mémoire
  `mode-exercice-lean`.
