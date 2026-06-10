"""La convolution : un filtre qui glisse sur l'image (Sobel, detecteur de bord).

Rendu :
  PYTHONPATH=. manim -qm ia_convolution_filtre.py IaConvolutionFiltre
"""
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED


class IaConvolutionFiltre(Scene):
    def construct(self):
        CELL = 0.5

        # ============================================================
        # Titre
        # ============================================================
        title = Text("La convolution", color=TEXT, weight=BOLD).scale(0.8).to_edge(UP)
        self.play(Write(title))

        # ============================================================
        # Image I 6x6 : bord vertical net (3 colonnes sombres / 3 claires)
        # ============================================================
        N = 6
        dark = "#23272e"
        light = "#cdd5df"

        img_cells = VGroup()
        img_vals = VGroup()
        I = [[0] * N for _ in range(N)]
        for r in range(N):
            for c in range(N):
                val = 0 if c < 3 else 9
                I[r][c] = val
                col = dark if val == 0 else light
                sq = Square(CELL, fill_color=col, fill_opacity=1.0,
                            stroke_color=MUTED, stroke_width=1.2)
                sq.move_to([c * CELL, -r * CELL, 0])
                img_cells.add(sq)
                num_col = MUTED if val == 0 else "#3a4250"
                num = Text(str(val), color=num_col).scale(0.35).move_to(sq.get_center())
                img_vals.add(num)

        img = VGroup(img_cells, img_vals)
        img.move_to(LEFT * 4.0 + DOWN * 0.4)
        img_title = Text("image I", color=MUTED).scale(0.42).next_to(img, DOWN, buff=0.18)

        # ============================================================
        # Sortie S 4x4 vide
        # ============================================================
        M = 4
        out_cells = VGroup()
        for r in range(M):
            for c in range(M):
                sq = Square(CELL, fill_color=BG, fill_opacity=1.0,
                            stroke_color=BLUE_D, stroke_width=1.6)
                sq.move_to([c * CELL, -r * CELL, 0])
                out_cells.add(sq)
        out = VGroup(out_cells)
        out.move_to(RIGHT * 4.3 + DOWN * 0.4)
        out_title = Text("sortie S", color=MUTED).scale(0.42).next_to(out, DOWN, buff=0.18)

        def img_sq(r, c):
            return img_cells[r * N + c]

        def out_sq(r, c):
            return out_cells[r * M + c]

        self.play(
            LaggedStart(*[Create(s) for s in img_cells], lag_ratio=0.02, run_time=1.4),
        )
        self.play(LaggedStart(*[FadeIn(v) for v in img_vals], lag_ratio=0.02, run_time=0.8),
                  FadeIn(img_title))
        self.play(
            LaggedStart(*[Create(s) for s in out_cells], lag_ratio=0.02, run_time=1.0),
            FadeIn(out_title),
        )

        # ============================================================
        # Noyau de Sobel au centre-bas
        # ============================================================
        K = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
        kernel_tex = MathTex(
            r"K=\begin{pmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{pmatrix}",
            color=YELLOW,
        ).scale(0.7).to_edge(DOWN, buff=0.25)
        self.play(Write(kernel_tex))
        self.wait(0.3)

        # ============================================================
        # Fenetre glissante : cadre 3x3 jaune epais
        # ============================================================
        def window_center(top_r, left_c):
            # centre du bloc 3x3 dont le coin haut-gauche est (top_r, left_c)
            return img_sq(top_r + 1, left_c + 1).get_center()

        frame = Square(CELL * 3, color=YELLOW, stroke_width=6)
        frame.move_to(window_center(0, 0))
        self.play(Create(frame), run_time=0.5)

        # Formule generale qui surgit au centre
        formula = MathTex(
            r"S(i,j)=\sum_{u,v}K(u,v)\,I(i+u,j+v)",
            color=TEXT,
        ).scale(0.55).next_to(title, DOWN, buff=0.25)
        self.play(FadeIn(formula, shift=DOWN * 0.2), run_time=0.7)

        def conv_at(top_r, left_c):
            s = 0
            for u in range(3):
                for v in range(3):
                    s += K[u][v] * I[top_r + u][left_c + v]
            return s

        # zone de calcul (au-dessus du noyau)
        calc_anchor = DOWN * 1.55

        def animate_step(top_r, left_c, highlight=False):
            """Position detaillee : montre les coeffs survolant les cases + resultat."""
            self.play(frame.animate.move_to(window_center(top_r, left_c)), run_time=0.5)

            # Coefficients de K qui survolent les 9 cases
            coeffs = VGroup()
            for u in range(3):
                for v in range(3):
                    k = K[u][v]
                    ksign = ("+" + str(k)) if k > 0 else str(k)
                    ct = Text(ksign, color=YELLOW).scale(0.3)
                    ct.move_to(img_sq(top_r + u, left_c + v).get_center() + UP * 0.0)
                    coeffs.add(ct)
            self.play(LaggedStart(*[FadeIn(c, scale=0.5) for c in coeffs],
                                  lag_ratio=0.04, run_time=0.6))

            # Calcul numerique
            val = conv_at(top_r, left_c)
            res_col = BLUE if abs(val) >= 18 else MUTED
            res = MathTex(rf"S={val}", color=res_col).scale(0.7).move_to(calc_anchor)
            self.play(FadeIn(res, scale=0.6), Flash(frame, color=YELLOW, line_length=0.15),
                      run_time=0.5)

            # La valeur vole vers la case de S correspondante
            target = out_sq(top_r, left_c)
            fill_col = BLUE if abs(val) >= 18 else "#3a4250"
            self.play(
                res.animate.scale(0.7).move_to(target.get_center()),
                target.animate.set_fill(fill_col, opacity=1.0),
                FadeOut(coeffs),
                run_time=0.7,
            )
            self.play(FadeOut(res, scale=0.5), run_time=0.25)

        # Positions detaillees : aplat sombre, puis centree sur le bord
        animate_step(0, 0)          # coin sombre  -> S = 0
        animate_step(1, 2)          # centree sur le bord -> S = 36

        self.wait(0.3)

        # ============================================================
        # Balayage rapide du reste de la grille
        # ============================================================
        done = {(0, 0), (1, 2)}
        for top_r in range(M):
            for left_c in range(M):
                if (top_r, left_c) in done:
                    continue
                val = conv_at(top_r, left_c)
                target = out_sq(top_r, left_c)
                fill_col = BLUE if abs(val) >= 18 else "#3a4250"
                self.play(
                    frame.animate.move_to(window_center(top_r, left_c)),
                    target.animate.set_fill(fill_col, opacity=1.0),
                    run_time=0.18,
                )
        self.wait(0.5)

        self.play(FadeOut(frame), FadeOut(formula), FadeOut(kernel_tex), run_time=0.6)

        # ============================================================
        # (15-18 s) Partage de poids
        # ============================================================
        share = MathTex(
            r"\text{le \textit{m\^eme}}\ K\ \text{partout}",
            color=TEXT,
        ).scale(0.7).move_to(UP * 0.3 + RIGHT * 0.4)
        self.play(Write(share), run_time=0.9)

        # Badge : 9 poids (jaune) vs 1,6e9 barre (rouge)
        few = VGroup(
            Text("9 poids", color=YELLOW, weight=BOLD).scale(0.6),
            Text("filtre partagé", color=MUTED).scale(0.4),
        ).arrange(DOWN, buff=0.12)
        few_box = SurroundingRectangle(few, color=YELLOW, buff=0.22, corner_radius=0.1)
        few_grp = VGroup(few_box, few)

        dense = VGroup(
            MathTex(r"1{,}6\times10^{9}", color=RED).scale(0.7),
            Text("couche dense", color=MUTED).scale(0.4),
        ).arrange(DOWN, buff=0.12)
        dense_box = SurroundingRectangle(dense, color=RED, buff=0.22, corner_radius=0.1)
        dense_grp = VGroup(dense_box, dense)

        # centrés sur la zone libre entre la grille image (gauche) et la sortie
        # (droite) ; buff réduit pour tenir entre les deux grilles
        badges = VGroup(few_grp, dense_grp).arrange(RIGHT, buff=0.7).next_to(share, DOWN, buff=0.7)

        self.play(FadeIn(few_grp, shift=LEFT * 0.2),
                  FadeIn(dense_grp, shift=RIGHT * 0.2), run_time=0.8)

        # Barrer la couche dense (trop de poids)
        strike = Line(
            dense.get_corner(DL), dense.get_corner(UR), color=RED, stroke_width=6,
        )
        self.play(Create(strike), run_time=0.6)
        self.play(Indicate(few_grp, color=YELLOW, scale_factor=1.12), run_time=0.8)

        self.wait(1.5)
