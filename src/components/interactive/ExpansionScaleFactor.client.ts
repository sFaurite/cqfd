import { createScene, line, circle, text, fmt, type Scene } from './_canvas';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sA = root.querySelector<HTMLInputElement>('[data-a]')!;
  const outA = root.querySelector<HTMLElement>('[data-out-a]')!;
  const outZ = root.querySelector<HTMLElement>('[data-out-z]')!;
  const outL = root.querySelector<HTMLElement>('[data-out-l]')!;
  const outEp = root.querySelector<HTMLElement>('[data-out-ep]')!;

  let a = parseFloat(sA.value);
  const scene = createScene(canvas, draw);

  // Grille comobile fixe (5×4), centrée. Une « teinte » par galaxie pour la lisibilité.
  const NX = 5;
  const NY = 4;

  function refresh() {
    outA.textContent = fmt(a, 2);
    const z = 1 / a - 1;
    outZ.textContent = `z = ${fmt(z, 2)}`;
    outL.textContent = `×${fmt(1 / a, 2)}`;
    outEp.textContent = a > 0.99 ? "aujourd'hui" : 'passé';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const cx = W * 0.5;
    const cy = H * 0.42;
    // Espacement comobile (à a = 1) calibré pour remplir le cadre.
    const span = Math.min(W * 0.82, H * 0.62);
    const s0x = span / (NX - 1);
    const s0y = (span * 0.7) / (NY - 1);

    // Lignes de la « grille de l'espace » (étirées par a).
    ctx.save();
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i < NX; i++) {
      const x = cx + (i - (NX - 1) / 2) * s0x * a;
      const y0 = cy + (-(NY - 1) / 2) * s0y * a;
      const y1 = cy + ((NY - 1) / 2) * s0y * a;
      line(ctx, x, y0, x, y1, pal.grid, 1);
    }
    for (let j = 0; j < NY; j++) {
      const y = cy + (j - (NY - 1) / 2) * s0y * a;
      const x0 = cx + (-(NX - 1) / 2) * s0x * a;
      const x1 = cx + ((NX - 1) / 2) * s0x * a;
      line(ctx, x0, y, x1, y, pal.grid, 1);
    }
    ctx.restore();

    // Galaxies aux nœuds.
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        const x = cx + (i - (NX - 1) / 2) * s0x * a;
        const y = cy + (j - (NY - 1) / 2) * s0y * a;
        const home = i === Math.floor(NX / 2) && j === Math.floor(NY / 2);
        if (home) {
          circle(ctx, x, y, 6, pal.yellow);
          text(ctx, 'nous', x, y - 12, { color: pal.yellow, size: 11, align: 'center', weight: 700 });
        } else {
          circle(ctx, x, y, 4, pal.purple);
        }
      }
    }

    // Onde lumineuse : émise courte, observée étirée d'un facteur 1/a.
    const wy = H * 0.86;
    const x0 = W * 0.12;
    const x1 = W * 0.88;
    text(ctx, 'lumière émise puis étirée par l\'expansion', x0, wy - 30, { color: pal.muted, size: 11, align: 'left' });
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.red;
    ctx.lineWidth = 2.2;
    const baseWavelength = 16; // longueur d'onde « émise »
    const lambda = baseWavelength / a; // observée
    const amp = 10;
    for (let px = x0; px <= x1; px++) {
      const phase = ((px - x0) / lambda) * Math.PI * 2;
      const y = wy - Math.sin(phase) * amp;
      if (px === x0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();
    text(ctx, `λ ×${fmt(1 / a, 2)}`, x1, wy - 16, { color: pal.red, size: 12, align: 'right', weight: 700 });
  }

  sA.addEventListener('input', () => {
    a = parseFloat(sA.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="expansion-scale-factor"]').forEach(init);
