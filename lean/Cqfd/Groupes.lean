/-!
# Certificat machine du chapitre 14 — « Les groupes : la symétrie axiomatisée »

Ce fichier formalise en Lean 4 (sans Mathlib) le cœur déductif du chapitre :
la définition du groupe, les six micro-théorèmes, et le critère du sous-groupe.
Chaque théorème porte le numéro qu'il a dans le chapitre.

**Honnêteté fondationnelle** (l'équivalent du Tournant du cours) : Lean repose
sur la théorie des types dépendants, pas sur ZF. Vérifier le chapitre ici,
c'est le vérifier *dans un autre système fondationnel* — la confiance est
déplacée, pas éliminée. Par ailleurs la structure ci-dessous donne le neutre
`e` et l'inverse `inv` comme *données* plutôt que par `∃` : c'est légitime
précisément parce que les théorèmes 1 et 2 démontrent leur unicité.
-/

namespace Cqfd

/-- Un groupe, comme au chapitre 14 : une loi interne, (G1) l'associativité,
puis — portée du quantificateur soignée — un neutre `e` vérifiant à la fois
(G2) la neutralité et (G3) l'existence des inverses. -/
structure Groupe (G : Type) where
  mul : G → G → G
  /-- (G1) associativité -/
  assoc : ∀ a b c : G, mul (mul a b) c = mul a (mul b c)
  e : G
  /-- (G2) `e` est neutre à gauche -/
  neutre_gauche : ∀ a : G, mul e a = a
  /-- (G2) `e` est neutre à droite -/
  neutre_droit : ∀ a : G, mul a e = a
  inv : G → G
  /-- (G3) inverse à gauche -/
  inv_gauche : ∀ a : G, mul (inv a) a = e
  /-- (G3) inverse à droite -/
  inv_droit : ∀ a : G, mul a (inv a) = e

namespace Groupe

variable {G : Type} (g : Groupe G)

/-- **Théorème 1 — le neutre est unique.** Tout neutre à gauche `e'` est `e`.
La preuve du chapitre : `e' = e'·e` (e neutre à droite) `= e` (e' neutre à gauche). -/
theorem neutre_unique (e' : G) (h : ∀ a : G, g.mul e' a = a) : e' = g.e := by
  calc e' = g.mul e' g.e := (g.neutre_droit e').symm
    _ = g.e := h g.e

/-- **Théorème 2 — l'inverse est unique.** Comme au chapitre, la preuve
n'utilise que : `b` inverse à gauche, `b'` inverse à droite —
`b = b·e = b·(a·b') = (b·a)·b' = e·b' = b'`. C'est ce théorème qui autorise
à noter `a⁻¹` *l'*inverse, et il exige un inverse **des deux côtés** —
la finesse relevée à la relecture du chapitre. -/
theorem inverse_unique {a b b' : G}
    (h1 : g.mul b a = g.e) (h2 : g.mul a b' = g.e) : b = b' := by
  calc b = g.mul b g.e := (g.neutre_droit b).symm
    _ = g.mul b (g.mul a b') := by rw [h2]
    _ = g.mul (g.mul b a) b' := (g.assoc b a b').symm
    _ = g.mul g.e b' := by rw [h1]
    _ = b' := g.neutre_gauche b'

/-- **Théorème 3 — on peut simplifier (à gauche).**
`a·x = a·y ⟹ x = y`, en multipliant à gauche par `a⁻¹`. -/
theorem simplification {a x y : G} (h : g.mul a x = g.mul a y) : x = y := by
  calc x = g.mul g.e x := (g.neutre_gauche x).symm
    _ = g.mul (g.mul (g.inv a) a) x := by rw [g.inv_gauche a]
    _ = g.mul (g.inv a) (g.mul a x) := g.assoc _ _ _
    _ = g.mul (g.inv a) (g.mul a y) := by rw [h]
    _ = g.mul (g.mul (g.inv a) a) y := (g.assoc _ _ _).symm
    _ = g.mul g.e y := by rw [g.inv_gauche a]
    _ = y := g.neutre_gauche y

/-- **Théorème 4 — l'inverse d'un produit renverse l'ordre.**
`(a·b)⁻¹ = b⁻¹·a⁻¹`, par l'unicité (théorème 2). -/
theorem inverse_produit (a b : G) :
    g.inv (g.mul a b) = g.mul (g.inv b) (g.inv a) := by
  have h1 : g.mul (g.inv (g.mul a b)) (g.mul a b) = g.e := g.inv_gauche _
  have h2 : g.mul (g.mul a b) (g.mul (g.inv b) (g.inv a)) = g.e := by
    calc g.mul (g.mul a b) (g.mul (g.inv b) (g.inv a))
        = g.mul a (g.mul b (g.mul (g.inv b) (g.inv a))) := g.assoc _ _ _
      _ = g.mul a (g.mul (g.mul b (g.inv b)) (g.inv a)) := by rw [g.assoc]
      _ = g.mul a (g.mul g.e (g.inv a)) := by rw [g.inv_droit b]
      _ = g.mul a (g.inv a) := by rw [g.neutre_gauche]
      _ = g.e := g.inv_droit a
  exact g.inverse_unique h1 h2

/-- **Théorème 5 — le neutre est son propre inverse.** `e·e = e` dit que `e`
est un inverse (des deux côtés) de `e` ; l'unicité conclut. -/
theorem inverse_du_neutre : g.inv g.e = g.e :=
  g.inverse_unique (g.inv_gauche g.e) (g.neutre_gauche g.e)

/-- **Théorème 6 — inverser deux fois ramène au départ.** `a` est un inverse
de `a⁻¹` ; l'unicité conclut. -/
theorem inverse_inverse (a : G) : g.inv (g.inv a) = a :=
  g.inverse_unique (g.inv_gauche (g.inv a)) (g.inv_gauche a)

/-- Être un sous-groupe : contenir `e`, être stable par produit et par inverse
— la définition du chapitre. -/
def EstSousGroupe (S : G → Prop) : Prop :=
  S g.e ∧ (∀ a b : G, S a → S b → S (g.mul a b)) ∧ (∀ a : G, S a → S (g.inv a))

/-- **Critère du sous-groupe, sens réciproque** : si `S` est non vide et
vérifie `(⋆) : a, b ∈ S ⟹ a·b⁻¹ ∈ S`, alors `S` est un sous-groupe.
Les trois étapes du chapitre, dans l'ordre — et l'étape 3 utilise la double
inversion (théorème 6), citation posée par la relecture. -/
theorem critere {S : G → Prop} (hne : ∃ x, S x)
    (hstar : ∀ a b : G, S a → S b → S (g.mul a (g.inv b))) :
    g.EstSousGroupe S := by
  cases hne with
  | intro x hx =>
    -- Étape 1 : e = x·x⁻¹ ∈ S
    have he : S g.e := by
      have h := hstar x x hx hx
      rwa [g.inv_droit x] at h
    -- Étape 2 : a⁻¹ = e·a⁻¹ ∈ S
    have hinv : ∀ a : G, S a → S (g.inv a) := by
      intro a ha
      have h := hstar g.e a he ha
      rwa [g.neutre_gauche] at h
    -- Étape 3 : a·b = a·(b⁻¹)⁻¹ ∈ S (double inversion, théorème 6)
    refine ⟨he, ?_, hinv⟩
    intro a b ha hb
    have h := hstar a (g.inv b) ha (hinv b hb)
    rwa [g.inverse_inverse b] at h

/-- **Critère du sous-groupe, sens direct** : un sous-groupe est non vide et
vérifie `(⋆)` — « immédiat », dit le chapitre ; le voici quand même. -/
theorem critere_direct {S : G → Prop} (hsg : g.EstSousGroupe S) :
    (∃ x, S x) ∧ ∀ a b : G, S a → S b → S (g.mul a (g.inv b)) := by
  refine ⟨⟨g.e, hsg.1⟩, ?_⟩
  intro a b ha hb
  exact hsg.2.1 a (g.inv b) ha (hsg.2.2 b hb)

end Groupe

end Cqfd
