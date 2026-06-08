import { createScene, line, arrow, circle, text, clamp, prefersReducedMotion, type Scene } from './_canvas';

const N = 4; // nombre de bits

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sA = root.querySelector<HTMLInputElement>('[data-a]')!;
  const sB = root.querySelector<HTMLInputElement>('[data-b]')!;
  const outASlider = root.querySelector<HTMLElement>('[data-out-a-slider]')!;
  const outBSlider = root.querySelector<HTMLElement>('[data-out-b-slider]')!;
  const outA = root.querySelector<HTMLElement>('[data-out-a]')!;
  const outB = root.querySelector<HTMLElement>('[data-out-b]')!;
  const outS = root.querySelector<HTMLElement>('[data-out-s]')!;
  const outCarry = root.querySelector<HTMLElement>('[data-out-carry]')!;

  let a = parseInt(sA.value, 10);
  let b = parseInt(sB.value, 10);

  const reduce = prefersReducedMotion();
  // Progression de la propagation : -1..N (cellule "active" = floor(prog)).
  let prog = reduce ? N : -1;
  let raf = 0;

  const scene = createScene(canvas, draw);

  /** Indices bit i (i=0 poids faible). Renvoie le bit i d'un entier. */
  function bit(x: number, i: number): number {
    return (x >> i) & 1;
  }

  /** Calcule, pour chaque rang, somme et retenue sortante (modèle ripple). */
  function compute() {
    const sum: number[] = new Array(N).fill(0);
    const carry: number[] = new Array(N + 1).fill(0); // carry[0] = retenue entrante initiale = 0
    for (let i = 0; i < N; i++) {
      const t = bit(a, i) + bit(b, i) + carry[i];
      sum[i] = t & 1;
      carry[i + 1] = t > 1 ? 1 : 0;
    }
    return { sum, carry };
  }

  function bin(x: number): string {
    return x.toString(2).padStart(N, '0');
  }

  function refresh() {
    outASlider.textContent = String(a);
    outBSlider.textContent = String(b);
    const { carry } = compute();
    const s = a + b;
    const cOut = carry[N];
    // S exact en binaire : 5 bits si dépassement (le bit 4 = retenue finale).
    const sBin = s.toString(2).padStart(cOut === 1 ? N + 1 : N, '0');
    outA.textContent = `${a} = ${bin(a)}₂`;
    outB.textContent = `${b} = ${bin(b)}₂`;
    outS.textContent = `${s} = ${sBin}₂`;
    if (cOut === 1) {
      outCarry.textContent = 'c₄ = 1 — dépassement (> 4 bits)';
      outCarry.style.color = 'var(--c-red)';
    } else {
      outCarry.textContent = 'c₄ = 0 — pas de dépassement';
      outCarry.style.color = 'var(--c-green)';
    }
  }

  function restartAnim() {
    if (reduce) {
      prog = N;
      scene.requestDraw();
      return;
    }
    prog = -1;
    kick();
  }

  function animate() {
    prog += 0.04;
    if (prog >= N + 0.5) {
      prog = N + 0.5;
      raf = 0;
      scene.requestDraw();
      return;
    }
    scene.requestDraw();
    raf = requestAnimationFrame(animate);
  }
  function kick() {
    if (!raf && !reduce) raf = requestAnimationFrame(animate);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const { sum, carry } = compute();

    // Disposition : 4 cellules alignées, bit 3 (gauche) … bit 0 (droite).
    const marginL = 0.06 * W;
    const marginR = 0.06 * W;
    const cellGap = 0.025 * W;
    const totalW = W - marginL - marginR;
    const cellW = (totalW - cellGap * (N - 1)) / N;
    const cellH = 0.30 * H;
    const cellY = 0.16 * H;

    // x du centre d'une cellule selon son rang i (0 = poids faible, à droite).
    const colX = (i: number) => {
      const idxFromLeft = N - 1 - i; // bit i affiché à droite
      return marginL + idxFromLeft * (cellW + cellGap) + cellW / 2;
    };

    // Combien de cellules ont déjà reçu/produit leur retenue (propagation).
    const active = clamp(prog, -1, N);

    // --- Chaîne de retenue (dessinée d'abord, derrière les cellules) ---
    // c0 entre à droite de la cellule 0, puis chaque c_{i+1} part vers la cellule i+1.
    const carryY = cellY + cellH + 0.07 * H;
    for (let i = 0; i < N; i++) {
      const x0 = colX(i) + cellW / 2; // bord droit de la cellule i (entrée retenue)
      const cx = colX(i);
      // Flèche d'entrée de retenue dans la cellule i (depuis la droite).
      const litIn = active >= i;
      const cIn = carry[i];
      const colIn = litIn ? (cIn === 1 ? pal.yellow : pal.muted) : pal.border;
      // segment horizontal le long du bas, vers le centre de la cellule
      if (i === 0) {
        // c0 arrive du bord droit du schéma
        line(ctx, W - marginR * 0.4, carryY, x0, carryY, colIn, 2, cIn === 1 ? [] : [4, 4]);
        text(ctx, 'c₀ = 0', W - marginR * 0.4 + 2, carryY + 4, {
          color: pal.muted, size: 11, align: 'left',
        });
      }
      // montée vers le bas de la cellule i
      arrow(ctx, x0, carryY, cx + cellW * 0.15, cellY + cellH, colIn, 2, 8);

      // Propagation vers la cellule suivante (c_{i+1}).
      if (i < N - 1) {
        const xNextIn = colX(i + 1) + cellW / 2;
        const litProp = active >= i + 1;
        const cProp = carry[i + 1];
        const colProp = litProp ? (cProp === 1 ? pal.yellow : pal.muted) : pal.border;
        // descend du bas de la cellule i puis va vers l'entrée de la cellule i+1
        line(ctx, cx - cellW * 0.15, cellY + cellH, cx - cellW * 0.15, carryY, colProp, 2, cProp === 1 ? [] : [4, 4]);
        arrow(ctx, cx - cellW * 0.15, carryY, xNextIn, carryY, colProp, 2, 8);
        // étiquette de la retenue propagée
        const midX = (cx - cellW * 0.15 + xNextIn) / 2;
        text(ctx, `c${subscript(i + 1)}=${cProp}`, midX, carryY - 5, {
          color: colProp, size: 11, align: 'center', weight: 700,
        });
      }
    }

    // --- Cellules ---
    for (let i = 0; i < N; i++) {
      const cx = colX(i);
      const x = cx - cellW / 2;
      const isActive = prog >= i && prog < i + 1 && !reduce;
      const isDone = active >= i;

      // boîte
      ctx.save();
      ctx.fillStyle = pal.surface;
      ctx.strokeStyle = isActive ? pal.blue : pal.border;
      ctx.lineWidth = isActive ? 2.5 : 1.5;
      roundRect(ctx, x, cellY, cellW, cellH, 7);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // titre de la cellule
      text(ctx, `cellule ${i}`, cx, cellY - 8, {
        color: isActive ? pal.blue : pal.muted, size: 11, align: 'center', weight: 600,
      });

      // entrées a_i, b_i en haut
      const ai = bit(a, i);
      const bi = bit(b, i);
      const inY = cellY + 0.30 * cellH;
      drawBit(ctx, pal, cx - cellW * 0.22, cellY, inY, `a${subscript(i)}`, ai, pal.blue);
      drawBit(ctx, pal, cx + cellW * 0.22, cellY, inY, `b${subscript(i)}`, bi, pal.teal);

      // bit de somme s_i au milieu/bas
      const si = sum[i];
      const sBitColor = isDone ? pal.green : pal.muted;
      text(ctx, `s${subscript(i)}`, cx, cellY + cellH * 0.58, {
        color: pal.muted, size: 11, align: 'center',
      });
      const sBoxR = Math.min(cellW, cellH) * 0.16;
      circle(ctx, cx, cellY + cellH * 0.78, sBoxR, isDone ? withAlpha(pal.green, 0.18) : pal.bgElev, sBitColor, 2);
      text(ctx, String(si), cx, cellY + cellH * 0.78 + 5, {
        color: sBitColor, size: 16, align: 'center', weight: 800,
      });
    }

    // --- Opération posée en binaire, en bas ---
    const opTop = 0.66 * H;
    const lineH = 0.085 * H;

    // Aligner chaque colonne sous le centre de la cellule correspondante.
    const labelX = marginL - 0.005 * W;
    const cOut = carry[N];

    // ligne des retenues (au-dessus de A) — montre les c_i propagées
    text(ctx, 'retenues', labelX, opTop - lineH * 0.1, { color: pal.muted, size: 11, align: 'right' });
    for (let i = 0; i < N; i++) {
      const ci = carry[i];
      if (ci === 1 && i > 0) {
        text(ctx, '1', colX(i - 1), opTop - lineH * 0.1, {
          color: pal.yellow, size: 13, align: 'center', weight: 700,
        });
      }
    }

    // ligne A
    drawOpRow(ctx, pal, 'A', a, opTop + lineH, labelX, colX, pal.blue);
    // ligne B (avec +)
    text(ctx, '+', labelX - 0.025 * W, opTop + 2 * lineH + 4, {
      color: pal.text, size: 14, align: 'right', weight: 700,
    });
    drawOpRow(ctx, pal, 'B', b, opTop + 2 * lineH, labelX, colX, pal.teal);

    // trait de séparation
    const sepY = opTop + 2 * lineH + lineH * 0.45;
    line(ctx, colX(N - 1) - cellW * 0.5, sepY, colX(0) + cellW * 0.5, sepY, pal.border, 1.5);

    // ligne S (résultat) — N+1 chiffres si dépassement
    text(ctx, 'S', labelX, opTop + 3 * lineH + 4, { color: pal.text, size: 13, align: 'right', weight: 700 });
    for (let i = 0; i < N; i++) {
      const digit = (a + b >> i) & 1;
      const done = active >= i;
      text(ctx, String(digit), colX(i), opTop + 3 * lineH + 4, {
        color: done ? pal.green : pal.muted, size: 16, align: 'center', weight: 800,
      });
    }
    // chiffre de poids 16 (retenue finale) à gauche de la colonne bit 3
    const overflowX = colX(N - 1) - (cellW + cellGap);
    if (cOut === 1) {
      text(ctx, '1', overflowX, opTop + 3 * lineH + 4, {
        color: pal.red, size: 16, align: 'center', weight: 800,
      });
      text(ctx, 'c₄', overflowX, opTop + 3 * lineH + 4 - lineH * 0.7, {
        color: pal.red, size: 11, align: 'center',
      });
    }

    // --- Valeurs décimales, coin haut gauche ---
    text(ctx, `${a} + ${b} = ${a + b}`, 14, 0.045 * H, {
      color: pal.text, size: 14, align: 'left', weight: 700,
    });
    text(ctx, cOut === 1 ? 'dépassement sur 4 bits' : 'tient sur 4 bits', 14, 0.045 * H + 18, {
      color: cOut === 1 ? pal.red : pal.green, size: 11, align: 'left',
    });
  }

  /** Dessine une entrée binaire (étiquette au-dessus de la cellule, fil, pastille). */
  function drawBit(
    ctx: CanvasRenderingContext2D,
    pal: Scene['pal'],
    x: number,
    yCellTop: number,
    yPastille: number,
    label: string,
    value: number,
    accent: string,
  ) {
    const col = value === 1 ? accent : pal.muted;
    // étiquette au-dessus du bord supérieur de la cellule
    text(ctx, label, x, yCellTop - 16, { color: pal.muted, size: 11, align: 'center' });
    // fil descendant depuis l'étiquette jusqu'à la pastille
    line(ctx, x, yCellTop - 10, x, yPastille, col, 2, value === 1 ? [] : [3, 3]);
    circle(ctx, x, yPastille, 9, value === 1 ? withAlphaPal(accent, pal, 0.2) : pal.bgElev, col, 2);
    text(ctx, String(value), x, yPastille + 4, { color: col, size: 13, align: 'center', weight: 800 });
  }

  /** Dessine une ligne (A ou B) de l'opération posée en binaire. */
  function drawOpRow(
    ctx: CanvasRenderingContext2D,
    pal: Scene['pal'],
    name: string,
    value: number,
    y: number,
    labelX: number,
    colX: (i: number) => number,
    accent: string,
  ) {
    text(ctx, name, labelX, y + 4, { color: pal.text, size: 13, align: 'right', weight: 700 });
    for (let i = 0; i < N; i++) {
      const d = (value >> i) & 1;
      text(ctx, String(d), colX(i), y + 4, {
        color: d === 1 ? accent : pal.muted, size: 15, align: 'center', weight: 700,
      });
    }
  }

  function subscript(i: number): string {
    return '₀₁₂₃₄₅₆₇₈₉'[i] ?? String(i);
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

  function withAlpha(_color: string, a: number): string {
    // teinte verte de la charte, semi-transparente (fond des bits de somme)
    return `rgba(131, 193, 103, ${clamp(a, 0, 1)})`;
  }
  function withAlphaPal(accent: string, pal: Scene['pal'], a: number): string {
    if (accent === pal.blue) return `rgba(88, 196, 221, ${clamp(a, 0, 1)})`;
    if (accent === pal.teal) return `rgba(92, 208, 179, ${clamp(a, 0, 1)})`;
    return `rgba(255, 216, 102, ${clamp(a, 0, 1)})`;
  }

  sA.addEventListener('input', () => {
    a = clamp(parseInt(sA.value, 10), 0, 15);
    refresh();
    restartAnim();
    scene.requestDraw();
  });
  sB.addEventListener('input', () => {
    b = clamp(parseInt(sB.value, 10), 0, 15);
    refresh();
    restartAnim();
    scene.requestDraw();
  });

  refresh();
  restartAnim();
}

document.querySelectorAll<HTMLElement>('[data-iw="full-adder"]').forEach(init);
