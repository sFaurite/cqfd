/**
 * Index des symboles et grandeurs du cours « Des atomes au système d'exploitation ».
 * Affiché par /processeurs/symboles. `katex` contient le code KaTeX (sans les $).
 */
export interface Symbole {
  katex: string;
  nom: string;
  desc: string;
  unite?: string;
  /** valeur si grandeur de référence, avec statut (fondé / convention / ordre de grandeur) */
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  // Physique du solide
  { katex: 'E_g', nom: 'Largeur de bande interdite', desc: 'Écart d’énergie entre bande de valence et bande de conduction. Décide isolant / semiconducteur / conducteur.', unite: 'eV', valeur: '≈ 1,12 eV pour le silicium (mesuré, à 300 K)', voir: '/processeurs/partie-i/bandes-energie' },
  { katex: 'E_F', nom: 'Niveau de Fermi', desc: 'Énergie de référence : au zéro absolu, tous les états en dessous sont occupés, ceux au-dessus sont vides.', unite: 'eV', voir: '/processeurs/partie-i/conducteurs-isolants' },
  { katex: 'q,\\, e', nom: 'Charge élémentaire', desc: 'Charge d’un électron (en valeur absolue) ; les porteurs du courant la portent.', unite: 'C', valeur: 'e = 1,602176634×10⁻¹⁹ C (défini exactement depuis 2019)', voir: '/processeurs/partie-i/silicium-dopage' },
  { katex: 'k_B T', nom: 'Énergie thermique', desc: 'Ordre de grandeur de l’agitation thermique ; à 300 K, ≈ 0,026 eV. Compare à Eg pour estimer la conduction.', unite: 'eV', valeur: '≈ 25,9 meV à 300 K', voir: '/processeurs/partie-i/conducteurs-isolants' },

  // Transistor & niveaux logiques
  { katex: 'V_{GS}', nom: 'Tension grille-source', desc: 'Tension appliquée entre la grille et la source d’un MOSFET ; commande l’ouverture du canal.', unite: 'V', voir: '/processeurs/partie-ii/mosfet-structure' },
  { katex: 'V_{th}', nom: 'Tension de seuil', desc: 'Seuil au-delà duquel le canal du MOSFET devient conducteur. En dessous : bloqué.', unite: 'V', valeur: '≈ 0,2 à 0,7 V (dépend du procédé)', voir: '/processeurs/partie-ii/mosfet-interrupteur' },
  { katex: 'V_{DD}', nom: 'Tension d’alimentation', desc: 'Tension du « 1 » logique dans un circuit CMOS ; la masse (0 V) est le « 0 ».', unite: 'V', valeur: '≈ 1,0 à 1,8 V (implémentation)', voir: '/processeurs/partie-ii/inverseur-cmos' },
  { katex: 'V_{OH},\\, V_{OL}', nom: 'Niveaux logiques de sortie', desc: 'Tensions garanties pour un « 1 » (haut) et un « 0 » (bas) en sortie. L’écart aux seuils d’entrée donne la marge de bruit.', unite: 'V', voir: '/processeurs/partie-ii/abstraction-numerique' },
  { katex: 'N_M', nom: 'Marge de bruit', desc: 'Bruit maximal tolérable sans confondre 0 et 1. Garante de la régénération du signal numérique.', unite: 'V', voir: '/processeurs/partie-ii/abstraction-numerique' },

  // Logique & nombres
  { katex: 'n', nom: 'Largeur (en bits)', desc: 'Nombre de bits d’un mot, d’un registre ou d’un bus.', unite: 'bit', voir: '/processeurs/partie-iii/binaire-complement' },
  { katex: '2^{n}', nom: 'Nombre de valeurs codables', desc: 'Un mot de n bits prend 2ⁿ valeurs distinctes (0 à 2ⁿ−1 en non signé).', unite: '—', voir: '/processeurs/partie-iii/binaire-complement' },
  { katex: '[-2^{n-1},\\, 2^{n-1}-1]', nom: 'Plage du complément à deux', desc: 'Intervalle des entiers signés représentables sur n bits.', unite: '—', voir: '/processeurs/partie-iii/binaire-complement' },
  { katex: 'C_{out}', nom: 'Retenue sortante', desc: 'Bit de retenue propagé d’un étage d’addition au suivant (carry).', unite: 'bit', voir: '/processeurs/partie-iii/additionneur-alu' },

  // Temps & mémoire
  { katex: 't_{pd}', nom: 'Délai de propagation', desc: 'Temps que met une porte (ou un chemin) à répercuter un changement d’entrée sur sa sortie. Borne la fréquence d’horloge.', unite: 's', valeur: '≈ 10⁻¹¹ s par porte (implémentation)', voir: '/processeurs/partie-iv/bascule-d-horloge' },
  { katex: 'f', nom: 'Fréquence d’horloge', desc: 'Nombre de cycles par seconde. La période T = 1/f doit dépasser le plus long chemin combinatoire.', unite: 'Hz', valeur: '≈ 10⁹ Hz (GHz, implémentation)', voir: '/processeurs/partie-iv/bascule-d-horloge' },
  { katex: 'T', nom: 'Période d’horloge', desc: 'Durée d’un cycle, T = 1/f. Le circuit doit se stabiliser en moins d’une période.', unite: 's', voir: '/processeurs/partie-iv/bascule-d-horloge' },
  { katex: 't_{setup}', nom: 'Temps de prépositionnement', desc: 'Délai pendant lequel l’entrée d’une bascule doit être stable avant le front d’horloge (setup).', unite: 's', voir: '/processeurs/partie-iv/bascule-d-horloge' },

  // Architecture
  { katex: '\\text{PC}', nom: 'Compteur de programme', desc: 'Registre contenant l’adresse de la prochaine instruction.', unite: 'adresse', voir: '/processeurs/partie-v/datapath' },
  { katex: '\\text{IR}', nom: 'Registre d’instruction', desc: 'Registre qui retient l’instruction en cours de décodage.', unite: '—', voir: '/processeurs/partie-v/controle-fetch-execute' },
  { katex: 'W', nom: 'Largeur d’adresse', desc: 'Nombre de bits d’une adresse ; l’espace adressable contient 2^W cases.', unite: 'bit', voir: '/processeurs/partie-v/von-neumann' },
  { katex: '\\text{CPI}', nom: 'Cycles par instruction', desc: 'Nombre moyen de cycles d’horloge par instruction exécutée ; tend vers 1 avec le pipeline idéal.', unite: '—', valeur: '≈ 1 (pipeline idéalisé)', voir: '/processeurs/partie-v/pipeline' },

  // Boot & mémoire virtuelle
  { katex: '\\text{VA} \\to \\text{PA}', nom: 'Traduction d’adresse', desc: 'Conversion d’une adresse virtuelle (VA) en adresse physique (PA) par la MMU, via la table des pages.', unite: '—', voir: '/processeurs/partie-vi/mode-protege-mmu' },
  { katex: 'P', nom: 'Taille de page', desc: 'Granularité de la mémoire virtuelle : la mémoire est découpée en pages de taille fixe.', unite: 'octet', valeur: '4  Kio = 4096 octets (convention courante)', voir: '/processeurs/partie-vi/mode-protege-mmu' },
];
