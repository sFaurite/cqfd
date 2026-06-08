import { createScene, line, circle, text, clamp, map, fmt, type Scene } from './_canvas';

type Axis = 'params' | 'data' | 'compute';

/**
 * Forme de Chinchilla (Hoffmann et al. 2022), ordres de grandeur :
 *   L(N, D) = E + A / N^a + B / D^b
 * avec E≈1.69, A≈406, a≈0.34, B≈410, b≈0.28 (constantes illustratives).
 * Budget de calcul C ≈ 6·N·D. Optimum sous contrainte ⇒ N* ∝ C^0.49, D* ∝ C^0.51,
 * ratio D sur N ≈ 20. Tout est en ordres de grandeur, à but pédagogique.
 */
const E = 1.69, A = 406, a = 0.34, B = 410, b = 0.28;

function lossND(N: number, D: number): number {
  return E + A / Math.pow(N, a) + B / Math.pow(D, b);
}

/** Optimum de Chinchilla pour un budget C (loi C = 6·N·D). */
function chinchilla(C: number): { N: number; D: number; loss: number } {
  // exposants empiriques voisins de 0.5 ; on garde la contrainte 6ND = C.
  const G = Math.pow((a * A) / (b * B), 1 / (a + b));
  const N = G * Math.pow(C / 6, b / (a + b));
  const D = (C / 6) / N;
  return { N, D, loss: lossND(N, D) };
}

function formatPow10(log10v: number): string {
  const e = Math.round(log10v);
  const sup = String(e).replace(/[0-9-]/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(d)]);
  return `10${sup}`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const budgetEl = root.querySelector<HTMLInputElement>('[data-budget]')!;
  const outBudget = root.querySelector<HTMLElement>('[data-out-budget]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outD = root.querySelector<HTMLElement>('[data-out-d]')!;
  const outLoss = root.querySelector<HTMLElement>('[data-out-loss]')!;
  const outRatio = root.querySelector<HTMLElement>('[data-out-ratio]')!;
  const axisBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-axis]'));
  const floorBtn = root.querySelector<HTMLButtonElement>('[data-floor]')!;

  let axis: Axis = 'params';
  let logC = +budgetEl.value;
  let showFloor = true;

  const scene = createScene(canvas, draw);

  function refresh() {
    const C = Math.pow(10, logC);
    outBudget.textContent = formatPow10(logC);
    const ch = chinchilla(C);
    outN.textContent = formatPow10(Math.log10(ch.N));
    outD.textContent = formatPow10(Math.log10(ch.D));
    outLoss.textContent = fmt(ch.loss, 2);
    outRatio.textContent = fmt(ch.D / ch.N, 0);
  }

  // Pour l'axe choisi, perte le long de cet axe (les deux autres au point de Chinchilla).
  function curve(axis: Axis, C: number): { lx0: number; lx1: number; fn: (lx: number) => number; label: string } {
    const ch = chinchilla(C);
    if (axis === 'params') {
      return { lx0: 6, lx1: 11, label: 'paramètres N (log)', fn: (lx) => lossND(Math.pow(10, lx), ch.D) };
    }
    if (axis === 'data') {
      return { lx0: 8, lx1: 13, label: 'données D, tokens (log)', fn: (lx) => lossND(ch.N, Math.pow(10, lx)) };
    }
    return {
      lx0: 18, lx1: 26, label: 'calcul C, FLOP (log)',
      fn: (lx) => { const cc = chinchilla(Math.pow(10, lx)); return cc.loss; },
    };
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const C = Math.pow(10, logC);
    const cur = curve(axis, C);

    const pad = 42, padR = 18, padT = 18, padB = 36;
    const x0 = pad, x1 = W - padR, y0 = H - padB, y1 = padT;

    // bornes de perte (log) pour l'axe Y
    const lossMin = Math.max(E - 0.05, 0.1);
    const lossMax = cur.fn(cur.lx0) * 1.05;
    const lyMin = Math.log10(lossMin);
    const lyMax = Math.log10(lossMax);

    const toPx = (lx: number) => map(lx, cur.lx0, cur.lx1, x0, x1);
    const toPy = (lossVal: number) => map(Math.log10(clamp(lossVal, lossMin, lossMax * 2)), lyMin, lyMax, y0, y1);

    // grille log (verticales aux puissances de 10)
    for (let lx = Math.ceil(cur.lx0); lx <= Math.floor(cur.lx1); lx++) {
      const X = toPx(lx);
      line(ctx, X, y1, X, y0, pal.grid, 1);
      text(ctx, formatPow10(lx), X, y0 + 14, { color: pal.muted, size: 10.5, align: 'center' });
    }
    // grille horizontale
    for (let k = 0; k <= 4; k++) {
      const lv = lyMin + (lyMax - lyMin) * (k / 4);
      const Y = map(lv, lyMin, lyMax, y0, y1);
      line(ctx, x0, Y, x1, Y, pal.grid, 1);
      text(ctx, fmt(Math.pow(10, lv), 2), x0 - 6, Y, { color: pal.muted, size: 10.5, align: 'right', baseline: 'middle' });
    }

    // plateau E
    if (showFloor) {
      const Y = toPy(E);
      line(ctx, x0, Y, x1, Y, pal.red, 1.6, [6, 4]);
      text(ctx, `plateau E ≈ ${fmt(E, 2)}`, x1 - 4, Y - 6, { color: pal.red, size: 11, align: 'right', weight: 700 });
    }

    // courbe (droite log-log puis incurvée par le plateau)
    ctx.beginPath();
    ctx.strokeStyle = pal.blue; ctx.lineWidth = 2.6;
    for (let i = 0; i <= 200; i++) {
      const lx = map(i, 0, 200, cur.lx0, cur.lx1);
      const X = toPx(lx), Y = toPy(cur.fn(lx));
      if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.stroke();

    // point au budget courant (pour l'axe compute : C ; sinon : N* ou D*)
    const ch = chinchilla(C);
    let lxMark: number | null = null;
    if (axis === 'params') lxMark = Math.log10(ch.N);
    else if (axis === 'data') lxMark = Math.log10(ch.D);
    else lxMark = logC;
    if (lxMark !== null && lxMark >= cur.lx0 && lxMark <= cur.lx1) {
      const X = toPx(lxMark), Y = toPy(cur.fn(lxMark));
      line(ctx, X, y0, X, Y, pal.yellow, 1.4, [3, 3]);
      circle(ctx, X, Y, 6, pal.yellow, pal.text, 2);
      const lbl = axis === 'params' ? 'N* (Chinchilla)' : axis === 'data' ? 'D* (Chinchilla)' : 'budget C';
      text(ctx, lbl, X + 9, Y - 8, { color: pal.yellow, size: 11, weight: 700 });
    }

    // titres d'axes
    text(ctx, cur.label, (x0 + x1) / 2, H - 4, { color: pal.muted, size: 12, align: 'center', weight: 600 });
    ctx.save();
    ctx.translate(12, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'perte L (log)', 0, 0, { color: pal.muted, size: 12, align: 'center', weight: 600 });
    ctx.restore();
  }

  budgetEl.addEventListener('input', () => { logC = +budgetEl.value; refresh(); scene.requestDraw(); });
  axisBtns.forEach((btn) => btn.addEventListener('click', () => {
    axis = btn.dataset.axis as Axis;
    axisBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    refresh(); scene.requestDraw();
  }));
  floorBtn.addEventListener('click', () => {
    showFloor = !showFloor;
    floorBtn.textContent = showFloor ? 'afficher' : 'masquer';
    floorBtn.classList.toggle('active', showFloor);
    floorBtn.setAttribute('aria-pressed', String(showFloor));
    scene.requestDraw();
  });

  floorBtn.setAttribute('aria-pressed', 'true');
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-scaling"]').forEach(init);
