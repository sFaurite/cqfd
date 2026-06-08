"""Cône de lumière : passé, futur, ailleurs.

Rendu : manim -qm manim/light_cone.py LightCone
"""
from manim import *
from theme import BLUE, YELLOW, RED, GREEN, TEXT, MUTED, PURPLE


class LightCone(Scene):
    def construct(self):
        ax = Axes(
            x_range=[-4, 4, 1], y_range=[-3, 3, 1], x_length=8, y_length=6,
            axis_config={"color": MUTED, "include_tip": True},
        )
        xlab = MathTex("x", color=MUTED).next_to(ax.x_axis, RIGHT)
        tlab = MathTex("ct", color=MUTED).next_to(ax.y_axis, UP)
        self.play(Create(ax), FadeIn(xlab), FadeIn(tlab))

        o = ax.c2p(0, 0)
        # lignes de lumière à 45°
        l1 = Line(ax.c2p(-3, -3), ax.c2p(3, 3), color=YELLOW, stroke_width=4)
        l2 = Line(ax.c2p(-3, 3), ax.c2p(3, -3), color=YELLOW, stroke_width=4)
        self.play(Create(l1), Create(l2))
        ll = Text("lignes de lumière (v = c)", color=YELLOW).scale(0.45).next_to(ax.c2p(3, 3), UR, buff=0.05)
        self.play(FadeIn(ll))

        # régions
        futur = Polygon(ax.c2p(0, 0), ax.c2p(-2.7, 2.7), ax.c2p(2.7, 2.7), color=BLUE, fill_opacity=0.18, stroke_width=0)
        passe = Polygon(ax.c2p(0, 0), ax.c2p(-2.7, -2.7), ax.c2p(2.7, -2.7), color=PURPLE, fill_opacity=0.18, stroke_width=0)
        ailleurs1 = Polygon(ax.c2p(0, 0), ax.c2p(2.7, 2.7), ax.c2p(2.7, -2.7), color=RED, fill_opacity=0.12, stroke_width=0)
        ailleurs2 = Polygon(ax.c2p(0, 0), ax.c2p(-2.7, 2.7), ax.c2p(-2.7, -2.7), color=RED, fill_opacity=0.12, stroke_width=0)
        self.play(FadeIn(futur), FadeIn(passe), FadeIn(ailleurs1), FadeIn(ailleurs2))

        t_fut = Text("FUTUR", color=BLUE).scale(0.5).move_to(ax.c2p(0, 2))
        t_pas = Text("PASSÉ", color=PURPLE).scale(0.5).move_to(ax.c2p(0, -2))
        t_ail = Text("AILLEURS", color=RED).scale(0.45).move_to(ax.c2p(2, 0))
        t_ail2 = Text("AILLEURS", color=RED).scale(0.45).move_to(ax.c2p(-2, 0))
        self.play(FadeIn(t_fut), FadeIn(t_pas), FadeIn(t_ail), FadeIn(t_ail2))

        evt = Dot(o, color=TEXT, radius=0.1)
        evt_lab = Text("ici, maintenant", color=TEXT).scale(0.4).next_to(evt, DR, buff=0.1)
        self.play(FadeIn(evt), FadeIn(evt_lab))

        inv = MathTex(r"s^2 = (c\,\Delta t)^2 - \Delta x^2 \;=\; \text{invariant}", color=YELLOW).scale(0.7).to_edge(UP)
        self.play(Write(inv))
        self.wait(2)
