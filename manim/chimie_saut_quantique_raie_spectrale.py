from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

import numpy as np


def energy_y(eV):
    """Mappe une energie en eV (0 -> -13.6) sur une ordonnee a l'ecran.

    0 eV  -> y = 2.6 (haut)
    -13.6 -> y = -3.0 (bas)
    Lineaire en eV pour respecter l'espacement physique en 1/n^2.
    """
    y_top, y_bot = 2.6, -3.0
    e_top, e_bot = 0.0, -13.6
    return y_top + (eV - e_top) * (y_bot - y_top) / (e_bot - e_top)


class ChimieSautQuantiqueRaie(Scene):
    def construct(self):
        # ----------------------------------------------------------------
        # Titre
        # ----------------------------------------------------------------
        titre = Text("Le saut quantique fait une raie", color=TEXT).scale(0.5)
        titre.to_edge(UP)
        self.play(FadeIn(titre, shift=DOWN * 0.2))

        # ----------------------------------------------------------------
        # PANNEAU GAUCHE : echelle d'energie
        # ----------------------------------------------------------------
        x_axis = -5.2  # abscisse de l'axe vertical
        line_x0, line_x1 = -4.9, -2.4  # extension des niveaux

        axis = Arrow(
            start=[x_axis, energy_y(-13.6) - 0.2, 0],
            end=[x_axis, energy_y(0.0) + 0.4, 0],
            color=MUTED, buff=0, stroke_width=3,
            max_tip_length_to_length_ratio=0.06,
        )
        axis_label = MathTex(r"E\,(\text{eV})", color=TEXT).scale(0.5)
        axis_label.next_to(axis.get_top(), UP, buff=0.1)

        # graduations 0 et -13,6
        tick0 = Line([x_axis - 0.1, energy_y(0.0), 0],
                     [x_axis + 0.1, energy_y(0.0), 0], color=MUTED)
        lbl0 = MathTex("0", color=MUTED).scale(0.45).next_to(tick0, LEFT, buff=0.12)
        tickb = Line([x_axis - 0.1, energy_y(-13.6), 0],
                     [x_axis + 0.1, energy_y(-13.6), 0], color=MUTED)
        lblb = MathTex("-13{,}6", color=MUTED).scale(0.45).next_to(tickb, LEFT, buff=0.12)

        # niveaux d'energie n=1..4
        levels = {1: -13.6, 2: -3.40, 3: -1.51, 4: -0.85}
        level_lines = {}
        level_labels = {}
        for n, e in levels.items():
            y = energy_y(e)
            ln = Line([line_x0, y, 0], [line_x1, y, 0], color=BLUE, stroke_width=3)
            lab = MathTex(f"n={n}", color=TEXT).scale(0.45)
            lab.next_to(ln, RIGHT, buff=0.12)
            level_lines[n] = ln
            level_labels[n] = lab

        left_group = VGroup(
            axis, axis_label, tick0, lbl0, tickb, lblb,
            *level_lines.values(), *level_labels.values(),
        )

        # ----------------------------------------------------------------
        # PANNEAU DROIT : bande spectrale du visible
        # ----------------------------------------------------------------
        spec_x0, spec_x1 = 1.0, 6.4
        spec_y0, spec_y1 = -0.7, 0.9
        spec_w = spec_x1 - spec_x0
        spectrum = Rectangle(
            width=spec_w, height=spec_y1 - spec_y0,
            fill_color="#05070a", fill_opacity=1.0,
            stroke_color=MUTED, stroke_width=2,
        )
        spectrum.move_to([(spec_x0 + spec_x1) / 2, (spec_y0 + spec_y1) / 2, 0])

        spec_title = Text("Spectre visible", color=MUTED).scale(0.4)
        # assez haut pour laisser la place aux labels H-alpha / H-beta des raies
        spec_title.next_to(spectrum, UP, buff=0.55)

        lbl_400 = MathTex(r"400\,\text{nm}", color=MUTED).scale(0.38)
        lbl_400.next_to(spectrum.get_corner(DL), DOWN, buff=0.1).shift(RIGHT * 0.1)
        lbl_700 = MathTex(r"700\,\text{nm}", color=MUTED).scale(0.38)
        lbl_700.next_to(spectrum.get_corner(DR), DOWN, buff=0.1).shift(LEFT * 0.1)

        right_group = VGroup(spectrum, spec_title, lbl_400, lbl_700)

        def nm_to_x(nm):
            return spec_x0 + (nm - 400.0) * spec_w / (700.0 - 400.0)

        # ----------------------------------------------------------------
        # ETAPE 1 : apparition de l'echelle + electron sur n=3
        # ----------------------------------------------------------------
        self.play(
            FadeIn(left_group, shift=RIGHT * 0.2),
            FadeIn(right_group, shift=LEFT * 0.2),
            run_time=1.6,
        )

        electron = Dot(color=YELLOW, radius=0.11)
        electron.move_to([(line_x0 + line_x1) / 2, energy_y(levels[3]), 0])
        glow = electron.copy().set_opacity(0.35).scale(1.8)
        glow.set_color(YELLOW)

        self.play(FadeIn(electron, scale=0.5), FadeIn(glow))
        # pulsation douce sur n=3
        self.play(
            glow.animate.scale(1.4).set_opacity(0.12),
            rate_func=there_and_back, run_time=1.2,
        )

        # ----------------------------------------------------------------
        # Formule centre-bas
        # ----------------------------------------------------------------
        formule = MathTex(
            r"h\nu", r"=", r"E_{n_i}-E_{n_f}", r"=",
            r"13{,}6\,\text{eV}\left(\dfrac{1}{n_f^2}-\dfrac{1}{n_i^2}\right)",
            color=TEXT,
        ).scale(0.6)
        # décalée à droite : centrée, elle chevauche le niveau n=1 et son label
        formule.to_edge(DOWN, buff=0.55).shift(RIGHT * 1.8)

        # ----------------------------------------------------------------
        # Fonction utilitaire : photon (onde sinusoidale courte)
        # ----------------------------------------------------------------
        def make_photon(color, y):
            wave = ParametricFunction(
                lambda t: np.array([t, 0.15 * np.sin(2 * PI * t / 0.18), 0]),
                t_range=[0, 0.9, 0.02], color=color, stroke_width=3,
            )
            wave.move_to([line_x1 + 0.6, y, 0])
            return wave

        # ----------------------------------------------------------------
        # ETAPE 2 : saut n=3 -> n=2, photon H-alpha (rouge)
        # ----------------------------------------------------------------
        y3 = energy_y(levels[3])
        y2 = energy_y(levels[2])
        H_ALPHA = "#fc6255"  # rouge (656 nm)

        # trainee : copies estompees
        trail = VGroup()
        for k in range(4):
            t = electron.copy().set_opacity(0.0)
            trail.add(t)

        photon_a = make_photon(H_ALPHA, (y3 + y2) / 2)
        photon_a.set_opacity(0)

        self.play(Write(formule), run_time=1.4)

        # descente de l'electron + emission du photon
        self.play(
            electron.animate.move_to([electron.get_x(), y2, 0]),
            glow.animate.move_to([electron.get_x(), y2, 0]).set_opacity(0.25),
            run_time=1.4, rate_func=smooth,
        )

        # le photon jaillit et file vers la droite
        photon_a.set_opacity(1).move_to([line_x1 + 0.6, (y3 + y2) / 2, 0])
        target_x_a = nm_to_x(656)
        self.play(
            photon_a.animate.move_to([target_x_a - 0.3, (spec_y0 + spec_y1) / 2, 0]),
            run_time=1.6, rate_func=linear,
        )

        # raie H-alpha sur le spectre
        raie_a = Line(
            [nm_to_x(656), spec_y0 + 0.03, 0],
            [nm_to_x(656), spec_y1 - 0.03, 0],
            color=H_ALPHA, stroke_width=4,
        )
        lbl_a = Text("H-alpha", color=H_ALPHA).scale(0.34)
        lbl_a.next_to([nm_to_x(656), spec_y1, 0], UP, buff=0.08)
        self.play(GrowFromCenter(raie_a), FadeOut(photon_a))
        self.play(FadeIn(lbl_a, shift=DOWN * 0.1), run_time=0.6)

        # ----------------------------------------------------------------
        # ETAPE 3 : substitution ni=3, nf=2 -> ~1,89 eV
        # ----------------------------------------------------------------
        formule2 = MathTex(
            r"h\nu", r"=", r"E_{3}-E_{2}", r"=",
            r"13{,}6\,\text{eV}\left(\dfrac{1}{2^2}-\dfrac{1}{3^2}\right)",
            r"\approx 1{,}89\,\text{eV}",
            color=TEXT,
        ).scale(0.6)
        formule2.to_edge(DOWN, buff=0.55).shift(RIGHT * 1.8)
        formule2[5].set_color(H_ALPHA)

        # ReplacementTransform et non TransformMatchingTex : ce dernier laisse
        # les sous-formules non appariées des deux MathTex superposées à l'écran.
        self.play(ReplacementTransform(formule, formule2), run_time=1.6)
        self.wait(0.6)

        # ----------------------------------------------------------------
        # ETAPE 4 : 2e transition n=4 -> n=2, photon H-beta (bleu)
        # ----------------------------------------------------------------
        y4 = energy_y(levels[4])
        H_BETA = BLUE  # bleu-cyan (486 nm)

        # teleportation discrete : fondu vers n=4
        electron_top = electron.copy().move_to([electron.get_x(), y4, 0]).set_opacity(0)
        self.play(
            electron.animate.set_opacity(0),
            glow.animate.set_opacity(0),
            run_time=0.5,
        )
        electron.move_to([electron.get_x(), y4, 0])
        glow.move_to([electron.get_x(), y4, 0])
        self.play(
            electron.animate.set_opacity(1),
            glow.animate.set_opacity(0.25),
            run_time=0.5,
        )

        photon_b = make_photon(H_BETA, (y4 + y2) / 2)

        # redescente n=4 -> n=2
        self.play(
            electron.animate.move_to([electron.get_x(), y2, 0]),
            glow.animate.move_to([electron.get_x(), y2, 0]),
            run_time=1.2, rate_func=smooth,
        )

        photon_b.move_to([line_x1 + 0.6, (y4 + y2) / 2, 0])
        target_x_b = nm_to_x(486)
        self.play(
            photon_b.animate.move_to([target_x_b - 0.3, (spec_y0 + spec_y1) / 2, 0]),
            run_time=1.4, rate_func=linear,
        )

        raie_b = Line(
            [nm_to_x(486), spec_y0 + 0.03, 0],
            [nm_to_x(486), spec_y1 - 0.03, 0],
            color=H_BETA, stroke_width=4,
        )
        lbl_b = Text("H-beta", color=H_BETA).scale(0.34)
        lbl_b.next_to([nm_to_x(486), spec_y1, 0], UP, buff=0.08)
        self.play(GrowFromCenter(raie_b), FadeOut(photon_b))
        self.play(FadeIn(lbl_b, shift=DOWN * 0.1), run_time=0.5)

        # ----------------------------------------------------------------
        # Message final
        # ----------------------------------------------------------------
        final = Text("Niveaux discrets  ⇒  raies discrètes", color=YELLOW).scale(0.5)
        final.move_to([0, -3.55, 0])
        self.play(
            FadeOut(formule2, shift=DOWN * 0.3),
            FadeIn(final, shift=UP * 0.2),
            run_time=1.0,
        )

        self.wait(1)
