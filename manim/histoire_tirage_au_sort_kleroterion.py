"""Le tirage au sort athénien : le mécanisme du klèrôtèrion.

Tirage au sort, pas élection : empêcher l'accaparement du pouvoir.
Une plaque percée de fentes reçoit des jetons-citoyens ; des billes
blanches/noires dévalent un tube et désignent, rangée par rangée, les
magistrats retenus ou écartés. Synthèse : le hasard institutionnalisé
comme garde-fou démocratique, attesté par les objets retrouvés.

Rendu : manim -qm manim/histoire_tirage_au_sort_kleroterion.py HistoireKleroterion
"""
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

STONE = "#8a8f98"      # pierre claire pour la plaque
STONE_D = "#5a5f68"    # pierre foncée (bord/tube)
SLOT_BG = "#22262d"    # fond des fentes


class HistoireKleroterion(Scene):
    def construct(self):
        # ===================== DÉCOR : titre =====================
        title = Text(
            "Tirage au sort, pas élection : empêcher l'accaparement du pouvoir",
            color=TEXT,
        ).scale(0.42).to_edge(UP, buff=0.25)
        self.play(Write(title), run_time=1.0)

        # ===================== ÉTAPE 1 : la plaque + le tube =====================
        n_rows, n_cols = 5, 5
        cw, ch = 0.62, 0.42          # taille d'une fente
        gx, gy = 0.16, 0.16          # espacement
        grid_w = n_cols * cw + (n_cols - 1) * gx
        grid_h = n_rows * ch + (n_rows - 1) * gy

        # Plaque de pierre, placée à gauche du centre
        plate = RoundedRectangle(
            corner_radius=0.1,
            width=grid_w + 1.4,
            height=grid_h + 1.0,
            color=STONE_D,
            fill_color=STONE,
            fill_opacity=0.18,
            stroke_width=3,
        ).move_to([-2.4, -0.55, 0])

        # Fentes (matrice de slots) — slots[r][c]
        slots = [[None] * n_cols for _ in range(n_rows)]
        slot_grp = VGroup()
        x0 = plate.get_center()[0] - grid_w / 2 + cw / 2 + 0.35
        y0 = plate.get_center()[1] + grid_h / 2 - ch / 2
        for r in range(n_rows):
            for c in range(n_cols):
                s = Rectangle(
                    width=cw, height=ch,
                    color=STONE_D, fill_color=SLOT_BG, fill_opacity=0.9,
                    stroke_width=1.5,
                )
                s.move_to([x0 + c * (cw + gx), y0 - r * (ch + gy), 0])
                slots[r][c] = s
                slot_grp.add(s)

        # Tube vertical le long du bord gauche, coiffé d'un entonnoir
        tube_x = plate.get_left()[0] - 0.55
        tube_top = plate.get_top()[1] + 1.05
        tube_bot = plate.get_bottom()[1] + 0.1
        tube_l = Line([tube_x - 0.13, tube_top, 0], [tube_x - 0.13, tube_bot, 0],
                      color=STONE_D, stroke_width=3)
        tube_r = Line([tube_x + 0.13, tube_top, 0], [tube_x + 0.13, tube_bot, 0],
                      color=STONE_D, stroke_width=3)
        # Entonnoir (deux segments évasés)
        fun_l = Line([tube_x - 0.13, tube_top, 0], [tube_x - 0.55, tube_top + 0.55, 0],
                     color=STONE_D, stroke_width=3)
        fun_r = Line([tube_x + 0.13, tube_top, 0], [tube_x + 0.55, tube_top + 0.55, 0],
                     color=STONE_D, stroke_width=3)
        tube = VGroup(tube_l, tube_r, fun_l, fun_r)

        tube_lab = Text("tube à billes", color=MUTED).scale(0.3)
        tube_lab.next_to(tube, UP, buff=0.1)

        self.play(
            Create(plate),
            LaggedStart(*[Create(s) for s in slot_grp], lag_ratio=0.02),
            run_time=1.4,
        )
        self.play(Create(tube), FadeIn(tube_lab), run_time=0.7)

        # ===================== ÉTAPE 2 : les jetons-citoyens tombent =====================
        names = [
            ["KLE", "SOL", "PER", "THE", "ARI"],
            ["NIK", "DEM", "KIM", "PHO", "LYS"],
            ["EUK", "MEG", "HIP", "GLA", "KRI"],
            ["AGA", "PRO", "STR", "POL", "XEN"],
            ["MEL", "DIO", "ALK", "EUR", "PYR"],
        ]
        token_rows = []  # liste de VGroup, un par rangée
        for r in range(n_rows):
            row_tokens = VGroup()
            for c in range(n_cols):
                target = slots[r][c]
                tok = Rectangle(
                    width=cw * 0.86, height=ch * 0.8,
                    color=YELLOW, fill_color=BLUE_D, fill_opacity=0.55,
                    stroke_width=1.5,
                )
                lab = Text(names[r][c], color=TEXT).scale(0.22)
                jeton = VGroup(tok, lab)
                lab.move_to(tok.get_center())
                # départ : léger tassement au-dessus de sa fente — plus haut,
                # le jeton chevauche la rangée déjà remplie au-dessus
                jeton.move_to(target.get_center() + UP * 0.15)
                jeton.set_opacity(0)
                row_tokens.add(jeton)
            token_rows.append(row_tokens)

        # Chute en cascade, rangée par rangée (mouvement vertical)
        for r in range(n_rows):
            anims = []
            for c in range(n_cols):
                jeton = token_rows[r][c]
                dest = slots[r][c].get_center()
                anims.append(
                    AnimationGroup(
                        jeton.animate.set_opacity(1).move_to(dest),
                    )
                )
            self.play(LaggedStart(*anims, lag_ratio=0.1), run_time=0.65)

        all_tokens = VGroup(*[t for row in token_rows for t in row])
        self.wait(0.2)

        # ===================== ÉTAPE 3 : les billes décident =====================
        # Zones de tri (cibles)
        zone_ret = Text("RETENUS\nmagistrats", color=GREEN).scale(0.34)
        zone_ret.move_to([4.6, 2.0, 0])
        ret_box = SurroundingRectangle(
            Rectangle(width=2.4, height=3.2).move_to([4.6, 0.2, 0]),
            color=GREEN, buff=0, stroke_width=1.5,
        )
        ret_box.set_opacity(0.5)
        zone_ret.next_to(ret_box, UP, buff=0.1)

        zone_eca = Text("écartés", color=RED).scale(0.32)
        zone_eca.move_to([-0.2, -3.4, 0])

        self.play(FadeIn(ret_box), FadeIn(zone_ret), FadeIn(zone_eca), run_time=0.7)

        # Verser une pile de billes mélangées dans l'entonnoir
        # Couleurs des billes par rangée (haut -> bas) : 2 blanches, 3 noires
        WHITE_BALL = "#f0f0f0"
        BLACK_BALL = "#1a1a1a"
        is_white = [True, False, True, False, False]
        colors = [WHITE_BALL if w else BLACK_BALL for w in is_white]

        # Petit tas de billes au-dessus de l'entonnoir
        pile = VGroup()
        funnel_top = [tube_x, tube_top + 0.7, 0]
        import random
        random.seed(7)
        pile_balls = []
        for i, col in enumerate(colors):
            b = Dot(radius=0.085, color=col, stroke_width=1.5, stroke_color=STONE_D)
            ox = (random.random() - 0.5) * 0.6
            oy = (random.random()) * 0.4
            b.move_to([funnel_top[0] + ox, funnel_top[1] + 0.25 + oy, 0])
            pile.add(b)
            pile_balls.append(b)
        self.play(LaggedStart(*[FadeIn(b, shift=DOWN * 0.2) for b in pile_balls],
                              lag_ratio=0.08), run_time=0.6)

        # Pour chaque rangée (de haut en bas)
        for r in range(n_rows):
            ball = pile_balls[r]
            # La bille dévale le tube avec une petite accélération
            ball.set_z_index(5)
            self.play(
                ball.animate.move_to([tube_x, tube_bot + 0.15, 0]),
                run_time=0.55, rate_func=rush_into,
            )
            # Révéler la couleur de la bille du bas
            self.play(Indicate(ball, color=YELLOW, scale_factor=1.6), run_time=0.45)

            row_grp = token_rows[r]
            if is_white[r]:
                # BLANCHE -> rangée illuminée en vert, glisse vers les RETENUS
                self.play(
                    row_grp.animate.set_color(GREEN),
                    *[t[0].animate.set_fill(GREEN, opacity=0.4) for t in row_grp],
                    ball.animate.set_color(GREEN),
                    run_time=0.3,
                )
                self.play(
                    row_grp.animate.shift(RIGHT * 6.6).scale(0.7),
                    ball.animate.move_to(ret_box.get_top() + DOWN * 0.2),
                    run_time=0.6,
                )
            else:
                # NOIRE -> rangée grisée, FadeOut vers les écartés
                self.play(
                    row_grp.animate.set_color(MUTED),
                    *[t[0].animate.set_fill(STONE_D, opacity=0.3) for t in row_grp],
                    run_time=0.3,
                )
                self.play(
                    row_grp.animate.shift(DOWN * 1.2).set_opacity(0.0),
                    FadeOut(ball, shift=DOWN * 0.6),
                    run_time=0.55,
                )

        self.wait(0.3)

        # ===================== ÉTAPE 4 : synthèse + preuves matérielles =====================
        # Tout ce qui reste à l'écran s'efface en douceur (zoom arrière)
        keep = VGroup(title)
        scene_objs = VGroup(plate, slot_grp, tube, tube_lab, ret_box, zone_ret,
                            zone_eca, all_tokens, pile)
        self.play(scene_objs.animate.scale(0.85).set_opacity(0.0), run_time=0.8)
        self.remove(scene_objs)

        synth = Text(
            "Le sort désigne, pas le vote : nul ne peut s'imposer",
            color=YELLOW,
        ).scale(0.5)
        synth.move_to([0, 1.2, 0])
        self.play(Write(synth), run_time=0.9)

        # Trois preuves matérielles : icône + label
        # 1) tesson (ostraka)
        tesson = Polygon(
            [-0.3, 0.0, 0], [0.3, 0.1, 0], [0.35, -0.25, 0], [-0.05, -0.35, 0],
            color=ORANGE, fill_color=ORANGE, fill_opacity=0.3, stroke_width=2,
        )
        t_scratch = Line([-0.15, -0.05, 0], [0.18, -0.18, 0], color=ORANGE, stroke_width=2)
        ico1 = VGroup(tesson, t_scratch)
        lab1 = Text("ostraka (ostracisme)", color=TEXT).scale(0.3)

        # 2) jeton (pinakia)
        pina = RoundedRectangle(corner_radius=0.05, width=0.7, height=0.32,
                                color=TEAL, fill_color=TEAL, fill_opacity=0.25,
                                stroke_width=2)
        p_line = Line([-0.25, 0, 0], [0.25, 0, 0], color=TEAL, stroke_width=2)
        ico2 = VGroup(pina, p_line)
        lab2 = Text("pinakia (jurés)", color=TEXT).scale(0.3)

        # 3) la machine (klèrôtèrion)
        mach = Rectangle(width=0.5, height=0.6, color=STONE, fill_color=STONE,
                         fill_opacity=0.2, stroke_width=2)
        holes = VGroup(*[
            Dot(radius=0.03, color=STONE_D).move_to([dx, dy, 0])
            for dy in (0.15, 0.0, -0.15) for dx in (-0.12, 0.0, 0.12)
        ])
        ico3 = VGroup(mach, holes)
        lab3 = Text("kleroterion", color=TEXT).scale(0.3)

        col1 = VGroup(ico1, lab1).arrange(DOWN, buff=0.2).move_to([-3.6, -1.4, 0])
        col2 = VGroup(ico2, lab2).arrange(DOWN, buff=0.2).move_to([0.0, -1.4, 0])
        col3 = VGroup(ico3, lab3).arrange(DOWN, buff=0.2).move_to([3.6, -1.4, 0])

        proof_lab = Text("attesté par les objets retrouvés", color=MUTED).scale(0.34)
        proof_lab.move_to([0, 0.2, 0])

        self.play(FadeIn(proof_lab), run_time=0.4)
        self.play(
            LaggedStart(
                FadeIn(col1, shift=UP * 0.2),
                FadeIn(col2, shift=UP * 0.2),
                FadeIn(col3, shift=UP * 0.2),
                lag_ratio=0.3,
            ),
            run_time=1.2,
        )
        self.wait(1)
