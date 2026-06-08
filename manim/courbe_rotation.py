"""Courbe de rotation : visible (déclin képlérien) vs observé (plat) → halo.

Rendu : manim -qm manim/courbe_rotation.py CourbeRotation
"""
from manim import *
from theme import BLUE, YELLOW, ORANGE, TEXT, MUTED


class CourbeRotation(Scene):
    def construct(self):
        title = Text("Courbes de rotation : la preuve de la matière noire", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        ax = Axes(
            x_range=[0, 10, 2], y_range=[0, 2.4, 1], x_length=8.6, y_length=4.4,
            axis_config={"color": MUTED, "include_tip": True},
        ).shift(DOWN * 0.4)
        x_lbl = Text("rayon r", color=MUTED).scale(0.36).next_to(ax.x_axis, RIGHT, buff=0.1)
        y_lbl = Text("vitesse v", color=MUTED).scale(0.36).next_to(ax.y_axis, UP, buff=0.1)
        self.play(Create(ax), FadeIn(x_lbl), FadeIn(y_lbl))

        # Visible seul : monte puis décline en 1/sqrt(r).
        def vis(r):
            m = r ** 3 / (r ** 3 + 1.6 ** 3)
            return 2.6 * np.sqrt(m / max(r, 0.25))
        visible = ax.plot(vis, x_range=[0.2, 10], color=BLUE)
        vis_l = Text("matière visible seule → décline", color=BLUE).scale(0.34).next_to(ax.c2p(8, vis(8)), UP, buff=0.2)
        self.play(Create(visible), FadeIn(vis_l), run_time=1.8)
        self.wait(0.4)

        # Observé : plat.
        flat = ax.plot(lambda r: 1.7 * np.sqrt(r / (r + 0.6)), x_range=[0.2, 10], color=YELLOW)
        obs_dots = VGroup(*[Dot(ax.c2p(r, 1.7 * np.sqrt(r / (r + 0.6))), radius=0.05, color=YELLOW)
                            for r in np.arange(1, 10, 1.0)])
        obs_l = Text("observé → plat !", color=YELLOW).scale(0.36).next_to(ax.c2p(8, 1.6), DOWN, buff=0.2)
        self.play(Create(flat), FadeIn(obs_dots), FadeIn(obs_l), run_time=1.8)
        self.wait(0.6)

        concl = Text("Il manque une masse invisible dont l'effet croît avec r : le halo.",
                     color=ORANGE).scale(0.4).to_edge(DOWN)
        self.play(Write(concl))
        self.wait(1.5)
