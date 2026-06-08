"""Addition binaire avec propagation de la retenue : 6 + 5 = 11.

Rendu : manim -qm manim/binary_addition.py BinaryAddition
"""
from manim import *
from theme import BLUE, GREEN, YELLOW, MUTED, TEXT


class BinaryAddition(Scene):
    def construct(self):
        title = Text("Addition binaire : la retenue se propage", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        calc = MathTex(r"\begin{array}{r} 0110 \\ +\;0101 \\ \hline 1011 \end{array}", color=TEXT).scale(1.3)
        calc.move_to([0.6, 0, 0])
        self.play(Write(calc))

        a_dec = MathTex(r"6", color=BLUE).scale(0.9).move_to([-2.6, 0.95, 0])
        b_dec = MathTex(r"5", color=GREEN).scale(0.9).move_to([-2.6, 0.05, 0])
        r_dec = MathTex(r"11", color=YELLOW).scale(0.9).move_to([-2.6, -0.95, 0])
        self.play(FadeIn(a_dec), FadeIn(b_dec))
        self.wait(0.5)
        self.play(Write(r_dec))

        carry = Text("Colonne par colonne : 1 + 1 = 10 → on écrit 0 et on retient 1.",
                     color=MUTED).scale(0.40).to_edge(DOWN)
        self.play(Write(carry))
        self.wait(1.4)
