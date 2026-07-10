/**
 * MathsCalculEquationnel — le jeu du calcul équationnel.
 * Le lecteur transforme une expression en une autre en appliquant des règles
 * de réécriture (les équations mêmes du chapitre) au sous-terme de son choix,
 * dans un sens ou dans l'autre. Deux jeux de règles : « peano » (chapitre 5 —
 * démontrer 2+2=4 soi-même) et « groupe » (chapitre 14 — les bijoux du
 * certificat Lean, par pur calcul). Même ADN que le jeu de la déduction :
 * vérificateur TypeScript pur, corrigé pas à pas animé, vitesse, navigation,
 * progression sauvegardée.
 */

export {};

/* --------------------------------- termes --------------------------------- */

/** Un terme : un symbole de tête et des arguments. Les motifs de règles
 *  utilisent des variables notées `$x`. */
type T = { f: string; a: T[] };

const t = (f: string, ...a: T[]): T => ({ f, a });
const v = (n: string): T => ({ f: '$' + n, a: [] });

function eq(x: T, y: T): boolean {
  return x.f === y.f && x.a.length === y.a.length && x.a.every((c, i) => eq(c, y.a[i]));
}

function clone(x: T): T { return { f: x.f, a: x.a.map(clone) }; }

function varsOf(x: T, out: Set<string> = new Set()): Set<string> {
  if (x.f.startsWith('$')) out.add(x.f);
  x.a.forEach((c) => varsOf(c, out));
  return out;
}

type Sub = Record<string, T>;

function match(pat: T, tt: T, sigma: Sub): boolean {
  if (pat.f.startsWith('$')) {
    const bound = sigma[pat.f];
    if (bound) return eq(bound, tt);
    sigma[pat.f] = tt;
    return true;
  }
  if (pat.f !== tt.f || pat.a.length !== tt.a.length) return false;
  return pat.a.every((p, i) => match(p, tt.a[i], sigma));
}

function subst(pat: T, sigma: Sub): T {
  if (pat.f.startsWith('$')) return clone(sigma[pat.f]);
  return { f: pat.f, a: pat.a.map((c) => subst(c, sigma)) };
}

function getAt(x: T, path: number[]): T {
  return path.reduce((n, i) => n.a[i], x);
}

function replaceAt(x: T, path: number[], sub: T): T {
  if (path.length === 0) return sub;
  const [h, ...rest] = path;
  return { f: x.f, a: x.a.map((c, i) => (i === h ? replaceAt(c, rest, sub) : c)) };
}

/* ------------------------------ configurations ---------------------------- */

type Rule = { id: string; nom: string; lhs: T; rhs: T };
type Step = { path: number[]; rule: string; dir?: 'lr' | 'rl'; input?: string; expl: string };
type Ex = { titre: string; depart: T; but: T; regles: string[]; aide: string; corrige: Step[] };
type Config = {
  cle: string;
  regles: Rule[];
  exos: Ex[];
  show: (x: T) => string;
  parse: (src: string) => T | string;
};

/* ---- Peano (chapitre 5) ---- */

const N = (n: number): T => t(String(n));
const S = (x: T): T => t('S', x);
const add = (x: T, y: T): T => t('+', x, y);
const mul = (x: T, y: T): T => t('×', x, y);

function showPeano(x: T, prec = 0): string {
  const wrap = (lvl: number, s: string) => (lvl < prec ? `(${s})` : s);
  if (x.f === 'S') return `S(${showPeano(x.a[0], 0)})`;
  if (x.f === '+') return wrap(1, `${showPeano(x.a[0], 1)} + ${showPeano(x.a[1], 2)}`);
  if (x.f === '×') return wrap(2, `${showPeano(x.a[0], 2)} × ${showPeano(x.a[1], 3)}`);
  return x.f;
}

function parsePeano(src: string): T | string {
  let p = 0;
  const s = src.replace(/\s+/g, '');
  const prim = (): T | string => {
    if (s[p] === '(') { p++; const r = pAdd(); if (typeof r === 'string') return r; if (s[p] !== ')') return 'parenthèse fermante attendue'; p++; return r; }
    if (s[p] === 'S' || s[p] === 's') { p++; if (s[p] !== '(') return 'S doit s’écrire S(…)'; p++; const r = pAdd(); if (typeof r === 'string') return r; if (s[p] !== ')') return 'parenthèse fermante attendue'; p++; return S(r); }
    if (/[0-9]/.test(s[p] ?? '')) { const d = s[p]; p++; return t(d); }
    return `symbole inattendu « ${s[p] ?? 'fin'} »`;
  };
  const pMul = (): T | string => {
    let x = prim(); if (typeof x === 'string') return x;
    while (s[p] === '×' || s[p] === '*' || s[p] === 'x') { p++; const y = prim(); if (typeof y === 'string') return y; x = mul(x, y); }
    return x;
  };
  const pAdd = (): T | string => {
    let x = pMul(); if (typeof x === 'string') return x;
    while (s[p] === '+') { p++; const y = pMul(); if (typeof y === 'string') return y; x = add(x, y); }
    return x;
  };
  const r = pAdd();
  if (typeof r === 'string') return r;
  if (p !== s.length) return 'symboles en trop';
  return r;
}

const REGLES_PEANO: Rule[] = [
  { id: 'add0', nom: 'm + 0 = m — 1ʳᵉ équation de +', lhs: add(v('m'), N(0)), rhs: v('m') },
  { id: 'addS', nom: 'm + S(n) = S(m + n) — 2ᵉ équation de +', lhs: add(v('m'), S(v('n'))), rhs: S(add(v('m'), v('n'))) },
  { id: 'mul0', nom: 'm × 0 = 0 — 1ʳᵉ équation de ×', lhs: mul(v('m'), N(0)), rhs: N(0) },
  { id: 'mulS', nom: 'm × S(n) = m × n + m — 2ᵉ équation de ×', lhs: mul(v('m'), S(v('n'))), rhs: add(mul(v('m'), v('n')), v('m')) },
  { id: 'def1', nom: '1 = S(0) — définition de 1', lhs: N(1), rhs: S(N(0)) },
  { id: 'def2', nom: '2 = S(1) — définition de 2', lhs: N(2), rhs: S(N(1)) },
  { id: 'def3', nom: '3 = S(2) — définition de 3', lhs: N(3), rhs: S(N(2)) },
  { id: 'def4', nom: '4 = S(3) — définition de 4', lhs: N(4), rhs: S(N(3)) },
  { id: 'thm22', nom: '2 + 2 = 4 — VOTRE théorème (exercice 2)', lhs: add(N(2), N(2)), rhs: N(4) },
];

const EXOS_PEANO: Ex[] = [
  {
    titre: '1. Échauffement : 1 + 1 = 2',
    depart: add(N(1), N(1)), but: N(2),
    regles: ['add0', 'addS', 'def1', 'def2'],
    aide: 'Cliquez le second 1 pour le déplier en S(0), puis laissez les équations de + travailler.',
    corrige: [
      { path: [1], rule: 'def1', expl: 'On déplie le 1 de droite : 1 n’est qu’un nom pour S(0), et la définition de + ne sait manger que des 0 et des S.' },
      { path: [], rule: 'addS', expl: 'La deuxième équation de + fait sortir le S : ajouter un successeur, c’est prendre le successeur de la somme.' },
      { path: [0], rule: 'add0', expl: 'La première équation de + : ajouter 0 ne change rien. Il ne reste que S(1).' },
      { path: [], rule: 'def2', expl: 'Et S(1), par définition, s’appelle 2. Votre premier théorème d’arithmétique — quatre applications de définitions, zéro évidence.' },
    ],
  },
  {
    titre: '2. Le monument : 2 + 2 = 4',
    depart: add(N(2), N(2)), but: N(4),
    regles: ['add0', 'addS', 'def1', 'def2', 'def3', 'def4'],
    aide: 'Le même plan que l’encart du chapitre : dépliez le 2 de droite, faites sortir les S un à un, puis remontez les définitions.',
    corrige: [
      { path: [1], rule: 'def2', expl: 'Étape 1 de l’encart : le 2 de droite se déplie en S(1) — c’est sa définition.' },
      { path: [], rule: 'addS', expl: 'Étape 2 : la deuxième équation de + sort le S. Il reste à calculer 2 + 1.' },
      { path: [0, 1], rule: 'def1', expl: 'Étape 3 : on déplie le 1 en S(0), pour redonner du grain à moudre à la deuxième équation…' },
      { path: [0], rule: 'addS', expl: '…qui sort un second S. Il reste 2 + 0, le cas de base.' },
      { path: [0, 0], rule: 'add0', expl: 'Étape 4 : ajouter 0 ne change rien — le calcul touche le fond.' },
      { path: [0], rule: 'def3', expl: 'Étape 5, la remontée : S(2) s’appelle 3, par définition.' },
      { path: [], rule: 'def4', expl: 'Et S(3) s’appelle 4. ∎ — 2 + 2 = 4 est démontré, par vous, dans ZF. Chaque étape a cité une définition ; aucune n’a invoqué l’évidence.' },
    ],
  },
  {
    titre: '3. La multiplication s’en mêle : 1 × 1 = 1',
    depart: mul(N(1), N(1)), but: N(1),
    regles: ['add0', 'addS', 'mul0', 'mulS', 'def1'],
    aide: 'Dépliez le 1 de droite, appliquez les équations de ×, puis finissez le calcul d’addition.',
    corrige: [
      { path: [1], rule: 'def1', expl: 'Comme pour +, la définition de × ne connaît que 0 et S : on déplie le 1 de droite.' },
      { path: [], rule: 'mulS', expl: 'La deuxième équation de × : multiplier par un successeur, c’est multiplier puis ajouter — la multiplication n’est qu’une addition répétée, et cette équation le dit exactement.' },
      { path: [0], rule: 'mul0', expl: 'La première équation de × : multiplier par 0 donne 0.' },
      { path: [1], rule: 'def1', expl: 'Reste 0 + 1 — attention, la définition de + travaille sur son argument DROIT : il faut déplier le 1.' },
      { path: [], rule: 'addS', expl: 'Le S sort…' },
      { path: [0], rule: 'add0', expl: '…et 0 + 0 se réduit. Il reste S(0).' },
      { path: [], rule: 'def1', dir: 'rl', expl: 'Qui s’appelle 1, par définition — appliquée cette fois de droite à gauche : les définitions se lisent dans les deux sens.' },
    ],
  },
  {
    titre: '4. Le boss : 2 × 2 = 4 (avec votre théorème en outil)',
    depart: mul(N(2), N(2)), but: N(4),
    regles: ['add0', 'addS', 'mul0', 'mulS', 'def1', 'def2', 'thm22'],
    aide: 'Déroulez la multiplication ; vous tomberez sur 0 + 2, qui se calcule (la définition de + ne réduit que m + 0, pas 0 + m !) — puis votre théorème 2 + 2 = 4 achève.',
    corrige: [
      { path: [1], rule: 'def2', expl: 'On déplie le 2 de droite : la définition de × attend un successeur.' },
      { path: [], rule: 'mulS', expl: '2 × S(1) devient 2 × 1 + 2 : une multiplication de moins, une addition de plus.' },
      { path: [0, 1], rule: 'def1', expl: 'On déplie le 1 pour continuer à dérouler le ×…' },
      { path: [0], rule: 'mulS', expl: '…2 × S(0) devient 2 × 0 + 2.' },
      { path: [0, 0], rule: 'mul0', expl: 'Multiplier par 0 donne 0. Nous voici devant (0 + 2) + 2 — et un piège pédagogique.' },
      { path: [0, 1], rule: 'def2', expl: 'La définition de + réduit m + 0, pas 0 + m ! Le 0 est du mauvais côté : il faut calculer 0 + 2 pied à pied. On déplie son 2…' },
      { path: [0], rule: 'addS', expl: '…le S sort…' },
      { path: [0, 0, 1], rule: 'def1', expl: '…on déplie le 1…' },
      { path: [0, 0], rule: 'addS', expl: '…le deuxième S sort…' },
      { path: [0, 0, 0], rule: 'add0', expl: '…et 0 + 0 touche le fond. (Le chapitre démontre 0 + a = a par récurrence — ici, on l’a VÉCU sur a = 2.)' },
      { path: [0, 0], rule: 'def1', dir: 'rl', expl: 'On remonte : S(0) s’appelle 1…' },
      { path: [0], rule: 'def2', dir: 'rl', expl: '…et S(1) s’appelle 2. Nous voici devant 2 + 2 — un air connu.' },
      { path: [], rule: 'thm22', expl: 'Votre théorème de l’exercice 2 conclut d’un coup : les théorèmes démontrés deviennent des outils. 2 × 2 = 4. ∎' },
    ],
  },
];

/* ---- Groupe (chapitre 14) ---- */

const E: T = t('e');
const C = (n: string): T => t(n);
const op = (x: T, y: T): T => t('·', x, y);
const inv = (x: T): T => t('⁻¹', x);

function showGroupe(x: T, prec = 0): string {
  if (x.f === '⁻¹') {
    const inner = x.a[0];
    const s = showGroupe(inner, 9);
    return (inner.a.length > 0 && inner.f === '·' ? s : s) + '⁻¹';
  }
  if (x.f === '·') {
    const s = `${showGroupe(x.a[0], 1)}·${showGroupe(x.a[1], 2)}`;
    return prec >= 2 || prec === 9 ? `(${s})` : s;
  }
  return x.f;
}

function parseGroupe(src: string): T | string {
  let p = 0;
  const s = src.replace(/\s+/g, '').replace(/⁻¹/g, "'").replace(/\^-1/g, "'").replace(/-1/g, "'");
  const prim = (): T | string => {
    let base: T;
    if (s[p] === '(') { p++; const r = pOp(); if (typeof r === 'string') return r; if (s[p] !== ')') return 'parenthèse fermante attendue'; p++; base = r; }
    else if (s[p] === 'e') { p++; base = E; }
    else if (/[a-d]/.test(s[p] ?? '')) { base = C(s[p]); p++; }
    else return `symbole inattendu « ${s[p] ?? 'fin'} » (attendu : a, b, c, d, e, ·, ', parenthèses)`;
    while (s[p] === "'") { p++; base = inv(base); }
    return base;
  };
  const pOp = (): T | string => {
    let x = prim(); if (typeof x === 'string') return x;
    while (s[p] === '·' || s[p] === '*' || s[p] === '.') { p++; const y = prim(); if (typeof y === 'string') return y; x = op(x, y); }
    return x;
  };
  const r = pOp();
  if (typeof r === 'string') return r;
  if (p !== s.length) return 'symboles en trop';
  return r;
}

const REGLES_GROUPE: Rule[] = [
  { id: 'assoc', nom: '(x·y)·z = x·(y·z) — (G1) associativité', lhs: op(op(v('x'), v('y')), v('z')), rhs: op(v('x'), op(v('y'), v('z'))) },
  { id: 'neutg', nom: 'e·x = x — (G2) neutre à gauche', lhs: op(E, v('x')), rhs: v('x') },
  { id: 'neutd', nom: 'x·e = x — (G2) neutre à droite', lhs: op(v('x'), E), rhs: v('x') },
  { id: 'invg', nom: 'x⁻¹·x = e — (G3) inverse à gauche', lhs: op(inv(v('x')), v('x')), rhs: E },
  { id: 'invd', nom: 'x·x⁻¹ = e — (G3) inverse à droite', lhs: op(v('x'), inv(v('x'))), rhs: E },
];

const EXOS_GROUPE: Ex[] = [
  {
    titre: '1. Échauffement : a·(a⁻¹·b) = b',
    depart: op(C('a'), op(inv(C('a')), C('b'))), but: C('b'),
    regles: ['assoc', 'neutg', 'neutd', 'invg', 'invd'],
    aide: 'Re-parenthésez (associativité, de droite à gauche), faites apparaître e, éliminez-le.',
    corrige: [
      { path: [], rule: 'assoc', expl: 'L’associativité se lit dans les deux sens : ici, de droite à gauche, pour rapprocher a de son inverse.' },
      { path: [0], rule: 'invd', expl: 'a·a⁻¹ = e : l’inverse fait son travail (G3).' },
      { path: [], rule: 'neutg', expl: 'Et le neutre s’efface (G2). Trois axiomes, trois gestes — le calcul dans un groupe, c’est exactement cela.' },
    ],
  },
  {
    titre: '2. Le théorème 5 du chapitre : e⁻¹ = e',
    depart: inv(E), but: E,
    regles: ['assoc', 'neutg', 'neutd', 'invg', 'invd'],
    aide: 'Il faut d’abord CRÉER de la matière : appliquez « x·e = x » à l’envers pour faire apparaître un e…',
    corrige: [
      { path: [], rule: 'neutd', dir: 'rl', expl: 'Le geste créatif du calcul équationnel : x·e = x, lu À L’ENVERS, fabrique un ·e à partir de rien. e⁻¹ devient e⁻¹·e.' },
      { path: [], rule: 'invg', expl: 'Mais e⁻¹·e, c’est exactement x⁻¹·x avec x = e : l’axiome (G3) le réduit en e. Deux gestes, et le théorème 5 est redémontré — par pur calcul, sans l’argument d’unicité du chapitre. Deux preuves, un théorème.' },
    ],
  },
  {
    titre: '3. Le théorème 6 : (a⁻¹)⁻¹ = a',
    depart: inv(inv(C('a'))), but: C('a'),
    regles: ['assoc', 'neutg', 'neutd', 'invg', 'invd'],
    aide: 'Créez un e (neutre à l’envers), remplacez-le par a⁻¹·a (G3 à l’envers — on vous demandera x), puis l’associativité et (G3) concluent.',
    corrige: [
      { path: [], rule: 'neutd', dir: 'rl', expl: 'On fabrique un ·e : (a⁻¹)⁻¹ devient (a⁻¹)⁻¹·e.' },
      { path: [1], rule: 'invg', dir: 'rl', input: 'a', expl: 'Puis on déplie ce e en a⁻¹·a — c’est (G3) à l’envers, et il faut CHOISIR x : c’est le seul geste créatif de la preuve, tout le reste est forcé.' },
      { path: [], rule: 'assoc', expl: 'L’associativité re-parenthèse : (a⁻¹)⁻¹ rencontre a⁻¹…' },
      { path: [0], rule: 'invg', expl: '…et (a⁻¹)⁻¹·a⁻¹, c’est x⁻¹·x avec x = a⁻¹ : cela vaut e.' },
      { path: [], rule: 'neutg', expl: 'Le neutre s’efface : il reste a. Le théorème 6, redémontré par calcul — comparez avec la preuve par unicité du chapitre, et avec l’exercice Lean : trois voies, un théorème.' },
    ],
  },
  {
    titre: '4. Le boss : b⁻¹·a⁻¹ = (a·b)⁻¹',
    depart: op(inv(C('b')), inv(C('a'))), but: inv(op(C('a'), C('b'))),
    regles: ['assoc', 'neutg', 'neutd', 'invg', 'invd'],
    aide: 'Créez e·(…) à gauche, dépliez ce e en (a·b)⁻¹·(a·b) — puis laissez l’associativité tout écraser au milieu.',
    corrige: [
      { path: [], rule: 'neutg', dir: 'rl', expl: 'On fabrique un e· devant : b⁻¹·a⁻¹ devient e·(b⁻¹·a⁻¹). Le but contient (a·b)⁻¹ : il va falloir le faire naître de ce e.' },
      { path: [0], rule: 'invg', dir: 'rl', input: '(a*b)', expl: 'Le geste-clé : ce e se déplie en (a·b)⁻¹·(a·b) — c’est (G3) à l’envers avec x = a·b, le choix créatif qui vise le but.' },
      { path: [], rule: 'assoc', dir: 'lr', expl: 'À partir d’ici, tout est forcé. L’associativité déplace les parenthèses : (a·b)⁻¹ est en place, il reste à écraser (a·b)·(b⁻¹·a⁻¹) en e.' },
      { path: [1], rule: 'assoc', dir: 'lr', expl: 'Encore l’associativité, à l’intérieur : a·(b·(b⁻¹·a⁻¹)).' },
      { path: [1, 1], rule: 'assoc', dir: 'rl', expl: 'Et une fois de droite à gauche, pour marier b à b⁻¹.' },
      { path: [1, 1, 0], rule: 'invd', expl: 'b·b⁻¹ = e : premier effondrement.' },
      { path: [1, 1], rule: 'neutg', expl: 'Le e s’efface : reste a·a⁻¹.' },
      { path: [1], rule: 'invd', expl: 'Second effondrement : a·a⁻¹ = e.' },
      { path: [], rule: 'neutd', expl: 'Et le dernier neutre s’efface : (a·b)⁻¹. ∎ — le théorème 4 du chapitre (« l’inverse d’un produit renverse l’ordre »), démontré par neuf gestes de calcul. Remarquez : DEUX gestes créatifs (les dépliages), sept gestes forcés.' },
    ],
  },
];

const CONFIGS: Record<string, Config> = {
  peano: { cle: 'cqfd-ceq-peano-v1', regles: REGLES_PEANO, exos: EXOS_PEANO, show: showPeano, parse: parsePeano },
  groupe: { cle: 'cqfd-ceq-groupe-v1', regles: REGLES_GROUPE, exos: EXOS_GROUPE, show: showGroupe, parse: parseGroupe },
};

/* --------------------------------- moteur --------------------------------- */

type Ligne = { term: T; regle: string };

function init(root: HTMLElement): void {
  const cfg = CONFIGS[root.dataset.jeu ?? ''];
  if (!cfg) return;

  let exIdx = 0;
  let chaine: Ligne[] = [];
  let selPath: number[] | null = null;
  let done = false;
  let history: string[] = [];
  let demo: { idx: number } | null = null;
  let demoAnimating = false;
  let demoToken = 0;
  let demoSpeed = 1;
  let demoSnapshots: string[] = [];
  /** Demande en cours : règle cliquée qui attend un choix de sens ou un terme. */
  let pending: { rule: Rule; path: number[]; dir?: 'lr' | 'rl'; needDir: boolean; needVar: string | null } | null = null;

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const dsleep = (ms: number) => sleep(ms / demoSpeed);

  const cur = (): T => chaine[chaine.length - 1].term;

  /* ------ persistance ------ */
  type Saved = { solved: number[]; ex: Record<string, Ligne[]> };
  let saved: Saved = { solved: [], ex: {} };
  try { const raw = localStorage.getItem(cfg.cle); if (raw) saved = JSON.parse(raw); } catch { /* sans mémoire */ }
  const persist = () => { try { localStorage.setItem(cfg.cle, JSON.stringify(saved)); } catch { /* tant pis */ } };
  const saveCurrent = () => { if (!demo) { saved.ex[String(exIdx)] = chaine; persist(); } };
  const markSolved = () => { if (!demo && !saved.solved.includes(exIdx)) { saved.solved.push(exIdx); persist(); } };

  function freshState(i: number): void {
    chaine = [{ term: clone(cfg.exos[i].depart), regle: '' }];
    selPath = null; done = false; pending = null; history = [];
  }

  function loadEx(i: number, opts?: { fresh?: boolean }): void {
    exIdx = i;
    demoToken++; demoAnimating = false; demo = null;
    const kept = !opts?.fresh && saved.ex[String(i)];
    if (kept) { chaine = saved.ex[String(i)].map((l) => ({ term: clone(l.term), regle: l.regle })); selPath = null; pending = null; history = []; done = eq(cur(), cfg.exos[i].but); }
    else freshState(i);
    const exSel = root.querySelector<HTMLSelectElement>('[data-ex]');
    if (exSel) exSel.value = String(i);
    render(kept && chaine.length > 1 ? 'Votre brouillon est resté tel quel.' : cfg.exos[i].aide);
  }

  function snapshot(): void { history.push(JSON.stringify(chaine)); if (history.length > 200) history.shift(); }
  function undo(): void {
    const prev = history.pop();
    if (!prev) return;
    chaine = JSON.parse(prev); selPath = null; pending = null; done = eq(cur(), cfg.exos[exIdx].but);
    saveCurrent(); render('un pas en arrière.');
  }

  /** Applique une règle au chemin donné. Renvoie une erreur, ou null. */
  function applyRule(rule: Rule, path: number[], dir: 'lr' | 'rl', inputTerm: T | null): string | null {
    const sub = getAt(cur(), path);
    const pat = dir === 'lr' ? rule.lhs : rule.rhs;
    const out = dir === 'lr' ? rule.rhs : rule.lhs;
    const sigma: Sub = {};
    if (!match(pat, sub, sigma)) return `Le motif « ${cfg.show(pat).replace(/\$/g, '')} » ne correspond pas au sous-terme sélectionné.`;
    const missing = [...varsOf(out)].filter((x) => !(x in sigma));
    if (missing.length > 1) return 'Règle inapplicable dans ce sens (trop d’inconnues).';
    if (missing.length === 1) {
      if (!inputTerm) return '__NEEDVAR__' + missing[0];
      sigma[missing[0]] = inputTerm;
    }
    const nouveau = replaceAt(cur(), path, subst(out, sigma));
    snapshot();
    chaine = [...chaine, { term: nouveau, regle: rule.nom.split('—')[0].trim() + (dir === 'rl' ? ' (droite → gauche)' : '') }];
    selPath = null;
    if (eq(nouveau, cfg.exos[exIdx].but)) { done = true; markSolved(); }
    return null;
  }

  /** Clic sur une règle : détecte les sens possibles, demande sens/terme si besoin. */
  function tryRule(rule: Rule): void {
    if (done || demo) return;
    if (selPath === null) { render('Sélectionnez d’abord un sous-terme (cliquez dans l’expression courante).', true); return; }
    const sub = getAt(cur(), selPath);
    const mLR = match(rule.lhs, sub, {});
    const mRL = match(rule.rhs, sub, {});
    if (!mLR && !mRL) { render(`« ${rule.nom.split('—')[0].trim()} » ne s’applique pas ici, dans aucun sens.`, true); return; }
    if (mLR && mRL) { pending = { rule, path: selPath, needDir: true, needVar: null }; render('Cette règle s’applique dans les deux sens : lequel ?'); return; }
    const dir: 'lr' | 'rl' = mLR ? 'lr' : 'rl';
    finishApply(rule, selPath, dir, null);
  }

  function finishApply(rule: Rule, path: number[], dir: 'lr' | 'rl', inputTerm: T | null): void {
    const e = applyRule(rule, path, dir, inputTerm);
    if (e && e.startsWith('__NEEDVAR__')) {
      pending = { rule, path, dir, needDir: false, needVar: e.slice(11) };
      render(`Ce sens fait apparaître une inconnue ${e.slice(12)} : tapez le terme à mettre à sa place.`);
      return;
    }
    pending = null;
    if (e) { render(e, true); return; }
    render(done ? undefined : 'Et maintenant ?');
  }

  function submitPending(dirChoice?: 'lr' | 'rl'): void {
    if (!pending) return;
    if (pending.needDir && dirChoice) {
      const p = pending; pending = null;
      finishApply(p.rule, p.path, dirChoice, null);
      return;
    }
    if (pending.needVar) {
      const input = root.querySelector<HTMLInputElement>('[data-input]')!;
      const parsed = cfg.parse(input.value);
      if (typeof parsed === 'string') { render(`Terme illisible : ${parsed}.`, true); return; }
      const p = pending; pending = null; input.value = '';
      finishApply(p.rule, p.path, p.dir as 'lr' | 'rl', parsed);
    }
  }

  /* ------ corrigé pas à pas ------ */

  function runStep(step: Step): string | null {
    const rule = cfg.regles.find((r) => r.id === step.rule)!;
    let dir = step.dir;
    if (!dir) {
      const sub = getAt(cur(), step.path);
      dir = match(rule.lhs, sub, {}) ? 'lr' : 'rl';
    }
    const inputTerm = step.input ? (cfg.parse(step.input) as T) : null;
    return applyRule(rule, step.path, dir, inputTerm);
  }

  function startDemo(): void {
    demoToken++; demoAnimating = false; demoSnapshots = [];
    freshState(exIdx);
    demo = { idx: 0 };
    render(`Corrigé pas à pas — ${cfg.exos[exIdx].corrige.length} étapes. Chaque geste est mimé (sous-terme visé, règle, sens, saisie) puis expliqué.`);
  }

  async function pressButton(selector: string, token: number): Promise<void> {
    const b = root.querySelector<HTMLElement>(selector);
    if (!b) return;
    b.classList.add('is-demo-press');
    b.scrollIntoView({ block: 'nearest' });
    await dsleep(700);
    b.classList.remove('is-demo-press');
    if (token !== demoToken) return;
  }

  async function demoNext(): Promise<void> {
    if (!demo || demoAnimating) return;
    const steps = cfg.exos[exIdx].corrige;
    if (demo.idx >= steps.length) return;
    const step = steps[demo.idx];
    demoSnapshots[demo.idx] = JSON.stringify(chaine);
    demo.idx += 1;
    const token = ++demoToken;
    demoAnimating = true;
    const head = `Étape ${demo.idx}/${steps.length} — ${step.expl}`;
    render(head);

    // 1. viser le sous-terme
    await dsleep(650); if (token !== demoToken) return;
    selPath = [...step.path];
    render(head);
    root.querySelector('.ceq__cur .is-sel')?.scrollIntoView({ block: 'nearest' });

    // 2. presser la règle
    await dsleep(650); if (token !== demoToken) return;
    await pressButton(`[data-rule="${step.rule}"]`, token);
    if (token !== demoToken) return;

    // 3. sens éventuel
    const rule = cfg.regles.find((r) => r.id === step.rule)!;
    const sub = getAt(cur(), step.path);
    const both = match(rule.lhs, sub, {}) && match(rule.rhs, sub, {});
    if (both) {
      pending = { rule, path: step.path, needDir: true, needVar: null };
      render(head);
      await dsleep(500); if (token !== demoToken) return;
      await pressButton(`[data-dir="${step.dir ?? 'lr'}"]`, token);
      if (token !== demoToken) return;
      pending = null;
    }

    // 4. saisie éventuelle
    if (step.input) {
      pending = { rule, path: step.path, dir: step.dir, needDir: false, needVar: '$?' };
      render(head);
      const input = root.querySelector<HTMLInputElement>('[data-input]')!;
      input.value = '';
      for (const ch of step.input) { await dsleep(85); if (token !== demoToken) return; input.value += ch; }
      await dsleep(450); if (token !== demoToken) return;
      await pressButton('[data-inputok]', token);
      if (token !== demoToken) return;
      pending = null;
    }

    const e = runStep(step);
    selPath = null;
    demoAnimating = false;
    if (e) { render(`(bug du corrigé : ${e})`, true); return; }
    render(head);
  }

  function demoRewind(): boolean {
    if (!demo || demoAnimating || demo.idx === 0) return false;
    const snap = demoSnapshots[demo.idx - 1];
    if (!snap) return false;
    chaine = JSON.parse(snap); selPath = null; pending = null; done = false;
    demo.idx -= 1;
    return true;
  }

  function demoPrev(): void {
    if (!demo || !demoRewind()) return;
    const steps = cfg.exos[exIdx].corrige;
    render(demo.idx === 0
      ? 'Retour au départ du corrigé. « étape suivante » rejoue le premier geste.'
      : `Retour à l’étape ${demo.idx}/${steps.length} — ${steps[demo.idx - 1].expl}`);
  }

  function demoReplay(): void { if (demo && demoRewind()) void demoNext(); }

  function quitDemo(): void {
    demoToken++; demoAnimating = false; pending = null; demo = null;
    loadEx(exIdx);
  }

  /* ------ rendu ------ */

  function renderTerm(x: T, path: number[], interactive: boolean): HTMLElement {
    const span = document.createElement('span');
    span.className = 'ceq__t' + (selPath && path.join('.') === selPath.join('.') ? ' is-sel' : '');
    span.dataset.path = path.join('.');
    const S_ = (s: string) => span.appendChild(document.createTextNode(s));
    const kid = (i: number, parens: boolean) => {
      if (parens) S_('(');
      span.appendChild(renderTerm(x.a[i], [...path, i], interactive));
      if (parens) S_(')');
    };
    if (x.f === 'S') { S_('S('); span.appendChild(renderTerm(x.a[0], [...path, 0], interactive)); S_(')'); }
    else if (x.f === '+' || x.f === '×' || x.f === '·') {
      const prec = (f: string) => (f === '×' ? 2 : f === '+' ? 1 : 1);
      const needL = (c: T) => (c.f === '+' || c.f === '×' || c.f === '·') && prec(c.f) < prec(x.f);
      const needR = (c: T) => (c.f === '+' || c.f === '×' || c.f === '·') && prec(c.f) <= prec(x.f);
      kid(0, needL(x.a[0]));
      S_(x.f === '·' ? '·' : ` ${x.f} `);
      kid(1, needR(x.a[1]));
    } else if (x.f === '⁻¹') { kid(0, x.a[0].a.length > 0); S_('⁻¹'); }
    else S_(x.f);
    if (interactive) {
      span.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (done || demo) return;
        const same = selPath && selPath.join('.') === path.join('.');
        selPath = same ? (path.length > 0 ? path.slice(0, -1) : null) : [...path];
        pending = null;
        render(selPath ? undefined : 'Sélection effacée.');
      });
    }
    return span;
  }

  function render(msg?: string, isError = false): void {
    const ex = cfg.exos[exIdx];
    const goal = root.querySelector<HTMLElement>('[data-goal]')!;
    goal.innerHTML = `<span class="ceq__lbl">but :</span> transformer <b>${cfg.show(ex.depart)}</b> en <b class="ceq__but">${cfg.show(ex.but)}</b>`;

    const chainEl = root.querySelector<HTMLElement>('[data-chain]')!;
    chainEl.innerHTML = '';
    chaine.forEach((l, i) => {
      const li = document.createElement('div');
      const last = i === chaine.length - 1;
      li.className = 'ceq__line' + (last ? ' ceq__cur' : '');
      const eqs = document.createElement('span');
      eqs.className = 'ceq__eq';
      eqs.textContent = i === 0 ? '  ' : '=';
      li.appendChild(eqs);
      li.appendChild(renderTerm(l.term, [], last && !done && !demo));
      if (l.regle) {
        const j = document.createElement('span');
        j.className = 'ceq__just';
        j.textContent = l.regle;
        li.appendChild(j);
      }
      chainEl.appendChild(li);
    });

    const status = root.querySelector<HTMLElement>('[data-status]')!;
    if (done && !demo) {
      status.className = 'ceq__status is-done';
      status.innerHTML = `✓ <b>CQFD</b> — ${cfg.show(ex.but)} est atteint, chaque pas cite une règle.` +
        (exIdx < cfg.exos.length - 1 ? ' <button class="iw__btn ceq__next" data-next>exercice suivant →</button>' : ' Vous avez tout démontré !');
      status.querySelector('[data-next]')?.addEventListener('click', () => loadEx(exIdx + 1));
    } else if (demo) {
      const finished = demo.idx >= ex.corrige.length;
      status.className = 'ceq__status is-demo';
      status.textContent = (msg ?? '') + (finished ? ' — Corrigé terminé. « quitter le corrigé » vous rend la main.' : '');
    } else {
      status.className = 'ceq__status' + (isError ? ' is-err' : '');
      status.textContent = msg ?? (selPath ? `Sous-terme sélectionné : ${cfg.show(getAt(cur(), selPath))} — appliquez une règle (re-cliquez pour élargir).` : ex.aide);
    }

    // règles disponibles pour l'exercice
    root.querySelectorAll<HTMLButtonElement>('[data-rule]').forEach((b) => {
      const id = b.dataset.rule as string;
      b.hidden = !ex.regles.includes(id);
      b.disabled = done || !!demo;
    });

    // rangée sens / saisie
    const dirRow = root.querySelector<HTMLElement>('[data-dirrow]')!;
    dirRow.hidden = !(pending && pending.needDir);
    if (pending?.needDir) {
      const r = pending.rule;
      root.querySelector<HTMLElement>('[data-dir="lr"]')!.textContent = `${cfg.show(r.lhs).replace(/\$/g, '')} → ${cfg.show(r.rhs).replace(/\$/g, '')}`;
      root.querySelector<HTMLElement>('[data-dir="rl"]')!.textContent = `${cfg.show(r.rhs).replace(/\$/g, '')} → ${cfg.show(r.lhs).replace(/\$/g, '')}`;
    }
    const inputRow = root.querySelector<HTMLElement>('[data-inputrow]')!;
    inputRow.hidden = !(pending && pending.needVar);
    if (pending?.needVar && !demo) root.querySelector<HTMLInputElement>('[data-input]')!.focus();

    // score, menu, contrôles du corrigé
    const score = root.querySelector<HTMLElement>('[data-score]');
    if (score) score.textContent = `${saved.solved.length}/${cfg.exos.length}`;
    const exSel = root.querySelector<HTMLSelectElement>('[data-ex]');
    if (exSel) [...exSel.options].forEach((o, i) => { o.textContent = (saved.solved.includes(i) ? '✓ ' : '') + cfg.exos[i].titre; });

    const metaBtns: [string, (b: HTMLButtonElement) => void][] = [
      ['[data-r-demo]', (b) => { b.hidden = !!demo; b.disabled = false; }],
      ['[data-demo-next]', (b) => { b.hidden = !demo || demo!.idx >= ex.corrige.length; b.disabled = demoAnimating; }],
      ['[data-demo-prev]', (b) => { b.hidden = !demo; b.disabled = demoAnimating || (demo ? demo.idx === 0 : true); }],
      ['[data-demo-replay]', (b) => { b.hidden = !demo; b.disabled = demoAnimating || (demo ? demo.idx === 0 : true); }],
      ['[data-demo-quit]', (b) => { b.hidden = !demo; b.disabled = false; }],
      ['[data-undo]', (b) => { b.disabled = !!demo; }],
      ['[data-reset]', (b) => { b.disabled = !!demo; }],
    ];
    metaBtns.forEach(([sel, fn]) => { const b = root.querySelector<HTMLButtonElement>(sel); if (b) fn(b); });
    const speedWrap = root.querySelector<HTMLElement>('[data-demo-speedwrap]');
    if (speedWrap) speedWrap.hidden = !demo;

    saveCurrent();
  }

  /* ------ liaison ------ */

  const exSel = root.querySelector<HTMLSelectElement>('[data-ex]')!;
  cfg.exos.forEach((ex, i) => {
    const o = document.createElement('option');
    o.value = String(i); o.textContent = ex.titre;
    exSel.appendChild(o);
  });
  exSel.addEventListener('change', () => loadEx(Number(exSel.value)));

  const rulesEl = root.querySelector<HTMLElement>('[data-rules]')!;
  cfg.regles.forEach((r) => {
    const b = document.createElement('button');
    b.className = 'iw__btn';
    b.dataset.rule = r.id;
    const [eqn, nom] = r.nom.split('—').map((s) => s.trim());
    b.innerHTML = `<span class="sym">${eqn}</span>${nom ?? ''}`;
    b.title = r.nom;
    b.addEventListener('click', () => tryRule(r));
    rulesEl.appendChild(b);
  });

  const on = (sel: string, fn: () => void) => root.querySelector<HTMLElement>(sel)?.addEventListener('click', fn);
  on('[data-undo]', () => { if (!demo) undo(); });
  on('[data-reset]', () => { delete saved.ex[String(exIdx)]; persist(); loadEx(exIdx, { fresh: true }); });
  on('[data-r-demo]', () => startDemo());
  on('[data-demo-next]', () => void demoNext());
  on('[data-demo-prev]', () => demoPrev());
  on('[data-demo-replay]', () => demoReplay());
  on('[data-demo-quit]', () => quitDemo());
  on('[data-dir="lr"]', () => { if (!demo) submitPending('lr'); });
  on('[data-dir="rl"]', () => { if (!demo) submitPending('rl'); });
  on('[data-inputok]', () => { if (!demo) submitPending(); });
  on('[data-inputcancel]', () => { pending = null; render(); });
  const speedSel = root.querySelector<HTMLSelectElement>('[data-demo-speed]');
  speedSel?.addEventListener('change', () => { demoSpeed = parseFloat(speedSel.value) || 1; });
  const input = root.querySelector<HTMLInputElement>('[data-input]')!;
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && pending?.needVar && !demo) { ev.preventDefault(); submitPending(); }
    if (ev.key === 'Escape') { pending = null; render(); }
  });

  loadEx(0);
}

document.querySelectorAll<HTMLElement>('[data-iw="calcul-equationnel"]').forEach(init);
