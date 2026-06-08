"""Le champ de Higgs comme « mélasse » : couplage fort → masse grande.

Rendu : manim -qm manim/higgs_field.py HiggsField
"""
from manim import *
from theme import YELLOW, PURPLE, TEAL, TEXT, MUTED


class HiggsField(Scene):
    def construct(self):
        titre = Text("Le champ de Higgs donne la masse", color=TEXT, weight=BOLD).scale(0.7).to_edge(UP)
        self.play(FadeIn(titre, shift=DOWN * 0.3))

        # fond : semis de points (le champ partout)
        champ = VGroup()
        for i in range(-6, 7):
            for j in range(-2, 3):
                champ.add(Dot([i * 1.0, j * 0.7 - 0.3, 0], radius=0.03, color=MUTED).set_opacity(0.4))
        legende = Text("champ de Higgs (partout)", color=MUTED).scale(0.4).to_corner(DR)
        self.play(FadeIn(champ), FadeIn(legende))

        x0 = -5.0
        x1 = 5.5
        lanes = [
            ("photon γ", 0.0, YELLOW),
            ("électron", 0.2, TEAL),
            ("quark top", 1.0, PURPLE),
        ]
        anims = []
        for k, (nom, g, col) in enumerate(lanes):
            yy = 1.4 - k * 1.4
            lab = Text(nom, color=TEXT).scale(0.45).move_to([x0 - 1.4, yy, 0])
            d = Dot([x0, yy, 0], color=col, radius=0.12 + g * 0.18)
            self.add(lab, d)
            self.play(FadeIn(lab), run_time=0.15)
            # durée ∝ (1 + 4g) : le top (g=1) rampe, le photon (g=0) file
            duree = 0.9 * (1.0 + 4.0 * g)
            anims.append(d.animate(run_time=duree, rate_func=linear).move_to([x1, yy, 0]))

        self.play(*anims)
        self.wait(0.3)

        concl = MathTex(r"\text{masse} \;\propto\; \text{couplage au champ}", color=YELLOW).scale(0.7).to_edge(DOWN)
        self.play(Write(concl))
        note = Text("(seulement pour les particules élémentaires)", color=MUTED).scale(0.4).next_to(concl, UP, buff=0.15)
        self.play(FadeIn(note))
        self.wait(1.8)
