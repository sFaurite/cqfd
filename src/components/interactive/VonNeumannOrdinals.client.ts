import { createScene, text, circle, type Scene } from './_canvas';

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slider = root.querySelector<HTMLInputElement>('[data-n]')!;
  const outN = root.querySelector<HTMLElement>('[data-out-n]')!;
  const outCard = root.querySelector<HTMLElement>('[data-out-card]')!;
  const outSucc = root.querySelector<HTMLElement>('[data-out-succ]')!;

  let n = parseInt(slider.value, 10);
  const scene = createScene(canvas, draw);

  function refresh() {
    outN.textContent = String(n);
    outCard.textContent = `${n} élément${n > 1 ? 's' : ''}`;
    outSucc.textContent = `S(${n}) = ${n + 1}`;
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    // titre (notation)
    const titre = n === 0 ? '0  =  ∅' : `${n}  =  { 0, 1, …, ${n - 1} }`;
    text(ctx, titre, W / 2, 26, { color: pal.yellow, size: 18, align: 'center', weight: 700 });
    text(ctx, n === 0 ? '(l’ensemble vide : zéro élément)' : `(l’ensemble de tous les entiers < ${n})`, W / 2, 48, {
      color: pal.muted,
      size: 12,
      align: 'center',
    });

    const top = 64;
    const boxH = H - top - 20;
    const pad = 24;
    const avail = W - 2 * pad;

    if (n === 0) {
      const w = Math.min(120, avail);
      const x = (W - w) / 2;
      ctx.strokeStyle = pal.border;
      ctx.lineWidth = 2;
      roundRect(ctx, x, top, w, boxH, 10);
      ctx.stroke();
      text(ctx, '∅', W / 2, top + boxH / 2 + 6, { color: pal.muted, size: 26, align: 'center' });
      return;
    }

    const gap = 10;
    const cellW = Math.min(120, (avail - gap * (n - 1)) / n);
    const totalW = cellW * n + gap * (n - 1);
    let x = (W - totalW) / 2;

    for (let j = 0; j < n; j++) {
      const isNew = j === n - 1; // l'élément « n−1 » ajouté par le dernier successeur
      ctx.save();
      ctx.strokeStyle = isNew ? pal.green : pal.blue;
      ctx.fillStyle = isNew ? 'rgba(131,193,103,0.10)' : 'rgba(88,196,221,0.07)';
      ctx.lineWidth = isNew ? 2.6 : 1.8;
      roundRect(ctx, x, top, cellW, boxH, 9);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // étiquette de la valeur
      text(ctx, String(j), x + cellW / 2, top + 16, { color: isNew ? pal.green : pal.blue, size: 14, align: 'center', weight: 700 });

      // j points = j éléments (j est l'ensemble {0,…,j-1})
      const cx = x + cellW / 2;
      const cyBase = top + boxH / 2 + 6;
      if (j === 0) {
        text(ctx, '∅', cx, cyBase + 2, { color: pal.muted, size: 16, align: 'center' });
      } else {
        const per = Math.min(j, 3);
        const rows = Math.ceil(j / 3);
        let k = 0;
        for (let r = 0; r < rows; r++) {
          const inRow = Math.min(3, j - r * 3);
          const startX = cx - ((inRow - 1) * 14) / 2;
          for (let c = 0; c < inRow; c++) {
            circle(ctx, startX + c * 14, cyBase + (r - (rows - 1) / 2) * 14, 3.5, pal.muted);
            k++;
          }
        }
      }
      x += cellW + gap;
    }

    // bandeau successeur
    text(ctx, `S(n) = n ∪ {n}  :  on ajoute la case « n »`, W / 2, H - 6, {
      color: pal.muted,
      size: 11,
      align: 'center',
    });
  }

  slider.addEventListener('input', () => {
    n = parseInt(slider.value, 10);
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="vonneumann"]').forEach(init);
