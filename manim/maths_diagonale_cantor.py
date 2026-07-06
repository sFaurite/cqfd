"""Argument diagonal de Cantor : aucune liste n'épuise ℝ.

Rendu :
  PYTHONPATH=. manim -qm maths_diagonale_cantor.py DiagonaleCantor
"""
from manim import *
from theme import BG, BLUE, YELLOW, RED, GREEN, TEXT, MUTED


class DiagonaleCantor(Scene):
    def construct(self):
        # ------------------------------------------------------------
        # (1) Titre + liste supposée complète de réels de [0,1[
        # ------------------------------------------------------------
        titre = Text(
            "Supposons une liste de TOUS les réels de [0,1[",
            color=TEXT, weight=BOLD,
        ).scale(0.55).to_edge(UP, buff=0.35)
        self.play(FadeIn(titre, shift=DOWN * 0.3))
        self.wait(0.3)

        # Chiffres binaires : la diagonale vaut 0,1,1,0,1,0 -> d = 0,100101...
        chiffres = [
            [0, 1, 1, 0, 1, 0],
            [1, 1, 0, 0, 1, 1],
            [0, 1, 1, 1, 0, 0],
            [1, 0, 1, 0, 0, 1],
            [0, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 0, 0],
        ]
        n = 6
        x0, dx = -1.55, 0.62      # colonne du 1er chiffre, pas horizontal
        y0, dy = 2.25, 0.62       # ligne r_1, pas vertical

        lignes = VGroup()
        digit_mobs = []  # digit_mobs[i][j] : chiffre j de r_{i+1}
        for i in range(n):
            y = y0 - i * dy
            label = MathTex(rf"r_{{{i + 1}}} = 0{{,}}", color=BLUE).scale(0.65)
            label.move_to(np.array([x0 - 0.45, y, 0]), aligned_edge=RIGHT)
            rang = []
            for j in range(n):
                m = MathTex(str(chiffres[i][j]), color=TEXT).scale(0.65)
                m.move_to(np.array([x0 + j * dx, y, 0]))
                rang.append(m)
            dots = MathTex(r"\dots", color=MUTED).scale(0.65)
            dots.move_to(np.array([x0 + n * dx + 0.2, y, 0]))
            digit_mobs.append(rang)
            lignes.add(VGroup(label, *rang, dots))

        self.play(
            LaggedStart(
                *[FadeIn(ligne, shift=LEFT * 0.3) for ligne in lignes],
                lag_ratio=0.18,
            ),
            run_time=2.4,
        )
        self.wait(0.5)

        # ------------------------------------------------------------
        # (2)+(3) Diagonale surlignée, copiée en bas et inversée
        # ------------------------------------------------------------
        y_d = -1.95
        d_label = MathTex(r"d = 0{,}", color=GREEN).scale(0.7)
        d_label.move_to(np.array([x0 - 0.45, y_d, 0]), aligned_edge=RIGHT)
        legende = Text(
            "On inverse le n-ième chiffre du n-ième réel",
            color=MUTED,
        ).scale(0.45).move_to(np.array([0, -2.9, 0]))
        self.play(FadeIn(d_label), FadeIn(legende))

        carres = VGroup()
        d_digits = []
        for i in range(n):
            dig = digit_mobs[i][i]
            carre = Square(side_length=0.5, color=YELLOW, stroke_width=3)
            carre.move_to(dig)
            carres.add(carre)
            self.play(Create(carre), dig.animate.set_color(YELLOW), run_time=0.25)

            # copie du chiffre diagonal vers la ligne de d
            slot = np.array([x0 + i * dx, y_d, 0])
            temp = dig.copy()
            self.play(temp.animate.move_to(slot), run_time=0.3)

            # bascule animée : le chiffre se replie puis se rouvre inversé
            inv = 1 - chiffres[i][i]
            retourne = MathTex(str(inv), color=GREEN).scale(0.65).move_to(slot)
            cible = retourne.copy()
            retourne.stretch(0.02, 0)
            self.play(temp.animate.stretch(0.02, 0), run_time=0.14)
            self.remove(temp)
            self.add(retourne)
            self.play(Transform(retourne, cible), run_time=0.14)
            d_digits.append(retourne)

        d_dots = MathTex(r"\dots", color=GREEN).scale(0.65)
        d_dots.move_to(np.array([x0 + n * dx + 0.2, y_d, 0]))
        self.play(FadeIn(d_dots), run_time=0.3)
        self.wait(0.6)

        # ------------------------------------------------------------
        # (4) d diffère de chaque r_n au rang n
        # ------------------------------------------------------------
        self.play(FadeOut(carres), FadeOut(legende), run_time=0.5)

        for i in range(4):
            box_r = SurroundingRectangle(digit_mobs[i][i], color=RED, buff=0.09)
            box_d = SurroundingRectangle(d_digits[i], color=RED, buff=0.09)
            ne = MathTex(rf"d \ne r_{{{i + 1}}}", color=RED).scale(0.6)
            ne.next_to(d_dots, RIGHT, buff=0.55)
            self.play(Create(box_r), Create(box_d), FadeIn(ne), run_time=0.3)
            self.wait(0.25)
            self.play(FadeOut(box_r), FadeOut(box_d), FadeOut(ne), run_time=0.2)

        nulle_part = Text(
            "d n'est NULLE PART dans la liste.",
            color=RED, weight=BOLD,
        ).scale(0.5).move_to(np.array([0, -2.9, 0]))
        self.play(FadeIn(nulle_part, shift=UP * 0.2))
        self.wait(1.0)

        # ------------------------------------------------------------
        # (5) Contradiction : il y a plusieurs infinis
        # ------------------------------------------------------------
        self.play(
            FadeOut(titre), FadeOut(lignes),
            FadeOut(d_label), FadeOut(VGroup(*d_digits)), FadeOut(d_dots),
            FadeOut(nulle_part),
            run_time=0.8,
        )

        contradiction = Text(
            "La liste était censée être complète : contradiction.",
            color=TEXT,
        ).scale(0.55).move_to(UP * 1.6)
        ineq = MathTex(r"|\mathbb{R}| > |\mathbb{N}|", color=YELLOW).scale(1.2)
        cadre = SurroundingRectangle(ineq, color=YELLOW, buff=0.25, corner_radius=0.08)
        plusieurs = Text(
            "Il y a plusieurs infinis",
            color=GREEN, weight=BOLD,
        ).scale(0.6).move_to(DOWN * 1.6)

        self.play(FadeIn(contradiction, shift=UP * 0.2))
        self.wait(0.4)
        self.play(Write(ineq))
        self.play(Create(cadre))
        self.wait(0.3)
        self.play(FadeIn(plusieurs, shift=UP * 0.2))
        self.wait(2.5)
