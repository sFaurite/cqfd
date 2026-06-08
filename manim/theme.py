"""Charte graphique partagée des animations Manim — alignée sur le site.

Les couleurs reprennent src/lib/palette.ts pour que vidéos et composants
interactifs soient visuellement indiscernables (même fond sombre, mêmes bleus,
jaunes, rouges « 3Blue1Brown »).
"""
from manim import config

BG = "#0e1116"
SURFACE = "#161b22"
BLUE = "#58c4dd"
BLUE_D = "#3c7c8c"
YELLOW = "#ffd866"
RED = "#fc6255"
GREEN = "#83c167"
PURPLE = "#c39bd3"
TEAL = "#5cd0b3"
ORANGE = "#ff9f40"
TEXT = "#e6edf3"
MUTED = "#9da7b3"

# Fond sombre par défaut pour toutes les scènes qui importent ce module.
config.background_color = BG
