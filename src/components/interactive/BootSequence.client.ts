import { createScene, line, text, circle, clamp, lerp, prefersReducedMotion, type Scene } from './_canvas';

/** Niveau de privilège logique (sert au code couleur). */
type Priv = 'firmware' | 'noyau' | 'utilisateur';
/** Emplacement physique courant du code exécuté. */
type Loc = 'ROM' | 'RAM' | 'disque';

interface Step {
  /** libellé court affiché sous le jalon */
  short: string;
  /** nom complet pour le readout et le panneau */
  name: string;
  priv: Priv;
  loc: Loc;
  /** ce qui s'exécute / le rôle de l'étape */
  runs: string;
  /** ce qui est initialisé à cette étape */
  inits: string;
}

const STEPS: Step[] = [
  {
    short: 'Sous tension',
    name: 'Mise sous tension',
    priv: 'firmware',
    loc: 'ROM',
    runs: 'Les alimentations se stabilisent, les horloges démarrent ; le processeur est encore inactif.',
    inits: 'Tensions et horloges du système (signal « power good »).',
  },
  {
    short: 'Reset',
    name: 'Reset (vecteur de boot)',
    priv: 'firmware',
    loc: 'ROM',
    runs: 'Le reset place le CPU dans un état connu : il pointe sur le vecteur de boot (point d\'entrée fixe).',
    inits: 'Registres remis à leur valeur de reset ; compteur ordinal = vecteur de boot.',
  },
  {
    short: 'Firmware / POST',
    name: 'Firmware / POST',
    priv: 'firmware',
    loc: 'ROM',
    runs: 'Le firmware initialise mémoire et bus, teste le matériel (POST) puis cherche un média de démarrage.',
    inits: 'Contrôleur mémoire, bus (PCIe, USB…), périphériques de base, table de démarrage.',
  },
  {
    short: 'Bootloader',
    name: 'Bootloader',
    priv: 'firmware',
    loc: 'disque',
    runs: 'Chargé depuis le disque, le bootloader lit l\'image du noyau et la copie en RAM, puis lui passe la main.',
    inits: 'Image du noyau placée en RAM ; paramètres de démarrage transmis.',
  },
  {
    short: 'Noyau',
    name: 'Noyau (mode protégé + MMU)',
    priv: 'noyau',
    loc: 'RAM',
    runs: 'Le noyau bascule en mode protégé, active la pagination (MMU) et met en place ses structures internes.',
    inits: 'Mode protégé, tables de pages / MMU, ordonnanceur, pilotes, gestion mémoire.',
  },
  {
    short: 'init',
    name: 'init (premier processus)',
    priv: 'utilisateur',
    loc: 'RAM',
    runs: 'Le noyau lance le premier processus (PID 1) ; l\'espace utilisateur démarre et lance les services.',
    inits: 'Processus init (PID 1), services et session utilisateur.',
  },
];

const PRIV_LABEL: Record<Priv, string> = {
  firmware: 'firmware (le plus privilégié)',
  noyau: 'noyau (superviseur)',
  utilisateur: 'utilisateur (non privilégié)',
};

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnNext = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const outEtape = root.querySelector<HTMLElement>('[data-out-etape]')!;
  const outPriv = root.querySelector<HTMLElement>('[data-out-priv]')!;
  const outLoc = root.querySelector<HTMLElement>('[data-out-loc]')!;

  const reduce = prefersReducedMotion();

  let cur = 0; // index de l'étape courante (0..STEPS.length-1)
  let progress = 0; // position animée le long de la frise (en unités d'index)
  let raf = 0;

  const scene = createScene(canvas, draw);

  function privColor(p: Priv): string {
    const { pal } = scene;
    if (p === 'firmware') return pal.blue;
    if (p === 'noyau') return pal.green;
    return pal.red;
  }

  function refresh() {
    const s = STEPS[cur];
    outEtape.textContent = `${cur + 1}/${STEPS.length} — ${s.name}`;
    outPriv.textContent = PRIV_LABEL[s.priv];
    outLoc.textContent = s.loc;
    btnNext.disabled = cur >= STEPS.length - 1;
  }

  function tick() {
    const target = cur;
    const d = target - progress;
    if (Math.abs(d) < 0.01) {
      progress = target;
      raf = 0;
      scene.requestDraw();
      return;
    }
    progress += d * 0.18;
    scene.requestDraw();
    raf = requestAnimationFrame(tick);
  }

  function animateTo(target: number) {
    cur = clamp(target, 0, STEPS.length - 1);
    refresh();
    if (reduce) {
      progress = cur;
      scene.requestDraw();
    } else if (!raf) {
      raf = requestAnimationFrame(tick);
    }
    scene.requestDraw();
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    rad: number,
  ) {
    const r = Math.min(rad, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const n = STEPS.length;
    const padX = clamp(W * 0.07, 36, 80);
    const x0 = padX;
    const x1 = W - padX;
    const yLine = H * 0.27;
    const xAt = (i: number) => lerp(x0, x1, i / (n - 1));
    const accent = privColor(STEPS[cur].priv);

    // --- Frise : rail de fond ---
    line(ctx, x0, yLine, x1, yLine, pal.border, 4);

    // --- Barre de progression (jusqu'à l'étape atteinte) ---
    const xp = xAt(progress);
    line(ctx, x0, yLine, xp, yLine, accent, 4);

    // --- Jalons ---
    const r = clamp(Math.min(W, H) * 0.022, 9, 16);
    for (let i = 0; i < n; i++) {
      const x = xAt(i);
      const done = i <= cur;
      const isCur = i === cur;
      const col = privColor(STEPS[i].priv);
      if (isCur) {
        circle(ctx, x, yLine, r + 7, undefined, withAlpha(col, 0.35), 2);
      }
      const fill = done ? withAlpha(col, isCur ? 0.85 : 0.5) : pal.surface;
      const stroke = done ? col : pal.border;
      circle(ctx, x, yLine, r, fill, stroke, isCur ? 3 : 2);
      text(ctx, String(i + 1), x, yLine, {
        color: done ? pal.bg : pal.muted,
        size: r * 0.95,
        align: 'center',
        baseline: 'middle',
        weight: 700,
      });

      // libellé sous le jalon (alterné en hauteur pour éviter les chevauchements)
      const ly = yLine + r + 16 + (i % 2) * 18;
      // petit tiret reliant le jalon à son libellé décalé
      if (i % 2 === 1) line(ctx, x, yLine + r + 4, x, ly - 12, pal.border, 1, [3, 3]);
      text(ctx, STEPS[i].short, x, ly, {
        color: isCur ? col : pal.muted,
        size: clamp(W * 0.0135, 10, 13),
        align: 'center',
        baseline: 'middle',
        weight: isCur ? 700 : 500,
      });
    }

    // --- Bande des emplacements (ROM → disque → RAM) ---
    const yLoc = yLine - r - 22;
    text(ctx, 'ROM', xAt(0), yLoc, {
      color: pal.purple, size: 11, align: 'center', baseline: 'middle', weight: 700,
    });
    text(ctx, 'disque', xAt(3), yLoc, {
      color: pal.teal, size: 11, align: 'center', baseline: 'middle', weight: 700,
    });
    text(ctx, 'RAM', xAt(4.5), yLoc, {
      color: pal.green, size: 11, align: 'center', baseline: 'middle', weight: 700,
    });

    // --- Panneau descriptif de l'étape courante ---
    const st = STEPS[cur];
    const pX = padX * 0.55;
    const pY = H * 0.5;
    const pW = W - 2 * pX;
    const pH = H - pY - H * 0.06;
    ctx.save();
    ctx.fillStyle = pal.bgElev;
    ctx.strokeStyle = withAlpha(accent, 0.6);
    ctx.lineWidth = 2;
    roundRect(ctx, pX, pY, pW, pH, 12);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // liseré d'accent à gauche du panneau
    ctx.save();
    ctx.fillStyle = accent;
    roundRect(ctx, pX, pY, 6, pH, 3);
    ctx.fill();
    ctx.restore();

    const tX = pX + 22;
    let tY = pY + 26;
    const titleSize = clamp(W * 0.022, 15, 20);
    text(ctx, `${cur + 1}. ${st.name}`, tX, tY, {
      color: accent, size: titleSize, align: 'left', baseline: 'middle', weight: 700,
    });
    // badge de privilège à droite du titre
    drawBadge(s, PRIV_LABEL[st.priv], pX + pW - 16, tY, accent);

    tY += titleSize + 12;
    const bodySize = clamp(W * 0.016, 12, 15);
    const labelCol = pal.muted;

    const rows: Array<[string, string, string]> = [
      ['Exécute', st.runs, pal.text],
      ['Initialise', st.inits, pal.text],
      ['Emplacement', `${st.loc}  (le code s'exécute ici)`, pal.text],
    ];
    const labelW = clamp(pW * 0.18, 78, 130);
    for (const [label, body, bodyCol] of rows) {
      text(ctx, label, tX, tY, {
        color: labelCol, size: bodySize, align: 'left', baseline: 'top', weight: 700,
      });
      const wrapW = pW - (tX - pX) - (labelW + 14) - 18;
      const lines = wrapText(ctx, body, wrapW, bodySize);
      let ly = tY;
      for (const ln of lines) {
        text(ctx, ln, tX + labelW + 14, ly, {
          color: bodyCol, size: bodySize, align: 'left', baseline: 'top', weight: 400,
        });
        ly += bodySize + 5;
      }
      tY = ly + 9;
    }
  }

  /** Petit badge arrondi (fond translucide + texte coloré), aligné à droite. */
  function drawBadge(s: Scene, str: string, xRight: number, yMid: number, col: string) {
    const { ctx } = s;
    const size = 11;
    ctx.save();
    ctx.font = `700 ${size}px Inter, system-ui, sans-serif`;
    const w = ctx.measureText(str).width + 18;
    const h = 22;
    const x = xRight - w;
    const y = yMid - h / 2;
    ctx.fillStyle = withAlpha(col, 0.16);
    ctx.strokeStyle = withAlpha(col, 0.6);
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, h / 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, str, x + w / 2, yMid, {
      color: col, size, align: 'center', baseline: 'middle', weight: 700,
    });
  }

  /** Découpe un texte en lignes tenant dans `maxW` (mesure réelle). */
  function wrapText(
    ctx: CanvasRenderingContext2D,
    str: string,
    maxW: number,
    size: number,
  ): string[] {
    ctx.save();
    ctx.font = `400 ${size}px Inter, system-ui, sans-serif`;
    const words = str.split(' ');
    const lines: string[] = [];
    let curLine = '';
    for (const word of words) {
      const test = curLine ? `${curLine} ${word}` : word;
      if (ctx.measureText(test).width > maxW && curLine) {
        lines.push(curLine);
        curLine = word;
      } else {
        curLine = test;
      }
    }
    if (curLine) lines.push(curLine);
    ctx.restore();
    return lines;
  }

  /** Variante translucide d'une couleur de la charte (halos, fonds). */
  function withAlpha(color: string, a: number): string {
    const { pal } = scene;
    const al = clamp(a, 0, 1);
    if (color === pal.blue) return `rgba(88, 196, 221, ${al})`;
    if (color === pal.green) return `rgba(131, 193, 103, ${al})`;
    if (color === pal.red) return `rgba(252, 98, 85, ${al})`;
    if (color === pal.yellow) return `rgba(255, 216, 102, ${al})`;
    if (color === pal.teal) return `rgba(92, 208, 179, ${al})`;
    if (color === pal.purple) return `rgba(195, 155, 211, ${al})`;
    return `rgba(157, 167, 179, ${al})`;
  }

  btnNext.addEventListener('click', () => animateTo(cur + 1));
  btnReset.addEventListener('click', () => animateTo(0));

  refresh();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="boot-sequence"]').forEach(init);
