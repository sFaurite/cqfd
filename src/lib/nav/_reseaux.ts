/**
 * Navigation du cours « Les réseaux depuis le bit » — SOURCE UNIQUE de l'ordre.
 * Chemins NON préfixés : `index.ts` les préfixe par `/reseaux`.
 */
import type { Partie } from './_maths';

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce cours, et ce que signifient les encarts et les badges de fiabilité.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce cours', court: 'Comment lire ce cours', accroche: 'Les encarts dépliables, l’échelle de fiabilité réseaux, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les quatre niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « théorème », « norme », « heuristique » et « déploiement ».' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'L’information et le signal',
    accroche: 'Le bit comme mesure d’information, le signal physique, et les deux théorèmes qui bornent tout débit : Nyquist et Shannon.',
    chapitres: [
      { slug: 'bit-information', path: '/partie-i/bit-information', num: 1, titre: 'Le bit : mesurer l’information', court: 'Le bit', accroche: 'Le point de départ : un bit, c’est le choix entre deux possibilités également probables. La mesure de l’information.' },
      { slug: 'signal-bande-passante', path: '/partie-i/signal-bande-passante', num: 2, titre: 'Signal, fréquences et bande passante', court: 'Signal & bande passante', accroche: 'Un signal se décompose en fréquences ; le canal n’en laisse passer qu’une plage : la bande passante B.' },
      { slug: 'nyquist', path: '/partie-i/nyquist', num: 3, titre: 'Le théorème de Nyquist : combien de symboles ?', court: 'Nyquist', accroche: 'Une bande passante B limite à 2B le nombre de symboles par seconde qu’on peut distinguer.' },
      { slug: 'bruit-shannon', path: '/partie-i/bruit-shannon', num: 4, titre: 'Le bruit et le théorème de Shannon', court: 'Bruit & Shannon', accroche: 'Le bruit borne le débit : C = B·log₂(1+S/N). La limite physique infranchissable d’un canal.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Du signal à la trame',
    accroche: 'Coder et moduler les bits sur un support, puis les regrouper en trames et détecter les erreurs de transmission.',
    chapitres: [
      { slug: 'codage-ligne', path: '/partie-ii/codage-ligne', num: 5, titre: 'Coder les bits sur un fil : le codage de ligne', court: 'Codage de ligne', accroche: 'NRZ, Manchester… : comment représenter 0 et 1 par des tensions, en gardant l’horloge récupérable.' },
      { slug: 'modulation', path: '/partie-ii/modulation', num: 6, titre: 'Moduler : porter les bits sur une onde', court: 'Modulation', accroche: 'Amplitude, phase, QAM : transporter plusieurs bits par symbole sur une porteuse. Le lien avec Nyquist et Shannon.' },
      { slug: 'trame-parite', path: '/partie-ii/trame-parite', num: 7, titre: 'La trame et la détection d’erreurs : la parité', court: 'Trame & parité', accroche: 'Délimiter les bits en trames, et le tout premier garde-fou : un bit de parité qui détecte une erreur isolée.' },
      { slug: 'crc', path: '/partie-ii/crc', num: 8, titre: 'Le CRC : détecter sérieusement les erreurs', court: 'CRC', accroche: 'Le contrôle de redondance cyclique : une division polynomiale qui attrape la quasi-totalité des erreurs réelles.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'Le lien et l’accès au médium',
    accroche: 'Adresser les machines sur un même lien, partager un médium commun, puis passer du médium partagé au réseau commuté.',
    chapitres: [
      { slug: 'mac-ethernet', path: '/partie-iii/mac-ethernet', num: 9, titre: 'Adresses MAC et trame Ethernet', court: 'MAC & Ethernet', accroche: 'Une adresse matérielle unique par carte, et le format de trame qui domine les réseaux locaux.' },
      { slug: 'acces-medium', path: '/partie-iii/acces-medium', num: 10, titre: 'Partager le médium : CSMA/CD et collisions', court: 'Accès au médium', accroche: 'Quand plusieurs machines parlent sur le même fil : écouter, détecter les collisions, et réessayer.' },
      { slug: 'commutation', path: '/partie-iii/commutation', num: 11, titre: 'Le commutateur : du médium partagé au réseau commuté', court: 'Commutation', accroche: 'Le switch apprend où est chaque MAC et n’envoie la trame qu’au bon port : fin des collisions.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Du lien au réseau : IP',
    accroche: 'Interconnecter des liens hétérogènes grâce à une adresse hiérarchique, des sous-réseaux et le routage.',
    chapitres: [
      { slug: 'adressage-ip', path: '/partie-iv/adressage-ip', num: 12, titre: 'L’adressage IP : une adresse hiérarchique', court: 'Adressage IP', accroche: 'Une adresse en deux parties — réseau et hôte — qui permet d’acheminer entre des liens différents.' },
      { slug: 'sous-reseaux', path: '/partie-iv/sous-reseaux', num: 13, titre: 'Masques et sous-réseaux (CIDR)', court: 'Sous-réseaux', accroche: 'Le masque sépare préfixe et hôte par un ET binaire ; CIDR découpe l’espace d’adresses à la demande.' },
      { slug: 'routage', path: '/partie-iv/routage', num: 14, titre: 'Le routage et le longest prefix match', court: 'Routage', accroche: 'Une table de préfixes et une règle : choisir la route la plus spécifique qui correspond à la destination.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'La couche transport',
    accroche: 'Des machines aux processus : ports, multiplexage, puis UDP minimal et TCP fiable avec son contrôle de flux et de congestion.',
    chapitres: [
      { slug: 'ports-multiplexage', path: '/partie-v/ports-multiplexage', num: 15, titre: 'Des machines aux processus : ports et multiplexage', court: 'Ports & multiplexage', accroche: 'Une adresse IP désigne une machine ; un port désigne l’application. Le quadruplet qui identifie une conversation.' },
      { slug: 'udp', path: '/partie-v/udp', num: 16, titre: 'UDP : le transport minimal', court: 'UDP', accroche: 'Juste des ports et une somme de contrôle : envoyer un datagramme, sans garantie de livraison ni d’ordre.' },
      { slug: 'tcp-connexion', path: '/partie-v/tcp-connexion', num: 17, titre: 'TCP : établir une connexion fiable', court: 'TCP : connexion', accroche: 'Numéros de séquence, acquittements et le three-way handshake : bâtir un flux ordonné et fiable sur un réseau qui perd.' },
      { slug: 'tcp-flux-congestion', path: '/partie-v/tcp-flux-congestion', num: 18, titre: 'TCP : contrôle de flux et de congestion', court: 'Flux & congestion', accroche: 'Fenêtre de réception, slow start, AIMD : adapter le débit pour ne noyer ni le récepteur ni le réseau.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Les services et l’ouverture',
    accroche: 'Au sommet : nommer les machines (DNS), servir le web (HTTP), le chiffrer et l’authentifier (TLS), et les enjeux de qualité de service.',
    chapitres: [
      { slug: 'dns', path: '/partie-vi/dns', num: 19, titre: 'Le DNS : des noms aux adresses', court: 'DNS', accroche: 'Un annuaire mondial, distribué et hiérarchique, qui traduit un nom de domaine en adresse IP.' },
      { slug: 'http-web', path: '/partie-vi/http-web', num: 20, titre: 'HTTP et le web', court: 'HTTP & web', accroche: 'Requêtes, réponses, méthodes et codes de statut : le protocole texte qui fait tourner le web sur TCP.' },
      { slug: 'tls-securite', path: '/partie-vi/tls-securite', num: 21, titre: 'TLS et la sécurité : chiffrer et authentifier', court: 'TLS & sécurité', accroche: 'Échange de clés, certificats et chiffrement : garantir confidentialité, intégrité et identité du serveur.' },
      { slug: 'qos-ouverture', path: '/partie-vi/qos-ouverture', num: 22, titre: 'Qualité de service et ouverture', court: 'QoS & ouverture', accroche: 'Latence, gigue, files d’attente, neutralité : ce que le réseau garantit (ou non), et les débats qui restent ouverts.' },
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
