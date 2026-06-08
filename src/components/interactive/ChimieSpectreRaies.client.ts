import { createScene, line, arrow, text, fmt, clamp, map, type Scene } from './_canvas';

const RH = 1.0973731568e7; // constante de Rydberg, m^-1
const E0 = 13.6056923; // eV, énergie d'ionisation de l'hydrogène
const NF_MAX = 9; // niveaux affichés sur le diagramme

interface Raie {
  ni: number;
  lambdaNm: number;
  deEv: number;
}

/** Longueur d'onde (nm) d'une transition ni → nf par la formule de Rydberg. */
function lambdaNm(nf: number, ni: number): number {
  const invL = RH * (1 / (nf * nf) - 1 / (ni * ni));
  return 1e9 / invL;
}
/** Énergie du photon (eV) pour ni → nf. */
function deEv(nf: number, ni: number): number {
  return E0 * (1 / (nf * nf) - 1 / (ni * ni));
}

/** Domaine spectral d'une longueur d'onde (nm). */
function domaine(nm: number): string {
  if (nm < 380) return 'UV';
  if (nm <= 750) return 'visible';
  return 'IR';
}

/** Couleur visible approchée d'une longueur d'onde (nm), sinon gris. */
function couleurVisible(nm: number, fallback: string): string {
  if (nm < 380 || nm > 750) return fallback;
  // approximation simple RGB du spectre visible
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else { r = 1; }
  const f = nm > 700 ? 0.3 + (0.7 * (780 - nm)) / 80 : 1;
  const to = (x: number) => Math.round(clamp(x, 0, 1) * f * 255);
  return `rgb(${to(r)},${to(g)},${to(b)})`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selSerie = root.querySelector<HTMLSelectElement>('[data-serie]')!;
  const sRaie = root.querySelector<HTMLInputElement>('[data-raie]')!;
  const outRaie = root.querySelector<HTMLElement>('[data-out-raie]')!;
  const outTrans = root.querySelector<HTMLElement>('[data-out-trans]')!;
  const outLambda = root.querySelector<HTMLElement>('[data-out-lambda]')!;
  const outDe = root.querySelector<HTMLElement>('[data-out-de]')!;
  const outDom = root.querySelector<HTMLElement>('[data-out-dom]')!;

  let nf = +selSerie.value;
  let ni = +sRaie.value;

  const scene = createScene(canvas, draw);

  function series(): Raie[] {
    const out: Raie[] = [];
    for (let n = nf + 1; n <= nf + 6; n++) {
      out.push({ ni: n, lambdaNm: lambdaNm(nf, n), deEv: deEv(nf, n) });
    }
    return out;
  }

  function refresh() {
    // ni doit rester > nf
    sRaie.min = String(nf + 1);
    sRaie.max = String(nf + 6);
    ni = clamp(ni, nf + 1, nf + 6);
    sRaie.value = String(ni);
    const lam = lambdaNm(nf, ni);
    const de = deEv(nf, ni);
    outRaie.textContent = `n = ${ni}`;
    outTrans.textContent = `${ni} → ${nf}`;
    outLambda.textContent = `${fmt(lam, 1)} nm`;
    outDe.textContent = `${fmt(de, 2)} eV`;
    outDom.textContent = domaine(lam);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const raies = series();
    // Plage de longueurs d'onde à afficher (log pour couvrir UV..IR).
    const lams = raies.map((r) => r.lambdaNm);
    const lmin = Math.min(...lams) * 0.85;
    const lmax = Math.max(...lams) * 1.05;

    // --- Bande spectrale (haut) ---
    const padX = 50;
    const bandY = H * 0.12;
    const bandH = H * 0.34;
    const x0 = padX;
    const x1 = W - padX;
    const xOf = (nm: number) =>
      map(Math.log(nm), Math.log(lmin), Math.log(lmax), x0, x1);

    // Fond de la bande (dégradé sombre).
    ctx.fillStyle = pal.surface;
    ctx.fillRect(x0, bandY, x1 - x0, bandH);
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0, bandY, x1 - x0, bandH);

    text(ctx, 'Spectre observé', x0, bandY - 8, {
      color: pal.muted, size: 12, weight: 700, baseline: 'alphabetic',
    });

    // Raies.
    raies.forEach((r) => {
      const x = xOf(r.lambdaNm);
      const active = r.ni === ni;
      const col = couleurVisible(r.lambdaNm, pal.muted);
      ctx.save();
      ctx.strokeStyle = active ? pal.yellow : col;
      ctx.lineWidth = active ? 3 : 1.6;
      ctx.globalAlpha = active ? 1 : 0.85;
      ctx.beginPath();
      ctx.moveTo(x, bandY + 2);
      ctx.lineTo(x, bandY + bandH - 2);
      ctx.stroke();
      ctx.restore();
      if (active) {
        text(ctx, `${fmt(r.lambdaNm, 0)} nm`, x, bandY + bandH + 6, {
          color: pal.yellow, size: 12, weight: 700, align: 'center', baseline: 'top',
        });
      }
    });

    // Graduation longueur d'onde.
    [lmin, Math.sqrt(lmin * lmax), lmax].forEach((nm) => {
      const x = xOf(nm);
      text(ctx, `${fmt(nm, 0)}`, x, bandY - 8, {
        color: pal.muted, size: 10, align: 'center', baseline: 'alphabetic',
      });
    });

    // --- Diagramme de niveaux (bas) ---
    const dY0 = H * 0.62;
    const dY1 = H * 0.94;
    const dx0 = padX;
    const dx1 = W - padX;
    // énergie E_n = -E0/n² ; on place verticalement par E_n.
    const eOf = (n: number) => -E0 / (n * n);
    const eMin = eOf(nf) - 0.5; // plus bas
    const eMax = 0; // n = ∞
    const yOf = (e: number) => map(e, eMin, eMax, dY1, dY0);

    text(ctx, 'Niveaux d’énergie', dx0, dY0 - 10, {
      color: pal.muted, size: 12, weight: 700, baseline: 'alphabetic',
    });

    for (let n = nf; n <= NF_MAX; n++) {
      const y = yOf(eOf(n));
      const isFloor = n === nf;
      line(ctx, dx0, y, dx1, y, isFloor ? pal.text : pal.border, isFloor ? 1.8 : 1);
      text(ctx, `n=${n}`, dx0 - 6, y, {
        color: pal.muted, size: 10, align: 'right', baseline: 'middle',
      });
    }

    // Flèches de transition pour toutes les raies (active surlignée).
    raies.forEach((r) => {
      const x = map(r.ni - (nf + 1), 0, 6, dx0 + (dx1 - dx0) * 0.18, dx1 - (dx1 - dx0) * 0.05);
      const yTop = yOf(eOf(r.ni));
      const yBot = yOf(eOf(nf));
      const active = r.ni === ni;
      const col = active ? pal.yellow : couleurVisible(r.lambdaNm, pal.blue);
      ctx.save();
      ctx.globalAlpha = active ? 1 : 0.45;
      arrow(ctx, x, yTop, x, yBot, col, active ? 2.4 : 1.4, 7);
      ctx.restore();
      if (active) {
        text(ctx, `${r.ni}→${nf}`, x + 5, (yTop + yBot) / 2, {
          color: pal.yellow, size: 11, weight: 700, baseline: 'middle',
        });
      }
    });
  }

  selSerie.addEventListener('change', () => {
    nf = +selSerie.value;
    // place ni juste au-dessus pour la nouvelle série
    ni = nf + 1;
    refresh();
    scene.requestDraw();
  });
  sRaie.addEventListener('input', () => {
    ni = +sRaie.value;
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-spectre"]').forEach(init);
