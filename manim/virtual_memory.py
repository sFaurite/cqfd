"""Mémoire virtuelle : traduire une adresse virtuelle en adresse physique.

Rendu : manim -qm manim/virtual_memory.py VirtualMemory
"""
from manim import *
from theme import BLUE, GREEN, YELLOW, PURPLE, TEAL, MUTED, TEXT


class VirtualMemory(Scene):
    def construct(self):
        title = Text("Mémoire virtuelle : traduire une adresse", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        va = VGroup(
            Rectangle(width=1.5, height=0.7, color=BLUE, fill_opacity=0.2),
            Rectangle(width=1.5, height=0.7, color=GREEN, fill_opacity=0.2),
        ).arrange(RIGHT, buff=0).move_to([-4.0, 1.6, 0])
        va_p = Text("page 2", color=BLUE).scale(0.30).move_to(va[0])
        va_o = Text("offset", color=GREEN).scale(0.30).move_to(va[1])
        va_l = Text("adresse virtuelle", color=MUTED).scale(0.30).next_to(va, UP, buff=0.1)
        self.play(FadeIn(va), FadeIn(va_p), FadeIn(va_o), FadeIn(va_l))

        rows = ["page 0  →  cadre 5", "page 1  →  cadre 1", "page 2  →  cadre 7", "page 3  →  absente"]
        table = VGroup(*[Text(r, color=TEXT).scale(0.34) for r in rows]).arrange(DOWN, buff=0.22).move_to([0, 0.0, 0])
        box = SurroundingRectangle(table, color=PURPLE, buff=0.22)
        tl = Text("table des pages", color=PURPLE).scale(0.32).next_to(box, UP, buff=0.12)
        self.play(FadeIn(box), FadeIn(table), FadeIn(tl))

        hl = SurroundingRectangle(table[2], color=YELLOW)
        arr1 = Arrow(va[0].get_bottom(), table[2].get_left(), color=YELLOW, buff=0.2)
        self.play(Create(arr1), Create(hl))

        frames = VGroup(*[Square(side_length=0.55, color=MUTED, fill_opacity=0.08) for _ in range(8)])
        frames.arrange(DOWN, buff=0.05).move_to([4.2, -0.1, 0])
        frames[7].set_fill(TEAL, 0.45)
        fl = Text("mémoire physique", color=MUTED).scale(0.30).next_to(frames, UP, buff=0.12)
        self.play(FadeIn(frames), FadeIn(fl))

        arr2 = Arrow(table[2].get_right(), frames[7].get_left(), color=YELLOW, buff=0.2)
        self.play(Create(arr2))

        pa = Text("→ adresse physique = cadre 7 + offset", color=GREEN).scale(0.42).to_edge(DOWN)
        self.play(Write(pa))
        self.wait(1.4)
