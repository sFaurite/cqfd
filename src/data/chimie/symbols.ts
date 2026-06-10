/**
 * Index des symboles, grandeurs et constantes du cours « La chimie depuis l'atome ».
 * Affiché par /chimie/symboles. `katex` contient le code KaTeX (sans les $).
 */
export interface Symbole {
  katex: string;
  nom: string;
  desc: string;
  unite?: string;
  /** valeur si grandeur de référence, avec statut (quantique / expérimental / empirique) */
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  // Atome quantique
  { katex: '\\psi', nom: 'Fonction d’onde', desc: 'Amplitude de probabilité de l’électron ; |ψ|² donne la densité de probabilité de présence (l’orbitale).', unite: '—', voir: '/chimie/partie-i/atome-hydrogene' },
  { katex: 'n', nom: 'Nombre quantique principal', desc: 'Entier ≥ 1 fixant le niveau d’énergie et la « couche » de l’électron.', unite: '—', voir: '/chimie/partie-i/atome-hydrogene' },
  { katex: '\\ell', nom: 'Nombre quantique azimutal', desc: 'Entier de 0 à n−1 fixant la forme de l’orbitale (s, p, d, f).', unite: '—', voir: '/chimie/partie-i/atome-hydrogene' },
  { katex: 'm_\\ell', nom: 'Nombre quantique magnétique', desc: 'Entier de −ℓ à +ℓ fixant l’orientation de l’orbitale dans l’espace.', unite: '—', voir: '/chimie/partie-i/atome-hydrogene' },
  { katex: 'E_n = -\\dfrac{13{,}6\\,\\text{eV}}{n^2}', nom: 'Niveaux de l’hydrogène', desc: 'Énergie quantifiée de l’électron de l’atome d’hydrogène : vérifiée par les spectres de raies.', unite: 'eV', valeur: '−13,6 eV pour n = 1 (mesuré)', voir: '/chimie/partie-i/atome-hydrogene' },
  { katex: 'Z_{\\text{eff}}', nom: 'Charge nucléaire effective', desc: 'Charge réellement ressentie par un électron, réduite par l’écrantage (Z_eff < Z). Estimée par les règles de Slater.', unite: '—', voir: '/chimie/partie-i/ecrantage-charge-effective' },

  // Périodicité & liaison
  { katex: 'E_i', nom: 'Énergie d’ionisation', desc: 'Énergie pour arracher un électron à un atome gazeux. Augmente le long d’une période.', unite: 'kJ·mol⁻¹', voir: '/chimie/partie-ii/tendances-periodiques' },
  { katex: '\\chi', nom: 'Électronégativité (Pauling)', desc: 'Tendance d’un atome à attirer les électrons d’une liaison. Échelle de Pauling, sans dimension.', unite: '—', valeur: 'F ≈ 3,98 (max) ; Cs ≈ 0,79 (min)', voir: '/chimie/partie-ii/tendances-periodiques' },
  { katex: '\\Delta\\chi', nom: 'Différence d’électronégativité', desc: 'Écart d’électronégativité entre deux atomes liés ; indique le caractère ionique/covalent et la polarité de la liaison.', unite: '—', voir: '/chimie/partie-ii/liaison-covalente-lewis' },
  { katex: 'i', nom: 'Ordre de liaison', desc: 'Demi-différence entre électrons en orbitales liantes et antiliantes. Mesure la « force » de la liaison.', unite: '—', voir: '/chimie/partie-ii/orbitales-moleculaires' },

  // Géométrie & polarité
  { katex: 'AX_nE_m', nom: 'Notation VSEPR', desc: 'A = atome central, X = atomes liés à A (une liaison multiple compte pour un seul X), E = doublets non liants ; détermine la géométrie de la molécule.', unite: '—', voir: '/chimie/partie-iii/vsepr-geometrie' },
  { katex: '\\vec{\\mu}', nom: 'Moment dipolaire', desc: 'Vecteur mesurant la séparation des charges dans une molécule ; sa norme dit si elle est polaire.', unite: 'D (debye)', valeur: '1 D ≈ 3,336×10⁻³⁰ C·m ; H₂O ≈ 1,85 D', voir: '/chimie/partie-iii/polarite-moments-dipolaires' },

  // Thermochimie
  { katex: '\\Delta_r H', nom: 'Enthalpie de réaction', desc: 'Chaleur échangée à pression constante. < 0 : exothermique ; > 0 : endothermique. Additive (loi de Hess).', unite: 'kJ·mol⁻¹', voir: '/chimie/partie-iv/energie-enthalpie' },
  { katex: '\\Delta_r S', nom: 'Entropie de réaction', desc: 'Mesure la variation du nombre de micro-états accessibles au cours de la réaction : ΔS = k_B ln(Ω_f/Ω_i).', unite: 'J·K⁻¹·mol⁻¹', voir: '/chimie/partie-iv/entropie-second-principe' },
  { katex: 'S = k_B \\ln \\Omega', nom: 'Entropie de Boltzmann', desc: 'Définition statistique de l’entropie : Ω est le nombre de micro-états compatibles avec l’état macroscopique.', unite: 'J·K⁻¹', voir: '/chimie/partie-iv/entropie-second-principe' },
  { katex: '\\Delta_r G = \\Delta_r H - T\\,\\Delta_r S', nom: 'Enthalpie libre de réaction', desc: 'Critère de spontanéité à T et P constantes : ΔG < 0, réaction spontanée.', unite: 'kJ·mol⁻¹', voir: '/chimie/partie-iv/enthalpie-libre-spontaneite' },

  // Constantes & solutions
  { katex: 'k_B', nom: 'Constante de Boltzmann', desc: 'Relie énergie microscopique et température ; constante de l’entropie statistique.', unite: 'J·K⁻¹', valeur: '1,380649×10⁻²³ J·K⁻¹ (défini exactement depuis 2019)', voir: '/chimie/partie-iv/entropie-second-principe' },
  { katex: 'R', nom: 'Constante des gaz parfaits', desc: 'Constante molaire ; R = N_A · k_B. Apparaît dans Arrhenius, l’équilibre et les gaz parfaits.', unite: 'J·K⁻¹·mol⁻¹', valeur: '8,314 J·K⁻¹·mol⁻¹', voir: '/chimie/partie-v/cinetique-chimique' },
  { katex: 'N_A', nom: 'Constante d’Avogadro', desc: 'Nombre d’entités par mole : fait le pont entre l’atome et le gramme.', unite: 'mol⁻¹', valeur: '6,02214076×10²³ mol⁻¹ (défini exactement)', voir: '/chimie/partie-ii/tableau-periodique' },
  { katex: 'K', nom: 'Constante d’équilibre', desc: 'Rapport des activités à l’équilibre ; sa valeur situe l’avancement final de la réaction.', unite: '—', voir: '/chimie/partie-v/equilibre-chimique' },
  { katex: 'E_a', nom: 'Énergie d’activation', desc: 'Barrière d’énergie à franchir pour réagir. Intervient dans la loi d’Arrhenius k = A·exp(−Eₐ/RT).', unite: 'kJ·mol⁻¹', voir: '/chimie/partie-v/cinetique-chimique' },
  { katex: '\\text{p}K_a', nom: 'Constante d’acidité', desc: 'pKa = −log Ka : mesure la force d’un acide. À la demi-équivalence d’un titrage, pH = pKa.', unite: '—', valeur: 'tabulé (mesuré expérimentalement) ; ex. CH₃COOH ≈ 4,76', voir: '/chimie/partie-v/acide-base' },
  { katex: 'E^{\\circ}', nom: 'Potentiel standard', desc: 'Potentiel d’un couple redox dans les conditions standard ; classe le pouvoir oxydant/réducteur.', unite: 'V', valeur: 'tabulé par rapport à l’électrode à hydrogène (E° = 0 V)', voir: '/chimie/partie-v/oxydoreduction' },
];
