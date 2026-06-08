#!/usr/bin/env bash
# Installe TOUTE la chaîne nécessaire au rendu des vidéos Manim :
#   - paquets système : ffmpeg, LaTeX (texlive…), cairo/pango, dvisvgm ;
#   - un environnement Python virtuel manim/.venv avec Manim Community.
# Cible : Ubuntu/Debian. Nécessite sudo.
#
# Usage :  bash manim/install.sh
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
export DEBIAN_FRONTEND=noninteractive
# Empêche needrestart d'ouvrir un dialogue interactif (sinon apt peut se bloquer).
export NEEDRESTART_MODE=a
export NEEDRESTART_SUSPEND=1

echo "=== 1/3 · paquets système (apt) ==="
sudo apt-get update -y
sudo apt-get install -y --no-install-recommends \
  ffmpeg build-essential pkg-config python3-dev python3-pip python3-venv \
  libcairo2-dev libpango1.0-dev libffi-dev \
  dvisvgm texlive texlive-latex-recommended texlive-latex-extra texlive-fonts-extra texlive-science

echo "=== 2/3 · environnement Python (venv) ==="
python3 -m venv "$HERE/.venv"
"$HERE/.venv/bin/python" -m pip install --upgrade pip wheel setuptools

echo "=== 3/3 · Manim Community ==="
"$HERE/.venv/bin/pip" install -r "$HERE/requirements.txt"

echo
echo "Versions installées :"
ffmpeg -version 2>&1 | head -1
"$HERE/.venv/bin/manim" --version 2>&1 | head -1
echo "✓ Chaîne prête. Rendre les vidéos : bash manim/render.sh"
