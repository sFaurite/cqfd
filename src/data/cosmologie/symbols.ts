/**
 * Index des symboles de la cosmologie utilisés dans le cours.
 * Affiché par /cosmologie/symboles. `katex` contient le code KaTeX (sans les $).
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
  { katex: 'a(t)', nom: 'Facteur d’échelle', desc: 'Taille relative de l’univers : les distances comobiles sont multipliées par a(t). Normalisé à a = 1 aujourd’hui.', unite: 'sans dimension', valeur: 'a₀ = 1 aujourd’hui (convention)', voir: '/cosmologie/partie-i/metrique-flrw' },
  { katex: 'z', nom: 'Redshift', desc: 'Décalage vers le rouge : 1 + z = a₀/a(émission) = λ_obs/λ_émis. Mesure l’expansion subie par la lumière.', unite: 'sans dimension', voir: '/cosmologie/partie-i/redshift-hubble' },
  { katex: 'H', nom: 'Paramètre de Hubble', desc: 'Taux d’expansion H = ȧ/a, fonction du temps. Relie vitesse de récession et distance.', unite: 's⁻¹ (ou km/s/Mpc)', voir: '/cosmologie/partie-i/redshift-hubble' },
  { katex: 'H_0', nom: 'Constante de Hubble', desc: 'Valeur actuelle de H. Sujette à la « tension de Hubble » entre méthodes.', unite: 'km·s⁻¹·Mpc⁻¹', valeur: '≈ 67–73 km/s/Mpc (mesuré ; valeur en tension)', voir: '/cosmologie/partie-i/redshift-hubble' },
  { katex: 'k', nom: 'Courbure spatiale', desc: 'Signe de la géométrie : k > 0 fermée, k = 0 plate, k < 0 ouverte.', unite: 'm⁻² (ou ±1, 0)', valeur: '≈ 0 (univers quasi plat, mesuré)', voir: '/cosmologie/partie-i/metrique-flrw' },
  { katex: 'G', nom: 'Constante de gravitation', desc: 'Constante de Newton, intensité de la gravité ; apparaît dans les équations de Friedmann.', unite: 'm³·kg⁻¹·s⁻²', valeur: '6,674×10⁻¹¹ m³·kg⁻¹·s⁻² (mesuré)', voir: '/cosmologie/partie-ii/equations-friedmann' },
  { katex: 'c', nom: 'Vitesse de la lumière', desc: 'Vitesse limite et invariante ; relie distances et temps de parcours de la lumière.', unite: 'm·s⁻¹', valeur: '299 792 458 m/s (défini exactement)', voir: '/cosmologie/partie-i/relativite-cadre' },
  { katex: '\\rho', nom: 'Densité d’énergie', desc: 'Densité de masse-énergie d’une composante (matière, rayonnement, Λ). Source du champ gravitationnel cosmique.', unite: 'kg·m⁻³', voir: '/cosmologie/partie-ii/contenu-univers' },
  { katex: '\\rho_c', nom: 'Densité critique', desc: 'Densité qui rend l’univers spatialement plat : ρc = 3H²/(8πG).', unite: 'kg·m⁻³', valeur: '≈ 8,5×10⁻²⁷ kg/m³ (≈ 6 protons/m³, pour H₀ ≈ 70)', voir: '/cosmologie/partie-ii/parametres-densite' },
  { katex: 'p', nom: 'Pression', desc: 'Pression d’une composante ; intervient dans la 2ᵉ équation de Friedmann (l’accélération).', unite: 'Pa', voir: '/cosmologie/partie-ii/equations-friedmann' },
  { katex: 'w', nom: 'Paramètre d’équation d’état', desc: 'Rapport p = w·ρc². Matière w = 0, rayonnement w = 1/3, constante cosmologique w = −1.', unite: 'sans dimension', valeur: 'matière 0 ; rayonnement 1/3 ; Λ ≈ −1 (mesuré ≈ −1)', voir: '/cosmologie/partie-ii/contenu-univers' },
  { katex: '\\Omega', nom: 'Paramètre de densité', desc: 'Rapport Ω = ρ/ρc d’une composante à la densité critique. La somme fixe la géométrie.', unite: 'sans dimension', voir: '/cosmologie/partie-ii/parametres-densite' },
  { katex: '\\Omega_m', nom: 'Densité de matière', desc: 'Part de la matière (noire + baryonique) dans le bilan énergétique.', unite: 'sans dimension', valeur: '≈ 0,31 (mesuré)', voir: '/cosmologie/partie-ii/parametres-densite' },
  { katex: '\\Omega_b', nom: 'Densité baryonique', desc: 'Part de la matière ordinaire (protons, neutrons). Bien plus petite que Ω_m.', unite: 'sans dimension', valeur: '≈ 0,049 (mesuré)', voir: '/cosmologie/partie-iv/baryogenese' },
  { katex: '\\Omega_\\Lambda', nom: 'Densité d’énergie noire', desc: 'Part de la constante cosmologique / énergie noire ; domine aujourd’hui et accélère l’expansion.', unite: 'sans dimension', valeur: '≈ 0,69 (mesuré)', voir: '/cosmologie/partie-v/energie-noire' },
  { katex: '\\Omega_r', nom: 'Densité de rayonnement', desc: 'Part du rayonnement (photons, neutrinos relativistes). Dominait l’univers primordial, négligeable aujourd’hui.', unite: 'sans dimension', valeur: '≈ 9×10⁻⁵ (mesuré)', voir: '/cosmologie/partie-ii/contenu-univers' },
  { katex: '\\Lambda', nom: 'Constante cosmologique', desc: 'Terme d’énergie du vide à pression négative dans les équations d’Einstein ; le « Λ » de ΛCDM.', unite: 'm⁻²', valeur: '≈ 1,1×10⁻⁵² m⁻² (mesuré, via Ω_Λ)', voir: '/cosmologie/partie-v/energie-noire' },
  { katex: 'T_{\\rm CMB}', nom: 'Température du fond diffus', desc: 'Température actuelle du rayonnement de corps noir cosmologique. Évolue comme 1/a (∝ 1 + z).', unite: 'K', valeur: '2,7255 K (mesuré, COBE/Planck)', voir: '/cosmologie/partie-iii/recombinaison-cmb' },
  { katex: 't_0', nom: 'Âge de l’univers', desc: 'Temps écoulé depuis le Big Bang chaud jusqu’à aujourd’hui.', unite: 'an (ou s)', valeur: '≈ 13,8 milliards d’années (mesuré)', voir: '/cosmologie/partie-vi/modele-lcdm' },
  { katex: 'd_H', nom: 'Rayon de Hubble', desc: 'Échelle c/H : distance au-delà de laquelle la récession dépasse c. Borne approximative de l’horizon causal.', unite: 'm (ou Mpc)', voir: '/cosmologie/partie-iv/problemes-big-bang' },
  { katex: 'n_s', nom: 'Indice spectral scalaire', desc: 'Pente du spectre des fluctuations primordiales. Légèrement inférieur à 1, comme le prédit l’inflation.', unite: 'sans dimension', valeur: '≈ 0,965 (mesuré, Planck)', voir: '/cosmologie/partie-iv/fluctuations-primordiales' },
  { katex: '\\eta_B', nom: 'Asymétrie baryonique', desc: 'Excès relatif de matière sur l’antimatière : rapport baryons/photons. Minuscule mais décisif.', unite: 'sans dimension', valeur: '≈ 6×10⁻¹⁰ (mesuré)', voir: '/cosmologie/partie-iv/baryogenese' },
  { katex: 'S_8', nom: 'Amplitude des structures', desc: 'Mesure combinée de l’amplitude et de la densité de matière des fluctuations ; objet d’une légère tension.', unite: 'sans dimension', valeur: '≈ 0,8 (mesuré ; en légère tension)', voir: '/cosmologie/partie-vi/tensions-cosmologiques' },
  { katex: 't_P', nom: 'Temps de Planck', desc: 'Échelle de temps en deçà de laquelle la gravité quantique domine et la physique connue cesse de s’appliquer.', unite: 's', valeur: '≈ 5,4×10⁻⁴⁴ s (défini à partir de constantes)', voir: '/cosmologie/partie-vi/questions-ouvertes' },
  { katex: 'M_J', nom: 'Masse de Jeans', desc: 'Masse critique au-delà de laquelle une surdensité s’effondre gravitationnellement malgré la pression.', unite: 'kg', voir: '/cosmologie/partie-v/instabilite-jeans' },
];
