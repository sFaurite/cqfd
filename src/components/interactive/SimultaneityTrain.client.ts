import { createScene, line, circle, text, type Scene } from './_canvas';

const C = 1.0; // vitesse lumière (unités relatives écran/temps)
const BETA = 0.5; // vitesse du train (quai)

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const cap = root.querySelector<HTMLElement>('[data-caption]')!;
  const replay = root.querySelector<HTMLButtonElement>('[data-replay]')!;
  const frameBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-frame]'));

  let frame: 'train' | 'quai' = 'train';
  let t = 0;
  let last = 0;
  let running = true;

  const scene = createScene(canvas, draw);

  // demi-longueur du wagon (unités) ; temps de trajet d'un éclair
  const D = 1;
  const tHitTrain = D / C;
  const tHitBack = D / (C + BETA);
  const tHitFront = D / (C - BETA);

  function captionFor() {
    if (frame === 'train')
      return 'Dans le train, la lampe est à égale distance des deux parois. Les deux éclairs (à c) les atteignent EN MÊME TEMPS.';
    return 'Vu du quai, le train avance : l’arrière « court vers » son éclair (touché en premier), l’avant « fuit » le sien (touché après). Même expérience, simultanéité différente.';
  }

  function reset() {
    t = 0;
    last = 0;
    running = true;
    cap.textContent = captionFor();
    requestAnimationFrame(loop);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const midY = H * 0.5;
    const railY = H * 0.78;
    // échelle : D unités → quart de largeur
    const unit = W * 0.3;
    const cxBase = W * 0.5;
    const carShift = frame === 'quai' ? BETA * t * unit : 0;
    const cx = cxBase - W * 0.18 + carShift; // centre du wagon

    // rail / quai
    line(ctx, 0, railY, W, railY, pal.border, 2);
    for (let x = 0; x < W; x += 30) line(ctx, x, railY, x - 10, railY + 8, pal.grid, 1);

    // wagon
    const xL = cx - D * unit;
    const xR = cx + D * unit;
    const top = midY - H * 0.18;
    const bot = midY + H * 0.18;
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    ctx.strokeRect(xL, top, xR - xL, bot - top);
    ctx.restore();

    // lampe (au centre)
    circle(ctx, cx, midY, 5, pal.yellow);

    // éclairs : positions
    const leftPulse = cx - C * t * unit;
    const rightPulse = cx + C * t * unit;
    // (les éclairs partent du centre ; en référentiel quai ils gardent la vitesse c
    //  mais le wagon translate, d'où des instants d'impact différents)
    const backHit = frame === 'train' ? t >= tHitTrain : t >= tHitBack;
    const frontHit = frame === 'train' ? t >= tHitTrain : t >= tHitFront;

    if (!backHit) circle(ctx, leftPulse, midY, 4, pal.red);
    if (!frontHit) circle(ctx, rightPulse, midY, 4, pal.red);

    // flashs d'impact
    if (backHit) {
      circle(ctx, xL, midY, 13, 'rgba(252,98,85,0.5)');
      text(ctx, 'arrière touché', xL, top - 10, { color: pal.red, size: 11, align: 'center', baseline: 'bottom', weight: 700 });
    }
    if (frontHit) {
      circle(ctx, xR, midY, 13, 'rgba(252,98,85,0.5)');
      text(ctx, 'avant touché', xR, top - 10, { color: pal.red, size: 11, align: 'center', baseline: 'bottom', weight: 700 });
    }

    // indicateur de simultanéité
    if (frame === 'train' && backHit && frontHit) {
      text(ctx, '⇒ SIMULTANÉ', W / 2, H - 12, { color: pal.green, size: 13, align: 'center', weight: 700 });
    } else if (frame === 'quai' && backHit && !frontHit) {
      text(ctx, '⇒ arrière AVANT avant', W / 2, H - 12, { color: pal.yellow, size: 13, align: 'center', weight: 700 });
    }

    if (frame === 'quai') {
      text(ctx, `train → v = ${BETA} c`, W - 10, 16, { color: pal.muted, size: 11, align: 'right' });
    }
  }

  function loop(ts: number) {
    if (!running) return;
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    t += dt * 0.6;
    const end = (frame === 'train' ? tHitTrain : tHitFront) + 0.6;
    if (t >= end) {
      t = end;
      running = false;
    }
    scene.requestDraw();
    if (running) requestAnimationFrame(loop);
  }

  frameBtns.forEach((b) =>
    b.addEventListener('click', () => {
      frameBtns.forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      frame = (b.dataset.frame as 'train' | 'quai') ?? 'train';
      reset();
    }),
  );
  replay.addEventListener('click', reset);

  reset();
}

document.querySelectorAll<HTMLElement>('[data-iw="simultaneity"]').forEach(init);
