#!/usr/bin/env bash
# Rend les vidéos Manim en MP4 + génère un poster PNG, et les copie dans public/videos/
# (où le composant <VideoManim> va les chercher : public/videos/<nom>.{mp4,png}).
#
# ⟶ ÉDITEZ la liste « VOS SCÈNES » en bas : render <fichier.py> <ClasseScène> <nom-de-sortie>
#
# Usage :
#   bash manim/render.sh        # qualité moyenne (720p) — défaut
#   bash manim/render.sh qh     # 1080p ;  ql = test rapide
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
VENV="$HERE/.venv/bin"
OUT="$ROOT/public/videos"
QUALITY="${1:-qm}"

mkdir -p "$OUT"
export PYTHONPATH="$HERE"

render() {
  local file="$1" scene="$2" name="$3"
  echo "──▶ $name ($scene)"
  "$VENV/manim" "-$QUALITY" --media_dir "$HERE/media" -o "$name" "$HERE/$file" "$scene"
  local mp4
  mp4="$(find "$HERE/media/videos" -name "$name.mp4" | head -1)"
  if [ -z "$mp4" ]; then echo "  ✗ MP4 introuvable pour $name"; return 1; fi
  cp "$mp4" "$OUT/$name.mp4"
  # poster : image extraite à ~66 % de la durée (frame représentatif)
  local dur seek
  dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$name.mp4" 2>/dev/null || echo 6)"
  seek="$(awk "BEGIN{printf \"%.2f\", ${dur:-6}*0.66}")"
  ffmpeg -y -loglevel error -ss "$seek" -i "$OUT/$name.mp4" -frames:v 1 "$OUT/$name.png" \
    || ffmpeg -y -loglevel error -i "$OUT/$name.mp4" -frames:v 1 "$OUT/$name.png"
  echo "  ✓ $OUT/$name.mp4  (+ poster)"
}

# ============================ VOS SCÈNES ============================
render build_naturals.py BuildNaturals build-naturals
# ===================================================================

echo "Terminé. Vidéos dans $OUT :"
ls -1 "$OUT"
