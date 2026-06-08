import { createScene, circle, text, line, arrow, clamp, type Scene } from './_canvas';

const CAPTIONS = [
  '① Un neutron, fait de trois quarks (u, d, d). Il est légèrement plus lourd que le proton, donc instable.',
  '② Sous l’effet de l’interaction faible, un quark d se transforme en quark u en émettant un boson W⁻ (massif → très courte portée).',
  '③ Le boson W⁻ se désintègre presque aussitôt en un électron (e⁻) et un antineutrino électronique (ν̄ₑ).',
  '④ Bilan : le neutron (udd) est devenu un proton (uud) ; un électron et un antineutrino sont éjectés. La charge est conservée (0 → +1 −1 + 0).',
];

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const cap = root.querySelector<HTMLElement>('[data-caption]')!;

  let step = 0;
  const scene = createScene(canvas, draw);

  function refresh() {
    cap.textContent = CAPTIONS[step];
    prev.disabled = step === 0;
    next.disabled = step === CAPTIONS.length - 1;
    prev.style.opacity = step === 0 ? '0.4' : '1';
    next.style.opacity = step === CAPTIONS.length - 1 ? '0.4' : '1';
  }

  function quark(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) {
    circle(ctx, x, y, 17, color, 'rgba(0,0,0,0.3)', 1);
    text(ctx, label, x, y, { color: '#04121a', size: 15, align: 'center', baseline: 'middle', weight: 800, italic: true });
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const cx = W * 0.28;
    const cy = H * 0.5;
    const up = pal.purple;
    const down = pal.teal;

    // nucléon de gauche (neutron → proton selon l'étape)
    const dChanged = step >= 1;
    text(ctx, step >= 3 ? 'proton (uud)' : 'neutron (udd)', cx, cy - 58, {
      color: pal.text,
      size: 13,
      align: 'center',
      weight: 700,
    });
    // halo nucléon
    circle(ctx, cx, cy, 42, 'rgba(88,196,221,0.08)', pal.border, 1.2);
    quark(ctx, cx - 16, cy - 12, 'u', up);
    quark(ctx, cx + 16, cy - 12, 'u', up);
    // le 3ᵉ quark : d (neutron) ou u après transformation
    quark(ctx, cx, cy + 18, dChanged ? 'u' : 'd', dChanged ? up : down);

    // émission du W
    if (step >= 1) {
      const wx = W * 0.55;
      const wy = cy;
      // ligne ondulée W
      ctx.save();
      ctx.strokeStyle = pal.red;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const x0 = cx + 20,
        x1 = step >= 2 ? wx : (cx + wx) / 2;
      const segs = 10;
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const x = x0 + (x1 - x0) * t;
        const y = cy + 18 + Math.sin(t * Math.PI * 5) * 6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
      text(ctx, 'W⁻', (x0 + x1) / 2, cy + 44, { color: pal.red, size: 13, align: 'center', weight: 700 });

      if (step >= 2) {
        // désintégration du W en e⁻ et ν̄
        arrow(ctx, wx, wy + 14, W * 0.82, cy - 30, pal.blue, 2.4);
        circle(ctx, W * 0.82, cy - 30, 13, pal.blue, pal.bg, 1.5);
        text(ctx, 'e⁻', W * 0.82, cy - 30, { color: '#04121a', size: 12, align: 'center', baseline: 'middle', weight: 800 });

        arrow(ctx, wx, wy + 14, W * 0.82, cy + 38, pal.muted, 2.4);
        circle(ctx, W * 0.82, cy + 38, 13, pal.muted, pal.bg, 1.5);
        text(ctx, 'ν̄ₑ', W * 0.82, cy + 38, { color: '#04121a', size: 11, align: 'center', baseline: 'middle', weight: 800 });
      }
    }

    // légende des charges (bilan)
    if (step >= 3) {
      text(ctx, 'charge : 0  →  (+1) + (−1) + 0  ✓ conservée', W / 2, H - 14, {
        color: pal.green,
        size: 12,
        align: 'center',
        weight: 700,
      });
    }
  }

  prev.addEventListener('click', () => {
    step = clamp(step - 1, 0, CAPTIONS.length - 1);
    refresh();
    scene.requestDraw();
  });
  next.addEventListener('click', () => {
    step = clamp(step + 1, 0, CAPTIONS.length - 1);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="betadecay"]').forEach(init);
