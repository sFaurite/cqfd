import { createScene, line, circle, text, clamp, map, fmt, type Scene } from './_canvas';

type Act = 'seuil' | 'sigmoide';

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/** Nuage de points à deux classes, généré une fois (graine fixe). */
function makeCloud(): Array<{ x: number; y: number; cls: 0 | 1 }> {
  // Générateur pseudo-aléatoire déterministe (mulberry32).
  let s = 0x9e3779b9 >>> 0;
  const rnd = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const gauss = () => {
    let u = 0, v = 0;
    while (u === 0) u = rnd();
    while (v === 0) v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const pts: Array<{ x: number; y: number; cls: 0 | 1 }> = [];
  for (let i = 0; i < 28; i++) {
    pts.push({ x: -1.1 + gauss() * 0.55, y: -0.8 + gauss() * 0.55, cls: 0 });
    pts.push({ x: 1.0 + gauss() * 0.55, y: 0.9 + gauss() * 0.55, cls: 1 });
  }
  return pts;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const w1El = root.querySelector<HTMLInputElement>('[data-w1]')!;
  const w2El = root.querySelector<HTMLInputElement>('[data-w2]')!;
  const bEl = root.querySelector<HTMLInputElement>('[data-b]')!;
  const outW1 = root.querySelector<HTMLElement>('[data-out-w1]')!;
  const outW2 = root.querySelector<HTMLElement>('[data-out-w2]')!;
  const outB = root.querySelector<HTMLElement>('[data-out-b]')!;
  const outAcc = root.querySelector<HTMLElement>('[data-out-acc]')!;
  const outSig = root.querySelector<HTMLElement>('[data-out-sig]')!;
  const actBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-act]'));

  const cloud = makeCloud();
  let w1 = +w1El.value, w2 = +w2El.value, b = +bEl.value;
  let act: Act = 'seuil';
  let hover: { x: number; y: number } | null = null;

  const RANGE = 2.4; // demi-étendue des coordonnées du domaine

  const scene = createScene(canvas, draw);

  function activation(z: number): number {
    return act === 'seuil' ? (z >= 0 ? 1 : 0) : sigmoid(z);
  }

  function refresh() {
    outW1.textContent = fmt(w1);
    outW2.textContent = fmt(w2);
    outB.textContent = fmt(b);
    let ok = 0;
    for (const p of cloud) {
      const z = w1 * p.x + w2 * p.y + b;
      const pred = z >= 0 ? 1 : 0;
      if (pred === p.cls) ok++;
    }
    outAcc.textContent = `${ok}/${cloud.length}`;
    if (hover) {
      const z = w1 * hover.x + w2 * hover.y + b;
      outSig.textContent = fmt(sigmoid(z));
    } else {
      outSig.textContent = '—';
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const pad = 18;
    const plotW = W * 0.66;
    const x0 = pad, x1 = plotW - pad, y0 = H - pad, y1 = pad;
    const toPx = (x: number) => map(x, -RANGE, RANGE, x0, x1);
    const toPy = (y: number) => map(y, -RANGE, RANGE, y0, y1);

    // Fond : zones de décision (teinte selon la sortie de l'activation).
    const step = 9;
    for (let px = x0; px < x1; px += step) {
      for (let py = y1; py < y0; py += step) {
        const dx = map(px, x0, x1, -RANGE, RANGE);
        const dy = map(py, y0, y1, -RANGE, RANGE);
        const z = w1 * dx + w2 * dy + b;
        const a = activation(z);
        const col = a >= 0.5 ? pal.blue : pal.red;
        ctx.fillStyle = col;
        ctx.globalAlpha = act === 'seuil' ? 0.1 : 0.05 + 0.16 * Math.abs(a - 0.5) * 2;
        ctx.fillRect(px, py, step, step);
      }
    }
    ctx.globalAlpha = 1;

    // Axes.
    line(ctx, toPx(-RANGE), toPy(0), toPx(RANGE), toPy(0), pal.grid, 1);
    line(ctx, toPx(0), toPy(-RANGE), toPx(0), toPy(RANGE), pal.grid, 1);

    // Droite séparatrice w1·x + w2·y + b = 0.
    const samples: Array<[number, number]> = [];
    if (Math.abs(w2) > 1e-4) {
      for (const x of [-RANGE, RANGE]) samples.push([x, -(w1 * x + b) / w2]);
    } else if (Math.abs(w1) > 1e-4) {
      for (const y of [-RANGE, RANGE]) samples.push([-(w2 * y + b) / w1, y]);
    }
    if (samples.length === 2) {
      line(ctx, toPx(samples[0][0]), toPy(samples[0][1]), toPx(samples[1][0]), toPy(samples[1][1]), pal.yellow, 2.6);
      // Flèche du vecteur de poids (normale) au milieu de la droite.
      const mx = (samples[0][0] + samples[1][0]) / 2;
      const my = (samples[0][1] + samples[1][1]) / 2;
      const n = Math.hypot(w1, w2) || 1;
      const len = 0.7;
      line(ctx, toPx(mx), toPy(my), toPx(mx + (w1 / n) * len), toPy(my + (w2 / n) * len), pal.teal, 2);
    }

    // Points du nuage.
    for (const p of cloud) {
      const z = w1 * p.x + w2 * p.y + b;
      const pred = z >= 0 ? 1 : 0;
      const ok = pred === p.cls;
      const base = p.cls === 1 ? pal.blue : pal.red;
      circle(ctx, toPx(p.x), toPy(p.y), 5, base, ok ? pal.text : pal.yellow, ok ? 1 : 2);
    }

    // Point survolé + barre de sortie.
    if (hover) {
      const z = w1 * hover.x + w2 * hover.y + b;
      const a = sigmoid(z);
      const hx = toPx(hover.x), hy = toPy(hover.y);
      circle(ctx, hx, hy, 7, undefined, pal.yellow, 2);
      text(ctx, `σ=${fmt(a)}`, hx + 10, hy - 8, { color: pal.yellow, size: 12, weight: 700 });
    }

    // Étiquette de la droite.
    text(ctx, 'w·x + b = 0', x1 - 6, y1 + 14, { color: pal.yellow, size: 12, weight: 700, align: 'right' });

    // Panneau de droite : équation + courbe d'activation.
    drawSidePanel(s, plotW);
  }

  function drawSidePanel(s: Scene, plotW: number) {
    const { ctx, width: W, height: H, pal } = s;
    const px0 = plotW + 14;
    const pw = W - px0 - 12;
    if (pw < 60) return;

    let ty = 26;
    text(ctx, `z = w₁x₁ + w₂x₂ + b`, px0, ty, { color: pal.muted, size: 12, weight: 600 });
    ty += 22;
    text(ctx, `z = ${fmt(w1)}·x₁ + ${fmt(w2)}·x₂ ${b >= 0 ? '+' : '−'} ${fmt(Math.abs(b))}`,
      px0, ty, { color: pal.text, size: 12, weight: 600 });

    // Courbe d'activation a(z) sur z ∈ [-6, 6].
    const gy0 = H - 30, gy1 = H * 0.42;
    const gx0 = px0, gx1 = px0 + pw;
    line(ctx, gx0, gy0, gx1, gy0, pal.grid, 1);
    line(ctx, map(0, -6, 6, gx0, gx1), gy1, map(0, -6, 6, gx0, gx1), gy0, pal.grid, 1);
    text(ctx, act === 'seuil' ? 'a(z) = seuil' : 'a(z) = σ(z)', gx0, gy1 - 8,
      { color: pal.muted, size: 11, weight: 600 });

    ctx.beginPath();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 2.4;
    for (let i = 0; i <= 120; i++) {
      const z = map(i, 0, 120, -6, 6);
      const a = activation(z);
      const gx = map(z, -6, 6, gx0, gx1);
      const gy = map(a, 0, 1, gy0, gy1);
      if (i === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.stroke();
  }

  // Survol du nuage → point pointé.
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;
    const plotW = rect.width * 0.66;
    if (cssX > plotW - 18) { hover = null; refresh(); scene.requestDraw(); return; }
    const pad = 18;
    const dx = map(cssX, pad, plotW - pad, -RANGE, RANGE);
    const dy = map(cssY, rect.height - pad, pad, -RANGE, RANGE);
    hover = { x: clamp(dx, -RANGE, RANGE), y: clamp(dy, -RANGE, RANGE) };
    refresh();
    scene.requestDraw();
  });
  canvas.addEventListener('pointerleave', () => { hover = null; refresh(); scene.requestDraw(); });

  const bind = (el: HTMLInputElement, set: (v: number) => void) =>
    el.addEventListener('input', () => { set(+el.value); refresh(); scene.requestDraw(); });
  bind(w1El, (v) => (w1 = v));
  bind(w2El, (v) => (w2 = v));
  bind(bEl, (v) => (b = v));

  actBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      act = btn.dataset.act as Act;
      actBtns.forEach((b2) => b2.classList.toggle('active', b2 === btn));
      actBtns.forEach((b2) => b2.setAttribute('aria-pressed', String(b2 === btn)));
      refresh();
      scene.requestDraw();
    }),
  );

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-neurone"]').forEach(init);
