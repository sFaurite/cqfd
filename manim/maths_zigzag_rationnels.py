"""Q est dénombrable : le zigzag de Cantor sur la grille des fractions p/q.

Rendu :
  PYTHONPATH=. manim -qm maths_zigzag_rationnels.py ZigzagRationnels
"""
from math import gcd

from manim import *
from theme import BG, BLUE, YELLOW, RED, GREEN, TEXT, MUTED


class ZigzagRationnels(Scene):
    N_COLS = 7  # p = 1..7
    N_ROWS = 5  # q = 1..5

    def construct(self):
        # --- Poser : le titre et la question ---
        titre = Text(
            "ℚ est dénombrable — le zigzag de Cantor", color=TEXT, weight=BOLD
        ).scale(0.6).to_edge(UP)
        self.play(FadeIn(titre, shift=DOWN * 0.3))

        question = Text("Peut-on numéroter toutes les fractions ?", color=MUTED).scale(0.55)
        self.play(FadeIn(question))
        self.wait(1.2)
        self.play(FadeOut(question))

        # --- Grille de fractions p/q ---
        x0, y0 = -3.45, 2.1
        dx, dy = 1.15, 1.0

        def pos(p, q):
            return np.array([x0 + (p - 1) * dx, y0 - (q - 1) * dy, 0.0])

        fracs = {}
        grid = VGroup()
        for q in range(1, self.N_ROWS + 1):
            for p in range(1, self.N_COLS + 1):
                frac = MathTex(r"\frac{%d}{%d}" % (p, q), color=TEXT).scale(0.45)
                frac.move_to(pos(p, q))
                # Fond opaque : le chemin (z_index -2) passera "derrière" chaque fraction
                fond = BackgroundRectangle(frac, color=BG, fill_opacity=1.0, buff=0.07)
                fond.set_z_index(-1)
                fracs[(p, q)] = frac
                grid.add(VGroup(fond, frac))

        self.play(LaggedStart(
            *[FadeIn(c, scale=0.85) for c in grid], lag_ratio=0.02, run_time=2.0,
        ))
        self.wait(0.5)

        # --- Construire : le chemin de Cantor sur les anti-diagonales p+q = d ---
        # d pair : p croissant (on monte) ; d impair : p décroissant (on descend).
        diagonales = []
        for d in range(2, 8):
            ps = [p for p in range(1, d) if p <= self.N_COLS and (d - p) <= self.N_ROWS]
            if d % 2 == 1:
                ps = ps[::-1]
            diagonales.append([(p, d - p) for p in ps])

        curseur = Dot(pos(1, 1), radius=0.07, color=YELLOW, z_index=6)
        chemin = VGroup()
        numeros = VGroup()
        croix = VGroup()
        legende = None

        self.play(FadeIn(curseur, scale=0.5))

        n = 0          # prochain numéro à attribuer
        i = 0          # index global de visite (pilote le rythme)
        prev = pos(1, 1)
        for diag in diagonales:
            for (p, q) in diag:
                cible = pos(p, q)
                rt = max(0.32, 0.65 - 0.025 * i)
                if i > 0:
                    seg = Line(prev, cible, color=BLUE, stroke_width=3.5, stroke_opacity=0.8)
                    seg.set_z_index(-2)
                    chemin.add(seg)
                    self.play(Create(seg), curseur.animate.move_to(cible), run_time=rt)

                frac = fracs[(p, q)]
                if gcd(p, q) > 1:
                    # Doublon : grisé, croix discrète, pas de numéro
                    cr = Cross(frac, stroke_color=RED, stroke_width=3.5, scale_factor=0.8)
                    cr.set_opacity(0.65)
                    croix.add(cr)
                    anims = [frac.animate.set_color(MUTED).set_opacity(0.4), Create(cr)]
                    if legende is None:
                        legende = Text(
                            "2/2 = 1/1 : déjà compté, on saute", color=MUTED
                        ).scale(0.45).to_edge(DOWN, buff=0.45)
                        anims.append(FadeIn(legende))
                    self.play(*anims, run_time=0.45)
                else:
                    n += 1
                    num = MathTex(str(n), color=YELLOW).scale(0.42)
                    num.next_to(frac, DOWN, buff=0.05)
                    # Fond opaque : détache le numéro du trait du chemin (z_index -2)
                    num_fond = BackgroundRectangle(num, color=BG, fill_opacity=1.0, buff=0.03)
                    num_fond.set_z_index(-1)
                    bloc = VGroup(num_fond, num)
                    numeros.add(bloc)
                    self.play(frac.animate.set_color(BLUE), FadeIn(bloc, scale=0.6),
                              run_time=0.35)
                prev = cible
                i += 1
            if len(diag) <= 3:
                self.wait(0.3)  # respiration sur les premières diagonales

        self.wait(0.4)

        # --- Conclure ---
        concl1 = Tex(r"Chaque fraction re\c{c}oit un num\'ero", color=GREEN)
        concl1.scale(0.7).to_edge(DOWN, buff=0.45)
        anims = [FadeOut(curseur), FadeIn(concl1, shift=UP * 0.2)]
        if legende is not None:
            anims.append(FadeOut(legende))
        self.play(*anims)
        self.wait(1.2)

        tableau = VGroup(grid, chemin, numeros, croix)
        self.play(FadeOut(tableau), FadeOut(concl1), run_time=0.8)

        bij = MathTex(r"|\mathbb{Q}| = |\mathbb{N}|", color=YELLOW).scale(1.15)
        bij.move_to(UP * 0.5)
        cadre = SurroundingRectangle(bij, color=YELLOW, buff=0.25, corner_radius=0.08)
        concl2 = Text("ℚ est dénombrable", color=GREEN, weight=BOLD).scale(0.7)
        concl2.next_to(cadre, DOWN, buff=0.5)
        note = Text(
            "(0 et les négatifs s'intercalent de la même façon)", color=MUTED
        ).scale(0.42).next_to(concl2, DOWN, buff=0.35)

        self.play(Write(bij))
        self.play(Create(cadre))
        self.play(FadeIn(concl2, shift=UP * 0.2))
        self.play(FadeIn(note))
        self.wait(2.5)
