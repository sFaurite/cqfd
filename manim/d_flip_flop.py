"""La bascule D : Q recopie D au front montant de l'horloge.

Rendu : manim -qm manim/d_flip_flop.py DFlipFlop
"""
import numpy as np
from manim import *
from theme import BLUE, GREEN, YELLOW, MUTED, TEXT


class DFlipFlop(Scene):
    def construct(self):
        title = Text("La bascule D : Q recopie D au front montant", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        step = 1.25
        x0 = -5.0
        clk = [0, 1, 0, 1, 0, 1, 0, 1]
        D = [0, 0, 1, 1, 1, 0, 0, 1]
        Q = [0, 0, 0, 1, 1, 0, 0, 1]
        rows = [("CLK", clk, 1.4, BLUE), ("D", D, -0.2, GREEN), ("Q", Q, -1.8, YELLOW)]

        mobs = VGroup()
        for name, bits, yb, col in rows:
            lo, hi = yb - 0.35, yb + 0.35
            pts = []
            x = x0
            for b in bits:
                y = hi if b else lo
                pts.append(np.array([x, y, 0.0]))
                pts.append(np.array([x + step, y, 0.0]))
                x += step
            vm = VMobject(color=col)
            vm.set_points_as_corners(pts)
            lbl = Text(name, color=col).scale(0.45).move_to([x0 - 0.8, yb, 0])
            mobs.add(vm, lbl)
        self.play(Create(mobs), run_time=2.0)

        for i, b in enumerate(clk):
            if b == 1 and (i == 0 or clk[i - 1] == 0):
                xe = x0 + i * step
                dl = DashedLine([xe, 1.9, 0], [xe, -2.3, 0], color=MUTED, stroke_width=2)
                self.play(Create(dl), run_time=0.25)

        note = Text("À chaque front montant (pointillés), Q prend la valeur de D — et la garde.",
                    color=MUTED).scale(0.38).to_edge(DOWN)
        self.play(Write(note))
        self.wait(1.6)
