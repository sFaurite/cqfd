import {
  createScene,
  line,
  circle,
  text,
  map,
  clamp,
  fmt,
  prefersReducedMotion,
  type Scene,
  type Palette,
} from './_canvas';

/* ---------- Constantes du crible (vue 1 : grille 2…121) ---------- */

const NMIN = 2;
const NMAX = 121;
const COLS = 10;
const ROWS = (NMAX - NMIN + 1) / COLS; // 12
const STEPS: number[] = [2, 3, 5, 7, 11]; // les premiers ≤ √121
const TOTAL_STEPS = STEPS.length + 1; // + révélation finale des survivants

/* géométrie de la grille (partagée entre draw et le survol) */
const PADX = 12;
const TOPBAND = 32;
const PADB = 10;

/* plus petit facteur premier de chaque composé de la grille */
const spf = new Map<number, number>();
for (let n = NMIN; n <= NMAX; n++) {
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      spf.set(n, d);
      break;
    }
  }
}

/* multiples NOUVELLEMENT rayés par chaque p (spf = p ⇒ ils commencent à p²) */
const targets: number[][] = STEPS.map((p) => {
  const list: number[] = [];
  for (let n = NMIN; n <= NMAX; n++) if (spf.get(n) === p) list.push(n);
  return list;
});
const stepRank = new Map<number, number>();
for (const list of targets) list.forEach((n, i) => stepRank.set(n, i));

/* survivants : les premiers > 11, révélés à la toute fin */
const survivors: number[] = [];
for (let n = NMIN; n <= NMAX; n++) {
  if (!spf.has(n) && !STEPS.includes(n)) survivors.push(n);
}
const survivorRank = new Map<number, number>();
survivors.forEach((n, i) => survivorRank.set(n, i));

/* ---------- Vue 2 : petit crible en mémoire jusqu'à 1000 pour π(x) ---------- */

const PI_MAX = 1000;
const Y_MAX = 180; // ordonnée maximale (π(1000) = 168)

const isPrime = new Uint8Array(PI_MAX + 1).fill(1);
isPrime[0] = 0;
isPrime[1] = 0;
for (let p = 2; p * p <= PI_MAX; p++) {
  if (isPrime[p]) {
    for (let m = p * p; m <= PI_MAX; m += p) isPrime[m] = 0;
  }
}
const primes1000: number[] = [];
const piTab = new Uint16Array(PI_MAX + 1);
{
  let acc = 0;
  for (let x = 0; x <= PI_MAX; x++) {
    if (isPrime[x]) {
      acc++;
      primes1000.push(x);
    }
    piTab[x] = acc;
  }
}

/* ---------- Utilitaires ---------- */

/** Teinte propre à chaque premier du crible. */
function tintOf(p: number, pal: Palette): string {
  switch (p) {
    case 2:
      return pal.blue;
    case 3:
      return pal.green;
    case 5:
      return pal.red;
    case 7:
      return pal.purple;
    default:
      return pal.orange; // 11
  }
}

function factorsOf(n: number): number[] {
  const fs: number[] = [];
  let m = n;
  for (let d = 2; d * d <= m; d++) {
    while (m % d === 0) {
      fs.push(d);
      m /= d;
    }
  }
  if (m > 1) fs.push(m);
  return fs;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type View = 'grid' | 'curve';

/* ---------- Composant ---------- */

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnStep = root.querySelector<HTMLButtonElement>('[data-step]')!;
  const btnAll = root.querySelector<HTMLButtonElement>('[data-all]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const btnGrid = root.querySelector<HTMLButtonElement>('[data-view-grid]')!;
  const btnCurve = root.querySelector<HTMLButtonElement>('[data-view-curve]')!;
  const outStep = root.querySelector<HTMLElement>('[data-out-step]')!;
  const outCount = root.querySelector<HTMLElement>('[data-out-count]')!;
  const outHover = root.querySelector<HTMLElement>('[data-out-hover]')!;

  const reduce = prefersReducedMotion();

  let view: View = 'grid';
  let done = 0; // nombre d'étapes entièrement effectuées (0…TOTAL_STEPS)
  let animating = false;
  let animStep = -1; // étape en cours d'animation
  let animT = 0; // progression 0…1 de l'étape animée
  let chainAll = false; // « Tout cribler » : enchaîne les étapes
  let hoverN: number | null = null;
  let raf = 0;

  const scene = createScene(canvas, draw);

  /* ----- Avancement du crible ----- */

  function advance(all: boolean) {
    if (animating || done >= TOTAL_STEPS) return;
    if (reduce) {
      done = all ? TOTAL_STEPS : done + 1;
      refresh();
      scene.requestDraw();
      return;
    }
    chainAll = all;
    runStep(done);
  }

  function runStep(k: number) {
    animating = true;
    animStep = k;
    animT = 0;
    const count = k < STEPS.length ? targets[k].length : survivors.length;
    const dur = clamp(count * 26, 500, 1500);
    const t0 = performance.now();
    const tick = (now: number) => {
      animT = clamp((now - t0) / dur, 0, 1);
      scene.requestDraw();
      if (animT < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        animating = false;
        animStep = -1;
        done = k + 1;
        refresh();
        if (chainAll && done < TOTAL_STEPS) {
          runStep(done);
        } else {
          chainAll = false;
          scene.requestDraw();
        }
      }
    };
    refresh();
    raf = requestAnimationFrame(tick);
  }

  function reset() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    animating = false;
    animStep = -1;
    animT = 0;
    chainAll = false;
    done = 0;
    refresh();
    scene.requestDraw();
  }

  function setView(v: View) {
    view = v;
    btnGrid.classList.toggle('active', v === 'grid');
    btnCurve.classList.toggle('active', v === 'curve');
    canvas.style.setProperty('aspect-ratio', v === 'grid' ? '16 / 13' : '16 / 9');
    hoverN = null;
    refresh();
    refreshHover();
    scene.requestDraw();
  }

  /* ----- Readouts ----- */

  function refresh() {
    const finished = done >= TOTAL_STEPS;
    btnStep.disabled = finished || animating;
    btnAll.disabled = finished || animating;

    if (view === 'curve') {
      outStep.textContent = 'théorème des nombres premiers : π(x) ∼ x / ln x';
      outCount.textContent = `${fmt(piTab[PI_MAX], 0)} (jusqu’à ${fmt(PI_MAX, 0)})`;
      return;
    }

    const k = animating ? animStep : done - 1;
    if (animating && animStep === STEPS.length) {
      outStep.textContent = '√121 = 11 : plus rien à rayer — tous les survivants sont premiers';
    } else if (k >= 0 && k < STEPS.length) {
      const p = STEPS[k];
      outStep.textContent = `p = ${p} : on commence à p² = ${p * p} — en dessous, tout composé a déjà un facteur plus petit`;
    } else if (finished) {
      outStep.textContent = `crible terminé : π(121) = ${fmt(piTab[NMAX], 0)} — chaque survivant est premier`;
    } else {
      outStep.textContent = 'prochain nombre non rayé : p = 2 — il est forcément premier';
    }

    let count: number;
    if (animating) {
      count = animStep < STEPS.length ? animStep + 1 : STEPS.length;
    } else {
      count = finished ? STEPS.length + survivors.length : Math.min(done, STEPS.length);
    }
    outCount.textContent = fmt(count, 0);
  }

  function refreshHover() {
    if (view !== 'grid' || hoverN === null) {
      outHover.textContent = '—';
      return;
    }
    const f = spf.get(hoverN);
    if (f === undefined) {
      outHover.textContent = `${hoverN} est premier`;
    } else {
      outHover.textContent = `${hoverN} = ${factorsOf(hoverN).join(' × ')} → rayé par p = ${f}`;
    }
  }

  /* ----- Rendu ----- */

  function draw(s: Scene) {
    const { ctx, width: W, height: H } = s;
    ctx.clearRect(0, 0, W, H);
    if (view === 'grid') drawGrid(s);
    else drawCurve(s);
  }

  function drawGrid(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    const cellW = (W - 2 * PADX) / COLS;
    const cellH = (H - TOPBAND - PADB) / ROWS;

    const stepping = animating && animStep < STEPS.length;
    const revealing = animating && animStep === STEPS.length;
    const procN = stepping ? animStep : Math.min(done, STEPS.length);
    const finalDone = done >= TOTAL_STEPS;
    const cutoff = stepping ? Math.floor(animT * targets[animStep].length) : 0;
    const revealCut = revealing ? Math.floor(animT * survivors.length) : 0;

    // légende : la teinte de chaque premier du crible
    const legend = 'multiples rayés par p =';
    ctx.font = '400 11px Inter, system-ui, sans-serif';
    const legendW = ctx.measureText(legend).width;
    text(ctx, legend, PADX, 21, { color: pal.muted, size: 11 });
    let lx = PADX + legendW + 12;
    STEPS.forEach((p, i) => {
      const on = i < procN || (animating && i === animStep);
      ctx.save();
      ctx.globalAlpha = on ? 0.9 : 0.3;
      ctx.fillStyle = tintOf(p, pal);
      ctx.fillRect(lx, 12, 10, 10);
      ctx.restore();
      text(ctx, String(p), lx + 14, 21, {
        color: on ? pal.text : pal.muted,
        size: 11,
        weight: on ? 700 : 400,
      });
      lx += 14 + (p >= 10 ? 14 : 8) + 14;
    });

    const fontSize = Math.max(9, Math.min(15, cellH * 0.46, cellW * 0.36));

    for (let n = NMIN; n <= NMAX; n++) {
      const idx = n - NMIN;
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x = PADX + col * cellW + 1.5;
      const y = TOPBAND + row * cellH + 1.5;
      const w = cellW - 3;
      const h = cellH - 3;

      const si = STEPS.indexOf(n);
      const f = spf.get(n);

      let kind: 'neutre' | 'premier' | 'raye' = 'neutre';
      let tint = '';
      let strong = false; // p courant, ou dernier multiple rayé pendant l'animation

      if (si !== -1 && (si < procN || (animating && si === animStep))) {
        kind = 'premier';
        strong = animating && si === animStep;
      } else if (f !== undefined) {
        const fi = STEPS.indexOf(f);
        const rank = stepRank.get(n) ?? 0;
        if (fi < procN) {
          kind = 'raye';
          tint = tintOf(f, pal);
        } else if (stepping && fi === animStep && rank < cutoff) {
          kind = 'raye';
          tint = tintOf(f, pal);
          strong = rank === cutoff - 1;
        }
      } else if (si === -1) {
        const r = survivorRank.get(n) ?? 0;
        if (finalDone || (revealing && r < revealCut)) kind = 'premier';
      }

      // fond translucide
      if (kind !== 'neutre') {
        ctx.save();
        ctx.globalAlpha = kind === 'premier' ? 0.2 : 0.16;
        ctx.fillStyle = kind === 'premier' ? pal.yellow : tint;
        roundRectPath(ctx, x, y, w, h, 5);
        ctx.fill();
        ctx.restore();
      }

      // bord
      ctx.save();
      if (kind === 'premier') {
        ctx.strokeStyle = pal.yellow;
        ctx.lineWidth = strong ? 2.6 : 1.4;
      } else if (kind === 'raye') {
        ctx.strokeStyle = tint;
        ctx.globalAlpha = strong ? 1 : 0.35;
        ctx.lineWidth = strong ? 2.2 : 1;
      } else {
        ctx.strokeStyle = pal.border;
        ctx.lineWidth = 1;
      }
      roundRectPath(ctx, x, y, w, h, 5);
      ctx.stroke();
      ctx.restore();

      // le nombre
      text(ctx, String(n), x + w / 2, y + h / 2 + 0.5, {
        color: kind === 'premier' ? pal.yellow : kind === 'raye' ? pal.muted : pal.text,
        size: fontSize,
        align: 'center',
        baseline: 'middle',
        weight: kind === 'premier' ? 700 : kind === 'neutre' ? 500 : 400,
      });

      // biffure diagonale des composés
      if (kind === 'raye') {
        ctx.save();
        ctx.globalAlpha = 0.55;
        line(ctx, x + w * 0.2, y + h * 0.76, x + w * 0.8, y + h * 0.24, tint, 1.3);
        ctx.restore();
      }

      // survol
      if (hoverN === n) {
        ctx.save();
        ctx.strokeStyle = pal.text;
        ctx.lineWidth = 1.6;
        roundRectPath(ctx, x - 0.5, y - 0.5, w + 1, h + 1, 5.5);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawCurve(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    const L = 46;
    const R = 16;
    const T = 18;
    const B = 32;
    const xOf = (x: number) => map(x, 0, PI_MAX, L, W - R);
    const yOf = (y: number) => map(y, 0, Y_MAX, H - B, T);

    // grille légère + graduations
    for (let gx = 200; gx <= PI_MAX; gx += 200) {
      line(ctx, xOf(gx), yOf(0), xOf(gx), T, pal.grid, 1);
    }
    for (let gy = 50; gy < Y_MAX; gy += 50) {
      line(ctx, L, yOf(gy), W - R, yOf(gy), pal.grid, 1);
      text(ctx, fmt(gy, 0), L - 6, yOf(gy), {
        color: pal.muted,
        size: 10.5,
        align: 'right',
        baseline: 'middle',
      });
    }
    for (let gx = 0; gx <= PI_MAX; gx += 200) {
      text(ctx, fmt(gx, 0), xOf(gx), H - B + 6, {
        color: pal.muted,
        size: 10.5,
        align: 'center',
        baseline: 'top',
      });
    }

    // axes
    line(ctx, L, yOf(0), W - R, yOf(0), pal.border, 1.5);
    line(ctx, L, yOf(0), L, T, pal.border, 1.5);
    text(ctx, 'combien de premiers ≤ x ?', L + 8, T + 4, {
      color: pal.muted,
      size: 11,
      baseline: 'top',
    });

    // x / ln x : la loi lisse (pointillés)
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = pal.muted;
    ctx.lineWidth = 1.8;
    for (let x = 2; x <= PI_MAX; x += 4) {
      const px = xOf(x);
      const py = yOf(x / Math.log(x));
      if (x === 2) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // π(x) : l'escalier exact
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.yellow;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'miter';
    ctx.moveTo(xOf(0), yOf(0));
    let c = 0;
    for (const p of primes1000) {
      ctx.lineTo(xOf(p), yOf(c));
      c++;
      ctx.lineTo(xOf(p), yOf(c));
    }
    ctx.lineTo(xOf(PI_MAX), yOf(c));
    ctx.stroke();
    ctx.restore();

    // repère x = 121 : là où s'arrête la grille de la vue 1
    const mx = xOf(NMAX);
    const my = yOf(piTab[NMAX]);
    line(ctx, mx, yOf(0), mx, my, pal.blue, 1.2, [3, 4]);
    circle(ctx, mx, my, 3.5, pal.blue);
    text(ctx, `x = 121 : π = ${fmt(piTab[NMAX], 0)} (la grille)`, mx + 8, my - 8, {
      color: pal.blue,
      size: 11,
    });

    // étiquettes des deux courbes
    const piEnd = piTab[PI_MAX];
    const liEnd = PI_MAX / Math.log(PI_MAX);
    text(ctx, `π(x) = ${fmt(piEnd, 0)}`, W - R - 6, yOf(piEnd) - 10, {
      color: pal.yellow,
      size: 12.5,
      align: 'right',
      weight: 700,
    });
    text(ctx, `x / ln x ≈ ${fmt(liEnd, 1)}`, W - R - 6, yOf(liEnd) + 20, {
      color: pal.muted,
      size: 12,
      align: 'right',
      italic: true,
    });
  }

  /* ----- Survol de la grille ----- */

  function cellAt(px: number, py: number): number | null {
    const W = scene.width;
    const cellW = (W - 2 * PADX) / COLS;
    const cellH = (scene.height - TOPBAND - PADB) / ROWS;
    const col = Math.floor((px - PADX) / cellW);
    const row = Math.floor((py - TOPBAND) / cellH);
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
    return NMIN + row * COLS + col;
  }

  canvas.addEventListener('pointermove', (e) => {
    if (view !== 'grid') return;
    const rect = canvas.getBoundingClientRect();
    const n = cellAt(e.clientX - rect.left, e.clientY - rect.top);
    if (n !== hoverN) {
      hoverN = n;
      refreshHover();
      scene.requestDraw();
    }
  });
  canvas.addEventListener('pointerleave', () => {
    if (hoverN !== null) {
      hoverN = null;
      refreshHover();
      scene.requestDraw();
    }
  });

  /* ----- Boutons ----- */

  btnStep.addEventListener('click', () => advance(false));
  btnAll.addEventListener('click', () => advance(true));
  btnReset.addEventListener('click', reset);
  btnGrid.addEventListener('click', () => setView('grid'));
  btnCurve.addEventListener('click', () => setView('curve'));

  refresh();
  refreshHover();
}

document.querySelectorAll<HTMLElement>('[data-iw="maths-crible-eratosthene"]').forEach(init);
