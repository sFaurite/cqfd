import { createScene, circle, text, line, fmt, prefersReducedMotion, type Scene } from './_canvas';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sg = root.querySelector<HTMLInputElement>('[data-g]')!;
  const outG = root.querySelector<HTMLElement>('[data-out-g]')!;
  const outM = root.querySelector<HTMLElement>('[data-out-m]')!;
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]')!;

  let gAdj = parseFloat(sg.value);
  let playing = !prefersReducedMotion();
  let last = 0;

  // couleurs résolues au draw via la palette
  const lanes = [
    { nom: 'photon γ', g: 0, c: 'yellow', x: 0.05 },
    { nom: 'électron', g: 0.18, c: 'teal', x: 0.05 },
    { nom: 'quark top', g: 1.0, c: 'purple', x: 0.05 },
    { nom: 'réglable', g: gAdj, c: 'blue', x: 0.05 },
  ];

  const scene = createScene(canvas, draw);
  const speed = (g: number) => 1 / (1 + 4 * g); // facteur de vitesse

  function refresh() {
    outG.textContent = fmt(gAdj, 2);
    outM.textContent = gAdj < 0.01 ? '≈ 0 (comme le photon)' : `∝ ${fmt(gAdj, 2)} (couplage)`;
    lanes[3].g = gAdj;
  }

  function setPlay(p: boolean) {
    playing = p;
    playBtn.textContent = p ? '⏸ Pause' : '▶ Lecture';
    if (p) {
      last = 0;
      requestAnimationFrame(loop);
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    const colorOf: Record<string, string> = {
      yellow: pal.yellow,
      teal: pal.teal,
      purple: pal.purple,
      blue: pal.blue,
    };
    ctx.clearRect(0, 0, W, H);

    // fond « champ de Higgs » (semis de points)
    ctx.save();
    ctx.fillStyle = pal.grid;
    for (let yy = 16; yy < H; yy += 22) {
      for (let xx = 16; xx < W; xx += 22) {
        ctx.beginPath();
        ctx.arc(xx + (yy % 44 === 0 ? 11 : 0), yy, 1.4, 0, 7);
        ctx.fill();
      }
    }
    ctx.restore();
    text(ctx, 'champ de Higgs (partout)', W - 10, 16, { color: pal.muted, size: 11, align: 'right' });

    const laneH = H / lanes.length;
    const xStart = W * 0.12;
    const xEnd = W * 0.92;
    lanes.forEach((ln, i) => {
      const y = laneH * (i + 0.5);
      line(ctx, xStart, y, xEnd, y, pal.border, 1, [2, 4]);
      const px = xStart + ln.x * (xEnd - xStart);
      const col = colorOf[ln.c] ?? pal.blue;
      // taille ∝ couplage (image de la « masse »)
      const r = 6 + ln.g * 9;
      circle(ctx, px, y, r, col);
      text(ctx, ln.nom, xStart - 6, y, { color: pal.text, size: 11, align: 'right', baseline: 'middle' });
      text(ctx, ln.g === 0 ? 'g = 0' : `g = ${fmt(ln.g, 2)}`, xEnd + 6, y, {
        color: pal.muted,
        size: 10,
        baseline: 'middle',
      });
    });
  }

  function loop(ts: number) {
    if (!playing) return;
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    for (const ln of lanes) {
      ln.x += speed(ln.g) * dt * 0.5;
      if (ln.x > 1) ln.x = 0;
    }
    scene.requestDraw();
    requestAnimationFrame(loop);
  }

  sg.addEventListener('input', () => {
    gAdj = parseFloat(sg.value);
    refresh();
    scene.requestDraw();
  });
  playBtn.addEventListener('click', () => setPlay(!playing));

  refresh();
  if (playing) requestAnimationFrame(loop);
  else playBtn.textContent = '▶ Lecture';
}

document.querySelectorAll<HTMLElement>('[data-iw="higgs"]').forEach(init);
