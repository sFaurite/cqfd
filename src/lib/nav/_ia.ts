/**
 * Navigation du cours « L'IA moderne, de zéro » — SOURCE UNIQUE de l'ordre.
 * Chemins NON préfixés : `index.ts` les préfixe par `/ia`.
 */
import type { Partie } from './_maths';

export const PARTIES: Partie[] = [
  {
    id: 'introduction',
    roman: '0',
    titre: 'Introduction',
    accroche: 'Comment lire ce cours, et ce que signifient les encarts et les badges de fiabilité.',
    chapitres: [
      { slug: 'comment-lire', path: '/comment-lire', num: 0, titre: 'Comment lire ce cours', court: 'Comment lire ce cours', accroche: 'Les encarts dépliables, l’échelle de fiabilité de l’apprentissage profond, la promesse exacte.' },
      { slug: 'methodologie', path: '/methodologie', num: 0, titre: 'Méthodologie : les quatre niveaux de fiabilité', court: 'Méthodologie', accroche: 'Ce que veut dire « démontré », « empiriquement robuste », « recette » et « boîte noire ».' },
    ],
  },
  {
    id: 'partie-i',
    roman: 'I',
    titre: 'Le neurone et l’idée d’ajuster',
    accroche: 'La brique de base : une somme pondérée et un seuil. Comment l’ajuster pour prédire, puis pour classer.',
    chapitres: [
      { slug: 'neurone-formel', path: '/partie-i/neurone-formel', num: 1, titre: 'Le neurone formel : une somme pondérée et un seuil', court: 'Le neurone formel', accroche: 'Des poids, un biais, une activation : un neurone est un hyperplan qui sépare l’espace en deux.' },
      { slug: 'regression-lineaire', path: '/partie-i/regression-lineaire', num: 2, titre: 'La régression linéaire : le premier ajustement', court: 'Régression linéaire', accroche: 'Tracer la « meilleure » droite à travers des points : le premier modèle qu’on apprend à régler.' },
      { slug: 'regression-logistique', path: '/partie-i/regression-logistique', num: 3, titre: 'Classer : la régression logistique et la sigmoïde', court: 'Régression logistique', accroche: 'Écraser la somme pondérée entre 0 et 1 pour lire une probabilité : le pas du calcul vers la décision.' },
    ],
  },
  {
    id: 'partie-ii',
    roman: 'II',
    titre: 'Apprendre, c’est descendre une pente',
    accroche: 'Mesurer l’erreur, puis la réduire en suivant le gradient. Le moteur de tout l’apprentissage.',
    chapitres: [
      { slug: 'fonction-de-perte', path: '/partie-ii/fonction-de-perte', num: 4, titre: 'La fonction de perte : mesurer pour corriger', court: 'Fonction de perte', accroche: 'Un seul nombre qui dit « à quel point on se trompe » : apprendre, c’est le faire baisser.' },
      { slug: 'derivees-gradient', path: '/partie-ii/derivees-gradient', num: 5, titre: 'Dérivées et gradient : la direction qui descend', court: 'Dérivées & gradient', accroche: 'La dérivée donne la pente ; le gradient, la direction de plus forte montée. On ira à l’opposé.' },
      { slug: 'descente-de-gradient', path: '/partie-ii/descente-de-gradient', num: 6, titre: 'La descente de gradient et le pas d’apprentissage', court: 'Descente de gradient', accroche: 'Avancer à petits pas dans le sens de la pente : converger, osciller ou diverger selon le pas.' },
      { slug: 'graphe-de-calcul', path: '/partie-ii/graphe-de-calcul', num: 7, titre: 'Le graphe de calcul et la règle de la chaîne', court: 'Graphe de calcul', accroche: 'Toute formule est un graphe d’opérations ; dériver une composition, c’est multiplier le long des arêtes.' },
      { slug: 'retropropagation', path: '/partie-ii/retropropagation', num: 8, titre: 'La rétropropagation : dériver tout le réseau efficacement', court: 'Rétropropagation', accroche: 'Remonter le graphe une seule fois pour obtenir toutes les dérivées : la règle de la chaîne, organisée.' },
    ],
  },
  {
    id: 'partie-iii',
    roman: 'III',
    titre: 'Le réseau profond',
    accroche: 'Empiler des neurones et des non-linéarités, comprendre pourquoi ça marche, et le faire tenir en pratique.',
    chapitres: [
      { slug: 'perceptron-multicouche', path: '/partie-iii/perceptron-multicouche', num: 9, titre: 'Le perceptron multicouche : empiler des neurones', court: 'Perceptron multicouche', accroche: 'Des couches successives de neurones : une couche cachée débloque des frontières de décision courbes.' },
      { slug: 'non-linearites', path: '/partie-iii/non-linearites', num: 10, titre: 'Les non-linéarités : pourquoi et lesquelles', court: 'Non-linéarités', accroche: 'Sans fonction d’activation, empiler reste linéaire. ReLU, sigmoïde, tanh : le choix qui débloque la profondeur.' },
      { slug: 'approximation-universelle', path: '/partie-iii/approximation-universelle', num: 11, titre: 'Le théorème d’approximation universelle', court: 'Approximation universelle', accroche: 'Un réseau peut approcher n’importe quelle fonction continue — mais existence n’est pas apprenabilité.' },
      { slug: 'optimiseurs-sgd-adam', path: '/partie-iii/optimiseurs-sgd-adam', num: 12, titre: 'Optimiser en pratique : SGD, momentum, Adam', court: 'Optimiseurs (SGD, Adam)', accroche: 'Mini-lots, inertie, pas adaptatif : les recettes qui font converger la descente sur des paysages non convexes.' },
      { slug: 'regularisation-overfitting', path: '/partie-iii/regularisation-overfitting', num: 13, titre: 'Surapprentissage et régularisation', court: 'Régularisation', accroche: 'Coller au bruit des données plutôt qu’à leur loi : repérer le surapprentissage et le combattre.' },
    ],
  },
  {
    id: 'partie-iv',
    roman: 'IV',
    titre: 'Voir et représenter',
    accroche: 'Exploiter la structure des données : la convolution pour les images, les plongements pour le sens.',
    chapitres: [
      { slug: 'convolution', path: '/partie-iv/convolution', num: 14, titre: 'La convolution : exploiter la structure de l’image', court: 'Convolution', accroche: 'Un même petit filtre glissé partout : localité et partage de poids détectent des motifs à moindre coût.' },
      { slug: 'reseaux-convolutifs', path: '/partie-iv/reseaux-convolutifs', num: 15, titre: 'Les réseaux convolutifs : du pixel à la catégorie', court: 'Réseaux convolutifs', accroche: 'Empiler convolutions et sous-échantillonnages : des bords aux objets, une hiérarchie de représentations.' },
      { slug: 'plongements', path: '/partie-iv/plongements', num: 16, titre: 'Les plongements : transformer le sens en géométrie', court: 'Plongements', accroche: 'Représenter mots et objets par des vecteurs où la proximité géométrique encode la proximité de sens.' },
    ],
  },
  {
    id: 'partie-v',
    roman: 'V',
    titre: 'L’attention et le transformer',
    accroche: 'Des séquences à l’attention : chercher l’information par son contenu, et le bloc qui a tout changé.',
    chapitres: [
      { slug: 'sequences-limite-rnn', path: '/partie-v/sequences-limite-rnn', num: 17, titre: 'Les séquences et la limite des modèles récurrents', court: 'Séquences & RNN', accroche: 'Traiter du texte pas à pas : pourquoi la mémoire récurrente s’essouffle sur les longues dépendances.' },
      { slug: 'mecanisme-attention', path: '/partie-v/mecanisme-attention', num: 18, titre: 'Le mécanisme d’attention : chercher par contenu', court: 'Mécanisme d’attention', accroche: 'Requêtes, clés, valeurs : chaque position va puiser l’information utile partout dans la séquence.' },
      { slug: 'transformer', path: '/partie-v/transformer', num: 19, titre: 'Le transformer : un bloc empilable', court: 'Transformer', accroche: 'Attention multi-têtes, résidus, normalisation : un bloc que l’on empile pour traiter le texte en parallèle.' },
    ],
  },
  {
    id: 'partie-vi',
    roman: 'VI',
    titre: 'Les grands modèles de langage',
    accroche: 'Du texte brut à l’assistant : tokeniser, pré-entraîner, générer, passer à l’échelle, puis aligner.',
    chapitres: [
      { slug: 'tokenisation', path: '/partie-vi/tokenisation', num: 20, titre: 'Tokenisation : découper le texte en unités', court: 'Tokenisation', accroche: 'Découper le texte en sous-mots : le vocabulaire que le modèle voit réellement, et ses cas révélateurs.' },
      { slug: 'pre-entrainement', path: '/partie-vi/pre-entrainement', num: 21, titre: 'Le pré-entraînement : prédire le mot suivant', court: 'Pré-entraînement', accroche: 'Une tâche unique et bête — prédire le token suivant — qui suffit à faire émerger des capacités.' },
      { slug: 'generation-decodage', path: '/partie-vi/generation-decodage', num: 22, titre: 'Générer du texte : décodage et température', court: 'Génération & décodage', accroche: 'D’une distribution de probabilités à une phrase : échantillonnage, température, top-k, faisceau.' },
      { slug: 'lois-echelle', path: '/partie-vi/lois-echelle', num: 23, titre: 'Les lois d’échelle : plus grand, plus capable', court: 'Lois d’échelle', accroche: 'La perte décroît en loi de puissance avec la taille, les données, le calcul. Empirique, pas théorique.' },
      { slug: 'alignement', path: '/partie-vi/alignement', num: 24, titre: 'L’alignement : du prédicteur de texte à l’assistant', court: 'Alignement', accroche: 'Affiner et aligner le modèle (instruction, préférences humaines) pour qu’il aide plutôt qu’il complète.' },
    ],
  },
  {
    id: 'annexes',
    roman: '★',
    titre: 'Annexes',
    accroche: 'Glossaire des termes et index des symboles.',
    chapitres: [
      { slug: 'glossaire', path: '/glossaire', num: 0, titre: 'Glossaire', court: 'Glossaire', accroche: 'Tous les termes techniques, reliés à leur page.' },
      { slug: 'symboles', path: '/symboles', num: 0, titre: 'Index des symboles', court: 'Index des symboles', accroche: 'Chaque symbole et notation, avec son rôle et son statut.' },
    ],
  },
];
