import { createScene, text, clamp, prefersReducedMotion, type Scene } from './_canvas';

/* ------------------------------------------------------------------ *
 *  Jeu d'instructions (ISA) — un octet : quartet haut = code-op,
 *  quartet bas = adresse / opérande (0..15).
 * ------------------------------------------------------------------ */
const enum Op {
  HLT = 0x0,
  LDA = 0x1,
  ADD = 0x2,
  STA = 0x3,
  SUB = 0x4,
  JMP = 0x5,
  JZ = 0x6,
  OUT = 0x7,
}

/** Nom mnémonique du code-opération (pour le désassemblage). */
const MNEMO: Record<number, string> = {
  [Op.HLT]: 'HLT',
  [Op.LDA]: 'LDA',
  [Op.ADD]: 'ADD',
  [Op.STA]: 'STA',
  [Op.SUB]: 'SUB',
  [Op.JMP]: 'JMP',
  [Op.JZ]: 'JZ',
  [Op.OUT]: 'OUT',
};

/** Les codes-op qui prennent une adresse en opérande. */
const HAS_ADDR = new Set<number>([Op.LDA, Op.ADD, Op.STA, Op.SUB, Op.JMP, Op.JZ]);

/** Fabrique un octet à partir d'un code-op et d'une adresse. */
const byte = (op: Op, addr = 0): number => ((op << 4) | (addr & 0x0f)) & 0xff;

/**
 * Programme préchargé.
 *   0: LDA 10   A ← mem[10] (= 3)
 *   1: ADD 11   A ← A + mem[11] (= 2)   → A = 5
 *   2: STA 12   mem[12] ← A             → compteur = 5
 *   3: OUT      émet A
 *   4: LDA 12   A ← compteur
 *   5: SUB 13   A ← A − mem[13] (= 1)
 *   6: STA 12   compteur ← A
 *   7: JZ  9    si A = 0 → fin
 *   8: JMP 3    sinon reboucle vers OUT
 *   9: HLT      arrêt
 *  10: 3   donnée (premier opérande)
 *  11: 2   donnée (second opérande)
 *  12: 0   variable (compteur, écrite à l'exécution)
 *  13: 1   donnée (pas de décrément)
 *  14..15: 0  inutilisées
 */
const PROGRAM: number[] = [
  byte(Op.LDA, 10),
  byte(Op.ADD, 11),
  byte(Op.STA, 12),
  byte(Op.OUT),
  byte(Op.LDA, 12),
  byte(Op.SUB, 13),
  byte(Op.STA, 12),
  byte(Op.JZ, 9),
  byte(Op.JMP, 3),
  byte(Op.HLT),
  3,
  2,
  0,
  1,
  0,
  0,
];

/** Adresse de la dernière case « programme » (les suivantes sont des données). */
const CODE_LEN = 10;

type Phase = 'fetch' | 'decode' | 'execute' | 'halt';
const PHASE_LABEL: Record<Phase, string> = {
  fetch: 'chargement (fetch)',
  decode: 'décodage (decode)',
  execute: 'exécution (execute)',
  halt: 'arrêté (HLT)',
};

/** Désassemble un octet en chaîne lisible, p. ex. « LDA 10 » ou « OUT ». */
function disasm(b: number): string {
  const op = (b >> 4) & 0x0f;
  const addr = b & 0x0f;
  const m = MNEMO[op];
  if (m === undefined) return `??? ${b}`;
  return HAS_ADDR.has(op) ? `${m} ${addr}` : m;
}

interface CpuState {
  mem: number[];
  a: number;
  pc: number;
  ir: number;
  z: boolean;
  out: number[];
  phase: Phase;
  /** adresse de la dernière case mémoire écrite (-1 si aucune) */
  lastWrite: number;
  /** adresse décodée de l'instruction courante (pour la mise en évidence) */
  decodedAddr: number;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnStep = root.querySelector<HTMLButtonElement>('[data-step]')!;
  const btnRun = root.querySelector<HTMLButtonElement>('[data-run]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const outA = root.querySelector<HTMLElement>('[data-out-a]')!;
  const outPc = root.querySelector<HTMLElement>('[data-out-pc]')!;
  const outIr = root.querySelector<HTMLElement>('[data-out-ir]')!;
  const outPhase = root.querySelector<HTMLElement>('[data-out-phase]')!;

  const reduce = prefersReducedMotion();

  let cpu: CpuState = freshState();
  let timer: number | null = null;

  const scene = createScene(canvas, draw);

  function freshState(): CpuState {
    return {
      mem: PROGRAM.slice(),
      a: 0,
      pc: 0,
      ir: 0,
      z: true,
      out: [],
      phase: 'fetch',
      lastWrite: -1,
      decodedAddr: -1,
    };
  }

  /** Met le drapeau Z à jour et borne A sur un octet signé/positif simple (0..255). */
  function setA(v: number) {
    cpu.a = ((v % 256) + 256) % 256;
    cpu.z = cpu.a === 0;
  }

  /**
   * Exécute UNE phase du cycle (fetch → decode → execute), de façon déterministe.
   * Renvoie true tant que la machine n'est pas arrêtée.
   */
  function microStep(): boolean {
    if (cpu.phase === 'halt') return false;

    if (cpu.phase === 'fetch') {
      // Charge l'instruction pointée par PC, puis incrémente PC.
      cpu.ir = cpu.mem[cpu.pc] & 0xff;
      cpu.lastWrite = -1;
      cpu.decodedAddr = -1;
      cpu.pc = (cpu.pc + 1) & 0x0f;
      cpu.phase = 'decode';
      return true;
    }

    if (cpu.phase === 'decode') {
      // Extrait code-op + adresse (pour mettre la case opérande en évidence).
      const op = (cpu.ir >> 4) & 0x0f;
      const addr = cpu.ir & 0x0f;
      cpu.decodedAddr = HAS_ADDR.has(op) ? addr : -1;
      cpu.phase = 'execute';
      return true;
    }

    // phase === 'execute'
    const op = (cpu.ir >> 4) & 0x0f;
    const addr = cpu.ir & 0x0f;
    switch (op) {
      case Op.LDA:
        setA(cpu.mem[addr] & 0xff);
        break;
      case Op.ADD:
        setA(cpu.a + (cpu.mem[addr] & 0xff));
        break;
      case Op.SUB:
        setA(cpu.a - (cpu.mem[addr] & 0xff));
        break;
      case Op.STA:
        cpu.mem[addr] = cpu.a & 0xff;
        cpu.lastWrite = addr;
        break;
      case Op.JMP:
        cpu.pc = addr & 0x0f;
        break;
      case Op.JZ:
        if (cpu.z) cpu.pc = addr & 0x0f;
        break;
      case Op.OUT:
        cpu.out.push(cpu.a);
        if (cpu.out.length > 12) cpu.out.shift();
        break;
      case Op.HLT:
      default:
        cpu.phase = 'halt';
        refresh();
        return false;
    }
    cpu.phase = 'fetch';
    return true;
  }

  function refresh() {
    outA.textContent = `${cpu.a}`;
    outPc.textContent = `${cpu.pc}`;
    outIr.textContent = `${disasm(cpu.ir)}  (0x${cpu.ir.toString(16).padStart(2, '0')})`;
    outPhase.textContent = PHASE_LABEL[cpu.phase];
    btnStep.disabled = cpu.phase === 'halt';
    btnRun.textContent = timer !== null ? 'arrêter ⏸' : 'exécuter ⏩';
    btnRun.disabled = cpu.phase === 'halt' && timer === null;
  }

  function stopRun() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function step() {
    microStep();
    refresh();
    scene.requestDraw();
  }

  function toggleRun() {
    if (timer !== null) {
      stopRun();
      refresh();
      return;
    }
    if (cpu.phase === 'halt') return;
    const period = reduce ? 90 : 220;
    timer = window.setInterval(() => {
      const alive = microStep();
      refresh();
      scene.requestDraw();
      if (!alive) stopRun();
    }, period);
    refresh();
  }

  function reset() {
    stopRun();
    cpu = freshState();
    refresh();
    scene.requestDraw();
  }

  /* ---------------------------------------------------------------- *
   *  Rendu
   * ---------------------------------------------------------------- */

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
    const { ctx, width: W, height: H } = s;
    ctx.clearRect(0, 0, W, H);

    const pad = clamp(0.02 * W, 8, 18);
    const colGap = clamp(0.025 * W, 10, 26);
    // Colonne gauche : mémoire (grille 4×4). Colonne droite : registres, sortie, désassemblage.
    const leftW = (W - pad * 2 - colGap) * 0.5;
    const rightX = pad + leftW + colGap;
    const rightW = W - pad - rightX;
    const top = clamp(0.045 * H, 10, 26);

    drawMemory(s, pad, top, leftW, H - top - pad);
    drawRegisters(s, rightX, top, rightW);
    const regsBottom = top + clamp(0.30 * H, 70, 150);
    drawOutput(s, rightX, regsBottom + clamp(0.02 * H, 6, 14), rightW);
    drawDisasm(
      s,
      rightX,
      regsBottom + clamp(0.20 * H, 60, 130),
      rightW,
      H - (regsBottom + clamp(0.20 * H, 60, 130)) - pad,
    );
  }

  /** Grille mémoire 4×4 : PC surligné, dernière écriture mise en évidence. */
  function drawMemory(s: Scene, x0: number, y0: number, w: number, h: number) {
    const { ctx, pal, width: W } = s;
    const titleH = clamp(0.05 * s.height, 14, 26);
    text(ctx, 'Mémoire (programme + données)', x0, y0 + titleH * 0.55, {
      color: pal.text,
      size: clamp(0.014 * W, 11, 16),
      weight: 700,
      baseline: 'middle',
    });

    const gy0 = y0 + titleH;
    const gh = h - titleH;
    const cols = 4;
    const rows = 4;
    const cellGap = clamp(0.006 * W, 3, 8);
    const cw = (w - cellGap * (cols - 1)) / cols;
    const ch = (gh - cellGap * (rows - 1)) / rows;
    const cell = Math.min(cw, ch);
    // Centre la grille horizontalement si les cases sont carrées.
    const gridW = cols * cell + (cols - 1) * cellGap;
    const offX = x0 + (w - gridW) / 2;

    for (let i = 0; i < 16; i++) {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const cx = offX + c * (cell + cellGap);
      const cy = gy0 + r * (cell + cellGap);

      const isPc = i === cpu.pc && cpu.phase !== 'halt';
      const isWrite = i === cpu.lastWrite;
      const isOperand = i === cpu.decodedAddr;
      const isCode = i < CODE_LEN;

      let border = pal.border;
      let bw = 1.5;
      let fill = isCode ? pal.surface : pal.bgElev;

      if (isPc) {
        border = pal.blue;
        bw = 3;
      } else if (isOperand) {
        border = pal.purple;
        bw = 2.5;
      } else if (isWrite) {
        border = pal.green;
        bw = 2.5;
      }

      ctx.save();
      ctx.fillStyle = fill;
      roundRect(ctx, cx, cy, cell, cell, 6);
      ctx.fill();
      if (isPc) {
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = pal.blue;
        roundRect(ctx, cx, cy, cell, cell, 6);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (isWrite) {
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = pal.green;
        roundRect(ctx, cx, cy, cell, cell, 6);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.lineWidth = bw;
      ctx.strokeStyle = border;
      roundRect(ctx, cx, cy, cell, cell, 6);
      ctx.stroke();
      ctx.restore();

      // Adresse (petit, en haut à gauche)
      text(ctx, `${i}`, cx + cell * 0.12, cy + cell * 0.2, {
        color: pal.muted,
        size: clamp(cell * 0.18, 8, 12),
        align: 'left',
        baseline: 'middle',
        weight: 600,
      });

      // Valeur de la case : pour le code on montre le désassemblage, pour les
      // données la valeur décimale.
      const val = cpu.mem[i] & 0xff;
      const main = isCode ? disasm(val) : `${val}`;
      text(ctx, main, cx + cell / 2, cy + cell * 0.58, {
        color: isPc ? pal.blue : pal.text,
        size: clamp(cell * (isCode ? 0.2 : 0.3), 9, 15),
        align: 'center',
        baseline: 'middle',
        weight: 700,
      });
      // Octet brut hexadécimal, en bas
      text(ctx, `0x${val.toString(16).padStart(2, '0')}`, cx + cell / 2, cy + cell * 0.84, {
        color: pal.muted,
        size: clamp(cell * 0.15, 7, 11),
        align: 'center',
        baseline: 'middle',
      });
    }
  }

  /** Registres A, PC, IR, Z, et la phase courante du cycle. */
  function drawRegisters(s: Scene, x0: number, y0: number, w: number) {
    const { ctx, pal, width: W } = s;
    const titleH = clamp(0.05 * s.height, 14, 26);
    text(ctx, 'Registres', x0, y0 + titleH * 0.55, {
      color: pal.text,
      size: clamp(0.014 * W, 11, 16),
      weight: 700,
      baseline: 'middle',
    });

    const boxY = y0 + titleH;
    const regs: Array<{ k: string; v: string; col: string }> = [
      { k: 'A', v: `${cpu.a}`, col: pal.yellow },
      { k: 'PC', v: `${cpu.pc}`, col: pal.blue },
      { k: 'IR', v: disasm(cpu.ir), col: pal.purple },
      { k: 'Z', v: cpu.z ? '1' : '0', col: cpu.z ? pal.green : pal.muted },
    ];
    const gap = clamp(0.008 * W, 4, 10);
    const bw = (w - gap * 3) / 4;
    const bh = clamp(0.13 * s.height, 38, 70);

    regs.forEach((r, i) => {
      const bx = x0 + i * (bw + gap);
      ctx.save();
      ctx.fillStyle = pal.bgElev;
      roundRect(ctx, bx, boxY, bw, bh, 7);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = pal.border;
      roundRect(ctx, bx, boxY, bw, bh, 7);
      ctx.stroke();
      ctx.restore();
      text(ctx, r.k, bx + bw / 2, boxY + bh * 0.28, {
        color: pal.muted,
        size: clamp(0.012 * W, 9, 13),
        align: 'center',
        baseline: 'middle',
        weight: 600,
      });
      text(ctx, r.v, bx + bw / 2, boxY + bh * 0.68, {
        color: r.col,
        size: clamp(bw * 0.22, 12, 20),
        align: 'center',
        baseline: 'middle',
        weight: 800,
      });
    });

    // Bandeau « phase » du cycle fetch-decode-execute
    const py = boxY + bh + clamp(0.018 * s.height, 6, 14);
    const phases: Phase[] = ['fetch', 'decode', 'execute'];
    const pgap = clamp(0.008 * W, 4, 10);
    const pw = (w - pgap * 2) / 3;
    const ph = clamp(0.07 * s.height, 22, 38);
    phases.forEach((p, i) => {
      const bx = x0 + i * (pw + pgap);
      const on = cpu.phase === p;
      ctx.save();
      ctx.fillStyle = on ? pal.teal : pal.surface;
      ctx.globalAlpha = on ? 1 : 0.7;
      roundRect(ctx, bx, py, pw, ph, 6);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = on ? 2 : 1.2;
      ctx.strokeStyle = on ? pal.teal : pal.border;
      roundRect(ctx, bx, py, pw, ph, 6);
      ctx.stroke();
      ctx.restore();
      const lab = p === 'fetch' ? 'fetch' : p === 'decode' ? 'decode' : 'execute';
      text(ctx, lab, bx + pw / 2, py + ph / 2, {
        color: on ? pal.bg : pal.muted,
        size: clamp(pw * 0.16, 9, 13),
        align: 'center',
        baseline: 'middle',
        weight: on ? 800 : 600,
      });
    });
  }

  /** Zone de sortie : valeurs émises par OUT. */
  function drawOutput(s: Scene, x0: number, y0: number, w: number) {
    const { ctx, pal, width: W } = s;
    text(ctx, 'Sortie (OUT)', x0, y0, {
      color: pal.text,
      size: clamp(0.013 * W, 10, 15),
      weight: 700,
      baseline: 'middle',
    });
    const boxY = y0 + clamp(0.02 * s.height, 6, 14);
    const bh = clamp(0.07 * s.height, 24, 40);
    ctx.save();
    ctx.fillStyle = pal.bg;
    roundRect(ctx, x0, boxY, w, bh, 7);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = pal.border;
    roundRect(ctx, x0, boxY, w, bh, 7);
    ctx.stroke();
    ctx.restore();

    const txt = cpu.out.length ? cpu.out.join('  ·  ') : '—';
    text(ctx, txt, x0 + clamp(0.01 * W, 6, 12), boxY + bh / 2, {
      color: cpu.out.length ? pal.green : pal.muted,
      size: clamp(bh * 0.42, 11, 18),
      align: 'left',
      baseline: 'middle',
      weight: 700,
      font: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    });
  }

  /** Désassemblage du programme avec la ligne courante (PC) surlignée. */
  function drawDisasm(s: Scene, x0: number, y0: number, w: number, h: number) {
    const { ctx, pal, width: W } = s;
    text(ctx, 'Désassemblage', x0, y0, {
      color: pal.text,
      size: clamp(0.013 * W, 10, 15),
      weight: 700,
      baseline: 'middle',
    });

    const listY = y0 + clamp(0.022 * s.height, 6, 14);
    const lh = Math.max(14, (h - clamp(0.022 * s.height, 6, 14)) / CODE_LEN);
    const fs = clamp(lh * 0.62, 9, 14);

    for (let i = 0; i < CODE_LEN; i++) {
      const ly = listY + i * lh;
      const isPc = i === cpu.pc && cpu.phase !== 'halt';
      const isHaltLine = (cpu.mem[i] & 0xff) >> 4 === Op.HLT;

      if (isPc) {
        ctx.save();
        ctx.fillStyle = pal.blue;
        ctx.globalAlpha = 0.16;
        roundRect(ctx, x0 - 2, ly + 1, w + 4, lh - 2, 4);
        ctx.fill();
        ctx.restore();
        // petit curseur ►
        text(ctx, '►', x0 + 1, ly + lh / 2, {
          color: pal.blue,
          size: fs,
          align: 'left',
          baseline: 'middle',
          weight: 800,
        });
      }

      const addrCol = isPc ? pal.blue : pal.muted;
      text(ctx, i.toString().padStart(2, ' '), x0 + clamp(0.02 * W, 12, 22), ly + lh / 2, {
        color: addrCol,
        size: fs,
        align: 'left',
        baseline: 'middle',
        weight: 600,
        font: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      });
      text(ctx, disasm(cpu.mem[i] & 0xff), x0 + clamp(0.07 * W, 40, 70), ly + lh / 2, {
        color: isPc ? pal.text : isHaltLine ? pal.red : pal.text,
        size: fs,
        align: 'left',
        baseline: 'middle',
        weight: isPc ? 800 : 500,
        font: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      });
    }
  }

  /* ---------------------------------------------------------------- *
   *  Branchements
   * ---------------------------------------------------------------- */
  btnStep.addEventListener('click', () => {
    stopRun();
    step();
    refresh();
  });
  btnRun.addEventListener('click', toggleRun);
  btnReset.addEventListener('click', reset);

  refresh();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="mini-cpu"]').forEach(init);
