/**
 * Index des symboles et grandeurs du cours « Les réseaux depuis le bit ».
 * Affiché par /reseaux/symboles. `katex` contient le code KaTeX (sans les $).
 */
export interface Symbole {
  katex: string;
  nom: string;
  desc: string;
  unite?: string;
  /** valeur si grandeur de référence, avec statut (théorème / norme / déploiement) */
  valeur?: string;
  voir?: string;
}

export const SYMBOLES: Symbole[] = [
  // Information & signal
  { katex: 'H', nom: 'Quantité d’information', desc: 'Information moyenne par symbole, en bits ; pour une source à symboles équiprobables, H = log₂(M).', unite: 'bit', voir: '/reseaux/partie-i/bit-information' },
  { katex: 'B', nom: 'Bande passante', desc: 'Largeur de la plage de fréquences transmise par le canal. Borne la rapidité de modulation.', unite: 'Hz', voir: '/reseaux/partie-i/signal-bande-passante' },
  { katex: 'D = 2B\\log_2 M', nom: 'Débit de Nyquist', desc: 'Débit binaire maximal sur un canal sans bruit de bande B, avec M niveaux par symbole.', unite: 'bit/s', valeur: 'au plus 2B symboles/s (théorème de Nyquist)', voir: '/reseaux/partie-i/nyquist' },
  { katex: 'S/N', nom: 'Rapport signal/bruit', desc: 'Rapport des puissances signal et bruit ; en décibels, (S/N)_dB = 10·log₁₀(S/N).', unite: '— (ou dB)', voir: '/reseaux/partie-i/bruit-shannon' },
  { katex: 'C = B\\log_2\\!\\left(1+\\tfrac{S}{N}\\right)', nom: 'Capacité de Shannon', desc: 'Débit maximal théorique d’un canal bruité. Aucune méthode ne permet de le dépasser.', unite: 'bit/s', valeur: 'limite infranchissable (théorème de Shannon)', voir: '/reseaux/partie-i/bruit-shannon' },

  // Du signal à la trame
  { katex: 'M', nom: 'Ordre de modulation', desc: 'Nombre d’états distincts d’un symbole ; chaque symbole transporte log₂(M) bits (QPSK : 4, QAM-256 : 256).', unite: '—', voir: '/reseaux/partie-ii/modulation' },
  { katex: 'R_s', nom: 'Débit symbole (baud)', desc: 'Nombre de symboles transmis par seconde (rapidité de modulation), borné par 2B.', unite: 'Bd', voir: '/reseaux/partie-ii/modulation' },
  { katex: 'g(x)', nom: 'Polynôme générateur', desc: 'Polynôme par lequel on divise les données pour calculer le reste qu’est le CRC.', unite: '—', voir: '/reseaux/partie-ii/crc' },

  // Lien & adresses
  { katex: '\\text{MAC}', nom: 'Adresse MAC', desc: 'Adresse matérielle de couche liaison, 48 bits, locale au lien.', unite: 'bit', valeur: '48 bits (norme IEEE 802)', voir: '/reseaux/partie-iii/mac-ethernet' },
  { katex: '\\text{MTU}', nom: 'Unité de transmission maximale', desc: 'Taille maximale de charge utile d’une trame ; au-delà, il faut fragmenter.', unite: 'octet', valeur: '1500 octets sur Ethernet (convention courante)', voir: '/reseaux/partie-iii/mac-ethernet' },

  // IP & routage
  { katex: '\\text{IP}', nom: 'Adresse IP', desc: 'Adresse logique hiérarchique identifiant une interface sur l’interréseau.', unite: 'bit', valeur: '32 bits en IPv4 (norme)', voir: '/reseaux/partie-iv/adressage-ip' },
  { katex: '/n', nom: 'Longueur de préfixe (CIDR)', desc: 'Nombre de bits de poids fort fixant le réseau ; le masque vaut n bits à 1 suivis de 32−n bits à 0.', unite: 'bit', voir: '/reseaux/partie-iv/sous-reseaux' },
  { katex: '2^{32-n}', nom: 'Taille d’un sous-réseau', desc: 'Nombre d’adresses d’un bloc /n (dont 2 réservées : réseau et broadcast).', unite: '—', voir: '/reseaux/partie-iv/sous-reseaux' },
  { katex: '\\text{IP} \\wedge \\text{masque}', nom: 'Préfixe réseau', desc: 'Adresse de réseau obtenue par ET binaire entre l’adresse et le masque.', unite: '—', voir: '/reseaux/partie-iv/sous-reseaux' },

  // Transport
  { katex: '\\text{port}', nom: 'Numéro de port', desc: 'Identifiant d’application sur une machine ; forme avec les IP le quadruplet d’une connexion.', unite: 'bit', valeur: '16 bits (0–65535, norme)', voir: '/reseaux/partie-v/ports-multiplexage' },
  { katex: '\\text{seq},\\ \\text{ack}', nom: 'Numéros de séquence et d’acquittement', desc: 'Numéros TCP qui ordonnent les octets et confirment leur réception.', unite: '—', voir: '/reseaux/partie-v/tcp-connexion' },
  { katex: '\\text{RTT}', nom: 'Temps d’aller-retour', desc: 'Délai entre l’envoi d’un segment et la réception de son acquittement ; base du calcul des délais de retransmission.', unite: 's', valeur: 'ordre du ms à la centaine de ms (déploiement)', voir: '/reseaux/partie-v/tcp-connexion' },
  { katex: '\\text{cwnd}', nom: 'Fenêtre de congestion', desc: 'Quantité de données non acquittées que TCP s’autorise à envoyer ; varie en slow start puis en AIMD.', unite: 'octet', voir: '/reseaux/partie-v/tcp-flux-congestion' },
  { katex: '\\text{rwnd}', nom: 'Fenêtre de réception', desc: 'Quantité de données que le récepteur déclare pouvoir accepter ; sert au contrôle de flux.', unite: 'octet', voir: '/reseaux/partie-v/tcp-flux-congestion' },

  // Services
  { katex: '\\text{TTL}', nom: 'Durée de vie', desc: 'Nombre de sauts restants d’un paquet IP (évite les boucles), ou durée de validité d’un enregistrement DNS en cache.', unite: '— (ou s)', voir: '/reseaux/partie-vi/dns' },
];
