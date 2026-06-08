import { createScene, line, circle, text, clamp, map, type Scene } from './_canvas';

const HALF_LIFE = 5730; // demi-vie du carbone 14 (années)
const LAMBDA = Math.LN2 / HALF_LIFE; // constante de décroissance
const AGE_MAX = 50000; // limite pratique de la méthode (années)
const LIMITE_FRAC = 100 * Math.exp(-LAMBDA * AGE_MAX); // % de C-14 restant à 50 ka (~0,3 %)

/** Âge (années) correspondant à une fraction de C-14 restante (en %). */
function ageFromFrac(fracPct: number): number {
  const f = clamp(fracPct / 100, 1e-6, 1);
  return -Math.log(f) / LAMBDA;
}

function fmtAge(a: number): string {
  if (a >= 1000) return `${Math.round(a / 100) / 10} ka`.replace('.', ',');
  return `${Math.round(a)} ans`;
}
function fmtAgeYears(a: number): string {
  return `${Math.round(a).toLocaleString('fr-FR')} ans`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slFrac = root.querySelector<HTMLInputElement>('[data-frac]')!;
  const slErr = root.querySelector<HTMLInputElement>('[data-err]')!;
  const outFrac = root.querySelector<HTMLElement>('[data-out-frac]')!;
  const outErr = root.querySelector<HTMLElement>('[data-out-err]')!;
  const outAge = root.querySelector<HTMLElement>('[data-out-age]')!;
  const outRange = root.querySelector<HTMLElement>('[data-out-range]')!;
  const outHl = root.querySelector<HTMLElement>('[data-out-hl]')!;

  let frac = parseFloat(slFrac.value); // % de C-14 restant
  let errPct = parseFloat(slErr.value); // incertitude absolue sur la mesure, en points de %

  const scene = createScene(canvas, draw);

  function bounds() {
    const fLow = clamp(frac - errPct, 0.05, 100); // moins de C-14 -> plus vieux
    const fHigh = clamp(frac + errPct, 0.05, 100); // plus de C-14 -> plus jeune
    const ageCentral = ageFromFrac(frac);
    const ageOld = ageFromFrac(fLow);
    const ageYoung = ageFromFrac(fHigh);
    return { ageCentral, ageOld, ageYoung };
  }

  function refresh() {
    outFrac.textContent = `${frac.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`;
    outErr.textContent = `±${errPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %`;

    const { ageCentral, ageOld, ageYoung } = bounds();
    const horsLimite = ageCentral > AGE_MAX || frac <= LIMITE_FRAC;

    outAge.textContent = horsLimite ? '> 50 000 ans' : fmtAgeYears(ageCentral);
    outRange.textContent = horsLimite
      ? 'hors de portée'
      : `${fmtAgeYears(ageYoung)} – ${fmtAgeYears(ageOld)}`;
    outHl.textContent = (ageCentral / HALF_LIFE).toLocaleString('fr-FR', {
      maximumFractionDigits: 2,
    });
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 46;
    const padR = 18;
    const padT = 16;
    const padB = 34;
    const x0 = padL;
    const x1 = W - padR;
    const y0 = H - padB; // bas (0 %)
    const y1 = padT; // haut (100 %)

    const xOf = (age: number) => map(clamp(age, 0, AGE_MAX), 0, AGE_MAX, x0, x1);
    const yOf = (pct: number) => map(clamp(pct, 0, 100), 0, 100, y0, y1);

    // Grille horizontale (pourcentages) + lignes verticales aux demi-vies.
    for (let p = 0; p <= 100; p += 25) {
      const y = yOf(p);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, `${p}%`, x0 - 6, y, { color: pal.muted, size: 11, align: 'right', baseline: 'middle' });
    }
    for (let n = 1; n * HALF_LIFE <= AGE_MAX; n++) {
      const age = n * HALF_LIFE;
      const x = xOf(age);
      line(ctx, x, y0, x, y1, pal.grid, 1, [3, 3]);
      text(ctx, fmtAge(age), x, y0 + 7, { color: pal.muted, size: 10, align: 'center', baseline: 'top' });
    }

    // Axes.
    line(ctx, x0, y0, x1, y0, pal.border, 1.5);
    line(ctx, x0, y0, x0, y1, pal.border, 1.5);
    text(ctx, 'C-14 restant', x0 - 38, y1 - 2, { color: pal.text, size: 11.5, baseline: 'bottom', weight: 700 });
    text(ctx, 'âge (années)', x1, y0 + 20, { color: pal.text, size: 11.5, align: 'right', baseline: 'top', weight: 700 });

    // Courbe de décroissance exponentielle.
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = pal.blue;
    for (let px = x0; px <= x1; px++) {
      const age = map(px, x0, x1, 0, AGE_MAX);
      const pct = 100 * Math.exp(-LAMBDA * age);
      const y = yOf(pct);
      if (px === x0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();

    // Zone limite de la méthode (au-delà de ~50 ka / sous ~0,3 %).
    const yLim = yOf(LIMITE_FRAC);
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = pal.red;
    ctx.fillRect(x0, yLim, x1 - x0, y0 - yLim);
    ctx.restore();
    line(ctx, x0, yLim, x1, yLim, pal.red, 1.2, [4, 4]);
    text(ctx, 'limite de la méthode (~50 ka)', x1 - 4, yLim + 4, {
      color: pal.red,
      size: 10.5,
      align: 'right',
      baseline: 'top',
      weight: 700,
    });

    // Point courant + fourchette d'incertitude.
    const { ageCentral, ageOld, ageYoung } = bounds();
    const cy = yOf(frac);

    // Barre d'incertitude horizontale (en âge) à la hauteur de la fraction mesurée.
    const xY = xOf(Math.min(ageYoung, AGE_MAX));
    const xO = xOf(Math.min(ageOld, AGE_MAX));
    ctx.save();
    ctx.strokeStyle = pal.yellow;
    ctx.lineWidth = 2;
    line(ctx, xY, cy, xO, cy, pal.yellow, 2);
    line(ctx, xY, cy - 6, xY, cy + 6, pal.yellow, 2);
    line(ctx, xO, cy - 6, xO, cy + 6, pal.yellow, 2);
    ctx.restore();

    // Bande d'incertitude verticale (mesure ± err) en surimpression légère.
    const yTop = yOf(clamp(frac + errPct, 0, 100));
    const yBot = yOf(clamp(frac - errPct, 0, 100));
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = pal.yellow;
    ctx.fillRect(x0, yTop, x1 - x0, yBot - yTop);
    ctx.restore();

    // Lignes de visée vers les axes + point.
    const cx = xOf(Math.min(ageCentral, AGE_MAX));
    line(ctx, cx, y0, cx, cy, pal.yellow, 1.2, [4, 3]);
    line(ctx, x0, cy, cx, cy, pal.yellow, 1.2, [4, 3]);
    circle(ctx, cx, cy, 5.5, pal.yellow, pal.bg, 2);

    // Étiquette d'âge.
    const horsLimite = ageCentral > AGE_MAX || frac <= LIMITE_FRAC;
    const lbl = horsLimite ? 'âge > 50 000 ans' : `âge ≈ ${fmtAgeYears(ageCentral)}`;
    text(ctx, lbl, clamp(cx + 8, x0, x1 - 130), Math.max(cy - 10, y1 + 12), {
      color: pal.yellow,
      size: 12.5,
      weight: 700,
    });
  }

  slFrac.addEventListener('input', () => {
    frac = parseFloat(slFrac.value);
    refresh();
    scene.requestDraw();
  });
  slErr.addEventListener('input', () => {
    errPct = parseFloat(slErr.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="datation-c14"]').forEach(init);
