import { createScene, line, circle, text, clamp, map, fmt, type Scene } from './_canvas';

const PMAX = 6;

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sm = root.querySelector<HTMLInputElement>('[data-m]')!;
  const sp = root.querySelector<HTMLInputElement>('[data-p]')!;
  const outM = root.querySelector<HTMLElement>('[data-out-m]')!;
  const outP = root.querySelector<HTMLElement>('[data-out-p]')!;
  const outE = root.querySelector<HTMLElement>('[data-out-e]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outMsg = root.querySelector<HTMLElement>('[data-out-msg]')!;

  let mc2 = parseFloat(sm.value);
  let pc = parseFloat(sp.value);

  const scene = createScene(canvas, draw);
  const vOverC = (m: number, p: number) => p / Math.hypot(m, p || 1e-9);

  function refresh() {
    const E = Math.hypot(mc2, pc);
    const v = mc2 === 0 ? 1 : vOverC(mc2, pc);
    outM.textContent = `${fmt(mc2, 2)} GeV`;
    outP.textContent = `${fmt(pc, 2)} GeV`;
    outE.textContent = `${fmt(E, 2)} GeV`;
    outV.textContent = mc2 === 0 ? '1,000 (= c)' : fmt(v, 4);
    outMsg.textContent = mc2 < 0.001 ? 'sans masse : v = c, toujours' : 'avec masse : v < c';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 48,
      padR = 20,
      padT = 16,
      padB = 36;
    const x0 = padL,
      x1 = W - padR,
      y0 = H - padB,
      y1 = padT;
    const xOf = (p: number) => map(p, 0, PMAX, x0, x1);
    const yOf = (v: number) => map(v, 0, 1, y0, y1);

    // grille
    for (let v = 0; v <= 1.0001; v += 0.25) {
      const y = yOf(v);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, fmt(v, 2), x0 - 8, y, { color: pal.muted, size: 10, align: 'right', baseline: 'middle' });
    }
    line(ctx, x0, y0, x1, y0, pal.border, 1.5);
    line(ctx, x0, y0, x0, y1, pal.border, 1.5);
    text(ctx, 'v/c', x0 - 30, y1 + 2, { color: pal.text, size: 12, baseline: 'top', italic: true });
    text(ctx, 'pc', x1, y0 + 18, { color: pal.text, size: 12, align: 'right', baseline: 'top', italic: true });

    // limite v = c
    line(ctx, x0, yOf(1), x1, yOf(1), pal.red, 1.4, [5, 4]);
    text(ctx, 'v = c', x1 - 4, yOf(1) + 4, { color: pal.red, size: 11, align: 'right', baseline: 'top', weight: 700 });

    // courbes de référence pour plusieurs masses
    const refMasses = [0, 0.5, 1, 2, 3];
    for (const m of refMasses) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = m === 0 ? pal.yellow : pal.blue;
      ctx.globalAlpha = m === 0 ? 1 : 0.32;
      ctx.lineWidth = m === 0 ? 2.6 : 1.4;
      for (let px = x0; px <= x1; px++) {
        const p = map(px, x0, x1, 0, PMAX);
        const v = m === 0 ? 1 : vOverC(m, p);
        const y = yOf(v);
        if (px === x0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.restore();
    }
    text(ctx, 'm = 0', x1 - 50, yOf(1) - 6, { color: pal.yellow, size: 10, align: 'right', baseline: 'bottom', weight: 700 });

    // courbe courante (masse choisie) en surbrillance
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.teal;
    ctx.lineWidth = 2.6;
    for (let px = x0; px <= x1; px++) {
      const p = map(px, x0, x1, 0, PMAX);
      const v = mc2 === 0 ? 1 : vOverC(mc2, p);
      const y = yOf(v);
      if (px === x0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();

    // point courant
    const v = mc2 === 0 ? 1 : vOverC(mc2, pc);
    circle(ctx, xOf(clamp(pc, 0, PMAX)), yOf(v), 6, pal.yellow, pal.bg, 2);
  }

  sm.addEventListener('input', () => {
    mc2 = parseFloat(sm.value);
    refresh();
    scene.requestDraw();
  });
  sp.addEventListener('input', () => {
    pc = parseFloat(sp.value);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="massless"]').forEach(init);
