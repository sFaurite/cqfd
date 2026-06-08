import { createScene, line, arrow, text, fmt, clamp, map, prefersReducedMotion, type Scene } from './_canvas';

const VIL = 0.3; // seuil bas : en dessous → « 0 » garanti (idéalisé)
const VIH = 0.7; // seuil haut : au-dessus → « 1 » garanti (idéalisé)

type Sortie = '0' | '1' | 'indéterminé';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sIn = root.querySelector<HTMLInputElement>('[data-in]')!;
  const sNoise = root.querySelector<HTMLInputElement>('[data-noise]')!;
  const outIn = root.querySelector<HTMLElement>('[data-out-in]')!;
  const outNoise = root.querySelector<HTMLElement>('[data-out-noise]')!;
  const outVin = root.querySelector<HTMLElement>('[data-out-vin]')!;
  const outOut = root.querySelector<HTMLElement>('[data-out-out]')!;
  const outMarge = root.querySelector<HTMLElement>('[data-out-marge]')!;

  let vIn = parseFloat(sIn.value); // entrée idéale 0..1
  let noise = parseFloat(sNoise.value); // amplitude 0..0,5
  let jitter = 0; // composante animée du bruit, dans [-1, 1]
  let phase = 0;
  let raf = 0;
  const reduce = prefersReducedMotion();

  const scene = createScene(canvas, draw);

  // Tension réelle = entrée idéale + bruit instantané, bornée à [0, 1].
  function vReal(): number {
    return clamp(vIn + noise * jitter, 0, 1);
  }

  // Sortie régénérée selon les seuils.
  function sortie(v: number): Sortie {
    if (v <= VIL) return '0';
    if (v >= VIH) return '1';
    return 'indéterminé';
  }

  // Marge de bruit restante avant de basculer dans la zone interdite.
  // Côté « 1 » (entrée haute) : distance de V_in au seuil V_IH.
  // Côté « 0 » (entrée basse) : distance de V_in au seuil V_IL.
  function marge(v: number): number {
    if (vIn >= 0.5) return v - VIH; // > 0 tant qu'on est dans le « 1 » sûr
    return VIL - v; // > 0 tant qu'on est dans le « 0 » sûr
  }

  function couleurSortie(s: Sortie, pal: Scene['pal']): string {
    if (s === '0') return pal.muted;
    if (s === '1') return pal.green;
    return pal.red;
  }

  function refresh() {
    outIn.textContent = fmt(vIn, 2);
    outNoise.textContent = fmt(noise, 2);
    const v = vReal();
    const s = sortie(v);
    const m = marge(v);
    outVin.textContent = fmt(v, 2);
    outOut.textContent = s;
    outOut.style.color = s === '1' ? 'var(--c-green)' : s === '0' ? 'var(--c-muted)' : 'var(--c-red)';
    outMarge.textContent = m > 0 ? `${fmt(m, 2)} sûr` : `${fmt(-m, 2)} de trop`;
    outMarge.style.color = m > 0 ? 'var(--c-teal)' : 'var(--c-red)';
  }

  function animate() {
    phase += 0.06;
    // jitter pseudo-aléatoire lissé (somme de deux sinusoïdes déphasées)
    jitter = 0.6 * Math.sin(phase) + 0.4 * Math.sin(phase * 2.3 + 1.1);
    refresh();
    scene.requestDraw();
    raf = requestAnimationFrame(animate);
  }
  function kick() {
    if (reduce) {
      jitter = 1; // état figé mais parlant : bruit poussé à son maximum positif
      return;
    }
    if (!raf && noise > 0) raf = requestAnimationFrame(animate);
  }
  function stopIfQuiet() {
    if (noise === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      jitter = 0;
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // --- géométrie de l'échelle verticale (gauche) ---
    const axX = 0.18 * W;
    const top = 0.12 * H; // y de V = 1
    const bot = 0.88 * H; // y de V = 0
    const barW = 0.085 * W;
    const yOf = (v: number) => map(v, 0, 1, bot, top);

    // bandes des trois zones (légèrement à droite de l'axe)
    const bx = axX;
    const bw = barW;
    // zone « 0 logique »
    ctx.fillStyle = pal.surface;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(bx, yOf(VIL), bw, bot - yOf(VIL));
    // zone « 1 logique »
    ctx.fillStyle = withAlpha(pal.green, 0.18);
    ctx.fillRect(bx, top, bw, yOf(VIH) - top);
    ctx.globalAlpha = 1;
    // zone interdite : fond + hachures rouges
    const zTop = yOf(VIH);
    const zBot = yOf(VIL);
    ctx.fillStyle = withAlpha(pal.red, 0.16);
    ctx.fillRect(bx, zTop, bw, zBot - zTop);
    hatch(ctx, bx, zTop, bw, zBot - zTop, withAlpha(pal.red, 0.5));
    // contour de la barre
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, top, bw, bot - top);

    // --- axe vertical et graduations ---
    arrow(ctx, axX - 0.012 * W, bot, axX - 0.012 * W, top - 0.03 * H, pal.muted, 2, 8);
    text(ctx, 'V', axX - 0.012 * W, top - 0.045 * H, { color: pal.muted, size: 12, align: 'center', weight: 700 });
    for (const [v, lbl] of [[0, '0'], [1, 'V_DD']] as [number, string][]) {
      const y = yOf(v);
      line(ctx, axX - 0.03 * W, y, axX - 0.012 * W, y, pal.muted, 1.5);
      text(ctx, lbl, axX - 0.04 * W, y + 4, { color: pal.muted, size: 11, align: 'right' });
    }

    // --- lignes de seuil V_IL / V_IH ---
    const seuilRight = bx + bw + 0.16 * W;
    for (const [v, lbl] of [[VIH, 'V_IH'], [VIL, 'V_IL']] as [number, string][]) {
      const y = yOf(v);
      line(ctx, bx, y, seuilRight, y, withAlpha(pal.red, 0.6), 1.4, [5, 4]);
      text(ctx, `${lbl} = ${fmt(v, 2)}`, bx + bw + 8, y - 5, { color: pal.red, size: 11, align: 'left', weight: 600 });
    }

    // étiquettes des zones, à droite des bandes
    const lblX = bx + bw + 8;
    text(ctx, '1 logique', lblX, (top + zTop) / 2 + 4, { color: pal.green, size: 12, align: 'left', weight: 700 });
    text(ctx, 'zone interdite', lblX, (zTop + zBot) / 2 + 4, { color: pal.red, size: 12, align: 'left', weight: 700 });
    text(ctx, '0 logique', lblX, (zBot + bot) / 2 + 4, { color: pal.muted, size: 12, align: 'left', weight: 700 });

    // --- curseur de tension réelle ---
    const v = vReal();
    const vy = yOf(v);
    const sOut = sortie(v);
    const cur = couleurSortie(sOut, pal);
    // bande d'incertitude : étendue possible du bruit autour de l'entrée idéale
    if (noise > 0 && !reduce) {
      const yHi = yOf(clamp(vIn + noise, 0, 1));
      const yLo = yOf(clamp(vIn - noise, 0, 1));
      ctx.fillStyle = withAlpha(pal.yellow, 0.16);
      ctx.fillRect(bx - 0.018 * W, yHi, bw + 0.036 * W, yLo - yHi);
    }
    // marqueur de l'entrée idéale (référence)
    line(ctx, bx - 0.018 * W, yOf(vIn), bx + bw + 0.018 * W, yOf(vIn), withAlpha(pal.yellow, 0.7), 1.4, [3, 3]);
    text(ctx, 'idéal', bx - 0.022 * W, yOf(vIn) + 4, { color: pal.yellow, size: 10, align: 'right' });
    // pointe de la tension réelle
    line(ctx, bx - 0.05 * W, vy, bx, vy, cur, 2.5);
    ctx.beginPath();
    ctx.moveTo(bx - 0.05 * W, vy);
    ctx.lineTo(bx - 0.075 * W, vy - 6);
    ctx.lineTo(bx - 0.075 * W, vy + 6);
    ctx.closePath();
    ctx.fillStyle = cur;
    ctx.fill();
    text(ctx, `V_in = ${fmt(v, 2)}`, bx - 0.08 * W, vy - 8, { color: cur, size: 12, align: 'right', weight: 700 });

    // --- flèche de régénération vers la sortie ---
    const midY = 0.5 * H;
    const aX0 = bx + bw + 0.2 * W;
    const aX1 = 0.66 * W;
    arrow(ctx, aX0, midY, aX1, midY, pal.blue, 2.5, 11);
    text(ctx, 'régénération', (aX0 + aX1) / 2, midY - 12, { color: pal.blue, size: 12, align: 'center', weight: 600 });
    text(ctx, '(comparateur)', (aX0 + aX1) / 2, midY + 18, { color: pal.muted, size: 10, align: 'center' });

    // --- sortie régénérée (droite) : créneau net 0/1 ou « ? » ---
    const outCx = 0.84 * W;
    const outTop = top;
    const outBot = bot;
    const outX0 = aX1 + 0.02 * W;
    const outX1 = 0.97 * W;
    // rails 0 et 1
    const y0 = outBot;
    const y1 = outTop;
    line(ctx, outX0, y0, outX1, y0, pal.border, 1.2, [4, 4]);
    line(ctx, outX0, y1, outX1, y1, pal.border, 1.2, [4, 4]);
    text(ctx, '1', outX1 + 4, y1 + 4, { color: pal.green, size: 12, align: 'left', weight: 700 });
    text(ctx, '0', outX1 + 4, y0 + 4, { color: pal.muted, size: 12, align: 'left', weight: 700 });

    if (sOut === 'indéterminé') {
      // créneau rompu + grand point d'interrogation
      line(ctx, outX0, midY, outX1, midY, withAlpha(pal.red, 0.5), 2, [6, 5]);
      text(ctx, '?', outCx, midY + 0.07 * H, { color: pal.red, size: 0.18 * H, align: 'center', baseline: 'middle', weight: 800 });
      text(ctx, 'indéterminé', outCx, outBot + 0.07 * H, { color: pal.red, size: 13, align: 'center', weight: 700 });
    } else {
      const yLvl = sOut === '1' ? y1 : y0;
      const col = sOut === '1' ? pal.green : pal.muted;
      // niveau de sortie net et stable
      line(ctx, outX0, yLvl, outX1, yLvl, col, 4);
      // petit créneau idéal pour rappeler le « propre »
      ctx.fillStyle = withAlpha(col, 0.12);
      if (sOut === '1') ctx.fillRect(outX0, y1, outX1 - outX0, midY - y1);
      else ctx.fillRect(outX0, midY, outX1 - outX0, y0 - midY);
      text(ctx, sOut, outCx, outBot + 0.07 * H, { color: col, size: 14, align: 'center', weight: 800 });
    }
    text(ctx, 'sortie', outCx, outTop - 0.05 * H, { color: pal.text, size: 12, align: 'center', weight: 600 });

    // --- bandeau de verdict en haut ---
    const m = marge(v);
    let verdict: string;
    let vcol: string;
    if (sOut === 'indéterminé') {
      verdict = 'BRUIT > MARGE → sortie indéterminée';
      vcol = pal.red;
    } else {
      verdict = `bruit absorbé — sortie ${sOut} propre`;
      vcol = sOut === '1' ? pal.green : pal.teal;
    }
    text(ctx, verdict, 14, 22, { color: vcol, size: 14, align: 'left', weight: 800 });
    text(ctx, m > 0 ? `marge restante : ${fmt(m, 2)}` : `dépassement : ${fmt(-m, 2)}`, 14, 40, {
      color: m > 0 ? pal.muted : pal.red, size: 11, align: 'left',
    });
  }

  function hatch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    const step = 8;
    for (let d = -h; d < w; d += step) {
      ctx.beginPath();
      ctx.moveTo(x + d, y + h);
      ctx.lineTo(x + d + h, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function withAlpha(color: string, a: number): string {
    const cl = clamp(a, 0, 1);
    const c = color.trim();
    if (c.startsWith('#')) {
      const hex = c.slice(1);
      const full = hex.length === 3 ? hex.split('').map((ch) => ch + ch).join('') : hex;
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${cl})`;
    }
    if (c.startsWith('rgb(')) return c.replace('rgb(', 'rgba(').replace(')', `, ${cl})`);
    return c;
  }

  sIn.addEventListener('input', () => {
    vIn = parseFloat(sIn.value);
    refresh();
    scene.requestDraw();
    kick();
  });
  sNoise.addEventListener('input', () => {
    noise = parseFloat(sNoise.value);
    refresh();
    scene.requestDraw();
    stopIfQuiet();
    kick();
  });

  refresh();
  kick();
}

document.querySelectorAll<HTMLElement>('[data-iw="noise-margin"]').forEach(init);
