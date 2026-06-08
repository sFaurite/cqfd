import { createScene, line, text, circle, clamp, lerp, prefersReducedMotion, type Scene } from './_canvas';

/** Numéros de séquence initiaux (fixés pour la lisibilité). */
const X0 = 1000; // ISN client
const Y0 = 5000; // ISN serveur

type Dir = 'cs' | 'sc'; // client→serveur ou serveur→client

interface Segment {
  dir: Dir;
  flags: string; // libellé (SYN, SYN-ACK, ACK, retransmission)
  seq: number;
  ack: number | null;
  color: 'blue' | 'green' | 'teal' | 'red';
  /** ce segment est perdu (n'atteint jamais l'autre bout) */
  lost?: boolean;
  /** ce segment est une retransmission après timeout */
  retx?: boolean;
}

interface Step {
  seg: Segment | null; // segment animé à cette étape (null = état initial / final)
  caption: string;
  client: string; // état TCP du client
  server: string; // état TCP du serveur
}

/** Construit la liste des étapes selon qu'on simule une perte ou non. */
function buildSteps(loss: boolean): Step[] {
  const steps: Step[] = [];
  steps.push({
    seg: null,
    caption: 'Repos : aucune connexion. Le serveur écoute (LISTEN).',
    client: 'CLOSED',
    server: 'LISTEN',
  });

  if (loss) {
    // Le premier SYN est perdu.
    steps.push({
      seg: { dir: 'cs', flags: 'SYN', seq: X0, ack: null, color: 'blue', lost: true },
      caption: 'Le client envoie SYN (seq=x) et arme un timer… mais le segment est perdu en route.',
      client: 'SYN-SENT',
      server: 'LISTEN',
    });
    steps.push({
      seg: null,
      caption: 'Timeout : le timer expire sans réponse. TCP ne renonce pas — il va retransmettre.',
      client: 'SYN-SENT (timeout)',
      server: 'LISTEN',
    });
    steps.push({
      seg: { dir: 'cs', flags: 'SYN (retransmis)', seq: X0, ack: null, color: 'blue', retx: true },
      caption: 'Retransmission du SYN (même seq=x). Cette fois il arrive.',
      client: 'SYN-SENT',
      server: 'LISTEN',
    });
  } else {
    steps.push({
      seg: { dir: 'cs', flags: 'SYN', seq: X0, ack: null, color: 'blue' },
      caption: 'Le client envoie SYN (seq=x) : « ouvrons une connexion ». Il arme un timer.',
      client: 'SYN-SENT',
      server: 'LISTEN',
    });
  }

  steps.push({
    seg: { dir: 'sc', flags: 'SYN-ACK', seq: Y0, ack: X0 + 1, color: 'green' },
    caption: 'Le serveur répond SYN-ACK : il accuse réception (ack=x+1) et propose son seq=y.',
    client: 'SYN-SENT',
    server: 'SYN-RECEIVED',
  });
  steps.push({
    seg: { dir: 'cs', flags: 'ACK', seq: X0 + 1, ack: Y0 + 1, color: 'teal' },
    caption: 'Le client confirme par ACK (ack=y+1). Les deux côtés sont synchronisés.',
    client: 'ESTABLISHED',
    server: 'SYN-RECEIVED',
  });
  steps.push({
    seg: null,
    caption: 'Connexion ÉTABLIE des deux côtés : les données peuvent circuler.',
    client: 'ESTABLISHED',
    server: 'ESTABLISHED',
  });
  return steps;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const cbLoss = root.querySelector<HTMLInputElement>('[data-loss]')!;
  const outLoss = root.querySelector<HTMLElement>('[data-out-loss]')!;
  const btnPrev = root.querySelector<HTMLButtonElement>('[data-prev]')!;
  const btnNext = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const btnReset = root.querySelector<HTMLButtonElement>('[data-reset]')!;
  const outStep = root.querySelector<HTMLElement>('[data-out-step]')!;
  const outCState = root.querySelector<HTMLElement>('[data-out-cstate]')!;
  const outSState = root.querySelector<HTMLElement>('[data-out-sstate]')!;

  const reduce = prefersReducedMotion();

  let steps = buildSteps(cbLoss.checked);
  let cur = 0;
  let anim = 0; // 0..1 progression de l'animation du segment de l'étape courante
  let raf = 0;

  const scene = createScene(canvas, draw);

  function refresh() {
    const st = steps[cur];
    outStep.textContent = `${cur + 1}/${steps.length} — ${st.caption}`;
    outCState.textContent = st.client;
    outSState.textContent = st.server;
    outLoss.textContent = cbLoss.checked ? 'oui' : 'non';
    btnPrev.disabled = cur <= 0;
    btnNext.disabled = cur >= steps.length - 1;
  }

  function startAnim() {
    if (raf) cancelAnimationFrame(raf);
    const st = steps[cur];
    if (!st.seg || reduce) {
      anim = 1;
      scene.requestDraw();
      return;
    }
    anim = 0;
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      anim = clamp((now - t0) / dur, 0, 1);
      scene.requestDraw();
      if (anim < 1) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    raf = requestAnimationFrame(tick);
  }

  function goto(i: number) {
    cur = clamp(i, 0, steps.length - 1);
    refresh();
    startAnim();
  }

  function rebuild() {
    steps = buildSteps(cbLoss.checked);
    cur = 0;
    refresh();
    startAnim();
  }

  /** Dessine une enveloppe de segment (paquet) à la position px,py. */
  function drawPacket(s: Scene, px: number, py: number, seg: Segment, w: number) {
    const { ctx, pal } = s;
    const col = pal[seg.color];
    const h = w * 0.46;
    ctx.save();
    ctx.fillStyle = withAlpha(s, seg.color, 0.18);
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    roundRect(ctx, px - w / 2, py - h / 2, w, h, 7);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    text(ctx, seg.flags, px, py - h * 0.18, {
      color: col, size: clamp(w * 0.13, 10, 15), align: 'center', baseline: 'middle', weight: 700,
    });
    const nums = `seq=${seg.seq}${seg.ack !== null ? `  ack=${seg.ack}` : ''}`;
    text(ctx, nums, px, py + h * 0.24, {
      color: pal.text, size: clamp(w * 0.1, 8, 12), align: 'center', baseline: 'middle',
      font: 'var(--font-mono), monospace',
    });
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    const st = steps[cur];
    const padT = clamp(H * 0.1, 24, 50);
    const padB = clamp(H * 0.06, 14, 30);
    const xC = W * 0.2; // ligne de vie client
    const xS = W * 0.8; // ligne de vie serveur
    const yTop = padT;
    const yBot = H - padB;

    // Têtes d'hôtes.
    const headY = padT * 0.5;
    text(ctx, 'Client', xC, headY, { color: pal.blue, size: clamp(W * 0.022, 13, 18), align: 'center', baseline: 'middle', weight: 700 });
    text(ctx, 'Serveur', xS, headY, { color: pal.green, size: clamp(W * 0.022, 13, 18), align: 'center', baseline: 'middle', weight: 700 });

    // Lignes de vie verticales.
    line(ctx, xC, yTop, xC, yBot, pal.border, 2);
    line(ctx, xS, yTop, xS, yBot, pal.border, 2);

    // Historique : flèches des segments déjà passés (empilées vers le bas).
    const arrowsBefore: number[] = [];
    for (let i = 1; i <= cur; i++) if (steps[i].seg) arrowsBefore.push(i);
    const lanes = arrowsBefore.length + (st.seg ? 1 : 0);
    const laneTop = yTop + (yBot - yTop) * 0.12;
    const laneGap = lanes > 0 ? ((yBot - yTop) * 0.74) / Math.max(lanes, 1) : 0;

    let laneIdx = 0;
    const drawArrow = (seg: Segment, y: number, faded: boolean, progress: number) => {
      const fromX = seg.dir === 'cs' ? xC : xS;
      const toX = seg.dir === 'cs' ? xS : xC;
      const col = pal[seg.color];
      const reach = seg.lost ? 0.55 : 1; // segment perdu : flèche s'arrête au milieu
      const endX = lerp(fromX, toX, reach * progress);
      ctx.save();
      ctx.globalAlpha = faded ? 0.4 : 1;
      ctx.strokeStyle = col;
      ctx.lineWidth = faded ? 1.6 : 2.4;
      ctx.setLineDash(seg.retx ? [6, 4] : []);
      ctx.beginPath();
      ctx.moveTo(fromX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
      ctx.setLineDash([]);
      // pointe (si pas perdu, ou animation finie)
      if (!seg.lost && progress > 0.02) {
        const dir = Math.sign(toX - fromX);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(endX, y);
        ctx.lineTo(endX - dir * 11, y - 6);
        ctx.lineTo(endX - dir * 11, y + 6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // étiquette du segment au-dessus de la flèche (historique = compact)
      if (faded) {
        const midX = (fromX + endX) / 2;
        text(ctx, `${seg.flags}`, midX, y - 9, {
          color: withAlpha(s, seg.color, 0.85), size: clamp(W * 0.013, 9, 12),
          align: 'center', baseline: 'bottom', weight: 600,
        });
      }

      // « perdu » / paquet animé (étape courante uniquement)
      if (!faded) {
        if (seg.lost) {
          const lx = lerp(fromX, toX, 0.55 * progress);
          if (progress >= 0.98) {
            text(ctx, '✕ perdu', lx + (seg.dir === 'cs' ? 20 : -20), y - 14, {
              color: pal.red, size: clamp(W * 0.016, 11, 14),
              align: seg.dir === 'cs' ? 'left' : 'right', baseline: 'middle', weight: 700,
            });
            circle(ctx, lx, y, 7, undefined, pal.red, 2.4);
            line(ctx, lx - 5, y - 5, lx + 5, y + 5, pal.red, 2.4);
            line(ctx, lx - 5, y + 5, lx + 5, y - 5, pal.red, 2.4);
          }
        } else if (progress < 1) {
          const px = lerp(fromX, toX, progress);
          drawPacket(s, px, y, seg, clamp(W * 0.2, 110, 190));
        }
      }
    };

    // Flèches historiques.
    for (const i of arrowsBefore) {
      const y = laneTop + laneGap * (laneIdx + 0.5);
      drawArrow(steps[i].seg!, y, true, 1);
      laneIdx++;
    }
    // Segment courant.
    if (st.seg) {
      const y = laneTop + laneGap * (laneIdx + 0.5);
      drawArrow(st.seg, y, false, anim);
      // Si pas en cours d'animation, dessine aussi le détail seq/ack en clair.
      if (anim >= 1 && !st.seg.lost) {
        const midX = (xC + xS) / 2;
        text(ctx, `seq=${st.seg.seq}${st.seg.ack !== null ? `  ack=${st.seg.ack}` : ''}`, midX, y + 16, {
          color: pal.muted, size: clamp(W * 0.013, 9, 12), align: 'center', baseline: 'middle',
          font: 'var(--font-mono), monospace',
        });
      }
    }

    // Bandeau d'état en bas (connexion établie / incident).
    const established = st.client === 'ESTABLISHED' && st.server === 'ESTABLISHED';
    const incident = st.caption.includes('timeout') || st.caption.includes('perdu');
    if (established) {
      text(ctx, '✓ Connexion établie — les données peuvent circuler', W / 2, yBot + padB * 0.5, {
        color: pal.green, size: clamp(W * 0.016, 11, 15), align: 'center', baseline: 'middle', weight: 700,
      });
    } else if (incident && anim >= 1) {
      text(ctx, '⏱ Timeout → retransmission', W / 2, yBot + padB * 0.5, {
        color: pal.red, size: clamp(W * 0.016, 11, 15), align: 'center', baseline: 'middle', weight: 700,
      });
    }
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rad: number) {
    const r = Math.min(rad, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function withAlpha(_s: Scene, color: string, a: number): string {
    const al = clamp(a, 0, 1);
    if (color === 'blue') return `rgba(88, 196, 221, ${al})`;
    if (color === 'green') return `rgba(131, 193, 103, ${al})`;
    if (color === 'teal') return `rgba(92, 208, 179, ${al})`;
    if (color === 'red') return `rgba(252, 98, 85, ${al})`;
    if (color === 'yellow') return `rgba(255, 216, 102, ${al})`;
    return `rgba(157, 167, 179, ${al})`;
  }

  cbLoss.addEventListener('change', rebuild);
  btnPrev.addEventListener('click', () => goto(cur - 1));
  btnNext.addEventListener('click', () => goto(cur + 1));
  btnReset.addEventListener('click', () => goto(0));

  refresh();
  startAnim();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-tcp-handshake"]').forEach(init);
