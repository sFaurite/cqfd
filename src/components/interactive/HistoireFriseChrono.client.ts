import { createScene, line, circle, text, clamp, lerp, map, type Scene } from './_canvas';

/**
 * Jalons de l'histoire humaine. `age` = nombre d'années avant le présent (BP),
 * valeur positive. Plus c'est grand, plus c'est ancien. Les durées s'étalent
 * sur ~3 millions d'années (premiers Homo) jusqu'à aujourd'hui (age = 0).
 */
interface Jalon {
  age: number; // années avant le présent
  nom: string;
  col: keyof Pick<
    import('./_canvas').Palette,
    'blue' | 'yellow' | 'red' | 'green' | 'purple' | 'teal'
  >;
}

const JALONS: Jalon[] = [
  { age: 3_000_000, nom: 'Premiers Homo', col: 'purple' },
  { age: 300_000, nom: 'Homo sapiens', col: 'purple' },
  { age: 40_000, nom: 'Art pariétal', col: 'teal' },
  { age: 12_000, nom: 'Néolithique (agriculture)', col: 'green' },
  { age: 5_200, nom: 'Écriture (Sumer)', col: 'yellow' },
  { age: 4_500, nom: 'Premiers empires', col: 'yellow' },
  { age: 2_500, nom: 'Antiquité classique', col: 'red' },
  { age: 1_500, nom: 'Moyen Âge', col: 'red' },
  { age: 530, nom: 'Renaissance / modernité', col: 'blue' },
  { age: 230, nom: 'Révolution industrielle', col: 'blue' },
];

// Bornes anciennes proposées par le curseur « fenêtre » (en années BP).
const FENETRES = [3_000_000, 300_000, 40_000, 12_000, 5_200, 2_500, 530];
const FENETRE_LBL = ['−3 Ma', '−300 ka', '−40 ka', '−12 ka', '−5 200 a', '−2 500 a', '−530 a'];

const MIN_AGE = 0.5; // borne basse pour le log (un demi-siècle ≈ présent)

function ageLabel(age: number): string {
  if (age >= 1_000_000) return `−${(age / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Ma`;
  if (age >= 1_000) return `−${Math.round(age / 1_000).toLocaleString('fr-FR')} ka`;
  if (age <= 0) return 'présent';
  return `−${Math.round(age).toLocaleString('fr-FR')} a`;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const slEch = root.querySelector<HTMLInputElement>('[data-echelle]')!;
  const slZoom = root.querySelector<HTMLInputElement>('[data-zoom]')!;
  const outEch = root.querySelector<HTMLElement>('[data-out-echelle]')!;
  const outZoom = root.querySelector<HTMLElement>('[data-out-zoom]')!;
  const readouts = root.querySelector<HTMLElement>('[data-readouts]')!;

  let mix = parseFloat(slEch.value); // 0 = log, 1 = linéaire
  let zoom = parseInt(slZoom.value, 10);

  const scene = createScene(canvas, draw);

  function refresh() {
    outEch.textContent =
      mix < 0.04 ? 'log' : mix > 0.96 ? 'linéaire' : `${Math.round(mix * 100)} %`;
    outZoom.textContent = FENETRE_LBL[zoom];

    // Chips de lecture : rapport entre la durée du Paléolithique et l'histoire écrite.
    const ecrit = 5_200;
    const paleo = 3_000_000;
    readouts.innerHTML = '';
    const chip = (k: string, v: string) => {
      const el = document.createElement('span');
      el.className = 'iw__chip';
      el.innerHTML = `<span class="k">${k}</span> <b>${v}</b>`;
      readouts.appendChild(el);
    };
    chip('Préhistoire / histoire écrite', `${Math.round(paleo / ecrit)} × plus longue`);
    chip('Sapiens avant l’écriture', '≈ 295 000 ans');
    chip('Histoire écrite', '≈ 5 200 ans');
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const padL = 18;
    const padR = 18;
    const axisY = H * 0.62;
    const x0 = padL;
    const x1 = W - padR;

    const oldest = FENETRES[zoom];
    const young = MIN_AGE;

    // Échelle log : âge -> [0,1] par log10 ; échelle linéaire : âge -> [0,1].
    const lnOld = Math.log(oldest);
    const lnYoung = Math.log(young);
    const tOf = (age: number) => {
      const a = clamp(age, young, oldest);
      const tLog = (Math.log(a) - lnYoung) / (lnOld - lnYoung); // 0=récent,1=ancien
      const tLin = (a - young) / (oldest - young);
      return lerp(tLog, tLin, mix);
    };
    // x croît du présent (gauche) vers l'ancien (droite) inversé : on met
    // l'ANCIEN à gauche et le PRÉSENT à droite (sens de lecture du temps).
    const xOf = (age: number) => map(tOf(age), 1, 0, x0, x1);

    // Bande d'axe.
    line(ctx, x0, axisY, x1, axisY, pal.border, 2);
    text(ctx, 'plus ancien', x0 + 2, axisY + 22, { color: pal.muted, size: 12, baseline: 'top' });
    text(ctx, 'présent →', x1 - 2, axisY + 22, {
      color: pal.muted,
      size: 12,
      align: 'right',
      baseline: 'top',
    });

    // Graduations : puissances de 10 (en mode log surtout).
    const decades = [1_000_000, 100_000, 10_000, 1_000, 100, 10];
    for (const d of decades) {
      if (d > oldest || d < young) continue;
      const x = xOf(d);
      if (x < x0 - 1 || x > x1 + 1) continue;
      line(ctx, x, axisY - 6, x, axisY + 6, pal.grid, 1);
      text(ctx, ageLabel(d), x, axisY + 9, {
        color: pal.muted,
        size: 10.5,
        align: 'center',
        baseline: 'top',
      });
    }

    // Bandes de période (segments colorés entre jalons consécutifs visibles).
    const visibles = JALONS.filter((j) => j.age <= oldest + 1);
    for (let i = 0; i < visibles.length - 1; i++) {
      const aOld = visibles[i].age;
      const aYoung = visibles[i + 1].age;
      const xa = xOf(aOld);
      const xb = xOf(aYoung);
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = (pal as any)[visibles[i].col];
      ctx.fillRect(Math.min(xa, xb), axisY - 10, Math.abs(xb - xa), 20);
      ctx.restore();
    }

    // Jalons : trait + pastille + étiquette, alternés haut/bas pour ne pas se chevaucher.
    const labelYsUp = [axisY - 26, axisY - 60, axisY - 94, axisY - 128];
    let slotUp = 0;
    for (let i = 0; i < visibles.length; i++) {
      const j = visibles[i];
      const x = clamp(xOf(j.age), x0, x1);
      const col = (pal as any)[j.col] as string;

      // Choix d'un étage pour l'étiquette (vers le haut), en cyclant.
      const ly = labelYsUp[slotUp % labelYsUp.length];
      slotUp++;

      line(ctx, x, axisY, x, ly + 10, col, 1.4, [3, 3]);
      circle(ctx, x, axisY, 4.5, col, pal.bg, 1.5);

      // Étiquette : nom + âge.
      const tw = ctx.measureText(j.nom).width;
      let lx = x;
      let align: CanvasTextAlign = 'center';
      if (x - tw / 2 < x0 + 2) {
        align = 'left';
        lx = x0 + 2;
      } else if (x + tw / 2 > x1 - 2) {
        align = 'right';
        lx = x1 - 2;
      }
      text(ctx, j.nom, lx, ly, { color: pal.text, size: 12, weight: 700, align });
      text(ctx, ageLabel(j.age), lx, ly + 14, { color: col, size: 11, weight: 700, align });
    }

    // Titre du mode dans un coin.
    const modeTxt =
      mix < 0.04
        ? 'Échelle logarithmique — tout est visible, mais les durées sont déformées'
        : mix > 0.96
          ? 'Échelle linéaire — l’histoire écrite est écrasée contre le présent'
          : 'Transition log → linéaire…';
    text(ctx, modeTxt, W / 2, H - 6, {
      color: pal.muted,
      size: 11.5,
      align: 'center',
      baseline: 'bottom',
      italic: true,
    });
  }

  slEch.addEventListener('input', () => {
    mix = parseFloat(slEch.value);
    refresh();
    scene.requestDraw();
  });
  slZoom.addEventListener('input', () => {
    zoom = parseInt(slZoom.value, 10);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="frise-chrono"]').forEach(init);
