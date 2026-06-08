/**
 * Navigation du cours « Des atomes au système d'exploitation » — SOURCE UNIQUE
 * de l'ordre. Chemins NON préfixés : `index.ts` les préfixe par `/processeurs`.
 */
import type { Partie } from './_maths';

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce cours, et ce que signifient les encarts et les badges de fiabilité.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce cours', court: 'Comment lire ce cours', accroche: 'Les encarts dépliables, l’échelle de fiabilité ingénierie, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « fondé », « convention », « idéalisé », « implémentation ».' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'La matière qui calcule',
    accroche: 'Des niveaux d’énergie atomiques aux semiconducteurs : pourquoi le silicium dopé peut commander un courant.',
    chapitres: [
      { slug: 'atomes-niveaux', path: '/partie-i/atomes-niveaux', num: 1, titre: 'Atomes, électrons et niveaux d’énergie', court: 'Niveaux d’énergie', accroche: 'Le point de départ admis : la matière est quantique. Niveaux discrets, principe de Pauli.' },
      { slug: 'bandes-energie', path: '/partie-i/bandes-energie', num: 2, titre: 'Des niveaux aux bandes d’énergie', court: 'Bandes d’énergie', accroche: 'En rapprochant N atomes, les niveaux se fondent en bandes séparées par un gap.' },
      { slug: 'conducteurs-isolants', path: '/partie-i/conducteurs-isolants', num: 3, titre: 'Conducteurs, isolants, semiconducteurs', court: 'Conducteurs & isolants', accroche: 'Le remplissage des bandes et la largeur du gap décident de tout.' },
      { slug: 'silicium-dopage', path: '/partie-i/silicium-dopage', num: 4, titre: 'Le silicium et le dopage (N et P)', court: 'Silicium & dopage', accroche: 'Ajouter des impuretés crée des porteurs majoritaires : type N (électrons), type P (trous).' },
      { slug: 'jonction-pn', path: '/partie-i/jonction-pn', num: 5, titre: 'La jonction PN et la diode', court: 'Jonction PN', accroche: 'Accoler N et P crée une zone de déplétion : le courant ne passe que dans un sens.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Le transistor, interrupteur commandé',
    accroche: 'Du MOSFET à l’inverseur CMOS : comment une tension commande un courant, et naît le « 0/1 ».',
    chapitres: [
      { slug: 'mosfet-structure', path: '/partie-ii/mosfet-structure', num: 6, titre: 'Le transistor MOSFET : effet de champ', court: 'MOSFET : structure', accroche: 'La structure métal-oxyde-semiconducteur, et le canal d’inversion créé par la grille.' },
      { slug: 'mosfet-interrupteur', path: '/partie-ii/mosfet-interrupteur', num: 7, titre: 'Le MOSFET comme interrupteur', court: 'MOSFET interrupteur', accroche: 'Sous le seuil : bloqué. Au-dessus : passant. L’idéalisation qui fonde toute la suite.' },
      { slug: 'inverseur-cmos', path: '/partie-ii/inverseur-cmos', num: 8, titre: 'L’inverseur CMOS : le premier calcul', court: 'Inverseur CMOS', accroche: 'NMOS + PMOS en tandem : la fonction NON, sans courant statique.' },
      { slug: 'abstraction-numerique', path: '/partie-ii/abstraction-numerique', num: 9, titre: 'Le tournant numérique : 0 et 1', court: 'Abstraction 0/1', accroche: 'On décide d’ignorer l’analogique. Marges de bruit, régénération du signal : pourquoi ça tient.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'L’algèbre du tout-ou-rien',
    accroche: 'De l’algèbre de Boole à l’ALU : comment des portes logiques calculent, comparent et additionnent.',
    chapitres: [
      { slug: 'algebre-boole', path: '/partie-iii/algebre-boole', num: 10, titre: 'L’algèbre de Boole', court: 'Algèbre de Boole', accroche: 'Deux valeurs, trois opérations, des axiomes. Le langage mathématique du circuit.' },
      { slug: 'portes-nand', path: '/partie-iii/portes-nand', num: 11, titre: 'Portes universelles : NAND et NOR', court: 'Portes universelles', accroche: 'Toute fonction logique se construit avec une seule porte. Complétude fonctionnelle.' },
      { slug: 'circuits-combinatoires', path: '/partie-iii/circuits-combinatoires', num: 12, titre: 'Circuits combinatoires : MUX, décodeurs', court: 'Circuits combinatoires', accroche: 'D’une table de vérité au circuit : multiplexeurs, décodeurs, et la synthèse.' },
      { slug: 'binaire-complement', path: '/partie-iii/binaire-complement', num: 13, titre: 'Représenter les nombres : le complément à deux', court: 'Binaire & compl. à 2', accroche: 'Coder les entiers signés pour que l’addition « marche toute seule ». Une convention géniale.' },
      { slug: 'additionneur-alu', path: '/partie-iii/additionneur-alu', num: 14, titre: 'L’additionneur et l’ALU', court: 'Additionneur & ALU', accroche: 'Demi-additionneur, retenue propagée, puis l’unité arithmétique et logique du processeur.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'La mémoire et le temps',
    accroche: 'La rétroaction crée la mémoire ; l’horloge crée le temps. Bascules, registres, automates, RAM.',
    chapitres: [
      { slug: 'bascule-rs', path: '/partie-iv/bascule-rs', num: 15, titre: 'Se souvenir : la bascule RS', court: 'Bascule RS', accroche: 'Reboucler deux portes l’une sur l’autre : le circuit garde un état. La naissance du bit mémoire.' },
      { slug: 'bascule-d-horloge', path: '/partie-iv/bascule-d-horloge', num: 16, titre: 'La bascule D et l’horloge', court: 'Bascule D & horloge', accroche: 'Échantillonner sur un front d’horloge : le registre synchrone, brique du séquencement.' },
      { slug: 'machines-etats', path: '/partie-iv/machines-etats', num: 17, titre: 'Les machines à états finis', court: 'Machines à états', accroche: 'Registre d’état + logique combinatoire = automate. Le séquenceur qui orchestre tout.' },
      { slug: 'memoires-sram-dram', path: '/partie-iv/memoires-sram-dram', num: 18, titre: 'Mémoires : SRAM et DRAM', court: 'SRAM & DRAM', accroche: 'Six transistors (rapide) ou un condensateur (dense) : deux façons de stocker un bit en masse.' },
      { slug: 'hierarchie-cache', path: '/partie-iv/hierarchie-cache', num: 19, titre: 'La hiérarchie mémoire et le cache', court: 'Hiérarchie & cache', accroche: 'Concilier vitesse et capacité grâce à la localité : registres, caches, RAM, disque.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'L’architecture d’un processeur',
    accroche: 'Assembler mémoire et calcul en une machine programmable : von Neumann, ISA, datapath, le cycle.',
    chapitres: [
      { slug: 'von-neumann', path: '/partie-v/von-neumann', num: 20, titre: 'Le modèle de von Neumann', court: 'Von Neumann', accroche: 'Programme et données dans la même mémoire : le choix d’architecture qui rend la machine universelle.' },
      { slug: 'isa', path: '/partie-v/isa', num: 21, titre: 'Le jeu d’instructions (ISA)', court: 'Jeu d’instructions', accroche: 'Le contrat entre le matériel et le logiciel : opcodes, registres, encodage. Une convention.' },
      { slug: 'datapath', path: '/partie-v/datapath', num: 22, titre: 'Le chemin de données', court: 'Datapath', accroche: 'Banc de registres, ALU, compteur de programme, bus : par où circulent les bits.' },
      { slug: 'controle-fetch-execute', path: '/partie-v/controle-fetch-execute', num: 23, titre: 'L’unité de contrôle : fetch–decode–execute', court: 'Fetch–decode–execute', accroche: 'Le cycle qui anime tout : chercher, décoder, exécuter — une instruction après l’autre.' },
      { slug: 'pipeline', path: '/partie-v/pipeline', num: 24, titre: 'Le pipeline et les aléas', court: 'Pipeline', accroche: 'Traiter plusieurs instructions à la chaîne ; gérer les aléas et la prédiction de branchement.' },
      { slug: 'interruptions-dma', path: '/partie-v/interruptions-dma', num: 25, titre: 'Interruptions, exceptions et DMA', court: 'Interruptions & DMA', accroche: 'Comment le matériel interrompt le flot d’exécution pour réagir au monde extérieur.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Du matériel au logiciel : le boot',
    accroche: 'Depuis le reset jusqu’au premier processus : firmware, bootloader, noyau, mémoire virtuelle.',
    chapitres: [
      { slug: 'reset-rom', path: '/partie-vi/reset-rom', num: 26, titre: 'Le reset et le vecteur de boot', court: 'Reset & ROM', accroche: 'À la mise sous tension : un état connu, une adresse fixe, du code en ROM. Le tout premier pas.' },
      { slug: 'firmware-uefi', path: '/partie-vi/firmware-uefi', num: 27, titre: 'Le firmware (BIOS/UEFI) et le POST', court: 'Firmware / UEFI', accroche: 'Initialiser la mémoire et les bus, tester le matériel, trouver de quoi démarrer.' },
      { slug: 'bootloader', path: '/partie-vi/bootloader', num: 28, titre: 'Le bootloader et le chargement du noyau', court: 'Bootloader', accroche: 'Le relais en plusieurs étages qui charge le noyau du système en mémoire et lui passe la main.' },
      { slug: 'mode-protege-mmu', path: '/partie-vi/mode-protege-mmu', num: 29, titre: 'Mode protégé et mémoire virtuelle (MMU)', court: 'Mode protégé & MMU', accroche: 'Le noyau active la protection et la pagination : chaque programme croit avoir toute la mémoire.' },
      { slug: 'premier-processus', path: '/partie-vi/premier-processus', num: 30, titre: 'Le premier processus et la pile complète', court: 'Premier processus', accroche: 'init / l’ordonnanceur démarrent : la synthèse, de l’électron au système d’exploitation.' },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des symboles.',
    chapitres: [
      { slug: 'glossaire', path: '/glossaire', num: 0, titre: 'Glossaire', court: 'Glossaire', accroche: 'Tous les termes techniques, reliés à leur page.' },
      { slug: 'symboles', path: '/symboles', num: 0, titre: 'Index des symboles', court: 'Index des symboles', accroche: 'Chaque symbole et grandeur, avec son unité et son statut.' },
    ],
  },
];
