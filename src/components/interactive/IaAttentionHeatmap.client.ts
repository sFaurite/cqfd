import { createScene, text, clamp, fmt, type Scene } from './_canvas';

/**
 * Matrices d'attention « plausibles » fabriquées à la main (scores avant
 * softmax) pour deux phrases. Mise en scène fidèle d'un comportement réel
 * (coréférence « il » → « animal »), pas une exécution de transformer.
 */
interface Sentence { tokens: string[]; scores: number[][]; }

function buildSentence(tokens: string[], links: Array<[number, number, number]>): Sentence {
  const n = tokens.length;
  const scores: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      let s = i === j ? 1.2 : 0.2; // léger biais diagonal (auto-attention)
      // proximité locale
      s += 0.6 * Math.exp(-Math.abs(i - j) / 2);
      return s;
    }),
  );
  for (const [q, k, w] of links) scores[q][k] += w;
  return { tokens, scores };
}

const SENTENCES: Sentence[] = [
  buildSentence(
    ["l'", 'animal', "n'", 'a', 'pas', 'traversé', 'la', 'rue', 'car', 'il', 'était', 'fatigué'],
    [
      [9, 1, 3.2],   // « il » → « animal » (coréférence)
      [11, 9, 2.4],  // « fatigué » → « il »
      [11, 1, 1.6],  // « fatigué » → « animal »
      [5, 7, 2.0],   // « traversé » → « rue »
      [5, 1, 1.4],   // « traversé » → « animal »
      [8, 5, 1.5],   // « car » → « traversé »
    ],
  ),
  buildSentence(
    ['la', 'clé', 'ouvre', 'la', 'porte'],
    [
      [2, 1, 2.6], // « ouvre » → « clé »
      [2, 4, 2.2], // « ouvre » → « porte »
      [4, 2, 1.4], // « porte » → « ouvre »
    ],
  ),
];

function softmaxRow(scores: number[], beta: number): number[] {
  const m = Math.max(...scores);
  const ex = scores.map((s) => Math.exp((s - m) * beta));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((e) => e / sum);
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const tempEl = root.querySelector<HTMLInputElement>('[data-temp]')!;
  const outTemp = root.querySelector<HTMLElement>('[data-out-temp]')!;
  const outQ = root.querySelector<HTMLElement>('[data-out-q]')!;
  const outK = root.querySelector<HTMLElement>('[data-out-k]')!;
  const outW = root.querySelector<HTMLElement>('[data-out-w]')!;
  const sentBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sent]'));

  let sentIdx = 0;
  let beta = +tempEl.value;
  let hoverRow = -1;

  let geo = { x0: 0, y0: 0, cell: 0, n: 0, labelW: 0, topH: 0 };

  const scene = createScene(canvas, draw);

  function matrix(): number[][] {
    const s = SENTENCES[sentIdx];
    return s.scores.map((row) => softmaxRow(row, beta));
  }

  function refresh() {
    outTemp.textContent = fmt(beta, 1);
    const s = SENTENCES[sentIdx];
    if (hoverRow >= 0 && hoverRow < s.tokens.length) {
      const w = matrix()[hoverRow];
      let bestJ = 0;
      for (let j = 1; j < w.length; j++) if (w[j] > w[bestJ]) bestJ = j;
      outQ.textContent = `« ${s.tokens[hoverRow].trim()} »`;
      outK.textContent = `« ${s.tokens[bestJ].trim()} »`;
      outW.textContent = fmt(w[bestJ]);
    } else {
      outQ.textContent = 'survole une ligne';
      outK.textContent = '—';
      outW.textContent = '—';
    }
  }

  function heat(t: number, pal: Scene['pal']): string {
    // 0 → fond, 1 → bleu vif
    const tt = clamp(t, 0, 1);
    return `color-mix(in srgb, ${pal.blue} ${Math.round(8 + tt * 92)}%, ${pal.surface})`;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const sent = SENTENCES[sentIdx];
    const n = sent.tokens.length;
    const M = matrix();

    const labelW = Math.min(W * 0.16, 92);
    const topH = Math.min(H * 0.18, 64);
    const pad = 10;
    const gridW = W - labelW - pad * 2;
    const gridH = H - topH - pad * 2 - 16;
    const cell = Math.min(gridW / n, gridH / n);
    const x0 = labelW + pad;
    const y0 = topH + pad;
    geo = { x0, y0, cell, n, labelW, topH };

    // étiquettes des clés (colonnes, en haut, pivotées)
    for (let j = 0; j < n; j++) {
      ctx.save();
      ctx.translate(x0 + cell * (j + 0.5), y0 - 6);
      ctx.rotate(-Math.PI / 4);
      text(ctx, sent.tokens[j].trim(), 0, 0, { color: pal.muted, size: Math.min(12, cell * 0.7), align: 'left', baseline: 'middle' });
      ctx.restore();
    }

    // lignes (requêtes) + cellules
    for (let i = 0; i < n; i++) {
      const rowHi = i === hoverRow;
      text(ctx, sent.tokens[i].trim(), x0 - 6, y0 + cell * (i + 0.5), {
        color: rowHi ? pal.yellow : pal.muted, size: Math.min(12, cell * 0.7), align: 'right', baseline: 'middle', weight: rowHi ? 700 : 500,
      });
      for (let j = 0; j < n; j++) {
        const v = M[i][j];
        ctx.fillStyle = heat(v, pal);
        ctx.globalAlpha = hoverRow >= 0 && !rowHi ? 0.32 : 1;
        ctx.fillRect(x0 + j * cell, y0 + i * cell, cell - 1, cell - 1);
        ctx.globalAlpha = 1;
        if (rowHi && v > 0.12) {
          text(ctx, fmt(v, 2), x0 + cell * (j + 0.5), y0 + cell * (i + 0.5), {
            color: v > 0.5 ? '#04121a' : pal.text, size: Math.min(10, cell * 0.4), align: 'center', baseline: 'middle', weight: 600,
          });
        }
      }
      if (rowHi) {
        ctx.strokeStyle = pal.yellow; ctx.lineWidth = 2;
        ctx.strokeRect(x0, y0 + i * cell, cell * n, cell);
      }
    }

    // axes
    text(ctx, 'requête →', 4, y0 + cell * n + 12, { color: pal.muted, size: 11, weight: 600 });
    text(ctx, 'clés ↑', x0, topH - 2, { color: pal.muted, size: 11, weight: 600 });
  }

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const my = e.clientY - rect.top;
    const mx = e.clientX - rect.left;
    const { x0, y0, cell, n } = geo;
    if (mx >= x0 - geo.labelW && my >= y0 && my < y0 + cell * n) {
      hoverRow = Math.floor((my - y0) / cell);
    } else hoverRow = -1;
    refresh();
    scene.requestDraw();
  });
  canvas.addEventListener('pointerleave', () => { hoverRow = -1; refresh(); scene.requestDraw(); });

  tempEl.addEventListener('input', () => { beta = +tempEl.value; refresh(); scene.requestDraw(); });
  sentBtns.forEach((btn) => btn.addEventListener('click', () => {
    sentIdx = +btn.dataset.sent!;
    sentBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    hoverRow = -1; refresh(); scene.requestDraw();
  }));

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-attn"]').forEach(init);
