import { createScene, line, circle, text, clamp, map, fmt, prefersReducedMotion, type Scene } from './_canvas';

/** Génère les points idéaux d'une constellation QAM carrée d'ordre M (M = côté²). */
function constellation(order: number): Array<{ i: number; q: number }> {
  const side = Math.round(Math.sqrt(order));
  const pts: Array<{ i: number; q: number }> = [];
  // niveaux symétriques ±1, ±3, … (espacement 2)
  const levels: number[] = [];
  for (let k = 0; k < side; k++) levels.push(2 * k - (side - 1));
  for (const q of levels) for (const i of levels) pts.push({ i, q });
  return pts;
}

/** Demi-pas entre deux niveaux voisins d'une constellation (distance de décision). */
function halfStep(): number {
  return 1; // niveaux espacés de 2 → frontière à mi-chemin
}

/** Bruit gaussien (Box–Muller), écart-type sigma. */
function gauss(sigma: number): number {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selOrder = root.querySelector<HTMLSelectElement>('[data-order]')!;
  const slSnr = root.querySelector<HTMLInputElement>('[data-snr]')!;
  const outSnr = root.querySelector<HTMLElement>('[data-out-snr]')!;
  const outBits = root.querySelector<HTMLElement>('[data-out-bits]')!;
  const outPts = root.querySelector<HTMLElement>('[data-out-pts]')!;
  const outSer = root.querySelector<HTMLElement>('[data-out-ser]')!;
  const outVerdict = root.querySelector<HTMLElement>('[data-out-verdict]')!;

  const reduce = prefersReducedMotion();

  let order = parseInt(selOrder.value, 10);
  let snrDb = parseFloat(slSnr.value);
  let pts = constellation(order);
  /** échantillons bruités (i,q + indice du symbole d'origine) régénérés à chaque changement */
  let samples: Array<{ i: number; q: number; src: number; err: boolean }> = [];

  const scene = createScene(canvas, draw);

  /** Écart-type du bruit par axe, dérivé de Es/N0 et de l'énergie moyenne de la constellation. */
  function sigma(): number {
    // Energie moyenne par symbole (sur les deux axes).
    const Es = pts.reduce((a, p) => a + p.i * p.i + p.q * p.q, 0) / pts.length;
    const esN0 = Math.pow(10, snrDb / 10);
    const N0 = Es / esN0; // densité de bruit
    return Math.sqrt(N0 / 2); // par dimension I et Q
  }

  /** Indice du point idéal le plus proche d'un échantillon (décision). */
  function nearest(i: number, q: number): number {
    let best = 0;
    let bd = Infinity;
    for (let k = 0; k < pts.length; k++) {
      const d = (pts[k].i - i) ** 2 + (pts[k].q - q) ** 2;
      if (d < bd) {
        bd = d;
        best = k;
      }
    }
    return best;
  }

  /** Régénère un nuage d'échantillons bruités et compte les erreurs de décision. */
  function regenerate() {
    const s = sigma();
    const per = clamp(Math.round(4000 / pts.length), 6, 120); // densité par symbole
    samples = [];
    let errors = 0;
    let total = 0;
    for (let k = 0; k < pts.length; k++) {
      for (let n = 0; n < per; n++) {
        const ri = pts[k].i + gauss(s);
        const rq = pts[k].q + gauss(s);
        const dec = nearest(ri, rq);
        const err = dec !== k;
        if (err) errors++;
        total++;
        samples.push({ i: ri, q: rq, src: k, err });
      }
    }
    return total ? errors / total : 0;
  }

  function refresh() {
    const ser = regenerate();
    const bits = Math.log2(order);
    outSnr.textContent = `${fmt(snrDb, 1)} dB`;
    outBits.textContent = `${bits}`;
    outPts.textContent = `${order}`;
    outSer.textContent =
      ser <= 0 ? '≈ 0 (aucune)' : ser < 0.001 ? '< 0,1 %' : `${fmt(ser * 100, ser < 0.01 ? 2 : 1)} %`;
    let verdict: string;
    if (ser < 0.001) verdict = 'liaison fiable';
    else if (ser < 0.02) verdict = 'erreurs corrigibles';
    else if (ser < 0.1) verdict = 'liaison dégradée';
    else verdict = 'liaison saturée';
    outVerdict.textContent = verdict;
    outVerdict.style.color =
      ser < 0.001
        ? 'var(--c-green)'
        : ser < 0.02
          ? 'var(--c-teal)'
          : ser < 0.1
            ? 'var(--c-yellow)'
            : 'var(--c-red)';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const side = Math.round(Math.sqrt(order));
    const maxLvl = side - 1; // niveau extrême
    const span = maxLvl + halfStep() + 0.6; // marge autour
    const sz = Math.min(W, H) - 56;
    const cx = W / 2;
    const cy = H / 2;
    const x = cx - sz / 2;
    const y = cy - sz / 2;
    const toPx = (i: number) => map(i, -span, span, x, x + sz);
    const toPy = (q: number) => map(q, -span, span, y + sz, y); // q vers le haut

    // Cadre du plan I/Q.
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, sz, sz);

    // Axes I et Q.
    line(ctx, x, toPy(0), x + sz, toPy(0), pal.grid, 1.5);
    line(ctx, toPx(0), y, toPx(0), y + sz, pal.grid, 1.5);
    text(ctx, 'I', x + sz - 4, toPy(0) - 6, { color: pal.muted, size: 12, italic: true, align: 'right', baseline: 'bottom' });
    text(ctx, 'Q', toPx(0) + 8, y + 4, { color: pal.muted, size: 12, italic: true, align: 'left', baseline: 'top' });

    // Frontières des régions de décision (mi-chemin entre niveaux).
    for (let k = 0; k < side - 1; k++) {
      const lvl = 2 * k - (side - 1) + 1; // frontière entre niveau k et k+1
      const px = toPx(lvl);
      const py = toPy(lvl);
      line(ctx, px, y, px, y + sz, pal.border, 1, [3, 4]);
      line(ctx, x, py, x + sz, py, pal.border, 1, [3, 4]);
    }

    // Nuage d'échantillons bruités (limité pour la lisibilité aux grands ordres).
    const drawN = Math.min(samples.length, 6000);
    const r = clamp(2.5 - side * 0.08, 0.8, 2.2);
    for (let n = 0; n < drawN; n++) {
      const smp = samples[n];
      const col = smp.err ? pal.red : pal.blue;
      ctx.globalAlpha = smp.err ? 0.6 : 0.32;
      circle(ctx, toPx(smp.i), toPy(smp.q), r, col);
    }
    ctx.globalAlpha = 1;

    // Points idéaux par-dessus.
    const pr = clamp(5 - side * 0.18, 2.2, 4.5);
    for (const p of pts) {
      circle(ctx, toPx(p.i), toPy(p.q), pr, pal.yellow, pal.bg, 1.4);
    }
  }

  function rerender() {
    refresh();
    scene.requestDraw();
  }

  selOrder.addEventListener('change', () => {
    order = parseInt(selOrder.value, 10);
    pts = constellation(order);
    rerender();
  });
  slSnr.addEventListener('input', () => {
    snrDb = parseFloat(slSnr.value);
    rerender();
  });

  // Sans animation : un nuage figé suffit. (reduce respecté : pas de rAF en boucle.)
  void reduce;
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-constellation"]').forEach(init);
