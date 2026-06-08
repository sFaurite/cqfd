import { createScene, line, circle, text, fmt, map, type Scene } from './_canvas';

const Z_MAX = 1.4;

// Distance de luminosité (en unités c/H₀) pour un univers PLAT : Ω_m + Ω_Λ = 1.
// d_C = ∫₀ᶻ dz'/E(z'), E = √(Ω_m(1+z)³ + Ω_Λ) ; d_L = (1+z)·d_C.
function dL(z: number, Om: number): number {
  const OL = 1 - Om;
  const N = 160;
  const dz = z / N;
  let dc = 0;
  for (let i = 0; i < N; i++) {
    const zi = (i + 0.5) * dz;
    const E = Math.sqrt(Om * (1 + zi) ** 3 + OL);
    dc += dz / E;
  }
  return (1 + z) * dc;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sOl = root.querySelector<HTMLInputElement>('[data-ol]')!;
  const outOl = root.querySelector<HTMLElement>('[data-out-ol]')!;
  const outOm = root.querySelector<HTMLElement>('[data-out-om]')!;
  const outQ = root.querySelector<HTMLElement>('[data-out-q]')!;
  const outAcc = root.querySelector<HTMLElement>('[data-out-acc]')!;

  let OL = parseFloat(sOl.value);
  const scene = createScene(canvas, draw);

  // Données SN simulées sur le modèle de concordance (Ω_m = 0,3), bruit déterministe.
  const SN = (() => {
    const pts: { z: number; d: number }[] = [];
    let seed = 9871;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = 0; i < 26; i++) {
      const z = 0.05 + rnd() * (Z_MAX - 0.1);
      const d = dL(z, 0.3) * (1 + (rnd() - 0.5) * 0.10);
      pts.push({ z, d });
    }
    return pts;
  })();

  const DMAX = dL(Z_MAX, 0.05) * 1.05;

  function refresh() {
    const Om = 1 - OL;
    outOl.textContent = fmt(OL, 2);
    outOm.textContent = fmt(Om, 2);
    const q0 = Om / 2 - OL;
    outQ.textContent = `${q0 >= 0 ? '+' : '−'}${fmt(Math.abs(q0), 2)}`;
    const acc = q0 < 0;
    outAcc.textContent = acc ? 'accélère' : 'décélère';
    outAcc.style.color = acc ? 'var(--c-green)' : 'var(--c-red)';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 52, padB = 38, padT = 18, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
    const X = (z: number) => map(z, 0, Z_MAX, x0, x1);
    const Y = (d: number) => map(d, 0, DMAX, y0, y1);

    for (let z = 0.2; z <= Z_MAX; z += 0.2) {
      const x = X(z);
      line(ctx, x, y0, x, y1, pal.grid, 1);
      text(ctx, fmt(z, 1), x, y0 + 17, { color: pal.muted, size: 10, align: 'center' });
    }
    line(ctx, x0, y0, x1, y0, pal.muted, 1.4);
    line(ctx, x0, y0, x0, y1, pal.muted, 1.4);
    text(ctx, 'redshift z', (x0 + x1) / 2, H - 5, { color: pal.muted, size: 11, align: 'center' });
    ctx.save();
    ctx.translate(13, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'distance de luminosité d_L (c/H₀)', 0, 0, { color: pal.muted, size: 11, align: 'center' });
    ctx.restore();

    const plot = (Om: number, color: string, dash: number[], label: string) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = dash.length ? 1.8 : 2.6;
      ctx.setLineDash(dash);
      let started = false;
      for (let px = x0; px <= x1; px++) {
        const z = map(px, x0, x1, 0, Z_MAX);
        const py = Y(dL(z, Om));
        if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
      if (label) text(ctx, label, x1 - 4, Y(dL(Z_MAX, Om)) + 4, { color, size: 11, align: 'right', weight: 700 });
    };

    // référence décélérée (Ω_m = 1)
    plot(1, pal.blue, [6, 4], 'Ω_m = 1 (décéléré)');
    // courbe réglable (univers plat, Ω_m = 1 − Ω_Λ)
    plot(1 - OL, pal.orange, [], `Ω_Λ = ${fmt(OL, 2)}`);

    // supernovæ
    for (const p of SN) circle(ctx, X(p.z), Y(p.d), 3.2, pal.yellow);
    text(ctx, 'supernovæ Ia', X(0.1), Y(dL(0.6, 0.3)), { color: pal.yellow, size: 11, align: 'left', weight: 700 });
  }

  sOl.addEventListener('input', () => {
    OL = parseFloat(sOl.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="accelerating-expansion"]').forEach(init);
