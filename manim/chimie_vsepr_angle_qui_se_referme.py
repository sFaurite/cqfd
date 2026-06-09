"""VSEPR : l'angle qui se referme — CH4 -> NH3 -> H2O.

Les doublets non liants, plus repulsifs, compriment l'angle de liaison :
109,5 -> 107 -> 104,5 degres.

Rendu : manim -qm manim/chimie_vsepr_angle_qui_se_referme.py ChimieVseprAngleQuiSeReferme
"""
import numpy as np
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

H_WHITE = "#dfe6ee"   # H presque blanc (jamais blanc pur)
GREY_BOND = "#7d8794"  # liaisons grises
GREY_C = "#52606d"     # cercle atome central


class ChimieVseprAngleQuiSeReferme(Scene):
    def construct(self):
        A = np.array([0.0, -0.4, 0.0])   # position de l'atome central
        L = 2.5                          # longueur des liaisons avant
        Lb = 1.7                         # longueur des directions arriere

        # ---- atome central ----
        centre = Circle(radius=0.42, color=GREY_C, fill_opacity=1).move_to(A)
        centre.set_stroke(MUTED, width=2)
        sym = Text("C", color=TEXT, weight=BOLD).scale(0.6).move_to(A)
        atom = VGroup(centre, sym)

        # ---- directions arriere (stylisees, plus pales) ----
        # deux liaisons arriere partant vers le haut-gauche et haut-droit, pales
        back_dirs = [
            np.array([-np.sin(np.radians(35)), np.cos(np.radians(35)), 0.0]),
            np.array([ np.sin(np.radians(35)), np.cos(np.radians(35)), 0.0]),
        ]
        back_bonds = VGroup()
        back_H = VGroup()
        for d in back_dirs:
            end = A + d * Lb
            ln = Line(A, end, color=GREY_BOND, stroke_width=4).set_opacity(0.35)
            hc = Circle(radius=0.22, color=H_WHITE, fill_opacity=1).move_to(end).set_opacity(0.4)
            hc.set_stroke(MUTED, width=1.5)
            ht = Text("H", color=GREY_C, weight=BOLD).scale(0.4).move_to(end).set_opacity(0.5)
            back_bonds.add(ln)
            back_H.add(VGroup(hc, ht))

        # ---- liaisons avant (le V dont on mesure l'angle) ----
        # angles mesures depuis la verticale vers le bas : demi-angle de chaque cote
        self.half = 109.5 / 2.0  # demi-angle courant (en degres)

        def front_dir(sign):
            # sign = -1 (gauche) ou +1 (droite). Va vers le bas.
            a = np.radians(self.half)
            return np.array([sign * np.sin(a), -np.cos(a), 0.0])

        left_bond = always_redraw(
            lambda: Line(A, A + front_dir(-1) * L, color=GREY_BOND, stroke_width=6)
        )
        right_bond = always_redraw(
            lambda: Line(A, A + front_dir(+1) * L, color=GREY_BOND, stroke_width=6)
        )

        def make_front_H(sign):
            return always_redraw(
                lambda: VGroup(
                    Circle(radius=0.26, color=H_WHITE, fill_opacity=1)
                    .set_stroke(MUTED, width=1.5)
                    .move_to(A + front_dir(sign) * L),
                    Text("H", color=GREY_C, weight=BOLD).scale(0.45)
                    .move_to(A + front_dir(sign) * L),
                )
            )

        left_H = make_front_H(-1)
        right_H = make_front_H(+1)

        # ---- arc + label d'angle (cyan) ----
        def make_arc():
            a = np.radians(self.half)
            start_ang = -PI / 2 - a      # direction gauche
            end_ang = -PI / 2 + a        # direction droite
            return Arc(radius=0.95, start_angle=start_ang,
                       angle=2 * a, arc_center=A, color=BLUE, stroke_width=4)

        arc = always_redraw(make_arc)

        angle_val = ValueTracker(109.5)

        def make_label():
            # affiche la valeur courante avec une decimale et virgule francaise
            v = angle_val.get_value()
            s = f"{v:.1f}".replace(".", "{,}")
            lab = MathTex(rf"{s}^\circ", color=BLUE).scale(0.7)
            lab.move_to(A + np.array([0.0, -1.5, 0.0]))
            return lab

        angle_label = always_redraw(make_label)

        # ============ ETAPE 1 : CH4 ============
        titre = Text("CH₄ (AX₄)", color=TEXT, weight=BOLD).scale(0.6).to_edge(UP)
        self.play(Write(titre))
        self.play(
            FadeIn(atom, scale=0.7),
            *[Create(b) for b in back_bonds],
            *[FadeIn(h) for h in back_H],
        )
        self.add(left_bond, right_bond, left_H, right_H)
        self.play(Create(left_bond), Create(right_bond), run_time=0.6)
        self.play(FadeIn(left_H), FadeIn(right_H), run_time=0.4)
        self.add(arc, angle_label)
        self.play(Create(arc), FadeIn(angle_label))

        note1 = Text("tétraèdre parfait", color=MUTED).scale(0.45)
        note1.next_to(angle_label, DOWN, buff=0.3)
        self.play(FadeIn(note1))
        self.wait(0.8)

        # ============ ETAPE 2 : NH3 ============
        titre2 = Text("NH₃ (AX₃E)", color=TEXT, weight=BOLD).scale(0.6).to_edge(UP)
        new_sym = Text("N", color=TEXT, weight=BOLD).scale(0.6).move_to(A)
        self.play(
            Transform(titre, titre2),
            Transform(sym, new_sym),
            FadeOut(note1),
        )

        # une liaison arriere (gauche) -> doublet rouge
        back_left_dir = back_dirs[0]
        lobe1 = self.make_lobe(A, back_left_dir)
        self.play(FadeOut(back_H[0]))
        self.play(
            FadeOut(back_bonds[0]),
            GrowFromPoint(lobe1, A),
            run_time=0.8,
        )

        # fleches de repulsion + fermeture de l'angle
        push_l, push_r = self.repulsion_arrows(A, lobe1.get_center())
        self.play(FadeIn(push_l), FadeIn(push_r), run_time=0.3)

        def close_to(target_half, target_angle, lobe):
            self.play(
                UpdateFromAlphaFunc(
                    VMobject(),
                    lambda m, a: setattr(
                        self, "half",
                        interpolate(self.start_half, target_half, a)
                    ),
                ),
                angle_val.animate.set_value(target_angle),
                lobe.animate.scale(1.18).set_opacity(0.55),
                run_time=1.4,
            )

        self.start_half = self.half
        close_to(107.0 / 2.0, 107.0, lobe1)
        self.play(lobe1.animate.scale(1 / 1.18).set_opacity(0.40), run_time=0.3)
        self.play(FadeOut(push_l), FadeOut(push_r), run_time=0.3)
        self.wait(0.5)

        # ============ ETAPE 3 : H2O ============
        titre3 = Text("H₂O (AX₂E₂)", color=TEXT, weight=BOLD).scale(0.6).to_edge(UP)
        new_sym2 = Text("O", color=TEXT, weight=BOLD).scale(0.6).move_to(A)
        self.play(Transform(titre, titre3), Transform(sym, new_sym2))

        # seconde liaison arriere (droite) -> doublet rouge
        back_right_dir = back_dirs[1]
        lobe2 = self.make_lobe(A, back_right_dir)
        self.play(FadeOut(back_H[1]))
        self.play(
            FadeOut(back_bonds[1]),
            GrowFromPoint(lobe2, A),
            run_time=0.8,
        )

        push_l2, push_r2 = self.repulsion_arrows(A, lobe2.get_center())
        self.play(FadeIn(push_l2), FadeIn(push_r2), run_time=0.3)

        self.start_half = self.half
        self.play(
            UpdateFromAlphaFunc(
                VMobject(),
                lambda m, a: setattr(
                    self, "half",
                    interpolate(self.start_half, 104.5 / 2.0, a)
                ),
            ),
            angle_val.animate.set_value(104.5),
            lobe1.animate.scale(1.12).set_opacity(0.55),
            lobe2.animate.scale(1.18).set_opacity(0.55),
            run_time=1.4,
        )
        self.play(
            lobe1.animate.scale(1 / 1.12).set_opacity(0.40),
            lobe2.animate.scale(1 / 1.18).set_opacity(0.40),
            run_time=0.3,
        )
        self.play(FadeOut(push_l2), FadeOut(push_r2), run_time=0.3)
        self.wait(0.5)

        # ============ ETAPE 4 : recap ============
        hierarchie = MathTex(
            r"\text{non liant} \;>\; \text{liant}", color=RED
        ).scale(0.6)
        recap = MathTex(
            r"109{,}5^\circ \;\to\; 107^\circ \;\to\; 104{,}5^\circ",
            color=BLUE,
        ).scale(0.65)
        bas = VGroup(hierarchie, recap).arrange(DOWN, buff=0.25).to_edge(DOWN, buff=0.4)

        self.play(Write(hierarchie))
        self.play(Write(recap))
        self.wait(1.0)

    # ---------- helpers ----------
    def make_lobe(self, A, direction):
        """Lobe rouge translucide (doublet non liant) plus volumineux et proche de A."""
        d = direction / np.linalg.norm(direction)
        center = A + d * 0.95
        lobe = Ellipse(width=0.85, height=1.25, color=RED, fill_opacity=0.40)
        lobe.set_stroke(RED, width=2, opacity=0.6)
        # oriente le grand axe (hauteur) selon la direction
        ang = np.arctan2(d[1], d[0]) - PI / 2
        lobe.rotate(ang)
        lobe.move_to(center)
        return lobe

    def repulsion_arrows(self, A, lobe_center):
        """Deux petites fleches courbes signifiant la poussee du doublet."""
        a1 = CurvedArrow(
            lobe_center + np.array([-0.1, -0.2, 0]),
            A + np.array([-1.0, -0.6, 0]),
            color=RED, stroke_width=3, tip_length=0.18,
        ).set_opacity(0.8)
        a2 = CurvedArrow(
            lobe_center + np.array([0.1, -0.2, 0]),
            A + np.array([1.0, -0.6, 0]),
            color=RED, stroke_width=3, tip_length=0.18,
            angle=-TAU / 4,
        ).set_opacity(0.8)
        return a1, a2
