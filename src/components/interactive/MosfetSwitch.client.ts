import { createScene, line, circle, text, fmt, clamp, prefersReducedMotion, type Scene } from './_canvas';

const VTH = 0.7; // tension de seuil (V) — idéalisée

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sVgs = root.querySelector<HTMLInputElement>('[data-vgs]')!;
  const outVgs = root.querySelector<HTMLElement>('[data-out-vgs]')!;
  const outEtat = root.querySelector<HTMLElement>('[data-out-etat]')!;
  const outI = root.querySelector<HTMLElement>('[data-out-i]')!;

  let vgs = parseFloat(sVgs.value);
  let phase = 0;
  let raf = 0;
  const reduce = prefersReducedMotion();

  const scene = createScene(canvas, draw);

  function on() {
    return vgs >= VTH;
  }
  function overdrivePct() {
    return clamp(((vgs - VTH) / (2 - VTH)) * 100, 0, 100);
  }

  function refresh() {
    outVgs.textContent = `${fmt(vgs, 2)} V`;
    outEtat.textContent = on() ? 'passant' : 'bloqué';
    outEtat.style.color = on() ? 'var(--c-green)' : 'var(--c-red)';
    outI.textContent = on() ? `${Math.round(overdrivePct())} % de I_max` : '0';
  }

  function animate() {
    if (on() && !reduce) {
      phase += 0.025;
      scene.requestDraw();
      raf = requestAnimationFrame(animate);
    } else {
      raf = 0;
    }
  }
  function kick() {
    if (!raf && on() && !reduce) raf = requestAnimationFrame(animate);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const conducting = on();

    // --- repères géométriques ---
    const subX = 0.12 * W, subW = 0.5 * W;
    const subY = 0.56 * H, subH = 0.2 * H;
    const srcX = subX + 0.02 * W, regW = 0.11 * W;
    const drnX = subX + subW - regW - 0.02 * W;
    const regY = subY, regH = 0.1 * H;
    const gateL = srcX + regW, gateR = drnX;
    const oxideY = subY - 0.035 * H, oxideH = 0.03 * H;
    const gateY = oxideY - 0.06 * H, gateH = 0.05 * H;
    const chanY = subY + 0.002 * H;

    // --- substrat (P) ---
    ctx.fillStyle = pal.surface;
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.5;
    roundRect(ctx, subX, subY, subW, subH, 6);
    ctx.fill();
    ctx.stroke();
    text(ctx, 'substrat (P)', subX + subW / 2, subY + subH - 8, {
      color: pal.muted, size: 11, align: 'center',
    });

    // --- source & drain (n+) ---
    for (const [x, lbl] of [[srcX, 'Source'], [drnX, 'Drain']] as [number, string][]) {
      ctx.fillStyle = pal.blue;
      roundRect(ctx, x, regY, regW, regH, 4);
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      text(ctx, 'n+', x + regW / 2, regY + regH / 2 + 4, {
        color: '#06222b', size: 11, align: 'center', weight: 700,
      });
      text(ctx, lbl, x + regW / 2, regY - 6, { color: pal.text, size: 12, align: 'center', weight: 600 });
    }

    // --- canal sous la grille ---
    if (conducting) {
      ctx.fillStyle = pal.teal;
      ctx.globalAlpha = 0.35 + 0.4 * (overdrivePct() / 100);
      ctx.fillRect(gateL, chanY, gateR - gateL, 0.05 * H);
      ctx.globalAlpha = 1;
      text(ctx, 'canal (électrons)', (gateL + gateR) / 2, chanY + 0.08 * H + 12, {
        color: pal.teal, size: 11, align: 'center',
      });
    } else {
      // canal absent : pointillés
      line(ctx, gateL, chanY + 0.025 * H, gateR, chanY + 0.025 * H, pal.muted, 1.5, [4, 4]);
      text(ctx, 'pas de canal', (gateL + gateR) / 2, chanY + 0.08 * H + 12, {
        color: pal.muted, size: 11, align: 'center',
      });
    }

    // --- oxyde + grille (métal) ---
    ctx.fillStyle = pal.muted;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(gateL, oxideY, gateR - gateL, oxideH);
    ctx.globalAlpha = 1;
    text(ctx, 'oxyde', gateR + 6, oxideY + oxideH, { color: pal.muted, size: 10, align: 'left' });
    ctx.fillStyle = conducting ? pal.yellow : pal.muted;
    ctx.fillRect(gateL, gateY, gateR - gateL, gateH);
    const gateMidX = (gateL + gateR) / 2;
    text(ctx, 'Grille', gateMidX, gateY - 6, { color: pal.text, size: 12, align: 'center', weight: 600 });

    // --- fil de grille + tension V_GS ---
    const vTopY = 0.12 * H;
    line(ctx, gateMidX, gateY, gateMidX, vTopY, conducting ? pal.yellow : pal.muted, 2);
    circle(ctx, gateMidX, vTopY, 4, conducting ? pal.yellow : pal.muted);
    text(ctx, `V_GS = ${fmt(vgs, 2)} V`, gateMidX, vTopY - 10, {
      color: pal.text, size: 13, align: 'center', weight: 700,
    });
    text(ctx, vgs >= VTH ? `≥ V_th = ${fmt(VTH, 2)} V` : `< V_th = ${fmt(VTH, 2)} V`, gateMidX, vTopY - 26, {
      color: conducting ? pal.green : pal.red, size: 11, align: 'center',
    });

    // --- source vers la masse ---
    const srcMid = srcX + regW / 2;
    const gndY = subY + subH + 0.1 * H;
    line(ctx, srcMid, regY + regH, srcMid, gndY, pal.text, 2);
    ground(ctx, srcMid, gndY, pal.text);

    // --- drain vers la lampe puis V_DD ---
    const drnMid = drnX + regW / 2;
    const lampX = 0.82 * W, lampY = 0.40 * H, lampR = 0.06 * W;
    line(ctx, drnMid, regY + regH, drnMid, regY + regH + 0.04 * H, pal.text, 2);
    line(ctx, drnMid, regY + regH + 0.04 * H, lampX, regY + regH + 0.04 * H, pal.text, 2);
    line(ctx, lampX, regY + regH + 0.04 * H, lampX, lampY + lampR, pal.text, 2);

    // lampe
    const glow = conducting ? 0.25 + 0.7 * (overdrivePct() / 100) : 0;
    if (glow > 0) {
      ctx.fillStyle = pal.yellow;
      ctx.globalAlpha = 0.25 * glow;
      circle(ctx, lampX, lampY, lampR * 1.9, pal.yellow);
      ctx.globalAlpha = 1;
    }
    circle(ctx, lampX, lampY, lampR, conducting ? withAlpha(pal.yellow, 0.2 + 0.8 * glow) : pal.surface, pal.border, 2);
    // filament
    line(ctx, lampX - lampR * 0.5, lampY, lampX + lampR * 0.5, lampY, conducting ? '#7a5b00' : pal.muted, 2);
    text(ctx, 'lampe', lampX, lampY - lampR - 8, { color: pal.muted, size: 11, align: 'center' });

    // V_DD au-dessus de la lampe
    const vddY = 0.12 * H;
    line(ctx, lampX, lampY - lampR, lampX, vddY, pal.text, 2);
    text(ctx, '+ V_DD', lampX, vddY - 10, { color: pal.text, size: 12, align: 'center', weight: 700 });

    // --- électrons animés dans le canal et le fil de drain ---
    if (conducting) {
      const n = 7;
      const speed = 0.5 + 0.5 * (overdrivePct() / 100);
      for (let i = 0; i < n; i++) {
        const f = ((i / n) + (reduce ? 0.5 : phase * speed)) % 1;
        const ex = gateL + f * (gateR - gateL);
        circle(ctx, ex, chanY + 0.025 * H, 2.6, pal.blue);
      }
    }

    // état global, en haut à gauche
    text(ctx, conducting ? 'PASSANT' : 'BLOQUÉ', 14, 22, {
      color: conducting ? pal.green : pal.red, size: 15, align: 'left', weight: 800,
    });
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function ground(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    for (let i = 0; i < 3; i++) {
      const w = 16 - i * 5;
      line(ctx, x - w, y + i * 4, x + w, y + i * 4, color, 2);
    }
  }
  function withAlpha(_color: string, a: number) {
    return `rgba(255, 216, 102, ${clamp(a, 0, 1)})`;
  }

  sVgs.addEventListener('input', () => {
    vgs = parseFloat(sVgs.value);
    refresh();
    scene.requestDraw();
    kick();
  });

  refresh();
  kick();
}

document.querySelectorAll<HTMLElement>('[data-iw="mosfet-switch"]').forEach(init);
