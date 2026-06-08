import { createScene, line, arrow, circle, text, map, fmt, type Scene } from './_canvas';

/**
 * Petit lexique avec des coordonnées 2D « plongées » à la main pour que les
 * proximités et l'analogie roi-reine fonctionnent visuellement, et que le
 * troisième exemple échoue volontairement. Ce ne sont PAS de vrais word2vec,
 * mais une mise en scène fidèle à la géométrie réelle.
 */
interface Word { w: string; x: number; y: number; group: string; }

const WORDS: Word[] = [
  // royauté / genre (un axe « genre » ≈ horizontal, un axe « royauté » ≈ vertical)
  { w: 'homme', x: -1.4, y: -0.9, group: 'genre' },
  { w: 'femme', x: -0.4, y: -0.9, group: 'genre' },
  { w: 'roi', x: -1.4, y: 0.6, group: 'royauté' },
  { w: 'reine', x: -0.45, y: 0.62, group: 'royauté' },
  { w: 'prince', x: -1.2, y: 0.2, group: 'royauté' },
  { w: 'princesse', x: -0.3, y: 0.22, group: 'royauté' },
  // pays / capitales
  { w: 'france', x: 0.9, y: -0.7, group: 'pays' },
  { w: 'italie', x: 1.7, y: -0.7, group: 'pays' },
  { w: 'paris', x: 0.9, y: 0.5, group: 'capitale' },
  { w: 'rome', x: 1.7, y: 0.5, group: 'capitale' },
  // verbes (mise en scène de l'échec : pas d'axe temps régulier)
  { w: 'marche', x: 0.2, y: 1.3, group: 'verbe' },
  { w: 'marchait', x: 1.1, y: 1.5, group: 'verbe' },
  { w: 'court', x: -0.2, y: 1.6, group: 'verbe' },
  { w: 'courait', x: 1.5, y: 1.15, group: 'verbe' },
];

type AnaKey = 'roi' | 'paris' | 'rate';
interface Analogy { a: string; b: string; c: string; expect: string; }
const ANALOGIES: Record<AnaKey, Analogy> = {
  roi: { a: 'roi', b: 'homme', c: 'femme', expect: 'reine' },
  paris: { a: 'paris', b: 'france', c: 'italie', expect: 'rome' },
  rate: { a: 'marche', b: 'court', c: 'courait', expect: 'marchait' },
};

const find = (w: string) => WORDS.find((x) => x.w === w)!;

function groupColorFor(group: string, pal: Scene['pal']): string {
  const map: Record<string, string> = {
    genre: pal.blue, royauté: pal.purple, pays: pal.green, capitale: pal.teal, verbe: pal.red,
  };
  return map[group] || pal.muted;
}

function cosine(ax: number, ay: number, bx: number, by: number): number {
  const dot = ax * bx + ay * by;
  const na = Math.hypot(ax, ay), nb = Math.hypot(bx, by);
  return dot / (na * nb || 1);
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const outTarget = root.querySelector<HTMLElement>('[data-out-target]')!;
  const outFound = root.querySelector<HTMLElement>('[data-out-found]')!;
  const outCos = root.querySelector<HTMLElement>('[data-out-cos]')!;
  const anaBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ana]'));
  const vecBtn = root.querySelector<HTMLButtonElement>('[data-show-vec]')!;
  const nearBtn = root.querySelector<HTMLButtonElement>('[data-show-near]')!;

  let anaKey: AnaKey = 'roi';
  let showVec = true;
  let showNear = true;

  const scene = createScene(canvas, draw);

  function result(): { rx: number; ry: number; found: Word; expect: Word } {
    const an = ANALOGIES[anaKey];
    const A = find(an.a), B = find(an.b), C = find(an.c);
    const rx = A.x - B.x + C.x, ry = A.y - B.y + C.y;
    // mot le plus proche (hors a, b, c)
    let best: Word | null = null, bestD = Infinity;
    for (const w of WORDS) {
      if (w.w === an.a || w.w === an.b || w.w === an.c) continue;
      const d = Math.hypot(w.x - rx, w.y - ry);
      if (d < bestD) { bestD = d; best = w; }
    }
    return { rx, ry, found: best!, expect: find(an.expect) };
  }

  function refresh() {
    const { rx, ry, found, expect } = result();
    outTarget.textContent = expect.w;
    outFound.textContent = found.w;
    const cos = cosine(rx, ry, expect.x, expect.y);
    outCos.textContent = fmt(cos, 3);
    const okEl = root.querySelector<HTMLElement>('[data-out-found]')!;
    okEl.style.color = found.w === expect.w ? 'var(--c-green)' : 'var(--c-red)';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const pad = 28;
    const XR = 2.3, YR = 2.0;
    const toPx = (x: number) => map(x, -XR, XR, pad, W - pad);
    const toPy = (y: number) => map(y, -YR, YR, H - pad, pad);

    // grille légère
    line(ctx, pad, toPy(0), W - pad, toPy(0), pal.grid, 1);
    line(ctx, toPx(0), pad, toPx(0), H - pad, pal.grid, 1);

    const an = ANALOGIES[anaKey];
    const A = find(an.a), B = find(an.b), C = find(an.c);
    const { rx, ry, found, expect } = result();

    // parallélogramme roi − homme + femme
    if (showVec) {
      // vecteur b→a et c→résultat (mêmes)
      arrow(ctx, toPx(B.x), toPy(B.y), toPx(A.x), toPy(A.y), pal.teal, 2);
      arrow(ctx, toPx(C.x), toPy(C.y), toPx(rx), toPy(ry), pal.teal, 2);
      // côtés du parallélogramme
      line(ctx, toPx(B.x), toPy(B.y), toPx(C.x), toPy(C.y), pal.purple, 1.4, [4, 4]);
      line(ctx, toPx(A.x), toPy(A.y), toPx(rx), toPy(ry), pal.purple, 1.4, [4, 4]);
      // point résultat
      circle(ctx, toPx(rx), toPy(ry), 6, undefined, pal.yellow, 2.4);
      text(ctx, '= ' + an.a + ' − ' + an.b + ' + ' + an.c, toPx(rx) + 9, toPy(ry) - 9,
        { color: pal.yellow, size: 11, weight: 700 });
      // lien vers le mot attendu / trouvé
      const target = found;
      const ok = found.w === expect.w;
      line(ctx, toPx(rx), toPy(ry), toPx(target.x), toPy(target.y), ok ? pal.green : pal.red, 1.6, [2, 3]);
    }

    // halos de voisinage sémantique (mots d'un même groupe que les mots-clés)
    if (showNear) {
      const keyGroups = new Set([A.group, C.group]);
      for (const wd of WORDS) {
        if (!keyGroups.has(wd.group)) continue;
        ctx.save();
        ctx.globalAlpha = 0.1;
        circle(ctx, toPx(wd.x), toPy(wd.y), 16, groupColorFor(wd.group, pal), undefined);
        ctx.restore();
      }
    }

    // points / mots
    for (const wd of WORDS) {
      const isKey = wd.w === an.a || wd.w === an.b || wd.w === an.c;
      const isExpect = wd.w === expect.w;
      const isFound = wd.w === found.w;
      const col = groupColorFor(wd.group, pal);
      const r = isKey ? 6 : 5;
      circle(ctx, toPx(wd.x), toPy(wd.y), r, col, isExpect ? pal.green : isFound ? pal.yellow : pal.bg, isExpect || isFound ? 2.4 : 1);
      text(ctx, wd.w, toPx(wd.x) + 8, toPy(wd.y) + 4, {
        color: isKey ? pal.text : pal.muted, size: 12, weight: isKey ? 700 : 500,
      });
    }

    // bandeau succès/échec
    const ok = found.w === expect.w;
    text(ctx, ok ? `✓ plus proche = « ${found.w} » (attendu)` : `✗ plus proche = « ${found.w} », pas « ${expect.w} »`,
      pad, H - 8, { color: ok ? pal.green : pal.red, size: 12, weight: 700 });
  }

  anaBtns.forEach((btn) => btn.addEventListener('click', () => {
    anaKey = btn.dataset.ana as AnaKey;
    anaBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    refresh(); scene.requestDraw();
  }));
  vecBtn.addEventListener('click', () => {
    showVec = !showVec;
    vecBtn.classList.toggle('active', showVec); vecBtn.setAttribute('aria-pressed', String(showVec));
    scene.requestDraw();
  });
  nearBtn.addEventListener('click', () => {
    showNear = !showNear;
    nearBtn.classList.toggle('active', showNear); nearBtn.setAttribute('aria-pressed', String(showNear));
    scene.requestDraw();
  });

  vecBtn.setAttribute('aria-pressed', 'true');
  nearBtn.setAttribute('aria-pressed', 'true');
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-embed"]').forEach(init);
