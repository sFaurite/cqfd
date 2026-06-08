import { createScene, line, circle, text, type Scene } from './_canvas';

interface MolSpec {
  center: string; // symbole atome central
  centerVE: number; // e- de valence atome central
  ligands: { sym: string; ve: number; bond: number }[]; // ordre de liaison X-centre
  lpDefault: number; // doublets non liants attendus sur le centre
  expectedOctet: boolean; // l'octet est-il satisfait dans la structure de référence ?
  note: string;
}

const MOLS: Record<string, MolSpec> = {
  H2O: {
    center: 'O', centerVE: 6,
    ligands: [{ sym: 'H', ve: 1, bond: 1 }, { sym: 'H', ve: 1, bond: 1 }],
    lpDefault: 2, expectedOctet: true,
    note: 'Octet respecté : 2 liaisons + 2 doublets non liants.',
  },
  CO2: {
    center: 'C', centerVE: 4,
    ligands: [{ sym: 'O', ve: 6, bond: 2 }, { sym: 'O', ve: 6, bond: 2 }],
    lpDefault: 0, expectedOctet: true,
    note: 'Deux doubles liaisons C=O : octet du carbone respecté, 0 doublet non liant.',
  },
  NH3: {
    center: 'N', centerVE: 5,
    ligands: [{ sym: 'H', ve: 1, bond: 1 }, { sym: 'H', ve: 1, bond: 1 }, { sym: 'H', ve: 1, bond: 1 }],
    lpDefault: 1, expectedOctet: true,
    note: 'Octet respecté : 3 liaisons N–H + 1 doublet non liant.',
  },
  CH4: {
    center: 'C', centerVE: 4,
    ligands: [{ sym: 'H', ve: 1, bond: 1 }, { sym: 'H', ve: 1, bond: 1 }, { sym: 'H', ve: 1, bond: 1 }, { sym: 'H', ve: 1, bond: 1 }],
    lpDefault: 0, expectedOctet: true,
    note: 'Octet respecté : 4 liaisons C–H, aucun doublet non liant.',
  },
  BF3: {
    center: 'B', centerVE: 3,
    ligands: [{ sym: 'F', ve: 7, bond: 1 }, { sym: 'F', ve: 7, bond: 1 }, { sym: 'F', ve: 7, bond: 1 }],
    lpDefault: 0, expectedOctet: false,
    note: 'Hypovalence : le bore n’a qu’un sextet (6 e⁻). L’octet n’est PAS atteint — limite du modèle.',
  },
  SF6: {
    center: 'S', centerVE: 6,
    ligands: [
      { sym: 'F', ve: 7, bond: 1 }, { sym: 'F', ve: 7, bond: 1 }, { sym: 'F', ve: 7, bond: 1 },
      { sym: 'F', ve: 7, bond: 1 }, { sym: 'F', ve: 7, bond: 1 }, { sym: 'F', ve: 7, bond: 1 },
    ],
    lpDefault: 0, expectedOctet: false,
    note: 'Hypervalence : 12 e⁻ autour du soufre. Au-delà de l’octet — autre limite du modèle.',
  },
  NO: {
    center: 'N', centerVE: 5,
    ligands: [{ sym: 'O', ve: 6, bond: 2 }],
    lpDefault: 1, expectedOctet: false,
    note: 'Radical : nombre impair d’électrons, un électron célibataire reste. L’octet ne suffit pas.',
  },
};

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selMol = root.querySelector<HTMLSelectElement>('[data-mol]')!;
  const sLp = root.querySelector<HTMLInputElement>('[data-lp]')!;
  const outLp = root.querySelector<HTMLElement>('[data-out-lp]')!;
  const outVe = root.querySelector<HTMLElement>('[data-out-ve]')!;
  const outOctet = root.querySelector<HTMLElement>('[data-out-octet]')!;
  const outCf = root.querySelector<HTMLElement>('[data-out-cf]')!;
  const outFlag = root.querySelector<HTMLElement>('[data-out-flag]')!;

  let key = selMol.value;
  let lp = +sLp.value;

  const scene = createScene(canvas, draw);

  function spec(): MolSpec { return MOLS[key]; }

  /** Électrons autour du centre = 2·(doublets liants) + 2·(doublets non liants). */
  function centerCount(s: MolSpec): number {
    const bonding = s.ligands.reduce((a, l) => a + l.bond, 0);
    return 2 * bonding + 2 * lp;
  }
  /** Charge formelle du centre = VE − (non liants) − (liants). */
  function centerCF(s: MolSpec): number {
    const bonding = s.ligands.reduce((a, l) => a + l.bond, 0);
    return s.centerVE - 2 * lp - bonding;
  }
  function totalVE(s: MolSpec): number {
    return s.centerVE + s.ligands.reduce((a, l) => a + l.ve, 0);
  }

  function refresh() {
    const s = spec();
    const cc = centerCount(s);
    const ok = cc === 8;
    const cf = centerCF(s);
    outLp.textContent = String(lp);
    outVe.textContent = String(totalVE(s));
    outOctet.textContent = ok ? `✓ (8 e⁻)` : `${cc} e⁻`;
    outCf.textContent = (cf > 0 ? '+' : '') + String(cf);

    // Statut : compare aux doublets attendus et au cas octet.
    const matchesRef = lp === s.lpDefault;
    if (!s.expectedOctet && matchesRef) {
      outFlag.textContent = key === 'NO' ? 'radical (hors-octet, attendu)' : 'hors-octet (attendu pour cette molécule)';
    } else if (s.expectedOctet && matchesRef && ok) {
      outFlag.textContent = 'structure correcte';
    } else if (ok && !matchesRef) {
      outFlag.textContent = 'octet OK mais ≠ structure de référence';
    } else {
      outFlag.textContent = cc < 8 ? 'déficit d’électrons (octet incomplet)' : 'excès d’électrons (octet dépassé)';
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const m = spec();

    const cx = W * 0.5;
    const cy = H * 0.5;
    const R = Math.min(W, H) * 0.3;
    const atomR = Math.min(W, H) * 0.06;

    const n = m.ligands.length;
    // Positions des ligands en cercle, en partant du haut.
    const positions = m.ligands.map((_, i) => {
      const ang = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(n, 1);
      return { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang), ang };
    });

    // Liaisons.
    m.ligands.forEach((lig, i) => {
      const p = positions[i];
      drawBond(ctx, cx, cy, p.x, p.y, atomR, lig.bond, pal.text);
    });

    // Doublets non liants du centre (placés dans les directions libres).
    drawCenterLonePairs(ctx, cx, cy, atomR, positions, lp, pal.blue);

    // Atome central.
    drawAtom(ctx, cx, cy, atomR, m.center, pal, true);

    // Ligands + leurs doublets non liants (simplifié : F/O complètent l'octet).
    m.ligands.forEach((lig, i) => {
      const p = positions[i];
      drawAtom(ctx, p.x, p.y, atomR * 0.86, lig.sym, pal, false);
      const ligLP = ligandLonePairs(lig);
      drawLigandLonePairs(ctx, p.x, p.y, atomR * 0.86, cx, cy, ligLP, pal.blue);
    });

    // Électron célibataire (radical) si compte impair sur le centre.
    const cc = centerCount(m);
    if (cc % 2 === 1 || key === 'NO') {
      // NO : l'électron célibataire sur N
      text(ctx, '•', cx - atomR * 1.1, cy - atomR * 1.1, {
        color: pal.red, size: atomR, weight: 700, align: 'center', baseline: 'middle',
      });
      text(ctx, 'e⁻ célibataire', cx - atomR * 1.4, cy - atomR * 1.7, {
        color: pal.red, size: 11, align: 'center', baseline: 'middle',
      });
    }

    // Bandeau d'état octet.
    const ok = cc === 8;
    const col = ok ? pal.green : pal.red;
    text(ctx, ok ? 'Octet du centre satisfait (8 e⁻)' : `Centre : ${cc} e⁻ (${cc < 8 ? 'hypovalent' : 'hypervalent'})`,
      W * 0.5, H - 16, {
        color: col, size: 13, weight: 700, align: 'center', baseline: 'middle',
      });
  }

  /** Doublets non liants du ligand pour compléter son octet (F:3, O variable). */
  function ligandLonePairs(lig: MolSpec['ligands'][number]): number {
    if (lig.sym === 'H') return 0;
    // octet : 8 = 2*bond + 2*lp -> lp = (8 - 2*bond)/2
    return Math.max(0, (8 - 2 * lig.bond) / 2);
  }

  function drawBond(
    ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number,
    r: number, order: number, col: string,
  ) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const sx = x1 + Math.cos(ang) * r, sy = y1 + Math.sin(ang) * r;
    const ex = x2 - Math.cos(ang) * r, ey = y2 - Math.sin(ang) * r;
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    const gap = 3.2;
    for (let k = 0; k < order; k++) {
      const off = (k - (order - 1) / 2) * gap;
      line(ctx, sx + nx * off, sy + ny * off, ex + nx * off, ey + ny * off, col, 2);
    }
  }

  function drawAtom(
    ctx: CanvasRenderingContext2D, x: number, y: number, r: number, sym: string,
    pal: Scene['pal'], center: boolean,
  ) {
    circle(ctx, x, y, r, pal.bgElev, center ? pal.yellow : pal.border, center ? 2 : 1.4);
    text(ctx, sym, x, y, {
      color: center ? pal.yellow : pal.text, size: r * 1.0, weight: 700,
      align: 'center', baseline: 'middle',
    });
  }

  /** Doublets non liants du centre, répartis dans les secteurs libres. */
  function drawCenterLonePairs(
    ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number,
    positions: { ang: number }[], count: number, col: string,
  ) {
    // angles occupés par les liaisons
    const occupied = positions.map((p) => p.ang);
    // candidats : 8 directions, on prend les plus éloignées des liaisons
    const cand: number[] = [];
    for (let k = 0; k < 8; k++) cand.push((-Math.PI / 2) + (k * Math.PI) / 4);
    cand.sort((a, b) => minAngDist(b, occupied) - minAngDist(a, occupied));
    for (let i = 0; i < count; i++) {
      const a = cand[i % cand.length];
      drawPair(ctx, cx + Math.cos(a) * (r + 9), cy + Math.sin(a) * (r + 9), a, col);
    }
  }

  function drawLigandLonePairs(
    ctx: CanvasRenderingContext2D, x: number, y: number, r: number,
    cx: number, cy: number, count: number, col: string,
  ) {
    const toCenter = Math.atan2(cy - y, cx - x);
    // place les doublets à l'opposé du centre, étalés
    for (let i = 0; i < count; i++) {
      const spread = (i - (count - 1) / 2) * 0.7;
      const a = toCenter + Math.PI + spread;
      drawPair(ctx, x + Math.cos(a) * (r + 7), y + Math.sin(a) * (r + 7), a, col);
    }
  }

  /** Un doublet = deux points perpendiculaires à la direction radiale. */
  function drawPair(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, col: string) {
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    const d = 3.4;
    circle(ctx, x + nx * d, y + ny * d, 1.9, col);
    circle(ctx, x - nx * d, y - ny * d, 1.9, col);
  }

  sLp.addEventListener('input', () => { lp = +sLp.value; refresh(); scene.requestDraw(); });
  selMol.addEventListener('change', () => {
    key = selMol.value;
    lp = MOLS[key].lpDefault;
    sLp.value = String(lp);
    refresh(); scene.requestDraw();
  });

  refresh();
}

/** Distance angulaire minimale de `a` à un ensemble d'angles. */
function minAngDist(a: number, set: number[]): number {
  let m = Infinity;
  for (const s of set) {
    let d = Math.abs(((a - s + Math.PI) % (2 * Math.PI)) - Math.PI);
    if (d < m) m = d;
  }
  return m;
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-lewis"]').forEach(init);
