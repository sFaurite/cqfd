"""L'expansion de l'univers : une grille comobile se dilate, la lumière s'étire.

Rendu : manim -qm manim/expansion_univers.py ExpansionUnivers
"""
from manim import *
from theme import BLUE, YELLOW, RED, PURPLE, TEXT, MUTED


class ExpansionUnivers(Scene):
    def construct(self):
        title = Text("L'expansion : l'espace se dilate entre les galaxies", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # Grille de galaxies (points comobiles).
        dots = VGroup()
        for i in range(-2, 3):
            for j in range(-1, 2):
                d = Dot([i * 0.9, j * 0.9, 0], radius=0.06, color=PURPLE)
                dots.add(d)
        # « nous » au centre.
        home = Dot([0, 0, 0], radius=0.09, color=YELLOW)
        home_l = Text("nous", color=YELLOW).scale(0.32).next_to(home, UP, buff=0.12)
        grid = VGroup(dots, home).move_to([0, 0.6, 0])
        home_l.next_to(grid[1], UP, buff=0.12)
        self.play(LaggedStartMap(FadeIn, dots, lag_ratio=0.03), FadeIn(home), FadeIn(home_l))
        self.wait(0.4)

        # Une onde lumineuse courte, en bas.
        wave_emis = FunctionGraph(lambda x: 0.22 * np.sin(8 * x), x_range=[-3, 3], color=RED).move_to([0, -2.2, 0])
        lbl = Text("lumière émise", color=MUTED).scale(0.32).next_to(wave_emis, UP, buff=0.1)
        self.play(Create(wave_emis), FadeIn(lbl))

        # Dilatation : la grille grandit, l'onde s'étire (longueur d'onde ×2).
        wave_obs = FunctionGraph(lambda x: 0.22 * np.sin(4 * x), x_range=[-3, 3], color=RED).move_to([0, -2.2, 0])
        z_lbl = MathTex(r"z = \tfrac{1}{a} - 1", color=YELLOW).scale(0.7).to_corner(DR)
        self.play(
            grid.animate.scale(1.7),
            home_l.animate.shift(UP * 0.5),
            Transform(wave_emis, wave_obs),
            Transform(lbl, Text("longueur d'onde étirée → redshift", color=RED).scale(0.32).move_to([0, -1.5, 0])),
            FadeIn(z_lbl),
            run_time=3,
        )
        self.wait(1.2)

        note = Text("Ce n'est pas un mouvement DANS l'espace : c'est l'espace qui grandit.",
                    color=TEXT).scale(0.4).to_edge(DOWN)
        self.play(Write(note))
        self.wait(1.5)
