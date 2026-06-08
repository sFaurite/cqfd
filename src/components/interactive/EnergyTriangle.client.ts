import { createScene, line, arrow, text, fmt, type Scene } from './_canvas';

const VMAX = 3; // GeV, valeur max des côtés

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sm = root.querySelector<HTMLInputElement>('[data-m]')!;
  const sp = root.querySelector<HTMLInputElement>('[data-p]')!;
  const outM = root.querySelector<HTMLElement>('[data-out-m]')!;
  const outP = root.querySelector<HTMLElement>('[data-out-p]')!;
  const outE = root.querySelector<HTMLElement>('[data-out-e]')!;
  const outCas = root.querySelector<HTMLElement>('[data-out-cas]')!;

  let mc2 = parseFloat(sm.value);
  let pc = parseFloat(sp.value);

  const scene = createScene(canvas, draw);

  function refresh() {
    const E = Math.hypot(mc2, pc);
    outM.textContent = `${fmt(mc2, 2)} GeV`;
    outP.textContent = `${fmt(pc, 2)} GeV`;
    outE.textContent = `${fmt(E, 3)} GeV`;
    outCas.textContent =
      mc2 < 0.06 ? 'sans masse : E = pc' : pc < 0.06 ? 'au repos : E = mc²' : 'général : E² = (mc²)² + (pc)²';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 96,
      padB = 56,
      padT = 46,
      padR = 120;
    const availW = W - padL - padR;
    const availH = H - padT - padB;
    const scale = Math.min(availW, availH) / VMAX;

    // origine (angle droit) en bas à gauche
    const ox = padL;
    const oy = H - padB;
    const ax = ox + mc2 * scale; // extrémité côté horizontal
    const bx = ox;
    const by = oy - pc * scale; // extrémité côté vertical
    const E = Math.hypot(mc2, pc);

    // marqueur d'angle droit
    const r = 12;
    if (mc2 > 0.06 && pc > 0.06) {
      ctx.strokeStyle = pal.muted;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(ox, oy - r, r, r);
    }

    // côté horizontal mc² (vert)
    arrow(ctx, ox, oy, ax, oy, pal.green, 3);
    text(ctx, `mc² = ${fmt(mc2, 2)}`, (ox + ax) / 2, oy + 22, {
      color: pal.green,
      size: 13,
      align: 'center',
      weight: 700,
    });

    // côté vertical pc (bleu)
    arrow(ctx, bx, oy, bx, by, pal.blue, 3);
    text(ctx, `pc = ${fmt(pc, 2)}`, bx - 10, (oy + by) / 2, {
      color: pal.blue,
      size: 13,
      align: 'right',
      weight: 700,
    });

    // hypoténuse E (jaune)
    line(ctx, ax, oy, bx, by, pal.yellow, 3.2);
    const mx = (ax + bx) / 2;
    const my = (oy + by) / 2;
    text(ctx, `E = ${fmt(E, 2)}`, mx + 14, my - 8, { color: pal.yellow, size: 14, weight: 700 });

    // équation en haut
    text(ctx, 'E² = (mc²)² + (pc)²', W - 12, 24, {
      color: pal.text,
      size: 14,
      align: 'right',
      weight: 700,
    });
    // vérification numérique
    text(
      ctx,
      `${fmt(E, 2)}² = ${fmt(mc2, 2)}² + ${fmt(pc, 2)}²`,
      W - 12,
      44,
      { color: pal.muted, size: 12, align: 'right' },
    );
  }

  sm.addEventListener('input', () => {
    mc2 = parseFloat(sm.value);
    refresh();
    scene.requestDraw();
  });
  sp.addEventListener('input', () => {
    pc = parseFloat(sp.value);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="etriangle"]').forEach(init);
