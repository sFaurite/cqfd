import { createScene, line, text, circle, clamp, lerp, type Scene } from './_canvas';

const H = 6.62607015e-34; // J·s
const ME = 9.1093837e-31; // kg
const V_MIN = 3e5; // m/s
const V_MAX = 6e7; // m/s (non relativiste : ~0,2c, OK pour l'illustration)
const NM = 1e-9;

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sv = root.querySelector<HTMLInputElement>('[data-v]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outP = root.querySelector<HTMLElement>('[data-out-p]')!;
  const outL = root.querySelector<HTMLElement>('[data-out-l]')!;
  const outCmp = root.querySelector<HTMLElement>('[data-out-cmp]')!;

  let t = parseFloat(sv.value); // 0..1 → vitesse exponentielle

  const scene = createScene(canvas, draw);
  const vitesse = () => V_MIN * Math.pow(V_MAX / V_MIN, t);

  function refresh() {
    const v = vitesse();
    const p = ME * v;
    const lambda = H / p; // m
    outV.textContent = `${(v / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} km/s`;
    outP.textContent = `${p.toExponential(2).replace('.', ',')} kg·m/s`;
    outL.textContent = `${(lambda / NM).toLocaleString('fr-FR', { maximumFractionDigits: 3 })} nm`;
    const ratio = lambda / (0.1 * NM);
    outCmp.textContent = ratio >= 1 ? `${ratio.toFixed(1)}× plus grand` : `${(1 / ratio).toFixed(1)}× plus petit`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: Hh, pal } = s;
    ctx.clearRect(0, 0, W, Hh);
    const v = vitesse();
    const lambda = H / (ME * v); // m
    const midY = Hh * 0.5;
    const padX = 30;

    // échelle : on cale 0,4 nm sur ~ la moitié de la largeur utile
    const pxPerNm = (W - 2 * padX) / 0.5;
    const lambdaPx = clamp((lambda / NM) * pxPerNm, 4, W * 4);

    // barre repère atome (0,1 nm)
    const atomPx = 0.1 * pxPerNm;
    const ax = padX;
    line(ctx, ax, Hh - 24, ax + atomPx, Hh - 24, pal.green, 3);
    line(ctx, ax, Hh - 30, ax, Hh - 18, pal.green, 2);
    line(ctx, ax + atomPx, Hh - 30, ax + atomPx, Hh - 18, pal.green, 2);
    text(ctx, '0,1 nm (atome)', ax + atomPx + 8, Hh - 24, { color: pal.green, size: 11, baseline: 'middle' });

    // onde de de Broglie
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2.4;
    const amp = Hh * 0.22;
    for (let x = padX; x <= W - padX; x++) {
      const phase = ((x - padX) / lambdaPx) * Math.PI * 2;
      const y = midY - Math.sin(phase) * amp;
      if (x === padX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // marqueur d'une longueur d'onde
    if (lambdaPx < W - 2 * padX) {
      const x1 = padX;
      const x2 = padX + lambdaPx;
      line(ctx, x1, midY + amp + 12, x2, midY + amp + 12, pal.yellow, 1.5);
      line(ctx, x1, midY + amp + 6, x1, midY + amp + 18, pal.yellow, 1.5);
      line(ctx, x2, midY + amp + 6, x2, midY + amp + 18, pal.yellow, 1.5);
      text(ctx, 'λ', (x1 + x2) / 2, midY + amp + 26, { color: pal.yellow, size: 12, align: 'center', baseline: 'top', italic: true, weight: 700 });
    }

    // électron
    circle(ctx, lerp(padX, W - padX, 0.5), midY, 6, pal.red);
    text(ctx, 'électron', 12, 18, { color: pal.muted, size: 11 });
  }

  sv.addEventListener('input', () => {
    t = parseFloat(sv.value);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="debroglie"]').forEach(init);
