from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

# Police a chasse fixe pour aligner les bits en colonnes.
MONO = "monospace"
CELL = 0.42          # largeur d'une colonne de bit
BITSCALE = 0.7       # echelle des bits


def bit_row(bits, color=TEXT):
    """Cree une VGroup de Text monospaces, un par bit, alignes en colonnes."""
    grp = VGroup()
    for b in bits:
        t = Text(b, font=MONO, color=color).scale(BITSCALE)
        grp.add(t)
    grp.arrange(RIGHT, buff=0)
    # Force un pas de colonne constant (chasse fixe parfaite).
    for i, t in enumerate(grp):
        t.move_to(np.array([i * CELL, 0, 0]))
    return grp


class ReseauCrcDivision(Scene):
    def construct(self):
        n = 14
        dividend = "11010110110000"
        G = "10011"
        msg = "1101011011"
        crc = "1110"

        # Geometrie : on place la potence a gauche, alignee a x0.
        x0 = -3.3
        y_div = 1.7

        # ---------------- Titre ----------------
        title = Text("CRC : la division par XOR", color=TEXT).scale(0.5).to_edge(UP)
        formula = MathTex(r"T(x) = x^{r}\,M(x) + R(x)", color=BLUE).scale(0.6)
        formula.next_to(title, DOWN, buff=0.2)
        self.play(Write(title), run_time=0.8)
        self.play(FadeIn(formula, shift=DOWN * 0.2), run_time=0.8)

        # ---------------- ETAPE 0 : M, G, ajout des zeros ----------------
        m_lbl = MathTex(r"M=", color=MUTED).scale(0.6)
        m_row = bit_row(msg, color=TEXT)
        g_lbl = MathTex(r"G=", color=MUTED).scale(0.6)
        g_row = bit_row(G, color=ORANGE)
        g_poly = MathTex(r"=x^{4}+x+1", color=MUTED).scale(0.55)

        # Placement provisoire au centre-haut pour la presentation.
        m_grp = VGroup(m_lbl, m_row.copy())
        m_row2 = m_grp[1]
        m_lbl.next_to(m_row2, LEFT, buff=0.25)
        m_grp.move_to(np.array([-1.2, 0.5, 0]))

        g_grp = VGroup(g_lbl, g_row, g_poly)
        g_lbl.next_to(g_row, LEFT, buff=0.25)
        g_poly.next_to(g_row, RIGHT, buff=0.3)
        g_grp.move_to(np.array([-1.0, -0.5, 0]))

        self.play(FadeIn(m_grp, shift=RIGHT * 0.2), run_time=0.7)
        self.play(FadeIn(g_grp, shift=RIGHT * 0.2), run_time=0.7)
        self.wait(0.4)

        # Ajout des r=4 zeros : '0000' glissent a droite de M.
        zeros = bit_row("0000", color=GREEN)
        zeros.next_to(m_row2, RIGHT, buff=0)
        zlab = Text("+ x^4  (4 zeros)", font=MONO, color=GREEN).scale(0.4)
        zlab.next_to(zeros, UP, buff=0.25)
        self.play(FadeIn(zeros, shift=LEFT * 0.5), FadeIn(zlab), run_time=0.9)
        self.wait(0.5)

        # ---------------- ETAPE 1 : poser le dividende sur la potence ----------------
        div_row = bit_row(dividend, color=TEXT)
        div_row.move_to(np.array([x0 + (n - 1) * CELL / 2, y_div, 0]))

        # transforme M+zeros vers le dividende pose.
        src = VGroup(*[t for t in m_row2], *[t for t in zeros])
        self.play(
            FadeOut(m_lbl), FadeOut(zlab),
            ReplacementTransform(src, div_row),
            FadeOut(g_grp),
            run_time=1.0,
        )

        # Le diviseur G aligne sous les 5 premiers bits.
        g_div = bit_row(G, color=ORANGE)
        g_div.align_to(div_row, LEFT)
        g_div.next_to(div_row, DOWN, buff=0.35)
        g_div.align_to(div_row, LEFT)

        # Surligner le bit de tete en jaune.
        head_box = SurroundingRectangle(div_row[0], color=YELLOW, buff=0.06)
        self.play(FadeIn(g_div, shift=UP * 0.2), Create(head_box), run_time=0.8)
        self.wait(0.5)

        # ---------------- ETAPE 2 : derouler la division ----------------
        # Etat courant des bits (caracteres).
        cur = list(dividend)
        # On ne joue que les positions porteuses : 0,1,6,8 (tete=1) et on
        # resume les positions tete=0 par un glissement.
        # Sequence reelle calculee :
        #   pos0 t=1, pos1 t=1, pos2..5 t=0, pos6 t=1, pos7 t=0, pos8 t=1, pos9 t=0

        rem_box = None

        def xor_step(pos, run=1.0):
            nonlocal cur, head_box, g_div
            # Aligner G sous les bits courants a la position pos.
            target_x = div_row[pos].get_center()[0]
            g_target = bit_row(G, color=RED)
            g_target.next_to(div_row, DOWN, buff=0.35)
            for i, t in enumerate(g_target):
                t.move_to(np.array([div_row[pos + i].get_center()[0],
                                    g_target.get_center()[1], 0]))
            # Colorer les operandes : haut en cyan, G en rouge.
            top_cells = VGroup(*[div_row[pos + i] for i in range(len(G))])
            self.play(
                Transform(g_div, g_target),
                top_cells.animate.set_color(TEAL),
                run_time=run * 0.5,
            )
            # symbole XOR a gauche.
            xsym = MathTex(r"\oplus", color=YELLOW).scale(0.6)
            xsym.move_to(np.array([x0 - 0.6,
                                   (div_row.get_center()[1] + g_target.get_center()[1]) / 2,
                                   0]))
            self.play(FadeIn(xsym, scale=0.5), run_time=run * 0.25)
            # Calculer le resultat XOR.
            new = cur[:]
            for i in range(len(G)):
                new[pos + i] = '1' if cur[pos + i] != G[i] else '0'
            # Transformer chaque cellule modifiee.
            anims = []
            for i in range(len(G)):
                if new[pos + i] != cur[pos + i] or True:
                    nt = Text(new[pos + i], font=MONO, color=TEXT).scale(BITSCALE)
                    nt.move_to(div_row[pos + i].get_center())
                    anims.append(Transform(div_row[pos + i], nt))
            self.play(*anims, FadeOut(xsym), run_time=run * 0.5)
            cur = new

        def slide_step(from_pos, to_pos, run=0.8):
            nonlocal g_div
            label = Text("tete=0, on glisse", font=MONO, color=MUTED).scale(0.4)
            label.next_to(g_div, DOWN, buff=0.3)
            g_target = g_div.copy()
            g_target.shift(RIGHT * CELL * (to_pos - from_pos))
            self.play(
                g_div.animate.shift(RIGHT * CELL * (to_pos - from_pos)),
                FadeIn(label),
                run_time=run,
            )
            self.play(FadeOut(label), run_time=0.3)

        def move_head(pos):
            nonlocal head_box
            new_box = SurroundingRectangle(div_row[pos], color=YELLOW, buff=0.06)
            self.play(Transform(head_box, new_box), run_time=0.4)

        # --- pos 0 (tete=1) ---
        xor_step(0)
        # --- pos 1 (tete=1) ---
        move_head(1)
        # Realigner g_div sous pos1 d'abord (glissement d'un cran) puis XOR.
        xor_step(1)
        # encadrer reste intermediaire (bits a droite encore non traites pas pertinents)
        # --- pos 2..5 (tete=0) : glissement resume ---
        move_head(6)
        slide_step(1, 6, run=1.0)
        # --- pos 6 (tete=1) ---
        xor_step(6)
        # --- pos 7 (tete=0) ---
        move_head(8)
        slide_step(6, 8, run=0.8)
        # --- pos 8 (tete=1) ---
        xor_step(8)
        # --- pos 9 (tete=0) -> reste final sur 4 derniers bits ---

        self.wait(0.3)

        # ---------------- ETAPE 3 : reste final + trame ----------------
        # Les 4 derniers bits forment le reste.
        rem_cells = VGroup(*[div_row[n - 4 + i] for i in range(4)])
        self.play(rem_cells.animate.set_color(GREEN), FadeOut(g_div), FadeOut(head_box))
        rbox = SurroundingRectangle(rem_cells, color=GREEN, buff=0.08)
        crc_lbl = Text("CRC = 1110", font=MONO, color=GREEN).scale(0.5)
        crc_lbl.next_to(rbox, DOWN, buff=0.3)
        self.play(Create(rbox), Write(crc_lbl), run_time=1.0)
        self.wait(0.6)

        # Assemblage de la trame T = msg + crc.
        t_row = bit_row(msg + crc, color=TEXT)
        # colorer la partie crc en vert.
        for i in range(len(crc)):
            t_row[len(msg) + i].set_color(GREEN)
        t_row.move_to(np.array([0, -2.4, 0]))
        t_lbl = Text("Trame T = ", font=MONO, color=MUTED).scale(0.45)
        t_lbl.next_to(t_row, LEFT, buff=0.3)
        self.play(
            FadeOut(rbox), FadeOut(crc_lbl), FadeOut(formula),
            FadeIn(t_lbl),
            FadeIn(t_row, shift=UP * 0.3),
            run_time=1.0,
        )

        congr = MathTex(r"T(x)\equiv 0 \pmod{G(x)}", color=GREEN).scale(0.65)
        congr.next_to(t_row, DOWN, buff=0.4)
        check = Text("OK", font=MONO, color=GREEN).scale(0.5)
        check_mark = MathTex(r"\checkmark", color=GREEN).scale(0.9)
        check_mark.next_to(congr, RIGHT, buff=0.3)
        self.play(Write(congr), FadeIn(check_mark, scale=0.5), run_time=1.0)
        self.wait(1.5)
