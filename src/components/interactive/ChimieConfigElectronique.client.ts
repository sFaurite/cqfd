import { createScene, line, text, type Scene } from './_canvas';

const SUB = ['s', 'p', 'd', 'f'];
const CAP = [2, 6, 10, 14]; // capacité par type de sous-couche

interface Orb {
  n: number;
  l: number; // 0..3
}

// Ordre de Klechkowski (n+l croissant, puis n croissant) jusqu'à 4p.
const ORDER: Orb[] = [
  { n: 1, l: 0 }, // 1s
  { n: 2, l: 0 }, // 2s
  { n: 2, l: 1 }, // 2p
  { n: 3, l: 0 }, // 3s
  { n: 3, l: 1 }, // 3p
  { n: 4, l: 0 }, // 4s
  { n: 3, l: 2 }, // 3d
  { n: 4, l: 1 }, // 4p
];

// Symboles des 36 premiers éléments.
const SYM = [
  '', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
];
const NAME = [
  '', 'hydrogène', 'hélium', 'lithium', 'béryllium', 'bore', 'carbone', 'azote',
  'oxygène', 'fluor', 'néon', 'sodium', 'magnésium', 'aluminium', 'silicium',
  'phosphore', 'soufre', 'chlore', 'argon', 'potassium', 'calcium', 'scandium',
  'titane', 'vanadium', 'chrome', 'manganèse', 'fer', 'cobalt', 'nickel',
  'cuivre', 'zinc', 'gallium', 'germanium', 'arsenic', 'sélénium', 'brome', 'krypton',
];

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function toSup(n: number): string {
  return String(n).split('').map((d) => SUP[+d]).join('');
}

interface FilledSub {
  orb: Orb;
  count: number;
  exception?: boolean;
}

/**
 * Construit le remplissage des sous-couches pour un Z donné.
 * Applique les exceptions de Cr (Z=24) et Cu (Z=29).
 */
function build(z: number): FilledSub[] {
  const subs: FilledSub[] = [];
  let remaining = z;
  for (const orb of ORDER) {
    if (remaining <= 0) break;
    const cap = CAP[orb.l];
    const c = Math.min(cap, remaining);
    subs.push({ orb, count: c });
    remaining -= c;
  }
  // Exceptions : on déplace un électron de 4s vers 3d.
  if (z === 24 || z === 29) {
    const i3d = subs.findIndex((s) => s.orb.n === 3 && s.orb.l === 2);
    const i4s = subs.findIndex((s) => s.orb.n === 4 && s.orb.l === 0);
    if (i3d >= 0 && i4s >= 0 && subs[i4s].count === 2) {
      subs[i4s].count = 1;
      subs[i3d].count += 1;
      subs[i3d].exception = true;
      subs[i4s].exception = true;
    }
  }
  return subs;
}

/** Configuration condensée, ex. [Ar] 3d⁵ 4s¹ (ordre par n puis l). */
function condensed(subs: FilledSub[]): string {
  const noble = [
    { z: 18, sym: 'Ar' },
    { z: 10, sym: 'Ne' },
    { z: 2, sym: 'He' },
  ];
  const total = subs.reduce((a, s) => a + s.count, 0);
  let core = '';
  let coreZ = 0;
  for (const nb of noble) {
    if (total > nb.z) { core = `[${nb.sym}] `; coreZ = nb.z; break; }
  }
  // sous-couches au-delà du cœur, triées par n puis l pour l'écriture finale
  let acc = 0;
  const outer = subs
    .filter((s) => {
      const before = acc;
      acc += s.count;
      return before >= coreZ;
    })
    .sort((a, b) => a.orb.n - b.orb.n || a.orb.l - b.orb.l)
    .map((s) => `${s.orb.n}${SUB[s.orb.l]}${toSup(s.count)}`);
  return core + (outer.join(' ') || '');
}

/** Nombre d'électrons non appariés (Hund) de la dernière sous-couche partielle. */
function unpaired(subs: FilledSub[], hund: boolean): number {
  let total = 0;
  for (const s of subs) {
    const boxes = CAP[s.orb.l] / 2;
    if (!hund) {
      // appariement immédiat : on remplit case par case (2 puis 2...)
      const full = Math.floor(s.count / 2);
      const rem = s.count - full * 2;
      total += rem; // 0 ou 1 par sous-couche
    } else {
      if (s.count <= boxes) total += s.count;
      else total += 2 * boxes - s.count;
    }
  }
  return total;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sZ = root.querySelector<HTMLInputElement>('[data-z]')!;
  const cbHund = root.querySelector<HTMLInputElement>('[data-hund]')!;
  const outZ = root.querySelector<HTMLElement>('[data-out-z]')!;
  const outHund = root.querySelector<HTMLElement>('[data-out-hund]')!;
  const outSym = root.querySelector<HTMLElement>('[data-out-sym]')!;
  const outConf = root.querySelector<HTMLElement>('[data-out-conf]')!;
  const outUnp = root.querySelector<HTMLElement>('[data-out-unp]')!;
  const outFlag = root.querySelector<HTMLElement>('[data-out-flag]')!;

  let z = +sZ.value;
  let hund = cbHund.checked;

  const scene = createScene(canvas, draw);

  function refresh() {
    const subs = build(z);
    const isExc = subs.some((s) => s.exception);
    outZ.textContent = String(z);
    outHund.textContent = hund ? 'oui' : 'non';
    outSym.textContent = `${SYM[z]} (${NAME[z]})`;
    outConf.textContent = condensed(subs);
    outUnp.textContent = String(unpaired(subs, hund));
    outFlag.textContent = isExc ? 'exception (stabilité d/demi-rempli)' : 'régulier';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const subs = build(z);

    const padX = 16;
    const padTop = 30;
    const rowH = (H - padTop - 14) / subs.length;
    const labelW = 54;
    const boxGap = 6;

    text(ctx, `Cases quantiques — ${SYM[z]} (Z = ${z})`, padX, 18, {
      color: pal.text, size: 14, weight: 700, baseline: 'middle',
    });

    subs.forEach((sub, i) => {
      const y = padTop + i * rowH;
      const cy = y + rowH / 2;
      const boxes = CAP[sub.orb.l] / 2;

      // Étiquette de la sous-couche.
      const lbl = `${sub.orb.n}${SUB[sub.orb.l]}`;
      text(ctx, lbl, padX, cy, {
        color: sub.exception ? pal.yellow : pal.text,
        size: 13, weight: 700, baseline: 'middle',
      });

      // Répartition des spins par case selon Hund.
      const spins = distribute(sub.count, boxes, hund);

      const availW = W - padX - labelW - 12;
      const bw = Math.min((availW - (boxes - 1) * boxGap) / boxes, rowH * 0.78);
      const bh = Math.min(bw * 0.78, rowH * 0.7);
      const startX = padX + labelW;

      spins.forEach((cell, b) => {
        const bx = startX + b * (bw + boxGap);
        const by = cy - bh / 2;
        // Case.
        ctx.strokeStyle = sub.exception ? pal.yellow : pal.border;
        ctx.lineWidth = sub.exception ? 1.8 : 1.3;
        ctx.strokeRect(bx, by, bw, bh);
        // Flèches de spin (haut = ↑, bas = ↓).
        const inX = bx + bw / 2;
        const ah = bh * 0.62;
        if (cell >= 1) drawSpin(ctx, inX - (cell === 2 ? bw * 0.16 : 0), by + bh / 2, ah, true, pal.blue);
        if (cell === 2) drawSpin(ctx, inX + bw * 0.16, by + bh / 2, ah, false, pal.red);
      });
    });

    // Légende.
    const ly = H - 6;
    drawSpin(ctx, padX + 8, ly, 14, true, pal.blue);
    text(ctx, 'spin ↑', padX + 18, ly, { color: pal.muted, size: 11, baseline: 'middle' });
    drawSpin(ctx, padX + 78, ly, 14, false, pal.red);
    text(ctx, 'spin ↓', padX + 88, ly, { color: pal.muted, size: 11, baseline: 'middle' });
    const isExc = subs.some((x) => x.exception);
    if (isExc) {
      text(ctx, 'exception (Cr/Cu)', W - padX, ly, {
        color: pal.yellow, size: 11, weight: 700, align: 'right', baseline: 'middle',
      });
    }
  }

  /** Répartit `count` électrons dans `boxes` cases : nombre par case (0,1,2). */
  function distribute(count: number, boxes: number, withHund: boolean): number[] {
    const cells = new Array(boxes).fill(0);
    let c = count;
    if (withHund) {
      for (let b = 0; b < boxes && c > 0; b++) { cells[b] = 1; c--; }
      for (let b = 0; b < boxes && c > 0; b++) { cells[b] = 2; c--; }
    } else {
      for (let b = 0; b < boxes && c > 0; b++) {
        cells[b] = Math.min(2, c); c -= cells[b];
      }
    }
    return cells;
  }

  function drawSpin(
    ctx: CanvasRenderingContext2D, x: number, cy: number, h: number, up: boolean, col: string,
  ) {
    const top = cy - h / 2;
    const bot = cy + h / 2;
    const y1 = up ? bot : top;
    const y2 = up ? top : bot;
    line(ctx, x, y1, x, y2, col, 2);
    const dir = up ? 1 : -1;
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.moveTo(x - 3, y2 + dir * 4);
    ctx.lineTo(x, y2);
    ctx.lineTo(x + 3, y2 + dir * 4);
    ctx.stroke();
  }

  sZ.addEventListener('input', () => { z = +sZ.value; refresh(); scene.requestDraw(); });
  cbHund.addEventListener('change', () => { hund = cbHund.checked; refresh(); scene.requestDraw(); });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-config"]').forEach(init);
