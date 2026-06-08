import { createScene, text, clamp, map, fmt, type Scene } from './_canvas';

type Grandeur = 'rayon' | 'ei' | 'en';

interface El {
  z: number;
  sym: string;
  nom: string;
  per: number; // période (ligne)
  grp: number; // groupe (colonne 1..18)
  bloc: 's' | 'p' | 'd';
  conf: string; // config condensée
  rayon: number; // pm
  ei: number; // kJ/mol
  en: number; // électronégativité Pauling (0 si indéfinie)
}

// Données pour les périodes 1 à 4 (main group + 3d). Lanthanides omis.
// rayon: rayon atomique empirique (pm) ; ei: 1ère ionisation (kJ/mol) ; en: Pauling.
const DATA: El[] = [
  { z: 1, sym: 'H', nom: 'hydrogène', per: 1, grp: 1, bloc: 's', conf: '1s¹', rayon: 53, ei: 1312, en: 2.2 },
  { z: 2, sym: 'He', nom: 'hélium', per: 1, grp: 18, bloc: 's', conf: '1s²', rayon: 31, ei: 2372, en: 0 },
  { z: 3, sym: 'Li', nom: 'lithium', per: 2, grp: 1, bloc: 's', conf: '[He] 2s¹', rayon: 167, ei: 520, en: 0.98 },
  { z: 4, sym: 'Be', nom: 'béryllium', per: 2, grp: 2, bloc: 's', conf: '[He] 2s²', rayon: 112, ei: 899, en: 1.57 },
  { z: 5, sym: 'B', nom: 'bore', per: 2, grp: 13, bloc: 'p', conf: '[He] 2s² 2p¹', rayon: 87, ei: 801, en: 2.04 },
  { z: 6, sym: 'C', nom: 'carbone', per: 2, grp: 14, bloc: 'p', conf: '[He] 2s² 2p²', rayon: 67, ei: 1086, en: 2.55 },
  { z: 7, sym: 'N', nom: 'azote', per: 2, grp: 15, bloc: 'p', conf: '[He] 2s² 2p³', rayon: 56, ei: 1402, en: 3.04 },
  { z: 8, sym: 'O', nom: 'oxygène', per: 2, grp: 16, bloc: 'p', conf: '[He] 2s² 2p⁴', rayon: 48, ei: 1314, en: 3.44 },
  { z: 9, sym: 'F', nom: 'fluor', per: 2, grp: 17, bloc: 'p', conf: '[He] 2s² 2p⁵', rayon: 42, ei: 1681, en: 3.98 },
  { z: 10, sym: 'Ne', nom: 'néon', per: 2, grp: 18, bloc: 'p', conf: '[He] 2s² 2p⁶', rayon: 38, ei: 2081, en: 0 },
  { z: 11, sym: 'Na', nom: 'sodium', per: 3, grp: 1, bloc: 's', conf: '[Ne] 3s¹', rayon: 190, ei: 496, en: 0.93 },
  { z: 12, sym: 'Mg', nom: 'magnésium', per: 3, grp: 2, bloc: 's', conf: '[Ne] 3s²', rayon: 145, ei: 738, en: 1.31 },
  { z: 13, sym: 'Al', nom: 'aluminium', per: 3, grp: 13, bloc: 'p', conf: '[Ne] 3s² 3p¹', rayon: 118, ei: 578, en: 1.61 },
  { z: 14, sym: 'Si', nom: 'silicium', per: 3, grp: 14, bloc: 'p', conf: '[Ne] 3s² 3p²', rayon: 111, ei: 786, en: 1.9 },
  { z: 15, sym: 'P', nom: 'phosphore', per: 3, grp: 15, bloc: 'p', conf: '[Ne] 3s² 3p³', rayon: 98, ei: 1012, en: 2.19 },
  { z: 16, sym: 'S', nom: 'soufre', per: 3, grp: 16, bloc: 'p', conf: '[Ne] 3s² 3p⁴', rayon: 88, ei: 1000, en: 2.58 },
  { z: 17, sym: 'Cl', nom: 'chlore', per: 3, grp: 17, bloc: 'p', conf: '[Ne] 3s² 3p⁵', rayon: 79, ei: 1251, en: 3.16 },
  { z: 18, sym: 'Ar', nom: 'argon', per: 3, grp: 18, bloc: 'p', conf: '[Ne] 3s² 3p⁶', rayon: 71, ei: 1521, en: 0 },
  { z: 19, sym: 'K', nom: 'potassium', per: 4, grp: 1, bloc: 's', conf: '[Ar] 4s¹', rayon: 243, ei: 419, en: 0.82 },
  { z: 20, sym: 'Ca', nom: 'calcium', per: 4, grp: 2, bloc: 's', conf: '[Ar] 4s²', rayon: 194, ei: 590, en: 1.0 },
  { z: 21, sym: 'Sc', nom: 'scandium', per: 4, grp: 3, bloc: 'd', conf: '[Ar] 3d¹ 4s²', rayon: 184, ei: 633, en: 1.36 },
  { z: 22, sym: 'Ti', nom: 'titane', per: 4, grp: 4, bloc: 'd', conf: '[Ar] 3d² 4s²', rayon: 176, ei: 659, en: 1.54 },
  { z: 23, sym: 'V', nom: 'vanadium', per: 4, grp: 5, bloc: 'd', conf: '[Ar] 3d³ 4s²', rayon: 171, ei: 651, en: 1.63 },
  { z: 24, sym: 'Cr', nom: 'chrome', per: 4, grp: 6, bloc: 'd', conf: '[Ar] 3d⁵ 4s¹', rayon: 166, ei: 653, en: 1.66 },
  { z: 25, sym: 'Mn', nom: 'manganèse', per: 4, grp: 7, bloc: 'd', conf: '[Ar] 3d⁵ 4s²', rayon: 161, ei: 717, en: 1.55 },
  { z: 26, sym: 'Fe', nom: 'fer', per: 4, grp: 8, bloc: 'd', conf: '[Ar] 3d⁶ 4s²', rayon: 156, ei: 762, en: 1.83 },
  { z: 27, sym: 'Co', nom: 'cobalt', per: 4, grp: 9, bloc: 'd', conf: '[Ar] 3d⁷ 4s²', rayon: 152, ei: 760, en: 1.88 },
  { z: 28, sym: 'Ni', nom: 'nickel', per: 4, grp: 10, bloc: 'd', conf: '[Ar] 3d⁸ 4s²', rayon: 149, ei: 737, en: 1.91 },
  { z: 29, sym: 'Cu', nom: 'cuivre', per: 4, grp: 11, bloc: 'd', conf: '[Ar] 3d¹⁰ 4s¹', rayon: 145, ei: 745, en: 1.9 },
  { z: 30, sym: 'Zn', nom: 'zinc', per: 4, grp: 12, bloc: 'd', conf: '[Ar] 3d¹⁰ 4s²', rayon: 142, ei: 906, en: 1.65 },
  { z: 31, sym: 'Ga', nom: 'gallium', per: 4, grp: 13, bloc: 'p', conf: '[Ar] 3d¹⁰ 4s² 4p¹', rayon: 136, ei: 579, en: 1.81 },
  { z: 32, sym: 'Ge', nom: 'germanium', per: 4, grp: 14, bloc: 'p', conf: '[Ar] …4p²', rayon: 125, ei: 762, en: 2.01 },
  { z: 33, sym: 'As', nom: 'arsenic', per: 4, grp: 15, bloc: 'p', conf: '[Ar] …4p³', rayon: 114, ei: 947, en: 2.18 },
  { z: 34, sym: 'Se', nom: 'sélénium', per: 4, grp: 16, bloc: 'p', conf: '[Ar] …4p⁴', rayon: 103, ei: 941, en: 2.55 },
  { z: 35, sym: 'Br', nom: 'brome', per: 4, grp: 17, bloc: 'p', conf: '[Ar] …4p⁵', rayon: 94, ei: 1140, en: 2.96 },
  { z: 36, sym: 'Kr', nom: 'krypton', per: 4, grp: 18, bloc: 'p', conf: '[Ar] …4p⁶', rayon: 88, ei: 1351, en: 3.0 },
];

const GRANDEURS: Record<Grandeur, { key: keyof El; unit: string; label: string; dec: number }> = {
  rayon: { key: 'rayon', unit: 'pm', label: 'rayon atomique', dec: 0 },
  ei: { key: 'ei', unit: 'kJ/mol', label: 'énergie d’ionisation', dec: 0 },
  en: { key: 'en', unit: '', label: 'électronégativité', dec: 2 },
};

const BLOC_COL: Record<string, 'blue' | 'green' | 'purple'> = {
  s: 'blue', p: 'green', d: 'purple',
};

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selG = root.querySelector<HTMLSelectElement>('[data-grandeur]')!;
  const cbBloc = root.querySelector<HTMLInputElement>('[data-bloc]')!;
  const outBloc = root.querySelector<HTMLElement>('[data-out-bloc]')!;
  const outSym = root.querySelector<HTMLElement>('[data-out-sym]')!;
  const outZ = root.querySelector<HTMLElement>('[data-out-z]')!;
  const outConf = root.querySelector<HTMLElement>('[data-out-conf]')!;
  const outBlocTxt = root.querySelector<HTMLElement>('[data-out-bloctxt]')!;
  const outVal = root.querySelector<HTMLElement>('[data-out-val]')!;

  let grandeur = selG.value as Grandeur;
  let colorByBloc = cbBloc.checked;
  let hoverZ = -1;
  // géométrie des cases, recalculée à chaque dessin pour le hit-testing
  let geom = { x0: 0, y0: 0, cw: 0, ch: 0 };

  const scene = createScene(canvas, draw);

  function valuesOf(): number[] {
    const k = GRANDEURS[grandeur].key;
    return DATA.map((e) => e[k] as number).filter((v) => v > 0);
  }

  function colorFor(s: Scene, e: El): string {
    if (colorByBloc) {
      const c = s.pal[BLOC_COL[e.bloc]];
      return mixHex(c, s.pal.bg, 0.35);
    }
    const k = GRANDEURS[grandeur].key;
    const v = e[k] as number;
    const vals = valuesOf();
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    if (v <= 0) return s.pal.surface;
    const t = clamp(map(v, lo, hi, 0, 1), 0, 1);
    // échelle bleu (bas) -> jaune -> rouge (haut)
    const c = t < 0.5
      ? mix(hexToRgb(s.pal.blue), hexToRgb(s.pal.yellow), t * 2)
      : mix(hexToRgb(s.pal.yellow), hexToRgb(s.pal.red), (t - 0.5) * 2);
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  function refresh() {
    outBloc.textContent = colorByBloc ? 'oui' : 'non';
    const e = DATA.find((x) => x.z === hoverZ);
    if (!e) {
      outSym.textContent = '—'; outZ.textContent = '—'; outConf.textContent = '—';
      outBlocTxt.textContent = '—'; outVal.textContent = '—';
      return;
    }
    const g = GRANDEURS[grandeur];
    const v = e[g.key] as number;
    outSym.textContent = `${e.sym} (${e.nom})`;
    outZ.textContent = String(e.z);
    outConf.textContent = e.conf;
    outBlocTxt.textContent = `${e.bloc}`;
    outVal.textContent = v > 0 ? `${g.label} : ${fmt(v, g.dec)} ${g.unit}`.trim() : 'non définie';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const cols = 18;
    const rows = 4;
    const padX = 8;
    const padTop = 8;
    const legendH = 26;
    const cw = (W - padX * 2) / cols;
    const ch = (H - padTop - legendH) / rows;
    geom = { x0: padX, y0: padTop, cw, ch };

    const g = GRANDEURS[grandeur];

    DATA.forEach((e) => {
      const x = padX + (e.grp - 1) * cw;
      const y = padTop + (e.per - 1) * ch;
      const hovered = e.z === hoverZ;
      ctx.fillStyle = colorFor(s, e);
      ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
      ctx.strokeStyle = hovered ? pal.text : pal.border;
      ctx.lineWidth = hovered ? 2.2 : 0.8;
      ctx.strokeRect(x + 1, y + 1, cw - 2, ch - 2);

      // Texte lisible : choisir noir/blanc selon luminance du fond.
      const txtCol = readable(colorFor(s, e));
      text(ctx, e.sym, x + cw / 2, y + ch * 0.42, {
        color: txtCol, size: Math.min(ch * 0.34, 16), weight: 700,
        align: 'center', baseline: 'middle',
      });
      const v = e[g.key] as number;
      if (!colorByBloc && v > 0 && ch > 26) {
        text(ctx, fmt(v, g.dec), x + cw / 2, y + ch * 0.74, {
          color: txtCol, size: Math.min(ch * 0.22, 10), align: 'center', baseline: 'middle',
        });
      }
    });

    // Légende / barre de couleur.
    const ly = padTop + rows * ch + 8;
    if (colorByBloc) {
      const items: Array<[string, 'blue' | 'green' | 'purple']> = [
        ['bloc s', 'blue'], ['bloc p', 'green'], ['bloc d', 'purple'],
      ];
      let lx = padX;
      items.forEach(([lbl, c]) => {
        ctx.fillStyle = mixHex(pal[c], pal.bg, 0.35);
        ctx.fillRect(lx, ly, 16, 12);
        text(ctx, lbl, lx + 20, ly + 6, { color: pal.muted, size: 11, baseline: 'middle' });
        lx += 90;
      });
    } else {
      const vals = valuesOf();
      const lo = Math.min(...vals), hi = Math.max(...vals);
      const barW = Math.min(W - padX * 2 - 160, 220);
      const bx = padX;
      const steps = 40;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const c = t < 0.5
          ? mix(hexToRgb(pal.blue), hexToRgb(pal.yellow), t * 2)
          : mix(hexToRgb(pal.yellow), hexToRgb(pal.red), (t - 0.5) * 2);
        ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
        ctx.fillRect(bx + (i / steps) * barW, ly, barW / steps + 1, 12);
      }
      text(ctx, `${fmt(lo, g.dec)}`, bx, ly + 18, { color: pal.muted, size: 10, baseline: 'middle' });
      text(ctx, `${fmt(hi, g.dec)} ${g.unit}`, bx + barW, ly + 18, {
        color: pal.muted, size: 10, align: 'right', baseline: 'middle',
      });
      text(ctx, g.label, bx + barW + 10, ly + 6, { color: pal.text, size: 12, weight: 700, baseline: 'middle' });
    }
  }

  function hitTest(px: number, py: number): number {
    const { x0, y0, cw, ch } = geom;
    const col = Math.floor((px - x0) / cw) + 1;
    const row = Math.floor((py - y0) / ch) + 1;
    const e = DATA.find((x) => x.grp === col && x.per === row);
    return e ? e.z : -1;
  }

  canvas.style.touchAction = 'none';
  function onMove(ev: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    const z = hitTest(ev.clientX - rect.left, ev.clientY - rect.top);
    if (z !== hoverZ) { hoverZ = z; refresh(); scene.requestDraw(); }
  }
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerdown', onMove);
  canvas.addEventListener('pointerleave', () => {
    if (hoverZ !== -1) { hoverZ = -1; refresh(); scene.requestDraw(); }
  });

  selG.addEventListener('change', () => { grandeur = selG.value as Grandeur; refresh(); scene.requestDraw(); });
  cbBloc.addEventListener('change', () => { colorByBloc = cbBloc.checked; refresh(); scene.requestDraw(); });

  refresh();
}

/* ---------- Couleurs ---------- */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  if (h.length >= 6) {
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  if (h.length === 3) {
    return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
  }
  return [128, 128, 128];
}
function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}
function mixHex(aHex: string, bHex: string, t: number): string {
  const c = mix(hexToRgb(aHex), hexToRgb(bHex), t);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
/** Renvoie '#0a0a0a' ou '#ffffff' selon la luminance du fond rgb()/#hex. */
function readable(col: string): string {
  let rgb: [number, number, number];
  if (col.startsWith('rgb')) {
    const m = col.match(/(\d+)/g)!;
    rgb = [+m[0], +m[1], +m[2]];
  } else {
    rgb = hexToRgb(col);
  }
  const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return lum > 0.55 ? '#111418' : '#f3f6fa';
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-tableau"]').forEach(init);
