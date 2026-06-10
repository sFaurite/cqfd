from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

GRIS = MUTED
MONO = "Monospace"


def bit_text(s, color=TEXT):
    """Une chaine de 8 bits en Monospace, lettres espacees pour aligner."""
    return Text(s, font=MONO, color=color).scale(0.45)


class ReseauMasqueEtBinaire(Scene):
    def construct(self):
        # ----- Titre -----
        titre = Text("Masque /26 : le ET qui coupe l'adresse",
                     color=TEXT, font=MONO).scale(0.5).to_edge(UP)
        self.play(Write(titre), run_time=1)

        # Donnees exactes (4 octets de 8 bits)
        adr_octets = ["11000000", "10101000", "00001010", "00100101"]
        msk_octets = ["11111111", "11111111", "11111111", "11000000"]
        res_octets = ["11000000", "10101000", "00001010", "00000000"]

        # Geometrie des colonnes : 32 bits + 3 points de separation
        # On place chaque bit a une coordonnee x precise pour aligner les 3 lignes.
        x0 = -4.95
        dx = 0.32          # ecart entre deux bits d'un meme octet
        gap = 0.30         # espace supplementaire (le point) entre octets
        y_adr = 1.55
        y_msk = 0.75
        y_res = -0.55

        # Calcule la position x de chaque bit (index global 0..31)
        xs = []
        x = x0
        for o in range(4):
            for b in range(8):
                xs.append(x)
                x += dx
            x += gap

        def make_line(octets, y, default_color=TEXT):
            mobs = []
            idx = 0
            for o in range(4):
                for b in range(8):
                    t = Text(octets[o][b], font=MONO, color=default_color).scale(0.5)
                    t.move_to([xs[idx], y, 0])
                    mobs.append(t)
                    idx += 1
            return mobs

        adr_bits = make_line(adr_octets, y_adr, TEXT)
        msk_bits = make_line(msk_octets, y_msk, TEXT)

        # Points de separation des octets (decoratifs) sur les lignes adr et msk
        def make_dots(y):
            dots = VGroup()
            for o in range(1, 4):
                xpos = xs[o * 8 - 1] + (dx + gap) / 2
                d = Text(".", font=MONO, color=MUTED).scale(0.5).move_to([xpos, y - 0.05, 0])
                dots.add(d)
            return dots

        dots_adr = make_dots(y_adr)
        dots_msk = make_dots(y_msk)

        lab_adr = Text("adresse", color=BLUE, font=MONO).scale(0.4).next_to(
            [xs[0], y_adr, 0], LEFT, buff=0.25)
        lab_msk = Text("masque /26", color=YELLOW, font=MONO).scale(0.4).next_to(
            [xs[0], y_msk, 0], LEFT, buff=0.25)

        adr_grp = VGroup(*adr_bits)
        msk_grp = VGroup(*msk_bits)

        # ETAPE 1 : afficher adresse + masque alignes
        self.play(LaggedStartMap(FadeIn, adr_grp, lag_ratio=0.02, run_time=1.2),
                  FadeIn(dots_adr), FadeIn(lab_adr))
        self.play(LaggedStartMap(FadeIn, msk_grp, lag_ratio=0.02, run_time=1.2),
                  FadeIn(dots_msk), FadeIn(lab_msk))

        formule = MathTex(r"\text{adresse} \wedge \text{masque}",
                          color=TEXT).scale(0.6).to_edge(DOWN).shift(UP * 0.1)
        self.play(Write(formule))
        self.wait(0.5)

        # ETAPE 2 : colorer le masque (26 bits verts, 6 bits gris) + mur frontiere
        anims = []
        for i in range(32):
            if i < 26:
                anims.append(msk_bits[i].animate.set_color(GREEN))
            else:
                anims.append(msk_bits[i].animate.set_color(GRIS))
        self.play(*anims, run_time=1.2)

        # Mur vertical lumineux apres le 26e bit (entre index 25 et 26)
        x_mur = (xs[25] + xs[26]) / 2
        mur = Line([x_mur, y_adr + 0.45, 0], [x_mur, y_res - 0.45, 0],
                   color=TEXT, stroke_width=5)
        mur.set_opacity(0.95)
        lab_front = Text("frontière /26", color=TEXT, font=MONO).scale(0.34)
        lab_front.next_to([x_mur, y_res - 0.45, 0], DOWN, buff=0.12)
        self.play(Create(mur), FadeIn(lab_front))
        self.wait(0.4)

        # ETAPE 3 : derouler le ET bit a bit, colonne par colonne
        lab_res = Text("résultat", color=GREEN, font=MONO).scale(0.4).next_to(
            [xs[0], y_res, 0], LEFT, buff=0.25)
        self.play(FadeIn(lab_res))

        # Petit symbole de porte AND (forme en D : cote plat a gauche, arc a droite)
        def and_gate():
            r = 0.13
            # cote plat gauche + haut + bas
            line = Polygon(
                [0.0, r, 0], [-r, r, 0], [-r, -r, 0], [0.0, -r, 0],
                color=YELLOW, stroke_width=2, fill_opacity=0.0,
            )
            arc = Arc(radius=r, start_angle=-PI / 2, angle=PI,
                      arc_center=[0.0, 0.0, 0], color=YELLOW, stroke_width=2)
            sym = Text("&", font=MONO, color=YELLOW).scale(0.28)
            sym.move_to([-0.02, 0, 0])
            return VGroup(line, arc, sym)

        res_bits = [None] * 32
        for i in range(32):
            a = adr_octets[i // 8][i % 8]
            m = msk_octets[i // 8][i % 8]
            r = str(int(a) & int(m))
            col = GREEN if r == "1" else GRIS

            # surligner la colonne en cours en jaune
            self.play(
                adr_bits[i].animate.set_color(YELLOW),
                msk_bits[i].animate.set_color(YELLOW),
                run_time=0.06,
            )

            gate = and_gate().move_to([xs[i], (y_msk + y_res) / 2, 0])
            rb = Text(r, font=MONO, color=col).scale(0.5).move_to([xs[i], y_res, 0])
            res_bits[i] = rb

            self.play(FadeIn(gate, shift=DOWN * 0.1), run_time=0.05)
            # le bit hote (resultat 0 force par le 0 du masque) tombe en gris
            if r == "0" and m == "0":
                self.play(FadeIn(rb, shift=DOWN * 0.25), FadeOut(gate), run_time=0.09)
            else:
                self.play(FadeIn(rb), FadeOut(gate), run_time=0.09)

            # remettre les bits dans leur couleur (vert reseau / gris hote)
            base = GREEN if i < 26 else GRIS
            self.play(
                msk_bits[i].animate.set_color(base),
                adr_bits[i].animate.set_color(TEXT),
                run_time=0.04,
            )

        # Mettre en evidence la regle du 4e octet
        regle = MathTex(r"1\cdot 1=1 \quad,\quad x\cdot 0 = 0",
                        color=TEXT).scale(0.5)
        regle.next_to(formule, UP, buff=0.05).shift(LEFT * 3.5)
        self.play(FadeOut(formule), Write(regle))
        self.wait(0.6)

        # ETAPE 4 : recomposer le resultat en notation pointee
        res_grp = VGroup(*res_bits)
        cible = Text("192.168.10.0", color=GREEN, font=MONO).scale(0.7)
        cible.move_to([0, y_res, 0])
        self.play(
            ReplacementTransform(res_grp, cible),
            FadeOut(lab_res),
            run_time=1.0,
        )
        cadre = SurroundingRectangle(cible, color=GREEN, buff=0.18)
        lab_prefixe = Text("préfixe = 192.168.10.0/26", color=GREEN, font=MONO).scale(0.4)
        lab_prefixe.next_to(cadre, DOWN, buff=0.18)
        hotes = MathTex(r"2^{32-26}-2 = 62", color=TEXT).scale(0.55)
        hotes.next_to(lab_prefixe, DOWN, buff=0.18)
        self.play(Create(cadre), FadeIn(lab_prefixe))
        self.play(Write(hotes))
        self.wait(0.8)

        # ETAPE 5 : glisser le mur de /24 a /26 et montrer 4 sous-reseaux
        self.play(
            FadeOut(regle), FadeOut(formule, run_time=0.01),
            FadeOut(hotes), FadeOut(cadre), FadeOut(lab_prefixe), FadeOut(cible),
            FadeOut(adr_grp), FadeOut(msk_grp), FadeOut(dots_adr), FadeOut(dots_msk),
            FadeOut(lab_adr), FadeOut(lab_msk),
        )

        # mur a /24 (apres le 24e bit) puis glissement vers /26
        x_24 = (xs[23] + xs[24]) / 2
        self.play(mur.animate.put_start_and_end_on(
            [x_24, y_adr + 0.45, 0], [x_24, y_res - 0.45, 0]),
            lab_front.animate.next_to([x_24, y_res - 0.45, 0], DOWN, buff=0.12)
            .become(Text("frontière /24", color=TEXT, font=MONO).scale(0.34)
                    .next_to([x_24, y_res - 0.45, 0], DOWN, buff=0.12)),
            run_time=0.8)
        self.wait(0.3)
        new_lab = Text("frontière /26", color=TEXT, font=MONO).scale(0.34)
        new_lab.next_to([x_mur, y_res - 0.45, 0], DOWN, buff=0.12)
        self.play(mur.animate.put_start_and_end_on(
            [x_mur, y_adr + 0.45, 0], [x_mur, y_res - 0.45, 0]),
            Transform(lab_front, new_lab),
            run_time=1.0)

        # 4 plages contigues (00,01,10,11 -> .0 / .64 / .128 / .192)
        labels = ["00 -> .0/26", "01 -> .64/26", "10 -> .128/26", "11 -> .192/26"]
        couleurs = [GREEN, TEAL, BLUE, PURPLE]
        plages = VGroup()
        w = 2.7
        for k in range(4):
            xpos = -4.05 + k * w
            box = Rectangle(width=w - 0.18, height=0.6, color=couleurs[k],
                            fill_opacity=0.18, stroke_width=2)
            box.move_to([xpos + w / 2, -0.4, 0])
            txt = Text(labels[k], color=couleurs[k], font=MONO).scale(0.34)
            txt.move_to(box.get_center())
            plages.add(VGroup(box, txt))
        self.play(LaggedStartMap(FadeIn, plages, lag_ratio=0.25, run_time=1.2))

        msg = Text("allonger le préfixe = subdiviser", color=YELLOW, font=MONO).scale(0.42)
        msg.to_edge(DOWN).shift(UP * 0.1)
        self.play(Write(msg))
        self.wait(1)
