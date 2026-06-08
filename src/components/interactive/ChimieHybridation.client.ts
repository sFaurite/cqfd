import { createScene, line, circle, text, clamp, type Scene } from './_canvas';

type Hyb = 'sp3' | 'sp2' | 'sp';

interface Spec {
  hyb: number; // nombre d'hybrides
  sigma: number;
  pi: number;
  angle: string;
  hybLabel: string;
  example: string;
  pOrbitals: number; // orbitales p non hybridées
}

const SPECS: Record<Hyb, Spec> = {
  sp3: { hyb: 4, sigma: 4, pi: 0, angle: '109,5°', hybLabel: '4 sp³', example: 'CH₄ (alcane)', pOrbitals: 0 },
  sp2: { hyb: 3, sigma: 3, pi: 1, angle: '120°', hybLabel: '3 sp²', example: 'C₂H₄ (alcène, C=C)', pOrbitals: 1 },
  sp: { hyb: 2, sigma: 2, pi: 2, angle: '180°', hybLabel: '2 sp', example: 'C₂H₂ (alcyne, C≡C)', pOrbitals: 2 },
};

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const selType = root.querySelector<HTMLSelectElement>('[data-type]')!;
  const cbPi = root.querySelector<HTMLInputElement>('[data-pi]')!;
  const outPi = root.querySelector<HTMLElement>('[data-out-pi]')!;
  const outHyb = root.querySelector<HTMLElement>('[data-out-hyb]')!;
  const outSigma = root.querySelector<HTMLElement>('[data-out-sigma]')!;
  const outPiNb = root.querySelector<HTMLElement>('[data-out-pinb]')!;
  const outAng = root.querySelector<HTMLElement>('[data-out-ang]')!;
  const outEx = root.querySelector<HTMLElement>('[data-out-ex]')!;

  let hyb = selType.value as Hyb;
  let showPi = cbPi.checked;

  const scene = createScene(canvas, draw);

  function refresh() {
    const s = SPECS[hyb];
    outPi.textContent = showPi ? 'oui' : 'non';
    outHyb.textContent = s.hybLabel;
    outSigma.textContent = String(s.sigma);
    outPiNb.textContent = String(s.pi);
    outAng.textContent = s.angle;
    outEx.textContent = s.example;
  }

  /** Directions 2D (projetées) des hybrides σ. */
  function sigmaDirs(h: Hyb): { x: number; y: number; z: number }[] {
    if (h === 'sp') {
      return [{ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }];
    }
    if (h === 'sp2') {
      return [0, 1, 2].map((i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
        return { x: Math.cos(a), y: Math.sin(a), z: 0 };
      });
    }
    // sp3 : tétraèdre projeté (un en bas, trois en haut)
    const t = [
      { x: 0, y: -1, z: 0 },
      { x: 0.94, y: 0.4, z: 0.2 },
      { x: -0.47, y: 0.4, z: 0.8 },
      { x: -0.47, y: 0.4, z: -0.8 },
    ];
    return t;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const spec = SPECS[hyb];
    const cx = W * 0.42;
    const cy = H * 0.52;
    const R = Math.min(W, H) * 0.32;

    // simple projection : x,y écran ; z module la taille (profondeur).
    const dirs = sigmaDirs(hyb);

    text(ctx, `Carbone ${spec.hybLabel} — ${spec.angle}`, cx, 18, {
      color: pal.text, size: 14, weight: 700, align: 'center', baseline: 'middle',
    });

    // Trie par z (fond -> avant).
    const sorted = dirs.map((d) => d).sort((a, b) => a.z - b.z);

    // Liaisons σ (lobes hybrides bleus).
    sorted.forEach((d) => {
      const depth = clamp((d.z + 1) / 2, 0, 1);
      const ex = cx + d.x * R;
      const ey = cy + d.y * R;
      const w = 2 + depth * 1.5;
      // lobe hybride : ligne épaisse + petit cercle (atome H ou liaison)
      line(ctx, cx, cy, ex, ey, pal.blue, w);
      const r = 9 + depth * 5;
      circle(ctx, ex, ey, r, pal.blue, pal.bgElev, 1.5);
      text(ctx, 'σ', ex, ey, { color: '#04121a', size: r * 0.9, weight: 700, align: 'center', baseline: 'middle' });
    });

    // Orbitales p non hybridées (lobes rouges perpendiculaires), liaisons π.
    if (spec.pOrbitals > 0) {
      // axes p : pour sp2 -> z (hors-plan) ; pour sp -> y et z
      const pAxes = hyb === 'sp'
        ? [{ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }]
        : [{ x: 0, y: 0, z: 1 }];
      pAxes.forEach((ax) => {
        const len = R * 0.62;
        const ex1 = cx + ax.x * len + ax.z * len * 0.5;
        const ey1 = cy + ax.y * len - ax.z * len * 0.5;
        const ex2 = cx - ax.x * len - ax.z * len * 0.5;
        const ey2 = cy - ax.y * len + ax.z * len * 0.5;
        // lobes p (haltère)
        drawLobe(ctx, cx, cy, ex1, ey1, pal.red, showPi);
        drawLobe(ctx, cx, cy, ex2, ey2, pal.red, showPi);
        if (showPi) {
          text(ctx, 'π', (cx + ex1) / 2 + 8, (cy + ey1) / 2, {
            color: pal.red, size: 13, weight: 700, baseline: 'middle',
          });
        }
      });
    }

    // Atome central C.
    circle(ctx, cx, cy, 14, pal.yellow, pal.bgElev, 2);
    text(ctx, 'C', cx, cy, { color: '#04121a', size: 15, weight: 700, align: 'center', baseline: 'middle' });

    // Panneau d'info à droite.
    const px = W * 0.74;
    let py = H * 0.3;
    const lh = 22;
    const lines: Array<[string, string]> = [
      ['hybrides σ', `${spec.sigma}`],
      ['orbitales p restantes', `${spec.pOrbitals}`],
      ['liaisons π', `${spec.pi}`],
      ['exemple', spec.example],
    ];
    lines.forEach(([k, v]) => {
      text(ctx, k, px, py, { color: pal.muted, size: 12, baseline: 'middle' });
      text(ctx, v, W - 16, py, { color: pal.text, size: 12, weight: 700, align: 'right', baseline: 'middle' });
      py += lh;
    });
    text(ctx, 'modèle descriptif (pas une étape physique)', px, py + 6, {
      color: pal.muted, size: 10, italic: true, baseline: 'middle',
    });
  }

  /** Lobe p en demi-haltère (ligne + bout arrondi). */
  function drawLobe(
    ctx: CanvasRenderingContext2D, cx: number, cy: number, ex: number, ey: number,
    col: string, visible: boolean,
  ) {
    ctx.save();
    ctx.globalAlpha = visible ? 0.85 : 0.35;
    line(ctx, cx, cy, ex, ey, col, 2, visible ? [] : [4, 4]);
    circle(ctx, ex, ey, 7, undefined, col, 2);
    ctx.restore();
  }

  selType.addEventListener('change', () => { hyb = selType.value as Hyb; refresh(); scene.requestDraw(); });
  cbPi.addEventListener('change', () => { showPi = cbPi.checked; refresh(); scene.requestDraw(); });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-hybridation"]').forEach(init);
