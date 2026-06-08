import { createScene, line, text, type Scene } from './_canvas';

type Mol = 'H2' | 'He2' | 'N2' | 'O2' | 'F2';

interface MO {
  name: string; // libellé affiché
  bonding: boolean; // liante (compte +) ou antiliante (compte −)
  cap: number; // capacité (2 ou 4 pour les paires dégénérées π)
  degenerate?: boolean; // niveau dégénéré (π) -> appliquer Hund
  energy: number; // ordre vertical relatif (plus grand = plus haut)
}

// Deux ordres possibles des OM de valence selon l'inversion σ2p / π2p.
// Pour Z ≤ 7 (jusqu'à N) : π2p sous σ2p (ordre inversé).
function valenceMOs(inverted: boolean): MO[] {
  const list: MO[] = [
    { name: 'σ2s', bonding: true, cap: 2, energy: 1 },
    { name: 'σ*2s', bonding: false, cap: 2, energy: 2 },
  ];
  if (inverted) {
    list.push({ name: 'π2p', bonding: true, cap: 4, degenerate: true, energy: 3 });
    list.push({ name: 'σ2p', bonding: true, cap: 2, energy: 4 });
  } else {
    list.push({ name: 'σ2p', bonding: true, cap: 2, energy: 3 });
    list.push({ name: 'π2p', bonding: true, cap: 4, degenerate: true, energy: 4 });
  }
  list.push({ name: 'π*2p', bonding: false, cap: 4, degenerate: true, energy: 5 });
  list.push({ name: 'σ*2p', bonding: false, cap: 2, energy: 6 });
  return list;
}

interface Spec {
  valEl: number; // électrons de valence
  inverted: boolean; // ordre σ/π inversé ?
  onlyS: boolean; // H2/He2 : uniquement σ1s / σ*1s
  label: string;
}

const SPECS: Record<Mol, Spec> = {
  H2: { valEl: 2, inverted: true, onlyS: true, label: 'H₂' },
  He2: { valEl: 4, inverted: true, onlyS: true, label: 'He₂' },
  N2: { valEl: 10, inverted: true, onlyS: false, label: 'N₂' },
  O2: { valEl: 12, inverted: false, onlyS: false, label: 'O₂' },
  F2: { valEl: 14, inverted: false, onlyS: false, label: 'F₂' },
};

interface FillState {
  mos: (MO & { electrons: number; cells: number[] })[];
  bondOrder: number;
  unpaired: number;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selMol = root.querySelector<HTMLSelectElement>('[data-mol]')!;
  const cbHund = root.querySelector<HTMLInputElement>('[data-hund]')!;
  const outHund = root.querySelector<HTMLElement>('[data-out-hund]')!;
  const outNe = root.querySelector<HTMLElement>('[data-out-ne]')!;
  const outOl = root.querySelector<HTMLElement>('[data-out-ol]')!;
  const outUnp = root.querySelector<HTMLElement>('[data-out-unp]')!;
  const outMag = root.querySelector<HTMLElement>('[data-out-mag]')!;

  let mol = selMol.value as Mol;
  let hund = cbHund.checked;

  const scene = createScene(canvas, draw);

  function buildMOs(spec: Spec): MO[] {
    if (spec.onlyS) {
      return [
        { name: 'σ1s', bonding: true, cap: 2, energy: 1 },
        { name: 'σ*1s', bonding: false, cap: 2, energy: 2 },
      ];
    }
    return valenceMOs(spec.inverted);
  }

  function fill(): FillState {
    const spec = SPECS[mol];
    const mos = buildMOs(spec).sort((a, b) => a.energy - b.energy);
    let e = spec.valEl;
    const filled = mos.map((mo) => {
      const take = Math.min(mo.cap, e);
      e -= take;
      const boxes = mo.cap / 2;
      const cells = distribute(take, boxes, mo.degenerate ? hund : true);
      return { ...mo, electrons: take, cells };
    });
    let liants = 0, antiliants = 0, unpaired = 0;
    filled.forEach((mo) => {
      if (mo.bonding) liants += mo.electrons; else antiliants += mo.electrons;
      unpaired += mo.cells.filter((c) => c === 1).length;
    });
    return { mos: filled, bondOrder: (liants - antiliants) / 2, unpaired };
  }

  function refresh() {
    const spec = SPECS[mol];
    const st = fill();
    outHund.textContent = hund ? 'oui' : 'non';
    outNe.textContent = String(spec.valEl);
    outOl.textContent = formatOrder(st.bondOrder);
    outUnp.textContent = String(st.unpaired);
    outMag.textContent = st.unpaired > 0 ? 'paramagnétique' : 'diamagnétique';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const spec = SPECS[mol];
    const st = fill();

    const padTop = 30;
    const padBot = 24;
    const cx = W / 2;
    const colAO = W * 0.16; // colonnes des AO atomiques
    const leftX = colAO;
    const rightX = W - colAO;
    const moX = cx;

    text(ctx, `${spec.label} — diagramme d’orbitales moléculaires`, cx, 16, {
      color: pal.text, size: 14, weight: 700, align: 'center', baseline: 'middle',
    });
    text(ctx, 'atome', leftX, padTop - 6, { color: pal.muted, size: 11, align: 'center', baseline: 'alphabetic' });
    text(ctx, 'molécule', moX, padTop - 6, { color: pal.muted, size: 11, align: 'center', baseline: 'alphabetic' });
    text(ctx, 'atome', rightX, padTop - 6, { color: pal.muted, size: 11, align: 'center', baseline: 'alphabetic' });

    const mos = st.mos;
    const nLevels = mos.length;
    const top = padTop + 6;
    const bot = H - padBot;
    // niveaux du bas (basse énergie) vers le haut, par rang croissant
    const lvlW = W * 0.13;

    mos.forEach((mo) => {
      const y = bot - (energyRank(mo.energy, mos) / Math.max(nLevels - 1, 1)) * (bot - top);
      const x0 = moX - lvlW / 2;
      const x1 = moX + lvlW / 2;
      const col = mo.bonding ? pal.green : pal.red;
      line(ctx, x0, y, x1, y, col, 2.4);
      text(ctx, mo.name, moX, y - 9, {
        color: col, size: 11, weight: 700, align: 'center', baseline: 'alphabetic',
      });

      // Électrons (flèches de spin).
      const boxes = mo.cap / 2;
      const totalW = lvlW * 0.7;
      mo.cells.forEach((cell, b) => {
        const bx = moX - totalW / 2 + ((b + 0.5) / boxes) * totalW;
        if (cell >= 1) drawSpin(ctx, bx - (cell === 2 ? 4 : 0), y, true, pal.blue);
        if (cell === 2) drawSpin(ctx, bx + 4, y, false, pal.red);
      });
    });

    // Niveaux atomiques (à gauche/droite) : 2s et 2p (ou 1s).
    const aoLevels = spec.onlyS
      ? [{ name: '1s', frac: 0.5 }]
      : [{ name: '2p', frac: 0.78 }, { name: '2s', frac: 0.3 }];
    aoLevels.forEach((ao) => {
      const y = bot - ao.frac * (bot - top);
      for (const x of [leftX, rightX]) {
        line(ctx, x - lvlW * 0.4, y, x + lvlW * 0.4, y, pal.muted, 2);
      }
      text(ctx, ao.name, leftX - lvlW * 0.5, y, {
        color: pal.muted, size: 11, align: 'right', baseline: 'middle',
      });
    });

    // Axe énergie.
    text(ctx, 'E', 12, top, { color: pal.muted, size: 12, weight: 700, baseline: 'middle' });
    line(ctx, 20, top, 20, bot, pal.border, 1);
    ctx.save();
    ctx.fillStyle = pal.border;
    ctx.beginPath();
    ctx.moveTo(20, top - 6); ctx.lineTo(16, top); ctx.lineTo(24, top); ctx.closePath(); ctx.fill();
    ctx.restore();

    // Légende paramagnétisme.
    const mag = st.unpaired > 0;
    text(ctx,
      `ordre de liaison = ${formatOrder(st.bondOrder)}   •   ${mag ? `${st.unpaired} e⁻ célibataire(s) → paramagnétique` : 'tous appariés → diamagnétique'}`,
      cx, H - 8, {
        color: mag ? pal.yellow : pal.muted, size: 12, weight: 700, align: 'center', baseline: 'alphabetic',
      });
  }

  function drawSpin(ctx: CanvasRenderingContext2D, x: number, yMid: number, up: boolean, col: string) {
    const h = 13;
    const top = yMid - h / 2, bot = yMid + h / 2;
    const y1 = up ? bot : top, y2 = up ? top : bot;
    line(ctx, x, y1, x, y2, col, 1.8);
    const dir = up ? 1 : -1;
    ctx.beginPath();
    ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
    ctx.moveTo(x - 2.5, y2 + dir * 3.5); ctx.lineTo(x, y2); ctx.lineTo(x + 2.5, y2 + dir * 3.5);
    ctx.stroke();
  }

  selMol.addEventListener('change', () => { mol = selMol.value as Mol; refresh(); scene.requestDraw(); });
  cbHund.addEventListener('change', () => { hund = cbHund.checked; refresh(); scene.requestDraw(); });

  refresh();
}

/** Répartit `count` e⁻ dans `boxes` cases : 0/1/2 par case. */
function distribute(count: number, boxes: number, withHund: boolean): number[] {
  const cells = new Array(boxes).fill(0);
  let c = count;
  if (withHund) {
    for (let b = 0; b < boxes && c > 0; b++) { cells[b] = 1; c--; }
    for (let b = 0; b < boxes && c > 0; b++) { cells[b] = 2; c--; }
  } else {
    for (let b = 0; b < boxes && c > 0; b++) { cells[b] = Math.min(2, c); c -= cells[b]; }
  }
  return cells;
}

/** Rang (0 = plus bas) d'un niveau dans la liste triée par énergie. */
function energyRank(energy: number, mos: { energy: number }[]): number {
  const sorted = [...mos].map((m) => m.energy).sort((a, b) => a - b);
  return sorted.indexOf(energy);
}

function formatOrder(x: number): string {
  return Number.isInteger(x) ? String(x) : x.toFixed(1).replace('.', ',');
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-om"]').forEach(init);
