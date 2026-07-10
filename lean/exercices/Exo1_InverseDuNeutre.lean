/-!
# Exercice 1 — Le neutre est son propre inverse (théorème 5 du chapitre 14)

Remplacez le `sorry` final par une preuve. Sur le site, la preuve tient en une
ligne : « e·e = e dit que e est un inverse — des deux côtés — de e ; par
l'unicité (théorème 2), e⁻¹ = e. » Le théorème 2 vous est fourni ci-dessous.

Indice : `inverse_unique` attend une preuve de `b·a = e` et une de `a·b' = e` ;
ici `a := e`, `b := inv e`, `b' := e`. Les champs `inv_gauche` et
`neutre_gauche` de la structure fournissent exactement ces deux faits.
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

/-- **À vous** — théorème 5 : `e⁻¹ = e`. -/
theorem inverse_du_neutre : g.inv g.e = g.e := by
  sorry

end Groupe
