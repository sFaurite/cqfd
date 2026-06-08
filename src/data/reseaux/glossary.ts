/**
 * Glossaire du cours « Les réseaux depuis le bit ».
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
  // Partie I — information & signal
  { terme: 'Bit', def: 'Unité d’information : la quantité nécessaire pour lever l’incertitude entre <strong>deux</strong> possibilités également probables. La brique de tout le cours.', voir: '/reseaux/partie-i/bit-information', alias: ['binary digit', 'information'] },
  { terme: 'Bande passante', def: 'Largeur de la plage de fréquences que le canal laisse passer, notée <strong>B</strong> (en Hz). Elle borne le nombre de symboles transmissibles par seconde.', voir: '/reseaux/partie-i/signal-bande-passante', alias: ['B', 'bande', 'fréquence'] },
  { terme: 'Théorème de Nyquist', def: 'Sur un canal de bande passante B sans bruit, on ne peut transmettre au plus que <strong>2B symboles par seconde</strong>. Une borne sur le débit de symboles (la rapidité de modulation).', voir: '/reseaux/partie-i/nyquist', alias: ['Nyquist', 'débit symbole', 'rapidité de modulation'] },
  { terme: 'Théorème de Shannon', def: 'La capacité maximale d’un canal bruité vaut <strong>C = B·log₂(1+S/N)</strong> bits/s. Aucun codage ne permet de la dépasser : c’est la limite physique infranchissable.', voir: '/reseaux/partie-i/bruit-shannon', alias: ['Shannon', 'capacité', 'capacité de canal'] },
  { terme: 'Rapport signal/bruit', def: 'Rapport entre la puissance du signal et celle du bruit, noté <strong>S/N</strong>, souvent exprimé en décibels (dB). Plus il est élevé, plus on peut distinguer de symboles.', voir: '/reseaux/partie-i/bruit-shannon', alias: ['S/N', 'SNR', 'décibel', 'dB', 'bruit'] },

  // Partie II — du signal à la trame
  { terme: 'Codage de ligne', def: 'Façon de représenter les bits 0 et 1 par des niveaux ou transitions de tension sur le support (NRZ, Manchester…), de sorte que le récepteur puisse récupérer l’horloge.', voir: '/reseaux/partie-ii/codage-ligne', alias: ['NRZ', 'Manchester', 'codage'] },
  { terme: 'Modulation', def: 'Procédé qui porte les bits sur une <em>onde porteuse</em> en faisant varier son amplitude, sa fréquence ou sa phase. Une constellation (QAM) transporte plusieurs bits par symbole.', voir: '/reseaux/partie-ii/modulation', alias: ['QAM', 'QPSK', 'constellation', 'porteuse', 'symbole'] },
  { terme: 'Trame', def: 'Bloc de bits délimité, unité de transmission de la couche liaison. Elle encadre les données utiles par des champs d’adresse, de contrôle et de détection d’erreurs.', voir: '/reseaux/partie-ii/trame-parite', alias: ['frame', 'délimiteur'] },
  { terme: 'Bit de parité', def: 'Bit ajouté pour rendre pair (ou impair) le nombre de 1 d’un mot. Détecte toute erreur portant sur un <strong>nombre impair</strong> de bits, mais ne la corrige pas.', voir: '/reseaux/partie-ii/trame-parite', alias: ['parité', 'détection d’erreur'] },
  { terme: 'CRC', def: 'Contrôle de redondance cyclique : reste d’une division polynomiale des données par un polynôme générateur. Détecte la quasi-totalité des erreurs en rafale réelles.', voir: '/reseaux/partie-ii/crc', alias: ['contrôle de redondance cyclique', 'polynôme générateur', 'FCS'] },

  // Partie III — lien & accès au médium
  { terme: 'Adresse MAC', def: 'Identifiant matériel de 48 bits, en principe unique, gravé dans chaque carte réseau. Adresse de la couche liaison, locale au lien.', voir: '/reseaux/partie-iii/mac-ethernet', alias: ['MAC', 'adresse physique'] },
  { terme: 'Ethernet', def: 'Famille de normes (IEEE 802.3) dominant les réseaux locaux : un format de trame, des adresses MAC et des règles d’accès au médium.', voir: '/reseaux/partie-iii/mac-ethernet', alias: ['802.3', 'réseau local', 'LAN'] },
  { terme: 'CSMA/CD', def: 'Méthode d’accès « écouter avant de parler, détecter les collisions » : si deux machines émettent ensemble sur un médium partagé, elles détectent le choc et réessaient après un délai aléatoire.', voir: '/reseaux/partie-iii/acces-medium', alias: ['collision', 'accès au médium', 'backoff'] },
  { terme: 'Commutateur', def: 'Équipement qui apprend sur quel port se trouve chaque adresse MAC et n’y achemine que les trames destinées : il remplace le médium partagé par un réseau commuté sans collisions.', voir: '/reseaux/partie-iii/commutation', alias: ['switch', 'commutation', 'table de commutation'] },

  // Partie IV — du lien au réseau : IP
  { terme: 'Adresse IP', def: 'Adresse logique hiérarchique (32 bits en IPv4) qui identifie une interface sur l’interréseau. Découpée en une partie <strong>réseau</strong> et une partie <strong>hôte</strong>.', voir: '/reseaux/partie-iv/adressage-ip', alias: ['IP', 'IPv4', 'adresse logique'] },
  { terme: 'Masque de sous-réseau', def: 'Suite de bits à 1 puis à 0 qui sépare, par un <strong>ET binaire</strong>, le préfixe réseau de la partie hôte d’une adresse IP. Noté en notation CIDR /n.', voir: '/reseaux/partie-iv/sous-reseaux', alias: ['masque', 'sous-réseau', 'préfixe'] },
  { terme: 'CIDR', def: 'Classless Inter-Domain Routing : notation /n indiquant la longueur du préfixe réseau, qui permet de découper l’espace d’adresses en blocs de taille arbitraire.', voir: '/reseaux/partie-iv/sous-reseaux', alias: ['notation CIDR', 'classless'] },
  { terme: 'Routage', def: 'Acheminement d’un paquet de proche en proche jusqu’à sa destination, en consultant à chaque routeur une table de préfixes pour choisir le prochain saut.', voir: '/reseaux/partie-iv/routage', alias: ['routeur', 'next hop', 'prochain saut', 'table de routage'] },
  { terme: 'Longest prefix match', def: 'Règle de sélection de route : parmi tous les préfixes de la table qui contiennent l’adresse destination, on retient le <strong>plus long</strong> (le plus spécifique).', voir: '/reseaux/partie-iv/routage', alias: ['plus long préfixe', 'route par défaut'] },

  // Partie V — transport
  { terme: 'Port', def: 'Numéro de 16 bits qui identifie une application au sein d’une machine. Avec les adresses IP, il forme le quadruplet qui désigne une conversation.', voir: '/reseaux/partie-v/ports-multiplexage', alias: ['numéro de port', 'multiplexage', 'socket'] },
  { terme: 'UDP', def: 'Protocole de transport minimal : ports et somme de contrôle, sans connexion ni garantie de livraison ou d’ordre. Léger, adapté à la voix, au jeu, au DNS.', voir: '/reseaux/partie-v/udp', alias: ['datagramme', 'sans connexion'] },
  { terme: 'TCP', def: 'Protocole de transport <strong>fiable</strong> et orienté connexion : numéros de séquence, acquittements et retransmissions garantissent un flux d’octets ordonné et complet.', voir: '/reseaux/partie-v/tcp-connexion', alias: ['fiable', 'orienté connexion', 'flux'] },
  { terme: 'Three-way handshake', def: 'Ouverture d’une connexion TCP en trois messages — SYN, SYN-ACK, ACK — qui synchronisent les numéros de séquence des deux extrémités.', voir: '/reseaux/partie-v/tcp-connexion', alias: ['handshake', 'SYN', 'ACK', 'numéro de séquence'] },
  { terme: 'Contrôle de congestion', def: 'Mécanisme adaptatif de TCP qui ajuste la <em>fenêtre de congestion</em> (slow start, AIMD) pour utiliser le réseau sans le saturer. Heuristique, pas théorème.', voir: '/reseaux/partie-v/tcp-flux-congestion', alias: ['cwnd', 'slow start', 'AIMD', 'congestion', 'contrôle de flux'] },

  // Partie VI — services & ouverture
  { terme: 'DNS', def: 'Domain Name System : annuaire mondial, distribué et hiérarchique, qui traduit un nom de domaine (exemple.fr) en adresse IP.', voir: '/reseaux/partie-vi/dns', alias: ['nom de domaine', 'résolution', 'serveur racine', 'résolveur'] },
  { terme: 'HTTP', def: 'HyperText Transfer Protocol : protocole requête/réponse du web, fondé sur des méthodes (GET, POST…) et des codes de statut, transporté sur TCP.', voir: '/reseaux/partie-vi/http-web', alias: ['web', 'requête', 'réponse', 'méthode', 'code de statut'] },
  { terme: 'TLS', def: 'Transport Layer Security : couche qui chiffre et authentifie une connexion (HTTPS). Échange de clés, certificats et chiffrement assurent confidentialité, intégrité et identité.', voir: '/reseaux/partie-vi/tls-securite', alias: ['HTTPS', 'chiffrement', 'certificat', 'authentification', 'SSL'] },
  { terme: 'Qualité de service', def: 'Ensemble des garanties sur la latence, la gigue, le débit et les pertes qu’un réseau peut offrir à un trafic, via files d’attente et priorités. Souvent dépendante du déploiement.', voir: '/reseaux/partie-vi/qos-ouverture', alias: ['QoS', 'latence', 'gigue', 'jitter', 'neutralité'] },
];
