import { createScene, line, circle, text, clamp, fmt, prefersReducedMotion, type Scene } from './_canvas';

const TWO_PI = Math.PI * 2;
const SLIDER_MAX = 1000; // curseur θ entier : 500 ↦ π exactement

interface Cx {
  re: number;
  im: number;
}

/** Points de la ligne brisée : P[0] = 0, puis P[m+1] = S_m pour m = 0..k. */
function partialSums(theta: number, k: number): Cx[] {
  const pts: Cx[] = [{ re: 0, im: 0 }];
  let tre = 1; // terme courant (iθ)^j / j!, initialisé à j = 0
  let tim = 0;
  let sre = 0;
  let sim = 0;
  for (let j = 0; j <= k; j++) {
    if (j > 0) {
      // terme_j = terme_{j-1} × iθ/j : rotation de 90° + facteur θ/j
      const f = theta / j;
      const nre = -tim * f;
      const nim = tre * f;
      tre = nre;
      tim = nim;
    }
    sre += tre;
    sim += tim;
    pts.push({ re: sre, im: sim });
  }
  return pts;
}

function hexToRgb(h: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(h.trim());
  if (!m) return null;
  let s = m[1];
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Interpole deux couleurs hex de la palette (dégradé bleu → vert des termes). */
function mix(c1: string, c2: string, t: number): string {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  if (!a || !b) return t < 0.5 ? c1 : c2;
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

/** « S » suivi de k en chiffres indice (S₈, S₃₀…). */
function sub(n: number): string {
  return String(n)
    .split('')
    .map((d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)] ?? d)
    .join('');
}

/** Étiquette « e^sup rest » centrée en (cx, cy), avec vrai exposant. */
function expLabel(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sup: string,
  rest: string,
  color: string,
) {
  const fBase = 'italic 600 13px Inter, system-ui, sans-serif';
  const fSup = 'italic 600 9.5px Inter, system-ui, sans-serif';
  ctx.save();
  ctx.font = fBase;
  const wE = ctx.measureText('e').width;
  const wRest = rest ? ctx.measureText(rest).width : 0;
  ctx.font = fSup;
  const wSup = ctx.measureText(sup).width;
  let x = cx - (wE + wSup + wRest) / 2;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = fBase;
  ctx.fillText('e', x, cy);
  x += wE;
  ctx.font = fSup;
  ctx.fillText(sup, x, cy - 5);
  x += wSup;
  if (rest) {
    ctx.font = fBase;
    ctx.fillText(rest, x, cy);
  }
  ctx.restore();
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const thetaSlider = root.querySelector<HTMLInputElement>('[data-theta]')!;
  const kSlider = root.querySelector<HTMLInputElement>('[data-k]')!;
  const outThetaS = root.querySelector<HTMLElement>('[data-out-theta-s]')!;
  const outK = root.querySelector<HTMLElement>('[data-out-k]')!;
  const outTheta = root.querySelector<HTMLElement>('[data-out-theta]')!;
  const outSk = root.querySelector<HTMLElement>('[data-out-sk]')!;
  const outErr = root.querySelector<HTMLElement>('[data-out-err]')!;
  const eulerChip = root.querySelector<HTMLElement>('[data-euler-chip]')!;
  const outEuler = root.querySelector<HTMLElement>('[data-out-euler]')!;
  const btn = root.querySelector<HTMLButtonElement>('[data-pi]')!;

  let theta = Math.PI;
  let k = parseInt(kSlider.value, 10);
  let animRaf = 0;

  const scene = createScene(canvas, draw);

  const isPi = () => Math.abs(theta - Math.PI) < 1e-6;

  function refresh() {
    const pts = partialSums(theta, k);
    const s = pts[pts.length - 1];
    const err = Math.hypot(s.re - Math.cos(theta), s.im - Math.sin(theta));

    outThetaS.textContent = `${fmt(theta / Math.PI, 2)} π`;
    outK.textContent = String(k);
    outTheta.textContent = `${fmt(theta, 3)} rad = ${fmt(theta / Math.PI, 3)} π`;
    outSk.textContent = `${fmt(s.re, 4)} ${s.im < 0 ? '−' : '+'} ${fmt(Math.abs(s.im), 4)} i`;
    outErr.textContent =
      err < 1e-4 ? (err < 1e-12 ? '0,0000' : err.toExponential(1).replace('.', ',')) : fmt(err, 4);

    const pi = isPi();
    btn.classList.toggle('active', pi);
    eulerChip.hidden = !pi;
    if (pi) {
      outEuler.textContent =
        err < 0.005
          ? `S${sub(k)} ≈ ${fmt(s.re, 4)} : e^(iπ) = −1, donc e^(iπ) + 1 = 0`
          : 'θ = π : augmentez k, la spirale s’enroule vers −1';
    }
  }

  function draw(sc: Scene) {
    const { ctx, width: W, height: H, pal } = sc;
    ctx.clearRect(0, 0, W, H);

    const pts = partialSums(theta, k);
    const last = pts[pts.length - 1];
    const tRe = Math.cos(theta);
    const tIm = Math.sin(theta);

    // cadrage : tout montrer si possible, sans écraser le cercle unité
    let maxAbs = 1.15;
    for (const p of pts) maxAbs = Math.max(maxAbs, Math.abs(p.re), Math.abs(p.im));
    const viewRaw = maxAbs * 1.12;
    const viewR = clamp(viewRaw, 1.7, 6.8);
    const clipped = viewRaw > viewR + 1e-9;

    const pad = 18;
    const u = Math.min(W / 2 - pad, H / 2 - pad) / viewR; // pixels par unité
    const cx = W / 2;
    const cy = H / 2;
    const X = (re: number) => cx + re * u;
    const Y = (im: number) => cy - im * u;

    // axes discrets + graduations entières
    line(ctx, 0, cy, W, cy, pal.grid, 1);
    line(ctx, cx, 0, cx, H, pal.grid, 1);
    for (let i = 1; i <= Math.floor(viewR); i++) {
      for (const sgn of [1, -1]) {
        line(ctx, X(sgn * i), cy - 3, X(sgn * i), cy + 3, pal.border, 1);
        line(ctx, cx - 3, Y(sgn * i), cx + 3, Y(sgn * i), pal.border, 1);
      }
    }
    text(ctx, '1', X(1), cy + 15, { color: pal.muted, size: 10.5, align: 'center' });
    text(ctx, '−1', X(-1), cy + 15, { color: pal.muted, size: 10.5, align: 'center' });
    text(ctx, 'i', cx - 9, Y(1) + 4, { color: pal.muted, size: 10.5, align: 'right', italic: true });
    text(ctx, '−i', cx - 9, Y(-1) + 4, { color: pal.muted, size: 10.5, align: 'right', italic: true });

    // cercle unité
    circle(ctx, cx, cy, u, undefined, pal.border, 1.6);

    // arc d'angle θ + rayon (discret, en vert)
    if (theta > 0.02) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, u * 0.3, 0, -theta, true);
      ctx.stroke();
      ctx.restore();
      if (u * 0.3 > 14 && theta > 0.5) {
        text(ctx, 'θ', cx + Math.cos(theta / 2) * u * 0.45, cy - Math.sin(theta / 2) * u * 0.45 + 4, {
          color: pal.green,
          size: 11,
          align: 'center',
          italic: true,
        });
      }
    }
    ctx.save();
    ctx.globalAlpha = 0.35;
    line(ctx, cx, cy, X(tRe), Y(tIm), pal.green, 1, [3, 4]);
    ctx.restore();

    // écart |S_k − e^{iθ}| : pointillé entre le point final et la cible
    const sx = X(last.re);
    const sy = Y(last.im);
    const tx = X(tRe);
    const ty = Y(tIm);
    if (Math.hypot(sx - tx, sy - ty) > 14) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      line(ctx, sx, sy, tx, ty, pal.muted, 1, [4, 4]);
      ctx.restore();
    }

    // ligne brisée des sommes partielles : un segment = un terme, bleu → vert
    for (let j = 0; j <= k; j++) {
      const a = pts[j];
      const b = pts[j + 1];
      const col = mix(pal.blue, pal.green, k === 0 ? 0 : j / k);
      line(ctx, X(a.re), Y(a.im), X(b.re), Y(b.im), col, 2.2);
      if (j < k) circle(ctx, X(b.re), Y(b.im), 1.8, col);
    }

    // cible e^{iθ} : petit anneau vert sur le cercle
    circle(ctx, tx, ty, 6, undefined, pal.green, 2.4);
    const lx = clamp(tx + Math.cos(theta) * 24, 36, W - 36);
    const ly = clamp(ty - Math.sin(theta) * 24 + 4, 18, H - 8);
    if (isPi()) expLabel(ctx, lx, ly, 'iπ', ' = −1', pal.green);
    else expLabel(ctx, lx, ly, 'iθ', '', pal.green);

    // point final S_k
    circle(ctx, sx, sy, 5.5, pal.yellow, pal.bg, 2);
    text(ctx, `S${sub(k)}`, sx, sy - 10, {
      color: pal.yellow,
      size: 13,
      align: 'center',
      baseline: 'bottom',
      weight: 700,
    });

    // rappel de la série (haut) et note de cadrage (bas)
    text(ctx, 'Sₘ = 1 + iθ + (iθ)²/2! + … + (iθ)ᵐ/m!', W / 2, 16, {
      color: pal.muted,
      size: 11.5,
      align: 'center',
    });
    if (clipped) {
      text(ctx, 'les premières sommes partielles sortent du cadre — elles reviennent s’enrouler', W / 2, H - 7, {
        color: pal.muted,
        size: 10.5,
        align: 'center',
      });
    }
  }

  function setTheta(v: number) {
    theta = clamp(v, 0, TWO_PI);
    thetaSlider.value = String(Math.round((theta / TWO_PI) * SLIDER_MAX));
    refresh();
    scene.requestDraw();
  }

  function animateToPi() {
    cancelAnimationFrame(animRaf);
    if (prefersReducedMotion() || Math.abs(theta - Math.PI) < 1e-9) {
      setTheta(Math.PI);
      return;
    }
    const from = theta;
    const t0 = performance.now();
    const dur = 450;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setTheta(t >= 1 ? Math.PI : from + (Math.PI - from) * e);
      if (t < 1) animRaf = requestAnimationFrame(step);
    };
    animRaf = requestAnimationFrame(step);
  }

  thetaSlider.addEventListener('input', () => {
    cancelAnimationFrame(animRaf);
    theta = (parseInt(thetaSlider.value, 10) / SLIDER_MAX) * TWO_PI;
    refresh();
    scene.requestDraw();
  });
  kSlider.addEventListener('input', () => {
    k = parseInt(kSlider.value, 10);
    refresh();
    scene.requestDraw();
  });
  btn.addEventListener('click', animateToPi);

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="maths-exp-complexe"]').forEach(init);
