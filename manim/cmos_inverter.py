"""L'inverseur CMOS : la fonction NON.

Rendu : manim -qm manim/cmos_inverter.py CmosInverter
"""
from manim import *
from theme import GREEN, RED, YELLOW, MUTED, TEXT


class CmosInverter(Scene):
    def construct(self):
        title = Text("L'inverseur CMOS : la fonction NON", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        vdd = Line([-1, 2.3, 0], [1, 2.3, 0], color=TEXT)
        vdd_l = MathTex(r"V_{DD}=1", color=TEXT).scale(0.5).next_to(vdd, UP, buff=0.1)
        gnd = Line([-1, -2.3, 0], [1, -2.3, 0], color=TEXT)
        gnd_l = MathTex(r"\text{masse}=0", color=TEXT).scale(0.5).next_to(gnd, DOWN, buff=0.1)

        pmos = Rectangle(width=1.1, height=1.0, color=MUTED, fill_opacity=0.3).move_to([0, 1.0, 0])
        pmos_l = Text("PMOS", color=MUTED).scale(0.34).move_to(pmos)
        nmos = Rectangle(width=1.1, height=1.0, color=MUTED, fill_opacity=0.3).move_to([0, -1.0, 0])
        nmos_l = Text("NMOS", color=MUTED).scale(0.34).move_to(nmos)

        w1 = Line([0, 2.3, 0], [0, 1.5, 0], color=TEXT)
        w2 = Line([0, 0.5, 0], [0, -0.5, 0], color=TEXT)
        w3 = Line([0, -1.5, 0], [0, -2.3, 0], color=TEXT)
        yout = Line([0, 0.0, 0], [1.9, 0.0, 0], color=TEXT)
        ynode = Dot([0, 0, 0], color=YELLOW)
        y_l = MathTex(r"Y", color=YELLOW).scale(0.6).next_to(yout, UP, buff=0.1)
        agate = VGroup(
            Line([-2.2, 0, 0], [-1.0, 0, 0], color=TEXT),
            Line([-1.0, 1.0, 0], [-1.0, -1.0, 0], color=TEXT),
            Line([-1.0, 1.0, 0], [-0.55, 1.0, 0], color=TEXT),
            Line([-1.0, -1.0, 0], [-0.55, -1.0, 0], color=TEXT),
        )
        a_l = MathTex(r"A", color=TEXT).scale(0.6).move_to([-2.5, 0, 0])

        self.play(
            Create(VGroup(vdd, gnd, w1, w2, w3, yout, agate)),
            FadeIn(VGroup(pmos, nmos, pmos_l, nmos_l, ynode)),
            Write(VGroup(vdd_l, gnd_l, y_l, a_l)),
        )

        eq = MathTex(r"A=0", color=TEXT).scale(0.7).move_to([-3.2, 1.6, 0])
        self.play(Write(eq),
                  pmos.animate.set_fill(GREEN, 0.5),
                  nmos.animate.set_fill(MUTED, 0.15),
                  ynode.animate.set_color(GREEN))
        y1 = MathTex(r"Y=1", color=GREEN).scale(0.8).move_to([3.0, 0.0, 0])
        self.play(Write(y1))
        self.wait(1.0)

        eq2 = MathTex(r"A=1", color=TEXT).scale(0.7).move_to([-3.2, 1.6, 0])
        self.play(ReplacementTransform(eq, eq2),
                  pmos.animate.set_fill(MUTED, 0.15),
                  nmos.animate.set_fill(GREEN, 0.5),
                  ynode.animate.set_color(RED))
        y0 = MathTex(r"Y=0", color=RED).scale(0.8).move_to([3.0, 0.0, 0])
        self.play(ReplacementTransform(y1, y0))
        self.wait(1.0)

        concl = MathTex(r"Y = \overline{A}", color=YELLOW).scale(1.0).to_edge(DOWN)
        self.play(Write(concl))
        self.wait(1.2)
