import { createScene, line, circle, text, fmt, clamp, map, type Scene } from './_canvas';

type Sys = 'AF' | 'Af' | 'Bf';

const V0 = 20; // mL de prise d'essai
const C0 = 0.1; // mol/L analyte
const Ct = 0.1; // mol/L titrant
const Veq = (V0 * C0) / Ct; // = 20 mL
const Kw = 1e-14;

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selType = root.querySelector<HTMLSelectElement>('[data-type]')!;
  const sPka = root.querySelector<HTMLInputElement>('[data-pka]')!;
  const sV = root.querySelector<HTMLInputElement>('[data-v]')!;
  const outPka = root.querySelector<HTMLElement>('[data-out-pka]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outPh = root.querySelector<HTMLElement>('[data-out-ph]')!;
  const outVeq = root.querySelector<HTMLElement>('[data-out-veq]')!;
  const outPheq = root.querySelector<HTMLElement>('[data-out-pheq]')!;
  const outPkaDemi = root.querySelector<HTMLElement>('[data-out-pkademi]')!;

  let sys = selType.value as Sys;
  let pKa = parseFloat(sPka.value);
  let V = parseFloat(sV.value);

  const scene = createScene(canvas, draw);

  /** pH du système après ajout de V mL de titrant. */
  function pH(v: number): number {
    const Ka = Math.pow(10, -pKa);
    const n0 = (C0 * V0) / 1000; // mol d'analyte
    const nt = (Ct * v) / 1000; // mol de titrant
    const Vtot = (V0 + v) / 1000; // L

    if (sys === 'AF') {
      // acide fort + base forte
      if (v < Veq) {
        const h = (n0 - nt) / Vtot;
        return -Math.log10(Math.max(h, 1e-13));
      } else if (v > Veq) {
        const oh = (nt - n0) / Vtot;
        return 14 + Math.log10(Math.max(oh, 1e-13));
      }
      return 7;
    }

    if (sys === 'Af') {
      // acide faible AH + base forte -> A-
      if (v <= 0) {
        // acide faible seul : h = sqrt(Ka*C)
        const h = Math.sqrt(Ka * C0);
        return -Math.log10(h);
      }
      if (v < Veq) {
        const nAH = n0 - nt;
        const nA = nt;
        return pKa + Math.log10(nA / nAH); // Henderson-Hasselbalch
      }
      if (v === Veq || Math.abs(v - Veq) < 1e-9) {
        const Cb = n0 / Vtot; // [A-]
        const oh = Math.sqrt((Kw / Ka) * Cb);
        return 14 + Math.log10(oh);
      }
      const oh = (nt - n0) / Vtot;
      return 14 + Math.log10(Math.max(oh, 1e-13));
    }

    // Bf : base faible + acide fort -> BH+
    if (v <= 0) {
      const Kb = Kw / Ka;
      const oh = Math.sqrt(Kb * C0);
      return 14 + Math.log10(oh);
    }
    if (v < Veq) {
      const nB = n0 - nt;
      const nBH = nt;
      // pH = pKa + log([B]/[BH+])
      return pKa + Math.log10(nB / nBH);
    }
    if (Math.abs(v - Veq) < 1e-9) {
      const Ca = n0 / Vtot; // [BH+]
      const h = Math.sqrt(Ka * Ca);
      return -Math.log10(h);
    }
    const h = (nt - n0) / Vtot;
    return -Math.log10(Math.max(h, 1e-13));
  }

  function phEq(): number {
    return pH(Veq);
  }

  function refresh() {
    outPka.textContent = fmt(pKa, 1);
    outV.textContent = fmt(V, 1);
    outPh.textContent = fmt(clamp(pH(V), 0, 14), 2);
    outVeq.textContent = `${fmt(Veq, 1)} mL`;
    outPheq.textContent = fmt(clamp(phEq(), 0, 14), 2);
    // demi-équivalence : pH=pKa pour Af, pOH=pKb pour Bf
    if (sys === 'AF') outPkaDemi.textContent = 'pH = 7 (saut net)';
    else if (sys === 'Af') outPkaDemi.textContent = `pH = pKa = ${fmt(pKa, 1)}`;
    else outPkaDemi.textContent = `pH = pKa = ${fmt(pKa, 1)}`;
    // pKa désactivé pour acide fort
    sPka.disabled = sys === 'AF';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 44, padR = 16, padT = 18, padB = 36;
    const x0 = padL, x1 = W - padR, y0 = H - padB, yTop = padT;
    const Vmax = 40;
    const xOf = (v: number) => map(v, 0, Vmax, x0, x1);
    const yOf = (p: number) => map(p, 0, 14, y0, yTop);

    // Grille + axes.
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    for (let p = 0; p <= 14; p += 2) {
      const y = yOf(p);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, String(p), x0 - 6, y, { color: pal.muted, size: 10, align: 'right', baseline: 'middle' });
    }
    for (let v = 0; v <= Vmax; v += 10) {
      const x = xOf(v);
      line(ctx, x, yTop, x, y0, pal.grid, 1);
      text(ctx, String(v), x, y0 + 6, { color: pal.muted, size: 10, align: 'center', baseline: 'top' });
    }
    line(ctx, x0, yTop, x0, y0, pal.border, 1.2);
    line(ctx, x0, y0, x1, y0, pal.border, 1.2);
    text(ctx, 'pH', x0 - 6, yTop - 6, { color: pal.muted, size: 11, align: 'left', baseline: 'alphabetic' });
    text(ctx, 'V titrant (mL)', (x0 + x1) / 2, H - 6, { color: pal.muted, size: 11, align: 'center', baseline: 'alphabetic' });

    // Zone tampon (pour acide/base faible) : autour de la demi-équivalence ±1 unité pKa.
    if (sys !== 'AF') {
      // zone où 0.1 < fraction titrée < 0.9
      const vLo = Veq * 0.1, vHi = Veq * 0.9;
      ctx.save();
      ctx.fillStyle = pal.teal;
      ctx.globalAlpha = 0.1;
      ctx.fillRect(xOf(vLo), yTop, xOf(vHi) - xOf(vLo), y0 - yTop);
      ctx.restore();
      text(ctx, 'zone tampon', (xOf(vLo) + xOf(vHi)) / 2, yTop + 12, {
        color: pal.teal, size: 11, weight: 700, align: 'center', baseline: 'middle',
      });
    }

    // Courbe pH = f(V).
    ctx.beginPath();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    const steps = 400;
    for (let i = 0; i <= steps; i++) {
      const v = (i / steps) * Vmax;
      const p = clamp(pH(v), 0, 14);
      const x = xOf(v), y = yOf(p);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Équivalence.
    const xe = xOf(Veq), ye = yOf(clamp(phEq(), 0, 14));
    line(ctx, xe, yTop, xe, y0, pal.red, 1.2, [4, 4]);
    circle(ctx, xe, ye, 4.5, pal.red);
    text(ctx, 'équivalence', xe, ye - 10, { color: pal.red, size: 11, weight: 700, align: 'center', baseline: 'alphabetic' });

    // Demi-équivalence (acide/base faible) : pH = pKa.
    if (sys !== 'AF') {
      const xh = xOf(Veq / 2), yh = yOf(clamp(pKa, 0, 14));
      circle(ctx, xh, yh, 4, pal.teal);
      line(ctx, x0, yh, xh, yh, pal.teal, 1, [3, 4]);
      text(ctx, 'pH = pKa', xh + 6, yh + (sys === 'Bf' ? -8 : 12), {
        color: pal.teal, size: 11, weight: 700, baseline: 'middle',
      });
    }

    // Point courant.
    const xc = xOf(V), yc = yOf(clamp(pH(V), 0, 14));
    circle(ctx, xc, yc, 6, pal.yellow, pal.bgElev, 2);
    text(ctx, `${fmt(V, 1)} mL · pH ${fmt(clamp(pH(V), 0, 14), 2)}`, clamp(xc, x0 + 60, x1 - 60), yc + (yc < H / 2 ? 18 : -14), {
      color: pal.yellow, size: 11, weight: 700, align: 'center', baseline: 'middle',
    });
  }

  selType.addEventListener('change', () => { sys = selType.value as Sys; refresh(); scene.requestDraw(); });
  sPka.addEventListener('input', () => { pKa = parseFloat(sPka.value); refresh(); scene.requestDraw(); });
  sV.addEventListener('input', () => { V = parseFloat(sV.value); refresh(); scene.requestDraw(); });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-titrage"]').forEach(init);
