import { createScene, line, text, circle, fmt, clamp, map, type Scene } from './_canvas';

type Materiau = 'isolant' | 'semiconducteur' | 'conducteur';

interface MatInfo {
  eg: number; // largeur du gap en eV (négatif = chevauchement)
  label: string;
}

const MATERIAUX: Record<Materiau, MatInfo> = {
  isolant: { eg: 5, label: 'isolant' },
  semiconducteur: { eg: 1.1, label: 'semiconducteur' },
  conducteur: { eg: -0.6, label: 'conducteur' }, // bandes qui se chevauchent
};

const N_SAUTS_MAX = 6; // nombre maximal d'électrons qui sautent (semiconducteur)

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selMat = root.querySelector<HTMLSelectElement>('[data-mat]')!;
  const sTemp = root.querySelector<HTMLInputElement>('[data-temp]')!;
  const outTemp = root.querySelector<HTMLElement>('[data-out-temp]')!;
  const outEg = root.querySelector<HTMLElement>('[data-out-eg]')!;
  const outCond = root.querySelector<HTMLElement>('[data-out-cond]')!;

  let mat = selMat.value as Materiau;
  let temp = parseFloat(sTemp.value); // 0..100

  const scene = createScene(canvas, draw);

  // Nombre d'électrons qui ont sauté thermiquement vers la conduction.
  function nSauts(): number {
    if (mat !== 'semiconducteur') return 0;
    return Math.round(map(clamp(temp, 0, 100), 0, 100, 0, N_SAUTS_MAX));
  }

  // Le solide conduit-il du courant ?
  function conduit(): boolean {
    if (mat === 'conducteur') return true;
    if (mat === 'isolant') return false;
    return nSauts() > 0; // semiconducteur : seulement si des électrons ont sauté
  }

  function refresh() {
    outTemp.textContent = fmt(temp, 0);
    const eg = MATERIAUX[mat].eg;
    outEg.textContent = eg <= 0 ? '0 eV (chevauchement)' : `${fmt(eg, eg < 2 ? 1 : 0)} eV`;
    const c = conduit();
    outCond.textContent = c ? 'oui' : 'non';
    outCond.style.color = c ? 'var(--c-green)' : 'var(--c-red)';
    sTemp.disabled = mat === 'isolant' || mat === 'conducteur';
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) {
    const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
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

    const eg = MATERIAUX[mat].eg;
    const overlap = eg <= 0;

    // --- géométrie générale ---
    const axX = 0.10 * W; // axe vertical d'énergie
    const top = 0.10 * H;
    const bot = 0.90 * H;
    const bandX = 0.20 * W;
    const bandW = 0.62 * W;

    // Axe vertical : énergie
    line(ctx, axX, bot, axX, top - 6, pal.muted, 2);
    // tête de flèche
    ctx.fillStyle = pal.muted;
    ctx.beginPath();
    ctx.moveTo(axX, top - 14);
    ctx.lineTo(axX - 5, top - 4);
    ctx.lineTo(axX + 5, top - 4);
    ctx.closePath();
    ctx.fill();
    text(ctx, 'énergie', axX - 6, top - 2, { color: pal.muted, size: 12, align: 'right', weight: 600 });

    // Hauteur fixe d'une bande, et hauteur du gap proportionnelle à |Eg|.
    const bandH = 0.16 * H;
    // Echelle : 5 eV de gap occupe une bonne portion de la hauteur.
    const gapPx = overlap ? 0 : clamp(map(eg, 0, 5, 0.04 * H, 0.40 * H), 0.04 * H, 0.40 * H);
    const overlapPx = overlap ? clamp(map(-eg, 0, 0.6, 0, 0.10 * H), 0, 0.10 * H) : 0;

    // Position verticale : on centre l'ensemble (valence + gap + conduction).
    const totalH = bandH * 2 + gapPx - overlapPx;
    const startY = (top + bot) / 2 - totalH / 2;

    const condY = startY; // haut de la bande de conduction
    const valY = startY + bandH + gapPx - overlapPx; // haut de la bande de valence

    const condTop = condY;
    const condBot = condY + bandH;
    const valTop = valY;
    const valBot = valY + bandH;

    // --- Bande de conduction (haute, vide) ---
    ctx.save();
    ctx.fillStyle = pal.surface;
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.5;
    roundRect(ctx, bandX, condTop, bandW, bandH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, 'bande de conduction', bandX + bandW / 2, condTop + bandH / 2 + 4, {
      color: pal.muted,
      size: 13,
      align: 'center',
      weight: 600,
    });
    text(ctx, '(vide)', bandX + bandW + 10, condTop + bandH / 2 + 4, {
      color: pal.muted,
      size: 11,
      align: 'left',
    });

    // --- Bande de valence (basse, remplie) ---
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.22;
    roundRect(ctx, bandX, valTop, bandW, bandH, 6);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.5;
    roundRect(ctx, bandX, valTop, bandW, bandH, 6);
    ctx.stroke();
    ctx.restore();
    text(ctx, 'bande de valence', bandX + bandW / 2, valBot - 8, {
      color: pal.blue,
      size: 13,
      align: 'center',
      weight: 600,
    });
    text(ctx, '(remplie)', bandX + bandW + 10, valTop + bandH / 2 + 4, {
      color: pal.blue,
      size: 11,
      align: 'left',
    });

    // --- électrons de la bande de valence (points bleus) ---
    const nDots = 9;
    const ne = nSauts();
    const dotY = valTop + bandH / 2;
    // Indices des électrons qui ont sauté (on en retire de la valence).
    const sautes: number[] = [];
    for (let i = 0; i < ne; i++) {
      // répartis pour rester visibles
      sautes.push(Math.round(map(i, 0, Math.max(1, ne - 1), 1, nDots - 2)));
    }
    for (let i = 0; i < nDots; i++) {
      const dx = bandX + map(i, 0, nDots - 1, 0.10, 0.90) * bandW;
      if (sautes.includes(i)) {
        // trou laissé dans la valence (cercle rouge ouvert)
        circle(ctx, dx, dotY, 4.5, undefined, pal.red, 2);
      } else {
        circle(ctx, dx, dotY, 4.5, pal.blue);
      }
    }

    // --- électrons ayant sauté vers la conduction ---
    const condDotY = condTop + bandH / 2;
    for (let i = 0; i < ne; i++) {
      const srcIdx = sautes[i];
      const dx = bandX + map(srcIdx, 0, nDots - 1, 0.10, 0.90) * bandW;
      circle(ctx, dx, condDotY, 4.5, pal.blue);
      // flèche de saut (valence → conduction)
      ctx.save();
      ctx.strokeStyle = pal.yellow;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(dx, dotY - 6);
      ctx.lineTo(dx, condDotY + 6);
      ctx.stroke();
      ctx.restore();
    }

    // --- Bande interdite (gap) ---
    if (!overlap) {
      // hachures légères dans la zone interdite
      ctx.save();
      ctx.beginPath();
      ctx.rect(bandX, condBot, bandW, gapPx);
      ctx.clip();
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 1;
      const step = 12;
      for (let x = bandX - gapPx; x < bandX + bandW; x += step) {
        line(ctx, x, condBot + gapPx, x + gapPx, condBot, pal.border, 1);
      }
      ctx.restore();

      // cotation Eg à gauche du bloc de bandes
      const cotX = bandX - 0.045 * W;
      line(ctx, cotX, condBot, cotX, valTop, pal.text, 1.4);
      line(ctx, cotX - 5, condBot, cotX + 5, condBot, pal.text, 1.4);
      line(ctx, cotX - 5, valTop, cotX + 5, valTop, pal.text, 1.4);
      // pointillés de raccord vers les bandes
      line(ctx, cotX, condBot, bandX, condBot, pal.muted, 1, [3, 3]);
      line(ctx, cotX, valTop, bandX, valTop, pal.muted, 1, [3, 3]);

      const egTxt =
        mat === 'isolant'
          ? `Eg ≈ ${fmt(eg, 0)} eV`
          : `Eg ≈ ${fmt(eg, 1)} eV`;
      text(ctx, egTxt, cotX - 8, (condBot + valTop) / 2 + 4, {
        color: pal.text,
        size: 13,
        align: 'right',
        weight: 700,
      });
      text(ctx, 'bande interdite', bandX + bandW / 2, (condBot + valTop) / 2 + 4, {
        color: pal.muted,
        size: 11,
        align: 'center',
        italic: true,
      });
    } else {
      // chevauchement : on signale qu'il n'y a pas de gap
      text(ctx, 'pas de gap : bandes qui se chevauchent', bandX + bandW / 2, (condBot + valTop) / 2 + 4, {
        color: pal.green,
        size: 12,
        align: 'center',
        italic: true,
      });
    }

    // --- bandeau d'état (haut droite) ---
    const c = conduit();
    text(ctx, MATERIAUX[mat].label.toUpperCase(), W - 14, 22, {
      color: pal.text,
      size: 14,
      align: 'right',
      weight: 800,
    });
    text(ctx, c ? 'CONDUIT' : 'NE CONDUIT PAS', W - 14, 42, {
      color: c ? pal.green : pal.red,
      size: 13,
      align: 'right',
      weight: 700,
    });
    if (mat === 'semiconducteur') {
      text(ctx, `T = ${fmt(temp, 0)} — ${ne} saut${ne > 1 ? 's' : ''}`, W - 14, 60, {
        color: pal.muted,
        size: 11,
        align: 'right',
      });
    }
  }

  selMat.addEventListener('change', () => {
    mat = selMat.value as Materiau;
    refresh();
    scene.requestDraw();
  });
  sTemp.addEventListener('input', () => {
    temp = parseFloat(sTemp.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="energy-bands"]').forEach(init);
