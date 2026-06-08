import { createScene, line, text, clamp, type Scene } from './_canvas';

/** Parse une chaîne IPv4 « a.b.c.d » en entier non signé 32 bits, ou null si invalide. */
function parseIp(str: string): number | null {
  const parts = str.trim().split('.');
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = parseInt(p, 10);
    if (n < 0 || n > 255) return null;
    v = (v << 8) | n;
  }
  return v >>> 0;
}

/** Entier 32 bits → « a.b.c.d ». */
function ipToStr(v: number): string {
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join('.');
}

/** Masque réseau (entier 32 bits) pour un CIDR /n. */
function cidrMask(n: number): number {
  if (n <= 0) return 0;
  if (n >= 32) return 0xffffffff;
  return (0xffffffff << (32 - n)) >>> 0;
}

/** 32 bits d'un entier sous forme de chaîne « 0/1 ». */
function bits32(v: number): number[] {
  const out: number[] = [];
  for (let i = 31; i >= 0; i--) out.push((v >>> i) & 1);
  return out;
}

function init(root: HTMLElement) {
  const canvas = root.querySelector('canvas')!;
  const inIp = root.querySelector<HTMLInputElement>('[data-ip]')!;
  const slCidr = root.querySelector<HTMLInputElement>('[data-cidr]')!;
  const outValid = root.querySelector<HTMLElement>('[data-out-valid]')!;
  const outCidr = root.querySelector<HTMLElement>('[data-out-cidr]')!;
  const outNet = root.querySelector<HTMLElement>('[data-out-net]')!;
  const outMask = root.querySelector<HTMLElement>('[data-out-mask]')!;
  const outBcast = root.querySelector<HTMLElement>('[data-out-bcast]')!;
  const outRange = root.querySelector<HTMLElement>('[data-out-range]')!;
  const outHosts = root.querySelector<HTMLElement>('[data-out-hosts]')!;

  let ip = parseIp(inIp.value);
  let cidr = parseInt(slCidr.value, 10);

  const scene = createScene(canvas, draw);

  function refresh() {
    outCidr.textContent = `/${cidr}`;
    const ok = ip !== null;
    outValid.textContent = ok ? 'ok' : 'invalide';
    outValid.style.color = ok ? 'var(--c-green)' : 'var(--c-red)';

    if (ip === null) {
      outNet.textContent = '—';
      outMask.textContent = '—';
      outBcast.textContent = '—';
      outRange.textContent = '—';
      outHosts.textContent = '—';
      return;
    }
    const mask = cidrMask(cidr);
    const net = (ip & mask) >>> 0;
    const bcast = (net | (~mask >>> 0)) >>> 0;
    const hostBits = 32 - cidr;
    const total = Math.pow(2, hostBits);

    outNet.textContent = `${ipToStr(net)}/${cidr}`;
    outMask.textContent = ipToStr(mask);
    outBcast.textContent = ipToStr(bcast);

    if (hostBits === 0) {
      outRange.textContent = `${ipToStr(net)} (hôte unique)`;
      outHosts.textContent = '1 (route /32)';
    } else if (hostBits === 1) {
      outRange.textContent = `${ipToStr(net)} – ${ipToStr(bcast)} (liaison /31)`;
      outHosts.textContent = '2 (RFC 3021)';
    } else {
      const first = (net + 1) >>> 0;
      const last = (bcast - 1) >>> 0;
      outRange.textContent = `${ipToStr(first)} – ${ipToStr(last)}`;
      outHosts.textContent = (total - 2).toLocaleString('fr-FR');
    }
  }

  function draw(s: Scene) {
    const { ctx, width: W, height: H, pal } = s;
    ctx.clearRect(0, 0, W, H);

    if (ip === null) {
      text(ctx, 'Adresse IPv4 invalide — saisis a.b.c.d (0–255).', W / 2, H / 2, {
        color: pal.red, size: 15, align: 'center', baseline: 'middle', weight: 700,
      });
      return;
    }

    const mask = cidrMask(cidr);
    const net = (ip & mask) >>> 0;

    const ipB = bits32(ip);
    const maskB = bits32(mask);
    const netB = bits32(net);

    // Disposition : 32 colonnes (4 octets de 8 bits), 3 lignes (IP, masque, ET).
    const padX = clamp(W * 0.04, 18, 48);
    const usableW = W - 2 * padX;
    const octetGap = usableW * 0.022;
    const groupW = (usableW - 3 * octetGap) / 4;
    const cellW = groupW / 8;

    const rows = [
      { label: 'Adresse', bits: ipB, color: pal.text },
      { label: 'Masque /' + cidr, bits: maskB, color: pal.purple },
      { label: 'Réseau (ET)', bits: netB, color: pal.green },
    ];
    const topY = H * 0.16;
    const rowH = clamp((H * 0.62) / 3, 26, 50);
    const cellH = rowH * 0.74;
    const fs = clamp(cellW * 0.62, 8, 15);
    const labelFs = clamp(H * 0.038, 10, 14);

    const xOfBit = (b: number) => {
      const octet = Math.floor(b / 8);
      const within = b % 8;
      return padX + octet * (groupW + octetGap) + within * cellW;
    };

    // En-tête octets (valeurs décimales de l'adresse).
    for (let o = 0; o < 4; o++) {
      const val = (ip >>> (24 - o * 8)) & 255;
      const gx = padX + o * (groupW + octetGap);
      text(ctx, String(val), gx + groupW / 2, topY - 10, {
        color: pal.muted, size: clamp(labelFs, 10, 13), align: 'center', baseline: 'bottom', weight: 700,
      });
    }

    rows.forEach((row, ri) => {
      const ry = topY + ri * rowH;
      text(ctx, row.label, padX, ry + cellH / 2, {
        color: row.color, size: labelFs, align: 'left', baseline: 'middle', weight: 700,
      });
      for (let b = 0; b < 32; b++) {
        const bx = xOfBit(b);
        const isPrefix = b < cidr;
        const bit = row.bits[b];
        // Couleur de fond selon préfixe / hôte.
        let fill: string;
        if (ri === 1) {
          fill = isPrefix ? withAlpha(s, pal.purple, 0.18) : withAlpha(s, pal.muted, 0.08);
        } else {
          fill = isPrefix ? withAlpha(s, pal.blue, 0.14) : withAlpha(s, pal.yellow, 0.12);
        }
        ctx.fillStyle = fill;
        ctx.fillRect(bx, ry, cellW - 1.5, cellH);
        const txtCol = ri === 2 ? (bit ? pal.green : pal.muted) : bit ? row.color : pal.muted;
        text(ctx, String(bit), bx + (cellW - 1.5) / 2, ry + cellH / 2, {
          color: txtCol, size: fs, align: 'center', baseline: 'middle', weight: bit ? 700 : 400,
          font: 'var(--font-mono), monospace',
        });
      }
    });

    // Frontière préfixe / hôte (ligne verticale rouge sur toute la hauteur des lignes).
    if (cidr > 0 && cidr < 32) {
      const fx = xOfBit(cidr) - 1.5;
      const yTop = topY - 4;
      const yBot = topY + 3 * rowH - rowH + cellH + 4;
      line(ctx, fx, yTop, fx, yBot, pal.red, 2, [5, 4]);
    }

    // Légende préfixe / hôte sous le tableau.
    const ly = topY + 3 * rowH + clamp(H * 0.05, 12, 24);
    const sw = clamp(W * 0.018, 10, 16);
    let lx = padX;
    const legend: Array<[string, string]> = [
      [pal.blue, `préfixe réseau : ${cidr} bit${cidr > 1 ? 's' : ''}`],
      [pal.yellow, `hôte : ${32 - cidr} bit${32 - cidr > 1 ? 's' : ''}`],
    ];
    for (const [col, lab] of legend) {
      ctx.fillStyle = withAlpha(s, col, 0.35);
      ctx.fillRect(lx, ly - sw * 0.7, sw, sw);
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(lx, ly - sw * 0.7, sw, sw);
      text(ctx, lab, lx + sw + 6, ly, {
        color: pal.text, size: clamp(labelFs, 10, 13), align: 'left', baseline: 'middle', weight: 600,
      });
      lx += sw + 10 + ctx.measureText(lab).width + 28;
    }
  }

  /** Variante translucide d'une couleur de la charte. */
  function withAlpha(s: Scene, color: string, a: number): string {
    const { pal } = s;
    const al = clamp(a, 0, 1);
    if (color === pal.blue) return `rgba(88, 196, 221, ${al})`;
    if (color === pal.green) return `rgba(131, 193, 103, ${al})`;
    if (color === pal.red) return `rgba(252, 98, 85, ${al})`;
    if (color === pal.yellow) return `rgba(255, 216, 102, ${al})`;
    if (color === pal.teal) return `rgba(92, 208, 179, ${al})`;
    if (color === pal.purple) return `rgba(195, 155, 211, ${al})`;
    return `rgba(157, 167, 179, ${al})`;
  }

  inIp.addEventListener('input', () => {
    ip = parseIp(inIp.value);
    refresh();
    scene.requestDraw();
  });
  slCidr.addEventListener('input', () => {
    cidr = parseInt(slCidr.value, 10);
    refresh();
    scene.requestDraw();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-iw="reseau-sousreseau"]').forEach(init);
