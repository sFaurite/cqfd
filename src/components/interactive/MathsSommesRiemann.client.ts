import { createScene, line, text, map, fmt, prefersReducedMotion, type Scene } from './_canvas';

type Mode = 'inf' | 'sup' | 'both';

interface Tick {
  x: number;
  label: string;
}

interface FnDef {
  /** nom affiché de la fonction */
  label: string;
  a: number;
  b: number;
  f: (x: number) => number;
  /** points critiques intérieurs (extremums locaux) : indispensables pour le VRAI inf/sup */
  crit: number[];
  exact: number;
  exactLabel: string;
  ticks: Tick[];
}

const TICKS01: Tick[] = [
  { x: 0, label: '0' },
  { x: 0.5, label: '0,5' },
  { x: 1, label: '1' },
];

const FNS: Record<string, FnDef> = {
  x2: {
    label: 'x²',
    a: 0,
    b: 1,
    f: (x) => x * x,
    crit: [],
    exact: 1 / 3,
    exactLabel: '1/3',
    ticks: TICKS01,
  },
  sin: {
    label: 'sin x',
    a: 0,
    b: Math.PI,
    f: Math.sin,
    crit: [Math.PI / 2], // maximum intérieur : sup = 1 si π/2 est dans le sous-intervalle
    exact: 2,
    exactLabel: '2',
    ticks: [
      { x: 0, label: '0' },
      { x: Math.PI / 2, label: 'π/2' },
      { x: Math.PI, label: 'π' },
    ],
  },
  sqrt: {
    label: '√x',
    a: 0,
    b: 1,
    f: Math.sqrt,
    crit: [],
    exact: 2 / 3,
    exactLabel: '2/3',
    ticks: TICKS01,
  },
  inv: {
    label: '1/(1+x²)',
    a: 0,
    b: 1,
    f: (x) => 1 / (1 + x * x),
    crit: [],
    exact: Math.PI / 4,
    exactLabel: 'π/4',
    ticks: TICKS01,
  },
};

interface Darboux {
  lo: number; // s(n)
  hi: number; // S(n)
  infs: number[];
  sups: number[];
}

/**
 * Sommes de Darboux exactes : sur chaque sous-intervalle, l'inf et le sup de f
 * sont atteints aux bornes OU en un point critique intérieur (f est monotone
 * par morceaux entre ses points critiques).
 */
function darboux(def: FnDef, n: number): Darboux {
  const dx = (def.b - def.a) / n;
  const infs: number[] = [];
  const sups: number[] = [];
  let lo = 0;
  let hi = 0;
  for (let i = 0; i < n; i++) {
    const x0 = def.a + i * dx;
    const x1 = def.a + (i + 1) * dx;
    let m = Math.min(def.f(x0), def.f(x1));
    let M = Math.max(def.f(x0), def.f(x1));
    for (const c of def.crit) {
      if (c > x0 && c < x1) {
        const v = def.f(c);
        if (v < m) m = v;
        if (v > M) M = v;
      }
    }
    infs.push(m);
    sups.push(M);
    lo += m * dx;
    hi += M * dx;
  }
  return { lo, hi, infs, sups };
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const select = root.querySelector<HTMLSelectElement>('[data-f]')!;
  const slider = root.querySelector<HTMLInputElement>('[data-n]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outLo = root.querySelector<HTMLElement>('[data-out-lo]')!;
  const outHi = root.querySelector<HTMLElement>('[data-out-hi]')!;
  const outGap = root.querySelector<HTMLElement>('[data-out-gap]')!;
  const outExact = root.querySelector<HTMLElement>('[data-out-exact]')!;
  const modeBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-mode]'));
  const refineBtn = root.querySelector<HTMLButtonElement>('[data-refine]')!;

  let fn: FnDef = FNS[select.value] ?? FNS.x2!;
  let n = parseInt(slider.value, 10);
  let mode: Mode = 'both';
  let sums: Darboux = darboux(fn, n);
  let animRaf = 0;

  const scene = createScene(canvas, draw);

  function refresh() {
    sums = darboux(fn, n);
    outN.textContent = String(n);
    outLo.textContent = fmt(sums.lo, 4);
    outHi.textContent = fmt(sums.hi, 4);
    outGap.textContent = fmt(sums.hi - sums.lo, 4);
    outExact.textContent = `${fn.exactLabel} ≈ ${fmt(fn.exact, 4)}`;
  }

  /** petit carré coloré + libellé, aligné à droite ; renvoie le bord gauche atteint */
  function legendItem(
    ctx: CanvasRenderingContext2D,
    label: string,
    color: string,
    mutedColor: string,
    right: number,
    y: number,
  ): number {
    ctx.save();
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    const tw = ctx.measureText(label).width;
    ctx.restore();
    text(ctx, label, right, y, { color: mutedColor, size: 11, align: 'right', baseline: 'middle', weight: 600 });
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = color;
    ctx.fillRect(right - tw - 14, y - 4.5, 9, 9);
    ctx.restore();
    return right - tw - 26;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 42;
    const padR = 14;
    const padT = 10;
    const padB = 30;
    const yTop = 1.16; // marge au-dessus de max f = 1 (bande pour les libellés)
    const xOf = (v: number) => map(v, fn.a, fn.b, padL, W - padR);
    const yOf = (v: number) => map(v, 0, yTop, H - padB, padT);
    const y0 = yOf(0);

    // grille horizontale
    for (const g of [0.5, 1]) {
      line(ctx, padL, yOf(g), W - padR, yOf(g), pal.grid, 1);
    }

    // rectangles de Darboux
    const dx = (fn.b - fn.a) / n;
    const strokeOk = n <= 60; // au-delà, les contours brouillent plus qu'ils n'aident
    for (let i = 0; i < n; i++) {
      const px0 = xOf(fn.a + i * dx);
      const px1 = xOf(fn.a + (i + 1) * dx);
      const w = px1 - px0;
      const yInf = yOf(sums.infs[i] ?? 0);
      const ySup = yOf(sums.sups[i] ?? 0);

      if (mode === 'inf' || mode === 'both') {
        // aire s(n) : sous l'inf, en bleu
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = pal.blue;
        ctx.fillRect(px0, yInf, w, y0 - yInf);
        ctx.restore();
      }
      if (mode === 'sup') {
        // aire S(n) entière, en rouge
        ctx.save();
        ctx.globalAlpha = 0.26;
        ctx.fillStyle = pal.red;
        ctx.fillRect(px0, ySup, w, y0 - ySup);
        ctx.restore();
      } else if (mode === 'both') {
        // seule la bande entre inf et sup : l'aire rouge visible EST S − s
        ctx.save();
        ctx.globalAlpha = 0.38;
        ctx.fillStyle = pal.red;
        ctx.fillRect(px0, ySup, w, yInf - ySup);
        ctx.restore();
      }
      if (strokeOk) {
        ctx.save();
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1;
        if (mode === 'inf' || mode === 'both') {
          ctx.strokeStyle = pal.blue;
          ctx.strokeRect(px0, yInf, w, y0 - yInf);
        }
        if (mode === 'sup' || mode === 'both') {
          ctx.strokeStyle = pal.red;
          ctx.strokeRect(px0, ySup, w, (mode === 'both' ? yInf : y0) - ySup);
        }
        ctx.restore();
      }
    }

    // axes
    line(ctx, padL, y0, W - padR, y0, pal.border, 1.5);
    line(ctx, padL, y0, padL, padT, pal.border, 1.5);
    for (const t of fn.ticks) {
      const px = xOf(t.x);
      line(ctx, px, y0, px, y0 + 5, pal.muted, 1);
      text(ctx, t.label, px, y0 + 9, { color: pal.muted, size: 11, align: 'center', baseline: 'top' });
    }
    for (const g of [0.5, 1]) {
      text(ctx, fmt(g, g === 0.5 ? 1 : 0), padL - 7, yOf(g), {
        color: pal.muted,
        size: 11,
        align: 'right',
        baseline: 'middle',
      });
    }

    // la courbe
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = pal.yellow;
    ctx.lineJoin = 'round';
    const steps = Math.max(160, Math.floor(W));
    for (let k = 0; k <= steps; k++) {
      const xv = fn.a + ((fn.b - fn.a) * k) / steps;
      const px = xOf(xv);
      const py = yOf(fn.f(xv));
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // libellés
    text(ctx, `f(x) = ${fn.label}`, padL + 8, padT + 9, {
      color: pal.yellow,
      size: 13,
      weight: 700,
      baseline: 'middle',
    });
    const ly = padT + 9;
    let lx = W - padR - 2;
    if (mode === 'both') {
      lx = legendItem(ctx, 'écart S − s', pal.red, pal.muted, lx, ly);
      legendItem(ctx, 's(n)', pal.blue, pal.muted, lx, ly);
    } else if (mode === 'inf') {
      legendItem(ctx, 's(n) : hauteurs = inf de f', pal.blue, pal.muted, lx, ly);
    } else {
      legendItem(ctx, 'S(n) : hauteurs = sup de f', pal.red, pal.muted, lx, ly);
    }
  }

  function stopAnim() {
    if (animRaf) {
      cancelAnimationFrame(animRaf);
      animRaf = 0;
    }
  }

  function setN(value: number) {
    n = Math.round(value);
    slider.value = String(n);
    refresh();
    scene.requestDraw();
  }

  function refine() {
    stopAnim();
    const target = 200;
    if (prefersReducedMotion() || n >= target) {
      setN(target);
      return;
    }
    const start = n;
    const dur = 2200;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3); // décélération douce
      setN(start + (target - start) * e);
      animRaf = t < 1 ? requestAnimationFrame(step) : 0;
    };
    animRaf = requestAnimationFrame(step);
  }

  select.addEventListener('change', () => {
    stopAnim();
    fn = FNS[select.value] ?? fn;
    refresh();
    scene.requestDraw();
  });
  slider.addEventListener('input', () => {
    stopAnim();
    setN(parseInt(slider.value, 10));
  });
  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = (btn.dataset.mode as Mode | undefined) ?? 'both';
      modeBtns.forEach((o) => o.classList.toggle('active', o === btn));
      scene.requestDraw();
    });
  });
  refineBtn.addEventListener('click', refine);

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="maths-sommes-riemann"]').forEach(init);
