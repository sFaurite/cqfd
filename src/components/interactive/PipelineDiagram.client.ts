import { createScene, line, text, clamp, fmt, type Scene } from './_canvas';

/** Un étage du pipeline (couleur et libellé). */
interface Stage {
  name: string;
  color: (p: Scene['pal']) => string;
}

const STAGES: Stage[] = [
  { name: 'IF', color: (p) => p.blue },
  { name: 'ID', color: (p) => p.teal },
  { name: 'EX', color: (p) => p.green },
  { name: 'MEM', color: (p) => p.yellow },
  { name: 'WB', color: (p) => p.purple },
];

const NSTAGES = STAGES.length; // 5

/** Petit helper rectangle arrondi local. */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Couleur de la charte (#hex) avec transparence. */
function withAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '').trim();
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(a, 0, 1)})`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sn = root.querySelector<HTMLInputElement>('[data-n]')!;
  const pipe = root.querySelector<HTMLInputElement>('[data-pipe]')!;
  const btnHazard = root.querySelector<HTMLButtonElement>('[data-hazard]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outPipe = root.querySelector<HTMLElement>('[data-out-pipe]')!;
  const outHazard = root.querySelector<HTMLElement>('[data-out-hazard]')!;
  const outCycles = root.querySelector<HTMLElement>('[data-out-cycles]')!;
  const outSpeedup = root.querySelector<HTMLElement>('[data-out-speedup]')!;

  let n = parseInt(sn.value, 10);
  let pipelined = pipe.checked;
  // Pour chaque instruction, nombre de cycles de bulle (stall) qui précèdent son étage EX.
  // En mode pipeline, une bulle décale l'instruction et toutes les suivantes.
  let stalls: number[] = new Array<number>(6).fill(0);

  const scene = createScene(canvas, draw);

  /**
   * Calcule, pour chaque instruction i, le cycle de départ (de l'étage IF).
   * - séquentiel : départ = i * NSTAGES (aucun recouvrement).
   * - pipeline : départ = i + (somme cumulée des bulles des instructions ≤ i).
   * Les bulles ne s'appliquent qu'au mode pipeline (en séquentiel, tout est déjà décalé).
   */
  function starts(): number[] {
    const s: number[] = [];
    if (!pipelined) {
      for (let i = 0; i < n; i++) s.push(i * NSTAGES);
      return s;
    }
    let cumStall = 0;
    for (let i = 0; i < n; i++) {
      cumStall += stalls[i];
      s.push(i + cumStall);
    }
    return s;
  }

  /** Nombre total de cycles pour exécuter les n instructions dans le mode courant. */
  function totalCycles(): number {
    if (n === 0) return 0;
    const s = starts();
    let end = 0;
    for (let i = 0; i < n; i++) {
      // l'instruction i occupe NSTAGES étages à partir de son départ ;
      // les bulles ajoutent des cycles d'attente avant l'étage EX (3e étage).
      const stallExtra = pipelined ? stalls[i] : 0;
      end = Math.max(end, s[i] + NSTAGES + stallExtra);
    }
    return end;
  }

  /** Cycles en mode séquentiel pur (référence pour l'accélération). */
  function sequentialCycles(): number {
    return n * NSTAGES;
  }

  function refresh() {
    outN.textContent = String(n);
    outPipe.textContent = pipelined ? 'oui' : 'non (séquentiel)';
    const totalStalls = stalls.slice(0, n).reduce((a, b) => a + b, 0);
    outHazard.textContent = pipelined ? String(totalStalls) : '— (séquentiel)';

    const cyc = totalCycles();
    const ref = sequentialCycles();
    outCycles.textContent = `${cyc} cycle${cyc > 1 ? 's' : ''}`;
    const speedup = cyc > 0 ? ref / cyc : 1;
    outSpeedup.textContent = `×${fmt(speedup, 2)}`;
    outSpeedup.style.color = pipelined && speedup > 1 ? 'var(--c-green)' : 'var(--c-muted)';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const st = starts();
    const total = Math.max(totalCycles(), 1);

    // Marges de la grille.
    const padL = 0.13 * W; // place pour les libellés d'instructions
    const padR = 0.03 * W;
    const padT = 0.10 * H; // ligne des numéros de cycles
    const padB = 0.16 * H; // légende des étages
    const gridX = padL;
    const gridY = padT;
    const gridW = W - padL - padR;
    const gridH = H - padT - padB;

    const rows = Math.max(n, 1);
    const cols = total;
    const cellW = gridW / cols;
    const rowH = gridH / rows;
    const cellPad = clamp(rowH * 0.10, 2, 5);

    // --- Titre du mode (coin supérieur droit) ---
    text(
      ctx,
      pipelined ? 'mode pipeline (recouvrement)' : 'mode séquentiel (sans recouvrement)',
      W - padR,
      gridY - 0.045 * H,
      { color: pipelined ? pal.green : pal.muted, size: 12, align: 'right', weight: 700 },
    );
    text(ctx, 'cycles d’horloge →', gridX, gridY - 0.045 * H, {
      color: pal.muted, size: 11, align: 'left',
    });

    // --- Numéros de cycle + lignes verticales de la grille ---
    for (let c = 0; c <= cols; c++) {
      const x = gridX + c * cellW;
      line(ctx, x, gridY, x, gridY + gridH, pal.grid, 1);
      if (c < cols) {
        text(ctx, String(c + 1), x + cellW / 2, gridY - 6, {
          color: pal.muted, size: clamp(cellW * 0.5, 9, 13), align: 'center',
        });
      }
    }

    // --- Lignes des instructions + libellés ---
    for (let r = 0; r <= rows; r++) {
      const y = gridY + r * rowH;
      line(ctx, gridX, y, gridX + gridW, y, pal.grid, 1);
    }
    for (let i = 0; i < n; i++) {
      const y = gridY + i * rowH;
      text(ctx, `I${i + 1}`, gridX - 12, y + rowH / 2, {
        color: pal.text, size: clamp(rowH * 0.34, 11, 16), align: 'right', baseline: 'middle', weight: 800,
      });
    }

    // --- Cellules : un étage par cycle ---
    for (let i = 0; i < n; i++) {
      const y = gridY + i * rowH;
      const stallExtra = pipelined ? stalls[i] : 0;
      // Séquence des « activités » de l'instruction i : IF, ID, [bulles], EX, MEM, WB.
      // En séquentiel, pas de bulle ; la séquence est simplement les 5 étages.
      let col = st[i]; // cycle courant (colonne de la grille)
      for (let stage = 0; stage < NSTAGES; stage++) {
        // Insère les bulles juste avant l'étage EX (index 2) en mode pipeline.
        if (pipelined && stage === 2) {
          for (let b = 0; b < stallExtra; b++) {
            drawBubble(ctx, gridX + col * cellW, y, cellW, rowH, cellPad, pal);
            col++;
          }
        }
        drawStageCell(ctx, gridX + col * cellW, y, cellW, rowH, cellPad, STAGES[stage], pal);
        col++;
      }
    }

    // --- Légende des étages (en bas) ---
    const legY = gridY + gridH + 0.06 * H;
    const swatch = clamp(0.022 * W, 12, 20);
    const labels = STAGES.map((sg) => sg.name);
    // largeur estimée par entrée pour répartir la légende
    ctx.save();
    ctx.font = `700 ${clamp(0.018 * W, 11, 14)}px Inter, system-ui, sans-serif`;
    const entryW = labels.map((l) => swatch + 8 + ctx.measureText(l).width + 18);
    const legTotal = entryW.reduce((a, b) => a + b, 0);
    let lx = gridX + Math.max(0, (gridW - legTotal) / 2);
    for (let k = 0; k < STAGES.length; k++) {
      const sg = STAGES[k];
      const c = sg.color(pal);
      roundRect(ctx, lx, legY - swatch / 2, swatch, swatch, 4);
      ctx.fillStyle = withAlpha(c, 0.85);
      ctx.fill();
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      text(ctx, sg.name, lx + swatch + 6, legY, {
        color: pal.text, size: clamp(0.018 * W, 11, 14), align: 'left', baseline: 'middle', weight: 700,
      });
      lx += entryW[k];
    }
    ctx.restore();

    // --- Repère vertical de fin (cycles totaux) ---
    const endX = gridX + total * cellW;
    line(ctx, endX, gridY - 2, endX, gridY + gridH, pal.text, 1.6, [4, 4]);
    text(ctx, `${total} cyc.`, endX - 4, gridY + gridH + 0.018 * H, {
      color: pal.text, size: clamp(0.018 * W, 10, 13), align: 'right', weight: 700,
    });
  }

  function drawStageCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellW: number,
    rowH: number,
    pad: number,
    stage: Stage,
    pal: Scene['pal'],
  ) {
    const c = stage.color(pal);
    roundRect(ctx, x + pad, y + pad, cellW - 2 * pad, rowH - 2 * pad, clamp(rowH * 0.12, 3, 7));
    ctx.fillStyle = withAlpha(c, 0.85);
    ctx.fill();
    ctx.strokeStyle = c;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    const fs = clamp(Math.min(cellW * 0.42, rowH * 0.40), 8, 15);
    text(ctx, stage.name, x + cellW / 2, y + rowH / 2, {
      color: pal.bg, size: fs, align: 'center', baseline: 'middle', weight: 800,
    });
  }

  function drawBubble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellW: number,
    rowH: number,
    pad: number,
    pal: Scene['pal'],
  ) {
    roundRect(ctx, x + pad, y + pad, cellW - 2 * pad, rowH - 2 * pad, clamp(rowH * 0.12, 3, 7));
    ctx.save();
    ctx.fillStyle = withAlpha(pal.red, 0.16);
    ctx.fill();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = pal.red;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();
    const fs = clamp(Math.min(cellW * 0.42, rowH * 0.40), 8, 15);
    text(ctx, 'bulle', x + cellW / 2, y + rowH / 2, {
      color: pal.red, size: clamp(fs * 0.85, 7, 12), align: 'center', baseline: 'middle', weight: 700,
    });
  }

  sn.addEventListener('input', () => {
    n = clamp(parseInt(sn.value, 10), 1, 6);
    refresh();
    scene.requestDraw();
  });

  pipe.addEventListener('change', () => {
    pipelined = pipe.checked;
    refresh();
    scene.requestDraw();
  });

  btnHazard.addEventListener('click', () => {
    if (!pipelined) return; // une bulle n'a de sens qu'avec recouvrement
    // Cherche une instruction (au-delà de la première) où ajouter une bulle, en
    // tournant pour répartir les stalls ; chaque instruction est limitée à 2 bulles.
    let added = false;
    for (let i = 1; i < n; i++) {
      if (stalls[i] < 2) {
        stalls[i]++;
        added = true;
        break;
      }
    }
    if (!added) {
      // Tout est saturé : on réinitialise pour permettre une nouvelle démonstration.
      stalls = new Array<number>(6).fill(0);
    }
    refresh();
    scene.requestDraw();
  });

  refresh();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="pipeline-diagram"]').forEach(init);
