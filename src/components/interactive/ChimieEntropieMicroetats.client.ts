import { createScene, circle, text, fmt, prefersReducedMotion, type Scene } from './_canvas';

/** Coefficient binomial / multinomial via produit. */
function multinomial(total: number, parts: number[]): number {
  // total! / (p0! p1! ...)
  let num = 1;
  for (let k = 2; k <= total; k++) num *= k;
  for (const p of parts) {
    let d = 1;
    for (let k = 2; k <= p; k++) d *= k;
    num /= d;
  }
  return Math.round(num);
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sN = root.querySelector<HTMLInputElement>('[data-n]')!;
  const sCases = root.querySelector<HTMLInputElement>('[data-cases]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outCases = root.querySelector<HTMLElement>('[data-out-cases]')!;
  const outMacro = root.querySelector<HTMLElement>('[data-out-macro]')!;
  const outOmega = root.querySelector<HTMLElement>('[data-out-omega]')!;
  const outOmegaTot = root.querySelector<HTMLElement>('[data-out-omegatot]')!;
  const outS = root.querySelector<HTMLElement>('[data-out-s]')!;
  const btnShuffle = root.querySelector<HTMLButtonElement>('[data-shuffle]')!;
  const btnPlay = root.querySelector<HTMLButtonElement>('[data-play]')!;

  let N = +sN.value;
  let C = +sCases.value;
  // assignment[i] = index de case de la particule i
  let assign: number[] = [];
  let playing = false;
  let lastTick = 0;

  const scene = createScene(canvas, draw);

  function randomize() {
    assign = Array.from({ length: N }, () => Math.floor(Math.random() * C));
  }
  function counts(): number[] {
    const c = new Array(C).fill(0);
    for (const a of assign) c[a]++;
    return c;
  }

  function refresh() {
    if (assign.length !== N) randomize();
    const c = counts();
    const omega = multinomial(N, c);
    const omegaTot = Math.pow(C, N);
    const S = Math.log(omega); // en unités de k
    outN.textContent = String(N);
    outCases.textContent = String(C);
    outMacro.textContent = c.join(' | ');
    outOmega.textContent = omega.toLocaleString('fr-FR');
    outOmegaTot.textContent = omegaTot.toLocaleString('fr-FR');
    outS.textContent = `${fmt(S, 2)} k`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    if (assign.length !== N) randomize();
    const c = counts();

    const padX = 16, padTop = 28, padBot = 70;
    const boxGap = 10;
    const boxW = (W - padX * 2 - boxGap * (C - 1)) / C;
    const boxH = H - padTop - padBot;

    text(ctx, 'Un micro-état (particules numérotées réparties dans les cases)', padX, 16, {
      color: pal.text, size: 13, weight: 700, baseline: 'middle',
    });

    // Place les particules dans leur case (grille interne).
    const palette = [pal.blue, pal.green, pal.purple, pal.teal, pal.yellow, pal.red];
    const perBox: number[][] = Array.from({ length: C }, () => []);
    assign.forEach((box, i) => perBox[box].push(i));

    for (let b = 0; b < C; b++) {
      const bx = padX + b * (boxW + boxGap);
      const by = padTop;
      // boîte
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(bx, by, boxW, boxH);
      ctx.fillStyle = pal.surface;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(bx, by, boxW, boxH);
      ctx.globalAlpha = 1;

      // particules dans une grille
      const ps = perBox[b];
      const cols = Math.ceil(Math.sqrt(Math.max(ps.length, 1)) * (boxW / boxH) ** 0.5) || 1;
      const rcols = Math.max(1, Math.min(cols, 5));
      const rrows = Math.ceil(ps.length / rcols);
      const r = Math.min(boxW / (rcols + 1.2), boxH / (rrows + 1.2)) * 0.42;
      ps.forEach((pi, k) => {
        const cxx = bx + boxW * ((k % rcols) + 1) / (rcols + 1);
        const cyy = by + boxH * (Math.floor(k / rcols) + 1) / (rrows + 1);
        circle(ctx, cxx, cyy, r, palette[pi % palette.length], pal.bgElev, 1.5);
        if (r > 7) {
          text(ctx, String(pi + 1), cxx, cyy, {
            color: '#04121a', size: r * 0.95, weight: 700, align: 'center', baseline: 'middle',
          });
        }
      });

      // compte dans la case
      text(ctx, `${c[b]}`, bx + boxW / 2, by + boxH + 16, {
        color: pal.yellow, size: 14, weight: 700, align: 'center', baseline: 'middle',
      });
      text(ctx, `case ${b + 1}`, bx + boxW / 2, by + boxH + 32, {
        color: pal.muted, size: 11, align: 'center', baseline: 'middle',
      });
    }

    // Barre de multiplicité (Ω du macro-état courant vs Ω max possible).
    const omega = multinomial(N, c);
    const maxC = mostEven(N, C);
    const omegaMax = multinomial(N, maxC);
    const frac = omega / omegaMax;
    const barY = H - 22;
    const barW = W - padX * 2;
    ctx.fillStyle = pal.surface;
    ctx.fillRect(padX, barY, barW, 8);
    ctx.fillStyle = frac > 0.5 ? pal.green : pal.blue;
    ctx.fillRect(padX, barY, barW * frac, 8);
    text(ctx, `Ω = ${omega.toLocaleString('fr-FR')}  (max pour N,C : ${omegaMax.toLocaleString('fr-FR')})`,
      padX, barY - 8, { color: pal.muted, size: 11, baseline: 'alphabetic' });
  }

  /** Répartition la plus équilibrée de N dans C cases (maximise Ω). */
  function mostEven(n: number, cc: number): number[] {
    const base = Math.floor(n / cc);
    const rem = n % cc;
    return Array.from({ length: cc }, (_, i) => base + (i < rem ? 1 : 0));
  }

  function setPlaying(on: boolean) {
    playing = on;
    btnPlay.textContent = on ? '❚❚ Pause' : '▶ Animer';
    btnPlay.classList.toggle('active', on);
    if (on && !prefersReducedMotion()) requestAnimationFrame(loop);
  }
  function loop(t: number) {
    if (!playing) return;
    if (t - lastTick > 280) {
      lastTick = t;
      randomize();
      refresh();
      scene.requestDraw();
    }
    requestAnimationFrame(loop);
  }

  sN.addEventListener('input', () => { N = +sN.value; randomize(); refresh(); scene.requestDraw(); });
  sCases.addEventListener('input', () => { C = +sCases.value; randomize(); refresh(); scene.requestDraw(); });
  btnShuffle.addEventListener('click', () => { randomize(); refresh(); scene.requestDraw(); });
  btnPlay.addEventListener('click', () => setPlaying(!playing));

  randomize();
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-entropie"]').forEach(init);
