import { createScene, line, circle, text, type Scene } from './_canvas';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btn = root.querySelector<HTMLButtonElement>('[data-toggle]')!;
  const outState = root.querySelector<HTMLElement>('[data-out-state]')!;
  const outA = root.querySelector<HTMLElement>('[data-out-a]')!;
  const outY = root.querySelector<HTMLElement>('[data-out-y]')!;
  const outI = root.querySelector<HTMLElement>('[data-out-i]')!;

  // Entrée A (0 ou 1). Y = NON(A).
  let a = 0;

  const scene = createScene(canvas, draw);

  function y(): number {
    return a === 0 ? 1 : 0;
  }

  function refresh() {
    const yv = y();
    btn.textContent = `A = ${a}`;
    outA.textContent = String(a);
    outY.textContent = String(yv);
    outI.textContent = '0';
    if (a === 0) {
      outState.textContent = 'PMOS passant — Y tiré vers V_DD (Y = 1)';
    } else {
      outState.textContent = 'NMOS passant — Y tiré vers la masse (Y = 0)';
    }
    // couleur du chip Y selon le niveau logique
    outY.style.color = yv === 1 ? 'var(--c-teal)' : 'var(--c-muted)';
    outA.style.color = a === 1 ? 'var(--c-teal)' : 'var(--c-muted)';
  }

  /** Couleur d'un fil selon son niveau logique : 1 = teal, 0 = gris/rouge sombre. */
  function wireColor(s: Scene, level: number): string {
    return level === 1 ? s.pal.teal : s.pal.muted;
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    yy: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, yy);
    ctx.arcTo(x + w, yy, x + w, yy + h, r);
    ctx.arcTo(x + w, yy + h, x, yy + h, r);
    ctx.arcTo(x, yy + h, x, yy, r);
    ctx.arcTo(x, yy, x + w, yy, r);
    ctx.closePath();
  }

  function ground(ctx: CanvasRenderingContext2D, x: number, yy: number, color: string) {
    for (let i = 0; i < 3; i++) {
      const w = 18 - i * 5;
      line(ctx, x - w, yy + i * 5, x + w, yy + i * 5, color, 2.4);
    }
  }

  /**
   * Dessine un transistor MOS schématique (boîte avec broches).
   * @param on  passant (vert) ou bloqué (grisé)
   * @param pmos true = PMOS (bulle sur la grille), false = NMOS
   */
  function transistor(
    s: Scene,
    cx: number,
    cy: number,
    bw: number,
    bh: number,
    on: boolean,
    pmos: boolean,
    railColor: string,
    nodeColor: string,
  ) {
    const { ctx, pal } = s;
    const accent = on ? pal.green : pal.muted;
    const bodyFill = on ? withAlpha(pal.green, 0.16) : pal.surface;

    // corps du transistor
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = accent;
    ctx.fillStyle = bodyFill;
    roundRect(ctx, cx - bw / 2, cy - bh / 2, bw, bh, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // (railColor / nodeColor : niveaux logiques des broches, exploités par
    // l'appelant pour colorer les fils externes ; on les référence pour rester
    // explicite sur le rôle des broches)
    void railColor;
    void nodeColor;
    // libellé du transistor
    text(ctx, pmos ? 'PMOS' : 'NMOS', cx, cy - 3, {
      color: accent,
      size: 14,
      align: 'center',
      weight: 800,
    });
    text(ctx, on ? 'passant' : 'bloqué', cx, cy + 15, {
      color: accent,
      size: 11,
      align: 'center',
      weight: 600,
    });

    // canal interne : trait plein (passant) ou pointillés (bloqué)
    const chX = cx - bw / 2 + 10;
    if (on) {
      line(ctx, chX, cy - bh / 2 + 8, chX, cy + bh / 2 - 8, pal.green, 3);
    } else {
      line(ctx, chX, cy - bh / 2 + 8, chX, cy + bh / 2 - 8, pal.muted, 1.6, [4, 4]);
    }

    // grille : trait sur le côté gauche + bulle si PMOS
    const gateY = cy;
    const gateX = cx - bw / 2;
    if (pmos) {
      circle(ctx, gateX - 6, gateY, 5, pal.bg, accent, 2);
      return { gateX: gateX - 11, gateY };
    }
    return { gateX, gateY };
  }

  function withAlpha(_hex: string, alpha: number): string {
    // green idéalisé (rgba) — la teinte exacte suit la charte via accent ;
    // on n'utilise withAlpha que pour un fond translucide neutre.
    return `rgba(131, 193, 103, ${alpha})`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const pmosOn = a === 0; // PMOS conduit quand l'entrée est basse
    const nmosOn = a === 1; // NMOS conduit quand l'entrée est haute
    const yv = y();

    // Géométrie verticale : V_DD en haut, GND en bas, transistors empilés.
    const colX = 0.5 * W; // colonne centrale (source/drain alignés)
    const vddY = 0.1 * H;
    const gndY = 0.92 * H;

    const boxW = 0.2 * W;
    const boxH = 0.16 * H;
    const pmosCy = 0.32 * H;
    const nmosCy = 0.68 * H;
    const nodeY = 0.5 * H; // nœud de sortie Y entre les deux transistors

    // --- Rail V_DD (toujours niveau 1) ---
    const vddColor = pal.teal;
    line(ctx, colX - 0.18 * W, vddY, colX + 0.18 * W, vddY, vddColor, 3);
    text(ctx, 'V_DD = 1', colX, vddY - 12, {
      color: pal.text,
      size: 14,
      align: 'center',
      weight: 700,
    });
    circle(ctx, colX + 0.18 * W, vddY, 4, vddColor);

    // fil V_DD → source du PMOS (toujours à 1)
    line(ctx, colX, vddY, colX, pmosCy - boxH / 2, vddColor, 2.6);

    // --- PMOS (haut) ---
    const pmosG = transistor(
      s,
      colX,
      pmosCy,
      boxW,
      boxH,
      pmosOn,
      true,
      vddColor,
      wireColor(s, yv),
    );

    // fil PMOS(drain) → nœud Y. Ce segment ne « tire » vraiment Y vers 1 que
    // si le PMOS est passant (trait plein vert/teal sinon pointillés grisés).
    line(
      ctx,
      colX,
      pmosCy + boxH / 2,
      colX,
      nodeY,
      pmosOn ? pal.teal : pal.muted,
      pmosOn ? 3 : 2,
      pmosOn ? [] : [5, 5],
    );

    // --- Nœud de sortie Y ---
    const yColor = yv === 1 ? pal.teal : pal.red;
    circle(ctx, colX, nodeY, 6, yColor, pal.text, 1.5);

    // sortie Y vers la droite (fil de sortie, coloré selon le niveau)
    const outX = 0.86 * W;
    line(ctx, colX, nodeY, outX, nodeY, yColor, 3);
    arrowHead(ctx, outX, nodeY, yColor);
    text(ctx, `Y = ${yv}`, outX + 6, nodeY - 12, {
      color: pal.text,
      size: 16,
      align: 'center',
      weight: 800,
    });
    text(ctx, '(sortie)', outX + 6, nodeY + 16, {
      color: pal.muted,
      size: 11,
      align: 'center',
    });

    // fil nœud Y → drain du NMOS (trait plein si le NMOS conduit vers la masse)
    line(
      ctx,
      colX,
      nodeY,
      colX,
      nmosCy - boxH / 2,
      pal.muted,
      nmosOn ? 3 : 2,
      nmosOn ? [] : [5, 5],
    );

    // --- NMOS (bas) ---
    const nmosG = transistor(
      s,
      colX,
      nmosCy,
      boxW,
      boxH,
      nmosOn,
      false,
      wireColor(s, yv),
      pal.muted,
    );

    // fil NMOS(source) → masse (toujours niveau 0)
    line(ctx, colX, nmosCy + boxH / 2, colX, gndY, pal.muted, 2.6);
    ground(ctx, colX, gndY, pal.muted);
    text(ctx, 'GND = 0', colX, gndY + 28, {
      color: pal.text,
      size: 13,
      align: 'center',
      weight: 700,
    });

    // --- Bus d'entrée A : relie les deux grilles ---
    const inX = 0.13 * W;
    const aColor = wireColor(s, a);
    // ligne verticale du bus, du PMOS au NMOS
    line(ctx, inX, pmosG.gateY, inX, nmosG.gateY, aColor, 2.6);
    // branches vers chaque grille
    line(ctx, inX, pmosG.gateY, pmosG.gateX, pmosG.gateY, aColor, 2.6);
    line(ctx, inX, nmosG.gateY, nmosG.gateX, nmosG.gateY, aColor, 2.6);
    circle(ctx, inX, pmosG.gateY, 3, aColor);
    circle(ctx, inX, nmosG.gateY, 3, aColor);

    // point d'entrée A à gauche
    const aTapY = (pmosG.gateY + nmosG.gateY) / 2;
    line(ctx, 0.05 * W, aTapY, inX, aTapY, aColor, 2.6);
    circle(ctx, 0.05 * W, aTapY, 5, aColor, pal.text, 1.5);
    text(ctx, `A = ${a}`, 0.05 * W, aTapY - 14, {
      color: pal.text,
      size: 16,
      align: 'center',
      weight: 800,
    });
    text(ctx, '(entrée)', 0.05 * W, aTapY + 22, {
      color: pal.muted,
      size: 11,
      align: 'center',
    });

    // --- Bandeau d'état : aucun chemin direct V_DD→GND ---
    text(ctx, 'Aucun courant statique : un seul transistor conduit', W / 2, H - 6, {
      color: pal.muted,
      size: 11,
      align: 'center',
      italic: true,
    });

    // --- Petite table de vérité A | Y (en haut à droite) ---
    truthTable(s, 0.78 * W, 0.06 * H, a);

    // marquage explicite du chemin conducteur actif (vers V_DD ou GND)
    if (pmosOn) {
      text(ctx, '→ Y poussé vers 1', colX + 0.12 * W, pmosCy, {
        color: pal.green,
        size: 11,
        align: 'left',
        weight: 600,
      });
    } else {
      text(ctx, '→ Y poussé vers 0', colX + 0.12 * W, nmosCy, {
        color: pal.green,
        size: 11,
        align: 'left',
        weight: 600,
      });
    }
  }

  function arrowHead(ctx: CanvasRenderingContext2D, x: number, yy: number, color: string) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, yy);
    ctx.lineTo(x - 9, yy - 5);
    ctx.lineTo(x - 9, yy + 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** Table de vérité A | Y, avec la ligne courante surlignée. */
  function truthTable(s: Scene, x: number, yy: number, aCur: number) {
    const { ctx, pal } = s;
    const colW = 38;
    const rowH = 22;
    const tw = colW * 2;
    const th = rowH * 3;

    // cadre
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = pal.border;
    ctx.fillStyle = pal.surface;
    roundRect(ctx, x, yy, tw, th, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // en-têtes
    text(ctx, 'A', x + colW / 2, yy + rowH / 2 + 4, {
      color: pal.text,
      size: 13,
      align: 'center',
      weight: 700,
    });
    text(ctx, 'Y', x + colW + colW / 2, yy + rowH / 2 + 4, {
      color: pal.text,
      size: 13,
      align: 'center',
      weight: 700,
    });
    line(ctx, x, yy + rowH, x + tw, yy + rowH, pal.border, 1.2);
    line(ctx, x + colW, yy, x + colW, yy + th, pal.border, 1.2);

    // lignes : (0,1) puis (1,0)
    const rows: [number, number][] = [
      [0, 1],
      [1, 0],
    ];
    rows.forEach(([av, yvv], i) => {
      const ry = yy + rowH * (i + 1);
      const active = av === aCur;
      if (active) {
        ctx.save();
        ctx.fillStyle = withAlpha('', 0.22);
        ctx.fillRect(x + 1.2, ry + 1, tw - 2.4, rowH - 1.4);
        ctx.restore();
      }
      const col = active ? pal.text : pal.muted;
      const wt = active ? 800 : 500;
      text(ctx, String(av), x + colW / 2, ry + rowH / 2 + 4, {
        color: col,
        size: 13,
        align: 'center',
        weight: wt,
      });
      text(ctx, String(yvv), x + colW + colW / 2, ry + rowH / 2 + 4, {
        color: active ? (yvv === 1 ? pal.teal : pal.red) : pal.muted,
        size: 13,
        align: 'center',
        weight: wt,
      });
    });

    text(ctx, 'Y = NON(A)', x + tw / 2, yy + th + 14, {
      color: pal.muted,
      size: 11,
      align: 'center',
      italic: true,
    });
  }

  btn.addEventListener('click', () => {
    a = a === 0 ? 1 : 0;
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="cmos-inverter"]').forEach(init);
