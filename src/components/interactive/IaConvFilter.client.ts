import { createScene, text, clamp, fmt, prefersReducedMotion, type Scene } from './_canvas';

type Preset = 'identite' | 'bord' | 'flou' | 'nettete';
type Img = 'disque' | 'diag' | 'croix';

const SIZE = 9; // image SIZE×SIZE en niveaux de gris [0..1]

const PRESETS: Record<Preset, number[]> = {
  identite: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  bord: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  flou: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
  nettete: [0, -1, 0, -1, 5, -1, 0, -1, 0],
};

function makeImage(kind: Img): number[][] {
  const g: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  const c = (SIZE - 1) / 2;
  for (let r = 0; r < SIZE; r++) {
    for (let col = 0; col < SIZE; col++) {
      if (kind === 'disque') {
        const d = Math.hypot(r - c, col - c);
        g[r][col] = clamp(1 - d / (c + 0.5), 0, 1);
      } else if (kind === 'diag') {
        g[r][col] = r + col >= SIZE - 1 ? 0.9 : 0.1;
      } else {
        g[r][col] = (r === Math.round(c) || col === Math.round(c)) ? 0.9 : 0.12;
      }
    }
  }
  return g;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const outPos = root.querySelector<HTMLElement>('[data-out-pos]')!;
  const outVal = root.querySelector<HTMLElement>('[data-out-val]')!;
  const presetBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-preset]'));
  const imgBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-img]'));
  const playBtn = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const stepBtn = root.querySelector<HTMLButtonElement>('[data-step]')!;
  const editBtn = root.querySelector<HTMLButtonElement>('[data-edit]')!;

  let kernel = [...PRESETS.identite];
  let imgKind: Img = 'disque';
  let img = makeImage(imgKind);
  let editMode = false;
  // position du centre de la fenêtre (1..SIZE-2 pour rester dans l'image)
  let pr = 1, pc = 1;
  let playing = false;
  let raf = 0;
  // géométrie mémorisée pour le clic sur le noyau
  let kGeo = { x: 0, y: 0, cell: 0 };

  const scene = createScene(canvas, draw);

  function convAt(r: number, c: number): number {
    let s = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const rr = clamp(r + dr, 0, SIZE - 1);
        const cc = clamp(c + dc, 0, SIZE - 1);
        s += img[rr][cc] * kernel[(dr + 1) * 3 + (dc + 1)];
      }
    }
    return s;
  }

  function refresh() {
    outPos.textContent = `(${pr + 1}, ${pc + 1})`;
    outVal.textContent = fmt(convAt(pr, pc), 2);
  }

  function grayHex(v: number): string {
    const t = clamp(v, 0, 1);
    const g = Math.round(20 + t * 215);
    return `rgb(${g},${g},${g})`;
  }
  function respColor(v: number, pal: Scene['pal']): string {
    // réponse signée : bleu négatif, rouge positif, autour de 0 sombre.
    const t = clamp(v, -1, 1);
    if (t >= 0) return `color-mix(in srgb, ${pal.red} ${Math.round(t * 100)}%, ${pal.surface})`;
    return `color-mix(in srgb, ${pal.blue} ${Math.round(-t * 100)}%, ${pal.surface})`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const pad = 14;
    const top = 26;
    const colGap = W * 0.04;
    const cellMax = Math.min((W - 2 * pad - 2 * colGap) / (SIZE * 2 + 3), (H - top - pad) / SIZE);
    const cell = Math.max(8, cellMax);
    const gridW = cell * SIZE;

    // positions des trois panneaux
    const imgX = pad;
    const kerX = imgX + gridW + colGap;
    const kerCell = Math.min(cell * 1.0, (W - kerX - pad - gridW - colGap) / 3);
    const respX = kerX + kerCell * 3 + colGap;
    const gy = top;

    // --- image source ---
    text(ctx, 'image', imgX, gy - 8, { color: pal.muted, size: 12, weight: 700 });
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        ctx.fillStyle = grayHex(img[r][c]);
        ctx.fillRect(imgX + c * cell, gy + r * cell, cell - 1, cell - 1);
      }
    }
    // fenêtre 3×3 surlignée
    ctx.save();
    ctx.strokeStyle = pal.yellow; ctx.lineWidth = 2.4;
    ctx.strokeRect(imgX + (pc - 1) * cell, gy + (pr - 1) * cell, cell * 3, cell * 3);
    ctx.restore();

    // --- noyau ---
    text(ctx, 'noyau 3×3', kerX, gy - 8, { color: pal.muted, size: 12, weight: 700 });
    kGeo = { x: kerX, y: gy, cell: kerCell };
    for (let i = 0; i < 9; i++) {
      const r = Math.floor(i / 3), c = i % 3;
      const x = kerX + c * kerCell, y = gy + r * kerCell;
      ctx.fillStyle = pal.surface;
      ctx.fillRect(x, y, kerCell - 2, kerCell - 2);
      ctx.strokeStyle = editMode ? pal.teal : pal.border;
      ctx.lineWidth = editMode ? 1.8 : 1;
      ctx.strokeRect(x, y, kerCell - 2, kerCell - 2);
      const k = kernel[i];
      const lbl = Math.abs(k) < 0.001 ? '0' : (Math.abs(k - Math.round(k)) < 0.001 ? String(Math.round(k)) : fmt(k, 2));
      text(ctx, lbl, x + kerCell / 2, y + kerCell / 2, {
        color: k > 0 ? pal.green : k < 0 ? pal.red : pal.muted,
        size: Math.min(13, kerCell * 0.32), align: 'center', baseline: 'middle', weight: 700,
      });
    }
    if (editMode) text(ctx, 'clique +/−', kerX, gy + kerCell * 3 + 14, { color: pal.teal, size: 10.5, weight: 600 });

    // --- carte de réponse ---
    if (respX + gridW <= W) {
      text(ctx, 'réponse', respX, gy - 8, { color: pal.muted, size: 12, weight: 700 });
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          ctx.fillStyle = respColor(convAt(r, c), pal);
          ctx.fillRect(respX + c * cell, gy + r * cell, cell - 1, cell - 1);
        }
      }
      // case courante
      ctx.save();
      ctx.strokeStyle = pal.yellow; ctx.lineWidth = 2.4;
      ctx.strokeRect(respX + pc * cell, gy + pr * cell, cell, cell);
      ctx.restore();
    }

    // somme pondérée affichée sous l'image
    text(ctx, `Σ = ${fmt(convAt(pr, pc), 2)}`, imgX, gy + gridW + 14, { color: pal.yellow, size: 12, weight: 700 });
  }

  function advance() {
    pc++;
    if (pc > SIZE - 2) { pc = 1; pr++; if (pr > SIZE - 2) pr = 1; }
    refresh();
    scene.requestDraw();
  }

  function loop() {
    if (!playing) return;
    advance();
    raf = window.setTimeout(() => { if (playing) requestAnimationFrame(loop); }, 130);
  }
  function play() {
    if (playing) { playing = false; playBtn.textContent = 'faire glisser ▶'; if (raf) { clearTimeout(raf); cancelAnimationFrame(raf); } return; }
    playing = true; playBtn.textContent = 'pause ⏸';
    if (prefersReducedMotion()) { playing = false; playBtn.textContent = 'faire glisser ▶'; advance(); return; }
    requestAnimationFrame(loop);
  }

  // clic : édition du noyau ou repositionnement de la fenêtre
  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (editMode) {
      const { x, y, cell } = kGeo;
      const c = Math.floor((mx - x) / cell), r = Math.floor((my - y) / cell);
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        const i = r * 3 + c;
        // clic gauche moitié haute = +1, moitié basse = −1
        const inCellY = (my - y) - r * cell;
        kernel[i] += inCellY < cell / 2 ? 1 : -1;
        refresh(); scene.requestDraw();
        // dé-sélectionne les presets (noyau personnalisé)
        presetBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      }
    }
  });

  presetBtns.forEach((btn) => btn.addEventListener('click', () => {
    kernel = [...PRESETS[btn.dataset.preset as Preset]];
    presetBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    refresh(); scene.requestDraw();
  }));
  imgBtns.forEach((btn) => btn.addEventListener('click', () => {
    imgKind = btn.dataset.img as Img;
    imgBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    img = makeImage(imgKind);
    refresh(); scene.requestDraw();
  }));
  playBtn.addEventListener('click', play);
  stepBtn.addEventListener('click', () => { if (playing) play(); advance(); });
  editBtn.addEventListener('click', () => {
    editMode = !editMode;
    editBtn.textContent = editMode ? 'terminer l\'édition' : 'éditer les coefficients';
    editBtn.classList.toggle('active', editMode);
    editBtn.setAttribute('aria-pressed', String(editMode));
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-conv"]').forEach(init);
