"""Recombinaison : le plasma opaque devient gaz transparent, le CMB est libéré.

Rendu : manim -qm manim/recombinaison_cmb.py RecombinaisonCMB
"""
from manim import *
from theme import BLUE, YELLOW, RED, GREEN, TEXT, MUTED


class RecombinaisonCMB(Scene):
    def construct(self):
        title = Text("Recombinaison : l'univers devient transparent", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # AVANT : plasma chaud — électrons libres (bleu) + protons (rouge).
        electrons = VGroup(*[Dot([x, y, 0], radius=0.05, color=BLUE)
                             for x, y in [(-4.2, 1.1), (-3.1, -0.3), (-2.0, 0.8), (-4.0, -0.9),
                                          (-2.8, 1.4), (-3.6, 0.3), (-2.3, -1.1)]])
        protons = VGroup(*[Dot([x, y, 0], radius=0.07, color=RED)
                           for x, y in [(-3.6, 0.9), (-2.5, -0.6), (-4.1, 0.1), (-2.9, 0.4),
                                        (-3.2, -1.0), (-2.1, 1.1)]])
        opaque_l = Text("plasma : photon piégé (opaque)", color=MUTED).scale(0.34).move_to([-3.1, -2.2, 0])
        self.play(FadeIn(electrons), FadeIn(protons), FadeIn(opaque_l))

        # Photon qui zigzague (diffusion Thomson), par déplacements successifs.
        photon = Dot(color=YELLOW, radius=0.085).move_to([-4.3, 0, 0])
        self.play(FadeIn(photon))
        for c in [[-3.7, 0.7, 0], [-3.2, -0.4, 0], [-2.7, 0.5, 0], [-2.3, -0.2, 0], [-2.0, 0.6, 0]]:
            self.play(photon.animate.move_to(c), run_time=0.32, rate_func=linear)
        self.wait(0.3)

        cool = Text("refroidissement  →", color=GREEN).scale(0.42).move_to([-0.35, 0, 0])
        self.play(FadeIn(cool))

        # APRÈS : atomes neutres (électron lié au proton).
        atoms = VGroup(*[VGroup(Dot([x, y, 0], radius=0.08, color=RED),
                                Circle(radius=0.16, color=BLUE).move_to([x, y, 0]))
                         for x, y in [(2.0, 1.0), (3.2, -0.2), (2.6, 0.4), (3.6, 0.9), (2.3, -1.0), (3.4, -1.1)]])
        transp_l = Text("atomes neutres : photons libres (CMB)", color=YELLOW).scale(0.34).move_to([3.0, -2.2, 0])
        self.play(FadeIn(atoms), FadeIn(transp_l))

        # Photons qui s'échappent tout droit (Dots filant vers la droite).
        free = VGroup(*[Dot([1.0, y, 0], radius=0.07, color=YELLOW) for y in [-0.6, 0.0, 0.6]])
        self.play(FadeIn(free))
        self.play(free.animate.shift(RIGHT * 3.4), run_time=1.7, rate_func=linear)
        self.wait(1.4)
