import { createScene, line, text, clamp, map, fmt, type Scene } from './_canvas';

/** Nombre de périodes du créneau affichées sur l'axe du temps. */
const PERIODS = 2;
/** Échantillons par période pour tracer la somme partielle et mesurer l'erreur. */
const SAMPLES = 900;

/**
 * Somme partielle de Fourier d'un créneau impair d'amplitude 1, période 1 :
 *   s_N(t) = (4/π) · Σ_{j=0..N-1} sin(2π (2j+1) t) / (2j+1).
 * Les harmoniques retenues sont donc 1, 3, 5, … (2N−1) fois le fondamental.
 */
function square(t: number, N: number): number {
  let s = 0;
  for (let j = 0; j < N; j++) {
    const k = 2 * j + 1;
    s += Math.sin(2 * Math.PI * k * t) / k;
  }
  return (4 / Math.PI) * s;
}

/** Créneau idéal d'amplitude 1 (référence en pointillés). */
function ideal(t: number): number {
  const frac = t - Math.floor(t);
  return frac < 0.5 ? 1 : -1;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slN = root.querySelector<HTMLInputElement>('[data-n]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outFmax = root.querySelector<HTMLElement>('[data-out-fmax]')!;
  const outErr = root.querySelector<HTMLElement>('[data-out-err]')!;

  let N = parseInt(slN.value, 10);

  const scene = createScene(canvas, draw);

  function refresh() {
    outN.textContent = String(N);
    // Harmonique la plus haute = (2N−1)·f0.
    outFmax.textContent = `${2 * N - 1} × f₀`;

    // Erreur quadratique moyenne entre la somme partielle et le créneau idéal,
    // calculée loin des discontinuités (le phénomène de Gibbs y reste local).
    let acc = 0;
    let count = 0;
    for (let i = 0; i < SAMPLES; i++) {
      const t = (i / SAMPLES) * PERIODS;
      const frac = t - Math.floor(t);
      // on saute une bande étroite autour des sauts (frac ≈ 0 ou 0,5)
      if (Math.abs(frac) < 0.02 || Math.abs(frac - 0.5) < 0.02 || Math.abs(frac - 1) < 0.02) continue;
      const d = square(t, N) - ideal(t);
      acc += d * d;
      count++;
    }
    const rms = Math.sqrt(acc / Math.max(count, 1));
    outErr.textContent = fmt(rms, 3);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // Deux panneaux : à gauche le signal (temps), à droite le spectre (fréquence).
    const gap = 26;
    const splitX = Math.round(W * 0.62);
    drawSignal(0, splitX - gap / 2);
    drawSpectrum(splitX + gap / 2, W);

    function drawSignal(left: number, right: number) {
      const padL = 12,
        padR = 12,
        padT = 22,
        padB = 30;
      const x0 = left + padL,
        x1 = right - padR,
        yTop = padT,
        yBot = H - padB;
      const yMid = (yTop + yBot) / 2;
      const amp = (yBot - yTop) / 2 - 6;

      const xOf = (t: number) => map(t, 0, PERIODS, x0, x1);
      const yOf = (v: number) => yMid - clamp(v, -1.35, 1.35) * amp;

      // axe horizontal (t)
      line(ctx, x0, yMid, x1, yMid, pal.grid, 1);
      line(ctx, x0, yOf(1), x1, yOf(1), pal.grid, 1, [3, 4]);
      line(ctx, x0, yOf(-1), x1, yOf(-1), pal.grid, 1, [3, 4]);
      text(ctx, 'signal s(t)', x0, yTop - 6, { color: pal.text, size: 12, weight: 700, baseline: 'bottom' });
      text(ctx, 't', x1, yMid + 14, { color: pal.muted, size: 12, italic: true, align: 'right', baseline: 'top' });

      // créneau idéal (référence, pointillés)
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = pal.muted;
      for (let p = 0; p < PERIODS; p++) {
        const a = xOf(p),
          b = xOf(p + 0.5),
          c = xOf(p + 1);
        ctx.moveTo(a, yOf(1));
        ctx.lineTo(b, yOf(1));
        ctx.lineTo(b, yOf(-1));
        ctx.lineTo(c, yOf(-1));
      }
      ctx.stroke();
      ctx.restore();

      // somme partielle de Fourier
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = pal.blue;
      for (let px = x0; px <= x1; px++) {
        const t = map(px, x0, x1, 0, PERIODS);
        const y = yOf(square(t, N));
        if (px === x0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawSpectrum(left: number, right: number) {
      const padL = 14,
        padR = 14,
        padT = 22,
        padB = 30;
      const x0 = left + padL,
        x1 = right - padR,
        yTop = padT,
        yBot = H - padB;

      // Axe des fréquences : on affiche jusqu'à l'harmonique (2N−1) avec un peu de marge.
      const kMaxShown = Math.max(2 * N - 1, 9);
      const xOf = (k: number) => map(k, 0, kMaxShown + 1, x0, x1);
      const yOf = (a: number) => map(a, 0, 1, yBot, yTop);

      line(ctx, x0, yBot, x1, yBot, pal.border, 1.5);
      text(ctx, 'spectre |a(f)|', x0, yTop - 6, { color: pal.text, size: 12, weight: 700, baseline: 'bottom' });
      text(ctx, 'f (× f₀)', x1, yBot + 6, { color: pal.muted, size: 12, italic: true, align: 'right', baseline: 'top' });

      // raies : amplitude relative 1/k pour les harmoniques impaires retenues.
      for (let k = 1; k <= kMaxShown; k += 2) {
        const retained = k <= 2 * N - 1;
        const a = 1 / k; // amplitude relative (fondamental = 1)
        const x = xOf(k);
        const yt = yOf(a);
        line(ctx, x, yBot, x, yt, retained ? pal.yellow : pal.grid, retained ? 3 : 2);
        if (retained && k <= 9) {
          text(ctx, String(k), x, yBot + 6, { color: pal.muted, size: 10, align: 'center', baseline: 'top' });
        }
      }
    }
  }

  slN.addEventListener('input', () => {
    N = parseInt(slN.value, 10);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-spectre"]').forEach(init);
