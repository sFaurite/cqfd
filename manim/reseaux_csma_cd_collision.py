"""CSMA/CD : la collision inevitable.

Rendu : manim -qm manim/reseaux_csma_cd_collision.py ReseauCsmaCollision
"""
import numpy as np
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


def station(label, color):
    box = Rectangle(width=1.0, height=0.8, color=color, fill_color=color, fill_opacity=0.18)
    txt = Text(label, color=color).scale(0.55)
    txt.move_to(box.get_center())
    return VGroup(box, txt)


def wave_packet(x_left, x_right, y, color):
    """Petit train d'ondes (sinus) entre deux abscisses, le long du bus."""
    if x_right <= x_left + 1e-3:
        x_right = x_left + 1e-3
    fn = lambda x: y + 0.30 * np.sin((x - x_left) * 9.0) * np.exp(-((x_right - x) ** 2) * 0.0)
    g = FunctionGraph(fn, x_range=[x_left, x_right, 0.02], color=color)
    g.set_stroke(width=4)
    return g


class ReseauCsmaCollision(Scene):
    def construct(self):
        BUS_L, BUS_R = -5.2, 5.2
        BUS_Y = 0.4

        title = Text("CSMA/CD : la collision inévitable", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # --- Decor : le bus partage + stations A et B ---
        bus = Line([BUS_L, BUS_Y, 0], [BUS_R, BUS_Y, 0], color=MUTED).set_stroke(width=6)
        midpoint = Dot([0, BUS_Y, 0], color=MUTED).scale(0.7)
        mid_label = Text("milieu", color=MUTED).scale(0.32).next_to(midpoint, UP, buff=0.12)

        # place stations at the bus extremities
        A = station("A", BLUE).move_to([BUS_L, BUS_Y, 0])
        B = station("B", ORANGE).move_to([BUS_R, BUS_Y, 0])

        # axe temps discret en bas
        time_axis = Line([BUS_L, -3.4, 0], [BUS_R, -3.4, 0], color=BLUE_D).set_stroke(width=3)
        ticks = VGroup()
        tick_xs = np.linspace(BUS_L, BUS_R, 9)
        tick_labels = ["0", "", "", "", r"\tau/2", "", "", "", r"\tau"]
        for tx, tl in zip(tick_xs, tick_labels):
            t = Line([tx, -3.5, 0], [tx, -3.3, 0], color=BLUE_D).set_stroke(width=2)
            ticks.add(t)
        clock_lbl = Text("temps", color=MUTED).scale(0.30).next_to(time_axis, LEFT, buff=0.18)

        self.play(Create(bus), FadeIn(A), FadeIn(B))
        self.play(FadeIn(midpoint), FadeIn(mid_label), Create(time_axis), FadeIn(clock_lbl), run_time=0.6)

        # =========================================================
        # ETAPE 1 (0-3s) : A emet a t=0, front bleu se propage ->
        # =========================================================
        lab1 = MathTex(r"A \text{ \'emet \`a } t=0", color=BLUE).scale(0.6).to_corner(DL).shift(UP * 0.4)
        self.play(Write(lab1), A[0].animate.set_fill(BLUE, opacity=0.45))

        # tracker pour le front bleu (position de droite du paquet)
        front_blue = ValueTracker(BUS_L)
        blue_wave = always_redraw(
            lambda: wave_packet(BUS_L, front_blue.get_value(), BUS_Y, BLUE)
        )
        blue_head = always_redraw(
            lambda: Dot([front_blue.get_value(), BUS_Y, 0], color=BLUE).scale(0.6)
        )
        self.add(blue_wave, blue_head)
        # le front bleu avance jusqu'au milieu en ~2.4s (vitesse finie visible)
        self.play(front_blue.animate.set_value(-0.2), run_time=2.4, rate_func=linear)

        # =========================================================
        # ETAPE 2 (3-6s) : B ecoute au milieu AVANT l'arrivee du front
        # =========================================================
        # B regarde le milieu : le cable parait libre cote B
        sense = DashedLine([0, BUS_Y + 0.1, 0], [BUS_R, BUS_Y + 0.1, 0], color=GREEN).set_stroke(width=3)
        lab2 = MathTex(r"B \text{ \'ecoute \`a } t=\tau/2 : \text{ silence}", color=GREEN).scale(0.55)
        lab2.to_corner(DR).shift(UP * 0.4)
        free_zone = Rectangle(width=BUS_R - 0.2, height=0.5, color=GREEN, fill_color=GREEN, fill_opacity=0.10)
        free_zone.move_to([(0.2 + BUS_R) / 2 + 0.0, BUS_Y, 0])
        self.play(Create(sense), FadeIn(free_zone), Write(lab2), run_time=1.0)
        self.wait(0.4)
        self.play(FadeOut(sense), FadeOut(free_zone), run_time=0.4)

        # B se croit autorisee -> emet un front orange de droite vers la gauche
        self.play(B[0].animate.set_fill(ORANGE, opacity=0.45), run_time=0.3)
        front_orange = ValueTracker(BUS_R)
        orange_wave = always_redraw(
            lambda: wave_packet(front_orange.get_value(), BUS_R, BUS_Y - 0.0, ORANGE)
        )
        orange_head = always_redraw(
            lambda: Dot([front_orange.get_value(), BUS_Y, 0], color=ORANGE).scale(0.6)
        )
        self.add(orange_wave, orange_head)

        # =========================================================
        # ETAPE 3 (6-9s) : les deux fronts convergent -> COLLISION
        # =========================================================
        # ils convergent vers le milieu (point de rencontre ~ x=0.5)
        meet_x = 0.6
        self.play(
            front_blue.animate.set_value(meet_x),
            front_orange.animate.set_value(meet_x),
            run_time=2.2,
            rate_func=linear,
        )

        # eclair rouge zigzag = collision
        def zigzag(center, n=7, w=1.6, h=0.5):
            pts = []
            xs = np.linspace(center[0] - w / 2, center[0] + w / 2, n)
            for i, xz in enumerate(xs):
                yz = center[1] + (h / 2 if i % 2 == 0 else -h / 2)
                pts.append([xz, yz, 0])
            return VMobject(color=RED).set_points_as_corners(pts).set_stroke(width=5)

        collision_center = [meet_x, BUS_Y, 0]
        flash = zigzag(collision_center)
        coll_txt = Text("COLLISION", color=RED, weight=BOLD).scale(0.5).next_to([meet_x, BUS_Y, 0], UP, buff=0.7)
        coll_math = MathTex(r"t=\tau", color=RED).scale(0.6).next_to(coll_txt, UP, buff=0.15)

        # signaux JAM aux deux stations
        jamA = Text("JAM", color=RED).scale(0.4).next_to(A, DOWN, buff=0.2)
        jamB = Text("JAM", color=RED).scale(0.4).next_to(B, DOWN, buff=0.2)

        self.play(Create(flash), FadeIn(coll_txt), Write(coll_math), run_time=0.5)
        # faire vibrer / brouiller la zone
        for _ in range(4):
            new_flash = zigzag(collision_center, h=0.5 + 0.25 * np.random.rand())
            self.play(Transform(flash, new_flash), run_time=0.12)
        self.play(FadeIn(jamA), FadeIn(jamB), run_time=0.3)
        self.wait(0.4)

        # =========================================================
        # ETAPE 4 (9-12s) : arret + backoff exponentiel binaire
        # =========================================================
        self.play(
            FadeOut(blue_wave), FadeOut(orange_wave), FadeOut(blue_head),
            FadeOut(orange_head), FadeOut(flash), FadeOut(jamA), FadeOut(jamB),
            FadeOut(lab1), FadeOut(lab2), FadeOut(coll_txt), FadeOut(coll_math),
            A[0].animate.set_fill(BLUE, opacity=0.18),
            B[0].animate.set_fill(ORANGE, opacity=0.18),
            run_time=0.6,
        )

        backoff_t = Text("backoff exponentiel binaire", color=YELLOW).scale(0.5).to_edge(UP).shift(DOWN * 0.9)
        backoff_m = MathTex(r"k \in \{0, 1, \dots, 2^m - 1\}", color=YELLOW).scale(0.6).next_to(backoff_t, DOWN, buff=0.25)
        self.play(FadeOut(title), Write(backoff_t), Write(backoff_m))

        # A tire k=0, B tire k=1 -> cases d'attente (tranches de 2*tau)
        kA = MathTex(r"A : k=0", color=BLUE).scale(0.6)
        kB = MathTex(r"B : k=1", color=ORANGE).scale(0.6)
        kA.next_to(A, UP, buff=0.6)
        kB.next_to(B, UP, buff=0.6)
        self.play(Write(kA), Write(kB))

        # cases d'attente : A 0 tranche, B 1 tranche de 2 tau
        slotA = Rectangle(width=0.0, height=0.5)  # A : 0 tranche
        slotB = Rectangle(width=1.4, height=0.5, color=ORANGE, fill_color=ORANGE, fill_opacity=0.25)
        slotB.next_to(B, DOWN, buff=0.5)
        slotB_lbl = MathTex(r"1 \times 2\tau", color=ORANGE).scale(0.45).move_to(slotB.get_center())
        readyA = Text("prêt", color=GREEN).scale(0.4).next_to(A, DOWN, buff=0.5)
        self.play(FadeIn(slotB), FadeIn(slotB_lbl), FadeIn(readyA), run_time=0.6)
        self.wait(0.6)

        # =========================================================
        # ETAPE 5 (12-16s) : A re-emet seule -> succes
        # =========================================================
        self.play(
            FadeOut(slotB), FadeOut(slotB_lbl), FadeOut(readyA),
            FadeOut(kA), FadeOut(kB), FadeOut(backoff_t), FadeOut(backoff_m),
            A[0].animate.set_fill(BLUE, opacity=0.45),
            run_time=0.5,
        )

        front_blue2 = ValueTracker(BUS_L)
        blue_wave2 = always_redraw(
            lambda: wave_packet(BUS_L, front_blue2.get_value(), BUS_Y, BLUE)
        )
        blue_head2 = always_redraw(
            lambda: Dot([front_blue2.get_value(), BUS_Y, 0], color=BLUE).scale(0.6)
        )
        self.add(blue_wave2, blue_head2)
        self.play(front_blue2.animate.set_value(BUS_R), run_time=2.6, rate_func=linear)

        # succes : check vert + label
        check = VMobject(color=GREEN).set_points_as_corners(
            [[-0.25, 0, 0], [-0.05, -0.22, 0], [0.35, 0.3, 0]]
        ).set_stroke(width=8)
        check.next_to(B, UP, buff=0.4)
        succ = Text("symétrie brisée par le hasard", color=GREEN).scale(0.45).to_edge(DOWN).shift(UP * 0.2)
        self.play(
            B[0].animate.set_fill(GREEN, opacity=0.4),
            Create(check),
            FadeIn(succ),
            run_time=0.8,
        )

        self.wait(1.0)
