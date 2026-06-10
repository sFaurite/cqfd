"""La danse des electrons (SN2) — le formalisme des fleches courbes.

Chaque fleche courbe deplace DEUX electrons d'un site riche (doublet, rouge)
vers un site pauvre (delta+, electrophile). On suit une substitution
nucleophile bimoleculaire HO- + R-X -> R-OH + X- et on verifie que la
charge se conserve (-1 boucle).

Rendu : manim -qm manim/chimie_fleches_courbes_sn2.py ChimieFlechesCourbesSn2
"""
import numpy as np
from manim import *
from theme import BG, BLUE, BLUE_D, YELLOW, RED, GREEN, PURPLE, TEAL, ORANGE, TEXT, MUTED

GREY_C = "#52606d"     # cercle du carbone
GREY_BOND = "#7d8794"  # liaisons C-H / C-R grises
H_GREY = "#9da7b3"     # H / R en gris


class ChimieFlechesCourbesSn2(Scene):
    def construct(self):
        # =====================================================================
        # 0-3 s : MISE EN PLACE
        # =====================================================================
        titre = Text("Nucléophile  →  Électrophile", color=TEXT, weight=BOLD)
        titre.scale(0.55).to_edge(UP, buff=0.35)
        self.play(Write(titre), run_time=1.0)

        # -- positions cles --
        O_pos = np.array([-4.6, 0.0, 0.0])    # oxygene nucleophile (gauche)
        C_pos = np.array([-0.6, 0.0, 0.0])    # carbone central
        X_pos = np.array([3.0, 0.0, 0.0])     # halogene (droite)

        # ---------- NUCLEOPHILE : HO- ----------
        O_circ = Circle(radius=0.42, color=RED, fill_opacity=1).move_to(O_pos)
        O_circ.set_stroke(RED, width=2)
        O_sym = MathTex(r"\text{HO}", color=TEXT).scale(0.65).move_to(O_pos)
        O_charge = MathTex(r"-", color=RED).scale(0.7)
        O_charge.next_to(O_circ, UR, buff=0.02).shift(LEFT * 0.12 + DOWN * 0.05)
        O_charge_ring = Circle(radius=0.13, color=RED, stroke_width=2).move_to(O_charge)
        charge_neg = VGroup(O_charge, O_charge_ring)
        oxygen = VGroup(O_circ, O_sym)

        # trois lobes de doublets non liants autour de O (haut, bas, gauche)
        lobe_dirs = [
            np.array([0.0, 1.0, 0.0]),    # haut
            np.array([0.0, -1.0, 0.0]),   # bas
            np.array([-1.0, 0.0, 0.0]),   # gauche
        ]
        lobes = VGroup(*[self.make_lobe(O_pos, d, 0.6) for d in lobe_dirs])
        # le doublet "actif" : celui qui attaque, oriente vers le carbone (droite)
        active_dir = np.array([1.0, 0.0, 0.0])
        active_lobe = self.make_lobe(O_pos, active_dir, 0.6)

        # ---------- SUBSTRAT : carbone tetraedrique schematique ----------
        C_circ = Circle(radius=0.40, color=GREY_C, fill_opacity=1).move_to(C_pos)
        C_circ.set_stroke(MUTED, width=2)
        C_sym = Text("C", color=TEXT, weight=BOLD).scale(0.55).move_to(C_pos)
        carbon = VGroup(C_circ, C_sym)

        # trois liaisons C-R (parapluie) vers le haut-gauche, bas-gauche, et...
        # on les met en "parapluie" pointant cote nucleophile pour l'inversion.
        umbrella_angles = [120, 180, 240]   # degres : haut-gauche, gauche, bas-gauche
        r_bonds = VGroup()
        r_groups = VGroup()
        r_ends = []
        for ang in umbrella_angles:
            a = np.radians(ang)
            d = np.array([np.cos(a), np.sin(a), 0.0])
            end = C_pos + d * 1.15
            r_ends.append(end)
            bond = Line(C_pos, end, color=GREY_BOND, stroke_width=4)
            disk = Circle(radius=0.20, color="#3a4350", fill_opacity=1).move_to(end)
            disk.set_stroke(H_GREY, width=1.5)
            lbl = Text("R", color=H_GREY, weight=BOLD).scale(0.34).move_to(end)
            r_bonds.add(bond)
            r_groups.add(VGroup(disk, lbl))

        # liaison C-X vers la droite
        X_circ = Circle(radius=0.40, color=PURPLE, fill_opacity=1).move_to(X_pos)
        X_circ.set_stroke(PURPLE, width=2)
        X_sym = Text("X", color=TEXT, weight=BOLD).scale(0.55).move_to(X_pos)
        halogen = VGroup(X_circ, X_sym)
        CX_bond = Line(C_pos + RIGHT * 0.40, X_pos + LEFT * 0.40,
                       color=GREY_BOND, stroke_width=5)

        # etiquettes de polarite
        delta_p = MathTex(r"\delta^{+}", color=BLUE).scale(0.6)
        delta_p.next_to(C_circ, DOWN, buff=0.18).shift(RIGHT * 0.35)
        delta_m = MathTex(r"\delta^{-}", color=BLUE).scale(0.6)
        delta_m.next_to(X_circ, DOWN, buff=0.18)

        # --- apparition ---
        self.play(
            FadeIn(oxygen, scale=0.7),
            FadeIn(charge_neg, shift=UP * 0.2),
            *[GrowFromPoint(l, O_pos) for l in lobes],
        )
        self.play(
            FadeIn(carbon, scale=0.7),
            *[Create(b) for b in r_bonds],
            *[FadeIn(g) for g in r_groups],
            Create(CX_bond),
            FadeIn(halogen, scale=0.7),
            run_time=1.0,
        )
        self.play(FadeIn(delta_p, shift=UP * 0.15), FadeIn(delta_m, shift=UP * 0.15))
        self.wait(0.4)

        # rappel : une fleche = 2 electrons (carte de legende discrete, en haut a droite)
        legende = MathTex(r"1\ \text{fl\`eche} = 2\,e^{-}", color=YELLOW).scale(0.5)
        legende.to_corner(UR, buff=0.4).shift(DOWN * 0.55)
        self.play(FadeIn(legende))
        self.wait(0.3)

        # =====================================================================
        # 3-7 s : PREMIERE FLECHE — attaque nucleophile (dorsale)
        # =====================================================================
        # le doublet actif (cote carbone) -> attaque le C par l'arriere (cote gauche)
        self.play(GrowFromPoint(active_lobe, O_pos), run_time=0.5)

        attack_start = O_pos + active_dir * 0.85
        attack_end = C_pos + LEFT * 0.55
        arrow1 = CurvedArrow(
            attack_start, attack_end,
            color=YELLOW, stroke_width=5, tip_length=0.22, angle=-TAU / 8,
        )
        e2_a = MathTex(r"2\,e^{-}", color=YELLOW).scale(0.42)
        e2_a.move_to((attack_start + attack_end) / 2 + UP * 0.55)

        # liaison O-C naissante (rouge)
        OC_bond = Line(O_pos + RIGHT * 0.40, C_pos + LEFT * 0.40,
                       color=RED, stroke_width=5)

        self.play(Create(arrow1), FadeIn(e2_a, shift=UP * 0.1), run_time=1.0)
        self.play(Create(OC_bond), run_time=0.9)
        self.wait(0.3)

        # =====================================================================
        # 7-11 s : DEUXIEME FLECHE — depart du nucleofuge
        # =====================================================================
        leave_start = C_pos + RIGHT * 1.4
        leave_end = X_pos + UP * 0.25
        arrow2 = CurvedArrow(
            leave_start, leave_end,
            color=YELLOW, stroke_width=5, tip_length=0.22, angle=-TAU / 8,
        )
        e2_b = MathTex(r"2\,e^{-}", color=YELLOW).scale(0.42)
        e2_b.move_to((leave_start + leave_end) / 2 + UP * 0.55)

        self.play(Create(arrow2), FadeIn(e2_b, shift=UP * 0.1), run_time=0.9)

        # rupture C-X + depart de X vers la droite en devenant X-
        X_new_pos = X_pos + RIGHT * 1.4
        X_charge = MathTex(r"-", color=PURPLE).scale(0.7)
        X_charge_ring = Circle(radius=0.13, color=PURPLE, stroke_width=2)
        X_minus = VGroup(X_charge, X_charge_ring)
        X_charge.move_to(X_new_pos + UR * 0.4)
        X_charge_ring.move_to(X_charge)

        self.play(
            Uncreate(CX_bond),
            halogen.animate.move_to(X_new_pos),
            run_time=1.0,
        )
        self.play(FadeIn(X_minus, shift=UP * 0.15), run_time=0.5)
        self.wait(0.2)

        # =====================================================================
        # 11-13 s : INVERSION DE WALDEN (le parapluie se retourne)
        # =====================================================================
        # on fait pivoter les trois liaisons C-R de l'autre cote (vers X)
        r_all = VGroup(r_bonds, r_groups)
        self.play(
            Rotate(r_all, angle=PI, about_point=C_pos),
            FadeOut(arrow1), FadeOut(e2_a),
            FadeOut(arrow2), FadeOut(e2_b),
            FadeOut(active_lobe),
            run_time=1.1,
        )
        inv_note = Text("inversion de Walden", color=MUTED).scale(0.4)
        # au-dessus des R : à 0.6 le texte touche l'atome R supérieur
        inv_note.next_to(C_circ, UP, buff=1.05)
        self.play(FadeIn(inv_note))
        self.wait(0.3)

        # =====================================================================
        # 13-16 s : BILAN DE CHARGE
        # =====================================================================
        # l'oxygene a partage son doublet : il perd sa charge negative
        self.play(
            FadeOut(charge_neg),
            FadeOut(lobes),
            delta_p.animate.set_opacity(0.0),
            delta_m.animate.set_opacity(0.0),
            run_time=0.7,
        )

        bilan = MathTex(
            r"\text{HO}^{-} + \text{R-X}",
            r"\;\rightarrow\;",
            r"\text{R-OH} + \text{X}^{-}",
            color=TEXT,
        ).scale(0.62)
        bilan[0].set_color(RED)
        bilan[2].set_color(TEXT)
        bilan.to_edge(DOWN, buff=0.95)

        encadre_txt = MathTex(r"\text{charge conserv\'ee} : -1", color=GREEN).scale(0.5)
        encadre_txt.next_to(bilan, DOWN, buff=0.25)
        box = SurroundingRectangle(encadre_txt, color=GREEN, buff=0.12, corner_radius=0.08)

        self.play(Write(bilan), run_time=1.2)
        self.play(FadeIn(encadre_txt), Create(box), run_time=0.8)

        # pulse final des deux fleches pour ancrer la "grammaire"
        arrow1b = CurvedArrow(
            attack_start, attack_end,
            color=YELLOW, stroke_width=5, tip_length=0.22, angle=-TAU / 8,
        )
        # la 2e fleche : on la repositionne par rapport au X qui a bouge
        arrow2b = CurvedArrow(
            C_pos + RIGHT * 1.4, X_new_pos + UP * 0.25,
            color=YELLOW, stroke_width=5, tip_length=0.22, angle=-TAU / 8,
        )
        self.play(Create(arrow1b), Create(arrow2b), run_time=0.5)
        self.play(
            arrow1b.animate.set_stroke(width=9),
            arrow2b.animate.set_stroke(width=9),
            rate_func=there_and_back, run_time=0.7,
        )
        self.play(
            arrow1b.animate.set_stroke(width=9),
            arrow2b.animate.set_stroke(width=9),
            rate_func=there_and_back, run_time=0.7,
        )
        self.wait(1.0)

    # ------------------------------------------------------------------
    def make_lobe(self, A, direction, dist):
        """Petit lobe rouge translucide = doublet non liant pres de l'atome."""
        d = direction / np.linalg.norm(direction)
        center = A + d * dist
        lobe = Ellipse(width=0.40, height=0.20, color=RED, fill_opacity=0.45)
        lobe.set_stroke(RED, width=2, opacity=0.7)
        ang = np.arctan2(d[1], d[0])
        lobe.rotate(ang)
        lobe.move_to(center)
        return lobe
