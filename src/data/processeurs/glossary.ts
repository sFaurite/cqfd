/**
 * Glossaire du cours « Des atomes au système d'exploitation ».
 * Chaque terme, sa définition courte, et la page où il est introduit (`voir`).
 */
export interface TermeGlossaire {
  terme: string;
  /** définition courte (HTML simple autorisé : <em>, <strong>) */
  def: string;
  voir?: string;
  alias?: string[];
}

export const GLOSSAIRE: TermeGlossaire[] = [
  // Partie I — physique du solide
  { terme: 'Niveau d’énergie', def: 'Valeur d’énergie permise pour un électron lié à un atome. En physique quantique, ces valeurs sont <strong>discrètes</strong> (quantifiées), pas continues.', voir: '/processeurs/partie-i/atomes-niveaux' },
  { terme: 'Principe d’exclusion de Pauli', def: 'Deux électrons d’un même système ne peuvent occuper le même état quantique. Force les électrons à remplir les niveaux du bas vers le haut.', voir: '/processeurs/partie-i/atomes-niveaux', alias: ['Pauli'] },
  { terme: 'Bande d’énergie', def: 'En rapprochant N atomes, leurs niveaux identiques se dédoublent en N niveaux très serrés : une <strong>bande</strong> quasi continue d’états permis.', voir: '/processeurs/partie-i/bandes-energie', alias: ['bande de valence', 'bande de conduction'] },
  { terme: 'Bande interdite (gap)', def: 'Intervalle d’énergie sans état permis entre la bande de valence et la bande de conduction. Sa largeur Eg décide si le matériau conduit.', voir: '/processeurs/partie-i/bandes-energie', alias: ['gap', 'Eg', 'bande interdite'] },
  { terme: 'Semiconducteur', def: 'Matériau au gap modéré (≈ 1 eV pour le silicium) : isolant au zéro absolu, mais conducteur dès qu’on l’agite (chaleur, dopage, lumière).', voir: '/processeurs/partie-i/conducteurs-isolants', alias: ['silicium'] },
  { terme: 'Dopage', def: 'Introduction contrôlée d’impuretés dans le silicium pour créer des porteurs de charge libres : type N (donneurs, électrons) ou type P (accepteurs, trous).', voir: '/processeurs/partie-i/silicium-dopage', alias: ['type N', 'type P', 'donneur', 'accepteur'] },
  { terme: 'Trou', def: 'Absence d’électron dans la bande de valence, qui se comporte comme une charge positive mobile. Porteur majoritaire du silicium dopé P.', voir: '/processeurs/partie-i/silicium-dopage' },
  { terme: 'Jonction PN', def: 'Contact entre une zone dopée P et une zone dopée N. La diffusion des porteurs y crée une <strong>zone de déplétion</strong> et un champ interne : le courant ne passe que dans un sens.', voir: '/processeurs/partie-i/jonction-pn', alias: ['diode', 'zone de déplétion'] },

  // Partie II — transistor
  { terme: 'MOSFET', def: 'Transistor à effet de champ métal-oxyde-semiconducteur. Une tension sur la <em>grille</em> isolée crée (ou non) un canal conducteur entre <em>source</em> et <em>drain</em>.', voir: '/processeurs/partie-ii/mosfet-structure', alias: ['transistor', 'grille', 'source', 'drain'] },
  { terme: 'Tension de seuil (Vth)', def: 'Tension de grille au-delà de laquelle le canal du MOSFET s’ouvre. En dessous : bloqué ; au-dessus : passant.', voir: '/processeurs/partie-ii/mosfet-interrupteur', alias: ['Vth', 'seuil'] },
  { terme: 'CMOS', def: 'Technologie associant transistors NMOS et PMOS complémentaires. Ne consomme presque pas de courant statique : l’un des deux est toujours bloqué.', voir: '/processeurs/partie-ii/inverseur-cmos', alias: ['NMOS', 'PMOS', 'inverseur CMOS'] },
  { terme: 'Abstraction numérique', def: 'Décision d’ingénierie d’interpréter une tension comme un <strong>0</strong> ou un <strong>1</strong> selon des seuils, en ignorant les valeurs intermédiaires. Rend le calcul fiable et régénérable.', voir: '/processeurs/partie-ii/abstraction-numerique', alias: ['niveau logique', 'marge de bruit'] },

  // Partie III — logique
  { terme: 'Algèbre de Boole', def: 'Algèbre à deux valeurs (0, 1) avec les opérations ET, OU, NON. Le langage mathématique des circuits logiques.', voir: '/processeurs/partie-iii/algebre-boole', alias: ['ET', 'OU', 'NON', 'booléen'] },
  { terme: 'Porte logique', def: 'Circuit réalisant une fonction booléenne élémentaire (ET, OU, NON, NAND…) à partir de transistors.', voir: '/processeurs/partie-iii/algebre-boole' },
  { terme: 'Complétude fonctionnelle', def: 'Propriété d’un jeu de portes permettant de construire <em>toute</em> fonction logique. La porte NAND (ou NOR) est universelle à elle seule.', voir: '/processeurs/partie-iii/portes-nand', alias: ['NAND', 'NOR', 'porte universelle'] },
  { terme: 'Multiplexeur', def: 'Circuit combinatoire qui sélectionne une entrée parmi plusieurs selon des bits de commande. Brique de l’aiguillage des données.', voir: '/processeurs/partie-iii/circuits-combinatoires', alias: ['MUX', 'décodeur'] },
  { terme: 'Complément à deux', def: 'Convention de codage des entiers signés où −x se code comme l’inverse binaire de x plus 1. L’addition signée se fait alors avec le même circuit que l’addition non signée.', voir: '/processeurs/partie-iii/binaire-complement', alias: ['entier signé', 'binaire'] },
  { terme: 'Additionneur', def: 'Circuit combinatoire calculant la somme binaire de deux nombres. Le demi-additionneur traite un bit ; l’additionneur complet propage la retenue.', voir: '/processeurs/partie-iii/additionneur-alu', alias: ['retenue', 'carry', 'demi-additionneur'] },
  { terme: 'ALU', def: 'Unité arithmétique et logique : le circuit combinatoire qui effectue additions, comparaisons et opérations logiques selon un code d’opération.', voir: '/processeurs/partie-iii/additionneur-alu', alias: ['unité arithmétique et logique'] },

  // Partie IV — mémoire & temps
  { terme: 'Bascule RS', def: 'Deux portes rebouclées l’une sur l’autre qui mémorisent un bit (Set / Reset). Premier circuit séquentiel : sa sortie dépend de son passé.', voir: '/processeurs/partie-iv/bascule-rs', alias: ['latch', 'verrou', 'rétroaction'] },
  { terme: 'Bascule D', def: 'Élément mémoire qui recopie son entrée D sur sa sortie au <strong>front</strong> d’une horloge, et la conserve sinon. Brique du registre synchrone.', voir: '/processeurs/partie-iv/bascule-d-horloge', alias: ['flip-flop', 'front d’horloge'] },
  { terme: 'Horloge', def: 'Signal périodique qui cadence le circuit séquentiel. Chaque front déclenche la mise à jour simultanée de tous les registres.', voir: '/processeurs/partie-iv/bascule-d-horloge', alias: ['clock', 'fréquence'] },
  { terme: 'Registre', def: 'Ensemble de bascules D partageant la même horloge, stockant un mot de n bits.', voir: '/processeurs/partie-iv/bascule-d-horloge' },
  { terme: 'Machine à états finis', def: 'Registre d’état + logique combinatoire qui calcule l’état suivant et les sorties. Le séquenceur qui orchestre un circuit.', voir: '/processeurs/partie-iv/machines-etats', alias: ['automate', 'FSM', 'séquenceur'] },
  { terme: 'SRAM', def: 'Mémoire statique : chaque bit est une bascule à 6 transistors. Rapide, mais encombrante. Utilisée pour les caches.', voir: '/processeurs/partie-iv/memoires-sram-dram', alias: ['mémoire statique'] },
  { terme: 'DRAM', def: 'Mémoire dynamique : chaque bit est un condensateur (1 transistor). Dense et bon marché, mais doit être <em>rafraîchie</em> périodiquement. La mémoire vive principale.', voir: '/processeurs/partie-iv/memoires-sram-dram', alias: ['mémoire dynamique', 'rafraîchissement', 'RAM'] },
  { terme: 'Cache', def: 'Petite mémoire rapide (SRAM) qui garde une copie des données récemment utilisées. Exploite la <strong>localité</strong> des accès pour masquer la lenteur de la DRAM.', voir: '/processeurs/partie-iv/hierarchie-cache', alias: ['localité', 'hit', 'miss', 'hiérarchie mémoire'] },

  // Partie V — architecture
  { terme: 'Architecture de von Neumann', def: 'Modèle où instructions et données partagent la même mémoire, lues par un processeur unique. Rend la machine <strong>programmable</strong> et universelle.', voir: '/processeurs/partie-v/von-neumann', alias: ['von Neumann', 'programme enregistré', 'Harvard'] },
  { terme: 'Jeu d’instructions (ISA)', def: 'Le contrat entre matériel et logiciel : la liste des instructions, leur encodage binaire, les registres visibles. Une convention (x86, ARM, RISC-V).', voir: '/processeurs/partie-v/isa', alias: ['ISA', 'opcode', 'assembleur', 'instruction'] },
  { terme: 'Chemin de données (datapath)', def: 'Les ressources qui transportent et transforment les bits : banc de registres, ALU, compteur de programme, bus.', voir: '/processeurs/partie-v/datapath', alias: ['datapath', 'bus'] },
  { terme: 'Compteur de programme (PC)', def: 'Registre contenant l’adresse de la prochaine instruction à exécuter. Incrémenté à chaque cycle, modifié par les branchements.', voir: '/processeurs/partie-v/datapath', alias: ['PC', 'pointeur d’instruction'] },
  { terme: 'Cycle fetch–decode–execute', def: 'Le rythme fondamental du processeur : chercher l’instruction (fetch), la décoder, l’exécuter — puis recommencer.', voir: '/processeurs/partie-v/controle-fetch-execute', alias: ['fetch', 'decode', 'execute', 'unité de contrôle'] },
  { terme: 'Pipeline', def: 'Découpage de l’exécution en étages traités à la chaîne, comme une usine : plusieurs instructions progressent en même temps.', voir: '/processeurs/partie-v/pipeline', alias: ['aléa', 'prédiction de branchement'] },
  { terme: 'Interruption', def: 'Signal qui suspend le flot d’exécution pour traiter un événement (matériel ou logiciel), puis y revient. Permet de réagir au monde extérieur.', voir: '/processeurs/partie-v/interruptions-dma', alias: ['exception', 'IRQ', 'DMA'] },

  // Partie VI — boot
  { terme: 'Reset', def: 'Mise du processeur dans un état initial connu à la mise sous tension : registres fixés, PC pointant sur le <strong>vecteur de boot</strong>.', voir: '/processeurs/partie-vi/reset-rom', alias: ['vecteur de boot', 'reset vector'] },
  { terme: 'Firmware', def: 'Logiciel gravé en mémoire non volatile (ROM/flash) exécuté en premier : il initialise le matériel et cherche de quoi démarrer. BIOS ou UEFI sur PC.', voir: '/processeurs/partie-vi/firmware-uefi', alias: ['BIOS', 'UEFI', 'POST'] },
  { terme: 'Bootloader', def: 'Programme intermédiaire qui charge le noyau du système d’exploitation en mémoire et lui transfère le contrôle.', voir: '/processeurs/partie-vi/bootloader', alias: ['chargeur d’amorçage', 'GRUB'] },
  { terme: 'Mode protégé', def: 'Mode du processeur qui isole les programmes les uns des autres et du noyau, via des niveaux de privilège. Activé tôt au démarrage.', voir: '/processeurs/partie-vi/mode-protege-mmu', alias: ['niveau de privilège', 'mode noyau', 'mode utilisateur'] },
  { terme: 'Mémoire virtuelle (MMU)', def: 'Mécanisme qui donne à chaque programme l’illusion de disposer de toute la mémoire. La <strong>MMU</strong> traduit les adresses virtuelles en adresses physiques via une table des pages.', voir: '/processeurs/partie-vi/mode-protege-mmu', alias: ['MMU', 'pagination', 'page', 'table des pages', 'adresse virtuelle'] },
  { terme: 'Processus', def: 'Programme en cours d’exécution, avec son espace mémoire propre. Le premier (<em>init</em>) est lancé par le noyau et engendre tous les autres.', voir: '/processeurs/partie-vi/premier-processus', alias: ['init', 'ordonnanceur', 'noyau', 'kernel'] },
];
