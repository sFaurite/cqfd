"""Le démarrage : du reset au premier processus.

Rendu : manim -qm manim/boot_sequence.py BootSequence
"""
import numpy as np
from manim import *
from theme import GREEN, YELLOW, MUTED, TEXT


class BootSequence(Scene):
    def construct(self):
        title = Text("Le démarrage : de l'électron au système", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title))

        steps = ["Sous tension", "Reset", "Firmware / POST", "Bootloader", "Noyau", "init"]
        xs = np.linspace(-5.4, 5.4, len(steps))
        line = Line([-5.8, 0, 0], [5.8, 0, 0], color=MUTED)
        self.play(Create(line))

        dots = VGroup()
        labels = VGroup()
        for i, (x, s) in enumerate(zip(xs, steps)):
            d = Dot([x, 0, 0], color=MUTED)
            direction = UP if i % 2 == 0 else DOWN
            l = Text(s, color=MUTED).scale(0.30).next_to(d, direction, buff=0.25)
            dots.add(d)
            labels.add(l)
        self.play(FadeIn(dots), FadeIn(labels))

        descs = [
            "Sous tension — la tension arrive, les horloges démarrent.",
            "Reset (matériel) — le PC pointe sur le vecteur de boot.",
            "Firmware / POST (firmware) — init mémoire & bus, test du matériel.",
            "Bootloader (firmware) — charge le noyau du disque vers la RAM.",
            "Noyau (NOYAU) — active mode protégé + pagination (MMU).",
            "init (utilisateur) — le premier processus démarre l'espace utilisateur.",
        ]
        panel = Text("", color=TEXT).scale(0.40).to_edge(DOWN)
        self.add(panel)
        for i in range(len(steps)):
            col = GREEN if i == len(steps) - 1 else YELLOW
            txt = Text(descs[i], color=TEXT).scale(0.40).to_edge(DOWN)
            self.play(
                dots[i].animate.set_color(col).scale(1.7),
                labels[i].animate.set_color(TEXT),
                Transform(panel, txt),
                run_time=0.7,
            )
            self.wait(0.7)
        self.wait(1.0)
