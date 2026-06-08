import { createScene, line, text, fmt, map, type Scene } from './_canvas';

const R = 8.314e-3; // kJ/(mol·K)
const CAT_FACTOR = 0.6; // le catalyseur abaisse Ea à 60 %

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sDh = root.querySelector<HTMLInputElement>('[data-dh]')!;
  const sEa = root.querySelector<HTMLInputElement>('[data-ea]')!;
  const sTemp = root.querySelector<HTMLInputElement>('[data-temp]')!;
  const cbCat = root.querySelector<HTMLInputElement>('[data-cat]')!;
  const outDh = root.querySelector<HTMLElement>('[data-out-dh]')!;
  const outEa = root.querySelector<HTMLElement>('[data-out-ea]')!;
  const outTemp = root.querySelector<HTMLElement>('[data-out-temp]')!;
  const outCat = root.querySelector<HTMLElement>('[data-out-cat]')!;
  const outDhr = root.querySelector<HTMLElement>('[data-out-dhr]')!;
  const outEaeff = root.querySelector<HTMLElement>('[data-out-eaeff]')!;
  const outEainv = root.querySelector<HTMLElement>('[data-out-eainv]')!;
  const outK = root.querySelector<HTMLElement>('[data-out-k]')!;
  const outNat = root.querySelector<HTMLElement>('[data-out-nat]')!;

  let dh = +sDh.value;
  let ea = +sEa.value;
  let temp = +sTemp.value;
  let cat = cbCat.checked;

  const scene = createScene(canvas, draw);

  /** Eₐ doit être ≥ max(ΔH, 0) + marge pour que l'état de transition soit au-dessus. */
  function eaMin(): number { return Math.max(dh, 0) + 10; }
  function eaEff(): number { return Math.max(eaMin(), cat ? ea * CAT_FACTOR : ea); }
  function eaInverse(): number { return eaEff() - dh; }

  /** Vitesse relative (Arrhenius) normalisée à T=298 K, Eₐ de base sans catalyseur. */
  function vitesseRelative(): number {
    const k = Math.exp(-eaEff() / (R * temp));
    const k0 = Math.exp(-ea / (R * 298));
    return k / k0;
  }

  function refresh() {
    if (ea < eaMin()) { ea = Math.ceil(eaMin() / 5) * 5; sEa.value = String(ea); }
    sEa.min = String(Math.ceil(eaMin() / 5) * 5);
    outDh.textContent = (dh > 0 ? '+' : '') + String(dh);
    outEa.textContent = String(ea);
    outTemp.textContent = String(temp);
    outCat.textContent = cat ? 'oui' : 'non';
    outDhr.textContent = `${dh > 0 ? '+' : ''}${dh} kJ/mol`;
    outEaeff.textContent = `${fmt(eaEff(), 0)} kJ/mol`;
    outEainv.textContent = `${fmt(eaInverse(), 0)} kJ/mol`;
    const vr = vitesseRelative();
    outK.textContent = vr >= 1 ? `×${fmt(vr, vr > 100 ? 0 : 1)}` : `×${vr.toExponential(1).replace('.', ',')}`;
    outNat.textContent = dh < 0 ? 'exothermique' : dh > 0 ? 'endothermique' : 'athermique';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    refresh();

    const padL = 50, padR = 24, padT = 24, padB = 38;
    const x0 = padL, x1 = W - padR;
    const y0 = H - padB, yTop = padT;

    // Échelle d'énergie : du min(produits,0) au sommet le plus haut.
    const eReact = 0;
    const eProd = dh;
    const peakNoCat = ea;
    const peakCat = eaEff();
    const eMaxVal = Math.max(peakNoCat, peakCat) + 20;
    const eMinVal = Math.min(eReact, eProd) - 20;
    const yOf = (e: number) => map(e, eMinVal, eMaxVal, y0, yTop);

    // Axes.
    line(ctx, x0, yTop, x0, y0, pal.border, 1.2);
    line(ctx, x0, y0, x1, y0, pal.border, 1.2);
    text(ctx, 'Énergie (kJ/mol)', x0 - 6, yTop - 8, {
      color: pal.muted, size: 11, align: 'left', baseline: 'alphabetic',
    });
    text(ctx, 'coordonnée de réaction', (x0 + x1) / 2, H - 8, {
      color: pal.muted, size: 11, align: 'center', baseline: 'alphabetic',
    });

    // Niveau zéro (réactifs).
    line(ctx, x0, yOf(0), x1, yOf(0), pal.grid, 1, [3, 5]);

    // Positions horizontales clés.
    const xR = x0 + (x1 - x0) * 0.1;  // réactifs
    const xTS = x0 + (x1 - x0) * 0.5; // état de transition
    const xP = x0 + (x1 - x0) * 0.9;  // produits

    // Courbe sans catalyseur (référence, plus claire).
    drawProfile(ctx, xR, xTS, xP, yOf(0), yOf(ea), yOf(dh), pal.muted, 1.6, true);

    // Courbe effective (avec/sans catalyseur).
    const colMain = cat ? pal.green : pal.blue;
    drawProfile(ctx, xR, xTS, xP, yOf(0), yOf(eaEff()), yOf(dh), colMain, 2.6, false);

    // Plateaux réactifs / produits (paliers).
    line(ctx, x0 + 4, yOf(0), xR, yOf(0), colMain, 2.6);
    line(ctx, xP, yOf(dh), x1 - 4, yOf(dh), colMain, 2.6);

    text(ctx, 'réactifs', xR, yOf(0) - 10, { color: pal.text, size: 11, weight: 700, align: 'center', baseline: 'alphabetic' });
    text(ctx, 'produits', xP, yOf(dh) + (dh < 0 ? 16 : -10), { color: pal.text, size: 11, weight: 700, align: 'center', baseline: 'alphabetic' });
    text(ctx, 'état de transition', xTS, yOf(eaEff()) - 8, { color: colMain, size: 11, weight: 700, align: 'center', baseline: 'alphabetic' });

    // Cote Eₐ (flèche verticale réactifs -> sommet).
    drawMeasure(ctx, xR - 18, yOf(0), yOf(eaEff()), `Eₐ = ${fmt(eaEff(), 0)}`, colMain);
    // Cote ΔH (réactifs -> produits).
    drawMeasure(ctx, xP + 18, yOf(0), yOf(dh), `ΔH = ${dh > 0 ? '+' : ''}${dh}`, dh < 0 ? pal.green : pal.red);

    if (cat) {
      text(ctx, 'catalyseur : Eₐ abaissée, ΔH inchangé', xTS, yTop + 4, {
        color: pal.green, size: 11, weight: 700, align: 'center', baseline: 'alphabetic',
      });
    }
  }

  /** Trace un profil lisse réactifs→TS→produits par courbes de Bézier. */
  function drawProfile(
    ctx: CanvasRenderingContext2D,
    xR: number, xTS: number, xP: number,
    yR: number, yTS: number, yP: number,
    col: string, w: number, dashed: boolean,
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash(dashed ? [5, 5] : []);
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.moveTo(xR, yR);
    ctx.bezierCurveTo((xR + xTS) / 2, yR, (xR + xTS) / 2, yTS, xTS, yTS);
    ctx.bezierCurveTo((xTS + xP) / 2, yTS, (xTS + xP) / 2, yP, xP, yP);
    ctx.stroke();
    ctx.restore();
  }

  /** Cote verticale avec double flèche et étiquette. */
  function drawMeasure(
    ctx: CanvasRenderingContext2D, x: number, yA: number, yB: number,
    label: string, col: string,
  ) {
    const top = Math.min(yA, yB), bot = Math.max(yA, yB);
    line(ctx, x, top, x, bot, col, 1.4);
    for (const yy of [top, bot]) {
      const dir = yy === top ? 1 : -1;
      ctx.beginPath();
      ctx.strokeStyle = col; ctx.lineWidth = 1.4;
      ctx.moveTo(x - 3, yy + dir * 4); ctx.lineTo(x, yy); ctx.lineTo(x + 3, yy + dir * 4);
      ctx.stroke();
    }
    text(ctx, label, x, (top + bot) / 2, {
      color: col, size: 10, weight: 700, align: 'center', baseline: 'middle',
    });
  }

  const on = (el: HTMLInputElement, fn: () => void) =>
    el.addEventListener('input', () => { fn(); refresh(); scene.requestDraw(); });
  on(sDh, () => (dh = +sDh.value));
  on(sEa, () => (ea = +sEa.value));
  on(sTemp, () => (temp = +sTemp.value));
  cbCat.addEventListener('change', () => { cat = cbCat.checked; refresh(); scene.requestDraw(); });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-energie"]').forEach(init);
