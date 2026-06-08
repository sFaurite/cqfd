import {
  createScene,
  line,
  arrow,
  circle,
  text,
  fmt,
  clamp,
  lerp,
  map,
  prefersReducedMotion,
  type Scene,
} from './_canvas';

const VSEUIL = 0.6; // tension de seuil (V) — diode au silicium idéalisée

interface Carrier {
  pos: number; // position le long de la trajectoire, dans [0, 1]
  y: number; // ordonnée relative dans le barreau, dans [0, 1]
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sV = root.querySelector<HTMLInputElement>('[data-v]')!;
  const outV = root.querySelector<HTMLElement>('[data-out-v]')!;
  const outEtat = root.querySelector<HTMLElement>('[data-out-etat]')!;
  const outI = root.querySelector<HTMLElement>('[data-out-i]')!;

  let v = parseFloat(sV.value);
  let raf = 0;
  const reduce = prefersReducedMotion();

  // Porteurs animés qui traversent la jonction (trous → vers la droite,
  // électrons → vers la gauche), répartis sur quelques « voies ».
  const N = 6;
  const holes: Carrier[] = [];
  const elecs: Carrier[] = [];
  for (let i = 0; i < N; i++) {
    holes.push({ pos: i / N, y: 0.3 + 0.12 * (i % 3) });
    elecs.push({ pos: i / N, y: 0.45 + 0.12 * (i % 3) });
  }

  const scene = createScene(canvas, draw);

  /** Courant relatif (0..1) selon une allure de diode (exponentielle au-delà du seuil). */
  function current() {
    if (v <= VSEUIL) return 0;
    return clamp((Math.exp((v - VSEUIL) * 6) - 1) / (Math.exp((1 - VSEUIL) * 6) - 1), 0, 1);
  }
  function conducting() {
    return current() > 0.001;
  }
  /** Fraction de largeur de la zone de déplétion (1 = max, ~0 en direct fort). */
  function depletionFrac() {
    // En inverse la zone s'élargit ; en direct elle se rétrécit fortement.
    return clamp(map(v, -1, 1, 1, 0.12), 0.12, 1);
  }

  function refresh() {
    outV.textContent = `${fmt(v, 2)} V`;
    const on = conducting();
    outEtat.textContent = on ? 'passant' : 'bloqué';
    outEtat.style.color = on ? 'var(--c-green)' : 'var(--c-red)';
    outI.textContent = on ? `${Math.round(current() * 100)} % de I_max` : '0';
  }

  function animate() {
    const c = current();
    if (c > 0.001 && !reduce) {
      const step = 0.004 + 0.018 * c;
      for (const h of holes) h.pos = (h.pos + step) % 1;
      for (const e of elecs) e.pos = (e.pos + step) % 1;
      scene.requestDraw();
      raf = requestAnimationFrame(animate);
    } else {
      raf = 0;
    }
  }
  function kick() {
    if (!raf && conducting() && !reduce) raf = requestAnimationFrame(animate);
  }

  function withAlpha(rgb: [number, number, number], a: number) {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(a, 0, 1)})`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const on = conducting();
    const c = current();

    // --- géométrie du barreau semi-conducteur ---
    const barX = 0.06 * W;
    const barW = 0.6 * W;
    const barY = 0.34 * H;
    const barH = 0.34 * H;
    const midX = barX + barW / 2;

    // Largeur de la zone de déplétion (centrée sur la jonction).
    const depW = depletionFrac() * 0.26 * barW;
    const depL = midX - depW / 2;
    const depR = midX + depW / 2;

    // --- fonds des régions P et N ---
    ctx.save();
    ctx.fillStyle = withAlpha([252, 98, 85], 0.16); // teinte rouge légère (région P)
    ctx.fillRect(barX, barY, depL - barX, barH);
    ctx.fillStyle = withAlpha([88, 196, 221], 0.16); // teinte bleue légère (région N)
    ctx.fillRect(depR, barY, barX + barW - depR, barH);
    // zone de déplétion : bande claire, sans porteurs mobiles
    ctx.fillStyle = withAlpha([255, 255, 255], 0.06);
    ctx.fillRect(depL, barY, depW, barH);
    ctx.restore();

    // contour du barreau
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = pal.border;
    ctx.strokeRect(barX, barY, barW, barH);
    // limites de la zone de déplétion
    line(ctx, depL, barY, depL, barY + barH, pal.muted, 1.2, [4, 4]);
    line(ctx, depR, barY, depR, barY + barH, pal.muted, 1.2, [4, 4]);

    // --- étiquettes des régions ---
    text(ctx, 'Région P', barX + (depL - barX) / 2, barY - 12, {
      color: pal.red, size: 14, align: 'center', weight: 700,
    });
    text(ctx, '(trous +)', barX + (depL - barX) / 2, barY - 28, {
      color: pal.muted, size: 11, align: 'center',
    });
    text(ctx, 'Région N', depR + (barX + barW - depR) / 2, barY - 12, {
      color: pal.blue, size: 14, align: 'center', weight: 700,
    });
    text(ctx, '(électrons −)', depR + (barX + barW - depR) / 2, barY - 28, {
      color: pal.muted, size: 11, align: 'center',
    });
    text(ctx, 'zone de déplétion', midX, barY + barH + 16, {
      color: pal.muted, size: 11, align: 'center',
    });

    // --- porteurs fixes (gaz de fond) dans chaque région, hors déplétion ---
    drawStaticCarriers(ctx, barX + 6, depL - 6, barY, barH, pal.red, '+');
    drawStaticCarriers(ctx, depR + 6, barX + barW - 6, barY, barH, pal.blue, '−');

    // --- porteurs animés qui traversent (uniquement si passant) ---
    if (on) {
      const span = barX + barW; // de barX à barX+barW
      for (const h of holes) {
        // trous : se déplacent de la région P vers la région N (gauche → droite)
        const x = lerp(barX + 0.02 * barW, span - 0.02 * barW, h.pos);
        const y = barY + h.y * barH;
        const a = fadeNearEdges(h.pos) * (0.5 + 0.5 * c);
        circle(ctx, x, y, 4.2, withAlpha([252, 98, 85], a));
        text(ctx, '+', x, y + 0.5, {
          color: withAlpha([255, 255, 255], a), size: 10, align: 'center', baseline: 'middle', weight: 700,
        });
      }
      for (const e of elecs) {
        // électrons : se déplacent de la région N vers la région P (droite → gauche)
        const x = lerp(span - 0.02 * barW, barX + 0.02 * barW, e.pos);
        const y = barY + e.y * barH;
        const a = fadeNearEdges(e.pos) * (0.5 + 0.5 * c);
        circle(ctx, x, y, 4.2, withAlpha([88, 196, 221], a));
        text(ctx, '−', x, y - 0.5, {
          color: withAlpha([255, 255, 255], a), size: 11, align: 'center', baseline: 'middle', weight: 700,
        });
      }
    } else {
      // bloqué : marquer l'absence de circulation
      text(ctx, 'porteurs bloqués', midX, barY + barH / 2, {
        color: pal.muted, size: 11, align: 'center', baseline: 'middle', italic: true,
      });
    }

    // --- circuit extérieur : borne P (gauche) et borne N (droite) + générateur ---
    const wireY = barY + barH + 0.16 * H;
    const pTermX = barX + 0.04 * barW;
    const nTermX = barX + barW - 0.04 * barW;
    // descentes depuis le barreau
    line(ctx, pTermX, barY + barH, pTermX, wireY, pal.text, 2);
    line(ctx, nTermX, barY + barH, nTermX, wireY, pal.text, 2);
    // fil horizontal du bas
    line(ctx, pTermX, wireY, nTermX, wireY, pal.text, 2);
    // symbole de générateur au centre du fil
    const genX = midX;
    line(ctx, genX - 12, wireY - 9, genX - 12, wireY + 9, pal.text, 2); // borne longue (+)
    line(ctx, genX + 12, wireY - 5, genX + 12, wireY + 5, pal.text, 3); // borne courte (−)
    const signLeft = v >= 0 ? '+' : '−';
    const signRight = v >= 0 ? '−' : '+';
    text(ctx, signLeft, genX - 12, wireY - 16, { color: pal.text, size: 13, align: 'center', weight: 700 });
    text(ctx, signRight, genX + 12, wireY - 16, { color: pal.text, size: 13, align: 'center', weight: 700 });
    text(ctx, `V = ${fmt(v, 2)} V`, genX, wireY + 26, {
      color: pal.text, size: 13, align: 'center', weight: 700,
    });
    text(ctx, v > VSEUIL ? 'polarisation directe' : (v < 0 ? 'polarisation inverse' : 'faible / nulle'), genX, wireY + 42, {
      color: on ? pal.green : pal.red, size: 11, align: 'center',
    });

    // --- indicateur de courant sur le fil ---
    if (on) {
      // sens conventionnel : de la borne + (P) vers la borne − (N) à l'extérieur,
      // soit ici de droite à gauche le long du fil du bas.
      const ax = lerp(nTermX, pTermX, 0.5);
      arrow(ctx, ax + 28, wireY, ax - 28, wireY, pal.green, 3, 10);
      text(ctx, 'courant I', ax, wireY - 12, { color: pal.green, size: 11, align: 'center', weight: 600 });
    } else {
      // croix indiquant l'absence de courant
      const cx = midX, cy = wireY;
      line(ctx, cx - 6, cy - 30, cx + 6, cy - 18, pal.red, 2);
      line(ctx, cx + 6, cy - 30, cx - 6, cy - 18, pal.red, 2);
      text(ctx, 'I = 0', cx, cy - 36, { color: pal.red, size: 11, align: 'center', weight: 600 });
    }

    // --- caractéristique I(V) de la diode, en haut à droite ---
    drawIV(s, on, c);

    // --- état global, en haut à gauche ---
    text(ctx, on ? 'PASSANT' : 'BLOQUÉ', 14, 22, {
      color: on ? pal.green : pal.red, size: 15, align: 'left', weight: 800,
    });
  }

  /** Atténue les porteurs aux extrémités pour une apparition/disparition douce. */
  function fadeNearEdges(p: number) {
    return clamp(Math.sin(Math.PI * p) * 1.3, 0, 1);
  }

  /** Porteurs fixes répartis dans une région (gaz de fond). */
  function drawStaticCarriers(
    ctx: CanvasRenderingContext2D,
    x0: number,
    x1: number,
    y: number,
    h: number,
    color: string,
    sign: string,
  ) {
    const cols = 4;
    const rows = 3;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = lerp(x0, x1, (i + 0.5) / cols);
        const py = y + h * ((j + 0.5) / rows);
        if (px <= x0 || px >= x1) continue;
        circle(ctx, px, py, 3, color);
        text(ctx, sign, px, py + (sign === '+' ? 0.5 : -0.5), {
          color: 'rgba(255,255,255,0.85)', size: 8, align: 'center', baseline: 'middle', weight: 700,
        });
      }
    }
  }

  /** Trace l'allure I(V) d'une diode avec le point de fonctionnement courant. */
  function drawIV(s: Scene, on: boolean, c: number) {
    const { ctx, width: W, height: H, pal } = s;
    const gx = 0.72 * W;
    const gy = 0.1 * H;
    const gw = 0.24 * W;
    const gh = 0.34 * H;
    // cadre
    ctx.save();
    ctx.fillStyle = pal.surface;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy, gw, gh);
    ctx.restore();

    text(ctx, 'I(V) — diode', gx + gw / 2, gy - 6, {
      color: pal.muted, size: 11, align: 'center', weight: 600,
    });

    // axes : V de -1 à 1 (horizontal), I de 0 à 1 (vertical), zéro centré.
    const x0V = (vv: number) => map(vv, -1, 1, gx + 0.1 * gw, gx + 0.92 * gw);
    const baseY = gy + 0.82 * gh; // axe I = 0
    const topY = gy + 0.12 * gh; // I max
    // axe horizontal (I = 0)
    line(ctx, gx + 0.06 * gw, baseY, gx + 0.96 * gw, baseY, pal.muted, 1);
    // axe vertical au seuil pour repère
    const xSeuil = x0V(VSEUIL);
    line(ctx, x0V(0), gy + 0.08 * gh, x0V(0), gy + 0.92 * gh, pal.grid, 1, [3, 3]);
    text(ctx, 'V', gx + 0.96 * gw, baseY + 12, { color: pal.muted, size: 10, align: 'right' });
    text(ctx, 'I', x0V(0) - 6, gy + 0.12 * gh, { color: pal.muted, size: 10, align: 'right' });

    // courbe : I = 0 jusqu'au seuil, puis décollage exponentiel
    ctx.beginPath();
    ctx.strokeStyle = pal.yellow;
    ctx.lineWidth = 2;
    let started = false;
    for (let vv = -1; vv <= 1.0001; vv += 0.02) {
      let ival = 0;
      if (vv > VSEUIL) {
        ival = clamp((Math.exp((vv - VSEUIL) * 6) - 1) / (Math.exp((1 - VSEUIL) * 6) - 1), 0, 1);
      }
      const px = x0V(vv);
      const py = lerp(baseY, topY, ival);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // repère du seuil
    text(ctx, 'V_seuil', xSeuil, baseY + 12, { color: pal.muted, size: 9, align: 'center' });

    // point de fonctionnement courant
    const pvx = x0V(v);
    const pvy = lerp(baseY, topY, c);
    circle(ctx, pvx, pvy, 4, on ? pal.green : pal.red);
    line(ctx, pvx, baseY, pvx, pvy, on ? pal.green : pal.red, 1, [2, 3]);
  }

  sV.addEventListener('input', () => {
    v = parseFloat(sV.value);
    refresh();
    scene.requestDraw();
    kick();
  });

  refresh();
  kick();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="pn-junction"]').forEach(init);
