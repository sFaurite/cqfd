/**
 * MathsDeductionNaturelle — le jeu de la déduction naturelle.
 * Le lecteur construit une preuve à la Fitch avec exactement les règles du
 * chapitre 1 : hypothèses locales ouvertes puis déchargées (preuve sous
 * hypothèse, absurde), introduction/élimination de chaque connecteur,
 * contradiction, explosion, tiers exclu. Vérification instantanée, en pur
 * TypeScript — aucun moteur externe.
 * Progression sauvegardée par exercice (localStorage), compteur de réussites,
 * et mode corrigé pas à pas avec explication à chaque étape.
 */

export {};

type F =
  | { k: 'atom'; n: string }
  | { k: 'bot' }
  | { k: 'not'; a: F }
  | { k: 'and' | 'or' | 'imp'; a: F; b: F };

const atom = (n: string): F => ({ k: 'atom', n });
const BOT: F = { k: 'bot' };
const neg = (a: F): F => ({ k: 'not', a });
const et = (a: F, b: F): F => ({ k: 'and', a, b });
const ou = (a: F, b: F): F => ({ k: 'or', a, b });
const imp = (a: F, b: F): F => ({ k: 'imp', a, b });

function eq(x: F, y: F): boolean {
  if (x.k !== y.k) return false;
  if (x.k === 'atom') return x.n === (y as { k: 'atom'; n: string }).n;
  if (x.k === 'bot') return true;
  if (x.k === 'not') return eq(x.a, (y as { k: 'not'; a: F }).a);
  const yy = y as { k: string; a: F; b: F };
  return eq(x.a, yy.a) && eq(x.b, yy.b);
}

/** Affichage avec parenthèses minimales. Priorités : ¬ (4) > ∧ (3) > ∨ (2) > ⇒ (1, assoc. droite). */
function show(f: F, ctx = 0): string {
  const wrap = (lvl: number, s: string) => (lvl < ctx ? `(${s})` : s);
  switch (f.k) {
    case 'atom': return f.n;
    case 'bot': return '⊥';
    case 'not': return wrap(4, '¬' + show(f.a, 4));
    case 'and': return wrap(3, show(f.a, 4) + ' ∧ ' + show(f.b, 4));
    case 'or': return wrap(2, show(f.a, 3) + ' ∨ ' + show(f.b, 3));
    case 'imp': return wrap(1, show(f.a, 2) + ' ⇒ ' + show(f.b, 1));
  }
}

/* ------------------------------ mini-parseur ------------------------------ */

type Tok = { t: 'not' | 'and' | 'or' | 'imp' | 'lp' | 'rp' | 'bot' | 'atom'; n?: string };

function tokenize(src: string): Tok[] | string {
  const out: Tok[] = [];
  let i = 0;
  const s = src;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '(') { out.push({ t: 'lp' }); i++; continue; }
    if (c === ')') { out.push({ t: 'rp' }); i++; continue; }
    if (c === '¬' || c === '!' || c === '~') { out.push({ t: 'not' }); i++; continue; }
    if (c === '∧' || c === '&' || c === '·') { out.push({ t: 'and' }); i++; continue; }
    if (c === '∨' || c === '|' || c === '+') { out.push({ t: 'or' }); i++; continue; }
    if (c === '⇒' || c === '→') { out.push({ t: 'imp' }); i++; continue; }
    if (c === '⊥' || c === '#') { out.push({ t: 'bot' }); i++; continue; }
    if (s.startsWith('=>', i) || s.startsWith('->', i)) { out.push({ t: 'imp' }); i += 2; continue; }
    if (s.startsWith('/\\', i)) { out.push({ t: 'and' }); i += 2; continue; }
    if (s.startsWith('\\/', i)) { out.push({ t: 'or' }); i += 2; continue; }
    const word = /^(non|not|et|and|ou|or|faux|absurde)\b/i.exec(s.slice(i));
    if (word) {
      const w = word[1].toLowerCase();
      out.push({ t: w === 'non' || w === 'not' ? 'not' : w === 'et' || w === 'and' ? 'and' : w === 'ou' || w === 'or' ? 'or' : 'bot' });
      i += word[1].length; continue;
    }
    if (/[A-Za-z]/.test(c)) { out.push({ t: 'atom', n: c.toUpperCase() }); i++; continue; }
    return `symbole inattendu « ${c} »`;
  }
  return out;
}

function parseFormula(src: string): F | string {
  const toks = tokenize(src);
  if (typeof toks === 'string') return toks;
  if (toks.length === 0) return 'formule vide';
  let p = 0;
  const peek = () => toks[p];
  const eat = () => toks[p++];
  function prim(): F | string {
    const t = peek();
    if (!t) return 'formule incomplète';
    if (t.t === 'atom') { eat(); return atom(t.n as string); }
    if (t.t === 'bot') { eat(); return BOT; }
    if (t.t === 'not') { eat(); const a = prim(); return typeof a === 'string' ? a : neg(a); }
    if (t.t === 'lp') {
      eat(); const a = pImp();
      if (typeof a === 'string') return a;
      if (!peek() || peek().t !== 'rp') return 'parenthèse fermante manquante';
      eat(); return a;
    }
    return 'formule mal formée';
  }
  function pAnd(): F | string {
    let a = prim();
    if (typeof a === 'string') return a;
    while (peek() && peek().t === 'and') { eat(); const b = prim(); if (typeof b === 'string') return b; a = et(a, b); }
    return a;
  }
  function pOr(): F | string {
    let a = pAnd();
    if (typeof a === 'string') return a;
    while (peek() && peek().t === 'or') { eat(); const b = pAnd(); if (typeof b === 'string') return b; a = ou(a, b); }
    return a;
  }
  function pImp(): F | string {
    const a = pOr();
    if (typeof a === 'string') return a;
    if (peek() && peek().t === 'imp') { eat(); const b = pImp(); return typeof b === 'string' ? b : imp(a, b); }
    return a;
  }
  const f = pImp();
  if (typeof f === 'string') return f;
  if (p !== toks.length) return 'symboles en trop après la formule';
  return f;
}

/* -------------------------------- exercices ------------------------------- */

const A = atom('A'), B = atom('B'), C = atom('C');

/** Une étape de corrigé : sélection, règle, formule éventuelle, et l'explication. */
type Step = {
  sel?: number[];
  rule: 'mp' | 'andintro' | 'andelima' | 'andelimb' | 'orelim' | 'notelim' | 'impintro' | 'notintro' | 'supposer' | 'orintro' | 'explosion' | 'tiers' | 'dne';
  f?: string;
  side?: 'left' | 'right';
  expl: string;
};

type Ex = { titre: string; premisses: F[]; but: F; aide: string; corrige: Step[] };

const EXOS: Ex[] = [
  {
    titre: '1. Échauffement — le modus ponens',
    premisses: [A, imp(A, B)], but: B,
    aide: 'Sélectionnez les deux prémisses (cliquez-les), puis « modus ponens ».',
    corrige: [
      { sel: [0, 1], rule: 'mp', expl: 'Les deux prémisses ont exactement la forme du modus ponens : de A (ligne 1) et de A ⇒ B (ligne 2), la règle d’élimination de ⇒ livre B. Un seul pas, et le but est atteint au niveau zéro.' },
    ],
  },
  {
    titre: '2. Commutativité du ∧',
    premisses: [et(A, B)], but: et(B, A),
    aide: 'Extrayez chaque moitié (élimination de ∧), puis recollez-les dans l’autre ordre.',
    corrige: [
      { sel: [0], rule: 'andelimb', expl: 'L’élimination de ∧ permet de garder une moitié : de A ∧ B, on extrait la moitié droite, B. (On commence par elle : c’est elle qui devra être à gauche à l’arrivée.)' },
      { sel: [0], rule: 'andelima', expl: 'Même règle, autre moitié : de A ∧ B on extrait A. Les deux morceaux sont maintenant des lignes indépendantes — l’ordre du ∧ d’origine est oublié.' },
      { sel: [1, 2], rule: 'andintro', expl: 'L’introduction de ∧ recolle deux lignes établies, dans l’ordre où on les cite : B (ligne 2) puis A (ligne 3) donnent B ∧ A. CQFD — la commutativité du ∧ n’est pas un axiome, c’est trois applications de règles.' },
    ],
  },
  {
    titre: '3. Commutativité du ∨ — celle qui exige les deux introductions',
    premisses: [ou(A, B)], but: ou(B, A),
    aide: 'Supposez A, concluez B ∨ A, refermez (⇒) ; même chose depuis B ; terminez par le raisonnement par cas.',
    corrige: [
      { rule: 'supposer', f: 'A', expl: 'On ne sait pas lequel de A ou B est vrai : il faut traiter les deux cas. Premier cas — supposons A. La preuve s’indente : cette hypothèse devra être refermée.' },
      { sel: [1], rule: 'orintro', f: 'B', side: 'left', expl: 'De A, l’introduction de ∨ donne B ∨ A — en plaçant A à droite. C’est ici que la *seconde* version de la règle est indispensable : avec la seule version « de A, déduire A ∨ B », impossible de mettre A du bon côté.' },
      { rule: 'impintro', expl: 'On referme l’hypothèse : la preuve sous hypothèse conclut A ⇒ B ∨ A et décharge A. Remarquez l’indentation qui se grise : ces lignes ne sont plus citables.' },
      { rule: 'supposer', f: 'B', expl: 'Second cas — supposons B, même plan de bataille.' },
      { sel: [4], rule: 'orintro', f: 'A', side: 'right', expl: 'De B, l’introduction de ∨ (première version, cette fois) donne B ∨ A — B reste à gauche.' },
      { rule: 'impintro', expl: 'On referme : B ⇒ B ∨ A. Nous voici armés des deux implications qu’exige le raisonnement par cas.' },
      { sel: [0, 3, 6], rule: 'orelim', expl: 'Le raisonnement par cas (élimination de ∨) : de A ∨ B, de A ⇒ B ∨ A et de B ⇒ B ∨ A, on conclut B ∨ A — sans jamais savoir lequel des deux cas est le vrai. CQFD.' },
    ],
  },
  {
    titre: '4. Transitivité de ⇒',
    premisses: [imp(A, B), imp(B, C)], but: imp(A, C),
    aide: 'Supposez A, enchaînez deux modus ponens, refermez l’hypothèse.',
    corrige: [
      { rule: 'supposer', f: 'A', expl: 'Pour prouver une implication A ⇒ C, le geste canonique : supposer A et viser C.' },
      { sel: [2, 0], rule: 'mp', expl: 'Premier maillon : A (l’hypothèse) et A ⇒ B (prémisse 1) donnent B par modus ponens.' },
      { sel: [3, 1], rule: 'mp', expl: 'Second maillon : B et B ⇒ C (prémisse 2) donnent C. La chaîne est complète — sous hypothèse.' },
      { rule: 'impintro', expl: 'On referme : la preuve sous hypothèse conclut A ⇒ C et décharge A. Le théorème ne dépend plus d’aucune hypothèse locale — c’est la définition même de la démonstration du chapitre.' },
    ],
  },
  {
    titre: '5. La contraposée',
    premisses: [imp(A, B)], but: imp(neg(B), neg(A)),
    aide: 'Supposez ¬B ; puis, à l’intérieur, supposez A et fabriquez la contradiction — deux décharges successives.',
    corrige: [
      { rule: 'supposer', f: 'non B', expl: 'Le but est ¬B ⇒ ¬A : on suppose donc ¬B, et l’on vise ¬A.' },
      { rule: 'supposer', f: 'A', expl: 'Pour prouver ¬A, la réduction à l’absurde : on suppose A — deuxième hypothèse imbriquée, l’indentation le montre — et l’on cherche la contradiction.' },
      { sel: [2, 0], rule: 'mp', expl: 'A et la prémisse A ⇒ B donnent B… qui va heurter de front notre première hypothèse.' },
      { sel: [3, 1], rule: 'notelim', expl: 'B (ligne 4) et ¬B (ligne 2) : contradiction — la règle produit ⊥.' },
      { rule: 'notintro', expl: 'La réduction à l’absurde referme l’hypothèse A : supposer A mène à ⊥, donc ¬A. Première décharge.' },
      { rule: 'impintro', expl: 'La preuve sous hypothèse referme ¬B : on conclut ¬B ⇒ ¬A. Seconde décharge, niveau zéro — la contraposée est un théorème, pas un réflexe.' },
    ],
  },
  {
    titre: '6. La double négation (sens facile)',
    premisses: [A], but: neg(neg(A)),
    aide: 'Supposez ¬A : la contradiction avec la prémisse est immédiate ; refermez par l’absurde.',
    corrige: [
      { rule: 'supposer', f: 'non A', expl: 'Pour prouver ¬¬A, on suppose son contraire intérieur : ¬A. (Notez qu’on ne suppose pas ¬¬¬A — on vise l’introduction de ¬ sur ¬A.)' },
      { sel: [0, 1], rule: 'notelim', expl: 'La prémisse A et l’hypothèse ¬A se contredisent : ⊥, immédiatement.' },
      { rule: 'notintro', expl: 'Supposer ¬A mène à l’absurde, donc ¬¬A — sans tiers exclu : ce sens de la double négation est valide même en logique intuitionniste, comme le signale le chapitre. CQFD.' },
    ],
  },
  {
    titre: '7. Le boss : la non-contradiction, sans aucune prémisse',
    premisses: [], but: neg(et(A, neg(A))),
    aide: 'Supposez A ∧ ¬A, séparez les deux moitiés, produisez ⊥, refermez par l’absurde.',
    corrige: [
      { rule: 'supposer', f: 'A et non A', expl: 'Aucune prémisse : tout doit sortir des règles seules. On suppose l’énoncé fautif, A ∧ ¬A, pour le réduire à l’absurde.' },
      { sel: [0], rule: 'andelima', expl: 'L’élimination de ∧ en extrait la moitié gauche : A.' },
      { sel: [0], rule: 'andelimb', expl: 'Et la moitié droite : ¬A. La contradiction est maintenant à découvert, en deux lignes séparées.' },
      { sel: [1, 2], rule: 'notelim', expl: 'A et ¬A : ⊥.' },
      { rule: 'notintro', expl: 'La décharge conclut ¬(A ∧ ¬A) au niveau zéro, à partir de rien : le principe de non-contradiction est un théorème de la logique seule. Vous avez terminé les sept exercices !' },
    ],
  },
];

/* --------------------------------- état ---------------------------------- */

type Line = { f: F; depth: number; just: string; hyp: boolean; closed: boolean };
type Pending = null | { kind: 'supposer' | 'orIntro' | 'explosion' | 'tiers' };

let exIdx = 0;
let lines: Line[] = [];
let open: number[] = [];
let sel: number[] = [];
let done = false;
let pending: Pending = null;
let history: string[] = [];
let demo: { idx: number } | null = null;
let demoAnimating = false;
let demoToken = 0;
let demoSpeed = 1;
let demoSnapshots: string[] = [];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
/** Pause du corrigé, modulée par le réglage de vitesse. */
const dsleep = (ms: number) => sleep(ms / demoSpeed);

const RULE_BTN: Record<Step['rule'], string> = {
  mp: '[data-r-mp]', andintro: '[data-r-andintro]', andelima: '[data-r-andelima]',
  andelimb: '[data-r-andelimb]', orelim: '[data-r-orelim]', notelim: '[data-r-notelim]',
  impintro: '[data-r-impintro]', notintro: '[data-r-notintro]', supposer: '[data-r-supposer]',
  orintro: '[data-r-orintro]', explosion: '[data-r-explosion]', tiers: '[data-r-tiers]', dne: '[data-r-dne]',
};

/* ------------------------- persistance & réussites ------------------------ */

const LS_KEY = 'cqfd-ndj-v1';

type SavedEx = { lines: Line[]; open: number[]; done: boolean };
type Saved = { solved: number[]; ex: Record<string, SavedEx> };

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Saved;
  } catch { /* stockage indisponible : on joue sans mémoire */ }
  return { solved: [], ex: {} };
}
let saved: Saved = loadSaved();

function persist(): void {
  try { localStorage.setItem(LS_KEY, JSON.stringify(saved)); } catch { /* tant pis */ }
}

function saveCurrent(): void {
  if (demo) return; // le corrigé ne remplace pas votre brouillon
  saved.ex[String(exIdx)] = { lines, open, done };
  persist();
}

function markSolved(): void {
  if (demo) return; // le corrigé instruit, il ne compte pas comme une réussite
  if (!saved.solved.includes(exIdx)) { saved.solved.push(exIdx); persist(); }
}

/* --------------------------------- moteur -------------------------------- */

function snapshot(): void {
  history.push(JSON.stringify({ lines, open, done }));
  if (history.length > 200) history.shift();
}
function undo(): void {
  const prev = history.pop();
  if (!prev) return;
  const st = JSON.parse(prev);
  lines = st.lines; open = st.open; done = st.done; sel = []; pending = null;
  saveCurrent();
  render('un pas en arrière.');
}

function freshState(i: number): void {
  lines = EXOS[i].premisses.map((f) => ({ f, depth: 0, just: 'prémisse', hyp: false, closed: false }));
  open = []; sel = []; done = false; pending = null; history = [];
}

function loadEx(i: number, opts?: { fresh?: boolean }): void {
  exIdx = i;
  demoToken++;
  demoAnimating = false;
  demo = null;
  const keep = !opts?.fresh && saved.ex[String(i)];
  if (keep) {
    const st = saved.ex[String(i)];
    lines = st.lines.map((l) => ({ ...l }));
    open = [...st.open]; done = st.done;
    sel = []; pending = null; history = [];
  } else {
    freshState(i);
  }
  const exSel = root?.querySelector<HTMLSelectElement>('[data-ex]');
  if (exSel) exSel.value = String(i);
  render(keep && lines.length > EXOS[i].premisses.length ? 'Votre brouillon est resté tel que vous l’aviez laissé.' : EXOS[i].aide);
}

function addLine(f: F, just: string): void {
  lines.push({ f, depth: open.length, just, hyp: false, closed: false });
  const ex = EXOS[exIdx];
  if (open.length === 0 && eq(f, ex.but)) { done = true; markSolved(); }
}

const num = (i: number) => String(i + 1);

function ruleSupposer(f: F): string | null {
  lines.push({ f, depth: open.length + 1, just: 'hypothèse locale', hyp: true, closed: false });
  open.push(lines.length - 1);
  return null;
}

function ruleImpIntro(): string | null {
  if (open.length === 0) return 'Aucune hypothèse n’est ouverte : rien à décharger.';
  const h = open[open.length - 1];
  const last = lines[lines.length - 1];
  open.pop();
  const hf = lines[h].f;
  for (let i = h; i < lines.length; i++) lines[i].closed = true;
  addLine(imp(hf, last.f), `preuve sous hypothèse (${num(h)}–${num(lines.length - 1)})`);
  return null;
}

function ruleNotIntro(): string | null {
  if (open.length === 0) return 'Aucune hypothèse n’est ouverte : rien à décharger.';
  const last = lines[lines.length - 1];
  if (!eq(last.f, BOT)) return 'L’absurde exige que la dernière ligne soit la contradiction ⊥ (utilisez « contradiction »).';
  const h = open[open.length - 1];
  open.pop();
  const hf = lines[h].f;
  for (let i = h; i < lines.length; i++) lines[i].closed = true;
  addLine(neg(hf), `réduction à l’absurde (${num(h)}–${num(lines.length - 1)})`);
  return null;
}

function need(n: number): string | null {
  if (sel.length !== n) return `Sélectionnez d’abord ${n} ligne${n > 1 ? 's' : ''} (cliquez-les).`;
  return null;
}

function ruleModusPonens(): string | null {
  const e = need(2); if (e) return e;
  const [i, j] = sel;
  const tryIt = (x: number, y: number): F | null => {
    const g = lines[y].f;
    return g.k === 'imp' && eq(g.a, lines[x].f) ? g.b : null;
  };
  const r = tryIt(i, j) ?? tryIt(j, i);
  if (!r) return 'Il faut une ligne A et une ligne A ⇒ B.';
  addLine(r, `modus ponens (${num(Math.min(i, j))}, ${num(Math.max(i, j))})`);
  return null;
}

function ruleAndIntro(): string | null {
  const e = need(2); if (e) return e;
  const [i, j] = sel;
  addLine(et(lines[i].f, lines[j].f), `introduction de ∧ (${num(i)}, ${num(j)})`);
  return null;
}

function ruleAndElim(side: 'a' | 'b'): string | null {
  const e = need(1); if (e) return e;
  const f = lines[sel[0]].f;
  if (f.k !== 'and') return 'Sélectionnez une ligne de la forme A ∧ B.';
  addLine(side === 'a' ? f.a : f.b, `élimination de ∧ (${num(sel[0])})`);
  return null;
}

function ruleOrIntro(t: F, side: 'right' | 'left'): string | null {
  const e = need(1); if (e) return e;
  const f = lines[sel[0]].f;
  addLine(side === 'right' ? ou(f, t) : ou(t, f), `introduction de ∨ (${num(sel[0])})`);
  return null;
}

function ruleOrElim(): string | null {
  const e = need(3); if (e) return e;
  const fs = sel.map((i) => lines[i].f);
  for (let d = 0; d < 3; d++) {
    const disj = fs[d];
    if (disj.k !== 'or') continue;
    const others = fs.filter((_, k) => k !== d);
    for (const [u, v] of [[0, 1], [1, 0]] as const) {
      const g1 = others[u], g2 = others[v];
      if (g1.k === 'imp' && g2.k === 'imp' && eq(g1.a, disj.a) && eq(g2.a, disj.b) && eq(g1.b, g2.b)) {
        addLine(g1.b, `raisonnement par cas (${sel.map(num).sort((a, b) => +a - +b).join(', ')})`);
        return null;
      }
    }
  }
  return 'Il faut trois lignes : A ∨ B, A ⇒ C et B ⇒ C.';
}

function ruleNotElim(): string | null {
  const e = need(2); if (e) return e;
  const [i, j] = sel;
  const isContr = (x: number, y: number) => { const g = lines[y].f; return g.k === 'not' && eq(g.a, lines[x].f); };
  if (!isContr(i, j) && !isContr(j, i)) return 'Il faut une ligne A et une ligne ¬A.';
  addLine(BOT, `contradiction (${num(Math.min(i, j))}, ${num(Math.max(i, j))})`);
  return null;
}

function ruleExplosion(t: F): string | null {
  const e = need(1); if (e) return e;
  if (!eq(lines[sel[0]].f, BOT)) return 'L’explosion part de la contradiction ⊥ : sélectionnez une ligne ⊥.';
  addLine(t, `explosion (${num(sel[0])})`);
  return null;
}

function ruleTiers(t: F): string | null {
  addLine(ou(t, neg(t)), 'tiers exclu');
  return null;
}

function ruleDne(): string | null {
  const e = need(1); if (e) return e;
  const f = lines[sel[0]].f;
  if (f.k !== 'not' || f.a.k !== 'not') return 'Sélectionnez une ligne de la forme ¬¬A.';
  addLine(f.a.a, `double négation (${num(sel[0])}) — tiers exclu`);
  return null;
}

/* ------------------------------ mode corrigé ------------------------------ */

function runStep(step: Step): string | null {
  sel = step.sel ? [...step.sel] : [];
  const parse = (): F | string => parseFormula(step.f ?? '');
  switch (step.rule) {
    case 'supposer': { const f = parse(); return typeof f === 'string' ? f : ruleSupposer(f); }
    case 'orintro': { const f = parse(); return typeof f === 'string' ? f : ruleOrIntro(f, step.side ?? 'right'); }
    case 'explosion': { const f = parse(); return typeof f === 'string' ? f : ruleExplosion(f); }
    case 'tiers': { const f = parse(); return typeof f === 'string' ? f : ruleTiers(f); }
    case 'impintro': return ruleImpIntro();
    case 'notintro': return ruleNotIntro();
    case 'mp': return ruleModusPonens();
    case 'andintro': return ruleAndIntro();
    case 'andelima': return ruleAndElim('a');
    case 'andelimb': return ruleAndElim('b');
    case 'orelim': return ruleOrElim();
    case 'notelim': return ruleNotElim();
    case 'dne': return ruleDne();
  }
}

function startDemo(): void {
  demoToken++;
  demoAnimating = false;
  demoSnapshots = [];
  freshState(exIdx);
  demo = { idx: 0 };
  render(`Corrigé pas à pas — ${EXOS[exIdx].corrige.length} étapes. Cliquez « étape suivante » : chaque pas est mimé (sélections, clic de règle, saisie) puis expliqué. Réglez la vitesse à votre main, et « rejouer l’étape » repasse le dernier geste. (Le corrigé ne compte pas comme une réussite !)`);
}

/** Mime l'appui sur un bouton : halo + enfoncement, le temps d'un regard. */
async function pressButton(selector: string, token: number): Promise<void> {
  const b = root?.querySelector<HTMLElement>(selector);
  if (!b) return;
  b.classList.add('is-demo-press');
  b.scrollIntoView({ block: 'nearest' });
  await dsleep(700);
  b.classList.remove('is-demo-press');
  if (token !== demoToken) return;
}

/** Mime le clic sur une ligne : pulsation au moment où elle rejoint la sélection. */
function pulseLine(i: number, statusMsg: string): void {
  render(statusMsg);
  const li = root?.querySelectorAll<HTMLElement>('.ndj__line')[i];
  li?.classList.add('is-demo-click');
  li?.scrollIntoView({ block: 'nearest' });
}

async function demoNext(): Promise<void> {
  if (!root || !demo || demoAnimating) return;
  const steps = EXOS[exIdx].corrige;
  if (demo.idx >= steps.length) return;
  const step = steps[demo.idx];
  demoSnapshots[demo.idx] = JSON.stringify({ lines, open });
  demo.idx += 1;
  const token = ++demoToken;
  demoAnimating = true;
  const head = `Étape ${demo.idx}/${steps.length} — ${step.expl}`;
  render(head);

  // 1. les sélections de lignes, une à une
  sel = [];
  for (const i of step.sel ?? []) {
    await dsleep(700);
    if (token !== demoToken) return;
    sel.push(i);
    pulseLine(i, head);
  }

  // 2. le clic sur le bouton de règle
  await dsleep(600);
  if (token !== demoToken) return;
  await pressButton(RULE_BTN[step.rule], token);
  if (token !== demoToken) return;

  // 3. la saisie éventuelle : la barre s'ouvre, la formule se tape, OK (ou le côté du ∨)
  if (step.f !== undefined) {
    pending = { kind: step.rule === 'orintro' ? 'orIntro' : step.rule === 'explosion' ? 'explosion' : step.rule === 'tiers' ? 'tiers' : 'supposer' };
    render(head);
    const input = root.querySelector<HTMLInputElement>('[data-input]')!;
    input.value = '';
    for (const ch of step.f) {
      await dsleep(85);
      if (token !== demoToken) return;
      input.value += ch;
    }
    await dsleep(500);
    if (token !== demoToken) return;
    await pressButton(step.rule === 'orintro' ? `[data-orside="${step.side ?? 'right'}"]` : '[data-inputok]', token);
    if (token !== demoToken) return;
    pending = null;
  }

  // 4. la règle s'applique pour de vrai
  const e = runStep(step);
  sel = [];
  demoAnimating = false;
  if (e) { render(`(bug du corrigé : ${e})`, true); return; }
  render(head);
}

/** Rembobine l'état d'une étape (sans la rejouer). Renvoie true si le retour a eu lieu. */
function demoRewind(): boolean {
  if (!demo || demoAnimating || demo.idx === 0) return false;
  const snap = demoSnapshots[demo.idx - 1];
  if (!snap) return false;
  const st = JSON.parse(snap) as { lines: Line[]; open: number[] };
  lines = st.lines; open = st.open; done = false; sel = []; pending = null;
  demo.idx -= 1;
  return true;
}

/** « étape précédente » : revient d'un pas et raconte où l'on en est. */
function demoPrev(): void {
  if (!demo || !demoRewind()) return;
  const steps = EXOS[exIdx].corrige;
  render(demo.idx === 0
    ? 'Retour au départ du corrigé. « étape suivante » rejoue le premier geste.'
    : `Retour à l’étape ${demo.idx}/${steps.length} — ${steps[demo.idx - 1].expl}`);
}

/** Revient à l'état d'avant la dernière étape et la rejoue, animation comprise. */
function demoReplay(): void {
  if (!demo || !demoRewind()) return;
  void demoNext();
}

function quitDemo(): void {
  demoToken++;
  demoAnimating = false;
  pending = null;
  demo = null;
  loadEx(exIdx);
}

/* ---------------------------------- DOM ----------------------------------- */

const root = document.querySelector<HTMLElement>('[data-iw="deduction-naturelle"]');

function render(msg?: string, isError = false): void {
  if (!root) return;
  const ex = EXOS[exIdx];

  const goal = root.querySelector<HTMLElement>('[data-goal]')!;
  const prem = ex.premisses.map((f) => show(f)).join(' , ') || '(aucune prémisse)';
  goal.innerHTML = `<span class="ndj__prem">${prem}</span> <span class="ndj__turnstile">⊢</span> <span class="ndj__but">${show(ex.but)}</span>`;

  const ol = root.querySelector<HTMLElement>('[data-proof]')!;
  ol.innerHTML = '';
  lines.forEach((l, i) => {
    const li = document.createElement('li');
    li.className = 'ndj__line' + (l.closed ? ' is-closed' : '') + (l.hyp ? ' is-hyp' : '') + (sel.includes(i) ? ' is-sel' : '')
      + (demo && i === lines.length - 1 && !l.closed ? ' is-fresh' : '');
    li.style.setProperty('--d', String(l.depth));
    li.innerHTML = `<span class="ndj__no">${i + 1}</span><span class="ndj__f">${show(l.f)}</span><span class="ndj__just">${l.just}</span>`;
    if (!l.closed && !done && !demo) {
      li.tabIndex = 0;
      li.addEventListener('click', () => {
        const p = sel.indexOf(i);
        if (p >= 0) sel.splice(p, 1); else sel.push(i);
        render();
      });
      li.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); li.click(); } });
    }
    ol.appendChild(li);
  });

  const status = root.querySelector<HTMLElement>('[data-status]')!;
  if (done && !demo) {
    status.className = 'ndj__status is-done';
    status.innerHTML = `✓ <b>CQFD</b> — ${show(ex.but)} est démontré, toutes les hypothèses refermées.` +
      (exIdx < EXOS.length - 1 ? ' <button class="iw__btn ndj__next" data-next>exercice suivant →</button>' : ' Vous avez terminé les sept exercices !');
    status.querySelector('[data-next]')?.addEventListener('click', () => loadEx(exIdx + 1));
  } else if (demo) {
    const finished = demo.idx >= ex.corrige.length;
    status.className = 'ndj__status is-demo';
    status.textContent = (msg ?? '') + (finished ? ' — Corrigé terminé. « quitter le corrigé » vous rend la main pour le refaire vous-même.' : '');
  } else {
    status.className = 'ndj__status' + (isError ? ' is-err' : '');
    status.textContent = msg ?? ex.aide;
  }

  const inputRow = root.querySelector<HTMLElement>('[data-inputrow]')!;
  inputRow.hidden = pending === null;
  if (pending) {
    const label = root.querySelector<HTMLElement>('[data-inputlabel]')!;
    label.textContent =
      pending.kind === 'supposer' ? 'Hypothèse à ouvrir :' :
      pending.kind === 'orIntro' ? 'Formule à ajouter au « ou » :' :
      pending.kind === 'explosion' ? 'Formule à conclure de ⊥ :' :
      'Formule A du tiers exclu (A ∨ ¬A) :';
    root.querySelectorAll<HTMLElement>('[data-orside]').forEach((b) => { b.hidden = pending!.kind !== 'orIntro'; });
    root.querySelector<HTMLElement>('[data-inputok]')!.hidden = pending.kind === 'orIntro';
    if (!demo) root.querySelector<HTMLInputElement>('[data-input]')!.focus();
  }

  // score + menu déroulant décoré
  const score = root.querySelector<HTMLElement>('[data-score]');
  if (score) score.textContent = `${saved.solved.length}/${EXOS.length}`;
  const exSel = root.querySelector<HTMLSelectElement>('[data-ex]');
  if (exSel) {
    [...exSel.options].forEach((o, i) => {
      o.textContent = (saved.solved.includes(i) ? '✓ ' : '') + EXOS[i].titre;
    });
  }

  // boutons : gel pendant le corrigé et après la victoire
  root.querySelectorAll<HTMLButtonElement>('.ndj__rules button').forEach((b) => {
    const isDemoCtl = b.hasAttribute('data-demo-next') || b.hasAttribute('data-demo-quit') || b.hasAttribute('data-r-demo');
    if (demo) b.disabled = !isDemoCtl || b.hasAttribute('data-r-demo');
    else b.disabled = done && !b.hasAttribute('data-reset') && !b.hasAttribute('data-r-demo');
  });
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-demo-next]');
  const prevBtn = root.querySelector<HTMLButtonElement>('[data-demo-prev]');
  const quitBtn = root.querySelector<HTMLButtonElement>('[data-demo-quit]');
  const replayBtn = root.querySelector<HTMLButtonElement>('[data-demo-replay]');
  const speedWrap = root.querySelector<HTMLElement>('[data-demo-speedwrap]');
  const demoBtn = root.querySelector<HTMLButtonElement>('[data-r-demo]');
  if (demoBtn) demoBtn.hidden = !!demo;
  if (nextBtn) { nextBtn.hidden = !demo || demo.idx >= ex.corrige.length; nextBtn.disabled = demoAnimating; }
  if (prevBtn) { prevBtn.hidden = !demo; if (demo) prevBtn.disabled = demoAnimating || demo.idx === 0; }
  if (quitBtn) quitBtn.hidden = !demo;
  if (replayBtn) { replayBtn.hidden = !demo; if (demo) replayBtn.disabled = demoAnimating || demo.idx === 0; }
  if (speedWrap) speedWrap.hidden = !demo;

  saveCurrent();
}

function apply(err: string | null): void {
  if (err) { render(err, true); return; }
  sel = [];
  render(done ? undefined : 'Et maintenant ?');
}

function withFormula(kind: NonNullable<Pending>['kind']): void {
  pending = { kind };
  render(
    kind === 'supposer' ? 'Tapez l’hypothèse à ouvrir — elle devra être refermée avant la fin.' :
    kind === 'orIntro' ? 'Sélectionnez la ligne acquise, tapez l’autre membre, choisissez le côté.' :
    kind === 'explosion' ? 'De ⊥, tout suit : tapez la formule voulue.' :
    'Le tiers exclu s’invoque pour n’importe quelle formule A.'
  );
}

function submitFormula(side?: 'right' | 'left'): void {
  if (!pending) return;
  const input = root!.querySelector<HTMLInputElement>('[data-input]')!;
  const f = parseFormula(input.value);
  if (typeof f === 'string') { render(`Formule illisible : ${f}. (Syntaxe : A, B, C, non/¬, et/∧, ou/∨, =>/⇒, #/⊥, parenthèses.)`, true); return; }
  const k = pending.kind;
  pending = null;
  input.value = '';
  snapshot();
  if (k === 'supposer') { apply(ruleSupposer(f)); return; }
  if (k === 'orIntro') { const e = ruleOrIntro(f, side ?? 'right'); if (e) history.pop(); apply(e); return; }
  if (k === 'explosion') { const e = ruleExplosion(f); if (e) history.pop(); apply(e); return; }
  const e = ruleTiers(f); if (e) history.pop(); apply(e);
}

function bind(): void {
  if (!root) return;

  const exSel = root.querySelector<HTMLSelectElement>('[data-ex]')!;
  EXOS.forEach((ex, i) => {
    const o = document.createElement('option');
    o.value = String(i); o.textContent = ex.titre;
    exSel.appendChild(o);
  });
  exSel.addEventListener('change', () => loadEx(Number(exSel.value)));

  const on = (selr: string, fn: () => void) => root.querySelector<HTMLElement>(selr)?.addEventListener('click', fn);
  const guarded = (rule: () => string | null) => () => { if (done || demo) return; pending = null; snapshot(); const e = rule(); if (e) history.pop(); apply(e); };

  on('[data-r-supposer]', () => { if (!done && !demo) withFormula('supposer'); });
  on('[data-r-impintro]', guarded(ruleImpIntro));
  on('[data-r-notintro]', guarded(ruleNotIntro));
  on('[data-r-mp]', guarded(ruleModusPonens));
  on('[data-r-andintro]', guarded(ruleAndIntro));
  on('[data-r-andelima]', guarded(() => ruleAndElim('a')));
  on('[data-r-andelimb]', guarded(() => ruleAndElim('b')));
  on('[data-r-orintro]', () => { if (!done && !demo) withFormula('orIntro'); });
  on('[data-r-orelim]', guarded(ruleOrElim));
  on('[data-r-notelim]', guarded(ruleNotElim));
  on('[data-r-explosion]', () => { if (!done && !demo) withFormula('explosion'); });
  on('[data-r-tiers]', () => { if (!done && !demo) withFormula('tiers'); });
  on('[data-r-dne]', guarded(ruleDne));
  on('[data-undo]', () => { if (!demo) undo(); });
  on('[data-reset]', () => { delete saved.ex[String(exIdx)]; persist(); loadEx(exIdx, { fresh: true }); });
  on('[data-r-demo]', () => startDemo());
  on('[data-demo-next]', () => demoNext());
  on('[data-demo-quit]', () => quitDemo());
  on('[data-demo-prev]', () => demoPrev());
  on('[data-demo-replay]', () => demoReplay());
  const speedSel = root.querySelector<HTMLSelectElement>('[data-demo-speed]');
  speedSel?.addEventListener('change', () => { demoSpeed = parseFloat(speedSel.value) || 1; });
  on('[data-inputok]', () => submitFormula());
  on('[data-inputcancel]', () => { pending = null; render(); });
  root.querySelector<HTMLElement>('[data-orside="right"]')?.addEventListener('click', () => submitFormula('right'));
  root.querySelector<HTMLElement>('[data-orside="left"]')?.addEventListener('click', () => submitFormula('left'));

  const input = root.querySelector<HTMLInputElement>('[data-input]')!;
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && pending && pending.kind !== 'orIntro') { ev.preventDefault(); submitFormula(); }
    if (ev.key === 'Escape') { pending = null; render(); }
  });
  root.querySelectorAll<HTMLButtonElement>('[data-sym]').forEach((b) => {
    b.addEventListener('click', () => {
      const start = input.selectionStart ?? input.value.length;
      input.setRangeText(b.dataset.sym as string, start, input.selectionEnd ?? start, 'end');
      input.focus();
    });
  });

  loadEx(0);
}

bind();
