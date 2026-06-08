"""La frise thermique : remonter le temps revient à chauffer l'univers.

Rendu : manim -qm manim/histoire_thermique.py HistoireThermique
"""
from manim import *
from theme import BLUE, YELLOW, RED, GREEN, ORANGE, TEXT


class HistoireThermique(Scene):
    def construct(self):
        title = Text("Remonter le temps, c'est chauffer l'univers", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        axis = Line([-6, 0, 0], [6, 0, 0]).set_stroke(width=5)
        axis.set_color(color=[BLUE, YELLOW, ORANGE, RED])
        self.play(Create(axis))

        left = Text("plus tôt / plus chaud", color=RED).scale(0.34).next_to(axis, LEFT, buff=0.1).shift(UP * 0.45)
        right = Text("aujourd'hui / froid", color=BLUE).scale(0.34).next_to(axis, RIGHT, buff=0.1).shift(UP * 0.45)
        self.play(FadeIn(left), FadeIn(right))

        events = [
            (-5.2, "Planck", "10^{32}\\,K", UP),
            (-3.6, "Inflation", "10^{28}\\,K", DOWN),
            (-1.4, "Nucléosynthèse", "10^{9}\\,K", UP),
            (0.6, "Recombinaison (CMB)", "3000\\,K", DOWN),
            (3.0, "Premières étoiles", "50\\,K", UP),
            (5.2, "Aujourd'hui", "2{,}7\\,K", DOWN),
        ]
        marks = VGroup()
        for x, name, temp, d in events:
            dot = Dot([x, 0, 0], radius=0.07, color=TEXT)
            nm = Text(name, color=TEXT).scale(0.3).next_to(dot, d, buff=0.18)
            tp = MathTex(temp, color=YELLOW).scale(0.42).next_to(nm, d, buff=0.07)
            marks.add(VGroup(dot, nm, tp))
        for m in marks:
            self.play(FadeIn(m), run_time=0.45)
        self.wait(0.5)

        # Curseur qui balaie du chaud vers le froid.
        cursor = Triangle(color=GREEN).scale(0.16).rotate(PI).move_to([-5.2, 0.35, 0])
        self.play(FadeIn(cursor))
        self.play(cursor.animate.move_to([5.2, 0.35, 0]), run_time=3.2, rate_func=linear)
        self.wait(1.2)
