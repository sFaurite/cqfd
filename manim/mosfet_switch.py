"""Le MOSFET comme interrupteur commandé en tension.

Rendu : manim -qm manim/mosfet_switch.py MosfetSwitch
"""
from manim import *
from theme import BLUE, YELLOW, GREEN, RED, TEAL, TEXT, MUTED


class MosfetSwitch(Scene):
    def construct(self):
        title = Text("Le MOSFET : un interrupteur commandé par une tension", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        # --- substrat ---
        sub = Rectangle(width=5.2, height=1.2, color=MUTED, fill_opacity=0.10).move_to([0, -1.0, 0])
        sub_l = Text("substrat (P)", color=MUTED).scale(0.32).move_to([0, -1.45, 0])

        # --- source / drain (n+) ---
        src = Rectangle(width=1.0, height=0.7, color=BLUE, fill_opacity=0.7).move_to([-1.7, -0.65, 0])
        drn = Rectangle(width=1.0, height=0.7, color=BLUE, fill_opacity=0.7).move_to([1.7, -0.65, 0])
        src_l = Text("Source", color=TEXT).scale(0.34).next_to(src, DOWN, buff=0.12)
        drn_l = Text("Drain", color=TEXT).scale(0.34).next_to(drn, DOWN, buff=0.12)

        # --- grille + oxyde ---
        oxide = Rectangle(width=2.4, height=0.10, color=MUTED, fill_opacity=0.35).move_to([0, -0.30, 0])
        gate = Rectangle(width=2.4, height=0.18, color=MUTED, fill_opacity=0.9).move_to([0, -0.12, 0])
        gate_l = Text("Grille", color=TEXT).scale(0.34).next_to(gate, UP, buff=0.1)

        transistor = VGroup(sub, sub_l, src, drn, src_l, drn_l, oxide, gate, gate_l)
        self.play(FadeIn(transistor, shift=UP * 0.2))

        # --- fil de grille vers V_GS ---
        gate_wire = Line([0, -0.03, 0], [0, 1.6, 0], color=MUTED)
        vgs = MathTex(r"V_{GS}", color=TEXT).scale(0.7).move_to([0, 1.95, 0])
        self.play(Create(gate_wire), Write(vgs))

        # --- fil de drain vers la lampe + V_DD ---
        lamp = Circle(radius=0.34, color=MUTED, fill_opacity=0.1).move_to([3.4, 0.6, 0])
        lamp_l = Text("lampe", color=MUTED).scale(0.3).next_to(lamp, UP, buff=0.08)
        dwire = VGroup(
            Line([2.2, -0.65, 0], [3.4, -0.65, 0], color=MUTED),
            Line([3.4, -0.65, 0], [3.4, 0.26, 0], color=MUTED),
            Line([3.4, 0.94, 0], [3.4, 1.6, 0], color=MUTED),
        )
        vdd = MathTex(r"+V_{DD}", color=TEXT).scale(0.6).move_to([3.4, 1.85, 0])
        # source vers la masse
        swire = Line([-1.7, -1.0, 0], [-1.7, -2.0, 0], color=MUTED)
        gnd = VGroup(
            Line([-2.0, -2.0, 0], [-1.4, -2.0, 0], color=MUTED),
            Line([-1.9, -2.12, 0], [-1.5, -2.12, 0], color=MUTED),
            Line([-1.8, -2.24, 0], [-1.6, -2.24, 0], color=MUTED),
        )
        self.play(Create(dwire), Create(swire), Create(gnd), FadeIn(lamp), FadeIn(lamp_l))

        # === état BLOQUÉ ===
        seuil = MathTex(r"V_{GS} = 0{,}3\,\text{V} < V_{th}", color=RED).scale(0.6).move_to([0, 1.3, 0])
        nochan = DashedLine([-1.2, -0.55, 0], [1.2, -0.55, 0], color=MUTED, dash_length=0.08)
        etat = Text("BLOQUÉ", color=RED, weight=BOLD).scale(0.6).to_edge(DOWN)
        self.play(Write(seuil), Create(nochan), FadeIn(etat))
        self.wait(1.2)

        # === transition vers PASSANT ===
        seuil2 = MathTex(r"V_{GS} = 0{,}9\,\text{V} \geq V_{th}", color=GREEN).scale(0.6).move_to([0, 1.3, 0])
        channel = Rectangle(width=2.4, height=0.16, color=TEAL, fill_opacity=0.7).move_to([0, -0.55, 0])
        chan_l = Text("canal d'électrons", color=TEAL).scale(0.3).move_to([0, 0.95, 0]).set_z_index(-1)
        etat2 = Text("PASSANT", color=GREEN, weight=BOLD).scale(0.6).to_edge(DOWN)

        self.play(
            ReplacementTransform(seuil, seuil2),
            FadeOut(nochan),
            FadeIn(channel),
            gate.animate.set_color(YELLOW),
            ReplacementTransform(etat, etat2),
            FadeIn(chan_l),
        )
        # lampe s'allume
        self.play(lamp.animate.set_fill(YELLOW, opacity=0.85).set_stroke(YELLOW), run_time=0.6)

        # électrons qui circulent dans le canal
        for _ in range(2):
            dots = VGroup(*[Dot(point=[-1.1 + i * 0.45, -0.55, 0], radius=0.05, color=BLUE) for i in range(6)])
            self.add(dots)
            self.play(dots.animate.shift(RIGHT * 2.2), run_time=1.2, rate_func=linear)
            self.remove(dots)

        self.wait(1.0)
