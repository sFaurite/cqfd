"""Identite d'Euler : e^{i pi} + 1 = 0 — demontree, pas decretee.

La serie entiere de e^{i theta} evaluee en theta = pi : chaque terme est un
vecteur du plan complexe obtenu du precedent par multiplication par i pi / n
(rotation de 90 degres + homothetie). La ligne brisee spirale et s'enroule
vers le point -1 du cercle unite.

Rendu :
  PYTHONPATH=. manim -qm maths_euler_identite.py EulerIdentite
"""
import numpy as np

from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


class EulerIdentite(Scene):
    def construct(self):
        # ============================================================
        # (0-4 s) Poser : l'equation, promesse de preuve
        # ============================================================
        intro_eq = MathTex(r"e^{i\pi} + 1 = 0", color=TEXT).scale(1.5)
        intro_sub = Text("démontrée, pas décrétée", color=MUTED).scale(0.55)
        intro_sub.next_to(intro_eq, DOWN, buff=0.55)
        self.play(Write(intro_eq), run_time=1.2)
        self.play(FadeIn(intro_sub, shift=UP * 0.2), run_time=0.6)
        self.wait(1.1)
        self.play(FadeOut(intro_eq), FadeOut(intro_sub), run_time=0.6)

        # ============================================================
        # (4-11 s) Construire le decor : serie en haut, plan complexe
        # ============================================================
        formula = MathTex(
            r"e^{i\theta}", r"=", r"\sum_{n=0}^{\infty} \frac{(i\theta)^n}{n!}",
            color=TEXT,
        ).scale(0.7).to_edge(UP, buff=0.25)
        self.play(Write(formula), run_time=1.1)

        # Plan complexe discret ; spirale contenue dans [-4.5, 2.5] x [-2.6, 3.6]
        u = 0.88  # taille d'une unite a l'ecran
        plane = ComplexPlane(
            x_range=[-4.5, 2.5, 1],
            y_range=[-2.6, 3.6, 1],
            background_line_style={
                "stroke_color": BLUE_D, "stroke_width": 1, "stroke_opacity": 0.25,
            },
            axis_config={"stroke_color": MUTED, "stroke_width": 1.5, "include_ticks": False},
        )
        plane.scale(u)
        plane.shift(np.array([0.8, -1.0, 0.0]) - plane.n2p(0))

        def P(z):
            return plane.n2p(z)

        circle = Circle(radius=u, color=BLUE, stroke_width=2.5, z_index=1).move_to(P(0))
        minus1_dot = Dot(P(-1), radius=0.07, color=RED, z_index=5)
        minus1_lbl = MathTex(r"-1", color=RED).scale(0.6).next_to(minus1_dot, DL, buff=0.18)

        self.play(FadeIn(plane), run_time=1.0)
        self.play(Create(circle), run_time=0.8)
        self.play(FadeIn(minus1_dot, scale=0.5), FadeIn(minus1_lbl), run_time=0.6)
        self.wait(0.4)

        # ============================================================
        # (11-15 s) theta = pi, et la regle de passage d'un terme au suivant
        # ============================================================
        theta_pi = MathTex(r"\theta = \pi", color=YELLOW).scale(0.7)
        theta_pi.next_to(formula, LEFT, buff=1.1)
        formula_pi = MathTex(
            r"e^{i\pi}", r"=", r"\sum_{n=0}^{\infty} \frac{(i\pi)^n}{n!}",
            color=TEXT,
        ).scale(0.7).move_to(formula)

        self.play(Write(theta_pi), run_time=0.6)
        self.play(ReplacementTransform(formula, formula_pi), run_time=0.9)

        rule_tex = MathTex(
            r"t_n = t_{n-1} \times \frac{i\pi}{n}", color=TEXT,
        ).scale(0.62).move_to(np.array([5.0, 1.55, 0.0]))
        rule_note = Text("rotation de 90° + homothétie", color=MUTED).scale(0.38)
        rule_note.next_to(rule_tex, DOWN, buff=0.3)
        self.play(FadeIn(rule_tex, shift=LEFT * 0.2), FadeIn(rule_note), run_time=0.8)
        self.wait(0.3)

        # ============================================================
        # Donnees : termes t_n = (i pi)^n / n! et sommes partielles S_k
        # ============================================================
        ipi = complex(0.0, np.pi)
        n_draw = 9  # termes 0..8 dessines, la suite est invisible a l'ecran
        terms = [complex(1.0, 0.0)]
        for n in range(1, n_draw):
            terms.append(terms[-1] * ipi / n)
        sums, acc = [], complex(0.0, 0.0)
        for t in terms:
            acc += t
            sums.append(acc)

        cycle = [YELLOW, GREEN, PURPLE, ORANGE, TEAL]

        def col(n):
            return cycle[n % len(cycle)]

        def seg_mobject(n, z0, z1):
            p0, p1 = P(z0), P(z1)
            if np.linalg.norm(p1 - p0) > 0.45:
                return Arrow(
                    p0, p1, buff=0.0, color=col(n), stroke_width=4,
                    max_tip_length_to_length_ratio=0.12, z_index=2,
                )
            return Line(p0, p1, color=col(n), stroke_width=3.5, z_index=2)

        # --- Compteur, somme partielle S_k et distance a -1 (colonne droite) ---
        def count_text(k):
            return Text(f"termes : {k + 1}", color=TEXT).scale(0.45).move_to(
                np.array([5.0, -0.1, 0.0])
            )

        def s_value_tex(k, z):
            re = f"{z.real:.2f}".replace(".", "{,}")
            im = f"{z.imag:+.2f}".replace(".", "{,}")
            return MathTex(
                rf"S_{{{k}}} \approx {re} {im}\,i", color=YELLOW,
            ).scale(0.55).move_to(np.array([5.0, -0.75, 0.0]))

        def dist_text(z):
            d = abs(z + 1)
            return Text(
                "distance à −1 : " + f"{d:.2f}".replace(".", ","), color=MUTED,
            ).scale(0.42).move_to(np.array([5.0, -1.35, 0.0]))

        # ============================================================
        # (15-24 s) Termes 0 a 3, poses lentement, avec etiquettes
        # ============================================================
        segs, joints, labels = VGroup(), VGroup(), VGroup()

        # Terme 0 : le vecteur 1
        seg0 = seg_mobject(0, 0j, sums[0])
        lbl0 = MathTex(r"1", color=col(0)).scale(0.5).next_to(seg0, DOWN, buff=0.15)
        s_dot = Dot(P(sums[0]), radius=0.08, color=TEXT, z_index=6)
        joint0 = Dot(P(sums[0]), radius=0.04, color=MUTED, z_index=3)
        count_line = count_text(0)
        s_line = s_value_tex(0, sums[0])
        dist_line = dist_text(sums[0])
        segs.add(seg0)
        joints.add(joint0)
        labels.add(lbl0)

        self.play(GrowArrow(seg0), run_time=0.6)
        self.play(
            FadeIn(lbl0), FadeIn(joint0), FadeIn(s_dot, scale=0.5),
            FadeIn(count_line), FadeIn(s_line), FadeIn(dist_line),
            run_time=0.6,
        )
        self.wait(0.4)

        term_labels = [
            None,
            (r"i\pi", RIGHT),
            (r"\frac{(i\pi)^2}{2!}", UP),
            (r"\frac{(i\pi)^3}{3!}", LEFT),
        ]
        for n in (1, 2, 3):
            z_prev = sums[n - 2] if n >= 2 else 0j
            z0, z1 = sums[n - 1], sums[n]
            new_seg = seg_mobject(n, z0, z1)

            # Le terme precedent, deplace au bout de la ligne, tourne de 90
            # degres et se contracte : multiplication par i pi / n rendue visible.
            ghost = Line(P(z_prev), P(z0), color=col(n), stroke_width=3, stroke_opacity=0.65)
            target = Line(P(z0), P(z1), color=col(n), stroke_width=3, stroke_opacity=0.65)
            self.play(Transform(ghost, target, path_arc=PI / 2), run_time=0.75)

            tex, direction = term_labels[n]
            lbl = MathTex(tex, color=col(n)).scale(0.5).next_to(new_seg, direction, buff=0.15)
            joint = Dot(P(z1), radius=0.04, color=MUTED, z_index=3)
            segs.add(new_seg)
            joints.add(joint)
            labels.add(lbl)

            self.play(
                GrowArrow(new_seg), FadeOut(ghost),
                s_dot.animate.move_to(P(z1)), FadeIn(joint),
                Transform(count_line, count_text(n)),
                Transform(s_line, s_value_tex(n, z1)),
                Transform(dist_line, dist_text(z1)),
                run_time=0.55,
            )
            self.play(FadeIn(lbl), run_time=0.3)
            self.wait(0.25)

        # ============================================================
        # (24-28 s) Termes 4 a 8 : la spirale s'enroule, vite
        # ============================================================
        for n in range(4, n_draw):
            z0, z1 = sums[n - 1], sums[n]
            new_seg = seg_mobject(n, z0, z1)
            joint = Dot(P(z1), radius=0.04, color=MUTED, z_index=3)
            segs.add(new_seg)
            joints.add(joint)
            grow = GrowArrow(new_seg) if isinstance(new_seg, Arrow) else Create(new_seg)
            self.play(
                grow,
                s_dot.animate.move_to(P(z1)), FadeIn(joint),
                Transform(count_line, count_text(n)),
                Transform(s_line, s_value_tex(n, z1)),
                Transform(dist_line, dist_text(z1)),
                run_time=0.5,
            )
        self.wait(0.6)

        # ============================================================
        # (28-33 s) A la limite : S_k atteint -1, le point pulse
        # ============================================================
        inf_count = Text("termes : ∞", color=TEXT).scale(0.45).move_to(count_line)
        inf_s = MathTex(r"S_\infty = -1", color=YELLOW).scale(0.6).move_to(s_line)
        inf_dist = Text("distance à −1 : 0", color=MUTED).scale(0.42).move_to(dist_line)
        self.play(
            s_dot.animate.move_to(P(-1)),
            Transform(count_line, inf_count),
            Transform(s_line, inf_s),
            Transform(dist_line, inf_dist),
            run_time=1.0,
        )
        self.play(FadeOut(s_dot), Flash(minus1_dot, color=RED, flash_radius=0.45), run_time=0.7)
        self.play(minus1_dot.animate.scale(1.9), rate_func=there_and_back, run_time=0.7)
        self.play(minus1_dot.animate.scale(1.9), rate_func=there_and_back, run_time=0.7)
        self.wait(0.3)

        # ============================================================
        # (33-42 s) La serie vaut -1, puis rearrangement anime
        # ============================================================
        eq1 = MathTex(r"e^{i\pi}", r"=", r"-1", color=TEXT).scale(0.9).move_to(formula_pi)
        self.play(TransformMatchingTex(formula_pi, eq1), run_time=1.0)
        self.wait(0.5)

        board = VGroup(
            plane, circle, minus1_dot, minus1_lbl, theta_pi,
            rule_tex, rule_note, count_line, s_line, dist_line,
            segs, joints, labels,
        )
        self.play(FadeOut(board), run_time=0.9)
        self.play(eq1.animate.scale(1.5).move_to(UP * 0.9), run_time=0.8)

        eq2 = MathTex(
            r"e^{i\pi}", r"+", r"1", r"=", r"0", color=TEXT,
        ).scale(1.35).move_to(UP * 0.9)
        self.play(TransformMatchingTex(eq1, eq2, key_map={r"-1": r"1"}), run_time=1.1)
        box = SurroundingRectangle(eq2, color=YELLOW, buff=0.3, corner_radius=0.1)
        self.play(Create(box), run_time=0.7)
        self.wait(0.3)

        # ============================================================
        # (42-50 s) Conclure : cinq constantes, une equation
        # ============================================================
        consts = VGroup(
            MathTex(r"e", color=BLUE),
            MathTex(r"i", color=PURPLE),
            MathTex(r"\pi", color=YELLOW),
            MathTex(r"1", color=GREEN),
            MathTex(r"0", color=RED),
        ).arrange(RIGHT, buff=0.85).scale(0.95).move_to(DOWN * 0.9)
        self.play(
            LaggedStart(*[FadeIn(c, shift=UP * 0.25) for c in consts], lag_ratio=0.18),
            run_time=1.3,
        )

        concl1 = Text("Cinq constantes, une seule équation —", color=GREEN).scale(0.48)
        concl2 = Text("et tout a été construit depuis l'ensemble vide.", color=GREEN).scale(0.48)
        concl = VGroup(concl1, concl2).arrange(DOWN, buff=0.18).move_to(DOWN * 2.3)
        self.play(FadeIn(concl, shift=UP * 0.2), run_time=0.9)
        self.wait(2.5)
