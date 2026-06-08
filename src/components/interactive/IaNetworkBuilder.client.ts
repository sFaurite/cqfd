import { createScene, circle, text, line, map, fmt, prefersReducedMotion, type Scene } from './_canvas';

type DataKind = 'xor' | 'cercles' | 'spirale';
interface Pt { x: number; y: number; c: 0 | 1; }

const RANGE = 1.3;

/** RNG déterministe (mulberry32). */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dataset(kind: DataKind): Pt[] {
  const rnd = makeRng(12345);
  const pts: Pt[] = [];
  if (kind === 'xor') {
    for (let i = 0; i < 80; i++) {
      const x = rnd() * 2 - 1, y = rnd() * 2 - 1;
      pts.push({ x, y, c: x * y > 0 ? 1 : 0 });
    }
  } else if (kind === 'cercles') {
    for (let i = 0; i < 80; i++) {
      const ang = rnd() * Math.PI * 2;
      const inner = rnd() < 0.5;
      const r = inner ? 0.25 + rnd() * 0.2 : 0.7 + rnd() * 0.22;
      pts.push({ x: r * Math.cos(ang), y: r * Math.sin(ang), c: inner ? 1 : 0 });
    }
  } else {
    for (let i = 0; i < 90; i++) {
      const t = (i / 90) * 3.2;
      for (const [c, ph] of [[1, 0], [0, Math.PI]] as Array<[0 | 1, number]>) {
        const r = 0.15 + t * 0.26;
        const a = t * 1.6 + ph + (rnd() - 0.5) * 0.3;
        pts.push({ x: r * Math.cos(a), y: r * Math.sin(a), c });
      }
    }
  }
  return pts;
}

const tanh = Math.tanh;
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/** MLP minimal : 2 → H (tanh) → 1 (sigmoïde). H=0 ⇒ régression logistique directe. */
class Net {
  H: number;
  W1: number[][] = []; b1: number[] = [];
  W2: number[] = []; b2 = 0;
  rng = makeRng(98765);
  constructor(H: number) { this.H = H; this.reset(); }
  reset() {
    const r = () => (this.rng() * 2 - 1) * 0.9;
    if (this.H === 0) {
      this.W2 = [r(), r()]; this.b2 = r();
    } else {
      this.W1 = Array.from({ length: this.H }, () => [r(), r()]);
      this.b1 = Array.from({ length: this.H }, () => r());
      this.W2 = Array.from({ length: this.H }, () => r());
      this.b2 = r();
    }
  }
  forward(x: number, y: number): { h: number[]; out: number } {
    if (this.H === 0) {
      const z = this.W2[0] * x + this.W2[1] * y + this.b2;
      return { h: [], out: sigmoid(z) };
    }
    const h = this.b1.map((b, j) => tanh(this.W1[j][0] * x + this.W1[j][1] * y + b));
    let z = this.b2;
    for (let j = 0; j < this.H; j++) z += this.W2[j] * h[j];
    return { h, out: sigmoid(z) };
  }
  trainEpoch(data: Pt[], lr: number): number {
    let loss = 0;
    for (const p of data) {
      const { h, out } = this.forward(p.x, p.y);
      const err = out - p.c; // dérivée de la BCE après sigmoïde
      loss += -(p.c * Math.log(out + 1e-9) + (1 - p.c) * Math.log(1 - out + 1e-9));
      if (this.H === 0) {
        this.W2[0] -= lr * err * p.x;
        this.W2[1] -= lr * err * p.y;
        this.b2 -= lr * err;
      } else {
        for (let j = 0; j < this.H; j++) {
          const dh = err * this.W2[j] * (1 - h[j] * h[j]);
          this.W1[j][0] -= lr * dh * p.x;
          this.W1[j][1] -= lr * dh * p.y;
          this.b1[j] -= lr * dh;
          this.W2[j] -= lr * err * h[j];
        }
        this.b2 -= lr * err;
      }
    }
    return loss / data.length;
  }
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const outH = root.querySelector<HTMLElement>('[data-out-h]')!;
  const outEpoch = root.querySelector<HTMLElement>('[data-out-epoch]')!;
  const outLoss = root.querySelector<HTMLElement>('[data-out-loss]')!;
  const outAcc = root.querySelector<HTMLElement>('[data-out-acc]')!;
  const outArch = root.querySelector<HTMLElement>('[data-out-arch]')!;
  const dataBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-data]'));
  const toggleBtn = root.querySelector<HTMLButtonElement>('[data-toggle]')!;
  const minusBtn = root.querySelector<HTMLButtonElement>('[data-minus]')!;
  const plusBtn = root.querySelector<HTMLButtonElement>('[data-plus]')!;
  const trainBtn = root.querySelector<HTMLButtonElement>('[data-train]')!;
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-reset]')!;

  let kind: DataKind = 'xor';
  let hidden = 4;
  let hiddenOn = true;
  let data = dataset(kind);
  let net = new Net(hidden);
  let epoch = 0;
  let training = false;
  let raf = 0;

  const scene = createScene(canvas, draw);

  function effH() { return hiddenOn ? hidden : 0; }

  function rebuild() {
    net = new Net(effH());
    epoch = 0;
    refresh();
    scene.requestDraw();
  }

  function metrics(): { loss: number; acc: number } {
    let loss = 0, ok = 0;
    for (const p of data) {
      const { out } = net.forward(p.x, p.y);
      loss += -(p.c * Math.log(out + 1e-9) + (1 - p.c) * Math.log(1 - out + 1e-9));
      if ((out >= 0.5 ? 1 : 0) === p.c) ok++;
    }
    return { loss: loss / data.length, acc: ok / data.length };
  }

  function refresh() {
    outH.textContent = String(hidden);
    minusBtn.disabled = hidden <= 1;
    plusBtn.disabled = hidden >= 12;
    const arch = effH() === 0 ? '2-1' : `2-${effH()}-1`;
    outArch.textContent = arch;
    const m = metrics();
    outLoss.textContent = fmt(m.loss);
    outAcc.textContent = `${Math.round(m.acc * 100)} %`;
    outEpoch.textContent = String(epoch);
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const size = Math.min(W, H) - 24;
    const ox = (W - size) / 2, oy = (H - size) / 2;
    const toPx = (x: number) => map(x, -RANGE, RANGE, ox, ox + size);
    const toPy = (y: number) => map(y, -RANGE, RANGE, oy + size, oy);

    // Carte de décision.
    const step = 7;
    for (let px = ox; px < ox + size; px += step) {
      for (let py = oy; py < oy + size; py += step) {
        const dx = map(px, ox, ox + size, -RANGE, RANGE);
        const dy = map(py, oy + size, oy, -RANGE, RANGE);
        const { out } = net.forward(dx, dy);
        ctx.fillStyle = out >= 0.5 ? pal.blue : pal.red;
        ctx.globalAlpha = 0.06 + 0.2 * Math.abs(out - 0.5) * 2;
        ctx.fillRect(px, py, step, step);
      }
    }
    ctx.globalAlpha = 1;

    // Cadre.
    ctx.strokeStyle = pal.border; ctx.lineWidth = 1.5;
    ctx.strokeRect(ox, oy, size, size);
    line(ctx, toPx(0), oy, toPx(0), oy + size, pal.grid, 1);
    line(ctx, ox, toPy(0), ox + size, toPy(0), pal.grid, 1);

    // Points.
    for (const p of data) {
      const base = p.c === 1 ? pal.blue : pal.red;
      circle(ctx, toPx(p.x), toPy(p.y), 4.5, base, pal.text, 1);
    }

    // Badge architecture en haut à gauche.
    const arch = effH() === 0 ? 'aucune couche cachée' : `${effH()} neurone(s) caché(s)`;
    text(ctx, arch, ox + 6, oy + 14, { color: pal.muted, size: 12, weight: 700 });
  }

  function trainStep() {
    if (!training) return;
    for (let k = 0; k < 4; k++) { net.trainEpoch(data, 0.25); epoch++; }
    refresh();
    scene.requestDraw();
    if (epoch >= 1600) { training = false; trainBtn.textContent = 'entraîner ▶'; return; }
    if (training) raf = requestAnimationFrame(trainStep);
  }

  function startTrain() {
    if (training) { training = false; trainBtn.textContent = 'reprendre ▶'; if (raf) cancelAnimationFrame(raf); return; }
    training = true; trainBtn.textContent = 'pause ⏸';
    if (prefersReducedMotion()) {
      for (let k = 0; k < 600; k++) { net.trainEpoch(data, 0.25); epoch++; }
      training = false; trainBtn.textContent = 'entraîner ▶';
      refresh(); scene.requestDraw();
    } else {
      raf = requestAnimationFrame(trainStep);
    }
  }

  dataBtns.forEach((btn) => btn.addEventListener('click', () => {
    kind = btn.dataset.data as DataKind;
    dataBtns.forEach((b2) => { const on = b2 === btn; b2.classList.toggle('active', on); b2.setAttribute('aria-pressed', String(on)); });
    data = dataset(kind);
    training = false; trainBtn.textContent = 'entraîner ▶';
    if (raf) cancelAnimationFrame(raf);
    rebuild();
  }));

  toggleBtn.addEventListener('click', () => {
    hiddenOn = !hiddenOn;
    toggleBtn.textContent = hiddenOn ? 'activée' : 'désactivée';
    toggleBtn.classList.toggle('active', hiddenOn);
    toggleBtn.setAttribute('aria-pressed', String(hiddenOn));
    training = false; trainBtn.textContent = 'entraîner ▶';
    if (raf) cancelAnimationFrame(raf);
    rebuild();
  });

  minusBtn.addEventListener('click', () => { if (hidden > 1) { hidden--; training = false; trainBtn.textContent = 'entraîner ▶'; if (raf) cancelAnimationFrame(raf); rebuild(); } });
  plusBtn.addEventListener('click', () => { if (hidden < 12) { hidden++; training = false; trainBtn.textContent = 'entraîner ▶'; if (raf) cancelAnimationFrame(raf); rebuild(); } });
  trainBtn.addEventListener('click', startTrain);
  resetBtn.addEventListener('click', () => { training = false; trainBtn.textContent = 'entraîner ▶'; if (raf) cancelAnimationFrame(raf); rebuild(); });

  toggleBtn.setAttribute('aria-pressed', 'true');
  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-netbuild"]').forEach(init);
