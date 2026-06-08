import { createScene, line, circle, text, clamp, map, fmt, type Scene } from './_canvas';

const RANGE = 1.6; // l'axe va de -RANGE c à +RANGE c

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const su = root.querySelector<HTMLInputElement>('[data-u]')!;
  const sv = root.querySelector<HTMLInputElement>('[data-v]')!;
  const outU = root.querySelector<HTMLElement>('[data-out-u]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outG = root.querySelector<HTMLElement>('[data-out-g]')!;
  const outW = root.querySelector<HTMLElement>('[data-out-w]')!;

  let u = parseFloat(su.value);
  let v = parseFloat(sv.value);

  const scene = createScene(canvas, draw);

  function refresh() {
    const g = u + v;
    const w = (u + v) / (1 + u * v);
    outU.textContent = `${fmt(u, 2)} c`;
    outV.textContent = `${fmt(v, 2)} c`;
    outG.textContent = `${fmt(g, 3)} c${Math.abs(g) > 1 ? '  ⚠ > c !' : ''}`;
    outW.textContent = `${fmt(w, 3)} c`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padX = 40;
    const axisY = H * 0.62;
    const x0 = padX,
      x1 = W - padX;
    const xOf = (val: number) => map(clamp(val, -RANGE, RANGE), -RANGE, RANGE, x0, x1);

    // zone interdite (|v|>c)
    ctx.fillStyle = 'rgba(252,98,85,0.10)';
    ctx.fillRect(x0, axisY - 60, xOf(-1) - x0, 120);
    ctx.fillRect(xOf(1), axisY - 60, x1 - xOf(1), 120);

    // axe
    line(ctx, x0, axisY, x1, axisY, pal.border, 1.5);
    for (let t = -1.5; t <= 1.5; t += 0.5) {
      const x = xOf(t);
      line(ctx, x, axisY - 5, x, axisY + 5, pal.muted, 1);
      text(ctx, `${fmt(t, 1)}`, x, axisY + 20, { color: pal.muted, size: 10, align: 'center', baseline: 'top' });
    }
    // limites ±c
    for (const sgn of [-1, 1]) {
      const x = xOf(sgn);
      line(ctx, x, axisY - 60, x, axisY + 40, pal.red, 1.5, [5, 4]);
      text(ctx, sgn > 0 ? '+c' : '−c', x, axisY - 66, { color: pal.red, size: 12, align: 'center', weight: 700, baseline: 'bottom' });
    }

    const g = u + v;
    const w = (u + v) / (1 + u * v);

    // marqueurs u, v (au-dessus), résultats (sur l'axe)
    const mark = (val: number, y: number, color: string, label: string, clampMark = false) => {
      const shown = clampMark ? clamp(val, -RANGE, RANGE) : val;
      const x = xOf(shown);
      line(ctx, x, axisY, x, y, color, 1.4, [3, 3]);
      circle(ctx, x, y, 5.5, color, pal.bg, 1.5);
      text(ctx, label, x, y - 10, { color, size: 11, align: 'center', weight: 700, baseline: 'bottom' });
    };

    mark(u, axisY - 34, pal.blue, `u = ${fmt(u, 2)}`);
    mark(v, axisY - 52, pal.teal, `v = ${fmt(v, 2)}`);
    // galiléen (peut sortir → clamp + alerte)
    const gOut = Math.abs(g) > RANGE;
    mark(g, axisY + 36, gOut ? pal.red : pal.muted, gOut ? `u+v = ${fmt(g, 2)} (hors champ)` : `u+v = ${fmt(g, 2)}`, true);
    // relativiste
    mark(w, axisY + 58, pal.yellow, `w = ${fmt(w, 3)}`);
  }

  su.addEventListener('input', () => {
    u = parseFloat(su.value);
    refresh();
    scene.requestDraw();
  });
  sv.addEventListener('input', () => {
    v = parseFloat(sv.value);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="velcomp"]').forEach(init);
