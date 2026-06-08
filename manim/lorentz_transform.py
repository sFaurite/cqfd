"""Transformations de Galilée → Lorentz, et cisaillement de l'espace-temps.

Rendu : manim -qm manim/lorentz_transform.py LorentzTransform
"""
from manim import *
from theme import BLUE, YELLOW, RED, GREEN, TEXT, MUTED


class LorentzTransform(Scene):
    def construct(self):
        titre = Text("Des transformations de Galilée à Lorentz", color=TEXT, weight=BOLD).scale(0.7).to_edge(UP)
        self.play(FadeIn(titre, shift=DOWN * 0.3))

        gal = VGroup(
            Text("Galilée (v ≪ c)", color=MUTED).scale(0.5),
            MathTex(r"x' = x - v t", color=TEXT).scale(0.8),
            MathTex(r"t' = t", color=TEXT).scale(0.8),
        ).arrange(DOWN, buff=0.3).shift(LEFT * 3.5 + UP * 0.4)

        lor = VGroup(
            Text("Lorentz (toute vitesse)", color=BLUE).scale(0.5),
            MathTex(r"x' = \gamma\,(x - v t)", color=TEXT).scale(0.8),
            MathTex(r"t' = \gamma\left(t - \tfrac{v x}{c^2}\right)", color=TEXT).scale(0.8),
        ).arrange(DOWN, buff=0.3).shift(RIGHT * 3.5 + UP * 0.4)

        fleche = Arrow(gal.get_right(), lor.get_left(), color=YELLOW, buff=0.3)

        self.play(FadeIn(gal))
        self.play(GrowArrow(fleche))
        self.play(FadeIn(lor))
        # mettre en évidence γ et le terme nouveau
        self.play(
            lor[1][0][0:1].animate.set_color(YELLOW),
            lor[2][0][0:1].animate.set_color(YELLOW),
            run_time=0.8,
        )
        gamma = MathTex(r"\gamma=\frac{1}{\sqrt{1-v^2/c^2}}", color=YELLOW).scale(0.7).next_to(lor, DOWN, buff=0.4)
        self.play(Write(gamma))
        self.wait(1.2)

        # ---- cisaillement de l'espace-temps ----
        self.play(FadeOut(gal), FadeOut(fleche), FadeOut(lor), FadeOut(gamma), FadeOut(titre))
        plane = NumberPlane(
            x_range=[-6, 6, 1], y_range=[-3.5, 3.5, 1],
            background_line_style={"stroke_color": BLUE, "stroke_width": 1, "stroke_opacity": 0.4},
        )
        light1 = Line(plane.c2p(-4, -4), plane.c2p(4, 4), color=YELLOW, stroke_width=4)
        light2 = Line(plane.c2p(-4, 4), plane.c2p(4, -4), color=YELLOW, stroke_width=4)
        cap = Text("Boost : la grille se cisaille vers la ligne de lumière (45°, invariante)", color=MUTED).scale(0.45).to_edge(DOWN)
        self.play(Create(plane), Create(light1), Create(light2), FadeIn(cap))

        beta = 0.5
        gam = 1 / (1 - beta ** 2) ** 0.5
        # matrice de boost dans (x, ct)
        matrix = [[gam, beta * gam], [beta * gam, gam]]
        self.play(plane.animate.apply_matrix(matrix), run_time=2.2)
        self.wait(1.5)
