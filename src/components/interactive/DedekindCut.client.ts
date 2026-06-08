import { createScene, line, circle, text, map, clamp, fmt, type Scene } from './_canvas';

const XMAX = 3;

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slider = root.querySelector<HTMLInputElement>('[data-x]')!;
  const outX = root.querySelector<HTMLElement>('[data-out-x]')!;
  const outType = root.querySelector<HTMLElement>('[data-out-type]')!;
  const btn = root.querySelector<HTMLButtonElement>('[data-sqrt2]')!;

  let x = parseFloat(slider.value);
  let sqrt2 = false;
  const scene = createScene(canvas, draw);

  function refresh() {
    outX.textContent = fmt(x, 3);
    outType.textContent = sqrt2 ? 'x = √2 : irrationnel (trou de ℚ comblé)' : 'rationnel choisi au curseur';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padX = 30;
    const axisY = H * 0.58;
    const x0 = padX,
      x1 = W - padX;
    const xOf = (v: number) => map(clamp(v, 0, XMAX), 0, XMAX, x0, x1);
    const cut = xOf(x);

    // zones A (gauche, bleu) et complément (droite, rouge)
    ctx.fillStyle = 'rgba(88,196,221,0.12)';
    ctx.fillRect(x0, axisY - 34, cut - x0, 68);
    ctx.fillStyle = 'rgba(252,98,85,0.10)';
    ctx.fillRect(cut, axisY - 34, x1 - cut, 68);

    // axe + graduations entières
    line(ctx, x0, axisY, x1, axisY, pal.border, 1.5);
    for (let t = 0; t <= XMAX; t++) {
      const px = xOf(t);
      line(ctx, px, axisY - 5, px, axisY + 5, pal.muted, 1);
      text(ctx, String(t), px, axisY + 20, { color: pal.muted, size: 11, align: 'center', baseline: 'top' });
    }

    // quelques rationnels comme petits points sur l'axe
    for (let d = 1; d <= 3; d++) {
      for (let k = 0; k <= XMAX * d; k++) {
        const q = k / d;
        if (q > XMAX) break;
        circle(ctx, xOf(q), axisY, 1.6, pal.muted);
      }
    }

    // la coupure
    line(ctx, cut, axisY - 40, cut, axisY + 40, pal.yellow, 2.4, [5, 4]);
    circle(ctx, cut, axisY, 5, pal.yellow, pal.bg, 2);
    text(ctx, sqrt2 ? 'x = √2' : `x = ${fmt(x, 3)}`, cut, axisY - 46, {
      color: pal.yellow,
      size: 13,
      align: 'center',
      baseline: 'bottom',
      weight: 700,
    });

    // étiquettes des deux ensembles
    text(ctx, 'A = { q ∈ ℚ : q < x }', x0 + 8, axisY - 26, { color: pal.blue, size: 12, weight: 700 });
    text(ctx, 'le reste de ℚ', x1 - 8, axisY - 26, { color: pal.red, size: 12, align: 'right', weight: 700 });

    if (sqrt2) {
      text(ctx, 'aucun rationnel ici : A n’a pas de plus grand élément', W / 2, H - 8, {
        color: pal.yellow,
        size: 11,
        align: 'center',
      });
    }
  }

  slider.addEventListener('input', () => {
    x = parseFloat(slider.value);
    sqrt2 = false;
    btn.classList.remove('active');
    refresh();
    scene.requestDraw();
  });
  btn.addEventListener('click', () => {
    x = Math.SQRT2;
    sqrt2 = true;
    slider.value = String(x);
    btn.classList.add('active');
    refresh();
    scene.requestDraw();
  });
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="dedekind"]').forEach(init);
