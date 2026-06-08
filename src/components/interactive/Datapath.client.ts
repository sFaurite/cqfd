import { createScene, line, arrow, text, lerp, clamp, prefersReducedMotion, type Scene } from './_canvas';

/** Identifiants des blocs du chemin de données. */
type BlockId = 'pc' | 'imem' | 'regs' | 'alu' | 'dmem' | 'wb';

interface Block {
  id: BlockId;
  label: string;
  sub: string;
  /** centre en coordonnées relatives (0..1) de la zone de schéma */
  cx: number;
  cy: number;
  /** demi-largeur / demi-hauteur relatives */
  hw: number;
  hh: number;
}

interface Phase {
  name: string;
  desc: string;
  /** blocs mis en évidence pendant la phase */
  blocks: BlockId[];
  /** bus actif : du bloc source au bloc destination */
  from: BlockId;
  to: BlockId;
  /** couleur d'accent (clé de palette) */
  accent: 'blue' | 'teal' | 'purple' | 'yellow' | 'green' | 'red';
  /** vrai si le bus actif est le retour write-back (route haute) */
  back?: boolean;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btn = root.querySelector<HTMLButtonElement>('[data-step]')!;
  const outStep = root.querySelector<HTMLElement>('[data-out-step]')!;
  const outPhase = root.querySelector<HTMLElement>('[data-out-phase]')!;
  const outDesc = root.querySelector<HTMLElement>('[data-out-desc]')!;

  // --- Définition des blocs (positions relatives, schéma sur deux rangées) ---
  const BLOCKS: Record<BlockId, Block> = {
    pc:   { id: 'pc',   label: 'PC',          sub: 'compteur',      cx: 0.085, cy: 0.55, hw: 0.055, hh: 0.16 },
    imem: { id: 'imem', label: 'Mém. instr.', sub: 'instructions',  cx: 0.265, cy: 0.55, hw: 0.085, hh: 0.16 },
    regs: { id: 'regs', label: 'Registres',   sub: 'banc',          cx: 0.475, cy: 0.55, hw: 0.085, hh: 0.20 },
    alu:  { id: 'alu',  label: 'ALU',         sub: 'calcul',        cx: 0.665, cy: 0.55, hw: 0.075, hh: 0.16 },
    dmem: { id: 'dmem', label: 'Mém. données',sub: 'data',          cx: 0.875, cy: 0.55, hw: 0.090, hh: 0.16 },
    wb:   { id: 'wb',   label: 'Write-back',  sub: 'retour',        cx: 0.475, cy: 0.55, hw: 0.085, hh: 0.20 },
  };

  // --- Les six phases du cycle ---
  const PHASES: Phase[] = [
    {
      name: 'Fetch',
      desc: "Le PC fournit l'adresse ; l'instruction est lue dans la mémoire d'instructions.",
      blocks: ['pc', 'imem'],
      from: 'pc', to: 'imem',
      accent: 'blue',
    },
    {
      name: 'Decode',
      desc: "L'instruction lue est décodée : code-opération et numéros de registres sont extraits.",
      blocks: ['imem', 'regs'],
      from: 'imem', to: 'regs',
      accent: 'teal',
    },
    {
      name: 'Read',
      desc: 'Les registres sources sont lus dans le banc de registres pour fournir les opérandes.',
      blocks: ['regs', 'alu'],
      from: 'regs', to: 'alu',
      accent: 'purple',
    },
    {
      name: 'Execute',
      desc: "L'ALU effectue le calcul (addition, comparaison…) sur les opérandes lus.",
      blocks: ['alu', 'dmem'],
      from: 'alu', to: 'dmem',
      accent: 'yellow',
    },
    {
      name: 'Memory',
      desc: "Accès à la mémoire de données : on y lit ou écrit une valeur si l'instruction le demande.",
      blocks: ['dmem'],
      from: 'alu', to: 'dmem',
      accent: 'red',
    },
    {
      name: 'Write-back',
      desc: 'Le résultat est réécrit dans un registre du banc ; le PC avance de PC + 1.',
      blocks: ['dmem', 'regs'],
      from: 'dmem', to: 'regs',
      accent: 'green',
      back: true,
    },
  ];

  const ORDER: BlockId[] = ['pc', 'imem', 'regs', 'alu', 'dmem'];

  const reduce = prefersReducedMotion();
  let phase = 0;
  /** progression du jeton sur le bus actif (0..1) */
  let tok = reduce ? 1 : 0;
  let raf = 0;

  const scene = createScene(canvas, draw);

  function accentColor(s: Scene, a: Phase['accent']): string {
    return s.pal[a];
  }

  /** Géométrie de la zone de schéma (réserve le bas pour la légende). */
  function area(s: Scene) {
    const padX = 0.02 * s.width;
    const x0 = padX;
    const x1 = s.width - padX;
    const y0 = 0.04 * s.height;
    const y1 = 0.82 * s.height;
    return { x0, y0, w: x1 - x0, h: y1 - y0 };
  }

  function py(s: Scene, ry: number): number {
    const a = area(s);
    return a.y0 + ry * a.h;
  }

  /** Renvoie le rectangle absolu d'un bloc. */
  function rectOf(s: Scene, b: Block) {
    const a = area(s);
    const cx = a.x0 + b.cx * a.w;
    const cy = a.y0 + b.cy * a.h;
    const w = b.hw * a.w * 2;
    const h = b.hh * a.h * 2;
    return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function refresh() {
    const p = PHASES[phase];
    outStep.textContent = `${p.name} · ${phase + 1} / ${PHASES.length}`;
    outPhase.textContent = p.name;
    outDesc.textContent = p.desc;
  }

  function animate() {
    tok += 0.02;
    if (tok >= 1) {
      tok = 1;
      raf = 0;
      scene.requestDraw();
      return;
    }
    scene.requestDraw();
    raf = requestAnimationFrame(animate);
  }
  function kick() {
    if (reduce) {
      tok = 1;
      scene.requestDraw();
      return;
    }
    tok = 0;
    if (!raf) raf = requestAnimationFrame(animate);
  }

  function next() {
    phase = (phase + 1) % PHASES.length;
    refresh();
    kick();
  }

  /** Dessine le bus inter-blocs (route basse, le long de la rangée). */
  function drawBus(
    s: Scene,
    from: Block,
    to: Block,
    color: string,
    width: number,
    dash: number[],
    back: boolean,
  ) {
    const { ctx } = s;
    const rf = rectOf(s, from);
    const rt = rectOf(s, to);
    if (back) {
      // retour write-back : route haute, de dmem vers regs (sens droite → gauche)
      const yTop = py(s, 0.06);
      const xa = rf.cx;
      const xb = rt.cx;
      line(ctx, xa, rf.y, xa, yTop, color, width, dash);
      line(ctx, xa, yTop, xb, yTop, color, width, dash);
      arrow(ctx, xb, yTop, xb, rt.y, color, width, 9);
    } else {
      // route directe horizontale entre bords des deux blocs
      const ya = rf.cy;
      arrow(ctx, rf.x + rf.w, ya, rt.x, ya, color, width, 10);
    }
  }

  /** Position du jeton le long du bus actif, paramètre t∈[0,1]. */
  function tokenPos(s: Scene, p: Phase, t: number): { x: number; y: number } {
    const rf = rectOf(s, BLOCKS[p.from]);
    const rt = rectOf(s, BLOCKS[p.to]);
    if (p.back) {
      const yTop = py(s, 0.06);
      const xa = rf.cx;
      const xb = rt.cx;
      // trois segments : montée, traversée horizontale, descente
      const seg1 = 0.2;
      const seg3 = 0.2;
      if (t < seg1) {
        const u = t / seg1;
        return { x: xa, y: lerp(rf.y, yTop, u) };
      } else if (t < 1 - seg3) {
        const u = (t - seg1) / (1 - seg1 - seg3);
        return { x: lerp(xa, xb, u), y: yTop };
      } else {
        const u = (t - (1 - seg3)) / seg3;
        return { x: xb, y: lerp(yTop, rt.y, u) };
      }
    }
    const x = lerp(rf.x + rf.w, rt.x, t);
    return { x, y: rf.cy };
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const p = PHASES[phase];
    const accent = accentColor(s, p.accent);
    const activeSet = new Set<BlockId>(p.blocks);

    // --- Bus de fond (tous les liens, en gris) ---
    for (let i = 0; i < ORDER.length - 1; i++) {
      drawBus(s, BLOCKS[ORDER[i]], BLOCKS[ORDER[i + 1]], pal.border, 2, [], false);
    }
    // retour write-back (route haute) en pointillés gris
    drawBus(s, BLOCKS.dmem, BLOCKS.regs, pal.border, 2, [5, 5], true);

    // --- Retour PC + 1 (boucle basse de imem/alu vers PC) ---
    {
      const rPc = rectOf(s, BLOCKS.pc);
      const rAlu = rectOf(s, BLOCKS.alu);
      const yBot = py(s, 0.96);
      const litBack = p.name === 'Write-back';
      const col = litBack ? accent : pal.border;
      const wBack = litBack ? 3 : 2;
      line(ctx, rAlu.cx, rAlu.y + rAlu.h, rAlu.cx, yBot, col, wBack, [5, 5]);
      line(ctx, rAlu.cx, yBot, rPc.cx, yBot, col, wBack, [5, 5]);
      arrow(ctx, rPc.cx, yBot, rPc.cx, rPc.y + rPc.h, col, wBack, 9);
      text(ctx, 'PC + 1', (rAlu.cx + rPc.cx) / 2, yBot + 14, {
        color: litBack ? accent : pal.muted, size: 12, align: 'center', weight: 600,
      });
    }

    // --- Bus actif mis en évidence (par-dessus le fond) ---
    drawBus(s, BLOCKS[p.from], BLOCKS[p.to], accent, 3.5, p.back ? [6, 6] : [], !!p.back);

    // --- Jeton circulant sur le bus actif ---
    {
      const pos = tokenPos(s, p, tok);
      const r = Math.max(5, 0.012 * W);
      // halo
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r * 2.1, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.restore();
      // noyau
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = pal.bg;
      ctx.stroke();
    }

    // --- Blocs ---
    for (const id of Object.keys(BLOCKS) as BlockId[]) {
      if (id === 'wb') continue; // write-back se confond avec le banc de registres (mise en évidence seule)
      const b = BLOCKS[id];
      const r = rectOf(s, b);
      const isActive = activeSet.has(id);
      ctx.save();
      ctx.fillStyle = pal.surface;
      ctx.globalAlpha = isActive ? 1 : 0.55;
      roundRect(ctx, r.x, r.y, r.w, r.h, 9);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = isActive ? 3 : 1.5;
      ctx.strokeStyle = isActive ? accent : pal.border;
      roundRect(ctx, r.x, r.y, r.w, r.h, 9);
      ctx.stroke();
      ctx.restore();

      const titleCol = isActive ? pal.text : pal.muted;
      const subCol = isActive ? accent : pal.muted;
      text(ctx, b.label, r.cx, r.cy - 4, {
        color: titleCol, size: clamp(0.0125 * W, 11, 15), align: 'center', weight: 700,
      });
      text(ctx, b.sub, r.cx, r.cy + 14, {
        color: subCol, size: clamp(0.0095 * W, 9, 12), align: 'center', weight: 500,
      });
    }

    // --- Bandeau de légende de phase (bas du canvas) ---
    {
      const ly = py(s, 1.0) + 0.04 * H;
      const bx = 0.02 * W;
      // pastille de phase
      const chipR = 7;
      ctx.beginPath();
      ctx.arc(bx + chipR, ly + 2, chipR, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      text(ctx, `Phase ${phase + 1}/${PHASES.length} — ${p.name}`, bx + chipR * 2 + 8, ly + 6, {
        color: pal.text, size: clamp(0.013 * W, 12, 16), align: 'left', weight: 700,
      });
      text(ctx, p.desc, bx + chipR * 2 + 8, ly + 6 + clamp(0.016 * W, 16, 22), {
        color: pal.muted, size: clamp(0.011 * W, 10, 13), align: 'left',
      });
    }

    // --- Frise des six phases (points indicateurs en haut à droite) ---
    {
      const dotR = 4.5;
      const gap = 16;
      const startX = W - 0.02 * W - (PHASES.length - 1) * gap;
      const yDot = 0.06 * H;
      for (let i = 0; i < PHASES.length; i++) {
        const x = startX + i * gap;
        const on = i === phase;
        ctx.beginPath();
        ctx.arc(x, yDot, on ? dotR : dotR * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = on ? accent : pal.border;
        ctx.fill();
      }
    }
  }

  btn.addEventListener('click', next);

  refresh();
  kick();
}

document.querySelectorAll<HTMLElement>('[data-iw="datapath"]').forEach(init);
