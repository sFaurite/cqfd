/**
 * Index des symboles mathématiques et physiques utilisés sur le site.
 * Affiché par /symboles. `katex` contient le code KaTeX (sans les $).
 */
export interface Symbole {
  katex: string;
  nom: string;
  /** signification / définition courte */
  desc: string;
  /** unité SI (ou « — » / « sans dimension ») */
  unite?: string;
  /** valeur si constante, avec statut (défini / mesuré) */
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  { katex: 'c', nom: 'Vitesse limite invariante', desc: 'Vitesse identique dans tous les référentiels, borne des causes. Souvent appelée « vitesse de la lumière ».', unite: 'm·s⁻¹', valeur: '299 792 458 m/s (défini exactement par convention depuis 1983)', voir: '/physique/partie-i/postulats' },
  { katex: 'v', nom: 'Vitesse', desc: 'Vitesse d’un objet ou d’un référentiel, souvent rapportée à c via β = v/c.', unite: 'm·s⁻¹' },
  { katex: '\\beta', nom: 'Vitesse réduite', desc: 'β = v/c, vitesse exprimée en fraction de c (sans dimension, entre 0 et 1).', unite: 'sans dimension', voir: '/physique/partie-i/lorentz-gamma' },
  { katex: '\\gamma', nom: 'Facteur de Lorentz', desc: 'γ = 1/√(1 − β²) ≥ 1. Mesure l’intensité des effets relativistes.', unite: 'sans dimension', voir: '/physique/partie-i/lorentz-gamma' },
  { katex: '\\Delta t_0', nom: 'Temps propre', desc: 'Durée mesurée par une horloge au repos (entre deux événements au même lieu pour elle).', unite: 's', voir: '/physique/partie-i/consequences' },
  { katex: '\\Delta t', nom: 'Temps dilaté', desc: 'Durée mesurée pour une horloge en mouvement : Δt = γ·Δt₀.', unite: 's', voir: '/physique/partie-i/consequences' },
  { katex: 'L_0', nom: 'Longueur propre', desc: 'Longueur d’un objet mesurée dans son référentiel de repos.', unite: 'm', voir: '/physique/partie-i/consequences' },
  { katex: 's^2', nom: 'Intervalle d’espace-temps', desc: 's² = (cΔt)² − Δx² : invariant relativiste, identique dans tous les référentiels.', unite: 'm²', voir: '/physique/partie-i/minkowski' },
  { katex: 'm', nom: 'Masse', desc: 'Masse (au repos) d’une particule : grandeur invariante, identique dans tous les référentiels.', unite: 'kg (ou eV/c²)', voir: '/physique/partie-ii/energie' },
  { katex: 'p', nom: 'Quantité de mouvement', desc: 'p = γmv (relativiste). Pour une particule sans masse, p = E/c.', unite: 'kg·m·s⁻¹', voir: '/physique/partie-ii/quantite-mouvement' },
  { katex: 'E', nom: 'Énergie', desc: 'E = γmc². Au repos : E = mc². En général : E² = (mc²)² + (pc)².', unite: 'J (ou eV)', voir: '/physique/partie-ii/energie' },
  { katex: 'E_0', nom: 'Énergie de repos', desc: 'E₀ = mc² : énergie d’une particule immobile.', unite: 'J', voir: '/physique/partie-ii/energie' },
  { katex: 'h', nom: 'Constante de Planck', desc: 'Quantum d’action ; relie énergie et fréquence (E = hν).', unite: 'J·s', valeur: '6,62607015×10⁻³⁴ J·s (défini exactement depuis 2019)', voir: '/physique/partie-iii/dualite-de-broglie' },
  { katex: '\\hbar', nom: 'Constante de Planck réduite', desc: 'ħ = h/2π. Apparaît dans le principe d’incertitude et le spin.', unite: 'J·s', valeur: '1,0546×10⁻³⁴ J·s', voir: '/physique/partie-iii/heisenberg' },
  { katex: '\\nu', nom: 'Fréquence', desc: 'Fréquence d’une onde ; l’énergie d’un photon est E = hν.', unite: 'Hz', voir: '/physique/partie-iii/echec-classique' },
  { katex: '\\lambda', nom: 'Longueur d’onde', desc: 'Longueur d’onde ; pour une particule, λ = h/p (de Broglie).', unite: 'm', voir: '/physique/partie-iii/dualite-de-broglie' },
  { katex: '\\Delta x\\,\\Delta p', nom: 'Produit d’incertitudes', desc: 'Heisenberg : Δx·Δp ≥ ħ/2. Limite fondamentale de connaissance simultanée.', unite: 'J·s', voir: '/physique/partie-iii/heisenberg' },
  { katex: 'N_A', nom: 'Constante d’Avogadro', desc: 'Nombre d’entités par mole.', unite: 'mol⁻¹', valeur: '6,02214076×10²³ mol⁻¹ (défini exactement depuis 2019)' },
  { katex: 'q,\\, e', nom: 'Charge électrique', desc: 'e : charge élémentaire. Les quarks portent des fractions de e (±1/3, ±2/3).', unite: 'C', valeur: 'e = 1,602176634×10⁻¹⁹ C (défini exactement depuis 2019)', voir: '/physique/partie-iv/fermions' },
  { katex: 'm_H', nom: 'Masse du boson de Higgs', desc: 'Masse du boson de Higgs, mesurée au LHC.', unite: 'GeV/c²', valeur: '≈ 125 GeV/c² (mesuré)', voir: '/physique/partie-iv/higgs' },
  { katex: 'm_W,\\, m_Z', nom: 'Masses des bosons W et Z', desc: 'Masses des médiateurs de l’interaction faible (d’où sa courte portée).', unite: 'GeV/c²', valeur: 'm_W ≈ 80,4 ; m_Z ≈ 91,2 GeV/c² (mesurés)', voir: '/physique/partie-v/interaction-faible' },
  { katex: '\\text{eV}', nom: 'Électron-volt', desc: 'Unité d’énergie pratique en physique des particules : énergie gagnée par un électron sous 1 volt. 1 eV ≈ 1,602×10⁻¹⁹ J. Les masses s’expriment en eV/c².', unite: 'énergie' },
  { katex: '\\alpha', nom: 'Constante de structure fine', desc: 'Mesure (sans dimension) de l’intensité de l’interaction électromagnétique.', unite: 'sans dimension', valeur: '≈ 1/137 (mesuré)', voir: '/physique/partie-v/electromagnetisme' },
];
