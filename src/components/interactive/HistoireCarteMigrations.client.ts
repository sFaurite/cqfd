import { createScene, circle, text, clamp, prefersReducedMotion, type Scene } from './_canvas';

/**
 * Coordonnées normalisées [0..1] sur une carte équirectangulaire schématique :
 * x = longitude (0 = −180°, 1 = +180°), y = latitude (0 = +85°, 1 = −60°).
 * Les continents sont des polygones très simplifiés, suffisants pour situer les
 * grands flux sans prétendre à l'exactitude géographique.
 */
type Pt = [number, number];

const CONTINENTS: Pt[][] = [
  // Afrique
  [
    [0.5, 0.42], [0.55, 0.42], [0.58, 0.5], [0.57, 0.62], [0.53, 0.72],
    [0.5, 0.74], [0.47, 0.66], [0.46, 0.55], [0.48, 0.46],
  ],
  // Eurasie (Europe + Asie, bloc)
  [
    [0.46, 0.3], [0.55, 0.26], [0.66, 0.27], [0.78, 0.3], [0.86, 0.34],
    [0.88, 0.44], [0.82, 0.46], [0.74, 0.42], [0.66, 0.44], [0.58, 0.42],
    [0.52, 0.4], [0.47, 0.38],
  ],
  // Amérique du Nord
  [
    [0.12, 0.26], [0.24, 0.24], [0.3, 0.32], [0.28, 0.42], [0.24, 0.5],
    [0.2, 0.46], [0.16, 0.38], [0.12, 0.32],
  ],
  // Amérique du Sud
  [
    [0.26, 0.56], [0.32, 0.56], [0.34, 0.66], [0.31, 0.78], [0.27, 0.82],
    [0.25, 0.72], [0.24, 0.62],
  ],
  // Australie
  [
    [0.82, 0.66], [0.9, 0.66], [0.92, 0.72], [0.88, 0.76], [0.82, 0.74],
  ],
];

interface Flux {
  nom: string;
  debut: number; // années BP (départ du flux)
  fin: number; // années BP (arrivée)
  pts: Pt[]; // trajectoire (polyligne)
  phase: number; // indice de couleur/phase
  atteste: boolean; // trait plein si attesté, pointillé sinon
}

// 6 phases -> 6 couleurs de la palette.
const PHASES = [
  { lbl: 'Sortie d’Afrique', col: 'purple' },
  { lbl: 'Peuplement des continents', col: 'teal' },
  { lbl: 'Foyers du Néolithique', col: 'green' },
  { lbl: 'Empires antiques', col: 'yellow' },
  { lbl: 'Routes médiévales', col: 'red' },
  { lbl: 'Voyages océaniques', col: 'blue' },
] as const;

const FLUX: Flux[] = [
  // Phase 0 — sortie d'Afrique
  { nom: 'Out of Africa', debut: 70000, fin: 55000, phase: 0, atteste: true,
    pts: [[0.52, 0.5], [0.56, 0.46], [0.6, 0.44]] },
  // Phase 1 — peuplements
  { nom: 'Vers l’Europe', debut: 50000, fin: 42000, phase: 1, atteste: true,
    pts: [[0.6, 0.44], [0.55, 0.36], [0.5, 0.3]] },
  { nom: 'Vers l’Asie de l’Est', debut: 50000, fin: 40000, phase: 1, atteste: true,
    pts: [[0.6, 0.44], [0.72, 0.42], [0.82, 0.4]] },
  { nom: 'Vers l’Australie', debut: 50000, fin: 47000, phase: 1, atteste: false,
    pts: [[0.82, 0.42], [0.85, 0.55], [0.86, 0.66]] },
  { nom: 'Vers les Amériques', debut: 20000, fin: 14000, phase: 1, atteste: false,
    pts: [[0.84, 0.32], [0.05, 0.3], [0.18, 0.36], [0.27, 0.6], [0.29, 0.78]] },
  // Phase 2 — foyers néolithiques (apparition locale, petit halo)
  { nom: 'Croissant fertile', debut: 11000, fin: 11000, phase: 2, atteste: true,
    pts: [[0.6, 0.42], [0.6, 0.42]] },
  { nom: 'Chine (riz/millet)', debut: 9000, fin: 9000, phase: 2, atteste: true,
    pts: [[0.82, 0.42], [0.82, 0.42]] },
  { nom: 'Méso-Amérique (maïs)', debut: 9000, fin: 9000, phase: 2, atteste: true,
    pts: [[0.22, 0.46], [0.22, 0.46]] },
  { nom: 'Diffusion néolithique → Europe', debut: 9000, fin: 7000, phase: 2, atteste: true,
    pts: [[0.6, 0.42], [0.54, 0.36], [0.48, 0.3]] },
  // Phase 3 — empires antiques
  { nom: 'Expansion romaine', debut: 2200, fin: 1900, phase: 3, atteste: true,
    pts: [[0.5, 0.34], [0.52, 0.38], [0.58, 0.4]] },
  { nom: 'Route de la soie', debut: 2100, fin: 1500, phase: 3, atteste: true,
    pts: [[0.6, 0.4], [0.7, 0.38], [0.82, 0.4]] },
  // Phase 4 — routes médiévales
  { nom: 'Conquêtes arabes', debut: 1400, fin: 1200, phase: 4, atteste: true,
    pts: [[0.58, 0.42], [0.52, 0.46], [0.46, 0.48]] },
  { nom: 'Expansion mongole', debut: 800, fin: 700, phase: 4, atteste: true,
    pts: [[0.78, 0.36], [0.66, 0.36], [0.55, 0.36]] },
  // Phase 5 — voyages océaniques
  { nom: 'Polynésie', debut: 3000, fin: 800, phase: 5, atteste: false,
    pts: [[0.86, 0.5], [0.95, 0.6], [0.99, 0.62]] },
  { nom: 'Traversées atlantiques', debut: 530, fin: 500, phase: 5, atteste: true,
    pts: [[0.46, 0.34], [0.3, 0.42], [0.22, 0.5]] },
];

// Échelle temps : t=0 -> 70 000 BP ; t=1 -> présent. Log pour étirer le récent.
const T_OLD = 70000;
function tToAge(t: number): number {
  // interpolation log : age = exp(lerp(ln(T_OLD), ln(1), t))
  const ln = (1 - t) * Math.log(T_OLD) + t * Math.log(1);
  return Math.exp(ln);
}
function ageLabel(age: number): string {
  if (age >= 1000) return `−${Math.round(age / 100) / 10}`.replace('.', ',') + ' ka';
  if (age < 1) return 'présent';
  return `−${Math.round(age)} a`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slT = root.querySelector<HTMLInputElement>('[data-temps]')!;
  const outT = root.querySelector<HTMLElement>('[data-out-temps]')!;
  const btnPlay = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const legend = root.querySelector<HTMLElement>('[data-legend]')!;

  let t = parseInt(slT.value, 10) / 1000; // 0..1
  let playing = false;
  let lastTs = 0;

  const scene = createScene(canvas, draw);

  // Légende des phases (statique).
  PHASES.forEach((p) => {
    const el = document.createElement('span');
    el.className = 'iw__chip';
    el.innerHTML = `<span class="k" style="color:var(--c-${p.col})">●</span> ${p.lbl}`;
    legend.appendChild(el);
  });

  function refreshOut() {
    const age = tToAge(t);
    outT.textContent = age < 1 ? 'présent' : ageLabel(age);
  }

  function project(p: Pt, box: { x: number; y: number; w: number; h: number }): Pt {
    return [box.x + p[0] * box.w, box.y + p[1] * box.h];
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const box = { x: 6, y: 6, w: W - 12, h: H - 40 };
    const age = tToAge(t);

    // Fond océan + cadre.
    ctx.save();
    ctx.fillStyle = pal.surface;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.restore();

    // Continents.
    for (const cont of CONTINENTS) {
      ctx.beginPath();
      cont.forEach((p, i) => {
        const [x, y] = project(p, box);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = pal.bgElev;
      ctx.fill();
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // Flux : pour chaque flux dont le début est déjà « passé » (age <= debut),
    // tracer la portion proportionnelle au temps écoulé.
    for (const f of FLUX) {
      if (age > f.debut) continue; // pas encore commencé (on remonte du passé vers le présent)
      const col = (pal as any)[PHASES[f.phase].col] as string;

      // progression 0..1 entre debut et fin (en âge décroissant).
      let prog: number;
      if (f.debut === f.fin) prog = age <= f.debut ? 1 : 0;
      else prog = clamp((f.debut - age) / (f.debut - f.fin), 0, 1);

      // Foyer ponctuel (debut==fin) : halo pulsant.
      if (f.debut === f.fin) {
        const [x, y] = project(f.pts[0], box);
        circle(ctx, x, y, 5, col, pal.bg, 1.5);
        ctx.save();
        ctx.globalAlpha = 0.25;
        circle(ctx, x, y, 11, col);
        ctx.restore();
        continue;
      }

      drawPath(ctx, f, col, prog, box, pal);
    }

    // Curseur de date.
    text(ctx, age < 1 ? 'présent' : ageLabel(age), W - 8, box.y + box.h + 26, {
      color: pal.text,
      size: 13,
      align: 'right',
      weight: 700,
      baseline: 'middle',
    });
    text(ctx, 'plus ancien ◀  glisse le temps  ▶ présent', 8, box.y + box.h + 26, {
      color: pal.muted,
      size: 11.5,
      baseline: 'middle',
    });
  }

  function drawPath(
    ctx: CanvasRenderingContext2D,
    f: Flux,
    col: string,
    prog: number,
    box: { x: number; y: number; w: number; h: number },
    pal: Scene['pal'],
  ) {
    const pts = f.pts.map((p) => project(p, box));
    // longueur cumulée
    const segLen: number[] = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      segLen.push(d);
      total += d;
    }
    const target = total * prog;

    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(f.atteste ? [] : [6, 5]);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    let acc = 0;
    let tip: Pt = pts[0];
    for (let i = 1; i < pts.length; i++) {
      const segL = segLen[i - 1];
      if (acc + segL <= target) {
        ctx.lineTo(pts[i][0], pts[i][1]);
        acc += segL;
        tip = pts[i];
      } else {
        const r = (target - acc) / segL;
        const x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * r;
        const y = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * r;
        ctx.lineTo(x, y);
        tip = [x, y];
        break;
      }
    }
    ctx.stroke();
    ctx.restore();

    // Pointe de progression.
    circle(ctx, tip[0], tip[1], 3.5, col, pal.bg, 1.2);

    // Étiquette au point de départ (discrète) quand le flux est bien avancé.
    if (prog > 0.15) {
      text(ctx, f.nom, pts[0][0], pts[0][1] - 7, {
        color: col,
        size: 10.5,
        weight: 700,
        align: 'center',
        baseline: 'bottom',
      });
    }
  }

  function setT(v: number) {
    t = clamp(v, 0, 1);
    slT.value = String(Math.round(t * 1000));
    refreshOut();
    scene.requestDraw();
  }

  function tick(ts: number) {
    if (!playing) return;
    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    setT(t + dt / 16); // ~16 s pour balayer toute la frise
    if (t >= 1) {
      stop();
    } else {
      requestAnimationFrame(tick);
    }
  }
  function play() {
    if (prefersReducedMotion()) {
      setT(1);
      return;
    }
    if (t >= 1) setT(0);
    playing = true;
    lastTs = 0;
    btnPlay.classList.add('active');
    btnPlay.setAttribute('aria-pressed', 'true');
    btnPlay.textContent = '❚❚ Pause';
    requestAnimationFrame(tick);
  }
  function stop() {
    playing = false;
    btnPlay.classList.remove('active');
    btnPlay.setAttribute('aria-pressed', 'false');
    btnPlay.textContent = '▶ Lecture';
  }

  slT.addEventListener('input', () => {
    stop();
    t = parseInt(slT.value, 10) / 1000;
    refreshOut();
    scene.requestDraw();
  });
  btnPlay.addEventListener('click', () => (playing ? stop() : play()));
  btnReset.addEventListener('click', () => {
    stop();
    setT(0);
  });

  refreshOut();
}

document.querySelectorAll<HTMLElement>('[data-iw="carte-migrations"]').forEach(init);
