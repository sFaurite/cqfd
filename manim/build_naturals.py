"""Construction des entiers naturels (von Neumann) : 0 = ∅, S(n) = n ∪ {n}.

Rendu : manim -qm manim/build_naturals.py BuildNaturals
"""
from manim import *
from theme import BLUE, YELLOW, GREEN, TEXT, MUTED


class BuildNaturals(Scene):
    def construct(self):
        titre = Text("Construire ℕ à partir du vide", color=TEXT, weight=BOLD).scale(0.7).to_edge(UP)
        regle = MathTex(r"0 = \varnothing \qquad S(n) = n \cup \{n\}", color=YELLOW).scale(0.85)
        regle.next_to(titre, DOWN, buff=0.4)
        self.play(FadeIn(titre, shift=DOWN * 0.3))
        self.play(Write(regle))
        self.wait(0.4)

        notations = [
            r"0 = \varnothing",
            r"1 = \{\varnothing\}",
            r"2 = \{\varnothing,\ \{\varnothing\}\}",
            r"3 = \{\varnothing,\ \{\varnothing\},\ \{\varnothing,\{\varnothing\}\}\}",
        ]
        note = MathTex(notations[0], color=BLUE).scale(0.8).move_to(UP * 0.5)
        count = Text("0 élément", color=MUTED).scale(0.5).next_to(note, DOWN, buff=0.9)
        self.play(Write(note))
        self.play(FadeIn(count))

        for k in range(1, 4):
            new_note = MathTex(notations[k], color=BLUE).scale(0.8).move_to(UP * 0.5)
            new_count = Text(f"{k} élément" + ("s" if k > 1 else ""), color=MUTED).scale(0.5).next_to(new_note, DOWN, buff=0.9)
            self.play(ReplacementTransform(note, new_note), ReplacementTransform(count, new_count), run_time=1.0)
            note, count = new_note, new_count
            self.wait(0.35)

        concl = Text("et ainsi de suite : n = {0, 1, …, n−1}", color=GREEN).scale(0.5).to_edge(DOWN, buff=0.6)
        self.play(FadeIn(concl))
        self.wait(2)
