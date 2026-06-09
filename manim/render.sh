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
# — cours « maths »
render build_naturals.py BuildNaturals build-naturals
# — cours « processeurs » (de l'atome au système d'exploitation)
render mosfet_switch.py   MosfetSwitch    mosfet-switch
render energy_bands.py    EnergyBands     energy-bands
render pn_junction.py     PNJunction      pn-junction
render cmos_inverter.py   CmosInverter    cmos-inverter
render nand_universal.py  NandUniversal   nand-universal
render binary_addition.py BinaryAddition  binary-addition
render d_flip_flop.py     DFlipFlop       d-flip-flop
render fetch_execute.py   FetchExecute    fetch-execute
render virtual_memory.py  VirtualMemory   virtual-memory
render boot_sequence.py   BootSequence    boot-sequence
# — cours « cosmologie » (des premiers instants au monde actuel)
render expansion_univers.py      ExpansionUnivers      expansion-univers
render friedmann_destins.py      FriedmannDestins      friedmann-destins
render histoire_thermique.py     HistoireThermique     histoire-thermique
render recombinaison_cmb.py      RecombinaisonCMB      recombinaison-cmb
render courbe_rotation.py        CourbeRotation        courbe-rotation
render acceleration_expansion.py AccelerationExpansion acceleration-expansion
# — cours « chimie » (depuis l'atome quantique)
render chimie_saut_quantique_raie_spectrale.py  ChimieSautQuantiqueRaie             chimie-saut-quantique-raie-spectrale
render chimie_vsepr_angle_qui_se_referme.py     ChimieVseprAngleQuiSeReferme        chimie-vsepr-angle-qui-se-referme
render chimie_barriere_activation_catalyseur.py ChimieBarriereActivationCatalyseur  chimie-barriere-activation-catalyseur
render chimie_fleches_courbes_sn2.py            ChimieFlechesCourbesSn2             chimie-fleches-courbes-sn2
# — cours « réseaux » (depuis le bit)
render reseaux_fourier_creneau_synthese.py      ReseauFourierCreneau                reseaux-fourier-creneau-synthese
render reseaux_crc_division_xor.py              ReseauCrcDivision                   reseaux-crc-division-xor
render reseaux_csma_cd_collision.py             ReseauCsmaCollision                 reseaux-csma-cd-collision
render reseaux_masque_et_binaire_prefixe.py     ReseauMasqueEtBinaire               reseaux-masque-et-binaire-prefixe
# — cours « histoire » (des premiers hommes aux temps modernes)
render histoire_decroissance_carbone14.py       HistoireDecroissanceCarbone14       histoire-decroissance-carbone14
render histoire_jeton_vers_signe.py             HistoireJetonVersSigne              histoire-jeton-vers-signe
render histoire_tirage_au_sort_kleroterion.py   HistoireKleroterion                 histoire-tirage-au-sort-kleroterion
render histoire_caracteres_mobiles.py           HistoireCaracteresMobiles           histoire-caracteres-mobiles
# — cours « IA » (de zéro au transformer)
render ia_descente_gradient.py                  IaDescenteGradient                  ia-descente-gradient
render ia_approximation_bosses.py               IaApproximationBosses               ia-approximation-bosses
render ia_convolution_filtre.py                 IaConvolutionFiltre                 ia-convolution-filtre
render ia_attention_qkv.py                      IaAttentionQkv                      ia-attention-qkv
# ===================================================================

echo "Terminé. Vidéos dans $OUT :"
ls -1 "$OUT"
