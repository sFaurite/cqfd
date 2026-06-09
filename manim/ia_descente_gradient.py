"""Descente de gradient : le pas d'apprentissage decide de tout.

Rendu :
  PYTHONPATH=. manim -qm ia_descente_gradient.py IaDescenteGradient
"""
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


class IaDescenteGradient(Scene):
    def construct(self):
        # --- Parametres de la perte L(theta) = 0.5 a (theta - thetaStar)^2 ---
        a = 1.0
        theta_star = 0.0

        def L(t):
            return 0.5 * a * (t - theta_star) ** 2

        def dL(t):
            return a * (t - theta_star)

        # --- Titre ---
        title = Text("Descente de gradient", color=TEXT, weight=BOLD).scale(0.8).to_edge(UP)
        self.play(Write(title))

        # --- Axes : coupe 1D de la perte ---
        ax = Axes(
            x_range=[-3.4, 3.4, 1], y_range=[0, 6, 2],
            x_length=8.4, y_length=4.4,
            axis_config={"color": MUTED, "include_tip": True, "include_numbers": False},
        ).shift(DOWN * 0.7)
        x_lbl = MathTex(r"\theta", color=MUTED).scale(0.7).next_to(ax.x_axis, RIGHT, buff=0.12)
        y_lbl = MathTex(r"L(\theta)", color=MUTED).scale(0.7).next_to(ax.y_axis, UP, buff=0.12)

        parab = ax.plot(L, x_range=[-3.35, 3.35], color=BLUE)

        # Minimum thetaStar : ligne pointillee verticale + label
        min_top = ax.c2p(theta_star, 0)
        min_line = DashedLine(
            ax.c2p(theta_star, 0), ax.c2p(theta_star, 5.6),
            color=GREEN, dash_length=0.12,
        )
        star_lbl = MathTex(r"\theta^\star", color=GREEN).scale(0.7).next_to(min_top, DOWN, buff=0.18)

        self.play(Create(ax), FadeIn(x_lbl), FadeIn(y_lbl))
        self.play(Create(parab), run_time=1.2)
        self.play(Create(min_line), FadeIn(star_lbl))

        # Regle de mise a jour, haut a droite
        rule = MathTex(
            r"\theta_{t+1}=\theta_t-\eta\,\nabla L(\theta_t)", color=TEXT,
        ).scale(0.7).to_corner(UR, buff=0.35).shift(DOWN * 0.25)
        self.play(Write(rule))
        self.wait(0.3)

        # --- Helper : point sur la courbe ---
        def pt(t):
            return ax.c2p(t, L(t))

        # ============================================================
        # (3-8 s) eta bien regle : convergence douce
        # ============================================================
        eta_ok = 0.55
        theta = -3.0
        ball = Dot(pt(theta), radius=0.12, color=YELLOW, z_index=5)

        step_counter = MathTex(r"\text{pas } 0", color=MUTED).scale(0.5)
        step_counter = Text("pas 0", color=MUTED).scale(0.5).to_corner(DL, buff=0.4).shift(UP * 0.1)
        eta_label = Text("eta modere", color=MUTED).scale(0.5).next_to(step_counter, RIGHT, buff=0.6)

        self.play(FadeIn(ball, scale=0.6), FadeIn(step_counter), FadeIn(eta_label))

        ghosts = VGroup()
        n_steps = 6
        for i in range(n_steps):
            grad = dL(theta)
            theta_next = theta - eta_ok * grad
            # fleche tangente le long de -gradient (courte)
            p0 = pt(theta)
            # direction le long de la courbe vers theta_next
            dx = (theta_next - theta)
            tnorm = max(abs(dx), 1e-3)
            ux = dx / tnorm
            p1 = ax.c2p(theta + ux * 0.7, L(theta + ux * 0.7))
            arrow = Arrow(p0, p1, color=RED, buff=0.0, stroke_width=4,
                          max_tip_length_to_length_ratio=0.35)
            # ghost de la position courante
            ghost = Dot(pt(theta), radius=0.07, color=MUTED, z_index=3)
            ghosts.add(ghost)

            new_counter = Text(f"pas {i + 1}", color=MUTED).scale(0.5).move_to(step_counter)

            self.play(GrowArrow(arrow), run_time=0.3)
            self.play(
                ball.animate.move_to(pt(theta_next)),
                FadeIn(ghost),
                FadeOut(arrow),
                Transform(step_counter, new_counter),
                run_time=0.45, rate_func=smooth,
            )
            theta = theta_next

        self.wait(0.7)

        # ============================================================
        # (8-13 s) eta trop grand : rebonds gauche-droite qui montent
        # ============================================================
        self.play(
            FadeOut(ghosts),
            FadeOut(eta_label),
            run_time=0.6,
        )

        eta_big_label = Text("eta trop grand", color=ORANGE).scale(0.5).next_to(
            step_counter, RIGHT, buff=0.6
        )
        # Reset bille en haut a gauche
        theta = -2.2
        new_counter = Text("pas 0", color=MUTED).scale(0.5).move_to(step_counter)
        self.play(
            ball.animate.move_to(pt(theta)),
            FadeIn(eta_big_label),
            Transform(step_counter, new_counter),
            run_time=0.6,
        )

        # eta > 2/a => |1 - eta a| > 1 => divergence : zigzag en montant
        eta_div = 2.4  # 1 - eta a = -1.4
        zig_ghosts = VGroup()
        n_zig = 4
        for i in range(n_zig):
            grad = dL(theta)
            theta_next = theta - eta_div * grad
            ghost = Dot(pt(theta), radius=0.07, color=MUTED, z_index=3)
            zig_ghosts.add(ghost)
            new_counter = Text(f"pas {i + 1}", color=MUTED).scale(0.5).move_to(step_counter)
            # petite fleche -gradient
            p0 = pt(theta)
            dx = (theta_next - theta)
            ux = dx / max(abs(dx), 1e-3)
            p1 = ax.c2p(theta + ux * 0.7, L(theta + ux * 0.7))
            arrow = Arrow(p0, p1, color=RED, buff=0.0, stroke_width=4,
                          max_tip_length_to_length_ratio=0.35)
            self.play(GrowArrow(arrow), run_time=0.25)
            self.play(
                ball.animate.move_to(pt(theta_next)),
                FadeIn(ghost),
                FadeOut(arrow),
                Transform(step_counter, new_counter),
                run_time=0.5, rate_func=smooth,
            )
            theta = theta_next

        self.wait(0.6)

        # ============================================================
        # (13-18 s) Analyse exacte + condition de convergence
        # ============================================================
        self.play(
            FadeOut(zig_ghosts), FadeOut(ball),
            FadeOut(step_counter), FadeOut(eta_big_label),
            FadeOut(rule),
            run_time=0.6,
        )

        rec1 = MathTex(r"e_{t+1}=(1-\eta a)\,e_t", color=YELLOW).scale(0.8)
        rec2 = MathTex(r"e_t=(1-\eta a)^t\,e_0", color=YELLOW).scale(0.8)
        cond = MathTex(
            r"\text{converge}\iff 0<\eta<\dfrac{2}{a}", color=YELLOW,
        ).scale(0.8)

        analysis = VGroup(rec1, rec2, cond).arrange(DOWN, buff=0.45).move_to(UP * 0.3)

        self.play(Write(rec1), run_time=0.9)
        self.play(TransformFromCopy(rec1, rec2), run_time=0.9)
        self.wait(0.2)
        self.play(Write(cond), run_time=0.9)
        box = SurroundingRectangle(cond, color=YELLOW, buff=0.18, corner_radius=0.08)
        self.play(Create(box))
        self.wait(0.4)

        # --- Mini-axe de eta : zone verte [0, 2/a] et zone rouge eta >= 2/a ---
        two_over_a = 2.0 / a
        eta_ax = NumberLine(
            x_range=[0, 3.4, 1], length=6.6, color=MUTED,
            include_numbers=False, include_tip=True,
        ).to_edge(DOWN, buff=0.55)

        green_seg = Line(
            eta_ax.n2p(0), eta_ax.n2p(two_over_a), color=GREEN, stroke_width=8,
        )
        red_seg = Line(
            eta_ax.n2p(two_over_a), eta_ax.n2p(3.4), color=RED, stroke_width=8,
        )
        zero_lbl = MathTex(r"0", color=MUTED).scale(0.5).next_to(eta_ax.n2p(0), DOWN, buff=0.12)
        bound_lbl = MathTex(r"\tfrac{2}{a}", color=TEXT).scale(0.6).next_to(
            eta_ax.n2p(two_over_a), DOWN, buff=0.12
        )
        eta_axis_lbl = MathTex(r"\eta", color=MUTED).scale(0.6).next_to(eta_ax, RIGHT, buff=0.15)

        self.play(
            Create(eta_ax),
            Create(green_seg), Create(red_seg),
            FadeIn(zero_lbl), FadeIn(bound_lbl), FadeIn(eta_axis_lbl),
            run_time=0.9,
        )

        # Curseur eta : glisse de la zone verte vers la zone rouge
        cursor = Triangle(color=YELLOW, fill_opacity=1).scale(0.13).rotate(PI)
        cursor.next_to(eta_ax.n2p(0.6), UP, buff=0.08)
        cursor_lbl = MathTex(r"\eta", color=YELLOW).scale(0.5).next_to(cursor, UP, buff=0.06)
        cur_grp = VGroup(cursor, cursor_lbl)
        self.play(FadeIn(cur_grp))

        # glisse vers la zone rouge
        self.play(
            cur_grp.animate.next_to(eta_ax.n2p(2.9), UP, buff=0.08).shift(UP * 0.14),
            run_time=1.4, rate_func=smooth,
        )
        self.wait(0.3)
        # retour dans le vert (destin maitrise)
        self.play(
            cur_grp.animate.next_to(eta_ax.n2p(0.8), UP, buff=0.08),
            run_time=1.0, rate_func=smooth,
        )

        self.wait(1.5)
