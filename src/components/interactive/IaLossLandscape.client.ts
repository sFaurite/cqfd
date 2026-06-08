import { createScene, line, circle, text, clamp, map, fmt, prefersReducedMotion, type Scene } from './_canvas';

type Surf = 'convexe' | 'selle';
type Opt = 'sgd' | 'momentum' | 'adam';

const RANGE = 2.4;

/** Perte selon le paysage choisi. */
function loss(surf: Surf, w: number, b: number): number {
  if (surf === 'convexe') {
    // Bol elliptique légèrement étiré → vallée.
    return 0.5 * (1.6 * w * w + 0.5 * b * b);
  }
  // Point-selle en (0,0) + cuvette décalée pour donner un minimum atteignable.
  return 0.5 * (w * w - b * b) + 0.18 * (w * w * w * w + b * b * b * b) + 0.0 + 1.4;
}

/** Gradient analytique. */
function grad(surf: Surf, w: number, b: number): [number, number] {
  if (surf === 'convexe') return [1.6 * w, 0.5 * b];
  return [w + 0.72 * w * w * w, -b + 0.72 * b * b * b];
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const lrEl = root.querySelector<HTMLInputElement>('[data-lr]')!;
  const outLr = root.querySelector<HTMLElement>('[data-out-lr]')!;
  const outStep = root.querySelector<HTMLElement>('[data-out-step]')!;
  const outLoss = root.querySelector<HTMLElement>('[data-out-loss]')!;
  const outGrad = root.querySelector<HTMLElement>('[data-out-grad]')!;
  const outState = root.querySelector<HTMLElement>('[data-out-state]')!;
  const surfBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-surf]'));
  const optBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-opt]'));
  const runBtn = root.querySelector<HTMLButtonElement>('[data-run]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-reset]')!;

  let surf: Surf = 'convexe';
  let opt: Opt = 'sgd';
  let lr = +lrEl.value;

  let w = -1.7, b = 1.8;
  let vW = 0, vB = 0; // momentum
  let mW = 0, mB = 0, sW = 0, sB = 0, tAdam = 0; // adam
  let trail: Array<[number, number]> = [[w, b]];
  let step = 0;
  let running = false;
  let raf = 0;
  let diverged = false;

  const scene = createScene(canvas, draw);

  function resetOptState() {
    vW = vB = 0; mW = mB = sW = sB = 0; tAdam = 0;
  }
  function reset(keepStart = false) {
    if (!keepStart) { w = -1.7; b = 1.8; }
    trail = [[w, b]];
    step = 0;
    diverged = false;
    resetOptState();
    running = false;
    if (raf) cancelAnimationFrame(raf);
    setState('au repos');
    refresh();
    scene.requestDraw();
  }

  function setState(t: string) { outState.textContent = t; }

  function refresh() {
    outLr.textContent = fmt(lr, 3);
    outStep.textContent = String(step);
    const L = loss(surf, w, b);
    const [gw, gb] = grad(surf, w, b);
    outLoss.textContent = isFinite(L) ? fmt(L) : '∞';
    outGrad.textContent = isFinite(gw) ? fmt(Math.hypot(gw, gb)) : '∞';
  }

  function update() {
    const [gw, gb] = grad(surf, w, b);
    if (opt === 'sgd') {
      w -= lr * gw; b -= lr * gb;
    } else if (opt === 'momentum') {
      const beta = 0.9;
      vW = beta * vW - lr * gw; vB = beta * vB - lr * gb;
      w += vW; b += vB;
    } else {
      const b1 = 0.9, b2 = 0.999, eps = 1e-8;
      tAdam++;
      mW = b1 * mW + (1 - b1) * gw; mB = b1 * mB + (1 - b1) * gb;
      sW = b2 * sW + (1 - b2) * gw * gw; sB = b2 * sB + (1 - b2) * gb * gb;
      const mWh = mW / (1 - Math.pow(b1, tAdam)), mBh = mB / (1 - Math.pow(b1, tAdam));
      const sWh = sW / (1 - Math.pow(b2, tAdam)), sBh = sB / (1 - Math.pow(b2, tAdam));
      // η effectif amplifié pour Adam (pas adaptatif) afin de rester comparable.
      const a = lr * 3;
      w -= (a * mWh) / (Math.sqrt(sWh) + eps);
      b -= (a * mBh) / (Math.sqrt(sBh) + eps);
    }
    step++;
    trail.push([w, b]);
    if (trail.length > 400) trail.shift();

    const gn = Math.hypot(gw, gb);
    if (!isFinite(w) || !isFinite(b) || Math.abs(w) > 8 || Math.abs(b) > 8) {
      diverged = true; running = false; setState('diverge ✗');
    } else if (gn < 1e-3) {
      running = false; setState('convergé ✓');
    }
  }

  function loop() {
    if (!running) return;
    for (let k = 0; k < 1; k++) { if (running) update(); }
    refresh();
    scene.requestDraw();
    if (running) raf = requestAnimationFrame(loop);
  }

  function start() {
    if (diverged) reset(false);
    running = true;
    setState('descente…');
    if (prefersReducedMotion()) {
      // Sans animation : on déroule un nombre fixe de pas d'un coup.
      for (let k = 0; k < 120 && running; k++) update();
      running = false;
      if (!diverged && outState.textContent === 'descente…') setState('terminé');
      refresh(); scene.requestDraw();
    } else {
      raf = requestAnimationFrame(loop);
    }
  }

  // ---- carte de niveaux ----
  function lossRange(): [number, number] {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= 24; i++) for (let j = 0; j <= 24; j++) {
      const L = loss(surf, map(i, 0, 24, -RANGE, RANGE), map(j, 0, 24, -RANGE, RANGE));
      if (isFinite(L)) { lo = Math.min(lo, L); hi = Math.max(hi, L); }
    }
    return [lo, hi];
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const pad = 16;
    const x0 = pad, x1 = W - pad, y0 = H - pad, y1 = pad;
    const toPx = (x: number) => map(x, -RANGE, RANGE, x0, x1);
    const toPy = (y: number) => map(y, -RANGE, RANGE, y1, y0);

    const [lo, hi] = lossRange();
    const span = hi - lo || 1;

    // Champ de niveaux (heatmap).
    const step2 = 8;
    for (let px = x0; px < x1; px += step2) {
      for (let py = y1; py < y0; py += step2) {
        const dw = map(px, x0, x1, -RANGE, RANGE);
        const db = map(py, y1, y0, RANGE, -RANGE);
        const L = loss(surf, dw, db);
        const t = clamp((L - lo) / span, 0, 1);
        // bas = bleu foncé, haut = teinte chaude.
        const c = t < 0.5 ? pal.blue : pal.red;
        ctx.fillStyle = c;
        ctx.globalAlpha = t < 0.5 ? 0.08 + 0.22 * (1 - t * 2) : 0.06 + 0.2 * (t - 0.5) * 2;
        ctx.fillRect(px, py, step2, step2);
      }
    }
    ctx.globalAlpha = 1;

    // Lignes de niveau (iso-contours par seuils).
    const levels = 7;
    for (let li = 1; li <= levels; li++) {
      const target = lo + (span * li) / (levels + 1);
      drawContour(s, target, toPx, toPy, pal.border);
    }

    // Trajectoire.
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = pal.yellow;
      ctx.lineWidth = 2;
      trail.forEach(([tw, tb], i) => {
        const X = toPx(tw), Y = toPy(tb);
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      });
      ctx.stroke();
    }

    // Bille.
    const bx = toPx(clamp(w, -RANGE, RANGE)), by = toPy(clamp(b, -RANGE, RANGE));
    circle(ctx, bx, by, 7, diverged ? pal.red : pal.yellow, pal.text, 2);

    // Axes / étiquettes.
    line(ctx, toPx(0), y1, toPx(0), y0, pal.grid, 1);
    line(ctx, x0, toPy(0), x1, toPy(0), pal.grid, 1);
    text(ctx, 'w', x1 - 4, toPy(0) - 6, { color: pal.muted, size: 12, align: 'right', weight: 700 });
    text(ctx, 'b', toPx(0) + 6, y1 + 12, { color: pal.muted, size: 12, weight: 700 });
  }

  /** Trace un iso-contour de la perte par marching squares grossier. */
  function drawContour(
    s: Scene, target: number,
    toPx: (x: number) => number, toPy: (y: number) => number, color: string,
  ) {
    const { ctx } = s;
    const N = 40;
    const f = (i: number, j: number) =>
      loss(surf, map(i, 0, N, -RANGE, RANGE), map(j, 0, N, -RANGE, RANGE)) - target;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const a = f(i, j), bb = f(i + 1, j), c = f(i + 1, j + 1), d = f(i, j + 1);
        const xa = map(i, 0, N, -RANGE, RANGE), xb = map(i + 1, 0, N, -RANGE, RANGE);
        const ya = map(j, 0, N, -RANGE, RANGE), yb = map(j + 1, 0, N, -RANGE, RANGE);
        const pts: Array<[number, number]> = [];
        const interp = (v1: number, v2: number, p1: number, p2: number) =>
          p1 + ((p2 - p1) * (0 - v1)) / (v2 - v1);
        if ((a < 0) !== (bb < 0)) pts.push([interp(a, bb, xa, xb), ya]);
        if ((bb < 0) !== (c < 0)) pts.push([xb, interp(bb, c, ya, yb)]);
        if ((c < 0) !== (d < 0)) pts.push([interp(d, c, xa, xb), yb]);
        if ((d < 0) !== (a < 0)) pts.push([xa, interp(a, d, ya, yb)]);
        if (pts.length >= 2) {
          ctx.moveTo(toPx(pts[0][0]), toPy(pts[0][1]));
          ctx.lineTo(toPx(pts[1][0]), toPy(pts[1][1]));
        }
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  // Clic = repositionner le départ.
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const pad = 16;
    const dw = map(e.clientX - rect.left, pad, rect.width - pad, -RANGE, RANGE);
    const db = map(e.clientY - rect.top, pad, rect.height - pad, RANGE, -RANGE);
    w = clamp(dw, -RANGE, RANGE); b = clamp(db, -RANGE, RANGE);
    reset(true);
  });

  lrEl.addEventListener('input', () => { lr = +lrEl.value; refresh(); });
  runBtn.addEventListener('click', () => { if (running) { running = false; setState('en pause'); } else start(); });
  resetBtn.addEventListener('click', () => reset(false));

  surfBtns.forEach((btn) => btn.addEventListener('click', () => {
    surf = btn.dataset.surf as Surf;
    surfBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    if (surf === 'selle') { w = -0.05; b = 0.05; } else { w = -1.7; b = 1.8; }
    reset(true);
  }));
  optBtns.forEach((btn) => btn.addEventListener('click', () => {
    opt = btn.dataset.opt as Opt;
    optBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    reset(true);
  }));

  reset(false);
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-loss"]').forEach(init);
