import { createScene, line, text, clamp, type Scene } from './_canvas';

type Mode = 'densite' | 'signe';

const SUBSHELL = ['s', 'p', 'd', 'f'];

/** Factorielle (petits entiers). */
function fact(n: number): number {
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

/**
 * Polynôme de Laguerre associé L_p^q(x) par récurrence.
 */
function laguerre(p: number, q: number, x: number): number {
  if (p === 0) return 1;
  if (p === 1) return 1 + q - x;
  let lm1 = 1; // L_0
  let l = 1 + q - x; // L_1
  for (let k = 2; k <= p; k++) {
    const lk = ((2 * k - 1 + q - x) * l - (k - 1 + q) * lm1) / k;
    lm1 = l;
    l = lk;
  }
  return l;
}

/**
 * Partie radiale R_{n,l}(r) pour l'hydrogène (Z = 1), en unités de Bohr.
 * Constante de normalisation incluse à un facteur près (l'échelle est libre).
 */
function radial(n: number, l: number, r: number): number {
  const rho = (2 * r) / n;
  const pre = Math.pow(rho, l) * Math.exp(-rho / 2);
  const lag = laguerre(n - l - 1, 2 * l + 1, rho);
  // facteur de normalisation (sans le terme purement numérique d'échelle)
  const norm = Math.sqrt(
    (fact(n - l - 1)) / (2 * n * Math.pow(fact(n + l), 1)),
  );
  return norm * pre * lag;
}

/**
 * Partie angulaire réelle (harmonique sphérique réelle) évaluée dans le plan
 * xz, donc φ = 0 (x ≥ 0) ou φ = π (x < 0). On retourne une valeur signée.
 * theta est l'angle depuis l'axe z. On gère un sous-ensemble parlant de m.
 */
function angular(l: number, m: number, theta: number, signX: number): number {
  const c = Math.cos(theta);
  const s = Math.sin(theta) * signX; // composante x signée dans le plan xz
  const am = Math.abs(m);
  if (l === 0) return 1;
  if (l === 1) {
    if (m === 0) return c; // pz
    return s; // px (m=±1 dans le plan xz)
  }
  if (l === 2) {
    if (m === 0) return 3 * c * c - 1; // dz²
    if (am === 1) return s * c; // dxz
    return s * s - c * c * 0; // approx lobe dans le plan (dx²−y² / dxy)
  }
  // l === 3 (f) : forme qualitative
  if (m === 0) return c * (5 * c * c - 3);
  if (am === 1) return s * (5 * c * c - 1);
  if (am === 2) return s * s * c;
  return s * s * s;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sN = root.querySelector<HTMLInputElement>('[data-n]')!;
  const sL = root.querySelector<HTMLInputElement>('[data-l]')!;
  const sM = root.querySelector<HTMLInputElement>('[data-m]')!;
  const selMode = root.querySelector<HTMLSelectElement>('[data-mode]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outL = root.querySelector<HTMLElement>('[data-out-l]')!;
  const outM = root.querySelector<HTMLElement>('[data-out-m]')!;
  const outName = root.querySelector<HTMLElement>('[data-out-name]')!;
  const outNr = root.querySelector<HTMLElement>('[data-out-nr]')!;
  const outNa = root.querySelector<HTMLElement>('[data-out-na]')!;
  const outNt = root.querySelector<HTMLElement>('[data-out-nt]')!;

  let n = +sN.value;
  let l = +sL.value;
  let m = +sM.value;
  let mode = selMode.value as Mode;

  const scene = createScene(canvas, draw);

  /** Contraint l et m aux valeurs autorisées et met à jour les curseurs. */
  function clampQuantum() {
    l = clamp(l, 0, n - 1);
    sL.max = String(n - 1);
    sL.value = String(l);
    m = clamp(m, -l, l);
    sM.min = String(-l);
    sM.max = String(l);
    sM.value = String(m);
  }

  function refresh() {
    clampQuantum();
    const nr = n - l - 1;
    const na = l;
    outN.textContent = String(n);
    outL.textContent = `${l} (${SUBSHELL[l]})`;
    outM.textContent = String(m);
    outName.textContent = `${n}${SUBSHELL[l]}`;
    outNr.textContent = String(nr);
    outNa.textContent = String(na);
    outNt.textContent = String(nr + na);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const pad = 14;
    const plotW = W - pad * 2;
    const plotH = H - pad * 2;
    const cx = pad + plotW / 2;
    const cy = pad + plotH / 2;
    const R = Math.min(plotW, plotH) / 2;

    // Étendue physique de la coupe (en rayons de Bohr), croît avec n.
    const span = 3 + n * n * 1.6;
    // Échantillonnage de la densité sur une grille de cellules.
    const cell = Math.max(3, Math.round((R * 2) / 120));
    const cols = Math.floor((R * 2) / cell);

    // Pré-calcul du maximum pour normaliser l'échelle de couleurs.
    let maxv = 0;
    const grid: number[][] = [];
    for (let iy = 0; iy < cols; iy++) {
      grid[iy] = [];
      for (let ix = 0; ix < cols; ix++) {
        const px = (ix + 0.5) / cols - 0.5; // -0.5..0.5
        const py = (iy + 0.5) / cols - 0.5;
        const xPhys = px * 2 * span;
        const zPhys = -py * 2 * span; // y écran vers le bas
        const r = Math.hypot(xPhys, zPhys);
        const theta = Math.atan2(Math.abs(xPhys), zPhys);
        const signX = xPhys >= 0 ? 1 : -1;
        const psi = radial(n, l, r) * angular(l, m, theta, signX);
        const v = psi * psi;
        grid[iy][ix] = mode === 'signe' ? psi : v;
        if (v > maxv) maxv = v;
      }
    }
    if (maxv <= 0) maxv = 1;
    // Gamma doux pour révéler les régions de faible densité.
    const norm = (v: number) => Math.pow(clamp(Math.abs(v) / Math.sqrt(maxv), 0, 1), 0.55);

    // Clip circulaire.
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    // Fond.
    ctx.fillStyle = pal.bg;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    const blue = hexToRgb(pal.blue);
    const red = hexToRgb(pal.red);
    const yellow = hexToRgb(pal.yellow);

    for (let iy = 0; iy < cols; iy++) {
      for (let ix = 0; ix < cols; ix++) {
        const raw = grid[iy][ix];
        const a = norm(raw);
        if (a < 0.02) continue;
        let col: [number, number, number];
        if (mode === 'signe') {
          col = raw >= 0 ? blue : red;
        } else {
          col = mixColor(blue, yellow, a); // densité : bleu sombre -> jaune vif
        }
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
        const x = cx - R + ix * cell;
        const y = cy - R + iy * cell;
        ctx.fillRect(x, y, cell + 1, cell + 1);
      }
    }

    // --- Nœuds angulaires (lignes / cônes) ---
    ctx.restore();
    drawNodes(s, cx, cy, R, span);

    // --- Axes z (vertical) et x (horizontal) ---
    line(ctx, cx - R, cy, cx + R, cy, pal.border, 1, [4, 4]);
    line(ctx, cx, cy - R, cx, cy + R, pal.border, 1, [4, 4]);
    circle3(ctx, cx, cy, R, pal.border);

    // Noyau.
    ctx.fillStyle = pal.text;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Étiquettes d'axes.
    text(ctx, 'z', cx + 6, cy - R + 12, { color: pal.muted, size: 12, weight: 700 });
    text(ctx, 'x', cx + R - 12, cy - 6, { color: pal.muted, size: 12, weight: 700, align: 'right' });
    text(ctx, `${n}${SUBSHELL[l]}  (m = ${m})`, cx, cy + R + 4, {
      color: pal.text,
      size: 14,
      weight: 700,
      align: 'center',
      baseline: 'top',
    });
  }

  /** Trace les nœuds radiaux (cercles) et angulaires (cônes) en pointillés. */
  function drawNodes(s: Scene, cx: number, cy: number, R: number, span: number) {
    const { ctx, pal } = s;
    // Nœuds radiaux : zéros de R(n,l,r). On les détecte par changement de signe.
    let prev = radial(n, l, 0.001);
    const rMax = span;
    const steps = 400;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    for (let i = 1; i <= steps; i++) {
      const r = (i / steps) * rMax;
      const cur = radial(n, l, r);
      if (prev * cur < 0) {
        const rr = (r / span) * R;
        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = pal.red;
        ctx.globalAlpha = 0.7;
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      prev = cur;
    }
    // Nœuds angulaires : zéros de la partie angulaire (cônes => lignes radiales).
    ctx.globalAlpha = 0.7;
    const angSteps = 720;
    let pa = angular(l, m, 0.001, 1);
    for (let i = 1; i <= angSteps; i++) {
      const th = (i / angSteps) * Math.PI; // 0..π le long de z
      const cur = angular(l, m, th, 1);
      if (pa * cur < 0) {
        // un cône au demi-angle th : droite des deux côtés (x>0 et x<0)
        for (const sx of [1, -1]) {
          const ex = cx + sx * R * Math.sin(th);
          const ez = cy - R * Math.cos(th);
          line(ctx, cx, cy, ex, ez, pal.red, 1, [3, 4]);
        }
      }
      pa = cur;
    }
    ctx.restore();
  }

  function circle3(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: string) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = c;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function on(el: HTMLElement, fn: () => void) {
    el.addEventListener('input', () => {
      fn();
      refresh();
      scene.requestDraw();
    });
  }
  on(sN, () => (n = +sN.value));
  on(sL, () => (l = +sL.value));
  on(sM, () => (m = +sM.value));
  selMode.addEventListener('change', () => {
    mode = selMode.value as Mode;
    scene.requestDraw();
  });

  refresh();
}

/* ---------- Utilitaires couleur ---------- */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  if (h.length >= 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  return [88, 196, 221];
}
function mixColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-orbital"]').forEach(init);
