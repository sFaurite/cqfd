import { createScene, line, circle, text, type Scene } from './_canvas';

type Gate = 'ET' | 'OU' | 'NON' | 'NAND' | 'NOR' | 'XOR';

/** Indique si la porte n'a qu'une seule entrée (NON). */
function isUnary(g: Gate): boolean {
  return g === 'NON';
}

/** Calcule la sortie binaire d'une porte pour des entrées 0/1. */
function evalGate(g: Gate, a: number, b: number): number {
  switch (g) {
    case 'ET':
      return a & b;
    case 'OU':
      return a | b;
    case 'NON':
      return a ? 0 : 1;
    case 'NAND':
      return a & b ? 0 : 1;
    case 'NOR':
      return a | b ? 0 : 1;
    case 'XOR':
      return a ^ b;
  }
}

/** Lignes (A,B) de la table de vérité (B ignoré pour NON). */
function truthRows(g: Gate): Array<[number, number]> {
  if (isUnary(g)) return [[0, 0], [1, 0]];
  return [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selGate = root.querySelector<HTMLSelectElement>('[data-gate]')!;
  const inA = root.querySelector<HTMLInputElement>('[data-a]')!;
  const inB = root.querySelector<HTMLInputElement>('[data-b]')!;
  const outsA = root.querySelectorAll<HTMLElement>('[data-out-a]');
  const outsB = root.querySelectorAll<HTMLElement>('[data-out-b]');
  const outS = root.querySelector<HTMLElement>('[data-out-s]')!;

  let gate = selGate.value as Gate;
  let a = inA.checked ? 1 : 0;
  let b = inB.checked ? 1 : 0;

  const scene = createScene(canvas, draw);

  function refresh() {
    // Désactive B quand la porte est unaire (NON).
    inB.disabled = isUnary(gate);
    const bEff = isUnary(gate) ? 0 : b;
    const s = evalGate(gate, a, bEff);
    outsA.forEach((el) => (el.textContent = String(a)));
    outsB.forEach((el) => (el.textContent = isUnary(gate) ? '–' : String(bEff)));
    outS.textContent = String(s);
  }

  /** Couleur d'un fil selon sa valeur logique. */
  function wireColor(s: Scene, v: number): string {
    return v === 1 ? s.pal.teal : s.pal.muted;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const unary = isUnary(gate);
    const bEff = unary ? 0 : b;
    const out = evalGate(gate, a, bEff);

    // Disposition : symbole à gauche, table de vérité à droite.
    const leftW = W * 0.6;
    const cx = leftW * 0.52; // centre horizontal du corps de la porte
    const cy = H * 0.5;
    const bodyH = Math.min(H * 0.46, leftW * 0.42);
    const bodyW = bodyH * 1.15;
    const left = cx - bodyW / 2;
    const right = cx + bodyW / 2;
    const top = cy - bodyH / 2;
    const bot = cy + bodyH / 2;
    const aw = Math.max(2.6, bodyH * 0.05); // épaisseur des fils

    // Positions verticales des entrées.
    const inAY = unary ? cy : cy - bodyH * 0.28;
    const inBY = cy + bodyH * 0.28;
    const startX = left - bodyW * 0.7;

    const cA = wireColor(s, a);
    const cB = wireColor(s, bEff);
    const cOut = wireColor(s, out);

    // Point de jonction de la sortie (au-delà de l'éventuelle bulle).
    const hasOutBubble = gate === 'NAND' || gate === 'NOR' || gate === 'NON';
    const bubbleR = bodyH * 0.07;
    const outTipX = (() => {
      if (gate === 'OU' || gate === 'NOR' || gate === 'XOR') return right + bodyW * 0.32;
      if (gate === 'NON' || gate === 'NAND') return right + (hasOutBubble ? bubbleR * 2 : 0);
      return right;
    })();
    const outEndX = (hasOutBubble ? outTipX + bubbleR * 2 : outTipX) + bodyW * 0.7;

    // --- Fils d'entrée ---
    line(ctx, startX, inAY, left + (unary ? bodyW * 0.18 : 0), inAY, cA, aw);
    if (!unary) line(ctx, startX, inBY, left, inBY, cB, aw);

    // --- Corps de la porte ---
    ctx.lineWidth = aw;
    ctx.strokeStyle = pal.text;
    ctx.fillStyle = pal.surface;
    ctx.lineJoin = 'round';

    if (gate === 'ET' || gate === 'NAND') {
      // ET : côté gauche droit, côté droit en demi-cercle.
      const flat = right - bodyH / 2;
      ctx.beginPath();
      ctx.moveTo(left, bot);
      ctx.lineTo(left, top);
      ctx.lineTo(flat, top);
      ctx.arc(flat, cy, bodyH / 2, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(left, bot);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (gate === 'OU' || gate === 'NOR' || gate === 'XOR') {
      // OU : arc concave en entrée, deux flancs convexes se rejoignant en pointe.
      const tipX = right + bodyW * 0.32;
      const backCtrl = left + bodyW * 0.28; // contrôle de l'arc d'entrée (concave)
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.quadraticCurveTo(left + bodyW * 0.55, top + bodyH * 0.04, tipX, cy);
      ctx.quadraticCurveTo(left + bodyW * 0.55, bot - bodyH * 0.04, left, bot);
      ctx.quadraticCurveTo(backCtrl, cy, left, top);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // XOR : double arc d'entrée.
      if (gate === 'XOR') {
        ctx.beginPath();
        ctx.strokeStyle = pal.text;
        ctx.moveTo(left - bodyW * 0.12, top);
        ctx.quadraticCurveTo(backCtrl - bodyW * 0.12, cy, left - bodyW * 0.12, bot);
        ctx.stroke();
      }
    } else {
      // NON : triangle pointant vers la droite.
      const tipX = right;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(tipX, cy);
      ctx.lineTo(left, bot);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // --- Bulle de sortie (inversion) ---
    if (hasOutBubble) {
      let bx: number;
      if (gate === 'NOR') bx = right + bodyW * 0.32 + bubbleR;
      else bx = right + bubbleR;
      circle(ctx, bx, cy, bubbleR, pal.surface, pal.text, aw);
    }

    // --- Fil de sortie ---
    line(ctx, outTipX, cy, outEndX, cy, cOut, aw);

    // --- Étiquettes des fils ---
    const lbl = bodyH * 0.18;
    text(ctx, 'A', startX - 6, inAY, {
      color: cA,
      size: lbl,
      weight: 700,
      align: 'right',
      baseline: 'middle',
    });
    if (!unary) {
      text(ctx, 'B', startX - 6, inBY, {
        color: cB,
        size: lbl,
        weight: 700,
        align: 'right',
        baseline: 'middle',
      });
    }
    text(ctx, 'S', outEndX + 6, cy, {
      color: cOut,
      size: lbl,
      weight: 700,
      align: 'left',
      baseline: 'middle',
    });
    // Valeurs binaires sur les fils.
    text(ctx, String(a), startX + 8, inAY - lbl * 0.55, {
      color: cA,
      size: lbl * 0.78,
      weight: 700,
      baseline: 'middle',
    });
    if (!unary) {
      text(ctx, String(bEff), startX + 8, inBY - lbl * 0.55, {
        color: cB,
        size: lbl * 0.78,
        weight: 700,
        baseline: 'middle',
      });
    }
    text(ctx, String(out), outEndX - lbl, cy - lbl * 0.55, {
      color: cOut,
      size: lbl * 0.78,
      weight: 700,
      align: 'right',
      baseline: 'middle',
    });

    // Nom de la porte sous le symbole.
    text(ctx, `Porte ${gate}`, cx, bot + bodyH * 0.42, {
      color: pal.text,
      size: bodyH * 0.16,
      weight: 700,
      align: 'center',
      baseline: 'middle',
    });

    // --- Table de vérité ---
    drawTruthTable(s, leftW);
  }

  function drawTruthTable(s: Scene, leftW: number) {
    const { ctx, width: W, height: H, pal } = s;
    const unary = isUnary(gate);
    const rows = truthRows(gate);
    const cols = unary ? ['A', 'S'] : ['A', 'B', 'S'];

    const tx = leftW + (W - leftW) * 0.06;
    const tw = (W - leftW) * 0.82;
    const headH = Math.min(34, H * 0.13);
    const rowH = Math.min(34, (H * 0.7) / (rows.length + 1));
    const tableH = headH + rowH * rows.length;
    const ty = (H - tableH) / 2;
    const colW = tw / cols.length;
    const fs = Math.min(rowH * 0.5, 16);

    text(ctx, 'Table de vérité', tx, ty - rowH * 0.4, {
      color: pal.muted,
      size: Math.min(fs, 14),
      weight: 700,
      baseline: 'alphabetic',
    });

    const bEff = unary ? 0 : b;

    // En-têtes.
    cols.forEach((c, i) => {
      const isOut = c === 'S';
      text(ctx, c, tx + colW * (i + 0.5), ty + headH * 0.5, {
        color: isOut ? pal.yellow : pal.text,
        size: fs * 1.05,
        weight: 700,
        align: 'center',
        baseline: 'middle',
      });
    });
    line(ctx, tx, ty + headH, tx + tw, ty + headH, pal.border, 1.5);

    // Lignes.
    rows.forEach((r, ri) => {
      const [ra, rb] = r;
      const rs = evalGate(gate, ra, rb);
      const yTop = ty + headH + rowH * ri;
      const yMid = yTop + rowH / 2;
      const current = ra === a && (unary || rb === bEff);

      if (current) {
        ctx.save();
        ctx.fillStyle = pal.teal;
        ctx.globalAlpha = 0.16;
        ctx.fillRect(tx, yTop, tw, rowH);
        ctx.restore();
        ctx.strokeStyle = pal.teal;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tx, yTop, tw, rowH);
      }

      const vals = unary ? [ra, rs] : [ra, rb, rs];
      vals.forEach((v, ci) => {
        const isOut = cols[ci] === 'S';
        const col = current
          ? v === 1
            ? pal.teal
            : pal.text
          : isOut
            ? pal.yellow
            : pal.muted;
        text(ctx, String(v), tx + colW * (ci + 0.5), yMid, {
          color: col,
          size: fs,
          weight: current ? 700 : 500,
          align: 'center',
          baseline: 'middle',
        });
      });
    });

    // Cadre extérieur.
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tx, ty, tw, tableH);
    cols.forEach((_, i) => {
      if (i === 0) return;
      line(ctx, tx + colW * i, ty, tx + colW * i, ty + tableH, pal.border, 1);
    });
  }

  selGate.addEventListener('change', () => {
    gate = selGate.value as Gate;
    refresh();
    scene.requestDraw();
  });
  inA.addEventListener('change', () => {
    a = inA.checked ? 1 : 0;
    refresh();
    scene.requestDraw();
  });
  inB.addEventListener('change', () => {
    b = inB.checked ? 1 : 0;
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="logic-gate"]').forEach(init);
