import { createScene, line, circle, text, clamp, fmt, prefersReducedMotion, type Scene } from './_canvas';

/**
 * Réseau fixe : x1,x2 → h1,h2 (tanh) → o (linéaire) → L = (o - y)^2.
 * h1 = tanh(a1), a1 = w11·x1 + w12·x2 + b1
 * h2 = tanh(a2), a2 = w21·x1 + w22·x2 + b2
 * o  = v1·h1 + v2·h2 + c
 * Poids fixes (le but est de voir circuler valeurs et dérivées).
 */
const W = { w11: 0.8, w12: -0.5, b1: 0.1, w21: -0.6, w22: 0.9, b2: -0.2, v1: 1.1, v2: 0.7, c: 0.0 };

interface NodeVal { x: number; y: number; label: string; val: number; delta: number; }

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const x1El = root.querySelector<HTMLInputElement>('[data-x1]')!;
  const x2El = root.querySelector<HTMLInputElement>('[data-x2]')!;
  const yEl = root.querySelector<HTMLInputElement>('[data-y]')!;
  const outX1 = root.querySelector<HTMLElement>('[data-out-x1]')!;
  const outX2 = root.querySelector<HTMLElement>('[data-out-x2]')!;
  const outY = root.querySelector<HTMLElement>('[data-out-y]')!;
  const outPhase = root.querySelector<HTMLElement>('[data-out-phase]')!;
  const outYh = root.querySelector<HTMLElement>('[data-out-yh]')!;
  const outLoss = root.querySelector<HTMLElement>('[data-out-loss]')!;
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const backBtn = root.querySelector<HTMLButtonElement>('[data-back]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-reset]')!;

  let x1 = +x1El.value, x2 = +x2El.value, y = +yEl.value;
  // progression : 0..1 sur la passe avant, 1..2 sur la passe arrière.
  let progress = 0;
  let dir: 0 | 1 | -1 = 0; // 0 figé, 1 avant, -1 arrière
  let raf = 0;

  const scene = createScene(canvas, draw);

  function compute() {
    const a1 = W.w11 * x1 + W.w12 * x2 + W.b1;
    const a2 = W.w21 * x1 + W.w22 * x2 + W.b2;
    const h1 = Math.tanh(a1), h2 = Math.tanh(a2);
    const o = W.v1 * h1 + W.v2 * h2 + W.c;
    const L = (o - y) * (o - y);
    // dérivées
    const dL_do = 2 * (o - y);
    const dL_dh1 = dL_do * W.v1;
    const dL_dh2 = dL_do * W.v2;
    const dL_da1 = dL_dh1 * (1 - h1 * h1);
    const dL_da2 = dL_dh2 * (1 - h2 * h2);
    const dL_dx1 = dL_da1 * W.w11 + dL_da2 * W.w21; // chemins multiples additionnés
    const dL_dx2 = dL_da1 * W.w12 + dL_da2 * W.w22;
    return { a1, a2, h1, h2, o, L, dL_do, dL_dh1, dL_dh2, dL_da1, dL_da2, dL_dx1, dL_dx2 };
  }

  function refresh() {
    outX1.textContent = fmt(x1, 1);
    outX2.textContent = fmt(x2, 1);
    outY.textContent = fmt(y, 1);
    const c = compute();
    outYh.textContent = fmt(c.o);
    outLoss.textContent = fmt(c.L);
  }

  function setPhase(t: string) { outPhase.textContent = t; }

  function nodesLayout(s: Scene): { nodes: NodeVal[]; edges: Array<[number, number, number]> } {
    const { width: Wd, height: Hd } = s;
    const c = compute();
    const colX = [Wd * 0.1, Wd * 0.4, Wd * 0.68, Wd * 0.9];
    const nodes: NodeVal[] = [
      { x: colX[0], y: Hd * 0.32, label: 'x₁', val: x1, delta: c.dL_dx1 },
      { x: colX[0], y: Hd * 0.68, label: 'x₂', val: x2, delta: c.dL_dx2 },
      { x: colX[1], y: Hd * 0.3, label: 'h₁', val: c.h1, delta: c.dL_dh1 },
      { x: colX[1], y: Hd * 0.7, label: 'h₂', val: c.h2, delta: c.dL_dh2 },
      { x: colX[2], y: Hd * 0.5, label: 'ŷ', val: c.o, delta: c.dL_do },
      { x: colX[3], y: Hd * 0.5, label: 'L', val: c.L, delta: 1 },
    ];
    // arêtes : [from, to, poids]
    const edges: Array<[number, number, number]> = [
      [0, 2, W.w11], [1, 2, W.w12],
      [0, 3, W.w21], [1, 3, W.w22],
      [2, 4, W.v1], [3, 4, W.v2],
      [4, 5, 1],
    ];
    return { nodes, edges };
  }

  // Activation visuelle d'un nœud selon la progression (par colonnes).
  function nodeLit(idx: number, p: number): number {
    // colonne d'apparition en avant : x(0) h(1) ŷ(2) L(3)
    const col = idx <= 1 ? 0 : idx <= 3 ? 1 : idx === 4 ? 2 : 3;
    if (p <= 1) {
      // passe avant : seuils 0, .33, .66, 1
      const th = col / 3;
      return clamp((p - th) * 4, 0, 1);
    }
    // passe arrière : illumine de droite à gauche (col 3 → 0)
    const bp = p - 1;
    const th = (3 - col) / 3;
    return clamp((bp - th) * 4, 0, 1);
  }
  function edgeLit(toIdx: number, p: number): number {
    const col = toIdx <= 1 ? 0 : toIdx <= 3 ? 1 : toIdx === 4 ? 2 : 3;
    if (p <= 1) { const th = (col - 0.5) / 3; return clamp((p - th) * 4, 0, 1); }
    const bp = p - 1; const th = (3 - col + 0.5) / 3; return clamp((bp - th) * 4, 0, 1);
  }

  function draw(s: Scene) {
    const { ctx, width: Wd, height: Hd, pal } = s;
    ctx.clearRect(0, 0, Wd, Hd);
    const { nodes, edges } = nodesLayout(s);
    const p = progress;
    const backward = p > 1;

    // Arêtes.
    for (const [a, b, wgt] of edges) {
      const na = nodes[a], nb = nodes[b];
      const lit = edgeLit(b, p);
      const baseCol = pal.border;
      const col = backward ? pal.purple : pal.teal;
      // ligne de base
      line(ctx, na.x, na.y, nb.x, nb.y, baseCol, 1.5);
      if (lit > 0) {
        ctx.save();
        ctx.globalAlpha = lit;
        line(ctx, na.x, na.y, nb.x, nb.y, col, 2.6);
        ctx.restore();
      }
      // poids sur l'arête
      const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
      if (b !== 5) {
        text(ctx, fmt(wgt, 1), mx, my - 6, { color: pal.muted, size: 10.5, align: 'center', weight: 600 });
      }
    }

    // Nœuds.
    nodes.forEach((n, i) => {
      const lit = nodeLit(i, p);
      const r = i === 5 ? 24 : 22;
      const litCol = backward ? pal.purple : pal.yellow;
      const fill = lit > 0
        ? mix(pal.surface, litCol, 0.18 * lit)
        : pal.surface;
      circle(ctx, n.x, n.y, r, fill, lit > 0 ? litCol : pal.border, lit > 0 ? 2.4 : 1.5);
      text(ctx, n.label, n.x, n.y - 4, { color: pal.text, size: 13, align: 'center', baseline: 'middle', weight: 700 });
      // valeur (avant) ou delta (arrière)
      const showVal = !backward;
      const v = showVal ? n.val : n.delta;
      const vis = lit;
      if (vis > 0.05) {
        ctx.save();
        ctx.globalAlpha = vis;
        text(ctx, fmt(v, 2), n.x, n.y + 11, {
          color: showVal ? pal.green : pal.red, size: 11, align: 'center', baseline: 'middle', weight: 700,
        });
        ctx.restore();
      }
    });

    // Légende phase.
    const tag = backward ? 'δ = ∂L / ∂nœud  (remonte)' : 'valeurs  (descendent)';
    text(ctx, tag, Wd * 0.5, Hd - 8, { color: backward ? pal.purple : pal.green, size: 12, align: 'center', weight: 700 });
  }

  function mix(a: string, b: string, t: number): string {
    return `color-mix(in srgb, ${b} ${Math.round(t * 100)}%, ${a})`;
  }

  function animate() {
    if (dir === 0) return;
    progress = clamp(progress + dir * 0.012, 0, 2);
    if (dir === 1 && progress >= 1) { dir = 0; setPhase('avant terminée'); }
    if (dir === -1 && progress <= 1) { dir = 0; progress = 1; setPhase('avant (figée)'); }
    if (dir === 1 && progress >= 2) { dir = 0; setPhase('arrière terminée'); }
    scene.requestDraw();
    if (dir !== 0) raf = requestAnimationFrame(animate);
  }

  function runForward() {
    if (raf) cancelAnimationFrame(raf);
    setPhase('passe avant…');
    if (prefersReducedMotion()) { progress = 1; setPhase('avant (figée)'); scene.requestDraw(); return; }
    progress = 0; dir = 1; raf = requestAnimationFrame(animate);
  }
  function runBackward() {
    if (raf) cancelAnimationFrame(raf);
    if (progress < 1) progress = 1; // il faut une passe avant d'abord
    setPhase('passe arrière…');
    if (prefersReducedMotion()) { progress = 2; setPhase('arrière (figée)'); scene.requestDraw(); return; }
    dir = 1; // on continue d'incrémenter de 1→2
    raf = requestAnimationFrame(animate);
  }
  function reset() {
    if (raf) cancelAnimationFrame(raf);
    dir = 0; progress = 0; setPhase('au repos'); scene.requestDraw();
  }

  const bind = (el: HTMLInputElement, set: (v: number) => void) =>
    el.addEventListener('input', () => { set(+el.value); refresh(); scene.requestDraw(); });
  bind(x1El, (v) => (x1 = v));
  bind(x2El, (v) => (x2 = v));
  bind(yEl, (v) => (y = v));

  playBtn.addEventListener('click', runForward);
  backBtn.addEventListener('click', runBackward);
  resetBtn.addEventListener('click', reset);

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-backprop"]').forEach(init);
