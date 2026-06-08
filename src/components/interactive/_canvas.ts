/**
 * Boîte à outils partagée des composants interactifs (Canvas 2D).
 *
 * Objectifs :
 *   - rendu net sur écrans HiDPI (gestion du devicePixelRatio) ;
 *   - couleurs alignées sur la charte (lecture des variables CSS → suit le thème) ;
 *   - redimensionnement responsive (ResizeObserver) ;
 *   - respect de prefers-reduced-motion pour les animations ;
 *   - primitives de dessin communes (axes, flèches, points, texte) pour une
 *     esthétique cohérente d'un composant à l'autre, et avec les vidéos Manim.
 */

export interface Palette {
  bg: string;
  bgElev: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  blue: string;
  yellow: string;
  red: string;
  green: string;
  purple: string;
  teal: string;
  orange: string;
  grid: string;
}

const FALLBACK: Palette = {
  bg: '#0e1116',
  bgElev: '#161b22',
  surface: '#1b2230',
  text: '#e6edf3',
  muted: '#9da7b3',
  border: '#2b3444',
  blue: '#58c4dd',
  yellow: '#ffd866',
  red: '#fc6255',
  green: '#83c167',
  purple: '#c39bd3',
  teal: '#5cd0b3',
  orange: '#ff9f40',
  grid: 'rgba(255,255,255,0.07)',
};

/** Lit la palette courante depuis les variables CSS (donc suit le thème). */
export function palette(): Palette {
  if (typeof window === 'undefined') return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string, fb: string) => {
    const val = cs.getPropertyValue(name).trim();
    return val || fb;
  };
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    bg: v('--c-bg', FALLBACK.bg),
    bgElev: v('--c-bg-elev', FALLBACK.bgElev),
    surface: v('--c-surface', FALLBACK.surface),
    text: v('--c-text', FALLBACK.text),
    muted: v('--c-muted', FALLBACK.muted),
    border: v('--c-border', FALLBACK.border),
    blue: v('--c-blue', FALLBACK.blue),
    yellow: v('--c-yellow', FALLBACK.yellow),
    red: v('--c-red', FALLBACK.red),
    green: v('--c-green', FALLBACK.green),
    purple: v('--c-purple', FALLBACK.purple),
    teal: v('--c-teal', FALLBACK.teal),
    orange: v('--c-orange', FALLBACK.orange),
    grid: light ? 'rgba(20,40,70,0.08)' : 'rgba(255,255,255,0.07)',
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface Scene {
  ctx: CanvasRenderingContext2D;
  /** largeur/hauteur en pixels CSS (pas en pixels physiques) */
  width: number;
  height: number;
  pal: Palette;
  /** demande un nouveau rendu (coalescé sur requestAnimationFrame) */
  requestDraw: () => void;
  destroy: () => void;
}

/**
 * Initialise un canvas responsive HiDPI et appelle `draw(scene)` à chaque rendu.
 * Redessine automatiquement au redimensionnement et au changement de thème.
 */
export function createScene(
  canvas: HTMLCanvasElement,
  draw: (scene: Scene) => void,
): Scene {
  const ctx = canvas.getContext('2d')!;
  let raf = 0;
  let width = 0;
  let height = 0;

  const scene: Scene = {
    ctx,
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    pal: palette(),
    requestDraw,
    destroy,
  };

  function render() {
    raf = 0;
    scene.pal = palette();
    draw(scene);
  }
  function requestDraw() {
    if (!raf) raf = requestAnimationFrame(render);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height || width * 0.6;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestDraw();
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const mo = new MutationObserver(requestDraw);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function destroy() {
    ro.disconnect();
    mo.disconnect();
    if (raf) cancelAnimationFrame(raf);
  }

  resize();
  return scene;
}

/* ---------- Primitives de dessin ---------- */

export function clear(s: Scene) {
  s.ctx.clearRect(0, 0, s.width, s.height);
}

export function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  w = 2,
  dash: number[] = [],
) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.lineWidth = w;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

/** Flèche de (x1,y1) vers (x2,y2). */
export function arrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  w = 2.5,
  head = 9,
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(ang - 0.4), y2 - head * Math.sin(ang - 0.4));
  ctx.lineTo(x2 - head * Math.cos(ang + 0.4), y2 - head * Math.sin(ang + 0.4));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function circle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fill?: string,
  stroke?: string,
  w = 2,
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = w;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export interface TextOpts {
  color?: string;
  size?: number;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  weight?: number | string;
  italic?: boolean;
  font?: string;
}
export function text(
  ctx: CanvasRenderingContext2D,
  str: string,
  x: number,
  y: number,
  opts: TextOpts = {},
) {
  const {
    color = '#fff',
    size = 14,
    align = 'left',
    baseline = 'alphabetic',
    weight = 400,
    italic = false,
    font = "Inter, system-ui, sans-serif",
  } = opts;
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.font = `${italic ? 'italic ' : ''}${weight} ${size}px ${font}`;
  ctx.fillText(str, x, y);
  ctx.restore();
}

/* ---------- Utilitaires numériques ---------- */

export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const map = (x: number, a: number, b: number, c: number, d: number) =>
  c + ((x - a) * (d - c)) / (b - a);

/** Formate un nombre avec un nombre fixe de décimales, séparateur français. */
export function fmt(x: number, dec = 2): string {
  return x.toLocaleString('fr-FR', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
}

/** Facteur de Lorentz, utilitaire commun à plusieurs composants. */
export const gamma = (beta: number) => 1 / Math.sqrt(1 - beta * beta);
