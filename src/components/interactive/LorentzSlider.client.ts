import { createScene, line, circle, text, clamp, map, fmt, gamma, type Scene } from './_canvas';

const C_KM_S = 299792.458; // c en km/s
const GAMMA_MAX = 8; // plafond d'affichage de l'axe γ

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slider = root.querySelector<HTMLInputElement>('[data-beta]')!;
  const outBeta = root.querySelector<HTMLElement>('[data-out-beta]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outG = root.querySelector<HTMLElement>('[data-out-gamma]')!;
  const outDt = root.querySelector<HTMLElement>('[data-out-dt]')!;
  const outL = root.querySelector<HTMLElement>('[data-out-l]')!;

  let beta = parseFloat(slider.value);

  const scene = createScene(canvas, draw);

  function refreshReadouts() {
    const g = gamma(beta);
    outBeta.textContent = fmt(beta, 3);
    const vKm = beta * C_KM_S;
    outV.textContent =
      beta < 0.001 ? '≈ 0 km/s' : `${vKm.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} km/s`;
    outG.textContent = fmt(g, g > 100 ? 1 : 4);
    outDt.textContent = `${fmt(g, 3)} s`;
    outL.textContent = `${fmt(1 / g, 3)} m`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 52,
      padR = 24,
      padT = 18,
      padB = 34;
    const x0 = padL,
      x1 = W - padR,
      y0 = H - padB,
      y1 = padT;

    const xOf = (b: number) => map(b, 0, 1, x0, x1);
    const yOf = (g: number) => map(clamp(g, 1, GAMMA_MAX), 1, GAMMA_MAX, y0, y1);

    // grille + axes
    ctx.save();
    for (let g = 1; g <= GAMMA_MAX; g++) {
      const y = yOf(g);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, String(g), x0 - 8, y, { color: pal.muted, size: 11, align: 'right', baseline: 'middle' });
    }
    for (let b = 0; b <= 1.0001; b += 0.2) {
      const x = xOf(b);
      line(ctx, x, y0, x, y1, pal.grid, 1);
      text(ctx, fmt(b, 1), x, y0 + 8, { color: pal.muted, size: 11, align: 'center', baseline: 'top' });
    }
    // axes principaux
    line(ctx, x0, y0, x1, y0, pal.border, 1.5);
    line(ctx, x0, y0, x0, y1, pal.border, 1.5);
    text(ctx, 'γ', x0 - 30, y1 + 4, { color: pal.text, size: 15, italic: true, weight: 700, baseline: 'top' });
    text(ctx, 'β = v/c', x1, y0 + 20, { color: pal.text, size: 13, italic: true, align: 'right', baseline: 'top' });

    // asymptote v = c
    line(ctx, x1, y0, x1, y1, pal.red, 1.5, [5, 4]);
    text(ctx, 'v = c', x1 - 4, y1 + 2, { color: pal.red, size: 11, align: 'right', baseline: 'top', weight: 700 });

    // courbe γ(β)
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = pal.blue;
    let started = false;
    for (let px = x0; px <= x1; px++) {
      const b = map(px, x0, x1, 0, 1);
      const g = gamma(Math.min(b, 0.99999));
      const y = yOf(g);
      if (!started) {
        ctx.moveTo(px, y);
        started = true;
      } else ctx.lineTo(px, y);
      if (g >= GAMMA_MAX) break;
    }
    ctx.stroke();
    ctx.restore();

    // point courant
    const g = gamma(beta);
    const cx = xOf(beta);
    const cy = yOf(g);
    line(ctx, cx, y0, cx, cy, pal.yellow, 1.4, [4, 3]);
    if (g <= GAMMA_MAX) line(ctx, x0, cy, cx, cy, pal.yellow, 1.4, [4, 3]);
    circle(ctx, cx, Math.max(cy, y1), 5.5, pal.yellow, pal.bg, 2);

    // étiquette γ
    const lbl = `γ = ${fmt(g, g > 100 ? 1 : 3)}`;
    const ly = Math.max(cy, y1) - 12;
    text(ctx, lbl, clamp(cx, x0 + 4, x1 - 70), ly, { color: pal.yellow, size: 13, weight: 700, baseline: 'bottom' });
    ctx.restore();
  }

  slider.addEventListener('input', () => {
    beta = parseFloat(slider.value);
    refreshReadouts();
    scene.requestDraw();
  });

  refreshReadouts();
}

document.querySelectorAll<HTMLElement>('[data-iw="lorentz"]').forEach(init);
