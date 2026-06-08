import { createScene, line, circle, text, clamp, fmt, gamma, type Scene } from './_canvas';

const RANGE = 4; // unités affichées de -RANGE à +RANGE sur chaque axe

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sb = root.querySelector<HTMLInputElement>('[data-beta]')!;
  const outBeta = root.querySelector<HTMLElement>('[data-out-beta]')!;
  const outS = root.querySelector<HTMLElement>('[data-out-s]')!;
  const outSp = root.querySelector<HTMLElement>('[data-out-sp]')!;
  const outInt = root.querySelector<HTMLElement>('[data-out-int]')!;
  const outType = root.querySelector<HTMLElement>('[data-out-type]')!;

  let beta = parseFloat(sb.value);
  let ex = 1.4; // coordonnée x de l'événement
  let ect = 2.2; // coordonnée ct de l'événement
  let dragging = false;

  const scene = createScene(canvas, draw);

  // conversions monde ↔ pixels (calculées à chaque draw via la scène)
  let cx = 0,
    cy = 0,
    scale = 1;
  const toPx = (x: number, ct: number) => [cx + x * scale, cy - ct * scale] as const;
  const toWorld = (px: number, py: number) => [(px - cx) / scale, (cy - py) / scale] as const;

  function refresh() {
    const g = gamma(beta);
    const xp = g * (ex - beta * ect);
    const ctp = g * (ect - beta * ex);
    const s2 = ect * ect - ex * ex;
    outBeta.textContent = fmt(beta, 2);
    outS.textContent = `x=${fmt(ex, 2)}, ct=${fmt(ect, 2)}`;
    outSp.textContent = `x′=${fmt(xp, 2)}, ct′=${fmt(ctp, 2)}`;
    outInt.textContent = fmt(s2, 2);
    outType.textContent = s2 > 0.02 ? 'genre temps' : s2 < -0.02 ? 'genre espace' : 'genre lumière';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const margin = 26;
    scale = (Math.min(W, H) - 2 * margin) / (2 * RANGE);
    cx = W / 2;
    cy = H / 2;

    // grille
    for (let i = -RANGE; i <= RANGE; i++) {
      const [gx] = toPx(i, 0);
      const [, gy] = toPx(0, i);
      line(ctx, gx, margin, gx, H - margin, pal.grid, 1);
      line(ctx, margin, gy, W - margin, gy, pal.grid, 1);
    }

    // cône de lumière (45°)
    const [lx1, ly1] = toPx(-RANGE, -RANGE);
    const [lx2, ly2] = toPx(RANGE, RANGE);
    const [lx3, ly3] = toPx(-RANGE, RANGE);
    const [lx4, ly4] = toPx(RANGE, -RANGE);
    line(ctx, lx1, ly1, lx2, ly2, pal.yellow, 1.6, [6, 4]);
    line(ctx, lx3, ly3, lx4, ly4, pal.yellow, 1.6, [6, 4]);
    text(ctx, 'lumière', lx2 - 6, ly2 + 4, { color: pal.yellow, size: 10, align: 'right', baseline: 'top' });

    // axes S
    const [ax0, ay0] = toPx(-RANGE, 0);
    const [ax1, ay1] = toPx(RANGE, 0);
    const [bx0, by0] = toPx(0, -RANGE);
    const [bx1, by1] = toPx(0, RANGE);
    line(ctx, ax0, ay0, ax1, ay1, pal.muted, 1.5);
    line(ctx, bx0, by0, bx1, by1, pal.muted, 1.5);
    text(ctx, 'x', ax1 - 4, ay1 - 8, { color: pal.muted, size: 13, italic: true, align: 'right' });
    text(ctx, 'ct', bx1 + 8, by1 + 6, { color: pal.muted, size: 13, italic: true, baseline: 'top' });

    // axes S' : ct' direction (β,1), x' direction (1,β)
    const drawBoost = (dx: number, dct: number, label: string) => {
      const [p0x, p0y] = toPx(-RANGE * dx, -RANGE * dct);
      const [p1x, p1y] = toPx(RANGE * dx, RANGE * dct);
      line(ctx, p0x, p0y, p1x, p1y, pal.blue, 1.8);
      text(ctx, label, p1x, p1y - 4, { color: pal.blue, size: 12, italic: true, weight: 700 });
    };
    drawBoost(beta, 1, "ct'");
    drawBoost(1, beta, "x'");

    // projections de l'événement sur les axes S' (parallélogramme)
    const denom = 1 - beta * beta;
    const r = (beta * ect - ex) / denom; // vers l'axe ct'
    const q = (beta * ex - ect) / denom; // vers l'axe x'
    const [px, py] = toPx(ex, ect);
    const [qx, qy] = toPx(ex + q * beta, ect + q); // sur axe x'
    const [rx, ry] = toPx(ex + r, ect + r * beta); // sur axe ct'
    line(ctx, px, py, qx, qy, pal.blue, 1.2, [4, 3]);
    line(ctx, px, py, rx, ry, pal.blue, 1.2, [4, 3]);

    // événement
    circle(ctx, px, py, 7, pal.yellow, pal.bg, 2);
    text(ctx, 'événement', px + 12, py - 10, { color: pal.yellow, size: 11, weight: 700 });
  }

  // ---- glisser-déposer de l'événement ----
  function pointerWorld(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * canvas.clientWidth;
    const py = ((e.clientY - rect.top) / rect.height) * canvas.clientHeight;
    return toWorld(px, py);
  }
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    const [x, ct] = pointerWorld(e);
    ex = clamp(x, -RANGE, RANGE);
    ect = clamp(ct, -RANGE, RANGE);
    refresh();
    scene.requestDraw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    const [x, ct] = pointerWorld(e);
    ex = clamp(x, -RANGE, RANGE);
    ect = clamp(ct, -RANGE, RANGE);
    refresh();
    scene.requestDraw();
  });
  const stop = () => (dragging = false);
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  sb.addEventListener('input', () => {
    beta = parseFloat(sb.value);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="minkowski"]').forEach(init);
