import { createScene, line, text, clamp, type Scene } from './_canvas';

interface Route {
  /** préfixe « a.b.c.d/n » */
  cidr: string;
  /** entier 32 bits du préfixe (déjà masqué) */
  net: number;
  /** longueur du préfixe */
  len: number;
  /** prochain saut */
  hop: string;
}

/** Table de routage de démonstration (ordre d'affichage = ordre de saisie). */
const RAW: Array<[string, number, string]> = [
  ['0.0.0.0', 0, 'FAI (passerelle Internet)'],
  ['10.0.0.0', 8, 'routeur cœur'],
  ['10.1.0.0', 16, 'routeur site A'],
  ['10.1.2.0', 24, 'commutateur VLAN 2'],
  ['10.2.0.0', 16, 'routeur site B'],
  ['192.168.4.0', 24, 'lien direct'],
];

function parseIp(str: string): number | null {
  const parts = str.trim().split('.');
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = parseInt(p, 10);
    if (n < 0 || n > 255) return null;
    v = (v << 8) | n;
  }
  return v >>> 0;
}

function cidrMask(n: number): number {
  if (n <= 0) return 0;
  if (n >= 32) return 0xffffffff;
  return (0xffffffff << (32 - n)) >>> 0;
}

const ROUTES: Route[] = RAW.map(([ip, len, hop]) => {
  const v = parseIp(ip)!;
  const net = (v & cidrMask(len)) >>> 0;
  return { cidr: `${ip}/${len}`, net, len, hop };
});

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const inDst = root.querySelector<HTMLInputElement>('[data-dst]')!;
  const selPreset = root.querySelector<HTMLSelectElement>('[data-preset]')!;
  const outValid = root.querySelector<HTMLElement>('[data-out-valid]')!;
  const outMatches = root.querySelector<HTMLElement>('[data-out-matches]')!;
  const outChosen = root.querySelector<HTMLElement>('[data-out-chosen]')!;
  const outHop = root.querySelector<HTMLElement>('[data-out-hop]')!;

  let dst = parseIp(inDst.value);

  const scene = createScene(canvas, draw);

  /** Indices des routes qui correspondent à `dst`, triés par longueur décroissante. */
  function matching(): number[] {
    if (dst === null) return [];
    const idx: number[] = [];
    for (let i = 0; i < ROUTES.length; i++) {
      const r = ROUTES[i];
      const mask = cidrMask(r.len);
      if (((dst & mask) >>> 0) === r.net) idx.push(i);
    }
    idx.sort((a, b) => ROUTES[b].len - ROUTES[a].len);
    return idx;
  }

  function refresh() {
    const ok = dst !== null;
    outValid.textContent = ok ? 'ok' : 'invalide';
    outValid.style.color = ok ? 'var(--c-green)' : 'var(--c-red)';
    const m = matching();
    if (!ok) {
      outMatches.textContent = '—';
      outChosen.textContent = '—';
      outHop.textContent = '—';
      return;
    }
    outMatches.textContent = m.length ? m.map((i) => ROUTES[i].cidr).join(', ') : 'aucune';
    if (m.length) {
      const best = ROUTES[m[0]];
      outChosen.textContent = best.cidr;
      outHop.textContent = best.hop;
    } else {
      outChosen.textContent = 'aucune';
      outHop.textContent = 'paquet jeté';
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const m = matching();
    const best = m.length ? m[0] : -1;
    const matchSet = new Set(m);

    const padX = clamp(W * 0.04, 16, 40);
    const tx = padX;
    const tw = W - 2 * padX;
    const titleH = clamp(H * 0.1, 22, 42);
    const headH = clamp(H * 0.09, 20, 34);
    const n = ROUTES.length;
    const rowH = clamp((H - titleH - headH - H * 0.06) / n, 24, 48);
    const ty = titleH;
    const fs = clamp(rowH * 0.42, 10, 15);

    // Colonnes : préfixe CIDR | longueur | next hop | état.
    const cPrefix = tx + tw * 0.02;
    const cLen = tx + tw * 0.34;
    const cHop = tx + tw * 0.46;
    const cState = tx + tw * 0.99;

    // Titre + destination courante.
    const dstStr = dst === null ? '— invalide —' : ipToStr(dst);
    text(ctx, 'Table de routage', tx, titleH * 0.5, {
      color: pal.muted, size: clamp(fs * 1.05, 11, 15), align: 'left', baseline: 'middle', weight: 700,
    });
    text(ctx, `destination : ${dstStr}`, tx + tw, titleH * 0.5, {
      color: dst === null ? pal.red : pal.yellow, size: clamp(fs * 1.1, 11, 16),
      align: 'right', baseline: 'middle', weight: 700, font: 'var(--font-mono), monospace',
    });

    // En-têtes.
    const hy = ty + headH * 0.5;
    text(ctx, 'préfixe', cPrefix, hy, { color: pal.text, size: fs, align: 'left', baseline: 'middle', weight: 700 });
    text(ctx, 'long.', cLen, hy, { color: pal.text, size: fs, align: 'left', baseline: 'middle', weight: 700 });
    text(ctx, 'next hop', cHop, hy, { color: pal.text, size: fs, align: 'left', baseline: 'middle', weight: 700 });
    text(ctx, 'état', cState, hy, { color: pal.text, size: fs, align: 'right', baseline: 'middle', weight: 700 });
    line(ctx, tx, ty + headH, tx + tw, ty + headH, pal.border, 1.5);

    // Lignes.
    for (let i = 0; i < n; i++) {
      const r = ROUTES[i];
      const yTop = ty + headH + i * rowH;
      const yMid = yTop + rowH / 2;
      const isMatch = matchSet.has(i);
      const isBest = i === best;

      // Fond.
      if (isBest) {
        ctx.fillStyle = withAlpha(s, pal.green, 0.2);
        ctx.fillRect(tx, yTop, tw, rowH);
      } else if (isMatch) {
        ctx.fillStyle = withAlpha(s, pal.green, 0.08);
        ctx.fillRect(tx, yTop, tw, rowH);
      }

      const isDefault = r.len === 0;
      const prefixCol = isBest ? pal.green : isMatch ? pal.teal : isDefault ? pal.muted : pal.text;
      text(ctx, r.cidr, cPrefix, yMid, {
        color: prefixCol, size: fs, align: 'left', baseline: 'middle',
        weight: isBest ? 700 : 500, font: 'var(--font-mono), monospace',
      });
      text(ctx, `/${r.len}`, cLen, yMid, {
        color: isMatch ? pal.green : pal.muted, size: fs * 0.92, align: 'left', baseline: 'middle',
        weight: isBest ? 700 : 500,
      });
      text(ctx, r.hop, cHop, yMid, {
        color: isBest ? pal.text : pal.muted, size: fs * 0.94, align: 'left', baseline: 'middle',
        weight: isBest ? 600 : 400,
      });

      let state: string;
      let stateCol: string;
      if (isBest) {
        state = '✓ choisie';
        stateCol = pal.green;
      } else if (isMatch) {
        state = 'correspond';
        stateCol = pal.teal;
      } else {
        state = '—';
        stateCol = pal.muted;
      }
      text(ctx, state, cState, yMid, {
        color: stateCol, size: fs * 0.92, align: 'right', baseline: 'middle', weight: isBest ? 700 : 500,
      });

      // Encadré de la route choisie.
      if (isBest) {
        ctx.strokeStyle = pal.green;
        ctx.lineWidth = 2;
        ctx.strokeRect(tx + 1, yTop + 1, tw - 2, rowH - 2);
      }
    }

    // Cadre extérieur.
    ctx.strokeStyle = pal.border;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(tx, ty, tw, headH + n * rowH);
  }

  function ipToStr(v: number): string {
    return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join('.');
  }

  function withAlpha(s: Scene, color: string, a: number): string {
    const { pal } = s;
    const al = clamp(a, 0, 1);
    if (color === pal.green) return `rgba(131, 193, 103, ${al})`;
    if (color === pal.teal) return `rgba(92, 208, 179, ${al})`;
    if (color === pal.blue) return `rgba(88, 196, 221, ${al})`;
    if (color === pal.yellow) return `rgba(255, 216, 102, ${al})`;
    return `rgba(157, 167, 179, ${al})`;
  }

  inDst.addEventListener('input', () => {
    dst = parseIp(inDst.value);
    refresh();
    scene.requestDraw();
  });
  selPreset.addEventListener('change', () => {
    inDst.value = selPreset.value;
    dst = parseIp(inDst.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-routage"]').forEach(init);
