/**
 * MathsScoreAteliers — remplit les compteurs du score global des ateliers.
 * Chaque atelier persiste { solved: number[], ex: {...} } sous sa clé
 * localStorage ; on ne lit ici que `solved` (indices d'exercices réussis à la
 * main — le corrigé pas à pas ne marque jamais un exercice réussi). Le score
 * se rafraîchit quand la progression change dans un autre onglet (événement
 * `storage`) ou quand on revient sur la page (pageshow, focus).
 */

export {};

function lireSolved(cle: string, total: number): number {
  try {
    const raw = localStorage.getItem(cle);
    if (!raw) return 0;
    const saved = JSON.parse(raw) as { solved?: unknown };
    if (!Array.isArray(saved.solved)) return 0;
    const valides = new Set(saved.solved.filter((i) => Number.isInteger(i) && i >= 0 && i < total));
    return valides.size;
  } catch {
    return 0;
  }
}

function init(root: HTMLElement): void {
  const rows = [...root.querySelectorAll<HTMLElement>('[data-atelier]')];

  const majEl = (el: HTMLElement, n: number, total: number, fillSel: string, nSel: string) => {
    const fill = el.querySelector<HTMLElement>(fillSel);
    const nEl = el.querySelector<HTMLElement>(nSel);
    if (fill) fill.style.width = total > 0 ? `${(100 * n) / total}%` : '0';
    if (nEl) nEl.textContent = `${n}/${total}`;
  };

  const maj = () => {
    let fait = 0;
    let total = 0;
    rows.forEach((row) => {
      const t = Number(row.dataset.total ?? 0);
      const n = lireSolved(row.dataset.atelier ?? '', t);
      majEl(row, n, t, '[data-fill]', '[data-n]');
      row.classList.toggle('is-complet', t > 0 && n === t);
      fait += n;
      total += t;
    });
    majEl(root, fait, total, '[data-gfill]', '[data-gscore]');
  };

  maj();
  window.addEventListener('storage', maj);
  window.addEventListener('pageshow', maj);
  window.addEventListener('focus', maj);
}

document.querySelectorAll<HTMLElement>('[data-iw="score-ateliers"]').forEach(init);
