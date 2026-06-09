from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

import numpy as np


def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))


def target_f(x):
    return 0.6 + 0.4 * np.sin(1.3 * x) * np.exp(-0.1 * x * x)


class IaApproximationBosses(Scene):
    def construct(self):
        title = Text("Sommer des bosses", color=TEXT, weight=BOLD).scale(0.8)
        title.to_edge(UP, buff=0.3)
        self.play(Write(title), run_time=0.8)

        ax = Axes(
            x_range=[-4, 4, 1],
            y_range=[-0.3, 1.4, 0.5],
            x_length=11,
            y_length=5.0,
            axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False},
            tips=False,
        ).to_edge(DOWN, buff=0.55)
        self.play(Create(ax), run_time=0.8)

        # ---------- Etape 1 : la marche ----------
        b1, b2 = -1.0, 1.0
        w_tr = ValueTracker(1.0)

        march1 = always_redraw(
            lambda: ax.plot(
                lambda x: sigmoid(w_tr.get_value() * (x - b1)),
                x_range=[-4, 4, 0.02],
                color=BLUE,
                stroke_width=4,
            )
        )
        lbl1 = MathTex(r"\sigma(w(x-b_1))", color=BLUE).scale(0.7)
        lbl1.to_corner(UL, buff=0.5).shift(DOWN * 0.7)

        self.play(Create(march1), FadeIn(lbl1), run_time=1.0)
        self.play(w_tr.animate.set_value(8.0), run_time=2.4)
        self.wait(0.4)

        # ---------- Etape 2 : la bosse ----------
        w = 8.0
        march1_static = ax.plot(
            lambda x: sigmoid(w * (x - b1)),
            x_range=[-4, 4, 0.02], color=BLUE, stroke_width=4,
        )
        self.remove(march1)
        self.add(march1_static)

        march2 = ax.plot(
            lambda x: sigmoid(w * (x - b2)),
            x_range=[-4, 4, 0.02], color=TEAL, stroke_width=4,
        )
        lbl2 = MathTex(r"\sigma(w(x-b_2))", color=TEAL).scale(0.7)
        lbl2.next_to(lbl1, DOWN, aligned_edge=LEFT, buff=0.25)
        self.play(Create(march2), FadeIn(lbl2), run_time=1.0)

        # coefficients de sortie c=+1 / c=-1
        c_plus = MathTex(r"c=+1", color=BLUE).scale(0.55)
        c_plus.move_to(ax.c2p(b1, 1.18))
        c_minus = MathTex(r"c=-1", color=TEAL).scale(0.55)
        c_minus.move_to(ax.c2p(b2, 1.18))
        self.play(FadeIn(c_plus, shift=UP * 0.2), FadeIn(c_minus, shift=UP * 0.2), run_time=0.6)

        bump = ax.plot(
            lambda x: sigmoid(w * (x - b1)) - sigmoid(w * (x - b2)),
            x_range=[-4, 4, 0.02], color=YELLOW, stroke_width=5,
        )
        self.play(
            ReplacementTransform(VGroup(march1_static, march2), bump),
            run_time=1.6,
        )
        bump_lbl = MathTex(
            r"\sigma(w(x-b_1))-\sigma(w(x-b_2))\approx \mathbf{1}_{[b_1,b_2]}",
            color=YELLOW,
        ).scale(0.6)
        bump_lbl.next_to(title, DOWN, buff=0.2)
        self.play(
            FadeOut(lbl1), FadeOut(lbl2), FadeIn(bump_lbl), run_time=0.8
        )
        self.wait(0.5)

        # ---------- Etape 3 : sommer pour epouser f ----------
        self.play(
            FadeOut(bump), FadeOut(c_plus), FadeOut(c_minus), FadeOut(bump_lbl),
            run_time=0.7,
        )

        f_curve = ax.plot(
            target_f, x_range=[-4, 4, 0.01], color=RED, stroke_width=4,
        )
        f_lbl = MathTex(r"f(x)", color=RED).scale(0.6)
        f_lbl.move_to(ax.c2p(3.2, target_f(3.2) + 0.35))
        self.play(Create(f_curve), FadeIn(f_lbl), run_time=1.2)

        sup_lbl = MathTex(
            r"\sup_x |f(x)-g(x)| < \varepsilon", color=GREEN
        ).scale(0.65)
        sup_lbl.to_edge(DOWN, buff=0.18)

        def staircase(x_arr, N):
            xs = np.linspace(-4, 4, N + 1)
            mids = 0.5 * (xs[:-1] + xs[1:])
            heights = target_f(mids)
            out = np.zeros_like(x_arr)
            for i in range(N):
                mask = (x_arr >= xs[i]) & (x_arr < xs[i + 1])
                out[mask] = heights[i]
            out[x_arr >= xs[-1]] = heights[-1]
            return out

        def make_g(N):
            return ax.plot(
                lambda x: float(staircase(np.array([x]), N)[0]),
                x_range=[-4, 4, 0.008], color=YELLOW, stroke_width=4,
                use_smoothing=False,
            )

        def make_band(eps):
            upper = ax.plot(lambda x: target_f(x) + eps, x_range=[-4, 4, 0.02])
            lower = ax.plot(lambda x: target_f(x) - eps, x_range=[-4, 4, 0.02])
            band = VGroup()
            up_pts = upper.get_points()
            lo_pts = lower.get_points()[::-1]
            poly = Polygon(
                *up_pts, *lo_pts, color=GREEN, fill_opacity=0.18, stroke_width=0,
            )
            band.add(poly)
            return band

        g = make_g(3)
        band = make_band(0.45)
        self.play(FadeIn(band), Create(g), FadeIn(sup_lbl), run_time=1.3)
        self.wait(0.4)

        g6 = make_g(6)
        band6 = make_band(0.25)
        self.play(
            Transform(g, g6), Transform(band, band6), run_time=1.3
        )
        self.wait(0.3)

        g12 = make_g(12)
        band12 = make_band(0.12)
        self.play(
            Transform(g, g12), Transform(band, band12), run_time=1.3
        )
        self.wait(0.3)

        g24 = make_g(24)
        band24 = make_band(0.06)
        self.play(
            Transform(g, g24), Transform(band, band24), run_time=1.3
        )

        msg = Text("Assez de bosses : n'importe quelle forme",
                   color=GREEN).scale(0.45)
        msg.next_to(title, DOWN, buff=0.2)
        self.play(FadeIn(msg, shift=DOWN * 0.2), run_time=0.7)
        self.wait(1.5)
