import { createScene, text, circle, prefersReducedMotion, type Scene } from './_canvas';

interface Exc {
  x: number; // 0..1 position relative
  amp: number; // amplitude px
  width: number; // largeur relative
  phase: number; // phase d'oscillation
  freq: number;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const clearBtn = root.querySelector<HTMLButtonElement>('[data-clear]')!;

  const excitations: Exc[] = [];
  let time = 0;
  let last = 0;
  const reduced = prefersReducedMotion();

  // une excitation de départ pour montrer l'idée
  excitations.push({ x: 0.5, amp: 26, width: 0.06, phase: 0, freq: 3 });

  const scene = createScene(canvas, draw);

  function fieldHeight(xRel: number, baseY: number): number {
    // léger bruit de vide + somme des excitations (gaussiennes oscillantes)
    let h = Math.sin(xRel * 60 + time * 1.5) * 1.6 + Math.sin(xRel * 23 - time) * 1.2;
    for (const e of excitations) {
      const d = xRel - e.x;
      const g = Math.exp(-(d * d) / (2 * e.width * e.width));
      h += g * e.amp * Math.cos(time * e.freq + e.phase);
    }
    return baseY - h;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const baseY = H * 0.6;

    // remplissage sous la courbe (le « champ »)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let px = 0; px <= W; px += 2) {
      const y = fieldHeight(px / W, baseY);
      ctx.lineTo(px, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(92,208,179,0.22)');
    grad.addColorStop(1, 'rgba(92,208,179,0.02)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // ligne du champ
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.teal;
    ctx.lineWidth = 2.2;
    for (let px = 0; px <= W; px += 2) {
      const y = fieldHeight(px / W, baseY);
      if (px === 0) ctx.moveTo(px, y);
      else ctx.lineTo(px, y);
    }
    ctx.stroke();
    ctx.restore();

    // marqueurs « particule » au sommet de chaque excitation
    for (const e of excitations) {
      const px = e.x * W;
      const py = fieldHeight(e.x, baseY);
      circle(ctx, px, py, 5, pal.yellow);
    }

    if (excitations.length <= 1)
      text(ctx, 'cliquez pour ajouter une particule', W / 2, H - 12, {
        color: pal.muted,
        size: 12,
        align: 'center',
      });
  }

  function loop(ts: number) {
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    time += dt;
    scene.requestDraw();
    requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width;
    excitations.push({ x: xRel, amp: 24, width: 0.05, phase: time, freq: 2.5 + Math.abs(xRel * 3) });
    if (reduced) scene.requestDraw();
  });
  clearBtn.addEventListener('click', () => {
    excitations.length = 0;
    scene.requestDraw();
  });

  if (reduced) {
    // image statique avec deux excitations
    excitations.push({ x: 0.25, amp: 22, width: 0.05, phase: 1, freq: 2 });
    time = 0.6;
    scene.requestDraw();
  } else {
    requestAnimationFrame(loop);
  }
}

document.querySelectorAll<HTMLElement>('[data-iw="qfield"]').forEach(init);
