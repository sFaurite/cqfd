import { createScene, line, text, fmt, prefersReducedMotion, type Scene } from './_canvas';

const ROWS = 8; // lignes de la « liste » (et longueur définie de l'intrus)
const COLS = 12; // chiffres affichés par ligne
const SUB = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈'];
const STEP_MS = 550; // durée d'une étape de l'animation

function randomGrid(): number[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => (Math.random() < 0.5 ? 1 : 0)),
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnNew = root.querySelector<HTMLButtonElement>('[data-new]')!;
  const btnAnim = root.querySelector<HTMLButtonElement>('[data-anim]')!;
  const outIntrus = root.querySelector<HTMLElement>('[data-out-intrus]')!;
  const outDiff = root.querySelector<HTMLElement>('[data-out-diff]')!;

  let grid = randomGrid();
  let hovered = -1; // ligne survolée (-1 : aucune)
  let animK = -1; // case diagonale en cours d'animation (-1 : hors animation)
  let revealed = ROWS; // nb de chiffres de l'intrus dévoilés
  let playing = false;
  let timer = 0;
  // géométrie mémorisée au dernier rendu, pour le clic et le survol
  let geo = { gx: 0, gy: 0, iy: 0, cell: 0 };

  const scene = createScene(canvas, draw);

  const intrusDigit = (i: number) => (grid[i][i] === 0 ? 1 : 0);

  function refresh() {
    let s = '0,';
    for (let i = 0; i < Math.min(revealed, ROWS); i++) s += String(intrusDigit(i));
    outIntrus.textContent = s + '…';
    const k = hovered >= 0 ? hovered : playing ? animK : -1;
    outDiff.textContent =
      k >= 0
        ? `l’intrus diffère de la ligne ${fmt(k + 1, 0)} au rang ${fmt(k + 1, 0)}`
        : 'survolez une ligne de la liste';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // --- géométrie : en-tête des rangs, 8 lignes, espace « inversion », ligne intrus ---
    const labelW = Math.min(64, W * 0.13);
    const padR = 20; // place pour les « … »
    const hdr = 20;
    const gapF = 0.9; // hauteur (en cases) de la zone d'inversion
    const cell = Math.min((W - 8 - labelW - padR) / COLS, (H - hdr - 8) / (ROWS + 1 + gapF));
    const blockW = labelW + COLS * cell + padR;
    const ox = (W - blockW) / 2;
    const oy = Math.max(2, (H - hdr - (ROWS + 1 + gapF) * cell) / 2);
    const gx = ox + labelW;
    const gy = oy + hdr;
    const iy = gy + (ROWS + gapF) * cell; // haut de la ligne « intrus »
    geo = { gx, gy, iy, cell };

    const digitSize = Math.min(18, cell * 0.52);
    const labelSize = Math.min(13, cell * 0.42);
    const rad = Math.min(5, cell * 0.18);
    const activeK = playing ? animK : -1;
    const k = hovered >= 0 ? hovered : activeK; // rang mis en évidence

    // en-tête : numéros de rang
    for (let j = 0; j < COLS; j++) {
      text(ctx, String(j + 1), gx + j * cell + cell / 2, gy - 5, {
        color: j === k ? (hovered >= 0 ? pal.red : pal.green) : pal.muted,
        size: Math.min(10.5, cell * 0.32),
        align: 'center',
        baseline: 'alphabetic',
        weight: j === k ? 700 : 400,
      });
    }

    // --- la liste : 8 lignes de chiffres binaires ---
    for (let i = 0; i < ROWS; i++) {
      const ry = gy + i * cell;
      if (i === hovered) {
        ctx.fillStyle = `color-mix(in srgb, ${pal.blue} 10%, transparent)`;
        ctx.fillRect(ox, ry, blockW, cell);
      }
      text(ctx, `r${SUB[i]} = 0,`, gx - 6, ry + cell / 2, {
        color: i === hovered ? pal.blue : pal.muted,
        size: labelSize,
        align: 'right',
        baseline: 'middle',
        weight: i === hovered ? 700 : 400,
      });
      for (let j = 0; j < COLS; j++) {
        const x = gx + j * cell;
        // pendant l'animation, la diagonale ne s'allume qu'au fur et à mesure
        const diagOn = i === j && (!playing || i <= animK);
        ctx.fillStyle = diagOn ? `color-mix(in srgb, ${pal.yellow} 22%, ${pal.surface})` : pal.surface;
        roundRect(ctx, x + 1, ry + 1, cell - 2, cell - 2, rad);
        ctx.fill();
        ctx.strokeStyle = diagOn ? pal.yellow : pal.border;
        ctx.lineWidth = diagOn ? 1.6 : 1;
        ctx.stroke();
        text(ctx, String(grid[i][j]), x + cell / 2, ry + cell / 2 + 0.5, {
          color: diagOn ? pal.yellow : pal.text,
          size: digitSize,
          align: 'center',
          baseline: 'middle',
          weight: diagOn ? 700 : 500,
        });
      }
      text(ctx, '…', gx + COLS * cell + 4, ry + cell / 2, { color: pal.muted, size: labelSize, baseline: 'middle' });
    }

    // --- zone d'inversion ---
    text(ctx, 'on inverse chaque chiffre de la diagonale : 0 ↔ 1', gx + (COLS * cell) / 2, gy + (ROWS + gapF / 2) * cell, {
      color: pal.muted,
      size: Math.min(11.5, cell * 0.34),
      align: 'center',
      baseline: 'middle',
      italic: true,
    });

    // --- l'intrus ---
    text(ctx, 'd = 0,', gx - 6, iy + cell / 2, {
      color: pal.green,
      size: labelSize,
      align: 'right',
      baseline: 'middle',
      weight: 700,
    });
    for (let j = 0; j < ROWS; j++) {
      const x = gx + j * cell;
      const shown = j < revealed;
      ctx.fillStyle = shown ? `color-mix(in srgb, ${pal.green} 16%, ${pal.surface})` : pal.surface;
      roundRect(ctx, x + 1, iy + 1, cell - 2, cell - 2, rad);
      ctx.fill();
      ctx.strokeStyle = shown ? pal.green : pal.border;
      ctx.lineWidth = shown ? 1.6 : 1;
      ctx.stroke();
      if (shown) {
        text(ctx, String(intrusDigit(j)), x + cell / 2, iy + cell / 2 + 0.5, {
          color: pal.green,
          size: digitSize,
          align: 'center',
          baseline: 'middle',
          weight: 700,
        });
      }
    }
    text(ctx, '…', gx + ROWS * cell + 4, iy + cell / 2, { color: pal.muted, size: labelSize, baseline: 'middle' });

    // --- mise en évidence du rang k : la case (k,k) et le chiffre k de l'intrus diffèrent ---
    if (k >= 0) {
      const c = hovered >= 0 ? pal.red : pal.green;
      const x = gx + k * cell;
      ctx.strokeStyle = c;
      ctx.lineWidth = 2.4;
      roundRect(ctx, x + 0.5, gy + k * cell + 0.5, cell - 1, cell - 1, rad);
      ctx.stroke();
      roundRect(ctx, x + 0.5, iy + 0.5, cell - 1, cell - 1, rad);
      ctx.stroke();
      line(ctx, x + cell / 2, gy + (k + 1) * cell + 2, x + cell / 2, iy - 2, c, 2, [4, 4]);
    }
  }

  /* ---------- animation de la diagonale ---------- */

  function resetAnim() {
    if (timer) window.clearTimeout(timer);
    timer = 0;
    playing = false;
    animK = -1;
    revealed = ROWS;
    btnAnim.classList.remove('active');
    btnAnim.setAttribute('aria-pressed', 'false');
  }

  function stepAnim() {
    animK++;
    if (animK >= ROWS) {
      resetAnim();
    } else {
      revealed = animK + 1;
      timer = window.setTimeout(stepAnim, STEP_MS);
    }
    refresh();
    scene.requestDraw();
  }

  btnAnim.addEventListener('click', () => {
    if (playing) {
      resetAnim();
      refresh();
      scene.requestDraw();
      return;
    }
    if (prefersReducedMotion()) {
      // pas d'animation : l'intrus complet est déjà affiché
      outDiff.textContent = 'animation désactivée (préférence système) — l’intrus complet est affiché';
      return;
    }
    playing = true;
    btnAnim.classList.add('active');
    btnAnim.setAttribute('aria-pressed', 'true');
    animK = -1;
    revealed = 0;
    stepAnim();
  });

  btnNew.addEventListener('click', () => {
    resetAnim();
    grid = randomGrid();
    refresh();
    scene.requestDraw();
  });

  /* ---------- clic (bascule 0↔1) et survol ---------- */

  function cellAt(e: PointerEvent): { i: number; j: number } | null {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const j = Math.floor((mx - geo.gx) / geo.cell);
    const i = Math.floor((my - geo.gy) / geo.cell);
    if (i >= 0 && i < ROWS && j >= 0 && j < COLS) return { i, j };
    return null;
  }

  canvas.addEventListener('pointerdown', (e) => {
    const hit = cellAt(e);
    if (!hit) return;
    grid[hit.i][hit.j] = 1 - grid[hit.i][hit.j];
    refresh();
    scene.requestDraw();
  });

  canvas.addEventListener('pointermove', (e) => {
    const hit = cellAt(e);
    const h = hit ? hit.i : -1;
    canvas.style.cursor = hit ? 'pointer' : 'default';
    if (h !== hovered) {
      hovered = h;
      refresh();
      scene.requestDraw();
    }
  });

  canvas.addEventListener('pointerleave', () => {
    if (hovered !== -1) {
      hovered = -1;
      canvas.style.cursor = 'default';
      refresh();
      scene.requestDraw();
    }
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="cantor-diagonale"]').forEach(init);
