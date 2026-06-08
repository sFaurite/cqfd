"""E² = (mc²)² + (pc)² comme triangle rectangle, avec les cas limites.

Rendu : manim -qm manim/energy_triangle.py EnergyTriangle
"""
from manim import *
from theme import BLUE, YELLOW, GREEN, TEXT, MUTED


class EnergyTriangle(Scene):
    def construct(self):
        titre = MathTex(r"E^2 = (mc^2)^2 + (pc)^2", color=TEXT).scale(0.95).to_edge(UP)
        self.play(Write(titre))

        # triangle rectangle
        O = LEFT * 2.5 + DOWN * 1.5
        a = 4.0  # mc^2 (horizontal)
        b = 2.6  # pc (vertical)
        A = O + RIGHT * a
        B = O + UP * b

        horiz = Line(O, A, color=GREEN, stroke_width=6)
        vert = Line(O, B, color=BLUE, stroke_width=6)
        hyp = Line(A, B, color=YELLOW, stroke_width=6)
        right = Square(side_length=0.3, color=MUTED).move_to(O + RIGHT * 0.15 + UP * 0.15)

        l_h = MathTex(r"mc^2", color=GREEN).scale(0.7).next_to(horiz, DOWN)
        l_v = MathTex(r"pc", color=BLUE).scale(0.7).next_to(vert, LEFT)
        l_hyp = MathTex(r"E", color=YELLOW).scale(0.8).next_to(hyp.get_center(), UR, buff=0.15)

        self.play(Create(horiz), FadeIn(l_h))
        self.play(Create(vert), FadeIn(l_v))
        self.play(Create(hyp), FadeIn(l_hyp), Create(right))
        self.wait(0.8)

        tri = VGroup(horiz, vert, hyp, right, l_h, l_v, l_hyp)

        # cas limite 1 : m -> 0  =>  E = pc
        cas1 = MathTex(r"m \to 0 \;\Rightarrow\; E = pc", color=YELLOW).scale(0.7).to_edge(DOWN)
        self.play(Write(cas1))
        horiz2 = Line(O, O + RIGHT * 0.05, color=GREEN, stroke_width=6)
        A2 = O + RIGHT * 0.05
        self.play(
            Transform(horiz, horiz2),
            Transform(hyp, Line(A2, B, color=YELLOW, stroke_width=6)),
            l_h.animate.set_opacity(0.2),
            run_time=1.4,
        )
        self.wait(1.0)

        # retour, puis cas limite 2 : p -> 0  =>  E = mc^2
        self.play(
            Transform(horiz, Line(O, A, color=GREEN, stroke_width=6)),
            Transform(hyp, Line(A, B, color=YELLOW, stroke_width=6)),
            l_h.animate.set_opacity(1),
        )
        cas2 = MathTex(r"p \to 0 \;\Rightarrow\; E = mc^2", color=YELLOW).scale(0.7).to_edge(DOWN)
        self.play(ReplacementTransform(cas1, cas2))
        B2 = O + UP * 0.05
        self.play(
            Transform(vert, Line(O, B2, color=BLUE, stroke_width=6)),
            Transform(hyp, Line(A, B2, color=YELLOW, stroke_width=6)),
            l_v.animate.set_opacity(0.2),
            run_time=1.4,
        )
        self.wait(1.5)
