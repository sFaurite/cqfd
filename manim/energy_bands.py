"""Des niveaux d'énergie discrets aux bandes d'un solide.

Rendu : manim -qm manim/energy_bands.py EnergyBands
"""
from manim import *
from theme import BLUE, YELLOW, GREEN, TEAL, TEXT, MUTED


class EnergyBands(Scene):
    def construct(self):
        title = Text("Des niveaux discrets aux bandes d'énergie", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # niveaux discrets d'un atome isolé
        levels = VGroup(*[Line([-5.2, y, 0], [-3.6, y, 0], color=BLUE) for y in [-1.6, -0.7, 0.4, 1.3]])
        atom_l = Text("1 atome : niveaux discrets", color=MUTED).scale(0.32).move_to([-4.4, -2.2, 0])
        self.play(Create(levels), FadeIn(atom_l))
        self.wait(0.6)

        arrow = Text("N atomes  →", color=MUTED).scale(0.4).move_to([-1.9, 0.0, 0])
        self.play(FadeIn(arrow))

        valence = Rectangle(width=3.4, height=1.1, color=BLUE, fill_opacity=0.5).move_to([1.4, -1.0, 0])
        conduction = Rectangle(width=3.4, height=1.1, color=TEAL, fill_opacity=0.12).move_to([1.4, 1.0, 0])
        v_l = Text("bande de valence (pleine)", color=BLUE).scale(0.30).next_to(valence, DOWN, buff=0.12)
        c_l = Text("bande de conduction (vide)", color=TEAL).scale(0.30).next_to(conduction, UP, buff=0.12)
        self.play(FadeIn(valence), FadeIn(conduction), FadeIn(v_l), FadeIn(c_l))

        brace = BraceBetweenPoints([3.2, -0.45, 0], [3.2, 0.45, 0], direction=RIGHT, color=YELLOW)
        eg = MathTex(r"E_g", color=YELLOW).scale(0.7).next_to(brace, RIGHT, buff=0.15)
        self.play(GrowFromCenter(brace), Write(eg))
        self.wait(0.6)

        cls = Text("Grand gap → isolant      Petit gap → semiconducteur", color=TEXT).scale(0.40).to_edge(DOWN)
        self.play(Write(cls))
        self.wait(1.2)

        # conducteur : les bandes se chevauchent
        self.play(
            conduction.animate.move_to([1.4, -0.4, 0]).set_fill(TEAL, 0.3),
            FadeOut(brace), FadeOut(eg),
        )
        cond = Text("Bandes qui se chevauchent → conducteur", color=GREEN).scale(0.42).to_edge(DOWN)
        self.play(ReplacementTransform(cls, cond))
        self.wait(1.2)
