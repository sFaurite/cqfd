import { createScene, line, circle, arrow, text, clamp, type Scene } from './_canvas';

type V3 = [number, number, number];

interface Geom {
  fig: string; // figure de répartition
  geo: string; // géométrie (atomes)
  angle: string;
  dirs: V3[]; // directions des doublets liants (X) après retrait des E
  lonePairs: V3[]; // directions des doublets non liants (E)
}

const SUB = '₀₁₂₃₄₅₆';

/** Directions idéales pour une figure à n sommets (n = X + E). */
function baseDirections(steric: number): V3[] {
  switch (steric) {
    case 2: // linéaire
      return [[0, 0, 1], [0, 0, -1]];
    case 3: // triangulaire plane
      return [0, 1, 2].map((i) => {
        const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        return [Math.cos(a), Math.sin(a), 0] as V3;
      });
    case 4: { // tétraédrique
      const t: V3[] = [
        [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1],
      ];
      return t.map(norm);
    }
    case 5: { // bipyramide trigonale (3 équatoriaux + 2 axiaux)
      const eq: V3[] = [0, 1, 2].map((i) => {
        const a = (i * 2 * Math.PI) / 3;
        return [Math.cos(a), 0, Math.sin(a)] as V3;
      });
      return [...eq, [0, 1, 0], [0, -1, 0]];
    }
    case 6: { // octaédrique
      return [
        [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
      ];
    }
    default:
      return [[0, 0, 1]];
  }
}

/**
 * Détermine la figure, la géométrie et la répartition X/E.
 * Les E occupent les positions équatoriales en priorité (bipyramide) et des
 * positions opposées (octaèdre), conformément à VSEPR.
 */
function compute(x: number, e: number): Geom {
  const steric = x + e;
  const base = baseDirections(steric);
  const figNames: Record<number, string> = {
    2: 'linéaire', 3: 'triangulaire plane', 4: 'tétraédrique',
    5: 'bipyramide trigonale', 6: 'octaédrique',
  };
  const fig = figNames[steric] ?? '—';

  // Ordre de remplissage des positions par E puis X.
  let order = [...Array(base.length).keys()];
  if (steric === 5) order = [0, 1, 2, 3, 4]; // équatoriaux d'abord (indices 0..2)
  // E aux premiers indices, X ensuite.
  const lonePairIdx = order.slice(0, e);
  const bondIdx = order.slice(e);
  const lonePairs = lonePairIdx.map((i) => base[i]);
  const dirs = bondIdx.map((i) => base[i]);

  const geo = geometryName(x, e);
  const angle = idealAngle(steric, e);
  return { fig, geo, angle, dirs, lonePairs };
}

function geometryName(x: number, e: number): string {
  const key = `${x}-${e}`;
  const map: Record<string, string> = {
    '2-0': 'linéaire', '3-0': 'triangulaire plane', '2-1': 'coudée',
    '4-0': 'tétraédrique', '3-1': 'pyramidale', '2-2': 'coudée',
    '5-0': 'bipyramide trigonale', '4-1': 'bascule (papillon)', '3-2': 'en T', '2-3': 'linéaire',
    '6-0': 'octaédrique', '5-1': 'pyramide à base carrée', '4-2': 'plane carrée',
  };
  return map[key] ?? '—';
}

function idealAngle(steric: number, e: number): string {
  if (steric === 2) return '180°';
  if (steric === 3) return e === 0 ? '120°' : '≈ 118°';
  if (steric === 4) {
    if (e === 0) return '109,5°';
    if (e === 1) return '≈ 107°';
    return '≈ 104,5°';
  }
  if (steric === 5) return '90° / 120°';
  return '90°';
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sX = root.querySelector<HTMLInputElement>('[data-x]')!;
  const sE = root.querySelector<HTMLInputElement>('[data-e]')!;
  const cbPolar = root.querySelector<HTMLInputElement>('[data-polar]')!;
  const outX = root.querySelector<HTMLElement>('[data-out-x]')!;
  const outE = root.querySelector<HTMLElement>('[data-out-e]')!;
  const outPolar = root.querySelector<HTMLElement>('[data-out-polar]')!;
  const outType = root.querySelector<HTMLElement>('[data-out-type]')!;
  const outFig = root.querySelector<HTMLElement>('[data-out-fig]')!;
  const outGeo = root.querySelector<HTMLElement>('[data-out-geo]')!;
  const outAng = root.querySelector<HTMLElement>('[data-out-ang]')!;
  const outDip = root.querySelector<HTMLElement>('[data-out-dip]')!;

  let x = +sX.value;
  let e = +sE.value;
  let polar = cbPolar.checked;
  let yaw = 0.6;
  let pitch = -0.35;

  const scene = createScene(canvas, draw);

  function clampSteric() {
    // total de doublets ≤ 6
    if (x + e > 6) { e = 6 - x; if (e < 0) { e = 0; x = 6; } }
    sX.value = String(x);
    sE.value = String(e);
  }

  function dipole(g: Geom): { vec: V3; polaire: boolean } {
    // Somme des vecteurs de liaison (si polaire) + contribution des doublets non liants.
    let v: V3 = [0, 0, 0];
    if (polar) for (const d of g.dirs) v = add(v, d);
    // Les doublets non liants ajoutent un moment (vers eux).
    for (const lp of g.lonePairs) v = add(v, scale(lp, 0.7));
    const mag = Math.hypot(v[0], v[1], v[2]);
    return { vec: v, polaire: mag > 1e-3 };
  }

  function refresh() {
    clampSteric();
    const g = compute(x, e);
    outX.textContent = String(x);
    outE.textContent = String(e);
    outPolar.textContent = polar ? 'oui' : 'non';
    outType.textContent = `AX${SUB[x]}${e > 0 ? 'E' + SUB[e] : ''}`;
    outFig.textContent = g.fig;
    outGeo.textContent = g.geo;
    outAng.textContent = g.angle;
    const dip = dipole(g);
    outDip.textContent = dip.polaire ? 'polaire' : 'apolaire';
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    clampSteric();
    const g = compute(x, e);
    const cx = W * 0.5;
    const cy = H * 0.52;
    const R = Math.min(W, H) * 0.34;

    // Projection 3D -> 2D avec yaw/pitch.
    const project = (p: V3): { x: number; y: number; z: number } => {
      const r = rotate(p, yaw, pitch);
      return { x: cx + r[0] * R, y: cy - r[1] * R, z: r[2] };
    };

    // Trie liaisons + LP par profondeur z pour l'ordre de dessin.
    interface Item { dir: V3; lone: boolean }
    const items: Item[] = [
      ...g.dirs.map((d) => ({ dir: d, lone: false })),
      ...g.lonePairs.map((d) => ({ dir: d, lone: true })),
    ];
    const drawn = items.map((it) => ({ it, p: project(it.dir) }))
      .sort((a, b) => a.p.z - b.p.z);

    // Liaisons et atomes (du fond vers l'avant).
    drawn.forEach(({ it, p }) => {
      if (it.lone) {
        // doublet non liant : lobe en pointillé + deux points
        line(ctx, cx, cy, p.x, p.y, pal.purple, 1.6, [4, 4]);
        const nx = (p.x - cx), ny = (p.y - cy);
        const len = Math.hypot(nx, ny) || 1;
        const ux = -ny / len, uy = nx / len;
        circle(ctx, p.x + ux * 4, p.y + uy * 4, 2.6, pal.purple);
        circle(ctx, p.x - ux * 4, p.y - uy * 4, 2.6, pal.purple);
      } else {
        line(ctx, cx, cy, p.x, p.y, pal.text, 2.4);
        const depth = clamp((p.z + 1) / 2, 0, 1);
        const r = 10 + depth * 6;
        circle(ctx, p.x, p.y, r, pal.blue, pal.bgElev, 2);
        text(ctx, 'X', p.x, p.y, {
          color: '#04121a', size: r * 0.9, weight: 700, align: 'center', baseline: 'middle',
        });
      }
    });

    // Atome central (au-dessus).
    circle(ctx, cx, cy, 15, pal.yellow, pal.bgElev, 2);
    text(ctx, 'A', cx, cy, { color: '#04121a', size: 15, weight: 700, align: 'center', baseline: 'middle' });

    // Vecteur moment dipolaire résultant.
    const dip = dipole(g);
    if (dip.polaire) {
      const pr = project(norm(dip.vec));
      const ex = cx + (pr.x - cx) * 0.62;
      const ey = cy + (pr.y - cy) * 0.62;
      arrow(ctx, cx, cy, ex, ey, pal.red, 2.6, 9);
      text(ctx, 'µ', ex + 6, ey, { color: pal.red, size: 14, weight: 700, baseline: 'middle' });
    } else {
      text(ctx, 'µ = 0 (apolaire)', cx, H - 14, {
        color: pal.muted, size: 12, weight: 700, align: 'center', baseline: 'alphabetic',
      });
    }

    text(ctx, `${g.geo} — ${g.fig}`, cx, 16, {
      color: pal.text, size: 13, weight: 700, align: 'center', baseline: 'middle',
    });
    text(ctx, 'glisse pour tourner', W - 8, H - 8, {
      color: pal.muted, size: 10, align: 'right', baseline: 'alphabetic',
    });
  }

  // Rotation au glissé.
  canvas.style.touchAction = 'none';
  let dragging = false;
  let lx = 0, ly = 0;
  canvas.addEventListener('pointerdown', (ev) => {
    dragging = true; lx = ev.clientX; ly = ev.clientY;
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener('pointermove', (ev) => {
    if (!dragging) return;
    yaw += (ev.clientX - lx) * 0.01;
    pitch = clamp(pitch + (ev.clientY - ly) * 0.01, -1.3, 1.3);
    lx = ev.clientX; ly = ev.clientY;
    scene.requestDraw();
  });
  const stop = () => { dragging = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  sX.addEventListener('input', () => { x = +sX.value; refresh(); scene.requestDraw(); });
  sE.addEventListener('input', () => { e = +sE.value; refresh(); scene.requestDraw(); });
  cbPolar.addEventListener('change', () => { polar = cbPolar.checked; refresh(); scene.requestDraw(); });

  refresh();
}

/* ---------- Géométrie vectorielle ---------- */
function norm(v: V3): V3 {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}
function add(a: V3, b: V3): V3 { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function scale(a: V3, k: number): V3 { return [a[0] * k, a[1] * k, a[2] * k]; }
function rotate(p: V3, yaw: number, pitch: number): V3 {
  // rotation autour de Y (yaw) puis X (pitch)
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  let x = p[0] * cy + p[2] * sy;
  let z = -p[0] * sy + p[2] * cy;
  let y = p[1];
  const cx = Math.cos(pitch), sx = Math.sin(pitch);
  const y2 = y * cx - z * sx;
  const z2 = y * sx + z * cx;
  return [x, y2, z2];
}

document.querySelectorAll<HTMLElement>('[data-iw="chimie-vsepr"]').forEach(init);
