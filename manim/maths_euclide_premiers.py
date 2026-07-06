"""L'infinité des nombres premiers — preuve d'Euclide (~300 av. J.-C.).

Rendu :
  PYTHONPATH=. manim -qm maths_euclide_premiers.py EuclidePremiers
"""
from manim import *
from theme import BLUE, YELLOW, GREEN, PURPLE, RED, TEAL, TEXT, MUTED


class EuclidePremiers(Scene):
    def construct(self):
        # ============================================================
        # Titre
        # ============================================================
        titre = Text("L'infinité des nombres premiers", color=TEXT, weight=BOLD).scale(0.7).to_edge(UP)
        sous = Text("Euclide, ~300 av. J.-C.", color=MUTED).scale(0.45).next_to(titre, DOWN, buff=0.2)
        self.play(FadeIn(titre, shift=DOWN * 0.3), FadeIn(sous))
        self.wait(0.7)

        # ============================================================
        # 1) L'hypothèse à réfuter : une liste finie de premiers
        # ============================================================
        hyp = Text("Supposons qu'il n'y ait QUE ces nombres premiers :", color=TEXT).scale(0.5)
        hyp.next_to(sous, DOWN, buff=0.6)
        self.play(Write(hyp), run_time=1.0)

        couleurs = [BLUE, YELLOW, GREEN, PURPLE]
        premiers = VGroup(*[
            MathTex(str(p), color=c).scale(1.7)
            for p, c in zip([2, 3, 5, 7], couleurs)
        ]).arrange(RIGHT, buff=1.2).next_to(hyp, DOWN, buff=0.7)

        for m in premiers:
            self.play(FadeIn(m, scale=0.4), run_time=0.35)
        self.wait(0.9)

        # La liste se range en haut, sous le titre, pour libérer la scène.
        self.play(
            FadeOut(hyp),
            premiers.animate.scale(0.55).move_to(UP * 2.25),
            run_time=0.9,
        )
        self.wait(0.3)

        # ============================================================
        # 2) La construction d'Euclide : N = 2*3*5*7 + 1
        # ============================================================
        eq = MathTex(
            r"N", r"=",
            r"2", r"\times", r"3", r"\times", r"5", r"\times", r"7",
            r"+\,1", r"=", r"211",
            color=TEXT,
        ).scale(1.0).move_to(UP * 0.85)
        for idx, c in zip([2, 4, 6, 8], couleurs):
            eq[idx].set_color(c)
        eq[9].set_color(RED)

        self.play(Write(VGroup(eq[0], eq[1])), run_time=0.6)
        self.play(
            *[TransformFromCopy(premiers[k], eq[2 + 2 * k]) for k in range(4)],
            *[FadeIn(eq[i]) for i in (3, 5, 7)],
            run_time=1.1,
        )
        self.wait(0.4)

        # Le « +1 » arrive en dernier : c'est lui, l'idée de génie.
        boite = SurroundingRectangle(eq[9], color=RED, buff=0.12, corner_radius=0.06)
        self.play(FadeIn(eq[9], shift=UP * 0.35), run_time=0.6)
        self.play(Create(boite), Indicate(eq[9], color=RED, scale_factor=1.4), run_time=0.8)
        self.play(Write(VGroup(eq[10], eq[11])), run_time=0.7)
        self.wait(1.0)

        # ============================================================
        # 3) Divisions successives : le reste vaut toujours 1
        # ============================================================
        divisions = [
            (r"105", r"2", BLUE),
            (r"70", r"3", YELLOW),
            (r"42", r"5", GREEN),
            (r"30", r"7", PURPLE),
        ]

        div = None
        crosses = VGroup()
        for k, (quotient, diviseur, coul) in enumerate(divisions):
            nouveau = MathTex(
                r"211", r"=", quotient, r"\times", diviseur, r"+", r"1",
                color=TEXT,
            ).scale(1.0).move_to(DOWN * 0.9)
            nouveau[4].set_color(coul)
            nouveau[6].set_color(RED)

            if div is None:
                self.play(Write(nouveau), run_time=0.8)
            else:
                self.play(ReplacementTransform(div, nouveau), run_time=0.7)
            div = nouveau

            # Le reste 1 clignote : la division ne tombe jamais juste.
            self.play(Indicate(div[6], color=RED, scale_factor=1.6), run_time=0.55)
            self.play(Flash(div[6], color=RED, flash_radius=0.35), run_time=0.4)

            # Le premier testé est barré dans la liste.
            croix = Cross(premiers[k], stroke_color=RED, stroke_width=4, scale_factor=1.15)
            crosses.add(croix)
            self.play(Create(croix), run_time=0.35)
            self.wait(0.25)

        note = Text("Aucun premier de la liste ne divise N.", color=RED).scale(0.5)
        note.move_to(DOWN * 2.1)
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.7)
        self.wait(1.4)

        # ============================================================
        # 4) Pourtant N a forcément un facteur premier
        # ============================================================
        self.play(FadeOut(div), FadeOut(note), FadeOut(boite), run_time=0.6)

        fait = Text("Or tout entier > 1 a un facteur premier.", color=TEXT).scale(0.52)
        fait.move_to(DOWN * 0.7)
        donc = Text("Il existe donc un premier HORS de la liste…", color=TEXT).scale(0.52)
        donc.next_to(fait, DOWN, buff=0.35)
        self.play(Write(fait), run_time=0.9)
        self.wait(0.4)
        self.play(Write(donc), run_time=0.9)

        # ... et ici c'est N lui-même : 211 est premier.
        self.play(
            eq[11].animate.set_color(TEAL).scale(1.25),
            Circumscribe(eq[11], color=TEAL, buff=0.15),
            run_time=1.0,
        )
        ici = Text("ici, N = 211 est lui-même premier !", color=TEAL).scale(0.5)
        ici.next_to(donc, DOWN, buff=0.4)
        self.play(FadeIn(ici, shift=UP * 0.2), run_time=0.7)
        self.wait(1.6)

        # ============================================================
        # 5) Conclusion
        # ============================================================
        self.play(
            FadeOut(fait), FadeOut(donc), FadeOut(ici),
            FadeOut(eq), FadeOut(premiers), FadeOut(crosses), FadeOut(sous),
            run_time=0.8,
        )

        concl1 = Text("Toute liste finie en oublie :", color=TEXT, weight=BOLD).scale(0.6)
        concl2 = Text("il y a une infinité de nombres premiers.", color=GREEN, weight=BOLD).scale(0.62)
        concl = VGroup(concl1, concl2).arrange(DOWN, buff=0.4).move_to(UP * 0.4)
        cadre = SurroundingRectangle(concl2, color=GREEN, buff=0.2, corner_radius=0.08)

        self.play(Write(concl1), run_time=0.9)
        self.play(Write(concl2), run_time=1.0)
        self.play(Create(cadre), run_time=0.6)
        self.wait(0.4)

        suite = MathTex(
            r"2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19,\ 23,\ 29,\ \dots",
            color=MUTED,
        ).scale(0.75).next_to(concl, DOWN, buff=0.9)
        self.play(FadeIn(suite, shift=UP * 0.2), run_time=0.8)
        self.wait(2.5)
