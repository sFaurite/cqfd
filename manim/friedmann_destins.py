"""Les destins de l'univers : a(t) selon le contenu (Friedmann).

Rendu : manim -qm manim/friedmann_destins.py FriedmannDestins
"""
from manim import *
from theme import BLUE, YELLOW, RED, GREEN, TEXT, MUTED


class FriedmannDestins(Scene):
    def construct(self):
        title = Text("Le destin de l'univers selon son contenu", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        ax = Axes(
            x_range=[0, 3, 1], y_range=[0, 3, 1], x_length=8.6, y_length=4.6,
            axis_config={"color": MUTED, "include_tip": True, "include_numbers": False},
        ).shift(DOWN * 0.4)
        x_lbl = MathTex("t", color=MUTED).scale(0.7).next_to(ax.x_axis, RIGHT, buff=0.15)
        y_lbl = MathTex("a(t)", color=MUTED).scale(0.7).next_to(ax.y_axis, UP, buff=0.15)
        self.play(Create(ax), FadeIn(x_lbl), FadeIn(y_lbl))

        # Trois scénarios, partant tous du Big Bang (a=0).
        accel = ax.plot(lambda t: 0.35 * np.exp(0.9 * t), x_range=[0, 2.45], color=GREEN)
        flat = ax.plot(lambda t: 1.45 * t ** (2 / 3), x_range=[0, 2.95], color=BLUE)
        recoll = ax.plot(lambda t: 3 * np.sin(t * PI / 2.8) if t < 2.8 else 0, x_range=[0, 2.8], color=RED)

        accel_l = Text("Λ domine → accélère", color=GREEN).scale(0.34).next_to(accel.get_end(), UR, buff=0.05)
        flat_l = Text("juste plat → ralentit", color=BLUE).scale(0.34).next_to(flat.get_end(), RIGHT, buff=0.1)
        recoll_l = Text("trop de matière → recontraction", color=RED).scale(0.34).next_to(recoll.get_end(), DR, buff=0.05)

        self.play(Create(flat), FadeIn(flat_l), run_time=1.6)
        self.wait(0.3)
        self.play(Create(recoll), FadeIn(recoll_l), run_time=1.6)
        self.wait(0.3)
        self.play(Create(accel), FadeIn(accel_l), run_time=1.6)
        self.wait(0.6)

        eq = MathTex(r"\left(\frac{\dot a}{a}\right)^2 = \frac{8\pi G}{3}\rho - \frac{kc^2}{a^2}", color=YELLOW).scale(0.6).to_corner(DL)
        self.play(Write(eq))
        self.wait(1.6)
