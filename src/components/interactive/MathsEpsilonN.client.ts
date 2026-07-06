import {
  createScene,
  line,
  circle,
  text,
  map,
  clamp,
  fmt,
  prefersReducedMotion,
  type Scene,
} from './_canvas';

const NMAX = 60; // rangs affichés : n = 1..60
const ELL = 1; // la limite visée ℓ
const Y_MIN = -0.2;
const Y_MAX = 2.2;

type SuiteKey = 'A' | 'B' | 'C';

interface Suite {
  /** terme général uₙ */
  u: (n: number) => number;
  /** plus petit N tel que ∀ n ≥ N, |uₙ − ℓ| < ε ; null si aucun N ne convient */
  smallestN: (eps: number) => number | null;
  converge: boolean;
}

/**
 * Plus petit N pour une distance |uₙ − ℓ| DÉCROISSANTE en n : on part d'une
 * estimation analytique puis on ajuste exactement (robuste aux flottants).
 */
function firstBelow(dist: (n: number) => number, guess: number, eps: number): number {
  let N = Math.max(1, Math.round(guess));
  while (N > 1 && dist(N - 1) < eps) N--;
  while (dist(N) >= eps) N++;
  return N;
}

const SUITES: Record<SuiteKey, Suite> = {
  // converge vers 1 en oscillant : |uₙ − ℓ| = 1/n
  A: {
    u: (n) => ELL + (n % 2 === 0 ? 1 : -1) / n,
    smallestN: (eps) => firstBelow((n) => 1 / n, 1 / eps + 1, eps),
    converge: true,
  },
  // converge vers 1 lentement : |uₙ − ℓ| = 1/√n  (N ~ 1/ε²)
  B: {
    u: (n) => ELL + 1 / Math.sqrt(n),
    smallestN: (eps) => firstBelow((n) => 1 / Math.sqrt(n), 1 / (eps * eps) + 1, eps),
    converge: true,
  },
  // ne converge pas : |uₙ − ℓ| = 1/2 pour tout n
  C: {
    u: (n) => ELL + (n % 2 === 0 ? 0.5 : -0.5),
    smallestN: (eps) => (eps > 0.5 ? 1 : null),
    converge: false,
  },
};

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slider = root.querySelector<HTMLInputElement>('[data-eps]')!;
  const outEps = root.querySelector<HTMLElement>('[data-out-eps]')!;
  const outMain = root.querySelector<HTMLElement>('[data-out-main]')!;
  const btns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-suite]'));

  let key: SuiteKey = 'A';
  let eps = parseFloat(slider.value);
  let animStart = performance.now(); // les points apparaissent dans l'ordre des rangs
  const scene = createScene(canvas, draw);

  function refresh() {
    outEps.textContent = fmt(eps, 2);
    const suite = SUITES[key];
    const N = suite.smallestN(eps);
    if (suite.converge && N !== null) {
      outMain.textContent = `∀ n ≥ N, |uₙ − ℓ| < ε   avec N = ${fmt(N, 0)}`;
      outMain.style.color = 'var(--c-green)';
    } else if (N !== null) {
      // suite C avec ε > 0,5 : CE ε est battu, mais la convergence exige TOUS les ε
      outMain.textContent = 'N = 1 pour cet ε… mais dès que ε < 0,5, aucun N ne convient';
      outMain.style.color = 'var(--c-orange)';
    } else {
      outMain.textContent = 'aucun N ne convient — la suite ne converge pas';
      outMain.style.color = 'var(--c-red)';
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 44;
    const padR = 14;
    const padT = 16;
    const padB = 30;
    const xOf = (n: number) => map(n, 0, NMAX + 1, padL, W - padR);
    const yOf = (v: number) => map(v, Y_MIN, Y_MAX, H - padB, padT);

    const suite = SUITES[key];
    const N = suite.smallestN(eps);

    // grille horizontale + graduations y
    for (const v of [0, 0.5, 1, 1.5, 2]) {
      const y = yOf(v);
      line(ctx, padL, y, W - padR, y, pal.grid, 1);
      text(ctx, Number.isInteger(v) ? String(v) : fmt(v, 1), padL - 7, y, {
        color: pal.muted,
        size: 10,
        align: 'right',
        baseline: 'middle',
      });
    }

    // bande [ℓ−ε, ℓ+ε] : le « défi » lancé par l'adversaire
    const yTop = yOf(ELL + eps);
    const yBot = yOf(ELL - eps);
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = pal.blue;
    ctx.fillRect(padL, yTop, W - padR - padL, yBot - yTop);
    ctx.restore();
    line(ctx, padL, yTop, W - padR, yTop, pal.blue, 1.2, [4, 4]);
    line(ctx, padL, yBot, W - padR, yBot, pal.blue, 1.2, [4, 4]);
    if (yBot - yTop > 22) {
      text(ctx, 'ℓ ± ε', W - padR - 6, yTop + 4, {
        color: pal.blue,
        size: 11,
        align: 'right',
        baseline: 'top',
        weight: 700,
      });
    } else {
      text(ctx, 'ℓ ± ε', W - padR - 6, yTop - 4, {
        color: pal.blue,
        size: 11,
        align: 'right',
        baseline: 'bottom',
        weight: 700,
      });
    }

    // droite ℓ = 1
    const yEll = yOf(ELL);
    line(ctx, padL, yEll, W - padR, yEll, pal.yellow, 1.6, [7, 5]);
    text(ctx, 'ℓ = 1', padL + 6, yEll - 5, {
      color: pal.yellow,
      size: 11,
      weight: 700,
      baseline: 'bottom',
    });

    // axes
    line(ctx, padL, padT, padL, H - padB, pal.border, 1.5);
    line(ctx, padL, H - padB, W - padR, H - padB, pal.border, 1.5);
    for (const n of [1, 10, 20, 30, 40, 50, 60]) {
      const x = xOf(n);
      line(ctx, x, H - padB, x, H - padB + 4, pal.muted, 1);
      text(ctx, String(n), x, H - padB + 7, {
        color: pal.muted,
        size: 10,
        align: 'center',
        baseline: 'top',
      });
    }
    text(ctx, 'n', W - padR - 4, H - padB - 6, {
      color: pal.muted,
      size: 11,
      align: 'right',
      baseline: 'bottom',
      italic: true,
    });

    // rang N : à partir d'ici, TOUT reste dans la bande
    if (N !== null && N <= NMAX) {
      const x = xOf(N - 0.5);
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = pal.green;
      ctx.fillRect(x, padT, W - padR - x, H - padB - padT);
      ctx.restore();
      line(ctx, x, padT + 14, x, H - padB, pal.green, 2, [6, 4]);
      const lx = clamp(x, padL + 34, W - padR - 34);
      text(ctx, `N = ${fmt(N, 0)}`, lx, padT + 8, {
        color: pal.green,
        size: 12.5,
        align: 'center',
        baseline: 'middle',
        weight: 700,
      });
    } else if (N !== null) {
      // N existe mais dépasse le graphe (suite B, ε petit) : il existe quand même !
      text(ctx, `N = ${fmt(N, 0)} → hors du graphe, mais il existe`, W - padR - 6, padT + 8, {
        color: pal.orange,
        size: 12,
        align: 'right',
        baseline: 'middle',
        weight: 700,
      });
    } else {
      text(ctx, 'aucun N : des points ressortent toujours de la bande', W - padR - 6, padT + 8, {
        color: pal.red,
        size: 12,
        align: 'right',
        baseline: 'middle',
        weight: 700,
      });
    }

    // les points (n, uₙ) — apparition progressive, sauf reduced-motion
    let vis = NMAX;
    if (!prefersReducedMotion()) {
      const p = clamp((performance.now() - animStart) / 700, 0, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      vis = Math.max(1, Math.round(NMAX * ease));
      if (p < 1) s.requestDraw();
    }
    for (let n = 1; n <= vis; n++) {
      const v = suite.u(n);
      const inside = Math.abs(v - ELL) < eps;
      circle(ctx, xOf(n), yOf(v), 3.2, inside ? pal.green : pal.red);
    }

    // anneau sur le premier terme de la « queue » capturée
    if (N !== null && N <= NMAX && N <= vis) {
      circle(ctx, xOf(N), yOf(suite.u(N)), 6.5, undefined, pal.green, 1.6);
    }
  }

  slider.addEventListener('input', () => {
    eps = parseFloat(slider.value);
    refresh();
    scene.requestDraw();
  });
  btns.forEach((b) =>
    b.addEventListener('click', () => {
      const k = b.dataset.suite;
      if (k !== 'A' && k !== 'B' && k !== 'C') return;
      key = k;
      btns.forEach((x) => x.classList.toggle('active', x === b));
      animStart = performance.now();
      refresh();
      scene.requestDraw();
    }),
  );
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="epsilon-n"]').forEach(init);
