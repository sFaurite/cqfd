"""L'expansion accélère : a(t) ralentit d'abord (matière) puis accélère (Λ).

Rendu : manim -qm manim/acceleration_expansion.py AccelerationExpansion
"""
from manim import *
from theme import BLUE, YELLOW, GREEN, RED, ORANGE, TEXT, MUTED


class AccelerationExpansion(Scene):
    def construct(self):
        title = Text("L'expansion accélère : la signature des supernovæ", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        ax = Axes(
            x_range=[0, 3, 1], y_range=[0, 3, 1], x_length=8.6, y_length=4.4,
            axis_config={"color": MUTED, "include_tip": True},
        ).shift(DOWN * 0.4)
        x_lbl = Text("temps", color=MUTED).scale(0.36).next_to(ax.x_axis, RIGHT, buff=0.1)
        y_lbl = MathTex("a(t)", color=MUTED).scale(0.7).next_to(ax.y_axis, UP, buff=0.1)
        self.play(Create(ax), FadeIn(x_lbl), FadeIn(y_lbl))

        # a(t) qui décélère (matière) puis accélère (énergie noire) — point d'inflexion.
        now_t = 2.0
        curve = ax.plot(lambda t: 0.9 * t ** (2 / 3) + 0.10 * np.exp(1.05 * (t - 1.4)),
                        x_range=[0.05, 2.75], color=ORANGE)
        self.play(Create(curve), run_time=2.2)

        infl = ax.c2p(1.4, 0.9 * 1.4 ** (2 / 3) + 0.10)
        dot = Dot(infl, color=GREEN, radius=0.07)
        decel = Text("décélération (matière)", color=BLUE).scale(0.32).next_to(ax.c2p(0.8, 0.9), UL, buff=0.05)
        accel = Text("accélération (énergie noire)", color=GREEN).scale(0.32).next_to(ax.c2p(2.4, 2.3), LEFT, buff=0.1)
        self.play(FadeIn(decel))
        self.play(FadeIn(dot), FadeIn(accel))
        self.wait(0.5)

        q = MathTex(r"q_0 = \frac{\Omega_m}{2} - \Omega_\Lambda < 0", color=YELLOW).scale(0.62).to_corner(DR)
        self.play(Write(q))
        self.wait(1.6)
