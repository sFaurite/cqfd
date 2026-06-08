"""Le cycle fetch – decode – execute autour du chemin de données.

Rendu : manim -qm manim/fetch_execute.py FetchExecute
"""
from manim import *
from theme import BLUE, GREEN, YELLOW, TEAL, MUTED, TEXT


class FetchExecute(Scene):
    def construct(self):
        title = Text("Le cycle fetch – decode – execute", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        def block(label, x, y, col):
            r = Rectangle(width=2.3, height=1.0, color=col, fill_opacity=0.12).move_to([x, y, 0])
            t = Text(label, color=TEXT).scale(0.38).move_to([x, y, 0])
            return VGroup(r, t)

        pc = block("PC", -4.4, 1.4, BLUE)
        mem = block("Mémoire", -1.3, 1.4, TEAL)
        reg = block("Registres", -1.3, -1.4, GREEN)
        alu = block("ALU", 2.6, -1.4, YELLOW)
        self.play(*[FadeIn(b) for b in [pc, mem, reg, alu]])

        a1 = Arrow(pc.get_right(), mem.get_left(), color=MUTED, buff=0.1)
        a2 = Arrow(mem.get_bottom(), reg.get_top(), color=MUTED, buff=0.1)
        a3 = Arrow(reg.get_right(), alu.get_left(), color=MUTED, buff=0.1)
        self.play(Create(VGroup(a1, a2, a3)))

        phases = [
            ("FETCH : lire l'instruction (PC → Mémoire)", [pc, mem]),
            ("DECODE : interpréter l'instruction", [mem]),
            ("EXECUTE : l'ALU calcule (Registres → ALU)", [reg, alu]),
            ("WRITE-BACK : ranger le résultat dans un registre", [reg]),
        ]
        lbl = Text("", color=TEXT).scale(0.42).to_edge(DOWN)
        self.add(lbl)
        for txt, active in phases:
            newlbl = Text(txt, color=TEXT).scale(0.42).to_edge(DOWN)
            anims = [Transform(lbl, newlbl)]
            for b in [pc, mem, reg, alu]:
                anims.append(b[0].animate.set_fill(opacity=0.45 if b in active else 0.12))
            self.play(*anims, run_time=0.8)
            self.wait(0.7)

        nxt = Text("PC ← PC + 1, et on recommence.", color=GREEN).scale(0.44).to_edge(DOWN)
        self.play(Transform(lbl, nxt))
        self.wait(1.2)
