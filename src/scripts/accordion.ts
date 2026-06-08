/**
 * Amélioration progressive des encarts dépliables (<details class="encart">).
 *
 * Sans JS : le <details> fonctionne nativement (ouverture instantanée, a11y OK).
 * Avec JS : on anime en douceur la hauteur + l'opacité, en respectant
 * prefers-reduced-motion. Gère aussi les boutons « tout déplier / replier ».
 */

const DUREE = 280;
const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function ouvrir(details: HTMLDetailsElement, body: HTMLElement) {
  if (reduceMotion()) {
    details.open = true;
    return;
  }
  details.dataset.animating = '1';
  details.open = true;
  const h = body.scrollHeight;
  body.style.overflow = 'hidden';
  body.style.height = '0px';
  body.style.opacity = '0';
  requestAnimationFrame(() => {
    body.style.transition = `height ${DUREE}ms ease, opacity ${DUREE}ms ease`;
    body.style.height = `${h}px`;
    body.style.opacity = '1';
  });
  const fin = (ev: TransitionEvent) => {
    if (ev.propertyName !== 'height') return;
    body.style.removeProperty('height');
    body.style.removeProperty('opacity');
    body.style.removeProperty('overflow');
    body.style.removeProperty('transition');
    delete details.dataset.animating;
    body.removeEventListener('transitionend', fin);
  };
  body.addEventListener('transitionend', fin);
}

function fermer(details: HTMLDetailsElement, body: HTMLElement) {
  if (reduceMotion()) {
    details.open = false;
    return;
  }
  details.dataset.animating = '1';
  const h = body.scrollHeight;
  body.style.overflow = 'hidden';
  body.style.height = `${h}px`;
  body.style.opacity = '1';
  requestAnimationFrame(() => {
    body.style.transition = `height ${DUREE}ms ease, opacity ${DUREE}ms ease`;
    body.style.height = '0px';
    body.style.opacity = '0';
  });
  const fin = (ev: TransitionEvent) => {
    if (ev.propertyName !== 'height') return;
    details.open = false;
    body.style.removeProperty('height');
    body.style.removeProperty('opacity');
    body.style.removeProperty('overflow');
    body.style.removeProperty('transition');
    delete details.dataset.animating;
    body.removeEventListener('transitionend', fin);
  };
  body.addEventListener('transitionend', fin);
}

function enhance(details: HTMLDetailsElement) {
  const summary = details.querySelector('summary');
  const body = details.querySelector<HTMLElement>('.encart__body');
  if (!summary || !body || details.dataset.enhanced) return;
  details.dataset.enhanced = '1';
  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (details.dataset.animating) return;
    if (details.open) fermer(details, body);
    else ouvrir(details, body);
  });
}

function initAccordions() {
  document
    .querySelectorAll<HTMLDetailsElement>('details.encart')
    .forEach(enhance);

  // Boutons « tout déplier / replier »
  document.querySelectorAll<HTMLButtonElement>('[data-encart-all]').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const action = btn.dataset.encartAll; // 'open' | 'close'
      const scope = btn.closest('[data-encart-scope]') ?? document;
      scope
        .querySelectorAll<HTMLDetailsElement>('details.encart')
        .forEach((d) => {
          d.open = action === 'open';
        });
    });
  });
}

if (document.readyState !== 'loading') initAccordions();
else document.addEventListener('DOMContentLoaded', initAccordions);
