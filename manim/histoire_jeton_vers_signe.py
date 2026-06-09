"""Du jeton au signe écrit : la séquence de Schmandt-Besserat puis le rébus.

Partie A : calculi -> bulla scellée -> empreintes -> tablette.
Partie B : le saut phonétique (rébus) puis simplification cunéiforme.

Rendu : manim -qm manim/histoire_jeton_vers_signe.py HistoireJetonVersSigne
"""
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


def make_cone(scale=1.0):
    return Triangle(color=ORANGE, fill_opacity=0.9).set_stroke(ORANGE, 1.5).scale(0.12 * scale)


def make_sphere(scale=1.0):
    return Circle(radius=0.12 * scale, color=ORANGE, fill_opacity=0.9).set_stroke(ORANGE, 1.5)


def make_disk(scale=1.0):
    return Ellipse(width=0.26 * scale, height=0.12 * scale, color=ORANGE,
                   fill_opacity=0.9).set_stroke(ORANGE, 1.5)


class HistoireJetonVersSigne(Scene):
    def construct(self):
        title = Text("Du jeton au signe écrit", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # ---------------------------------------------------------------
        # PARTIE A : la séquence de Schmandt-Besserat
        # ---------------------------------------------------------------
        xs = [-5.1, -1.7, 1.7, 5.1]   # centres des 4 vignettes
        y0 = 0.4

        # --- Vignette 1 : JETONS (calculi) ---
        cone = make_cone()
        sph = make_sphere()
        disk = make_disk()
        tokens = VGroup(cone, sph, disk).arrange(RIGHT, buff=0.22).move_to([xs[0], y0, 0])
        lab1a = Text("calculi", color=TEXT).scale(0.36).next_to(tokens, DOWN, buff=0.25)
        lab1b = Text("1 forme = 1 quantité", color=MUTED).scale(0.3).next_to(lab1a, DOWN, buff=0.1)
        self.play(LaggedStart(*[GrowFromCenter(t) for t in tokens], lag_ratio=0.3, run_time=1.0))
        self.play(FadeIn(lab1a), FadeIn(lab1b), run_time=0.5)
        self.wait(0.3)

        arrow1 = Arrow([xs[0] + 0.9, y0, 0], [xs[1] - 0.9, y0, 0],
                       color=BLUE, buff=0.1, stroke_width=4, max_tip_length_to_length_ratio=0.25)
        self.play(GrowArrow(arrow1), run_time=0.5)

        # --- Vignette 2 : ENVELOPPE (bulla) -> on imprime AVANT de fermer ---
        bulla = Circle(radius=0.55, color=ORANGE, fill_opacity=0.18).set_stroke(ORANGE, 3).move_to([xs[1], y0, 0])
        # copies des jetons qui vont être "avalés"
        cone2 = make_cone().move_to([xs[1] - 0.18, y0 + 0.16, 0])
        sph2 = make_sphere().move_to([xs[1] + 0.2, y0 + 0.12, 0])
        disk2 = make_disk().move_to([xs[1], y0 - 0.18, 0])
        avals = VGroup(cone2, sph2, disk2)
        self.play(Create(bulla), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(t, scale=0.5) for t in avals], lag_ratio=0.25, run_time=0.9))

        press = Text("on imprime le jeton avant de l'enfermer", color=YELLOW).scale(0.3)
        press.next_to(bulla, UP, buff=0.18)
        self.play(FadeIn(press), run_time=0.4)

        # empreintes : mêmes formes mais en contour (creux) sur la surface
        imp_cone = Triangle(color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).scale(0.12).move_to(cone2)
        imp_sph = Circle(radius=0.12, color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).move_to(sph2)
        imp_disk = Ellipse(width=0.26, height=0.12, color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).move_to(disk2)
        imprints = VGroup(imp_cone, imp_sph, imp_disk)
        self.play(LaggedStart(*[Create(i) for i in imprints], lag_ratio=0.2, run_time=0.9))

        # le sceau roule sur la surface (petit cylindre qui imprime une bande)
        seal = Rectangle(width=0.16, height=0.34, color=TEXT, fill_opacity=0.8).set_stroke(TEXT, 1.5)
        seal.move_to([xs[1] - 0.55, y0 + 0.7, 0])
        band = Line([xs[1] - 0.45, y0 + 0.5, 0], [xs[1] + 0.45, y0 + 0.5, 0], color=BLUE_D, stroke_width=3)
        self.play(FadeIn(seal), run_time=0.3)
        self.play(seal.animate.move_to([xs[1] + 0.55, y0 + 0.7, 0]).rotate(2 * PI),
                  Create(band), run_time=1.0, rate_func=linear)
        self.play(FadeOut(seal), FadeOut(press), run_time=0.3)

        # les jetons "avalés" disparaissent (enfermés), les empreintes restent
        self.play(FadeOut(avals), run_time=0.4)
        lab2 = Text("bulla scellée", color=TEXT).scale(0.36).next_to(bulla, DOWN, buff=0.28)
        lab2b = Text("le contenant devient redondant", color=MUTED).scale(0.28).next_to(lab2, DOWN, buff=0.1)
        self.play(FadeIn(lab2), FadeIn(lab2b), run_time=0.5)
        self.wait(0.3)

        arrow2 = Arrow([xs[1] + 0.9, y0, 0], [xs[2] - 0.9, y0, 0],
                       color=BLUE, buff=0.1, stroke_width=4, max_tip_length_to_length_ratio=0.25)
        self.play(GrowArrow(arrow2), run_time=0.5)

        # --- Vignette 3 : EMPREINTE (la surface gardée, jetons inutiles) ---
        surf = Circle(radius=0.55, color=ORANGE, fill_opacity=0.18).set_stroke(ORANGE, 3).move_to([xs[2], y0, 0])
        imp3 = VGroup(
            Triangle(color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).scale(0.12).move_to([xs[2] - 0.18, y0 + 0.16, 0]),
            Circle(radius=0.12, color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).move_to([xs[2] + 0.2, y0 + 0.12, 0]),
            Ellipse(width=0.26, height=0.12, color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).move_to([xs[2], y0 - 0.18, 0]),
        )
        self.play(TransformFromCopy(VGroup(bulla, imprints), VGroup(surf, imp3)), run_time=0.9)
        lab3 = Text("empreintes", color=TEXT).scale(0.36).next_to(surf, DOWN, buff=0.28)
        self.play(FadeIn(lab3), run_time=0.4)

        arrow3 = Arrow([xs[2] + 0.9, y0, 0], [xs[3] - 0.9, y0, 0],
                       color=BLUE, buff=0.1, stroke_width=4, max_tip_length_to_length_ratio=0.25)
        self.play(GrowArrow(arrow3), run_time=0.5)

        # --- Vignette 4 : TABLETTE (la sphère s'aplatit en rectangle) ---
        tablet = Rectangle(width=1.0, height=0.8, color=ORANGE, fill_opacity=0.18).set_stroke(ORANGE, 3).move_to([xs[3], y0, 0])
        imp4 = VGroup(
            Triangle(color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).scale(0.12).move_to([xs[3] - 0.22, y0 + 0.12, 0]),
            Circle(radius=0.12, color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).move_to([xs[3] + 0.18, y0 + 0.1, 0]),
            Ellipse(width=0.26, height=0.12, color=YELLOW, fill_opacity=0).set_stroke(YELLOW, 2).move_to([xs[3], y0 - 0.16, 0]),
        )
        self.play(ReplacementTransform(surf.copy(), tablet),
                  TransformFromCopy(imp3, imp4), run_time=1.0)
        lab4 = Text("tablette", color=TEXT).scale(0.36).next_to(tablet, DOWN, buff=0.28)
        self.play(FadeIn(lab4), run_time=0.4)
        self.wait(0.8)

        # On nettoie pour la partie B
        partA = VGroup(
            tokens, lab1a, lab1b, arrow1, bulla, imprints, lab2, lab2b, arrow2,
            surf, imp3, lab3, arrow3, tablet, imp4, lab4, band,
        )
        self.play(FadeOut(partA), run_time=0.7)

        # ---------------------------------------------------------------
        # PARTIE B : le saut phonétique (rébus)
        # ---------------------------------------------------------------
        subtitle = Text("Le saut : du dessin de la chose au SON", color=TEXT).scale(0.42)
        subtitle.next_to(title, DOWN, buff=0.35)
        self.play(Write(subtitle), run_time=0.8)

        # geai stylisé (oiseau) + son
        bird = VGroup(
            Ellipse(width=0.8, height=0.45, color=ORANGE, fill_opacity=0.85).set_stroke(ORANGE, 2),       # corps
            Circle(radius=0.18, color=ORANGE, fill_opacity=0.85).set_stroke(ORANGE, 2).shift(RIGHT * 0.42 + UP * 0.12),  # tête
            Triangle(color=YELLOW, fill_opacity=0.9).set_stroke(YELLOW, 0).scale(0.08).rotate(-PI / 2).shift(RIGHT * 0.66 + UP * 0.12),  # bec
            Triangle(color=ORANGE, fill_opacity=0.6).set_stroke(ORANGE, 2).scale(0.2).rotate(PI).shift(LEFT * 0.5),  # queue
        ).move_to([-3.2, 0.1, 0])
        bird_lab = Text("geai", color=TEXT).scale(0.36).next_to(bird, DOWN, buff=0.2)
        son1 = MathTex(r"/\textrm{j}\varepsilon/", color=YELLOW).scale(0.7).next_to(bird, UP, buff=0.25)

        # dent stylisée
        tooth = VGroup(
            Polygon([0, 0.3, 0], [0.28, 0.3, 0], [0.28, -0.05, 0], [0.16, -0.32, 0],
                    color=TEXT, fill_opacity=0.85).set_stroke(TEXT, 2),
            Polygon([0, 0.3, 0], [-0.28, 0.3, 0], [-0.28, -0.05, 0], [-0.16, -0.32, 0],
                    color=TEXT, fill_opacity=0.85).set_stroke(TEXT, 2),
        ).move_to([3.2, 0.1, 0])
        tooth_lab = Text("dent", color=TEXT).scale(0.36).next_to(tooth, DOWN, buff=0.2)
        son2 = MathTex(r"/\textrm{d}\textrm{\~{a}}/", color=YELLOW).scale(0.7).next_to(tooth, UP, buff=0.25)

        self.play(FadeIn(bird, shift=RIGHT * 0.3), FadeIn(tooth, shift=LEFT * 0.3), run_time=0.7)
        self.play(FadeIn(bird_lab), FadeIn(tooth_lab), run_time=0.4)
        self.play(Write(son1), Write(son2), run_time=0.7)
        self.wait(0.4)

        # les images s'effacent, les sons glissent l'un vers l'autre et fusionnent
        self.play(FadeOut(bird), FadeOut(tooth), FadeOut(bird_lab), FadeOut(tooth_lab), run_time=0.6)
        self.play(son1.animate.move_to([-0.7, 0.1, 0]),
                  son2.animate.move_to([0.7, 0.1, 0]), run_time=0.8)

        jean = Text("JEAN", color=YELLOW, weight=BOLD).scale(0.9).move_to([0, 0.1, 0])
        self.play(ReplacementTransform(VGroup(son1, son2), jean), run_time=0.9)

        msg = Text("le signe vaut pour ce qu'il SONNE, non pour ce qu'il MONTRE",
                   color=TEXT).scale(0.34).next_to(jean, DOWN, buff=0.5)
        self.play(FadeIn(msg), run_time=0.6)
        self.wait(0.8)

        # dernier Transform : pictogramme (boeuf) -> faisceau de coins cunéiformes
        self.play(FadeOut(jean), FadeOut(msg), run_time=0.5)

        ox = VGroup(
            Polygon([-0.3, 0, 0], [0.3, 0, 0], [0.3, -0.4, 0], [-0.3, -0.4, 0],
                    color=ORANGE, fill_opacity=0.2).set_stroke(ORANGE, 2.5),  # tête
            Line([-0.3, 0, 0], [-0.55, 0.45, 0], color=ORANGE, stroke_width=3),   # corne G
            Line([0.3, 0, 0], [0.55, 0.45, 0], color=ORANGE, stroke_width=3),     # corne D
        ).move_to([-2.2, -0.1, 0])
        ox_lab = Text("pictogramme : bœuf", color=MUTED).scale(0.3).next_to(ox, DOWN, buff=0.25)

        # faisceau de coins (clous triangulaires)
        wedge = lambda p, ang: Triangle(color=TEXT, fill_opacity=0.85).set_stroke(TEXT, 0).scale(0.09).rotate(ang).move_to(p)
        cunei = VGroup(
            wedge([2.0, 0.15, 0], -PI / 2),
            wedge([2.3, 0.15, 0], -PI / 2),
            wedge([1.85, -0.15, 0], 0),
            wedge([2.15, -0.2, 0], PI / 6),
            wedge([2.45, -0.05, 0], -PI / 3),
        )
        cunei_lab = Text("cunéiforme", color=TEXT).scale(0.34).next_to(cunei, DOWN, buff=0.3)

        arrowB = Arrow([-1.4, -0.1, 0], [1.3, -0.1, 0], color=BLUE, buff=0.1, stroke_width=4)

        self.play(FadeIn(ox), FadeIn(ox_lab), run_time=0.6)
        self.play(GrowArrow(arrowB), run_time=0.5)
        self.play(TransformFromCopy(ox, cunei), run_time=1.0)
        self.play(FadeIn(cunei_lab), run_time=0.4)
        self.wait(1)
