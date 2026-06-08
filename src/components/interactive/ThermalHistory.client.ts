import { createScene, line, circle, text, map, clamp, type Scene } from './_canvas';

interface Event {
  logT: number; // log10 du temps (s) depuis le Big Bang chaud
  T: string; // température
  label: string;
  desc: string;
}

// Repères, placés en log10(temps en secondes). t_aujourd'hui ≈ 4,35×10¹⁷ s.
const EVENTS: Event[] = [
  { logT: -43, T: '~10³² K', label: 'Ère de Planck', desc: 'Gravité quantique : la physique connue ne s\'applique plus.' },
  { logT: -36, T: '~10²⁸ K', label: 'Inflation (GUT)', desc: 'Expansion exponentielle ; les graines des structures sont semées.' },
  { logT: -12, T: '~10¹⁵ K', label: 'Brisure électrofaible', desc: 'W, Z et Higgs entrent en jeu : les masses apparaissent.' },
  { logT: -6, T: '~10¹³ K', label: 'Confinement des quarks', desc: 'Les quarks se lient en protons et neutrons.' },
  { logT: 2.26, T: '~10⁹ K', label: 'Nucléosynthèse (BBN)', desc: 'Les premiers noyaux : hydrogène, hélium-4, traces de lithium.' },
  { logT: 12.23, T: '~9000 K', label: 'Égalité matière–rayonnement', desc: 'La matière prend le dessus sur le rayonnement.' },
  { logT: 13.08, T: '~3000 K', label: 'Recombinaison (CMB)', desc: 'L\'univers devient transparent : il libère le fond diffus.' },
  { logT: 15.7, T: '~50 K', label: 'Premières étoiles', desc: 'Fin des âges sombres ; réionisation du gaz.' },
  { logT: 17.6, T: '2,7 K', label: 'Aujourd\'hui', desc: 'Galaxies, amas, et énergie noire qui domine l\'expansion.' },
];

function timeLabel(logT: number): string {
  const s = 10 ** logT;
  if (logT < 0) return `10^${Math.round(logT)} s`;
  const yr = s / 3.156e7;
  if (yr < 1) return `${(s).toExponential(0)} s`;
  if (yr < 1e6) return `${Math.round(yr).toLocaleString('fr-FR')} ans`;
  if (yr < 1e9) return `${(yr / 1e6).toFixed(0)} millions d'années`;
  return `${(yr / 1e9).toFixed(1)} milliards d'années`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const sT = root.querySelector<HTMLInputElement>('[data-logt]')!;
  const outT = root.querySelector<HTMLElement>('[data-out-t]')!;
  const outTemp = root.querySelector<HTMLElement>('[data-out-temp]')!;
  const outEv = root.querySelector<HTMLElement>('[data-out-ev]')!;

  let logT = parseFloat(sT.value);
  const scene = createScene(canvas, draw);

  const LMIN = -43, LMAX = 17.6;

  function nearest(): Event {
    let best = EVENTS[0], bd = Infinity;
    for (const e of EVENTS) {
      const d = Math.abs(e.logT - logT);
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  function refresh() {
    outT.textContent = timeLabel(logT);
    const e = nearest();
    outTemp.textContent = e.T;
    outEv.textContent = e.label;
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);
    const padL = 24, padR = 24;
    const x0 = padL, x1 = W - padR;
    const axisY = H * 0.52;
    const X = (l: number) => map(l, LMIN, LMAX, x0, x1);

    // axe + dégradé « chaud → froid »
    const grad = ctx.createLinearGradient(x0, 0, x1, 0);
    grad.addColorStop(0, pal.red);
    grad.addColorStop(0.5, pal.orange);
    grad.addColorStop(0.78, pal.yellow);
    grad.addColorStop(1, pal.blue);
    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x0, axisY);
    ctx.lineTo(x1, axisY);
    ctx.stroke();
    ctx.restore();
    text(ctx, '◀ plus chaud / plus tôt', x0, axisY - 60, { color: pal.muted, size: 10, align: 'left' });
    text(ctx, 'plus froid / plus tard ▶', x1, axisY - 60, { color: pal.muted, size: 10, align: 'right' });

    // événements (labels alternés au-dessus / en dessous)
    EVENTS.forEach((e, i) => {
      const x = X(e.logT);
      const up = i % 2 === 0;
      const dir = up ? -1 : 1;
      const active = e === nearest();
      circle(ctx, x, axisY, active ? 6 : 4, active ? pal.text : pal.muted);
      line(ctx, x, axisY, x, axisY + dir * 18, active ? pal.text : pal.border, active ? 1.6 : 1);
      const ly = axisY + dir * (up ? 24 : 26);
      text(ctx, e.label, x, ly, {
        color: active ? pal.text : pal.muted, size: active ? 11 : 9.5,
        align: 'center', weight: active ? 700 : 500, baseline: up ? 'bottom' : 'top',
      });
      text(ctx, e.T, x, ly + dir * 13, {
        color: active ? pal.yellow : pal.muted, size: 9, align: 'center',
        baseline: up ? 'bottom' : 'top',
      });
    });

    // curseur
    const xc = clamp(X(logT), x0, x1);
    line(ctx, xc, axisY - 70, xc, axisY + 70, pal.green, 1.6, [4, 3]);
    circle(ctx, xc, axisY, 7, undefined, pal.green, 2.4);

    // encart description de l'événement courant
    const e = nearest();
    text(ctx, e.desc, W / 2, H - 12, { color: pal.muted, size: 11, align: 'center', italic: true });
  }

  sT.addEventListener('input', () => {
    logT = parseFloat(sT.value);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="thermal-history"]').forEach(init);
