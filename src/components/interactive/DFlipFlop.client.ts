import { createScene, line, arrow, text, prefersReducedMotion, type Scene } from './_canvas';

/** Nombre de cycles visibles dans la fenêtre du chronogramme. */
const VISIBLE = 10;

interface CycleSample {
  /** numéro de cycle (n° du front qui l'a produit) */
  t: number;
  /** valeur de D échantillonnée au front montant de ce cycle */
  d: 0 | 1;
  /** valeur de Q durant ce cycle (= D au moment du front) */
  q: 0 | 1;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnTick = root.querySelector<HTMLButtonElement>('[data-tick]')!;
  const btnD = root.querySelector<HTMLButtonElement>('[data-d]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const outD = root.querySelector<HTMLElement>('[data-out-d]')!;
  const outQ = root.querySelector<HTMLElement>('[data-out-q]')!;
  const outT = root.querySelector<HTMLElement>('[data-out-t]')!;

  const reduce = prefersReducedMotion();

  // État courant de la bascule.
  let d: 0 | 1 = 0; // entrée actuelle (modifiable à tout instant)
  let q: 0 | 1 = 0; // sortie actuelle (ne change qu'au front montant)
  let t = 0; // nombre de fronts montants survenus (n° de cycle)
  // Historique des cycles passés (un échantillon par front montant).
  let history: CycleSample[] = [];
  // Animation de défilement : 0 → 1 fait glisser le chronogramme d'un cycle.
  let shift = 0;
  let raf = 0;

  const scene = createScene(canvas, draw);

  function refresh() {
    outD.textContent = String(d);
    outQ.textContent = String(q);
    outT.textContent = String(t);
    // Couleurs cohérentes avec le tracé.
    outD.style.color = d === 1 ? 'var(--c-yellow)' : 'var(--c-muted)';
    outQ.style.color = q === 1 ? 'var(--c-green)' : 'var(--c-muted)';
  }

  function reset() {
    d = 0;
    q = 0;
    t = 0;
    history = [];
    shift = 0;
    refresh();
    scene.requestDraw();
  }

  /** Déclenche un front montant : on échantillonne D → Q, on archive le cycle. */
  function tick() {
    q = d; // recopie synchrone : Q ← D au front montant
    t += 1;
    history.push({ t, d, q });
    if (history.length > VISIBLE) history.shift();
    refresh();
    startShift();
  }

  function toggleD() {
    d = d === 1 ? 0 : 1;
    refresh();
    scene.requestDraw();
  }

  function startShift() {
    if (reduce) {
      shift = 0;
      scene.requestDraw();
      return;
    }
    shift = 1; // part « décalé » et revient à 0 (effet de glissement vers la gauche)
    kick();
  }

  function animate() {
    shift -= 0.08;
    if (shift <= 0) {
      shift = 0;
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

  /** Décor d'une piste : étiquette à gauche + lignes de niveau 0/1. */
  function trackFrame(
    s: Scene,
    label: string,
    accent: string,
    yTop: number,
    yBot: number,
    plotL: number,
    plotR: number,
  ) {
    const { ctx, pal } = s;
    text(ctx, label, plotL - 12, (yTop + yBot) / 2 + 5, {
      color: accent,
      size: 15,
      align: 'right',
      weight: 800,
    });
    text(ctx, '1', plotL - 12, yTop + 4, { color: pal.muted, size: 10, align: 'right' });
    text(ctx, '0', plotL - 12, yBot + 4, { color: pal.muted, size: 10, align: 'right' });
    line(ctx, plotL, yBot, plotR, yBot, pal.grid, 1);
    line(ctx, plotL, yTop, plotR, yTop, pal.grid, 1);
  }

  /** Trace une piste de données (suite de 0/1) en signal créneau (escalier). */
  function drawTrack(
    s: Scene,
    label: string,
    accent: string,
    yTop: number,
    yBot: number,
    valueAt: (slot: number) => 0 | 1,
    plotL: number,
    plotR: number,
    slotW: number,
    nSlots: number,
    offset: number,
  ) {
    const { ctx } = s;
    const yLevel = (v: 0 | 1) => (v === 1 ? yTop : yBot);

    trackFrame(s, label, accent, yTop, yBot, plotL, plotR);

    // construction du tracé en escalier, décalé de `offset` pixels (défilement)
    ctx.save();
    ctx.beginPath();
    ctx.rect(plotL, yTop - 6, plotR - plotL, yBot - yTop + 12);
    ctx.clip();

    ctx.beginPath();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = accent;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    let started = false;
    let prevV: 0 | 1 = 0;
    for (let i = 0; i <= nSlots; i++) {
      const v = valueAt(i);
      const x = plotL + i * slotW - offset;
      const y = yLevel(v);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        // transition verticale au changement de valeur, puis palier horizontal
        if (v !== prevV) ctx.lineTo(x, yLevel(prevV));
        ctx.lineTo(x, y);
      }
      const xEnd = plotL + (i + 1) * slotW - offset;
      ctx.lineTo(xEnd, y);
      prevV = v;
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // ----- Schéma-bloc de la bascule (bande supérieure) -----
    const boxW = 0.16 * W;
    const boxH = 0.20 * H;
    const boxX = 0.40 * W;
    const boxY = 0.05 * H;

    // corps de la bascule
    ctx.save();
    ctx.fillStyle = pal.surface;
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.6;
    roundRect(ctx, boxX, boxY, boxW, boxH, 7);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, 'bascule D', boxX + boxW / 2, boxY - 8, {
      color: pal.muted,
      size: 12,
      align: 'center',
      weight: 600,
    });

    // entrée D (à gauche, en haut)
    const dY = boxY + boxH * 0.32;
    const dCol = d === 1 ? pal.yellow : pal.muted;
    arrow(ctx, boxX - 0.13 * W, dY, boxX, dY, dCol, 2.2, 8);
    text(ctx, 'D', boxX - 0.13 * W - 6, dY + 5, {
      color: dCol,
      size: 14,
      align: 'right',
      weight: 800,
    });
    text(ctx, String(d), boxX + 8, dY + 5, { color: dCol, size: 13, align: 'left', weight: 800 });

    // entrée horloge (à gauche, en bas) — petit triangle « front-déclenché »
    const ckY = boxY + boxH * 0.72;
    line(ctx, boxX - 0.13 * W, ckY, boxX, ckY, pal.blue, 2.2);
    text(ctx, 'CLK', boxX - 0.13 * W - 6, ckY + 5, {
      color: pal.blue,
      size: 13,
      align: 'right',
      weight: 800,
    });
    // symbole de déclenchement sur front (petit chevron interne)
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(boxX + 2, ckY - 6);
    ctx.lineTo(boxX + 12, ckY);
    ctx.lineTo(boxX + 2, ckY + 6);
    ctx.stroke();
    ctx.restore();

    // sortie Q (à droite)
    const qY = boxY + boxH * 0.5;
    const qCol = q === 1 ? pal.green : pal.muted;
    arrow(ctx, boxX + boxW, qY, boxX + boxW + 0.13 * W, qY, qCol, 2.2, 8);
    text(ctx, 'Q', boxX + boxW + 0.13 * W + 6, qY + 5, {
      color: qCol,
      size: 14,
      align: 'left',
      weight: 800,
    });
    text(ctx, String(q), boxX + boxW - 8, qY + 5, {
      color: qCol,
      size: 13,
      align: 'right',
      weight: 800,
    });

    // règle de fonctionnement, à droite du schéma
    text(ctx, 'au front montant : Q ← D', boxX + boxW + 0.16 * W, qY - 10, {
      color: pal.text,
      size: 12,
      align: 'left',
      weight: 600,
    });
    text(ctx, 'entre deux fronts : Q figé', boxX + boxW + 0.16 * W, qY + 10, {
      color: pal.muted,
      size: 12,
      align: 'left',
    });

    // ----- Chronogramme (trois pistes empilées) -----
    const plotL = 0.10 * W;
    const plotR = 0.97 * W;
    const plotTop = 0.36 * H;
    const plotBot = 0.94 * H;
    const trackGap = 0.04 * H;
    const trackH = (plotBot - plotTop - 2 * trackGap) / 3;
    const ampl = trackH * 0.62; // amplitude utile (réserve pour les étiquettes)

    // Nombre de créneaux affichés : on dessine VISIBLE cycles + une avance.
    const nSlots = VISIBLE;
    const slotW = (plotR - plotL) / nSlots;
    const offset = shift * slotW; // glissement vers la gauche pendant l'anim

    // Reconstitution des pistes D et Q à partir de l'historique.
    // L'historique contient jusqu'à VISIBLE échantillons (cycles passés). On les
    // cale à droite : le cycle le plus récent occupe le dernier créneau plein.
    const hist = history;
    const nHist = hist.length;
    // index de slot du premier cycle historique (aligné à droite).
    const firstSlot = nSlots - nHist;

    const sampleD = (slot: number): 0 | 1 => {
      // avant tout historique : niveau 0 (état initial)
      if (slot < firstSlot) return 0;
      const k = slot - firstSlot;
      if (k < nHist) return hist[k]!.d;
      // créneau « courant » (à venir) : valeur de D en cours de saisie
      return d;
    };
    const sampleQ = (slot: number): 0 | 1 => {
      if (slot < firstSlot) return 0;
      const k = slot - firstSlot;
      if (k < nHist) return hist[k]!.q;
      return q;
    };

    // Piste CLK : créneau périodique (haut sur la 1re moitié du slot, bas sur la
    // 2de). Le front montant — qui déclenche l'échantillonnage — tombe au début
    // de chaque slot.
    const clkTop = plotTop;
    const clkBot = clkTop + trackH;
    const clkHi = clkTop + (trackH - ampl) / 2;
    const clkLo = clkHi + ampl;
    trackFrame(s, 'CLK', pal.blue, clkHi, clkLo, plotL, plotR);
    drawClock(ctx, pal, plotL, plotR, clkHi, clkLo, slotW, nSlots, offset);

    // Piste D
    const dTop = clkBot + trackGap;
    const dBot = dTop + trackH;
    const dHi = dTop + (trackH - ampl) / 2;
    const dLo = dHi + ampl;
    drawTrack(s, 'D', pal.yellow, dHi, dLo, sampleD, plotL, plotR, slotW, nSlots, offset);

    // Piste Q
    const qTop = dBot + trackGap;
    const qBot = qTop + trackH;
    const qHi = qTop + (trackH - ampl) / 2;
    const qLo = qHi + ampl;
    drawTrack(s, 'Q', pal.green, qHi, qLo, sampleQ, plotL, plotR, slotW, nSlots, offset);
    void qBot;

    // Marqueurs de fronts montants : lignes pointillées verticales reliant
    // CLK ↓ jusqu'à Q, là où Q a échantillonné D.
    for (let k = 0; k < nHist; k++) {
      const slot = firstSlot + k;
      const x = plotL + slot * slotW - offset;
      if (x < plotL - 1) continue;
      line(ctx, x, clkHi - 4, x, qLo + 4, pal.purple, 1, [3, 4]);
    }
    // marqueur du front « à venir » (prochain clic) au début du créneau courant
    const nextSlot = firstSlot + nHist;
    if (nextSlot <= nSlots) {
      const xn = plotL + nextSlot * slotW - offset;
      line(ctx, xn, clkHi - 4, xn, qLo + 4, pal.border, 1, [2, 5]);
      text(ctx, 'prochain front', xn, clkHi - 8, {
        color: pal.muted,
        size: 10,
        align: 'center',
      });
    }

    // axe du temps + légende
    text(ctx, 'temps →', plotR, qLo + 18, { color: pal.muted, size: 11, align: 'right' });
  }

  /** Dessine le créneau d'horloge périodique (un cycle = un slot). */
  function drawClock(
    ctx: CanvasRenderingContext2D,
    pal: Scene['pal'],
    plotL: number,
    plotR: number,
    yHi: number,
    yLo: number,
    slotW: number,
    nSlots: number,
    offset: number,
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(plotL, yHi - 6, plotR - plotL, yLo - yHi + 12);
    ctx.clip();
    ctx.beginPath();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = pal.blue;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    let started = false;
    for (let i = 0; i <= nSlots; i++) {
      const x0 = plotL + i * slotW - offset;
      const xm = x0 + slotW / 2;
      const x1 = x0 + slotW;
      if (!started) {
        ctx.moveTo(x0, yLo);
        started = true;
      }
      // front montant au début du slot
      ctx.lineTo(x0, yHi);
      // palier haut jusqu'au milieu
      ctx.lineTo(xm, yHi);
      // front descendant
      ctx.lineTo(xm, yLo);
      // palier bas jusqu'à la fin du slot
      ctx.lineTo(x1, yLo);
    }
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  btnTick.addEventListener('click', tick);
  btnD.addEventListener('click', toggleD);
  btnReset.addEventListener('click', reset);

  // état de départ parlant : un historique court pré-rempli en cas de mouvement
  // réduit, sinon on démarre vide et l'utilisateur déclenche les fronts.
  if (reduce) {
    // séquence figée mais illustrative : D = 0,1,1,0,1 → Q recopie au front
    const seq: (0 | 1)[] = [0, 0, 1, 1, 0, 1, 1, 1, 0, 0];
    for (const v of seq) {
      d = v;
      tick();
    }
    d = 1;
    refresh();
    scene.requestDraw();
  } else {
    refresh();
  }
}

document.querySelectorAll<HTMLElement>('[data-iw="d-flip-flop"]').forEach(init);
