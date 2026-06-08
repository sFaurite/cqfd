import { createScene, line, arrow, text, clamp, type Scene } from './_canvas';

/**
 * Traduction d'adresse par pagination.
 *
 * Implémentation fixée (pédagogique) :
 *   - 8 pages virtuelles (numéro de page sur 3 bits) ;
 *   - taille de page = 256 octets (déplacement sur 8 bits) ;
 *   - mémoire physique = 8 cadres (numérotés 0..7).
 *
 * La table des pages associe chaque page virtuelle à un cadre physique, ou
 * marque la page « absente » (non chargée en mémoire → défaut de page).
 */

const N_PAGES = 8;
const PAGE_SIZE = 256; // octets par page (taille fixée par l'implémentation)

/** Entrée de la table des pages : un cadre physique, ou « absente ». */
interface PageEntry {
  frame: number | null; // null = page absente (défaut de page)
}

// Table des pages : volontairement non triviale (les cadres ne suivent pas les
// pages), avec deux pages absentes pour illustrer le défaut de page.
const TABLE: PageEntry[] = [
  { frame: 5 }, // page 0 → cadre 5
  { frame: 2 }, // page 1 → cadre 2
  { frame: 7 }, // page 2 → cadre 7
  { frame: null }, // page 3 → ABSENTE
  { frame: 0 }, // page 4 → cadre 0
  { frame: 3 }, // page 5 → cadre 3
  { frame: null }, // page 6 → ABSENTE
  { frame: 6 }, // page 7 → cadre 6
];

/** Helper local : rectangle à coins arrondis (aucun fourni par la boîte à outils). */
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

/** Couleur de la charte (#hex) avec transparence. */
function withAlpha(hex: string, a: number): string {
  const h = hex.replace('#', '').trim();
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${clamp(a, 0, 1)})`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sPage = root.querySelector<HTMLInputElement>('[data-page]')!;
  const sOff = root.querySelector<HTMLInputElement>('[data-off]')!;
  const outPage = root.querySelector<HTMLElement>('[data-out-page]')!;
  const outOff = root.querySelector<HTMLElement>('[data-out-off]')!;
  const outVa = root.querySelector<HTMLElement>('[data-out-va]')!;
  const outFrame = root.querySelector<HTMLElement>('[data-out-frame]')!;
  const outPa = root.querySelector<HTMLElement>('[data-out-pa]')!;

  let page = parseInt(sPage.value, 10);
  let off = parseInt(sOff.value, 10);

  const scene = createScene(canvas, draw);

  /** Adresse virtuelle = page * taille_page + déplacement. */
  function virtualAddr(): number {
    return page * PAGE_SIZE + off;
  }

  function refresh() {
    outPage.textContent = String(page);
    outOff.textContent = String(off);

    const va = virtualAddr();
    outVa.textContent = `${va} (page ${page}, dépl. ${off})`;

    const entry = TABLE[page];
    if (entry.frame === null) {
      outFrame.textContent = 'aucun (page absente)';
      outFrame.style.color = 'var(--c-red)';
      outPa.textContent = 'DÉFAUT DE PAGE';
      outPa.style.color = 'var(--c-red)';
    } else {
      const pa = entry.frame * PAGE_SIZE + off;
      outFrame.textContent = `cadre ${entry.frame}`;
      outFrame.style.color = 'var(--c-teal)';
      outPa.textContent = `${pa} (cadre ${entry.frame}, dépl. ${off})`;
      outPa.style.color = 'var(--c-green)';
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const entry = TABLE[page];
    const fault = entry.frame === null;

    // --- Découpage horizontal en trois colonnes ---
    const colVaX = 0.04 * W;
    const colVaW = 0.24 * W;
    const colTabX = 0.38 * W;
    const colTabW = 0.24 * W;
    const colMemX = 0.74 * W;
    const colMemW = 0.22 * W;

    const topTitle = 0.06 * H;

    // Titres de colonnes.
    text(ctx, 'ADRESSE VIRTUELLE', colVaX + colVaW / 2, topTitle, {
      color: pal.text, size: 12, align: 'center', weight: 800,
    });
    text(ctx, 'TABLE DES PAGES', colTabX + colTabW / 2, topTitle, {
      color: pal.purple, size: 12, align: 'center', weight: 800,
    });
    text(ctx, 'MÉMOIRE PHYSIQUE', colMemX + colMemW / 2, topTitle, {
      color: pal.teal, size: 12, align: 'center', weight: 800,
    });

    /* =========================================================
       1) Adresse virtuelle décomposée : [ page | déplacement ]
       ========================================================= */
    const vaTop = 0.16 * H;
    const vaH = 0.16 * H;
    const pageW = colVaW * 0.42;
    const offW = colVaW - pageW;
    const pagePartX = colVaX;
    const offPartX = colVaX + pageW;

    // Champ « numéro de page ».
    ctx.save();
    ctx.fillStyle = withAlpha(pal.blue, 0.18);
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    roundRect(ctx, pagePartX, vaTop, pageW, vaH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, String(page), pagePartX + pageW / 2, vaTop + vaH / 2 + 8, {
      color: pal.blue, size: 24, align: 'center', weight: 800,
    });
    text(ctx, 'n° page', pagePartX + pageW / 2, vaTop - 8, {
      color: pal.blue, size: 11, align: 'center', weight: 700,
    });
    text(ctx, '(3 bits)', pagePartX + pageW / 2, vaTop + vaH + 16, {
      color: pal.muted, size: 10, align: 'center',
    });

    // Champ « déplacement ».
    ctx.save();
    ctx.fillStyle = withAlpha(pal.yellow, 0.18);
    ctx.strokeStyle = pal.yellow;
    ctx.lineWidth = 2;
    roundRect(ctx, offPartX, vaTop, offW, vaH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, String(off), offPartX + offW / 2, vaTop + vaH / 2 + 8, {
      color: pal.yellow, size: 24, align: 'center', weight: 800,
    });
    text(ctx, 'déplacement', offPartX + offW / 2, vaTop - 8, {
      color: pal.yellow, size: 11, align: 'center', weight: 700,
    });
    text(ctx, '(8 bits)', offPartX + offW / 2, vaTop + vaH + 16, {
      color: pal.muted, size: 10, align: 'center',
    });

    // Valeur de l'adresse virtuelle complète.
    const va = virtualAddr();
    text(ctx, `adresse virtuelle = ${va}`, colVaX + colVaW / 2, vaTop + vaH + 42, {
      color: pal.text, size: 12, align: 'center', weight: 700,
    });
    text(ctx, `= ${page} × ${PAGE_SIZE} + ${off}`, colVaX + colVaW / 2, vaTop + vaH + 62, {
      color: pal.muted, size: 11, align: 'center',
    });

    /* =========================================================
       2) Table des pages (8 entrées : page → cadre / absente)
       ========================================================= */
    const tabTop = 0.16 * H;
    const tabH = 0.74 * H;
    const rowH = tabH / N_PAGES;
    const rowYAt = (i: number) => tabTop + i * rowH;
    const rowMidYAt = (i: number) => tabTop + (i + 0.5) * rowH;

    for (let i = 0; i < N_PAGES; i++) {
      const e = TABLE[i];
      const absent = e.frame === null;
      const sel = i === page;
      const y = rowYAt(i);

      ctx.save();
      ctx.fillStyle = sel ? withAlpha(pal.purple, 0.22) : pal.surface;
      ctx.strokeStyle = sel ? (absent ? pal.red : pal.purple) : pal.border;
      ctx.lineWidth = sel ? 2.6 : 1.2;
      roundRect(ctx, colTabX, y + 2, colTabW, rowH - 4, 5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Numéro de page virtuelle (clé) à gauche.
      text(ctx, `p${i}`, colTabX + 12, rowMidYAt(i) + 4, {
        color: sel ? pal.blue : pal.muted, size: 13, align: 'left', weight: 800,
      });
      // Flèche interne clé → valeur.
      text(ctx, '→', colTabX + colTabW * 0.42, rowMidYAt(i) + 4, {
        color: pal.muted, size: 12, align: 'center',
      });
      // Valeur : cadre ou « absente ».
      if (absent) {
        text(ctx, 'absente', colTabX + colTabW - 12, rowMidYAt(i) + 4, {
          color: sel ? pal.red : withAlpha(pal.red, 0.75), size: 12, align: 'right', weight: 700,
        });
      } else {
        text(ctx, `cadre ${e.frame}`, colTabX + colTabW - 12, rowMidYAt(i) + 4, {
          color: sel ? pal.teal : pal.text, size: 12, align: 'right', weight: 700,
        });
      }
    }
    text(ctx, 'page virtuelle → cadre', colTabX + colTabW / 2, tabTop + tabH + 18, {
      color: pal.muted, size: 10, align: 'center',
    });

    /* =========================================================
       3) Mémoire physique : 8 cadres
       ========================================================= */
    const memTop = 0.16 * H;
    const memH = 0.74 * H;
    const fRowH = memH / N_PAGES;
    const frameYAt = (i: number) => memTop + i * fRowH;
    const frameMidYAt = (i: number) => memTop + (i + 0.5) * fRowH;
    const targetFrame = entry.frame;

    for (let i = 0; i < N_PAGES; i++) {
      const isTarget = !fault && targetFrame === i;
      const y = frameYAt(i);
      ctx.save();
      ctx.fillStyle = isTarget ? withAlpha(pal.teal, 0.22) : pal.surface;
      ctx.strokeStyle = isTarget ? pal.teal : pal.border;
      ctx.lineWidth = isTarget ? 2.6 : 1.2;
      roundRect(ctx, colMemX, y + 2, colMemW, fRowH - 4, 5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      text(ctx, `cadre ${i}`, colMemX + 10, frameMidYAt(i) + 4, {
        color: isTarget ? pal.teal : pal.muted, size: 12, align: 'left', weight: isTarget ? 800 : 600,
      });
      // Plage d'octets couverte par le cadre.
      text(ctx, `${i * PAGE_SIZE}–${i * PAGE_SIZE + PAGE_SIZE - 1}`, colMemX + colMemW - 10, frameMidYAt(i) + 4, {
        color: pal.muted, size: 9, align: 'right',
      });
    }
    text(ctx, `${N_PAGES} cadres de ${PAGE_SIZE} octets`, colMemX + colMemW / 2, memTop + memH + 18, {
      color: pal.muted, size: 10, align: 'center',
    });

    /* =========================================================
       Flèches de traduction
       ========================================================= */
    // a) page virtuelle (champ bleu) → entrée de table sélectionnée.
    const fromPageX = pagePartX + pageW / 2;
    const fromPageY = vaTop + vaH;
    const tabEntryY = rowMidYAt(page);
    arrow(
      ctx,
      fromPageX, fromPageY + 4,
      colTabX - 6, tabEntryY,
      pal.blue, 2.4, 9,
    );
    text(ctx, 'n° page', (fromPageX + colTabX) / 2, (fromPageY + tabEntryY) / 2 - 8, {
      color: pal.blue, size: 10, align: 'center', italic: true,
    });

    if (!fault && targetFrame !== null) {
      // b) entrée de table → cadre physique correspondant.
      const tableRightX = colTabX + colTabW;
      const frameLeftX = colMemX;
      const frameY = frameMidYAt(targetFrame);
      arrow(
        ctx,
        tableRightX + 6, tabEntryY,
        frameLeftX - 6, frameY,
        pal.teal, 2.4, 9,
      );
      text(ctx, 'cadre', (tableRightX + frameLeftX) / 2, (tabEntryY + frameY) / 2 - 8, {
        color: pal.teal, size: 10, align: 'center', italic: true,
      });

      // c) cadre + déplacement → adresse physique (résultat en bas à droite).
      const pa = targetFrame * PAGE_SIZE + off;
      const resY = memTop + memH + 44;
      // Le déplacement (jaune) est réutilisé tel quel.
      const fromOffX = offPartX + offW / 2;
      const fromOffY = vaTop + vaH + 70;
      line(
        ctx,
        fromOffX, fromOffY,
        colMemX + colMemW / 2, resY - 12,
        withAlpha(pal.yellow, 0.7), 1.8, [5, 4],
      );
      text(ctx, 'déplacement inchangé', (fromOffX + colMemX + colMemW / 2) / 2, fromOffY + 18, {
        color: pal.yellow, size: 9, align: 'center', italic: true,
      });

      // Bandeau résultat : adresse physique.
      ctx.save();
      ctx.fillStyle = withAlpha(pal.green, 0.16);
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 2;
      const boxW = colMemW + 0.06 * W;
      const boxX = colMemX + colMemW / 2 - boxW / 2;
      roundRect(ctx, boxX, resY - 2, boxW, 0.1 * H, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      text(ctx, 'ADRESSE PHYSIQUE', colMemX + colMemW / 2, resY + 16, {
        color: pal.green, size: 11, align: 'center', weight: 800,
      });
      text(ctx, String(pa), colMemX + colMemW / 2, resY + 38, {
        color: pal.green, size: 20, align: 'center', weight: 800,
      });
      text(ctx, `= ${targetFrame} × ${PAGE_SIZE} + ${off}`, colMemX + colMemW / 2, resY + 56, {
        color: pal.muted, size: 10, align: 'center',
      });
    } else {
      // Défaut de page : message d'erreur bien visible.
      const tableRightX = colTabX + colTabW;
      // Croix rouge depuis l'entrée absente.
      const cx = (tableRightX + colMemX) / 2;
      const cy = tabEntryY;
      line(ctx, tableRightX + 6, tabEntryY, cx + 10, cy, pal.red, 2.4);
      ctx.save();
      ctx.strokeStyle = pal.red;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      const r = 9;
      ctx.beginPath();
      ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r);
      ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r);
      ctx.stroke();
      ctx.restore();

      const resY = memTop + memH * 0.36;
      ctx.save();
      ctx.fillStyle = withAlpha(pal.red, 0.16);
      ctx.strokeStyle = pal.red;
      ctx.lineWidth = 2.4;
      const boxW = colMemW + 0.04 * W;
      const boxX = colMemX + colMemW / 2 - boxW / 2;
      roundRect(ctx, boxX, resY, boxW, 0.2 * H, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      text(ctx, 'DÉFAUT', colMemX + colMemW / 2, resY + 0.07 * H, {
        color: pal.red, size: 18, align: 'center', weight: 800,
      });
      text(ctx, 'DE PAGE', colMemX + colMemW / 2, resY + 0.07 * H + 22, {
        color: pal.red, size: 18, align: 'center', weight: 800,
      });
      text(ctx, 'page absente : le noyau', colMemX + colMemW / 2, resY + 0.07 * H + 48, {
        color: pal.muted, size: 10, align: 'center',
      });
      text(ctx, 'doit la charger du disque', colMemX + colMemW / 2, resY + 0.07 * H + 62, {
        color: pal.muted, size: 10, align: 'center',
      });
    }
  }

  sPage.addEventListener('input', () => {
    page = parseInt(sPage.value, 10);
    refresh();
    scene.requestDraw();
  });
  sOff.addEventListener('input', () => {
    off = parseInt(sOff.value, 10);
    refresh();
    scene.requestDraw();
  });

  refresh();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="virtual-memory"]').forEach(init);
