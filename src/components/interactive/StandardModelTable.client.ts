export {}; // module isolé (évite la collision de portée globale avec les autres scripts)

interface P {
  id: string;
  sym: string;
  nom: string;
  masse: string;
  charge: string;
  spin: string;
  cat: string;
  info: string;
}

const CAT_LABEL: Record<string, string> = {
  quark: 'Quark (fermion)',
  lepton: 'Lepton (fermion)',
  boson: 'Boson de jauge',
  higgs: 'Boson scalaire',
};

function init(root: HTMLElement) {
  const dataEl = root.querySelector<HTMLScriptElement>('[data-smt-data]');
  const panel = root.querySelector<HTMLElement>('[data-panel]');
  if (!dataEl || !panel) return;
  const data: P[] = JSON.parse(dataEl.textContent || '[]');
  const byId = new Map(data.map((p) => [p.id, p]));

  root.querySelectorAll<HTMLButtonElement>('.smt__cell').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.smt__cell.sel').forEach((c) => c.classList.remove('sel'));
      btn.classList.add('sel');
      const p = byId.get(btn.dataset.id || '');
      if (!p) return;
      panel.innerHTML = `
        <h4>${p.sym} — ${p.nom}</h4>
        <div class="smt__props">
          <span>${CAT_LABEL[p.cat] ?? p.cat}</span>
          <span>masse : ${p.masse}</span>
          <span>charge : ${p.charge} e</span>
          <span>spin : ${p.spin}</span>
        </div>
        <p style="margin:0;color:var(--c-muted);font-size:.9rem;">${p.info}</p>`;
    });
  });
}

document.querySelectorAll<HTMLElement>('[data-iw="smtable"]').forEach(init);
