import { createScene, line, text, fmt, map, type Scene } from './_canvas';

const H = 6.626e-34;
const K = 1.381e-23;
const B_WIEN = 2.898e-3; // m·K, loi de Wien (longueur d'onde)
const NU_MAX = 6e11; // 600 GHz

// Loi de Planck (forme en fréquence, à une constante près) : ν³ / (e^{hν/kT} − 1).
function planck(nu: number, T: number): number {
  const x = (H * nu) / (K * T);
  if (x > 700) return 0;
  return (nu * nu * nu) / (Math.exp(x) - 1);
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sT = root.querySelector<HTMLInputElement>('[data-temp]')!;
  const outT = root.querySelector<HTMLElement>('[data-out-t]')!;
  const outF = root.querySelector<HTMLElement>('[data-out-fpeak]')!;
  const outL = root.querySelector<HTMLElement>('[data-out-lpeak]')!;

  let T = parseFloat(sT.value);
  const scene = createScene(canvas, draw);

  // Échelle verticale : max de Planck sur [0, NU_MAX] à la T la plus chaude (6 K).
  const SCALE = (() => {
    let m = 0;
    for (let nu = 1e9; nu <= NU_MAX; nu += 2e9) m = Math.max(m, planck(nu, 6));
    return m;
  })();

  function peakFreq(t: number) { return 2.821 * K * t / H; } // ν_pic = 2.821 kT/h

  function refresh() {
    outT.textContent = `${fmt(T, 2)} K`;
    const fp = peakFreq(T);
    outF.textContent = `${fmt(fp / 1e9, 0)} GHz`;
    outL.textContent = `${fmt((B_WIEN / T) * 1000, 2)} mm`;
  }

  function curve(s: Scene, t: number, color: string, dash: number[], wlabel: string) {
    const { ctx, width: W, height: Ht, pal } = s;
    const padL = 50, padB = 38, padT = 18, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = Ht - padB, y1 = padT;
    const X = (nu: number) => map(nu, 0, NU_MAX, x0, x1);
    const Y = (b: number) => map(b / SCALE, 0, 1.05, y0, y1);
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = dash.length ? 1.8 : 2.6;
    ctx.setLineDash(dash);
    let started = false;
    for (let px = x0; px <= x1; px++) {
      const nu = map(px, x0, x1, 0, NU_MAX);
      const py = Y(planck(nu, t));
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
    // marqueur du pic
    const fp = peakFreq(t);
    if (!dash.length) {
      const xp = X(fp);
      line(ctx, xp, y0, xp, Y(planck(fp, t)), pal.muted, 1, [3, 3]);
      text(ctx, wlabel, xp, Y(planck(fp, t)) - 6, { color, size: 11, align: 'center', weight: 700 });
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: Ht, pal } = s;
    ctx.clearRect(0, 0, W, Ht);
    const padL = 50, padB = 38, padT = 18, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = Ht - padB, y1 = padT;

    line(ctx, x0, y0, x1, y0, pal.muted, 1.4);
    line(ctx, x0, y0, x0, y1, pal.muted, 1.4);
    for (let f = 100; f <= 600; f += 100) {
      const x = map(f * 1e9, 0, NU_MAX, x0, x1);
      line(ctx, x, y0, x, y0 + 4, pal.muted, 1);
      text(ctx, `${f}`, x, y0 + 17, { color: pal.muted, size: 10, align: 'center' });
    }
    text(ctx, 'fréquence (GHz)', (x0 + x1) / 2, Ht - 5, { color: pal.muted, size: 11, align: 'center' });
    ctx.save();
    ctx.translate(13, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'intensité (corps noir)', 0, 0, { color: pal.muted, size: 11, align: 'center' });
    ctx.restore();

    // référence CMB à 2,7255 K
    curve(s, 2.7255, pal.blue, [5, 4], '');
    text(ctx, 'CMB réel : 2,7255 K', x1 - 6, y1 + 12, { color: pal.blue, size: 11, align: 'right', weight: 700 });
    // courbe réglable
    curve(s, T, pal.orange, [], `T = ${fmt(T, 2)} K`);
  }

  sT.addEventListener('input', () => {
    T = parseFloat(sT.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="blackbody-cmb"]').forEach(init);
