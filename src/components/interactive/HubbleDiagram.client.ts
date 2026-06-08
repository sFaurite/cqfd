import { createScene, line, circle, text, fmt, clamp, map, type Scene } from './_canvas';

const H0_TRUE = 70; // pente « réelle » des données simulées
const D_MAX = 500; // Mpc
const V_MAX = 42000; // km/s

// Galaxies « observées » : distances fixes + bruit déterministe sur la vitesse.
const GALAXIES = (() => {
  const pts: { d: number; v: number }[] = [];
  let seed = 12345;
  const rnd = () => {
    // générateur pseudo-aléatoire déterministe (LCG) — pas de Math.random.
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < 22; i++) {
    const d = 30 + rnd() * (D_MAX - 50);
    const noise = (rnd() - 0.5) * 2 * (1800 + d * 8); // dispersion croît un peu avec d
    pts.push({ d, v: H0_TRUE * d + noise });
  }
  return pts;
})();

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sH0 = root.querySelector<HTMLInputElement>('[data-h0]')!;
  const outH0 = root.querySelector<HTMLElement>('[data-out-h0]')!;
  const outPente = root.querySelector<HTMLElement>('[data-out-pente]')!;
  const outAge = root.querySelector<HTMLElement>('[data-out-age]')!;
  const outFit = root.querySelector<HTMLElement>('[data-out-fit]')!;

  let H0 = parseFloat(sH0.value);
  const scene = createScene(canvas, draw);

  function refresh() {
    outH0.textContent = `${fmt(H0, 0)}`;
    outPente.textContent = `${fmt(H0, 0)} km/s/Mpc`;
    outAge.textContent = `${fmt(978 / H0, 1)} Ga`;
    const err = Math.abs(H0 - H0_TRUE);
    const verdict = err <= 4 ? 'excellent' : err <= 12 ? 'correct' : 'à revoir';
    outFit.textContent = verdict;
    outFit.style.color = err <= 4 ? 'var(--c-green)' : err <= 12 ? 'var(--c-yellow)' : 'var(--c-red)';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 64;
    const padB = 42;
    const padT = 18;
    const padR = 18;
    const x0 = padL;
    const x1 = W - padR;
    const y0 = H - padB;
    const y1 = padT;

    const X = (d: number) => map(d, 0, D_MAX, x0, x1);
    const Y = (v: number) => map(v, 0, V_MAX, y0, y1);

    // axes
    line(ctx, x0, y0, x1, y0, pal.muted, 1.4);
    line(ctx, x0, y0, x0, y1, pal.muted, 1.4);
    for (let d = 100; d <= D_MAX; d += 100) {
      const x = X(d);
      line(ctx, x, y0, x, y0 + 4, pal.muted, 1);
      text(ctx, `${d}`, x, y0 + 18, { color: pal.muted, size: 10, align: 'center' });
    }
    for (let v = 10000; v <= 40000; v += 10000) {
      const y = Y(v);
      line(ctx, x0 - 4, y, x0, y, pal.muted, 1);
      text(ctx, `${v / 1000}k`, x0 - 8, y + 3, { color: pal.muted, size: 10, align: 'right' });
    }
    text(ctx, 'distance d (Mpc)', (x0 + x1) / 2, H - 6, { color: pal.muted, size: 11, align: 'center' });
    ctx.save();
    ctx.translate(14, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'vitesse de récession v (km/s)', 0, 0, { color: pal.muted, size: 11, align: 'center' });
    ctx.restore();

    // droite v = H0·d
    const vEnd = H0 * D_MAX;
    const yEnd = clamp(Y(vEnd), y1, y0);
    const dEnd = vEnd > V_MAX ? V_MAX / H0 : D_MAX;
    line(ctx, X(0), Y(0), X(dEnd), Y(H0 * dEnd), pal.blue, 2.4);
    text(ctx, `v = ${fmt(H0, 0)}·d`, X(dEnd) - 6, Math.max(y1 + 12, yEnd + 16), {
      color: pal.blue, size: 12, align: 'right', weight: 700,
    });

    // galaxies
    for (const g of GALAXIES) {
      const gy = Y(g.v);
      if (gy < y1 - 2 || gy > y0 + 2) continue;
      circle(ctx, X(g.d), gy, 3.6, pal.purple);
    }
  }

  sH0.addEventListener('input', () => {
    H0 = parseFloat(sH0.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="hubble-diagram"]').forEach(init);
