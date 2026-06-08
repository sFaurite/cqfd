export {}; // module isolé (évite la collision de portée globale avec les autres scripts)

function init(root: HTMLElement) {
  const btn = root.querySelector<HTMLButtonElement>('[data-toggle-higgs]');
  const total = root.querySelector<HTMLElement>('[data-pm-total]');
  const higgsSeg = root.querySelector<HTMLElement>('[data-seg="higgs"]');
  const energieSeg = root.querySelector<HTMLElement>('[data-seg="energie"]');
  const note = root.querySelector<HTMLElement>('[data-pm-note]');
  if (!btn || !total || !higgsSeg || !energieSeg) return;

  let higgsOn = true;
  const baseNote = note?.innerHTML ?? '';

  btn.addEventListener('click', () => {
    higgsOn = !higgsOn;
    if (!higgsOn) {
      higgsSeg.style.flexGrow = '0.5';
      energieSeg.style.flexGrow = '929';
      total.textContent = '≈ 929 MeV/c²';
      btn.textContent = 'Rallumer le champ de Higgs';
      higgsSeg.querySelector('span')!.textContent = '≈ 0';
      if (note)
        note.innerHTML =
          'Champ de Higgs coupé : les quarks perdent leur (petite) masse. Le proton ne passe que de ' +
          '938 à ≈ 929 MeV/c² — il perd à peine 1 %. <strong>La quasi-totalité de la masse survit</strong>, ' +
          'car elle est faite d’énergie d’interaction forte, pas de Higgs.';
    } else {
      higgsSeg.style.flexGrow = '9';
      energieSeg.style.flexGrow = '929';
      total.textContent = '938 MeV/c²';
      btn.textContent = 'Couper le champ de Higgs';
      higgsSeg.querySelector('span')!.textContent = 'Masses des quarks (Higgs) ≈ 1 %';
      if (note) note.innerHTML = baseNote;
    }
  });
}

document.querySelectorAll<HTMLElement>('[data-iw="protonmass"]').forEach(init);
