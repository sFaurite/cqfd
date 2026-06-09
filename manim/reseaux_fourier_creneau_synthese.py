"""Synthese de Fourier d'un creneau : ajout progressif des harmoniques impaires.

Plus on ajoute de hautes frequences, plus la transition devient nette ;
un creneau exact demanderait un spectre infini (phenomene de Gibbs aux coins).

Rendu :
  manim -qm reseaux_fourier_creneau_synthese.py ReseauFourierCreneau
"""
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


def partial_square(t, harmonics):
    """Somme partielle de Fourier du creneau (harmoniques impaires)."""
    s = 0.0
    for k in harmonics:
        s += (4.0 / (np.pi * k)) * np.sin(2.0 * np.pi * k * t)
    return s


class ReseauFourierCreneau(Scene):
    def construct(self):
        f0 = 1.0  # frequence fondamentale (deux periodes sur t in [0, 2])

        # --- ETAPE 1 : titre + repere temporel + spectre vide ---
        titre = MathTex(
            r"s(t)=\sum_{k\ \text{impair}} \frac{4}{\pi k}\sin(2\pi k f_0 t)",
            color=TEXT,
        ).scale(0.62).to_corner(UL, buff=0.4)
        self.play(Write(titre), run_time=1.6)

        # Repere temporel (haut)
        ax = Axes(
            x_range=[0, 2, 0.5], y_range=[-1.6, 1.6, 1],
            x_length=10.5, y_length=2.8,
            axis_config={"color": MUTED, "include_tip": False, "include_ticks": False},
        ).shift(UP * 1.2)
        lab_t = MathTex("t", color=MUTED).scale(0.55).next_to(ax.x_axis.get_end(), RIGHT, buff=0.15)
        lab_s = MathTex("s(t)", color=MUTED).scale(0.55).next_to(ax.y_axis.get_end(), UP, buff=0.1)

        # Diagramme spectral (bas)
        sax = Axes(
            x_range=[0, 12, 2], y_range=[0, 1.5, 0.5],
            x_length=10.5, y_length=2.0,
            axis_config={"color": MUTED, "include_tip": False, "include_ticks": False},
        ).shift(DOWN * 2.2)
        lab_f = MathTex("f", color=MUTED).scale(0.55).next_to(sax.x_axis.get_end(), RIGHT, buff=0.15)
        lab_amp = Text("amplitude", color=MUTED).scale(0.38).next_to(sax.y_axis.get_end(), UP, buff=0.05)

        # Graduations spectrales en multiples de f0
        spec_ticks = VGroup()
        for k in [1, 3, 5, 7, 9, 11]:
            lab = MathTex(f"{k}f_0", color=MUTED).scale(0.42)
            lab.next_to(sax.c2p(k, 0), DOWN, buff=0.18)
            spec_ticks.add(lab)

        self.play(Create(ax), Create(sax), FadeIn(lab_t), FadeIn(lab_s),
                  FadeIn(lab_f), FadeIn(lab_amp), FadeIn(spec_ticks), run_time=1.2)

        def amp(k):
            return 4.0 / (np.pi * k)

        def spec_bar(k, color):
            return Line(sax.c2p(k, 0), sax.c2p(k, amp(k)), color=color, stroke_width=7)

        def make_curve(harmonics, color=BLUE):
            return ax.plot(lambda t: partial_square(t, harmonics), color=color,
                           x_range=[0, 2, 0.005], stroke_width=4)

        # --- ETAPE 2 : fondamental seul ---
        harmonics = [1]
        curve = make_curve(harmonics)
        bar1 = spec_bar(1, BLUE)
        leg = Text("fondamental", color=BLUE).scale(0.45)
        leg.next_to(ax.c2p(0.5, 1.3), UP, buff=0.05)
        self.play(Create(curve), GrowFromEdge(bar1, DOWN), FadeIn(leg), run_time=1.6)
        self.wait(0.6)

        # --- ETAPE 3 : ajout du 3f0 (harmonique en cours = orange) ---
        h_curve = make_curve([3], color=ORANGE)
        h_curve.set_stroke(opacity=0.85)
        h_dashed = DashedVMobject(h_curve, num_dashes=80, dashed_ratio=0.55)
        leg3 = Text("harmonique 3f0", color=ORANGE).scale(0.42)
        leg3.next_to(ax.c2p(1.5, 1.3), UP, buff=0.05)
        self.play(Create(h_dashed), FadeIn(leg3), run_time=1.0)

        bar3 = spec_bar(3, ORANGE)
        harmonics = [1, 3]
        new_curve = make_curve(harmonics)
        self.play(
            Transform(curve, new_curve),
            GrowFromEdge(bar3, DOWN),
            FadeOut(h_dashed),
            run_time=1.4,
        )
        bar3.set_color(BLUE_D)
        self.play(FadeOut(leg3), run_time=0.4)
        self.wait(0.4)

        # --- ETAPE 4 : 5, 7, 9, 11 ---
        bars = {1: bar1, 3: bar3}
        for k in [5, 7, 9, 11]:
            bar = spec_bar(k, ORANGE)
            leg_k = Text(f"+ {k}f0", color=ORANGE).scale(0.42)
            leg_k.next_to(ax.c2p(1.5, 1.3), UP, buff=0.05)
            self.play(GrowFromEdge(bar, DOWN), FadeIn(leg_k), run_time=0.5)

            harmonics = harmonics + [k]
            new_curve = make_curve(harmonics)
            self.play(Transform(curve, new_curve), run_time=1.0)
            bar.set_color(BLUE_D)
            bars[k] = bar
            self.play(FadeOut(leg_k), run_time=0.25)

        self.wait(0.4)

        # --- ETAPE 5 : creneau ideal cible + fleche vers les coins ---
        ideal = ax.plot(
            lambda t: 1.0 if (t % 1.0) < 0.5 else -1.0,
            color=TEXT, x_range=[0, 2, 0.001], stroke_width=3, use_smoothing=False,
        )
        ideal.set_stroke(opacity=0.55)
        leg_ideal = Text("creneau ideal", color=TEXT).scale(0.42)
        leg_ideal.next_to(ax.c2p(0.5, 1.3), UP, buff=0.05)
        self.play(Create(ideal), ReplacementTransform(leg, leg_ideal), run_time=1.4)
        self.wait(0.4)

        # Fleche vers un coin (transition montante a t = 1.0) et oscillation de Gibbs
        corner_pt = ax.c2p(1.0, 0.0)
        arrow = Arrow(
            start=corner_pt + RIGHT * 1.6 + DOWN * 1.1,
            end=corner_pt + RIGHT * 0.05 + UP * 0.05,
            color=YELLOW, buff=0.05, stroke_width=5, max_tip_length_to_length_ratio=0.25,
        )
        msg = MathTex(
            r"\to \ \text{coin parfait} = f \to \infty",
            color=YELLOW,
        ).scale(0.55).next_to(arrow.get_start(), DOWN, buff=0.1)
        if msg.get_right()[0] > 6.8:
            msg.shift(LEFT * (msg.get_right()[0] - 6.8))

        self.play(GrowArrow(arrow), Write(msg), run_time=1.2)
        # Clignotement de la fleche
        for _ in range(2):
            self.play(arrow.animate.set_opacity(0.2), run_time=0.35)
            self.play(arrow.animate.set_opacity(1.0), run_time=0.35)

        self.wait(1.0)
