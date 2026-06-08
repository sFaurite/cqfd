import { createScene, line, arrow, circle, text, clamp, type Scene } from './_canvas';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sVal = root.querySelector<HTMLInputElement>('[data-val]')!;
  const selBits = root.querySelector<HTMLSelectElement>('[data-bits]')!;
  const outVal = root.querySelector<HTMLElement>('[data-out-val]')!;
  const outRange = root.querySelector<HTMLElement>('[data-out-range]')!;
  const outDec = root.querySelector<HTMLElement>('[data-out-dec]')!;
  const outBin = root.querySelector<HTMLElement>('[data-out-bin]')!;
  const outHex = root.querySelector<HTMLElement>('[data-out-hex]')!;

  let n = parseInt(selBits.value, 10); // largeur en bits (4 ou 8)
  let val = parseInt(sVal.value, 10); // valeur signée courante

  const scene = createScene(canvas, draw);

  /** Plage signée pour n bits. */
  const minVal = () => -(1 << (n - 1));
  const maxVal = () => (1 << (n - 1)) - 1;

  /** Code complément à deux (entier non signé sur n bits) d'une valeur signée. */
  function encode(x: number): number {
    return x < 0 ? x + (1 << n) : x;
  }

  /** Bit i (i = 0 = LSB) du code non signé u. */
  function bit(u: number, i: number): number {
    return (u >> i) & 1;
  }

  /** Représentation binaire (n caractères) du code de val. */
  function binStr(): string {
    const u = encode(val);
    let s = '';
    for (let i = n - 1; i >= 0; i--) s += String(bit(u, i));
    return s;
  }

  /** Représentation hexadécimale du code (2 caractères sur 8 bits, 1 sur 4 bits). */
  function hexStr(): string {
    const u = encode(val);
    const digits = Math.ceil(n / 4);
    return u.toString(16).toUpperCase().padStart(digits, '0');
  }

  function refresh() {
    outVal.textContent = String(val);
    outRange.textContent = `${minVal()}..${maxVal()}`;
    outDec.textContent = String(val);
    outBin.textContent = `${binStr()}₂`;
    outHex.textContent = `0x${hexStr()}`;
  }

  /** Applique les bornes liées à la largeur courante au curseur et à la valeur. */
  function applyBitsRange() {
    sVal.min = String(minVal());
    sVal.max = String(maxVal());
    val = clamp(val, minVal(), maxVal());
    sVal.value = String(val);
  }

  /** Helper rectangle arrondi local (la boîte à outils n'en fournit pas). */
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const u = encode(val);

    // ---------------------------------------------------------------
    // Zone gauche : cases de bits + poids + somme pondérée.
    // Zone droite : roue circulaire mod 2^n.
    // ---------------------------------------------------------------
    const leftW = 0.64 * W;

    // --- Cases de bits ---
    const marginL = 0.04 * W;
    const usableW = leftW - marginL - 0.03 * W;
    const cellGap = (n === 4 ? 0.012 : 0.006) * W;
    const cellW = (usableW - cellGap * (n - 1)) / n;
    const cellH = clamp(cellW * 1.05, 26, 0.16 * H);
    const cellY = 0.16 * H;

    // x du bord gauche de la colonne affichée à l'index `idx` depuis la gauche.
    const colX = (idxFromLeft: number) => marginL + idxFromLeft * (cellW + cellGap);

    text(ctx, 'Bits et poids des colonnes', marginL, 0.075 * H, {
      color: pal.text, size: 13, align: 'left', weight: 700,
    });

    for (let idx = 0; idx < n; idx++) {
      const i = n - 1 - idx; // rang du bit (i = n-1 = MSB à gauche)
      const isMsb = i === n - 1;
      const b = bit(u, i);
      const x = colX(idx);
      const accent = isMsb ? pal.red : pal.blue;
      const on = b === 1;

      // boîte
      ctx.save();
      ctx.fillStyle = pal.surface;
      ctx.strokeStyle = isMsb ? pal.red : on ? pal.blue : pal.border;
      ctx.lineWidth = isMsb ? 2.5 : on ? 2 : 1.4;
      roundRect(ctx, x, cellY, cellW, cellH, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // valeur du bit
      text(ctx, String(b), x + cellW / 2, cellY + cellH / 2, {
        color: on ? accent : pal.muted,
        size: clamp(cellH * 0.55, 14, 24),
        align: 'center',
        baseline: 'middle',
        weight: 800,
      });

      // poids de la colonne (sous la case)
      const weight = isMsb ? -(1 << (n - 1)) : 1 << i;
      const wLabel = isMsb ? `−2^${n - 1}` : `2^${i}`;
      text(ctx, wLabel, x + cellW / 2, cellY + cellH + 14, {
        color: isMsb ? pal.red : pal.muted, size: 10, align: 'center', weight: 600,
      });
      text(ctx, `= ${weight}`, x + cellW / 2, cellY + cellH + 27, {
        color: on ? (isMsb ? pal.red : pal.blue) : pal.muted, size: 10, align: 'center',
        weight: on ? 700 : 400,
      });
    }

    // étiquettes MSB / LSB
    text(ctx, 'MSB (signe)', colX(0) + cellW / 2, cellY - 8, {
      color: pal.red, size: 10, align: 'center', weight: 700,
    });
    text(ctx, 'LSB', colX(n - 1) + cellW / 2, cellY - 8, {
      color: pal.muted, size: 10, align: 'center', weight: 600,
    });

    // --- Somme pondérée ---
    const sumY = cellY + cellH + 0.13 * H;
    text(ctx, 'Somme pondérée', marginL, sumY - 6, {
      color: pal.text, size: 12, align: 'left', weight: 700,
    });

    // construit la chaîne « (−128)·1 + 64·1 + … = val » uniquement avec les bits à 1
    let cursorX = marginL;
    const termY = sumY + 18;
    const termSize = n === 4 ? 14 : 12;
    let any = false;
    let first = true;
    for (let i = n - 1; i >= 0; i--) {
      const b = bit(u, i);
      if (b === 0) continue;
      any = true;
      const isMsb = i === n - 1;
      const weight = isMsb ? -(1 << (n - 1)) : 1 << i;
      const col = isMsb ? pal.red : pal.blue;
      if (!first) {
        text(ctx, '+', cursorX, termY, { color: pal.muted, size: termSize, align: 'left' });
        cursorX += ctx.measureText('+ ').width + 4;
      }
      const term = isMsb ? `(${weight})` : `${weight}`;
      ctx.save();
      ctx.font = `700 ${termSize}px Inter, system-ui, sans-serif`;
      const tw = ctx.measureText(term).width;
      ctx.restore();
      text(ctx, term, cursorX, termY, { color: col, size: termSize, align: 'left', weight: 700 });
      cursorX += tw + 8;
      first = false;
    }
    if (!any) {
      text(ctx, '0', cursorX, termY, { color: pal.muted, size: termSize, align: 'left', weight: 700 });
      cursorX += 14;
    }
    text(ctx, `= ${val}`, cursorX + 2, termY, {
      color: pal.green, size: termSize + 1, align: 'left', weight: 800,
    });

    // --- Construction « inverser puis +1 » pour les valeurs négatives ---
    const consY = termY + 0.11 * H;
    if (val < 0) {
      const abs = Math.abs(val);
      // |x| sur n bits
      let absBin = '';
      let invBin = '';
      for (let i = n - 1; i >= 0; i--) {
        const ab = (abs >> i) & 1;
        absBin += String(ab);
        invBin += String(ab ^ 1);
      }
      const code = binStr();

      text(ctx, 'Construction du code négatif', marginL, consY - 6, {
        color: pal.text, size: 12, align: 'left', weight: 700,
      });

      const rowH = clamp(0.05 * H, 16, 22);
      const labelX = marginL;
      const valX = marginL + 0.16 * W;
      let ry = consY + rowH;
      const mono = "'JetBrains Mono', ui-monospace, monospace";

      const drawRow = (lab: string, bits: string, col: string) => {
        text(ctx, lab, labelX, ry, { color: pal.muted, size: 11, align: 'left' });
        text(ctx, bits, valX, ry, {
          color: col, size: termSize, align: 'left', weight: 700, font: mono,
        });
        ry += rowH;
      };

      drawRow(`|x| = ${abs}`, absBin, pal.muted);
      drawRow('inverser (NON)', invBin, pal.yellow);
      drawRow('+ 1', code, pal.green);

      // trait de séparation avant la dernière ligne (résultat)
      line(ctx, valX, ry - 2 * rowH - rowH * 0.45, valX + 0.20 * W, ry - 2 * rowH - rowH * 0.45,
        pal.border, 1.2);
      text(ctx, '→ code de x', valX + 0.21 * W, ry - rowH, {
        color: pal.green, size: 10, align: 'left', weight: 600,
      });
    } else {
      text(ctx, 'Valeur positive : MSB = 0, lecture binaire directe.', marginL, consY + 14, {
        color: pal.muted, size: 11, align: 'left', italic: true,
      });
    }

    // ---------------------------------------------------------------
    // Roue circulaire mod 2^n
    // ---------------------------------------------------------------
    const wheelCx = leftW + (W - leftW) * 0.5;
    const wheelCy = 0.5 * H;
    const wheelR = clamp(Math.min(W - leftW, H) * 0.36, 60, 0.38 * H);

    text(ctx, `Roue modulo 2^${n}`, wheelCx, 0.075 * H, {
      color: pal.text, size: 12, align: 'center', weight: 700,
    });

    const size = 1 << n;
    // angle d'un code u : u=0 en haut, sens horaire.
    const angOf = (uu: number) => -Math.PI / 2 + (uu / size) * Math.PI * 2;

    // cercle de fond
    circle(ctx, wheelCx, wheelCy, wheelR, pal.bgElev, pal.border, 1.4);

    // frontière entre positifs et négatifs (entre maxVal et minVal, i.e. entre u=size/2-1 et u=size/2)
    const boundAng = angOf(size / 2 - 0.5);
    line(ctx, wheelCx, wheelCy,
      wheelCx + Math.cos(boundAng) * wheelR,
      wheelCy + Math.sin(boundAng) * wheelR, pal.border, 1, [4, 4]);

    // graduations : sur 4 bits on affiche toutes les valeurs, sur 8 bits un sous-ensemble.
    const labelEvery = n === 4 ? 1 : 16;
    for (let uu = 0; uu < size; uu++) {
      const a = angOf(uu);
      const px = wheelCx + Math.cos(a) * wheelR;
      const py = wheelCy + Math.sin(a) * wheelR;
      const signed = uu < size / 2 ? uu : uu - size;
      const isNeg = signed < 0;

      // petit tic
      const inR = wheelR - (n === 4 ? 7 : 4);
      line(ctx, wheelCx + Math.cos(a) * inR, wheelCy + Math.sin(a) * inR, px, py,
        isNeg ? pal.purple : pal.teal, n === 4 ? 2 : 1.2);

      if (uu % labelEvery === 0) {
        const lr = wheelR + 14;
        text(ctx, String(signed), wheelCx + Math.cos(a) * lr, wheelCy + Math.sin(a) * lr, {
          color: isNeg ? pal.purple : pal.teal, size: 10, align: 'center', baseline: 'middle',
          weight: 600,
        });
      }
    }

    // libellés des deux extrêmes pour matérialiser l'enroulement
    const aMax = angOf(size / 2 - 1);
    const aMin = angOf(size / 2);
    text(ctx, `max ${maxVal()}`, wheelCx + Math.cos(aMax) * (wheelR + 32),
      wheelCy + Math.sin(aMax) * (wheelR + 32), {
        color: pal.teal, size: 9, align: 'center', baseline: 'middle',
      });
    text(ctx, `min ${minVal()}`, wheelCx + Math.cos(aMin) * (wheelR + 32),
      wheelCy + Math.sin(aMin) * (wheelR + 32), {
        color: pal.purple, size: 9, align: 'center', baseline: 'middle',
      });

    // flèche d'enroulement (du max vers le min, en franchissant la frontière)
    const arcR = wheelR * 0.62;
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = pal.yellow;
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.arc(wheelCx, wheelCy, arcR, aMax - 0.18, aMin + 0.18);
    ctx.stroke();
    ctx.restore();
    const tipA = aMin + 0.18;
    arrow(ctx,
      wheelCx + Math.cos(tipA - 0.12) * arcR, wheelCy + Math.sin(tipA - 0.12) * arcR,
      wheelCx + Math.cos(tipA) * arcR, wheelCy + Math.sin(tipA) * arcR,
      pal.yellow, 2, 8);

    // curseur sur la valeur courante
    const curA = angOf(u);
    const cpx = wheelCx + Math.cos(curA) * wheelR;
    const cpy = wheelCy + Math.sin(curA) * wheelR;
    line(ctx, wheelCx, wheelCy, cpx, cpy, pal.yellow, 2);
    circle(ctx, cpx, cpy, 6, pal.yellow, pal.bg, 2);
    text(ctx, String(val), wheelCx, wheelCy, {
      color: pal.text, size: 18, align: 'center', baseline: 'middle', weight: 800,
    });
    text(ctx, `= u ${u}`, wheelCx, wheelCy + 20, {
      color: pal.muted, size: 10, align: 'center', baseline: 'middle',
    });
  }

  sVal.addEventListener('input', () => {
    val = clamp(parseInt(sVal.value, 10), minVal(), maxVal());
    refresh();
    scene.requestDraw();
  });
  selBits.addEventListener('change', () => {
    n = parseInt(selBits.value, 10);
    applyBitsRange();
    refresh();
    scene.requestDraw();
  });

  applyBitsRange();
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="twos-complement"]').forEach(init);
