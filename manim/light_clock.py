"""Horloge à lumière → dilatation du temps. Scène : LightClock.

Rendu : manim -qm manim/light_clock.py LightClock
"""
from manim import *
from theme import BLUE, YELLOW, RED, GREEN, TEXT, MUTED


class LightClock(Scene):
    def construct(self):
        titre = Text("L'horloge à lumière", color=TEXT, weight=BOLD).scale(0.8).to_edge(UP)
        self.play(FadeIn(titre, shift=DOWN * 0.3))

        # ---- Horloge au repos ----
        L = 2.2
        bas = Line(LEFT * 0.6, RIGHT * 0.6, color=BLUE, stroke_width=6)
        haut = bas.copy()
        bas.move_to(LEFT * 4 + DOWN * L / 2)
        haut.move_to(LEFT * 4 + UP * L / 2)
        photon = Dot(bas.get_center(), color=YELLOW, radius=0.12)
        label_repos = Text("au repos", color=MUTED).scale(0.5).next_to(bas, DOWN)

        self.play(Create(bas), Create(haut), FadeIn(photon), FadeIn(label_repos))

        # aller-retour vertical
        for _ in range(2):
            self.play(photon.animate.move_to(haut.get_center()), run_time=0.6, rate_func=linear)
            self.play(photon.animate.move_to(bas.get_center()), run_time=0.6, rate_func=linear)

        t0 = MathTex(r"\Delta t_0 = \frac{2L}{c}", color=YELLOW).scale(0.8).next_to(haut, UP, buff=0.4)
        self.play(Write(t0))
        self.wait(0.5)

        # ---- Horloge en mouvement ----
        groupe = VGroup(bas, haut, photon, label_repos, t0)
        self.play(groupe.animate.shift(LEFT * 0.0).set_opacity(0.25))

        # version mobile : on dessine le trajet diagonal
        x_start = -4.5
        y_bas = -L / 2
        y_haut = L / 2
        speed = 1.6
        bas2 = Line(LEFT * 0.6, RIGHT * 0.6, color=BLUE, stroke_width=6).move_to([x_start, y_bas, 0])
        haut2 = bas2.copy().move_to([x_start, y_haut, 0])
        photon2 = Dot([x_start, y_bas, 0], color=YELLOW, radius=0.12)
        lab2 = Text("en mouvement (vu du labo)", color=MUTED).scale(0.5).to_edge(DOWN)
        self.play(FadeIn(bas2), FadeIn(haut2), FadeIn(photon2), FadeIn(lab2))

        trail = TracedPath(photon2.get_center, stroke_color=YELLOW, stroke_width=3)
        self.add(trail)

        # un aller : translation + montée
        dx = speed * 2.2
        self.play(
            photon2.animate.move_to([x_start + dx, y_haut, 0]),
            bas2.animate.shift(RIGHT * dx),
            haut2.animate.shift(RIGHT * dx),
            run_time=1.4,
            rate_func=linear,
        )
        # triangle rectangle de cette branche
        p0 = [x_start, y_bas, 0]
        p1 = [x_start + dx, y_haut, 0]
        corner = [x_start + dx, y_bas, 0]
        hyp = Line(p0, p1, color=YELLOW, stroke_width=5)
        horiz = Line(p0, corner, color=GREEN, stroke_width=3)
        vert = Line(corner, p1, color=BLUE, stroke_width=3)
        l_hyp = MathTex(r"c\,t", color=YELLOW).scale(0.6).next_to(hyp.get_center(), UP + LEFT, buff=0.1)
        l_h = MathTex(r"v\,t", color=GREEN).scale(0.6).next_to(horiz, DOWN, buff=0.1)
        l_v = MathTex(r"c\,t_0", color=BLUE).scale(0.6).next_to(vert, RIGHT, buff=0.1)
        self.play(Create(horiz), Create(vert), Create(hyp))
        self.play(FadeIn(l_hyp), FadeIn(l_h), FadeIn(l_v))
        self.wait(0.4)

        # Pythagore → gamma
        eq = MathTex(
            r"(c\,t)^2 = (c\,t_0)^2 + (v\,t)^2",
            color=TEXT,
        ).scale(0.8).to_edge(UP)
        self.play(ReplacementTransform(titre, eq))
        self.wait(0.5)
        res = MathTex(
            r"\Delta t = \gamma\,\Delta t_0,\quad \gamma=\frac{1}{\sqrt{1-v^2/c^2}}\ge 1",
            color=YELLOW,
        ).scale(0.85)
        box = SurroundingRectangle(res, color=YELLOW, buff=0.25)
        grp = VGroup(res, box).to_edge(DOWN, buff=1.1)
        self.play(Write(res), Create(box))
        concl = Text("l'horloge en mouvement bat plus lentement", color=RED).scale(0.5)
        concl.next_to(grp, UP, buff=0.2)
        self.play(FadeIn(concl))
        self.wait(2)
