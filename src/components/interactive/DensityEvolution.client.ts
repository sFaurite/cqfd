import { createScene, line, text, fmt, map, type Scene } from './_canvas';

// Paramètres de densité aujourd'hui (a = 1).
const OMR = 9e-5;
const OMM = 0.31;
const OML = 0.69;

const LOGA_MIN = -6;
const LOGA_MAX = 0.3;
const LOGY_MIN = -1.5;
const LOGY_MAX = 21;

// Densités (en unités de ρ_c0) à un a donné.
const rhoR = (a: number) => OMR * a ** -4;
const rhoM = (a: number) => OMM * a ** -3;
const rhoL = () => OML;

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sA = root.querySelector<HTMLInputElement>('[data-loga]')!;
  const outA = root.querySelector<HTMLElement>('[data-out-a]')!;
  const outZ = root.querySelector<HTMLElement>('[data-out-z]')!;
  const outDom = root.querySelector<HTMLElement>('[data-out-dom]')!;

  let logA = parseFloat(sA.value);
  const scene = createScene(canvas, draw);

  function expFmt(x: number): string {
    const e = Math.floor(Math.log10(x));
    const m = x / 10 ** e;
    return `${fmt(m, 1)}e${e}`;
  }

  function dominant(a: number): { name: string; color: (p: any) => string } {
    const r = rhoR(a), m = rhoM(a), l = rhoL();
    if (r >= m && r >= l) return { name: 'rayonnement', color: (p) => p.red };
    if (m >= r && m >= l) return { name: 'matière', color: (p) => p.blue };
    return { name: 'énergie noire (Λ)', color: (p) => p.orange };
  }

  function refresh() {
    const a = 10 ** logA;
    outA.textContent = `a = ${expFmt(a)}`;
    outZ.textContent = `z ≈ ${a >= 0.999 ? '0' : expFmt(1 / a - 1)}`;
    outDom.textContent = dominant(a).name;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 56, padB = 38, padT = 16, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
    const X = (la: number) => map(la, LOGA_MIN, LOGA_MAX, x0, x1);
    const Y = (ly: number) => map(ly, LOGY_MIN, LOGY_MAX, y0, y1);

    // grille décennies
    ctx.save();
    for (let la = LOGA_MIN; la <= LOGA_MAX; la++) {
      const x = X(la);
      line(ctx, x, y0, x, y1, pal.grid, 1);
      text(ctx, `10^${la}`, x, y0 + 16, { color: pal.muted, size: 9, align: 'center' });
    }
    for (let ly = 0; ly <= LOGY_MAX; ly += 5) {
      const y = Y(ly);
      line(ctx, x0, y, x1, y, pal.grid, 1);
      text(ctx, `10^${ly}`, x0 - 6, y + 3, { color: pal.muted, size: 9, align: 'right' });
    }
    ctx.restore();
    line(ctx, x0, y0, x1, y0, pal.muted, 1.4);
    line(ctx, x0, y0, x0, y1, pal.muted, 1.4);
    text(ctx, "facteur d'échelle a (échelle log)", (x0 + x1) / 2, H - 6, { color: pal.muted, size: 11, align: 'center' });
    ctx.save();
    ctx.translate(13, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'densité ρ / ρ_c0 (log)', 0, 0, { color: pal.muted, size: 11, align: 'center' });
    ctx.restore();

    const plot = (f: (a: number) => number, color: string, label: string, ly0: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      let started = false;
      for (let px = x0; px <= x1; px++) {
        const la = map(px, x0, x1, LOGA_MIN, LOGA_MAX);
        const a = 10 ** la;
        const ly = Math.log10(f(a));
        if (ly < LOGY_MIN - 1 || ly > LOGY_MAX + 1) { started = false; continue; }
        const py = Y(ly);
        if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
      text(ctx, label, x1 - 4, Y(ly0) - 4, { color, size: 11, align: 'right', weight: 700 });
    };

    plot(rhoR, pal.red, 'rayonnement  ∝ a⁻⁴', Math.log10(rhoR(10 ** -0.1)));
    plot(rhoM, pal.blue, 'matière  ∝ a⁻³', Math.log10(rhoM(10 ** -0.1)) + 1.4);
    plot(() => OML, pal.orange, 'Λ  = const.', Math.log10(OML) + 1.2);

    // marqueurs d'égalité
    const aEqRM = OMR / OMM; // rayonnement = matière
    const aEqML = (OMM / OML) ** (1 / 3); // matière = Λ
    const mark = (a: number, label: string) => {
      const x = X(Math.log10(a));
      line(ctx, x, y0, x, y1, pal.yellow, 1, [3, 3]);
      text(ctx, label, x, y1 + 10, { color: pal.yellow, size: 9.5, align: 'center', weight: 600 });
    };
    mark(aEqRM, 'égalité ray.–mat.');
    mark(aEqML, 'égalité mat.–Λ');

    // curseur
    const xc = X(logA);
    line(ctx, xc, y0, xc, y1, pal.text, 1.5);
    const dom = dominant(10 ** logA);
    text(ctx, dom.name, xc, y1 + 24, { color: dom.color(pal), size: 11, align: 'center', weight: 800 });
  }

  sA.addEventListener('input', () => {
    logA = parseFloat(sA.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="density-evolution"]').forEach(init);
