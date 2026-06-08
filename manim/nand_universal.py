"""NAND est universelle : NON, ET, OU s'en déduisent.

Rendu : manim -qm manim/nand_universal.py NandUniversal
"""
from manim import *
from theme import TEAL, GREEN, TEXT


class NandUniversal(Scene):
    def construct(self):
        title = Text("Une seule porte suffit : NAND est universelle", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        nand = MathTex(r"\mathrm{NAND}(A,B) = \overline{A \cdot B}", color=TEAL).scale(0.8)
        self.play(Write(nand))
        self.wait(0.8)
        self.play(nand.animate.scale(0.75).move_to([0, 1.6, 0]))

        not_ = MathTex(r"\overline{A} = \mathrm{NAND}(A,A)", color=TEXT).scale(0.7).move_to([0, 0.7, 0])
        and_ = MathTex(r"A \cdot B = \mathrm{NAND}\big(\mathrm{NAND}(A,B),\,\mathrm{NAND}(A,B)\big)", color=TEXT).scale(0.55).move_to([0, -0.1, 0])
        or_ = MathTex(r"A + B = \mathrm{NAND}(\overline{A},\,\overline{B})", color=TEXT).scale(0.65).move_to([0, -0.9, 0])
        self.play(Write(not_))
        self.wait(0.5)
        self.play(Write(and_))
        self.wait(0.5)
        self.play(Write(or_))
        self.wait(0.5)

        concl = Text("NON, ET, OU à partir de NAND seules → donc TOUTE fonction logique.",
                     color=GREEN).scale(0.40).to_edge(DOWN)
        self.play(Write(concl))
        self.wait(1.4)
