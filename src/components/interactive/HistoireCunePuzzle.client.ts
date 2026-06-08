import { createScene, line, circle, text, clamp, type Scene } from './_canvas';

type SigneId = 'boeuf' | 'epi' | 'eau' | 'etoile';

interface SigneInfo {
  nom: string; // nom de la chose
  translit: string; // valeur sumérienne
  phon: string; // emploi phonétique (rébus)
  rebus: string; // exemple de rébus / explication
}

const SIGNES: Record<SigneId, SigneInfo> = {
  boeuf: { nom: 'tête de bovin', translit: 'GUD', phon: '/gud/', rebus: '« GUD » = bœuf, mais sert aussi de syllabe gud-' },
  epi: { nom: 'épi d’orge', translit: 'ŠE', phon: '/še/', rebus: '« ŠE » = orge/grain, et la syllabe še-' },
  eau: { nom: 'eau', translit: 'A', phon: '/a/', rebus: '« A » = eau, et la voyelle a (très productive en rébus)' },
  etoile: { nom: 'étoile / ciel', translit: 'AN', phon: '/an/', rebus: '« AN » = ciel/dieu, et la syllabe an-' },
};

const PHASES = ['pictogramme', 'tourné 90°', 'cunéiforme (coins)', 'emploi phonétique (rébus)'];

/* ---------- Dessin des signes selon leur phase ---------- */

/**
 * Dessine un signe dans une boîte [x,y,w,h] centrée, pour une phase donnée
 * (0 pictogramme orienté, 1 tourné 90°, 2 cunéiforme stylisé, 3 idem + halo son).
 * `wedge` = vrai à partir de la phase 2 : on rend les traits en coins (cunéiformes).
 */
function drawSigne(
  ctx: CanvasRenderingContext2D,
  id: SigneId,
  phase: number,
  cx: number,
  cy: number,
  size: number,
  pal: Scene['pal'],
) {
  const wedge = phase >= 2;
  const col = phase >= 3 ? pal.yellow : pal.text;
  const stroke = (x1: number, y1: number, x2: number, y2: number, w = 0.06) => {
    if (wedge) drawWedge(ctx, x1, y1, x2, y2, size * w, col, pal);
    else line(ctx, x1, y1, x2, y2, col, Math.max(2, size * w), []);
  };

  ctx.save();
  ctx.translate(cx, cy);
  // Phases 1+ : rotation 90° (sens horaire) comme l'histoire réelle du cunéiforme.
  if (phase >= 1) ctx.rotate(Math.PI / 2);
  const s = size * 0.5;

  if (id === 'boeuf') {
    // Tête : ovale + deux cornes en V (pictogramme reconnaissable).
    if (!wedge) {
      ctx.strokeStyle = col;
      ctx.lineWidth = Math.max(2, size * 0.05);
      ctx.beginPath();
      ctx.ellipse(0, s * 0.2, s * 0.45, s * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    stroke(-s * 0.45, -s * 0.1, -s * 0.85, -s * 0.7); // corne gauche
    stroke(s * 0.45, -s * 0.1, s * 0.85, -s * 0.7); // corne droite
    if (wedge) {
      // version coins : triangle de tête + cornes
      stroke(-s * 0.4, s * 0.5, s * 0.4, s * 0.5);
      stroke(-s * 0.4, s * 0.5, 0, -s * 0.1);
      stroke(s * 0.4, s * 0.5, 0, -s * 0.1);
    }
  } else if (id === 'epi') {
    // Épi : tige verticale + barbes obliques.
    stroke(0, s * 0.8, 0, -s * 0.8);
    for (let i = -2; i <= 2; i++) {
      const y = i * s * 0.3;
      stroke(0, y, s * 0.45, y - s * 0.18);
      stroke(0, y, -s * 0.45, y - s * 0.18);
    }
  } else if (id === 'eau') {
    // Eau : deux lignes ondulées (pictogramme), deux traits parallèles (cunéiforme).
    if (!wedge) {
      ctx.strokeStyle = col;
      ctx.lineWidth = Math.max(2, size * 0.05);
      for (const off of [-s * 0.25, s * 0.25]) {
        ctx.beginPath();
        for (let k = 0; k <= 20; k++) {
          const x = -s * 0.7 + (1.4 * s * k) / 20;
          const y = off + Math.sin((k / 20) * Math.PI * 3) * s * 0.12;
          k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    } else {
      stroke(-s * 0.7, -s * 0.25, s * 0.7, -s * 0.25);
      stroke(-s * 0.7, s * 0.25, s * 0.7, s * 0.25);
      stroke(-s * 0.4, -s * 0.55, -s * 0.4, s * 0.55);
    }
  } else {
    // Étoile / ciel : astérisque à 8 branches.
    const n = wedge ? 6 : 8;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      stroke(0, 0, Math.cos(a) * s * 0.8, Math.sin(a) * s * 0.8);
    }
  }
  ctx.restore();

  // Phase 3 : halo « son ».
  if (phase >= 3) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    circle(ctx, cx, cy, size * 0.62, pal.yellow);
    ctx.restore();
  }
}

/** Trait cunéiforme : trait épais terminé par une tête triangulaire (coin). */
function drawWedge(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  col: string,
  _pal: Scene['pal'],
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const headLen = w * 3.2;
  // corps
  line(ctx, x1, y1, x2, y2, col, Math.max(2.2, w * 1.4), []);
  // tête triangulaire au point de départ (le calame s'enfonce là)
  ctx.save();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + Math.cos(ang - 2.5) * headLen, y1 + Math.sin(ang - 2.5) * headLen);
  ctx.lineTo(x1 + Math.cos(ang + 2.5) * headLen, y1 + Math.sin(ang + 2.5) * headLen);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ---------- Chiffres sumériens (clou = 1, chevron = 10) ---------- */

function drawNumber(
  ctx: CanvasRenderingContext2D,
  tens: number,
  units: number,
  x: number,
  y: number,
  unit: number,
  pal: Scene['pal'],
) {
  // chevrons (dizaines) à gauche, clous (unités) à droite, en grille type tablette
  let px = x;
  const drawChevron = (cx: number, cy: number) => {
    const w = unit * 0.7;
    line(ctx, cx - w / 2, cy - w / 2, cx, cy + w / 2, pal.teal, Math.max(2, unit * 0.12));
    line(ctx, cx + w / 2, cy - w / 2, cx, cy + w / 2, pal.teal, Math.max(2, unit * 0.12));
  };
  const drawNail = (cx: number, cy: number) => {
    line(ctx, cx, cy - unit * 0.45, cx, cy + unit * 0.45, pal.blue, Math.max(2, unit * 0.12));
    // petite tête
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.moveTo(cx, cy - unit * 0.45);
    ctx.lineTo(cx - unit * 0.14, cy - unit * 0.6);
    ctx.lineTo(cx + unit * 0.14, cy - unit * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // dizaines : jusqu'à 3 par rangée
  for (let i = 0; i < tens; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    drawChevron(px + col * unit * 0.9, y + row * unit * 0.9);
  }
  const tensW = (Math.min(tens, 3) || 0) * unit * 0.9 + unit * 0.5;
  px += Math.max(tensW, tens > 0 ? unit : 0) + unit * 0.3;

  // unités : jusqu'à 3 par rangée
  for (let i = 0; i < units; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    drawNail(px + col * unit * 0.55, y + row * unit * 0.9);
  }
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selSigne = root.querySelector<HTMLSelectElement>('[data-signe]')!;
  const slEtape = root.querySelector<HTMLInputElement>('[data-etape]')!;
  const outEtape = root.querySelector<HTMLElement>('[data-out-etape]')!;
  const slJarres = root.querySelector<HTMLInputElement>('[data-jarres]')!;
  const slGrains = root.querySelector<HTMLInputElement>('[data-grains]')!;
  const outJarres = root.querySelector<HTMLElement>('[data-out-jarres]')!;
  const outGrains = root.querySelector<HTMLElement>('[data-out-grains]')!;
  const outPhase = root.querySelector<HTMLElement>('[data-out-phase]')!;
  const outCompte = root.querySelector<HTMLElement>('[data-out-compte]')!;
  const outLecture = root.querySelector<HTMLElement>('[data-out-lecture]')!;

  let signe = selSigne.value as SigneId;
  let etape = parseInt(slEtape.value, 10);
  let tens = parseInt(slJarres.value, 10);
  let units = parseInt(slGrains.value, 10);

  const scene = createScene(canvas, draw);

  function refresh() {
    outEtape.textContent = PHASES[etape];
    outJarres.textContent = String(tens);
    outGrains.textContent = String(units);

    const info = SIGNES[signe];
    outPhase.textContent =
      etape === 0
        ? `dessin : ${info.nom}`
        : etape === 1
          ? 'tourné de 90°'
          : etape === 2
            ? `signe « ${info.translit} »`
            : `son ${info.phon}`;

    const total = tens * 10 + units;
    outCompte.textContent = `${tens} chevrons + ${units} clous`;
    outLecture.textContent = `${total} mesures (sexagésimal)`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // Fond « tablette d'argile » discret.
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = pal.surface;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Séparation haut (évolution du signe) / bas (comptabilité).
    const midY = H * 0.56;
    line(ctx, W * 0.04, midY, W * 0.96, midY, pal.border, 1, [4, 4]);

    /* ----- Bande haute : évolution du signe en 4 vignettes ----- */
    const info = SIGNES[signe];
    text(ctx, `Évolution du signe « ${info.nom} »`, W * 0.04, 16, {
      color: pal.muted,
      size: 12,
      weight: 700,
      baseline: 'top',
    });
    const cellW = (W * 0.92) / 4;
    const cellY = midY * 0.55;
    const sz = Math.min(cellW * 0.5, midY * 0.4);
    for (let p = 0; p < 4; p++) {
      const cx = W * 0.04 + cellW * (p + 0.5);
      const active = p === etape;
      // cadre de vignette
      ctx.save();
      ctx.globalAlpha = active ? 0.16 : 0.05;
      ctx.fillStyle = active ? pal.yellow : pal.text;
      ctx.fillRect(cx - cellW * 0.42, cellY - sz * 0.95, cellW * 0.84, sz * 1.9);
      ctx.restore();
      if (active) {
        ctx.strokeStyle = pal.yellow;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - cellW * 0.42, cellY - sz * 0.95, cellW * 0.84, sz * 1.9);
      }
      drawSigne(ctx, signe, p, cx, cellY, sz, pal);
      text(ctx, PHASES[p], cx, cellY + sz * 1.15, {
        color: active ? pal.yellow : pal.muted,
        size: 10.5,
        align: 'center',
        weight: active ? 700 : 500,
        baseline: 'top',
      });
      if (p < 3) {
        text(ctx, '→', cx + cellW * 0.5, cellY, {
          color: pal.muted,
          size: 18,
          align: 'center',
          baseline: 'middle',
        });
      }
    }
    if (etape >= 3) {
      text(ctx, info.rebus, W * 0.5, midY - 10, {
        color: pal.yellow,
        size: 11.5,
        align: 'center',
        baseline: 'bottom',
        italic: true,
      });
    }

    /* ----- Bande basse : le compte du scribe ----- */
    text(ctx, 'Atelier du scribe : compte de jarres', W * 0.04, midY + 12, {
      color: pal.muted,
      size: 12,
      weight: 700,
      baseline: 'top',
    });
    const numY = midY + (H - midY) * 0.55;
    const unit = Math.min((H - midY) * 0.3, 30);
    drawNumber(ctx, tens, units, W * 0.07, numY, unit, pal);

    const total = tens * 10 + units;
    text(ctx, `= ${total}`, W * 0.62, numY, {
      color: pal.text,
      size: 22,
      weight: 800,
      align: 'left',
      baseline: 'middle',
    });
    text(ctx, 'jarres comptées', W * 0.62, numY + unit * 0.9, {
      color: pal.muted,
      size: 11,
      baseline: 'middle',
    });

    // mini-légende des chiffres
    const lx = W * 0.84;
    line(ctx, lx, numY - 8, lx, numY + 8, pal.blue, 2.5);
    text(ctx, '= 1', lx + 8, numY - 6, { color: pal.blue, size: 11, weight: 700, baseline: 'middle' });
    line(ctx, lx - 6, numY + unit * 0.7, lx, numY + unit * 0.95, pal.teal, 2.5);
    line(ctx, lx + 6, numY + unit * 0.7, lx, numY + unit * 0.95, pal.teal, 2.5);
    text(ctx, '= 10', lx + 10, numY + unit * 0.85, { color: pal.teal, size: 11, weight: 700, baseline: 'middle' });
  }

  selSigne.addEventListener('change', () => {
    signe = selSigne.value as SigneId;
    refresh();
    scene.requestDraw();
  });
  slEtape.addEventListener('input', () => {
    etape = clamp(parseInt(slEtape.value, 10), 0, 3);
    refresh();
    scene.requestDraw();
  });
  slJarres.addEventListener('input', () => {
    tens = parseInt(slJarres.value, 10);
    refresh();
    scene.requestDraw();
  });
  slGrains.addEventListener('input', () => {
    units = parseInt(slGrains.value, 10);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="cune-puzzle"]').forEach(init);
