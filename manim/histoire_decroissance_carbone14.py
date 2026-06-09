"""L'horloge du carbone 14 : décroissance exponentielle et limite pratique.

Rendu : manim -qm manim/histoire_decroissance_carbone14.py HistoireDecroissanceCarbone14
"""
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

T = 5.73  # demi-vie en milliers d'années (ka)


def frac(x):
    return 0.5 ** (x / T)


class HistoireDecroissanceCarbone14(Scene):
    def construct(self):
        # --- Titre ---
        title = Text("L'horloge du carbone 14", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # --- Axes (bas à gauche) ---
        axes = Axes(
            x_range=[0, 50, T],
            y_range=[0, 1, 0.25],
            x_length=7.2,
            y_length=4.0,
            tips=False,
            axis_config={"color": MUTED, "stroke_width": 2, "include_numbers": False},
        ).to_corner(DL, buff=0.6).shift(UP * 0.1)

        x_label = Text("temps (ka)", color=MUTED).scale(0.3)
        x_label.next_to(axes.c2p(50, 0), DOWN, buff=0.15).shift(LEFT * 0.3)
        y_label = MathTex(r"\frac{N}{N_0}", color=MUTED).scale(0.5)
        y_label.next_to(axes.y_axis, UP, buff=0.12)
        self.play(Create(axes), FadeIn(x_label), FadeIn(y_label))

        # Graduations Y (fractions)
        y_vals = [1, 0.5, 0.25, 0.125]
        y_ticks = VGroup()
        for v in y_vals:
            lab = MathTex(f"{v}".replace(".", "{,}"), color=MUTED).scale(0.34)
            lab.next_to(axes.c2p(0, v), LEFT, buff=0.12)
            y_ticks.add(lab)
        self.play(FadeIn(y_ticks))

        # Graduations X (demi-vies)
        x_ticks = VGroup()
        for k in range(1, 5):
            xk = k * T
            txt = "1 demi-vie" if k == 1 else f"{k}"
            sc = 0.28 if k == 1 else 0.34
            lab = Text(txt, color=MUTED).scale(sc)
            lab.next_to(axes.c2p(xk, 0), DOWN, buff=0.12)
            x_ticks.add(lab)
        self.play(FadeIn(x_ticks))

        # --- Formule (en haut, sous le titre) ---
        formula = MathTex(
            r"N(t) = N_0 \, \left(\tfrac{1}{2}\right)^{t/T} \quad T \approx 5\,730\ \text{ans}",
            color=YELLOW,
        ).scale(0.55)
        formula.next_to(title, DOWN, buff=0.2)
        self.play(Write(formula))

        # --- ÉTAPE 1 : réservoir d'atomes (grille 8x8 = 64 points) ---
        n = 8
        dots = VGroup()
        for r in range(n):
            for c in range(n):
                d = Dot(radius=0.045, color=YELLOW)
                d.move_to([c * 0.12, -r * 0.12, 0])
                dots.add(d)
        dots.move_to([4.6, 0.7, 0])
        res_label = Text("C-14 à la mort\nde l'organisme", color=YELLOW).scale(0.3)
        res_label.next_to(dots, DOWN, buff=0.2)
        self.play(FadeIn(dots, lag_ratio=0.01), FadeIn(res_label))
        self.wait(0.6)

        # --- ÉTAPE 2 : tracer la courbe avec curseur + demi-vies ---
        curve = axes.plot(lambda x: frac(x), x_range=[0, 4 * T, 0.05], color=ORANGE, stroke_width=4)
        cursor = Dot(color=ORANGE, radius=0.08).move_to(axes.c2p(0, 1))

        self.play(FadeIn(cursor))
        # Curseur tracker
        t_tracker = ValueTracker(0.0)
        cursor.add_updater(lambda m: m.move_to(axes.c2p(t_tracker.get_value(), frac(t_tracker.get_value()))))

        # Tracé progressif synchronisé
        self.play(
            Create(curve),
            t_tracker.animate.set_value(4 * T),
            run_time=5.5,
            rate_func=linear,
        )
        cursor.clear_updaters()

        # Annotations à chaque demi-vie : ligne pointillée, étiquette de fraction,
        # disparition de la moitié des points.
        fractions = [
            (1, 0.5, "50\\%"),
            (2, 0.25, "25\\%"),
            (3, 0.125, "12{,}5\\%"),
            (4, 0.0625, "6{,}25\\%"),
        ]
        remaining = list(dots)  # points encore présents
        for k, yv, txt in fractions:
            xk = k * T
            pt = axes.c2p(xk, yv)
            # ligne pointillée horizontale vers l'axe Y
            hline = DashedLine(pt, axes.c2p(0, yv), color=MUTED, stroke_width=2, dash_length=0.1)
            # ligne pointillée verticale vers l'axe X
            vline = DashedLine(pt, axes.c2p(xk, 0), color=MUTED, stroke_width=2, dash_length=0.1)
            mk = Dot(pt, radius=0.05, color=YELLOW)
            frac_lab = MathTex(txt, color=YELLOW).scale(0.4).next_to(pt, UR, buff=0.08)

            # moitié des points restants à faire disparaître
            half = remaining[len(remaining) // 2:]
            remaining = remaining[:len(remaining) // 2]
            half_grp = VGroup(*half)

            self.play(
                Create(hline), Create(vline), FadeIn(mk),
                FadeIn(frac_lab),
                Indicate(half_grp, color=RED, scale_factor=1.2),
                run_time=0.55,
            )
            self.play(FadeOut(half_grp), run_time=0.3)

        self.wait(0.4)

        # --- ÉTAPE 3 : limite pratique ~50 000 ans ---
        # Prolonger la courbe en pointillé grisé au-delà de 4 demi-vies
        curve_far = axes.plot(
            lambda x: frac(x), x_range=[4 * T, 50, 0.1], color=MUTED, stroke_width=2,
        )
        curve_far_d = DashedVMobject(curve_far, num_dashes=60)

        # bande verticale rouge translucide à ~50 000 ans (de 45 à 50 ka)
        x0 = axes.c2p(45, 0)
        x1 = axes.c2p(50, 1)
        band = Rectangle(
            width=abs(x1[0] - x0[0]),
            height=abs(x1[1] - x0[1]),
            color=RED,
            fill_opacity=0.15,
            stroke_width=0,
        )
        band.move_to([(x0[0] + x1[0]) / 2, (x0[1] + x1[1]) / 2, 0])
        band_lab = Text("limite pratique ~50 000 ans\n(< 0,4 %)", color=RED).scale(0.28)
        band_lab.next_to(band, UP, buff=0.1).shift(LEFT * 0.3)

        self.play(Create(curve_far_d), run_time=0.8)
        self.play(FadeIn(band), FadeIn(band_lab))

        msg = Text(
            "le C-14 ne dit rien du Paléolithique ancien",
            color=TEXT,
        ).scale(0.36)
        msg.to_edge(DOWN, buff=0.25)
        self.play(FadeIn(msg))
        self.wait(1)
