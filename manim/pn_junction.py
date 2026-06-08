"""La jonction PN : un courant à sens unique.

Rendu : manim -qm manim/pn_junction.py PNJunction
"""
from manim import *
from theme import BLUE, RED, GREEN, MUTED, TEXT


class PNJunction(Scene):
    def construct(self):
        title = Text("La jonction PN : un courant à sens unique", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        P = Rectangle(width=3.0, height=2.0, color=RED, fill_opacity=0.16).move_to([-2.2, -0.3, 0])
        N = Rectangle(width=3.0, height=2.0, color=BLUE, fill_opacity=0.16).move_to([2.2, -0.3, 0])
        P_l = Text("P (trous +)", color=RED).scale(0.40).next_to(P, UP, buff=0.12)
        N_l = Text("N (électrons −)", color=BLUE).scale(0.40).next_to(N, UP, buff=0.12)
        plus = VGroup(*[Text("+", color=RED).scale(0.42).move_to([x, y, 0])
                        for x in [-3.2, -2.4, -1.7] for y in [-0.9, -0.3, 0.3]])
        minus = VGroup(*[Text("−", color=BLUE).scale(0.42).move_to([x, y, 0])
                         for x in [1.7, 2.4, 3.2] for y in [-0.9, -0.3, 0.3]])
        self.play(FadeIn(P), FadeIn(N), FadeIn(P_l), FadeIn(N_l), FadeIn(plus), FadeIn(minus))

        dep = Rectangle(width=1.1, height=2.0, color=MUTED, fill_opacity=0.28).move_to([0, -0.3, 0])
        dep_l = Text("zone de déplétion", color=MUTED).scale(0.32).move_to([0, -1.7, 0])
        self.play(FadeIn(dep), FadeIn(dep_l))
        self.wait(0.6)

        st = Text("Sans polarisation directe : bloqué", color=RED).scale(0.44).to_edge(DOWN)
        self.play(Write(st))
        self.wait(1.0)

        st2 = Text("Polarisation directe : la déplétion se réduit, le courant passe", color=GREEN).scale(0.40).to_edge(DOWN)
        self.play(ReplacementTransform(st, st2), dep.animate.stretch_to_fit_width(0.3))
        for _ in range(2):
            e = VGroup(*[Dot([1.4 - i * 0.5, 0.0, 0], radius=0.05, color=BLUE) for i in range(4)])
            self.add(e)
            self.play(e.animate.shift(LEFT * 2.6), run_time=1.0, rate_func=linear)
            self.remove(e)
        self.wait(0.8)
