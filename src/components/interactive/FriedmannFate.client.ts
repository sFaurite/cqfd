import { createScene, line, circle, text, fmt, map, type Scene } from './_canvas';

interface Pt { t: number; a: number; }

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sOm = root.querySelector<HTMLInputElement>('[data-om]')!;
  const sOl = root.querySelector<HTMLInputElement>('[data-ol]')!;
  const outOm = root.querySelector<HTMLElement>('[data-out-om]')!;
  const outOl = root.querySelector<HTMLElement>('[data-out-ol]')!;
  const outOk = root.querySelector<HTMLElement>('[data-out-ok]')!;
  const outGeo = root.querySelector<HTMLElement>('[data-out-geo]')!;
  const outFate = root.querySelector<HTMLElement>('[data-out-fate]')!;
  const btnLcdm = root.querySelector<HTMLButtonElement>('[data-preset-lcdm]')!;
  const btnEds = root.querySelector<HTMLButtonElement>('[data-preset-einstein]')!;

  let Om = parseFloat(sOm.value);
  let Ol = parseFloat(sOl.value);
  const scene = createScene(canvas, draw);

  // Intègre a''(t) = −Ω_m/(2a²) + Ω_Λ·a (unités H₀ = 1), CI : a(0)=1, a'(0)=1.
  // dir = +1 (futur) ou −1 (passé). S'arrête à un Big Bang/Crunch (a→0) ou aux bornes.
  function integrate(dir: number): { pts: Pt[]; crunch: boolean; lastAcc: number } {
    const dt = 0.004 * dir;
    const accel = (a: number) => -Om / (2 * a * a) + Ol * a;
    let a = 1;
    let v = 1; // a'(0) = H₀ = 1
    let t = 0;
    const pts: Pt[] = [{ t, a }];
    let crunch = false;
    let lastAcc = accel(a);
    for (let i = 0; i < 4000; i++) {
      const ac = accel(a);
      const aNew = a + v * dt + 0.5 * ac * dt * dt;
      if (aNew <= 0.004) { crunch = true; pts.push({ t: t + dt, a: 0 }); break; }
      const acNew = accel(aNew);
      v = v + 0.5 * (ac + acNew) * dt;
      a = aNew;
      t += dt;
      lastAcc = acNew;
      pts.push({ t, a });
      if (a > 3.2 || Math.abs(t) > 12) break;
    }
    return { pts, crunch, lastAcc };
  }

  function compute() {
    const fwd = integrate(+1);
    const bwd = integrate(-1);
    const pts = [...bwd.pts.slice().reverse(), ...fwd.pts.slice(1)];
    const Ok = 1 - Om - Ol;
    return { pts, Ok, crunchFuture: fwd.crunch, accFuture: fwd.lastAcc };
  }

  function refresh() {
    outOm.textContent = fmt(Om, 2);
    outOl.textContent = fmt(Ol, 2);
    const Ok = 1 - Om - Ol;
    outOk.textContent = `Ω_k = ${fmt(Ok, 2)}`;
    let geo: string;
    if (Math.abs(Ok) < 0.02) geo = 'plat (k = 0)';
    else if (Ok < 0) geo = 'fermé (k > 0)';
    else geo = 'ouvert (k < 0)';
    outGeo.textContent = geo;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const { pts, crunchFuture, accFuture } = compute();

    // bornes du tracé
    let tMin = 0, tMax = 0, aMax = 1.2;
    for (const p of pts) { tMin = Math.min(tMin, p.t); tMax = Math.max(tMax, p.t); aMax = Math.max(aMax, p.a); }
    tMin = Math.min(tMin, -0.2);
    tMax = Math.max(tMax, 0.2);
    aMax = Math.min(aMax, 3.2);

    const padL = 50, padB = 38, padT = 16, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
    const X = (t: number) => map(t, tMin, tMax, x0, x1);
    const Y = (a: number) => map(a, 0, aMax, y0, y1);

    // axes
    line(ctx, x0, y0, x1, y0, pal.muted, 1.4);
    line(ctx, x0, y0, x0, y1, pal.muted, 1.4);
    text(ctx, 'temps (en unités de 1/H₀, 0 = aujourd\'hui)', (x0 + x1) / 2, H - 6, { color: pal.muted, size: 11, align: 'center' });
    ctx.save();
    ctx.translate(14, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, "facteur d'échelle a(t)", 0, 0, { color: pal.muted, size: 11, align: 'center' });
    ctx.restore();

    // ligne a = 1 et t = 0 (aujourd'hui)
    line(ctx, x0, Y(1), x1, Y(1), pal.border, 1, [4, 4]);
    line(ctx, X(0), y0, X(0), y1, pal.border, 1, [4, 4]);
    text(ctx, 'a = 1', x1 - 4, Y(1) - 5, { color: pal.muted, size: 10, align: 'right' });

    // courbe a(t)
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.orange || pal.yellow;
    ctx.lineWidth = 2.6;
    let started = false;
    for (const p of pts) {
      if (p.t < tMin || p.t > tMax) continue;
      const px = X(p.t), py = Y(p.a);
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // « aujourd'hui »
    circle(ctx, X(0), Y(1), 5, pal.yellow);
    text(ctx, "aujourd'hui", X(0) + 8, Y(1) - 8, { color: pal.yellow, size: 11, weight: 700 });

    // Big Bang (croisement a=0 dans le passé)
    const bb = pts.find((p) => p.a <= 0.005 && p.t < 0);
    if (bb) {
      circle(ctx, X(bb.t), Y(0), 4, pal.red);
      text(ctx, 'Big Bang', X(bb.t) + 6, Y(0) - 8, { color: pal.red, size: 10 });
    }

    // verdict destin
    let fate: string, col: string;
    if (crunchFuture) { fate = 'Recontraction (Big Crunch)'; col = pal.red; }
    else if (accFuture > 0) { fate = 'Expansion accélérée'; col = pal.green; }
    else { fate = 'Expansion éternelle (décélérée)'; col = pal.blue; }
    outFate.textContent = fate;
    outFate.style.color = col;
    text(ctx, fate, x1 - 6, y1 + 14, { color: col, size: 13, align: 'right', weight: 800 });
  }

  function update() { refresh(); scene.requestDraw(); }

  sOm.addEventListener('input', () => { Om = parseFloat(sOm.value); update(); });
  sOl.addEventListener('input', () => { Ol = parseFloat(sOl.value); update(); });
  btnLcdm.addEventListener('click', () => {
    Om = 0.3; Ol = 0.7; sOm.value = '0.3'; sOl.value = '0.7'; update();
  });
  btnEds.addEventListener('click', () => {
    Om = 1; Ol = 0; sOm.value = '1'; sOl.value = '0'; update();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="friedmann-fate"]').forEach(init);
