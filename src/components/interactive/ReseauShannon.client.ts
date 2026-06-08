import { createScene, line, circle, text, clamp, map, fmt, type Scene } from './_canvas';

/** Nombre de niveaux supposé pour la borne de Nyquist sans bruit. */
const NYQUIST_M = 4;
/** Plage de l'axe S/N (en dB) du graphe. */
const SNR_DB_MIN = 0;
const SNR_DB_MAX = 60;

/** Convertit un débit en bits/s vers une chaîne lisible (bit/s, kbit/s, Mbit/s, Gbit/s). */
function fmtRate(bps: number): string {
  if (bps >= 1e9) return `${fmt(bps / 1e9, 2)} Gbit/s`;
  if (bps >= 1e6) return `${fmt(bps / 1e6, 2)} Mbit/s`;
  if (bps >= 1e3) return `${fmt(bps / 1e3, 1)} kbit/s`;
  return `${fmt(bps, 0)} bit/s`;
}

/** Convertit une bande passante en Hz vers une chaîne lisible. */
function fmtHz(hz: number): string {
  if (hz >= 1e6) return `${fmt(hz / 1e6, hz >= 1e7 ? 0 : 1)} MHz`;
  if (hz >= 1e3) return `${fmt(hz / 1e3, hz >= 1e4 ? 0 : 1)} kHz`;
  return `${fmt(hz, 0)} Hz`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slB = root.querySelector<HTMLInputElement>('[data-b]')!;
  const slSnr = root.querySelector<HTMLInputElement>('[data-snr-db]')!;
  const outB = root.querySelector<HTMLElement>('[data-out-b]')!;
  const outSnrDb = root.querySelector<HTMLElement>('[data-out-snr-db]')!;
  const outSnrLin = root.querySelector<HTMLElement>('[data-out-snr-lin]')!;
  const outC = root.querySelector<HTMLElement>('[data-out-c]')!;
  const outEff = root.querySelector<HTMLElement>('[data-out-eff]')!;
  const outNyq = root.querySelector<HTMLElement>('[data-out-nyq]')!;

  let B = parseFloat(slB.value); // Hz
  let snrDb = parseFloat(slSnr.value); // dB

  const scene = createScene(canvas, draw);

  /** Efficacité spectrale de Shannon en bits/s/Hz. */
  const eff = (db: number) => Math.log2(1 + Math.pow(10, db / 10));

  function refresh() {
    const snrLin = Math.pow(10, snrDb / 10);
    const e = eff(snrDb);
    const C = B * e;
    const nyq = 2 * B * Math.log2(NYQUIST_M);

    outB.textContent = fmtHz(B);
    outSnrDb.textContent = `${fmt(snrDb, 1)} dB`;
    outSnrLin.textContent =
      snrLin >= 1000
        ? snrLin.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
        : fmt(snrLin, 2);
    outC.textContent = fmtRate(C);
    outEff.textContent = `${fmt(e, 2)} bit/s/Hz`;
    outNyq.textContent = fmtRate(nyq);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 56,
      padR = 22,
      padT = 22,
      padB = 40;
    const x0 = padL,
      x1 = W - padR,
      y0 = H - padB,
      y1 = padT;

    // Axe Y = efficacité spectrale (bit/s/Hz), borne haute = eff(SNR_DB_MAX) arrondie.
    const effMax = Math.ceil(eff(SNR_DB_MAX));
    const xOf = (db: number) => map(db, SNR_DB_MIN, SNR_DB_MAX, x0, x1);
    const yOf = (e: number) => map(clamp(e, 0, effMax), 0, effMax, y0, y1);

    // --- Grille ---
    for (let e = 0; e <= effMax; e += 2) {
      const y = yOf(e);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, String(e), x0 - 8, y, { color: pal.muted, size: 11, align: 'right', baseline: 'middle' });
    }
    for (let db = SNR_DB_MIN; db <= SNR_DB_MAX + 0.01; db += 10) {
      const x = xOf(db);
      line(ctx, x, y0, x, y1, pal.grid, 1);
      text(ctx, String(db), x, y0 + 8, { color: pal.muted, size: 11, align: 'center', baseline: 'top' });
    }

    // --- Axes ---
    line(ctx, x0, y0, x1, y0, pal.border, 1.5);
    line(ctx, x0, y0, x0, y1, pal.border, 1.5);
    text(ctx, 'bit/s/Hz', x0 - 30, y1 - 4, { color: pal.text, size: 12, weight: 700, baseline: 'bottom' });
    text(ctx, 'S/N (dB)', x1, y0 + 22, {
      color: pal.text, size: 12, italic: true, align: 'right', baseline: 'top',
    });

    // --- Courbe de Shannon eff(dB) = log2(1 + 10^(dB/10)) ---
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = pal.blue;
    for (let px = x0; px <= x1; px++) {
      const db = map(px, x0, x1, SNR_DB_MIN, SNR_DB_MAX);
      const y = yOf(eff(db));
      if (px === x0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();

    text(ctx, 'C / B = log₂(1 + S/N)', x1 - 6, yOf(eff(SNR_DB_MAX)) + 6, {
      color: pal.blue, size: 12, weight: 700, align: 'right', baseline: 'top',
    });

    // --- Point courant ---
    const e = eff(snrDb);
    const cx = xOf(snrDb);
    const cy = yOf(e);
    line(ctx, cx, y0, cx, cy, pal.yellow, 1.4, [4, 3]);
    line(ctx, x0, cy, cx, cy, pal.yellow, 1.4, [4, 3]);
    circle(ctx, cx, cy, 5.5, pal.yellow, pal.bg, 2);

    const lbl = `${fmt(e, 2)} bit/s/Hz`;
    text(ctx, lbl, clamp(cx + 8, x0, x1 - 110), cy - 10, {
      color: pal.yellow, size: 12, weight: 700, baseline: 'bottom',
    });
  }

  slB.addEventListener('input', () => {
    B = parseFloat(slB.value);
    refresh();
    scene.requestDraw();
  });
  slSnr.addEventListener('input', () => {
    snrDb = parseFloat(slSnr.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-shannon"]').forEach(init);
