"""Attention : chercher par contenu (Q, K, V).

Produit scalaire normalise + softmax sur la phrase « la banque de la riviere ».

Rendu :
  PYTHONPATH=. manim -qm ia_attention_qkv.py IaAttentionQkv
"""
from manim import *
from theme import (
    BG, SURFACE, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED,
)


class IaAttentionQkv(Scene):
    def construct(self):
        # ============================================================
        # Titre
        # ============================================================
        title = Text(
            "Attention : chercher par contenu", color=TEXT, weight=BOLD
        ).scale(0.7).to_edge(UP, buff=0.3)
        self.play(Write(title))

        # ============================================================
        # (0-3 s) Les 5 tokens
        # ============================================================
        words = ["la", "banque", "de", "la", "riviere"]
        query_idx = 1  # « banque »

        boxes = VGroup()
        for w in words:
            txt = Text(w, color=TEXT).scale(0.5)
            rect = RoundedRectangle(
                width=max(txt.width + 0.4, 0.9), height=0.7,
                corner_radius=0.12, color=BLUE_D, fill_color=SURFACE,
                fill_opacity=1.0, stroke_width=2,
            )
            txt.move_to(rect.get_center())
            boxes.add(VGroup(rect, txt))
        boxes.arrange(RIGHT, buff=0.32).move_to(UP * 1.55)

        self.play(LaggedStart(*[FadeIn(b, shift=DOWN * 0.2) for b in boxes], lag_ratio=0.12))

        # Mise en evidence du token requete « banque »
        q_box = boxes[query_idx][0]
        q_highlight = SurroundingRectangle(q_box, color=YELLOW, buff=0.06, corner_radius=0.12)
        self.play(Create(q_highlight))

        # Projection des trois vecteurs q (YELLOW), k (BLUE), v (GREEN)
        def small_vec(anchor, color, dx):
            start = anchor.get_bottom() + DOWN * 0.05 + RIGHT * dx
            return Arrow(
                start, start + DOWN * 0.45, color=color, buff=0.0,
                stroke_width=4, max_tip_length_to_length_ratio=0.4,
                max_stroke_width_to_length_ratio=12,
            )

        qkv_vectors = VGroup()
        for b in boxes:
            qv = small_vec(b[0], YELLOW, -0.22)
            kv = small_vec(b[0], BLUE, 0.0)
            vv = small_vec(b[0], GREEN, 0.22)
            qkv_vectors.add(VGroup(qv, kv, vv))

        proj_labels = VGroup(
            MathTex(r"q_i=W_Q\,x_i", color=YELLOW).scale(0.5),
            MathTex(r"k_j=W_K\,x_j", color=BLUE).scale(0.5),
            MathTex(r"v_j=W_V\,x_j", color=GREEN).scale(0.5),
        ).arrange(RIGHT, buff=0.6).next_to(boxes, DOWN, buff=1.1)

        self.play(
            LaggedStart(
                *[GrowArrow(a) for grp in qkv_vectors for a in grp],
                lag_ratio=0.03,
            ),
            run_time=1.1,
        )
        self.play(FadeIn(proj_labels, shift=UP * 0.15))
        self.wait(0.4)
        self.play(FadeOut(proj_labels), FadeOut(qkv_vectors), run_time=0.5)

        # ============================================================
        # (3-9 s) Les scores : q de banque -> chaque k_j, barres
        # ============================================================
        # Forme matricielle en haut a droite
        s_form = MathTex(r"S=QK^{\top}", color=TEXT).scale(0.7).to_corner(UR, buff=0.4).shift(DOWN * 0.55)
        self.play(Write(s_form))

        q_anchor = boxes[query_idx][0].get_bottom() + DOWN * 0.1

        # scores bruts : « riviere » domine nettement
        raw_scores = [0.35, 0.55, 0.3, 0.35, 1.0]  # indices 0..4 ; 4 = riviere
        dot_lbl = MathTex(r"q_i\cdot k_j", color=YELLOW).scale(0.55).next_to(
            boxes, DOWN, buff=0.35
        ).shift(LEFT * 4.6)

        arrows = VGroup()
        bars = VGroup()
        bar_base_y = -1.0
        max_bar = 1.7
        for j, b in enumerate(boxes):
            target = b[0].get_bottom() + DOWN * 0.08
            col = RED if j == query_idx else YELLOW
            arr = CurvedArrow(
                q_anchor, target, color=col, angle=-0.6 if j < query_idx else 0.6,
                stroke_width=2.5, tip_length=0.14,
            )
            arrows.add(arr)
            # barre verticale sous chaque token codant la valeur
            h = raw_scores[j] * max_bar
            bar = Rectangle(
                width=0.34, height=h, color=BLUE, fill_color=BLUE,
                fill_opacity=0.85, stroke_width=0,
            )
            bar.move_to(np.array([b[0].get_x(), bar_base_y - h / 2 - 0.5, 0]))
            bars.add(bar)

        self.play(FadeIn(dot_lbl), run_time=0.3)
        self.play(
            LaggedStart(*[Create(a) for a in arrows], lag_ratio=0.13),
            run_time=1.1,
        )
        self.play(
            LaggedStart(*[GrowFromEdge(bar, DOWN) for bar in bars], lag_ratio=0.1),
            run_time=1.0,
        )
        self.wait(0.2)

        # Normalisation par sqrt(d_k)
        norm_form = MathTex(r"\frac{QK^\top}{\sqrt{d_k}}", color=TEXT).scale(0.7).move_to(s_form)
        self.play(ReplacementTransform(s_form, norm_form))
        # Indicate sur le facteur 1/sqrt(d_k) -> le denominateur
        self.play(Indicate(norm_form[0][3:], color=ORANGE, scale_factor=1.3), run_time=0.8)
        self.play(FadeOut(arrows), FadeOut(dot_lbl), run_time=0.4)

        # ============================================================
        # (9-14 s) Le softmax : barres -> poids PURPLE sommant a 1
        # ============================================================
        # softmax des scores bruts
        scores_np = np.array(raw_scores)
        ex = np.exp((scores_np - scores_np.max()) * 2.2)  # accentue le pic
        weights = ex / ex.sum()

        weight_bars = VGroup()
        for j, b in enumerate(boxes):
            h = float(weights[j]) * (max_bar * 1.5)
            bar = Rectangle(
                width=0.34, height=max(h, 0.02), color=PURPLE, fill_color=PURPLE,
                fill_opacity=0.9, stroke_width=0,
            )
            bar.move_to(np.array([b[0].get_x(), bar_base_y - h / 2 - 0.5, 0]))
            weight_bars.add(bar)

        softmax_form = MathTex(
            r"p_{ij}=\mathrm{softmax}_j\!\left(\frac{q_i\cdot k_j}{\sqrt{d_k}}\right)",
            color=TEXT,
        ).scale(0.6).next_to(boxes, DOWN, buff=0.3).to_edge(LEFT, buff=0.5)

        self.play(Write(softmax_form), run_time=0.9)
        self.play(
            *[ReplacementTransform(bars[j], weight_bars[j]) for j in range(len(boxes))],
            run_time=1.1,
        )

        # somme = 1 (a gauche des barres pour ne pas gener la formule finale)
        sum_lbl = MathTex(r"\sum_j p_{ij}=1", color=MUTED).scale(0.55).next_to(
            weight_bars, RIGHT, buff=0.6
        ).align_to(weight_bars, DOWN)
        self.play(FadeIn(sum_lbl, shift=UP * 0.1))
        self.wait(0.4)

        self.play(FadeOut(softmax_form), FadeOut(norm_form), run_time=0.5)

        # ============================================================
        # (14-19 s) Le melange pondere -> vecteur sortie
        # ============================================================
        # Petits vecteurs valeur v_j (GREEN), epaisseur ~ poids
        value_vecs = VGroup()
        for j, b in enumerate(boxes):
            sw = 1.5 + float(weights[j]) * 9.0
            start = b[0].get_top() + UP * 0.05
            v = Arrow(
                start, start + UP * 0.5, color=GREEN, buff=0.0,
                stroke_width=sw, max_tip_length_to_length_ratio=0.45,
                max_stroke_width_to_length_ratio=20,
            )
            value_vecs.add(v)

        self.play(
            LaggedStart(*[GrowArrow(v) for v in value_vecs], lag_ratio=0.1),
            run_time=1.0,
        )

        # Convergence : tous les v_j montent et fusionnent au-dessus de « banque »
        out_pos = boxes[query_idx][0].get_top() + UP * 1.1
        out_vec = Arrow(
            out_pos + DOWN * 0.55, out_pos + UP * 0.05, color=GREEN, buff=0.0,
            stroke_width=11, max_tip_length_to_length_ratio=0.4,
        )
        out_lbl = MathTex(r"\mathrm{out}_i=\sum_j p_{ij}\,v_j", color=GREEN).scale(0.55)
        out_lbl.next_to(out_vec, RIGHT, buff=0.2)

        copies = [v.copy() for v in value_vecs]
        self.play(
            *[copies[j].animate.move_to(out_vec.get_center()).set_opacity(0.0)
              for j in range(len(boxes))],
            FadeOut(value_vecs),
            run_time=1.1,
        )
        self.play(GrowArrow(out_vec), FadeIn(out_lbl, shift=RIGHT * 0.1))

        # Lien a distance : banque -> riviere
        link = CurvedArrow(
            boxes[query_idx][0].get_bottom(), boxes[4][0].get_bottom(),
            color=YELLOW, angle=-0.9, stroke_width=2.5, tip_length=0.16,
        ).shift(DOWN * 0.05)
        msg = Text(
            "« banque » va chercher l'info de « riviere »",
            color=PURPLE,
        ).scale(0.42).move_to(np.array([0.0, -0.6, 0.0]))
        self.play(Create(link), FadeIn(msg, shift=UP * 0.1), run_time=0.9)
        self.wait(0.3)

        # On libere le bas, puis formule encadree de l'attention
        self.play(FadeOut(weight_bars), FadeOut(sum_lbl), run_time=0.5)
        attn = MathTex(
            r"\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V",
            color=TEXT,
        ).scale(0.7).move_to(np.array([0.0, -2.6, 0.0]))
        attn_box = SurroundingRectangle(attn, color=YELLOW, buff=0.18, corner_radius=0.1)
        self.play(Write(attn), run_time=1.1)
        self.play(Create(attn_box))

        self.wait(1.5)
