import { createScene, line, circle, text, arrow, clamp, fmt, prefersReducedMotion, type Scene } from './_canvas';

/* ---------- Algèbre de D₃ ---------- */
/** Élément i ∈ {0,…,5} : i = 3b + a ↔ sᵇrᵃ (b ∈ {0,1}, a ∈ {0,1,2}). */
const NAMES = ['e', 'r', 'r²', 's', 'sr', 'sr²'];

/** Produit x·y dans D₃ = appliquer y PUIS x (composition de fonctions x∘y). */
function mul(x: number, y: number): number {
  const bx = x >= 3 ? 1 : 0;
  const ax = x % 3;
  const by = y >= 3 ? 1 : 0;
  const ay = y % 3;
  // sᵇˣrᵃˣ · sᵇʸrᵃʸ = s^(bx+by) r^((−1)^by·ax + ay)   (car r·s = s·r⁻¹)
  const b = (bx + by) % 2;
  const a = ((((by === 1 ? -ax : ax) + ay) % 3) + 3) % 3;
  return b * 3 + a;
}

/* ---------- Géométrie (matrices 2×2, coordonnées écran) ---------- */
type Mat = [number, number, number, number]; // [m00, m01, m10, m11]

const ANG = (-2 * Math.PI) / 3; // r : 120° dans le sens antihoraire à l'écran
const rot = (t: number): Mat => [Math.cos(t), -Math.sin(t), Math.sin(t), Math.cos(t)];
const REFL: Mat = [-1, 0, 0, 1]; // s : retournement autour de l'axe vertical
const mmul = (A: Mat, B: Mat): Mat => [
  A[0] * B[0] + A[1] * B[2],
  A[0] * B[1] + A[1] * B[3],
  A[2] * B[0] + A[3] * B[2],
  A[2] * B[1] + A[3] * B[3],
];

/** Matrice de l'élément i (forme normale sᵇ·rᵃ). */
function matOf(i: number): Mat {
  const R = rot(ANG * (i % 3));
  return i >= 3 ? mmul(REFL, R) : R;
}

/** Angle de l'axe de la réflexion i (i ≥ 3) : M = [cos2φ, sin2φ; sin2φ, −cos2φ]. */
function axisOf(i: number): number {
  const M = matOf(i);
  return Math.atan2(M[2], M[0]) / 2;
}

/** Retournement progressif autour de l'axe φ : u = 0 → identité, u = 1 → réflexion. */
function flipAt(phi: number, u: number): Mat {
  const k = Math.cos(Math.PI * u);
  const c = Math.cos(phi);
  const sn = Math.sin(phi);
  return [c * c + k * sn * sn, (1 - k) * sn * c, (1 - k) * sn * c, sn * sn + k * c * c];
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Anim {
  elem: number;
  base: Mat;
  kind: 'rot' | 'flip';
  angle: number;
  axis: number;
  start: number;
  dur: number;
  u: number; // progression (déjà lissée)
}

function labelOf(el: number): string {
  if (el === 0) return 'on applique e : rien ne bouge';
  if (el < 3) return `on applique ${NAMES[el]} : rotation de ${fmt(120 * el, 0)}°`;
  return `on applique ${NAMES[el]} : retournement (axe en pointillés)`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selFirst = root.querySelector<HTMLSelectElement>('[data-g]')!;
  const selThen = root.querySelector<HTMLSelectElement>('[data-h]')!;
  const btnCompose = root.querySelector<HTMLButtonElement>('[data-compose]')!;
  const btnSwap = root.querySelector<HTMLButtonElement>('[data-swap]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const outState = root.querySelector<HTMLElement>('[data-out-state]')!;
  const outComp = root.querySelector<HTMLElement>('[data-out-comp]')!;
  const outCmp = root.querySelector<HTMLElement>('[data-out-cmp]')!;

  let state = 0; // élément courant du groupe (position du triangle)
  let queue: number[] = [];
  let onDone: (() => void) | null = null;
  let anim: Anim | null = null;
  let caption = '';
  let timer = 0;
  let raf = 0;
  let hlA: { row: number; col: number } | null = null; // case h∘g (jaune)
  let hlB: { row: number; col: number } | null = null; // case g∘h (rouge)

  const scene = createScene(canvas, draw);

  function refreshState() {
    outState.textContent = NAMES[state];
  }

  function cancelAll() {
    queue = [];
    onDone = null;
    anim = null;
    caption = '';
    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  /** Repart de e, applique les éléments l'un après l'autre, puis appelle done. */
  function startSequence(elems: number[], done: () => void) {
    cancelAll();
    state = 0;
    refreshState();
    if (prefersReducedMotion()) {
      for (const el of elems) state = mul(el, state);
      refreshState();
      done();
      scene.requestDraw();
      return;
    }
    queue = elems.slice();
    onDone = done;
    scene.requestDraw();
    timer = window.setTimeout(nextStep, 140);
  }

  function nextStep() {
    timer = 0;
    const el = queue.shift();
    if (el === undefined) {
      caption = '';
      const cb = onDone;
      onDone = null;
      if (cb) cb();
      scene.requestDraw();
      return;
    }
    caption = labelOf(el);
    if (el === 0) {
      // identité : rien à animer, petite pause pour lire la légende
      scene.requestDraw();
      timer = window.setTimeout(nextStep, 420);
      return;
    }
    anim = {
      elem: el,
      base: matOf(state),
      kind: el >= 3 ? 'flip' : 'rot',
      angle: ANG * (el % 3),
      axis: el >= 3 ? axisOf(el) : 0,
      start: performance.now(),
      dur: el >= 3 ? 800 : 380 + 380 * (el % 3),
      u: 0,
    };
    scene.requestDraw();
    raf = requestAnimationFrame(tick);
  }

  function tick(now: number) {
    raf = 0;
    const a = anim;
    if (!a) return;
    const t = clamp((now - a.start) / a.dur, 0, 1);
    a.u = ease(t);
    scene.requestDraw();
    if (t >= 1) {
      state = mul(a.elem, state);
      anim = null;
      refreshState();
      timer = window.setTimeout(nextStep, 180);
    } else {
      raf = requestAnimationFrame(tick);
    }
  }

  function renderMat(): Mat {
    if (!anim) return matOf(state);
    const A = anim.kind === 'rot' ? rot(anim.angle * anim.u) : flipAt(anim.axis, anim.u);
    return mmul(A, anim.base);
  }

  /* ---------- Rendu ---------- */

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const split = W * 0.46;
    line(ctx, split, 14, split, H - 14, pal.border, 1, [3, 5]);
    drawTriangle(s, 0, split);
    drawTable(s, split, W);
  }

  function drawTriangle(s: Scene, x0: number, x1: number) {
    const { ctx, height: H, pal } = s;
    const cx = (x0 + x1) / 2;
    const cy = H * 0.53;
    const R = Math.min((x1 - x0) * 0.34, H * 0.3);
    const vColors = [pal.blue, pal.green, pal.red];
    const vNames = ['A', 'B', 'C'];
    const M = renderMat();

    text(ctx, `état : ${NAMES[state]}`, cx, 20, { color: pal.yellow, size: 14, align: 'center', weight: 700 });

    // gabarit fixe : les 3 emplacements (triangle en pointillés)
    const home: Array<[number, number]> = [];
    for (let k = 0; k < 3; k++) {
      const a = -Math.PI / 2 + k * ANG;
      home.push([R * Math.cos(a), R * Math.sin(a)]);
    }
    ctx.save();
    ctx.strokeStyle = pal.border;
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    home.forEach(([hx, hy], k) => (k === 0 ? ctx.moveTo(cx + hx, cy + hy) : ctx.lineTo(cx + hx, cy + hy)));
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // axe du retournement en cours
    if (anim && anim.kind === 'flip') {
      const dx = Math.cos(anim.axis);
      const dy = Math.sin(anim.axis);
      line(ctx, cx - dx * R * 1.45, cy - dy * R * 1.45, cx + dx * R * 1.45, cy + dy * R * 1.45, pal.yellow, 1.6, [6, 5]);
    }

    // arc fléché de la rotation en cours
    if (anim && anim.kind === 'rot') {
      const a0 = -Math.PI / 2 + 0.22;
      const sweep = anim.angle * anim.u;
      if (Math.abs(sweep) > 0.03) {
        const rr = R * 1.3;
        ctx.save();
        ctx.strokeStyle = pal.yellow;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, a0, a0 + sweep, sweep < 0);
        ctx.stroke();
        ctx.restore();
        const ae = a0 + sweep;
        const sgn = Math.sign(sweep);
        const px = cx + rr * Math.cos(ae);
        const py = cy + rr * Math.sin(ae);
        const tx = -Math.sin(ae) * sgn;
        const ty = Math.cos(ae) * sgn;
        arrow(ctx, px - tx, py - ty, px + tx * 7, py + ty * 7, pal.yellow, 2, 8);
      }
    }

    // triangle courant : sommets = images des emplacements par la matrice M
    const pos = home.map(([hx, hy]): [number, number] => [cx + M[0] * hx + M[1] * hy, cy + M[2] * hx + M[3] * hy]);
    ctx.save();
    ctx.beginPath();
    pos.forEach(([px, py], k) => (k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
    ctx.closePath();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = pal.blue;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.muted;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    pos.forEach(([px, py], k) => {
      circle(ctx, px, py, 13, vColors[k], pal.bgElev, 2);
      text(ctx, vNames[k], px, py, { color: pal.bg, size: 13, align: 'center', baseline: 'middle', weight: 800 });
    });

    if (caption) {
      text(ctx, caption, cx, H - 10, { color: pal.muted, size: 11, align: 'center' });
    }
  }

  function drawTable(s: Scene, x0: number, x1: number) {
    const { ctx, height: H, pal } = s;
    const pad = 10;
    const titleH = 22;
    const legendH = 18;
    const availW = x1 - x0 - 2 * pad - 6;
    const availH = H - titleH - legendH - 2 * pad;
    const cell = Math.min(availW / 7, availH / 7);
    const gx = x0 + 6 + pad + (availW - 7 * cell) / 2;
    const gy = titleH + pad + (availH - 7 * cell) / 2;
    const fs = clamp(cell * 0.38, 8, 13);

    text(ctx, 'table de Cayley — case (ligne h, colonne g) = h ∘ g', (x0 + x1) / 2 + 3, 15, {
      color: pal.muted,
      size: 10.5,
      align: 'center',
    });

    // fond des en-têtes
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = pal.surface;
    ctx.fillRect(gx, gy, 7 * cell, cell);
    ctx.fillRect(gx, gy + cell, cell, 6 * cell);
    ctx.restore();

    // cases surlignées (h∘g en jaune, g∘h en rouge)
    const paint = (row: number, col: number, colr: string, alpha: number) => {
      const x = gx + (col + 1) * cell;
      const y = gy + (row + 1) * cell;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colr;
      ctx.fillRect(x, y, cell, cell);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colr;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, cell - 2, cell - 2);
      ctx.restore();
    };
    if (hlA) paint(hlA.row, hlA.col, pal.yellow, 0.22);
    if (hlB && !(hlA && hlA.row === hlB.row && hlA.col === hlB.col)) paint(hlB.row, hlB.col, pal.red, 0.18);

    // grille
    for (let t = 0; t <= 7; t++) {
      const w = t === 1 ? 1.6 : 1;
      const c = t === 1 ? pal.muted : pal.border;
      line(ctx, gx + t * cell, gy, gx + t * cell, gy + 7 * cell, c, w);
      line(ctx, gx, gy + t * cell, gx + 7 * cell, gy + t * cell, c, w);
    }

    // en-têtes
    text(ctx, '∘', gx + cell / 2, gy + cell / 2, {
      color: pal.muted,
      size: fs,
      align: 'center',
      baseline: 'middle',
      weight: 700,
    });
    for (let k = 0; k < 6; k++) {
      const isColSel = hlA !== null && hlA.col === k;
      const isRowSel = hlA !== null && hlA.row === k;
      text(ctx, NAMES[k], gx + (k + 1.5) * cell, gy + cell / 2, {
        color: isColSel ? pal.yellow : pal.muted,
        size: fs,
        align: 'center',
        baseline: 'middle',
        weight: 700,
      });
      text(ctx, NAMES[k], gx + cell / 2, gy + (k + 1.5) * cell, {
        color: isRowSel ? pal.yellow : pal.muted,
        size: fs,
        align: 'center',
        baseline: 'middle',
        weight: 700,
      });
    }

    // contenu : mul(h, g) = h∘g, rotations en bleu, retournements en orange
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const v = mul(i, j);
        text(ctx, NAMES[v], gx + (j + 1.5) * cell, gy + (i + 1.5) * cell, {
          color: v < 3 ? pal.blue : pal.orange,
          size: fs,
          align: 'center',
          baseline: 'middle',
          weight: 600,
        });
      }
    }

    // légende sous la table
    const ly = gy + 7 * cell + 11;
    const cxm = gx + 3.5 * cell;
    if (hlB) {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = pal.yellow;
      ctx.fillRect(cxm - 58, ly - 4, 8, 8);
      ctx.fillStyle = pal.red;
      ctx.fillRect(cxm + 10, ly - 4, 8, 8);
      ctx.restore();
      text(ctx, 'h∘g', cxm - 46, ly, { color: pal.muted, size: 10, baseline: 'middle' });
      text(ctx, 'g∘h', cxm + 22, ly, { color: pal.muted, size: 10, baseline: 'middle' });
    } else {
      text(ctx, 'bleu : rotations · orange : retournements', cxm, ly, {
        color: pal.muted,
        size: 10,
        align: 'center',
        baseline: 'middle',
      });
    }
  }

  /* ---------- Interactions ---------- */

  const readSel = (sel: HTMLSelectElement) => clamp(parseInt(sel.value, 10) || 0, 0, 5);

  btnCompose.addEventListener('click', () => {
    const g = readSel(selFirst);
    const h = readSel(selThen);
    const hg = mul(h, g);
    hlA = null;
    hlB = null;
    outComp.textContent = `${NAMES[h]} ∘ ${NAMES[g]} = ${NAMES[hg]}`;
    outCmp.textContent = `on applique ${NAMES[g]}, puis ${NAMES[h]}…`;
    startSequence([g, h], () => {
      hlA = { row: h, col: g };
      outCmp.textContent = `g puis h → ${NAMES[hg]}. Essayez « Inverser l’ordre ».`;
      scene.requestDraw();
    });
  });

  btnSwap.addEventListener('click', () => {
    const g = readSel(selFirst);
    const h = readSel(selThen);
    const hg = mul(h, g);
    const gh = mul(g, h);
    outComp.textContent = `${NAMES[g]} ∘ ${NAMES[h]} = ${NAMES[gh]}`;
    outCmp.textContent = `on applique ${NAMES[h]}, puis ${NAMES[g]}…`;
    startSequence([h, g], () => {
      hlA = { row: h, col: g };
      hlB = { row: g, col: h };
      outCmp.textContent =
        hg === gh
          ? `ici ${NAMES[g]} et ${NAMES[h]} commutent : ${NAMES[h]}∘${NAMES[g]} = ${NAMES[g]}∘${NAMES[h]} = ${NAMES[gh]}`
          : `${NAMES[h]}∘${NAMES[g]} = ${NAMES[hg]} mais ${NAMES[g]}∘${NAMES[h]} = ${NAMES[gh]} : l’ordre compte !`;
      scene.requestDraw();
    });
  });

  btnReset.addEventListener('click', () => {
    cancelAll();
    state = 0;
    hlA = null;
    hlB = null;
    outComp.textContent = '—';
    outCmp.textContent = 'choisissez g et h, puis « Composer »';
    refreshState();
    scene.requestDraw();
  });

  const onSelChange = () => {
    hlA = null;
    hlB = null;
    outComp.textContent = '—';
    outCmp.textContent = 'cliquez « Composer »';
    scene.requestDraw();
  };
  selFirst.addEventListener('change', onSelChange);
  selThen.addEventListener('change', onSelChange);

  refreshState();
}

document.querySelectorAll<HTMLElement>('[data-iw="groupe-symetries"]').forEach(init);
