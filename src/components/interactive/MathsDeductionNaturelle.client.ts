/**
 * MathsDeductionNaturelle — le jeu de la déduction naturelle.
 * Le lecteur construit une preuve à la Fitch avec exactement les règles du
 * chapitre 1 : hypothèses locales ouvertes puis déchargées (preuve sous
 * hypothèse, absurde), introduction/élimination de chaque connecteur,
 * contradiction, explosion, tiers exclu. Vérification instantanée, en pur
 * TypeScript — aucun moteur externe.
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

type Ex = { titre: string; premisses: F[]; but: F; aide: string };

const EXOS: Ex[] = [
  {
    titre: '1. Échauffement — le modus ponens',
    premisses: [A, imp(A, B)], but: B,
    aide: 'Sélectionnez les deux prémisses (cliquez-les), puis « modus ponens ».',
  },
  {
    titre: '2. Commutativité du ∧',
    premisses: [et(A, B)], but: et(B, A),
    aide: 'Extrayez chaque moitié (élimination de ∧), puis recollez-les dans l’autre ordre.',
  },
  {
    titre: '3. Commutativité du ∨ — celle qui exige les deux introductions',
    premisses: [ou(A, B)], but: ou(B, A),
    aide: 'Supposez A, concluez B ∨ A, refermez (⇒) ; même chose depuis B ; terminez par le raisonnement par cas.',
  },
  {
    titre: '4. Transitivité de ⇒',
    premisses: [imp(A, B), imp(B, C)], but: imp(A, C),
    aide: 'Supposez A, enchaînez deux modus ponens, refermez l’hypothèse.',
  },
  {
    titre: '5. La contraposée',
    premisses: [imp(A, B)], but: imp(neg(B), neg(A)),
    aide: 'Supposez ¬B ; puis, à l’intérieur, supposez A et fabriquez la contradiction — deux décharges successives.',
  },
  {
    titre: '6. La double négation (sens facile)',
    premisses: [A], but: neg(neg(A)),
    aide: 'Supposez ¬A : la contradiction avec la prémisse est immédiate ; refermez par l’absurde.',
  },
  {
    titre: '7. Le boss : la non-contradiction, sans aucune prémisse',
    premisses: [], but: neg(et(A, neg(A))),
    aide: 'Supposez A ∧ ¬A, séparez les deux moitiés, produisez ⊥, refermez par l’absurde.',
  },
];

/* --------------------------------- état ---------------------------------- */

type Line = { f: F; depth: number; just: string; hyp: boolean; closed: boolean };
type Pending = null | { kind: 'supposer' | 'orIntro' | 'explosion' | 'tiers'; ref?: number };

let exIdx = 0;
let lines: Line[] = [];
let open: number[] = [];
let sel: number[] = [];
let done = false;
let pending: Pending = null;
let history: string[] = [];

function snapshot(): void {
  history.push(JSON.stringify({ lines, open, done }));
  if (history.length > 200) history.shift();
}
function undo(): void {
  const prev = history.pop();
  if (!prev) return;
  const st = JSON.parse(prev);
  lines = st.lines; open = st.open; done = st.done; sel = []; pending = null;
  render('un pas en arrière.');
}

function loadEx(i: number): void {
  exIdx = i;
  const ex = EXOS[i];
  lines = ex.premisses.map((f) => ({ f, depth: 0, just: 'prémisse', hyp: false, closed: false }));
  open = []; sel = []; done = false; pending = null; history = [];
  render(ex.aide);
}

function addLine(f: F, just: string): void {
  lines.push({ f, depth: open.length, just, hyp: false, closed: false });
  const ex = EXOS[exIdx];
  if (open.length === 0 && eq(f, ex.but)) done = true;
}

/* --------------------------------- règles -------------------------------- */

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
    li.className = 'ndj__line' + (l.closed ? ' is-closed' : '') + (l.hyp ? ' is-hyp' : '') + (sel.includes(i) ? ' is-sel' : '');
    li.style.setProperty('--d', String(l.depth));
    li.innerHTML = `<span class="ndj__no">${i + 1}</span><span class="ndj__f">${show(l.f)}</span><span class="ndj__just">${l.just}</span>`;
    if (!l.closed && !done) {
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
  if (done) {
    status.className = 'ndj__status is-done';
    status.innerHTML = `✓ <b>CQFD</b> — ${show(ex.but)} est démontré, toutes les hypothèses refermées.` +
      (exIdx < EXOS.length - 1 ? ' <button class="iw__btn ndj__next" data-next>exercice suivant →</button>' : ' Vous avez terminé les sept exercices !');
    status.querySelector('[data-next]')?.addEventListener('click', () => loadEx(exIdx + 1));
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
    root.querySelector<HTMLInputElement>('[data-input]')!.focus();
  }

  root.querySelectorAll<HTMLButtonElement>('.ndj__rules button').forEach((b) => { b.disabled = done; });
}

function apply(err: string | null, before?: () => void): void {
  if (err) { render(err, true); return; }
  sel = [];
  render(done ? undefined : 'Et maintenant ?');
  void before;
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
  const guarded = (rule: () => string | null) => () => { if (done) return; pending = null; snapshot(); const e = rule(); if (e) history.pop(); apply(e); };

  on('[data-r-supposer]', () => { if (!done) withFormula('supposer'); });
  on('[data-r-impintro]', guarded(ruleImpIntro));
  on('[data-r-notintro]', guarded(ruleNotIntro));
  on('[data-r-mp]', guarded(ruleModusPonens));
  on('[data-r-andintro]', guarded(ruleAndIntro));
  on('[data-r-andelima]', guarded(() => ruleAndElim('a')));
  on('[data-r-andelimb]', guarded(() => ruleAndElim('b')));
  on('[data-r-orintro]', () => { if (!done) withFormula('orIntro'); });
  on('[data-r-orelim]', guarded(ruleOrElim));
  on('[data-r-notelim]', guarded(ruleNotElim));
  on('[data-r-explosion]', () => { if (!done) withFormula('explosion'); });
  on('[data-r-tiers]', () => { if (!done) withFormula('tiers'); });
  on('[data-r-dne]', guarded(ruleDne));
  on('[data-undo]', undo);
  on('[data-reset]', () => loadEx(exIdx));
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
