import { palette, fmt } from './_canvas';

/**
 * Tokeniseur de DÉMONSTRATION inspiré de BPE (pas le vrai vocabulaire d'un
 * modèle). Règles volontairement simples mais réalistes dans leurs effets :
 *  - les chiffres sont coupés par groupes de 1 à 3 (les vrais tokeniseurs
 *    fragmentent les longs nombres) ;
 *  - les mots fréquents (liste courte) restent entiers ;
 *  - les mots longs/rares sont coupés en morceaux de quelques lettres ;
 *  - la ponctuation et les emojis sont des tokens isolés ;
 *  - l'espace est rattaché au token suivant (préfixe ▁ visible).
 */

const COMMON = new Set([
  'le', 'la', 'les', 'un', 'une', 'de', 'des', 'du', 'et', 'en', 'à', 'au', 'aux',
  'il', 'elle', 'ils', 'on', 'ne', 'pas', 'plus', 'que', 'qui', 'est', 'sont',
  'pour', 'dans', 'sur', 'avec', 'car', 'mais', 'son', 'sa', 'ses', 'ce', 'cette',
  'coute', 'coûte', 'porte', 'rue', 'animal', 'était', 'fatigué', 'ouvre', 'clé',
  'the', 'and', 'for', 'def', 'return', 'print', 'function',
]);

interface Tok { text: string; kind: 'word' | 'sub' | 'num' | 'punct' | 'emoji' | 'space'; }

function splitWord(w: string): Tok[] {
  const lower = w.toLowerCase();
  if (COMMON.has(lower) || w.length <= 4) return [{ text: w, kind: 'word' }];
  // découpe en morceaux de 3-4 lettres (simulacre de sous-mots)
  const out: Tok[] = [];
  let i = 0;
  const sizes = [4, 3, 4, 3, 3];
  let si = 0;
  while (i < w.length) {
    const size = sizes[si % sizes.length];
    out.push({ text: w.slice(i, i + size), kind: 'sub' });
    i += size; si++;
  }
  return out;
}

function tokenize(text: string): Tok[] {
  const toks: Tok[] = [];
  // regex : mots (lettres accentuées), nombres, espaces, autres (ponctuation/emoji)
  const re = /([A-Za-zÀ-ÖØ-öø-ÿ]+)|([0-9]+)|(\s+)|([^\sA-Za-zÀ-ÖØ-öø-ÿ0-9]+)/gu;
  let m: RegExpExecArray | null;
  let pendingSpace = false;
  while ((m = re.exec(text)) !== null) {
    if (m[3] !== undefined) { // espaces
      // on les rattache au token suivant (marqueur ▁) sauf saut de ligne visible
      pendingSpace = true;
      continue;
    }
    const prefix = pendingSpace ? '▁' : '';
    pendingSpace = false;
    if (m[1] !== undefined) { // mot
      const parts = splitWord(m[1]);
      parts.forEach((p, idx) => toks.push({ text: (idx === 0 ? prefix : '') + p.text, kind: idx === 0 ? p.kind : (p.kind === 'word' ? 'word' : 'sub') }));
    } else if (m[2] !== undefined) { // nombre : groupes de ≤3 chiffres
      const digits = m[2];
      let i = 0; let first = true;
      while (i < digits.length) {
        const chunk = digits.slice(i, i + 3);
        toks.push({ text: (first ? prefix : '') + chunk, kind: 'num' });
        i += 3; first = false;
      }
    } else if (m[4] !== undefined) { // ponctuation ou emoji
      // emojis : un caractère non ASCII « large » → token isolé
      const chars = Array.from(m[4]);
      chars.forEach((ch, idx) => {
        const isEmoji = ch.codePointAt(0)! > 0x2000 && !/[À-ÖØ-öø-ÿ]/.test(ch);
        toks.push({ text: (idx === 0 ? prefix : '') + ch, kind: isEmoji ? 'emoji' : 'punct' });
      });
    }
  }
  return toks;
}

const EXAMPLES = [
  "L'anticonstitutionnellement est un mot très rare",
  'Le total est 1234567,89 euros en 2024',
  'def fibonacci(n): return n if n < 2 else fib(n-1)+fib(n-2)',
  'Bravo 🎉 c\'est super 🙂 trop bien 🚀',
];

function init(root: HTMLElement) {
  const input = root.querySelector<HTMLTextAreaElement>('[data-input]')!;
  const box = root.querySelector<HTMLElement>('[data-tokens]')!;
  const outChars = root.querySelector<HTMLElement>('[data-out-chars]')!;
  const outTokens = root.querySelector<HTMLElement>('[data-out-tokens]')!;
  const outRatio = root.querySelector<HTMLElement>('[data-out-ratio]')!;
  const exBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ex]'));

  function colorFor(kind: Tok['kind']): string {
    const p = palette();
    switch (kind) {
      case 'word': return p.blue;
      case 'sub': return p.purple;
      case 'num': return p.green;
      case 'punct': return p.muted;
      case 'emoji': return p.yellow;
      default: return p.muted;
    }
  }

  function render() {
    const text = input.value;
    const toks = tokenize(text);
    box.textContent = '';
    for (const t of toks) {
      const span = document.createElement('span');
      span.className = 'tk';
      span.style.setProperty('--tk', colorFor(t.kind));
      // rend le marqueur d'espace plus discret
      if (t.text.startsWith('▁')) {
        const s1 = document.createElement('span');
        s1.className = 'tk-space';
        s1.textContent = '▁';
        span.appendChild(s1);
        span.appendChild(document.createTextNode(t.text.slice(1)));
      } else {
        span.textContent = t.text;
      }
      span.title = `type : ${t.kind}`;
      box.appendChild(span);
    }
    const charCount = Array.from(text).length;
    outChars.textContent = String(charCount);
    outTokens.textContent = String(toks.length);
    outRatio.textContent = toks.length ? fmt(charCount / toks.length, 2) : '—';
  }

  input.addEventListener('input', render);
  exBtns.forEach((btn) => btn.addEventListener('click', () => {
    input.value = EXAMPLES[+btn.dataset.ex!];
    render();
    input.focus();
  }));

  render();
}

document.querySelectorAll<HTMLElement>('[data-iw="ia-token"]').forEach(init);
