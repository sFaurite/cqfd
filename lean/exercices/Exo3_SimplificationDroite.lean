/-!
# Exercice 3 — La simplification à droite (celle que le cours a refusée !)

Le chapitre 14 démontre la simplification à GAUCHE (théorème 3) et n'a jamais
eu besoin de sa jumelle à droite — la relecture l'a vérifié : elle n'est
utilisée nulle part, donc le cours ne la pose pas. Elle fait en revanche un
excellent exercice : à vous de montrer `x·a = y·a ⟹ x = y`.

Indice : imitez la preuve du théorème 3 du chapitre, mais en multipliant par
`a⁻¹` à DROITE : `x = x·e = x·(a·a⁻¹) = (x·a)·a⁻¹ = (y·a)·a⁻¹ = … = y`.
Un `calc` de sept lignes, comme sur le site.
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

/-- **À vous** — la simplification à droite : `x·a = y·a ⟹ x = y`. -/
theorem simplification_droite {a x y : G}
    (h : g.mul x a = g.mul y a) : x = y := by
  sorry

end Groupe
