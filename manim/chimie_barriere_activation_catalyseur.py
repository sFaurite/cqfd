"""Profil reactionnel : barriere d'activation Ea et effet d'un catalyseur.

Le catalyseur abaisse Ea (rabote le sommet) mais ne change ni les reactifs ni
les produits : DeltaG, DeltaH, K restent identiques (les vallees ne bougent pas).

Rendu : manim -qm manim/chimie_barriere_activation_catalyseur.py ChimieBarriereActivationCatalyseur
"""
import numpy as np
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


# --- Geometrie du profil reactionnel -----------------------------------------
# Coordonnee de reaction x in [0, 10]. On construit une "cloche" lisse :
#  - plateau gauche (reactifs) a l'ordonnee Y_REA
#  - sommet (etat de transition) a l'ordonnee Y_TS
#  - plateau droit (produits) a l'ordonnee Y_PRO < Y_REA (exothermique)
X_MIN, X_MAX = 0.0, 10.0
X_PEAK = 5.0
Y_REA = 1.6     # plateau reactifs
Y_PRO = 0.2     # plateau produits (plus bas)
Y_TS_HIGH = 4.4  # sommet barriere haute
Y_TS_LOW = 3.0   # sommet barriere catalysee (plus bas)


def _profile(x, y_ts):
    """Profil energetique : interpolation lisse plateau->sommet->plateau.

    On melange les deux plateaux par une fonction sigmoide (transition douce)
    et on ajoute une bosse gaussienne centree sur le sommet. Les valeurs aux
    extremites tendent EXACTEMENT vers Y_REA et Y_PRO (plateaux fixes).
    """
    # sigmoide qui passe de 0 (gauche) a 1 (droite)
    s = 1.0 / (1.0 + np.exp(-1.6 * (x - X_PEAK)))
    base = Y_REA + (Y_PRO - Y_REA) * s
    # bosse gaussienne : hauteur telle que le sommet atteigne y_ts
    bump_at_peak = y_ts - (Y_REA + (Y_PRO - Y_REA) * 0.5)
    bump = bump_at_peak * np.exp(-((x - X_PEAK) ** 2) / (2 * 1.6 ** 2))
    return base + bump


class ChimieBarriereActivationCatalyseur(Scene):
    def construct(self):
        titre = Text("La barriere et le raccourci", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(titre))

        # --- Axes ------------------------------------------------------------
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 5, 1],
            x_length=11.0,
            y_length=5.2,
            tips=False,
            axis_config={"color": MUTED, "stroke_width": 2, "include_ticks": False},
        ).to_edge(DOWN, buff=0.55).shift(DOWN * 0.05)

        x_lab = Text("coordonnee de reaction", color=MUTED).scale(0.34)
        x_lab.next_to(axes.x_axis, DOWN, buff=0.08).align_to(axes.x_axis, RIGHT).shift(LEFT * 0.2)
        y_lab = Text("energie potentielle", color=MUTED).scale(0.34)
        y_lab.rotate(PI / 2).next_to(axes.y_axis, LEFT, buff=0.05)

        self.play(Create(axes), FadeIn(x_lab), FadeIn(y_lab))

        # helper : point du plan a partir de coordonnees (x, y) du profil
        def P(x, y):
            return axes.c2p(x, y)

        # --- ETAPE 1 : courbe haute (cloche) --------------------------------
        curve_high = axes.plot(
            lambda x: _profile(x, Y_TS_HIGH),
            x_range=[X_MIN, X_MAX, 0.05],
            color=TEXT,
            stroke_width=5,
        )
        self.play(Create(curve_high), run_time=2.2)

        # etiquettes reactifs / produits / etat de transition
        l_rea = Text("reactifs", color=BLUE).scale(0.38)
        l_rea.next_to(P(0.8, Y_REA), UP, buff=0.18)
        l_pro = Text("produits", color=GREEN).scale(0.38)
        l_pro.next_to(P(9.2, Y_PRO), UP, buff=0.18)
        l_ts = Text("etat de transition", color=YELLOW).scale(0.36)
        l_ts.next_to(P(X_PEAK, Y_TS_HIGH), UP, buff=0.14)

        self.play(FadeIn(l_rea, shift=UP * 0.1), FadeIn(l_pro, shift=UP * 0.1))
        self.play(FadeIn(l_ts, shift=DOWN * 0.1))
        self.wait(0.4)

        # --- ETAPE 2 : fleches Ea et Delta_r G ------------------------------
        # double-fleche Ea : du plateau gauche au sommet (verticale, a gauche du sommet)
        x_ea = 3.6
        ea_arrow = DoubleArrow(
            P(x_ea, Y_REA), P(x_ea, Y_TS_HIGH),
            color=BLUE, buff=0.0, stroke_width=4,
            tip_length=0.2, max_tip_length_to_length_ratio=0.12,
        )
        ea_label = MathTex(r"E_a", color=BLUE).scale(0.7)
        ea_label.next_to(ea_arrow, LEFT, buff=0.12)

        # double-fleche Delta_r G : plateau gauche -> plateau droit (a droite)
        x_dg = 8.2
        dg_arrow = DoubleArrow(
            P(x_dg, Y_REA), P(x_dg, Y_PRO),
            color=PURPLE, buff=0.0, stroke_width=4,
            tip_length=0.18, max_tip_length_to_length_ratio=0.12,
        )
        dg_label = MathTex(r"\Delta_r G < 0", color=PURPLE).scale(0.55)
        dg_label.next_to(dg_arrow, RIGHT, buff=0.12)

        self.play(GrowFromCenter(ea_arrow), Write(ea_label))
        self.play(GrowFromCenter(dg_arrow), Write(dg_label))
        self.wait(0.4)

        # --- ETAPE 3 : la bille franchit la barriere haute ------------------
        ball = Dot(color=ORANGE, radius=0.11).move_to(P(0.6, Y_REA))
        self.play(FadeIn(ball, scale=0.5))

        # chemin de montee (lent) puis de descente (rapide)
        path_up = axes.plot(
            lambda x: _profile(x, Y_TS_HIGH),
            x_range=[0.6, X_PEAK, 0.05], color=TEXT,
        )
        path_down = axes.plot(
            lambda x: _profile(x, Y_TS_HIGH),
            x_range=[X_PEAK, 9.4, 0.05], color=TEXT,
        )
        self.play(MoveAlongPath(ball, path_up), rate_func=rate_functions.ease_in_quad, run_time=2.0)
        self.play(MoveAlongPath(ball, path_down), rate_func=rate_functions.ease_in_expo, run_time=0.9)
        self.wait(0.3)

        # --- ETAPE 4 : LE CATALYSEUR ----------------------------------------
        # lignes horizontales pointillees fixes alignees sur les deux plateaux
        plat_rea = DashedLine(P(0.0, Y_REA), P(10.0, Y_REA), color=BLUE_D, stroke_width=2, dash_length=0.12)
        plat_pro = DashedLine(P(0.0, Y_PRO), P(10.0, Y_PRO), color=BLUE_D, stroke_width=2, dash_length=0.12)
        plat_rea.set_opacity(0.55)
        plat_pro.set_opacity(0.55)
        self.play(Create(plat_rea), Create(plat_pro), run_time=0.8)

        catal_txt = Text("catalyseur : on rabote le sommet", color=GREEN).scale(0.4)
        catal_txt.next_to(titre, DOWN, buff=0.18)
        self.play(FadeIn(catal_txt, shift=DOWN * 0.1))

        # seconde courbe : memes plateaux, sommet plus bas, verte pointillee
        curve_low = DashedVMobject(
            axes.plot(
                lambda x: _profile(x, Y_TS_LOW),
                x_range=[X_MIN, X_MAX, 0.05],
                color=GREEN,
                stroke_width=5,
            ),
            num_dashes=70,
        )

        # nouvelle fleche Ea' (plus courte) et nouveau label etat de transition
        ea_arrow2 = DoubleArrow(
            P(x_ea, Y_REA), P(x_ea, Y_TS_LOW),
            color=BLUE, buff=0.0, stroke_width=4,
            tip_length=0.2, max_tip_length_to_length_ratio=0.12,
        )
        ea_label2 = MathTex(r"E_a'", color=BLUE).scale(0.7)
        ea_label2.next_to(ea_arrow2, LEFT, buff=0.12)

        # Transform de la barriere haute vers la barriere basse :
        # les plateaux ne bougent pas (memes extremites).
        self.play(
            Transform(curve_high, curve_low),
            Transform(ea_arrow, ea_arrow2),
            TransformMatchingTex(ea_label, ea_label2),
            l_ts.animate.next_to(P(X_PEAK, Y_TS_LOW), UP, buff=0.14).set_color(GREEN),
            run_time=2.2,
        )

        # rappel Ea' < Ea
        ineq = MathTex(r"E_a' < E_a", color=BLUE).scale(0.55)
        ineq.next_to(ea_arrow2, UP, buff=0.12).shift(LEFT * 0.1)
        self.play(Write(ineq))

        # la bille verte repasse, beaucoup plus vite
        ball2 = Dot(color=ORANGE, radius=0.11).move_to(P(0.6, Y_REA))
        path_up2 = axes.plot(
            lambda x: _profile(x, Y_TS_LOW), x_range=[0.6, X_PEAK, 0.05], color=GREEN,
        )
        path_down2 = axes.plot(
            lambda x: _profile(x, Y_TS_LOW), x_range=[X_PEAK, 9.4, 0.05], color=GREEN,
        )
        self.play(FadeIn(ball2, scale=0.5))
        self.play(MoveAlongPath(ball2, path_up2), rate_func=rate_functions.ease_in_quad, run_time=0.9)
        self.play(MoveAlongPath(ball2, path_down2), rate_func=rate_functions.ease_in_expo, run_time=0.5)
        self.wait(0.3)

        # --- ETAPE 5 : conclusion -------------------------------------------
        self.play(FadeOut(ball), FadeOut(ball2), FadeOut(ineq))

        concl1 = MathTex(r"E_a \downarrow \Rightarrow v \uparrow", color=BLUE).scale(0.7)
        concl2 = MathTex(r"\Delta G,\ \Delta H,\ K", r"\ \text{inchanges}", color=TEXT).scale(0.55)
        concl2.set_color_by_tex(r"\Delta G", GREEN)
        box = SurroundingRectangle(concl2, color=GREEN, buff=0.18, corner_radius=0.1)
        right_grp = VGroup(concl2, box)

        concl1.to_corner(DL, buff=0.5).shift(UP * 0.1)
        right_grp.to_corner(DR, buff=0.5).shift(UP * 0.1)

        self.play(Write(concl1))
        self.play(Write(concl2), Create(box))

        # clignotement des plateaux : ils n'ont pas bouge
        self.play(
            plat_rea.animate.set_color(YELLOW).set_opacity(1.0),
            plat_pro.animate.set_color(YELLOW).set_opacity(1.0),
            run_time=0.4,
        )
        self.play(
            plat_rea.animate.set_color(BLUE_D).set_opacity(0.55),
            plat_pro.animate.set_color(BLUE_D).set_opacity(0.55),
            run_time=0.4,
        )
        self.wait(1.0)
