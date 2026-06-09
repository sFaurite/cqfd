from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

SILVER = "#b8c0cc"
INK = "#1a1d22"
SURFACE = "#161b22"


def make_type(letter, w=0.45, h=0.62, body=SILVER, glyph_color=INK, fs=24):
    """Un caractere mobile : petit bloc metal surmonte d'une lettre en relief."""
    block = RoundedRectangle(
        width=w, height=h, corner_radius=0.05,
        fill_color=body, fill_opacity=1.0, stroke_color=MUTED, stroke_width=1.2,
    )
    shoulder = Rectangle(
        width=w, height=h * 0.32, fill_color=YELLOW, fill_opacity=0.0,
        stroke_width=0,
    ).move_to(block.get_top() + DOWN * h * 0.16)
    glyph = Text(letter, color=glyph_color, weight=BOLD, font_size=fs)
    glyph.scale_to_fit_height(h * 0.42).move_to(block.get_top() + DOWN * h * 0.27)
    return VGroup(block, shoulder, glyph)


class HistoireCaracteresMobiles(Scene):
    def construct(self):
        title = Text("Les caracteres mobiles", color=TEXT).scale(0.5).to_edge(UP)
        self.play(Write(title), run_time=0.8)

        # ============================================================
        # ETAPE 1 — la fonte d'une lettre
        # ============================================================
        step1 = Text("1. Fondre une lettre", color=YELLOW).scale(0.42)
        step1.next_to(title, DOWN, buff=0.15)
        self.play(FadeIn(step1, shift=DOWN * 0.2), run_time=0.5)

        # Poincon : petit bloc grave d'un 'A' en relief
        poincon_blk = RoundedRectangle(
            width=0.7, height=0.9, corner_radius=0.05,
            fill_color=BLUE_D, fill_opacity=1.0, stroke_color=BLUE, stroke_width=2,
        )
        poincon_A = Text("A", color=TEXT, weight=BOLD).scale(0.5)
        poincon_A.move_to(poincon_blk.get_bottom() + UP * 0.28)
        poincon = VGroup(poincon_blk, poincon_A).move_to(LEFT * 4.2 + UP * 0.7)
        plbl = Text("poincon", color=MUTED).scale(0.32).next_to(poincon, UP, buff=0.12)

        # Matrice : bloc de cuivre ou recevoir le creux
        matrice = RoundedRectangle(
            width=1.0, height=0.7, corner_radius=0.05,
            fill_color=ORANGE, fill_opacity=0.9, stroke_color=YELLOW, stroke_width=2,
        ).move_to(LEFT * 4.2 + DOWN * 0.9)
        mlbl = Text("matrice", color=MUTED).scale(0.32).next_to(matrice, DOWN, buff=0.12)

        self.play(
            FadeIn(poincon, shift=DOWN * 0.3), FadeIn(plbl),
            FadeIn(matrice, shift=UP * 0.3), FadeIn(mlbl),
            run_time=0.7,
        )

        # Le poincon frappe la matrice -> Indicate + recul, puis creux en 'A'
        creux = Text("A", color=INK, weight=BOLD).scale(0.42)
        creux.move_to(matrice.get_center())
        self.play(
            poincon.animate.shift(DOWN * 1.0), run_time=0.35,
            rate_func=rush_into,
        )
        self.play(
            Indicate(matrice, color=RED, scale_factor=1.08),
            FadeIn(creux, scale=0.5),
            run_time=0.4,
        )
        self.play(poincon.animate.shift(UP * 1.0), run_time=0.3, rate_func=rush_from)

        matrice_grp = VGroup(matrice, creux)

        # La matrice descend au fond d'un moule a main (deux pieces qui se referment)
        moule_l = Rectangle(
            width=0.45, height=1.3, fill_color=GRAY, fill_opacity=0.9,
            stroke_color=MUTED, stroke_width=1.5,
        ).move_to(LEFT * 3.0 + DOWN * 0.4)
        moule_r = moule_l.copy().move_to(LEFT * 1.6 + DOWN * 0.4)
        molbl = Text("moule a main", color=MUTED).scale(0.32)
        molbl.next_to(VGroup(moule_l, moule_r), DOWN, buff=0.2)

        self.play(
            FadeOut(poincon), FadeOut(plbl), FadeOut(mlbl),
            matrice_grp.animate.scale(0.8).move_to(LEFT * 2.3 + DOWN * 1.0),
            FadeIn(moule_l, shift=RIGHT * 0.4), FadeIn(moule_r, shift=LEFT * 0.4),
            FadeIn(molbl),
            run_time=0.6,
        )
        # Le moule se referme
        self.play(
            moule_l.animate.shift(RIGHT * 0.55),
            moule_r.animate.shift(LEFT * 0.55),
            run_time=0.4,
        )

        # Metal liquide (argent) coule dans le moule
        metal = Dot(color=SILVER, radius=0.13).move_to(LEFT * 2.3 + UP * 1.2)
        mtlbl = Text("metal liquide", color=SILVER).scale(0.3).next_to(metal, RIGHT, buff=0.15)
        self.play(FadeIn(metal), FadeIn(mtlbl), run_time=0.3)
        self.play(
            metal.animate.move_to(LEFT * 2.3 + DOWN * 0.4).scale(1.6),
            FadeOut(mtlbl),
            run_time=0.5, rate_func=rush_into,
        )

        # Le moule s'ouvre et ejecte un caractere 3D
        new_type = make_type("A", w=0.5, h=0.9).move_to(LEFT * 2.3 + DOWN * 0.4)
        self.play(
            moule_l.animate.shift(LEFT * 0.7),
            moule_r.animate.shift(RIGHT * 0.7),
            FadeOut(metal),
            FadeIn(new_type, scale=0.7),
            run_time=0.4,
        )
        self.play(
            new_type.animate.shift(UP * 1.2),
            FadeOut(moule_l), FadeOut(moule_r), FadeOut(molbl),
            FadeOut(matrice_grp),
            run_time=0.4,
        )

        # ---- En accelere : des milliers de lettres identiques ----
        formule = MathTex(
            r"1\ \text{poincon} \rightarrow 1\ \text{matrice} \rightarrow n\ \text{caracteres}",
            color=YELLOW,
        ).scale(0.55).to_edge(DOWN, buff=0.35)
        many_lbl = Text("des milliers de lettres identiques", color=TEXT).scale(0.4)
        many_lbl.move_to(LEFT * 3.2 + UP * 1.3)

        self.play(
            ReplacementTransform(step1, many_lbl),
            Write(formule),
            run_time=0.6,
        )

        # Casse (grille de casiers) a droite
        casse = VGroup()
        for r in range(3):
            for c in range(4):
                cell = Rectangle(
                    width=0.7, height=0.55, stroke_color=BLUE_D, stroke_width=1.2,
                    fill_color=SURFACE, fill_opacity=0.4,
                )
                cell.move_to(RIGHT * (2.0 + c * 0.72) + DOWN * (0.0 - r * 0.58) + DOWN * 0.5)
                casse.add(cell)
        casse_lbl = Text("casse", color=MUTED).scale(0.32).next_to(casse, UP, buff=0.15)
        self.play(Create(casse), FadeIn(casse_lbl), run_time=0.5)

        # ~12 copies du 'A' jaillissent et s'empilent dans la casse
        anims = []
        copies = VGroup()
        cells = list(casse)
        for i, cell in enumerate(cells):
            cpy = make_type("A", w=0.45, h=0.52, fs=18).move_to(new_type.get_center())
            copies.add(cpy)
        self.add(copies)
        for cpy in copies:
            cpy.move_to(new_type.get_center())
            cpy.set_opacity(0)
        # animation en succession rapide
        succ = []
        for i, (cpy, cell) in enumerate(zip(copies, cells)):
            succ.append(
                AnimationGroup(
                    cpy.animate.set_opacity(1).move_to(cell.get_center()),
                    run_time=0.18,
                )
            )
        self.play(FadeOut(new_type), run_time=0.15)
        self.play(LaggedStart(*succ, lag_ratio=0.35), run_time=1.6)
        self.wait(0.2)

        # Nettoyage avant etape 2
        self.play(
            FadeOut(formule), FadeOut(many_lbl), FadeOut(casse_lbl),
            FadeOut(copies), FadeOut(casse),
            run_time=0.4,
        )

        # ============================================================
        # ETAPE 2 — composition
        # ============================================================
        step2 = Text("2. Composer : des objets distincts", color=YELLOW).scale(0.42)
        step2.next_to(title, DOWN, buff=0.15)
        self.play(FadeIn(step2, shift=DOWN * 0.2), run_time=0.5)

        word = "GUTENBERG"
        # Composteur : une regle ou les lettres s'alignent
        composteur = Line(
            LEFT * 3.0, RIGHT * 3.0, color=MUTED, stroke_width=3,
        ).shift(UP * 0.4)
        self.play(Create(composteur), run_time=0.4)

        n = len(word)
        total_w = n * 0.52
        x0 = -total_w / 2 + 0.26
        line_letters = VGroup()
        slide_anims = []
        for i, ch in enumerate(word):
            t = make_type(ch, w=0.46, h=0.66, fs=22)
            target_x = x0 + i * 0.52
            # depart depuis des positions dispersees (la casse)
            t.move_to(RIGHT * (3.0 + (i % 3)) + UP * (1.4 - (i % 4) * 0.3))
            t.set_opacity(0)
            line_letters.add(t)
            slide_anims.append(
                Succession(
                    Wait((i) * 0.02),
                    t.animate.set_opacity(1),
                )
            )
        self.add(line_letters)
        # glisser un a un et s'aligner
        align_anims = []
        for i, (t, ch) in enumerate(zip(line_letters, word)):
            t.set_opacity(1)
            align_anims.append(
                t.animate.move_to(RIGHT * (x0 + i * 0.52) + UP * 0.78)
            )
        self.play(LaggedStart(*align_anims, lag_ratio=0.18), run_time=1.8)

        line1 = line_letters
        self.play(FadeOut(composteur), run_time=0.3)

        # Plusieurs lignes empilees -> bloc-page
        extra_lines = VGroup()
        line_texts = ["DE  MAYENCE", "1450  ENVIRON"]
        for li, txt in enumerate(line_texts):
            row = VGroup()
            chars = [c for c in txt]
            m = len(chars)
            tw = m * 0.42
            rx0 = -tw / 2 + 0.21
            for j, ch in enumerate(chars):
                if ch == " ":
                    continue
                tt = make_type(ch, w=0.38, h=0.54, fs=16)
                tt.move_to(RIGHT * (rx0 + j * 0.42) + UP * (0.1 - li * 0.62))
                row.add(tt)
            extra_lines.add(row)
        self.play(
            line1.animate.scale(0.82).shift(UP * 0.0 + DOWN * 0.05).move_to(UP * 0.72),
            run_time=0.3,
        )
        self.play(
            LaggedStart(
                *[FadeIn(r, shift=LEFT * 0.4) for r in extra_lines],
                lag_ratio=0.4,
            ),
            run_time=1.0,
        )

        page_block = VGroup(line1, *extra_lines)
        modul = Text("lettres = objets distincts, reutilisables", color=MUTED).scale(0.34)
        modul.to_edge(DOWN, buff=0.4)
        self.play(FadeIn(modul), run_time=0.4)
        self.wait(0.2)

        # ============================================================
        # ETAPE 3 — encrage + presse
        # ============================================================
        step3 = Text("3. Encrer et presser", color=YELLOW).scale(0.42)
        step3.next_to(title, DOWN, buff=0.15)
        self.play(
            ReplacementTransform(step2, step3),
            FadeOut(modul),
            run_time=0.5,
        )

        # On regroupe le bloc-page et on le centre legerement
        self.play(page_block.animate.move_to(ORIGIN + DOWN * 0.1).scale(0.95), run_time=0.4)

        # Rouleau encreur qui passe sur la page et la teinte en noir
        roller = Circle(radius=0.4, color=RED, fill_color=RED, fill_opacity=0.8)
        roller.move_to(page_block.get_left() + LEFT * 0.8 + UP * 0.0)
        rlbl = Text("encrage", color=RED).scale(0.32).next_to(roller, UP, buff=0.1)
        self.play(FadeIn(roller), FadeIn(rlbl), run_time=0.3)

        # teinte progressive : toutes les lettres deviennent encre noire
        ink_targets = []
        all_glyphs = []
        for row in [page_block]:
            pass
        glyph_anims = []
        for grp in page_block:
            for t in grp:
                # t est un caractere (VGroup block, shoulder, glyph)
                block = t[0]
                glyph = t[2]
                glyph_anims.append(glyph.animate.set_color(INK))
                glyph_anims.append(block.animate.set_fill(ORANGE, opacity=0.95).set_stroke(RED, width=1))

        self.play(
            roller.animate.move_to(page_block.get_right() + RIGHT * 0.8),
            LaggedStart(*glyph_anims, lag_ratio=0.02),
            run_time=1.2,
            rate_func=linear,
        )
        self.play(FadeOut(roller), FadeOut(rlbl), run_time=0.2)

        # Une feuille blanche descend par le haut
        sheet = Rectangle(
            width=4.6, height=2.4, fill_color=TEXT, fill_opacity=0.95,
            stroke_color=MUTED, stroke_width=1.5,
        ).move_to(UP * 4.5)
        self.play(sheet.animate.move_to(page_block.get_center()), run_time=0.5)

        # La barre de presse (vis de pressoir) descend d'un coup
        press_bar = Rectangle(
            width=5.4, height=0.5, fill_color=GRAY, fill_opacity=1.0,
            stroke_color=MUTED, stroke_width=2,
        ).move_to(UP * 3.0)
        screw = Line(UP * 4.0, press_bar.get_top(), color=SILVER, stroke_width=8)
        press = VGroup(screw, press_bar)
        self.play(FadeIn(press, shift=DOWN * 0.3), run_time=0.25)
        self.play(
            press.animate.shift(DOWN * 1.85),
            Flash(sheet.get_center(), color=YELLOW, line_length=0.3, num_lines=12, flash_radius=1.5),
            run_time=0.3, rate_func=rush_into,
        )
        self.play(press.animate.shift(UP * 1.85), run_time=0.3, rate_func=rush_from)
        self.play(FadeOut(press), run_time=0.2)

        # La feuille remonte portant le texte imprime (lecture correcte) 'GUTENBERG'
        printed = Text("GUTENBERG", color=INK, weight=BOLD).scale(0.6)
        printed.move_to(sheet.get_center() + UP * 0.35)
        printed2 = Text("de Mayence, v.1450", color=MUTED).scale(0.32)
        printed2.next_to(printed, DOWN, buff=0.18)
        self.play(
            sheet.animate.shift(UP * 0.2),
            FadeOut(page_block),
            FadeIn(printed), FadeIn(printed2),
            run_time=0.5,
        )
        self.wait(0.3)

        # ============================================================
        # ETAPE 4 — redistribution
        # ============================================================
        step4 = Text("4. Defaire et recomposer a l'infini", color=YELLOW).scale(0.42)
        step4.next_to(title, DOWN, buff=0.15)
        # on enleve l'ancien step3 si present
        self.play(
            FadeOut(sheet), FadeOut(printed), FadeOut(printed2),
            run_time=0.4,
        )
        self.play(ReplacementTransform(step3, step4), run_time=0.4)

        # Caracteres se dispersent et regagnent leurs casiers
        casiers = VGroup()
        scatter = VGroup()
        import random
        random.seed(7)
        for i in range(10):
            t = make_type(chr(65 + (i % 8)), w=0.4, h=0.56, fs=16)
            t.move_to(ORIGIN + DOWN * 0.1 + RIGHT * (i - 5) * 0.0)
            scatter.add(t)
        self.add(scatter)
        for t in scatter:
            t.move_to(ORIGIN + DOWN * 0.1)
        targets = []
        for r in range(2):
            for c in range(5):
                targets.append(RIGHT * (-2.6 + c * 1.1) + DOWN * (1.6 + r * 0.0) - UP * r * 0.7 + UP * 0.7)
        disperse = []
        for t, tg in zip(scatter, targets):
            disperse.append(t.animate.move_to(tg))
        self.play(LaggedStart(*disperse, lag_ratio=0.08), run_time=1.0)

        synth = Text("composer, imprimer, defaire, recomposer", color=TEXT).scale(0.4)
        synth.to_edge(DOWN, buff=0.5)
        self.play(FadeIn(synth), run_time=0.4)

        # Contraste : planche xylographique pleine -> usage unique, barree
        self.play(FadeOut(scatter), run_time=0.4)
        xylo = Rectangle(
            width=2.6, height=1.7, fill_color=BLUE_D, fill_opacity=0.85,
            stroke_color=MUTED, stroke_width=2,
        ).move_to(ORIGIN + UP * 0.1)
        xylo_txt = Text("planche gravee\n(bloc unique)", color=TEXT).scale(0.34)
        xylo_txt.move_to(xylo.get_center())
        xlbl = Text("gravee = usage unique", color=RED).scale(0.36)
        xlbl.next_to(xylo, UP, buff=0.2)
        self.play(FadeIn(xylo, scale=0.8), FadeIn(xylo_txt), FadeIn(xlbl), run_time=0.5)
        cross1 = Line(xylo.get_corner(UL), xylo.get_corner(DR), color=RED, stroke_width=8)
        cross2 = Line(xylo.get_corner(UR), xylo.get_corner(DL), color=RED, stroke_width=8)
        self.play(Create(cross1), Create(cross2), run_time=0.5)

        self.wait(1)
