import { createScene, line, circle, text, fmt, map, type Scene } from './_canvas';

const R_MAX = 30; // kpc
const V_MAX = 260; // km/s
const RD = 4; // rayon caractéristique du disque (kpc)
const V_OBS = 180; // vitesse plate observée (km/s)

// Masse visible enclose (normalisée → 1) : sature au-delà du disque.
const mVis = (r: number) => (r * r * r) / (r * r * r + RD * RD * RD);
// Vitesse de la seule matière visible : v ∝ √(M(r)/r). Coefficient calé pour un pic ≈ 150 km/s.
const vVis = (r: number) => 424 * Math.sqrt(mVis(r) / Math.max(r, 0.3));

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sH = root.querySelector<HTMLInputElement>('[data-halo]')!;
  const outH = root.querySelector<HTMLElement>('[data-out-h]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outFit = root.querySelector<HTMLElement>('[data-out-fit]')!;

  let Vh = parseFloat(sH.value);
  const scene = createScene(canvas, draw);

  // halo isotherme : v_halo ≈ constante (M ∝ r), atténuée près du centre.
  const vHalo = (r: number) => Vh * Math.sqrt(r / (r + 1.5));
  const vTot = (r: number) => Math.hypot(vVis(r), vHalo(r));

  function refresh() {
    outH.textContent = `${fmt(Vh, 0)}`;
    const v25 = vTot(25);
    outV.textContent = `${fmt(v25, 0)} km/s`;
    const ok = Math.abs(v25 - V_OBS) < 18;
    outFit.textContent = ok ? 'oui' : 'non';
    outFit.style.color = ok ? 'var(--c-green)' : 'var(--c-red)';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 52, padB = 38, padT = 18, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
    const X = (r: number) => map(r, 0, R_MAX, x0, x1);
    const Y = (v: number) => map(v, 0, V_MAX, y0, y1);

    // axes + grille
    for (let r = 5; r <= R_MAX; r += 5) {
      const x = X(r);
      line(ctx, x, y0, x, y1, pal.grid, 1);
      text(ctx, `${r}`, x, y0 + 17, { color: pal.muted, size: 10, align: 'center' });
    }
    for (let v = 50; v <= 250; v += 50) {
      const y = Y(v);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, `${v}`, x0 - 6, y + 3, { color: pal.muted, size: 10, align: 'right' });
    }
    line(ctx, x0, y0, x1, y0, pal.muted, 1.4);
    line(ctx, x0, y0, x0, y1, pal.muted, 1.4);
    text(ctx, 'rayon r (kpc)', (x0 + x1) / 2, H - 5, { color: pal.muted, size: 11, align: 'center' });
    ctx.save();
    ctx.translate(13, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'vitesse de rotation (km/s)', 0, 0, { color: pal.muted, size: 11, align: 'center' });
    ctx.restore();

    const plot = (f: (r: number) => number, color: string, dash: number[], wlabel: string, lr: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = dash.length ? 1.8 : 2.6;
      ctx.setLineDash(dash);
      let started = false;
      for (let px = x0; px <= x1; px++) {
        const r = map(px, x0, x1, 0, R_MAX);
        const py = Y(f(r));
        if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
      if (wlabel) text(ctx, wlabel, X(lr), Y(f(lr)) - 6, { color, size: 11, align: 'left', weight: 700 });
    };

    // observations : courbe plate (points jaunes)
    for (let r = 4; r <= R_MAX; r += 2.5) {
      const noise = ((r * 37) % 11 - 5) * 1.4; // pseudo-bruit déterministe
      circle(ctx, X(r), Y(V_OBS + noise), 3.2, pal.yellow);
    }

    plot(vVis, pal.blue, [6, 4], 'matière visible', 20);
    if (Vh > 0) plot(vHalo, pal.purple, [2, 3], 'halo seul', 9);
    plot(vTot, pal.orange, [], 'total (vis. + halo)', 13);
    text(ctx, 'observations', X(26), Y(V_OBS) + 16, { color: pal.yellow, size: 11, align: 'right', weight: 700 });
  }

  sH.addEventListener('input', () => {
    Vh = parseFloat(sH.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="rotation-curve"]').forEach(init);
