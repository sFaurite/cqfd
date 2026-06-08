import { createScene, line, circle, text, clamp, map, prefersReducedMotion, type Scene } from './_canvas';

type Phase = 'slow-start' | 'avoidance';

interface Point {
  rtt: number;
  cwnd: number;
  phase: Phase;
  /** une perte vient d'être injectée juste avant ce point (chute) */
  loss?: boolean;
}

/** Paramètres initiaux du modèle (en segments / MSS). */
const CWND0 = 1;
const SSTHRESH0 = 16;
const CWND_CAP = 40; // plafond d'affichage de l'axe cwnd

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnPlay = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const btnStep = root.querySelector<HTMLButtonElement>('[data-step]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const btnLoss = root.querySelector<HTMLButtonElement>('[data-loss]')!;
  const outRtt = root.querySelector<HTMLElement>('[data-out-rtt]')!;
  const outCwnd = root.querySelector<HTMLElement>('[data-out-cwnd]')!;
  const outSsthresh = root.querySelector<HTMLElement>('[data-out-ssthresh]')!;
  const outPhase = root.querySelector<HTMLElement>('[data-out-phase]')!;

  const reduce = prefersReducedMotion();

  let pts: Point[] = [];
  let cwnd = CWND0;
  let ssthresh = SSTHRESH0;
  let rtt = 0;
  let playing = false;
  let raf = 0;
  let lastT = 0;
  const RTT_PER_SEC = 2.2; // vitesse de l'animation

  const scene = createScene(canvas, draw);

  function phaseOf(c: number, ss: number): Phase {
    return c < ss ? 'slow-start' : 'avoidance';
  }

  function reset() {
    pts = [];
    cwnd = CWND0;
    ssthresh = SSTHRESH0;
    rtt = 0;
    pts.push({ rtt, cwnd, phase: phaseOf(cwnd, ssthresh) });
    stopPlay();
    refresh();
    scene.requestDraw();
  }

  /** Avance d'un RTT : double (slow start) ou +1 (avoidance). */
  function stepRtt() {
    rtt += 1;
    if (cwnd < ssthresh) {
      cwnd = Math.min(cwnd * 2, CWND_CAP);
    } else {
      cwnd = Math.min(cwnd + 1, CWND_CAP);
    }
    pts.push({ rtt, cwnd, phase: phaseOf(cwnd, ssthresh) });
    refresh();
    scene.requestDraw();
  }

  /** Injecte une perte : multiplicative decrease (AIMD). */
  function injectLoss() {
    ssthresh = Math.max(2, Math.floor(cwnd / 2));
    cwnd = ssthresh; // reprise directe en congestion avoidance (Reno)
    rtt += 1;
    pts.push({ rtt, cwnd, phase: phaseOf(cwnd, ssthresh), loss: true });
    refresh();
    scene.requestDraw();
  }

  function refresh() {
    outRtt.textContent = String(rtt);
    outCwnd.textContent = `${cwnd} MSS`;
    outSsthresh.textContent = `${ssthresh} MSS`;
    const ph = phaseOf(cwnd, ssthresh);
    outPhase.textContent = ph === 'slow-start' ? 'slow start (×2)' : 'congestion avoidance (+1)';
    outPhase.style.color = ph === 'slow-start' ? 'var(--c-blue)' : 'var(--c-green)';
  }

  function loop(now: number) {
    if (!playing) return;
    if (!lastT) lastT = now;
    const dt = (now - lastT) / 1000;
    if (dt >= 1 / RTT_PER_SEC) {
      lastT = now;
      if (rtt >= 60) {
        stopPlay();
        return;
      }
      stepRtt();
    }
    raf = requestAnimationFrame(loop);
  }

  function startPlay() {
    if (reduce) {
      // Sans animation : un clic = un RTT.
      stepRtt();
      return;
    }
    playing = true;
    btnPlay.textContent = '⏸ pause';
    btnPlay.classList.add('active');
    lastT = 0;
    raf = requestAnimationFrame(loop);
  }

  function stopPlay() {
    playing = false;
    btnPlay.textContent = '▶ lecture';
    btnPlay.classList.remove('active');
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function togglePlay() {
    if (playing) stopPlay();
    else startPlay();
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 48,
      padR = 20,
      padT = 22,
      padB = 38;
    const x0 = padL,
      x1 = W - padR,
      y0 = H - padB,
      y1 = padT;

    const rttMax = Math.max(14, Math.ceil((rtt + 2) / 2) * 2);
    const xOf = (r: number) => map(r, 0, rttMax, x0, x1);
    const yOf = (c: number) => map(clamp(c, 0, CWND_CAP), 0, CWND_CAP, y0, y1);

    // Grille.
    for (let c = 0; c <= CWND_CAP; c += 8) {
      const y = yOf(c);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, String(c), x0 - 8, y, { color: pal.muted, size: 11, align: 'right', baseline: 'middle' });
    }
    const rttStep = rttMax <= 20 ? 2 : 4;
    for (let r = 0; r <= rttMax; r += rttStep) {
      const x = xOf(r);
      line(ctx, x, y0, x, y1, pal.grid, 1);
      text(ctx, String(r), x, y0 + 8, { color: pal.muted, size: 11, align: 'center', baseline: 'top' });
    }

    // Axes.
    line(ctx, x0, y0, x1, y0, pal.border, 1.5);
    line(ctx, x0, y0, x0, y1, pal.border, 1.5);
    text(ctx, 'cwnd (MSS)', x0 - 30, y1 - 4, { color: pal.text, size: 12, weight: 700, baseline: 'bottom' });
    text(ctx, 'RTT', x1, y0 + 22, { color: pal.text, size: 12, italic: true, align: 'right', baseline: 'top' });

    // Ligne ssthresh courante.
    const yss = yOf(ssthresh);
    line(ctx, x0, yss, x1, yss, pal.yellow, 1.4, [6, 4]);
    text(ctx, `ssthresh = ${ssthresh}`, x1 - 4, yss - 5, {
      color: pal.yellow, size: 11, align: 'right', baseline: 'bottom', weight: 700,
    });

    // Courbe cwnd : segments colorés par phase, chutes verticales aux pertes.
    if (pts.length > 0) {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const col = b.loss ? pal.red : b.phase === 'slow-start' ? pal.blue : pal.green;
        if (b.loss) {
          // chute : trait horizontal jusqu'au nouveau RTT puis chute verticale.
          line(ctx, xOf(a.rtt), yOf(a.cwnd), xOf(b.rtt), yOf(a.cwnd), pal.red, 1.6, [4, 3]);
          line(ctx, xOf(b.rtt), yOf(a.cwnd), xOf(b.rtt), yOf(b.cwnd), pal.red, 2.6);
        } else {
          line(ctx, xOf(a.rtt), yOf(a.cwnd), xOf(b.rtt), yOf(b.cwnd), col, 2.6);
        }
      }
      // Points.
      for (const p of pts) {
        const col = p.loss ? pal.red : p.phase === 'slow-start' ? pal.blue : pal.green;
        circle(ctx, xOf(p.rtt), yOf(p.cwnd), p.loss ? 4.5 : 3, col, pal.bg, 1.2);
      }
      // Marqueur courant.
      const last = pts[pts.length - 1];
      circle(ctx, xOf(last.rtt), yOf(last.cwnd), 6, pal.yellow, pal.bg, 2);
    }

    // Légende des phases.
    const lx = x0 + 8;
    const ly = y1 + 8;
    const legend: Array<[string, string]> = [
      [pal.blue, 'slow start (×2)'],
      [pal.green, 'avoidance (+1)'],
      [pal.red, 'perte (÷2)'],
    ];
    let cx = lx;
    for (const [col, lab] of legend) {
      line(ctx, cx, ly, cx + 16, ly, col, 3);
      text(ctx, lab, cx + 21, ly, { color: pal.muted, size: 11, align: 'left', baseline: 'middle' });
      ctx.save();
      ctx.font = '11px Inter, system-ui, sans-serif';
      cx += 21 + ctx.measureText(lab).width + 18;
      ctx.restore();
    }
  }

  btnPlay.addEventListener('click', togglePlay);
  btnStep.addEventListener('click', () => {
    stopPlay();
    stepRtt();
  });
  btnReset.addEventListener('click', reset);
  btnLoss.addEventListener('click', () => {
    stopPlay();
    injectLoss();
  });

  reset();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-congestion"]').forEach(init);
