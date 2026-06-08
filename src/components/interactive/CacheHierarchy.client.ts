import { createScene, line, text, clamp, lerp, fmt, prefersReducedMotion, type Scene } from './_canvas';

/** Un niveau de la hiérarchie mémoire. */
interface Level {
  name: string;        // L1, L2, RAM
  latency: number;     // cycles
  slots: number;       // nombre de lignes mémorisables
  isRam: boolean;      // la RAM contient « tout » : jamais d'échec
  color: (p: Scene['pal']) => string;
}

const LEVELS: Level[] = [
  { name: 'L1', latency: 1, slots: 4, isRam: false, color: (p) => p.blue },
  { name: 'L2', latency: 10, slots: 8, isRam: false, color: (p) => p.teal },
  { name: 'RAM', latency: 100, slots: 0, isRam: true, color: (p) => p.purple },
];

const ADDR_SPACE = 64; // étendue des adresses possibles
const MAX_LAT = 100;   // latence de référence pour normaliser les barres

type Mode = 'local' | 'random';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sel = root.querySelector<HTMLSelectElement>('[data-mode]')!;
  const btn = root.querySelector<HTMLButtonElement>('[data-access]')!;
  const outAddr = root.querySelector<HTMLElement>('[data-out-addr]')!;
  const outNiveau = root.querySelector<HTMLElement>('[data-out-niveau]')!;
  const outLatence = root.querySelector<HTMLElement>('[data-out-latence]')!;
  const outTaux = root.querySelector<HTMLElement>('[data-out-taux]')!;

  const reduce = prefersReducedMotion();

  // Contenu des caches : pour chaque niveau non-RAM, la liste des adresses
  // présentes, la plus ancienne en tête (politique LRU).
  const cache: number[][] = LEVELS.map(() => []);

  let mode: Mode = sel.value === 'random' ? 'random' : 'local';
  let loopCounter = 0;     // pour les accès locaux : progression dans la boucle
  let totalAccess = 0;
  let totalHits = 0;       // succès = servi par un cache (pas la RAM)

  // Résultat du dernier accès (pour l'affichage statique et l'animation).
  let reqAddr = -1;        // adresse demandée
  let servedLevel = -1;    // index du niveau qui a servi (-1 = aucun encore)

  // État de l'animation : progression de la requête le long des niveaux.
  // phase 0..servedLevel = descente ; puis remontée de la ligne.
  let anim = 0;            // 0 → (servedLevel + 1) pendant la descente
  let phase: 'idle' | 'down' | 'up' = 'idle';
  let raf = 0;

  const scene = createScene(canvas, draw);

  /** Choisit la prochaine adresse selon le mode. */
  function nextAddress(): number {
    if (mode === 'local') {
      // Boucle serrée sur une petite fenêtre d'adresses : forte localité.
      const windowSize = 3;
      const base = (Math.floor(loopCounter / windowSize) * windowSize) % ADDR_SPACE;
      const addr = base + (loopCounter % windowSize);
      loopCounter++;
      return addr % ADDR_SPACE;
    }
    // Accès aléatoires : faible localité.
    return Math.floor(Math.random() * ADDR_SPACE);
  }

  /** Cherche l'adresse dans les caches ; renvoie l'index du niveau servant. */
  function lookup(addr: number): number {
    for (let i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].isRam) return i; // toujours présent en RAM
      if (cache[i].includes(addr)) return i;
    }
    return LEVELS.length - 1;
  }

  /** Insère l'adresse dans un cache (LRU : évince la plus ancienne si plein). */
  function insert(levelIdx: number, addr: number) {
    const lv = LEVELS[levelIdx];
    if (lv.isRam) return;
    const arr = cache[levelIdx];
    const at = arr.indexOf(addr);
    if (at !== -1) arr.splice(at, 1); // déjà là → on la rafraîchit (récente)
    arr.push(addr);                   // la plus récente en queue
    while (arr.length > lv.slots) arr.shift(); // évince la plus ancienne
  }

  /** Effectue un accès complet (mise à jour du modèle) puis lance l'animation. */
  function doAccess() {
    reqAddr = nextAddress();
    servedLevel = lookup(reqAddr);

    totalAccess++;
    if (!LEVELS[servedLevel].isRam) totalHits++;

    // Remontée de la ligne : on l'insère dans tous les caches au-dessus du
    // niveau servant (et dans le servant lui-même s'il s'agit d'un cache).
    for (let i = 0; i <= servedLevel; i++) insert(i, reqAddr);

    refresh();
    startAnim();
  }

  function refresh() {
    if (reqAddr < 0) {
      outAddr.textContent = '—';
      outNiveau.textContent = '—';
      outLatence.textContent = '—';
      outTaux.textContent = '—';
      return;
    }
    const lv = LEVELS[servedLevel];
    outAddr.textContent = `#${reqAddr}`;
    outNiveau.textContent = lv.name + (lv.isRam ? ' (échec)' : ' (succès)');
    outNiveau.style.color = lv.isRam ? 'var(--c-red)' : 'var(--c-green)';
    outLatence.textContent = `${lv.latency} cycles`;
    const taux = totalAccess > 0 ? (100 * totalHits) / totalAccess : 0;
    outTaux.textContent = `${fmt(taux, 0)} %  (${totalHits}/${totalAccess})`;
  }

  function startAnim() {
    if (reduce) {
      phase = 'idle';
      anim = servedLevel + 1;
      scene.requestDraw();
      return;
    }
    phase = 'down';
    anim = 0;
    kick();
  }

  function animate() {
    if (phase === 'down') {
      anim += 0.045;
      if (anim >= servedLevel + 1) {
        anim = servedLevel + 1;
        phase = servedLevel > 0 ? 'up' : 'idle';
      }
    } else if (phase === 'up') {
      anim -= 0.045;
      if (anim <= 0) {
        anim = 0;
        phase = 'idle';
      }
    }
    scene.requestDraw();
    if (phase === 'idle') {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(animate);
  }
  function kick() {
    if (!raf && !reduce) raf = requestAnimationFrame(animate);
  }

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
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // Zone des niveaux à gauche, barres de latence à droite.
    const marginL = 0.05 * W;
    const blockX = marginL;
    const blockW = 0.40 * W;
    const blockTop = 0.14 * H;
    const blockH = 0.78 * H;
    const gap = 0.04 * H;
    const rowH = (blockH - gap * (LEVELS.length - 1)) / LEVELS.length;

    const barX = blockX + blockW + 0.06 * W;
    const barMaxW = W - barX - 0.05 * W;

    // Position verticale du centre d'un niveau (le CPU est au-dessus de L1).
    const rowY = (i: number) => blockTop + i * (rowH + gap);
    const rowMidY = (i: number) => rowY(i) + rowH / 2;

    // --- CPU (en haut) ---
    const cpuY = 0.045 * H;
    text(ctx, 'CPU', blockX + blockW / 2, cpuY + 4, {
      color: pal.text, size: 14, align: 'center', weight: 800,
    });
    text(ctx, 'demande une adresse', blockX + blockW / 2, cpuY + 22, {
      color: pal.muted, size: 11, align: 'center',
    });

    // --- Niveaux ---
    for (let i = 0; i < LEVELS.length; i++) {
      const lv = LEVELS[i];
      const col = lv.color(pal);
      const y = rowY(i);
      const served = reqAddr >= 0 && servedLevel === i && phase === 'idle';

      // Boîte du niveau ; largeur croissante symbolise la taille croissante.
      const shrink = (LEVELS.length - 1 - i) * 0.04 * blockW;
      const bx = blockX + shrink / 2;
      const bw = blockW - shrink;
      ctx.save();
      ctx.fillStyle = pal.surface;
      ctx.strokeStyle = served ? (lv.isRam ? pal.red : pal.green) : col;
      ctx.lineWidth = served ? 3 : 1.6;
      roundRect(ctx, bx, y, bw, rowH, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Nom + caractéristiques.
      text(ctx, lv.name, bx + 12, y + 22, {
        color: col, size: 16, align: 'left', weight: 800,
      });
      const sizeLabel = lv.isRam ? 'très grand' : `${lv.slots} lignes`;
      text(ctx, `${sizeLabel} · ${lv.latency} cycle${lv.latency > 1 ? 's' : ''}`, bx + 12, y + 40, {
        color: pal.muted, size: 11, align: 'left',
      });

      // Contenu du cache (pastilles d'adresses) pour les niveaux non-RAM.
      if (!lv.isRam) {
        const slotR = clamp(rowH * 0.16, 8, 16);
        const slotGap = slotR * 2.25;
        const startX = bx + bw - 14 - (lv.slots - 1) * slotGap;
        const slotY = y + rowH - slotR - 8;
        for (let k = 0; k < lv.slots; k++) {
          const cx = startX + k * slotGap;
          const addr = cache[i][k];
          const filled = addr !== undefined;
          const isReq = filled && addr === reqAddr;
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, slotY, slotR, 0, Math.PI * 2);
          ctx.fillStyle = filled
            ? (isReq ? withAlpha(col, 0.9) : withAlpha(col, 0.32))
            : pal.bgElev;
          ctx.fill();
          ctx.lineWidth = isReq ? 2.5 : 1.2;
          ctx.strokeStyle = filled ? col : pal.border;
          ctx.stroke();
          ctx.restore();
          if (filled) {
            text(ctx, String(addr), cx, slotY + 4, {
              color: isReq ? pal.bg : pal.text, size: 10, align: 'center', weight: 700,
            });
          }
        }
      } else {
        text(ctx, 'contient toutes les adresses', bx + bw - 14, y + rowH - 14, {
          color: pal.muted, size: 11, align: 'right',
        });
      }

      // --- Barre de latence proportionnelle, à droite ---
      const frac = lv.latency / MAX_LAT;
      const bH = clamp(rowH * 0.34, 12, 30);
      const bY = rowMidY(i) - bH / 2;
      // fond de barre
      ctx.save();
      ctx.fillStyle = pal.bgElev;
      roundRect(ctx, barX, bY, barMaxW, bH, bH / 2);
      ctx.fill();
      // barre remplie (échelle ~racine pour que L1/L2 restent visibles)
      const visFrac = clamp(Math.sqrt(frac), 0.02, 1);
      ctx.fillStyle = withAlpha(col, 0.85);
      roundRect(ctx, barX, bY, barMaxW * visFrac, bH, bH / 2);
      ctx.fill();
      ctx.restore();
      text(ctx, `${lv.latency} cyc.`, barX + barMaxW * visFrac + 8, rowMidY(i) + 4, {
        color: col, size: 12, align: 'left', weight: 700,
      });
    }

    // Légende de l'axe des latences.
    text(ctx, 'latence (cycles, échelle compressée)', barX, blockTop - 12, {
      color: pal.muted, size: 11, align: 'left',
    });

    // --- Animation du chemin de la requête ---
    if (reqAddr >= 0 && !reduce && phase !== 'idle') {
      const pathX = blockX - 0.018 * W; // à gauche des boîtes
      const topY = cpuY + 10;
      // points de jonction : CPU puis le bord gauche de chaque niveau
      const yAt = (lvl: number) => (lvl < 0 ? topY : rowMidY(lvl));

      // trajet déjà parcouru
      const t = anim; // 0..servedLevel+1
      const seg = Math.floor(t);
      const frac = t - seg;
      // dessine les segments complets
      let prevY = topY;
      for (let i = 0; i <= Math.min(seg, servedLevel); i++) {
        const ty = i < seg ? yAt(i) : lerp(prevY, yAt(i), frac);
        line(ctx, pathX, prevY, pathX, ty, phase === 'up' ? pal.green : pal.yellow, 3);
        prevY = yAt(i);
      }
      // tête mobile de la requête
      let headY: number;
      if (phase === 'down') {
        const from = seg === 0 ? topY : yAt(seg - 1);
        headY = lerp(from, yAt(Math.min(seg, servedLevel)), frac);
      } else {
        // remontée : interpole entre servedLevel et 0
        headY = lerp(yAt(servedLevel), yAt(0), 1 - clamp(anim / Math.max(servedLevel, 1), 0, 1));
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(pathX, headY, 7, 0, Math.PI * 2);
      ctx.fillStyle = phase === 'up' ? pal.green : pal.yellow;
      ctx.fill();
      ctx.restore();
      text(ctx, `#${reqAddr}`, pathX - 10, headY + 4, {
        color: phase === 'up' ? pal.green : pal.yellow, size: 11, align: 'right', weight: 700,
      });
    }

    // --- Bandeau de résultat en bas à droite de l'en-tête ---
    if (reqAddr >= 0) {
      const lv = LEVELS[servedLevel];
      const ok = !lv.isRam;
      const msg = ok
        ? `Succès en ${lv.name} · ${lv.latency} cycle${lv.latency > 1 ? 's' : ''}`
        : `Échec → RAM · ${lv.latency} cycles, ligne remontée`;
      text(ctx, msg, W - 0.05 * W, cpuY + 4, {
        color: ok ? pal.green : pal.red, size: 13, align: 'right', weight: 700,
      });
      const taux = totalAccess > 0 ? (100 * totalHits) / totalAccess : 0;
      text(ctx, `taux de succès cumulé : ${fmt(taux, 0)} %`, W - 0.05 * W, cpuY + 22, {
        color: pal.muted, size: 11, align: 'right',
      });
    } else {
      text(ctx, 'Cliquez « Accéder » pour lancer une requête', W - 0.05 * W, cpuY + 4, {
        color: pal.muted, size: 12, align: 'right',
      });
    }
  }

  /** Couleur de la charte avec transparence (les couleurs pal sont en #hex). */
  function withAlpha(hex: string, a: number): string {
    const h = hex.replace('#', '').trim();
    if (h.length !== 6) return hex;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clamp(a, 0, 1)})`;
  }

  sel.addEventListener('change', () => {
    mode = sel.value === 'random' ? 'random' : 'local';
    // Réinitialise les statistiques et le contenu pour comparer les profils.
    for (let i = 0; i < cache.length; i++) cache[i].length = 0;
    loopCounter = 0;
    totalAccess = 0;
    totalHits = 0;
    reqAddr = -1;
    servedLevel = -1;
    phase = 'idle';
    anim = 0;
    refresh();
    scene.requestDraw();
  });

  btn.addEventListener('click', () => {
    doAccess();
  });

  refresh();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="cache-hierarchy"]').forEach(init);
