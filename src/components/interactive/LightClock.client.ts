import {
  createScene,
  line,
  circle,
  text,
  clamp,
  lerp,
  fmt,
  gamma,
  prefersReducedMotion,
  type Scene,
} from './_canvas';

const TAU = 1.0; // demi-période propre, en « secondes labo »
const SPEED = 0.85; // unités de temps labo par seconde réelle

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slider = root.querySelector<HTMLInputElement>('[data-beta]')!;
  const outBeta = root.querySelector<HTMLElement>('[data-out-beta]')!;
  const outG = root.querySelector<HTMLElement>('[data-out-gamma]')!;
  const outRatio = root.querySelector<HTMLElement>('[data-out-ratio]')!;
  const outTr = root.querySelector<HTMLElement>('[data-out-tr]')!;
  const outTm = root.querySelector<HTMLElement>('[data-out-tm]')!;
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-reset]')!;

  let beta = parseFloat(slider.value);
  let t = prefersReducedMotion() ? 1.45 * TAU : 0; // image figée parlante si reduced-motion
  let playing = !prefersReducedMotion();
  let last = 0;
  const trail: { x: number; y: number }[] = [];
  let lapT0 = 0;

  const scene = createScene(canvas, draw);

  function setPlay(p: boolean) {
    playing = p;
    playBtn.textContent = p ? '⏸ Pause' : '▶ Lecture';
    if (p) {
      last = 0;
      requestAnimationFrame(loop);
    }
  }

  function reset() {
    t = 0;
    lapT0 = 0;
    trail.length = 0;
    refresh();
    scene.requestDraw();
  }

  function refresh() {
    const g = gamma(beta);
    outBeta.textContent = fmt(beta, 2);
    outG.textContent = fmt(g, 3);
    outRatio.textContent = fmt(g, 3);
    outTr.textContent = String(Math.floor(t / TAU));
    outTm.textContent = String(Math.floor(t / (g * TAU)));
  }

  // position verticale d'un photon (onde triangulaire) entre yBot et yTop, demi-période Th
  function photonY(time: number, Th: number, yTop: number, yBot: number) {
    const p = time / Th;
    const frac = ((p % 2) + 2) % 2;
    return frac < 1 ? lerp(yBot, yTop, frac) : lerp(yTop, yBot, frac - 1);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const g = gamma(beta);
    const panelH = H / 2;
    const L = Math.min(panelH * 0.46, 120); // séparation des miroirs (= c·t₀)
    const mirrorW = 54;

    // ---------- séparateur + titres ----------
    line(ctx, 0, panelH, W, panelH, pal.border, 1);
    text(ctx, 'Horloge au repos (temps propre Δt₀)', 14, 18, { color: pal.muted, size: 12, weight: 700 });
    text(ctx, 'La même horloge en mouvement (vue du labo : Δt = γ·Δt₀)', 14, panelH + 18, {
      color: pal.muted,
      size: 12,
      weight: 700,
    });

    const drawMirrors = (cx: number, cy: number, color: string) => {
      const yTop = cy - L / 2;
      const yBot = cy + L / 2;
      line(ctx, cx - mirrorW / 2, yTop, cx + mirrorW / 2, yTop, color, 4);
      line(ctx, cx - mirrorW / 2, yBot, cx + mirrorW / 2, yBot, color, 4);
      return { yTop, yBot };
    };

    // ---------- horloge au repos (haut) ----------
    {
      const cx = W * 0.16;
      const cy = panelH * 0.52;
      const { yTop, yBot } = drawMirrors(cx, cy, pal.blue);
      const py = photonY(t, TAU, yTop, yBot);
      line(ctx, cx, yBot, cx, yTop, pal.grid, 1, [3, 3]);
      circle(ctx, cx, py, 6, pal.yellow);
      // étiquette hauteur
      text(ctx, 'c·t₀', cx + mirrorW / 2 + 8, cy, { color: pal.blue, size: 12, baseline: 'middle', italic: true });
    }

    // ---------- horloge en mouvement (bas) ----------
    {
      const cy = panelH * 1.5;
      const yTop = cy - L / 2;
      const yBot = cy + L / 2;
      const xLeft = W * 0.1;
      const xRight = W * 0.86;
      const Th = g * TAU; // demi-période vue du labo
      const vScreen = (beta * (L / TAU)); // vitesse écran cohérente avec c_screen = L/TAU
      let cx = xLeft + vScreen * (t - lapT0);
      if (cx > xRight) {
        lapT0 = t;
        trail.length = 0;
        cx = xLeft;
      }
      const py = photonY(t, Th, yTop, yBot);

      // trace (zigzag) du photon
      if (playing || trail.length === 0) trail.push({ x: cx, y: py });
      if (trail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = pal.yellow;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 2;
        ctx.moveTo(trail[0].x, trail[0].y);
        for (const pt of trail) ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.restore();
      }

      // triangle rectangle de la branche courante
      const p = t / Th;
      const k = Math.floor(p);
      const legStartT = Math.max(lapT0, k * Th);
      const legStartX = xLeft + vScreen * (legStartT - lapT0);
      const legStartY = k % 2 === 0 ? yBot : yTop;
      // hypoténuse (trajet photon) en surbrillance
      line(ctx, legStartX, legStartY, cx, py, pal.yellow, 2.6);
      // cathète horizontale : v·t
      line(ctx, legStartX, legStartY, cx, legStartY, pal.green, 1.6, [5, 4]);
      // cathète verticale : c·t₀
      line(ctx, cx, legStartY, cx, py, pal.blue, 1.6, [5, 4]);
      if (Math.abs(cx - legStartX) > 24) {
        text(ctx, 'v·t', (legStartX + cx) / 2, legStartY + (legStartY === yBot ? 14 : -6), {
          color: pal.green,
          size: 11,
          align: 'center',
          italic: true,
        });
        text(ctx, 'c·t', (legStartX + cx) / 2 - 6, (legStartY + py) / 2, {
          color: pal.yellow,
          size: 11,
          align: 'right',
          italic: true,
          weight: 700,
        });
      }

      // miroirs + photon par-dessus
      drawMirrors(cx, cy, pal.blue);
      circle(ctx, cx, py, 6, pal.yellow);
    }

    // bandeau « plus c'est rapide, plus c'est lent »
    if (beta > 0.01) {
      text(ctx, `γ = ${fmt(g, 2)} → l'horloge mobile bat ${fmt(g, 2)}× plus lentement`, W - 14, H - 12, {
        color: pal.text,
        size: 12,
        align: 'right',
        weight: 700,
      });
    }
  }

  function loop(ts: number) {
    if (!playing) return;
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    t += dt * SPEED;
    refresh();
    scene.requestDraw();
    requestAnimationFrame(loop);
  }

  slider.addEventListener('input', () => {
    beta = parseFloat(slider.value);
    refresh();
    scene.requestDraw();
  });
  playBtn.addEventListener('click', () => setPlay(!playing));
  resetBtn.addEventListener('click', reset);

  refresh();
  if (playing) requestAnimationFrame(loop);
  else playBtn.textContent = '▶ Lecture';
}

document.querySelectorAll<HTMLElement>('[data-iw="lightclock"]').forEach(init);
