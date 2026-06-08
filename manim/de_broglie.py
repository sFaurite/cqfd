"""Onde de de Broglie : λ = h/p. Plus la particule va vite, plus λ est courte.

Rendu : manim -qm manim/de_broglie.py DeBroglie
"""
from manim import *
from theme import BLUE, YELLOW, RED, TEXT, MUTED


class DeBroglie(Scene):
    def construct(self):
        titre = MathTex(r"\lambda = \frac{h}{p}", color=TEXT).scale(1.0).to_edge(UP)
        self.play(Write(titre))

        ax = Axes(
            x_range=[0, 10, 1], y_range=[-1.6, 1.6, 1], x_length=10, y_length=3.2,
            axis_config={"color": MUTED, "include_tip": False, "include_ticks": False},
        ).shift(DOWN * 0.3)
        self.play(Create(ax))

        k = ValueTracker(1.2)  # nombre d'onde (∝ p)

        def make_wave():
            return ax.plot(lambda x: np.cos(k.get_value() * x), color=BLUE, x_range=[0, 10])

        wave = always_redraw(make_wave)
        dot = always_redraw(lambda: Dot(ax.c2p(0, np.cos(0)), color=RED, radius=0.12))
        self.add(wave, dot)

        lab_lent = Text("électron lent  →  grande longueur d'onde", color=MUTED).scale(0.5).to_edge(DOWN)
        self.play(FadeIn(lab_lent))
        self.wait(1.0)

        lab_rapide = Text("électron rapide  →  p grand  →  λ petite", color=YELLOW).scale(0.5).to_edge(DOWN)
        self.play(ReplacementTransform(lab_lent, lab_rapide))
        self.play(k.animate.set_value(5.5), run_time=2.5)
        self.wait(0.5)
        rel = Text("(p = m v : accélérer comprime l'onde)", color=MUTED).scale(0.4).next_to(lab_rapide, UP, buff=0.15)
        self.play(FadeIn(rel))
        self.wait(1.8)
