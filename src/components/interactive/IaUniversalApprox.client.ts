import { createScene, line, circle, text, map, fmt, type Scene } from './_canvas';

type Target = 'sin' | 'marche' | 'bosse';

const X0 = -1, X1 = 1;

function targetFn(kind: Target, x: number): number {
  if (kind === 'sin') return 0.7 * Math.sin(Math.PI * x);
  if (kind === 'marche') return x < -0.3 ? -0.6 : x < 0.3 ? 0.2 : 0.7;
  // bosse (gaussienne)
  return Math.exp(-((x) * (x)) / 0.08) - 0.3;
}

const relu = (z: number) => Math.max(0, z);

/** RNG déterministe pour le bruit des données. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Brick { knot: number; slope: number; }

/**
 * Construit N briques ReLU régulièrement espacées dont les pentes sont fixées
 * pour interpoler la cible aux nœuds (somme de rampes = ligne brisée).
 * On résout localement : la pente de la brique k corrige la dérivée seconde
 * discrète de la cible au nœud k. Approche déterministe (pas d'apprentissage),
 * pour rester rapide et lisible.
 */
function buildBricks(kind: Target, N: number): { bricks: Brick[]; bias: number; w0: number } {
  const knots: number[] = [];
  for (let i = 0; i < N; i++) knots.push(map(i, 0, Math.max(1, N - 1), X0 + 0.001, X1 - 0.001));
  const f = (x: number) => targetFn(kind, x);
  // valeur et pente initiale en X0
  const bias = f(X0);
  const h = (X1 - X0) / Math.max(1, N - 1);
  const slope0 = (f(X0 + h) - f(X0)) / h;
  const bricks: Brick[] = [];
  let prevSlope = slope0;
  for (let k = 0; k < N; k++) {
    const xk = knots[k];
    const next = Math.min(X1, xk + h);
    const localSlope = (f(next) - f(xk)) / (next - xk || h);
    const delta = k === 0 ? slope0 : localSlope - prevSlope;
    bricks.push({ knot: xk, slope: delta });
    prevSlope = localSlope;
  }
  return { bricks, bias, w0: slope0 };
}

function approx(bricks: Brick[], bias: number, x: number): number {
  let y = bias;
  for (const b of bricks) y += b.slope * relu(x - b.knot);
  return y;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const nEl = root.querySelector<HTMLInputElement>('[data-n]')!;
  const noiseEl = root.querySelector<HTMLInputElement>('[data-noise]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outN2 = root.querySelector<HTMLElement>('[data-out-n2]')!;
  const outNoise = root.querySelector<HTMLElement>('[data-out-noise]')!;
  const outErr = root.querySelector<HTMLElement>('[data-out-err]')!;
  const outErrD = root.querySelector<HTMLElement>('[data-out-errd]')!;
  const targetBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-target]'));
  const showBtn = root.querySelector<HTMLButtonElement>('[data-show]')!;

  let kind: Target = 'sin';
  let N = +nEl.value;
  let noise = +noiseEl.value;
  let showBricks = true;

  // jeu de données bruité (fixe par graine, régénéré quand le bruit change).
  let dataPts: Array<{ x: number; y: number }> = [];
  function regenData() {
    const rnd = makeRng(424242);
    dataPts = [];
    for (let i = 0; i <= 24; i++) {
      const x = map(i, 0, 24, X0, X1);
      const g = (rnd() - 0.5 + rnd() - 0.5);
      dataPts.push({ x, y: targetFn(kind, x) + g * noise });
    }
  }
  regenData();

  const scene = createScene(canvas, draw);

  function refresh() {
    outN.textContent = String(N);
    outN2.textContent = String(N);
    outNoise.textContent = fmt(noise, 2);
    const { bricks, bias } = buildBricks(kind, N);
    let e = 0, ed = 0;
    for (let i = 0; i <= 100; i++) {
      const x = map(i, 0, 100, X0, X1);
      e += Math.abs(approx(bricks, bias, x) - targetFn(kind, x));
    }
    for (const d of dataPts) ed += Math.abs(approx(bricks, bias, d.x) - d.y);
    outErr.textContent = fmt(e / 101, 3);
    outErrD.textContent = fmt(ed / dataPts.length, 3);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const pad = 30;
    const x0 = pad, x1 = W - pad, y0 = H - pad, y1 = pad;
    const YMIN = -1.1, YMAX = 1.1;
    const toPx = (x: number) => map(x, X0, X1, x0, x1);
    const toPy = (y: number) => map(y, YMIN, YMAX, y0, y1);

    // Axes.
    line(ctx, x0, toPy(0), x1, toPy(0), pal.grid, 1);
    line(ctx, toPx(0), y1, toPx(0), y0, pal.grid, 1);
    text(ctx, 'x', x1 - 4, toPy(0) - 6, { color: pal.muted, size: 11, align: 'right' });
    text(ctx, 'f(x)', toPx(0) + 6, y1 + 10, { color: pal.muted, size: 11 });

    const { bricks, bias } = buildBricks(kind, N);

    // Données (points bruités) si bruit > 0.
    if (noise > 0) {
      for (const d of dataPts) circle(ctx, toPx(d.x), toPy(d.y), 3, pal.muted, undefined);
    }

    // Briques individuelles (faibles).
    if (showBricks) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      for (const b of bricks) {
        ctx.beginPath();
        ctx.strokeStyle = pal.purple;
        ctx.lineWidth = 1;
        let first = true;
        for (let i = 0; i <= 60; i++) {
          const x = map(i, 0, 60, X0, X1);
          const y = bias / bricks.length + b.slope * relu(x - b.knot);
          const X = toPx(x), Y = toPy(y);
          if (first) { ctx.moveTo(X, Y); first = false; } else ctx.lineTo(X, Y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // Cible.
    ctx.beginPath();
    ctx.strokeStyle = pal.muted;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    for (let i = 0; i <= 200; i++) {
      const x = map(i, 0, 200, X0, X1);
      const X = toPx(x), Y = toPy(targetFn(kind, x));
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Approximation.
    ctx.beginPath();
    ctx.strokeStyle = pal.yellow;
    ctx.lineWidth = 2.6;
    for (let i = 0; i <= 400; i++) {
      const x = map(i, 0, 400, X0, X1);
      const X = toPx(x), Y = toPy(approx(bricks, bias, x));
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.stroke();

    // coudes (nœuds des ReLU).
    for (const b of bricks) {
      const X = toPx(b.knot), Y = toPy(approx(bricks, bias, b.knot));
      circle(ctx, X, Y, 3, pal.yellow, pal.bg, 1);
    }

    // Légende.
    text(ctx, '— cible', x0 + 4, y1 + 4, { color: pal.muted, size: 11, weight: 700 });
    text(ctx, '— approximation', x0 + 64, y1 + 4, { color: pal.yellow, size: 11, weight: 700 });
  }

  nEl.addEventListener('input', () => { N = +nEl.value; refresh(); scene.requestDraw(); });
  noiseEl.addEventListener('input', () => { noise = +noiseEl.value; regenData(); refresh(); scene.requestDraw(); });
  targetBtns.forEach((btn) => btn.addEventListener('click', () => {
    kind = btn.dataset.target as Target;
    targetBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    regenData(); refresh(); scene.requestDraw();
  }));
  showBtn.addEventListener('click', () => {
    showBricks = !showBricks;
    showBtn.textContent = showBricks ? 'voir les briques' : 'masquer les briques';
    showBtn.classList.toggle('active', showBricks);
    showBtn.setAttribute('aria-pressed', String(showBricks));
    scene.requestDraw();
  });

  showBtn.setAttribute('aria-pressed', 'true');
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-approx"]').forEach(init);
