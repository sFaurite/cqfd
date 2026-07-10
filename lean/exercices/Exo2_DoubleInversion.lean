/-!
# Exercice 2 — Inverser deux fois ramène au départ (théorème 6 du chapitre 14)

Remplacez le `sorry` final. Sur le site : « a·a⁻¹ = a⁻¹·a = e dit que a est un
inverse — des deux côtés — de a⁻¹ ; par l'unicité, (a⁻¹)⁻¹ = a. »

Indice : appliquez `inverse_unique` autour de `a⁻¹` : qui est inverse à gauche
de `a⁻¹` ? et `a` en est-il un inverse à droite ? Un seul champ de la structure
suffit… utilisé deux fois.
-/

structure Groupe (G : Type) where
  mul : G → G → G
  assoc : ∀ a b c : G, mul (mul a b) c = mul a (mul b c)
  e : G
  neutre_gauche : ∀ a : G, mul e a = a
  neutre_droit : ∀ a : G, mul a e = a
  inv : G → G
  inv_gauche : ∀ a : G, mul (inv a) a = e
  inv_droit : ∀ a : G, mul a (inv a) = e

namespace Groupe

variable {G : Type} (g : Groupe G)

/-- Théorème 2 du chapitre — l'inverse est unique (fourni). -/
theorem inverse_unique {a b b' : G}
    (h1 : g.mul b a = g.e) (h2 : g.mul a b' = g.e) : b = b' := by
  calc b = g.mul b g.e := (g.neutre_droit b).symm
    _ = g.mul b (g.mul a b') := by rw [h2]
    _ = g.mul (g.mul b a) b' := (g.assoc b a b').symm
    _ = g.mul g.e b' := by rw [h1]
    _ = b' := g.neutre_gauche b'

/-- **À vous** — théorème 6 : `(a⁻¹)⁻¹ = a`. -/
theorem inverse_inverse (a : G) : g.inv (g.inv a) = a := by
  sorry

end Groupe
