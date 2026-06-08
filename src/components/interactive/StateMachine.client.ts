import { createScene, arrow, circle, text, clamp, lerp, prefersReducedMotion, type Scene } from './_canvas';

type State = 'LOCKED' | 'UNLOCKED';
type Input = 'coin' | 'push';

const LABEL: Record<State, string> = {
  LOCKED: 'VERROUILLÉ',
  UNLOCKED: 'DÉVERROUILLÉ',
};

/** Fonction de transition de l'automate (déterministe). */
function next(state: State, input: Input): State {
  if (state === 'LOCKED') return input === 'coin' ? 'UNLOCKED' : 'LOCKED';
  return input === 'push' ? 'LOCKED' : 'UNLOCKED';
}

/** Identifie l'arête empruntée par (state, input) pour l'animer. */
type EdgeId = 'L_coin' | 'U_push' | 'L_push' | 'U_coin';
function edgeOf(state: State, input: Input): EdgeId {
  if (state === 'LOCKED') return input === 'coin' ? 'L_coin' : 'L_push';
  return input === 'push' ? 'U_push' : 'U_coin';
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const btnCoin = root.querySelector<HTMLButtonElement>('[data-coin]')!;
  const btnPush = root.querySelector<HTMLButtonElement>('[data-push]')!;
  const outEtat = root.querySelector<HTMLElement>('[data-out-etat]')!;
  const outLast = root.querySelector<HTMLElement>('[data-out-last]')!;

  const reduce = prefersReducedMotion();

  let state: State = 'LOCKED';
  let lastInput: Input | null = null;
  let lastChanged = false;
  // Arête en cours d'animation et progression 0..1 (1 = figé).
  let activeEdge: EdgeId | null = null;
  let anim = 1;
  let raf = 0;

  const scene = createScene(canvas, draw);

  function refresh() {
    outEtat.textContent = LABEL[state];
    if (lastInput === null) {
      outLast.textContent = '—';
    } else {
      const verbe = lastInput === 'coin' ? 'pièce' : 'pousser';
      const effet = lastChanged
        ? `→ ${LABEL[state]}`
        : `→ reste ${LABEL[state]}`;
      outLast.textContent = `${verbe} ${effet}`;
    }
  }

  function tick() {
    anim += 0.045;
    if (anim >= 1) {
      anim = 1;
      raf = 0;
      scene.requestDraw();
      return;
    }
    scene.requestDraw();
    raf = requestAnimationFrame(tick);
  }

  function apply(input: Input) {
    const before = state;
    const after = next(state, input);
    lastInput = input;
    lastChanged = before !== after;
    activeEdge = edgeOf(before, input);
    state = after;
    refresh();
    if (reduce) {
      anim = 1;
    } else {
      anim = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    }
    scene.requestDraw();
  }

  /** Dessine un nœud d'état (cercle + libellé) ; surligné si courant. */
  function drawNode(
    s: Scene,
    x: number,
    y: number,
    r: number,
    label: string,
    current: boolean,
    accent: string,
  ) {
    const { ctx, pal } = s;
    const stroke = current ? accent : pal.border;
    const fill = current ? withAlpha(accent, 0.16) : pal.surface;
    if (current) {
      circle(ctx, x, y, r + 6, undefined, withAlpha(accent, 0.3), 2);
    }
    circle(ctx, x, y, r, fill, stroke, current ? 3 : 2);
    text(ctx, label, x, y, {
      color: current ? accent : pal.text,
      size: r * 0.34,
      align: 'center',
      baseline: 'middle',
      weight: 700,
    });
  }

  /** Étiquette d'arête sur fond, pour rester lisible par-dessus les flèches. */
  function edgeLabel(s: Scene, str: string, x: number, y: number, active: boolean, accent: string) {
    const { ctx, pal } = s;
    ctx.save();
    ctx.font = '600 13px Inter, system-ui, sans-serif';
    const w = ctx.measureText(str).width + 12;
    const h = 20;
    ctx.fillStyle = pal.bgElev;
    ctx.strokeStyle = active ? accent : pal.border;
    ctx.lineWidth = active ? 2 : 1;
    roundRect(ctx, x - w / 2, y - h / 2, w, h, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, str, x, y, {
      color: active ? accent : pal.muted,
      size: 13,
      align: 'center',
      baseline: 'middle',
      weight: 600,
    });
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const cy = 0.5 * H;
    const r = clamp(Math.min(W, H) * 0.16, 36, 78);
    const xL = 0.27 * W; // nœud VERROUILLÉ (gauche)
    const xU = 0.73 * W; // nœud DÉVERROUILLÉ (droite)

    // Couleur d'arête : empruntée + en cours d'animation → mise en avant.
    const edgeColor = (id: EdgeId, base: string) =>
      activeEdge === id && anim < 1 ? pal.yellow : base;

    // Curseur animé (pastille qui glisse le long de l'arête active).
    const animFrac = activeEdge && anim < 1 ? anim : -1;

    // --- Arête VERROUILLÉ --(pièce)--> DÉVERROUILLÉ (arc supérieur) ---
    drawArc(s, xL, cy, xU, cy, r, -1, 'pièce', edgeColor('L_coin', pal.green), 'L_coin', animFrac);
    // --- Arête DÉVERROUILLÉ --(pousser)--> VERROUILLÉ (arc inférieur) ---
    drawArc(s, xU, cy, xL, cy, r, 1, 'pousser', edgeColor('U_push', pal.blue), 'U_push', animFrac);

    // --- Boucles : combinaisons qui ne changent pas l'état ---
    // VERROUILLÉ + pousser → reste verrouillé (boucle à gauche)
    drawLoop(s, xL, cy, r, -1, 'pousser', edgeColor('L_push', pal.muted), 'L_push', animFrac);
    // DÉVERROUILLÉ + pièce → reste déverrouillé (boucle à droite)
    drawLoop(s, xU, cy, r, 1, 'pièce', edgeColor('U_coin', pal.muted), 'U_coin', animFrac);

    // --- Nœuds (par-dessus les arêtes) ---
    drawNode(s, xL, cy, r, 'VERROUILLÉ', state === 'LOCKED', pal.red);
    drawNode(s, xU, cy, r, 'DÉVERROUILLÉ', state === 'UNLOCKED', pal.green);

    // --- Flèche d'état initial (entrée de l'automate, vers VERROUILLÉ) ---
    arrow(ctx, xL - r - 0.07 * W, cy - r - 4, xL - r * 0.78, cy - r * 0.78, pal.muted, 2, 9);
    text(ctx, 'départ', xL - r - 0.07 * W, cy - r - 12, {
      color: pal.muted, size: 11, align: 'center',
    });

    // --- Journal (dernière entrée et effet), coin haut gauche ---
    text(ctx, 'Journal', 14, 0.085 * H, {
      color: pal.muted, size: 11, align: 'left', weight: 700,
    });
    if (lastInput === null) {
      text(ctx, "entrée : —", 14, 0.085 * H + 18, { color: pal.text, size: 13, align: 'left' });
    } else {
      const verbe = lastInput === 'coin' ? 'pièce' : 'pousser';
      const effet = lastChanged ? `→ ${LABEL[state]}` : `→ inchangé (${LABEL[state]})`;
      text(ctx, `entrée : ${verbe}`, 14, 0.085 * H + 18, {
        color: pal.text, size: 13, align: 'left', weight: 600,
      });
      text(ctx, effet, 14, 0.085 * H + 36, {
        color: lastChanged ? pal.yellow : pal.muted, size: 13, align: 'left',
      });
    }

    // --- Légende état courant, coin haut droit ---
    text(ctx, `état courant : ${LABEL[state]}`, W - 14, 0.085 * H, {
      color: state === 'UNLOCKED' ? pal.green : pal.red,
      size: 13, align: 'right', weight: 700,
    });
  }

  /**
   * Arc orienté entre deux nœuds, courbé vers le haut (side=-1) ou le bas (side=1),
   * étiqueté, avec une tête de flèche. Si animFrac>=0 et que c'est l'arête active,
   * une pastille glisse le long de l'arc.
   */
  function drawArc(
    s: Scene,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number,
    side: number,
    label: string,
    color: string,
    id: EdgeId,
    animFrac: number,
  ) {
    const { ctx, pal } = s;
    const mx = (x1 + x2) / 2;
    const bulge = side * (r * 1.05);
    const cyCtrl = (y1 + y2) / 2 + bulge;

    // points de départ/arrivée décalés sur le bord des cercles, en évitant le centre
    const a1 = Math.atan2(cyCtrl - y1, mx - x1);
    const a2 = Math.atan2(cyCtrl - y2, mx - x2);
    const sx = x1 + Math.cos(a1) * r;
    const sy = y1 + Math.sin(a1) * r;
    const ex = x2 + Math.cos(a2) * r;
    const ey = y2 + Math.sin(a2) * r;

    const active = id === activeEdge && animFrac >= 0;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = active ? 3.5 : 2;
    ctx.lineCap = 'round';
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(mx, cyCtrl, ex, ey);
    ctx.stroke();
    ctx.restore();

    // tête de flèche : tangente à l'arrivée
    const tx = lerp(mx, ex, 0.5);
    const ty = lerp(cyCtrl, ey, 0.5);
    drawHead(ctx, tx, ty, ex, ey, color);

    // étiquette au sommet de l'arc
    edgeLabel(s, label, mx, cyCtrl, active, color);

    // pastille animée
    if (active) {
      const p = quad(sx, sy, mx, cyCtrl, ex, ey, animFrac);
      circle(ctx, p.x, p.y, 6, pal.yellow, pal.bg, 2);
    }
  }

  /** Boucle (transition vers le même état) au-dessus/dessous d'un nœud. */
  function drawLoop(
    s: Scene,
    cx: number,
    cy: number,
    r: number,
    side: number,
    label: string,
    color: string,
    id: EdgeId,
    animFrac: number,
  ) {
    const { ctx, pal } = s;
    const active = id === activeEdge && animFrac >= 0;
    // direction de la boucle : vers le haut (côté gauche), vers le bas (côté droit)
    const dir = side < 0 ? -1 : 1; // gauche = -1 → boucle vers le haut-gauche ; droite = +1 → bas-droite
    const ax = dir; // horizontal offset sign
    const r2 = r * 0.55;
    // centre de la boucle, hors du nœud
    const lx = cx + ax * r * 1.15;
    const ly = cy + (side < 0 ? -1 : 1) * r * 1.0;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = active ? 3.5 : 2;
    ctx.arc(lx, ly, r2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // tête de flèche : pointant vers le nœud, depuis le bord de la boucle
    const ang = Math.atan2(cy - ly, cx - lx);
    const hx = lx + Math.cos(ang) * r2;
    const hy = ly + Math.sin(ang) * r2;
    drawHead(ctx, lx, ly, hx, hy, color);

    // étiquette à l'extérieur de la boucle
    const labX = lx + ax * (r2 + 4);
    const labY = ly + (side < 0 ? -r2 * 0.2 : r2 * 0.2);
    edgeLabel(s, label, labX, labY, active, color);

    if (active) {
      const t = animFrac * Math.PI * 2 - Math.PI / 2;
      const px = lx + Math.cos(t) * r2;
      const py = ly + Math.sin(t) * r2;
      circle(ctx, px, py, 6, pal.yellow, pal.bg, 2);
    }
  }

  /** Tête de flèche pointant de (fx,fy) vers (tx,ty). */
  function drawHead(
    ctx: CanvasRenderingContext2D,
    fx: number,
    fy: number,
    tx: number,
    ty: number,
    color: string,
  ) {
    const ang = Math.atan2(ty - fy, tx - fx);
    const head = 10;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - head * Math.cos(ang - 0.45), ty - head * Math.sin(ang - 0.45));
    ctx.lineTo(tx - head * Math.cos(ang + 0.45), ty - head * Math.sin(ang + 0.45));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /** Point sur une courbe de Bézier quadratique. */
  function quad(
    x0: number, y0: number,
    cx: number, cy: number,
    x1: number, y1: number,
    t: number,
  ): { x: number; y: number } {
    const u = 1 - t;
    return {
      x: u * u * x0 + 2 * u * t * cx + t * t * x1,
      y: u * u * y0 + 2 * u * t * cy + t * t * y1,
    };
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rad: number) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  /** Variante translucide d'une couleur de la charte (pour les halos/fonds). */
  function withAlpha(color: string, a: number): string {
    const { pal } = scene;
    const al = clamp(a, 0, 1);
    if (color === pal.red) return `rgba(252, 98, 85, ${al})`;
    if (color === pal.green) return `rgba(131, 193, 103, ${al})`;
    if (color === pal.blue) return `rgba(88, 196, 221, ${al})`;
    if (color === pal.yellow) return `rgba(255, 216, 102, ${al})`;
    return `rgba(157, 167, 179, ${al})`;
  }

  btnCoin.addEventListener('click', () => apply('coin'));
  btnPush.addEventListener('click', () => apply('push'));

  refresh();
  scene.requestDraw();
}

document.querySelectorAll<HTMLElement>('[data-iw="state-machine"]').forEach(init);
