import { createScene, line, text, fmt, type Scene } from './_canvas';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sdx = root.querySelector<HTMLInputElement>('[data-dx]')!;
  const outDx = root.querySelector<HTMLElement>('[data-out-dx]')!;
  const outDp = root.querySelector<HTMLElement>('[data-out-dp]')!;
  const outProd = root.querySelector<HTMLElement>('[data-out-prod]')!;
  const outE = root.querySelector<HTMLElement>('[data-out-e]')!;

  let dx = parseFloat(sdx.value); // unités arbitraires (1 = boîte large)

  const scene = createScene(canvas, draw);

  function refresh() {
    // unités relatives : Δp_min = 1/(2Δx) (ħ = 1), E ∝ Δp²
    const dp = 1 / (2 * dx);
    const prod = dx * dp; // = 1/2 toujours
    const e = dp * dp;
    outDx.textContent = `${fmt(dx, 2)} (rel.)`;
    outDp.textContent = `${fmt(dp, 2)} (rel.)`;
    outProd.textContent = `${fmt(prod, 2)} ħ  (= minimum)`;
    outE.textContent = `${fmt(e, 2)} (rel.)`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padX = 40;
    const baseY = H * 0.7;
    const fullW = W - 2 * padX;
    const boxW = fullW * dx;
    const x0 = W / 2 - boxW / 2;
    const x1 = W / 2 + boxW / 2;

    // murs de la boîte
    line(ctx, x0, baseY - 4, x0, baseY - H * 0.5, pal.muted, 3);
    line(ctx, x1, baseY - 4, x1, baseY - H * 0.5, pal.muted, 3);
    line(ctx, x0, baseY, x1, baseY, pal.border, 1.5);
    text(ctx, 'Δx', (x0 + x1) / 2, baseY + 20, { color: pal.muted, size: 13, align: 'center', italic: true, baseline: 'top' });
    line(ctx, x0, baseY + 10, x1, baseY + 10, pal.muted, 1);

    // fonction d'onde fondamentale ψ(x) = sin(π x / Δx) (plus la boîte est étroite,
    // plus la pente — donc le moment — est grande)
    const amp = H * 0.34;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2.6;
    for (let px = x0; px <= x1; px++) {
      const u = (px - x0) / boxW;
      const y = baseY - Math.sin(Math.PI * u) * amp;
      if (px === x0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();
    text(ctx, 'ψ (état fondamental)', x1 + 8, baseY - amp, { color: pal.blue, size: 11, baseline: 'middle' });

    // flèche illustrant Δp (proportionnelle à 1/Δx)
    const dp = 1 / (2 * dx);
    const arrowLen = Math.min(dp * 30, W * 0.4);
    const ay = H * 0.16;
    line(ctx, W / 2 - arrowLen, ay, W / 2 + arrowLen, ay, pal.red, 3);
    text(ctx, `Δp ∝ 1/Δx`, W / 2, ay - 12, { color: pal.red, size: 12, align: 'center', weight: 700, baseline: 'bottom' });
  }

  sdx.addEventListener('input', () => {
    dx = parseFloat(sdx.value);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="heisenberg"]').forEach(init);
